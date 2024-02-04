"use client";
import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";

interface categoryData {}

const generateRandomColors = (count: number) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const rgba = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, 0.7)`;
    colors.push(rgba);
  }
  return colors;
};

const Dashboard = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch categories and their counts
      const res = await fetch("https://dummyjson.com/products/categories");
      const categoryData = await res.json();

      setCategories(categoryData);

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

      setCategoryCounts(countData);
    };

    fetchData();
  }, []);

  // Use Chart.js to create a pie chart
  useEffect(() => {
    const ctx = document.getElementById("pieChart") as HTMLCanvasElement;
    const myPieChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: categories,
        datasets: [
          {
            data: categoryCounts,
            backgroundColor: generateRandomColors(categories.length),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "left", // Set legend position to left
            align: "start", // Align the legend to the start (covers the whole width)
          },
        },
      },
    });

    return () => {
      myPieChart.destroy();
    };
  }, [categories, categoryCounts]);

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Product Distribution by Category
      </h2>
      <div className="flex justify-center">
        <canvas id="pieChart" width="400" height="400"></canvas>
      </div>
    </div>
  );
};

export default Dashboard;
