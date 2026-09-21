import os
import sys
import pg8000
from dotenv import load_dotenv
load_dotenv()
print('HOST', os.getenv('DB_HOST'))
print('USER', os.getenv('DB_USER'))
try:
    conn = pg8000.connect(
        host=os.getenv('DB_HOST','localhost'),
        user=os.getenv('DB_USER','postgres'),
        password=os.getenv('DB_PASSWORD',''),
        database=os.getenv('DB_NAME','postgres'),
        port=int(os.getenv('DB_PORT',5432)),
        timeout=5
    )
    cur = conn.cursor()
    cur.execute('SELECT version()')
    print('CONNECTED', cur.fetchone())
    cur.close()
    conn.close()
except Exception as e:
    print('ERROR', repr(e))
    sys.exit(1)
