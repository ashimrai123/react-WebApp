"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@radix-ui/themes";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
}

// Define the ApiResponse type because it contains User[]
interface ApiResponse {
  products: Product[];
}

const ProductsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [products, setProducts] = useState<Product[]>([]);

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
        })
      );

      setProducts(allProducts);
    };

    fetchProducts();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleProducts = products.slice(startIndex, endIndex);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="container mx-auto mt-8">
      <Button className="mb-4">Product</Button>
      {visibleProducts.map((product) => (
        <div key={product.id} className="bg-white p-4 shadow-md mt-4 flex">
          <div className="w-1/2 pr-4">
            <h2 className="text-xl font-bold mb-2">{product.title}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-gray-800 font-semibold mb-2">
              Price: ${product.price}
            </p>
            <p className="text-gray-800 mb-2">Rating: {product.rating}</p>
            <p className="text-gray-800 mb-2">Stock: {product.stock}</p>
          </div>
          <img
            src={product.thumbnail}
            alt={`${product.title} - Thumbnail`}
            className="w-1/2 h-auto"
          />
        </div>
      ))}
      <div className="flex justify-between mt-4">
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Previous Page
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={endIndex >= products.length}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Next Page
        </Button>
      </div>
    </div>
  );
};

export default ProductsPage;
