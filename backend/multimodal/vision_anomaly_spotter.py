import vertexai
from vertexai.generative_models import GenerativeModel, Part
import sys

PROJECT_ID = "ameer-491011"
REGION = "us-central1"

vertexai.init(project=PROJECT_ID, location=REGION)
model = GenerativeModel("gemini-2.5-flash")

def analyze_image(image_path):
    with open(image_path, "rb") as f:
        image_bytes = f.read()

    image_part = Part.from_data(data=image_bytes, mime_type="image/jpeg")

    prompt = """
    You are a public health field inspector assistant.
    Analyze this image and determine:
    1. Is this a potential mosquito/dengue breeding site (stagnant water, 
       uncovered containers, waste accumulation)? Yes/No
    2. Confidence (0-100)
    3. Brief reason (1 sentence)
    4. Recommended action

    Respond ONLY in this JSON format, no other text:
    {"breeding_site_detected": true/false, "confidence": 0-100, 
     "reason": "...", "recommended_action": "..."}
    """

    response = model.generate_content([prompt, image_part])
    return response.text

if __name__ == "__main__":
    result = analyze_image(sys.argv[1])
    print(result)
