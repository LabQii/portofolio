"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: "danger" | "warning" | "info";
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error("useConfirm must be used within a ConfirmProvider");
  return context.confirm;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const handleClose = (value: boolean) => {
    setIsOpen(false);
    if (resolver) resolver(value);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <AnimatePresence>
        {isOpen && options && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
              onClick={() => handleClose(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-[380px] bg-white rounded-[10px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    options.type === "danger" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-grow pt-1">
                    <h3 className="text-[16px] font-bold text-[#1e293b] mb-1.5">{options.title}</h3>
                    <p className="text-[14px] text-[#64748b] leading-relaxed">{options.message}</p>
                  </div>
                  <button 
                    onClick={() => handleClose(false)}
                    className="text-[#94a3b8] hover:text-[#1e293b] transition-colors p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex justify-end gap-3 mt-8">
                  <button
                    onClick={() => handleClose(false)}
                    className="px-4 py-2 text-[14px] font-medium text-[#64748b] hover:text-[#1e293b] transition-colors"
                  >
                    {options.cancelLabel || "Cancel"}
                  </button>
                  <button
                    onClick={() => handleClose(true)}
                    className={`px-5 py-2 text-[14px] font-medium text-white rounded-lg transition-all active:scale-[0.98] ${
                      options.type === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-[#1e293b] hover:bg-[#0f172a]"
                    }`}
                  >
                    {options.confirmLabel || "Confirm"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}
