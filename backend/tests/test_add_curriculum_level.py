import pytest

from backend.add_curriculum_level import get_connection as get_connection_acl, main as add_curriculum_main


def test_add_curriculum_level_connection(monkeypatch):
    monkeypatch.setenv("DB_NAME", "x")
    monkeypatch.setenv("DB_USER", "u")
    monkeypatch.setenv("DB_PASSWORD", "p")
    monkeypatch.setenv("DB_HOST", "h")
    monkeypatch.setenv("DB_PORT", "5432")

    called = {}

    class FakePG:
        def __call__(self, **kwargs):
            called.update(kwargs)
            return object()

    fake_connect = FakePG()
    monkeypatch.setattr("backend.add_curriculum_level.psycopg2.connect", fake_connect)

    conn = get_connection_acl()
    assert conn is not None
    assert called == {
        "dbname": "x",
        "user": "u",
        "password": "p",
        "host": "h",
        "port": "5432",
    }


def test_add_curriculum_level_main_succeeds(monkeypatch):
    execute_called = {}

    class FakeCur:
        def execute(self, sql):
            execute_called["sql"] = sql

        def close(self):
            pass

    class FakeConn:
        def cursor(self):
            return FakeCur()

        def commit(self):
            execute_called["commit"] = True

        def close(self):
            execute_called["close"] = True

        def rollback(self):
            execute_called["rollback"] = True

    monkeypatch.setattr("backend.add_curriculum_level.get_connection", lambda: FakeConn())

    add_curriculum_main()

    assert "commit" in execute_called
    assert execute_called["commit"] is True


def test_add_curriculum_level_main_rollback_on_error(monkeypatch):
    class UnsafeCur:
        def execute(self, sql):
            raise RuntimeError("boom")

        def close(self):
            pass

    class FakeConn:
        def cursor(self):
            return UnsafeCur()

        def commit(self):
            pass

        def rollback(self):
            self.rolled_back = True

        def close(self):
            pass

    monkeypatch.setattr("backend.add_curriculum_level.get_connection", lambda: FakeConn())

    with pytest.raises(SystemExit) as exc:
        add_curriculum_main()

    assert exc.value.code == 1
