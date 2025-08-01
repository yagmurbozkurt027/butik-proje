'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useSwipeGestures } from '../hooks/useSwipeGestures';
import { toast } from 'react-toastify';

export default function ProductCard({ product, favorites, toggleFavorite, addToStock, addToCart }) {
  const swipeGestures = useSwipeGestures(
    // Sola kaydır - Sepete ekle
    () => {
      if (addToCart) {
        addToCart(product);
      } else {
        addToStock(product);
        toast.success(`${product.name} stoklara eklendi!`);
      }
    },
    // Sağa kaydır - Favorilere ekle
    () => {
      toggleFavorite(product._id);
      toast.success(favorites.includes(product._id) 
        ? `${product.name} favorilerden çıkarıldı!` 
        : `${product.name} favorilere eklendi!`
      );
    },
    // Yukarı kaydır - Detay sayfasına git
    () => {
      window.location.href = `/urunler/${product._id}`;
    },
    // Aşağı kaydır - Ürünü gizle (opsiyonel)
    () => {
      toast.info(`${product.name} gizlendi`);
    }
  );

  return (
    <div
      ref={swipeGestures.ref}
      style={swipeGestures.style}
      className="relative bg-gradient-to-br from-blue-900/80 to-purple-900/80 border-2 border-blue-400/60 rounded-2xl shadow-xl p-6 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-blue-400/60 group"
    >
      {/* Swipe Direction Indicator */}
      {swipeGestures.isSwiping && (
        <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center z-20">
          <div className="text-white text-2xl font-bold">
            {swipeGestures.swipeDirection === 'left' && '📦 Stoklara Ekle'}
            {swipeGestures.swipeDirection === 'right' && '❤️ Favori'}
            {swipeGestures.swipeDirection === 'up' && '👁️ Detay'}
            {swipeGestures.swipeDirection === 'down' && '🙈 Gizle'}
          </div>
        </div>
      )}

      {/* Swipe Hints */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-2 left-2 text-xs text-white/60">← Stoklara Ekle</div>
        <div className="absolute top-2 right-2 text-xs text-white/60">Favori →</div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-white/60">↑ Detay</div>
      </div>

      {/* Favori butonu */}
      <button
        onClick={() => toggleFavorite(product._id)}
        className="absolute top-3 right-3 text-2xl z-10"
        title={favorites.includes(product._id) ? "Favorilerden çıkar" : "Favorilere ekle"}
      >
        {favorites.includes(product._id) ? "❤️" : "🤍"}
      </button>
      <Link
        href={`/urunler/${product._id}`}
        className="flex flex-col items-center w-full"
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-5 bg-gradient-to-r from-blue-400 via-white to-purple-400 rounded-full blur-2xl opacity-60 transition" />
        <img
          src={product.image || "/images/default-product.jpg"}
          alt={product.name}
          className="w-28 h-28 object-cover rounded-xl border-4 border-white shadow-xl mb-4 bg-white/60"
        />
        <h2 className="text-lg font-extrabold text-white mb-1 drop-shadow-lg tracking-wide uppercase text-center">{product.name}</h2>
        <p className="text-base font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg text-center">
          {product.price}₺
        </p>
        <span className={`text-base font-semibold mb-3 ${product.stock < 5 ? 'text-red-400' : 'text-green-300'} drop-shadow text-center`}>
          Stok: {product.stock}
        </span>
      </Link>
      
      {/* Sepete Ekle Butonu */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (addToCart) {
            addToCart(product);
          } else {
            addToStock(product);
          }
        }}
        disabled={product.stock <= 0}
        className="mt-3 w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none"
      >
        {product.stock <= 0 ? 'Stokta Yok' : '📦 Stoklara Ekle'}
      </button>
    </div>
  );
} 