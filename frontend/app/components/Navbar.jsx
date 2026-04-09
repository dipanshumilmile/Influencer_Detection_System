"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-gray-900 to-indigo-950/80 backdrop-blur-xl shadow-2xl border-b border-gray-800/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Influencer AI
          </h2>
          <div className="flex gap-2">
            <Link href="/" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all font-medium">
              Dashboard
            </Link>
            <Link href="/analysis" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all font-medium">
              Analysis
            </Link>
            <Link href="/graph" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all font-medium">
              Graph
            </Link>
            <Link href="/influencers" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all font-medium">
              Influencers
            </Link>
            <Link href="/stats" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all font-medium">
              Stats
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
