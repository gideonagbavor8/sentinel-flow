"use server"

import { requireAuth } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  const session = await requireAuth();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) throw new Error("Project name is required");

  // Create project using Supabase Data API (HTTPS Port 443)
  const { error: projectError } = await supabaseAdmin
    .from('Project')
    .insert({
      name,
      description,
      userId: session.user.id
    });

  if (projectError) {
    console.error("Project creation error:", projectError);
    throw new Error("Failed to create the new secure workspace.");
  }

  // Keep a record in the audit log for security purposes
  await supabaseAdmin.from('AuditLog').insert({
    userId: session.user.id,
    action: `Created new project: ${name}`,
    ipAddress: "N/A", 
    userAgent: "Server Action"
  });

  // Revalidate the projects page to show the new project instantly
  revalidatePath("/dashboard/projects");
}
