"use client";
import { useState } from 'react';
import { exportCSV } from '../../services/api';
import Loader from './Loader';

export default function QuickActions() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      await exportCSV();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-black hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <h3 className="text-xl font-semibold mb-4 text-bleck">💾 Export Report</h3>
        <button
          onClick={handleExport}
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white py-3 px-6 rounded-2xl font-medium hover:from-emerald-500 hover:to-teal-600 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? <Loader /> : 'Download CSV'}
        </button>
      </div>
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <h3 className="text-xl font-semibold mb-4 text-black">⚡ Run Analysis</h3>
        <button onClick={() => window.location.href = '/analysis'} className="w-full bg-gradient-to-r from-blue-400 to-indigo-500 text-white py-3 px-6 rounded-2xl font-medium hover:from-blue-500 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300">
          View Full Analysis →
        </button>
      </div>
      {/* <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <h3 className="text-xl font-semibold mb-4 text-white">🔍 Search User</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="User ID"
            className="flex-1 bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:border-white"
          /> */}
          {/* <button className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-6 py-2 rounded-xl font-medium hover:from-purple-500 hover:to-pink-600">
            Search
          </button> */}
        {/* </div>
      </div> */}
      {/* <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <h3 className="text-xl font-semibold mb-4 text-white">📊 Full Report</h3>
        <button className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white py-3 px-6 rounded-2xl font-medium hover:from-orange-500 hover:to-red-600">
          Generate PDF
        </button>
      </div> */}
    </div>
  );
}

