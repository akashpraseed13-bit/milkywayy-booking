"use client";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/contexts/auth";

export function Providers({ children, user }) {
  return (
    <AuthProvider initialUser={user}>
      {children}
      <Toaster />
    </AuthProvider>
  );
}
