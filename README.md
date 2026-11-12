# 🌿 TvachaAI – AI-Powered Personalized Skincare Platform

<p align="center">
  <strong>Your Skin. Your Journey. Your Personal AI Skincare Companion.</strong>
</p>

<p align="center">
  An intelligent, personalized and affordable skincare platform powered by Artificial Intelligence.
</p>

---

## 📖 About the Project

**TvachaAI** is an AI-powered personalized skincare platform designed to make skincare knowledge accessible, affordable and understandable for everyone.

The platform combines Artificial Intelligence, skincare knowledge, ingredient intelligence and personalized recommendations to help users understand their visible skin characteristics and build suitable skincare routines.

TvachaAI provides an intelligent skincare assistant that interacts with users, understands their skincare concerns, analyzes supported skin images and documents, and generates personalized skincare guidance.

The platform focuses on affordability, accessibility, privacy and personalization, making skincare guidance easier for people with different skin types, concerns and budgets.

## 🎯 Project Objectives

- Make personalized skincare guidance accessible to everyone.
- Provide AI-powered analysis of visible skin characteristics.
- Generate personalized skincare routines.
- Recommend affordable skincare products based on user preferences and budgets.
- Educate users about skincare ingredients and their benefits.
- Maintain skincare history and progress.
- Support multilingual interactions.
- Protect user information and uploaded images.

---

## ✨ Key Features

### 1. AI-Powered Skincare Assistant

- Intelligent conversational skincare assistant.
- Personalized responses based on user concerns and preferences.
- AI-powered skincare guidance using Google Gemini.
- Context-aware conversations.
- Skincare education and ingredient explanations.

### 2. AI Skin Assessment

- Skin assessment through questionnaires.
- Optional skin image analysis.
- Identification of visible skin characteristics.
- Personalized skincare insights.
- Recommendations based on assessment results.

*The platform provides informational guidance, not medical diagnosis.*

### 3. Personalized Skincare Routines

- Customized morning skincare routines.
- Customized evening skincare routines.
- Product and ingredient suggestions.
- Recommendations based on skin preferences.
- Routine improvement guidance.

### 4. Skincare Product Recommendations

- Budget-friendly skincare recommendations.
- INR-based product budgeting.
- Product recommendations for different skin concerns.
- Shopping links to supported Indian marketplaces.
- Affordable skincare alternatives.

### 5. Ingredient Intelligence

- Skincare ingredient information.
- Ingredient benefits and usage guidance.
- Ingredient compatibility information.
- Educational skincare ingredient library.

### 6. Global Skincare Knowledge

Explore skincare practices and knowledge from:

- Indian skincare traditions.
- Korean skincare.
- Japanese skincare.
- Chinese skincare.
- Modern dermatological skincare practices.

### 7. Skin History and Progress Tracking

- Maintain previous skin assessments.
- Review skincare history.
- Track routine changes.
- Monitor progress over time.
- Access personalized skincare information.

### 8. AI Chat and Conversation Management

- Create new conversations.
- Maintain persistent chat history.
- Search previous conversations.
- Rename conversations.
- Pin and unpin conversations.
- Delete conversations.
- Upload supported images and documents.
- Analyze supported PDF and DOCX documents.

### 9. User Authentication and Privacy

- Secure user registration and login.
- Email/password authentication.
- Google authentication.
- JWT-based authorization.
- Personalized user profiles.
- Private handling of uploaded images.
- User-controlled deletion of stored images and history.

### 10. Multilingual Support

Designed to support:

- English.
- Hindi.
- Kannada.

---

## 🤖 AI Agent Architecture

TvachaAI is designed around an AI-powered skincare assistant that coordinates different skincare capabilities.

The agent architecture includes:

| Agent / Module | Responsibility |
|---|---|
| Skincare Assistant Agent | Understands user queries and coordinates skincare guidance |
| Skin Assessment Agent | Processes questionnaire and supported image inputs |
| Routine Recommendation Agent | Creates personalized skincare routines |
| Product Recommendation Agent | Suggests products based on concerns and budgets |
| Ingredient Intelligence Agent | Provides ingredient information and educational insights |
| Skin History Agent | Uses available skincare history for personalization |
| Document Analysis Module | Extracts and processes supported document content |

The AI assistant combines user preferences, available skin information and skincare knowledge to generate relevant responses.

---

## 🏗️ System Architecture

TvachaAI follows a frontend-backend architecture.

```text
                 USER
                   |
                   v
          REACT FRONTEND
                   |
                   v
             FASTAPI BACKEND
                   |
          ---------------------
          |         |         |
          v         v         v
      AUTH API   CHAT API  PROFILE API
          |         |         |
          ---------------------
                   |
                   v
             AI AGENT LAYER
                   |
                   v
             GOOGLE GEMINI
                   |
                   v
              RESPONSE
                   |
          ---------------------
          |                   |
          v                   v
      POSTGRESQL          USER INTERFACE
```

---

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js, JavaScript, CSS |
| Backend | Python, FastAPI |
| AI Integration | Google Gemini API |
| Database | PostgreSQL |
| Authentication | JWT |
| API Documentation | Swagger / OpenAPI |
| Image Processing | Pillow |
| PDF Processing | PyMuPDF |
| DOCX Processing | python-docx |
| Version Control | Git and GitHub |

---

## 📂 Project Structure

```text
TvachaAI/
│
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   ├── ai/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   └── services/
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## ⚙️ Installation and Setup

### Prerequisites

- Python 3.11 or later.
- Node.js and npm.
- PostgreSQL.
- Google Gemini API key.
- Git.

### 1. Clone the Repository

```bash
git clone https://github.com/Tejashwinisingh/tvacha-ai.git
cd tvacha-ai
```

### 2. Backend Setup

Create a virtual environment:

```bash
python -m venv venv
```

Activate on Windows:

```powershell
venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Configure the required environment variables in a local `.env` file.

### 3. Configure Environment Variables

Configure the application with the required settings:

- Database connection URL.
- Gemini API key.
- AI provider.
- AI model.
- Authentication and security settings.
- Email service settings, if enabled.

Use the exact variable names defined by the application configuration.

### 4. Start the Backend

```bash
python -m uvicorn app.main:app --reload
```

Backend URL:

`http://127.0.0.1:8000`

API documentation:

`http://127.0.0.1:8000/docs`

### 5. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

`http://localhost:5173`

---

## 🔒 Security and Privacy

TvachaAI is designed with user privacy and secure data handling as important principles.

- Authentication and authorization for protected resources.
- Secure handling of API credentials.
- User-specific data access.
- Private storage for uploaded images.
- User-controlled deletion of stored information.
- Validation of uploaded files.
- Secure configuration through environment variables.

Sensitive credentials and private user information must never be committed to the public repository.

---

## 🌍 Project Impact

TvachaAI aims to reduce the complexity of skincare by combining AI technology with accessible skincare education.

The platform focuses on:

- Affordable skincare guidance.
- Personalized skincare experiences.
- Better ingredient awareness.
- Accessible skincare knowledge.
- Responsible AI-powered recommendations.

---

## 📜 License

TvachaAI is an open-source project released under the **MIT License**.

See the `LICENSE` file for details.

---

## 👩‍💻 Author

**Tejashwini Dhadekar**

GitHub: [@Tejashwinisingh](https://github.com/Tejashwinisingh)

Project Repository: [TvachaAI](https://github.com/Tejashwinisingh/tvacha-ai)

---

<p align="center">
  🌿 <strong>TvachaAI – Smarter Skincare, Powered by AI.</strong>
</p>

<p align="center">
  Made with ❤️ to make personalized skincare accessible to everyone.
</p>
