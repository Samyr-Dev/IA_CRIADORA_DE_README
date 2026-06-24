import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

export default function ReadmeCreator() {
  // Estados dos Inputs
  const [modoInput, setModoInput] = useState('perguntas'); // 'perguntas' ou 'codigo_direto'
  const [respostasPerguntas, setRespostasPerguntas] = useState('');
  const [trechoCodigo, setTrechoCodigo] = useState('');
  const [jaExisteReadme, setJaExisteReadme] = useState(false);
  const [readmeAntigo, setReadmeAntigo] = useState('');
  const [nomeRepositorio, setNomeRepositorio] = useState('');
  const [apiKey, setApiKey] = useState('');

  // Estados da Aplicação
  const [resultadoReadme, setResultadoReadme] = useState('');
  const [abaAtiva, setAbaAtiva] = useState('raw'); // 'preview' ou 'raw'
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleGerarReadme = async () => {
    // Validação da Chave de API
    if (!apiKey) {
      setErro('⚠️ Por favor, insira sua Gemini API Key para prosseguir.');
      return;
    }

    setCarregando(true);
    setErro('');

    // 1. Estruturação do contexto do usuário (mesma lógica do seu projeto.txt)
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

    // 2. Montagem do prompt com as suas regras críticas do Python
    const promptFinal = `
INSTRUÇÃO RESTRITA:
Crie o README.md baseando-se estritamente nestas informações fornecidas pelo usuário:
---
${conteudoUsuario}
---
REGRAS CRÍTICAS:
1. Se o usuário não forneceu uma informação, NÃO invente. Remova a seção.
2. NIE use placeholders como '[descrever aqui]'.
3. LinkedIn: https://www.linkedin.com/in/samyrtertuliano
4. A LICENSE deve ser exibida na mesma posição e formato do exemplo, sem alterações. O conteúdo pode ser adaptado, mas a estrutura e posição deve ser mantida. Opções que podem ser seguidas: [![NPM](https://img.shields.io/npm/l/react)](https://github.com/Samyr-Dev/${nomeRepositorio || 'REPOSITORIO'}/blob/main/LICENSE) ou [![License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
5. As seções devem seguir a ordem do exemplo, mas podem ser omitidas se não houver informação suficiente.
`;

    try {
      // 3. Inicializando o cliente com o novo SDK @google/genai
      const ai = new GoogleGenAI({ apiKey: apiKey });
      
      // Chamada exata ao modelo gemini-3-flash-preview
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: promptFinal,
        config: {
          systemInstruction: "Você é um assistente que converte anotações em Markdown. Proibido usar placeholders e proibido envolver o output em blocos de código markdown desnecessários.",
          temperature: 0.0,
        }
      });

      if (response.text) {
        // Limpeza de blocos de marcação que a IA possa retornar por vício
        const limpo = response.text
          .replace(/^```markdown\n?/i, '')
          .replace(/```$/, '');
        
        setResultadoReadme(limpo.strip ? limpo.strip() : limpo.trim());
      } else {
        setErro('A IA retornou um conteúdo vazio.');
      }

    } catch (err) {
      console.error(err);
      setErro(`❌ Erro na requisição: ${err.message || err}`);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      {/* Header */}
      <header className="mb-8 border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          AI README Generator
        </h1>
        <p className="text-slate-400 text-sm">Gere documentações limpas rodando a API direto no cliente.</p>
      </header>

      {/* Grid Principal - Duas Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* COLUNA DA ESQUERDA: INPUTS E CONFIGURAÇÕES */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-800 space-y-6">
          
          {/* Campo Crítico: API Key */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Gemini API Key</label>
            <input 
              type="password"
              placeholder="Cole sua AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-cyan-400 focus:outline-none focus:border-cyan-500 text-xs font-mono"
            />
          </div>

          {/* Nome do Repositório */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Nome do Repositório (GitHub)</label>
            <input 
              type="text"
              placeholder="ex: list-music"
              value={nomeRepositorio}
              onChange={(e) => setNomeRepositorio(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
            />
          </div>

          {/* Alternador de Modo de Contexto */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Como deseja fornecer as informações?</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700">
              <button 
                onClick={() => setModoInput('perguntas')}
                className={`py-1.5 text-xs rounded-md font-medium transition-all ${modoInput === 'perguntas' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Responder Perguntas
              </button>
              <button 
                onClick={() => setModoInput('codigo_direto')}
                className={`py-1.5 text-xs rounded-md font-medium transition-all ${modoInput === 'codigo_direto' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Apenas Código / Notas
              </button>
            </div>
          </div>

          {/* Campo Dinâmico de Texto */}
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

          {/* Insight 1: Inserção de trecho de código */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Digite parte do código aqui</label>
            <textarea 
              rows={5}
              placeholder="Cole dependências (package.json, requirements.txt) ou trechos de lógica essenciais..."
              value={trechoCodigo}
              onChange={(e) => setTrechoCodigo(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-cyan-400 focus:outline-none focus:border-cyan-500 font-mono text-xs"
            />
          </div>

          {/* Insight 2: Já existe um README? */}
          <div className="border-t border-slate-800 pt-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="checkbox"
                checked={jaExisteReadme}
                onChange={(e) => setJaExisteReadme(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-cyan-600 focus:ring-0 w-4 h-4"
              />
              <span className="text-sm font-medium text-slate-300">Já existe um README para este projeto?</span>
            </label>

            {jaExisteReadme && (
              <div className="mt-3">
                <textarea 
                  rows={4}
                  placeholder="Cole o Markdown do README atual para que a IA possa otimizá-lo e corrigir falhas..."
                  value={readmeAntigo}
                  onChange={(e) => setReadmeAntigo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>
            )}
          </div>

          {/* Feedback de Erro */}
          {erro && <div className="text-xs bg-red-900/40 border border-red-700 text-red-300 p-3 rounded-lg">{erro}</div>}

          {/* Botão disparador */}
          <button
            onClick={handleGerarReadme}
            disabled={carregando}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-all shadow-lg disabled:opacity-50"
          >
            {carregando ? 'A IA está analisando seus códigos...' : '🚀 Gerar Meu README.md'}
          </button>
        </div>

        {/* COLUNA DA DIREITA: OUTPUT E PREVIEW REALTIME */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-800 overflow-hidden sticky top-6">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
            <div className="flex space-x-2">
              <button 
                onClick={() => setAbaAtiva('raw')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${abaAtiva === 'raw' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Markdown Puro
              </button>
              <button 
                onClick={() => setAbaAtiva('preview')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${abaAtiva === 'preview' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Visualização (Preview)
              </button>
            </div>
            
            {resultadoReadme && (
              <button 
                onClick={() => navigator.clipboard.writeText(resultadoReadme)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 transition-all"
              >
                Copiar Markdown Puro
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
                <div className="prose prose-invert prose-sm max-w-none text-slate-300">
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