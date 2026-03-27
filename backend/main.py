from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from supabase import create_client, Client
import requests
import json
import traceback
import os
from google import genai
from google.genai import types
import base64
import io
import zipfile
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv

# LangChain Agents
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
try:
    from langchain.chains import LLMChain
except ImportError:
    LLMChain = None

# Chargement des variables d'environnement depuis .env
load_dotenv()

app = FastAPI(title="Brand.Ai Backend")

# Allowing CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Backend is running!"}

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Brand.Ai API is active"}

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL et SUPABASE_KEY doivent être définis dans le fichier .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        response = requests.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={"Authorization": f"Bearer {token}", "apikey": SUPABASE_KEY},
            timeout=15
        )

        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Session expirée ou token invalide")

        return response.json()
    except HTTPException:
        # Re-raise les HTTPException sans les attraper comme des erreurs génériques
        raise
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=503, detail="Le service d'authentification a expiré. Réessayez.")
    except Exception as e:
        print(f"CRITICAL AUTH ERROR: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=401, detail=f"Erreur d'authentification interne: {str(e)}")

# Configuration Google Gemini (IA Prioritaire)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY doit être défini dans le fichier .env")

client = genai.Client(api_key=GEMINI_API_KEY)

# LangChain Configuration (IA de Secours / Back-office)
llm = ChatOpenAI(
    base_url="https://text.pollinations.ai/openai",
    api_key="none",
    model="openai",
    max_tokens=1000
)

class BrandRequest(BaseModel):
    brand_name: str
    industry: str

class ChatRequest(BaseModel):
    message: str
    attachments: list[dict] = [] # List of {"mime_type": str, "data": str (base64)}

def generate_brand_identity_with_agents(brand_name: str, industry: str):
    template = """
    Tu es un expert en branding et design. Génère une identité visuelle et textuelle pour cette marque.
    Nom de la marque: {brand_name}
    Secteur: {industry}

    Réponds UNIQUEMENT au format JSON strict avec les clés suivantes:
    - slogan: un slogan percutant en français.
    - logo_prompts: liste de 3 prompts créatifs, professionnels et très détaillés en ANGLAIS pour une IA générative d'images. Parfois, demande d'intégrer le nom de la marque sous forme de logo typographique. Exemple: "A stunning modern corporate logo featuring the typography '{brand_name}', flat vector style, vibrant colors, white background".
    - colors: objet avec primary, secondary, accent, background (codes hexadécimaux).
    - typography: objet avec heading et body (noms de polices Google Fonts).

    Réponse JSON:
    """

    prompt = PromptTemplate(template=template, input_variables=["brand_name", "industry"])

    try:
        chain = prompt | llm
        response = chain.invoke({"brand_name": brand_name, "industry": industry})
        response_text = response.content

        start_index = response_text.find('{')
        end_index = response_text.rfind('}') + 1
        json_str = response_text[start_index:end_index]
        return json.loads(json_str)
    except Exception as e:
        print(f"Erreur Agent LangChain: {e}")
        raise e

def generate_brand_identity_with_gemini(brand_name: str, industry: str):
    print(f"--- RÉFLEXION STRATÉGIQUE GEMINI POUR: {brand_name} ---")
    prompt = f"""
    CONTEXTE: Tu es un Directeur Artistique de classe mondiale spécialisé en identité visuelle minimale.
    
    ÉTAPE 1 : ANALYSE ET RÉFLEXION
    - Analyse l'essence de la marque "{brand_name}" dans le secteur "{industry}".
    - Conçois des idées de logos audacieuses et créatives.
    - L'IA qui va générer l'image est très forte en texte. Tu DOIS inclure le texte exact de la marque dans certains de tes prompts.
    
    ÉTAPE 2 : GÉNÉRATION
    Réponds UNIQUEMENT en JSON avec cette structure exacte (SANS BLOC MARKDOWN autour) :
    {{
      "reasoning": "Explication courte du concept visuel choisi",
      "slogan": "Un slogan français court et impactant",
      "logo_prompts": [
          "Prompt 1: Logo typographique ultra-moderne avec le texte '{brand_name}' écrit de manière esthétique, vector flat design, fond blanc",
          "Prompt 2: Superbe icône abstraite représentant (concept) avec un style professionnel pour la marque {brand_name}, vectoriel, fond blanc",
          "Prompt 3: Combinaison d'une icône créative et de la typographie élégante '{brand_name}', haute qualité, fond blanc"
      ],
      "colors": {{"primary": "#...", "secondary": "#...", "accent": "#...", "background": "#..."}},
      "typography": {{"heading": "Nom Font (Google Fonts)", "body": "Nom Font (Google Fonts)"}}
    }}
    
    Ne génère aucun code SVG ni aucun texte en dehors du JSON. Sois précis et technique dans tes prompts anglais pour l'IA d'image.
    """
    
    # Tentative avec Gemini 2.0 (plus intelligent) avec repli sur 1.5 si quota atteint
    target_model = 'gemini-2.0-flash'
    try:
        response = client.models.generate_content(
            model=target_model,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type='application/json',
            ),
        )
    except Exception as e:
        print(f"--- QUOTA 2.0 ATTEINT ({e}), REPLI SUR 2.5/Flash-Latest ---")
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type='application/json'),
            )
        except Exception as e2:
            print(f"Échec 2.5: {e2}. Repli sur gemini-flash-latest.")
            response = client.models.generate_content(
                model='gemini-flash-latest',
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type='application/json'),
            )
    
    print("--- RÉPONSE IA REÇUE AVEC SUCCÈS ---")
    try:
        return json.loads(response.text)
    except Exception as e:
        # Nettoyage au cas où Gemini renverrait du markdown
        text = response.text.strip('` \n')
        if text.startswith('json'): text = text[4:].strip()
        return json.loads(text)

@app.get("/")
def read_root():
    return {"message": "Welcome to Brand.Ai API"}

@app.post("/api/generate")
def generate_brand(request: BrandRequest, user = Depends(verify_token)):
    try:
        ai_data = None

        # TENTATIVE 1 : Google Gemini (IA Haute Fidélité)
        try:
            print(f"Tentative de génération avec Google Gemini pour {request.brand_name}...")
            ai_data = generate_brand_identity_with_gemini(request.brand_name, request.industry)
        except Exception as e:
            print(f"Échec Gemini: {e}. Basculement sur LangChain...")

            # TENTATIVE 2 : Agent LangChain (IA de secours)
            try:
                ai_data = generate_brand_identity_with_agents(request.brand_name, request.industry)
            except Exception as e2:
                print(f"Échec LangChain: {e2}. Basculement sur Fallback statique...")

                # TENTATIVE 3 : Fallback Statique (Infaillible)
                ai_data = {
                    "logo_prompts": [
                        f"Professional minimalist logo for {request.brand_name}, {request.industry} field, flat vector",
                        f"Modern app icon for {request.brand_name}, {request.industry} business",
                        f"Abstract branding emblem for {request.brand_name}"
                    ],
                    "colors": {"primary": "#2F00E6", "secondary": "#0D0066", "accent": "#00A7D6", "background": "#FFFFFF"},
                    "typography": {"heading": "Outfit", "body": "Inter"},
                    "slogan": f"{request.brand_name}, l'innovation commence ici."
                }

        # GÉNÉRATION DE LOGO IA (Strictement NanoBanana "lui ou rien")
        logos: list[dict] = []
        try:
            print(f"--- GÉNÉRATION LOGO POUR: {request.brand_name} ---")
            
            # 1. Préparation du prompt
            logo_prompt = f"minimalist professional vector logo for {request.brand_name}, white background, high quality"
            if ai_data and ai_data.get("logo_prompts") and len(ai_data.get("logo_prompts")) > 0:
                logo_prompt = ai_data.get("logo_prompts")[0]

            NANOBANANA_KEY = "sk-c9767427a0a645b290e6701c5dd654cc"
            print(f"Tentative Nano Banana API (lui ou rien) avec le prompt: {logo_prompt}")
            
            headers = {
                "Authorization": f"Bearer {NANOBANANA_KEY}",
                "Content-Type": "application/json"
            }
            
            # Format exact fourni par l'utilisateur
            payload = {
                "prompt": logo_prompt
            }
            
            # On utilise l'URL correcte du serveur
            api_url = "https://nanobnana.com/api/generate"
            res = requests.post(api_url, json=payload, headers=headers, timeout=45)
            
            if res.status_code == 200:
                data = res.json()
                data_str = str(data)
                print(f"Réponse JSON NanoBanana brute : {data_str}")
                
                img_url = None
                task_id = data.get("task_id")
                
                if task_id:
                    print(f"Tâche NanoBanana asynchrone démarrée : {task_id}. Polling en cours...")
                    import time
                    # Poller jusqu'à 30 secondes (10 essais * 3s)
                    for attempt in range(10):
                        time.sleep(3)
                        status_url = f"https://nanobnana.com/api/status?task_id={task_id}"
                        status_res = requests.get(status_url, headers=headers, timeout=10)
                        
                        if status_res.status_code == 200:
                            status_data = status_res.json()
                            d = status_data.get("data", {})
                            
                            # Si status == 1 ou si la reponse existe
                            if d.get("status") == 1 or "response" in d:
                                responses = d.get("response", [])
                                if responses and len(responses) > 0:
                                    img_url = responses[0]
                                    print(f"Image NanoBanana prête (tentative {attempt+1})!")
                                    break
                            
                            print(f"En attente (tentative {attempt+1}... statut: {d.get('status')})")
                        else:
                            print(f"Erreur de statut API: {status_res.status_code}")
                else:
                    # Extraction directe si l'API change de comportement
                    if isinstance(data, dict):
                        if "image" in data and isinstance(data["image"], str):
                            img_url = data["image"]
                        elif "url" in data and isinstance(data["url"], str):
                            img_url = data["url"]
                
                if img_url:
                    print(f"URL d'image trouvée : {img_url}")
                    # Téléchargement et conversion b64
                    img_res = requests.get(img_url, timeout=15)
                    if img_res.status_code == 200:
                        img_b64 = base64.b64encode(img_res.content).decode()
                        content_type = img_res.headers.get('Content-Type', 'image/png')
                        logos.append({
                            "id": 1, 
                            "url": f"data:{content_type};base64,{img_b64}"
                        })
                        print("--- LOGO NANO BANANA GÉNÉRÉ ET ENCODÉ AVEC SUCCÈS ---")
                    else:
                        print(f"Impossible de télécharger l'image depuis l'URL NanoBanana: {img_res.status_code}")
                else:
                    print(f"Impossible de trouver l'URL de l'image (task non terminée ou erreur): {data}")
            else:
                print(f"Echec API Nano Banana: {res.status_code} - {res.text}")
                
        except Exception as e:
            print(f"Erreur détaillé lors de l'appel NanoBanana: {e}")

        return {
            "status": "success",
            "data": {
                "logos": logos,
                "colors": ai_data.get("colors"),
                "typography": ai_data.get("typography"),
                "slogan": ai_data.get("slogan")
            }
        }
    except Exception as e:
        print(f"Erreur Générale Generate: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erreur interne: {str(e)}")

@app.post("/api/entrepreneur-ai")
def entrepreneur_chat(request: ChatRequest, user = Depends(verify_token)):
    """
    Assistant IA expert (Gemini 2.0) spécialisé en Entrepreneuriat, 
    Développement Personnel, Évolution Humaine et Analyse Stratégique.
    Supporte les textes, images et PDFs.
    """
    system_prompt = """
    Tu es un assistant intelligent "Next-Gen" de haut niveau, expert en Entrepreneuriat, Stratégie, Développement Personnel, Évolution Humaine, et Programmation.
    
    RÈGLES DE DISCRÉTION (CRITIQUE) :
    - Ne te présente JAMAIS spontanément au début de tes messages.
    - Ne mentionne JAMAIS ton nom (BRAND.AI) ou tes créateurs (Emmanuel TOHOUEGNON et Ange HLEKPE) QUE si l'utilisateur te le demande explicitement.
    - Entre directement dans le vif du sujet en répondant à la question posée de manière efficace.
    
    CAPACITÉS AVANCÉES :
    1. EXCELLENCE VISUELLE : Utilise le Markdown de haute qualité (# Titres, Tables, Listes).
    2. MATHÉMATIQUES ESTHÉTIQUES : Utilise LaTeX ($...$ pour en ligne, $$...$$ pour blocs) pour les formules précises.
    3. CODE EXPERT : Tu sais coder dans n'importe quel langage (utilises ```lang).
    4. PERSONNALITÉ : Pro, inspirant et chaleureux. Utilise occasionnellement des Emojis (🚀✨) pour dynamiser. 
    5. LANGUE : Français impeccable.
    
    IDENTITÉ (POUR RÉPONDRE AUX QUESTIONS SPÉCIFIQUES UNIQUEMENT) : 
    - Nom : BRAND.AI
    - Contexte : TECH NOVA CHALLENGE ÉDITION 2 (Binôme 35)
    - Créateurs : Emmanuel TOHOUEGNON et Ange HLEKPE (étudiants en Mathématique Informatique Appliquée).
    """
    
    parts = [types.Part(text=f"{system_prompt}\n\nQuestion: {request.message}")]
    
    # Gestion des pièces jointes (Images/PDFs)
    if request.attachments:
        for att in request.attachments:
            try:
                mime = att.get("mime_type", "image/jpeg")
                b64_data = att.get("data", "")
                if b64_data:
                    # Enlever le préfixe data:xxx;base64, si présent
                    if "," in b64_data:
                        b64_data = b64_data.split(",")[1]
                    
                    raw_data = base64.b64decode(b64_data)
                    parts.append(types.Part(inline_data=types.Blob(mime_type=mime, data=raw_data)))
            except Exception as e:
                print(f"Erreur traitement pièce jointe: {e}")

    # Ordre : du plus capable au plus disponible (quota croissant)
    MODELS = [
        'gemini-2.0-flash',        # 20 req/jour - le meilleur
        'gemini-2.0-flash-lite',   # 1500 req/jour - très disponible
        'gemini-1.5-flash-8b',     # 1500 req/jour - léger mais efficace
        'gemini-pro',              # ancien modèle, toujours disponible
    ]
    
    for model_name in MODELS:
        try:
            print(f"Tentative avec {model_name}...")
            resp = client.models.generate_content(model=model_name, contents=parts)
            print(f"✓ Succès avec {model_name}")
            return {"status": "success", "response": resp.text}
        except Exception as e:
            err_str = str(e)
            is_quota = '429' in err_str or 'RESOURCE_EXHAUSTED' in err_str or 'quota' in err_str.lower()
            is_not_found = '404' in err_str or 'NOT_FOUND' in err_str or 'not found' in err_str.lower()
            print(f"  ✗ {model_name}: {'QUOTA' if is_quota else '404' if is_not_found else 'ERREUR'}")
            if not is_quota and not is_not_found:
                # Erreur inattendue (auth, réseau…) : on arrête
                raise HTTPException(status_code=500, detail="Erreur interne de l'IA. Réessayez.")
            # Quota ou modèle introuvable → essayer le suivant
            continue
    
    # Tous les modèles Gemini épuisés ou manquants → Fallback Pollinations (sans quota)
    print("⚡ Fallback sur LangChain/Pollinations (gratuit, sans quota)...")
    try:
        system_prompt_short = """Tu es BRAND.AI, un assistant expert en entrepreneuriat, stratégie, développement personnel et programmation.
        Réponds en français, de manière professionnelle et inspirante. Utilise le Markdown.
        Ne te présente jamais spontanément. Réponds directement à la question."""
        
        full_prompt = f"{system_prompt_short}\n\nQuestion: {request.message}"
        fallback_response = llm.invoke(full_prompt)
        return {"status": "success", "response": fallback_response.content + "\n\n*ℹ️ Réponse fournie par le moteur de secours (quota Gemini atteint)*"}
    except Exception as ef:
        print(f"Erreur Fallback Pollinations: {ef}")
        raise HTTPException(
            status_code=429,
            detail="⚠️ Tous les moteurs IA sont temporairement indisponibles. Réessayez dans quelques minutes."
        )


@app.post("/api/export-zip")
def export_brand_zip(brand_data: dict, user = Depends(verify_token)):
    """
    Exporte le pack de marque complet dans un fichier ZIP.
    """
    try:
        brand_name = brand_data.get("name", "Ma_Marque")
        zip_buffer = io.BytesIO()
        
        with zipfile.ZipFile(zip_buffer, "a", zipfile.ZIP_DEFLATED, False) as zip_file:
            # 1. Logo SVG
            logo_url = brand_data.get("logo_url", "")
            if "base64," in logo_url:
                svg_content = base64.b64decode(logo_url.split("base64,")[1]).decode()
                zip_file.writestr("logo.svg", svg_content)
            
            # 2. Palette de couleurs
            colors = brand_data.get("colors", {})
            colors_txt = "PALETTE DE COULEURS\n" + "="*20 + "\n"
            for key, val in colors.items():
                colors_txt += f"{key.capitalize()}: {val}\n"
            zip_file.writestr("brand_palette.txt", colors_txt)
            
            # 3. Guide de style (Slogan & Typo)
            guide_txt = f"GUIDE DE STYLE: {brand_name}\n" + "="*30 + "\n"
            guide_txt += f"Slogan: {brand_data.get('slogan', 'N/A')}\n"
            typo = brand_data.get("typography", {})
            guide_txt += f"Typographies: {typo.get('heading', 'N/A')} (Titre), {typo.get('body', 'N/A')} (Texte)\n"
            zip_file.writestr("style_guide.txt", guide_txt)

        zip_buffer.seek(0)
        return StreamingResponse(
            zip_buffer,
            media_type="application/x-zip-compressed",
            headers={"Content-Disposition": f"attachment; filename=brand_kit_{brand_name.lower().replace(' ', '_')}.zip"}
        )
    except Exception as e:
        print(f"Erreur ZIP: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la création du ZIP")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
