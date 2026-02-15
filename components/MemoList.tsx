
import React from 'react';
import { Memo } from '../types';

interface MemoListProps {
  type: 'INTERNO' | 'EXTERNO';
}

const mockMemos: Memo[] = [
  { id: '1', processNumber: '#2024-00124', subject: 'Solicitação de Material de Escritório', type: 'INTERNO', status: 'PENDENTE', date: 'Hoje, 09:45', sender: 'Almoxarifado', recipient: 'Financeiro', content: '' },
  { id: '2', processNumber: '#2024-00119', subject: 'Parecer Técnico - Obra Rodoviária', type: 'EXTERNO', status: 'CONCLUIDO', date: 'Ontem, 16:20', sender: 'Obras', recipient: 'Prefeito', content: '' },
  { id: '3', processNumber: '#2024-00098', subject: 'Relatório Trimestral de Frotas', type: 'INTERNO', status: 'EXPIRADO', date: '02 Out, 11:30', sender: 'Transportes', recipient: 'Diretoria', content: '' },
  { id: '4', processNumber: '#2024-00085', subject: 'Convite - Inauguração Centro Social', type: 'EXTERNO', status: 'ENCAMINHADO', date: '28 Set, 14:00', sender: 'Comunicação', recipient: 'Externo', content: '' },
];

const MemoList: React.FC<MemoListProps> = ({ type }) => {
  const filteredMemos = mockMemos.filter(m => m.type === type);

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'PENDENTE': return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
      case 'CONCLUIDO': return 'bg-green-50 text-green-700 ring-1 ring-green-200';
      case 'EXPIRADO': return 'bg-primary/5 text-primary ring-1 ring-primary/20';
      case 'ENCAMINHADO': return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200';
      default: return 'bg-slate-50 text-slate-500';
    }
  };

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Memorandos {type === 'INTERNO' ? 'Internos' : 'Externos'}</h2>
          <p className="text-slate-500 mt-1">Gestão de trâmite documental institucional.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button className="px-4 py-2 bg-white rounded-lg shadow-sm text-xs font-black uppercase tracking-widest text-primary">Tudo</button>
            <button className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest">Pendentes</button>
            <button className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest">Concluídos</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-primary/5 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-black tracking-[0.15em]">
              <tr>
                <th className="px-8 py-5">ID / Processo</th>
                <th className="px-6 py-5">Assunto</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5">Data</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMemos.map((memo) => (
                <tr key={memo.id} className="hover:bg-primary/5 transition-all group cursor-pointer">
                  <td className="px-8 py-5 font-black text-slate-900 text-sm">{memo.processNumber}</td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-800 line-clamp-1">{memo.subject}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{memo.sender} para {memo.recipient}</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(memo.status)}`}>
                      {memo.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500 font-medium">{memo.date}</td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-300 group-hover:text-primary transition-all">
                      <span className="material-symbols-outlined text-xl">visibility</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400">Mostrando {filteredMemos.length} de {filteredMemos.length} registros</p>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400"><span className="material-symbols-outlined text-lg">chevron_left</span></button>
            <button className="w-8 h-8 rounded-lg bg-primary text-white text-xs font-black">1</button>
            <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400"><span className="material-symbols-outlined text-lg">chevron_right</span></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoList;
