"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({ login: "", password: "" }); // 'login' menampung email/username
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Kredensial salah.");

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_data", JSON.stringify(data.user));

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBFBF9] px-4 font-sans">
      <div className="w-full max-w-md space-y-10 rounded-2xl bg-white p-10 shadow-sm border border-stone-100">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-stone-900">
            Evomi
          </h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
            Welcome Back
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-[10px] text-red-500 uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">
                Username or Email
              </label>
              <input
                type="text" // Diubah ke text agar bisa menerima karakter apa saja
                required
                className="border-b border-stone-200 bg-transparent py-2 outline-none focus:border-[#0081D1] transition-colors text-stone-900"
                placeholder="Enter your username or email"
                onChange={(e) =>
                  setFormData({ ...formData, login: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">
                Password
              </label>
              <input
                type="password"
                required
                className="border-b border-stone-200 bg-transparent py-2 outline-none focus:border-[#0081D1] transition-colors text-stone-900"
                placeholder="••••••••"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 py-4 text-white uppercase tracking-widest text-xs font-bold hover:bg-[#0081D1] transition-all rounded-full"
          >
            {loading ? "Entering..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 font-light">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-bold text-stone-900 underline underline-offset-4 hover:text-[#0081D1]"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
