import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("GEMINI_API_KEY NOT FOUND")
    exit(1)

client = genai.Client(api_key=GEMINI_API_KEY)

try:
    print("Testing gemini-2.0-flash...")
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents="Bonjour, qui es-tu ?"
    )
    print(f"Gemini 2.0 Response: {response.text}")
except Exception as e:
    print(f"Error 2.0: {e}")

try:
    print("Testing gemini-1.5-flash...")
    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents="Bonjour, teste 1.5 please."
    )
    print(f"Gemini 1.5 Response: {response.text}")
except Exception as e:
    print(f"Error 1.5: {e}")
