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

    return (
        <div
            id="memo-print-container"
            className="print-only bg-white hidden"
            style={{
                width: '210mm',
                minHeight: '297mm',
                fontFamily: '"Times New Roman", Arial, serif',
                fontSize: '12pt',
                color: 'black',
                lineHeight: 1.5,
                textAlign: 'justify',
            }}
        >

            <div
                className="mx-auto relative"
                style={{
                    minHeight: '297mm',
                    boxSizing: 'border-box',
                    paddingTop: '1.2cm',
                    paddingBottom: '3.6cm',
                    paddingLeft: '3cm',
                    paddingRight: '2cm',
                }}
            >

                <div className="flex items-center justify-center" style={{ marginBottom: '2.1cm' }}>
                    <img
                        src="/header_image.png"
                        alt="Logo SERAI"
                        style={{
                            width: '10.6cm',
                            height: 'auto',
                            objectFit: 'contain',
                            display: 'block',
                            margin: '0 auto',
                        }}
                    />
                </div>

                <div style={{ marginBottom: '0.8cm' }}>
                    <div style={{ fontWeight: 700, fontSize: '12pt', marginBottom: '0.65cm' }}>
                        Memorando nº {memo.processNumber || '[A SER GERADO NO BANCO]'}
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '12pt' }}>
                        {formatDateToFull(memo.date)}
                    </div>
                </div>

                <div style={{ marginBottom: '0.85cm', lineHeight: 1.15 }}>
                    {memo.destinos && memo.destinos.length > 0 ? (
                        memo.destinos.map((d, idx) => (
                            <div key={idx} style={{ marginBottom: idx < (memo.destinos?.length || 0) - 1 ? '0.45cm' : 0 }}>
                                <p style={{ fontWeight: 700, margin: 0 }}>{d.nome}</p>
                                <p style={{ margin: 0 }}>{d.cargo}</p>
                                <p style={{ margin: 0 }}>{d.orgao}</p>
                            </div>
                        ))
                    ) : (
                        <div>
                            <p style={{ fontWeight: 700, margin: 0 }}>{memo.recipientName || '[NOME DO DESTINATÁRIO]'}</p>
                            <p style={{ margin: 0 }}>{memo.recipientRole || '[CARGO]'}</p>
                            <p style={{ margin: 0 }}>{memo.recipient ? memo.recipient : '[SECRETARIA OU AUTARQUIA DE DESTINO]'}</p>
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '0.85cm' }}>
                    <p style={{ margin: 0 }}><strong>Assunto:</strong> {memo.subject}</p>
                </div>

                <div style={{ marginBottom: '0.35cm' }}>
                    <p style={{ textIndent: '1.25cm', margin: 0 }}>Senhor(a) {memo.recipientRole ? memo.recipientRole.split(' ')[0] : 'Secretário(a)'},</p>
                </div>

                <div className="memo-body" style={{ marginBottom: '0.95cm' }}>
                    {(memo.content || memo.body || '').split('\n').map((paragraph, idx) => (
                        <p key={idx} style={{ textIndent: '1.25cm', orphans: 3, widows: 3, margin: '0 0 0.45cm 0' }}>
                            {paragraph || '\u00A0'}
                        </p>
                    ))}
                    <p
                        className="avoid-page-break"
                        style={{ textIndent: '1.25cm', breakInside: 'avoid', pageBreakInside: 'avoid', margin: '0.75cm 0 1.15cm 0' }}
                    >
                        Atenciosamente,
                    </p>
                </div>

                <div
                    className="signature-block"
                    style={{
                        width: '100%',
                        textAlign: 'center',
                        lineHeight: 1.25,
                        breakInside: 'avoid',
                        pageBreakInside: 'avoid',
                        marginTop: '1cm',
                        paddingBottom: '0.7cm',
                    }}
                >
                    <p style={{ fontWeight: 700, margin: '0 0 0.25cm 0' }}>{memo.signer || 'IVANA CRISTINA MELO DE MOURA'}</p>
                    <p style={{ margin: 0 }}>{memo.signerRole || 'Secretária de Representação e Articulação Institucional - SERAI'}</p>
                </div>
            </div>
        </div>
    );
};

export default MemoPrintTemplate;
