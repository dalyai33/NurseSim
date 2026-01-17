from flask import Flask
from dotenv import load_dotenv
from routes.chat import chat_bp

load_dotenv()

app = Flask(__name__)

app.register_blueprint(chat_bp)

# just for testing pusposes
@app.route("/api/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    # only here, turn it off when shipping to the production (in we ever did)
    app.run(debug=True)
