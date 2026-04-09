"use client";
import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import InfluencerTable from '../components/InfluencerTable';
import InfluenceChart from '../components/InfluenceChart';
import GraphView from '../components/GraphView';
import { getGraphStats, getTopInfluencers, getGraphData } from '../../services/api';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { FaChartBar, FaCrown, FaDownload } from 'react-icons/fa';

export default function AnalysisPage() {
  const [stats, setStats] = useState(null);
  const [topInfluencers, setTopInfluencers] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsRes, topRes, graphRes] = await Promise.all([
          getGraphStats(),
          getTopInfluencers(50),
          getGraphData(200)
        ]);

        if (!statsRes.nodes || statsRes.nodes === 0) {
          throw new Error('No data loaded. Load network data first from dashboard.');
        }

        setStats(statsRes);
        setTopInfluencers(topRes);
        setChartData(topRes.slice(0, 20).map(i => ({
          user: i.user.slice(-6),
          score: i.score * 100
        })));
        setGraphData(graphRes);
      } catch (err) {
        setError(err.message || 'Analysis ready. Load data first from dashboard, then refresh.');
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

 return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-4">
            Network Analysis Dashboard
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Centrality analysis with PageRank, In-Degree, Betweenness and influencer rankings.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-14">
          <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 shadow-md flex items-center gap-4">
            <FaChartBar className="text-blue-400 text-2xl" />
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-xl font-semibold">{stats.nodes.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 shadow-md flex items-center gap-4">
            <FaChartBar className="text-green-400 text-2xl" />
            <div>
              <p className="text-gray-400 text-sm">Connections</p>
              <p className="text-xl font-semibold">{stats.edges.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 shadow-md flex items-center gap-4">
            <FaCrown className="text-yellow-400 text-2xl" />
            <div>
              <p className="text-gray-400 text-sm">Top Influencers</p>
              <p className="text-xl font-semibold">{topInfluencers.length}</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-14">

  {/* Chart */}
  <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 shadow-lg">
    <h2 className="text-xl font-semibold mb-4 text-center">
      Influence Score Distribution
    </h2>

    <InfluenceChart data={chartData} />

    {/* Axis Labels */}
    <div className="flex justify-between text-sm text-gray-400 mt-2 px-2">
      <span>User IDs</span>
      <span>Influence Score (%)</span>
    </div>
  </div>

  {/* Parameters + Explanation */}
  <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 shadow-lg flex flex-col justify-center">

    <h2 className="text-xl font-semibold mb-4 text-center">
      Parameters Used
    </h2>

    <ul className="space-y-3 text-gray-300 text-sm">
      <li>🔵 <b>PageRank (50%)</b> → Measures global importance of a user in the network</li>
      <li>🟢 <b>In-Degree (30%)</b> → Number of incoming connections (followers)</li>
      <li>🟣 <b>Betweenness (20%)</b> → Measures how often a user lies on shortest paths</li>
    </ul>

    <div className="mt-6 p-4 bg-blue-900/30 rounded-xl text-gray-300 text-sm">
      <b>📊 Interpretation:</b><br />
      The bar chart shows the top users ranked by influence score.
      Higher bars indicate users with stronger impact in the network.
      These users act as key nodes for information spread.
    </div>

  </div>



          {/* <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">Network Graph</h2>
            <GraphView data={graphData} />
          </div> */}
        </div>

        {/* Table */}
        <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 shadow-lg mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold">Top Influencers</h2>
              <button
              onClick={() => {
                if (!topInfluencers.length) return;

                const headers = ["User", "Score"];
                const rows = topInfluencers.map(i => [i.user, i.score]);

                const csvContent = [
                  headers.join(","),
                  ...rows.map(r => r.join(","))
                ].join("");

                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "top_influencers.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2 rounded-lg font-medium hover:scale-105 transition"
            >
              <FaDownload className="inline mr-2" /> Export
            </button>
          </div>

          <div className="overflow-x-auto">
            <InfluencerTable data={topInfluencers} />
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm">
          Weighted Score = PageRank (50%) + In-Degree (30%) + Betweenness (20%)
        </p>

      </div>
    </div>
  );
}
