<<<<<<< HEAD
# Influencer Detection in Social Networks using Link Analysis

Industry-level Big Data Analytics dashboard detecting influential users via PageRank, Degree Centrality, Betweenness, HITS + custom score.

## Tech Stack
- **Backend**: Flask, NetworkX, SQLite
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Recharts, D3.js

## Quick Start

### 1. Backend (Python)
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py
```
Backend runs on http://localhost:5000

**Load Data (curl or Postman):**
```bash
curl -X POST http://localhost:5000/load_data \
  -H "Content-Type: application/json" \
  -d '{"type": "synthetic", "n_nodes": 150}'  # or "snap"
```

Test APIs:
- http://localhost:5000/graph_stats
- http://localhost:5000/top_influencers?k=10

### 2. Frontend (New terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:3000

## Features
- **Dashboard**: Stats, top influencers, charts
- **Influencers**: Sortable table, search, CSV export
- **Graph**: Interactive D3 network visualization (node size = influence)
- **Data**: SNAP Facebook or synthetic (150 nodes default)

## APIs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/load_data` | POST | Load synthetic/SNAP data |
| `/graph_stats` | GET | Nodes/edges stats |
| `/top_influencers?k=N` | GET | Top N influencers |
| `/centrality` | GET | All centrality metrics |
| `/graph_data` | GET | Nodes/edges for viz |
| `/search_user?user_id=ID` | GET | User metrics |
| `/export_csv` | GET | CSV top 50 |

## Production
```
# Backend
pip install gunicorn
gunicorn --bind 0.0.0.0:5000 app:app

# Frontend
npm run build
npm start
```

Enjoy analyzing social influence! 🚀
=======
# Influencer_Detection_Sytem
>>>>>>> d9e64127f040daa47212bf57075a74745c49ce86
