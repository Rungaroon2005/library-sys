"use client";

import { useState, useCallback, memo } from "react";
import { BookFormData } from "../lib/types";
import { useRouter } from "next/navigation";

interface FormInputProps { 
  label: string;
  name: keyof BookFormData;
  type?: string;
  value: string | number | boolean;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  [key: string]: any;
}

// Define FormInput outside the main component to prevent recreation on each render
const FormInput = memo(({ 
  label, 
  name, 
  type = "text", 
  value, 
  error, 
  onChange,
  ...props 
}: FormInputProps) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    {type === "checkbox" ? (
      <input
        type="checkbox"
        name={name}
        checked={value as boolean}
        onChange={onChange}
        className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500"
        {...props}
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value as string | number}
        onChange={onChange}
        className={`w-full px-3 py-2 bg-gray-800 border ${
          error ? "border-red-500" : "border-gray-700"
        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
        {...props}
      />
    )}
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
));

FormInput.displayName = 'FormInput';

interface BookFormProps {
  initialData: BookFormData;
  onSubmit: (data: BookFormData) => Promise<void>;
  submitLabel: string;
  isEdit?: boolean;
}

export default function BookForm({ 
  initialData, 
  onSubmit, 
  submitLabel,
  isEdit = false
}: BookFormProps) {
  const [formData, setFormData] = useState<BookFormData>(initialData);
  const [formErrors, setFormErrors] = useState<Partial<BookFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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

  const validateForm = useCallback((): boolean => {
    const errors: Partial<BookFormData> = {};
    
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.author.trim()) errors.author = "Author is required";
    if (!formData.isbn.trim()) errors.isbn = "ISBN is required";
    if (!formData.publisher.trim()) errors.publisher = "Publisher is required";
    if (!formData.category.trim()) errors.category = "Category is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      router.push("/books");
    } catch (error) {
      console.error("Form submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl p-6">
      <FormInput
        label="Title"
        name="title"
        value={formData.title}
        error={formErrors.title}
        onChange={handleInputChange}
        placeholder="Enter book title"
        required
      />
      <FormInput
        label="Author"
        name="author"
        value={formData.author}
        error={formErrors.author}
        onChange={handleInputChange}
        placeholder="Enter author name"
        required
      />
      <FormInput
        label="ISBN"
        name="isbn"
        value={formData.isbn}
        error={formErrors.isbn}
        onChange={handleInputChange}
        placeholder="Enter ISBN"
        required
      />
      <FormInput
        label="Publisher"
        name="publisher"
        value={formData.publisher}
        error={formErrors.publisher}
        onChange={handleInputChange}
        placeholder="Enter publisher"
        required
      />
      <FormInput
        label="Category"
        name="category"
        value={formData.category}
        error={formErrors.category}
        onChange={handleInputChange}
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
          onChange={handleInputChange}
          min="0"
          required
        />
        <FormInput
          label="Publication Year"
          name="publicationYear"
          type="number"
          value={formData.publicationYear}
          error={formErrors.publicationYear ? formErrors.publicationYear.toString() : ""}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="flex items-center mt-4 mb-6">
        <FormInput
          label=""
          name="isAvailable"
          type="checkbox"
          value={formData.isAvailable}
          onChange={handleInputChange}
        />
        <span className="ml-2 text-sm text-gray-300">Available for checkout</span>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={() => router.push("/books")}
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}