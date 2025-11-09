"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { isAuthed } = useAuth();
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Campus Connect — Main</h1>
      <p>Lost & Found Section A hooked to backend.</p>
      <div className="space-x-3">
        <Link className="underline" href={isAuthed ? "/items" : "/login"}>
          {isAuthed ? "Go to Items" : "Login"}
        </Link>
      </div>
    </main>
  );
}
