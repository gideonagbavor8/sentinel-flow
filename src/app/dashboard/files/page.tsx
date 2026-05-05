import { requireAuth } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase-server";
import Link from "next/link";
import { FileText, Calendar, FolderTree } from "lucide-react";
import FileActions from "../projects/[id]/FileActions";

export default async function AllFilesPage() {
  const session = await requireAuth();

  // Optimized fetching using Supabase Data API (HTTPS Port 443)
  // This fetches all files belonging to all projects owned by the user.
  const { data: files, error } = await supabaseAdmin
    .from('File')
    .select('*, Project!inner(*)')
    .eq('Project.userId', session.user.id)
    .order('uploadedAt', { ascending: false });

  if (error) {
    console.error("Error fetching files:", error);
  }

  return (
    <div className="space-y-8 p-8 min-h-screen bg-[var(--background)]">
      <div>
        <h1 className="text-3xl font-bold text-theme-black tracking-tight">My Files</h1>
        <p className="text-theme-dark mt-1">A consolidated view of all your secure files across all projects.</p>
      </div>

      {!files || files.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-theme-white border border-dashed border-theme-light rounded-3xl mt-8">
          <div className="p-4 bg-theme-light/30 rounded-2xl mb-4">
            <FileText className="w-12 h-12 text-theme-dark" />
          </div>
          <h3 className="text-xl font-semibold text-theme-black">No files found</h3>
          <p className="text-theme-mid mt-2 mb-6 text-center max-w-md">
            You haven't uploaded any files yet. Go to a project to start securing your data.
          </p>
          <Link href="/dashboard/projects" className="px-6 py-2.5 bg-theme-dark text-theme-white rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform">
            View Projects
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
          {files.map((file: any) => (
            <div key={file.id} className="group p-5 rounded-2xl bg-theme-white border border-theme-light hover:border-theme-dark hover:shadow-lg transition-all duration-300 flex flex-col">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="p-3 rounded-xl bg-theme-light/20 text-theme-dark group-hover:bg-theme-dark group-hover:text-theme-white transition-colors shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-semibold text-theme-black truncate">{file.fileName}</h4>
                  <p className="text-[10px] text-theme-mid mt-1 uppercase font-black tracking-widest bg-theme-light/30 px-1.5 py-0.5 rounded w-fit">
                    {file.encryptionType}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-theme-mid">
                  <FolderTree className="w-3.5 h-3.5" />
                  <span className="truncate">Project: <strong>{file.Project.name}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-theme-mid">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Uploaded {new Date(file.uploadedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <FileActions fileId={file.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
