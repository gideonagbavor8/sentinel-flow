"use server";

import { requireAuth } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function uploadFile(projectId: string, formData: FormData) {
  const session = await requireAuth();
  
  // Verify that the user owns this project before allowing upload
  const { data: project, error: projectError } = await supabaseAdmin
    .from('Project')
    .select('*')
    .eq('id', projectId)
    .eq('userId', session.user.id)
    .single();
  
  if (projectError || !project) {
    throw new Error("Unauthorized to upload to this project.");
  }

  const file = formData.get("file") as File;
  if (!file || file.size === 0) {
    throw new Error("No valid file uploaded.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const s3Key = `${session.user.id}/${projectId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;

  const { data: storageData, error: storageError } = await supabaseAdmin
    .storage
    .from("sentinel")
    .upload(s3Key, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (storageError) {
    console.error("Storage upload error:", storageError);
    throw new Error(`Failed to upload file to the secure vault: ${storageError.message}`);
  }

  // Store the file metadata in the database using HTTPS Data API
  const { error: dbError } = await supabaseAdmin
    .from('File')
    .insert({
      s3Key: storageData.path,
      fileName: file.name,
      encryptionType: "SUPABASE_AES256",
      projectId: projectId
    });

  if (dbError) {
    console.error("DB Insert error:", dbError);
    // Cleanup storage if DB fails
    await supabaseAdmin.storage.from("sentinel").remove([storageData.path]);
    throw new Error("Failed to register file in the secure database.");
  }

  // Log the security event
  await supabaseAdmin.from('AuditLog').insert({
    userId: session.user.id,
    action: `Securely uploaded file: ${file.name} to project: ${project.name}`,
    ipAddress: "N/A", 
    userAgent: "Server Action"
  });

  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function getDownloadUrl(fileId: string) {
  const session = await requireAuth();

  // Fetch file with its project to check ownership
  const { data: file, error: fileError } = await supabaseAdmin
    .from('File')
    .select('*, Project!inner(*)')
    .eq('id', fileId)
    .eq('Project.userId', session.user.id)
    .single();

  if (fileError || !file) {
    throw new Error("Unauthorized to access this file.");
  }

  const { data, error: signedUrlError } = await supabaseAdmin
    .storage
    .from("sentinel")
    .createSignedUrl(file.s3Key, 60);

  if (signedUrlError) {
    console.error("Signed URL error:", signedUrlError);
    throw new Error("Failed to generate secure access link.");
  }

  // Log the access
  await supabaseAdmin.from('AuditLog').insert({
    userId: session.user.id,
    action: `Accessed/Downloaded file: ${file.fileName}`,
    ipAddress: "N/A",
    userAgent: "Server Action"
  });

  return data.signedUrl;
}

export async function deleteFile(fileId: string) {
  const session = await requireAuth();

  const { data: file, error: fileError } = await supabaseAdmin
    .from('File')
    .select('*, Project!inner(*)')
    .eq('id', fileId)
    .eq('Project.userId', session.user.id)
    .single();

  if (fileError || !file) {
    throw new Error("Unauthorized to delete this file.");
  }

  const { error: storageError } = await supabaseAdmin
    .storage
    .from("sentinel")
    .remove([file.s3Key]);

  if (storageError) {
    console.error("Storage deletion error:", storageError);
    throw new Error("Failed to remove file from vault storage.");
  }

  // Delete from database using HTTPS Data API
  const { error: dbDeleteError } = await supabaseAdmin
    .from('File')
    .delete()
    .eq('id', fileId);

  if (dbDeleteError) {
    console.error("DB Delete error:", dbDeleteError);
  }

  await supabaseAdmin.from('AuditLog').insert({
    userId: session.user.id,
    action: `Deleted file: ${file.fileName} from project: ${file.Project.name}`,
    ipAddress: "N/A",
    userAgent: "Server Action"
  });

  revalidatePath(`/dashboard/projects/${file.projectId}`);
}
