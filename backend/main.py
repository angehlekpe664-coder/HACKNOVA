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
        # En cas de timeout réseau, on rejette la requête plutôt que de laisser passer
        raise HTTPException(status_code=503, detail="Le service d'authentification est temporairement indisponible. Réessayez.")
    except Exception as e:
        print(f"Erreur Auth Supabase: {e}")
        raise HTTPException(status_code=401, detail="Authentification échouée")

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

def generate_brand_identity_with_agents(brand_name: str, industry: str):
    template = """
    Tu es un expert en branding et design. Génère une identité visuelle et textuelle pour cette marque.
    Nom de la marque: {brand_name}
    Secteur: {industry}

    Réponds UNIQUEMENT au format JSON strict avec les clés suivantes:
    - slogan: un slogan percutant en français.
    - logo_prompts: liste de 3 prompts très détaillés en ANGLAIS pour un générateur d'image (ex: "minimalist flat vector logo for {brand_name}, professional...").
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
    - Identifie un concept visuel abstrait (ex: croissance, sécurité, flux, connexion).
    - Imagine une forme géométrique épurée qui capture cette essence sans utiliser AUCUNE LETTRE.
    
    ÉTAPE 2 : GÉNÉRATION
    Réponds UNIQUEMENT en JSON avec cette structure exacte :
    {{
      "reasoning": "Explication courte du concept visuel choisi",
      "slogan": "Un slogan français court et impactant",
      "logo_prompts": ["3 prompts anglais pour Stable Diffusion"],
      "colors": {{"primary": "#...", "secondary": "#...", "accent": "#...", "background": "#..."}},
      "typography": {{"heading": "Font Titre (Google Fonts)", "body": "Font Corps (Google Fonts)"}},
      "logo_svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>...</svg>"
    }}
    
    RÈGLES D'OR DU LOGO SVG :
    - INTERDIT : Balises <text>, lettres, monogrammes, caractères.
    - OBLIGATOIRE : Formes vectorielles pures (<path>, <circle>, <rect>).
    - STYLE : Design Studio (comparable à Apple, Nike, Mastercard).
    - ÉQUILIBRE : Le logo doit être centré dans un viewBox '0 0 100 100'.
    - COULEURS : Utilise tes propres couleurs hex générées dans le SVG.
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
        print(f"--- QUOTA 2.0 ATTEINT, REPLI SUR 1.5 ---")
        response = client.models.generate_content(
            model='gemini-flash-latest',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type='application/json',
            ),
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

        # GÉNÉRATION DE LOGO IA (Priorité SVG Gemini -> Fallback Tunnel Pollinations)
        logos: list[dict] = []
        try:
            print(f"--- GÉNÉRATION LOGO POUR: {request.brand_name} ---")
            
            # TENTATIVE 1 : SVG Direct de Gemini (Le plus fiable et qualitatif)
            if ai_data and ai_data.get("logo_svg"):
                svg_code = ai_data.get("logo_svg")
                # Nettoyage si Gemini a mis du markdown around
                if "```svg" in svg_code:
                    svg_code = svg_code.split("```svg")[1].split("```")[0].strip()
                elif "```" in svg_code:
                    svg_code = svg_code.split("```")[1].split("```")[0].strip()
                
                svg_b64 = base64.b64encode(svg_code.encode()).decode()
                logos.append({
                    "id": 1,
                    "url": f"data:image/svg+xml;base64,{svg_b64}"
                })
                print("--- LOGO SVG GÉNÉRÉ PAR GEMINI ---")
            
            # TENTATIVE 2 : Pollinations (Si Gemini n'a pas produit de SVG)
            if not logos:
                logo_prompt = "logo brand"
                if ai_data and ai_data.get("logo_prompts") and len(ai_data.get("logo_prompts")) > 0:
                    logo_prompt = ai_data.get("logo_prompts")[0]
                else:
                    clean_name = "".join(e for e in request.brand_name if e.isalnum())
                    logo_prompt = f"logo {clean_name} minimalist professional"
                
                import urllib.parse
                encoded_prompt = urllib.parse.quote(logo_prompt)
                image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}" # URL plus stable

                print(f"Appel Pollinations fallback avec prompt: {logo_prompt}")
                img_res = requests.get(image_url, timeout=10)
                content_type = img_res.headers.get('Content-Type', '')

                if img_res.status_code == 200 and 'image' in content_type:
                    img_b64 = base64.b64encode(img_res.content).decode()
                    logos.append({
                        "id": 2,
                        "url": f"data:{content_type};base64,{img_b64}"
                    })
                    print(f"--- LOGO FALLBACK POLLINATIONS GÉNÉRÉ ---")
                else:
                    # Fallback ultime : Initiales
                    logos.append({
                        "id": 1, 
                        "url": f"https://api.dicebear.com/7.x/initials/svg?seed={request.brand_name}&backgroundColor=2F00E6&fontSize=45"
                    })
        except Exception as e:
            print(f"Erreur Image: {e}")
            logos.append({
                "id": 1, 
                "url": f"https://api.dicebear.com/7.x/initials/svg?seed={request.brand_name}&backgroundColor=2F00E6"
            })

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
