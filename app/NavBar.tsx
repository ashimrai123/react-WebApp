"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { HiShoppingBag } from "react-icons/hi2";
import classnames from "classnames";

export const NavBar = () => {
  const currentPath = usePathname();
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("email") || null;
    }
    return null;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Set up an interval to periodically check the local storage
      const interval = setInterval(() => {
        setEmail(localStorage.getItem("email") || null);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Products", href: "/components/products" },
    { label: email ? email : "Login", href: "/components/login" },
  ];

  return (
    <nav className="flex justify-between space-x-6 border-b mb-5 px-5 h-14 items-center ">
      <Link href="/" className="flex space-x-2 items-center">
        <HiShoppingBag className="text-2xl" />
        <h1>Ash Store </h1>
      </Link>
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
