from flask import Flask, jsonify
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()  # This will load the .env file that I will post and pin in the discord server 

def get_connection():
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )

app = Flask(__name__)

@app.route("/api/users", methods=["GET"]) # http://localhost:5000/api/users
def get_users():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, email, teacher FROM users;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    users = [{"id": r[0], "email": r[1], "teacher": r[2]} for r in rows]
    return jsonify(users)

if __name__ == "__main__":
    app.run(debug=True)
