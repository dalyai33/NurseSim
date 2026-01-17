from flask import Blueprint, request, jsonify
from gemini import get_help

chat_bot = Blueprint("chat", __name__)


@chat_bot.route("/api/chat", methods=["POST"])

def chat():
    data = request.get_json(silent=True)
    
    if not data or "message" not in data:
        return jsonify({"error": "Message is required"}), 400
    
    try:
        reply = get_help(data["message"])
        return jsonify({"Nurse+: ": reply})
    except Exception as e:
        return jsonify({"Error:": str(e)}), 500