import React, { useState } from 'react';

const SupportPage: React.FC = () => {
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would send this to the backend
        console.log({ subject, text });
        alert('Mensagem enviada com sucesso para a administração do sistema.');
        setSubject('');
        setText('');
    };

    return (
        <div className="p-8 max-w-4xl max-w-screen-xl animate-in fade-in duration-500">
            <div className="mb-8 border-b border-slate-200 pb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-4xl">support_agent</span>
                    Suporte Técnico
                </h2>
                <p className="text-slate-600 mt-4 leading-relaxed max-w-2xl bg-slate-100 p-4 rounded-xl border border-slate-200 text-sm">
                    Esse sistema foi criado pela <strong>ASCOM/SERAI</strong>, sob responsabilidade de <strong>Patrícia Berezowski</strong>.
                    Preencha o formulário abaixo para enviar sugestões ou reportar problemas. Esta mensagem será encaminhada diretamente para a área administrativa com acesso restrito.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="subject" className="block text-sm font-bold text-slate-700 mb-2">
                            Assunto
                        </label>
                        <input
                            type="text"
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-primary focus:border-primary block p-3 transition-colors"
                            placeholder="Ex: Erro ao gerar PDF do Memorando"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="text" className="block text-sm font-bold text-slate-700 mb-2">
                            Texto
                        </label>
                        <textarea
                            id="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={6}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-primary focus:border-primary block p-3 transition-colors resize-y"
                            placeholder="Descreva detalhadamente a sua sugestão ou o problema encontrado..."
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Print / Imagem (Opcional)
                        </label>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <span className="material-symbols-outlined text-3xl text-slate-400 mb-2">cloud_upload</span>
                                    <p className="mb-1 text-sm text-slate-500"><span className="font-semibold">Clique para fazer upload</span> ou arraste o arquivo</p>
                                    <p className="text-xs text-slate-400">PNG, JPG ou PDF (Máx. 5MB)</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" accept="image/png, image/jpeg, application/pdf" />
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="bg-primary hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-sm shadow-primary/30 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-xl">send</span>
                            Enviar Mensagem
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SupportPage;
