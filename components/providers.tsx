"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/ui/toast";
import { ConfirmProvider } from "@/components/ui/confirm-modal";
import { MusicProvider } from "@/contexts/MusicContext";

export default function Providers({ 
  children,
  musicUrl 
}: { 
  children: React.ReactNode;
  musicUrl?: string;
}) {
  return (
    <SessionProvider>
      <ConfirmProvider>
        <ToastProvider>
          <MusicProvider musicUrl={musicUrl}>
            {children}
          </MusicProvider>
        </ToastProvider>
      </ConfirmProvider>
    </SessionProvider>
  );
}
