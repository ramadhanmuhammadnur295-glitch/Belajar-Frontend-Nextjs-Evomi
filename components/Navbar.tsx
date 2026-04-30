import Link from "next/link";

// navbar component
export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-xl tracking-[0.3em] font-semibold">EVOMI</h1>

        <nav className="hidden md:flex gap-8 text-sm text-gray-600">
          <Link href="/produk">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="flex gap-4 text-sm">
          <button>Search</button>
          <button>Cart</button>
        </div>
      </div>
    </header>
  );
}