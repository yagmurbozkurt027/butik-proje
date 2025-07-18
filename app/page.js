'use client';

import { useEffect, useState } from "react";
import Header from "./Header";
import Link from "next/link";

function parseJwt(token) {
  if (!token) return null;
  try {
    // Base64 decode + UTF-8 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('token');
      if (token) {
        const userObj = parseJwt(token);
        setUser(userObj);
      }
    }
  }, []);

  // Ürünler ve ürün kartı gridini kaldırdım

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-blue-200 mt-8">
        {user ? (
          <span>Hoş geldin, {user.username}!</span>
        ) : (
          <a href="/login" className="ml-4">Giriş</a>
        )}
      </h1>
      <h2 className="text-2xl text-center mt-2 text-gray-700 dark:text-gray-300">
        Butik Proje'ye göz atın.
      </h2>
      {/* Admin'e özel içerikler */}
      {user && user.role === "admin" && (
        <div className="flex flex-col items-center mb-6 mt-4">
          <span className="font-semibold mb-2 text-lg text-white bg-blue-600 px-4 py-2 rounded">Admin Paneli</span>
          {/* Buraya admin'e özel butonlar veya linkler ekleyebilirsin */}
        </div>
      )}
      {/* Buraya ürünler, stoklarım, fişlerim gibi müşteri ve admin ortak içeriklerini ekleyebilirsin */}
    </main>
  );
}