import { requireAuth } from "@/lib/session";
import prisma from "@/lib/prisma";
import NewProjectButton from "./NewProjectButton";
import Link from "next/link";
import { FolderGit2, Calendar, FileText } from "lucide-react";

export default async function ProjectsPage() {
  const session = await requireAuth();

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { files: true } } }
  });

  return (
    <div className="space-y-8 p-8 min-h-screen bg-[var(--background)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-theme-black tracking-tight">Projects</h1>
          <p className="text-theme-dark mt-1">Manage your secure workspaces and folders.</p>
        </div>
        <NewProjectButton />
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-theme-white border border-dashed border-theme-light rounded-3xl mt-8">
          <div className="p-4 bg-theme-light/30 rounded-2xl mb-4">
            <FolderGit2 className="w-12 h-12 text-theme-dark" />
          </div>
          <h3 className="text-xl font-semibold text-theme-black">No projects yet</h3>
          <p className="text-theme-mid mt-2 mb-6 text-center max-w-md">
            Projects act as secure containers for your encrypted files. Create your first project to start uploading.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
          {projects.map((project) => (
            <Link href={`/dashboard/projects/${project.id}`} key={project.id}>
              <div className="group flex flex-col h-full p-6 rounded-2xl bg-theme-white border border-theme-light hover:bg-theme-light/10 hover:border-theme-dark hover:shadow-[0_0_15px_rgba(64,64,64,0.1)] transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-theme-light/30 text-theme-dark group-hover:bg-theme-dark group-hover:text-theme-white transition-colors">
                    <FolderGit2 className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-theme-black mb-2 line-clamp-1">{project.name}</h3>
                <p className="text-sm text-theme-mid line-clamp-2 mb-6 flex-1">
                  {project.description || "No description provided."}
                </p>
                <div className="flex items-center justify-between text-xs font-medium text-theme-mid border-t border-theme-light pt-4 mt-auto">
                  <div className="flex items-center gap-1.5 bg-theme-light/20 px-2 py-1 rounded-md">
                    <FileText className="w-3.5 h-3.5 text-theme-dark" />
                    <span className="text-theme-dark">{project._count.files} Files</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
