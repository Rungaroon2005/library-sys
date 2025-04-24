"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BookForm from "@/app/components/BookForm";
import { Book, initialFormData } from "@/app/lib/types";

export default function EditBookPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = Number(params.id);
  const [isLoading, setIsLoading] = useState(true);
  const [bookData, setBookData] = useState(initialFormData);
  const [error, setError] = useState("");

  useEffect(() => {
    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  const fetchBook = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:3000/books/${bookId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch book');
      }
      const book = await response.json();
      setBookData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publisher: book.publisher,
        quantity: book.quantity,
        publicationYear: book.publicationYear,
        category: book.category,
        isAvailable: book.isAvailable
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch book", error);
      setError("Failed to load book data");
      setIsLoading(false);
    }
  };

  const handleUpdateBook = async (data: any) => {
    try {
      const response = await fetch(`http://localhost:3000/books/${bookId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update book');
      }
      
      const result = await response.json();
      router.push('/books'); // Redirect back to books list after successful update
      return result;
    } catch (error) {
      console.error("Error updating book:", error);
      setError("Failed to update book. Please try again.");
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
        <span className="ml-3 text-gray-400">Loading book details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded">
        <p>{error}</p>
        <button
          onClick={() => router.push('/books')}
          className="mt-3 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          Return to Books
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Book</h1>
      <BookForm
        initialData={bookData}
        onSubmit={handleUpdateBook}
        submitLabel="Update Book"
        isEdit={true}
      />
    </div>
  );
}