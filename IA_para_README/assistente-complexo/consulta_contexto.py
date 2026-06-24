import time
import os
import json
from google import genai
from google.genai import types

# ============== CONFIG ==============
GEMINI_API_KEY = "AIzaSyDyo9jnf38bF2AnBuQPSb9z8R4ggoWrhPQ"
UPLOADED_JSON = "uploaded_files.json"
ARQUIVO_RESPOSTAS = "projeto.txt"
ARQUIVO_FINAL = "README.md"
MODEL = "gemini-3-flash-preview"
# ====================================


def run_query():
    client = genai.Client(api_key=GEMINI_API_KEY)

    # Inicializamos a variável com uma string vazia para evitar o erro de 'not associated with a value'
    conteudo_usuario = ""

    # Verifica se o arquivo existe e se tem conteúdo suficiente
    ja_respondeu = os.path.exists(
        ARQUIVO_RESPOSTAS) and os.path.getsize(ARQUIVO_RESPOSTAS) > 100

    if not ja_respondeu:
        print("📝 Gerando perguntas iniciais no projeto.txt...")
        prompt = "Liste 8 perguntas essenciais para estruturar um README de GitHub profissional. Mande apenas as perguntas."
        modo = "perguntas"
    else:
        print("📖 Lendo respostas e gerando o README final...")
        with open(ARQUIVO_RESPOSTAS, "r", encoding="utf-8") as f:
            conteudo_usuario = f.read()

        # O prompt agora usa a variável definida com segurança
        prompt = f"""
        INSTRUÇÃO RESTRITA:
        Crie o README.md baseando-se estritamente nestas informações fornecidas pelo usuário:
        ---
        {conteudo_usuario}
        ---
        REGRAS CRÍTICAS:
        1. Se o usuário não forneceu uma informação, NÃO invente. Remova a seção.
        2. NÃO use placeholders como '[descrever aqui]'.
        3. LinkedIn: https://www.linkedin.com/in/samyrtertuliano
        4. A LICENSE deve ser exibida na mesma posição e formato do exemplo, sem alterações. O conteúdo pode ser adaptado, mas a estrutura e posição deve ser mantida. Opções que podem ser seguidas: [![NPM](https://img.shields.io/npm/l/react)](https://github.com/Samyr-Dev/REPOSITÓRIO/blob/main/LICENSE) ou [![License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
        5. As seções devem seguir a ordem do exemplo, mas podem ser omitidas se não houver informação suficiente. Exemplo de estrutura para dividir as seções do README e deixar mais legível:
        ---
        """
        modo = "readme"

    try:
        print(f"🚀 Enviando requisição para {MODEL}...")

        # Se for modo readme, aplicamos um pequeno delay para evitar o erro 429
        if modo == "readme":
            time.sleep(5)

        resp = client.models.generate_content(
            model=MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction="Você é um assistente que converte anotações em Markdown. Proibido usar placeholders.",
                temperature=0.0,
            ),
        )

        if resp.text:
            if modo == "perguntas":
                with open(ARQUIVO_RESPOSTAS, "w", encoding="utf-8") as f:
                    f.write(resp.text)
                return "✅ Perguntas salvas em 'projeto.txt'. Responda-as e execute novamente."
            else:
                with open(ARQUIVO_FINAL, "w", encoding="utf-8") as f:
                    limpo = resp.text.replace(
                        "```markdown", "").replace("```", "")
                    f.write(limpo.strip())
                return f"✅ README gerado com sucesso em {ARQUIVO_FINAL}!"

    except Exception as e:
        return f"❌ Erro: {e}"


if __name__ == "__main__":
    print(run_query())
