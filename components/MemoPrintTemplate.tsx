import React from 'react';
import { Memo } from '../types';

interface MemoPrintTemplateProps {
    memo: Memo | null;
}

const MemoPrintTemplate: React.FC<MemoPrintTemplateProps> = ({ memo }) => {
    if (!memo) return null;

    // This component is only rendered for printing (handled by CSS via display: none for screen)
    // and block for print
    return (
        <div id="memo-print-container" className="print-only text-black w-full min-h-screen bg-white hidden" style={{ fontFamily: 'Calibri, sans-serif', fontSize: '11pt', lineHeight: 1.5 }}>

            {/* Margins e Container simulating A4 inside browser print context */}
            <div className="max-w-4xl mx-auto relative min-h-screen" style={{ paddingTop: '2cm', paddingBottom: '2cm', paddingLeft: '3cm', paddingRight: '2cm' }}>

                {/* Header Section (Logo and Secretariat) */}
                <div className="flex items-center justify-center gap-6 mb-16 pb-4">
                    <div className="text-right flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-700 leading-tight">Secretaria de</p>
                        <p className="text-sm font-black uppercase text-slate-900 leading-tight">Representação e<br />Articulação Institucional</p>
                    </div>
                    <div className="w-px h-12 bg-slate-300"></div>
                    <div className="flex-1 text-left">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-700 leading-tight">Prefeitura de</p>
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none" style={{ fontFamily: 'Arial Black, sans-serif' }}>Maricá</h1>
                        <p className="text-[8px] uppercase tracking-widest text-slate-500 font-bold mt-0.5">Cidade que cuida, transforma e inspira</p>
                    </div>
                </div>

                {/* Memo Meta Data */}
                <div className="flex justify-between items-start mb-16">
                    <div className="font-bold text-lg">
                        Memorando nº {memo.processNumber || '[A SER GERADO NO BANCO]'}
                    </div>
                    <div className="text-right font-bold text-lg">
                        Brasília, {memo.date}.
                    </div>
                </div>

                {/* Recipient Section */}
                <div className="mb-12">
                    <p className="mb-1">{memo.recipientName || '[NOME DO DESTINATÁRIO]'}</p>
                    <p className="mb-1">{memo.recipientRole || '[CARGO]'}</p>
                    <p className="mb-1">{memo.recipient ? memo.recipient : '[SECRETARIA OU AUTARQUIA DE DESTINO]'}</p>
                    <p className="mb-1">[Endereço completo da pasta...]</p>
                    <p>[E-mail do destinatário...]</p>
                </div>

                {/* Subject */}
                <div className="mb-12">
                    <p><strong>Assunto:</strong> {memo.subject}</p>
                </div>

                {/* Greeting */}
                <div className="mb-6">
                    <p>Senhor(a) {memo.recipientRole ? memo.recipientRole.split(' ')[0] : 'Secretário(a)'},</p>
                </div>

                {/* Body Content */}
                <div className="mb-16">
                    {(memo.content || memo.body || '').split('\n').map((paragraph, idx) => (
                        <p key={idx} style={{ textAlign: 'justify', marginTop: 0, marginBottom: '6pt' }}>
                            {paragraph || '\u00A0'}
                        </p>
                    ))}
                </div>

                {/* Signer Block */}
                <div className="mt-24 w-full flex flex-col items-center justify-center text-center">
                    <p className="mb-24">Atenciosamente,</p>

                    <p className="font-bold uppercase">{memo.signer || 'IVANA CRISTINA MELO DE MOURA'}</p>
                    <p>{memo.signerRole || 'Secretária de Representação e Articulação Institucional - SERAI'}</p>
                </div>

                {/* Fixed PDF Footer (Absolute positioned to bottom of page in print context) */}
                <div className="absolute bottom-12 left-[3cm] right-[2cm] pt-4 text-[10px] text-center leading-relaxed text-slate-700 font-sans">
                    <p>Prefeitura de Maricá: Rua Álvares de Castro, 346, Centro, Maricá/RJ. CEP: 24600-880</p>
                    <p>Sede SERAI: SCN, Quadra 06, Conj. A, 6º andar, Edifício Venâncio 3.000, Brasília/DF. CEP: 70716-900</p>
                    <p>Sub sede SERAI: Rua Álvares de Castro nº 346 - Anexo, Centro, Maricá/RJ. CEP: 24900-880</p>
                </div>
            </div>
        </div>
    );
};

export default MemoPrintTemplate;
