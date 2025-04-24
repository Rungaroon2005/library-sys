"use client";
import { Book, LogOut, User, Menu, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface NavbarProps {
  username: string;
}

export default function Navbar({ username }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Check if current page is login or register
  const isAuthPage = pathname === "/login" || pathname === "/register";
  
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-700">
      <div className="flex items-center justify-between mb-4 sm:mb-0">
        <Link href="/books" className="flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-lg">
            <Book size={24} className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Library Management</h1>
        </Link>
        <button
          className="sm:hidden bg-gray-800 p-2 rounded-lg"
          onClick={toggleMobileMenu}
        >
          <Menu size={24} className="text-white" />
        </button>
      </div>
      {/* Desktop Actions */}
      <div className="hidden sm:flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-800 py-2 px-3 rounded-lg">
          <User size={18} className="text-purple-400" />
          <span className="text-gray-300">{username}</span>
        </div>
        <Link href="/login" className="flex items-center gap-2 bg-gray-800 py-2 px-3 rounded-lg hover:bg-gray-700 transition-all">
          <LogOut size={18} className="text-purple-400" />
          <span className="text-gray-300">Logout</span>
        </Link>
        {/* Only show Add Book button if not on login or register pages */}
        {!isAuthPage && (
          <Link
            href="/books/add"
            className={`${pathname === "/books/add" ? "bg-purple-700" : "bg-purple-600 hover:bg-purple-700"} text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg`}
          >
            <Plus size={18} />
            Add Book
          </Link>
        )}
      </div>
      {/* Mobile Menu */}
      <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'} mt-2 transition-all duration-300 ease-in-out`}>
        <div className="flex flex-col gap-3 bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <User size={18} className="text-purple-400" />
            <span className="text-gray-300">{username}</span>
          </div>
          <Link href="/login" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded-lg transition-all">
            <LogOut size={18} className="text-purple-400" />
            <span className="text-gray-300">Logout</span>
          </Link>
          {/* Only show Add Book button if not on login or register pages */}
          {!isAuthPage && (
            <Link
              href="/books/add"
              className={`${pathname === "/books/add" ? "bg-purple-700" : "bg-purple-600 hover:bg-purple-700"} text-white p-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg mt-2`}
            >
              <Plus size={18} />
              Add Book
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}