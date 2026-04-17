"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ShoppingBag from "@/components/ShoppingBag";

// Font Setup
const fontJudul = localFont({
  src: "../fonts/8 Heavy.ttf",
  variable: "--font-brand",
});

const fontCaption = localFont({
  src: "../fonts/Nohemi-Regular.otf",
  variable: "--font-body",
});

export default function LuxuryProfilePage() {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    username: '',
    email: '',

    current_password: '', // Tambahan
    new_password: '',     // Tambahan
    new_password_confirmation: '', // Tambahan (Laravel biasanya butuh _confirmation)
    image: null as File | null, // Tambahkan ini
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handler untuk perubahan gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file)); // Buat preview lokal
    }
  };

  // Fungsi reset form saat modal ditutup
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(prev => ({
      ...prev,
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
      image: null
    }));
    setImagePreview(null);
    setStatusMessage({ type: null, text: "" });
  };


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Tambahan state untuk pesan sukses/error yang elegan
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: "" });

  const router = useRouter();
  const [user, setUser] = useState<{
    id: string; // Tipe diubah jadi string untuk id
    name: string;
    username: string;
    email: string;
    password: string;
    image?: string; // Tambahkan properti image
  } | null>(null);

  const [activeTab, setActiveTab] = useState("cart");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchUserData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      console.log("Fetching user data :", token);

      try {
        const response = await fetch("http://127.0.0.1:8000/api/user", {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          localStorage.setItem("user_data", JSON.stringify(userData));
        } else if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_data");
          router.push("/login");
        }
      } catch (error) {
        console.error("Gagal mengambil data identitas:", error);
        const savedUser = localStorage.getItem("user_data");
        if (savedUser) setUser(JSON.parse(savedUser));
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
    router.push("/");
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: null, text: "" });

    const token = localStorage.getItem("access_token");

    // Gunakan FormData untuk mendukung upload file
    // Di dalam handleSubmit (Next.js)
    const data = new FormData();
    data.append('_method', 'PUT'); // Laravel akan membaca ini sebagai PUT
    data.append('name', formData.name);
    data.append('username', formData.username);

    if (formData.image) {
      data.append('image', formData.image); // File dikirim di sini
    }

    if (formData.current_password) {
      data.append('current_password', formData.current_password);
      data.append('new_password', formData.new_password);
      data.append('new_password_confirmation', formData.new_password_confirmation);
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/${formData.id}`, {
        method: "POST", // Browser mengirim sebagai POST agar file terbaca
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
          // JANGAN isi Content-Type manual
        },
        body: data,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser.data || updatedUser);
        localStorage.setItem("user_data", JSON.stringify(updatedUser.data || updatedUser));
        setStatusMessage({ type: 'success', text: "Identity successfully refined." });

        setTimeout(() => {
          setIsModalOpen(false);
          setStatusMessage({ type: null, text: "" });
          setImagePreview(null);
        }, 2000);
      } else {
        const errorData = await response.json();
        setStatusMessage({ type: 'error', text: errorData.message || "Failed to update profile." });
      }
    } catch (error) {
      setStatusMessage({ type: 'error', text: "Connection to server failed." });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !user) return null;

  return (
    <div className={`${fontCaption.variable} ${fontJudul.variable} min-h-screen bg-[#FBFBF9] font-sans text-stone-900 selection:bg-[#0081D1]/20`}>

      {/* MODAL MODIFY IDENTITY */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !loading && setIsModalOpen(false)} // Cegah tutup saat loading
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-2xl overflow-hidden"
            >
              <div className="relative z-10 space-y-8">
                <div className="space-y-2">
                  <h3 className={`${fontJudul.className} text-2xl uppercase tracking-tighter`}>
                    Refine Identity
                  </h3>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest">Update your digital presence</p>
                </div>

                {/* Pesan Sukses / Error yang elegan menggantikan Alert */}
                {statusMessage.text && (
                  <div className={`p-4 rounded-2xl text-xs font-medium ${statusMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {statusMessage.text}
                  </div>
                )}

                {/* MODAL CONTENT - Bagian Form */}
                <form className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar" onSubmit={handleSubmit}>

                  {/* Letakkan ini di dalam <form> sebelum bagian Basic Info */}
                  <div className="flex flex-col items-center space-y-4 pb-4">
                    <div className="relative group">
                      <div className="w-24 h-24 bg-stone-100 rounded-[2rem] overflow-hidden border-2 border-dashed border-stone-200 flex items-center justify-center transition-all group-hover:border-[#0081D1]">
                        {user.image != 'default-avatar.png' ? (
                          <img
                            src={imagePreview || `http://127.0.0.1:8000/storage/profiles/${user.image}`}
                            className="w-full h-full object-cover"
                            alt="Preview"
                          />
                        ) : (
                          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">No Image</span>
                        )}
                      </div>
                      <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-stone-900/40 opacity-0 group-hover:opacity-100 rounded-[2rem] transition-opacity">
                        <span className="text-[9px] text-white font-black uppercase tracking-widest">Change</span>
                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                      </label>
                    </div>
                    <p className="text-[9px] text-stone-300 uppercase tracking-widest font-bold">Portrait Silhouette</p>
                  </div>

                  {/* SECTION: IDENTITY */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-[#0081D1] uppercase tracking-[0.2em]">Basic Info</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-300">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#0081D1]/20 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-300">Username</label>
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#0081D1]/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="border-stone-100" />

                  {/* SECTION: SECURITY */}
                  <div className="space-y-4 pt-2">
                    <p className="text-[10px] font-black text-[#0081D1] uppercase tracking-[0.2em]">Security (Leave blank to keep current)</p>

                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-300">Current Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={formData.current_password}
                        onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                        className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#0081D1]/20 outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-300">New Password</label>
                        <input
                          type="password"
                          placeholder="New secret"
                          value={formData.new_password}
                          onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                          className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#0081D1]/20 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-300">Confirm New</label>
                        <input
                          type="password"
                          placeholder="Repeat secret"
                          value={formData.new_password_confirmation}
                          onChange={(e) => setFormData({ ...formData, new_password_confirmation: e.target.value })}
                          className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#0081D1]/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tombol Simpan (Tetap sama seperti kode sebelumnya) */}
                  <div className="pt-4 flex gap-4">
                    <button type="button" onClick={closeModal} className="...">Cancel</button>
                    <button type="submit" className="...">Save Refinements</button>
                  </div>
                </form>
              </div>

              {/* Decorative Background Element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0081D1]/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AMBIENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#0081D1]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-amber-200/10 rounded-full blur-[100px]"></div>
      </div>

      {/* MINIMALIST NAV */}
      {/* MINIMALIST NAV */}
      <nav className="fixed w-full z-50 bg-[#0081D1] backdrop-blur-xl border-b border-blue-800/20 px-8 h-20 flex items-center justify-between">
        <Link href="/" className="group flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center transition-transform group-hover:rotate-12">
            <span className="text-[#0081D1] text-[10px] font-black italic">E</span>
          </div>
          <Image
            src="/img/Logo Evomi.png"
            alt="Evomi"
            width={80}
            height={30}
            // Tambahkan invert & brightness agar logo hitam menjadi putih
            className="brightness-0 invert"
          />
        </Link>
        <div className="flex items-center space-x-8">
          <button
            onClick={handleLogout}
            // Mengubah warna teks logout menjadi putih agar kontras dengan bg biru
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors"
          >
            Logout Account
          </button>
        </div>
      </nav>

      <main className="relative pt-32 pb-20 px-8 max-w-7xl mx-auto grid md:grid-cols-12 gap-16">
        {/* LEFT: IDENTITY SECTION */}
        <div className="md:col-span-4 space-y-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            <div className="relative inline-block">
              <div className="w-32 h-40 bg-stone-200 rounded-[2.5rem] overflow-hidden relative">
                {user.image != 'default-avatar.png' ? (
                  <Image
                    src={`http://127.0.0.1:8000/storage/profiles/${user.image}`}
                    alt="Profile Picture"
                    fill
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-tr from-stone-900 to-stone-700 flex items-center justify-center">
                    <span className="text-5xl text-white uppercase">{user.name.charAt(0)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <h2 className={`${fontJudul.className} text-2xl uppercase tracking-tighter text-stone-900 leading-tight`}>
                {user.name}
              </h2>
              <p className="text-stone-400 font-light lowercase">
                @{user.username}
              </p>
            </div>

            <div className="pt-8 space-y-2">
              <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-300">Curated By</p>
              <p className="text-sm font-medium italic text-stone-600">"Scent is the most intense form of memory."</p>
            </div>

          </motion.div>

          {/* DASHBOARD NAV */}
          <div className="flex flex-col space-y-4 pt-10 border-t border-stone-200/50">
            {["cart", "identity"].map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`text-left text-[11px] uppercase tracking-[0.3em] font-bold transition-all ${activeTab === item ? "text-[#0081D1] pl-4 border-l-2 border-[#0081D1]" : "text-stone-300 hover:text-stone-500"}`}
              >
                {item === "cart" && "Shopping Bag"}
                {item === "identity" && "Identity Details"}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: CONTENT SECTION */}
        <div className="md:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="bg-white rounded-[3rem] p-12 shadow-sm border border-stone-100 min-h-[500px]"
            >
              {activeTab === "cart" && (
                <div className="space-y-10 flex flex-col h-full">
                  <div className="lg:col-span-2">
                    <ShoppingBag />
                  </div>
                </div>
              )}

              {activeTab === "identity" && (
                <div className="space-y-12">
                  <h3 className={`${fontJudul.className} text-2xl uppercase`}>Identity Details</h3>
                  <div className="grid md:grid-cols-2 gap-12">
                    <DetailItem label="Full Name" value={user.name} />
                    <DetailItem label="Unique Identifier" value={`@${user.username}`} />
                    <DetailItem label="Digital Post" value={user.email} />
                    <DetailItem label="Member Status" value="Evomi Collector" />
                  </div>
                  <div className="pt-10">
                    <button
                      onClick={() => {
                        setFormData({
                          id: user.id,
                          name: user.name,
                          username: user.username,
                          email: user.email,
                          current_password: '', // Tambahan
                          new_password: '',     // Tambahan
                          new_password_confirmation: '', // Tambahan (Laravel biasanya butuh _confirmation)
                          image: null, // Tambahan
                        });
                        setIsModalOpen(true);
                      }}
                      className="bg-stone-900 text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#0081D1] transition-all shadow-xl shadow-stone-200"
                    >
                      Modify Identity
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-300">
        {label}
      </label>
      <p className="text-lg font-light text-stone-800 border-b border-stone-50 pb-2">
        {value}
      </p>
    </div>
  );
}