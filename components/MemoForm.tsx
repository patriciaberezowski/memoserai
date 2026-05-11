import React, { useState, useEffect, useRef } from 'react';
import { Memo, AppView, AppViewAlias, MemoHistoryEntry } from '../types';

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

  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  
  const [localHistory, setLocalHistory] = useState<MemoHistoryEntry[]>(initialData?.history || []);
  const initialContentRef = useRef(initialData?.content || initialData?.body || '');

  const logAction = (actionDesc: string) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLocalHistory(prev => [{
      id: crypto.randomUUID(),
      action: actionDesc,
      date: dateStr,
      time: timeStr,
      userName: 'Patrícia Berezowski',
      userRole: 'Diretora de Comunicação'
    }, ...prev]);
  };

  useEffect(() => {
    if (!isEdit && localHistory.length === 0) {
      logAction('Documento rascunho criado');
    }
  }, [isEdit, localHistory.length]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) {
      return alert('O texto do memorando não pode estar vazio.');
    }
    // Update mock history immediately before saving
    logAction('Alterações manuais salvas no sistema');

    console.log('Memorando Interno Salvo:', {
      date, recipient, recipientName, recipientRole, subject, deadline, responsibleArea, signer, category, content, attachments, history: localHistory
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
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="block mb-4">
              <span className="text-sm font-bold text-slate-700 uppercase tracking-widest block mb-1">Anexos (Opcional)</span>
              <p className="text-xs text-slate-500 mb-2">Adicione planilhas, PDFs, imagens ou arquivos complementares ao memorando.</p>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <label className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-6 rounded-xl cursor-pointer transition-colors border border-slate-200 border-dashed w-full md:w-auto shrink-0">
                  <span className="material-symbols-outlined text-xl">attach_file</span>
                  <span className="text-sm font-bold">Selecionar Arquivos</span>
                  <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files) {
                        setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
                        logAction(`Fez upload de ${e.target.files.length} anexo(s)`);
                      }
                    }} 
                  />
                </label>
                <div className="flex-1 flex flex-wrap gap-2 text-sm overflow-hidden">
                  {attachments.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white border border-slate-200 pl-3 pr-2 py-1.5 rounded-lg shadow-sm">
                      <span className="material-symbols-outlined text-slate-400 text-[18px]">draft</span>
                      <span className="font-semibold text-slate-700 text-xs truncate max-w-[150px]">{file.name}</span>
                      <button 
                        type="button" 
                        onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-red-500 flex items-center"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  ))}
                  {attachments.length === 0 && <span className="text-slate-400 italic text-sm">Nenhum arquivo anexado</span>}
                </div>
              </div>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="block">
              <span className="text-sm font-bold text-slate-700 uppercase tracking-widest block mb-4">Corpo do Documento *</span>
              <textarea
                required
                disabled={isLocked}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={() => {
                  if (content !== initialContentRef.current) {
                    logAction('Modificou o texto base oficial do documento');
                    initialContentRef.current = content; // Update baseline tracking limit
                  }
                }}
                className="block w-full rounded-2xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-6 px-6 h-96 font-serif bg-slate-50 shadow-inner leading-relaxed disabled:opacity-70 disabled:bg-slate-100"
                placeholder="O texto oficial aparece aqui. Redija-o manualmente."
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

      {/* Controle de Edições */}
      <div className="mt-8 bg-transparent rounded-none border-t-2 border-slate-200/50 pt-8 mb-4">
          <div className="flex items-center gap-2 mb-6 px-2">
              <span className="material-symbols-outlined text-slate-500">history</span>
              <h3 className="font-bold text-slate-800 text-sm">Controle de Edições e Rastreabilidade</h3>
          </div>
          <div className="px-2">
              <div className="space-y-4">
                  {localHistory.map((entry) => (
                      <div key={entry.id} className="flex gap-4 items-start">
                          <div className="mt-0.5 shrink-0">
                              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm relative overflow-hidden">
                                  {entry.action.toLowerCase().includes('criado') && <span className="material-symbols-outlined text-[16px] text-green-600">note_add</span>}
                                  {entry.action.toLowerCase().includes('upload') && <span className="material-symbols-outlined text-[16px] text-blue-600">upload_file</span>}
                                  {entry.action.toLowerCase().includes('texto') && <span className="material-symbols-outlined text-[16px] text-purple-600">edit_note</span>}
                                  {!entry.action.toLowerCase().match(/criado|upload|texto/) && <span className="material-symbols-outlined text-[16px] text-slate-600">history_edu</span>}
                              </div>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="text-sm font-bold text-slate-800">{entry.action}</h4>
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">{entry.time}</span>
                              </div>
                              <p className="text-sm text-slate-600 leading-relaxed">
                                  Por <strong>{entry.userName}</strong>, {entry.userRole}, no dia {entry.date}.
                              </p>
                          </div>
                      </div>
                  ))}
                  {localHistory.length === 0 && (
                      <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-sm italic">
                          Ainda não há histórico associado.
                      </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};

export default MemoForm;
