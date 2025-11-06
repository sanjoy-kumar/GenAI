# 🧠 GenAI Chatbot Backend (Flask + OpenAI API)

This is the **backend** of the GenAI Chatbot project built with **Flask** and the **OpenAI API**. It handles user queries, sends them to the OpenAI model, and returns the generated responses to the frontend.

---

## 🚀 Features

- Connects to OpenAI API for natural language responses  
- Simple REST API (`/api/chat`)  
- CORS-enabled for frontend communication  
- Easy to configure with environment variables  

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/genaiChatbot.git
cd genaiChatbot/backend
```

### 2. Create Virtual Environment
```
python -m venv .venv
```

### 3. Activate Environment

### Windows (PowerShell):
```
.venv\Scripts\Activate.ps1
```

### macOS/Linux:
```
source .venv/bin/activate
```

### 4. Install Dependencies
```
pip install -r requirements.txt
```
If *requirements.txt* doesn’t exist, you can create one:
```
pip freeze > requirements.txt
```
### 5. Set Up Environment Variables
Create a file named *.env* in the *backend* folder:
```
OPENAI_API_KEY=your_openai_api_key_here
```

### 6. Run the Server
```
python app.py
```

The server will start at:

```
http://127.0.0.1:5000
```
### 📡 API Endpoint
####  POST /api/chat

#### Request:

```
{
  "message": "Hello, how are you?"
}
```
Response:
```
{
  "reply": "Hello! I'm a GenAI chatbot. How can I help you today?"
}
```

### 🧩 Project Structure

```
backend/
│
├── app.py                # Main Flask server
├── .env                  # Environment variables (not committed)
├── requirements.txt       # Python dependencies
└── __pycache__/           # Cached files (ignore)
```

### 🛠️ Tech Stack

  * Python 3.11+
  * Flask
  * Flask-CORS
  * OpenAI Python SDK


### ✅ Example Run

```
(.venv) PS D:\Portfolio Projects\GenAI\genaiChatbot\backend> python app.py
 * Running on http://127.0.0.1:5000
```

### ⚡ Notes

  * Ensure your .env file contains a valid OpenAI API key.
  * The backend is designed to work seamlessly with the React frontend.
  * You can deploy this API on GCP, AWS, or Render.

### 📜 License

This project is open source and available under the MIT License.

## ✨ Author

### Sanjoy Kumar Das
#### 💻 Full-Stack Developer (Python | React | AI)
#### 🌐 GitHub

