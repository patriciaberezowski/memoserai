
import React, { useState } from 'react';
import { generateMemoDraft } from '../services/geminiService';

const MemoForm: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIDraft = async () => {
    if (!subject) return alert('Por favor, defina um assunto primeiro.');
    setIsGenerating(true);
    const draft = await generateMemoDraft(subject, details);
    setContent(draft);
    setIsGenerating(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Novo Memorando</h2>
        <p className="text-slate-500 mt-1">Criação de documento oficial com auxílio de Inteligência Artificial.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Assunto *</span>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3"
                  placeholder="Ex: Reajuste de cronograma de auditoria"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Contexto / Detalhes (Opcional)</span>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3 h-24"
                  placeholder="Adicione informações que ajudem a IA a redigir o texto..."
                />
              </label>
              <button
                onClick={handleAIDraft}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                {isGenerating ? 'Gerando Rascunho...' : 'Gerar Rascunho com IA'}
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Tipo</span>
                  <select className="mt-2 block w-full rounded-xl border-slate-200 text-sm py-3">
                    <option>Interno</option>
                    <option>Externo</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Prazo</span>
                  <input type="date" className="mt-2 block w-full rounded-xl border-slate-200 text-sm py-3" />
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Destinatário</span>
                <input type="text" className="mt-2 block w-full rounded-xl border-slate-200 text-sm py-3" placeholder="Setor ou Nome" />
              </label>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <label className="block">
              <span className="text-sm font-bold text-slate-700 uppercase tracking-widest block mb-4">Conteúdo do Documento</span>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="block w-full rounded-2xl border-slate-200 focus:border-primary focus:ring-primary/20 text-base py-6 px-6 h-96 font-serif bg-slate-50 shadow-inner"
                placeholder="O texto oficial aparecerá aqui..."
              />
            </label>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button className="text-slate-400 font-bold text-xs uppercase hover:text-primary transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">delete</span>
            Descartar Rascunho
          </button>
          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs uppercase hover:bg-slate-50 transition-all">
              Salvar Rascunho
            </button>
            <button className="px-8 py-3 rounded-xl bg-primary text-white font-black text-xs uppercase shadow-lg shadow-primary/20 hover:bg-red-700 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">verified</span>
              Protocolar Memorando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoForm;
