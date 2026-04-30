"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";

// Interface berdasarkan struktur database products.sql
interface Product {
    id: string;
    nama: string;
    deskripsi?: string;
    ukuran?: string;
    konsentrasi?: string;
    gender?: string;
    ketahanan?: string;
    vibe?: string;
    image_url?: string;
    harga_retail: number;
    stok_tersedia: number;
    status_stok?: string;
}

// MAIN COMPONENT
export default function ProductsMenu() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Tambahkan di deretan state yang sudah ada
    const [successModal, setSuccessModal] = useState({
        isOpen: false,
        message: "",
        type: "" // 'create', 'update', atau 'delete'
    });

    const showSuccess = (message: string, type: string) => {
        setSuccessModal({ isOpen: true, message, type });

        // Otomatis tutup setelah 3 detik jika user tidak mengklik "Tutup"
        setTimeout(() => {
            setSuccessModal(prev => ({ ...prev, isOpen: false }));
        }, 3000);
    };


    const [formData, setFormData] = useState({
        id: "", // Manual input karena di SQL berupa varchar(50) (e.g., EVO-001)
        nama: "",
        harga_retail: 0,
        stok_tersedia: 0,
        ukuran: "50ml",
        konsentrasi: "Eau de Parfum (EDP)",
        vibe: "",
        deskripsi: ""
    });

    const API_URL = "http://localhost:8000/api/products";

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // HANDLER FUNCTIONS
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // handle file change
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setImageFile(e.target.files[0]);
    };

    // open create modal
    const openCreateModal = () => {
        setFormData({ id: "", nama: "", harga_retail: 0, stok_tersedia: 0, ukuran: "50ml", konsentrasi: "Eau de Parfum (EDP)", vibe: "", deskripsi: "" });
        setImageFile(null);
        setEditingId(null);
        setIsModalOpen(true);
    };

    // open edit modal
    const openEditModal = (product: Product) => {
        setFormData({
            id: product.id,
            nama: product.nama,
            harga_retail: Number(product.harga_retail),
            stok_tersedia: product.stok_tersedia,
            ukuran: product.ukuran || "",
            konsentrasi: product.konsentrasi || "",
            vibe: product.vibe || "",
            deskripsi: product.deskripsi || ""
        });
        setEditingId(product.id);
        setImageFile(null);
        setIsModalOpen(true);
    };

    // submit form
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Gunakan FormData karena menyertakan Upload File
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value.toString());
        });
        if (imageFile) data.append("image", imageFile);

        // Endpoint: POST /products untuk create, POST /products/{id} untuk update (sesuai controller Laravel Anda)
        const url = editingId ? `${API_URL}/${editingId}` : API_URL;

        try {
            const res = await fetch(url, {
                method: "POST", // Laravel update dengan file biasanya butuh POST
                body: data,
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchProducts();
                showSuccess(
                    editingId ? "Produk berhasil diperbarui!" : "Produk baru berhasil ditambahkan!",
                    editingId ? "update" : "create"
                );
                fetchProducts();
            }
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    // handle delete
    const handleDelete = async (id: string) => {
        if (!confirm(`Hapus produk ${id}?`)) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchProducts();
                showSuccess("Produk telah dihapus dari katalog.", "delete"); fetchProducts();
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    // render page
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Success Popup Modal */}
            {successModal.isOpen && (
                <div className="fixed bottom-10 right-10 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-2xl p-4 flex items-center gap-4 min-w-[320px] backdrop-blur-lg bg-white/90">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${successModal.type === 'delete' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                            }`}>
                            {successModal.type === 'delete' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-1.816c0-1.107-.893-2.003-2.01-2.003h-2.23c-1.107 0-2.01.896-2.01 2.003V6" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                            )}
                        </div>

                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-900">Berhasil!</h4>
                            <p className="text-xs text-gray-500">{successModal.message}</p>
                        </div>

                        <button
                            onClick={() => setSuccessModal({ ...successModal, isOpen: false })}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Inventory Evomi</h1>
                        <p className="text-sm text-gray-500">Manajemen katalog produk parfum dari database.</p>
                    </div>
                    <button onClick={openCreateModal} className="bg-black text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all">
                        + Produk Baru
                    </button>
                </div>

                {/* Tabel Produk */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            {/* Header: Sembunyikan di Mobile, Tampilkan di Desktop */}
                            <thead className="hidden md:table-header-group bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Produk</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Info</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Harga</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Stok</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-50 flex flex-col md:table-row-group">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="p-10 text-center text-gray-400">
                                            Menghubungkan ke database...
                                        </td>
                                    </tr>
                                ) : products.map((p) => (
                                    /* TR: Diubah menjadi flex-col di mobile agar menumpuk ke bawah */
                                    <tr
                                        key={p.id}
                                        className="hover:bg-gray-50/50 transition-colors flex flex-col md:table-row p-4 md:p-0"
                                    >
                                        {/* Kolom Produk */}
                                        <td className="px-0 py-2 md:px-6 md:py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                                                    {p.image_url ? (
                                                        <img src={p.image_url} alt={p.nama} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No Img</div>
                                                    )}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <div className="text-sm font-bold text-gray-900 truncate">{p.nama}</div>
                                                    <div className="text-[10px] text-gray-400 font-mono tracking-tighter">{p.id}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Kolom Info */}
                                        <td className="px-0 py-2 md:px-6 md:py-4">
                                            <div className="flex flex-col">
                                                <span className="md:hidden text-[9px] font-bold text-gray-400 uppercase mb-1">Detail Produk</span>
                                                <div className="text-xs text-gray-600 font-medium">{p.ukuran} | {p.konsentrasi}</div>
                                                <div className="text-[10px] text-gray-400 italic mt-1 line-clamp-1">{p.vibe}</div>
                                            </div>
                                        </td>

                                        {/* Kolom Harga & Stok: Dibuat berdampingan di mobile */}
                                        <td className="px-0 py-2 md:px-6 md:py-4">
                                            <div className="flex md:block justify-between items-center">
                                                <div className="flex flex-col md:block">
                                                    <span className="md:hidden text-[9px] font-bold text-gray-400 uppercase">Harga</span>
                                                    <span className="text-sm font-bold text-stone-900">Rp {Number(p.harga_retail).toLocaleString('id-ID')}</span>
                                                </div>

                                                {/* Stok (Hanya terlihat labelnya di mobile) */}
                                                <div className="md:hidden flex flex-col items-end">
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase mb-1">Persediaan</span>
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${p.stok_tersedia > 10 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                                        {p.stok_tersedia} Pcs
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Kolom Stok Original (Hanya tampil di Desktop) */}
                                        <td className="hidden md:table-cell px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${p.stok_tersedia > 10 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                                {p.stok_tersedia} Pcs
                                            </span>
                                        </td>

                                        {/* Kolom Aksi */}
                                        <td className="px-0 py-4 md:px-6 md:py-4 border-t md:border-t-0 mt-2 md:mt-0 pt-4 md:pt-4">
                                            <div className="flex items-center justify-end gap-4 md:gap-3">
                                                <button
                                                    onClick={() => openEditModal(p)}
                                                    className="flex-1 md:flex-none py-2 md:py-0 bg-indigo-50 md:bg-transparent text-indigo-600 hover:text-indigo-800 text-xs font-bold rounded-lg transition-all"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    className="flex-1 md:flex-none py-2 md:py-0 bg-red-50 md:bg-transparent text-red-500 hover:text-red-700 text-xs font-bold rounded-lg transition-all"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal CRUD */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden">
                            <form onSubmit={handleSubmit}>
                                <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
                                    <h2 className="text-xl font-bold">{editingId ? 'Update Parfum' : 'Tambah Koleksi Baru'}</h2>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">✕</button>
                                </div>

                                <div className="p-8 grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">SKU ID (e.g., EVO-001)</label>
                                            <input name="id" value={formData.id} onChange={handleInputChange} disabled={!!editingId} className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm outline-none focus:border-black disabled:opacity-50" required />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Nama Parfum</label>
                                            <input name="nama" value={formData.nama} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm outline-none focus:border-black" required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Harga (IDR)</label>
                                                <input type="number" name="harga_retail" value={formData.harga_retail} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm outline-none focus:border-black" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Stok</label>
                                                <input type="number" name="stok_tersedia" value={formData.stok_tersedia} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm outline-none focus:border-black" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Gambar Produk</label>
                                            <input type="file" onChange={handleFileChange} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Vibe / Karakter</label>
                                            <input name="vibe" value={formData.vibe} onChange={handleInputChange} placeholder="e.g. Luxurious, Fresh" className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm outline-none focus:border-black" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Deskripsi Singkat</label>
                                            <textarea name="deskripsi" value={formData.deskripsi} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm outline-none focus:border-black resize-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="px-8 py-6 bg-gray-50 flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600">Batal</button>
                                    <button type="submit" className="px-8 py-2 bg-black text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all">
                                        {editingId ? 'Simpan Perubahan' : 'Publish Produk'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}