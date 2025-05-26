from flask import Flask, render_template, request, redirect
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from a .env file (for local dev)

app = Flask(__name__)

# MySQL connection setup using environment variables
db = mysql.connector.connect(
    host=os.getenv("MYSQL_HOST"),
    user=os.getenv("MYSQL_USER"),
    password=os.getenv("MYSQL_PASSWORD"),
    database=os.getenv("MYSQL_DATABASE")
)
cursor = db.cursor()

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
    db.commit()

    return redirect('/')  # Correct indentation

@app.route('/orders')
def view_orders():
    cursor.execute("SELECT * FROM orders")
    orders = cursor.fetchall()
    return render_template('orders.html', orders=orders)

if __name__ == '__main__':
    app.run(debug=True)
