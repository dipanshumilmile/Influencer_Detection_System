import sqlite3
import csv
import logging
from typing import List, Tuple
import ast

logging.basicConfig(level=logging.INFO)

DB_NAME = "influencer_data.db"


def get_connection():
    return sqlite3.connect(DB_NAME)


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS edges (
            source TEXT,
            target TEXT
        )
    """)

    conn.commit()
    conn.close()
    logging.info("Database initialized.")


def clear_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM edges")

    conn.commit()
    conn.close()
    logging.info("Database cleared.")


def insert_edges_batch(edges: List[Tuple[str, str]], batch_size: int = 1000):
    conn = get_connection()
    cursor = conn.cursor()

    for i in range(0, len(edges), batch_size):
        batch = edges[i:i + batch_size]
        cursor.executemany("INSERT INTO edges (source, target) VALUES (?, ?)", batch)
        conn.commit()

    conn.close()
    logging.info(f"Inserted {len(edges)} edges in batches.")


def load_csv(file_path: str):
    """
    Handles dataset like your screenshot:
    id, screenName, ..., friends (LIST)
    """
    edges = []

    with open(file_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)

        for row in reader:
            try:
                source = row.get("id")
                friends_raw = row.get("friends")

                if not source or not friends_raw:
                    continue

                # Convert string list to Python list
                try:
                    friends_list = ast.literal_eval(friends_raw)
                except Exception:
                    # fallback if malformed
                    friends_list = friends_raw.replace("[", "").replace("]", "").replace('"', '').split(',')

                for target in friends_list:
                    target = str(target).strip()
                    if target and target != source:
                        edges.append((source, target))

            except Exception as e:
                logging.warning(f"Skipping row due to error: {e}")

    insert_edges_batch(edges)
    logging.info(f"Loaded {len(edges)} edges from CSV.")


def generate_synthetic_data(num_nodes: int = 1000, num_edges: int = 5000):
    import random

    edges = []

    for _ in range(num_edges):
        source = f"user_{random.randint(1, num_nodes)}"
        target = f"user_{random.randint(1, num_nodes)}"

        if source != target:
            edges.append((source, target))

    insert_edges_batch(edges)
    logging.info("Synthetic data generated.")


def fetch_edges() -> List[Tuple[str, str]]:
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT source, target FROM edges")
    rows = cursor.fetchall()

    conn.close()
    return rows


def get_stats():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM edges")
    edge_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(DISTINCT source) + COUNT(DISTINCT target) FROM edges")
    node_count = cursor.fetchone()[0]

    conn.close()

    return {
        "nodes": node_count,
        "edges": edge_count
    }
