# 📝 Criador de Readme

**Otimize a criação de READMEs com Inteligência Artificial**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)

---

## 📋 Sobre o Projeto

**Criador de Readme** é um assistente baseado em **Inteligência Artificial** que ajuda a criar **READMEs profissionais e visualmente bem estruturados** para seus projetos no GitHub.

O objetivo é:
- ✅ **Otimizar tempo**: Gere READMEs completos e bem formatados em segundos
- ✅ **Organizar projetos**: Utilize um template pré-estabelecido e consistente
- ✅ **Melhorar visual**: Readmes bem estruturados e visualmente bonitos

O projeto utiliza a **API gratuita do Google Gemini** para processar contextos e gerar conteúdo inteligente, consultando o backend de IA especializada para garantir qualidade e relevância.

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Descrição |
|---|---|
| **Python** | Linguagem principal |
| **Google Gemini API** | IA Generativa para criação de conteúdo |
| **Backend IA** | Consulta contextualizada com especialização |
| **venv** | Ambiente virtual para isolamento de dependências |

---

## 📦 Dependências

Todas as dependências necessárias estão listadas em `requirements.txt`. Para instalar:

```bash
pip install -r requirements.txt
```

---

## 🔧 Como Executar

### Pré-requisitos
- Python 3.8 ou superior
- Chave de API do Google Gemini (gratuita)

### Passos de Execução

1. **Ative o ambiente virtual:**
   ```powershell
   # No Windows PowerShell:
   ..\venv\Scripts\Activate.ps1
   
   # Ou com o caminho completo:
   C:\Users\samyr\OneDrive\Documentos\Projetos Programação\IA_Readme\IA_para_QA\material-curso-ai\assistente-complexo\venv\Scripts\Activate.ps1
   ```

2. **Execute o script principal:**
   ```bash
   python .\consulta_contexto.py
   ```

3. **Siga as instruções** do assistente para:
   - Fornecer informações do seu projeto
   - Fazer upload de arquivos de contexto (se necessário)
   - Gerar seu README

---

## 📂 Estrutura do Projeto

```
assistente-complexo/
├── README.md                # Este arquivo
├── requirements.txt         # Dependências do projeto
├── consulta_contexto.py    # Script principal para consultar contexto
├── upload_contexto.py      # Script para upload de arquivos de contexto
├── api_server.py           # Servidor para integração com backend IA
├── docs/                    # Documentação adicional
│   └── Template readme.txt  # Template pré-estabelecido
└── venv/                    # Ambiente virtual Python
```

---

## 🎯 Funcionalidades Principais

### 1. **Consulta de Contexto**
   - Processa informações do seu projeto
   - Integra-se com a IA para análise inteligente
   - Gera recomendações baseadas em padrões

### 2. **Upload de Contexto**
   - Suporta arquivos de contexto (`.txt`, `.pdf`, etc.)
   - Enriquece a geração com informações específicas
   - Melhora a qualidade do README gerado

### 3. **Template Pré-estabelecido**
   - Layout profissional e consistente
   - Seções bem organizadas
   - Formatação Markdown otimizada

---

## 💡 Como Funciona

1. **Coleta de Informações**: O assistente coleta dados sobre seu projeto
2. **Processamento com IA**: A API do Gemini analisa as informações
3. **Consulta ao Backend**: Integra-se com serviço especializado para contexto adicional
4. **Geração de README**: Cria um documento formatado e pronto para uso
5. **Entrega**: Arquivo README.md gerado e pronto para seu repositório

---

## 📋 Exemplo de Uso

```bash
# Ative o ambiente
..\venv\Scripts\Activate.ps1

# Execute o assistente
python .\consulta_contexto.py

# Siga as instruções interativas...
```

O assistente perguntará:
- Nome do projeto
- Descrição
- Tecnologias utilizadas
- Como executar
- Etc.

E gerará um README completo e profissional! ✨

---

## 📄 Licença

Este projeto será licenciado sob licença MIT. Veja `LICENSE` para detalhes.

---

## 🔗 Conecte-se

[LinkedIn](https://linkedin.com/in/seu-perfil) - Veja meu perfil profissional

---

## ⚡ Próximos Passos

- Adicionar suporte a mais formatos de arquivo
- Integrar com mais modelos de IA
- Criar versão web com interface gráfica
- Adicionar templates customizados

---

**Desenvolvido com ❤️ usando Python e IA Generativa**
