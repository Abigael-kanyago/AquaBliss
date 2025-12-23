from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import psycopg2
import os
from dotenv import load_dotenv
from flask_mail import Mail, Message
from functools import wraps

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "dev_secret_key")

# Database configuration
def get_db_connection():
    # Attempt to load from standard names first, then fall back to MYSQL_ names for local dev
    host = os.getenv("DB_HOST", os.getenv("MYSQL_HOST", "localhost"))
    user = os.getenv("DB_USER", os.getenv("MYSQL_USER"))
    
    # SECURITY FIX: PostgreSQL usually uses 'postgres' as admin, not 'root'
    if user == 'root' or user is None:
        user = 'postgres'
        
    password = os.getenv("DB_PASSWORD", os.getenv("MYSQL_PASSWORD"))
    dbname = os.getenv("DB_NAME", os.getenv("MYSQL_DATABASE"))
    
    try:
        conn = psycopg2.connect(
            host=host,
            user=user,
            password=password,
            database=dbname,
            connect_timeout=5 # Don't hang forever
        )
        return conn
    except Exception as e:
        raise Exception(f"DATABASE CONNECTION ERROR: {str(e)}. (Check your Vercel Environment Variables and ensure your database is accessible from the internet).")

# Email configuration
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', os.getenv('MAIL_USERNAME'))

mail = Mail(app)

# Ensure orders and settings tables exist
def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Orders table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255),
            phone VARCHAR(20),
            address TEXT,
            order_type VARCHAR(50),
            details JSONB,
            total_price DECIMAL(10, 2),
            status VARCHAR(20) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Settings table for prices
    cur.execute('''
        CREATE TABLE IF NOT EXISTS settings (
            key VARCHAR(50) PRIMARY KEY,
            value DECIMAL(10, 2) NOT NULL,
            description TEXT
        )
    ''')
    
    # Seed initial prices if they don't exist
    initial_settings = [
        ('refill_price_per_liter', 10.00, 'Price per liter for water refilling'),
        ('bottle_cost', 180.00, 'Cost of a new bottle'),
        ('pump_cost', 250.00, 'Cost of a water pump'),
        ('packaged_price_20l', 180.00, 'Price for a 20L packaged/branded bottle'),
        ('branding_cost', 100.00, 'Additional cost for branding')
    ]
    
    for key, value, desc in initial_settings:
        cur.execute(
            "INSERT INTO settings (key, value, description) VALUES (%s, %s, %s) ON CONFLICT (key) DO NOTHING",
            (key, value, desc)
        )
        
    conn.commit()
    cur.close()
    conn.close()

# Helper for login protection
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_logged_in' not in session:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

# Initialize DB on startup
try:
    init_db()
except Exception as e:
    print(f"Database initialization failed: {e}")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit-order', methods=['POST'])
def submit_order():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "No data provided"}), 400

        name = data.get('name')
        email = data.get('email')
        phone = data.get('phone')
        address = data.get('address')
        order_type = data.get('order_type')
        total_price = data.get('total_price')

        # 1. Fetch current prices from database for validation/calculation
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT key, value FROM settings")
        price_rows = cur.fetchall()
        prices = {row['key']: float(row['value']) for row in price_rows}
        cur.close()

        # 2. Recalculate total server-side to prevent tampering
        calculated_total = 0
        if order_type == 'refill':
            liters = int(data.get('liters', 0))
            calculated_total = liters * prices.get('refill_price_per_liter', 10)
            if data.get('bottle') == 'yes': calculated_total += prices.get('bottle_cost', 180)
            if data.get('pump') == 'yes': calculated_total += prices.get('pump_cost', 250)
        else:
            quantity = int(data.get('quantity', 0))
            calculated_total = quantity * prices.get('packaged_price_20l', 180)
            if data.get('brand') == 'yes': calculated_total += prices.get('branding_cost', 100)

        # 3. Collect additional fields
        details = {}
        if order_type == 'refill':
            details['bottle'] = data.get('bottle')
            details['pump'] = data.get('pump')
            details['liters'] = data.get('liters')
        else:
            details['brand'] = data.get('brand')
            details['quantity'] = data.get('quantity')

        import json
        details_json = json.dumps(details)

        # 4. Save to database
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO orders (name, email, phone, address, order_type, details, total_price) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (name, email, phone, address, order_type, details_json, calculated_total)
        )
        conn.commit()
        cur.close()
        conn.close()

        # Send Emails
        send_confirmation_emails(name, email, order_type, details, calculated_total, address)

        return jsonify({"success": True, "message": "Order placed successfully!"})
    except Exception as e:
        print(f"Error processing order: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

def send_confirmation_emails(name, customer_email, order_type, details, total_price, address):
    try:
        admin_email = "aquabliss217@gmail.com"
        
        # 1. Email to Customer
        cust_msg = Message(
            subject=f"AquaBliss Order Confirmation - {order_type.capitalize()}",
            recipients=[customer_email],
            body=f"Hi {name},\n\nThank you for ordering {order_type} water from AquaBliss! We have received your order and are preparing it for delivery.\n\nTotal: KSh {total_price}\nDelivery Address: {address}\n\nStay hydrated!\n\nPure Water, Pure Bliss."
        )
        # Only send if configured
        if app.config['MAIL_USERNAME'] and app.config['MAIL_PASSWORD']:
            mail.send(cust_msg)
        else:
            print("Skipping email send: MAIL_USERNAME/MAIL_PASSWORD not set in .env")

        # 2. Email to Admin
        admin_msg = Message(
            subject="NEW ORDER RECEIVED!",
            recipients=[admin_email],
            body=f"New order from {name} ({customer_email})\nType: {order_type}\nDetails: {details}\nTotal: KSh {total_price}"
        )
        if app.config['MAIL_USERNAME'] and app.config['MAIL_PASSWORD']:
            mail.send(admin_msg)
            
    except Exception as e:
        print(f"Email sending failed (Check SMTP credentials): {e}")

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Clean inputs (trim spaces and make username lowercase for easier mobile typing)
        username = (username or "").strip().lower()
        password = (password or "").strip()
        
        expected_user = os.getenv('ADMIN_USERNAME', 'admin').strip().lower()
        expected_pass = os.getenv('ADMIN_PASSWORD', 'admin123').strip()
        
        if username == expected_user and password == expected_pass:
            session['admin_logged_in'] = True
            return redirect(url_for('view_orders'))
        else:
            return render_template('login.html', error="Invalid username or password")
            
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('admin_logged_in', None)
    return redirect(url_for('login'))

@app.route('/orders')
@login_required
def view_orders():
    try:
        from psycopg2.extras import RealDictCursor
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM orders ORDER BY created_at DESC")
        orders = cur.fetchall()
        cur.close()
        conn.close()
        
        # Prepare details for template (convert JSON to dict if needed)
        import json
        for order in orders:
            if isinstance(order['details'], str):
                order['details'] = json.loads(order['details'])
                
        return render_template('orders.html', orders=orders)
    except Exception as e:
        return str(e)

@app.route('/update-order-status/<int:order_id>', methods=['POST'])
@login_required
def update_order_status(order_id):
    try:
        data = request.get_json()
        new_status = data.get('status')
        
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("UPDATE orders SET status = %s WHERE id = %s", (new_status, order_id))
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({"success": True, "message": f"Order #{order_id} status updated to {new_status}"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/get-prices')
def get_prices():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM settings")
        settings = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify({"success": True, "prices": settings})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/update-prices', methods=['POST'])
@login_required
def update_prices():
    try:
        data = request.get_json()
        conn = get_db_connection()
        cur = conn.cursor()
        for key, value in data.items():
            cur.execute("UPDATE settings SET value = %s WHERE key = %s", (value, key))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"success": True, "message": "Prices updated successfully"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
