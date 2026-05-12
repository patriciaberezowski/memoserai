
import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MemoList from './components/MemoList';
import MemoForm from './components/MemoForm';
import LegacyMemoForm from './components/LegacyMemoForm';
import ExternalMemoForm from './components/ExternalMemoForm';
import ExternalMemoView from './components/ExternalMemoView';
import InternalMemoView from './components/InternalMemoView';
import ExtraMemoForm from './components/ExtraMemoForm';
import MemoPrintTemplate from './components/MemoPrintTemplate';
import LogsView from './components/LogsView';
import SupportPage from './components/SupportPage';
import SecretariaRegister from './components/SecretariaRegister';
import AutarquiaRegister from './components/AutarquiaRegister';
import UsersRegister from './components/UsersRegister';
import AreasRegister from './components/AreasRegister';
import SignersRegister from './components/SignersRegister';
import Login from './components/Login';
import { AppView, AppViewAlias, Memo } from './types';
import { supabase } from './services/supabaseClient';

const PlaceholderView: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-8 flex flex-col items-center justify-center h-full text-center">
    <div className="bg-slate-100 p-6 rounded-full mb-6">
      <span className="material-symbols-outlined text-4xl text-slate-400">construction</span>
    </div>
    <h2 className="text-2xl font-black text-slate-900 mb-2">{title}</h2>
    <p className="text-slate-500 max-w-md">
      Este módulo está em desenvolvimento conforme as especificações do sistema SERAI.
    </p>
  </div>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [currentView, setView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session);
      setIsCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard setView={setView} />;
      case AppViewAlias.INTERNAL_MEMOS:
        return <MemoList type="INTERNO" setView={setView} setSelectedMemo={setSelectedMemo} />;
      case AppViewAlias.EXTERNAL_MEMOS:
        return <MemoList type="EXTERNO" setView={setView} setSelectedMemo={setSelectedMemo} />;
      case AppViewAlias.NEW_MEMO:
        return <MemoForm setView={setView} isEdit={false} />;
      case AppViewAlias.NEW_LEGACY_MEMO:
        return <LegacyMemoForm setView={setView} />;
      case AppView.MEMOS_RECEIVED:
        return <MemoList setView={setView} setSelectedMemo={setSelectedMemo} kpiFilter="RECEIVED" />;
      case AppView.MEMOS_SENT:
        return <MemoList setView={setView} setSelectedMemo={setSelectedMemo} kpiFilter="SENT" />;
      case AppView.MEMOS_ANSWERED:
        return <MemoList setView={setView} setSelectedMemo={setSelectedMemo} kpiFilter="ANSWERED" />;
      case AppView.MEMOS_EXPIRED:
        return <MemoList setView={setView} setSelectedMemo={setSelectedMemo} kpiFilter="EXPIRED" />;
      case AppView.MEMOS_PENDING:
        return <MemoList setView={setView} setSelectedMemo={setSelectedMemo} kpiFilter="PENDING" />;
      case AppView.MEMOS_RESOLVED:
        return <MemoList setView={setView} setSelectedMemo={setSelectedMemo} kpiFilter="RESOLVED" />;
      case AppViewAlias.VIEW_INTERNAL_MEMO:
        return <InternalMemoView memo={selectedMemo} setView={setView} setSelectedMemo={setSelectedMemo} />;
      case AppViewAlias.EDIT_INTERNAL_MEMO:
        return <MemoForm initialData={selectedMemo} isEdit={true} setView={setView} />;
      case AppViewAlias.NEW_EXTERNAL_MEMO:
        return <ExternalMemoForm isEdit={false} setView={setView} />;
      case AppViewAlias.VIEW_EXTERNAL_MEMO:
        return <ExternalMemoView memo={selectedMemo} setView={setView} setSelectedMemo={setSelectedMemo} />;
      case AppViewAlias.EDIT_EXTERNAL_MEMO:
        return <ExternalMemoForm initialData={selectedMemo} isEdit={true} setView={setView} />;
      case AppViewAlias.EXTRA_MEMOS:
        return <MemoList type="EXTRA" setView={setView} setSelectedMemo={setSelectedMemo} />;
      case AppViewAlias.NEW_EXTRA_MEMO:
        return <ExtraMemoForm isEdit={false} setView={setView} />;
      case AppViewAlias.EDIT_EXTRA_MEMO:
        return <ExtraMemoForm initialData={selectedMemo} isEdit={true} setView={setView} />;
      case AppViewAlias.LOGS:
        return <LogsView />;
      case AppView.REGISTERS_SECRETARIAS:
        return <SecretariaRegister />;
      case AppView.REGISTERS_AUTARQUIAS:
        return <AutarquiaRegister />;
      case AppView.REGISTERS_USERS:
        return <UsersRegister />;
      case AppView.REGISTERS_AREAS:
        return <AreasRegister />;
      case AppView.REGISTERS_SIGNERS:
        return <SignersRegister />;
      case AppView.REGISTERS_FUNCTIONS:
        return <PlaceholderView title="Funções e Permissões" />;
      case AppView.SUPPORT:
        return <SupportPage />;
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
      case AppView.DASHBOARD: return 'Painel de Controle';
      case AppViewAlias.INTERNAL_MEMOS: return 'Memorandos Internos';
      case AppViewAlias.EXTERNAL_MEMOS: return 'Memorandos Externos';
      case AppView.MEMOS_RECEIVED: return 'Memorandos Recebidos';
      case AppView.MEMOS_SENT: return 'Memorandos Enviados';
      case AppView.MEMOS_ANSWERED: return 'Memorandos Respondidos';
      case AppView.MEMOS_EXPIRED: return 'Memorandos Expirados';
      case AppView.MEMOS_PENDING: return 'Memorandos Pendentes';
      case AppView.MEMOS_RESOLVED: return 'Memorandos Resolvidos';
      case AppViewAlias.NEW_MEMO: return 'Novo Documento';
      case AppViewAlias.NEW_LEGACY_MEMO: return 'Registrar Arquivo Legado';
      case AppViewAlias.VIEW_INTERNAL_MEMO: return 'Detalhes do Memorando Interno';
      case AppViewAlias.EDIT_INTERNAL_MEMO: return 'Edição de Memorando Interno';
      case AppViewAlias.NEW_EXTERNAL_MEMO: return 'Registro de Memorando Externo';
      case AppViewAlias.VIEW_EXTERNAL_MEMO: return 'Detalhes do Memorando';
      case AppViewAlias.EDIT_EXTERNAL_MEMO: return 'Edição de Memorando Externo';
      case AppViewAlias.EXTRA_MEMOS: return 'Memorandos Extras';
      case AppViewAlias.NEW_EXTRA_MEMO: return 'Registro de Memorando Extra';
      case AppViewAlias.EDIT_EXTRA_MEMO: return 'Edição de Memorando Extra';
      case AppViewAlias.LOGS: return 'Auditoria do Sistema';
      case AppView.REGISTERS_SECRETARIAS: return 'Secretarias';
      case AppView.REGISTERS_AUTARQUIAS: return 'Autarquias';
      case AppView.REGISTERS_USERS: return 'Gestão de Usuários';
      case AppView.REGISTERS_AREAS: return 'Áreas Internas';
      case AppView.REGISTERS_SIGNERS: return 'Signatários Oficiais';
      case AppView.REGISTERS_FUNCTIONS: return 'Funções e Permissões';
      case AppView.SUPPORT: return 'Suporte Técnico';
      case AppView.SETTINGS: return 'Configurações';
      default: return 'Painel de Controle';
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-slate-300">
          <span className="material-symbols-outlined animate-spin">refresh</span>
          Verificando acesso
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden text-slate-800 selection:bg-primary/20">
      <MemoPrintTemplate memo={selectedMemo} />
      <Sidebar currentView={currentView} setView={setView} />

      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        <Header />

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>

        <footer className="h-10 border-t border-slate-200 bg-white flex items-center justify-between px-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] shrink-0">
          <p>© 2026 - Secretaria de Representação e Articulação Institucional de Maricá</p>
          <div className="flex gap-4">
            <button onClick={() => setView(AppView.SUPPORT)} className="hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-[0.2em]">SUPORTE TÉCNICO</button>
            <button className="hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-[0.2em]">TERMOS DE USO</button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
