
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-primary/10 flex items-center justify-between px-8 shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
            placeholder="Buscar memorandos, processos ou setores..."
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-600 hover:text-primary hover:bg-primary/5 rounded-full transition-all">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2.5 right-2.5 block h-2 w-2 rounded-full bg-primary ring-2 ring-white"></span>
        </button>
        <div className="h-6 w-px bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900 leading-none">{title}</p>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1">Sessão Ativa</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
