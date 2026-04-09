import logging
import csv
from typing import Dict, Any, List

from db import get_stats
from graph import (
    get_top_influencers,
    get_user_metrics,
    get_graph_data,
    clear_cache,
    compute_metrics,
)

logging.basicConfig(level=logging.INFO)


def load_data_and_reset_cache(loader_fn, *args, **kwargs) -> Dict[str, Any]:
    """
    Wrapper to load data (CSV/synthetic) and clear graph caches.
    loader_fn: function like db.load_csv or db.generate_synthetic_data
    """
    logging.info("Loading data...")
    loader_fn(*args, **kwargs)
    clear_cache()
    logging.info("Data loaded and cache cleared.")

    stats = get_stats()
    return {
        "status": "success",
        "message": "Data loaded successfully",
        "stats": stats,
    }


def get_graph_stats() -> Dict[str, Any]:
    stats = get_stats()

    # Trigger metrics computation lazily for additional info if needed
    metrics = compute_metrics()

    return {
        "nodes": stats.get("nodes", 0),
        "edges": stats.get("edges", 0),
        "metrics_computed": True if metrics else False,
    }


def fetch_top_influencers(limit: int = 10) -> List[Dict[str, Any]]:
    try:
        result = get_top_influencers(limit)
        return result
    except Exception as e:
        logging.error(f"Error fetching top influencers: {e}")
        return []


def search_user(user_id: str) -> Dict[str, Any]:
    try:
        data = get_user_metrics(user_id)
        if data.get("pagerank", 0) == 0 and data.get("indegree", 0) == 0:
            return {
                "status": "not_found",
                "message": f"User {user_id} not found",
            }
        return {
            "status": "success",
            "data": data,
        }
    except Exception as e:
        logging.error(f"Error searching user: {e}")
        return {
            "status": "error",
            "message": str(e),
        }


def fetch_graph_data(limit: int = 1000) -> Dict[str, Any]:
    try:
        return get_graph_data(limit)
    except Exception as e:
        logging.error(f"Error fetching graph data: {e}")
        return {"nodes": [], "edges": []}


def export_influencers_csv(file_path: str = "top_influencers.csv", limit: int = 100):
    try:
        influencers = get_top_influencers(limit)

        with open(file_path, mode="w", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow(["user", "score", "pagerank", "indegree", "betweenness"])

            for row in influencers:
                writer.writerow([
                    row["user"],
                    row["score"],
                    row["pagerank"],
                    row["indegree"],
                    row["betweenness"],
                ])

        logging.info(f"Exported influencers to {file_path}")
        return {
            "status": "success",
            "file": file_path,
        }

    except Exception as e:
        logging.error(f"Error exporting CSV: {e}")
        return {
            "status": "error",
            "message": str(e),
        }
