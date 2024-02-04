"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { HiShoppingBag } from "react-icons/hi2";
import classnames from "classnames";

/**
 * NavBar component for rendering the navigation bar.
 */
export const NavBar = () => {
  // Get the current path using Next.js usePathname hook
  const currentPath = usePathname();
  // State to manage the user's email
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("email") || null;
    }
    return null;
  });

  // Effect to periodically check the local storage for email changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Set up an interval to periodically check the local storage
      const interval = setInterval(() => {
        setEmail(localStorage.getItem("email") || null);
      }, 1000);

      // Clear the interval on component unmount
      return () => clearInterval(interval);
    }
  }, []);

  // Navigation links and their corresponding labels and hrefs
  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Products", href: "/components/products" },
    { label: email ? email : "Login", href: "/components/login" },
  ];

  // Render the component
  return (
    <nav className="flex justify-between space-x-6 border-b mb-5 px-5 h-14 items-center ">
      {/* Logo  */}
      <Link href="/" className="flex space-x-2 items-center">
        <HiShoppingBag className="text-2xl" />
        <h1>Ash Store </h1>
      </Link>
      {/* Navigation links */}
      <ul className="flex space-x-6 item-center">
        {links.map((link) => (
          <Link
            key={link.href}
            className={classnames({
              "text-zinc-900": link.href === currentPath,
              "text-zinc-500": link.href !== currentPath,
              "hover:text-zinc-800 transition-colors": true,
              "text-lg": true,
            })}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </ul>
    </nav>
  );
};
