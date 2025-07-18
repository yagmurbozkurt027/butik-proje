import products from "../products";

export default function UrunDetayPage({ params }) {
  // products dizisini import ettik, id ile ürünü bul
  const product = products.find(p => p.id === params.id);

  if (!product) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600">Ürün bulunamadı</h1>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center max-w-md w-full">
        <img src={product.image} alt={product.name} className="w-48 h-48 object-cover rounded mb-6 border" />
        <h1 className="text-3xl font-bold mb-2 text-blue-700">{product.name}</h1>
        <p className="text-xl text-gray-800 mb-2">Fiyat: <span className="font-semibold">{product.price}₺</span></p>
        <p className="text-md text-green-700 mb-4">Stok: {product.stock}</p>
        {/* Açıklama eklemek istersen buraya ekleyebilirsin */}
        {/* <p className="text-gray-600 mb-4">Açıklama: {product.description}</p> */}
        <a href="/urunler" className="text-blue-600 hover:underline mt-4">← Ürünlere Dön</a>
      </div>
    </main>
  );
} 