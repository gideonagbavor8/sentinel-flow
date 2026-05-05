"use client";

import { useState } from "react";
import { Download, Trash2, Loader2 } from "lucide-react";
import { getDownloadUrl, deleteFile } from "./actions";

export default function FileActions({ fileId }: { fileId: string }) {
  const [loading, setLoading] = useState<"download" | "delete" | null>(null);

  async function handleDownload() {
    setLoading("download");
    try {
      const url = await getDownloadUrl(fileId);
      // Open in a new tab to trigger download/preview
      window.open(url, "_blank");
    } catch (error: any) {
      alert(error.message || "Failed to retrieve file.");
    } finally {
      setLoading(null);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to permanently delete this file from the secure vault?")) return;
    
    setLoading("delete");
    try {
      await deleteFile(fileId);
    } catch (error: any) {
      alert(error.message || "Failed to delete file.");
      setLoading(null);
    }
  }

  return (
    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-theme-light">
      <button
        onClick={handleDownload}
        disabled={!!loading}
        className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold bg-theme-light/50 hover:bg-theme-mid/20 text-theme-dark rounded-lg transition-colors disabled:opacity-50"
      >
        {loading === "download" ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Download className="w-3.5 h-3.5" />
        )}
        Secure Download
      </button>
      <button
        onClick={handleDelete}
        disabled={!!loading}
        className="p-2 text-theme-mid hover:text-theme-black hover:bg-theme-light/50 rounded-lg transition-all disabled:opacity-50"
        title="Delete file"
      >
        {loading === "delete" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
