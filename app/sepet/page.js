'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useCart } from '../hooks/useCart';

export default function SepetPage() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalPrice, 
    getTotalItems, 
    isCartEmpty 
  } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Ödeme işlemi
  const handleCheckout = () => {
    if (isCartEmpty()) {
      toast.error('Sepetiniz boş!');
      return;
    }
    
    // Burada ödeme API'si çağrılacak
    toast.success('Ödeme işlemi başlatılıyor...');
    // Şimdilik sadece sepeti temizle
    setTimeout(() => {
      clearCart();
      toast.success('Siparişiniz alındı!');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🛒 Sepetim</h1>
          <p className="text-blue-200">
            {isCartEmpty() ? 'Sepetiniz boş' : `${cart.length} ürün bulunuyor`}
          </p>
        </div>

        {isCartEmpty() ? (
          /* Boş Sepet */
          <div className="text-center py-16">
            <div className="text-8xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-white mb-4">Sepetiniz Boş</h2>
            <p className="text-blue-200 mb-8">Alışverişe başlamak için ürünlerimize göz atın!</p>
            <Link 
              href="/urunler"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              🛍️ Ürünlere Git
            </Link>
          </div>
        ) : (
          /* Sepet İçeriği */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ürün Listesi */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div 
                  key={item._id}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 flex items-center space-x-4"
                >
                  {/* Ürün Resmi */}
                  <img 
                    src={item.image || "/images/default-product.jpg"} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg border-2 border-white/30"
                  />
                  
                  {/* Ürün Bilgileri */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                    <p className="text-blue-200 mb-2">{item.price}₺</p>
                    
                    {/* Miktar Kontrolleri */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        -
                      </button>
                      <span className="text-white font-bold min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Toplam Fiyat ve Sil */}
                  <div className="text-right">
                    <p className="text-xl font-bold text-white mb-2">
                      {item.price * item.quantity}₺
                    </p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="Sepetten kaldır"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Sepet Özeti */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sticky top-4">
                <h3 className="text-xl font-bold text-white mb-4">Sepet Özeti</h3>
                
                {/* Ürün Sayısı */}
                <div className="flex justify-between text-blue-200 mb-2">
                  <span>Ürün Sayısı:</span>
                  <span>{cart.length}</span>
                </div>
                
                {/* Toplam Miktar */}
                <div className="flex justify-between text-blue-200 mb-2">
                  <span>Toplam Miktar:</span>
                  <span>{getTotalItems()}</span>
                </div>
                
                {/* Kargo */}
                <div className="flex justify-between text-blue-200 mb-4">
                  <span>Kargo:</span>
                  <span className="text-green-400">Ücretsiz</span>
                </div>
                
                <hr className="border-white/20 mb-4" />
                
                {/* Toplam Fiyat */}
                <div className="flex justify-between text-xl font-bold text-white mb-6">
                  <span>Toplam:</span>
                  <span>{getTotalPrice()}₺</span>
                </div>
                
                {/* Butonlar */}
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    💳 Ödemeye Geç
                  </button>
                  
                  <button
                    onClick={clearCart}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    🗑️ Sepeti Temizle
                  </button>
                  
                  <Link
                    href="/urunler"
                    className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-center"
                  >
                    🛍️ Alışverişe Devam
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 