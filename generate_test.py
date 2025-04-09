import os
import re

def extract_and_save_tests(response, tipo_requisito, requisito_id, llm, ruta_frontend_test, ruta_backend_test):
    """
    Extrae y guarda los tests de la respuesta procesando línea por línea.
    Se detecta el tipo a partir de la línea de ruta, comprobando la extensión del archivo.
    """
    lines = response.split('\n')
    current_code = []
    is_collecting = False
    current_type = None

    for line in lines:
        stripped_line = line.strip()
        # Identifica el inicio de un bloque con ```
        if not is_collecting and stripped_line.startswith('```'):
            # Si la línea de apertura es solo de acentos graves (por ejemplo, "```") se ignora.
            if len(set(stripped_line)) == 1:
                continue
            
            is_collecting = True
            current_code = []
            current_type = None  
            continue

        # Si se está recolectando y se detecta la marca de cierre, se guarda el contenido
        if is_collecting and stripped_line.startswith('```') and len(set(stripped_line)) == 1:
            # Si no se pudo determinar el tipo a partir de la ruta, dejar current_type como estaba (por defecto)
            if current_type is None:
                current_type = 'python'
            save_test(current_type, current_code, ruta_frontend_test,
                      ruta_backend_test, tipo_requisito, requisito_id, llm)
            # Reiniciar variables para el siguiente bloque
            is_collecting = False
            current_code = []
            current_type = None
            continue

        # Si se está recolectando el bloque, se agrega la línea.
        if is_collecting:
            # Si es la primera línea del bloque (supuestamente la línea de la ruta) y aún no se determinó el tipo:
            if not current_code and current_type is None:
                # Se espera que la primera línea contenga la ruta
                # Puede empezar con "#" (para Python) o "//" (para JSX)
                ruta_match = re.match(r"^(#|//)\s*(.+)$", stripped_line)
                if ruta_match:
                    ruta_archivo = ruta_match.group(2).strip()
                    # Determinar el tipo en función de la extensión del archivo
                    if ruta_archivo.endswith('.jsx'):
                        current_type = 'jsx'
                    elif ruta_archivo.endswith('.py'):
                        current_type = 'python'
                    else:
                        # Si no se reconoce la extensión, asignar un valor por defecto
                        current_type = 'python'
                else:
                    pass
            current_code.append(line)


def save_test(current_type, current_code, ruta_frontend_test, ruta_backend_test, tipo_requisito, requisito_id, llm):
    code_content = '\n'.join(current_code)
    if current_type == 'python':
        # Directorio de backend
        backend_dir = os.path.join(ruta_backend_test, tipo_requisito, llm)
        os.makedirs(backend_dir, exist_ok=True)
        backend_path = os.path.join(backend_dir, f"{requisito_id}-{llm}.py")
        with open(backend_path, 'w', encoding='utf-8') as f:
            f.write(code_content)
        print(f"Test backend generado: {backend_path}")
    elif current_type == 'jsx':
        # Directorio de frontend
        frontend_dir = os.path.join(ruta_frontend_test, tipo_requisito, llm)
        os.makedirs(frontend_dir, exist_ok=True)
        frontend_path = os.path.join(frontend_dir, f"{requisito_id}-{llm}.test.jsx")
        with open(frontend_path, 'w', encoding='utf-8') as f:
            f.write(code_content)
        print(f"Test frontend generado: {frontend_path}")