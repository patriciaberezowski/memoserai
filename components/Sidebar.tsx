
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { view: AppView.DASHBOARD, icon: 'dashboard', label: 'Dashboard' },
    { view: AppView.INTERNAL_MEMOS, icon: 'inbox', label: 'Memorandos Internos' },
    { view: AppView.EXTERNAL_MEMOS, icon: 'public', label: 'Memorandos Externos' },
    { view: AppView.LOGS, icon: 'history_edu', label: 'Logs do Sistema' },
    { view: AppView.SETTINGS, icon: 'settings', label: 'Configurações' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-primary/10 flex flex-col shrink-0 h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary p-2 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-white text-2xl">account_balance</span>
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-primary leading-none">SERAI</h1>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">Prefeitura de Maricá</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all ${
              currentView === item.view
                ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                : 'text-slate-600 hover:bg-primary/5 hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-primary/5">
        <button
          onClick={() => setView(AppView.NEW_MEMO)}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 px-4 rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-primary/20 active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          Novo Memorando
        </button>
      </div>

      <div className="p-4 bg-slate-50 border-t border-primary/5">
        <div className="flex items-center gap-3 px-2">
          <div className="h-10 w-10 rounded-full border-2 border-primary/20 overflow-hidden bg-white">
            <img 
              src="https://picsum.photos/seed/carlos/200/200" 
              alt="User Avatar" 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 truncate">Carlos Alberto</p>
            <p className="text-[10px] text-slate-500 font-medium uppercase truncate">Adm. Máster</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
