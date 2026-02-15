
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MemoList from './components/MemoList';
import MemoForm from './components/MemoForm';
import LogsView from './components/LogsView';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setView] = useState<AppView>(AppView.DASHBOARD);

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard />;
      case AppView.INTERNAL_MEMOS:
        return <MemoList type="INTERNO" />;
      case AppView.EXTERNAL_MEMOS:
        return <MemoList type="EXTERNO" />;
      case AppView.NEW_MEMO:
        return <MemoForm />;
      case AppView.LOGS:
        return <LogsView />;
      case AppView.SETTINGS:
        return (
          <div className="p-8">
            <h2 className="text-2xl font-black text-slate-900">Configurações</h2>
            <p className="text-slate-500 mt-2">Em desenvolvimento para a Prefeitura de Maricá.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case AppView.DASHBOARD: return 'Carlos Alberto';
      case AppView.INTERNAL_MEMOS: return 'Memorandos Internos';
      case AppView.EXTERNAL_MEMOS: return 'Memorandos Externos';
      case AppView.NEW_MEMO: return 'Novo Documento';
      case AppView.LOGS: return 'Auditoria do Sistema';
      case AppView.SETTINGS: return 'Configurações';
      default: return 'Carlos Alberto';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-display selection:bg-primary/10 selection:text-primary">
      <Sidebar currentView={currentView} setView={setView} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={getTitle()} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {renderContent()}
        </main>
        
        <footer className="h-10 border-t border-slate-200 bg-white flex items-center justify-between px-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] shrink-0">
          <p>© 2024 SERAI - SECRETARIA DE ADMINISTRAÇÃO INSTITUCIONAL - MARICÁ/RJ</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">SUPORTE TÉCNICO</a>
            <a href="#" className="hover:text-primary transition-colors">TERMOS DE USO</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
