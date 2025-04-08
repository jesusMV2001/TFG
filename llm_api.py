import os
import json
from google import genai
from openai import OpenAI
from mistralai import Mistral
from dotenv import load_dotenv

load_dotenv()

def read_files(file_paths):
    contents = []
    for path in file_paths:
        with open(path, 'r') as file:
            contents.append(f"Contenido de {path}:\n{file.read()}")
    return "\n\n".join(contents) 

def call_llm(llm, prompt):
    if llm == "gemini":
        api_key = os.environ.get("GEMINI_API_KEY")
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=prompt
        )
        print(response.text)
        return
    elif llm == "nvidia":
        
        client = OpenAI(
        base_url = "https://integrate.api.nvidia.com/v1",
        api_key = "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"
        )


        completion = client.chat.completions.create(
            model="nvidia/llama-3.1-nemotron-70b-instruct",
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ]
        )
        print(completion.choices[0].message.content)
        return
    elif llm == "mistral":
        api_key = os.environ.get("MISTRAL_API_KEY")
        model = "mistral-large-latest"

        client = Mistral(api_key=api_key)

        chat_response = client.chat.complete(
            model= model,
            messages = [
                {
                    "role": "user",
                    "content": prompt,
                },
            ]
        )
        print(chat_response.choices[0].message.content)
        return
        
    raise ValueError(f"LLM no soportado: {llm}")
        
def get_relevant_files(prompt_type):
    """
    Retorna la lista de archivos relevantes según el tipo de prompt
    """
    frontend_files = [
        "/home/jesus/python/TFG/APP/frontend/src/main.jsx",
        "/home/jesus/python/TFG/APP/frontend/src/App.jsx",
        "/home/jesus/python/TFG/APP/frontend/src/api.js",
        "/home/jesus/python/TFG/APP/frontend/src/pages/Login.jsx",
        "/home/jesus/python/TFG/APP/frontend/src/pages/Register.jsx",
        "/home/jesus/python/TFG/APP/frontend/src/pages/Home.jsx",
        "/home/jesus/python/TFG/APP/frontend/src/components/ComentariosList.jsx",
        "/home/jesus/python/TFG/APP/frontend/src/components/ModalTarea.jsx",
        "/home/jesus/python/TFG/APP/frontend/src/components/ProtectedRoute.jsx",
        "/home/jesus/python/TFG/APP/frontend/src/components/Tarea.jsx",
        "/home/jesus/python/TFG/APP/frontend/src/components/TareaForm.jsx",
        "/home/jesus/python/TFG/APP/frontend/src/components/Toast.jsx",
        "/home/jesus/python/TFG/APP/frontend/src/components/UsuarioForm.jsx",
    ]
    
    backend_files = [
        "/home/jesus/python/TFG/APP/backend/api/models.py",
        "/home/jesus/python/TFG/APP/backend/api/serializers.py",
        "/home/jesus/python/TFG/APP/backend/api/views.py",
        "/home/jesus/python/TFG/APP/backend/api/urls.py",
        "/home/jesus/python/TFG/APP/backend/backend/urls.py",
    ]

    if "frontend" in prompt_type:
        return frontend_files
    elif "backend" in prompt_type:
        return backend_files
        
    return frontend_files + backend_files

def create_final_prompt(prompt, files_content, tipo_requisito, requisito, llm, ruta_backend_test, ruta_frontend_test, prompt_type):
    """
    Crea el prompt final combinando el contenido de los archivos , los requisitos y la ruta del test
    """
    ruta="Ten en cuenta que la ruta de los tests "
    if "frontend" in prompt_type:
        nombre = f"{ruta_frontend_test}{tipo_requisito}/{llm}/{requisito['id']}-{llm}"
        ruta += f"para el frontend es: {nombre}.test.jsx"
    elif "backend" in prompt_type:
        nombre = f"{ruta_backend_test}{tipo_requisito}/{llm}/{requisito['id']}-{llm}"
        ruta += f"para el backend es: {nombre}.py"
    else:
        ruta_frontend = f"{ruta_frontend_test}{tipo_requisito}/{llm}/{requisito['id']}-{llm}"
        ruta_backend = f"{ruta_backend_test}{tipo_requisito}/{llm}/{requisito['id']}-{llm}"
        ruta += f"para el frontend es: {ruta_frontend}.test.jsx y para el backend es: {ruta_backend}.py"
        
    return f"""
    Dado el siguiente contenido de archivos:
    {files_content}
    
    {prompt}
    
    Realiza tests para el siguiente requisito:
    {json.dumps(requisito, indent=2)}
    No necesito que expliques nada, solo necesito los tests.
    {ruta}
    """

def make_tests(llm_list, prompt_list, tipo_requisitos_list, ruta_general, ruta_frontend_test, ruta_backend_test):
    for llm in llm_list:
        for prompt in prompt_list:
            # Leer el contenido del prompt
            with open(ruta_general + prompt, 'r') as file:
                prompt_content = file.read()
                
            # Obtener los archivos relevantes según el tipo de prompt
            relevant_files = get_relevant_files(prompt)
            files_content = read_files(relevant_files)
            
            for tipo_requisito in tipo_requisitos_list:
                # Obtener la lista de requisitos
                with open(ruta_general + tipo_requisito + ".json", 'r') as file:
                    requisitos = json.load(file)
                    
                for requisito in requisitos:
                    # Crear el prompt final combinando todo
                    final_prompt = create_final_prompt(prompt_content, files_content, tipo_requisito, requisito, llm, ruta_backend_test, ruta_frontend_test, prompt)
                    
                    # Llamar a la función para generar los tests
                    # print(f"Generando tests para {requisito['id']} usando {llm} y {prompt}")
                    call_llm(llm, final_prompt)
                    return

                
                