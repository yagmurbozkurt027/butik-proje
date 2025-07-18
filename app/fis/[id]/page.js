import React from "react";

async function getTransaction(id) {
  const res = await fetch(`http://localhost:3001/api/transactions/${id}`);
  if (!res.ok) throw new Error("Fiş bulunamadı");
  return res.json();
}

export default async function FisDetay({ params }) {
  const { id } = params;
  let transaction;
  try {
    transaction = await getTransaction(id);
  } catch {
    return <div>Fiş bulunamadı.</div>;
  }
  return (
    <div className="max-w-md mx-auto bg-white shadow p-6 mt-8 font-mono border rounded">
      <div className="text-center text-xl font-bold mb-2">{transaction.storeName || "MAĞAZA"}</div>
      <div className="text-center text-lg mb-4">Ürün İşlem Fişi</div>
      <div className="flex justify-between mb-2">
        <span>Tarih:</span>
        <span>{new Date(transaction.date).toLocaleString()}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>İşlem Tipi:</span>
        <span>{transaction.type}</span>
      </div>
      <div className="border-t my-2" />
      <div className="mb-2 font-semibold">Ürünler:</div>
      <div>
        {transaction.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm mb-1">
            <span>{i + 1}. {item.productName}</span>
            <span>{item.quantity} x {item.unitPrice.toFixed(2)}₺ = {(item.totalPrice).toFixed(2)}₺</span>
          </div>
        ))}
      </div>
      <div className="border-t my-2" />
      <div className="flex justify-between font-bold text-lg">
        <span>GENEL TOPLAM:</span>
        <span>{transaction.total.toFixed(2)}₺</span>
      </div>
      <div className="flex justify-between mt-2 text-sm">
        <span>İşlemi Yapan:</span>
        <span>{transaction.user || "-"}</span>
      </div>
      {transaction.description && (
        <div className="mt-2 text-sm">Açıklama: {transaction.description}</div>
      )}
    </div>
  );
} 