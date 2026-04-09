from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import logging
import os

from db import init_db, clear_db, load_csv, generate_synthetic_data
from analysis import (
    load_data_and_reset_cache,
    get_graph_stats,
    fetch_top_influencers,
    search_user,
    fetch_graph_data,
    export_influencers_csv,
)

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)

# Initialize DB
init_db()

DATA_FOLDER = "data"


@app.route("/")
def home():
    return jsonify({"message": "Influencer Detection API is running"})


# ✅ FIXED: Allow BOTH GET and POST (important for browser + frontend)
@app.route("/load_data", methods=["GET", "POST"])
def load_data():
    try:
        # Handle both GET and POST
        if request.method == "POST":
            data = request.json or {}
        else:
            data = {}

        source = data.get("source", "csv")

        clear_db()

        if source == "csv":
            file_path = os.path.join(DATA_FOLDER, "data.csv")

            # ✅ Check file exists (important fix)
            if not os.path.exists(file_path):
                return jsonify({"error": f"{file_path} not found"}), 400

            result = load_data_and_reset_cache(load_csv, file_path)

        elif source == "synthetic":
            num_nodes = data.get("nodes", 1000)
            num_edges = data.get("edges", 5000)

            result = load_data_and_reset_cache(
                generate_synthetic_data,
                num_nodes,
                num_edges
            )

        else:
            return jsonify({"error": "Invalid data source"}), 400

        logging.info("Data loaded successfully")
        return jsonify(result)

    except Exception as e:
        logging.error(f"Error loading data: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/graph_stats", methods=["GET"])
def graph_stats():
    try:
        stats = get_graph_stats()
        return jsonify(stats)
    except Exception as e:
        logging.error(f"Error fetching stats: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/top_influencers", methods=["GET"])
def top_influencers():
    try:
        limit = int(request.args.get("limit", 10))
        data = fetch_top_influencers(limit)
        return jsonify(data)
    except Exception as e:
        logging.error(f"Error fetching influencers: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/search_user", methods=["GET"])
def search():
    try:
        user_id = request.args.get("user_id")

        if not user_id:
            return jsonify({"error": "user_id is required"}), 400

        result = search_user(user_id)
        return jsonify(result)

    except Exception as e:
        logging.error(f"Error searching user: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/graph_data", methods=["GET"])
def graph_data():
    try:
        limit = int(request.args.get("limit", 300))  # smaller for frontend performance
        data = fetch_graph_data(limit)
        return jsonify(data)
    except Exception as e:
        logging.error(f"Error fetching graph data: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/export_csv", methods=["GET"])
def export_csv():
    try:
        limit = int(request.args.get("limit", 100))
        file_name = "top_influencers.csv"

        result = export_influencers_csv(file_name, limit)

        if result.get("status") == "success":
            return send_file(file_name, as_attachment=True)
        else:
            return jsonify(result), 500

    except Exception as e:
        logging.error(f"Error exporting CSV: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)