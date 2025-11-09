"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Input } from "@/lib/ui";
import Link from "next/link";

export function RegisterForm() {
  const [form, setForm] = useState({ username: "", password: "", name: "", faculty: "", phone: "", role: "STUDENT" });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await api.register(form);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 bg-green-100 text-green-700 rounded border border-green-300">
        Registration successful! Redirecting to login...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && <div className="p-2 bg-red-100 text-red-700 border border-red-300 rounded text-sm">{error}</div>}
      
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">Username*</label>
        <Input id="username" type="text" value={form.username} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">Password*</label>
        <Input id="password" type="password" value={form.password} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
        <Input id="name" type="text" value={form.name} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="faculty" className="block text-sm font-medium mb-1">Faculty</label>
        <Input id="faculty" type="text" value={form.faculty} onChange={handleChange} />
      </div>
       <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
        <Input id="phone" type="text" value={form.phone} onChange={handleChange} />
      </div>
      
      <button type="submit" disabled={isSubmitting} className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700 transition-colors disabled:opacity-50">
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>
       <div className="text-center text-sm mt-4">
        Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Sign In</Link>
      </div>
    </form>
  );
}
