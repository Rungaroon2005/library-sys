"use client";

import { useState, useEffect } from "react";
import { Search, Edit, Trash2 } from "lucide-react";
import { Book } from "../lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/books");
      if (!response.ok) throw new Error("Failed to fetch books");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Failed to fetch books", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchBooks();
      return;
    }

    setIsLoading(true);
    try {
      // Making sure we're using the correct endpoint and sending data in the expected format
      const response = await fetch("http://localhost:3000/books/search/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery,
          // You may need to specify additional fields if your SearchBookDto expects them
          // For example, if your DTO expects specific fields to search:
          searchFields: ["title", "author", "category"]
        }),
      });

      if (!response.ok) {
        throw new Error("Search failed with status: " + response.status);
      }

      const result = await response.json();
      
      // Check the structure of the result
      if (Array.isArray(result)) {
        setBooks(result);
      } else if (result.data && Array.isArray(result.data)) {
        // Handle case where result might be wrapped in a data property
        setBooks(result.data);
      } else {
        console.error("Unexpected search result format:", result);
        // Fall back to empty array
        setBooks([]);
      }
    } catch (error) {
      console.error("Search failed", error);
      // Optionally show an error message to the user
      alert("Failed to search books. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      const response = await fetch(`http://localhost:3000/books/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setBooks((prev) => prev.filter((book) => book.id !== id));
      } else {
        alert("Delete failed: " + result.message);
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  // For debugging - log the current books whenever they change
  useEffect(() => {
    console.log("Current books:", books);
  }, [books]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Book Collection</h1>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="bg-gray-800 text-gray-100 w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors shadow-lg font-medium w-full sm:w-auto"
          >
            Search
          </button>
        </div>
      </div>

      {/* Books Table/Cards */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
            <span className="ml-3 text-gray-400">Loading books...</span>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900 text-gray-300 text-sm">
                    <th className="p-4 text-left font-medium">Title</th>
                    <th className="p-4 text-left font-medium">Author</th>
                    <th className="p-4 text-left font-medium">Category</th>
                    <th className="p-4 text-left font-medium">Year</th>
                    <th className="p-4 text-left font-medium">Status</th>
                    <th className="p-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {books.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                        No books found matching your search
                      </td>
                    </tr>
                  ) : (
                    books.map((book) => (
                      <tr key={book.id} className="hover:bg-gray-750 transition-colors">
                        <td className="p-4 font-medium">{book.title}</td>
                        <td className="p-4 text-gray-300">{book.author}</td>
                        <td className="p-4 text-gray-300">{book.category}</td>
                        <td className="p-4 text-gray-300">{book.publicationYear}</td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              book.isAvailable
                                ? "bg-green-900 text-green-300"
                                : "bg-red-900 text-red-300"
                            }`}
                          >
                            {book.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <Link
                            href={`/books/${book.id}/edit`}
                            className="inline-flex items-center justify-center p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            className="inline-flex items-center justify-center p-2 rounded-full bg-red-900 hover:bg-red-800 text-white transition"
                            onClick={() => handleDelete(book.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
              {books.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  No books found matching your search
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {books.map((book) => (
                    <div key={book.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-base">{book.title}</h3>
                        <div className="flex gap-1">
                          <Link
                            href={`/books/${book.id}/edit`}
                            className="inline-flex items-center justify-center p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition"
                          >
                            <Edit size={14} />
                          </Link>
                          <button
                            className="inline-flex items-center justify-center p-1.5 rounded-full bg-red-900 hover:bg-red-800 text-white transition"
                            onClick={() => handleDelete(book.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-300">
                        <div className="flex justify-between mb-1">
                          <span>Author:</span>
                          <span>{book.author}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span>Category:</span>
                          <span>{book.category}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span>Year:</span>
                          <span>{book.publicationYear}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span>Status:</span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              book.isAvailable
                                ? "bg-green-900 text-green-300"
                                : "bg-red-900 text-red-300"
                            }`}
                          >
                            {book.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}