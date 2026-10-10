# CropDoc AI - Deployment Guide

This guide details exactly how to package, prepare, and confidently host the CropDoc AI platform onto the live internet using **Vercel** (Frontend) and **Render** (Backend).

---

## A. Creating the GitHub Repository
1. Navigate to your GitHub Desktop or [github.com/new](https://github.com/new).
2. Create a shiny new repository named: `CropDoc-AI`.
3. Set the repository as **Public** or **Private**.
4. Skip initializing README or `.gitignore` (as they are already populated in this folder).

## B. Connecting Code to GitHub
1. Launch PowerShell or Terminal inside `E:\Forgehacks\CropDoc-AI`.
2. Assuming Git is initialized, add your tracked files securely:
```bash
git add .
git commit -m "🚀 Initial release: CropDoc AI Frontend UI, Database Models, and Inference setup"
git remote add origin https://github.com/<your-username>/CropDoc-AI.git
```

## C. Pushing Code Safely
Before pushing, ensure `.env` and `.pth` weight files are strictly ignored.
```bash
git push -u origin master
```

---

## D. Deploying Backend (via Render.com)
1. Register/Login to [Render.com](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository `CropDoc-AI`.
4. Render Configuration:
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type:** Minimum `Starter` (Due to PyTorch RAM loads, free tier will immediately crash).

## E. Setting Backend Environment Variables
Inside your Render Web Service -> **Environment**:
- Add `ALLOWED_ORIGINS`: `https://YOUR-FRONTEND-URL.vercel.app`

## F. Database Configuration (Ephemeral warning)
Render's filesystem is wiped unconditionally on each deployment.
- **For Production:** Map the SQLite configuration over to Render's internal PostgreSQL database to avoid wiping historical predictions. You can alter `database.py` dynamically using SQLAlchemy: `SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")`.

## G. Model Weights & Inference Assets
- GitHub limits uploads to 100MB. If `data/model.pth` is larger, you must utilize Git LFS (Large File Storage), or configure a script inside `main.py` that executes a `wget` downloading your weights from an AWS S3 Bucket upon server boot.

---

## H. Frontend Deployment (via Vercel)
1. Register/Login to [Vercel.com](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Import your GitHub `CropDoc-AI` repository.
4. Set the **Root Directory** to: `frontend/`
5. Vercel naturally detects Vite. 

## I. Setting Frontend Environment Variables
Inside the Vercel configurator:
1. Open the Environment Variables dropdown.
2. Add Key: `VITE_API_URL` -> Value: `https://YOUR-BACKEND-URL.onrender.com` 
3. *Click Deploy!*

## J. Testing and Verification Checklist
- ☑️ Visit your Vercel domain. Ensure images upload natively without blanking the screen.
- ☑️ Observe Developer Dashboard payload transmission. Cross-Origin (CORS) must be verified.
- ☑️ API Check: Directly visit `https://YOUR-BACKEND.onrender.com/api/health`.
- ☑️ If Diagnosis fails immediately: Investigate PyTorch CPU OOM (Out Of Memory) limits inside your backend server logs.

## K. Troubleshooting
- **CORS Error in Browser Console:** Update `ALLOWED_ORIGINS` on Render to exactly match the domain listed in your `.env.production`.
- **ModuleNotFoundError: No module named 'fastapi':** Your backend `requirements.txt` failed to compile. Investigate Render's python build logs.
- **Model Unavailable:** A backend boot happened prior to `.pth` weights actively streaming or syncing into `/data/`. Validate the directory tree.
