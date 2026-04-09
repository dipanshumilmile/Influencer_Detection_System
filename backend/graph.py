import logging
import networkx as nx
from db import fetch_edges

logging.basicConfig(level=logging.INFO)

# Cache to avoid recomputation
_graph_cache = None
_metrics_cache = None


def build_graph():
    global _graph_cache

    if _graph_cache is not None:
        return _graph_cache

    edges = fetch_edges()
    G = nx.DiGraph()

    G.add_edges_from(edges)

    _graph_cache = G
    logging.info(f"Graph built with {G.number_of_nodes()} nodes and {G.number_of_edges()} edges")

    return G


def compute_metrics():
    global _metrics_cache

    if _metrics_cache is not None:
        return _metrics_cache

    G = build_graph()

   
    # PageRank
   
    logging.info("Computing PageRank...")
    pagerank = nx.pagerank(G, alpha=0.85)

   
    # In-Degree Centrality
    
    logging.info("Computing In-Degree Centrality...")
    indegree = nx.in_degree_centrality(G)

   
    # Betweenness Centrality (FAST + FIXED)
    
    logging.info("Computing Betweenness Centrality...")

    if G.number_of_nodes() > 5000:
        logging.info("Using subgraph approximation for betweenness...")

        # 🔥 Take smaller subset (fast)
        sample_nodes = list(G.nodes())[:3000]
        subgraph = G.subgraph(sample_nodes)

        betweenness_sub = nx.betweenness_centrality(
            subgraph,
            k=200,              # small sampling for speed
            normalized=True,
            seed=42
        )

        # Map back to full graph
        betweenness = {node: betweenness_sub.get(node, 0) for node in G.nodes()}

    else:
        betweenness = nx.betweenness_centrality(G, normalized=True)

    # Debug
    non_zero = sum(1 for v in betweenness.values() if v > 0)
    logging.info(f"Non-zero betweenness nodes: {non_zero}")

    # -----------------------------
    # Normalize all scores
    # -----------------------------
    def normalize(d):
        max_val = max(d.values()) if d else 1
        return {k: (v / max_val if max_val != 0 else 0) for k, v in d.items()}

    pagerank_n = normalize(pagerank)
    indegree_n = normalize(indegree)
    betweenness_n = normalize(betweenness)

    # -----------------------------
    # Combine scores
    # -----------------------------
    logging.info("Combining scores...")

    combined_score = {}

    for node in G.nodes():
        combined_score[node] = (
            0.5 * pagerank_n.get(node, 0) +
            0.3 * indegree_n.get(node, 0) +
            0.2 * betweenness_n.get(node, 0)
        )

    # Cache results
    _metrics_cache = {
        "pagerank": pagerank_n,
        "indegree": indegree_n,
        "betweenness": betweenness_n,
        "combined": combined_score
    }

    return _metrics_cache


# -----------------------------
# API FUNCTIONS
# -----------------------------

def get_top_influencers(n=10):
    metrics = compute_metrics()
    combined = metrics["combined"]

    sorted_nodes = sorted(combined.items(), key=lambda x: x[1], reverse=True)

    result = []
    for node, score in sorted_nodes[:n]:
        result.append({
            "user": node,
            "score": score,
            "pagerank": metrics["pagerank"].get(node, 0),
            "indegree": metrics["indegree"].get(node, 0),
            "betweenness": metrics["betweenness"].get(node, 0)
        })

    return result


def get_user_metrics(user_id: str):
    metrics = compute_metrics()

    return {
        "user": user_id,
        "pagerank": metrics["pagerank"].get(user_id, 0),
        "indegree": metrics["indegree"].get(user_id, 0),
        "betweenness": metrics["betweenness"].get(user_id, 0),
        "combined": metrics["combined"].get(user_id, 0)
    }


def get_graph_data(limit=1000):
    """
    Returns subset of graph for visualization
    """
    G = build_graph()
    

    nodes = list(G.nodes())[:limit]
    subgraph = G.subgraph(nodes)

    node_data = [{"id": n} for n in subgraph.nodes()]
    edge_data = [{"source": u, "target": v} for u, v in subgraph.edges()]

    return {
        "nodes": node_data,
        "edges": edge_data
    }


def clear_cache():
    global _graph_cache, _metrics_cache
    _graph_cache = None
    _metrics_cache = None
    logging.info("Cache cleared.")