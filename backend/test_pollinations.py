import requests

try:
    print("Testing pure Pollinations...")
    resp = requests.post(
        "https://text.pollinations.ai/",
        json={"messages": [{"role": "user", "content": "Bonjour"}]},
        timeout=10
    )
    print(f"Status: {resp.status_code}")
    print(f"Text: {resp.text[:200]}")
except Exception as e:
    print(f"Error: {e}")
