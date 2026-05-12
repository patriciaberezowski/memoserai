import React, { useState } from 'react';

import { Autarquia } from '../types';
import { INITIAL_AUTARQUIAS } from './mockData';

const AutarquiaRegister: React.FC = () => {
    const [autarquias, setAutarquias] = useState<Autarquia[]>(INITIAL_AUTARQUIAS);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const selectedAut = autarquias.find(a => a.id === selectedId) || null;

    const handleSelect = (id: string) => {
        setSelectedId(id);
    };

    const handleAddNova = () => {
        const novaAutarquia: Autarquia = {
            id: `aut-${Date.now()}`,
            nome: 'Nova Autarquia',
            sigla: 'NA',
            responsavel: ''
        };
        setAutarquias([novaAutarquia, ...autarquias]);
        setSelectedId(novaAutarquia.id);
    };

    const handleUpdate = (id: string, updates: Partial<Autarquia>) => {
        setAutarquias(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    };

    const handleSave = () => {
        alert('Dados da Autarquia salvos com sucesso!');
    };

    const handleDelete = (id: string) => {
        if(confirm('Tem certeza que deseja excluir esta Autarquia?')) {
            setAutarquias(autarquias.filter(a => a.id !== id));
            if (selectedId === id) setSelectedId(null);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-full font-sans bg-slate-50">
            {/* Sidebar List */}
            <div className="w-full lg:w-1/3 border-r border-slate-200 bg-white flex flex-col h-[calc(100vh-64px)] overflow-hidden">
                <div className="p-6 border-b border-slate-100 shrink-0">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold text-slate-900">Autarquias e Estatais</h2>
                        <button 
                            onClick={handleAddNova}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-[14px]">add</span> Nova
                        </button>
                    </div>
                    <p className="text-sm text-slate-500">Selecione uma autarquia para visualizar e editar informações básicas.</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {autarquias.map(aut => (
                        <button
                            key={aut.id}
                            onClick={() => handleSelect(aut.id)}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${
                                selectedId === aut.id 
                                ? 'bg-red-50 border-red-200 shadow-sm' 
                                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            <h3 className={`font-bold text-sm ${selectedId === aut.id ? 'text-red-700' : 'text-slate-800'}`}>
                                {aut.sigla} - {aut.nome || 'Nova Autarquia'}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                <span className="font-semibold">Responsável:</span> {aut.responsavel || 'Não definido'}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 h-[calc(100vh-64px)]">
                {selectedAut ? (
                    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedAut.sigla || 'NA'}</h1>
                                <p className="text-sm text-slate-500 mt-1">Cadastro Simplificado</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleDelete(selectedAut.id)}
                                    className="px-4 py-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600 font-bold text-sm rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                                >
                                    Salvar Alterações
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Informações Gerais</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-slate-700 mb-2">Nome Completo</label>
                                        <input
                                            type="text"
                                            value={selectedAut.nome}
                                            onChange={(e) => handleUpdate(selectedAut.id, { nome: e.target.value })}
                                            placeholder="Ex: Serviço de Obras"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none bg-slate-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">Sigla</label>
                                        <input
                                            type="text"
                                            value={selectedAut.sigla}
                                            onChange={(e) => handleUpdate(selectedAut.id, { sigla: e.target.value })}
                                            placeholder="Ex: SOMAR"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none bg-slate-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">Nome do Responsável</label>
                                        <input
                                            type="text"
                                            value={selectedAut.responsavel}
                                            onChange={(e) => handleUpdate(selectedAut.id, { responsavel: e.target.value })}
                                            placeholder="Ex: João da Silva"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none bg-slate-50 focus:bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">domain_add</span>
                        </div>
                        <p className="text-sm font-medium">Selecione uma autarquia ao lado para visualizar e editar.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AutarquiaRegister;
