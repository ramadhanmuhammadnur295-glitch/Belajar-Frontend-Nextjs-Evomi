'use client';

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ShieldCheck, Save, Camera, LogOut, ChevronRight, Trash2 } from "lucide-react";


export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'success' });

  const showModal = (title: any, message: any, type = 'success') => {
    setModalConfig({ title, message, type });

    setIsModalOpen(true);
  };

  // 1. Fungsi Fetching Utama
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://127.0.0.1:8000/api/admin/dashboard-stats/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        router.push('/admin-login');
        return;
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Gagal mengambil data:', error);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
    password: "",
  });

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

  const router = useRouter();

  useEffect(() => {
    fetchData();
    fetchUserData();
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch('http://127.0.0.1:8000/api/admin/dashboard-stats/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          router.push('/login');
          return;
        }

        const data = await response.json();
        // Di dalam useEffect setelah const data = await response.json();

        // Hitung pendapatan hanya dari status 'success'
        const calculatedRevenue = data.recent_orders?.reduce((acc: number, order: { status_pembayaran: string; total_harga: string; }) => {
          return order.status_pembayaran === 'success'
            ? acc + parseFloat(order.total_harga)
            : acc;
        }, 0) || 0;

        // Simpan ke state dengan nilai yang sudah difilter
        setStats({
          ...data,
          total_revenue_success: calculatedRevenue
        });

        // setStats(data);
      } catch (error) {
        console.error('Gagal mengambil data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);


  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  const handleStatusChange = async (orderId: any, newStatus: string) => {
    const token = localStorage.getItem('admin_token');

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/orders/${orderId}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status_pembayaran: newStatus,
          _method: 'PUT' // Tambahkan spoofing method agar Laravel membacanya sebagai PUT
        }),
      });

      if (response.ok) {
        // Update data di UI secara lokal agar tidak perlu refresh halaman
        setStats((prevStats: { recent_orders: any[]; }) => ({
          ...prevStats,
          recent_orders: prevStats.recent_orders.map((order) =>
            order.id === orderId ? { ...order, status_pembayaran: newStatus } : order
          ),
        }));
        // AUTO REFRESH DATA TANPA RELOAD HALAMAN
        // GANTI ALERT LAMA DENGAN INI:
        showModal(
          "Update Berhasil",
          `Status pesanan #${orderId} sekarang menjadi ${newStatus}.`,
          "success"
        );
        await fetchData();
      } else {
        showModal("Gagal", "Terjadi kesalahan saat memperbarui status.", "error");
      }
    } catch (error) {
      showModal("Koneksi Error", "Pastikan server Laravel kamu menyala.", "error");
    }
  };

  const handleDeleteOrder = async (orderId: any) => {
    const token = localStorage.getItem('admin_token');

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Update data di UI secara lokal agar hilang dari tabel seketika
        setStats((prevStats: any) => ({
          ...prevStats,
          recent_orders: prevStats.recent_orders.filter((order: any) => order.id !== orderId),
        }));

        // Memanggil custom modal popup, menghindari dialog bawaan browser lama
        showModal(
          "Pesanan Dihapus",
          `Data pesanan #${orderId} telah berhasil dihapus dari sistem.`,
          "success"
        );
        await fetchData();
      } else {
        showModal("Gagal", "Terjadi kesalahan saat menghapus pesanan.", "error");
      }
    } catch (error) {
      showModal("Koneksi Error", "Pastikan server Laravel kamu menyala.", "error");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* --- CUSTOM MODAL POPUP --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-sm overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
            <div className="p-8 text-center">
              {/* Icon Berdasarkan Type */}
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-4 ${modalConfig.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                {modalConfig.type === 'success' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">{modalConfig.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                {modalConfig.message}
              </p>

              <button
                onClick={() => {
                  setIsModalOpen(false);
                  window.location.reload();
                }}
                className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg ${modalConfig.type === 'success'
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                  : 'bg-red-600 hover:bg-red-700 shadow-red-100'
                  }`}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto p-6 sm:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Ringkasan aktivitas toko Evomi hari ini.</p>
        </header>

        {/* Kartu Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Produk</p>
            <h3 className="text-4xl font-extrabold text-gray-900 mt-2">{stats?.total_products || 0}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Pesanan</p>
            <h3 className="text-4xl font-extrabold text-gray-900 mt-2">{stats?.total_orders || 0}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Pendapatan</p>
            <h3 className="text-4xl font-extrabold text-indigo-600 mt-2">{new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            }).format(stats?.total_revenue_success || 0)}</h3>
          </div>
        </div>

        {/* Tabel Pesanan Terbaru */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-600 text-xs uppercase font-bold tracking-widest">
                <tr>
                  <th className="p-4">ID Pesanan</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Total</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats?.recent_orders?.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Ubah ini di tabel dashboard kamu */}
                    <td className="p-4 font-semibold text-gray-700">
                      <button
                        onClick={() => router.push(`/admin/orders/${order.id}`)}
                        className="hover:text-indigo-600 hover:underline transition-all flex items-center gap-1"
                      >
                        #{order.id}
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
                      </button>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status_pembayaran || 'pending'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-none outline-none cursor-pointer transition-all ${order.status_pembayaran === 'success'
                          ? 'bg-green-100 text-green-700'
                          : order.status_pembayaran === 'failed' || order.status_pembayaran === 'expired'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                          }`}
                      >
                        <option value="pending" className="bg-white text-gray-800">Pending</option>
                        <option value="success" className="bg-white text-gray-800">Success</option>
                        <option value="expired" className="bg-white text-gray-800">Cancel / Expired</option>
                        <option value="failed" className="bg-white text-gray-800">Failed</option>
                      </select>
                    </td>
                    <td className="p-4 font-bold text-gray-900">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                      }).format(order.total_harga || 0)}
                    </td>
                    {/* --- Kolom Tombol Hapus --- */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors inline-flex items-center justify-center"
                        title="Hapus Pesanan"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}