import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header({ darkMode, toggleDarkMode }) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = localStorage.getItem("username");
      if (name) setUsername(name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow py-4 px-6 flex items-center justify-between">
      <div className="text-2xl font-bold text-blue-600 dark:text-blue-200">Butik Proje</div>
      <nav className="flex gap-6 items-center">
        <Link href="/" className="hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-300">Anasayfa</Link>
        <Link href="/urunler" className="hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-300">Ürünler</Link>
        <Link href="/stoklarim" className="hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-300">Stoklarım</Link>
        <Link href="/fis-ekle" className="hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-300">Yeni Fiş Ekle</Link>
        {username ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Çıkış Yap
          </button>
        ) : (
          <Link href="/login" className="hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-300">Giriş</Link>
        )}
        <button
          onClick={toggleDarkMode}
          className="ml-4 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </nav>
    </header>
  );
}

const stoklaraEkle = async () => {
  // Kullanıcı id'sini localStorage veya context'ten al
  const userId = localStorage.getItem("userId");
  const res = await fetch("http://localhost:3001/api/users/user-stock", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId: params.id, quantity: 1 }),
  });
  const data = await res.json().catch(() => ({}));
  alert(data.error || "Bir hata oluştu!");
};
