# HACKNOVA Backend — Brand.AI 🚀

Backend FastAPI de la plateforme **Brand.AI**, développée dans le cadre du **Tech Nova Challenge — Édition 2 (Binôme 35)**.

**Créateurs** : Emmanuel TOHOUEGNON & Ange HLEKPE

---

## ✨ Fonctionnalités

- **Génération d'identité de marque** : Nom, slogan, couleurs, typographie via Gemini AI
- **Génération de logo** : Triple fallback (NanoBanana → Cloudflare Worker → Pollinations AI)
- **Assistant IA Entrepreneur** : Chat contextuel avec support de fichiers (images, PDFs)
- **Export ZIP** : Pack de marque complet téléchargeable
- **Authentification Supabase** : Sécurisée par JWT

## 🛠️ Stack technique

- **Python 3.13** + **FastAPI** + **Uvicorn**
- **Google Gemini** (2.5 Flash / Pro, 3.1) via `google-genai`
- **LangChain** + Pollinations AI (fallback)
- **Supabase** pour l'authentification

## 🚀 Installation

```bash
# Cloner le dépôt
git clone https://github.com/angehlekpe664-coder/HACKNOVA-backend.git
cd HACKNOVA-backend

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac

# Installer les dépendances
pip install -r requirements.txt

# Configurer les variables d'environnement
cp .env.example .env
# Remplir les clés dans .env

# Lancer le serveur
uvicorn main:app --reload
```

## 🔑 Variables d'environnement

Copiez `.env.example` en `.env` et remplissez les valeurs :

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Clé API Google Gemini |
| `SUPABASE_URL` | URL de votre projet Supabase |
| `SUPABASE_KEY` | Clé anon/service de Supabase |
| `NANOBANANA_KEY` | Clé API NanoBanana (logo) |
| `CLOUDFLARE_WORKER_URL` | URL du Worker Cloudflare |
| `CLOUDFLARE_WORKER_KEY` | Clé secrète du Worker |

## 📡 Endpoints

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Vérification du serveur |
| `POST` | `/api/generate` | Génération d'identité de marque |
| `POST` | `/api/entrepreneur-ai` | Chat avec l'assistant IA |
| `POST` | `/api/export-zip` | Export du pack de marque |

---

*Tech Nova Challenge — Binôme 35*
