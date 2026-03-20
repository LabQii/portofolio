"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

type AlertType = "success" | "error" | "info";

interface AdminAlertProps {
  open: boolean;
  type?: AlertType;
  title: string;
  message?: string;
  onClose: () => void;
  autoDismiss?: boolean;
}

const icons = {
  success: <div className="w-12 h-12 rounded-full bg-[#dcfce7] flex items-center justify-center"><CheckCircle className="w-6 h-6 text-[#16a34a]" /></div>,
  error:   <div className="w-12 h-12 rounded-full bg-[#fee2e2] flex items-center justify-center"><XCircle className="w-6 h-6 text-[#ef4444]" /></div>,
  info:    <div className="w-12 h-12 rounded-full bg-[#fef9c3] flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-[#d97706]" /></div>,
};

export default function AdminAlert({ open, type = "success", title, message, onClose, autoDismiss = true }: AdminAlertProps) {
  useEffect(() => {
    if (open && autoDismiss) {
      const t = setTimeout(onClose, 3000);
      return () => clearTimeout(t);
    }
  }, [open, autoDismiss, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.25)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 max-w-[380px] w-full mx-4 flex flex-col items-center text-center relative"
        style={{
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          animation: "alertPopIn 200ms ease-out forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-[#94a3b8] hover:text-[#64748b] transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="mb-4">{icons[type]}</div>
        <h3 className="text-[16px] font-semibold text-[#0f172a] mb-2">{title}</h3>
        {message && <p className="text-[14px] text-[#64748b] mb-6">{message}</p>}
        <button
          onClick={onClose}
          className="px-7 py-[10px] text-[14px] font-medium text-white bg-[#1e293b] hover:bg-[#0f172a] rounded-lg transition-colors"
        >
          OK
        </button>
      </div>
      <style>{`
        @keyframes alertPopIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
