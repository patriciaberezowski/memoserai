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
        <div id="memo-print-container" className="print-only text-black w-full min-h-screen bg-white hidden" style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: 1.5 }}>

            {/* Margins e Container simulating A4 inside browser print context */}
            <div className="max-w-4xl mx-auto relative min-h-screen" style={{ paddingTop: '2cm', paddingBottom: '2cm', paddingLeft: '3cm', paddingRight: '2cm' }}>

                {/* Header Section (Logo and Secretariat) */}
                <div className="flex items-center justify-center mb-16 pb-4">
                    <img src="/header_image.png" alt="Logo SERAI" className="h-20 object-contain mx-auto" />
                </div>

                {/* Memo Meta Data */}
                <div className="mb-12">
                    <div className="font-bold text-lg mb-8">
                        Memorando nº {memo.processNumber || '[A SER GERADO NO BANCO]'}
                    </div>
                    <div className="text-right text-base">
                        Brasília, {memo.date}.
                    </div>
                </div>

                {/* Recipient Section */}
                <div className="mb-12 leading-tight">
                    <p className="font-bold">{memo.recipientName || '[NOME DO DESTINATÁRIO]'}</p>
                    <p>{memo.recipientRole || '[CARGO]'}</p>
                    <p>{memo.recipient ? memo.recipient : '[SECRETARIA OU AUTARQUIA DE DESTINO]'}</p>
                    <p>[Endereço completo da pasta...]</p>
                    <p>[E-mail do destinatário...]</p>
                </div>

                {/* Subject */}
                <div className="mb-12">
                    <p><strong>Assunto:</strong> {memo.subject}</p>
                </div>

                {/* Greeting */}
                <div className="mb-6">
                    <p className="indent-10">Senhor(a) {memo.recipientRole ? memo.recipientRole.split(' ')[0] : 'Secretário(a)'},</p>
                </div>

                {/* Body Content */}
                <div className="mb-12">
                    {(memo.content || memo.body || '').split('\n').map((paragraph, idx) => (
                        <p key={idx} className="indent-10 text-justify mb-4">
                            {paragraph || '\u00A0'}
                        </p>
                    ))}
                    <p className="indent-10 mt-8 mb-24">Atenciosamente,</p>
                </div>

                {/* Signer Block */}
                <div className="w-full flex flex-col items-center justify-center text-center">
                    <p className="font-bold uppercase">{memo.signer || 'IVANA CRISTINA MELO DE MOURA'}</p>
                    <p>{memo.signerRole || 'Secretária de Representação e Articulação Institucional - SERAI'}</p>
                </div>

                {/* Fixed PDF Footer (Absolute positioned to bottom of page in print context) */}
                <div className="absolute bottom-8 left-[3cm] right-[2cm] pt-2 text-[9px] text-center leading-tight text-black border-t border-black">
                    <p>Sede Brasília – DF: SCN Quadra 06, Cj A, 6º andar, Shopping ID - 70716-900 – Brasília /DF</p>
                    <p>Sub sede Maricá/RJ: R. Álvares de Castro, 346 – Centro – 24.900-000 – Maricá/ RJ</p>
                    <p>Telefones: (21) 99675-2831/2637-3706 - Ramal: 4399 E-mail: serai@marica.rj.gov.br e pmadm@gmail.com</p>
                </div>
            </div>
        </div>
    );
};

export default MemoPrintTemplate;
