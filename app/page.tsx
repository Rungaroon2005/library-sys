"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to books page
    router.push("/books");
  }, [router]);

  return (
    <div className="flex justify-center items-center h-96">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
      <span className="ml-3 text-gray-400">Redirecting to books...</span>
    </div>
  );
}