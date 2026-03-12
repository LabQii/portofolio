"use client";

import { useState, useTransition, useRef } from "react";
import { uploadCV } from "@/app/actions/cv-actions";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle, Loader2, AlertCircle } from "lucide-react";

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
        <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <FileText className="h-8 w-8 text-green-600 dark:text-green-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-green-800 dark:text-green-300">Current CV</p>
            <p className="text-sm text-green-700 dark:text-green-400 truncate">{currentCV.fileName}</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={currentCV.fileUrl} target="_blank" rel="noopener noreferrer">Download</a>
          </Button>
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${dragOver ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-muted-foreground/30 hover:border-blue-400 hover:bg-muted/30"}`}
      >
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <Upload className={`h-12 w-12 mx-auto mb-4 ${dragOver ? "text-blue-500" : "text-muted-foreground/50"}`} />
        {selectedFile ? (
          <div>
            <p className="font-semibold text-foreground">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground mt-1">{(selectedFile.size / 1024).toFixed(0)} KB — Click to change</p>
          </div>
        ) : (
          <div>
            <p className="font-semibold">Drag & drop your CV here</p>
            <p className="text-sm text-muted-foreground mt-1">or click to browse — PDF only</p>
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${result.success ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300" : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"}`}>
          {result.success ? <CheckCircle className="h-5 w-5 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 flex-shrink-0" />}
          <span className="text-sm font-medium">{result.success ? "CV uploaded successfully!" : result.error}</span>
        </div>
      )}

      <Button onClick={handleSubmit} disabled={!selectedFile || isPending} size="lg" className="w-full">
        {isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Uploading...</> : "Upload CV"}
      </Button>
    </div>
  );
}
