"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ShoppingBag from "@/components/ShoppingBag";

// Font Setup (Sesuaikan path jika perlu)
const fontJudul = localFont({
  src: "../fonts/8 Heavy.ttf",
  variable: "--font-brand",
});

const fontCaption = localFont({
  src: "../fonts/Nohemi-Regular.otf",
  variable: "--font-body",
});

export default function LuxuryProfilePage() {

  // State untuk menyimpan data form (jika diperlukan untuk modifikasi identitas)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
  });

  // State untuk mengelola modal (jika diperlukan untuk modifikasi identitas)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [user, setUser] = useState<{
    name: string;
    username: string;
    email: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("cart");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchUserData = async () => {
      const token = localStorage.getItem("access_token");

      // Jika tidak ada token, langsung kembalikan ke halaman login
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Memanggil endpoint bawaan Laravel Sanctum untuk mengambil data user yang sedang login
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

          // (Opsional) Perbarui localStorage agar tetap sinkron untuk kebutuhan komponen lain
          localStorage.setItem("user_data", JSON.stringify(userData));
        } else if (response.status === 401) {
          // Token kadaluarsa atau tidak valid, bersihkan sesi dan tendang ke login
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_data");
          router.push("/login");
        }
      } catch (error) {
        console.error("Gagal mengambil data identitas:", error);
        // Fallback: Gunakan data lokal jika server sedang gangguan
        const savedUser = localStorage.getItem("user_data");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
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

  // Fungsi untuk menangani submit form modifikasi identitas
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/update", { // Sesuaikan endpoint Laravel Anda
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          // email biasanya tidak diubah di sini
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();

        // 1. Update state user lokal agar UI langsung berubah
        setUser(updatedUser);

        // 2. Update localStorage agar saat refresh data tetap baru
        localStorage.setItem("user_data", JSON.stringify(updatedUser));

        // 3. Tutup modal
        setIsModalOpen(false);

        alert("Identity successfully refined.");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Connection to server failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !user) return null;

  return (
    <div
      className={`${fontCaption.variable} ${fontJudul.variable} min-h-screen bg-[#FBFBF9] font-sans text-stone-900 selection:bg-[#0081D1]/20`}
    >

      {/* MODAL MODIFY IDENTITY */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-md"
            />

            {/* Modal Content */}
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

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-300">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#0081D1]/20 outline-none transition-all"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-300">Username</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#0081D1]/20 outline-none transition-all"
                      placeholder="Unique handle"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-300">Digital Post (Email)</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 text-sm text-stone-400 cursor-not-allowed italic"
                    />
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest border border-stone-100 hover:bg-stone-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-stone-900 text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#0081D1] transition-all shadow-lg shadow-stone-200"
                    >
                      Save Changes
                    </button>
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
      <nav className="fixed w-full z-50 bg-white/30 backdrop-blur-xl border-b border-stone-200/30 px-8 h-20 flex items-center justify-between">
        <Link href="/" className="group flex items-center space-x-3">
          <div className="w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12">
            <span className="text-white text-[10px] font-black italic">E</span>
          </div>
          <Image
            src="/img/Logo Evomi.png"
            alt="Evomi"
            width={80}
            height={30}
            className="brightness-0"
          />
        </Link>
        <div className="flex items-center space-x-8">
          <button
            onClick={handleLogout}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-red-500 transition-colors"
          >
            Logout Account
          </button>
        </div>
      </nav>

      <main className="relative pt-32 pb-20 px-8 max-w-7xl mx-auto grid md:grid-cols-12 gap-16">
        {/* LEFT: IDENTITY SECTION */}
        <div className="md:col-span-4 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="relative inline-block">
              <div className="w-32 h-40 bg-stone-200 rounded-[2.5rem] overflow-hidden relative shadow-2xl shadow-stone-200">
                <div className="absolute inset-0 bg-gradient-to-tr from-stone-900 to-stone-700 flex items-center justify-center">
                  <span
                    className={`${fontJudul.className} text-5xl text-white uppercase`}
                  >
                    {user.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#0081D1] rounded-full border-4 border-[#FBFBF9] flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>

            <div className="space-y-1">
              <h2
                className={`${fontJudul.className} text-2xl uppercase tracking-tighter text-stone-900 leading-tight`}
              >
                {user.name}
              </h2>
              <p className="text-stone-400 font-light lowercase">
                @{user.username}
              </p>
            </div>

            <div className="pt-8 space-y-2">
              <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-300">
                Curated By
              </p>
              <p className="text-sm font-medium italic text-stone-600">
                "Scent is the most intense form of memory."
              </p>
            </div>
          </motion.div>

          {/* DASHBOARD NAV */}
          <div className="flex flex-col space-y-4 pt-10 border-t border-stone-200/50">
            {/* Menambahkan 'cart' ke dalam array menu */}
            {["cart", "identity"].map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`text-left text-[11px] uppercase tracking-[0.3em] font-bold transition-all ${activeTab === item ? "text-[#0081D1] pl-4 border-l-2 border-[#0081D1]" : "text-stone-300 hover:text-stone-500"}`}
              >
                {/* {item === "vault" && "Scent Vault"} */}
                {item === "cart" && "Shopping Bag"}
                {/* {item === "history" && "Acquisition History"} */}
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
              {/* {activeTab === "vault" && (
                <div className="space-y-10">
                  <div className="flex justify-between items-end">
                    <h3 className={`${fontJudul.className} text-2xl uppercase`}>
                      Personal Vault
                    </h3>
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                      3 Signature Essences
                    </span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                    {["Peaceful Calm", "Sweet Shy", "Rabel Brave"].map(
                      (scent, i) => (
                        <div key={i} className="group cursor-pointer space-y-4">
                          <div className="aspect-[3/4] bg-stone-50 rounded-2xl overflow-hidden relative">
                            <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/5 transition-all duration-500"></div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest">
                              {scent}
                            </p>
                            <p className="text-[9px] text-stone-400 uppercase">
                              Owned • 50ml
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )} */}

              {/* TAB BARU: CART / SHOPPING BAG */}
              {activeTab === "cart" && (
                <div className="space-y-10 flex flex-col h-full">
                  {/* <div className="flex justify-between items-end">
                    <h3 className={`${fontJudul.className} text-2xl uppercase`}>
                      Shopping Bag
                    </h3>
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                      2 Items
                    </span>
                  </div> */}

                  {/* Area Konten Utama */}
                  <div className="lg:col-span-2">
                    <ShoppingBag />
                  </div>
                </div>
              )}

              {activeTab === "identity" && (
                <div className="space-y-12">
                  <h3 className={`${fontJudul.className} text-2xl uppercase`}>
                    Identity Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-12">
                    <DetailItem label="Full Name" value={user.name} />
                    <DetailItem
                      label="Unique Identifier"
                      value={`@${user.username}`}
                    />
                    <DetailItem label="Digital Post" value={user.email} />
                    <DetailItem label="Member Status" value="Evomi Collector" />
                  </div>
                  <div className="pt-10">
                    {/* <button className="bg-stone-900 text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#0081D1] transition-all shadow-xl shadow-stone-200">
                      Modify Identity
                    </button> */}

                    <button
                      onClick={() => {
                        setFormData({
                          name: user.name,
                          username: user.username,
                          email: user.email
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

              {/* {activeTab === "history" && (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center space-y-6">
                  <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-200">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="square"
                        strokeWidth="1"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <p className="text-stone-400 text-[10px] uppercase tracking-[0.3em]">
                    No acquisitions found in your records.
                  </p>
                  <Link
                    href="/produk"
                    className="text-[#0081D1] text-[10px] font-bold uppercase tracking-widest border-b border-blue-200 pb-1"
                  >
                    Begin Journey
                  </Link>
                </div>
              )} */}
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
