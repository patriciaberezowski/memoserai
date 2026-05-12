import React from 'react';
import { Memo } from '../types';

interface MemoPrintTemplateProps {
    memo: Memo | null;
}

const formatDateToFull = (dateStr: string) => {
    if (!dateStr) return '';
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    
    // Suporte para datas no formato YYYY-MM-DD ou DD/MM/YYYY
    let d = new Date();
    if (dateStr.includes('-')) {
        const [y, m, day] = dateStr.split('-');
        d = new Date(parseInt(y), parseInt(m) - 1, parseInt(day));
    } else if (dateStr.includes('/')) {
        const [day, m, y] = dateStr.split('/');
        d = new Date(parseInt(y), parseInt(m) - 1, parseInt(day));
    }
    
    if (isNaN(d.getTime())) return dateStr;
    
    return `Brasília, ${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}.`;
};

const MemoPrintTemplate: React.FC<MemoPrintTemplateProps> = ({ memo }) => {
    if (!memo) return null;

    // This component is only rendered for printing (handled by CSS via display: none for screen)
    // and block for print
    return (
        <div id="memo-print-container" className="print-only w-full min-h-screen bg-white hidden" style={{ fontFamily: 'Arial, "Times New Roman", serif', fontSize: '12pt', color: 'black', lineHeight: 1.5, textAlign: 'justify', width: '210mm' }}>

            {/* Margins ABNT: Superior 3cm, Esquerda 3cm, Inferior 2cm, Direita 2cm */}
            {/* Note: jsPDF will handle actual page margins via html2pdf options. We'll set padding to create the visual boundary before rasterization. */}
            <div className="mx-auto relative min-h-screen" style={{ paddingTop: '1cm', paddingBottom: '3.2cm', paddingLeft: '2cm', paddingRight: '1cm' }}>

                {/* Header Section (Logo and Secretariat) */}
                <div className="flex items-center justify-center mb-12 pb-4">
                    <img src="/header_image.png" alt="Logo SERAI" className="h-20 object-contain mx-auto" />
                </div>

                {/* Memo Meta Data */}
                <div className="mb-10">
                    <div className="font-bold text-[12pt] mb-6">
                        Memorando nº {memo.processNumber || '[A SER GERADO NO BANCO]'}
                    </div>
                    <div className="text-right text-[12pt]">
                        {formatDateToFull(memo.date)}
                    </div>
                </div>

                {/* Recipient Section */}
                <div className="mb-10 leading-[1.0] space-y-4">
                    {memo.destinos && memo.destinos.length > 0 ? (
                        memo.destinos.map((d, idx) => (
                            <div key={idx}>
                                <p className="font-bold">Ao Sr(a) {d.nome}</p>
                                <p>{d.cargo}</p>
                                <p>{d.orgao}</p>
                            </div>
                        ))
                    ) : (
                        <div>
                            <p className="font-bold">Ao Sr(a) {memo.recipientName || '[NOME DO DESTINATÁRIO]'}</p>
                            <p>{memo.recipientRole || '[CARGO]'}</p>
                            <p>{memo.recipient ? memo.recipient : '[SECRETARIA OU AUTARQUIA DE DESTINO]'}</p>
                        </div>
                    )}
                </div>

                {/* Subject */}
                <div className="mb-10 font-bold">
                    <p>Assunto: {memo.subject}</p>
                </div>

                {/* Greeting */}
                <div className="mb-4">
                    <p style={{ textIndent: '1.25cm' }}>Senhor(a) {memo.recipientRole ? memo.recipientRole.split(' ')[0] : 'Secretário(a)'},</p>
                </div>

                {/* Body Content */}
                <div className="mb-10 memo-body">
                    {(memo.content || memo.body || '').split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4" style={{ textIndent: '1.25cm', orphans: 3, widows: 3 }}>
                            {paragraph || '\u00A0'}
                        </p>
                    ))}
                    <p className="mt-8 mb-12 avoid-page-break" style={{ textIndent: '1.25cm', breakInside: 'avoid', pageBreakInside: 'avoid' }}>Atenciosamente,</p>
                </div>

                {/* Signer Block */}
                <div className="signature-block w-full flex flex-col items-center justify-center text-center" style={{ lineHeight: 1.25, breakInside: 'avoid', pageBreakInside: 'avoid', marginTop: '0.8cm', paddingBottom: '0.8cm' }}>
                    <p className="font-bold">{memo.signer || 'IVANA CRISTINA MELO DE MOURA'}</p>
                    <p>{memo.signerRole || 'Secretária de Representação e Articulação Institucional - SERAI'}</p>
                </div>
            </div>
        </div>
    );
};

export default MemoPrintTemplate;
