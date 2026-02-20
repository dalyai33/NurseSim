# simulation.py
from flask import Blueprint, jsonify, request, session
import psycopg2
import os

sim_bp = Blueprint("sim", __name__, url_prefix="/api/sim")

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

def row_to_step(row):
    return {
        "step_id": row[0],
        "scenario_id": row[1],
        "step_number": row[2],
        "title": row[3] or "",
        "body_text": row[4] or "",
        "prompt_text": row[5] or "",
        "choices": row[6] or [],
    }

def get_step_by_number(cur, scenario_id: int, step_number: int):
    cur.execute("""
        SELECT id, scenario_id, step_number, title, body_text, prompt_text, choices
        FROM sim_steps
        WHERE scenario_id = %s AND step_number = %s
        LIMIT 1;
    """, (scenario_id, step_number))
    row = cur.fetchone()
    return row_to_step(row) if row else None

def compute_attempt_score(cur, attempt_id: int):
    # Get scenario + status + mistakes for this attempt
    cur.execute("""
        SELECT scenario_id, status, COALESCE(mistakes, 0)
        FROM sim_attempts
        WHERE id = %s;
    """, (attempt_id,))
    row = cur.fetchone()
    if not row:
        return 0, 0, 0.0

    scenario_id, status, mistakes = row

    # Total steps in this scenario
    cur.execute("""
        SELECT COUNT(*)
        FROM sim_steps
        WHERE scenario_id = %s;
    """, (scenario_id,))
    total_steps = cur.fetchone()[0] or 0

    if status == "failed":
        return 0, int(total_steps), 0.0

    correct = max(int(total_steps) - int(mistakes), 0)
    total = int(total_steps)
    score_percent = round((correct / total) * 100, 2) if total else 0.0

    return correct, total, score_percent


@sim_bp.route("/progress", methods=["GET"])
def sim_progress():
    """
    Matches your SimLandingPage expectations:
      { ok, tutorialCompleted, level1: { completed, score, correct, total } | null }
    """
    user_id, err = require_user()
    if err:
        return err

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT EXISTS (
            SELECT 1
            FROM sim_attempts a
            JOIN sim_scenarios s ON s.id = a.scenario_id
            JOIN sim_levels l ON l.id = s.level_id
            WHERE a.user_id = %s
              AND a.status = 'passed'
              AND l.level_number = 1
              AND s.scenario_number = 99
        );
    """, (user_id,))
    tutorial_completed = cur.fetchone()[0]

    # latest passed attempt for Level 1 scenario (scenario_id=1)
    cur.execute("""
        SELECT a.id
        FROM sim_attempts a
        WHERE a.user_id = %s
          AND a.scenario_id = 1
          AND a.status = 'passed'
        ORDER BY a.ended_at DESC NULLS LAST
        LIMIT 1;
    """, (user_id,))
    row = cur.fetchone()

    level1 = None
    if row:
        attempt_id = row[0]
        correct, total, score_percent = compute_attempt_score(cur, attempt_id)
        level1 = {
            "attempt_id": attempt_id,
            "completed": True,
            "score": score_percent,
            "correct": correct,
            "total": total,
        }

    cur.close()
    conn.close()

    return jsonify({
        "ok": True,
        "tutorialCompleted": bool(tutorial_completed),
        "level1": level1
    })


@sim_bp.route("/level1/start", methods=["POST"])
def level1_start():
    """
    Starts (or retakes) Level 1.
    Assumes Level 1 scenario is scenario_id = 1.
    Returns the next step to do.
    """
    user_id, err = require_user()
    if err:
        return err

    data = request.get_json() or {}
    retake = bool(data.get("retake", False))

    scenario_id = 1  # change if needed

    conn = get_connection()
    cur = conn.cursor()

    attempt_id = None

    # Resume existing attempt if not retake
    if not retake:
        cur.execute("""
            SELECT id
            FROM sim_attempts
            WHERE user_id = %s AND scenario_id = %s AND status = 'in_progress'
            ORDER BY started_at DESC
            LIMIT 1;
        """, (user_id, scenario_id))
        row = cur.fetchone()
        if row:
            attempt_id = row[0]

    # Otherwise create new attempt
    if attempt_id is None:
        cur.execute("""
            INSERT INTO sim_attempts (user_id, scenario_id, status, mistakes)
            VALUES (%s, %s, 'in_progress', 0)
            RETURNING id;
        """, (user_id, scenario_id))
        attempt_id = cur.fetchone()[0]
        conn.commit()

    # Next step is (max finalized step_number) + 1
    cur.execute("""
        SELECT COALESCE(MAX(s.step_number), 0)
        FROM sim_attempt_steps ats
        JOIN sim_steps s ON s.id = ats.step_id
        WHERE ats.attempt_id = %s;
    """, (attempt_id,))
    max_finalized_step = cur.fetchone()[0] or 0
    next_step_number = int(max_finalized_step) + 1

    step = get_step_by_number(cur, scenario_id, next_step_number)

    cur.close()
    conn.close()

    return jsonify({"attempt_id": attempt_id, "step": step})

@sim_bp.route("/level2/start", methods=["POST"])
def level2_start():
    """
    Starts or retakes Level 2.
    Assumes Level 2 scenario is scenario_id = 2.
    Returns the next step to do.
    """
    user_id, err = require_user()
    if err:
        return err
    
    data = request.get_json() or {}
    retake = bool(data.get("retake", False))

    scenario_id = 2  # change if needed

    conn = get_connection()
    cur = conn.cursor()

    attempt_id = None

    # Resume existing attempt if not retake
    if not retake:
        cur.execute("""
            SELECT id
            FROM sim_attempts
            WHERE user_id = %s AND scenario_id = %s AND status = 'in_progress'
            ORDER BY started_at DESC
            LIMIT 1;
        """, (user_id, scenario_id))
        row = cur.fetchone()
        if row:
            attempt_id = row[0]

    # Otherwise create new attempt
    if attempt_id is None:
        cur.execute("""
            INSERT INTO sim_attempts (user_id, scenario_id, status, mistakes)
            VALUES (%s, %s, 'in_progress', 0)
            RETURNING id;
        """, (user_id, scenario_id))
        attempt_id = cur.fetchone()[0]
        conn.commit()

    # Next step is (max finalized step_number) + 1
    cur.execute("""
        SELECT COALESCE(MAX(s.step_number), 0)
        FROM sim_attempt_steps ats
        JOIN sim_steps s ON s.id = ats.step_id
        WHERE ats.attempt_id = %s;
    """, (attempt_id,))
    max_finalized_step = cur.fetchone()[0] or 0
    next_step_number = int(max_finalized_step) + 1

    step = get_step_by_number(cur, scenario_id, next_step_number)

    cur.close()
    conn.close()

    return jsonify({"attempt_id": attempt_id, "step": step})


@sim_bp.route("/tutorial/complete", methods=["POST"])
def tutorial_complete():
    user_id, err = require_user()
    if err:
        return err

    conn = get_connection()
    cur = conn.cursor()

    # Tutorial is Level 1, Scenario 99 (must exist in sim_scenarios)
    cur.execute("""
        SELECT s.id
        FROM sim_scenarios s
        JOIN sim_levels l ON l.id = s.level_id
        WHERE l.level_number = 1
          AND s.scenario_number = 99
        LIMIT 1;
    """)
    row = cur.fetchone()
    if not row:
        cur.close()
        conn.close()
        return jsonify({"ok": False, "error": "Tutorial scenario not seeded (Level 1, Scenario 99)"}), 500

    tutorial_scenario_id = row[0]

    # Idempotent
    cur.execute("""
        SELECT 1
        FROM sim_attempts
        WHERE user_id = %s
          AND scenario_id = %s
          AND status = 'passed'
        LIMIT 1;
    """, (user_id, tutorial_scenario_id))

    if cur.fetchone():
        cur.close()
        conn.close()
        return jsonify({"ok": True, "alreadyCompleted": True}), 200

    cur.execute("""
        INSERT INTO sim_attempts (user_id, scenario_id, status, started_at, ended_at, mistakes)
        VALUES (%s, %s, 'passed', NOW(), NOW(), 0);
    """, (user_id, tutorial_scenario_id))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"ok": True}), 200


@sim_bp.route("/attempts/<int:attempt_id>/answer", methods=["POST"])
def answer_step(attempt_id: int):
    """
    Body: { step_id: number, selected_index: number }
    Behavior:
      - Incorrect (not game_over): mistakes += 1, allow retry, do NOT finalize step
      - Correct: finalize step, advance
      - Incorrect + game_over: finalize step, fail attempt
    """
    user_id, err = require_user()
    if err:
        return err

    data = request.get_json() or {}
    step_id = data.get("step_id")
    selected_index = data.get("selected_index")

    if step_id is None or selected_index is None:
        return jsonify({"ok": False, "error": "step_id and selected_index are required"}), 400

    try:
        step_id = int(step_id)
        selected_index = int(selected_index)
    except ValueError:
        return jsonify({"ok": False, "error": "step_id and selected_index must be integers"}), 400

    conn = get_connection()
    cur = conn.cursor()

    # Confirm attempt belongs to user and is active
    cur.execute("""
        SELECT scenario_id, status
        FROM sim_attempts
        WHERE id = %s AND user_id = %s
        LIMIT 1;
    """, (attempt_id, user_id))
    attempt_row = cur.fetchone()
    if not attempt_row:
        cur.close()
        conn.close()
        return jsonify({"ok": False, "error": "Attempt not found"}), 404

    scenario_id, status = attempt_row
    if status != "in_progress":
        cur.close()
        conn.close()
        return jsonify({"ok": False, "error": "Attempt is not in progress"}), 409

    # Load step
    cur.execute("""
        SELECT id, scenario_id, step_number, title, body_text, prompt_text, choices,
               correct_index, correct_feedback, incorrect_feedback, incorrect_game_over
        FROM sim_steps
        WHERE id = %s AND scenario_id = %s
        LIMIT 1;
    """, (step_id, scenario_id))
    srow = cur.fetchone()
    if not srow:
        cur.close()
        conn.close()
        return jsonify({"ok": False, "error": "Step not found for this scenario"}), 404

    (
        sid, scid, step_number, title, body_text, prompt_text, choices,
        correct_index, correct_fb, incorrect_fb, incorrect_game_over
    ) = srow

    if not isinstance(choices, list) or selected_index < 0 or selected_index >= len(choices):
        cur.close()
        conn.close()
        return jsonify({"ok": False, "error": "selected_index out of range"}), 400

    is_correct = (correct_index is not None) and (selected_index == int(correct_index))
    feedback = correct_fb if is_correct else incorrect_fb
    game_over = (not is_correct) and bool(incorrect_game_over)

    if (not is_correct) and (not game_over):
        cur.execute("""
            INSERT INTO sim_attempt_step_mistakes (attempt_id, step_id)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING
            RETURNING 1;
        """, (attempt_id, step_id))

        inserted = cur.fetchone() is not None  # True only the FIRST time this step is missed in this attempt

        if inserted:
            cur.execute("""
                UPDATE sim_attempts
                SET mistakes = mistakes + 1
                WHERE id = %s;
            """, (attempt_id,))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "ok": True,
            "completed": False,
            "game_over": False,
            "is_correct": False,
            "feedback": feedback or "",
            "next_step": None
        }), 200

    cur.execute("""
        SELECT 1 FROM sim_attempt_steps
        WHERE attempt_id = %s AND step_id = %s
        LIMIT 1;
    """, (attempt_id, step_id))
    if cur.fetchone():
        cur.close()
        conn.close()
        return jsonify({"ok": False, "error": "Step already finalized for this attempt"}), 409

    cur.execute("""
        INSERT INTO sim_attempt_steps (attempt_id, step_id, chosen_index, is_correct)
        VALUES (%s, %s, %s, %s);
    """, (attempt_id, step_id, selected_index, is_correct))

    completed = False
    next_step = None

    if game_over:
        cur.execute("""
            UPDATE sim_attempts
            SET status = 'failed', ended_at = NOW()
            WHERE id = %s;
        """, (attempt_id,))
        completed = True
    else:
        next_step_number = int(step_number) + 1
        next_step = get_step_by_number(cur, scenario_id, next_step_number)

        if next_step is None:
            cur.execute("""
                UPDATE sim_attempts
                SET status = 'passed', ended_at = NOW()
                WHERE id = %s;
            """, (attempt_id,))
            completed = True

    score_percent = None
    correct = None
    total = None
    if completed:
        correct, total, score_percent = compute_attempt_score(cur, attempt_id)

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({
        "ok": True,
        "completed": completed,
        "game_over": game_over,
        "is_correct": bool(is_correct),
        "feedback": feedback or "",
        "score_percent": score_percent,
        "correct": correct,
        "total": total,
        "next_step": next_step
    })
