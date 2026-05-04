import { requireAuth } from "@/lib/session";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, File as FileIcon, Calendar, Lock } from "lucide-react";
import UploadButton from "./UploadButton";

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { 
      id: id,
      userId: session.user.id 
    },
    include: {
      files: {
        orderBy: { uploadedAt: 'desc' }
      }
    }
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-8 p-8 min-h-screen bg-[var(--background)]">
      
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/dashboard/projects" 
          className="flex items-center gap-2 text-theme-mid hover:text-theme-dark transition-colors w-fit font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-theme-light pb-6">
          <div>
            <h1 className="text-3xl font-bold text-theme-black tracking-tight">{project.name}</h1>
            <p className="text-theme-dark mt-2 max-w-2xl">
              {project.description || "No description provided."}
            </p>
            <div className="flex items-center gap-4 mt-4 text-xs font-medium text-theme-mid">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Created {new Date(project.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5 bg-theme-light/20 px-2 py-1 rounded-md text-theme-dark">
                <Lock className="w-3.5 h-3.5" />
                End-to-End Encrypted
              </span>
            </div>
          </div>
          
          <UploadButton projectId={project.id} />
        </div>
      </div>

      {/* Files Section */}
      <div>
        <h2 className="text-xl font-bold text-theme-black mb-6">Project Files</h2>
        
        {project.files.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 bg-theme-white border border-dashed border-theme-light rounded-3xl">
            <div className="p-4 bg-theme-light/30 rounded-2xl mb-4">
              <FileIcon className="w-12 h-12 text-theme-dark" />
            </div>
            <h3 className="text-xl font-semibold text-theme-black">This project is empty</h3>
            <p className="text-theme-mid mt-2 mb-6 text-center max-w-md">
              Securely upload your files. All files uploaded to Sentinel Flow are automatically encrypted using AES-256 before storage.
            </p>
            <UploadButton projectId={project.id} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {project.files.map((file) => (
              <div key={file.id} className="group p-5 rounded-2xl bg-theme-white border border-theme-light hover:border-theme-dark hover:shadow-lg transition-all duration-300 flex items-center justify-between">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="p-3 rounded-xl bg-theme-light/20 text-theme-dark group-hover:bg-theme-dark group-hover:text-theme-white transition-colors shrink-0">
                    <FileIcon className="w-6 h-6" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-semibold text-theme-black truncate">{file.fileName}</h4>
                    <p className="text-xs text-theme-mid mt-1">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
