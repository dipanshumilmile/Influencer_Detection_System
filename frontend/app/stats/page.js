"use client";
import { useEffect, useState } from "react";
import API_BASE from "../config";

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/graph_stats`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Loading stats...</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h1>Network Statistics</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
          <h3>Total Nodes</h3>
          <p style={{ fontSize: "24px" }}>{stats.nodes}</p>
        </div>

        <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
          <h3>Total Edges</h3>
          <p style={{ fontSize: "24px" }}>{stats.edges}</p>
        </div>

        <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
          <h3>Metrics Status</h3>
          <p style={{ fontSize: "18px" }}>
            {stats.metrics_computed ? "Computed" : "Pending"}
          </p>
        </div>
      </div>
    </div>
  );
}
