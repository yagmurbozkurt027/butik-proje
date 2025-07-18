"use client";
import './globals.css'
import Link from "next/link";
import Header from './Header';
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // localStorage'dan tema durumunu al
    const stored = localStorage.getItem("theme");
    if (stored === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(d => !d);

  return (
    <html lang="tr">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`min-h-screen flex flex-col font-[Poppins] ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="flex-1 flex flex-col items-center justify-center w-full">
          {children}
        </main>
        <footer className="w-full bg-white dark:bg-gray-900 text-center text-gray-400 dark:text-gray-500 py-3 border-t mt-8 text-sm">
          © {new Date().getFullYear()} Butik Proje. Tüm hakları saklıdır.
        </footer>
      </body>
    </html>
  )
}

