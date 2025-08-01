"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [photo, setPhoto] = useState("");
  const [role, setRole] = useState("user");

  useEffect(() => {
    // Karanlık mod kontrolü
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    
    checkTheme();
    
    // Kullanıcı bilgilerini al
    const userPhoto = localStorage.getItem("photo");
    const userRole = localStorage.getItem("role");
    
    if (userPhoto) setPhoto(userPhoto);
    if (userRole) setRole(userRole);

    // Intersection Observer için
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    });
    
    // Theme değişikliklerini dinle
    const themeObserver = new MutationObserver(checkTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => {
      observer.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  return (
    <header className={`flex items-center justify-between px-4 md:px-8 py-4 shadow-lg border-b transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center gap-3">
        <img
          src={photo || "https://ui-avatars.com/api/?name=Kullanıcı"}
          alt="Profil Fotoğrafı"
          className={`w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border transition-colors ${
            isDark ? 'border-gray-600' : 'border-gray-300'
          }`}
        />
        <div className={`text-lg md:text-2xl font-bold transition-colors ${
          isDark ? 'text-blue-400' : 'text-blue-600'
        }`}>
          Butik Proje
        </div>
      </div>
      
      {/* Desktop Menü */}
      <nav className="hidden md:flex gap-6 items-center">
        <Link href="/" className={`transition-colors ${
          isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
        }`}>
          Anasayfa
        </Link>
        <Link href="/urunler" className={`transition-colors ${
          isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
        }`}>
          Ürünler
        </Link>
        <Link href="/stoklarim" className={`transition-colors ${
          isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
        }`}>
          Stoklarım
        </Link>
        <Link href="/fis" className={`transition-colors ${
          isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
        }`}>
          Fişlerim
        </Link>
        <Link href="/fis-ekle" className={`transition-colors ${
          isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
        }`}>
          Yeni Fiş Ekle
        </Link>
        <Link href="/favoriler" className={`transition-colors ${
          isDark ? 'text-gray-300 hover:text-pink-400' : 'text-gray-700 hover:text-pink-600'
        }`}>
          Favorilerim
        </Link>
        <Link href="/gamification" className={`transition-colors ${
          isDark ? 'text-gray-300 hover:text-yellow-400' : 'text-gray-700 hover:text-yellow-600'
        }`}>
          🎮 Gamification
        </Link>
        <Link href="/profil" className={`transition-colors ${
          isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
        }`}>
          Profilim
        </Link>
        <Link href="/chat" className={`transition-colors ${
          isDark ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'
        }`}>
          💬 Chat
        </Link>
        {role === "admin" && (
          <>
            <Link href="/admin" className={`font-bold transition-colors ${
              isDark ? 'text-gray-300 hover:text-red-400' : 'text-gray-700 hover:text-red-600'
            }`}>
              Admin Paneli
            </Link>
            <Link href="/raporlar" className={`font-bold transition-colors ${
              isDark ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'
            }`}>
              📊 Raporlar
            </Link>
          </>
        )}
        <button
          className={`ml-4 px-3 py-1 rounded text-white transition-colors ${
            isDark ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
          }`}
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("username");
            window.location.href = "/login";
          }}
        >
          Çıkış Yap
        </button>
        <button
          onClick={toggleDarkMode}
          className={`ml-4 px-3 py-1 rounded border transition-colors ${
            isDark 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-300'
          }`}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </nav>
    </header>
  );
}