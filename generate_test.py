import os

def extract_and_save_tests(response, tipo_requisito, requisito_id, llm, ruta_frontend_test, ruta_backend_test):
    """
    Extrae y guarda los tests de la respuesta del LLM
    """
    # Buscar bloques de código en la respuesta
    frontend_code = None
    backend_code = None
    
    # Buscar código frontend (JSX)
    if "```jsx" in response:
        start = response.find("```jsx") + 6
        end = response.find("```", start)
        if end != -1:
            frontend_code = response[start:end].strip()
    
    # Buscar código backend (Python)
    if "```python" in response:
        start = response.find("```python") + 9
        end = response.find("```", start)
        if end != -1:
            backend_code = response[start:end].strip()
    
    # Crear directorios si no existen
    if frontend_code:
        frontend_dir = f"{ruta_frontend_test}{tipo_requisito}/{llm}"
        os.makedirs(frontend_dir, exist_ok=True)
        frontend_path = f"{frontend_dir}/{requisito_id}-{llm}.test.jsx"
        with open(frontend_path, 'w') as f:
            f.write(frontend_code)
        print(f"Test frontend generado: {frontend_path}")
    
    if backend_code:
        backend_dir = f"{ruta_backend_test}{tipo_requisito}/{llm}"
        os.makedirs(backend_dir, exist_ok=True)
        backend_path = f"{backend_dir}/{requisito_id}-{llm}.py"
        with open(backend_path, 'w') as f:
            f.write(backend_code)
        print(f"Test backend generado: {backend_path}")
