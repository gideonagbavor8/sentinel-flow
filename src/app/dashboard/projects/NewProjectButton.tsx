"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { createProject } from "./actions";

export default function NewProjectButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createProject(formData);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to create project.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-theme-dark hover:bg-theme-black text-theme-white rounded-xl font-medium transition-all shadow-lg shadow-theme-light/50"
      >
        <Plus className="w-5 h-5" />
        New Project
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-theme-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-theme-white border border-theme-light rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-theme-light">
              <h2 className="text-xl font-bold text-theme-black">Create New Project</h2>
              <button onClick={() => setIsOpen(false)} className="text-theme-mid hover:text-theme-dark transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-theme-dark mb-1.5">Project Name</label>
                <input 
                  name="name"
                  type="text" 
                  required
                  placeholder="e.g. Q3 Financial Reports"
                  className="w-full bg-theme-white border border-theme-light rounded-xl px-4 py-2.5 text-theme-black placeholder-theme-light focus:outline-none focus:ring-2 focus:ring-theme-mid focus:border-theme-dark transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-dark mb-1.5">Description (Optional)</label>
                <textarea 
                  name="description"
                  rows={3}
                  placeholder="Briefly describe the purpose of this project..."
                  className="w-full bg-theme-white border border-theme-light rounded-xl px-4 py-2.5 text-theme-black placeholder-theme-light focus:outline-none focus:ring-2 focus:ring-theme-mid focus:border-theme-dark transition-all resize-none"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-theme-light text-theme-dark hover:bg-theme-light/30 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-theme-dark hover:bg-theme-black text-theme-white transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
