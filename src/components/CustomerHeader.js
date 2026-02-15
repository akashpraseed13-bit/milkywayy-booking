"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/contexts/auth";
import HeaderBackground from "@/components/HeaderBackground";

export default function CustomerHeader() {
  const { authState, login, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = authState;

  return (
    <HeaderBackground className="fixed top-0 left-0 right-0 z-50 flex py-4 items-center justify-between border-b border-white/10 px-4 lg:px-8">
      <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
        <Image src="/logo-texxt.png" height={40} width={200} alt="Milkywayy" />
      </Link>

      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-white">
            Hi, {authState.user?.fullName || authState.user?.email || 'User'}
          </span>
          <Button
            variant="ghost"
            className="border border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            onClick={() => router.push("/dashboard/bookings")}
          >
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="border border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          className="border border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
          onClick={login}
        >
          Dashboard
        </Button>
      )}
    </HeaderBackground>
  );
}
