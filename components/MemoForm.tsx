import React, { useState, useEffect, useRef } from 'react';
import { Memo, AppView, AppViewAlias, MemoHistoryEntry } from '../types';
import { INITIAL_SECRETARIAS } from './mockSecretarias';
import { INITIAL_AUTARQUIAS, INITIAL_USUARIOS, INITIAL_AREAS } from './mockData';
import { saveMemo } from '../services/memoRepository';

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
  const [destinos, setDestinos] = useState<{tipo: 'Secretaria' | 'Autarquia', orgao: string, nome: string, cargo: string}[]>([{ tipo: 'Secretaria', orgao: '', nome: '', cargo: '' }]);
  
  const [subject, setSubject] = useState('');
  const [deadline, setDeadline] = useState('');

  // Internal details
  const [responsibleArea, setResponsibleArea] = useState('');
  const [signer, setSigner] = useState('');
  const [category, setCategory] = useState<'Informativo' | 'Demanda'>('Informativo');
  const [linkedMemo, setLinkedMemo] = useState('');
  const [status, setStatus] = useState('PENDENTE');
  const isLocked = isEdit && (!!initialData?.hasSignedPdf || !!initialData?.processNumber || ['BAIXADO', 'DOWNLOAD', 'ASSINADO'].includes(initialData?.status?.toUpperCase?.() || ''));

  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
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
      
      if (initialData.destinos && initialData.destinos.length > 0) {
        setDestinos(initialData.destinos);
      } else if (initialData.recipient) {
        setDestinos([{
          tipo: 'Secretaria', // fallback
          orgao: initialData.recipient,
          nome: initialData.recipientName || '',
          cargo: initialData.recipientRole || ''
        }]);
      }
      
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) {
      return alert('O texto do memorando não pode estar vazio.');
    }
    
    // Validar se há ao menos um destino preenchido
    const invalidDestino = destinos.some(d => !d.orgao || !d.nome || !d.cargo);
    if (invalidDestino) {
      return alert('Por favor, preencha todos os campos obrigatórios dos destinatários.');
    }

    logAction('Alterações manuais salvas no sistema');

    // Create legacy fields for backward compatibility
    const legacyRecipient = destinos.map(d => d.orgao).join(', ');
    const legacyRecipientName = destinos.map(d => d.nome).join(', ');
    const legacyRecipientRole = destinos.map(d => d.cargo).join(', ');

    const formatDate = (d: string) => d ? d.split('-').reverse().join('/') : '';

    const newMemo: Memo = {
      id: isEdit && initialData ? initialData.id : Math.random().toString(36).substr(2, 9),
      processNumber: isEdit && initialData ? initialData.processNumber : '',
      date: formatDate(date),
      destinos,
      recipient: legacyRecipient,
      recipientName: legacyRecipientName,
      recipientRole: legacyRecipientRole,
      subject,
      deadline: formatDate(deadline),
      sender: responsibleArea,
      responsibleArea,
      signer,
      category,
      content,
      attachments: attachments.map(file => ({ name: file.name })),
      history: localHistory,
      type: 'INTERNO',
      status: status || 'PENDENTE',
      institution: 'SERAI',
      year: new Date().getFullYear().toString()
    };

    try {
      setIsSaving(true);
      await saveMemo(newMemo);
      alert(isEdit ? 'Rascunho atualizado no Supabase!' : 'Memorando Interno criado e salvo no Supabase!');
      if (setView) setView(AppViewAlias.INTERNAL_MEMOS);
    } catch (error) {
      console.error('Erro ao salvar memorando interno:', error);
      alert('Não foi possível salvar o memorando no Supabase. Verifique o login e tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddDestino = () => {
    setDestinos([...destinos, { tipo: 'Secretaria', orgao: '', nome: '', cargo: '' }]);
  };

  const handleRemoveDestino = (index: number) => {
    if (destinos.length > 1) {
      const newDestinos = [...destinos];
      newDestinos.splice(index, 1);
      setDestinos(newDestinos);
    }
  };

  const updateDestino = (index: number, field: keyof typeof destinos[0], value: string) => {
    const newDestinos = [...destinos];
    newDestinos[index] = { ...newDestinos[index], [field]: value };
    // Se mudou o tipo, limpa o orgão
    if (field === 'tipo') {
      newDestinos[index].orgao = '';
    }
    setDestinos(newDestinos);
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

            {isEdit && isLocked && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
                <label className="block">
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-widest text-primary">Status Atual</span>
                  <select value={status} onChange={e => setStatus(e.target.value)} className="mt-2 block w-full rounded-xl border-primary focus:border-primary focus:ring-primary/20 text-sm py-3 bg-primary/5">
                    <option value="PENDENTE">Pendente</option>
                    <option value="VENCIDO">Vencido</option>
                    <option value="RESOLVIDO">Resolvido</option>
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
                  {INITIAL_AREAS.map(area => (
                      <option key={area.id} value={area.nome}>{area.nome}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Assinante *</span>
                <select disabled={isLocked} required value={signer} onChange={e => setSigner(e.target.value)} className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3 disabled:bg-slate-100 disabled:opacity-70">
                  <option value="" disabled>Selecione o assinante</option>
                  {INITIAL_USUARIOS.filter(u => u.isSignatario).map(u => (
                    <option key={u.id} value={u.nomeCompleto}>{u.nomeCompleto} - {u.cargo}</option>
                  ))}
                </select>
              </label>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">send</span> Destinatários
                  </h3>
                  {!isLocked && (
                      <button 
                          type="button" 
                          onClick={handleAddDestino}
                          className="text-xs font-bold text-primary flex items-center gap-1 hover:text-red-800 transition-colors bg-red-50 px-3 py-1.5 rounded-lg"
                      >
                          <span className="material-symbols-outlined text-[14px]">add</span> Adicionar Destinatário
                      </button>
                  )}
              </div>

              {destinos.map((destino, index) => (
                  <div key={index} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4 relative">
                      {destinos.length > 1 && !isLocked && (
                          <button 
                              type="button" 
                              onClick={() => handleRemoveDestino(index)}
                              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                              <span className="material-symbols-outlined text-[18px]">close</span>
                          </button>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className="block md:col-span-2">
                              <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Tipo de Destino *</span>
                              <select 
                                  disabled={isLocked} 
                                  value={destino.tipo} 
                                  onChange={e => updateDestino(index, 'tipo', e.target.value as 'Secretaria' | 'Autarquia')} 
                                  className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-2.5 disabled:bg-slate-100 disabled:opacity-70 bg-white"
                              >
                                  <option value="Secretaria">Secretaria</option>
                                  <option value="Autarquia">Autarquia</option>
                              </select>
                          </label>

                          <label className="block md:col-span-2">
                              <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">{destino.tipo} Destinatária *</span>
                              <select 
                                  disabled={isLocked} 
                                  required 
                                  value={destino.orgao} 
                                  onChange={e => updateDestino(index, 'orgao', e.target.value)} 
                                  className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-2.5 disabled:bg-slate-100 disabled:opacity-70 bg-white"
                              >
                                  <option value="" disabled>Selecione a {destino.tipo.toLowerCase()}</option>
                                  {destino.tipo === 'Secretaria' 
                                      ? INITIAL_SECRETARIAS.map(s => <option key={s.id} value={s.pasta}>{s.pasta}</option>)
                                      : INITIAL_AUTARQUIAS.map(a => <option key={a.id} value={a.nome}>{a.nome}</option>)
                                  }
                              </select>
                          </label>

                          <label className="block">
                              <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">A/C (Nome) *</span>
                              <input 
                                  type="text" 
                                  disabled={isLocked} 
                                  required 
                                  value={destino.nome} 
                                  onChange={e => updateDestino(index, 'nome', e.target.value)} 
                                  className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-2.5 disabled:bg-slate-100 disabled:opacity-70 bg-white" 
                                  placeholder="Ex: João Silva" 
                              />
                          </label>

                          <label className="block">
                              <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Cargo *</span>
                              <input 
                                  type="text" 
                                  disabled={isLocked} 
                                  required 
                                  value={destino.cargo} 
                                  onChange={e => updateDestino(index, 'cargo', e.target.value)} 
                                  className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-2.5 disabled:bg-slate-100 disabled:opacity-70 bg-white" 
                                  placeholder="Ex: Secretário" 
                              />
                          </label>
                      </div>
                  </div>
              ))}
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
          <button type="submit" disabled={isSaving} className="px-8 py-3 rounded-xl bg-primary text-white font-black text-xs uppercase shadow-lg shadow-primary/20 hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-60">
            <span className="material-symbols-outlined text-lg">save</span>
            {isSaving ? 'Salvando...' : isEdit ? 'Salvar Rascunho' : 'Criar Memorando'}
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
