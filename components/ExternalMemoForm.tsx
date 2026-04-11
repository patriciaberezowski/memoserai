import React, { useState, useEffect } from 'react';
import { Memo, AppView, AppViewAlias } from '../types';

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
    const [linkedMemo, setLinkedMemo] = useState('');
    const [status, setStatus] = useState(initialData?.status || 'PENDENTE');
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (isEdit && initialData) {
            setNumber(initialData.processNumber || '');
            setDate(formatDateForInput(initialData.date) || '');
            setSender(initialData.sender || '');
            setRecipient(initialData.recipient || '');
            setSubject(initialData.subject || '');
            setDeadline(formatDateForInput(initialData.deadline) || '');
            setReceiptDate(formatDateForInput(initialData.receiptDate || '') || '');
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
            initialData.status = status;
        }

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

                                <label className="block">
                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Data de Recebimento *</span>
                                    <input
                                        type="date"
                                        required
                                        value={receiptDate}
                                        onChange={(e) => setReceiptDate(e.target.value)}
                                        className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3"
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
                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Prazo para Resposta *</span>
                                    <input
                                        type="date"
                                        required
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3"
                                    />
                                </label>
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
        </div>
    );
};

export default ExternalMemoForm;
