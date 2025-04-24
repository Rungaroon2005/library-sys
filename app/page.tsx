"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Search, Edit, Trash2, Book, X, Plus, LogOut, User, Menu } from "lucide-react";
import Modal from "./components/modal";
import Link from "next/link";

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
  const [username, setUsername] = useState("Admin");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [formData, setFormData] = useState<BookFormData>(initialFormData);
  const [currentBookId, setCurrentBookId] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<BookFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBooks();
    // In a real application, you would check authentication status here
  }, []);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      // Simulate data loading for demo
      setTimeout(() => {
        setBooks([
          {
            id: 1,
            title: "Murder on the Orient Express",
            author: "Agatha Christie",
            isbn: "978-0062073501",
            publisher: "Harper Collins",
            quantity: 3,
            publicationYear: 1934,
            category: "Mystery",
            isAvailable: true
          },
          {
            id: 2,
            title: "The Catcher in the Rye",
            author: "J.D. Salinger",
            isbn: "978-0316769488",
            publisher: "Little, Brown and Company",
            quantity: 2,
            publicationYear: 1951,
            category: "Fiction",
            isAvailable: true
          },
          {
            id: 3,
            title: "Clean Code",
            author: "Robert C. Martin",
            isbn: "978-0132350884",
            publisher: "Prentice Hall",
            quantity: 5,
            publicationYear: 2008,
            category: "Software Development",
            isAvailable: true
          },
          {
            id: 4,
            title: "1984",
            author: "George Orwell",
            isbn: "978-0451524935",
            publisher: "Signet Classic",
            quantity: 7,
            publicationYear: 1949,
            category: "Dystopian",
            isAvailable: true
          },
          {
            id: 5,
            title: "Atomic Habits",
            author: "James Clear",
            isbn: "978-0735211292",
            publisher: "Avery",
            quantity: 4,
            publicationYear: 2018,
            category: "Self-help",
            isAvailable: true
          }
        ]);
        setIsLoading(false);
      }, 800);
      
      // Real API call (commented out)
      // const response = await axios.get<Book[]>("http://localhost:3000/books");
      // setBooks(response.data);
    } catch (error) {
      console.error("Failed to fetch books", error);
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
      // For demo - client-side filtering
      setTimeout(() => {
        const filtered = books.filter(
          (book) =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setIsLoading(false);
      }, 500);
      
      // Real implementation
      // const response = await axios.post<Book[]>("http://localhost:3000/books/search/books", {
      //   query: searchQuery,
      // });
      // setBooks(response.data);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    
    try {
      // await axios.delete(`http://localhost:3000/books/${id}`);
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const openCreateModal = () => {
    setFormData(initialFormData);
    setFormErrors({});
    setIsCreateModalOpen(true);
    setMobileMenuOpen(false);
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    setIsSubmitting(true);
    
    try {
      if (isCreateModalOpen) {
        // Simulate API call
        setTimeout(() => {
          const newBook = {
            id: books.length + 1,
            ...formData
          };
          setBooks((prev) => [...prev, newBook as Book]);
          closeModals();
          setIsSubmitting(false);
        }, 800);
        
        // Actual API call
        // const response = await axios.post("http://localhost:3000/books", formData);
        // setBooks((prev) => [...prev, response.data]);
      } else if (isUpdateModalOpen && currentBookId) {
        // Simulate API call
        setTimeout(() => {
          setBooks((prev) =>
            prev.map((book) => (book.id === currentBookId ? {...book, ...formData} : book))
          );
          closeModals();
          setIsSubmitting(false);
        }, 800);
        
        // Actual API call
        // const response = await axios.patch(
        //   `http://localhost:3000/books/${currentBookId}`,
        //   formData
        // );
        // setBooks((prev) =>
        //   prev.map((book) => (book.id === currentBookId ? response.data : book))
        // );
      }
    } catch (error) {
      console.error("Form submission failed", error);
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
          className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500"
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
          } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
          {...props}
        />
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  ), [handleInputChange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Top Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4 sm:mb-0">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Book size={24} className="text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Library Management</h1>
            </div>
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
            <button
              onClick={openCreateModal}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
            >
              <Plus size={18} />
              Add Book
            </button>
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
              <button
                onClick={openCreateModal}
                className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg mt-2"
              >
                <Plus size={18} />
                Add Book
              </button>
            </div>
          </div>
        </header>

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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-gray-800 text-gray-100 w-full pl-10 pr-4 py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
              />
            </div>
            <button 
              onClick={handleSearch}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg sm:rounded-l-none sm:rounded-r-lg transition-colors shadow-lg font-medium w-full sm:w-auto"
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
                    {filteredBooks.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-400">
                          No books found matching your search
                        </td>
                      </tr>
                    ) : (
                      filteredBooks.map((book) => (
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
              
              {/* Mobile Card View */}
              <div className="md:hidden">
                {filteredBooks.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    No books found matching your search
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {filteredBooks.map((book) => (
                      <div key={book.id} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-base">{book.title}</h3>
                          <div className="flex gap-1">
                            <button
                              className="inline-flex items-center justify-center p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition"
                              onClick={() => openUpdateModal(book)}
                            >
                              <Edit size={14} />
                            </button>
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

        {/* Footer */}
        <footer className="mt-6 pt-4 border-t border-gray-700 text-center text-gray-400 text-sm">
          © 2025 Library Management System. All rights reserved.
        </footer>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
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