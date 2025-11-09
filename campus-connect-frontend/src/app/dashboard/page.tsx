"use client"
import Link from 'next/link';
import { AuthGuard } from "@/lib/guards";
import { useAuth } from "@/lib/auth-context";

const DashboardContent = () => {
  const { username } = useAuth();
  
  const links = [
    { href: "/report-lost", label: "✍️ Report Lost Item", style: "bg-red-500 hover:bg-red-600" },
    { href: "/report-found", label: "📝 Report Found Item", style: "bg-green-500 hover:bg-green-600" },
    { href: "/items?type=FOUND", label: "🔍 Browse Found Items", style: "bg-blue-500 hover:bg-blue-600" },
    { href: "/items?type=LOST", label: "🔎 Browse Lost Items", style: "bg-yellow-500 hover:bg-yellow-600" },
    { href: "/my-items", label: "📦 My Items (Owner View)", style: "bg-purple-500 hover:bg-purple-600" },
    { href: "/my-claims", label: "📜 My Claims (Created by Me)", style: "bg-indigo-500 hover:bg-indigo-600" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Welcome back, {username || 'User'}!</h1>
      <p className="text-gray-600">Quick access to Lost & Found activities:</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {links.map(link => (
          <Link 
            key={link.href}
            href={link.href}
            className={`p-6 rounded-lg text-white font-semibold text-lg shadow-lg transform hover:scale-[1.02] transition-transform ${link.style}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
