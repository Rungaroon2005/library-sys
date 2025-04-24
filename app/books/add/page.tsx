"use client";

import BookForm from "@/app/components/BookForm";
import { Book, initialFormData } from "@/app/lib/types";
import { useState } from "react";

export default function AddBookPage() {
  const [error, setError] = useState("");

  const handleAddBook = async (data: any) => {
    try {
      // Replace with your actual backend endpoint
      const response = await fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add book');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error adding book:", error);
      setError("Failed to add book. Please try again.");
      throw error;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Book</h1>
      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <BookForm 
        initialData={initialFormData} 
        onSubmit={handleAddBook} 
        submitLabel="Add Book" 
      />
    </div>
  );
}