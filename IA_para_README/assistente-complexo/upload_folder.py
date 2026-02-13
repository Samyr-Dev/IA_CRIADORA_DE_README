# upload_folder.py
# ------------------------------------------------------------
# Sobe todos os arquivos de uma pasta para o Gemini e salva
# um JSON com {id, uri, nome, mime_type}. Re-executar sobrescreve.
# ------------------------------------------------------------
from google import genai
from google.genai import types
from pathlib import Path
import json
import mimetypes

# ============== CONFIG ==================
# Insira sua chave da API aqui
GEMINI_API_KEY = "SUA_CHAVE_DE_API_AQUI"
UPLOAD_DIR = "docs"                 # pasta com seus arquivos
OUTPUT_JSON = "uploaded_files.json"  # onde salvar IDs/URIs
DISPLAY_NAME_PREFIX = "README-"    # prefixo opcional
# ========================================


def ensure_mime(path: Path) -> str:
    mt, _ = mimetypes.guess_type(str(path))
    return mt or "application/octet-stream"


def main():
    client = genai.Client(api_key=GEMINI_API_KEY)

    up_dir = Path(UPLOAD_DIR)
    if not up_dir.exists() or not up_dir.is_dir():
        raise SystemExit(f"Pasta não encontrada: {UPLOAD_DIR}")

    uploaded_meta = []
    files = [p for p in up_dir.iterdir() if p.is_file()]
    if not files:
        raise SystemExit(f"Nenhum arquivo na pasta: {UPLOAD_DIR}")

    print(f"- Enviando {len(files)} arquivo(s) de '{UPLOAD_DIR}' ...")
    for i, path in enumerate(files, start=1):
        try:
            display_name = f"{DISPLAY_NAME_PREFIX}{path.name}"
            print(f"  [{i}/{len(files)}] Upload: {path.name}")
            with path.open("rb") as f:
                resp = client.files.upload(
                    file=f,
                    config=types.UploadFileConfig(
                        display_name=display_name, mime_type=ensure_mime(path))
                )
            meta = {
                "id": resp.name,
                "uri": resp.uri,
                "name": resp.display_name or path.name,
                "mime_type": resp.mime_type,
                "size_bytes": resp.size_bytes,
            }
            uploaded_meta.append(meta)
        except Exception as e:
            print(f"# Falha ao enviar {path.name}: {e}")

    Path(OUTPUT_JSON).write_text(json.dumps(uploaded_meta,
                                            ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nUpload concluído. Metadados salvos em: {OUTPUT_JSON}")
    print("ℹObservação: arquivos enviados ficam disponíveis por tempo limitado (ex.: ~48h). Reenvie quando necessário.")


if __name__ == "__main__":
    main()
