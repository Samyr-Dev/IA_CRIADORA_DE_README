# IA_para_QA  -  **Inteligência Artificial Aplicada à Garantia de Qualidade (QA)**

[![NPM](https://img.shields.io/npm/l/react)](https://github.com/Samyr-Dev/REPOSITÓRIO/blob/main/LICENSE)

Este repositório é um **material de estudo e um *framework* prático completo** que explora a convergência entre técnicas de **Inteligência Artificial (IA)**, **Machine Learning (ML)** e o processo de **Garantia de Qualidade (QA)** e **Automação de Testes**.

Ele demonstra como a IA Generativa e as ferramentas tradicionais de automação podem ser integradas para criar um ecossistema de testes mais eficiente, inteligente e robusto.

---

### 🚀 Objetivo do Projeto

O objetivo principal é treinar e demonstrar as habilidades necessárias para um QA Engineer moderno, com foco em:

1.  **Geração Inteligente de Conteúdo:** Utilizar modelos de IA (Gemini) para processar documentação e gerar artefatos de teste.
2.  **Automação Full-Stack:** Cobrir testes de API, UI Web e testes unitários.
3.  **Testes Avançados:** Implementar conceitos de *Visual Testing* e *Self-Healing* para aumentar a robustez dos testes automatizados.
4.  **Gerenciamento de Contexto:** Manipular arquivos e documentos (`.pdf`, `.txt`) para contextualizar modelos de IA.

### 🛠️ Tecnologias e Ferramentas

| Categoria | Tecnologia | Uso no Projeto |
| :--- | :--- | :--- |
| **Linguagem** | Python | Linguagem principal para todos os scripts de automação, APIs e modelos. |
| **IA Generativa** | Google Gemini (via scripts) | Geração de casos de teste, análise de regras de negócio e contexto. |
| **Automação Web** | Selenium WebDriver | Interação com elementos da interface web (Módulo `ui/`). |
| **API Testing** | Requests/Frameworks Python | Testes automatizados na API REST (Módulo `api/`). |
| **Visual Testing** | Scripts de comparação | Comparação de *screenshots* para detecção de regressão visual. |
| **Virtualização** | Docker/Docker Compose | Criação de ambientes de teste isolados (Selenoid, Appium, etc.). |
| **Gerenciamento** | venv (Ambiente Virtual) | Isolamento e gerenciamento de dependências (`requirements.txt`). |

---

### 📁 Estrutura Detalhada do Repositório

| Diretório/Arquivo | Conteúdo e Função Específica |
| :--- | :--- |
| **`material-curso-ai/`** | Diretório principal que contém os **exemplos de IA Generativa** e scripts de manipulação de contexto. |
| **`assistente-complexo/`** | Scripts para manipulação e consulta de contexto extenso (`.pdf`, `.txt`) via Gemini, incluindo **`api_server.py`** e **`upload_contexto.py`**. |
| **`assistente-simples/`** | Scripts de IA mais diretos, como **`context_gemini.py`** e **`base_propria.py`**, focados em interações básicas com o modelo. |
| **`automacao/`** | Scripts de automação que interagem com o sistema de testes **Barriga** (API e UI). |
| ├── **`teste_barriga.py`** | Scripts de automação Web com Selenium (UI Testing). |
| ├── **`teste_barriga_api.py`** | Scripts de teste da API Barriga (API Testing). |
| ├── **`barrigarest-openapi.yaml`**| Arquivo de especificação OpenAPI (Swagger) da API utilizada. |
| **`api/`** | Estrutura modular para testes de API. Contém **`barriga_api.py`** (funções da API) e **`test_barriga_api.py`** (casos de teste). |
| **`ui/`** | Estrutura Page Object Model (POM) para testes de interface. |
| ├── **`pages/login_page.py`** | Implementação do objeto de página de login. |
| **`unitarios/`** | Demonstração de Testes Unitários. Inclui **`calculadora.py`** e seus respectivos testes (`calculadora_test.py`). |
| **`casos-de-teste/`** | Armazenamento de artefatos de QA, como **`casos_de_teste.txt`**, **`user_story.txt`**, e **`caso_de_uso.txt`**. |
| **`visual/`** | Scripts e arquivos para **Visual Testing**. O **`visual_check.py`** compara `v1.html` e `v2.html` ou *screenshots* para detectar regressão visual. |
| **`docker/`** | Arquivos de configuração Docker para ambientes de testes avançados (Selenoid, Appium, Web). |
| **`self-healing/`** | (Vazio, mas reservado) Diretório para futura implementação de testes com capacidade de autocorreção. |
| **`requirements.txt`** | Lista todas as dependências Python necessárias para o projeto. |

---

### ⚙️ Pré-requisitos e Instalação

Para rodar os scripts e experimentos deste repositório, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/Samyr-Dev/IA_para_QA.git](https://github.com/Samyr-Dev/REPOSITÓRIO.git)
    cd REPOSITÓRIO
    ```

2.  **Crie e ative o Ambiente Virtual (`venv`):**
    ```bash
    # Cria o ambiente virtual
    python -m venv venv

    # Ativação (Windows - PowerShell)
    .\venv\Scripts\Activate.ps1
    ```

3.  **Instale as dependências (Selenium, bibliotecas de IA, Requests, etc.):**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Execute os testes (Exemplos):**

    * **Automação Web:**
        ```bash
        python automacao/teste_barriga.py
        ```
    * **Testes Unitários:**
        ```bash
        python unitarios/calculadora_test.py
        ```
    * **Consulta de Contexto (IA):**
        ```bash
        python assistente-complexo/consulta_contexto.py
        ```

---

## 🧑‍💻 Autor

**Samyr Silva Tertuliano Deusdará**

🔗 [Linkedin](https://www.linkedin.com/in/samyrtertuliano)


## 📝 Descrição "About" Sugerida

Use esta descrição concisa na seção "About" (ou como *short description* do repositório):

> **Framework de QA focado em IA Generativa, Automação Full-Stack (API, UI, Unitários) e Testes Avançados (Visual Testing). Utiliza Python, Selenium e Google Gemini para criar testes inteligentes e robustos.**