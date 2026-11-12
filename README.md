# 🌿 TvachaAI – Your Personal AI Skincare Companion

<p align="center">
  Smarter Skincare. Powered by AI.
</p>

**TvachaAI is a completed AI-powered skincare assistant MVP** designed to make skincare guidance more accessible, personalized and affordable.

Built using React, FastAPI, PostgreSQL and Google Gemini, TvachaAI allows users to interact with an AI skincare assistant, manage conversations and upload skincare-related documents for analysis.

<details>
<summary>Project status</summary>

**MVP Development: Completed**

The core application, AI integration, authentication, database connectivity, conversation management and document-upload workflow have been implemented.

</details>

---

## ✨ Key Features

- 🤖 **AI Skincare Assistant:** Interactive skincare conversations powered by Google Gemini.
- 💬 **Chat Management:** Create, search, rename, pin and delete conversations.
- 💾 **Persistent Chat History:** Conversations and messages stored in PostgreSQL.
- 📎 **File Attachments:** Upload images, PDF reports and DOCX documents.
- 📄 **Document Analysis:** Extract document text for AI-assisted responses.
- 🔐 **Authentication:** User registration, login and JWT-based authentication.
- 📚 **API Documentation:** Interactive Swagger/OpenAPI documentation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, JavaScript, CSS |
| Backend | Python, FastAPI |
| AI | Google Gemini API |
| Database | PostgreSQL |
| Authentication | JWT |
| API Documentation | Swagger / OpenAPI |
| Image Processing | Pillow |
| PDF Processing | PyMuPDF |
| DOCX Processing | python-docx |

---

## 📁 Project Structure

```text
TvachaAI/
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   ├── ai/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   └── services/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Tejashwinisingh/tvacha-ai.git
cd tvacha-ai
```

### 2. Backend Setup

```bash
python -m venv venv
```

Activate the environment on Windows:

```powershell
venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Configure your local `.env` file with your PostgreSQL credentials and Gemini API key, using the variable names expected by the application.

Start the backend:

```bash
python -m uvicorn app.main:app --reload
```

Backend: `http://127.0.0.1:8000`

Swagger: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

---

## 🚀 Future Enhancements

The core MVP is completed. Future improvements may include:

- Advanced AI-based skin image analysis.
- Personalized user skin profiles.
- Skin history and progress tracking.
- Personalized morning and evening skincare routines.
- Ingredient intelligence and product recommendations.
- Affordable Indian skincare product discovery.
- Multilingual support: English, Hindi and Kannada.
- Production deployment and additional security improvements.

---

## 🎯 Project Vision

Our vision is to make reliable skincare knowledge accessible to everyone, regardless of budget or skincare experience.

TvachaAI combines artificial intelligence and skincare knowledge to help users make more informed skincare decisions.

*TvachaAI provides informational skincare guidance and does not replace professional dermatological diagnosis or treatment.*

---

## 🌍 Open Source

TvachaAI is designed as a free and open-source project.

Contributions, suggestions and feedback are welcome!

## 📜 License

Intended license: MIT License.

## 👩‍💻 Author

**Tejashwini Dhadekar**

GitHub: [@Tejashwinisingh](https://github.com/Tejashwinisingh)

Project Repository: [TvachaAI](https://github.com/Tejashwinisingh/tvacha-ai)

---

<p align="center">

🌿 **TvachaAI – Smarter Skincare, Powered by AI.**

</p>
