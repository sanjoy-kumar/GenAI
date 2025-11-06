import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI

# Load API key
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

app = Flask(__name__)
CORS(app)

# Store chat history in memory
conversation_history = {}

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message")
    session_id = data.get("session_id", "default")

    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    # Initialize conversation for this session
    if session_id not in conversation_history:
        conversation_history[session_id] = [
            {"role": "system", "content": "You are a helpful AI assistant."}
        ]

    conversation_history[session_id].append({"role": "user", "content": user_message})

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=conversation_history[session_id],
            temperature=0.7,
        )

        reply = response.choices[0].message.content.strip()
        conversation_history[session_id].append({"role": "assistant", "content": reply})

        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/reset", methods=["POST"])
def reset():
    data = request.get_json()
    session_id = data.get("session_id", "default")
    if session_id in conversation_history:
        del conversation_history[session_id]
    return jsonify({"status": "reset"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
