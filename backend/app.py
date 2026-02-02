from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from chatbot import chat_bot

#make sure to pip install flask-cors

load_dotenv()

app = Flask(__name__)
CORS(app)

app.register_blueprint(chat_bot)

# just for testing pusposes
@app.route("/api/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    # only here, turn it off when shipping to the production (in we ever did)
    app.run(debug=True)
