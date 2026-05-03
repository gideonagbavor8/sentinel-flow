"use server"

import { requireAuth } from "@/lib/session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  const session = await requireAuth();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) throw new Error("Project name is required");

  await prisma.project.create({
    data: {
      name,
      description,
      userId: session.user.id
    }
  });

  // Keep a record in the audit log for security purposes
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: `Created new project: ${name}`,
      ipAddress: "N/A", // This could be extracted from headers if needed
      userAgent: "Server Action"
    }
  });

  // Revalidate the projects page to show the new project instantly
  revalidatePath("/dashboard/projects");
}
