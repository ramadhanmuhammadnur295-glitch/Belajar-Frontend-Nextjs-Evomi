"use client";

import { useState, useEffect } from "react";

export default function AdminChatDashboard() {
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");

    const API_URL = "https://belajar-laravel-evomi-main-dlc8ss.free.laravel.cloud/api";

    // 1. Ambil daftar user yang melakukan chat
    useEffect(() => {
        const fetchConversations = async () => {
            const token = localStorage.getItem("admin_access_token");
            const res = await fetch(`${API_URL}/conversations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) setUsers(result.data);
        };
        fetchConversations();
    }, []);

    // 2. Ambil riwayat chat saat user diklik
    useEffect(() => {
        if (selectedUser) {
            const fetchMessages = async () => {
                const token = localStorage.getItem("admin_access_token");
                const res = await fetch(`${API_URL}/chats/${selectedUser.id}`, { // Menggunakan getMessages(contact_id)
                    headers: { Authorization: `Bearer ${token}` }
                });
                const result = await res.json();
                if (result.success) setMessages(result.data);
            };
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000); // Polling
            return () => clearInterval(interval);
        }
    }, [selectedUser]);

    // 3. Kirim balasan sebagai Admin
    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("admin_access_token");
        if (!input.trim() || !selectedUser) return;

        const res = await fetch(`${API_URL}/chats`, { // Menggunakan sendMessage()
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                receiver_id: selectedUser.id, // ID User tujuan
                message: input // Isi pesan
            })
        });

        const result = await res.json();
        if (result.success) {
            setMessages([...messages, result.data]);
            setInput("");
        }
    };

    return (
        <div className="flex h-screen bg-stone-100 font-sans">
            {/* Sidebar: Daftar User */}
            {/* Sidebar: Daftar User */}
            <div className="w-1/3 bg-white border-r border-stone-200 overflow-y-auto flex flex-col">
                {/* Header Sidebar */}
                <div className="p-6 border-b border-stone-100 bg-white sticky top-0 z-10">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-stone-900">
                        Messages
                    </h2>
                    <p className="text-[10px] text-stone-400 uppercase mt-1 tracking-wider">
                        {users.length} active conversations
                    </p>
                </div>

                {/* List User */}
                <div className="flex-1">
                    {users.length > 0 ? (
                        users.map((u) => (
                            <button
                                key={u.id}
                                onClick={() => setSelectedUser(u)}
                                className={`w-full p-5 flex items-center gap-4 transition-all duration-200 border-b border-stone-50 group
                        ${selectedUser?.id === u.id
                                        ? 'bg-stone-50 border-r-2 border-stone-900'
                                        : 'hover:bg-stone-50/50'
                                    }`}
                            >
                                {/* Avatar dengan Inisial Nama */}
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-[10px] tracking-tighter transition-colors
                        ${selectedUser?.id === u.id
                                        ? 'bg-stone-900 text-white'
                                        : 'bg-stone-100 text-stone-500 group-hover:bg-stone-200'
                                    }`}>
                                    {u.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                                </div>

                                {/* Info User */}
                                <div className="text-left flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <p className="text-xs font-bold text-stone-800 uppercase tracking-wider truncate">
                                            {u.name}
                                        </p>
                                        {/* Dot Indikator Pesan Baru (Opsional) */}
                                        <span className="w-1.5 h-1.5 rounded-full bg-stone-300"></span>
                                    </div>
                                    <p className="text-[11px] text-stone-400 truncate tracking-tight">
                                        @{u.username}
                                    </p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="p-10 text-center">
                            <p className="text-[10px] text-stone-400 uppercase tracking-widest">No messages yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat: Balas Pesan */}
            {/* Main Chat: Balas Pesan */}
            <div className="flex-1 flex flex-col bg-[#FBFBF9]">
                {selectedUser ? (
                    <>
                        {/* Header Chat */}
                        <div className="p-5 bg-white border-b border-stone-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px] font-bold">
                                    {selectedUser.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="font-bold text-[10px] uppercase tracking-[0.2em] text-stone-800">
                                    {selectedUser.name}
                                </div>
                            </div>
                        </div>

                        {/* Area Pesan */}
                        {/* Area Pesan */}
                        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-8 bg-[#FBFBF9]">
                            {messages.map((m, i) => {
                                // Logika penentuan pengirim:
                                // Jika m.sender_id sama dengan selectedUser.id, berarti itu pesan dari USER (Kiri)
                                // Jika berbeda, berarti itu balasan dari ANDA/ADMIN (Kanan)
                                const isIncoming = m.sender_id === selectedUser.id;

                                return (
                                    <div
                                        key={i}
                                        className={`flex flex-col ${isIncoming ? 'items-start' : 'items-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                                    >
                                        {/* Nama Pengirim di atas bubble chat */}
                                        <span className={`text-[10px] font-black uppercase tracking-[0.15em] mb-2 px-1 ${isIncoming ? 'text-stone-500' : 'text-stone-400'}`}>
                                            {isIncoming ? selectedUser.name : 'Administrator'}
                                        </span>

                                        {/* Bubble Chat */}
                                        <div className={`relative max-w-[70%] px-5 py-3.5 rounded-2xl text-[13px] leading-relaxed
                    ${isIncoming
                                                ? 'bg-white text-stone-800 rounded-tl-none border border-stone-200 shadow-sm'
                                                : 'bg-stone-900 text-stone-50 rounded-tr-none shadow-md'
                                            }`}
                                        >
                                            {m.message}

                                            {/* Ekor Bubble (Opsional untuk estetika clean) */}
                                            <div className={`absolute top-0 w-2 h-2 ${isIncoming ? '-left-1 bg-white border-l border-t border-stone-200 rotate-[-45deg]' : '-right-1 bg-stone-900 rotate-[45deg]'}`}></div>
                                        </div>

                                        {/* Timestamp (Opsional) */}
                                        <span className="text-[9px] text-stone-400 mt-2 opacity-70 tracking-tighter">
                                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input Form */}
                        <form onSubmit={handleReply} className="p-6 bg-white border-t border-stone-100 flex gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Write a message..."
                                className="flex-1 bg-stone-50 border border-stone-200 px-5 py-3 rounded-full outline-none text-sm focus:border-stone-400 transition-colors"
                            />
                            <button
                                type="submit"
                                className="px-8 py-3 bg-stone-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-stone-800 transition-all active:scale-95"
                            >
                                Send
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-stone-300 uppercase tracking-[0.4em] text-[10px]">
                        Select a conversation to begin
                    </div>
                )}
            </div>
        </div>
    );
}