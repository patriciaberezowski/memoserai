import React, { useState, useEffect } from 'react';
import { Memo, AppView, AppViewAlias, MemoHistoryEntry } from '../types';

interface ExternalMemoFormProps {
    initialData?: Memo | null;
    isEdit?: boolean;
    setView?: (view: AppView) => void;
}

const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        if (day && month && year) {
            return `${year}-${month}-${day}`;
        }
    }
    return dateStr;
};

const ExternalMemoForm: React.FC<ExternalMemoFormProps> = ({ initialData, isEdit = false, setView }) => {
    const [number, setNumber] = useState('');
    const [date, setDate] = useState('');
    const [sender, setSender] = useState('');
    const [recipient, setRecipient] = useState('');
    const [subject, setSubject] = useState('');
    const [deadline, setDeadline] = useState('');
    const [receiptDate, setReceiptDate] = useState('');
    const [receiptTime, setReceiptTime] = useState(initialData?.receiptTime || '');
    const [receiverName, setReceiverName] = useState(initialData?.receiverName || '');
    const [needsReply, setNeedsReply] = useState(initialData?.needsReply || false);
    const [internalDeadline, setInternalDeadline] = useState(formatDateForInput(initialData?.internalDeadline || '') || '');
    const [responsibleUsers, setResponsibleUsers] = useState<string[]>(initialData?.responsibleUsers || []);
    const [newResponsible, setNewResponsible] = useState('');
    const [linkedMemo, setLinkedMemo] = useState('');
    const [status, setStatus] = useState(initialData?.status || 'PENDENTE');
    const [file, setFile] = useState<File | null>(null);
    const [attachments, setAttachments] = useState<File[]>([]);

    const [localHistory, setLocalHistory] = useState<MemoHistoryEntry[]>(initialData?.history || []);

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
            logAction('Documento importado (Rascunho criado)');
        }
    }, [isEdit, localHistory.length]);

    useEffect(() => {
        if (isEdit && initialData) {
            setNumber(initialData.processNumber || '');
            setDate(formatDateForInput(initialData.date) || '');
            setSender(initialData.sender || '');
            setRecipient(initialData.recipient || '');
            setSubject(initialData.subject || '');
            setDeadline(formatDateForInput(initialData.deadline) || '');
            setReceiptDate(formatDateForInput(initialData.receiptDate || '') || '');
            setReceiptTime(initialData.receiptTime || '');
            setReceiverName(initialData.receiverName || '');
            setNeedsReply(initialData.needsReply || false);
            setInternalDeadline(formatDateForInput(initialData.internalDeadline || '') || '');
            setResponsibleUsers(initialData.responsibleUsers || []);
            setLinkedMemo(initialData.linkedMemo || '');
            setStatus(initialData.status || 'PENDENTE');
        }
    }, [isEdit, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && initialData) {
            // Persist the file locally by mutating the mock object in memory.
            if (file) {
                initialData.hasSignedPdf = true;
                initialData.fileName = file.name;
                initialData.fileUrl = URL.createObjectURL(file);
            }
            // To be thorough, we can also mutate other fields
            initialData.processNumber = number;
            initialData.sender = sender;
            initialData.recipient = recipient;
            initialData.subject = subject;
            initialData.receiptDate = receiptDate;
            initialData.receiptTime = receiptTime;
            initialData.receiverName = receiverName;
            initialData.needsReply = needsReply;
            initialData.internalDeadline = internalDeadline;
            initialData.responsibleUsers = responsibleUsers;
            initialData.status = status;
            initialData.attachments = attachments.map(f => ({ name: f.name }));
            initialData.history = localHistory;
        }

        logAction('Alterações manuais salvas no sistema');

        alert(isEdit ? 'Alterações salvas com sucesso!' : 'Memorando Externo Registrado!');
        if (setView) setView(AppViewAlias.EXTERNAL_MEMOS);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500 font-sans">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{isEdit ? 'Edição de Memorando Externo' : 'Registro de Memorando Externo'}</h2>
                <p className="text-slate-500 mt-1">Cadastro de documentos oficiais recebidos de outras secretarias ou autarquias.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <form onSubmit={handleSubmit}>
                    <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Coluna 1 */}
                            <div className="space-y-6">
                                <label className="block">
                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Número do Memorando Recebido *</span>
                                    <input
                                        type="text"
                                        required
                                        value={number}
                                        onChange={(e) => setNumber(e.target.value)}
                                        className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3"
                                        placeholder="Ex: 003/2026"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Data de Assinatura *</span>
                                    <input
                                        type="date"
                                        required
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3"
                                    />
                                </label>

                                <div className="grid grid-cols-2 gap-4">
                                    <label className="block">
                                        <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Data Rec. *</span>
                                        <input
                                            type="date"
                                            required
                                            value={receiptDate}
                                            onChange={(e) => setReceiptDate(e.target.value)}
                                            className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Hora Rec. *</span>
                                        <input
                                            type="time"
                                            required
                                            value={receiptTime}
                                            onChange={(e) => setReceiptTime(e.target.value)}
                                            className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3"
                                        />
                                    </label>
                                </div>

                                <label className="block">
                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Recebido por *</span>
                                    <input
                                        type="text"
                                        required
                                        value={receiverName}
                                        onChange={(e) => setReceiverName(e.target.value)}
                                        className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3"
                                        placeholder="Nome de quem recebeu o documento"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Secretaria/Autarquia Emissora *</span>
                                    <select
                                        required
                                        value={sender}
                                        onChange={(e) => setSender(e.target.value)}
                                        className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3"
                                    >
                                        <option value="" disabled>Selecione a origem</option>
                                        <option value="SECOM">SECOM - Secretaria de Comunicação</option>
                                        <option value="CODEMAR">CODEMAR - Companhia de Desenvolvimento de Maricá</option>
                                        <option value="SEC_EDUC">Secretaria de Educação</option>
                                    </select>
                                </label>

                                <label className="block">
                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Vinculado a outro memorando? (Opcional)</span>
                                    <input
                                        type="text"
                                        value={linkedMemo}
                                        onChange={(e) => setLinkedMemo(e.target.value)}
                                        className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3"
                                        placeholder="Digite o NNN/AAAA se for uma resposta a outro documento"
                                    />
                                </label>

                                {isEdit && (
                                    <label className="block">
                                        <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Status Atual</span>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value as any)}
                                            className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3 font-bold bg-slate-50"
                                        >
                                            <option value="PENDENTE">Pendente</option>
                                            <option value="RESPONDIDO">Respondido</option>
                                            <option value="VENCIDO">Vencido</option>
                                            <option value="RESOLVIDO">Resolvido</option>
                                        </select>
                                    </label>
                                )}
                            </div>

                            {/* Coluna 2 */}
                            <div className="space-y-6">
                                <label className="block">
                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Assunto *</span>
                                    <input
                                        type="text"
                                        required
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3"
                                        placeholder="Resumo objetivo da demanda"
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Destinatário Interno (Área) *</span>
                                    <select
                                        required
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value)}
                                        className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3"
                                    >
                                        <option value="" disabled>Selecione a área na SERAI</option>
                                        <option value="ASCOM">ASCOM</option>
                                        <option value="GABINETE">Gabinete</option>
                                        <option value="ADMINISTRATIVO">Administrativo</option>
                                        <option value="JURIDICO">Jurídico</option>
                                        <option value="FORMALIZACAO">Formalização</option>
                                        <option value="CAPTACAO">Captação</option>
                                    </select>
                                </label>

                                <label className="block">
                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-2 block">Responsável(is) pelo Tratamento</span>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={newResponsible}
                                            onChange={(e) => setNewResponsible(e.target.value)}
                                            className="flex-1 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3"
                                            placeholder="Nome do servidor responsável"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (newResponsible.trim()) {
                                                        setResponsibleUsers(prev => [...prev, newResponsible.trim()]);
                                                        setNewResponsible('');
                                                    }
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (newResponsible.trim()) {
                                                    setResponsibleUsers(prev => [...prev, newResponsible.trim()]);
                                                    setNewResponsible('');
                                                }
                                            }}
                                            className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">add</span>
                                        </button>
                                    </div>
                                    {responsibleUsers.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {responsibleUsers.map((user, idx) => (
                                                <div key={idx} className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-semibold">
                                                    {user}
                                                    <button type="button" onClick={() => setResponsibleUsers(prev => prev.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-500 flex items-center">
                                                        <span className="material-symbols-outlined text-[16px]">close</span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </label>

                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={needsReply}
                                            onChange={(e) => setNeedsReply(e.target.checked)}
                                            className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm font-bold text-slate-800">Este documento exige resposta?</span>
                                    </label>

                                    {needsReply && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                                            <label className="block">
                                                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Prazo Interno *</span>
                                                <input
                                                    type="date"
                                                    required={needsReply}
                                                    value={internalDeadline}
                                                    onChange={(e) => setInternalDeadline(e.target.value)}
                                                    className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-2.5"
                                                />
                                            </label>
                                            <label className="block">
                                                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Prazo Resposta *</span>
                                                <input
                                                    type="date"
                                                    required={needsReply}
                                                    value={deadline}
                                                    onChange={(e) => setDeadline(e.target.value)}
                                                    className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-2.5"
                                                />
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100">
                            {isEdit && initialData?.hasSignedPdf && (
                                <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-red-100 p-2 rounded-lg">
                                            <span className="material-symbols-outlined text-red-600">picture_as_pdf</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{initialData.fileName || 'Memorando_Assinado.pdf'}</p>
                                            <p className="text-xs text-slate-500">Enviado anteriormente</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (initialData.fileUrl) {
                                                const a = document.createElement('a');
                                                a.href = initialData.fileUrl;
                                                a.download = initialData.fileName || 'download.pdf';
                                                document.body.appendChild(a);
                                                a.click();
                                                document.body.removeChild(a);
                                            } else {
                                                alert('Este é um arquivo de teste e não possui um conteúdo real para download.');
                                            }
                                        }}
                                        className="text-sm font-bold text-primary hover:text-red-700 flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 transition-colors rounded-lg"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">download</span>
                                        Baixar Arquivo
                                    </button>
                                </div>
                            )}

                            <label className="block">
                                <span className="text-sm font-bold text-slate-700 uppercase tracking-widest block mb-4">{isEdit ? 'Substituir Arquivo PDF (Opcional)' : 'Upload do Arquivo (PDF Assinado) *'}</span>
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="pdf-upload" className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                            {file ? (
                                                <>
                                                    <span className="material-symbols-outlined text-4xl text-green-500 mb-2">check_circle</span>
                                                    <p className="mb-1 text-sm text-slate-700 font-semibold">{file.name}</p>
                                                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB - Clique para trocar</p>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">picture_as_pdf</span>
                                                    <p className="mb-1 text-sm text-slate-500"><span className="font-semibold">{isEdit ? 'Clique para anexar um novo PDF' : 'Clique para anexar o PDF'}</span> ou arraste e solte</p>
                                                    <p className="text-xs text-slate-400">Somente arquivos .PDF até 10MB</p>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            id="pdf-upload"
                                            type="file"
                                            className="hidden"
                                            accept="application/pdf"
                                            required={!isEdit && !file}
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        />
                                    </label>
                                </div>
                            </label>
                        </div>

                        <div className="pt-8 border-t border-slate-100">
                            <label className="block mb-4">
                                <span className="text-sm font-bold text-slate-700 uppercase tracking-widest block mb-1">Anexos Adicionais (Opcional)</span>
                                <p className="text-xs text-slate-500 mb-2">Adicione planilhas, imagens ou outros arquivos complementares.</p>
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
                                                    logAction(`Fez upload de ${e.target.files.length} anexo(s) extra(s)`);
                                                }
                                            }} 
                                        />
                                    </label>
                                    <div className="flex-1 flex flex-wrap gap-2 text-sm overflow-hidden">
                                        {attachments.map((fileObj, i) => (
                                            <div key={i} className="flex items-center gap-2 bg-white border border-slate-200 pl-3 pr-2 py-1.5 rounded-lg shadow-sm">
                                                <span className="material-symbols-outlined text-slate-400 text-[18px]">draft</span>
                                                <span className="font-semibold text-slate-700 text-xs truncate max-w-[150px]">{fileObj.name}</span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                                    className="text-slate-400 hover:text-red-500 flex items-center"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                                </button>
                                            </div>
                                        ))}
                                        {attachments.length === 0 && <span className="text-slate-400 italic text-sm">Nenhum arquivo extra</span>}
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4">
                        <button type="button" onClick={() => setView && setView(AppViewAlias.EXTERNAL_MEMOS)} className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs uppercase hover:bg-slate-100 transition-all">
                            Cancelar
                        </button>
                        <button type="submit" className="px-8 py-3 rounded-xl bg-primary text-white font-black text-xs uppercase shadow-lg shadow-primary/20 hover:bg-red-700 transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">save</span>
                            {isEdit ? 'Salvar Alterações' : 'Cadastrar Memorando Recebido'}
                        </button>
                    </div>
                </form>
            </div>

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

export default ExternalMemoForm;
