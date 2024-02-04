"use client";
import React, { useState, useEffect } from "react";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
  category: string;
}

// Define the ApiResponse type because it contains User[]
interface ApiResponse {
  products: Product[];
}
const ProductsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("https://dummyjson.com/products");
      const productApiResponse: ApiResponse = await res.json();
      const allProducts: Product[] = productApiResponse.products.map(
        (product) => ({
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          rating: product.rating,
          stock: product.stock,
          thumbnail: product.thumbnail,
          images: product.images,
          category: product.category,
        })
      );

      setProducts(allProducts);
      setFilteredProducts(allProducts);
    };

    const fetchCategories = async () => {
      const res = await fetch("https://dummyjson.com/products/categories");
      const categoryData = await res.json();
      setCategories(categoryData);
    };

    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const fetchProductsByCategory = async () => {
        const res = await fetch(
          `https://dummyjson.com/products/category/${selectedCategory}`
        );
        const productData = await res.json();
        setFilteredProducts(productData.products);
      };

      fetchProductsByCategory();
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory, products]);

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => {
            setCurrentPage(i);
            window.scrollTo(0, 0); // Scroll to the top of the page
          }}
          className={`btn mx-1 ${
            i === currentPage
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const filterProductsByCategory = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-center mb-4 items-baseline">
        <label className="mr-2">Select Category:</label>
        <select
          onChange={(e) => filterProductsByCategory(e.target.value)}
          value={selectedCategory || ""}
          className="p-2 border border-gray-300"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-4 mx-20">
        {filteredProducts
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((product) => (
            <div
              key={product.id}
              className="bg-white p-2 shadow-md h-full transform hover:scale-105 transition-transform border border-gray-300 hover:border-blue-500"
            >
              <img
                src={product.thumbnail}
                alt={`${product.title} - Thumbnail`}
                className="w-full h-40 object-contain mb-2"
              />
              <h2 className="text-lg font-bold mb-1">{product.title}</h2>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-gray-800 font-semibold mb-1">
                Price: ${product.price}
              </p>
              <p className="text-gray-800 mb-1">Rating: {product.rating}</p>
              <p className="text-gray-800 mb-1">Stock: {product.stock}</p>
            </div>
          ))}
      </div>
      <div className="flex justify-center my-5">{getPageNumbers()}</div>
    </div>
  );
};

export default ProductsPage;
