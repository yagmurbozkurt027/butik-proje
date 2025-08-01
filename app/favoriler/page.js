'use client';
import { useEffect, useState } from "react";
import Link from "next/link";

export default function FavorilerPage() {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(favs);
    fetch("http://localhost:3001/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const favoriteProducts = products.filter(p => favorites.includes(p._id));

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-pink-600">Favorilerim</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {favoriteProducts.length === 0 && (
          <div className="col-span-full text-center text-gray-500">Hiç favori ürününüz yok.</div>
        )}
        {favoriteProducts.map(product => (
          <Link
            key={product._id}
            href={`/urunler/${product._id}`}
            className="relative bg-gradient-to-br from-pink-900/80 to-purple-900/80 border-2 border-pink-400/60 rounded-2xl shadow-xl p-6 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-pink-400/60 group"
          >
            <img
              src={product.image || "/images/default-product.jpg"}
              alt={product.name}
              className="w-28 h-28 object-cover rounded-xl border-4 border-white shadow-xl mb-4 bg-white/60"
            />
            <h2 className="text-lg font-extrabold text-white mb-1 drop-shadow-lg tracking-wide uppercase text-center">{product.name}</h2>
            <p className="text-base font-bold mb-2 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg text-center">
              {product.price}₺
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
