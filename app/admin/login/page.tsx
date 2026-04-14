// // app/admin/login/page.tsx
// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function AdminLogin() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const router = useRouter();

//     const handleLogin = async (e: React.FormEvent) => {
//         e.preventDefault();
//         const res = await fetch("http://127.0.0.1:8000/api/admin/login", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Accept: "application/json",
//             },
//             body: JSON.stringify({ email, password }),

//         });

//         console.log({ "data": email, password });
//         console.log({ "response": res });
        
//         const data = await res.json();
//         if (res.ok) {
//             localStorage.setItem("admin_token", data.token);
//             router.push("/admin/dashboard");
//         } else {
//             alert(data.message);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
//             <div className="w-full max-w-md p-12 bg-white border border-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
//                 <div className="text-center mb-10">
//                     <h1 className="text-2xl font-light tracking-[0.4em] uppercase">Evomi</h1>
//                     <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-2 font-bold">Administrative Access</p>
//                 </div>
//                 <form onSubmit={handleLogin} className="space-y-6">
//                     <div>
//                         <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold block mb-2">Email</label>
//                         <input
//                             type="email"
//                             className="w-full border-b border-stone-200 py-3 outline-none focus:border-black transition-all text-sm"
//                             onChange={(e) => setEmail(e.target.value)}
//                         />
//                     </div>
//                     <div>
//                         <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold block mb-2">Password</label>
//                         <input
//                             type="password"
//                             className="w-full border-b border-stone-200 py-3 outline-none focus:border-black transition-all text-sm"
//                             onChange={(e) => setPassword(e.target.value)}
//                         />
//                     </div>
//                     <button className="w-full bg-stone-900 text-white py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-black transition-all mt-8">
//                         Sign In
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }