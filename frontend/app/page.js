"use client";
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroDashboard from './components/HeroDashboard';
import DashboardMetrics from './components/DashboardMetrics';
import QuickActions from './components/QuickActions';
import RecentInfluencers from './components/RecentInfluencers';
import GraphView from './components/GraphView';
import InfluenceChart from './components/InfluenceChart';
import { getTopInfluencers, getGraphData } from '../services/api';
import Loader from './components/Loader';

export default function Dashboard() {
  const [topData, setTopData] = useState([]);
  const [graphSample, setGraphSample] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const [topInf, graph] = await Promise.all([
          getTopInfluencers(10),
          getGraphData()
        ]);
        setTopData(topInf.map(i => ({ user: i.user, score: i.score })));
        // Sample 50 nodes/edges for preview
        const sampleSize = 50;
        setGraphSample({
          nodes: graph.nodes.slice(0, sampleSize),
          edges: graph.edges.slice(0, sampleSize * 2)
        });
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, []);

  const handleLoadData = async () => {
    // Trigger data load via API
    await import('../services/api').then(api => api.loadData());
    // Refresh metrics
    window.location.reload();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100">
      <Loader />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navbar already in layout */}
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero */}
        <HeroDashboard onLoadData={handleLoadData} />
        
        {/* Metrics Grid */}
        <DashboardMetrics />
        
        {/* Quick Actions */}
        <QuickActions />
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">📈 Influence Distribution</h2>
            <InfluenceChart data={topData} />
          </div> */}
          {/* <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">🌐 Network Preview</h2>
            {graphSample ? (
              <GraphView data={graphSample} width={600} height={400} />
            ) : (
              <Loader />
            )}
          </div> */}
        </div>
        
        {/* Recent Top Influencers */}
        {/* <RecentInfluencers /> */}
      </div>
    </div>
  );
}

