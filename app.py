import json
import logging
import os
import re

import pg8000
from urllib.parse import urlparse
from dotenv import load_dotenv
from flask import Flask, jsonify, redirect, render_template, request, session, url_for
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_mail import Mail, Message
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash

class DictCursor:
    def __init__(self, cursor):
        self.cursor = cursor
        
    def execute(self, sql, params=None):
        if params is None:
            self.cursor.execute(sql)
        else:
            self.cursor.execute(sql, params)
        return self
        
    def fetchall(self):
        rows = self.cursor.fetchall()
        description = self.cursor.description
        if not description:
            return []
        colnames = [col[0] for col in description]
        return [dict(zip(colnames, row)) for row in rows]
        
    def fetchone(self):
        row = self.cursor.fetchone()
        if not row:
            return None
        description = self.cursor.description
        if not description:
            return None
        colnames = [col[0] for col in description]
        return dict(zip(colnames, row))
        
    def close(self):
        self.cursor.close()

load_dotenv()

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

app = Flask(__name__)

# Secret key — must be set in environment; fall back only for compiling/testing.
secret_key = os.getenv("SECRET_KEY")
if not secret_key:
    # Use a secure fallback for compilation phases so serverless tools don't crash on build.
    # In live production, ensure SECRET_KEY is set in Vercel's environment settings.
    secret_key = "aquabliss_default_fallback_session_key_2026"
app.secret_key = secret_key

# Logging — writes to stdout so Vercel/gunicorn captures it properly.
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

# Rate limiter — prevents order-endpoint spam.
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
)

# ---------------------------------------------------------------------------
# Email configuration
# ---------------------------------------------------------------------------

app.config["MAIL_SERVER"] = os.getenv("MAIL_SERVER", "smtp.gmail.com")
app.config["MAIL_PORT"] = int(os.getenv("MAIL_PORT", 587))
app.config["MAIL_USE_TLS"] = os.getenv("MAIL_USE_TLS", "True") == "True"
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")
app.config["MAIL_DEFAULT_SENDER"] = os.getenv(
    "MAIL_DEFAULT_SENDER", os.getenv("MAIL_USERNAME")
)
mail = Mail(app)

# ---------------------------------------------------------------------------
# Database helpers
# ---------------------------------------------------------------------------

def get_db_connection():
    """Return a new pg8000 connection using DATABASE_URL or individual env vars."""
    db_url = os.getenv("DATABASE_URL")
    if db_url:
        try:
            result = urlparse(db_url)
            username = result.username
            password = result.password or ""
            database = result.path[1:] if result.path else "postgres"
            hostname = result.hostname
            port = result.port or 5432
            return pg8000.connect(
                user=username,
                password=password,
                host=hostname,
                port=port,
                database=database,
                timeout=5
            )
        except Exception as exc:
            raise RuntimeError(f"DB connection failed (DATABASE_URL): {exc}") from exc

    try:
        return pg8000.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD") or "",
            database=os.getenv("DB_NAME") or "postgres",
            port=int(os.getenv("DB_PORT", 5432)),
            timeout=5,
        )
    except Exception as exc:
        raise RuntimeError(f"DB connection failed (individual vars): {exc}") from exc


def init_db():
    """Create required tables and seed default prices if they do not exist."""
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS orders (
            id           SERIAL PRIMARY KEY,
            name         VARCHAR(255)    NOT NULL,
            email        VARCHAR(255)    NOT NULL,
            phone        VARCHAR(20),
            address      TEXT            NOT NULL,
            order_type   VARCHAR(50)     NOT NULL,
            details      JSONB,
            total_price  DECIMAL(10, 2)  NOT NULL,
            status       VARCHAR(20)     DEFAULT 'pending',
            created_at   TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS settings (
            key         VARCHAR(50) PRIMARY KEY,
            value       DECIMAL(10, 2) NOT NULL,
            description TEXT
        )
        """
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id            SERIAL PRIMARY KEY,
            username      VARCHAR(50) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role          VARCHAR(20) DEFAULT 'staff',
            created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    initial_settings = [
        ("refill_price_per_liter", 10.00, "Price per liter for water refilling"),
        ("bottle_cost", 180.00, "Cost of a new bottle"),
        ("pump_cost", 250.00, "Cost of a water pump"),
        ("packaged_price_20l", 180.00, "Price for a 20L packaged/branded bottle"),
        ("branding_cost", 100.00, "Additional cost for branding"),
    ]
    for key, value, desc in initial_settings:
        cur.execute(
            "INSERT INTO settings (key, value, description) VALUES (%s, %s, %s) "
            "ON CONFLICT (key) DO NOTHING",
            (key, value, desc),
        )

    # Seed default admin user if users table is empty
    cur.execute("SELECT COUNT(*) FROM users")
    count_row = cur.fetchone()
    if count_row and count_row[0] == 0:
        admin_user = os.getenv("ADMIN_USERNAME", "admin").strip().lower()
        admin_pass = os.getenv("ADMIN_PASSWORD", "aquabliss2026").strip()
        hashed_pass = generate_password_hash(admin_pass)
        cur.execute(
            "INSERT INTO users (username, password_hash, role) VALUES (%s, %s, 'admin')",
            (admin_user, hashed_pass),
        )

    conn.commit()
    cur.close()
    conn.close()


# ---------------------------------------------------------------------------
# Input validation helpers
# ---------------------------------------------------------------------------

def validate_email(email: str) -> bool:
    """Return True if *email* matches a basic RFC-5322-like pattern."""
    return bool(re.match(r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$", email))


def validate_phone(phone: str) -> bool:
    """Return True if *phone* contains only digits, spaces, +, -, and parentheses."""
    return bool(re.match(r"^[\d\s\+\-\(\)]{7,20}$", phone))


def sanitize_string(value: str, max_length: int = 255) -> str:
    """Strip whitespace and truncate to *max_length*."""
    return str(value).strip()[:max_length]


# ---------------------------------------------------------------------------
# Auth decorator
# ---------------------------------------------------------------------------

def login_required(f):
    """Redirect unauthenticated requests to the login page."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "admin_logged_in" not in session:
            return redirect(url_for("login", next=request.url))
        return f(*args, **kwargs)
    return decorated_function


# ---------------------------------------------------------------------------
# Initialise DB on startup
# ---------------------------------------------------------------------------

try:
    init_db()
    logger.info("Database initialised successfully.")
except Exception as exc:
    logger.error("Database initialisation failed: %s", exc)


# ---------------------------------------------------------------------------
# Routes — public
# ---------------------------------------------------------------------------

@app.route("/")
def index():
    """Serve the main landing page."""
    return render_template("index.html")


@app.route("/get-prices")
def get_prices():
    """Return current product prices from the settings table."""
    try:
        conn = get_db_connection()
        cur = DictCursor(conn.cursor())
        cur.execute("SELECT * FROM settings")
        settings = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify({"success": True, "prices": settings})
    except Exception as exc:
        logger.error("get_prices error: %s", exc)
        return jsonify({"success": False, "message": "Could not load prices."}), 500


@app.route("/submit-order", methods=["POST"])
@limiter.limit("10 per minute")
def submit_order():
    """
    Accept a new water order, validate all fields, recalculate the total
    server-side to prevent tampering, save to the database, and send
    confirmation emails.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "No data provided."}), 400

        # Required field presence check
        required_fields = ["name", "email", "address", "order_type"]
        missing = [f for f in required_fields if not data.get(f)]
        if missing:
            return jsonify({"success": False, "message": f"Missing fields: {', '.join(missing)}"}), 400

        # Sanitise
        name = sanitize_string(data["name"], 255)
        email = sanitize_string(data["email"], 255)
        phone = sanitize_string(data.get("phone", ""), 20)
        address = sanitize_string(data["address"], 500)
        order_type = sanitize_string(data["order_type"], 50)

        # Validate
        if not name:
            return jsonify({"success": False, "message": "Name cannot be empty."}), 400
        if not validate_email(email):
            return jsonify({"success": False, "message": "Invalid email address."}), 400
        if phone and not validate_phone(phone):
            return jsonify({"success": False, "message": "Invalid phone number."}), 400
        if order_type not in ("refill", "packaged"):
            return jsonify({"success": False, "message": "Invalid order type."}), 400

        # Load prices from DB
        conn = get_db_connection()
        cur = DictCursor(conn.cursor())
        cur.execute("SELECT key, value FROM settings")
        prices = {row["key"]: float(row["value"]) for row in cur.fetchall()}
        cur.close()

        # Recalculate total server-side (never trust the client-submitted total)
        calculated_total = 0.0
        details: dict = {}

        if order_type == "refill":
            liters = max(0, int(data.get("liters", 0)))
            calculated_total = liters * prices.get("refill_price_per_liter", 10.0)
            if data.get("bottle") == "yes":
                calculated_total += prices.get("bottle_cost", 180.0)
            if data.get("pump") == "yes":
                calculated_total += prices.get("pump_cost", 250.0)
            details = {
                "liters": liters,
                "bottle": data.get("bottle"),
                "pump": data.get("pump"),
            }
        else:
            quantity = max(0, int(data.get("quantity", 0)))
            calculated_total = quantity * prices.get("packaged_price_20l", 180.0)
            if data.get("brand") == "yes":
                calculated_total += prices.get("branding_cost", 100.0)
            details = {
                "quantity": quantity,
                "brand": data.get("brand"),
            }

        # Persist
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO orders (name, email, phone, address, order_type, details, total_price) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (name, email, phone, address, order_type, json.dumps(details), calculated_total),
        )
        conn.commit()
        cur.close()
        conn.close()

        try:
            _send_confirmation_emails(name, email, order_type, details, calculated_total, address)
        except Exception as email_exc:
            logger.error("Failed to send confirmation emails: %s", email_exc)

        return jsonify({"success": True, "message": "Order placed successfully!"})

    except Exception as exc:
        logger.error("submit_order error: %s", exc)
        return jsonify({"success": False, "message": "An internal error occurred. Please try again."}), 500


# ---------------------------------------------------------------------------
# Routes — admin
# ---------------------------------------------------------------------------

@app.route("/login", methods=["GET", "POST"])
def login():
    """Admin login page."""
    if request.method == "POST":
        username = (request.form.get("username") or "").strip().lower()
        password = (request.form.get("password") or "").strip()

        try:
            conn = get_db_connection()
            cur = DictCursor(conn.cursor())
            cur.execute("SELECT * FROM users WHERE username = %s", (username,))
            user = cur.fetchone()
            cur.close()
            conn.close()
        except Exception as exc:
            logger.error("Login database error: %s", exc)
            return render_template("login.html", error="Database connection error. Please try again.")

        if user and check_password_hash(user["password_hash"], password):
            session["admin_logged_in"] = True
            session["admin_username"] = user["username"]
            session["admin_role"] = user["role"]
            next_url = request.args.get("next") or url_for("view_orders")
            return redirect(next_url)

        return render_template("login.html", error="Invalid username or password.")

    return render_template("login.html")


@app.route("/logout")
def logout():
    """Clear the admin session and redirect to login."""
    session.pop("admin_logged_in", None)
    return redirect(url_for("login"))


@app.route("/orders")
@login_required
def view_orders():
    """Admin view: list all orders, most recent first."""
    try:
        conn = get_db_connection()
        cur = DictCursor(conn.cursor())
        cur.execute("SELECT * FROM orders ORDER BY created_at DESC")
        orders = cur.fetchall()
        cur.close()
        conn.close()

        for order in orders:
            if isinstance(order["details"], str):
                order["details"] = json.loads(order["details"])

        return render_template("orders.html", orders=orders)
    except Exception as exc:
        logger.error("view_orders error: %s", exc)
        return "Could not load orders. Please try again.", 500


@app.route("/update-order-status/<int:order_id>", methods=["POST"])
@login_required
def update_order_status(order_id):
    """Update the status of a single order."""
    try:
        data = request.get_json()
        new_status = sanitize_string(data.get("status", ""), 20)
        allowed_statuses = {"pending", "processing", "delivered", "cancelled"}
        if new_status not in allowed_statuses:
            return jsonify({"success": False, "message": "Invalid status value."}), 400

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("UPDATE orders SET status = %s WHERE id = %s", (new_status, order_id))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"success": True, "message": f"Order #{order_id} updated to '{new_status}'."})
    except Exception as exc:
        logger.error("update_order_status error: %s", exc)
        return jsonify({"success": False, "message": "Could not update order."}), 500


@app.route("/update-prices", methods=["POST"])
@login_required
def update_prices():
    """Update product prices in the settings table."""
    try:
        data = request.get_json()
        conn = get_db_connection()
        cur = conn.cursor()
        for key, value in data.items():
            cur.execute("UPDATE settings SET value = %s WHERE key = %s", (float(value), key))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"success": True, "message": "Prices updated successfully."})
    except Exception as exc:
        logger.error("update_prices error: %s", exc)
        return jsonify({"success": False, "message": "Could not update prices."}), 500


@app.route("/get-staff")
@login_required
def get_staff():
    """Return all staff members in the users table."""
    try:
        conn = get_db_connection()
        cur = DictCursor(conn.cursor())
        cur.execute("SELECT id, username, role, created_at FROM users ORDER BY username ASC")
        staff = cur.fetchall()
        cur.close()
        conn.close()
        
        # Convert timestamps to strings for JSON
        for member in staff:
            if member.get("created_at"):
                member["created_at"] = member["created_at"].strftime('%Y-%m-%d %H:%M')
                
        return jsonify({"success": True, "staff": staff})
    except Exception as exc:
        logger.error("get_staff error: %s", exc)
        return jsonify({"success": False, "message": "Could not retrieve staff."}), 500


@app.route("/add-staff", methods=["POST"])
@login_required
def add_staff():
    """Add a new staff member to the users table."""
    if session.get("admin_role") != "admin":
        return jsonify({"success": False, "message": "Permission denied. Only admins can add staff."}), 403
        
    try:
        data = request.get_json()
        username = sanitize_string(data.get("username", ""), 50).strip().lower()
        password = (data.get("password") or "").strip()
        role = sanitize_string(data.get("role", "staff"), 20).strip()
        
        if not username or not password:
            return jsonify({"success": False, "message": "Username and password are required."}), 400
            
        hashed_pass = generate_password_hash(password)
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Check if username exists
        cur.execute("SELECT COUNT(*) FROM users WHERE username = %s", (username,))
        if cur.fetchone()[0] > 0:
            cur.close()
            conn.close()
            return jsonify({"success": False, "message": "Username already exists."}), 400
            
        cur.execute(
            "INSERT INTO users (username, password_hash, role) VALUES (%s, %s, %s)",
            (username, hashed_pass, role)
        )
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"success": True, "message": "Staff member added successfully."})
    except Exception as exc:
        logger.error("add_staff error: %s", exc)
        return jsonify({"success": False, "message": "Could not add staff member."}), 500


@app.route("/delete-staff/<int:user_id>", methods=["POST"])
@login_required
def delete_staff(user_id):
    """Delete a staff member by ID from the users table."""
    if session.get("admin_role") != "admin":
        return jsonify({"success": False, "message": "Permission denied."}), 403
        
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Prevent deleting yourself!
        cur.execute("SELECT username FROM users WHERE id = %s", (user_id,))
        row = cur.fetchone()
        if not row:
            cur.close()
            conn.close()
            return jsonify({"success": False, "message": "User not found."}), 404
            
        if row[0] == session.get("admin_username"):
            cur.close()
            conn.close()
            return jsonify({"success": False, "message": "You cannot delete your own account!"}), 400
            
        cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"success": True, "message": "Staff member deleted successfully."})
    except Exception as exc:
        logger.error("delete_staff error: %s", exc)
        return jsonify({"success": False, "message": "Could not delete staff member."}), 500


# ---------------------------------------------------------------------------
# Email helper
# ---------------------------------------------------------------------------

def _send_confirmation_emails(name, customer_email, order_type, details, total_price, address):
    """
    Send an order confirmation to the customer and a notification to the admin.
    Skips silently if SMTP credentials are not configured.
    """
    if not app.config.get("MAIL_USERNAME") or not app.config.get("MAIL_PASSWORD"):
        logger.warning("MAIL credentials not set — skipping email.")
        return

    admin_email = os.getenv("ADMIN_EMAIL", "aquabliss217@gmail.com")
    try:
        mail.send(Message(
            subject=f"AquaBliss Order Confirmation — {order_type.capitalize()}",
            recipients=[customer_email],
            body=(
                f"Hi {name},\n\n"
                f"Thank you for your {order_type} order from AquaBliss!\n\n"
                f"Total: KSh {total_price:.2f}\n"
                f"Delivery address: {address}\n\n"
                f"We will be in touch shortly.\n\nStay hydrated!\nPure Water, Pure Bliss."
            ),
        ))
        mail.send(Message(
            subject="New AquaBliss Order Received",
            recipients=[admin_email],
            body=(
                f"New order from {name} ({customer_email})\n"
                f"Type: {order_type}\nDetails: {details}\n"
                f"Total: KSh {total_price:.2f}\nAddress: {address}"
            ),
        ))
    except Exception as exc:
        logger.error("Email sending failed: %s", exc)


# ---------------------------------------------------------------------------
# Error handlers — never expose internal details to the client
# ---------------------------------------------------------------------------

@app.errorhandler(404)
def not_found(error):
    """Return a clean 404."""
    return jsonify({"error": "The requested resource was not found."}), 404


@app.errorhandler(429)
def rate_limited(error):
    """Return a clean 429 when the rate limit is exceeded."""
    return jsonify({"error": "Too many requests. Please wait and try again."}), 429


@app.errorhandler(500)
def internal_error(error):
    """Log the full error server-side; return only a generic message to the client."""
    logger.exception("Unhandled 500 error: %s", error)
    return jsonify({"error": "An internal server error occurred."}), 500


# ---------------------------------------------------------------------------
# Entry point (local development only)
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    # Set DEBUG=true in .env for local development only.
    debug_mode = os.getenv("DEBUG", "false").lower() == "true"
    app.run(debug=debug_mode)
