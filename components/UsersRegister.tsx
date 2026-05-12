import React, { useState, useMemo } from 'react';
import { Usuario } from '../types';
import { INITIAL_USUARIOS, INITIAL_AREAS } from './mockData';

const UsersRegister: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>(INITIAL_USUARIOS);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    
    // Form state
    const [userForm, setUserForm] = useState({
        nomeCompleto: '',
        cargo: '',
        email: '',
        whatsapp: '',
        areaId: '',
        senha: ''
    });

    const filteredUsers = useMemo(() => {
        return usuarios
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
            .sort((a, b) => {
                const areaA = INITIAL_AREAS.find(ar => ar.id === a.areaId)?.nome || '';
                const areaB = INITIAL_AREAS.find(ar => ar.id === b.areaId)?.nome || '';
                
                // Sort by Area name first
                const areaComparison = areaA.localeCompare(areaB);
                if (areaComparison !== 0) return areaComparison;
                
                // Sort by User name alphabetically if same Area
                return a.nomeCompleto.localeCompare(b.nomeCompleto);
            });
    }, [usuarios, search]);

    const handleOpenModal = (user?: Usuario) => {
        if (user) {
            setEditingId(user.id);
            setUserForm({
                nomeCompleto: user.nomeCompleto,
                cargo: user.cargo,
                email: user.email,
                whatsapp: user.whatsapp,
                areaId: user.areaId,
                senha: user.senha || ''
            });
        } else {
            setEditingId(null);
            setUserForm({ nomeCompleto: '', cargo: '', email: '', whatsapp: '', areaId: '', senha: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userForm.nomeCompleto || !userForm.cargo || !userForm.areaId) return;
        
        if (editingId) {
            setUsuarios(prev => prev.map(u => u.id === editingId ? { ...u, ...userForm } : u));
        } else {
            const newUser: Usuario = {
                id: `usr-${Date.now()}`,
                nomeCompleto: userForm.nomeCompleto,
                cargo: userForm.cargo,
                email: userForm.email,
                whatsapp: userForm.whatsapp,
                areaId: userForm.areaId,
                senha: userForm.senha,
                isSignatario: false,
                status: 'Ativo'
            };
            setUsuarios([...usuarios, newUser]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if(confirm('Tem certeza que deseja excluir este usuário definitivamente?')) {
            setUsuarios(usuarios.filter(u => u.id !== id));
        }
    };

    const handleToggleArchive = (id: string, currentStatus?: string) => {
        const isArchived = currentStatus === 'Arquivado';
        const newStatus = isArchived ? 'Ativo' : 'Arquivado';
        const msg = isArchived 
            ? 'Deseja reativar este usuário?' 
            : 'Deseja arquivar este usuário? Ele perderá acesso ao sistema, mas o histórico será mantido.';
            
        if(confirm(msg)) {
            setUsuarios(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
        }
    };

    const getAreaName = (areaId: string) => {
        return INITIAL_AREAS.find(a => a.id === areaId)?.nome || 'Área não encontrada';
    };

    return (
        <div className="p-8 max-w-7xl mx-auto font-sans h-[calc(100vh-64px)] overflow-y-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gestão de Usuários</h1>
                    <p className="text-slate-500 mt-1">Gerencie os acessos, cargos e lotação dos servidores no sistema.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-sm"
                >
                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                    Adicionar +
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                    <div className="relative max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            type="text"
                            placeholder="Pesquisar por nome, cargo ou área..."
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
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Área Interna</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nome Completo</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cargo</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contato</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">Nenhum usuário encontrado.</td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => {
                                    const isArchived = user.status === 'Arquivado';
                                    return (
                                        <tr key={user.id} className={`transition-colors ${isArchived ? 'bg-slate-50/50 opacity-70' : 'hover:bg-slate-50/80'}`}>
                                            <td className="p-4 text-sm font-semibold text-slate-700">
                                                {getAreaName(user.areaId)}
                                            </td>
                                            <td className="p-4 text-sm font-bold text-slate-900 flex items-center gap-2">
                                                {user.nomeCompleto}
                                                {isArchived && <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] uppercase font-bold tracking-wider">Arquivado</span>}
                                            </td>
                                            <td className="p-4 text-sm text-slate-600">{user.cargo}</td>
                                            <td className="p-4 text-sm text-slate-500 space-y-1">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[14px] text-slate-400">mail</span>
                                                    {user.email || '-'}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[14px] text-slate-400">phone_iphone</span>
                                                    {user.whatsapp || '-'}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button 
                                                        onClick={() => handleOpenModal(user)}
                                                        title="Editar Usuário"
                                                        className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleToggleArchive(user.id, user.status)}
                                                        title={isArchived ? "Reativar Usuário" : "Arquivar Usuário"}
                                                        className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">
                                                            {isArchived ? 'unarchive' : 'archive'}
                                                        </span>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(user.id)}
                                                        title="Excluir Usuário"
                                                        className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Adicionar / Editar */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">{editingId ? 'Editar Usuário' : 'Novo Usuário'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo *</label>
                                <input
                                    type="text"
                                    required
                                    value={userForm.nomeCompleto}
                                    onChange={e => setUserForm({...userForm, nomeCompleto: e.target.value})}
                                    placeholder="Ex: João da Silva"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none bg-slate-50 focus:bg-white"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Cargo *</label>
                                    <input
                                        type="text"
                                        required
                                        value={userForm.cargo}
                                        onChange={e => setUserForm({...userForm, cargo: e.target.value})}
                                        placeholder="Ex: Analista"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none bg-slate-50 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Área Interna *</label>
                                    <select
                                        required
                                        value={userForm.areaId}
                                        onChange={e => setUserForm({...userForm, areaId: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none bg-slate-50 focus:bg-white appearance-none"
                                    >
                                        <option value="" disabled>Selecione uma área...</option>
                                        {INITIAL_AREAS.map(area => (
                                            <option key={area.id} value={area.id}>{area.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">E-mail</label>
                                    <input
                                        type="email"
                                        value={userForm.email}
                                        onChange={e => setUserForm({...userForm, email: e.target.value})}
                                        placeholder="nome@marica.rj.gov.br"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none bg-slate-50 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp</label>
                                    <input
                                        type="text"
                                        value={userForm.whatsapp}
                                        onChange={e => setUserForm({...userForm, whatsapp: e.target.value})}
                                        placeholder="(21) 90000-0000"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none bg-slate-50 focus:bg-white"
                                    />
                                </div>
                            </div>
                            
                            {!editingId && (
                                <div className="pt-2 border-t border-slate-100 mt-2">
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Senha de Acesso Inicial *</label>
                                    <input
                                        type="password"
                                        required
                                        value={userForm.senha}
                                        onChange={e => setUserForm({...userForm, senha: e.target.value})}
                                        placeholder="Defina uma senha provisória"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none bg-slate-50 focus:bg-white"
                                    />
                                </div>
                            )}
                            
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
                                    className="px-5 py-2.5 rounded-lg text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-colors"
                                >
                                    {editingId ? 'Salvar Alterações' : 'Salvar Usuário'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersRegister;
