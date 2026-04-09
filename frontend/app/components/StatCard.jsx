"use client";
import { FaChartBar } from 'react-icons/fa';

export default function StatCard({ title, value, icon, trend }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 hover:border-indigo-200 hover:-translate-y-2 group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl group-hover:scale-110 transition-transform">
          {icon || <FaChartBar className="text-2xl text-indigo-600" />}
        </div>
        {trend && (
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend > 0 ? `+${trend}%` : `${trend}%`}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 font-medium">{title}</p>
    </div>
  );
}

