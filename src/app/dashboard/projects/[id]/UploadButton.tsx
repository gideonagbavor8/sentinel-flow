"use client";

import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { uploadFile } from "./actions";

export default function UploadButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      // Call the server action securely
      await uploadFile(projectId, formData);
      
      // Reset input so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to upload file. Ensure the bucket is created correctly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-theme-dark hover:bg-theme-black text-theme-white rounded-xl font-semibold transition-all shadow-lg shadow-theme-light/50 shrink-0 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Upload className="w-5 h-5" />
        )}
        {loading ? 'Uploading...' : 'Upload File'}
      </button>
    </>
  );
}
