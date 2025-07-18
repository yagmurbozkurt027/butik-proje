"use client";
import Link from "next/link";
import { useState } from "react";

const products = [
  { id: "6867b9b1d3f25697ece0832c" , name: "Tişört", price: 199, stock: 12, image: "/images/tshirt.jpg" },
  { id: "6863cc098a6bc707ac359ac3" , name: "Pantolon", price: 299, stock: 7, image: "/images/pantolon.jpg" },
  { id: "6867b9e6d3f25697ece0832e" , name: "Ayakkabı", price: 399, stock: 3, image: "/images/ayakkabi.jpg" },
];

async function stoklaraEkle(productId) {
  // Kullanıcı id'sini ve token'ı localStorage'dan al (girişte kaydedilmiş olmalı)
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  if (!userId || !token) {
    alert("Lütfen giriş yapın.");
    return;
  }
  const res = await fetch("http://localhost:3001/api/users/user-stock", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ userId, productId, quantity: 1 }),
  });
  if (res.ok) {
    alert("Ürün stoklarınıza eklendi!");
  } else {
    const data = await res.json().catch(() => ({}));
    alert(data.error || "Bir hata oluştu!");
  }
}

export default function UrunlerPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedProducts, setUploadedProducts] = useState([]);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleUpload = async () => {
    if (!file) return alert("Lütfen bir dosya seçin");
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:3001/api/products/bulk-upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Yükleme başarısız");
      const data = await res.json();
      setUploadedProducts(data.products || []);
      alert(data.message);
    } catch (err) {
      alert("Yükleme sırasında hata oluştu: " + err.message);
    }
    setUploading(false);
  };
  return (
    <main className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600 dark:text-blue-200">Ürünler</h1>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Ürünler</h1>
        <div className="mb-6">
          <label className="font-semibold mr-2">Toplu Ürün Yükle (Excel/CSV):</label>
          <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileChange} />
          <button onClick={handleUpload} className="ml-2 px-3 py-1 bg-blue-600 text-white rounded" disabled={uploading}>{uploading ? "Yükleniyor..." : "Yükle"}</button>
        </div>
      </div>
      {uploadedProducts.length > 0 && (
        <div className="my-6 p-4 bg-green-50 border rounded">
          <h2 className="font-bold mb-2">Yüklenen Ürünler:</h2>
          <ul className="list-disc ml-6">
            {uploadedProducts.map((p, i) => (
              <li key={i}>{p.name || p.urunAdi || JSON.stringify(p)}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link href={`/urunler/${product.id}`} key={product.id}>
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center dark:bg-gray-800">
              <img src={product.image} alt={product.name} className="w-32 h-32 object-cover mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{product.name}</h2>
              <p className="text-lg text-gray-700 dark:text-gray-200">{product.price}₺</p>
              <span className="text-sm text-green-700 mt-2 dark:text-green-300">Stok: {product.stock}</span>
              <button
                className="mt-4 bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 font-semibold"
                onClick={e => {
                  e.preventDefault();
                  stoklaraEkle(product.id);
                }}
              >
                Stoklara Ekle
              </button>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
