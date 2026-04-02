import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

def test_imagen():
    try:
        print("Testing Imagen 3.0 / 4.0 ...")
        # According to inspect_sdk, it's generate_images
        response = client.models.generate_images(
            model='imagen-3', 
            prompt="A professional minimalist logo for a tech brand called 'SolarEdge', abstract sun symbol, vector style, white background, high quality, 4k, professional branding.",
            config={'number_of_images': 1}
        )
        print("SUCCESS! Image generated.")
        # In this SDK, generated_images is a list of image objects
        for i, img in enumerate(response.generated_images):
            # img has a 'image' attribute which is a PIL Image or similar? 
            # Or it might have 'bytes'. 
            # Let's check attributes of img.
            print(f"Image {i} type: {type(img)}")
            # For now, let's just try to save if iœt has a save method
            if hasattr(img.image, 'save'):
                img.image.save(f"test_logo_imagen_{i}.png")
            else:
                with open(f"test_logo_imagen_{i}.png", "wb") as f:
                    f.write(img.image._image_bytes)
            print(f"Saved: test_logo_imagen_{i}.png")
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_imagen()
