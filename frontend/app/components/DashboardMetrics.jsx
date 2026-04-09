"use client";
import { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { getGraphStats, getTopInfluencers } from '../../services/api';
import Loader from './Loader';
import Error from './Error';
import { FaUsers, FaShareAlt, FaChartLine, FaDatabase, FaTachometerAlt, FaCrown } from 'react-icons/fa';

export default function DashboardMetrics() {
  const [stats, setStats] = useState(null);
  const [topInfluencer, setTopInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, topRes] = await Promise.all([
          getGraphStats(),
          getTopInfluencers(1)
        ]);
        setStats(statsRes);
        setTopInfluencer(topRes[0]);
      } catch (err) {
        setError('Failed to load metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <StatCard title="Total Users" value={stats.nodes.toLocaleString()} icon={<FaUsers className="text-3xl text-blue-400" />} />
      <StatCard title="Total Connections" value={stats.edges.toLocaleString()} icon={<FaShareAlt className="text-3xl text-green-400" />} />
      <StatCard title="Network Density" value={(stats.edges / (stats.nodes * (stats.nodes - 1) / 2) * 100).toFixed(2) + '%'} icon={<FaChartLine className="text-3xl text-purple-400" />} />
      <StatCard title="Avg Connections/User" value={(stats.edges / stats.nodes).toFixed(1)} icon={<FaDatabase className="text-3xl text-indigo-400" />} />
      <StatCard title="Metrics Ready" value={stats.metrics_computed ? 'Yes' : 'Processing...'} icon={<FaTachometerAlt className="text-3xl text-yellow-400" />} />
      {topInfluencer && (
        <StatCard title="Top Influencer" value={topInfluencer.user} icon={<FaCrown className="text-3xl text-orange-400" />} />
      )}
    </div>
  );
}

