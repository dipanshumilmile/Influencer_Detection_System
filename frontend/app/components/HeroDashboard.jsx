"use client";
import { loadData } from '../../services/api';
import { FaRocket, FaBolt, FaSearch } from 'react-icons/fa';

export default function HeroDashboard({ onLoadData }) {
  const handleLoad = async () => {
    await onLoadData();
  };

  return (
    <div className="text-center py-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-3xl mb-12">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
        Influencer AI Dashboard
      </h1>
      <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
        Discover top influencers in social networks using advanced graph algorithms. 
        Real-time metrics, interactive visualizations, and export-ready analysis.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
        <button
          onClick={handleLoad}
          className="flex items-center gap-3 bg-white text-indigo-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <FaRocket /> Load Network Data
        </button>
        <button className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300">
          Quick Tour
        </button>
      </div>
      <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto text-sm opacity-80">
        <div className="flex flex-col items-center gap-2">
          <FaBolt className="text-2xl" />
          <span>Lightning Fast</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FaSearch className="text-2xl" />
          <span>AI Powered</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FaRocket className="text-2xl" />
          <span>Industry Ready</span>
        </div>
      </div>
    </div>
  );
}

