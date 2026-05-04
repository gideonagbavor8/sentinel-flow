"use server";

import { requireAuth } from "@/lib/session";
import  prisma  from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function uploadFile(projectId: string, formData: FormData) {
  const session = await requireAuth();
  
  // Verify that the user owns this project before allowing upload
  const project = await prisma.project.findUnique({
    where: { id: projectId, userId: session.user.id }
  });
  
  if (!project) {
    throw new Error("Unauthorized to upload to this project.");
  }

  const file = formData.get("file") as File;
  if (!file || file.size === 0) {
    throw new Error("No valid file uploaded.");
  }

  // Convert File to Buffer to ensure compatibility with Node.js fetch
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Create a highly unique, secure path in the bucket
  const s3Key = `${session.user.id}/${projectId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;

  // Upload the file directly to Supabase Storage using the Service Role Key
  const { data, error } = await supabaseAdmin
    .storage
    .from("sentinel")
    .upload(s3Key, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Storage upload error:", error);
    throw new Error(`Failed to upload file to the secure vault: ${error.message || JSON.stringify(error)}`);
  }

  // Store the file metadata and encryption type in the database
  await prisma.file.create({
    data: {
      s3Key: data.path,
      fileName: file.name,
      encryptionType: "SUPABASE_AES256",
      projectId: projectId
    }
  });

  // Log the security event
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: `Securely uploaded file: ${file.name} to project: ${project.name}`,
      ipAddress: "N/A", 
      userAgent: "Server Action"
    }
  });

  // Revalidate the page so the new file shows up instantly
  revalidatePath(`/dashboard/projects/${projectId}`);
}
