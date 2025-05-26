from flask import Flask, render_template, request, redirect
import psycopg2
import os
from urllib.parse import urlparse

app = Flask(__name__)

# Parse DATABASE_URL from environment variable
DATABASE_URL = os.getenv('DATABASE_URL')

if DATABASE_URL is None:
    raise Exception("DATABASE_URL environment variable not set")

result = urlparse(DATABASE_URL)

conn = psycopg2.connect(
    dbname=result.path[1:],
    user=result.username,
    password=result.password,
    host=result.hostname,
    port=result.port
)

cursor = conn.cursor()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit_order', methods=['POST'])
def submit_order():
    name = request.form['name']
    phone = request.form['phone']
    address = request.form['address']
    quantity = int(request.form['quantity'])
    water_type = request.form['water_type']
    service_type = request.form['service_type']  # "refill" or "package"

    print("Form submitted")
    print(name, phone, address, quantity, water_type, service_type)

    query = """
        INSERT INTO orders (name, phone, address, quantity, water_type, service_type)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    values = (name, phone, address, quantity, water_type, service_type)

    cursor.execute(query, values)
    conn.commit()

    return redirect('/')

@app.route('/orders')
def view_orders():
    cursor.execute("SELECT * FROM orders")
    orders = cursor.fetchall()
    return render_template('orders.html', orders=orders)

if __name__ == '__main__':
    app.run(debug=True)

