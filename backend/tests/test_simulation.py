import pytest
from flask import Flask, session

from backend.simulation import (
    compute_attempt_score,
    get_latest_passed_level,
    row_to_step,
    get_step_by_number,
    require_user,
)


def test_require_user_behavior():
    app = Flask(__name__)
    app.secret_key = 'test'

    with app.test_request_context():
        session.clear()
        uid, err = require_user()
        assert uid is None
        assert err[1] == 401

    with app.test_request_context():
        session['user_id'] = 42
        uid, err = require_user()
        assert uid == 42
        assert err is None


def test_row_to_step_none_fields():
    r = (10, 1, 1, None, None, None, None)
    out = row_to_step(r)
    assert out['title'] == ''
    assert out['body_text'] == ''
    assert out['prompt_text'] == ''
    assert out['choices'] == []


def test_compute_attempt_score_zero_total():
    class C:
        def __init__(self):
            self.calls = 0

        def execute(self, *_a, **_kw):
            self.calls += 1

        def fetchone(self):
            if self.calls == 1:
                return (1, 'passed', 0)
            return (0,)

    assert compute_attempt_score(C(), 1) == (0, 0, 0.0)


def test_get_latest_passed_level_success(monkeypatch):
    class FakeC:
        def __init__(self):
            self.calls = 0

        def execute(self, *_a, **_kw):
            self.calls += 1

        def fetchone(self):
            if self.calls == 1:
                return (123,)
            return None

    monkeypatch.setattr('backend.simulation.compute_attempt_score', lambda cur, attempt_id: (4, 5, 80.0))
    result = get_latest_passed_level(FakeC(), user_id=1, scenario_id=1)
    assert result['attempt_id'] == 123
    assert result['score'] == 80.0


def test_get_step_by_number_hit_and_miss():
    class FakeCursor:
        def __init__(self):
            self.sql = ''

        def execute(self, sql, params=None):
            self.sql = sql

        def fetchone(self):
            if 'FROM sim_steps' in self.sql:
                return (11, 99, 5, 'T', 'B', 'P', ['x'])
            return None

        def fetchall(self):
            return []

    row = get_step_by_number(FakeCursor(), scenario_id=99, step_number=5)
    assert row['step_id'] == 11
    assert row['choices'] == ['x']

    class EmptyCursor(FakeCursor):
        def fetchone(self):
            return None

    assert get_step_by_number(EmptyCursor(), scenario_id=99, step_number=5) is None


def test_sim_progress_levels_and_tutorial(monkeypatch):
    class FakeCursor:
        def __init__(self):
            self.query = ''
            self.call = 0
            self.fetchall_count = 0

        def execute(self, sql, params=None):
            self.query = sql
            self.call += 1

        def fetchone(self):
            if 'SELECT EXISTS' in self.query:
                return (True,)
            if 'FROM sim_attempts a' in self.query and 'SELECT a.id' in self.query:
                return (101,)
            if 'FROM sim_attempts' in self.query and 'scenario_id = ANY' in self.query:
                return (201, 11)
            if 'SELECT COALESCE(MAX(s.step_number)' in self.query:
                return (0,)
            return None

        def fetchall(self):
            if 'FROM sim_scenarios' in self.query:
                self.fetchall_count += 1
                if self.fetchall_count == 3:
                    return []
                return [(11,),]
            return []

        def close(self):
            pass

    class FakeConn:
        def cursor(self):
            return FakeCursor()

        def close(self):
            pass

    monkeypatch.setattr('backend.simulation.require_user', lambda: (1, None))
    monkeypatch.setattr('backend.simulation.get_connection', lambda: FakeConn())
    monkeypatch.setattr('backend.simulation.compute_attempt_score', lambda cur, attempt_id: (3, 4, 75.0))

    app = Flask(__name__)
    app.secret_key = 'test'
    from backend.simulation import sim_bp
    app.register_blueprint(sim_bp)

    with app.test_client() as client:
        resp = client.get('/api/sim/progress')
        assert resp.status_code == 200
        body = resp.get_json()
        assert body['ok'] is True
        assert body['tutorialCompleted'] is True
        assert body['level1']['score'] == 75.0
        assert body['level2'] is not None
        assert body['level3'] is None


def test_level_start_inserts_new(monkeypatch):
    class FakeCursor:
        def __init__(self):
            self.sql = ''
            self.step_called = False

        def execute(self, sql, params=None):
            self.sql = sql
            self.params = params

        def fetchone(self):
            if 'FROM sim_attempts' in self.sql and 'status = ' in self.sql:
                return None
            if 'RETURNING id' in self.sql:
                return (222,)
            if 'COALESCE(MAX' in self.sql:
                return (0,)
            return None

        def fetchall(self):
            return []

        def close(self):
            pass

    class FakeConn:
        def __init__(self):
            self.cur = FakeCursor()

        def cursor(self):
            return self.cur

        def commit(self):
            pass

        def close(self):
            pass

    monkeypatch.setattr('backend.simulation.require_user', lambda: (1, None))
    monkeypatch.setattr('backend.simulation.get_connection', lambda: FakeConn())
    monkeypatch.setattr('backend.simulation.get_step_by_number', lambda cur, scenario_id, step_number: None)

    app = Flask(__name__)
    app.secret_key = 'test'
    from backend.simulation import sim_bp
    app.register_blueprint(sim_bp)

    with app.test_client() as client:
        resp = client.post('/api/sim/level1/start', json={})
        assert resp.status_code == 200
        result = resp.get_json()
        assert result['attempt_id'] == 222
        assert result['step'] is None


def test_tutorial_complete_missing_and_completed(monkeypatch):
    class NullCursor:
        def __init__(self, row):
            self.row = row

        def execute(self, sql, params=None):
            pass

        def fetchone(self):
            return self.row

        def close(self):
            pass

    class FakeConn:
        def __init__(self, row):
            self.row = row

        def cursor(self):
            return NullCursor(self.row)

        def commit(self):
            pass

        def close(self):
            pass

    monkeypatch.setattr('backend.simulation.require_user', lambda: (1, None))

    from backend.simulation import sim_bp
    app = Flask(__name__)
    app.secret_key = 'test'
    app.register_blueprint(sim_bp)

    # missing tutorial scenario
    monkeypatch.setattr('backend.simulation.get_connection', lambda: FakeConn(None))
    with app.test_client() as client:
        resp = client.post('/api/sim/tutorial/complete', json={})
        assert resp.status_code == 500

    # already completed
    monkeypatch.setattr('backend.simulation.get_connection', lambda: FakeConn((1,)))
    with app.test_client() as client:
        monkeypatch.setattr('backend.simulation.require_user', lambda: (1, None))
        resp = client.post('/api/sim/tutorial/complete', json={})
        assert resp.status_code == 200
        assert resp.get_json()['alreadyCompleted'] is True


def test_sim_progress_require_user_error(monkeypatch):
    from backend.simulation import sim_bp
    app = Flask(__name__)
    app.secret_key = 'test'
    app.register_blueprint(sim_bp)

    monkeypatch.setattr('backend.simulation.require_user', lambda: (None, ({'ok': False, 'error': 'Not authenticated'}, 401)))

    with app.test_client() as client:
        r = client.get('/api/sim/progress')
        assert r.status_code == 401


def test_sim_progress_safe_level_edge_cases(monkeypatch):
    from backend.simulation import sim_bp

    class FakeCursor:
        def __init__(self):
            self.query = ''
            self.call = 0

        def execute(self, sql, params=None):
            self.query = sql
            self.call += 1

        def fetchone(self):
            if 'SELECT EXISTS' in self.query:
                return (True,)
            if 'FROM sim_attempts a' in self.query and 'SELECT a.id' in self.query:
                return (101,)
            if 'FROM sim_attempts' in self.query and 'scenario_id = ANY' in self.query:
                return (201, 11)
            if 'FROM sim_steps' in self.query and 'COALESCE(MAX(s.step_number)' in self.query:
                return (0,)
            return None

        def fetchall(self):
            if 'FROM sim_scenarios' in self.query:
                # Ensure one level has no scenarios, one has scenarios
                if 'level_number = 1' in self.query:
                    return []
                if 'level_number = 2' in self.query:
                    return [(21,),]
                return []
            return []

        def close(self):
            pass

    class FakeConn:
        def cursor(self):
            return FakeCursor()

        def close(self):
            pass

    monkeypatch.setattr('backend.simulation.require_user', lambda: (1, None))
    monkeypatch.setattr('backend.simulation.get_connection', lambda: FakeConn())
    monkeypatch.setattr('backend.simulation.compute_attempt_score', lambda cur, attempt_id: (0, 0, 0.0))

    app = Flask(__name__)
    app.secret_key = 'test'
    app.register_blueprint(sim_bp)

    with app.test_client() as client:
        resp = client.get('/api/sim/progress')
        assert resp.status_code == 200
        body = resp.get_json()
        assert body['level1'] is None
        assert body['level2'] is None


def test_level_start_retake_path(monkeypatch):
    from backend.simulation import sim_bp

    class FakeCursor:
        def __init__(self):
            self.sql = ''

        def execute(self, sql, params=None):
            self.sql = sql

        def fetchone(self):
            if 'FROM sim_attempts' in self.sql and 'status = ' in self.sql:
                return (222,)
            if 'COALESCE(MAX(s.step_number)' in self.sql:
                return (1,)
            return None

        def close(self):
            pass

    class FakeConn:
        def cursor(self):
            return FakeCursor()

        def close(self):
            pass

    monkeypatch.setattr('backend.simulation.require_user', lambda: (1, None))
    monkeypatch.setattr('backend.simulation.get_connection', lambda: FakeConn())
    monkeypatch.setattr('backend.simulation.get_step_by_number', lambda cur, scenario_id, step_number: {'step_id': 2})

    app = Flask(__name__)
    app.secret_key = 'test'
    app.register_blueprint(sim_bp)

    with app.test_client() as client:
        resp = client.post('/api/sim/level1/start', json={})
        body = resp.get_json()
        assert body['attempt_id'] == 222
        assert body['step'] == {'step_id': 2}


def test_tutorial_complete_pass_new(monkeypatch):
    from backend.simulation import sim_bp

    class FakeCursor:
        def __init__(self):
            self.calls = 0

        def execute(self, sql, params=None):
            pass

        def fetchone(self):
            self.calls += 1
            if self.calls == 1:
                return (99,)
            if self.calls == 2:
                return None
            return None

        def close(self):
            pass

    class FakeConn:
        def cursor(self):
            return FakeCursor()

        def commit(self):
            pass

        def close(self):
            pass

    monkeypatch.setattr('backend.simulation.require_user', lambda: (1, None))
    monkeypatch.setattr('backend.simulation.get_connection', lambda: FakeConn())

    app = Flask(__name__)
    app.secret_key = 'test'
    app.register_blueprint(sim_bp)

    with app.test_client() as client:
        resp = client.post('/api/sim/tutorial/complete', json={})
        assert resp.status_code == 200
        assert resp.get_json()['ok'] is True


def test_answer_step_invalid_data_and_states(monkeypatch):
    from backend.simulation import sim_bp

    app = Flask(__name__)
    app.secret_key = 'test'
    app.register_blueprint(sim_bp)

    monkeypatch.setattr('backend.simulation.require_user', lambda: (1, None))

    with app.test_client() as client:
        r = client.post('/api/sim/attempts/1/answer', json={'step_id': 'x', 'selected_index': 0})
        assert r.status_code == 400

    class FakeCursor:
        def __init__(self, attempt_row, step_row, mistake_rows=None, final_step=None):
            self.attempt_row = attempt_row
            self.step_row = step_row
            self.mistake_inserted = False
            self.call = 0

        def execute(self, sql, params=None):
            self.sql = sql

        def fetchone(self):
            if 'FROM sim_attempts' in self.sql and 'status' in self.sql and 'id = %s' in self.sql:
                return self.attempt_row
            if 'FROM sim_steps' in self.sql:
                return self.step_row
            if 'FROM sim_attempt_step_mistakes' in self.sql:
                if not self.mistake_inserted:
                    self.mistake_inserted = True
                    return (1,)
                return None
            if 'FROM sim_attempt_steps' in self.sql:
                return None
            return None

        def fetchall(self):
            return []

        def close(self):
            pass

    class FakeConn:
        def __init__(self, cursor):
            self.cursor_obj = cursor

        def cursor(self):
            return self.cursor_obj

        def commit(self):
            pass

        def close(self):
            pass

    # not in_progress path
    class AttemptNotInProgressCursor(FakeCursor):
        def __init__(self):
            super().__init__((1, 'failed'), None)

    monkeypatch.setattr('backend.simulation.get_connection', lambda: FakeConn(AttemptNotInProgressCursor()))
    with app.test_client() as client:
        r = client.post('/api/sim/attempts/1/answer', json={'step_id': 1, 'selected_index': 0})
        assert r.status_code == 409

    # step not found
    class StepNotFoundCursor(FakeCursor):
        def __init__(self):
            super().__init__((1, 'in_progress'), None)

    monkeypatch.setattr('backend.simulation.get_connection', lambda: FakeConn(StepNotFoundCursor()))
    with app.test_client() as client:
        r = client.post('/api/sim/attempts/1/answer', json={'step_id': 1, 'selected_index': 0})
        assert r.status_code == 404

    # selected index out of range
    class OutOfRangeCursor(FakeCursor):
        def __init__(self):
            super().__init__((1, 'in_progress'), (1, 1, 1, '', '', '', ['x'], 0, 'yes', 'no', False))

    monkeypatch.setattr('backend.simulation.get_connection', lambda: FakeConn(OutOfRangeCursor()))
    with app.test_client() as client:
        r = client.post('/api/sim/attempts/1/answer', json={'step_id': 1, 'selected_index': 2})
        assert r.status_code == 400

    # incorrect not game over
    class IncorrectCursor(FakeCursor):
        def __init__(self):
            super().__init__((1, 'in_progress'), (1, 1, 1, '', '', '', ['x','y'], 0, 'yes', 'no', False))

    monkeypatch.setattr('backend.simulation.get_connection', lambda: FakeConn(IncorrectCursor()))
    with app.test_client() as client:
        r = client.post('/api/sim/attempts/1/answer', json={'step_id': 1, 'selected_index': 1})
        assert r.status_code == 200
        assert r.get_json()['completed'] is False

    # game over
    class GameOverCursor(FakeCursor):
        def __init__(self):
            # correct_index=1 makes selected_index=0 incorrect and game_over true
            super().__init__((1, 'in_progress'), (1, 1, 1, '', '', '', ['x'], 1, 'yes', 'no', True))

    monkeypatch.setattr('backend.simulation.get_connection', lambda: FakeConn(GameOverCursor()))
    monkeypatch.setattr('backend.simulation.compute_attempt_score', lambda cur, attempt_id: (0, 1, 0.0))
    with app.test_client() as client:
        r = client.post('/api/sim/attempts/1/answer', json={'step_id': 1, 'selected_index': 0})
        assert r.status_code == 200
        assert r.get_json()['completed'] is True
        assert r.get_json()['game_over'] is True

    # correct and complete
    class CorrectCursor(FakeCursor):
        def __init__(self):
            super().__init__((1, 'in_progress'), (1, 1, 1, '', '', '', ['x'], 0, 'correct', 'wrong', False))

        def fetchone(self):
            # Attempt row first, then step row for current step, then no next step
            if 'FROM sim_attempts' in self.sql and 'status' in self.sql:
                return self.attempt_row
            if 'FROM sim_steps' in self.sql and 'WHERE id = %s' in self.sql:
                return self.step_row
            if 'FROM sim_steps' in self.sql and 'WHERE scenario_id' in self.sql:
                return None
            if 'FROM sim_attempt_step_mistakes' in self.sql:
                return None
            if 'FROM sim_attempt_steps' in self.sql:
                return None
            if 'COALESCE(MAX(s.step_number)' in self.sql:
                return (0,)
            return None

    monkeypatch.setattr('backend.simulation.get_connection', lambda: FakeConn(CorrectCursor()))
    monkeypatch.setattr('backend.simulation.compute_attempt_score', lambda cur, attempt_id: (1, 1, 100.0))
    with app.test_client() as client:
        r = client.post('/api/sim/attempts/1/answer', json={'step_id': 1, 'selected_index': 0})
        assert r.status_code == 200
        assert r.get_json()['completed'] is True
        assert r.get_json()['score_percent'] == 100.0
    from backend.simulation import sim_bp
    app = Flask(__name__)
    app.secret_key = 'test'
    app.register_blueprint(sim_bp)

    monkeypatch.setattr('backend.simulation.require_user', lambda: (1, None))

    with app.test_client() as client:
        r = client.post('/api/sim/attempts/1/answer', json={})
        assert r.status_code == 400
        assert 'step_id and selected_index are required' in r.get_json()['error']


def test_answer_step_not_found(monkeypatch):
    from backend.simulation import sim_bp

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

    app = Flask(__name__)
    app.secret_key = 'test'
    app.register_blueprint(sim_bp)

    monkeypatch.setattr('backend.simulation.require_user', lambda: (1, None))
    monkeypatch.setattr('backend.simulation.get_connection', lambda: FakeConn())

    with app.test_client() as client:
        r = client.post('/api/sim/attempts/1/answer', json={'step_id': 1, 'selected_index': 0})
        assert r.status_code == 404

