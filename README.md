# CropDoc AI 🌱

**AI-Powered Plant Disease Diagnosis & Recovery Assistant**

CropDoc AI is a comprehensive agricultural tool to help farmers identify possible plant diseases from leaf photographs, quickly understand predictions alongside AI confidence scores, obtain evidence-based offline agricultural guidance, and reliably track changes through follow-up timeline photography.

## 🚀 Features
- **Instant AI Diagnosis:** Upload leaf photos and get predictions powered by lightweight PyTorch inferencing models.
- **Evidence-Based Knowledge:** Extracts relevant treatments matched to the underlying disease classification from local FAISS vectors.
- **Persistent History Dashboard:** Tracks diagnoses via secure SQLite integration, logging timeline observations (before/after treatment photos).
- **Responsive PWA Interface:** Complete offline-capable PWA modeled using Tailwind CSS and Recharts analytics.
- **Multilingual Support:** English and Tamil pre-configured.

## 📁 Repository Structure
- `/frontend/` - React 18, Vite, Tailwind CSS, Recharts.
- `/backend/` - Python 3.10+, FastAPI, SQLAlchemy, PyTorch.
- `/data/` - ML Model Checkpoints (`model.pth`), SQLite Database, Index.

## ⚙️ Requirements
- Node.js LTS (v18+)
- Python 3.10 to 3.13 (Note: PyTorch on 3.14+ may face compilation limits).
- Git.

## 🛠️ Local Development Setup

### 1. Backend (FastAPI + AI)
```bash
cd backend
python -m venv venv
source venv/Scripts/activate # Windows: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Note: Due to massive library dependencies, if PyPI is inaccessible on corporate networks, install explicit PyTorch wheels natively via `--no-index`.*

### 2. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

For full deployment instructions (Vercel + Render + Models), read [DEPLOYMENT.md](DEPLOYMENT.md).

## 🛡️ License
MIT License.
