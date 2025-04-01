import os
from google import genai

api_key = os.environ["GEMINI_API_KEY"]
client = genai.Client(api_key=api_key)

# Función para leer el contenido de varios archivos
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
]

# Leer el contenido de los archivos
files_content = read_files(file_paths)

# Crear el prompt con los archivos y el mensaje
prompt = f"""
Dado el siguiente contenido de archivos:

{files_content}

Realiza un test que satisfaga la siguiente historia de usuario:
Como nuevo usuario, quiero registrarme proporcionando mi nombre de usuario, correo electrónico y contraseña, para poder acceder a la aplicación de gestión de tareas.
Criterios de aceptación:
El usuario puede ingresar un nombre, correo y contraseña.
Ningún campo debe estar vacío.
La contraseña debe tener un mínimo de 8 caracteres.
Se muestra un mensaje de error si el correo o nombre ya está registrado
Se muestra un mensaje de error si la contraseña es menor de 8 caracteres.
"""

response = client.models.generate_content(
    model="gemini-2.0-flash", contents=prompt
)
print(response.text)