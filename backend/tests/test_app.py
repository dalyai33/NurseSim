import pytest
from flask import session

from backend.app import app as backend_app, require_user, get_connection as get_connection_app


def test_health_endpoint():
    with backend_app.test_client() as client:
        res = client.get("/api/health")
        assert res.status_code == 200
        assert res.get_json() == {"status": "ok"}


def test_require_user_not_authenticated():
    with backend_app.test_request_context():
        session.clear()
        uid, err = require_user()
        assert uid is None
        assert err[1] == 401


def test_app_get_connection(monkeypatch):
    called = {}

    class FakePG:
        def __call__(self, **kwargs):
            called.update(kwargs)
            return object()

    monkeypatch.setattr("backend.app.psycopg2.connect", FakePG())
    conn = get_connection_app()
    assert conn is not None
    assert called


def test_me_and_logout_flow():
    with backend_app.test_client() as client:
        with client.session_transaction() as sess:
            sess["user_id"] = 42

        r = client.get("/api/me")
        assert r.status_code == 200
        assert r.get_json()["user_id"] == 42

        r2 = client.post("/api/logout")
        assert r2.status_code == 200

        r3 = client.get("/api/me")
        assert r3.get_json()["user_id"] is None


def test_login_missing_fields():
    with backend_app.test_client() as client:
        r = client.post("/api/login", json={"email": ""})
        assert r.status_code == 400
        assert "Email and password are required" in r.get_json()["error"]


def test_login_invalid_credentials(monkeypatch):
    class FakeCursor:
        def execute(self, sql, params=None):
            pass

        def fetchone(self):
            return None

        def close(self):
            pass

    class FakeConn:
        def cursor(self):
            return FakeCursor()

        def close(self):
            pass

    monkeypatch.setattr("backend.app.get_connection", lambda: FakeConn())

    with backend_app.test_client() as client:
        r = client.post("/api/login", json={"email": "nope@example.com", "password": "xyz"})
        assert r.status_code == 401
        assert "Invalid email or password" in r.get_json()["error"]


def test_login_success(monkeypatch):
    import bcrypt

    plain = "password123"
    hashed = bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    class FakeCursor:
        def execute(self, sql, params=None):
            pass

        def fetchone(self):
            return (10, "First", "Last", "S1", "000-0000", "user@example.com", hashed, False)

        def close(self):
            pass

    class FakeConn:
        def cursor(self):
            return FakeCursor()

        def close(self):
            pass

    monkeypatch.setattr("backend.app.get_connection", lambda: FakeConn())

    with backend_app.test_client() as client:
        r = client.post("/api/login", json={"email": "user@example.com", "password": plain})
        assert r.status_code == 200
        assert r.get_json()["ok"] is True
        assert r.get_json()["user"]["id"] == 10


def test_get_users(monkeypatch):
    class FakeCursor:
        def execute(self, sql, params=None):
            pass

        def fetchall(self):
            return [
                (1, "Alice", "Smith", "A1", "111-1111", "alice@example.com", False),
                (2, "Bob", "Jones", "B2", "222-2222", "bob@example.com", True),
            ]

        def close(self):
            pass

    class FakeConn:
        def cursor(self):
            return FakeCursor()

        def close(self):
            pass

    monkeypatch.setattr("backend.app.get_connection", lambda: FakeConn())

    with backend_app.test_client() as client:
        r = client.get("/api/users")
        assert r.status_code == 200
        users = r.get_json()
        assert len(users) == 2
        assert users[0]["email"] == "alice@example.com"


def test_signup_options():
    with backend_app.test_client() as client:
        r = client.options("/api/signup")
        assert r.status_code == 204


def test_signup_missing_fields():
    with backend_app.test_client() as client:
        r = client.post("/api/signup", json={})
        assert r.status_code == 400
        assert "Missing required fields" in r.get_json()["error"]


def test_signup_email_in_use(monkeypatch):
    class FakeCursor:
        def execute(self, sql, params=None):
            pass

        def fetchone(self):
            return (1,)

        def close(self):
            pass

    class FakeConn:
        def cursor(self):
            return FakeCursor()

        def close(self):
            pass

        def commit(self):
            pass

    monkeypatch.setattr("backend.app.get_connection", lambda: FakeConn())

    with backend_app.test_client() as client:
        r = client.post("/api/signup", json={
            "first_name": "Alice",
            "last_name": "Smith",
            "student_id": "S1",
            "phone_number": "111-1111",
            "email": "alice@example.com",
            "password": "pass"
        })
        assert r.status_code == 409
        assert "Email already in use" in r.get_json()["error"]


def test_signup_success(monkeypatch):
    class FakeCursor:
        def __init__(self):
            self.calls = 0

        def execute(self, sql, params=None):
            self.calls += 1

        def fetchone(self):
            # first fetchone is existing check -> None
            # second fetchone is row from insert
            if self.calls == 1:
                return None
            return (10, "Alice", "Smith", "S1", "111-1111", "alice@example.com", False)

        def close(self):
            pass

    class FakeConn:
        def __init__(self):
            self.cursor_obj = FakeCursor()

        def cursor(self):
            return self.cursor_obj

        def close(self):
            pass

        def commit(self):
            pass

    monkeypatch.setattr("backend.app.get_connection", lambda: FakeConn())

    with backend_app.test_client() as client:
        r = client.post("/api/signup", json={
            "first_name": "Alice",
            "last_name": "Smith",
            "student_id": "S1",
            "phone_number": "111-1111",
            "email": "alice@example.com",
            "password": "pass"
        })
        assert r.status_code == 201
        assert r.get_json()["user"]["id"] == 10

