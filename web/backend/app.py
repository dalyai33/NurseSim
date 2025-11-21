from flask import Flask, jsonify, request
import psycopg2
import os
from dotenv import load_dotenv
from flask_cors import CORS   # <-- NEW

load_dotenv()

def get_connection():
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])  # Vite dev server

@app.route("/api/users", methods=["GET"])
def get_users():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, email, teacher FROM users;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    users = [{"id": r[0], "email": r[1], "teacher": r[2]} for r in rows]
    return jsonify(users)

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"ok": False, "error": "Missing email or password."}), 400

    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute("SELECT id, email, password, teacher FROM users WHERE email = %s;", (email,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    # No user or wrong password
    if row is None or row[2] != password:
        return jsonify({"ok": False, "error": "Invalid email or password."}), 401

    user = {
        "id": row[0],
        "email": row[1],
        "teacher": row[3],
    }
    return jsonify({"ok": True, "user": user}), 200

if __name__ == "__main__":
    app.run(debug=True)
