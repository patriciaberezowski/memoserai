import React, { useState } from 'react';
import { Memo, AppView, AppViewAlias } from '../types';
import html2pdf from 'html2pdf.js';
import { getSignedMemoUrl, makeMemoOfficial, saveMemo, uploadSignedMemo } from '../services/memoRepository';

interface InternalMemoViewProps {
    memo: Memo | null;
    setView: (view: AppView) => void;
    setSelectedMemo: (memo: Memo | null) => void;
}

const InternalMemoView: React.FC<InternalMemoViewProps> = ({ memo, setView, setSelectedMemo }) => {
    const [showUpload, setShowUpload] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showStatusMenu, setShowStatusMenu] = useState(false);

    if (!memo) {
        return (
            <div className="p-8 flex flex-col items-center justify-center h-full text-center">
                <p className="text-slate-500">Nenhum memorando selecionado.</p>
                <button onClick={() => setView(AppViewAlias.INTERNAL_MEMOS)} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold">Voltar</button>
            </div>
        );
    }

    const isSigned = memo.status?.toUpperCase() === 'ASSINADO' || !!memo.hasSignedPdf;
    const isOfficial = !!memo.processNumber || ['BAIXADO', 'DOWNLOAD', 'ASSINADO'].includes(memo.status?.toUpperCase() || '');
    const isLocked = isOfficial || isSigned;

    const handleEdit = () => {
        setView(AppViewAlias.EDIT_INTERNAL_MEMO);
    };

    const handleStatusChange = async (status: string) => {
        try {
            setIsSaving(true);
            const savedMemo = await saveMemo({
                ...memo,
                status,
                history: [{
                    id: crypto.randomUUID(),
                    action: `Status alterado para ${status}`,
                    date: new Date().toLocaleDateString('pt-BR'),
                    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    userName: 'Patrícia Berezowski',
                    userRole: 'Administrador',
                }, ...(memo.history || [])],
            });
            setSelectedMemo(savedMemo);
            setShowStatusMenu(false);
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            alert('Não foi possível atualizar o status no Supabase.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSignedUpload = async (file?: File) => {
        if (!file) return;

        if (!memo.processNumber) {
            alert('Gere o oficial e baixe o PDF antes de anexar a versão assinada.');
            return;
        }

        try {
            setIsSaving(true);
            const savedMemo = await uploadSignedMemo(memo, file);
            setSelectedMemo(savedMemo);
            setShowUpload(false);
            alert('Memorando assinado anexado. Status alterado para ASSINADO.');
        } catch (error) {
            console.error('Erro ao subir memorando assinado:', error);
            alert('Não foi possível subir o PDF assinado no Supabase.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSignedDownload = async () => {
        if (!memo.signedFilePath) {
            alert('Este memorando ainda não possui arquivo assinado salvo.');
            return;
        }

        try {
            const signedUrl = await getSignedMemoUrl(memo.signedFilePath);
            const a = document.createElement('a');
            a.href = signedUrl;
            a.download = memo.fileName || 'memorando-assinado.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error('Erro ao baixar PDF assinado:', error);
            alert('Não foi possível baixar o PDF assinado.');
        }
    };

    const handlePrint = async () => {
        let updatedMemo = { ...memo };

        try {
            setIsSaving(true);
            if (!memo.processNumber) {
                updatedMemo = await makeMemoOfficial(memo);
                setSelectedMemo(updatedMemo);
                await new Promise(resolve => setTimeout(resolve, 400));
            } else if (memo.status?.toUpperCase() === 'RASCUNHO') {
                updatedMemo = await saveMemo({ ...memo, status: 'BAIXADO' });
                setSelectedMemo(updatedMemo);
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        } catch (error) {
            console.error('Erro ao gerar número oficial:', error);
            alert('Não foi possível gerar o número oficial no Supabase.');
            setIsSaving(false);
            return;
        } finally {
            setIsSaving(false);
        }

        const element = document.getElementById('memo-print-container');
        if (!element) return;

        element.classList.remove('hidden');

        const opt = {
            margin: [0, 0, 82, 0] as [number, number, number, number],
            filename: `Memorando_${updatedMemo.processNumber ? updatedMemo.processNumber.replace(/\//g, '-') : 'Rascunho'}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'pt' as const, format: 'a4', orientation: 'portrait' as const },
            pagebreak: { mode: ['css', 'legacy'], avoid: ['.avoid-page-break', '.signature-block'] }
        };

        try {
            // Use the worker API to manipulate pages
            const worker = html2pdf().from(element).set(opt).toPdf();
            
            await worker.get('pdf').then((pdf: any) => {
                const totalPages = pdf.internal.getNumberOfPages();
                
                // Configuração do Rodapé (A4 in pts é aprox 595 x 842)
                const footerText = [
                    "Sede Brasília – DF: SCN Quadra 06, Cj A, 6º andar, Shopping ID - 70716-900 – Brasília /DF",
                    "Sub sede Maricá/RJ: R. Álvares de Castro, 346 – Centro – 24.900-000 – Maricá/ RJ",
                    "Telefones: (21) 99675-2831/2637-3706 - Ramal: 4399 E-mail: serai@marica.rj.gov.br e pmadm@gmail.com"
                ];

                for (let i = 1; i <= totalPages; i++) {
                    pdf.setPage(i);
                    // Draw a top line for the footer
                    pdf.setDrawColor(0);
                    pdf.setLineWidth(0.5);
                    pdf.line(40, 800, 555, 800);
                    
                    pdf.setFont("helvetica", "normal");
                    pdf.setFontSize(8);
                    pdf.setTextColor(0, 0, 0);

                    // Add footer text lines
                    let yPos = 810;
                    footerText.forEach(line => {
                        const textWidth = pdf.getStringUnitWidth(line) * 8 / pdf.internal.scaleFactor;
                        const xPos = (595 - textWidth) / 2; // Center horizontally
                        pdf.text(line, xPos, yPos);
                        yPos += 10;
                    });
                }
            });

            await worker.save();
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            alert("Ocorreu um erro ao gerar o PDF.");
        } finally {
            element.classList.add('hidden');
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500 font-sans print-hide">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <button
                        onClick={() => { setSelectedMemo(null); setView(AppViewAlias.INTERNAL_MEMOS); }}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-sm mb-4 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        Voltar para Lista
                    </button>
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Detalhes do Memorando Interno</h2>
                        {isLocked && (
                            <span className="bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded-md font-bold uppercase tracking-widest flex items-center gap-1" title="Documento Assinado e Trancado">
                                <span className="material-symbols-outlined text-[14px]">lock</span>
                                Trancado
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <span className="text-red-600">Home</span>
                        <span>/</span>
                        <span className="text-red-600">Internos</span>
                        <span>/</span>
                        <span>{memo.processNumber || 'Rascunho'}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                    <button onClick={() => alert('Abrir Histórico')} className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold text-xs uppercase hover:bg-slate-50 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">history</span>
                        Histórico
                    </button>
                    {!isOfficial ? (
                        <>
                            <button
                                onClick={() => setShowStatusMenu(!showStatusMenu)}
                                className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold text-xs uppercase hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                            >
                                <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                                Status
                            </button>
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold text-xs uppercase hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                            >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                Editar Rascunho
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setShowStatusMenu(!showStatusMenu)}
                                className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold text-xs uppercase hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                            >
                                <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                                Trocar Status
                            </button>
                            {!isSigned && (
                                <button
                                    className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold text-xs uppercase hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                                    onClick={() => setShowUpload(!showUpload)}
                                    disabled={isSaving}
                                >
                                    <span className="material-symbols-outlined text-[18px]">upload</span>
                                    Subir Assinado
                                </button>
                            )}
                            <button
                                className="px-4 py-2.5 rounded-lg border border-slate-200 bg-primary text-white font-bold text-xs uppercase hover:bg-red-700 transition-all flex items-center gap-2 shadow-sm"
                                onClick={handleSignedDownload}
                                disabled={!memo.signedFilePath}
                            >
                                <span className="material-symbols-outlined text-[18px]">download</span>
                                Baixar Assinado
                            </button>
                        </>
                    )}

                    {!isSigned && (
                        <button
                            onClick={handlePrint}
                            disabled={isSaving}
                            className="px-4 py-2.5 rounded-lg bg-primary text-white font-black text-xs uppercase hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-60"
                        >
                            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                            {isSaving ? 'Salvando...' : memo.processNumber ? 'Download Oficial' : 'Gerar Oficial e Download'}
                        </button>
                    )}
                </div>
            </div>

            {showStatusMenu && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-sm flex flex-wrap items-center gap-3">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Trocar status:</span>
                    {['PENDENTE', 'VENCIDO', 'RESOLVIDO'].map(status => (
                        <button
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            disabled={isSaving}
                            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold uppercase disabled:opacity-60"
                        >
                            {status === 'PENDENTE' ? 'Pendente' : status === 'VENCIDO' ? 'Vencido' : 'Resolvido'}
                        </button>
                    ))}
                </div>
            )}

            {showUpload && isOfficial && !isSigned && (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 mb-8 flex flex-col items-center justify-center text-center">
                    <h4 className="font-bold text-slate-800 mb-2">Upload do Memorando Assinado</h4>
                    <p className="text-sm text-slate-500 mb-4 max-w-lg">Ao realizar o upload da versão assinada (PDF), o conteúdo base deste memorando ficará permanentemente trancado para edições, garantindo a integridade do rascunho com o documento oficial.</p>
                    <label className="flex flex-col items-center justify-center w-full max-w-md h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">upload_file</span>
                            <p className="text-sm font-semibold text-primary">Selecione o arquivo PDF</p>
                        </div>
                        <input type="file" className="hidden" accept="application/pdf" onChange={(event) => handleSignedUpload(event.target.files?.[0])} />
                    </label>
                </div>
            )}

            {/* Main Container */}
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Left Col - Data */}
                <div className="lg:w-1/3 space-y-8">
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">info</span>
                            Metadados
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status Atual</p>
                                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700`}>
                                    {memo.status}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Número Gerado</p>
                                <p className="font-bold text-slate-900">{memo.processNumber}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Emissão</p>
                                    <p className="text-sm font-medium text-slate-700">{memo.date}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Prazo</p>
                                    <p className="text-sm font-medium text-slate-700">{memo.deadline || 'S/ Prazo'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Categoria</p>
                                <p className="text-sm font-medium text-slate-700">{memo.category || 'Demanda'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">link</span>
                            Cruzamentos
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Respondendo a</p>
                                {memo.linkedMemo ? (
                                    <a href="#" className="flex items-center gap-2 text-sm text-primary hover:underline font-medium">
                                        <span className="material-symbols-outlined text-base">description</span>
                                        {memo.linkedMemo}
                                    </a>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">Nenhum fluxo antecedente.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col - Content Preview (What happens in print) */}
                <div className="lg:w-2/3">
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col h-full">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2 text-slate-500 font-medium text-sm">
                            <span className="material-symbols-outlined text-[18px]">preview</span>
                            Prévia do Conteúdo Oficial Base
                        </div>

                        <div className="p-8 font-serif leading-relaxed text-slate-800 text-sm overflow-y-auto max-h-[600px]">
                            <h2 className="text-xl font-bold mb-6 font-sans">{memo.subject}</h2>
                            <div className="mb-6 pb-6 border-b border-slate-200">
                                <p><strong className="font-sans uppercase text-xs">De:</strong> {memo.signer}{memo.signerRole ? `, ${memo.signerRole}` : ''} ({memo.responsibleArea || 'N/A'})</p>
                                <div>
                                    <strong className="font-sans uppercase text-xs block mt-2 mb-1">Para:</strong> 
                                    {memo.destinos && memo.destinos.length > 0 ? (
                                        <ul className="list-none space-y-1">
                                            {memo.destinos.map((d, idx) => (
                                                <li key={idx} className="pl-2 border-l-2 border-slate-300">
                                                    Ao Sr(a) {d.nome}, {d.cargo} ({d.orgao})
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>Ao Sr(a) {memo.recipientName}, {memo.recipientRole} ({memo.recipient})</p>
                                    )}
                                </div>
                            </div>

                            <div className="whitespace-pre-wrap">{memo.content || memo.body}</div>
                        </div>
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

export default InternalMemoView;
