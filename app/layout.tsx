"use client";

import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [username, setUsername] = useState<string | null>("Admin"); // In a real app, this would come from auth state

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {username && <Navbar username={username} />}
          <main className="mt-6">
            {children}
          </main>
          <footer className="mt-6 pt-4 border-t border-gray-700 text-center text-gray-400 text-sm">
            © 2025 Library Management System. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
  );
}