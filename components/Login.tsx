import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(false);
        setIsLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
        });

        setIsLoading(false);
        if (error) {
            setLoginError(true);
            return;
        }

        onLogin();
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex relative overflow-hidden font-sans selection:bg-primary/30">
            {/* Decorative Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CgkJPHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6IiBmaWxsPSJub25lIi8+CgkJPHBhdGggZD0iTTAgMGg0MHYxSDBWMHptMCAzOWg0MHYxSDB2LTF6TTAgMHY0MGgxVjBIMHptMzkgMHY0MGgxVjBIMzl6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+Cgk8L3N2Zz4=')] opacity-50 pointer-events-none"></div>

            <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between p-8 lg:p-16 relative z-10">

                {/* Left Section: Hero Context */}
                <div className="w-full lg:w-1/2 text-white mb-16 lg:mb-0 lg:pr-12 animate-in fade-in slide-in-from-left-8 duration-1000">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-slate-300 mb-8 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Sistema Oficial de Memorandos
                    </div>

                    <h1 className="text-4xl lg:text-5xl xl:text-[3.5rem] font-black mb-6 tracking-tight leading-tight lg:whitespace-nowrap">
                        Gestão inteligente com o <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-amber-500">
                            Portal Doc.
                        </span>
                    </h1>

                    <p className="text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
                        A plataforma definitiva unificada para a tramitação, formatação e acompanhamento de memorandos internos e externos da Secretaria de Defesa.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-slate-300">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-red-500">draw</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">Assinatura Digital Integrada</h3>
                                <p className="text-sm text-slate-500">Numeração automática e chancela eletrônica.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-300">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-orange-500">monitoring</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">Acompanhamento em Tempo Real</h3>
                                <p className="text-sm text-slate-500">Painéis de SLAs, pendências e indicativos visuais.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-300">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-amber-500">history_edu</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">Acervo Histórico (Legados)</h3>
                                <p className="text-sm text-slate-500">Importação e guarda segura de documentos antigos.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Glassmorphism Login Form */}
                <div className="w-full lg:w-[440px] animate-in fade-in slide-in-from-right-8 duration-1000 delay-150">
                    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-8 lg:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                        {/* Inner subtle glow */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>

                        <div className="text-center mb-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-red-500/20">
                                <span className="material-symbols-outlined text-3xl text-white">flight_takeoff</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Acesso ao Sistema</h2>
                            <p className="text-slate-400 text-sm">Insira suas credenciais corporativas</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">E-mail Corporativo</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-[20px]">mail</span>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="usuario@marica.rj.gov.br"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Senha</label>
                                    <a href="#" className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors">Esqueceu?</a>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-[20px]">lock</span>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            {loginError && (
                                <div className="text-red-400 text-sm text-center font-medium bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                                    E-mail ou senha incorretos ou usuário não cadastrado no Supabase.
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-all flex items-center justify-center gap-2 mt-4 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                            >
                                {isLoading ? (
                                    <span className="material-symbols-outlined animate-spin">refresh</span>
                                ) : (
                                    <>
                                        Entrar no Portal Doc
                                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center border-t border-white/5 pt-6">
                            <p className="text-xs text-slate-500 font-medium">
                                © 2026 SERAI Maricá.<br />Acesso restrito a servidores autorizados.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
