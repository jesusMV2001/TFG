import llm_api

def read_config(file_path):
    config = {}
    
    with open(file_path, 'r') as file:
        for line in file:
            line = line.strip()
            if line and not line.startswith('#'):  # Ignorar líneas vacías y comentarios
                key, value = line.split('=', 1)
                # Limpiar espacios y dividir por comas si hay múltiples valores
                config[key.strip()] = [v.strip() for v in value.split(',')]
    
    return config

if __name__ == "__main__":
    config = read_config('config.txt')
    
    llm = config.get('LLM', [])  
    prompt = config.get('prompt', [])
    requisitos = config.get('requisitos', [])
    ruta_general = config.get('ruta_general', [])[0]
    ruta_frontend_test = config.get('ruta_frontend_test', [])[0]
    ruta_backend_test = config.get('ruta_backend_test', [])[0]
    
    llm_api.make_tests(llm, prompt, requisitos, ruta_general, ruta_frontend_test, ruta_backend_test)