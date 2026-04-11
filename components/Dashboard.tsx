
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const dataChart = [
  { name: 'Sem 1', value: 400 },
  { name: 'Sem 2', value: 300 },
  { name: 'Sem 3', value: 600 },
  { name: 'Sem 4', value: 800 },
];

const pieData = [
  { name: 'No Prazo', value: 75 },
  { name: 'Atrasado', value: 25 },
];

const COLORS = ['#cc0000', '#f1f5f9'];

import { AppView } from '../types';

interface DashboardProps {
  setView?: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  return (
    <div className="space-y-8 p-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Painel de Controle</h2>
        <p className="text-slate-500 text-sm mt-1">Bem-vindo ao sistema de controle de fluxo de memorandos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Recebidos', val: '12', change: '+2', icon: 'move_to_inbox', color: 'blue', route: AppView.MEMOS_RECEIVED },
          { label: 'Enviados', val: '24', change: '+5', icon: 'send', color: 'red', route: AppView.MEMOS_SENT },
          { label: 'Respondidos', val: '18', change: '+3', icon: 'task_alt', color: 'green', route: AppView.MEMOS_ANSWERED },
          { label: 'Pendentes', val: '10', change: '-1', icon: 'pending_actions', color: 'amber', route: AppView.MEMOS_PENDING },
          { label: 'Resolvidos', val: '45', change: '+12', icon: 'inventory_2', color: 'slate', route: AppView.MEMOS_RESOLVED },
          { label: 'Expirados', val: '3', change: '0', icon: 'error', color: 'primary', route: AppView.MEMOS_EXPIRED },
        ].map((kpi, idx) => (
          <button
            key={idx}
            onClick={() => setView && setView(kpi.route)}
            className="bg-white p-6 rounded-2xl border border-primary/5 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all text-left flex flex-col w-full cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4 w-full">
              <span className={`material-symbols-outlined text-${kpi.color}-500 bg-slate-50 p-3 rounded-xl`}>{kpi.icon}</span>
              <span className={`text-[11px] font-black px-2 py-1 rounded-full ${kpi.change.includes('+') ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                {kpi.change}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
            <p className={`text-3xl font-black ${kpi.color === 'primary' ? 'text-primary' : 'text-slate-900'} mt-1`}>{kpi.val}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-primary/5 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">timeline</span>
              Evolução Mensal de Documentos
            </h3>
            <select className="text-xs font-bold bg-slate-50 border-none rounded-lg focus:ring-primary/20">
              <option>Últimos 30 dias</option>
              <option>Últimos 90 dias</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 900, color: '#cc0000' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#cc0000"
                  strokeWidth={4}
                  dot={{ r: 6, fill: '#cc0000', strokeWidth: 3, stroke: '#fff' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-primary/5 shadow-sm flex flex-col justify-center text-center">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Eficiência de Resposta</h3>
          <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900">75%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Prazo</span>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Média Global</span>
              <span className="font-black text-slate-900">1.2 dias</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[85%] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
