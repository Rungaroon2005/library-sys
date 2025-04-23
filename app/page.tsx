"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Search, Edit, Trash2, Book, X, Plus } from "lucide-react";
import Modal from "./components/modal";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  quantity: number;
  publicationYear: number;
  category: string;
  isAvailable: boolean;
}

interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  quantity: number;
  publicationYear: number;
  category: string;
  isAvailable: boolean;
}

const initialFormData: BookFormData = {
  title: "",
  author: "",
  isbn: "",
  publisher: "",
  quantity: 1,
  publicationYear: new Date().getFullYear(),
  category: "",
  isAvailable: true,
};

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [formData, setFormData] = useState<BookFormData>(initialFormData);
  const [currentBookId, setCurrentBookId] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<BookFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<Book[]>("http://localhost:3000/books");
      setBooks(response.data);
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
      // Using the POST search endpoint with a request body as specified in the backend
      const response = await axios.post<Book[]>("http://localhost:3000/books/search/books", {
        query: searchQuery,
        // You can add other search parameters from SearchBookDto here
      });
      setBooks(response.data);
    } catch (error) {
      console.error("Search failed", error);
      // Fallback to client-side filtering if API call fails
      const filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setBooks(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    
    try {
      await axios.delete(`http://localhost:3000/books/${id}`);
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const openCreateModal = () => {
    setFormData(initialFormData);
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  const openUpdateModal = (book: Book) => {
    setCurrentBookId(book.id);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher,
      quantity: book.quantity,
      publicationYear: book.publicationYear,
      category: book.category,
      isAvailable: book.isAvailable,
    });
    setFormErrors({});
    setIsUpdateModalOpen(true);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsUpdateModalOpen(false);
    setCurrentBookId(null);
  };

  // Use useCallback to memoize the handler function
  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const validateForm = (): boolean => {
    const errors: Partial<BookFormData> = {};
    
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.author.trim()) errors.author = "Author is required";
    if (!formData.isbn.trim()) errors.isbn = "ISBN is required";
    if (!formData.publisher.trim()) errors.publisher = "Publisher is required";
    if (!formData.category.trim()) errors.category = "Category is required";
    
    // Removed publication year validation to allow any year
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (isCreateModalOpen) {
        // Create new book - POST request matches controller endpoint
        const response = await axios.post("http://localhost:3000/books", formData);
        setBooks((prev) => [...prev, response.data]);
        closeModals();
      } else if (isUpdateModalOpen && currentBookId) {
        // Update existing book - Changed to PATCH to match the controller
        const response = await axios.patch(
          `http://localhost:3000/books/${currentBookId}`,
          formData
        );
        setBooks((prev) =>
          prev.map((book) => (book.id === currentBookId ? response.data : book))
        );
        closeModals();
      }
    } catch (error) {
      console.error("Form submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Client-side filtering as a fallback
  const filteredBooks = searchQuery.trim() === "" 
    ? books 
    : books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Memoized Form input component to prevent re-rendering
  const FormInput = useCallback(({ 
    label, 
    name, 
    type = "text", 
    value, 
    error, 
    ...props 
  }: { 
    label: string;
    name: string;
    type?: string;
    value: string | number | boolean;
    error?: string;
    [key: string]: any;
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      {type === "checkbox" ? (
        <input
          type="checkbox"
          name={name}
          checked={value as boolean}
          onChange={handleInputChange}
          className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-emerald-500 focus:ring-emerald-500"
          {...props}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value as string | number}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 bg-gray-800 border ${
            error ? "border-red-500" : "border-gray-700"
          } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white`}
          {...props}
        />
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  ), [handleInputChange]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Book size={28} className="text-emerald-400" />
            <h1 className="text-3xl font-bold text-white">Library Management</h1>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Add Book
          </button>
        </header>

        <div className="relative mb-6 flex">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="bg-gray-800 text-gray-100 w-full pl-10 pr-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-700"
          />
          <button 
            onClick={handleSearch}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-r-lg transition-colors"
          >
            Search
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-gray-400">Loading books...</div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800 text-gray-300 text-sm">
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Author</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Year</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-400">
                      No books found
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-800">
                      <td className="p-4">{book.title}</td>
                      <td className="p-4">{book.author}</td>
                      <td className="p-4">{book.category}</td>
                      <td className="p-4">{book.publicationYear}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            book.isAvailable
                              ? "bg-emerald-900 text-emerald-300"
                              : "bg-red-900 text-red-300"
                          }`}
                        >
                          {book.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          className="inline-flex items-center justify-center p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition"
                          onClick={() => openUpdateModal(book)}
                        >
                          <Edit size={16} />
                        </button>
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
        )}

        {/* Create Book Modal */}
        <Modal onClose={closeModals} isOpen={isCreateModalOpen} title="Add New Book">
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Title"
              name="title"
              value={formData.title}
              error={formErrors.title}
              placeholder="Enter book title"
              required
            />
            <FormInput
              label="Author"
              name="author"
              value={formData.author}
              error={formErrors.author}
              placeholder="Enter author name"
              required
            />
            <FormInput
              label="ISBN"
              name="isbn"
              value={formData.isbn}
              error={formErrors.isbn}
              placeholder="Enter ISBN"
              required
            />
            <FormInput
              label="Publisher"
              name="publisher"
              value={formData.publisher}
              error={formErrors.publisher}
              placeholder="Enter publisher"
              required
            />
            <FormInput
              label="Category"
              name="category"
              value={formData.category}
              error={formErrors.category}
              placeholder="Enter category"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                error={formErrors.quantity?.toString()}
                min="0"
                required
              />
              <FormInput
                label="Publication Year"
                name="publicationYear"
                type="number"
                value={formData.publicationYear}
                error={formErrors.publicationYear ? formErrors.publicationYear.toString() : ""}
                required
              />
            </div>
            <div className="flex items-center mt-4 mb-6">
              <FormInput
                label=""
                name="isAvailable"
                type="checkbox"
                value={formData.isAvailable}
              />
              <span className="ml-2 text-sm text-gray-300">Available for checkout</span>
            </div>
            <div className="flex justify-end gap-3 mt-6 border-t border-gray-700 pt-4">
              <button
                type="button"
                onClick={closeModals}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Add Book"}
              </button>
            </div>
          </form>
        </Modal>

        {/* Update Book Modal */}
        <Modal onClose={closeModals} isOpen={isUpdateModalOpen} title="Update Book">
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Title"
              name="title"
              value={formData.title}
              error={formErrors.title}
              placeholder="Enter book title"
              required
            />
            <FormInput
              label="Author"
              name="author"
              value={formData.author}
              error={formErrors.author}
              placeholder="Enter author name"
              required
            />
            <FormInput
              label="ISBN"
              name="isbn"
              value={formData.isbn}
              error={formErrors.isbn}
              placeholder="Enter ISBN"
              required
            />
            <FormInput
              label="Publisher"
              name="publisher"
              value={formData.publisher}
              error={formErrors.publisher}
              placeholder="Enter publisher"
              required
            />
            <FormInput
              label="Category"
              name="category"
              value={formData.category}
              error={formErrors.category}
              placeholder="Enter category"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                error={formErrors.quantity?.toString()}
                min="0"
                required
              />
              <FormInput
                label="Publication Year"
                name="publicationYear"
                type="number"
                value={formData.publicationYear}
                error={formErrors.publicationYear?.toString()}
                required
              />
            </div>
            <div className="flex items-center mt-4 mb-6">
              <FormInput
                label=""
                name="isAvailable"
                type="checkbox"
                value={formData.isAvailable}
              />
              <span className="ml-2 text-sm text-gray-300">Available for checkout</span>
            </div>
            <div className="flex justify-end gap-3 mt-6 border-t border-gray-700 pt-4">
              <button
                type="button"
                onClick={closeModals}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : "Update Book"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}