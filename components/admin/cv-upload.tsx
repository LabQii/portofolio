"use client";

import { useState, useTransition, useRef } from "react";
import { uploadCV } from "@/app/actions/cv-actions";
import { Upload, FileText, CheckCircle, Loader2, AlertCircle, Download } from "lucide-react";

export default function CVUploadClient({ currentCV }: { currentCV: { fileUrl: string; fileName: string; updatedAt: Date } | null }) {
  const [isPending, startTransition] = useTransition();
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".pdf")) {
      setResult({ success: false, error: "Only PDF files are accepted." });
      return;
    }
    setSelectedFile(file);
    setResult(null);
  };

  const handleSubmit = () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("cv", selectedFile);
    startTransition(async () => {
      const res = await uploadCV(formData);
      setResult(res);
      if (res.success) setSelectedFile(null);
    });
  };

  return (
    <div className="space-y-6">
      {/* Current CV */}
      {currentCV && (
        <div className="flex items-center gap-4 p-4 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl">
          <FileText className="h-6 w-6 text-[#16a34a] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#15803d] mb-0.5">Current CV</p>
            <p className="text-[13px] text-[#16a34a] truncate">{currentCV.fileName}</p>
          </div>
          <a
            href={currentCV.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#16a34a] text-[#16a34a] text-[13px] font-medium hover:bg-green-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download
          </a>
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
          dragOver
            ? "border-[#1e293b] bg-[#f8fafc]"
            : "border-[#cbd5e1] hover:border-[#1e293b] hover:bg-[#f8fafc]"
        }`}
      >
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <Upload className={`h-10 w-10 mx-auto mb-3 ${dragOver ? "text-[#1e293b]" : "text-[#94a3b8]"}`} />
        {selectedFile ? (
          <div>
            <p className="font-semibold text-[#0f172a] text-sm">{selectedFile.name}</p>
            <p className="text-xs text-[#64748b] mt-1">{(selectedFile.size / 1024).toFixed(0)} KB — Click to change</p>
          </div>
        ) : (
          <div>
            <p className="font-semibold text-[#0f172a] text-sm">Drag & drop your CV here</p>
            <p className="text-xs text-[#64748b] mt-1">or click to browse — PDF only</p>
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${result.success ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-700"}`}>
          {result.success ? <CheckCircle className="h-4 w-4 flex-shrink-0" /> : <AlertCircle className="h-4 w-4 flex-shrink-0" />}
          <span className="text-[13px] font-medium">{result.success ? "CV uploaded successfully!" : result.error}</span>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selectedFile || isPending}
        className="w-full h-[44px] bg-[#1e293b] text-white rounded-lg text-[14px] font-medium hover:bg-[#0f172a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Uploading...</> : "Upload CV"}
      </button>
    </div>
  );
}
