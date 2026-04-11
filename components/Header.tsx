
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-xl w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 placeholder:text-slate-400 transition-all shadow-sm"
            placeholder="Pesquisar memorandos, assuntos ou destinatários..."
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
            <span className="material-symbols-outlined filled">notifications</span>
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-white"></span>
          </button>

          <button className="text-slate-900 hover:text-slate-700 transition-colors">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none">Patrícia Berezowski</p>
            <p className="text-xs text-red-600 font-medium mt-0.5">Diretora de Comunicação</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-orange-100 border-2 border-white shadow-sm overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Patricia&hairColor=Auburn,Red"
              alt="User Avatar"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
