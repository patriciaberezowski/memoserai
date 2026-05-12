import React, { useState, useMemo } from 'react';
import { Usuario } from '../types';
import { INITIAL_USUARIOS, INITIAL_AREAS } from './mockData';

const SignersRegister: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>(INITIAL_USUARIOS);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Select state for adding new signer
    const [selectedUserId, setSelectedUserId] = useState('');

    const signers = useMemo(() => {
        return usuarios.filter(u => u.isSignatario);
    }, [usuarios]);

    const nonSigners = useMemo(() => {
        return usuarios.filter(u => !u.isSignatario).sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto));
    }, [usuarios]);

    const filteredSigners = useMemo(() => {
        return signers
            .filter(u => {
                const searchLower = search.toLowerCase();
                const area = INITIAL_AREAS.find(a => a.id === u.areaId);
                const areaNome = area ? area.nome.toLowerCase() : '';
                return (
                    u.nomeCompleto.toLowerCase().includes(searchLower) ||
                    u.cargo.toLowerCase().includes(searchLower) ||
                    areaNome.includes(searchLower)
                );
            })
            .sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto));
    }, [signers, search]);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId) return;
        
        setUsuarios(prev => prev.map(u => u.id === selectedUserId ? { ...u, isSignatario: true } : u));
        setSelectedUserId('');
        setIsModalOpen(false);
    };

    const handleRemove = (id: string) => {
        if(confirm('Tem certeza que deseja remover a permissão de assinatura deste usuário?')) {
            setUsuarios(prev => prev.map(u => u.id === id ? { ...u, isSignatario: false } : u));
        }
    };

    const getAreaName = (areaId: string) => {
        return INITIAL_AREAS.find(a => a.id === areaId)?.nome || 'Área não encontrada';
    };

    return (
        <div className="p-8 max-w-6xl mx-auto font-sans h-[calc(100vh-64px)] overflow-y-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Signatários Oficiais</h1>
                    <p className="text-slate-500 mt-1">Gerencie os usuários que possuem autorização para assinar memorandos.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-sm"
                >
                    <span className="material-symbols-outlined text-[18px]">history_edu</span>
                    Adicionar Signatário
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                    <div className="relative max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            type="text"
                            placeholder="Pesquisar signatário por nome, cargo ou área..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nome Completo</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cargo</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Área Interna</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredSigners.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">Nenhum signatário encontrado.</td>
                                </tr>
                            ) : (
                                filteredSigners.map(signer => (
                                    <tr key={signer.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="p-4 text-sm font-bold text-slate-900 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
                                                {signer.nomeCompleto.charAt(0)}
                                            </div>
                                            {signer.nomeCompleto}
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">{signer.cargo}</td>
                                        <td className="p-4 text-sm font-medium text-slate-700">
                                            {getAreaName(signer.areaId)}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => handleRemove(signer.id)}
                                                title="Remover Permissão"
                                                className="px-3 py-1.5 inline-flex items-center justify-center rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors text-xs font-bold"
                                            >
                                                Revogar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Adicionar */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Novo Signatário</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleAdd} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">Selecione o Usuário</label>
                                {nonSigners.length === 0 ? (
                                    <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                                        Todos os usuários cadastrados já são signatários.
                                    </p>
                                ) : (
                                    <select
                                        required
                                        value={selectedUserId}
                                        onChange={e => setSelectedUserId(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none bg-slate-50 focus:bg-white appearance-none"
                                    >
                                        <option value="" disabled>Selecione da lista de usuários...</option>
                                        {nonSigners.map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.nomeCompleto} ({user.cargo})
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={!selectedUserId}
                                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                                        !selectedUserId 
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                        : 'bg-red-600 hover:bg-red-700 text-white'
                                    }`}
                                >
                                    Conceder Permissão
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignersRegister;
