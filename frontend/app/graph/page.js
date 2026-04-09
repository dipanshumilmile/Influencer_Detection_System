"use client";
import { useEffect, useState } from "react";

import GraphView from "../components/GraphView";
import Loader from "../components/Loader";
import Error from "../components/Error";
import API_BASE from "../config";


export default function GraphPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    fetch(`${API_BASE}/graph_data?limit=300`)
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (!data) return <Error message="Failed to load graph" />;

  return (
    <div className="min-h-screen bg-gradient-to-br  text-white p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-6 tracking-tight">Network Graph</h1>

        <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 shadow-lg">
          <GraphView data={data} />
        </div>

      </div>
    </div>
  );
}
