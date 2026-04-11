import React, { useState, useEffect } from 'react';
import { generateMemoDraft } from '../services/geminiService';
import { Memo, AppView, AppViewAlias } from '../types';

interface MemoFormProps {
  initialData?: Memo | null;
  isEdit?: boolean;
  setView?: (view: AppView) => void;
}

const formatDateForInput = (dateStr?: string) => {
  if (!dateStr) return '';
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/');
    if (day && month && year) {
      return `${year}-${month}-${day}`;
    }
  }
  return dateStr;
};

const MemoForm: React.FC<MemoFormProps> = ({ initialData, isEdit = false, setView }) => {
  // Basic Details
  const [date, setDate] = useState('');
  const [recipient, setRecipient] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientRole, setRecipientRole] = useState('');
  const [subject, setSubject] = useState('');
  const [deadline, setDeadline] = useState('');

  // Internal details
  const [responsibleArea, setResponsibleArea] = useState('');
  const [signer, setSigner] = useState('');
  const [category, setCategory] = useState<'Informativo' | 'Demanda'>('Informativo');
  const [linkedMemo, setLinkedMemo] = useState('');
  const [status, setStatus] = useState('PENDENTE');

  const isLocked = isEdit && !!initialData?.hasSignedPdf;

  // Generated / Manual content
  const [details, setDetails] = useState('');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isEdit && initialData) {
      setDate(formatDateForInput(initialData.date) || '');
      setRecipient(initialData.recipient || '');
      setRecipientName(initialData.recipientName || '');
      setRecipientRole(initialData.recipientRole || '');
      setSubject(initialData.subject || '');
      setDeadline(formatDateForInput(initialData.deadline) || '');
      setResponsibleArea(initialData.responsibleArea || '');
      setSigner(initialData.signer || '');
      setCategory(initialData.category || 'Informativo');
      setLinkedMemo(initialData.linkedMemo || '');
      setStatus(initialData.status || 'PENDENTE');
      setContent(initialData.content || initialData.body || '');
    }
  }, [isEdit, initialData]);

  const handleAIDraft = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!subject) return alert('Por favor, informe primeiro o assunto, remetente e destinatário para gerar um bom rascunho.');
    setIsGenerating(true);
    try {
      const contextToSend = `De: ${responsibleArea} (${signer}). Para: ${recipientName} (${recipientRole} - ${recipient}). Detalhes: ${details}`;
      const draft = await generateMemoDraft(subject, contextToSend);
      setContent(draft);
    } catch (error: any) {
      alert(`Falha na IA: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) {
      return alert('O texto do memorando não pode estar vazio.');
    }
    console.log('Memorando Interno Salvo:', {
      date, recipient, recipientName, recipientRole, subject, deadline, responsibleArea, signer, category, content
    });
    alert(isEdit ? 'Rascunho atualizado!' : 'Memorando Interno Criado com Sucesso!');
    if (setView) setView(AppViewAlias.INTERNAL_MEMOS);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {isEdit ? 'Editar Memorando' : 'Novo Memorando'}
          </h2>
          <p className="text-slate-500 mt-1">Criação de documento oficial interno.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Numeração Oficial</p>
          <p className="text-slate-900 font-bold bg-slate-200 px-4 py-1.5 rounded-lg inline-block mt-1">
            {isEdit && initialData?.processNumber ? initialData.processNumber : 'Gerado Após Download'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-8 space-y-8">

          {/* Header configs */}
          <div className="flex flex-col gap-6 pb-8 border-b border-slate-100">

            {isLocked && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-amber-800 text-sm font-medium mb-2">
                <span className="material-symbols-outlined">lock</span>
                Este memorando possui um arquivo assinado anexado. Suas informações base foram trancadas para garantir integridade. Apenas o Status pode ser alterado.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <label className="block">
                <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Data de Emissão *</span>
                <input type="date" disabled={isLocked} required value={date} onChange={e => setDate(e.target.value)} className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3 disabled:bg-slate-100 disabled:opacity-70" />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Tipo *</span>
                <select disabled={isLocked} value={category} onChange={e => setCategory(e.target.value as 'Informativo' | 'Demanda')} className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3 disabled:bg-slate-100 disabled:opacity-70">
                  <option value="Informativo">Informativo</option>
                  <option value="Demanda">Demanda</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Prazo para Resposta</span>
                <input type="date" disabled={isLocked} value={deadline} onChange={e => setDeadline(e.target.value)} className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3 disabled:bg-slate-100 disabled:opacity-70" />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Memo Vinculado</span>
                <input type="text" disabled={isLocked} value={linkedMemo} onChange={e => setLinkedMemo(e.target.value)} placeholder="Ex: 042/2026" className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3 disabled:bg-slate-100 disabled:opacity-70" />
              </label>
            </div>

            {isEdit && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
                <label className="block">
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-widest text-primary">Status Atual</span>
                  <select value={status} onChange={e => setStatus(e.target.value)} className="mt-2 block w-full rounded-xl border-primary focus:border-primary focus:ring-primary/20 text-sm py-3 bg-primary/5">
                    <option value="PENDENTE">Pendente</option>
                    <option value="CONCLUIDO">Concluído</option>
                    <option value="ARQUIVADO">Arquivado</option>
                  </select>
                </label>
              </div>
            )}
          </div>

          {/* From and To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-slate-100">
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-lg">person</span> Remetente (Origem)</h3>
              <label className="block">
                <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Área Responsável (SERAI) *</span>
                <select disabled={isLocked} required value={responsibleArea} onChange={e => setResponsibleArea(e.target.value)} className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3 disabled:bg-slate-100 disabled:opacity-70">
                  <option value="" disabled>Selecione a área</option>
                  <option value="ASCOM">ASCOM</option>
                  <option value="Gabinete">Gabinete</option>
                  <option value="Administrativo">Administrativo</option>
                  <option value="Formalização">Formalização</option>
                  <option value="Captação">Captação</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Assinante *</span>
                <input type="text" disabled={isLocked} required value={signer} onChange={e => setSigner(e.target.value)} placeholder="Nome de quem assina" className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3 disabled:bg-slate-100 disabled:opacity-70" />
              </label>
            </div>
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-lg">send</span> Destinatário (Destino)</h3>
              <label className="block">
                <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Secretaria / Autarquia *</span>
                <select disabled={isLocked} required value={recipient} onChange={e => setRecipient(e.target.value)} className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3 disabled:bg-slate-100 disabled:opacity-70">
                  <option value="" disabled>Selecione a pasta</option>
                  <option value="Secretaria de Comunicação">Secretaria de Comunicação</option>
                  <option value="Codemar">Codemar</option>
                  <option value="AMAR">AMAR</option>
                  <option value="Secretaria de Turismo">Secretaria de Turismo</option>
                  <option value="Secom">Secom</option>
                </select>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">A/C (Nome) *</span>
                  <input type="text" disabled={isLocked} required value={recipientName} onChange={e => setRecipientName(e.target.value)} className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3 disabled:bg-slate-100 disabled:opacity-70" placeholder="Ex: João Silva" />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Cargo *</span>
                  <input type="text" disabled={isLocked} required value={recipientRole} onChange={e => setRecipientRole(e.target.value)} className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3 disabled:bg-slate-100 disabled:opacity-70" placeholder="Ex: Secretário" />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Assunto *</span>
              <input
                type="text"
                disabled={isLocked}
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3 disabled:bg-slate-100 disabled:opacity-70"
                placeholder="Resumo claro do memorando"
              />
            </label>
            {!isLocked && (
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex flex-col gap-4">
                <label className="block">
                  <span className="text-sm font-bold text-primary uppercase tracking-widest">Gerador com IA - Detalhes (Opcional)</span>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="mt-2 block w-full !bg-white rounded-xl border-primary/20 focus:border-primary focus:ring-primary/20 text-sm py-3 h-20"
                    placeholder="Adicione o contexto para a inteligência artificial formular o texto base oficial..."
                  />
                </label>
                <button
                  type="button"
                  onClick={handleAIDraft}
                  disabled={isGenerating}
                  className="self-end flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 px-6 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  {isGenerating ? 'Escrevendo...' : 'Gerar Texto'}
                </button>
              </div>
            )}
          </div>

          <div className="pt-4">
            <label className="block">
              <span className="text-sm font-bold text-slate-700 uppercase tracking-widest block mb-4">Corpo do Documento *</span>
              <textarea
                required
                disabled={isLocked}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="block w-full rounded-2xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-6 px-6 h-96 font-serif bg-slate-50 shadow-inner leading-relaxed disabled:opacity-70 disabled:bg-slate-100"
                placeholder="O texto oficial aparece aqui. Você pode redigi-lo manualmente ou usar o Gerador com IA acima."
              />
            </label>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button type="button" onClick={() => setView && setView(AppViewAlias.INTERNAL_MEMOS)} className="text-slate-400 font-bold text-xs uppercase hover:text-slate-700 transition-all">
            Cancelar
          </button>
          <button type="submit" className="px-8 py-3 rounded-xl bg-primary text-white font-black text-xs uppercase shadow-lg shadow-primary/20 hover:bg-red-700 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">save</span>
            {isEdit ? 'Salvar Rascunho' : 'Criar Memorando'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemoForm;
