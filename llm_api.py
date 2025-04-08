import os
import json
from google import genai
from groq import Groq
from mistralai import Mistral

def read_files(file_paths):
    contents = []
    for path in file_paths:
        with open(path, 'r') as file:
            contents.append(f"Contenido de {path}:\n{file.read()}")
    return "\n\n".join(contents) 

def call_llm(llm, prompt, requisito):
    if llm == "gemini":
        return
    elif llm == "groq":
        return
    elif llm == "mistral":
        return
        
    raise ValueError(f"LLM no soportado: {llm}")
        

def generar_tests(llm_list, prompt_list, tipo_requisitos_list, ruta):
    for llm in llm_list:
        for prompt in prompt_list:
            # Leer el contenido del prompt
            with open(ruta + prompt, 'r') as file:
                prompt_content = file.read()
            for tipo_requisito in tipo_requisitos_list:
                # Obtener la lista de requisitos
                with open(ruta + tipo_requisito, 'r') as file:
                    requisitos = json.load(file)
                    
                for requisito in requisitos:
                    # Llamar a la función para generar los tests
                    print(f"Generando tests para {requisito['id']} usando {llm} y {prompt}")
                    call_llm(llm, prompt_content, requisito)

                
                