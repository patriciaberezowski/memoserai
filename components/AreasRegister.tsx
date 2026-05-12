import React, { useState, useMemo } from 'react';
import { AreaInterna } from '../types';
import { INITIAL_AREAS } from './mockData';

const AreasRegister: React.FC = () => {
    const [areas, setAreas] = useState<AreaInterna[]>(INITIAL_AREAS);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    
    // Form state
    const [areaForm, setAreaForm] = useState({ nome: '', sigla: '' });

    const filteredAreas = useMemo(() => {
        return areas
            .filter(a => 
                a.nome.toLowerCase().includes(search.toLowerCase()) || 
                a.sigla.toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => a.nome.localeCompare(b.nome));
    }, [areas, search]);

    const handleOpenModal = (area?: AreaInterna) => {
        if (area) {
            setEditingId(area.id);
            setAreaForm({ nome: area.nome, sigla: area.sigla });
        } else {
            setEditingId(null);
            setAreaForm({ nome: '', sigla: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!areaForm.nome || !areaForm.sigla) return;
        
        if (editingId) {
            setAreas(prev => prev.map(a => a.id === editingId ? { ...a, nome: areaForm.nome, sigla: areaForm.sigla.toUpperCase() } : a));
        } else {
            const newArea: AreaInterna = {
                id: `area-${Date.now()}`,
                nome: areaForm.nome,
                sigla: areaForm.sigla.toUpperCase()
            };
            setAreas([...areas, newArea]);
        }
        
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if(confirm('Tem certeza que deseja excluir esta área?')) {
            setAreas(areas.filter(a => a.id !== id));
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto font-sans h-[calc(100vh-64px)] overflow-y-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Áreas Internas</h1>
                    <p className="text-slate-500 mt-1">Gerencie os departamentos e setores internos do sistema.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-sm"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Adicionar +
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                    <div className="relative max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            type="text"
                            placeholder="Pesquisar por área ou sigla..."
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
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nome da Área</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sigla</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredAreas.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-slate-500">Nenhuma área encontrada.</td>
                                </tr>
                            ) : (
                                filteredAreas.map(area => (
                                    <tr key={area.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="p-4 text-sm font-semibold text-slate-800">{area.nome}</td>
                                        <td className="p-4 text-sm text-slate-600">
                                            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-bold border border-slate-200">
                                                {area.sigla}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button 
                                                    onClick={() => handleOpenModal(area)}
                                                    title="Editar Área"
                                                    className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(area.id)}
                                                    title="Excluir Área"
                                                    className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Adicionar / Editar */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">{editingId ? 'Editar Área Interna' : 'Nova Área Interna'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Nome da Área</label>
                                <input
                                    type="text"
                                    required
                                    value={areaForm.nome}
                                    onChange={e => setAreaForm({...areaForm, nome: e.target.value})}
                                    placeholder="Ex: Departamento de Recursos Humanos"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Sigla</label>
                                <input
                                    type="text"
                                    required
                                    value={areaForm.sigla}
                                    onChange={e => setAreaForm({...areaForm, sigla: e.target.value})}
                                    placeholder="Ex: DRH"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none"
                                />
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
                                    className="px-5 py-2.5 rounded-lg text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-colors"
                                >
                                    {editingId ? 'Salvar Alterações' : 'Adicionar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AreasRegister;
