"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-brand-navy text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-3">
  {/* Using standard img to bypass the TypeScript 'props' error */}
  <img 
    src="/crab.png" 
    alt="AI Brief Logo" 
    className="w-10 h-10 object-contain" 
  />
  
  <span className="text-xl font-bold tracking-tight">
    Snap<span className="text-[#ec5334]">Brief</span>
  </span>
</Link>
          </div>
          
          {/* Desktop Menu */}


          {/* Action Button */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-800 transition-all">
              API Status: Active
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}