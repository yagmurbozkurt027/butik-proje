"use client";
import { useState } from "react";
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, storeName, user, description, items })
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/fis/${data._id}`);
    } else {
      alert("Fiş kaydedilemedi");
    }
  };
  return (
    <div className="max-w-xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Yeni Fiş Ekle</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-gray-800 dark:text-gray-200">İşlem Tipi: </label>
          <select value={type} onChange={e => setType(e.target.value)} className="border rounded p-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            <option value="girdi">Girdi</option>
            <option value="çıktı">Çıktı</option>
          </select>
        </div>
        <div>
          <label className="text-gray-800 dark:text-gray-200">Mağaza Adı: </label>
          <input value={storeName} onChange={e => setStoreName(e.target.value)} required className="border rounded p-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="text-gray-800 dark:text-gray-200">Kullanıcı: </label>
          <input value={user} onChange={e => setUser(e.target.value)} className="border rounded p-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="text-gray-800 dark:text-gray-200">Açıklama: </label>
          <input value={description} onChange={e => setDescription(e.target.value)} className="border rounded p-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block font-semibold text-gray-800 dark:text-gray-200">Ürünler:</label>
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <input placeholder="Ürün Adı" value={item.productName} onChange={e => handleItemChange(idx, "productName", e.target.value)} required className="border rounded p-1 flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
              <input type="number" min="1" placeholder="Miktar" value={item.quantity} onChange={e => handleItemChange(idx, "quantity", e.target.value)} required className="border rounded p-1 w-20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
              <input type="number" min="0" step="0.01" placeholder="Birim Fiyat" value={item.unitPrice} onChange={e => handleItemChange(idx, "unitPrice", e.target.value)} required className="border rounded p-1 w-24 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
              {items.length > 1 && <button type="button" onClick={() => removeItem(idx)} className="text-red-500">Sil</button>}
            </div>
          ))}
          <button type="button" onClick={addItem} className="text-blue-500">+ Ürün Ekle</button>
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">Kaydet</button>
      </form>
    </div>
  );
} 