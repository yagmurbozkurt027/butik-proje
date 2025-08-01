"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FisEkle() {
  const [type, setType] = useState("girdi");
  const [storeName, setStoreName] = useState("");
  const [user, setUser] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState([
    { productName: "", quantity: 1, unitPrice: 0 }
  ]);
  const router = useRouter();

  const handleItemChange = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx][field] = field === "quantity" || field === "unitPrice" ? Number(value) : value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { productName: "", quantity: 1, unitPrice: 0 }]);
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      return sum + (Number(item.quantity || 0) * Number(item.unitPrice || 0));
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalAmount = calculateTotal();

    const res = await fetch("http://localhost:3001/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, storeName, user, description, items, total: totalAmount })
    });

    if (res.ok) {
      const data = await res.json();
      alert("Fiş başarıyla kaydedildi!");
      router.push(`/fis/${data._id}`);
    } else {
      alert("Fiş kaydedilemedi. Lütfen tüm alanları doldurduğunuzdan emin olun ve tekrar deneyin.");
      console.error("Fiş kaydetme hatası:", await res.text());
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-8">
      <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4">
        <h1 className="text-xl font-bold mb-3 text-center text-gray-900 dark:text-gray-100">Yeni Fiş Ekle</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">İşlem Tipi</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="girdi">Girdi</option>
              <option value="çıktı">Çıktı</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kullanıcı</label>
            <input value={user} onChange={e => setUser(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mağaza Adı</label>
          <input value={storeName} onChange={e => setStoreName(e.target.value)} required className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Açıklama</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows="2" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ürünler</label>
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <input 
                  placeholder="Ürün Adı" 
                  value={item.productName} 
                  onChange={e => handleItemChange(idx, "productName", e.target.value)} 
                  required 
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
                <input 
                  type="number" 
                  min="1" 
                  placeholder="Miktar" 
                  value={item.quantity} 
                  onChange={e => handleItemChange(idx, "quantity", e.target.value)} 
                  required 
                  className="w-20 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
                <input 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  placeholder="Birim Fiyat" 
                  value={item.unitPrice} 
                  onChange={e => handleItemChange(idx, "unitPrice", e.target.value)} 
                  required 
                  className="w-24 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
                {items.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeItem(idx)} 
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>
          <button 
            type="button" 
            onClick={addItem} 
            className="mt-3 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition-colors"
          >
            ➕ Ürün Ekle
          </button>
        </div>

        {/* Toplam Tutar */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-base font-bold text-blue-900 dark:text-blue-100 text-center">
            Toplam Tutar: {calculateTotal().toFixed(2)}₺
          </div>
        </div>

        {/* Kaydet Butonu */}
        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          💾 Fişi Kaydet
        </button>
      </form>
      </div>
    </div>
  );
}