"use client";
import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

/**
 * Interface representing the structure of category data.
 */
interface categoryData {}

/**
 * Function to generate random colors for chart elements.
 * @param {number} count - The number of colors to generate.
 * @returns {string[]} An array of randomly generated colors in rgba format.
 */
const generateRandomColors = (count: number): string[] => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const rgba = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, 0.7)`;
    colors.push(rgba);
  }
  return colors;
};

/**
 * Dashboard component for rendering the main page.
 */
const Dashboard: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories and their counts
        const res = await fetch("https://dummyjson.com/products/categories");
        const categoryData = await res.json();

        // Fetch product count per category
        const countData = await Promise.all(
          categoryData.map(async (category: categoryData) => {
            const countRes = await fetch(
              `https://dummyjson.com/products/category/${category}`
            );
            const countJson = await countRes.json();
            return countJson.total;
          })
        );

        // Set states after both sets of data are received
        setCategories(categoryData);
        setCategoryCounts(countData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    // Check local storage for firstName
    const storedFirstName = localStorage.getItem("firstName");
    if (storedFirstName) {
      setFirstName(storedFirstName);
    }
  }, []);

  // Render the component
  return (
    <>
      {/* Hero section */}
      <section className="hero bg-gradient-to-r from-blue-500 to-purple-500 text-white py-16 mb-10">
        <div className="container mx-auto text-center">
          {!firstName && (
            <h1 className="text-4xl lg:text-6xl font-bold mb-4 hover:text-indigo-300 transition-colors">
              Welcome to Ash Store
            </h1>
          )}
          {firstName && (
            <h1 className="text-4xl lg:text-6xl font-bold mb-4 hover:text-purple-300 transition-colors">
              Hello, {firstName}!
            </h1>
          )}

          <p className="text-lg lg:text-xl">
            Explore our curated collection of products for every need.
          </p>
        </div>
      </section>
      {/* Main content */}
      <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Product Distribution by Category
        </h2>
        <div className="flex justify-center">
          <ChartRenderer
            categories={categories}
            categoryCounts={categoryCounts}
          />
        </div>
      </div>
      {/* Footer */}
      <footer className="mt-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-8">
        <div className="container mx-auto flex justify-center items-center">
          <div className="flex space-x-4">
            <a
              href="https://github.com/ashimrai123"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/ashim-rai-a90857198/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://www.instagram.com/ashim_raibs/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

/**
 * ChartRenderer component for rendering a pie chart.
 */
const ChartRenderer: React.FC<{
  categories: string[];
  categoryCounts: number[];
}> = ({ categories, categoryCounts }) => {
  const randomColors = generateRandomColors(categories.length);

  useEffect(() => {
    const ctx = document.getElementById("pieChart") as HTMLCanvasElement;

    if (ctx) {
      const myPieChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: categories,
          datasets: [
            {
              data: categoryCounts,
              backgroundColor: randomColors,
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "left",
              align: "start",
            },
          },
        },
      });

      return () => {
        myPieChart.destroy();
      };
    }
  }, [categories, categoryCounts, randomColors]);

  return <canvas id="pieChart" width="400" height="400"></canvas>;
};

// Export the component
export default Dashboard;
