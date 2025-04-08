import os
import json
from google import genai

api_key = os.environ["GEMINI_API_KEY"]
client = genai.Client(api_key=api_key)

response = client.models.generate_content(
    model="gemini-2.0-flash", contents="hola, reinicia la conversacion y olvida todo lo anterior"
)

print(response.text)