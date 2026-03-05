# classes.py – all classes and class_members table logic
from flask import Blueprint, jsonify, request, session
import psycopg2
import os
import random
import string

classes_bp = Blueprint("classes", __name__, url_prefix="/api/classes")


def get_connection():
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
    )


def require_user():
    user_id = session.get("user_id")
    if not user_id:
        return None, (jsonify({"ok": False, "error": "Not authenticated"}), 401)
    return user_id, None


def require_teacher(cur, user_id):
    cur.execute("SELECT teacher FROM users WHERE id = %s;", (user_id,))
    row = cur.fetchone()
    if not row or not row[0]:
        return False
    return True


def generate_join_code(cur, length=6):
    chars = string.ascii_uppercase + string.digits
    for _ in range(10):
        code = "".join(random.choices(chars, k=length))
        cur.execute("SELECT 1 FROM classes WHERE join_code = %s;", (code,))
        if cur.fetchone() is None:
            return code
    return None


def _bitmask_to_levels(mask):
    """Convert bitmask to list of levels: 1=level1, 2=level2, 4=level3. 0 -> [1] default."""
    if not mask:
        return [1]
    levels = []
    if mask & 1:
        levels.append(1)
    if mask & 2:
        levels.append(2)
    if mask & 4:
        levels.append(3)
    return levels if levels else [1]


def _levels_to_bitmask(levels):
    """Convert list of levels (1,2,3) to bitmask."""
    mask = 0
    for L in levels:
        if L == 1:
            mask |= 1
        elif L == 2:
            mask |= 2
        elif L == 3:
            mask |= 4
    return mask if mask else 1


def row_to_class(row):
    """Row: id, teacher_id, name, join_code, curriculum_level (bitmask). Returns curriculum_levels list."""
    d = {
        "id": row[0],
        "teacher_id": row[1],
        "name": row[2],
        "join_code": row[3],
    }
    if len(row) > 4 and row[4] is not None:
        d["curriculum_levels"] = _bitmask_to_levels(int(row[4]))
    else:
        d["curriculum_levels"] = [1]
    return d


# ----- Teacher: create class -----
@classes_bp.route("", methods=["POST"])
def create_class():
    user_id, err = require_user()
    if err:
        return err

    data = request.get_json() or {}
    name = (data.get("name") or "").strip()
    raw_levels = data.get("curriculum_levels") or data.get("curriculum_level")
    if isinstance(raw_levels, list):
        levels = [int(x) for x in raw_levels if int(x) in (1, 2, 3)]
    else:
        levels = [int(raw_levels)] if raw_levels in (1, 2, 3) else [1]
    if not levels:
        levels = [1]
    curriculum_level = _levels_to_bitmask(levels)

    if not name:
        return jsonify({"ok": False, "error": "Class name is required."}), 400

    conn = get_connection()
    cur = conn.cursor()
    try:
        if not require_teacher(cur, user_id):
            return jsonify({"ok": False, "error": "Only teachers can create classes."}), 403

        join_code = generate_join_code(cur)
        if not join_code:
            return jsonify({"ok": False, "error": "Could not generate unique join code."}), 500

        cur.execute(
            """
            INSERT INTO classes (teacher_id, name, join_code, curriculum_level)
            VALUES (%s, %s, %s, %s)
            RETURNING id, teacher_id, name, join_code, curriculum_level;
            """,
            (user_id, name, join_code, curriculum_level),
        )
        row = cur.fetchone()
        conn.commit()
        out = row_to_class(row) if row else None
        return jsonify({"ok": True, "class": out}), 201
    except psycopg2.Error as e:
        conn.rollback()
        if "curriculum_level" in str(e):
            return jsonify({
                "ok": False,
                "error": "Database missing curriculum_level column. Run: python add_curriculum_level.py",
            }), 500
        return jsonify({"ok": False, "error": str(e)}), 500
    finally:
        cur.close()
        conn.close()


# ----- Teacher: get one class by id (must own it) -----
@classes_bp.route("/<int:class_id>", methods=["GET"])
def get_class(class_id):
    user_id, err = require_user()
    if err:
        return err

    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            SELECT id, teacher_id, name, join_code, curriculum_level
            FROM classes
            WHERE id = %s AND teacher_id = %s;
            """,
            (class_id, user_id),
        )
        row = cur.fetchone()
        if not row:
            return jsonify({"ok": False, "error": "Class not found."}), 404
        return jsonify({"ok": True, "class": row_to_class(row)})
    finally:
        cur.close()
        conn.close()


# ----- Teacher: list students in a class (must own it) -----
@classes_bp.route("/<int:class_id>/students", methods=["GET"])
def list_class_students(class_id):
    user_id, err = require_user()
    if err:
        return err

    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT teacher_id FROM classes WHERE id = %s;",
            (class_id,),
        )
        row = cur.fetchone()
        if not row or row[0] != user_id:
            return jsonify({"ok": False, "error": "Class not found."}), 404

        cur.execute(
            """
            SELECT u.id, u.first_name, u.last_name, u.email
            FROM class_members m
            JOIN users u ON u.id = m.user_id
            WHERE m.class_id = %s AND m.role = 'student'
            ORDER BY u.last_name, u.first_name;
            """,
            (class_id,),
        )
        rows = cur.fetchall()
        students = [
            {
                "id": r[0],
                "first_name": r[1],
                "last_name": r[2],
                "email": r[3] or "",
            }
            for r in rows
        ]
        return jsonify({"ok": True, "students": students})
    finally:
        cur.close()
        conn.close()


# ----- Teacher: list my classes -----
@classes_bp.route("", methods=["GET"])
def list_classes():
    user_id, err = require_user()
    if err:
        return err

    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            SELECT id, teacher_id, name, join_code, curriculum_level
            FROM classes
            WHERE teacher_id = %s
            ORDER BY id ASC;
            """,
            (user_id,),
        )
        rows = cur.fetchall()
        out = [row_to_class(r) for r in rows]
        return jsonify({"ok": True, "classes": out})
    except psycopg2.Error as e:
        if "curriculum_level" in str(e):
            cur.execute(
                "SELECT id, teacher_id, name, join_code FROM classes WHERE teacher_id = %s ORDER BY id ASC;",
                (user_id,),
            )
            rows = cur.fetchall()
            out = [{"id": r[0], "teacher_id": r[1], "name": r[2], "join_code": r[3], "curriculum_levels": [1]} for r in rows]
            return jsonify({"ok": True, "classes": out})
        return jsonify({"ok": False, "error": str(e)}), 500
    finally:
        cur.close()
        conn.close()


# ----- Student: join class by code -----
@classes_bp.route("/join", methods=["POST"])
def join_class():
    user_id, err = require_user()
    if err:
        return err

    data = request.get_json() or {}
    code = (data.get("code") or "").strip().upper()
    if not code:
        return jsonify({"ok": False, "error": "Join code is required."}), 400

    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            SELECT id, teacher_id, name, join_code, curriculum_level
            FROM classes
            WHERE UPPER(TRIM(join_code)) = %s;
            """,
            (code,),
        )
        row = cur.fetchone()
        if not row:
            return jsonify({"ok": False, "error": "Invalid join code."}), 404

        class_id = row[0]
        cur.execute(
            "SELECT 1 FROM class_members WHERE user_id = %s AND class_id = %s;",
            (user_id, class_id),
        )
        if cur.fetchone():
            return jsonify({"ok": True, "class": row_to_class(row), "message": "Already in this class."})

        cur.execute(
            "INSERT INTO class_members (user_id, class_id, role) VALUES (%s, %s, 'student');",
            (user_id, class_id),
        )
        conn.commit()
        return jsonify({"ok": True, "class": row_to_class(row)}), 201
    except psycopg2.Error as e:
        conn.rollback()
        return jsonify({"ok": False, "error": str(e)}), 500
    finally:
        cur.close()
        conn.close()


# ----- Get current user's class (for students: the class they're in; for teachers: optional) -----
@classes_bp.route("/me", methods=["GET"])
def my_class():
    user_id, err = require_user()
    if err:
        return err

    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            SELECT c.id, c.teacher_id, c.name, c.join_code, c.curriculum_level
            FROM classes c
            JOIN class_members m ON m.class_id = c.id
            WHERE m.user_id = %s
            LIMIT 1;
            """,
            (user_id,),
        )
        row = cur.fetchone()
        if not row:
            return jsonify({"ok": True, "class": None})

        return jsonify({"ok": True, "class": row_to_class(row)})
    except psycopg2.Error as e:
        if "curriculum_level" not in str(e):
            return jsonify({"ok": False, "error": str(e)}), 500
        try:
            cur.execute(
                """
                SELECT c.id, c.teacher_id, c.name, c.join_code
                FROM classes c
                JOIN class_members m ON m.class_id = c.id
                WHERE m.user_id = %s
                LIMIT 1;
                """,
                (user_id,),
            )
            row = cur.fetchone()
            if not row:
                return jsonify({"ok": True, "class": None})
            return jsonify({"ok": True, "class": {"id": row[0], "teacher_id": row[1], "name": row[2], "join_code": row[3], "curriculum_levels": [1]}})
        except psycopg2.Error:
            return jsonify({"ok": False, "error": str(e)}), 500
    finally:
        cur.close()
        conn.close()
