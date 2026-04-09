"use client";

import { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";

export default function GraphView({ data, width = 1000, height = 650 }) {
  const svgRef = useRef();

  // 🧠 Compute stats for explanation
  const stats = useMemo(() => {
    if (!data?.nodes || !data?.edges) return null;

    const totalNodes = data.nodes.length;
    const totalEdges = data.edges.length;
    const influencerCount = Math.max(5, Math.floor(totalNodes * 0.1));

    return { totalNodes, totalEdges, influencerCount };
  }, [data]);

  useEffect(() => {
    if (!data?.nodes || !data?.edges) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("width", width).attr("height", height);

    const container = svg.append("g");

    // 🔍 Zoom
    svg.call(
      d3.zoom().scaleExtent([0.6, 4]).on("zoom", (event) => {
        container.attr("transform", event.transform);
      })
    );

    // 🔹 Nodes
    const nodes = data.nodes.map((d) => ({
      id: String(d.id),
    }));

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    // 🔗 Clean links
    const links = data.edges
      .filter(
        (d) =>
          nodeMap.has(String(d.source)) &&
          nodeMap.has(String(d.target))
      )
      .slice(0, 200)
      .map((d) => ({
        source: String(d.source),
        target: String(d.target),
      }));

    // 🔥 Degree
    const degree = {};
    links.forEach((l) => {
      degree[l.source] = (degree[l.source] || 0) + 1;
      degree[l.target] = (degree[l.target] || 0) + 1;
    });

    nodes.forEach((n) => {
      n.influence = degree[n.id] || 1;
    });

    const maxInfluence = d3.max(nodes, (d) => d.influence) || 1;

    // 🔥 Top influencers (10%)
    const sorted = [...nodes].sort((a, b) => b.influence - a.influence);
    const topCount = Math.max(5, Math.floor(nodes.length * 0.1));
    const influencers = sorted.slice(0, topCount);
    const influencerIds = new Set(influencers.map((n) => n.id));

    nodes.forEach((n) => {
      n.isInfluencer = influencerIds.has(n.id);
      n.radius = n.isInfluencer
        ? 14 + (n.influence / maxInfluence) * 18
        : 5;
    });

    // 🎯 Assign cluster
    nodes.forEach((node) => {
      if (node.isInfluencer) {
        node.cluster = node.id;
      } else {
        const link = links.find(
          (l) =>
            l.source === node.id && influencerIds.has(l.target) ||
            l.target === node.id && influencerIds.has(l.source)
        );

        node.cluster = link
          ? influencerIds.has(link.source)
            ? link.source
            : link.target
          : influencers[Math.floor(Math.random() * influencers.length)].id;
      }
    });

    // 🚀 FORCE
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(45)
          .strength(1)
      )
      .force("charge", d3.forceManyBody().strength(-100))
      .force("collision", d3.forceCollide().radius((d) => d.radius + 2))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("cluster", () => {
        nodes.forEach((d) => {
          const target = nodeMap.get(d.cluster);
          if (!target) return;
          d.vx += (target.x - d.x) * 0.03;
          d.vy += (target.y - d.y) * 0.03;
        });
      });

    // 🔗 Links
    const link = container
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-opacity", 0.7)
      .attr("stroke-width", 1.2);

    // 🔵 Nodes
    const node = container
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) =>
        d.isInfluencer ? "#2563eb" : "#94a3b8"
      )
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1.2)
      .call(
        d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    // 🏷 Labels
    const label = container
      .append("g")
      .selectAll("text")
      .data(influencers.slice(0, 8))
      .enter()
      .append("text")
      .text((d) => d.id.slice(-4))
      .attr("font-size", 11)
      .attr("font-weight", "bold")
      .attr("fill", "#1e293b")
      .attr("text-anchor", "middle");

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);

      label
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => simulation.stop();
  }, [data]);

  return (
    <div className="bg-black rounded-2xl shadow-xl p-5 borde ">

      <svg ref={svgRef}></svg>

      {/* LEGEND */}
      <div className="mt-4 flex justify-center gap-6 text-sm bg-black">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3l"></div>
          <span> 🔵 Influencers</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <span>Normal Users</span>
        </div>
      </div>

      {/* 📊 STATS */}
      {stats && (
        <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm text-black">
          <div className="bg-gray-100 p-2 rounded">
            <strong>{stats.totalNodes}</strong>
            <div>Total Users</div>
          </div>
          <div className="bg-gray-100 p-2 rounded">
            <strong>{stats.totalEdges}</strong>
            <div>Connections</div>
          </div>
          <div className="bg-gray-100 p-2 rounded">
            <strong>{stats.influencerCount}</strong>
            <div>Influencers</div>
          </div>
        </div>
      )}

      {/* 🧠 EXPLANATION */}
      <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-4 rounded-xl">
        <strong>📊 Network Insight:</strong><br />
        This graph represents a social network where each node is a user and each line shows a connection between users.
        <br /><br />
        <b>Influencers</b> (blue nodes) have a higher number of connections and appear larger and more central. 
        These users act as hubs, meaning they can spread information more efficiently across the network.
        <br /><br />
        <b>Normal users</b> (gray nodes) are connected to influencers or other users and form clusters around them. 
        This structure shows how communities form around key individuals.
        <br /><br />
        Overall, the graph demonstrates that a small number of highly connected users play a critical role in information flow and network connectivity.
      </div>

    </div>
  );
}