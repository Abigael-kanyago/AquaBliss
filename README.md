# 💧 AquaBliss

A modern full-stack web application for managing pure water delivery and refilling orders in Makongeni and along Garissa Road, Thika. Built with a creative **React.js** glassmorphic frontend, authentic **Lucide vector icons**, and a robust **Flask + PostgreSQL** backend.

**Live site:** [aqua-bliss.vercel.app](https://aqua-bliss.vercel.app)

---

## 🌟 Key Features

- **Creative React Frontend** — Luminous oceanic glassmorphism with dynamic ambient lighting, responsive across mobile & desktop.
- **Authentic Vector Iconography** — Crisp SVG icons powered by `lucide-react` (strictly zero AI-generated icon images).
- **Interactive Order Studio** — Real-time price calculator & builder for water refills, packaged 20L bottles, and dispenser accessories.
- **5-Stage Purity Lab Visualizer** — Interactive filtration explorer (Sediment, Activated Carbon, Reverse Osmosis, Mineral Balance, UV Sterilization) and TDS purity comparator.
- **Smart Hydration & Savings Calculator** — Computes household/office monthly water requirements and estimated savings.
- **Local Delivery Zone Explorer** — Makongeni & Garissa Road dispatch zones with live ETA estimations.
- **Integrated Staff & Admin Portal** — Secure dashboard to track incoming orders, update statuses (`pending` → `processing` → `delivered`), adjust PostgreSQL live prices, and manage staff credentials.
- **M-Pesa & Cash on Delivery** — Simple, reliable payment workflows for doorstep delivery.
- **Server-Side Security & Rate Limiting** — Order total validation on Flask backend with rate-limiting protection.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 · Vite 8 · Vanilla CSS Design System · Lucide Icons · Canvas Confetti |
| Backend | Python 3.11+ · Flask 3.1 · Flask-CORS · Flask-Limiter · Flask-Mail |
| Database | PostgreSQL (Local / Neon serverless) · pg8000 |
| Deployment | Vercel / Node + WSGI |

---

## 📁 Project Structure

```
AquaBliss/
├── package.json            # Root workspace scripts (npm run dev / build)
├── app.py                  # Flask API & static backend server
├── requirements.txt        # Python dependencies
├── frontend/               # Modern React.js Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Floating glass header & live store status
│   │   │   ├── Hero.jsx                 # Dynamic hero with quick estimator
│   │   │   ├── TrustStrip.jsx           # Value markers with Lucide vector icons
│   │   │   ├── Services.jsx             # Service cards & pricing
│   │   │   ├── OrderStudio.jsx          # Interactive customizer & builder
│   │   │   ├── PurificationProcess.jsx  # 5-stage filtration & TDS meter
│   │   │   ├── HydrationCalculator.jsx  # Monthly water & savings calculator
│   │   │   ├── DeliveryZone.jsx         # Garissa Road delivery coverage
│   │   │   ├── Testimonials.jsx         # Customer reviews
│   │   │   ├── OrderModal.jsx           # Checkout & M-Pesa modal
│   │   │   ├── AdminPortal.jsx          # Order management & price admin
│   │   │   └── Footer.jsx               # Contact & WhatsApp connect
│   │   ├── App.jsx                      # Main app shell & modal orchestration
│   │   └── index.css                    # Oceanic design system & glassmorphism
│   ├── package.json
│   └── vite.config.js                   # Vite dev server + Flask API proxy
├── templates/              # Fallback templates
├── static/                 # Brand assets & logos
└── tests/                  # Pytest test suite
```

---

## 🚀 Running Locally

### 1. Start the Flask Backend

Make sure your virtual environment is active and run:

```bash
# Windows
.venv\Scripts\activate
python app.py
```
*Backend runs on `http://127.0.0.1:5000`*

### 2. Start the React Frontend

From the root workspace directory, run:

```bash
npm run dev
```
*Frontend runs on `http://localhost:5173` with automated API proxying to Flask on port 5000.*

---

## 🔒 Admin Credentials

- **Default Username:** `admin`
- **Default Password:** `aquabliss2026`
- Access via the **Shield Icon** in the navbar/footer or by visiting the Staff Portal.

---

## License

MIT © AquaBliss
