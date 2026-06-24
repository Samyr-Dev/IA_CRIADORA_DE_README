# 📝 Criador de Readme

**Otimize a criação de READMEs com Inteligência Artificial**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)

---

## 📋 Sobre o Projeto

**Criador de Readme** é um assistente baseado em **Inteligência Artificial** que ajuda a criar **READMEs profissionais e visualmente bem estruturados** para seus projetos no GitHub.

O objetivo é:
- ✅ **Otimizar tempo**: Gere READMEs completos e bem formatados em segundos.
- ✅ **Organizar projetos**: Utilize um template pré-estabelecido e consistente.
- ✅ **Melhorar visual**: Readmes bem estruturados e visualmente bonitos.

O projeto utiliza a **API gratuita do Google Gemini** para processar contextos e gerar conteúdo inteligente, consultando o backend de IA especializada para garantir qualidade e relevância.

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Descrição |
|---|---|
| **Python** | Linguagem principal do backend e processamento |
| **Google Gemini API** | IA Generativa para criação de conteúdo |
| **Backend IA** | Consulta contextualizada com especialização |
| **venv** | Ambiente virtual para isolamento de dependências |
| **Node.js / NPM** | Gerenciamento e execução da interface/ferramenta |

---

## 📦 Dependências

Para o funcionamento do backend e scripts Python, instale as dependências listadas em `requirements.txt`:

```bash
pip install -r requirements.txt
```

---

## 🔧 Como Executar

### Pré-requisitos
- Python 3.8 ou superior
- Node.js e NPM
- Chave de API do Google Gemini

### Passos de Execução

1. **Interface/Criador:**
   Acesse a pasta do projeto e execute o comando de desenvolvimento:
   ```bash
   cd criador-readme
   npm run dev
   ```

2. **Ambiente Python (Backend/Scripts):**
   Ative o ambiente virtual para executar os scripts de suporte:
   ```powershell
   # No Windows:
   .\venv\Scripts\Activate.ps1
   ```

3. **Execução do Script de Contexto:**
   ```bash
   python .\consulta_contexto.py
   ```

---

## 📂 Estrutura do Projeto

Conforme a estrutura remota do repositório:

```
- .gitignore
- .vscode/
- IA_para_README/
- LICENSE
- README.md
- backend/
- criador-readme/
```

---

## 🎯 Funcionalidades Principais

### 1. **Consulta de Contexto**
- Processa informações do seu projeto.
- Integra-se com a IA para análise inteligente.
- Gera recomendações baseadas em padrões.

### 2. **Upload de Contexto**
- Suporta arquivos de contexto para enriquecer a geração.
- Melhora a qualidade do README gerado com informações específicas.

### 3. **Template Pré-estabelecido**
- Layout profissional e consistente.
- Seções bem organizadas e formatação Markdown otimizada.

---

## 💡 Como Funciona

1. **Coleta de Informações**: O assistente coleta dados sobre seu projeto.
2. **Processamento com IA**: A API do Gemini analisa as informações fornecidas.
3. **Consulta ao Backend**: Integra-se com serviço especializado para contexto adicional.
4. **Geração de README**: Cria um documento formatado e pronto para uso.

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](./LICENSE) para detalhes.

---

## 🔗 Conecte-se

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/samyrtertuliano)

---

**Desenvolvido com ❤️ usando Python e IA Generativa**
