"""
Add curriculum_level column to classes table.
Uses same .env and DB connection as the app. Run from web/backend:
  python add_curriculum_level.py
"""
import os
import sys
from dotenv import load_dotenv
import psycopg2

load_dotenv()


def get_connection():
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
    )


def main():
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            ALTER TABLE public.classes
            ADD COLUMN IF NOT EXISTS curriculum_level integer NOT NULL DEFAULT 1
        """)
        conn.commit()
        print("Added curriculum_level to public.classes (or already existed).")
    except Exception as e:
        conn.rollback()
        print("Error:", e, file=sys.stderr)
        sys.exit(1)
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    main()
