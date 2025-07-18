"use client";
import { useEffect, useState } from "react";
import products from "../urunler/products";

export default function StoklarimPage() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      return;
    }
    fetch(`http://localhost:3001/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setStocks(data.stocks || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const updateStock = async (productId, newQuantity) => {
    console.log("updateStock çağrıldı:", { productId, newQuantity }); // DEBUG
    setIsUpdating(true);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    await fetch("http://localhost:3001/api/users/user-stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ userId, productId, quantity: newQuantity }),
    });
    await fetchStocks();
    setIsUpdating(false);
  };

  const handleIncrease = (productId, currentQuantity) => {
    updateStock(productId, currentQuantity + 1);
  };

  const handleDecrease = (productId, currentQuantity) => {
    console.log("handleDecrease:", { productId, currentQuantity }); // DEBUG
    if (currentQuantity > 1) {
      updateStock(productId, currentQuantity - 1);
    } else {
      // 1'den küçükse ürünü stoklardan sil
      removeStock(productId);
    }
  };

  const removeStock = async (productId) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    await fetch("http://localhost:3001/api/users/user-stock-remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ userId, productId }),
    });
    fetchStocks();
  };

  if (loading) return <div className="text-center mt-10">Yükleniyor...</div>;

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600 dark:text-blue-200">Stoklarım</h1>
      {stocks.length === 0 ? (
        <p className="text-center dark:text-gray-200">Henüz stoklarınıza ürün eklemediniz.</p>
      ) : (
        <table className="w-full border rounded shadow bg-white dark:bg-gray-800">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="py-2 px-4 text-gray-800 dark:text-gray-200">Ürün</th>
              <th className="py-2 px-4 text-gray-800 dark:text-gray-200">Miktar</th>
              <th className="py-2 px-4 text-gray-800 dark:text-gray-200">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((item, i) => {
              const product = products.find(p => p.id === item.productId);
              const maxStock = product ? product.stock : Infinity;
              const disablePlus = item.quantity >= maxStock;
              return (
                <tr key={i} className="border-t dark:border-gray-700">
                  <td className="py-2 px-4 flex items-center gap-3 text-gray-900 dark:text-gray-100">
                    {product ? (
                      <>
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded border dark:border-gray-600" />
                        <span className="font-semibold">{product.name}</span>
                      </>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">Bilinmeyen Ürün</span>
                    )}
                  </td>
                  <td className="py-2 px-4 text-center text-gray-900 dark:text-gray-100">{item.quantity}</td>
                  <td className="py-2 px-4 flex gap-2 justify-center">
                    <button onClick={() => handleDecrease(item.productId, item.quantity)} className="bg-red-500 hover:bg-red-600 text-white rounded px-2 py-1 font-bold text-lg disabled:opacity-50" disabled={isUpdating}>-</button>
                    <button
                      onClick={() => handleIncrease(item.productId, item.quantity)}
                      className="bg-green-500 hover:bg-green-600 text-white rounded px-2 py-1 font-bold text-lg disabled:opacity-50"
                      disabled={disablePlus || isUpdating}
                    >
                      +
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
} 