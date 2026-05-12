import React, { useState } from 'react';
import { Secretaria } from '../types';
import { INITIAL_SECRETARIAS } from './mockSecretarias';

const SecretariaRegister: React.FC = () => {
    const [secretarias, setSecretarias] = useState<Secretaria[]>(INITIAL_SECRETARIAS);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const selectedSec = secretarias.find(s => s.id === selectedId) || null;

    const handleSelect = (id: string) => {
        setSelectedId(id);
    };

    const handleAddNova = () => {
        const novaSecretaria: Secretaria = {
            id: `sec-${Date.now()}`,
            pasta: 'Nova Secretaria',
            isFemaleSecretary: false,
            responsavel: '',
            quemSao: '',
            oqueFazem: '',
            enderecos: [],
            telefones: [],
            ramais: [],
            emails: []
        };
        setSecretarias([novaSecretaria, ...secretarias]);
        setSelectedId(novaSecretaria.id);
    };

    const handleUpdate = (id: string, updates: Partial<Secretaria>) => {
        setSecretarias(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const handleArrayChange = (id: string, field: 'enderecos' | 'telefones' | 'ramais' | 'emails', index: number, value: string) => {
        setSecretarias(prev => prev.map(s => {
            if (s.id !== id) return s;
            const newArray = [...s[field]];
            newArray[index] = value;
            return { ...s, [field]: newArray };
        }));
    };

    const addArrayItem = (id: string, field: 'enderecos' | 'telefones' | 'ramais' | 'emails') => {
        setSecretarias(prev => prev.map(s => {
            if (s.id !== id) return s;
            return { ...s, [field]: [...s[field], ''] };
        }));
    };

    const removeArrayItem = (id: string, field: 'enderecos' | 'telefones' | 'ramais' | 'emails', index: number) => {
        setSecretarias(prev => prev.map(s => {
            if (s.id !== id) return s;
            const newArray = [...s[field]];
            newArray.splice(index, 1);
            return { ...s, [field]: newArray };
        }));
    };

    const handleSave = () => {
        alert('Dados da Secretaria salvos com sucesso!');
    };

    const handleDelete = (id: string) => {
        if(confirm('Tem certeza que deseja excluir esta Secretaria?')) {
            setSecretarias(secretarias.filter(s => s.id !== id));
            if (selectedId === id) setSelectedId(null);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-full font-sans bg-slate-50">
            {/* Sidebar List */}
            <div className="w-full lg:w-1/3 border-r border-slate-200 bg-white flex flex-col h-[calc(100vh-64px)] overflow-hidden">
                <div className="p-6 border-b border-slate-100 shrink-0">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold text-slate-900">Secretarias</h2>
                        <button 
                            onClick={handleAddNova}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-[14px]">add</span> Nova
                        </button>
                    </div>
                    <p className="text-sm text-slate-500">Selecione uma secretaria para visualizar e editar seus detalhes de contato, funções e estrutura.</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {secretarias.map(sec => (
                        <button
                            key={sec.id}
                            onClick={() => handleSelect(sec.id)}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${
                                selectedId === sec.id 
                                ? 'bg-red-50 border-red-200 shadow-sm' 
                                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            <h3 className={`font-bold text-sm ${selectedId === sec.id ? 'text-red-700' : 'text-slate-800'}`}>
                                {sec.pasta || 'Nova Secretaria'}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                <span className="font-semibold">{sec.isFemaleSecretary ? 'Secretária' : 'Secretário'}:</span> {sec.responsavel || 'Não definido'}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 h-[calc(100vh-64px)]">
                {selectedSec ? (
                    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedSec.pasta || 'Nova Secretaria'}</h1>
                                <p className="text-sm text-slate-500 mt-1">Edite as informações detalhadas desta secretaria abaixo.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleDelete(selectedSec.id)}
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
                            
                            {/* Identificação */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">1. Identificação</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">Nome da Pasta</label>
                                        <input
                                            type="text"
                                            value={selectedSec.pasta}
                                            onChange={(e) => handleUpdate(selectedSec.id, { pasta: e.target.value })}
                                            placeholder="Ex: Secretaria de Educação"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none bg-slate-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">Gênero do Cargo</label>
                                        <div className="flex items-center gap-4 h-10">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="generoCargo"
                                                    checked={!selectedSec.isFemaleSecretary}
                                                    onChange={() => handleUpdate(selectedSec.id, { isFemaleSecretary: false })}
                                                    className="w-4 h-4 text-red-600 focus:ring-red-500 border-slate-300"
                                                />
                                                <span className="text-sm font-medium text-slate-700">Secretário</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="generoCargo"
                                                    checked={selectedSec.isFemaleSecretary}
                                                    onChange={() => handleUpdate(selectedSec.id, { isFemaleSecretary: true })}
                                                    className="w-4 h-4 text-red-600 focus:ring-red-500 border-slate-300"
                                                />
                                                <span className="text-sm font-medium text-slate-700">Secretária</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-slate-700 mb-2">Nome do Responsável</label>
                                        <input
                                            type="text"
                                            value={selectedSec.responsavel}
                                            onChange={(e) => handleUpdate(selectedSec.id, { responsavel: e.target.value })}
                                            placeholder="Ex: João da Silva"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none bg-slate-50 focus:bg-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Detalhes Corporativos */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">2. Informações e Atribuições</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">Quem São</label>
                                        <textarea
                                            value={selectedSec.quemSao}
                                            onChange={(e) => handleUpdate(selectedSec.id, { quemSao: e.target.value })}
                                            rows={3}
                                            placeholder="Breve descrição sobre a equipe ou secretaria..."
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none bg-slate-50 focus:bg-white resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">O que fazem</label>
                                        <textarea
                                            value={selectedSec.oqueFazem}
                                            onChange={(e) => handleUpdate(selectedSec.id, { oqueFazem: e.target.value })}
                                            rows={4}
                                            placeholder="Descreva as funções, atividades e responsabilidades da secretaria..."
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none bg-slate-50 focus:bg-white resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contatos */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">3. Canais de Contato e Localização</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    
                                    {/* Emails */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="block text-xs font-bold text-slate-700 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px] text-slate-400">mail</span>
                                                E-mails
                                            </label>
                                            <button onClick={() => addArrayItem(selectedSec.id, 'emails')} className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">add</span> Adicionar
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {selectedSec.emails.length === 0 && <p className="text-xs text-slate-400 italic">Nenhum e-mail cadastrado.</p>}
                                            {selectedSec.emails.map((email, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => handleArrayChange(selectedSec.id, 'emails', idx, e.target.value)}
                                                        placeholder="exemplo@marica.rj.gov.br"
                                                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none"
                                                    />
                                                    <button onClick={() => removeArrayItem(selectedSec.id, 'emails', idx)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                                        <span className="material-symbols-outlined text-[18px]">close</span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Telefones */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="block text-xs font-bold text-slate-700 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px] text-slate-400">call</span>
                                                Telefones
                                            </label>
                                            <button onClick={() => addArrayItem(selectedSec.id, 'telefones')} className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">add</span> Adicionar
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {selectedSec.telefones.length === 0 && <p className="text-xs text-slate-400 italic">Nenhum telefone cadastrado.</p>}
                                            {selectedSec.telefones.map((tel, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={tel}
                                                        onChange={(e) => handleArrayChange(selectedSec.id, 'telefones', idx, e.target.value)}
                                                        placeholder="(21) 0000-0000"
                                                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none"
                                                    />
                                                    <button onClick={() => removeArrayItem(selectedSec.id, 'telefones', idx)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                                        <span className="material-symbols-outlined text-[18px]">close</span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Ramais */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="block text-xs font-bold text-slate-700 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px] text-slate-400">dialpad</span>
                                                Ramais
                                            </label>
                                            <button onClick={() => addArrayItem(selectedSec.id, 'ramais')} className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">add</span> Adicionar
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {selectedSec.ramais.length === 0 && <p className="text-xs text-slate-400 italic">Nenhum ramal cadastrado.</p>}
                                            {selectedSec.ramais.map((ramal, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={ramal}
                                                        onChange={(e) => handleArrayChange(selectedSec.id, 'ramais', idx, e.target.value)}
                                                        placeholder="Ex: 1234"
                                                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none"
                                                    />
                                                    <button onClick={() => removeArrayItem(selectedSec.id, 'ramais', idx)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                                        <span className="material-symbols-outlined text-[18px]">close</span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Endereços */}
                                    <div className="md:col-span-2">
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="block text-xs font-bold text-slate-700 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span>
                                                Endereços
                                            </label>
                                            <button onClick={() => addArrayItem(selectedSec.id, 'enderecos')} className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">add</span> Adicionar Endereço
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {selectedSec.enderecos.length === 0 && <p className="text-xs text-slate-400 italic">Nenhum endereço cadastrado.</p>}
                                            {selectedSec.enderecos.map((end, idx) => (
                                                <div key={idx} className="flex gap-3">
                                                    <input
                                                        type="text"
                                                        value={end}
                                                        onChange={(e) => handleArrayChange(selectedSec.id, 'enderecos', idx, e.target.value)}
                                                        placeholder="Rua, Número, Bairro, Cidade..."
                                                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none bg-slate-50 focus:bg-white"
                                                    />
                                                    <button onClick={() => removeArrayItem(selectedSec.id, 'enderecos', idx)} className="w-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">account_balance</span>
                        </div>
                        <p className="text-sm font-medium">Selecione uma secretaria ao lado para visualizar e editar.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SecretariaRegister;
