'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from 'react-toastify';

export default function UrunDetayPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({ username: "", rating: 5, text: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3001/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));

    fetch(`http://localhost:3001/api/comments/product/${id}`)
      .then(res => res.json())
      .then(data => setComments(data));
  }, [id]);

  const handleCommentChange = e => {
    setCommentForm({ ...commentForm, [e.target.name]: e.target.value });
  };

  const handleCommentSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:3001/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...commentForm, productId: id })
      });
      if (!res.ok) throw new Error("Yorum eklenemedi");
      const newComment = await res.json();
      setComments([newComment, ...comments]);
      setCommentForm({ username: "", rating: 5, text: "" });
      toast.success("Yorum eklendi!");
    } catch {
      toast.error("Yorum eklenemedi!");
    }
    setSubmitting(false);
  };

  if (loading) return <div className="text-center mt-10">Ürün yükleniyor...</div>;
  if (!product) return <div className="text-center mt-10 text-red-500">Ürün bulunamadı.</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <img
        src={product.image || "/images/default-product.jpg"}
        alt={product.name}
        className="w-48 h-48 object-cover rounded-xl border-4 border-white shadow-xl mb-4 mx-auto"
      />
      <h1 className="text-2xl font-bold mb-2 text-center">{product.name}</h1>
      <p className="text-lg font-semibold text-blue-600 text-center mb-2">{product.price}₺</p>
      <p className={`text-base font-semibold mb-3 text-center ${product.stock < 5 ? 'text-red-400' : 'text-green-600'}`}>
        Stok: {product.stock}
      </p>
      <p className="text-gray-700 mb-4 text-center">{product.description || "Açıklama yok."}</p>
      {/* İstersen sepete ekle butonu veya başka işlemler ekleyebilirsin */}
      <h2 className="text-xl font-bold mt-8 mb-2">Yorumlar</h2>
      <form onSubmit={handleCommentSubmit} className="mb-6">
        <input
          type="text"
          name="username"
          placeholder="Adınız"
          value={commentForm.username}
          onChange={handleCommentChange}
          className="border rounded px-2 py-1 mr-2"
          required
        />
        <select
          name="rating"
          value={commentForm.rating}
          onChange={handleCommentChange}
          className="border rounded px-2 py-1 mr-2"
        >
          {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ⭐</option>)}
        </select>
        <input
          type="text"
          name="text"
          placeholder="Yorumunuz"
          value={commentForm.text}
          onChange={handleCommentChange}
          className="border rounded px-2 py-1 mr-2 w-48"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded"
          disabled={submitting}
        >
          Gönder
        </button>
      </form>
      <ul>
        {comments.length === 0 && <li>Henüz yorum yok.</li>}
        {comments.map(c => (
          <li key={c._id} className="mb-2 border-b pb-2">
            <span className="font-bold">{c.username}</span> - <span>{c.rating} ⭐</span>
            <div>{c.text}</div>
            <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
} 