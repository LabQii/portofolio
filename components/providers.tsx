"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/ui/toast";
import { ConfirmProvider } from "@/components/ui/confirm-modal";
import { MusicProvider } from "@/contexts/MusicContext";

export default function Providers({ 
  children
}: { 
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ConfirmProvider>
        <ToastProvider>
          <MusicProvider>
            {children}
          </MusicProvider>
        </ToastProvider>
      </ConfirmProvider>
    </SessionProvider>
  );
}
