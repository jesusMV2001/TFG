import logging
import os

logger = logging.getLogger("TFG")
logger.setLevel(logging.DEBUG)

formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# Handler para la consola (nivel INFO)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(formatter)

# Handler para un archivo (nivel DEBUG)
log_file = os.path.join(os.path.dirname(__file__), 'application.log')
file_handler = logging.FileHandler(log_file, encoding='utf-8')
file_handler.setLevel(logging.DEBUG)
file_handler.setFormatter(formatter)
 
# Agregar los handlers al logger
logger.addHandler(console_handler)
logger.addHandler(file_handler)