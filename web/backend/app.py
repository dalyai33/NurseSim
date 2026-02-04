from flask import Flask, jsonify, request, session
import psycopg2
import os
from dotenv import load_dotenv
from flask_cors import CORS
import bcrypt
from datetime import timedelta
from simulation import sim_bp

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
app.secret_key = os.getenv("FLASK_SECRET_KEY", "dev-secret-change-me")
app.permanent_session_lifetime = timedelta(days=7)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)
app.register_blueprint(sim_bp)
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
        SELECT id, first_name, last_name, student_id, phone_number, email, password, teacher
        FROM users
        WHERE email = %s;
        """,
        (email,)
    )
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        return jsonify({"ok": False, "error": "Invalid email or password."}), 401

    stored_hash = row[6]

    if not bcrypt.checkpw(password.encode("utf-8"), stored_hash.encode("utf-8")):
        return jsonify({"ok": False, "error": "Invalid email or password."}), 401

    user = {
        "id": row[0],
        "first_name": row[1],
        "last_name": row[2],
        "student_id": row[3],
        "phone_number": row[4],
        "email": row[5],
        "teacher": row[7],
    }

    session.permanent = True
    session["user_id"] = user["id"] 

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

    pw_bytes = password.encode("utf-8")
    pw_hash = bcrypt.hashpw(pw_bytes, bcrypt.gensalt()).decode("utf-8")
    
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
        (first_name, last_name, student_id, phone, email, pw_hash, is_teacher)
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
    session.permanent = True
    session["user_id"] = user["id"]
    return jsonify({"ok": True, "user": user}), 201

@app.route("/api/me", methods=["GET"])
def me():
    #Confirm that session is in fact working
    return jsonify({"ok": True, "user_id": session.get("user_id")})

def require_user():
    user_id = session.get("user_id")
    if not user_id:
        return None, (jsonify({"ok": False, "error": "Not authenticated"}), 401)
    return user_id, None



@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"ok": True})

if __name__ == "__main__":
    app.run(debug=True)
