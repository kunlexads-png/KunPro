# Cerebro BI — Enterprise AI Business Intelligence & Analytics Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61dafb.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python_3.12-009688.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini_3.8_Flash-4285F4.svg)](https://ai.google.dev/)

An enterprise-grade, full-stack Business Intelligence & Autonomous Analytics dashboard. Cerebro BI transforms corporate transaction and ledger data into verified KPIs, statistical anomaly alerts, predictive trend horizons, and executive dossiers synthesized through Google Gemini AI.

---

## Key Modules & Capabilities

1. **Executive Overview Dashboard**: Real-time scorecard for 8 core financial and operational metrics (Revenue, COGS, Net Profit, Profit Margin, Sales Growth, Customers, AOV, Conversion Rate) with PoP comparison baselines and interactive Recharts.
2. **Business Data Management**: Upload, parse, validate, and preview CSV/Excel/JSON datasets with column mapping, missing value detection, and integrity scoring.
3. **AI Business Analyst**: Interactive natural language assistant powered by Google Gemini 3.8 Flash, strictly grounded in authoritative backend calculations (zero hallucinated figures) with cited metric chips and transcript export.
4. **Autonomous Report Generator**: Generates comprehensive executive dossiers (Daily, Weekly, Monthly Management Reviews, and QBRs) with printable PDF layout and CSV export.
5. **Statistical Trend & Horizon Forecasting**: 7-Day / 30-Day Simple Moving Averages (SMA) with Holt-Winters forecast bands.
6. **Explainable Anomaly & Risk Detection**: Z-Score ($2.5\sigma$) and Interquartile Range (IQR) outlier detection with workflow tracking (Open, Investigating, Resolved).
7. **Strategic Recommendations Center**: Machine-driven margin expansion plans with estimated ROI, confidence scores, and collaborative team notes.
8. **Customer Analytics & Retention Matrix**: RFM account segmentation and cohort decay curves.
9. **Sales & Product Intelligence**: SKU-level unit throughput and gross margin matrix.
10. **Financial P&L Statement**: EBITDA statement and Budget vs. Actual variance tracking.
11. **Security & Audit Trail**: Real-time alert notifications and immutable security audit log table.
12. **Role Governance (RBAC)**: Role switching and backend-enforced permissions (Super Admin, Business Owner, Analyst, Viewer).

---

## Architecture

```
cerebro-bi/
├── server.ts                    # Full-stack Node.js / Express server running with Vite on port 3000
├── src/
│   ├── components/layout/       # Sidebar, TopBar (conforming to 3-zone contract)
│   ├── components/common/       # MetricCard (anti-slop, tabular-nums)
│   ├── context/                 # AuthContext (RBAC) & FilterContext (Global dimensions)
│   ├── services/api.ts          # Centralized typed API client
│   ├── views/                   # 12 complete business intelligence views
│   └── types/index.ts           # Comprehensive TypeScript schemas
├── backend/                     # Complete Python FastAPI + PostgreSQL architecture
│   ├── app/
│   │   ├── main.py              # FastAPI app & Swagger documentation (/docs)
│   │   ├── core/                # Config, bcrypt security, permissions
│   │   ├── models/entities.py   # SQLAlchemy 2.0 ORM models
│   │   └── services/            # AnalyticsEngine (Pandas/NumPy Z-Score & IQR)
│   ├── tests/                   # Pytest automated test suites
│   ├── requirements.txt         # Python dependencies
│   └── Dockerfile               # Production container image
└── README.md
```

---

## Quick Start & Running Locally

### Option 1: Live Interactive App (Node.js & Vite Full-Stack)

```bash
# Install dependencies
npm install

# Start development full-stack server on port 3000
npm run dev

# Or build and test production bundle
npm run build
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Python FastAPI Backend (Standalone)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run FastAPI server
uvicorn app.main:app --reload --port 8000
```
Interactive Swagger documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

### Running Automated Tests

```bash
cd backend
pytest tests/
```

---

## Environment Variables

Copy `.env.example` to `.env`:

```ini
# Server Configuration
PORT=3000
ENVIRONMENT=production

# Gemini AI API Key (Server-side only)
GEMINI_API_KEY=your_gemini_api_key_here

# PostgreSQL Database (for Python backend)
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/cerebro_bi
```

---

## License

Apache-2.0 License. Built for enterprise portfolio demonstration.
