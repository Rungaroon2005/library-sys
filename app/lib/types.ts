export interface Book {
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
  
  export interface BookFormData {
    title: string;
    author: string;
    isbn: string;
    publisher: string;
    quantity: number;
    publicationYear: number;
    category: string;
    isAvailable: boolean;
  }
  
  export const initialFormData: BookFormData = {
    title: "",
    author: "",
    isbn: "",
    publisher: "",
    quantity: 1,
    publicationYear: new Date().getFullYear(),
    category: "",
    isAvailable: true,
  };