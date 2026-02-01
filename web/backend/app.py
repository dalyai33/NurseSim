from flask import Flask, jsonify, request
import psycopg2
import os
from dotenv import load_dotenv
from flask_cors import CORS
import bcrypt

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
CORS(app, origins=["http://localhost:5173"])
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"ok": False, "error": "Email and password are required."}), 400

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT id, first_name, last_name, student_id, phone_number, email, teacher
        FROM users
        WHERE email = %s AND password = %s;
        """,
        (email, password)
    )
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        return jsonify({"ok": False, "error": "Invalid email or password."}), 401

    user = {
        "id": row[0],
        "first_name": row[1],
        "last_name": row[2],
        "student_id": row[3],
        "phone_number": row[4],
        "email": row[5],
        "teacher": row[6],
    }

    return jsonify({"ok": True, "user": user}), 200


@app.route("/api/users", methods=["GET"])
def get_users():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, first_name, last_name, student_id, phone_number, email, teacher
        FROM users;
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    users = [
        {
            "id": r[0],
            "first_name": r[1],
            "last_name": r[2],
            "student_id": r[3],
            "phone_number": r[4],
            "email": r[5],
            "teacher": r[6],
        }
        for r in rows
    ]
    return jsonify(users)

@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json() or {}

    first_name  = data.get("first_name")
    last_name   = data.get("last_name")
    student_id  = data.get("student_id")
    phone       = data.get("phone_number")
    email       = data.get("email")
    password    = data.get("password")
    is_teacher  = data.get("is_teacher", False)
    teacher_code = data.get("teacher_code", "")

    missing = []
    if not first_name:  missing.append("first_name")
    if not last_name:   missing.append("last_name")
    if not student_id:  missing.append("student_id")
    if not phone:       missing.append("phone_number")
    if not email:       missing.append("email")
    if not password:    missing.append("password")

    if missing:
        return jsonify({
            "ok": False,
            "error": f"Missing required fields: {', '.join(missing)}"
        }), 400

    pw_byes = password.encode("utf-8")
    pw_hash = bcrypt.hashpw(pw_byes, bcrypt.gensalt()).decode("utf-8")
    
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id FROM users WHERE email = %s;", (email,))
    
    existing = cur.fetchone()
    if existing:
        cur.close()
        conn.close()
        return jsonify({"ok": False, "error": "Email already in use."}), 409

    cur.execute(
        """
        INSERT INTO users (first_name, last_name, student_id, phone_number, email, password, teacher)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id, first_name, last_name, student_id, phone_number, email, teacher;
        """,
        (first_name, last_name, student_id, phone, email, password, is_teacher)
    )
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    user = {
        "id": row[0],
        "first_name": row[1],
        "last_name": row[2],
        "student_id": row[3],
        "phone_number": row[4],
        "email": row[5],
        "teacher": row[6],
    }

    return jsonify({"ok": True, "user": user}), 201

if __name__ == "__main__":
    app.run(debug=True)
