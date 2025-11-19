"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { doLogin } from "@/lib/auth";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/lib/ui";
import Link from "next/link";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login: authContextLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const token = await doLogin(username, password);
      authContextLogin(token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      {error && <div className="p-2 bg-red-100 text-red-700 border border-red-300 rounded text-sm">{error}</div>}
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
        <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 transition-colors disabled:opacity-50">
        {isSubmitting ? "Signing In..." : "Sign In"}
      </button>
      <div className="text-center text-sm mt-4">
        Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Sign Up</Link>
      </div>
    </form>
  );
}
