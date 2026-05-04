"use client";

// import module
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// TODO: Add discount logic here
interface CartProps {
  productId: string;
  productName: string;
  price: number;
  image: string;
  stock: number;
  onSuccess?: () => void; // Tambahkan prop ini
}

// TODO: Add discount logic here
export default function AddToCartButton({
  onSuccess,
  productId,
  productName,
  price,
  image,
  stock,

}: CartProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fungsi untuk add to cart
  const handleAddToCart = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Silahkan login terlebih dahulu untuk menambah ke keranjang.");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      // Memanggil API Laravel untuk update field 'cart' di DB
      const response = await fetch(`http://127.0.0.1:8000/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json", // WAJIB: Agar Laravel merespons JSON jika ada error
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          // name: productName,
          // price: price,
          // image: image,
          jumlah: 1, // TAMBAHKAN INI agar validasi Laravel lolos
        }),
      });

      if (response.ok) {
        // alert(`${productName} berhasil ditambahkan ke keranjang!`);
        if (onSuccess) onSuccess();
        // router.refresh(); // Refresh data halaman
      } else {
        const error = await response.json();
        // alert(error.message || "Gagal menambahkan ke keranjang.");
      }
    } catch (err) {
      console.error("Cart Error:", err);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart} // TODO: Add discount logic here
      disabled={stock === 0 || loading}
      className="w-full bg-stone-900 hover:bg-stone-800 text-white py-4 transition-all uppercase tracking-widest text-sm font-medium disabled:bg-stone-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading ? (
        <span className="animate-pulse">Processing...</span>
      ) : stock === 0 ? (
        "Sold Out"
      ) : (
        "Add to Cart"
      )}
    </button>
  );
}
