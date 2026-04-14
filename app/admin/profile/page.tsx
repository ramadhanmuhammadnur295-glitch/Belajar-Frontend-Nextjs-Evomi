"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ShieldCheck, Save, Camera, LogOut } from "lucide-react";

export default function UserProfilePage() {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    // Menggunakan admin_token agar sama dengan dashboard home kamu
    const token = localStorage.getItem("admin_token"); 
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/me", {
        headers: { 
            Authorization: `Bearer ${token}`, 
            Accept: "application/json" 
        },
      });

      if (res.status === 401) {
        router.push('/admin-login');
        return;
      }

      const result = await res.json();
      if (result.success) {
        setFormData({ ...result.data, password: "" });
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) return;

    setIsUpdating(true);
    setMessage({ type: "", text: "" });
    const token = localStorage.getItem("admin_token");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/users/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
        setFormData({ ...formData, password: "" });
      } else {
        setMessage({ type: "error", text: result.message || "Gagal memperbarui profil" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Terjadi kesalahan koneksi" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('admin_token');
    try {
      await fetch('http://127.0.0.1:8000/api/admin/logout', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error("Gagal logout:", error);
    } finally {
      localStorage.removeItem('admin_token');
      router.push('/admin-login');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* --- NAVBAR (Identik dengan Dashboard) --- */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/admin/dashboard')}>
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                E
              </div>
              <span className="text-xl font-bold text-gray-800 tracking-tight">Evomi Admin</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right mr-2">
                <p className="text-sm font-semibold text-gray-700 leading-none">{formData.name}</p>
                <p className="text-xs text-gray-500 mt-1">Status: Online</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm border border-gray-200 hover:border-red-200 shadow-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto p-6 sm:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan Akun</h1>
          <p className="text-gray-500 mt-1">Kelola informasi profil dan keamanan akun Anda.</p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Left Side: Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="h-28 w-28 rounded-full border-4 border-gray-50 p-1 bg-white shadow-sm">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-3xl font-bold border border-indigo-100">
                      {formData.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <button className="absolute bottom-1 right-1 rounded-full bg-white border border-gray-200 p-2 text-gray-600 hover:text-indigo-600 hover:shadow-md transition-all">
                    <Camera size={16} />
                  </button>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{formData.name}</h3>
                <p className="text-gray-500 text-sm">@{formData.username}</p>
                
                <div className="mt-4 flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full border border-green-100">
                  <ShieldCheck size={14} />
                  Verified Admin
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50 space-y-1">
                <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold bg-indigo-50 text-indigo-700 transition-all">
                  <User size={18} /> Ringkasan Profil
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {message.text && (
                <div className={`mb-6 flex items-center gap-2 rounded-xl border p-4 text-sm font-medium ${
                  message.type === "success" 
                    ? "border-green-200 bg-green-50 text-green-700" 
                    : "border-red-200 bg-red-50 text-red-700"
                }`}>
                  <p>{message.text}</p>
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Informasi Pribadi</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative">
                      <User className="absolute left-4 top-3 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="Nama Lengkap"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-12 pr-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-gray-800"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <span className="absolute left-4 top-2.5 text-gray-400 font-bold text-sm">@</span>
                        <input
                          type="text"
                          placeholder="Username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 outline-none focus:border-indigo-500 transition-all text-gray-800"
                          required
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3 text-gray-400" size={18} />
                        <input
                          type="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-12 pr-4 outline-none focus:border-indigo-500 transition-all text-gray-800"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Keamanan Akun</h4>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3 text-gray-400" size={18} />
                    <input
                      type="password"
                      placeholder="Kata Sandi Baru (Kosongkan jika tidak diganti)"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-12 pr-4 outline-none focus:border-indigo-500 transition-all text-gray-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-50">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-10 py-3 font-bold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 disabled:opacity-50"
                  >
                    {isUpdating ? "Menyimpan..." : <><Save size={18} /> Simpan Perubahan</>}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}