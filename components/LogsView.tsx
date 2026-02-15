
import React from 'react';
import { LogEntry } from '../types';

const mockLogs: LogEntry[] = [
  { id: '1', timestamp: '24/05/2024 14:32:15', user: { name: 'Carlos Alberto', avatar: 'https://picsum.photos/seed/c/40/40' }, action: 'EDIÇÃO', affectedDoc: 'DOC-2024-00891', description: 'Alteração do valor contratual de R$ 45.000 para R$ 48.200.' },
  { id: '2', timestamp: '24/05/2024 11:15:02', user: { name: 'Mariana Souza', avatar: 'https://picsum.photos/seed/m/40/40' }, action: 'INCLUSÃO', affectedDoc: 'REL-AUD-2024-11', description: 'Criação de novo relatório de auditoria interna.' },
  { id: '3', timestamp: '23/05/2024 17:45:50', user: { name: 'Felipe Mendes', avatar: 'https://picsum.photos/seed/f/40/40' }, action: 'EXCLUSÃO', affectedDoc: 'TMP-ARCHIVE-04', description: 'Exclusão permanente de rascunho expirado.' },
  { id: '4', timestamp: '23/05/2024 09:12:33', user: { name: 'Admin', avatar: 'https://picsum.photos/seed/a/40/40' }, action: 'ACESSO', affectedDoc: '---', description: 'Login realizado via IP 189.45.22.10.' },
];

const LogsView: React.FC = () => {
  return (
    <div className="p-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Histórico de Atividades</h2>
          <p className="text-slate-500 font-medium mt-1">Rastreamento de todas as alterações e acessos no SERAI.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Exportar XLS
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-primary/5 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-black tracking-widest">
            <tr>
              <th className="px-8 py-5">Data e Hora</th>
              <th className="px-6 py-5">Usuário</th>
              <th className="px-6 py-5">Ação</th>
              <th className="px-6 py-5">Documento</th>
              <th className="px-8 py-5">Descrição</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mockLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-all">
                <td className="px-8 py-5">
                  <p className="text-sm font-bold text-slate-700">{log.timestamp.split(' ')[0]}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{log.timestamp.split(' ')[1]}</p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <img src={log.user.avatar} className="w-6 h-6 rounded-full border border-slate-200" alt="" />
                    <span className="text-sm font-semibold text-slate-800">{log.user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ring-1 ring-inset ${
                    log.action === 'INCLUSÃO' ? 'bg-green-50 text-green-600 ring-green-200' :
                    log.action === 'EDIÇÃO' ? 'bg-blue-50 text-blue-600 ring-blue-200' :
                    log.action === 'EXCLUSÃO' ? 'bg-red-50 text-red-600 ring-red-200' :
                    'bg-slate-50 text-slate-500 ring-slate-200'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-black text-primary hover:underline cursor-pointer">{log.affectedDoc}</span>
                </td>
                <td className="px-8 py-5">
                  <p className="text-sm text-slate-600 leading-relaxed max-w-md">{log.description}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsView;
