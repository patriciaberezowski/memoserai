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
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Data de Recebimento</p>
                            <p className="font-medium text-slate-700">
                                {memo.receiptDate || <span className="text-slate-400 italic">Não informada</span>}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Prazo para Resposta</p>
                            <p className="font-medium text-slate-700 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-slate-400">event</span>
                                {memo.deadline}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Secretaria Emissora</p>
                            <p className="font-medium text-slate-700 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-slate-400">business</span>
                                {memo.sender}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Destinatário Interno</p>
                            <p className="font-medium text-slate-700">{memo.recipient}</p>
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
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">PDF do Memorando</p>
                        <div className="w-full h-48 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3">
                            <span className="material-symbols-outlined text-4xl text-slate-300">picture_as_pdf</span>
                            <p className="text-slate-500 font-medium text-sm">Previa indisponível.</p>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">download</span>
                                Baixar Arquivo PDF
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ExternalMemoView;
