"use client";
import { useState, useEffect } from 'react';
import { getTopInfluencers } from '../../services/api';
import InfluencerTable from './InfluencerTable';
import Loader from './Loader';
import Error from './Error';

export default function RecentInfluencers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTopInfluencers(5).then(setData).catch(err => setError(err)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">🏆 Top Influencers</h2>
        <button className="text-indigo-300 hover:text-white text-sm font-medium">View All →</button>
      </div>
      <div className="overflow-x-auto">
        <InfluencerTable data={data.slice(0,5)} />
      </div>
    </div>
  );
}

