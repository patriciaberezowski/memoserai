import React, { useState } from 'react';
import { AppView, AppViewAlias } from '../types';
import { INITIAL_AREAS, INITIAL_AUTARQUIAS } from './mockData';
import { INITIAL_SECRETARIAS } from './mockSecretarias';

interface LegacyMemoFormProps {
    setView: (view: AppView) => void;
}

const LegacyMemoForm: React.FC<LegacyMemoFormProps> = ({ setView }) => {
    const [processNumber, setProcessNumber] = useState('');
    const [date, setDate] = useState('');
    const [subject, setSubject] = useState('');
    const [responsibleArea, setResponsibleArea] = useState('');
    
    const [recipientType, setRecipientType] = useState<'secretaria' | 'autarquia'>('secretaria');
    const [recipient, setRecipient] = useState('');
    const [recipientName, setRecipientName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Memorando legado salvo com sucesso! (A integração com DB será feita no futuro)');
        setView(AppViewAlias.INTERNAL_MEMOS);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500 pb-24">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => setView(AppViewAlias.INTERNAL_MEMOS)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-sm mb-4 transition-colors"
                >
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    Voltar para Lista
                </button>
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cadastro Retroativo de Memorando</h2>
                    <p className="text-slate-500 mt-2 text-sm max-w-2xl leading-relaxed">
                        Utilize este formulário exclusivamente para importar memorandos físicos anteriores ao sistema.
                        Estes documentos já nascerão arquivados e não passarão pelo fluxo de rascunhos. O PDF é <strong>obrigatório</strong>.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Document Frame */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-300 to-slate-400"></div>

                    {/* Alert Block */}
                    <div className="bg-amber-50 rounded-xl border border-amber-200 p-5 flex items-start gap-4 mb-8">
                        <span className="material-symbols-outlined text-amber-500 mt-0.5">warning</span>
                        <div>
                            <h4 className="font-bold text-amber-800 text-sm">Registro de Arquivo Legado</h4>
                            <p className="text-xs text-amber-700 mt-1 leading-relaxed">Atenção: Diferente dos novos memorandos, este registro exige que você preencha a numeração original manualmente para refletir a realidade do documento arquivado. Nenhuma auto-numeração será feita.</p>
                        </div>
                    </div>

                    {/* Basis section */}
                    <div className="pb-8 border-b border-slate-100">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">history_edu</span>
                            Identificação do Documento Original
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="block">
                                <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Nº e Ano Antigo *</span>
                                <input type="text" required value={processNumber} onChange={e => setProcessNumber(e.target.value)} placeholder="Ex: Memo 15A/2023" className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3" />
                            </label>

                            <label className="block">
                                <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Data de Emissão Original *</span>
                                <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3" />
                            </label>
                        </div>

                        <div className="mt-6">
                            <label className="block">
                                <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Assunto *</span>
                                <input type="text" required value={subject} onChange={e => setSubject(e.target.value)} placeholder="Título breve do memorando original" className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3" />
                            </label>
                        </div>
                    </div>

                    {/* Actors Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-slate-100">
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-lg">person</span> Remetente (Origem)</h3>
                            <label className="block">
                                <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Área Emissora *</span>
                                <select 
                                    required 
                                    value={responsibleArea} 
                                    onChange={e => setResponsibleArea(e.target.value)} 
                                    className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3 appearance-none bg-slate-50"
                                >
                                    <option value="" disabled>Selecione a área...</option>
                                    {INITIAL_AREAS.map(area => (
                                        <option key={area.id} value={area.id}>{area.nome}</option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-lg">send</span> Destinatário (Destino)</h3>
                            
                            <div>
                                <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Tipo de Destino *</span>
                                <div className="mt-3 flex items-center gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="recipientType"
                                            value="secretaria"
                                            checked={recipientType === 'secretaria'}
                                            onChange={() => {
                                                setRecipientType('secretaria');
                                                setRecipient('');
                                            }}
                                            className="w-4 h-4 text-primary focus:ring-primary/20 border-slate-300"
                                        />
                                        <span className="text-sm font-medium text-slate-700">Secretaria</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="recipientType"
                                            value="autarquia"
                                            checked={recipientType === 'autarquia'}
                                            onChange={() => {
                                                setRecipientType('autarquia');
                                                setRecipient('');
                                            }}
                                            className="w-4 h-4 text-primary focus:ring-primary/20 border-slate-300"
                                        />
                                        <span className="text-sm font-medium text-slate-700">Autarquia / Empresa</span>
                                    </label>
                                </div>
                            </div>

                            <label className="block">
                                <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Secretaria / Autarquia Recebedora *</span>
                                <select 
                                    required 
                                    value={recipient} 
                                    onChange={e => setRecipient(e.target.value)} 
                                    className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3 appearance-none bg-slate-50"
                                >
                                    <option value="" disabled>Selecione...</option>
                                    {recipientType === 'secretaria' ? (
                                        INITIAL_SECRETARIAS.map(sec => (
                                            <option key={sec.id} value={sec.id}>{sec.pasta}</option>
                                        ))
                                    ) : (
                                        INITIAL_AUTARQUIAS.map(aut => (
                                            <option key={aut.id} value={aut.id}>{aut.nome}</option>
                                        ))
                                    )}
                                </select>
                            </label>

                            <label className="block">
                                <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Nome do Destinatário</span>
                                <input type="text" value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="Ao Sr(a)..." className="mt-2 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-sm py-3" />
                            </label>
                        </div>
                    </div>

                    {/* Upload Section */}
                    <div className="pt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">upload_file</span> PDF do Memorando (Obrigatório)
                                </h3>

                                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">picture_as_pdf</span>
                                        <p className="text-sm font-semibold text-primary mb-1">Upload do PDF Original</p>
                                        <p className="text-xs text-slate-500">Apenas documento principal</p>
                                    </div>
                                    <input type="file" className="hidden" accept="application/pdf" required />
                                </label>
                            </div>
                            
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">attachment</span> Anexos Adicionais (Opcional)
                                </h3>

                                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors relative overflow-hidden">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10 relative pointer-events-none">
                                        <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">library_add</span>
                                        <p className="text-sm font-semibold text-slate-700 mb-1">Adicionar outros arquivos</p>
                                        <p className="text-xs text-slate-500">Planilhas, Imagens, Documentos</p>
                                    </div>
                                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" multiple />
                                </label>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-4 mt-8 pt-4">
                    <button type="button" onClick={() => setView(AppViewAlias.INTERNAL_MEMOS)} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors tracking-widest uppercase">
                        CANCELAR
                    </button>
                    <button type="submit" className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 tracking-widest uppercase">
                        <span className="material-symbols-outlined text-[20px]">archive</span>
                        SALVAR ARQUIVO LEGADO
                    </button>
                </div>
            </form>

        </div>
    );
};

export default LegacyMemoForm;
