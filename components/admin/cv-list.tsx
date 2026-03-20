"use client";

import { useTransition, useState } from "react";
import { formatDate } from "@/lib/utils";
import { FileText, CheckCircle, Trash2, Loader2, Pencil, Check, X, Download } from "lucide-react";
import { setActiveCV, deleteCV, renameCV } from "@/app/actions/cv-actions";
import { useRouter } from "next/navigation";

interface CVListClientProps {
  cvs: {
    id: string;
    fileUrl: string;
    fileName: string;
    isActive: boolean;
    updatedAt: Date;
  }[];
}

export default function CVListClient({ cvs }: CVListClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleSetActive = (id: string) => {
    startTransition(async () => {
      await setActiveCV(id);
      router.refresh();
    });
  };

  const handleDelete = (id: string, fileUrl: string) => {
    if (confirm("Are you sure you want to delete this CV?")) {
      startTransition(async () => {
        await deleteCV(id, fileUrl);
        router.refresh();
      });
    }
  };

  const handleEditClick = (id: string, currentName: string) => {
    setEditingId(id);
    let nameWithoutExt = currentName;
    if (currentName.toLowerCase().endsWith(".pdf")) {
      nameWithoutExt = currentName.substring(0, currentName.length - 4);
    }
    setEditingName(nameWithoutExt);
  };

  const handleRenameSubmit = (id: string) => {
    if (!editingName.trim()) return;
    startTransition(async () => {
      await renameCV(id, editingName);
      setEditingId(null);
      router.refresh();
    });
  };

  if (cvs.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center flex flex-col items-center justify-center">
        <FileText className="h-10 w-10 text-slate-300 mb-3" />
        <p className="text-slate-500 text-sm">No CVs uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h3 className="text-base font-bold text-slate-800 mb-4">Uploaded CVs</h3>
      <div className="space-y-3">
        {cvs.map((cv) => (
          <div
            key={cv.id}
            className={`flex items-center justify-between p-4 rounded-xl border ${
              cv.isActive ? "border-green-200 bg-green-50/50" : "border-slate-100 bg-white hover:border-slate-200"
            } transition-colors gap-4`}
          >
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <FileText
                className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                  cv.isActive ? "text-green-600" : "text-slate-400"
                }`}
              />
              <div className="min-w-0 flex-1">
                {editingId === cv.id ? (
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="border border-slate-200 px-2 py-1 flex-1 text-[13px] rounded focus:outline-none focus:border-navy"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameSubmit(cv.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                    />
                    <button
                      onClick={() => handleRenameSubmit(cv.id)}
                      disabled={isPending}
                      className="text-green-600 hover:bg-green-100 p-1 rounded transition-colors"
                      title="Save"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      disabled={isPending}
                      className="text-slate-400 hover:bg-slate-100 p-1 rounded transition-colors"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-[13px] font-semibold truncate ${
                        cv.isActive ? "text-green-800" : "text-slate-700"
                      }`}
                    >
                      {cv.fileName}
                    </p>
                    <button 
                      onClick={() => handleEditClick(cv.id, cv.fileName)} 
                      disabled={isPending}
                      className="text-slate-300 hover:text-slate-500 transition-colors p-1"
                      title="Rename"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  </div>
                )}
                
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Uploaded on {formatDate(cv.updatedAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {cv.isActive ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-[10px] font-bold text-green-700 uppercase tracking-wider">
                  <CheckCircle className="h-3 w-3" /> Active
                </span>
              ) : (
                <button
                  onClick={() => handleSetActive(cv.id)}
                  disabled={isPending || editingId !== null}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-[12px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
                >
                  Set Active
                </button>
              )}
              
              <a
                href={`/api/cv/download/${cv.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-slate-400 hover:text-navy hover:bg-slate-50 transition-colors"
                title="Download CV"
              >
                <Download className="h-4 w-4" />
              </a>

              <button
                onClick={() => handleDelete(cv.id, cv.fileUrl)}
                disabled={isPending || cv.isActive || editingId !== null}
                className={`p-1.5 rounded-lg transition-colors ${
                  cv.isActive
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                }`}
                title={cv.isActive ? "Cannot delete active CV" : "Delete CV"}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
