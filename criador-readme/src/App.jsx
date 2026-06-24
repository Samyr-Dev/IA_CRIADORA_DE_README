import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

export default function App() {
  // Estados dos Inputs
  const [modoInput, setModoInput] = useState('perguntas');
  const [respostasPerguntas, setRespostasPerguntas] = useState('');
  const [trechoCodigo, setTrechoCodigo] = useState('');
  const [jaExisteReadme, setJaExisteReadme] = useState(false);
  const [jaExisteRepositorio, setJaExisteRepositorio] = useState(false);
  const [readmeAntigo, setReadmeAntigo] = useState('');
  const [nomeRepositorio, setNomeRepositorio] = useState('');
  const [apiKey, setApiKey] = useState('');

  // Estados da Aplicação
  const [resultadoReadme, setResultadoReadme] = useState('');
  const [abaAtiva, setAbaAtiva] = useState('raw');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [buscandoGit, setBuscandoGit] = useState(false);
  const [jaSincronizouGit, setJaSincronizouGit] = useState(false);

  // Função auxiliar para exibir erro controlado com timer de 10 segundos
  const exibirErroComTimer = (mensagemErro) => {
    setErro(mensagemErro);
    setTimeout(() => {
      setErro('');
    }, 10000);
  };

  const fetchGitHubRepo = async () => {
    if (!nomeRepositorio.trim()) {
      exibirErroComTimer('⚠️ Digite o nome ou link do repositório antes de buscar.');
      return;
    }

    if (jaSincronizouGit) {
      const confirmacao = window.confirm(
        'Você já sincronizou este repositório. Deseja consultar de novo?\n\nNota: Caso o repositório seja encontrado, as informações atualizadas ficarão no campo "Dados acumulados de código para a IA".'
      );
      if (!confirmacao) {
        return;
      }
    }

    setBuscandoGit(true);
    setErro('');

    let repoPath = nomeRepositorio
      .replace('https://github.com/', '')
      .replace('http://github.com/', '');

    if (repoPath.endsWith('/')) repoPath = repoPath.slice(0, -1);

    try {
      const resContents = await fetch(`https://api.github.com/repos/${repoPath}/contents`);

      if (!resContents.ok) {
        throw new Error('Não foi possível encontrar o repositório. Verifique se ele é público.');
      }

      const files = await resContents.json();

      let estruturaInstrucao = `[ESTRUTURA DE ARQUIVOS REMOTA DO GITHUB]\n`;
      let arquivosRelevantes = [];

      files.forEach(file => {
        estruturaInstrucao += `- ${file.path} (${file.type})\n`;
        if (['package.json', 'requirements.txt', 'pom.xml', 'go.mod', 'cargo.toml'].includes(file.name.toLowerCase())) {
          arquivosRelevantes.push(file);
        }
      });

      if (arquivosRelevantes.length > 0) {
        const fileRes = await fetch(arquivosRelevantes[0].download_url);
        if (fileRes.ok) {
          const textoArquivo = await fileRes.text();
          estruturaInstrucao += `\n[CONTEÚDO DO ARQUIVO DE CONFIGURAÇÃO DETECTADO: ${arquivosRelevantes[0].name}]\n${textoArquivo}\n`;
        }
      }

      setTrechoCodigo(estruturaInstrucao.trim());
      setJaSincronizouGit(true);
      alert('✅ Dados do repositório GitHub integrados com sucesso!');

    } catch (err) {
      console.error(err);

      if (jaSincronizouGit) {
        setTrechoCodigo('');
        setJaSincronizouGit(false);
      }

      exibirErroComTimer(`❌ Falha ao conectar com o GitHub: ${err.message}`);
      window.alert('❌ Falha ao conectar com o GitHub. Verifique se o repositório é público e tente novamente.');
    } finally {
      setBuscandoGit(false);
    }
  };

  const handleGerarReadme = async () => {
    const chaveEfetiva = apiKey.trim() || "AIzaSyDyo9jnf38bF2AnBuQPSb9z8R4ggoWrhPQ";

    if (resultadoReadme) {
      const confirmacao = window.confirm('Você já gerou um README. Deseja gerar outro? Isso substituirá o conteúdo atual.');
      if (!confirmacao) {
        return;
      }
    }

    setCarregando(true);
    setErro('');

    if (!respostasPerguntas.trim() && !trechoCodigo.trim() && !readmeAntigo.trim()) {
      exibirErroComTimer('⚠️ Por favor, forneça pelo menos uma informação para gerar o README.');
      setCarregando(false);
      return;
    }

    let conteudoUsuario = "";
    if (nomeRepositorio) {
      conteudoUsuario += `Nome do Repositório GitHub: ${nomeRepositorio}\n`;
    }
    if (modoInput === 'perguntas') {
      conteudoUsuario += `\n[RESPOSTAS ÀS PERGUNTAS DO PROJETO]\n${respostasPerguntas}\n`;
    } else {
      conteudoUsuario += `\n[DESCRIÇÃO LIVRE DO PROJETO]\n${respostasPerguntas}\n`;
    }
    if (trechoCodigo) {
      conteudoUsuario += `\n[TRECHOS DE CÓDIGO E CONFIGURAÇÃO]\n\`\`\`\n${trechoCodigo}\n\`\`\`\n`;
    }
    if (jaExisteReadme && readmeAntigo) {
      conteudoUsuario += `\n[README ATUAL DO PROJETO (PARA MELHORAR)]\n${readmeAntigo}\n`;
    }

    const promptFinal = `
INSTRUÇÃO RESTRITA:
Crie o README.md baseando-se estritamente nestas informações fornecidas pelo usuário:
---
${conteudoUsuario}
---
REGRAS CRÍTICAS:
1. Se o usuário não forneceu uma informação, NÃO invente. Remova a seção.
2. NÃO use placeholders como '[descrever aqui]'.
3. LinkedIn: https://www.linkedin.com/in/samyrtertuliano
4. A LICENSE deve ser exibida na mesma posição e formato do exemplo, sem alterações. O conteúdo pode ser adaptado, mas a estrutura e posição deve ser mantida. Opções que podem ser seguidas: [![NPM](https://img.shields.io/npm/l/react)](https://github.com/Samyr-Dev/${nomeRepositorio.includes('/') ? nomeRepositorio.split('/').pop() : nomeRepositorio || 'REPOSITORIO'}/blob/main/LICENSE) ou [![License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
5. As seções devem seguir a ordem do exemplo, mas podem ser omitidas se não houver informação suficiente.
`;

    try {
      const ai = new GoogleGenAI({ apiKey: chaveEfetiva });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: promptFinal,
        config: {
          systemInstruction: "Você é um assistente que converte anotações em Markdown. Proibido usar placeholders e proibido envolver o output em blocos de código markdown desnecessários.",
          temperature: 0.0,
        }
      });

      if (response.text) {
        const limpo = response.text
          .replace(/^```markdown\n?/i, '')
          .replace(/```$/, '');

        setResultadoReadme(limpo.trim());
      } else {
        exibirErroComTimer('A IA retornou um conteúdo vazio.');
      }

    } catch (err) {
      console.error(err);
      if (err.status === 503) {
        exibirErroComTimer('❌ Erro de autenticação: Verifique sua chave de API, o serviço pode estar indisponível ou a chave pode estar incorreta.');
      } else {
        exibirErroComTimer(`❌ Erro na requisição: ${err.message || err}`);
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleCopiarCodigo = () => {
    navigator.clipboard.writeText(resultadoReadme);
    setCopiado(true);
    setTimeout(() => {
      setCopiado(false);
    }, 3000);
  };

  const handleFolderUpload = async (e) => {
    const files = Array.from(e.target.files);
    let acumuladorTexto = "";

    if (files.length > 500) {
      alert(`⚠️ Atenção: Você selecionou ${files.length} arquivos. O sistema irá processar os dados, mas a leitura pode ser um pouco mais lenta. Por favor, aguarde.`);
    }

    const arquivosLimitados = files.slice(0, 300);

    for (const file of arquivosLimitados) {
      const path = file.webkitRelativePath.toLowerCase();

      if (
        path.includes('node_modules/') ||
        path.includes('.git/') ||
        path.includes('dist/') ||
        path.includes('build/') ||
        path.includes('.next/') ||
        path.includes('.vscode/') ||
        path.includes('venv/')
      ) {
        continue;
      }

      const extensoesSuportadas = ['.js', '.jsx', '.json', '.py', '.ts', '.tsx', '.txt', '.html', '.css', '.java', '.c', '.cpp'];
      const aceito = extensoesSuportadas.some(ext => file.name.toLowerCase().endsWith(ext));

      if (aceito) {
        try {
          const texto = await file.text();
          if (texto.length < 50000) {
            acumuladorTexto += `\n--- ARQUIVO: ${file.webkitRelativePath} ---\n${texto}\n`;
          }
        } catch (readError) {
          console.error(`Erro ao ler o arquivo ${file.name}:`, readError);
        }
      }
    }

    if (acumuladorTexto) {
      setTrechoCodigo(prev => (prev + "\n" + acumuladorTexto).trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <header className="mb-8 border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          IA Geradora de README.md para Projetos de Código Aberto
        </h1>
        <p className="text-slate-400 text-sm">Gere documentações limpas rodando a API direto no cliente.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* COLUNA DA ESQUERDA */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-800 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Gemini API Key</label>
            <input
              type="password"
              placeholder="Cole sua API Key (Caso não tenha, uma chave padrão será usada)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-cyan-400 focus:outline-none focus:border-cyan-500 text-xs font-mono"
            />
          </div>

          {/* SWITCH 1: REPOSITÓRIO GITHUB */}
          <div className="border-t border-slate-800 pt-4">
            <div className="flex items-center justify-between bg-slate-900/40 p-3 rounded-lg border border-slate-800">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-300">Já existe um repositório no GitHub para esse projeto?</span>
                <span className="text-xs text-slate-500">Se ativo, poderemos extrair dados dinamicamente do repositório público.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={jaExisteRepositorio}
                  onChange={(e) => setJaExisteRepositorio(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-cyan-500 peer-focus:ring-2 peer-focus:ring-cyan-500/30 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all duration-200 ease-in-out peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>

            {jaExisteRepositorio && (
              <div className="mt-4 space-y-4 bg-slate-900/20 p-4 rounded-lg border border-slate-800/80">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nome ou Link do Repositório (GitHub)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ex: Samyr-Dev/list-music ou a URL completa"
                      value={nomeRepositorio}
                      onChange={(e) => setNomeRepositorio(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                    />
                    <button
                      type="button"
                      onClick={fetchGitHubRepo}
                      disabled={buscandoGit}
                      className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg text-sm transition-all border border-slate-600 disabled:opacity-50"
                    >
                      {buscandoGit ? 'Buscando...' : '🔍 Sincronizar'}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center gap-1.5 mb-1">
                    <label className="block text-sm font-medium text-slate-300">
                      Selecione a pasta local do projeto (Opcional)
                    </label>

                    {/* ÍCONE DE INFORMAÇÃO COM TOOLTIP ESTILO NECTARCRM */}
                    <div className="relative group inline-block cursor-help">
                      {/* O Ícone SVG cinza de 16x16px */}
                      <svg
                        className="w-4 h-4 text-slate-500 hover:text-slate-400 transition-colors"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>

                      {/* O Balão de Informação (Tooltip) que aparece no Hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-950 text-slate-300 text-xs rounded-lg p-2.5 shadow-xl border border-slate-800 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 leading-relaxed">
                        <p className="font-semibold text-cyan-400 mb-1">Formatos lidos pela IA:</p>
                        <code className="text-slate-400 text-[10px] block bg-slate-900/50 p-1.5 rounded border border-slate-800 font-mono">
                          .js, .jsx, .json, .py, .ts, .tsx, .txt, .html, .css, .java, .c, .cpp
                        </code>
                        {/* Triângulo na base do balão */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-950"></div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mb-2">A IA irá analisar os arquivos de código para gerar o README.</p>

                  <input
                    type="file"
                    webkitdirectory="true"
                    directory="true"
                    multiple
                    onChange={handleFolderUpload}
                    className="w-full bg-slate-900 border border-dashed border-slate-700 rounded-lg p-4 text-center text-sm text-slate-400 cursor-pointer hover:border-cyan-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Como deseja fornecer as informações?</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => setModoInput('perguntas')}
                className={`py-1.5 text-xs rounded-md font-medium transition-all ${modoInput === 'perguntas' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Responder Perguntas
              </button>
              <button
                type="button"
                onClick={() => setModoInput('codigo_direto')}
                className={`py-1.5 text-xs rounded-md font-medium transition-all ${modoInput === 'codigo_direto' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Apenas Código / Notas
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {modoInput === 'perguntas' ? 'Respostas do projeto.txt' : 'Descrição Livre do Projeto'}
            </label>
            <textarea
              rows={5}
              placeholder={modoInput === 'perguntas' ? "1. O projeto serve para...\n2. Instala-se rodando o comando..." : "Explique com suas palavras as funcionalidades e fluxos do sistema..."}
              value={respostasPerguntas}
              onChange={(e) => setRespostasPerguntas(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Dados acumulados de código para a IA</label>
            <textarea
              rows={5}
              placeholder="Arquivos sincronizados do GitHub ou carregados via pasta local aparecerão aqui..."
              value={trechoCodigo}
              onChange={(e) => setTrechoCodigo(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-cyan-400 focus:outline-none focus:border-cyan-500 font-mono text-xs"
            />
          </div>

          {/* SWITCH 2: README EXISTENTE */}
          <div className="border-t border-slate-800 pt-4">
            <div className="flex items-center justify-between bg-slate-900/40 p-3 rounded-lg border border-slate-800">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-300">Já existe um README para este projeto?</span>
                <span className="text-xs text-slate-500">Se ativo, a IA usará o documento antigo como base de otimização.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={jaExisteReadme}
                  onChange={(e) => setJaExisteReadme(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-cyan-500 peer-focus:ring-2 peer-focus:ring-cyan-500/30 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all duration-200 ease-in-out peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>

            {jaExisteReadme && (
              <div className="mt-3">
                <textarea
                  rows={4}
                  placeholder="Cole o Markdown do README atual..."
                  value={readmeAntigo}
                  onChange={(e) => setReadmeAntigo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>
            )}
          </div>

          {erro && <div className="text-xs bg-red-900/40 border border-red-700 text-red-300 p-3 rounded-lg transition-all duration-300">{erro}</div>}

          <button
            onClick={handleGerarReadme}
            disabled={carregando}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-all shadow-lg disabled:opacity-50"
          >
            {carregando ? 'A IA está analisando seus códigos...' : '🚀 Gerar Meu README.md'}
          </button>
        </div>

        {/* COLUNA DA DIREITA */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-800 overflow-hidden sticky top-6">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setAbaAtiva('raw')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${abaAtiva === 'raw' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Markdown Puro
              </button>
              <button
                type="button"
                onClick={() => setAbaAtiva('preview')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${abaAtiva === 'preview' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Visualização (Preview)
              </button>
            </div>

            {resultadoReadme && (
              <button
                type="button"
                onClick={handleCopiarCodigo}
                className={`text-xs px-2.5 py-1 rounded border transition-all ${copiado
                  ? 'bg-emerald-900/60 text-emerald-300 border-emerald-500 scale-105'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
              >
                {copiado ? '✓ Copiado com sucesso!' : 'Copiar Markdown Puro'}
              </button>
            )}
          </div>

          <div className="p-6 h-[620px] overflow-y-auto">
            {resultadoReadme ? (
              abaAtiva === 'raw' ? (
                <pre className="font-mono text-xs text-emerald-400 whitespace-pre-wrap select-all bg-slate-950 p-4 rounded-lg border border-slate-800 h-full overflow-y-auto">
                  {resultadoReadme}
                </pre>
              ) : (
                <div className="prose prose-invert max-w-none text-slate-200 
                  prose-headings:font-semibold prose-headings:border-b prose-headings:border-slate-800 prose-headings:pb-1 prose-headings:mb-3 prose-headings:mt-6
                  prose-h1:text-2xl prose-h1:mt-0 prose-h2:text-xl prose-h3:text-lg
                  prose-p:text-sm prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                  prose-code:text-slate-200 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 prose-pre:p-4 prose-pre:rounded-lg
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                  prose-li:text-sm prose-li:mb-1
                  prose-hr:border-slate-800 prose-hr:my-6
                  prose-table:border-collapse prose-table:w-full prose-table:my-4 prose-th:border prose-th:border-slate-700 prose-th:p-2 prose-th:bg-slate-900/60 prose-th:text-xs prose-td:border prose-td:border-slate-700 prose-td:p-2 prose-td:text-xs"
                >
                  <ReactMarkdown>{resultadoReadme}</ReactMarkdown>
                </div>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm space-y-2">
                <span>Os dados gerados pela IA aparecerão aqui.</span>
                <span className="text-xs text-slate-600">Insira as informações obrigatórias à esquerda.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}