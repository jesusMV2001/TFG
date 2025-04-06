import os
import json
from google import genai

api_key = os.environ["GEMINI_API_KEY"]
client = genai.Client(api_key=api_key)

def read_files(file_paths):
    contents = []
    for path in file_paths:
        with open(path, 'r') as file:
            contents.append(f"Contenido de {path}:\n{file.read()}")
    return "\n\n".join(contents)

# Lista de archivos a incluir
file_paths = [
    "/home/jesus/python/TFG/APP/backend/api/models.py",
    "/home/jesus/python/TFG/APP/backend/api/serializers.py",
    "/home/jesus/python/TFG/APP/backend/api/views.py",
    "/home/jesus/python/TFG/APP/backend/api/urls.py",
    "/home/jesus/python/TFG/APP/backend/backend/urls.py",
    "/home/jesus/python/TFG/APP/frontend/src/api.js",
    "/home/jesus/python/TFG/APP/frontend/src/pages/Login.jsx",
    "/home/jesus/python/TFG/APP/frontend/src/App.jsx",
    "/home/jesus/python/TFG/APP/frontend/src/pages/Register.jsx",
    "/home/jesus/python/TFG/APP/frontend/src/components/UsuarioForm.jsx",
    "/home/jesus/python/TFG/APP/frontend/src/components/ProtectedRoute.jsx",
]

files_content = read_files(file_paths)

with open('/home/jesus/python/TFG/HU.json', 'r') as file:
    historias_usuario = json.load(file)
    primera_hu = historias_usuario[0]

# Crear el prompt con los archivos y el mensaje
prompt = f"""
Dado el siguiente contenido de archivos:

{files_content}

Realiza un test que satisfaga la siguiente historia de usuario:
{primera_hu}
Ten en cuenta que el test puede ser para react con vite usando vitest para los test o para django. Tambien ten en cuenta que
no siempre es necesario realizar un test para react o django, dependiendo de la historia de usuario puede que solo
sea necesario para uno de los dos. En caso de que sea necesario para ambos, realiza un test para cada uno.
no necesito que me expliques nada, solo necesito los tests.
ten en cuenta que la ruta del test frontend es "/home/jesus/python/TFG/APP/frontend/src/components/__tests__/UsuarioForm.test.jsx"
"""

response = client.models.generate_content(
    model="gemini-2.0-flash", contents=prompt
)
print(response.text)