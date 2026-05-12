import React, { useState, useEffect } from 'react';
import { Memo, AppView, AppViewAlias, MemoHistoryEntry } from '../types';
import { INITIAL_AREAS } from './mockData';
import { INITIAL_SECRETARIAS as mockSecretarias } from './mockSecretarias';
import { saveMemo } from '../services/memoRepository';

interface ExtraMemoFormProps {
    initialData?: Memo | null;
    isEdit?: boolean;
    setView?: (view: AppView) => void;
}

const mockAutarquias = [
    { id: '1', nome: 'Codemar' },
    { id: '2', nome: 'Sanemar' },
    { id: '3', nome: 'Somar' },
    { id: '4', nome: 'ICTIM' },
    { id: '5', nome: 'EPT' }
];

const ExtraMemoForm: React.FC<ExtraMemoFormProps> = ({ initialData, isEdit = false, setView }) => {
    const [processNumber, setProcessNumber] = useState('');
    const [date, setDate] = useState(''); // Data de Emissão
    const [signDate, setSignDate] = useState(''); // Data de Assinatura
    const [subject, setSubject] = useState('');
    const [typeField, setTypeField] = useState(''); // Tipo (Demanda, Informativo...)
    const [needsReply, setNeedsReply] = useState(false);
    const [deadline, setDeadline] = useState(''); // Prazo de Resposta
    const [linkedMemo, setLinkedMemo] = useState('');
    const [responsibleArea, setResponsibleArea] = useState(''); // Remetente
    const [signer, setSigner] = useState('');

    const [status, setStatus] = useState('PENDENTE');
    
    // Múltiplos Destinatários
    const [destinos, setDestinos] = useState<{ tipo: 'Secretaria' | 'Autarquia', orgao: string, nome: string, cargo: string }[]>([
        { tipo: 'Secretaria', orgao: '', nome: '', cargo: '' }
    ]);

    const [files, setFiles] = useState<{ name: string }[]>([]);
    const [attachments, setAttachments] = useState<{ name: string }[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    
    const [history, setHistory] = useState<MemoHistoryEntry[]>([]);

    useEffect(() => {
        if (initialData && isEdit) {
            setProcessNumber(initialData.processNumber || '');
            setDate(initialData.date ? initialData.date.split('/').reverse().join('-') : '');
            
            // We use 'receiptDate' field loosely to store signDate in legacy/extra types or just reuse fields. Let's assume custom fields map to these.
            setSignDate(''); // Custom fields for signDate and typeField may need mapping if persisting to a real DB, here we simulate
            setSubject(initialData.subject || '');
            setDeadline(initialData.deadline ? initialData.deadline.split('/').reverse().join('-') : '');
            setNeedsReply(!!initialData.deadline);
            setLinkedMemo(initialData.linkedMemo || '');
            setResponsibleArea(initialData.responsibleArea || '');
            setSigner(initialData.signer || '');
            setStatus(initialData.status || 'PENDENTE');
            
            if (initialData.destinos && initialData.destinos.length > 0) {
                setDestinos(initialData.destinos);
            } else if (initialData.recipient) {
                setDestinos([{
                    tipo: 'Secretaria',
                    orgao: initialData.recipient,
                    nome: initialData.recipientName || '',
                    cargo: initialData.recipientRole || ''
                }]);
            }
            
            if (initialData.fileName) {
                setFiles([{ name: initialData.fileName }]);
            }
            if (initialData.attachments) {
                setAttachments(initialData.attachments);
            }
            if (initialData.history) {
                setHistory(initialData.history);
            }
        }
    }, [initialData, isEdit]);

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

    const handleDestinoChange = (index: number, field: keyof typeof destinos[0], value: string) => {
        const newDestinos = [...destinos];
        newDestinos[index] = { ...newDestinos[index], [field]: value };
        
        // Auto-fill nome/cargo se for Secretaria e mudar o órgão
        if (field === 'orgao' && newDestinos[index].tipo === 'Secretaria') {
            const sec = mockSecretarias.find(s => s.pasta === value);
            if (sec) {
                newDestinos[index].nome = sec.responsavel;
                newDestinos[index].cargo = `${sec.isFemaleSecretary ? 'Secretária' : 'Secretário'} de ${sec.pasta}`;
            }
        }

        setDestinos(newDestinos);
    };

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>, isMainFile: boolean) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files) as File[];
        if (droppedFiles.length > 0) {
            if (isMainFile) {
                setFiles([{ name: droppedFiles[0].name }]);
            } else {
                setAttachments([...attachments, ...droppedFiles.map(f => ({ name: f.name }))]);
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isMainFile: boolean) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files) as File[];
            if (isMainFile) {
                setFiles([{ name: selectedFiles[0].name }]);
            } else {
                setAttachments([...attachments, ...selectedFiles.map(f => ({ name: f.name }))]);
            }
        }
    };

    const handleSave = async () => {
        if (!processNumber || !date || !subject || !responsibleArea) {
            alert('Por favor, preencha os campos obrigatórios: Número, Data, Remetente e Assunto.');
            return;
        }

        const now = new Date();
        const newHistoryEntry: MemoHistoryEntry = {
            id: Math.random().toString(36).substr(2, 9),
            action: isEdit ? 'Edição de Documento Extra' : 'Criação de Documento Extra',
            date: now.toLocaleDateString('pt-BR'),
            time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            userName: 'Patrícia Berezowski',
            userRole: 'Administrador'
        };

        const updatedHistory = [newHistoryEntry, ...history];
        setHistory(updatedHistory);

        const newMemo: Memo = {
            id: isEdit && initialData ? initialData.id : Math.random().toString(36).substr(2, 9),
            processNumber,
            date,
            sender: responsibleArea,
            recipient: destinos.map(d => d.orgao).join(', '),
            subject,
            deadline,
            responsibleArea,
            signer,
            status,
            destinos,
            history: updatedHistory,
            type: 'EXTRA',
            institution: 'SERAI',
            content: initialData?.content || '',
            linkedMemo,
            category: typeField as any,
            year: date.split('-')[0] || new Date().getFullYear().toString(),
            attachments: attachments.map(f => ({ name: f.name }))
        };

        if (files.length > 0) {
            newMemo.hasSignedPdf = true;
            newMemo.fileName = files[0].name;
            newMemo.fileUrl = '#';
        }

        try {
            setIsSaving(true);
            await saveMemo(newMemo);
            alert(`Memorando Extra ${isEdit ? 'atualizado' : 'registrado'} no Supabase!`);
            if (setView) {
                setView(AppViewAlias.EXTRA_MEMOS);
            }
        } catch (error) {
            console.error('Erro ao salvar memorando extra:', error);
            alert('Não foi possível salvar o memorando no Supabase. Verifique o login e tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500 font-sans pb-24">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        {isEdit ? 'Editar Memorando Extra' : 'Registrar Memorando Extra'}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Preencha os dados do documento físico ou digitalizado que deseja registrar no sistema.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setView && setView(AppViewAlias.EXTRA_MEMOS)}
                        className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-primary/20 disabled:opacity-60"
                    >
                        {isSaving ? 'Salvando...' : isEdit ? 'Atualizar Documento' : 'Registrar Documento'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">Informações do Documento</h3>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                                Número do Memorando <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={processNumber}
                                onChange={(e) => setProcessNumber(e.target.value)}
                                placeholder="Ex: 58A/2026/SERAI/PMM"
                                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 bg-slate-50 focus:bg-white font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tipo de Documento</label>
                            <input
                                type="text"
                                value={typeField}
                                onChange={(e) => setTypeField(e.target.value)}
                                placeholder="Ex: Informativo, Demanda..."
                                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 bg-slate-50 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Data de Emissão <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 bg-slate-50 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Data de Assinatura</label>
                            <input
                                type="date"
                                value={signDate}
                                onChange={(e) => setSignDate(e.target.value)}
                                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 bg-slate-50 focus:bg-white"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Assunto <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Descreva brevemente o assunto do documento..."
                                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 bg-slate-50 focus:bg-white"
                            />
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 my-8"></div>

                    {/* Origem e Remetente */}
                    <h3 className="text-sm font-bold text-slate-800 mb-4 border-l-4 border-primary pl-2">Origem</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Remetente (Área Interna) <span className="text-red-500">*</span></label>
                            <select
                                value={responsibleArea}
                                onChange={(e) => setResponsibleArea(e.target.value)}
                                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 bg-white"
                            >
                                <option value="">Selecione a Área de Origem</option>
                                {INITIAL_AREAS.map(area => (
                                    <option key={area.id} value={area.nome}>{area.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Assinante</label>
                            <input
                                type="text"
                                value={signer}
                                onChange={(e) => setSigner(e.target.value)}
                                placeholder="Nome de quem assinou o documento"
                                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 bg-white"
                            />
                        </div>
                    </div>

                    {/* Destinatários */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-800 border-l-4 border-indigo-500 pl-2">Destino(s)</h3>
                        <button 
                            onClick={handleAddDestino}
                            className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded hover:bg-indigo-100 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[16px]">add</span> Adicionar Destinatário
                        </button>
                    </div>

                    <div className="space-y-4 mb-6">
                        {destinos.map((destino, index) => (
                            <div key={index} className="relative bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                {destinos.length > 1 && (
                                    <button 
                                        onClick={() => handleRemoveDestino(index)}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 shadow-sm transition-colors z-10"
                                        title="Remover destinatário"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">close</span>
                                    </button>
                                )}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tipo de Órgão</label>
                                        <select
                                            value={destino.tipo}
                                            onChange={(e) => handleDestinoChange(index, 'tipo', e.target.value as 'Secretaria' | 'Autarquia')}
                                            className="w-full p-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white"
                                        >
                                            <option value="Secretaria">Secretaria</option>
                                            <option value="Autarquia">Autarquia</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Órgão de Destino</label>
                                        {destino.tipo === 'Secretaria' ? (
                                            <select
                                                value={destino.orgao}
                                                onChange={(e) => handleDestinoChange(index, 'orgao', e.target.value)}
                                                className="w-full p-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white"
                                            >
                                                <option value="">Selecione uma Secretaria</option>
                                                {mockSecretarias.map(s => (
                                                    <option key={s.id} value={s.pasta}>{s.pasta}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <select
                                                value={destino.orgao}
                                                onChange={(e) => handleDestinoChange(index, 'orgao', e.target.value)}
                                                className="w-full p-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white"
                                            >
                                                <option value="">Selecione uma Autarquia</option>
                                                {mockAutarquias.map(a => (
                                                    <option key={a.id} value={a.nome}>{a.nome}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">A/C (Nome)</label>
                                        <input
                                            type="text"
                                            value={destino.nome}
                                            onChange={(e) => handleDestinoChange(index, 'nome', e.target.value)}
                                            placeholder="Nome do responsável"
                                            className="w-full p-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cargo</label>
                                        <input
                                            type="text"
                                            value={destino.cargo}
                                            onChange={(e) => handleDestinoChange(index, 'cargo', e.target.value)}
                                            placeholder="Cargo do responsável"
                                            className="w-full p-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="h-px bg-slate-100 my-8"></div>

                    {/* Vínculos e Prazos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100 mb-6">
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={needsReply}
                                    onChange={(e) => {
                                        setNeedsReply(e.target.checked);
                                        if (!e.target.checked) setDeadline('');
                                    }}
                                    className="w-5 h-5 text-primary bg-white border-slate-300 rounded focus:ring-primary focus:ring-2"
                                />
                                <span className="text-sm font-bold text-slate-700">Requer resposta?</span>
                            </label>

                            {needsReply && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Prazo de Resposta</label>
                                    <input
                                        type="date"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 bg-white"
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Memorando Vinculado (Opcional)</label>
                            <input
                                type="text"
                                value={linkedMemo}
                                onChange={(e) => setLinkedMemo(e.target.value)}
                                placeholder="Ex: Memorando 045/2026"
                                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 bg-white"
                            />
                        </div>
                    </div>

                    {/* Status Global */}
                    <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 mb-6 flex flex-col md:flex-row md:items-center gap-4">
                        <label className="block text-sm font-bold text-yellow-800 uppercase shrink-0">Status Atual do Processo:</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full md:w-auto flex-1 p-2 border border-yellow-200 rounded-lg bg-white text-yellow-900 font-bold focus:ring-2 focus:ring-yellow-500/20 outline-none"
                        >
                            <option value="PENDENTE">Pendente</option>
                            <option value="RESPONDIDO">Respondido</option>
                            <option value="RESOLVIDO">Resolvido</option>
                        </select>
                    </div>

                    <div className="h-px bg-slate-100 my-8"></div>

                    {/* Arquivos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-3">PDF do Memorando <span className="text-red-500">*</span></label>
                            <div 
                                className={`border-2 border-dashed border-slate-300 rounded-xl p-6 text-center transition-colors ${files.length > 0 ? 'bg-indigo-50 border-indigo-300' : 'hover:bg-slate-50'}`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleFileDrop(e, true)}
                            >
                                <span className={`material-symbols-outlined text-4xl mb-2 block ${files.length > 0 ? 'text-indigo-500' : 'text-slate-400'}`}>
                                    {files.length > 0 ? 'picture_as_pdf' : 'cloud_upload'}
                                </span>
                                {files.length > 0 ? (
                                    <div className="text-sm font-medium text-slate-700">{files[0].name}</div>
                                ) : (
                                    <>
                                        <p className="text-sm text-slate-600 font-medium mb-1">Arraste o PDF principal aqui</p>
                                        <p className="text-xs text-slate-400 mb-4">ou clique para selecionar do computador</p>
                                    </>
                                )}
                                <label className="inline-block px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
                                    Escolher Arquivo Principal
                                    <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileSelect(e, true)} />
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Anexos (Opcional)</label>
                            <div 
                                className={`border-2 border-dashed border-slate-300 rounded-xl p-6 text-center transition-colors ${attachments.length > 0 ? 'bg-amber-50 border-amber-300' : 'hover:bg-slate-50'}`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleFileDrop(e, false)}
                            >
                                <span className={`material-symbols-outlined text-4xl mb-2 block ${attachments.length > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                                    attach_file
                                </span>
                                {attachments.length > 0 ? (
                                    <div className="text-sm font-medium text-slate-700 mb-4">
                                        {attachments.length} anexo(s) selecionado(s)
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm text-slate-600 font-medium mb-1">Arraste os arquivos anexos aqui</p>
                                        <p className="text-xs text-slate-400 mb-4">ou clique para selecionar</p>
                                    </>
                                )}
                                <label className="inline-block px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
                                    Adicionar Anexos
                                    <input type="file" className="hidden" multiple onChange={(e) => handleFileSelect(e, false)} />
                                </label>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Histórico de Edições */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-8">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400">history</span>
                        Histórico de Edições do Documento
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                            <tr>
                                <th className="px-4 py-3">Ação</th>
                                <th className="px-4 py-3">Data</th>
                                <th className="px-4 py-3">Hora</th>
                                <th className="px-4 py-3">Usuário</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {history.length > 0 ? (
                                history.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-xs font-medium text-slate-700">{entry.action}</td>
                                        <td className="px-4 py-3 text-xs text-slate-500">{entry.date}</td>
                                        <td className="px-4 py-3 text-xs text-slate-500">{entry.time}</td>
                                        <td className="px-4 py-3 text-xs text-slate-700 font-medium">
                                            {entry.userName} <span className="text-[10px] text-slate-400 font-normal">({entry.userRole})</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-xs text-slate-400">
                                        Nenhuma edição registrada neste documento.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default ExtraMemoForm;
