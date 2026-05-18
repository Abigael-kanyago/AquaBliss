# 💧 AquaBliss

A full-stack web application for managing water delivery and refilling orders. Customers can place refill or packaged-water orders online, and an admin panel allows the business owner to track orders, update statuses, and manage pricing — all in real time.

**Live site:** [aqua-bliss.vercel.app](https://aqua-bliss.vercel.app)

---

## Features

- **Order placement** — customers choose between water refilling or packaged 20L bottles, select add-ons (pump, branding), and submit their delivery details
- **Server-side pricing** — total is always recalculated on the backend to prevent client-side tampering
- **Email notifications** — automatic confirmation emails to both the customer and the admin on each new order
- **Admin dashboard** — password-protected panel to view all orders and update statuses (pending → processing → delivered / cancelled)
- **Dynamic pricing** — admin can update product prices from the dashboard without touching code
- **Rate limiting** — order endpoint is protected against spam (10 requests/minute per IP)

---

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Python 3.11 · Flask 3.1 |
| Database | PostgreSQL (Neon serverless) |
| ORM / DB driver | psycopg2-binary |
| Email | Flask-Mail · Gmail SMTP |
| Rate limiting | Flask-Limiter |
| Deployment | Vercel (serverless) |
| Frontend | HTML · CSS · Vanilla JS |

---

## Project structure

```
AquaBliss/
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
├── vercel.json             # Vercel deployment config
├── .env.example            # Example environment variables
├── static/
│   ├── css/
│   └── js/
├── templates/
│   ├── index.html          # Landing page + order form
│   ├── orders.html         # Admin orders dashboard
│   └── login.html          # Admin login page
└── tests/
    └── test_app.py         # Pytest test suite
```

---

## Local development setup

### Prerequisites

- Python 3.10+
- A PostgreSQL database (local or [Neon](https://neon.tech) free tier)

### 1. Clone the repo

```bash
git clone https://github.com/Abigael-kanyago/AquaBliss.git
cd AquaBliss
```

### 2. Create and activate a virtual environment

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `SECRET_KEY` | A long random string for Flask sessions |
| `DATABASE_URL` | Full PostgreSQL connection string (e.g. from Neon) |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Admin login password |
| `MAIL_USERNAME` | Gmail address used to send emails |
| `MAIL_PASSWORD` | Gmail app password (not your account password) |
| `ADMIN_EMAIL` | Email address to receive new-order notifications |
| `DEBUG` | Set to `true` for local development only |

### 5. Run the app

```bash
python app.py
```

Visit `http://localhost:5000`.

---

## Running tests

```bash
pip install pytest
pytest tests/ -v
```

---

## Deployment (Vercel)

1. Push your code to GitHub.
2. Import the repo in [Vercel](https://vercel.com).
3. Add all environment variables from the table above in **Project → Settings → Environment Variables**.
4. Deploy. Vercel uses `vercel.json` to route requests to the Flask app via gunicorn.

> **Important:** Never commit your `.env` file. It is listed in `.gitignore`.

---

## API endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | — | Landing page |
| GET | `/get-prices` | — | Returns current product prices |
| POST | `/submit-order` | — | Place a new order (rate-limited) |
| GET | `/login` | — | Admin login page |
| GET | `/orders` | Admin | View all orders |
| POST | `/update-order-status/<id>` | Admin | Update order status |
| POST | `/update-prices` | Admin | Update product prices |

---

## License

MIT
