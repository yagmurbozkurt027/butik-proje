"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from 'react-toastify';
import { useFadeIn, useSlideIn, useScale } from '../hooks/useAnimations';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import { useCart } from '../hooks/useCart';
import ProductCard from '../components/ProductCard';

export default function UrunlerPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");


  
  const fetchProducts = async () => {
    try {
      console.log("Ürünler yükleniyor...");
      const res = await fetch("http://localhost:3001/api/products");
      console.log("API Response status:", res.status);
      console.log("API Response ok:", res.ok);
      
      if (!res.ok) throw new Error("Ürünler yüklenirken hata oluştu");
      
      const data = await res.json();
      console.log("API Response data:", data);
      console.log("Ürün sayısı:", data.length);
      
      setProducts(data);
    } catch (err) {
      console.error("Ürün yükleme hatası:", err);
      toast.error("Ürünler yüklenirken bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  const pullToRefresh = usePullToRefresh(fetchProducts);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(favs);
  }, []);

  useEffect(() => {
    console.log("Filtreleme useEffect çalıştı - Products:", products.length);
    
    let filtered = [...products];

    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (priceRange.min !== "") {
      filtered = filtered.filter(product => product.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max !== "") {
      filtered = filtered.filter(product => product.price <= parseFloat(priceRange.max));
    }

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "category":
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    console.log("Filtered products:", filtered.length);
    setFilteredProducts(filtered);
  }, [products, search, selectedCategory, priceRange, sortBy, sortOrder]);

  const toggleFavorite = async (productId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error("Favori eklemek için giriş yapmalısınız!");
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/users/toggle-favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId }),
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.isFavorite) {
          toast.success(data.message);
        } else {
          toast.info(data.message);
        }
        
        let updated;
        if (favorites.includes(productId)) {
          updated = favorites.filter(id => id !== productId);
        } else {
          updated = [...favorites, productId];
        }
        setFavorites(updated);
        localStorage.setItem("favorites", JSON.stringify(updated));
        
        if (data.points) {
          toast.success(`+${data.points - (favorites.includes(productId) ? 0 : 5)} puan kazandın!`);
        }
      } else {
        toast.error(data.error || 'Favori işlemi başarısız');
      }
    } catch (error) {
      console.error('Favori işlemi hatası:', error);
      toast.error('Favori işlemi sırasında hata oluştu');
    }
  };

  const addToStock = async (product) => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      if (!userId || !token) {
        toast.error('Giriş yapmanız gerekiyor!');
        return;
      }

      const response = await fetch(`http://localhost:3001/api/users/user-stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
          productId: product._id,
          quantity: 1
        })
      });

      if (response.ok) {
        toast.success(`${product.name} stoklarınıza eklendi!`);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Stoklara eklenirken hata oluştu!');
      }
    } catch (err) {
      toast.error('Stoklara eklenirken hata oluştu!');
    }
  };



  if (loading) {
    return <div className="text-center mt-10">Ürünler yükleniyor...</div>;
  }

  console.log("Render - Products:", products.length, "Filtered:", filteredProducts.length);

      const categories = ["all", ...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <main 
      ref={pullToRefresh.ref}
      style={pullToRefresh.style}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8"
    >
      {/* Pull-to-Refresh Indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
        <div 
          className={`transition-all duration-300 ${
            pullToRefresh.isRefreshing 
              ? 'opacity-100 translate-y-4' 
              : 'opacity-0 -translate-y-4'
          }`}
        >
          {pullToRefresh.isRefreshing && (
            <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>

      {/* Pull-to-Refresh Text */}
      <div className="fixed top-16 left-0 right-0 z-40 flex justify-center">
        <div 
          className={`transition-all duration-300 text-sm ${
            pullToRefresh.pullDistance > 40 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-2'
          }`}
        >
          {pullToRefresh.pullDistance > 40 && (
            <div className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg">
              {pullToRefresh.pullDistance >= 80 ? 'Bırakın ve yenileyin' : 'Aşağı çekin ve yenileyin'}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            🛍️ Ürünlerimiz
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            En kaliteli ürünlerimizi keşfedin
          </p>
        </div>
      
      {/* Arama ve Filtreleme Bölümü */}
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Arama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🔍 Arama
            </label>
            <input
              type="text"
              placeholder="Ürün ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Kategori Filtresi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📂 Kategori
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "Tüm Kategoriler" : category}
                </option>
              ))}
            </select>
          </div>

          {/* Fiyat Aralığı */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              💰 Fiyat Aralığı
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
                className="w-1/2 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
                className="w-1/2 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Sıralama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📊 Sıralama
            </label>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">İsim</option>
                <option value="price">Fiyat</option>
                <option value="category">Kategori</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                title={sortOrder === "asc" ? "Artan" : "Azalan"}
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>

        {/* Filtreleri Temizle */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredProducts.length} ürün bulundu
          </div>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
              setPriceRange({ min: "", max: "" });
              setSortBy("name");
              setSortOrder("asc");
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            🗑️ Filtreleri Temizle
          </button>
        </div>
              </div>
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
        >
                  <div className="col-span-full text-center text-gray-500 mb-4">
          Debug: {filteredProducts.length} ürün bulundu
        </div>
        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center text-gray-500">Hiç ürün bulunamadı.</div>
        )}
        {filteredProducts.map((product, index) => (
          <ProductCard
            key={product._id}
            product={product}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            addToStock={addToStock}
            addToCart={addToCart}
          />
        ))}
        </div>
      </div>
    </main>
  );
}
