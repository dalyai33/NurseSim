from flask import Flask

from backend.chatbot import chat_bot


def test_chat_route_requires_message():
    app = Flask(__name__)
    app.register_blueprint(chat_bot)
    with app.test_client() as client:
        resp = client.post("/api/chat", json={})
        assert resp.status_code == 400
        assert resp.get_json()["error"] == "Message is required"


def test_chat_route_returns_hints(monkeypatch):
    app = Flask(__name__)
    app.register_blueprint(chat_bot)
    monkeypatch.setattr("backend.chatbot.get_help", lambda msg: "hint")
    with app.test_client() as client:
        resp = client.post("/api/chat", json={"message": "help me"})
        assert resp.status_code == 200
        assert resp.get_json() == {"reply: ": "hint"}
