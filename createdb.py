import os
import pg8000
from dotenv import load_dotenv
load_dotenv()
host = os.getenv('DB_HOST','localhost')
user = os.getenv('DB_USER','postgres')
password = os.getenv('DB_PASSWORD','')
port = int(os.getenv('DB_PORT',5432))
try:
    conn = pg8000.connect(host=host, user=user, password=password, database='postgres', port=port, timeout=5)
    conn.autocommit = True
    cur = conn.cursor()
    dbname = 'aquabliss'
    cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (dbname,))
    if cur.fetchone():
        print('DATABASE EXISTS', dbname)
    else:
        cur.execute(f"CREATE DATABASE {dbname}")
        print('DATABASE CREATED', dbname)
    cur.close()
    conn.close()
except Exception as e:
    print('ERROR', repr(e))
    raise
