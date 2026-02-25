import Link from "next/link";
import { Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FF385C 0%, #FF7245 100%)" }}>
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg" style={{ color: "#FF385C" }}>StayBid</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              The reverse vacation rental marketplace. Post your trip, get offers from local hosts.
            </p>
          </div>

          {/* Travelers */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">For Travelers</h3>
            <ul className="space-y-2">
              <li><Link href="/post-trip" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Post a Trip Request</Link></li>
              <li><Link href="/browse" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Browse Open Trips</Link></li>
              <li><Link href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Hosts */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">For Hosts</h3>
            <ul className="space-y-2">
              <li><Link href="/browse" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Find Guests</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Host Sign Up</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Host Guidelines</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Press</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Blog</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© 2026 StayBid, Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Privacy</Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Terms</Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
