"use client";
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function Header() {
  const { isLoggedIn, logout, username } = useAuth();
  
  return (
    <header className="bg-white text-gray-900 shadow-md w-full sticky top-0 z-50">
      <nav className="flex justify-between items-center container mx-auto p-4">
        
        {/* Logo/Brand */}
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors">
          Campus Connect
        </Link>
        
        {/* Main Nav Links (desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/items?type=FOUND" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
            Found Items
          </Link>
          <Link href="/items?type=LOST" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
            Lost Items
          </Link>
          {isLoggedIn && (
            <Link href="/my-items" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              My Items
            </Link>
          )}
        </div>
        
        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-gray-700 hidden sm:block">
                Hello, {username || 'User'}!
              </Link>
              <button 
                onClick={logout} 
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
