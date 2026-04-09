"use client";
import { useEffect, useState } from "react";

import InfluencerTable from "../components/InfluencerTable";
import InfluenceChart from "../components/InfluenceChart";
import Loader from "../components/Loader";
import Error from "../components/Error";
import API_BASE from "../config";

export default function InfluencersPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/top_influencers?limit=10`)
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    if (!userId) return;

    fetch(`${API_BASE}/search_user?user_id=${userId}`)
      .then(res => res.json())
      .then(res => setUserData(res.data || null));
  };

  if (loading) return <Loader />;
  if (!data) return <Error message="Failed to load influencers" />;

  return (
    <div className="min-h-screen  text-white p-6 ">
      <div className="max-w-6xl mx-auto space-y-8">

        <h1 className="text-4xl font-bold mb-6 tracking-tight">Influencer Dashboard</h1>
        <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 shadow-lg mt-8">
          <h2 className="text-2xl font-semibold mb-4">Search User</h2>

          <div className="flex gap-3">
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user id"
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <button
              onClick={handleSearch}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium"
            >
              Search
            </button>
          </div>

          {/* User Result */}
          {userData && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <p className="text-sm text-gray-400">User</p>
                <p className="font-semibold">{userData.user}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <p className="text-sm text-gray-400">Score</p>
                <p className="font-semibold">{userData.combined.toFixed(4)}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <p className="text-sm text-gray-400">PageRank</p>
                <p className="font-semibold">{userData.pagerank.toFixed(4)}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <p className="text-sm text-gray-400">InDegree</p>
                <p className="font-semibold">{userData.indegree.toFixed(4)}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <p className="text-sm text-gray-400">Betweenness</p>
                <p className="font-semibold">{userData.betweenness.toFixed(4)}</p>
              </div>
            </div>
          )}
        </div>


        {/* Chart */}
        <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Top Influencers Chart</h2>
          <InfluenceChart data={data} />
        </div>

        {/* Table */}
        <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 shadow-lg mt-8">
          <h2 className="text-2xl font-semibold mb-4">Top Influencers</h2>
          <InfluencerTable data={data} />
        </div>

        {/* Search */}
        
      </div>
    </div>
  );
}