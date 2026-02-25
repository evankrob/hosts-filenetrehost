"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Globe, Search } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FF385C 0%, #FF7245 100%)" }}>
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:block" style={{ color: "#FF385C" }}>
              StayBid
            </span>
          </Link>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
            >
              Home
            </Link>
            <Link
              href="/browse"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
            >
              Browse Trips
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/browse"
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition-all"
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline">Host? Find guests</span>
            </Link>
            <Link
              href="/post-trip"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md"
              style={{ background: "linear-gradient(135deg, #FF385C 0%, #FF7245 100%)" }}
            >
              <span>Post a Trip</span>
            </Link>
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/browse"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileOpen(false)}
            >
              Browse Trips (Hosts)
            </Link>
            <Link
              href="/post-trip"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-white rounded-lg"
              style={{ background: "#FF385C" }}
              onClick={() => setMobileOpen(false)}
            >
              Post a Trip
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
