"use client";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { useAuth } from "./auth-context";

export function AuthGuard({ children }: { children: ReactNode }) {
  const r = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      r.replace("/login");
    }
  }, [r, isLoggedIn, isLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return <>{children}</>;
}
