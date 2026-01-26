# query_with_context.py
# -------------------------------------------------------------------
# Lê uploaded_files.json, usa TODOS os arquivos como contexto em cada
# chamada ao modelo, permite adicionar contexto-texto, e o prompt é
# definido em variável. Opcional: rodar múltiplas "personas".
# -------------------------------------------------------------------
from google import genai
from google.genai import types
import json

# ============== CONFIG ==================
GEMINI_API_KEY = "AIzaSyDJanSfL6E6dqcdp0MSP5Vxd-EEHgsZn14"  # Insira sua chave da API aqui
MODEL = "gemini-2.5-flash"
UPLOADED_JSON = "uploaded_files.json"
USE_CONTEXT_FILES = True  # Flag para controlar o envio de arquivos de contexto

USER_INPUT = """
Crie um Readme e uma descrição detalhada sobre o projeto que o usuário informar.
Pergunte em qual linguagem de programação o usuário trabalhou no projeto, bem como foi feito o projeto. O Readme final deve ser entregue em formato de Markdown.
"""

# Contexto extra em TEXTO
EXTRA_CONTEXT_TEXT = (
    "Considere os documentos de apoio disponíveis para entender melhor o contexto e as necessidades do usuário.",
    "O modelo serve como exemplo e pode ser adaptado para diferentes readme de acordo com o projeto.",
)
# ========================================

def load_uploaded(json_path: str):
    try:
        data = json.loads(open(json_path, "r", encoding="utf-8").read())
        if not isinstance(data, list) or not data:
            raise ValueError("JSON não contém uma lista com metadados dos arquivos.")
        return data
    except Exception as e:
        raise SystemExit(f"Falha ao ler {json_path}: {e}")

def make_contents(user_input: str, uploaded_files: list):
    parts = [types.Part(text=user_input)]
    for meta in uploaded_files:
        uri = meta.get("uri")
        mime_type = meta.get("mime_type")
        if uri and mime_type:
            parts.append(types.Part(file_data=types.FileData(mime_type=mime_type, file_uri=uri)))
    return parts

def run_query(user_input):
    client = genai.Client(api_key=GEMINI_API_KEY)
    uploaded = []
    if USE_CONTEXT_FILES:
        try:
            uploaded = load_uploaded(UPLOADED_JSON)
        except SystemExit:
            pass
    sys_instr = EXTRA_CONTEXT_TEXT
    contents = make_contents(user_input, uploaded)
    try:
        resp = client.models.generate_content(
            model=MODEL,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=sys_instr,
                thinking_config=types.ThinkingConfig(thinking_budget=0),
            ),
        )
        return (resp.text or "").strip() or "[sem texto]"
    except Exception as e:
        return f"[ERRO] {e}"

if __name__ == "__main__":
    print(run_query(USER_INPUT))
