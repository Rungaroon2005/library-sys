"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Book } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Define API URL for backend (port 3000)
  const API_URL = "http://localhost:3000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      console.log("Attempting to login with:", { email });
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        mode: 'cors', // Explicitly set CORS mode
        credentials: 'include', // For cookies if used
      });
      
      console.log("Response status:", response.status);
      
      let data;
      try {
        // Try to parse response as JSON
        data = await response.json();
        console.log("Response data:", data);
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        // If we can't parse JSON, get text instead
        const textData = await response.text();
        console.log("Response text:", textData);
        throw new Error("Invalid response format from server");
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed: Server returned an error');
      }
      
      // Store the token in localStorage
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        
        // If you have user info, store it too
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Redirect to books page
        router.push("/books");
      } else {
        throw new Error('Authentication failed: No token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError("Cannot connect to the server. Please check if the server is running.");
      } else {
        setError(err instanceof Error ? err.message : "Failed to login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-purple-600 p-3 rounded-lg">
            <Book size={32} className="text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">Sign in to your account</h1>
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl p-6">
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-purple-400 hover:text-purple-300">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}