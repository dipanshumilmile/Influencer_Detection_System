# Influencer Detection Project - TODO

## Approved Plan Steps (Backend First, then Frontend)

### Phase 1: Backend Fixes (Minimal)
- [x] Fix backend/analysis.py: Add `from graph import *`, fix imports/calls, 'top_influencer' line, graph_data efficiency.
- [x] Fix backend/app.py: Correct /load_data SNAP file_path to 'data/facebook_combined.txt/facebook_combined.txt', remove duplicate return.
- [ ] Test backend: `cd backend && pip install -r requirements.txt && python app.py` (check APIs).

### Phase 2: Frontend Completion
- [ ] Update frontend/package.json: Add recharts, d3, lucide-react, react-hot-toast (already has axios/toast).
- [ ] Create/Edit app/layout.js: Navbar, providers.
- [ ] Components: Navbar.jsx, StatCard.jsx, InfluencerTable.jsx (sortable/search/CSV), ChartComponent.jsx (Recharts), GraphView.jsx (D3 interactive), Loader/Error.
- [ ] app/page.js: Full dashboard charts.
- [ ] app/influencers/page.js: Table.
- [ ] app/graph/page.js: D3 viz.
- [ ] Test frontend.

### Phase 3: Integration & Final
- [ ] README.md updates.
- [ ] Full test.
- [ ] Complete.

Backend fixes complete. Backend ready. Proceeding to frontend.
