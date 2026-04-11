
import React, { useState } from 'react';
import { AppView, AppViewAlias } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Memorandos': true,
    'Cadastro': false
  });

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const menuItems = [
    { view: AppView.DASHBOARD, icon: 'grid_view', label: 'Dashboard' },
    {
      label: 'Memorandos',
      icon: 'folder_open',
      isGroup: true,
      items: [
        { view: AppViewAlias.INTERNAL_MEMOS, icon: 'inbox', label: 'Internos', badge: '12' },
        { view: AppViewAlias.EXTERNAL_MEMOS, icon: 'send', label: 'Externos' },
      ]
    },
    {
      label: 'Cadastro',
      icon: 'database',
      isGroup: true,
      items: [
        { view: AppView.REGISTERS_DEPARTMENTS, icon: 'apartment', label: 'Secretarias / Autarquias' },
        { view: AppView.REGISTERS_USERS, icon: 'group', label: 'Usuários' },
        { view: AppView.REGISTERS_AREAS, icon: 'domain', label: 'Áreas Internas' },
        { view: AppView.REGISTERS_SIGNERS, icon: 'history_edu', label: 'Signatários' },
        { view: AppView.REGISTERS_FUNCTIONS, icon: 'admin_panel_settings', label: 'Funções/Permissões' },
      ]
    },
    { view: AppViewAlias.LOGS, icon: 'history', label: 'Auditoria' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full font-sans">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-red-600 p-2 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-2xl">flight</span>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">Portal Memo</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">PRINCIPAL</h3>
          <nav className="space-y-1">
            {menuItems.map((item, idx) => {
              if (item.isGroup) {
                const isOpen = openGroups[item.label];
                const hasActiveChild = item.items?.some(subItem => subItem.view === currentView);
                return (
                  <div key={idx} className="space-y-1">
                    <button
                      onClick={() => toggleGroup(item.label)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${hasActiveChild ? 'text-red-600 bg-red-50/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined text-[20px] ${hasActiveChild ? 'text-red-600' : 'text-slate-500'}`}>
                          {item.icon}
                        </span>
                        {item.label}
                      </div>
                      <span className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>

                    {isOpen && item.items && (
                      <div className="pl-10 pr-2 space-y-1 mt-1">
                        {item.items.map((subItem) => (
                          <button
                            key={subItem.view}
                            onClick={() => setView(subItem.view)}
                            className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${currentView === subItem.view
                              ? 'bg-red-50 text-red-600'
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                              }`}
                          >
                            <span className="truncate">{subItem.label}</span>
                            {subItem.badge && (
                              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                                {subItem.badge}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={idx}
                  onClick={() => setView(item.view!)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${currentView === item.view
                    ? 'bg-red-50 text-red-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined text-[20px] ${currentView === item.view ? 'text-red-600' : 'text-slate-500'}`}>
                      {item.icon}
                    </span>
                    {item.label}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

      </div>

      <div className="p-4 border-t border-slate-100 mt-auto">
        <button
          onClick={() => setView(AppView.SETTINGS)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${currentView === AppView.SETTINGS
            ? 'bg-red-50 text-red-600'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          Configurações
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
