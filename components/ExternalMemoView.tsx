import React from 'react';
import { Memo, AppView, AppViewAlias } from '../types';

interface ExternalMemoViewProps {
    memo: Memo | null;
    setView: (view: AppView) => void;
    setSelectedMemo: (memo: Memo | null) => void;
}

const ExternalMemoView: React.FC<ExternalMemoViewProps> = ({ memo, setView, setSelectedMemo }) => {
    if (!memo) {
        return (
            <div className="p-8 flex flex-col items-center justify-center h-full text-center">
                <p className="text-slate-500">Nenhum memorando selecionado.</p>
                <button
                    onClick={() => setView(AppViewAlias.EXTERNAL_MEMOS)}
                    className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold"
                >
                    Voltar para Lista
                </button>
            </div>
        );
    }

    const handleEdit = () => {
        setView(AppViewAlias.EDIT_EXTERNAL_MEMO);
    };

    const handleDelete = () => {
        if (confirm('Tem certeza que deseja excluir este memorando?')) {
            alert('Memorando excluído com sucesso.');
            setSelectedMemo(null);
            setView(AppViewAlias.EXTERNAL_MEMOS);
        }
    };

    const handleStatusChange = () => {
        alert('Modal para troca rápida de status (Pendente, Respondido, Vencido, Resolvido)');
    };

    return (
        <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500 font-sans">

            {/* Header com botões de voltar e ações */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <button
                        onClick={() => { setSelectedMemo(null); setView(AppViewAlias.EXTERNAL_MEMOS); }}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-sm mb-4 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        Voltar para Lista
                    </button>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Detalhes do Memorando</h2>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <span className="text-red-600 hover:underline cursor-pointer">Home</span>
                        <span>/</span>
                        <span className="text-red-600 hover:underline cursor-pointer">Externos</span>
                        <span>/</span>
                        <span>{memo.processNumber}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleStatusChange}
                        className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold text-xs uppercase hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                        Trocar Status
                    </button>
                    <button
                        onClick={handleEdit}
                        className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold text-xs uppercase hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                        Editar
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2.5 rounded-lg bg-red-50 text-red-600 font-bold text-xs uppercase hover:bg-red-100 transition-all flex items-center gap-2 shadow-sm border border-red-100"
                    >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                        Excluir
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-8">
                <div className="p-8">

                    <div className="flex items-start justify-between border-b border-slate-100 pb-6 mb-6">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assunto</p>
                            <h3 className="text-xl font-bold text-slate-900">{memo.subject}</h3>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status Atual</p>
                            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-slate-100 text-slate-700">
                                {memo.status}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Número</p>
                            <p className="font-bold text-slate-900 text-lg">{memo.processNumber}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Data do Documento</p>
                            <p className="font-medium text-slate-700">{memo.date}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Data/Hora de Recebimento</p>
                            <p className="font-medium text-slate-700">
                                {memo.receiptDate ? `${memo.receiptDate} ${memo.receiptTime ? `às ${memo.receiptTime}` : ''}` : <span className="text-slate-400 italic">Não informada</span>}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Recebido por</p>
                            <p className="font-medium text-slate-700">
                                {memo.receiverName || <span className="text-slate-400 italic">Não informado</span>}
                            </p>
                        </div>
                        {memo.needsReply ? (
                            <>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Prazo Interno</p>
                                    <p className="font-medium text-slate-700 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px] text-slate-400">event</span>
                                        {memo.internalDeadline || <span className="text-slate-400 italic">Não definido</span>}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Prazo Resposta (Destino)</p>
                                    <p className="font-medium text-slate-700 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px] text-slate-400">event</span>
                                        {memo.deadline || <span className="text-slate-400 italic">Não definido</span>}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Prazos</p>
                                <p className="font-medium text-slate-400 italic">
                                    Não exige resposta
                                </p>
                            </div>
                        )}
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Secretaria Emissora</p>
                            <p className="font-medium text-slate-700 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-slate-400">business</span>
                                {memo.sender}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Destinatário Interno</p>
                            <p className="font-medium text-slate-700 mb-2">{memo.recipient}</p>
                            {memo.responsibleUsers && memo.responsibleUsers.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Responsáveis</p>
                                    <div className="flex flex-wrap gap-1">
                                        {memo.responsibleUsers.map((user, idx) => (
                                            <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-semibold">
                                                {user}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Memo Vinculado</p>
                            <p className="font-medium text-slate-700">
                                {memo.linkedMemo ? (
                                    <span className="text-primary hover:underline cursor-pointer">{memo.linkedMemo}</span>
                                ) : (
                                    <span className="text-slate-400 italic">Nenhum vínculo</span>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Arquivos e Anexos</p>
                        
                        {/* PDF Principal */}
                        <div className="mb-6 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50">
                            <div className="flex items-center gap-4">
                                <div className="bg-red-100 p-3 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-red-600 text-2xl">picture_as_pdf</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{memo.fileName || 'Memorando_Assinado.pdf'}</p>
                                    <p className="text-xs text-slate-500">Documento Principal (Oficial)</p>
                                </div>
                            </div>
                            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors w-full md:w-auto">
                                <span className="material-symbols-outlined text-[18px]">download</span>
                                Baixar
                            </button>
                        </div>

                        {/* Anexos Adicionais */}
                        {memo.attachments && memo.attachments.length > 0 && (
                            <div>
                                <p className="text-xs font-bold text-slate-500 mb-3">Anexos Complementares ({memo.attachments.length})</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {memo.attachments.map((file, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-white shadow-sm">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <span className="material-symbols-outlined text-slate-400 text-xl shrink-0">draft</span>
                                                <span className="text-sm font-semibold text-slate-700 truncate">{file.name}</span>
                                            </div>
                                            <button className="text-primary hover:text-red-700 flex items-center shrink-0 ml-2">
                                                <span className="material-symbols-outlined text-[18px]">download</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Controle de Edições */}
            <div className="mt-8 bg-transparent rounded-none border-t-2 border-slate-200/50 pt-8 mb-4">
                <div className="flex items-center gap-2 mb-6 px-2">
                    <span className="material-symbols-outlined text-slate-500">history</span>
                    <h3 className="font-bold text-slate-800 text-sm">Controle de Edições e Rastreabilidade</h3>
                </div>
                <div className="px-2">
                    <div className="space-y-4">
                        {(memo.history || []).map((entry) => (
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
                        {(!memo.history || memo.history.length === 0) && (
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

export default ExternalMemoView;
