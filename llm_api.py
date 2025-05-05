import time
import os
import json
from google import genai
from openai import OpenAI
from mistralai import Mistral
from dotenv import load_dotenv
import generate_test
from logger import logger
import pandas as pd

load_dotenv()

# Diccionario global para almacenar tiempos:
# Clave: (tipo_requisito, llm, prompt_type)
# Valor: lista de tiempos (en segundos)
response_times = {}


def read_files(file_paths):
    contents = []
    for path in file_paths:
        try:
            with open(path, 'r') as file:
                contents.append(f"Contenido de {path}:\n{file.read()}")
        except Exception as e:
            logger.error(f"No se pudo leer el archivo {path}: {e}")
    return "\n\n".join(contents)


def call_llm(llm, prompt):
    logger.info(f"Llamando al LLM {llm} con el prompt.")
    try:
        if llm == "gemini":
            api_key = os.environ.get("GEMINI_API_KEY")
            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model="gemini-2.0-flash", contents=prompt
            )
            logger.debug("Respuesta recibida de gemini.")
            return response.text
        elif llm == "nvidia":
            client = OpenAI(
                base_url="https://integrate.api.nvidia.com/v1",
                api_key=os.environ.get("NVIDIA_API_KEY")
            )
            completion = client.chat.completions.create(
                model="nvidia/llama-3.1-nemotron-70b-instruct",
                messages=[{"role": "user", "content": prompt}]
            )
            logger.debug("Respuesta recibida de nvidia.")
            return completion.choices[0].message.content
        elif llm == "mistral":
            api_key = os.environ.get("MISTRAL_API_KEY")
            model = "mistral-large-latest"
            client = Mistral(api_key=api_key)
            chat_response = client.chat.complete(
                model=model,
                messages=[{"role": "user", "content": prompt}]
            )
            logger.debug("Respuesta recibida de mistral.")
            return chat_response.choices[0].message.content

        logger.error(f"LLM no soportado: {llm}")
        raise ValueError(f"LLM no soportado: {llm}")
    except Exception as e:
        logger.error(
            f"Error durante la llamada al LLM {llm}: {e}", exc_info=True)
        raise


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
        logger.info("Usando archivos frontend.")
        return frontend_files
    elif "backend" in prompt_type:
        logger.info("Usando archivos backend.")
        return backend_files
    logger.info("Usando archivos frontend y backend.")
    return frontend_files + backend_files


def create_final_prompt(prompt, files_content, tipo_requisito, requisito, llm, ruta_backend_test, ruta_frontend_test, prompt_type):
    """
    Crea el prompt final combinando el contenido de los archivos , los requisitos y la ruta del test
    """
    ruta = "Ten en cuenta que la ruta de los tests "
    if "frontend" in prompt_type:
        nombre = f"{ruta_frontend_test}{tipo_requisito}/{llm}/{requisito['id']}-{llm}"
        ruta += f"para el frontend es: {nombre}.test.jsx"
    elif "backend" in prompt_type:
        nombre_ruta = f"{ruta_backend_test}{tipo_requisito}/{llm}/"
        nombre_archivo = f"test_{requisito['id']}-{llm}".replace("-", "_")
        ruta += f"para el backend es: {nombre_ruta}{nombre_archivo}.py"
    else:
        ruta_frontend = f"{ruta_frontend_test}{tipo_requisito}/{llm}/{requisito['id']}-{llm}"
        ruta_backend = f"{ruta_backend_test}{tipo_requisito}/{llm}/"
        nombre_archivo = f"test_{requisito['id']}-{llm}".replace("-", "_")
        ruta += f"para el frontend es: {ruta_frontend}.test.jsx y para el backend es: {ruta_backend}{nombre_archivo}.py"

    final_prompt = f"""
    Dado el siguiente contenido de archivos:
    {files_content}
    
    {prompt}
    
    Realiza tests para el siguiente requisito:
    {json.dumps(requisito, indent=2)}
    No necesito que expliques nada, solo necesito los tests.
    {ruta}
    """
    logger.debug("Prompt final creado.")
    return final_prompt


def make_tests(llm_list, prompt_list, tipo_requisitos_list, ruta_general, ruta_frontend_test, ruta_backend_test):
    logger.info(
        "Iniciando el proceso de generación de tests y medición de tiempos.")
    # Usar el diccionario global definido arriba
    global response_times

    for llm in llm_list:
        logger.info(f"Procesando LLM: {llm}")
        # Iterar sobre los NOMBRES de archivo de prompt (prompt_list)
        for prompt_file in prompt_list:
            logger.info(f"Procesando Prompt: {prompt_file}")
            # Leer el contenido del prompt desde el archivo
            prompt_content = ""  # Inicializar por si falla la lectura
            try:
                prompt_filepath = os.path.join(ruta_general, prompt_file)
                with open(prompt_filepath, 'r', encoding='utf-8') as file:
                    prompt_content = file.read()
            except FileNotFoundError:
                logger.error(
                    f"Archivo de prompt no encontrado en '{prompt_filepath}'. Saltando.")
                continue  # Saltar a la siguiente iteración si el archivo no existe
            except Exception as e:
                logger.error(
                    f"Error al leer archivo de prompt '{prompt_filepath}': {e}", exc_info=True)
                continue  # Saltar si ocurre otro error de lectura

            relevant_files = get_relevant_files(prompt_file)
            files_content = read_files(relevant_files)

            for tipo_requisito in tipo_requisitos_list:
                logger.info(f"Procesando Tipo Requisito: {tipo_requisito}")
                # Obtener la lista de requisitos desde el archivo JSON
                requisitos_filepath = os.path.join(
                    ruta_general, f"{tipo_requisito}.json")
                requisitos = []  # Inicializar por si falla la lectura/parseo
                try:
                    with open(requisitos_filepath, 'r', encoding='utf-8') as file:
                        requisitos = json.load(file)
                except FileNotFoundError:
                    logger.error(
                        f"Archivo de requisitos no encontrado en '{requisitos_filepath}'. Saltando.")
                    continue  # Saltar a la siguiente iteración si el archivo no existe
                except json.JSONDecodeError:
                    logger.error(
                        f"Archivo de requisitos JSON inválido en '{requisitos_filepath}'. Saltando.")
                    continue  # Saltar si el JSON es inválido
                except Exception as e:
                    logger.error(
                        f"Error al leer archivo de requisitos '{requisitos_filepath}': {e}", exc_info=True)
                    continue  # Saltar si ocurre otro error de lectura

                for requisito in requisitos:
                    # Asegurarse de que el requisito tiene un ID válido para usarlo como columna
                    requisito_id = requisito.get('id')
                    if not requisito_id:
                        logger.warning(
                            f"Advertencia: Requisito sin ID válido en '{requisitos_filepath}': {requisito}. Saltando.")
                        continue  # Saltar si no hay ID

                    logger.info(
                        f"Generando test para Requisito ID: {requisito_id}")

                    # Crear el prompt final combinando todo
                    final_prompt = create_final_prompt(
                        prompt_content,
                        files_content,
                        tipo_requisito,
                        requisito,
                        llm,
                        ruta_backend_test,
                        ruta_frontend_test,
                        prompt_file
                    )

                    # --- Medir el tiempo de respuesta de la llamada al LLM ---
                    start_time = time.time()
                    respuesta = None  # Inicializar la respuesta
                    elapsed = -1  # Valor por defecto para indicar error en la medición
                    generation_successful = False  # Flag para saber si la llamada al LLM fue exitosa

                    try:
                        respuesta = call_llm(llm, final_prompt)
                        elapsed = time.time() - start_time
                        generation_successful = True
                        logger.info(
                            f"Test para {requisito_id} ({llm}, {prompt_file}) generado en {elapsed:.2f} segundos.")
                    except Exception as e:
                        elapsed = time.time() - start_time
                        logger.error(
                            f"ERROR: Fallo al generar test para {requisito_id} ({llm}, {prompt_file}): {e}", exc_info=True)

                    # --- Almacenar el resultado (tiempo o error) ---
                    # La clave única para la medición es la combinación (llm, prompt_file, tipo_requisito, requisito_id)
                    # prompt_file es el nombre del archivo, requisito_id es el ID del requisito.
                    # Usamos la tupla como clave para el diccionario global
                    key = (llm, prompt_file, tipo_requisito, requisito_id)
                    response_times[key] = elapsed  # Guardar el tiempo (o -1)

                    # --- Extraer y guardar los tests SOLO si la llamada al LLM fue exitosa y obtuvimos respuesta ---
                    if generation_successful and respuesta is not None:
                        try:
                            generate_test.extract_and_save_tests(
                                respuesta,
                                tipo_requisito,
                                requisito_id,  # Pasar el ID específico del requisito
                                llm,
                                ruta_frontend_test,
                                ruta_backend_test
                            )
                            # El logging de guardado exitoso ya está dentro de extract_and_save_tests

                        except Exception as e:
                            logger.error(
                                f"ERROR: Fallo al guardar los tests para {requisito_id} ({llm}, {prompt_file}): {e}", exc_info=True)
                    elif not generation_successful:
                        logger.warning(
                            f"Saltando el guardado de tests para {requisito_id} ({llm}, {prompt_file}) debido a que falló la generación por el LLM.")

    # --- Al terminar TODOS los bucles (todos los LLMs, prompts, requisitos), guardar los tiempos en Excel ---
    save_times_to_excel(response_times, ruta_general)
    logger.info("Proceso completo de generación de tests y medición de tiempos finalizado.")


def save_times_to_excel(all_response_times_data, base_output_dir, excel_subdir_name="llm_response_times"):
    """
    Guarda los tiempos de respuesta en archivos Excel separados por LLM.
    Cada archivo Excel contendrá una tabla donde las filas son Prompts (nombres de archivo)
    y las columnas son IDs de Requisitos (incluyendo el prefijo tipo_requisito).
    Fusiona los datos de la ejecución actual con los archivos Excel existentes.

    Args:
        all_response_times_data: dict con clave (llm, prompt_file_name, tipo_requisito, requisito_id)
                                 y valor = tiempo (float) o -1 si fallo. Contiene datos de UNA ejecución.
        base_output_dir: Carpeta general del proyecto donde se creará el subdirectorio para los Excels.
        excel_subdir_name: Nombre del subdirectorio dentro de base_output_dir para los archivos Excel.
    """
    logger.info("Iniciando proceso de guardado/actualización de tiempos en archivos Excel.")

    if not all_response_times_data:
        logger.warning("No hay datos de tiempos de respuesta recolectados en esta ejecución para guardar.")
        return

    # --- 1) Crear el directorio de salida si no existe ---
    output_directory = os.path.join(base_output_dir, excel_subdir_name)
    try:
        os.makedirs(output_directory, exist_ok=True)
        logger.info(f"Directorio de salida para Excel: '{output_directory}'")
    except Exception as e:
        logger.error(
            f"ERROR: No se pudo crear el directorio de salida '{output_directory}': {e}", exc_info=True)
        logger.error("Cancelando el guardado de tiempos en Excel.")
        return  # No se puede proceder sin el directorio

    # --- 2) Preparar los datos recolectados en esta ejecución en un formato tabular ---
    # Convertir el diccionario (llave tupla -> valor) a una lista de diccionarios más fácil de usar con pandas
    data_for_df = []
    for (llm, prompt_file, tipo_requisito, requisito_id), elapsed_time in all_response_times_data.items():
        # Formatear el tiempo a 2 decimales o poner 'Error' si la llamada falló
        time_value_display = round(
            elapsed_time, 2) if elapsed_time != -1 else 'Error'

        data_for_df.append({
            'LLM': llm,
            'Prompt': prompt_file,
            'Requisito ID': requisito_id,
            'Tiempo (s)': time_value_display
        })

    # Crear un DataFrame con los resultados de ESTA ejecución
    current_run_df = pd.DataFrame(data_for_df)
    logger.debug(
        f"DataFrame recolectado en esta ejecución:\n{current_run_df.head()}")

    # --- 3) Procesar cada LLM individualmente para crear/actualizar su archivo Excel ---
    # Agrupar los datos por LLM para procesar cada uno por separado
    llms_with_data = current_run_df['LLM'].unique()
    logger.info(
        f"LLMs con datos recolectados en esta ejecución: {', '.join(llms_with_data)}")

    for llm_name in llms_with_data:
        logger.info(f"  Procesando datos para LLM: {llm_name}")

        # Filtrar el DataFrame para obtener solo los datos de este LLM
        llm_group_df = current_run_df[current_run_df['LLM'] == llm_name].copy()

        # --- Pivotear los datos para este LLM ---
        # Queremos 'Prompt' como índice (filas) y 'Requisito ID' como columnas, con 'Tiempo (s)' como valores.
        try:
            # Usamos pivot_table por si acaso hay múltiples mediciones para la misma combinación Prompt/Requisito
            # en esta ejecución; aggfunc='first' toma la primera medición encontrada.
            pivot_df = llm_group_df.pivot_table(
                index='Prompt', columns='Requisito ID', values='Tiempo (s)', aggfunc='first')
            # logger.debug(f"  DataFrame pivotado para {llm_name}:\n{pivot_df.head()}")
        except Exception as e:
            logger.error(
                f"  ERROR: Fallo al pivotar los datos para el LLM '{llm_name}'. Saltando el guardado para este LLM.", exc_info=True)
            continue  # No podemos guardar si no se pudo pivotar

        # --- Determinar la ruta del archivo Excel para este LLM ---
        llm_filename = f"{llm_name}_response_times.xlsx"
        llm_filepath = os.path.join(output_directory, llm_filename)

        # --- Fusionar con los datos existentes si el archivo ya existe ---
        merged_df = pivot_df  # Inicialmente, los datos fusionados son solo los de esta ejecución

        if os.path.exists(llm_filepath):
            try:
                logger.info(
                    f"  Archivo existente encontrado: '{llm_filepath}'. Leyendo para fusionar...")
                # Leer el archivo existente. Asumimos que la primera hoja (sheet_name=0) es la tabla principal.
                # index_col=0 indica que la primera columna debe usarse como índice (los Nombres del Prompt).
                existing_df = pd.read_excel(
                    llm_filepath, sheet_name=0, index_col=0)
                # logger.debug(f"  DataFrame existente leído:\n{existing_df.head()}")

                # Realizar la fusión. combined_first mantiene los valores del DataFrame existente
                # a menos que el nuevo DataFrame (pivot_df) tenga un valor no nulo en esa posición.
                # Esto es perfecto para añadir nuevas filas (prompts) y columnas (requisitos)
                # y actualizar las celdas si ya existían.
                merged_df = existing_df.combine_first(pivot_df)
                logger.info(
                    f"  Datos fusionados correctamente con '{llm_filename}'.")

            except FileNotFoundError:
                # Esto no debería ocurrir si os.path.exists es True, pero se incluye por robustez.
                logger.warning(
                    f"  Archivo existente '{llm_filepath}' reportado como existente pero no encontrado al leerlo. Guardando solo datos nuevos.")
                merged_df = pivot_df  # Si falla la lectura, guardamos solo los datos nuevos
            except Exception as e:
                # Capturar cualquier otro error durante la lectura o fusión
                logger.error(
                    f"  ERROR: Fallo al leer o fusionar los datos del archivo existente '{llm_filepath}'. Se guardarán solo los datos de esta ejecución.", exc_info=True)
                merged_df = pivot_df  # Si falla la fusión, guardamos solo los datos nuevos

        # --- Guardar el DataFrame fusionado en el archivo Excel ---
        try:
            # Usamos ExcelWriter. Por defecto, si el archivo existe, se sobreescribe,
            # PERO como ya hemos FUSIONADO los datos ANTES de este paso, el DataFrame 'merged_df'
            # contiene tanto los datos viejos como los nuevos.
            # sheet_name_for_excel = llm_name.replace(" ", "_").replace("-", "_") # Crear un nombre de hoja válido

            with pd.ExcelWriter(llm_filepath, engine='openpyxl') as writer:
                # Reset index antes de guardar para que la columna 'Prompt' se guarde como una columna normal, no como el índice.
                # index=False evita guardar el índice numérico automático de pandas como una columna adicional.
                # sheet_name puede ser el nombre del LLM o simplemente 'Sheet1' si prefieres.
                # Nombre de hoja <= 31 caracteres
                merged_df.reset_index().to_excel(
                    writer, sheet_name=llm_name[:31], index=False)

            logger.info(
                f"  ✔ Tiempos guardados/actualizados exitosamente en '{llm_filepath}'")

        except Exception as e:
            logger.error(
                f"  ERROR: Fallo final al guardar el archivo Excel '{llm_filepath}': {e}", exc_info=True)

    logger.info(
        "Proceso de guardado de tiempos en archivos Excel finalizado para todos los LLMs con datos.")
