"use client"

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Changed from 'next/router'

export default function AddBook() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    author: '',
    year: '',
    price: ''
  });
  
  const [errors, setErrors] = useState({
    id: '',
    title: '',
    author: '',
    year: '',
    price: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (!formData.title.trim()) {
      newErrors.title = 'Please enter your title';
      isValid = false;
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Please enter your author';
      isValid = false;
    }
    
    if (!formData.year.trim()) {
      newErrors.year = 'Please enter your year';
      isValid = false;
    } else if (!/^\d+$/.test(formData.year)) {
      newErrors.year = 'Year must be numeric';
      isValid = false;
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Please enter your price';
      isValid = false;
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.price)) {
      newErrors.price = 'Price must be numeric';
      isValid = false;
    }
    
    if (!formData.id.trim()) {
      newErrors.id = 'Please enter your Book ID';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      // Here you would normally send the data to your backend
      alert('Book added successfully!');
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Add New Book | Library Management System</title>
        <meta name="description" content="Add a new book to the library" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="bg-blue-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="flex items-center mr-4">
            <ArrowLeft size={20} className="mr-2" />
          </Link>
          <div className="flex items-center space-x-2">
            <BookOpen size={24} />
            <h1 className="text-xl font-bold">Library Management System</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">Add New Book</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="id" className="block text-gray-700 font-medium mb-2">Book ID</label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.id ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                placeholder="Enter book ID"
              />
              {errors.id && <p className="mt-1 text-red-500 text-sm">{errors.id}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.title ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                placeholder="Enter book title"
              />
              {errors.title && <p className="mt-1 text-red-500 text-sm">{errors.title}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="author" className="block text-gray-700 font-medium mb-2">Author</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.author ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                placeholder="Enter author name"
              />
              {errors.author && <p className="mt-1 text-red-500 text-sm">{errors.author}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="year" className="block text-gray-700 font-medium mb-2">Year</label>
              <input
                type="text"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.year ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                placeholder="Enter publication year"
              />
              {errors.year && <p className="mt-1 text-red-500 text-sm">{errors.year}</p>}
            </div>
            
            <div className="mb-6">
              <label htmlFor="price" className="block text-gray-700 font-medium mb-2">Price</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.price ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                placeholder="Enter book price"
              />
              {errors.price && <p className="mt-1 text-red-500 text-sm">{errors.price}</p>}
            </div>
            
            <div className="flex justify-end space-x-4">
              <Link href="/" className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300">
                Cancel
              </Link>
              <button 
                type="submit" 
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <footer className="bg-blue-800 text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Library Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}