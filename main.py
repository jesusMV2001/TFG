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
    ruta = config.get('ruta', [])[0]
    
    llm_api.generar_tests(llm, prompt, requisitos, ruta)