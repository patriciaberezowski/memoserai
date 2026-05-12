import React, { useState } from 'react';
import { Memo, AppView, AppViewAlias } from '../types';
import html2pdf from 'html2pdf.js';

interface MemoListProps {
  type?: 'INTERNO' | 'EXTERNO' | 'EXTRA';
  kpiFilter?: 'RECEIVED' | 'SENT' | 'ANSWERED' | 'EXPIRED' | 'PENDING' | 'RESOLVED';
  setView?: (view: AppView) => void;
  setSelectedMemo?: (memo: Memo | null) => void;
}

const mockInternalMemos: Memo[] = [
  { id: '1', processNumber: '043/2026', year: '2026', subject: 'Solicitação de pauta publicitária', type: 'INTERNO', status: 'RESOLVIDO', date: '12/02/2026', deadline: '20/02/2026', sender: 'ASCOM', recipient: 'Secretaria de Comunicação', institution: 'SERAI', content: '', responsibleArea: 'ASCOM', signer: 'Patrícia Berezowski', category: 'Demanda', hasSignedPdf: true },
  { id: '2', processNumber: '', year: '2026', subject: 'Aprovação de orçamento prévio para folheto', type: 'INTERNO', status: 'RASCUNHO', date: '14/02/2026', deadline: '25/02/2026', sender: 'Gabinete', recipient: 'Secretaria de Turismo', institution: 'SERAI', content: '', responsibleArea: 'Gabinete', signer: 'Maria Souza', category: 'Demanda', hasSignedPdf: false },
  { id: '3', processNumber: '057/2026', year: '2026', subject: 'Informativo sobre novo plano', type: 'INTERNO', status: 'ASSINADO', date: '10/02/2026', deadline: '', sender: 'ASCOM', recipient: 'Codemar', institution: 'SERAI', content: '', responsibleArea: 'ASCOM', signer: 'Patrícia Berezowski', category: 'Informativo', hasSignedPdf: true },
  { id: '6', processNumber: '058/2026', year: '2026', subject: 'Convite para reunião', type: 'INTERNO', status: 'PENDENTE', date: '21/02/2026', deadline: '28/02/2026', sender: 'TIC', recipient: 'Gabinete', institution: 'SERAI', content: '', responsibleArea: 'TIC', category: 'Demanda', hasSignedPdf: false },
  { id: '7', processNumber: '059/2026', year: '2026', subject: 'Ata de Reunião', type: 'INTERNO', status: 'DOWNLOAD', date: '22/02/2026', deadline: '', sender: 'Jurídico', recipient: 'ASCOM', institution: 'SERAI', content: '', responsibleArea: 'Jurídico', category: 'Informativo', hasSignedPdf: false },
  {
    id: '8',
    processNumber: '',
    year: '2026',
    subject: 'Solicitação complementar para confecção de crachás institucionais',
    type: 'INTERNO',
    status: 'RASCUNHO',
    date: '07/01/2026',
    deadline: '31/03/2026',
    sender: 'SERAI',
    recipient: 'SECOM',
    institution: 'SERAI',
    linkedMemo: 'Memorando 003/2026',
    content: 'Em complemento ao Memorando anteriormente encaminhado referente à solicitação de materiais institucionais, a Secretaria de Representação e Articulação Institucional (SERAI) informa a necessidade de confecção de mais 03 (três) crachás institucionais, conforme padrão visual adotado pela Prefeitura de Maricá.\n\nOs crachás deverão conter:\n- Nome completo\n- Número de matrícula\n- Fotografia institucional\n\nRelação de Servidoras:\n\nNOME COMPLETO                                    | MATRÍCULA\n-------------------------------------------------|-----------\nMaria Eduarda da Cunha Costa                     | 115 984\nMariana Ramalho de Jesus                         | 116 001\nTais de Oliveira Rodrigues Silva                 | 116 000\n\nAs fotografias e demais informações necessárias para a confecção estarão disponíveis por meio de link compartilhado via OneDrive, o qual será encaminhado a essa Secretaria para acesso.\n\nSolicitamos, por gentileza, a confirmação do recebimento e a previsão de prazo para produção e entrega dos referidos itens.\n\nReiteramos nossos agradecimentos pela parceria e colaboração de sempre.',
    responsibleArea: 'ASCOM',
    category: 'Demanda',
    signer: 'Ivana Cristina de Melo Moura',
    signerRole: 'Secretária de Representação e Articulação Institucional',
    recipientName: 'Keffin Gracher',
    recipientRole: 'Secretário de Comunicação Social',
    hasSignedPdf: false
  },
];

const mockExternalMemos: Memo[] = [
  { id: '4', processNumber: '003/2026', year: '2026', subject: 'Informações sobre cartões de visitas', type: 'EXTERNO', status: 'PENDENTE', date: '15/02/2026', deadline: '23/02/2026', sender: 'SECOM', recipient: 'ASCOM', institution: 'SECOM', content: '', hasSignedPdf: true },
  { id: '5', processNumber: '042/2026', year: '2026', subject: 'Levantamento de sistemas para contratação', type: 'EXTERNO', status: 'CONCLUIDO', date: '10/02/2026', deadline: '28/02/2026', sender: 'CODEMAR', recipient: 'Gabinete', institution: 'CODEMAR', content: '', hasSignedPdf: true },
];

const mockExtraMemos: Memo[] = [
  { id: '100', processNumber: '58A/2026/SERAI/PMM', year: '2026', subject: 'Ata de registro extra', type: 'EXTRA', status: 'PENDENTE', date: '12/05/2026', deadline: '20/05/2026', sender: 'SERAI', recipient: 'SECOM', institution: 'SERAI', content: '', responsibleArea: 'Gabinete', signer: 'Ivana Cristina de Melo Moura', category: 'Demanda', hasSignedPdf: true },
];

const MemoList: React.FC<MemoListProps> = ({ type, kpiFilter, setView, setSelectedMemo }) => {
  const isKpiMode = !!kpiFilter;
  const isExternal = type === 'EXTERNO';
  const isExtra = type === 'EXTRA';

  // Base list depending on origin
  let baseMemos: Memo[] = [];
  if (isKpiMode) {
    baseMemos = [...mockInternalMemos, ...mockExternalMemos, ...mockExtraMemos];
    if (kpiFilter === 'RECEIVED') {
      baseMemos = baseMemos.filter(m => m.type === 'EXTERNO');
    } else if (kpiFilter === 'SENT') {
      baseMemos = baseMemos.filter(m => m.type === 'INTERNO');
    } else if (kpiFilter === 'ANSWERED') {
      baseMemos = baseMemos.filter(m => m.type === 'EXTERNO' && ['CONCLUIDO', 'RESPONDIDO', 'RESOLVIDO'].includes(m.status.toUpperCase()));
    } else if (kpiFilter === 'PENDING') {
      baseMemos = baseMemos.filter(m => m.status.toUpperCase() === 'PENDENTE');
    } else if (kpiFilter === 'RESOLVED') {
      baseMemos = baseMemos.filter(m => m.status.toUpperCase() === 'RESOLVIDO');
    } else if (kpiFilter === 'EXPIRED') {
      baseMemos = baseMemos.filter(m => {
        if (m.status.toUpperCase() === 'RESOLVIDO') return false;
        if (['EXPIRADO', 'VENCIDO'].includes(m.status.toUpperCase())) return true;
        if (m.deadline) {
          const [day, month, year] = m.deadline.split('/');
          const deadlineDate = new Date(`${year}-${month}-${day}T23:59:59`);
          const today = new Date();
          return deadlineDate < today;
        }
        return false;
      });
    }
  } else {
    baseMemos = isExternal ? mockExternalMemos : isExtra ? mockExtraMemos : mockInternalMemos;
  }

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filtros (Barra de Pesquisa)
  const [filterStatus, setFilterStatus] = useState<string>('TODOS');
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterSender, setFilterSender] = useState<string>(''); // Para externos "Enviado por"
  const [filterRecipient, setFilterRecipient] = useState<string>('TODOS');
  const [filterArea, setFilterArea] = useState<string>('TODOS'); // Para internos "Área"

  // Aplicar Filtros Extras (apenas para a listagem na tela, KPIs contam sobre baseMemos)
  let filteredMemos = [...baseMemos];
  if (!isKpiMode) {
    if (filterStatus !== 'TODOS') {
      filteredMemos = filteredMemos.filter(m => {
        const upStatus = m.status.toUpperCase();
        if (isExternal || isExtra) {
          if (filterStatus === 'PENDENTES') return upStatus === 'PENDENTE';
          if (filterStatus === 'RESPONDIDOS') return ['CONCLUIDO', 'RESPONDIDO'].includes(upStatus);
          if (filterStatus === 'RESOLVIDOS') return upStatus === 'RESOLVIDO';
          if (filterStatus === 'VENCIDOS') {
            if (upStatus === 'RESOLVIDO' || ['CONCLUIDO', 'RESPONDIDO'].includes(upStatus)) return false;
            if (['EXPIRADO', 'VENCIDO'].includes(upStatus)) return true;
            if (m.deadline) {
              const [day, month, year] = m.deadline.split('/');
              const deadlineDate = new Date(`${year}-${month}-${day}T23:59:59`);
              return deadlineDate < new Date();
            }
            return false;
          }
        } else {
          // Lógica Internos
          const isRascunho = upStatus === 'RASCUNHO' || !m.processNumber;
          const isDownload = upStatus === 'DOWNLOAD' && !!m.processNumber;
          const isAssinado = upStatus === 'ASSINADO';
          const isResolvido = ['RESOLVIDO', 'ARQUIVADO', 'CONCLUIDO'].includes(upStatus);
          const isVencido = !isResolvido && !isAssinado && !isDownload && !isRascunho &&
            (upStatus === 'VENCIDO' || upStatus === 'EXPIRADO' || (!!m.deadline && new Date(m.deadline.split('/').reverse().join('-') + 'T23:59:59') < new Date()));
          const isPendente = !isResolvido && !isVencido && !isAssinado && !isDownload && !isRascunho && (upStatus === 'PENDENTE' || upStatus === '');

          if (filterStatus === 'RASCUNHOS') return isRascunho;
          if (filterStatus === 'DOWNLOAD') return isDownload;
          if (filterStatus === 'ASSINADOS') return isAssinado;
          if (filterStatus === 'PENDENTES') return isPendente || upStatus === 'PENDENTE';
          if (filterStatus === 'VENCIDOS') return isVencido;
          if (filterStatus === 'RESOLVIDOS') return isResolvido;
        }
        return true;
      });
    }

    if (filterDate) {
      const [fYear, fMonth, fDay] = filterDate.split('-');
      const formattedFilterDate = `${fDay}/${fMonth}/${fYear}`;
      filteredMemos = filteredMemos.filter(m => m.date === formattedFilterDate || m.deadline === formattedFilterDate);
    }

    // Remetente ou Destinatário via campo texto (External) / Combos (Internal/Extra)
    if ((isExternal || isExtra) && filterSender) {
      const termo = filterSender.toLowerCase();
      filteredMemos = filteredMemos.filter(m => (m.sender && m.sender.toLowerCase().includes(termo)));
    }

    if (filterRecipient !== 'TODOS') {
      filteredMemos = filteredMemos.filter(m => m.recipient && m.recipient.toUpperCase().includes(filterRecipient));
    }

    if (!isExternal && !isExtra && filterArea !== 'TODOS') {
      filteredMemos = filteredMemos.filter(m => m.responsibleArea && m.responsibleArea.toUpperCase().includes(filterArea));
    }
  }

  // Ordenação decrescente: Ano -> Número do Processo
  filteredMemos.sort((a, b) => {
    const parseProcess = (processNum: string) => {
      // Itens "Sem Número" (Rascunhos) ficam no topo provisoriamente
      if (!processNum) return { num: 999999, year: 9999 };
      const parts = processNum.split('/');
      if (parts.length === 2) {
        return { num: parseInt(parts[0], 10) || 0, year: parseInt(parts[1], 10) || 0 };
      }
      return { num: 0, year: 0 };
    };

    const pa = parseProcess(a.processNumber);
    const pb = parseProcess(b.processNumber);

    if (pb.year !== pa.year) {
      return pb.year - pa.year;
    }
    return pb.num - pa.num;
  });

  // --- Funções de Cálculo Estritas p/ as Caixinhas (Baseam-se em baseMemos ou filteredMemos, dependendo do design. Usaremos filteredMemos para a UI visual refletir a busca, conforme pedido) ---
  const countRespondidos = () => filteredMemos.filter(m => ['CONCLUIDO', 'RESPONDIDO'].includes(m.status.toUpperCase())).length;
  const countPendentes = () => filteredMemos.filter(m => m.status.toUpperCase() === 'PENDENTE').length;
  const countVencidos = () => filteredMemos.filter(m => {
    if (m.status.toUpperCase() === 'RESOLVIDO' || ['CONCLUIDO', 'RESPONDIDO'].includes(m.status.toUpperCase())) return false;
    if (['EXPIRADO', 'VENCIDO'].includes(m.status.toUpperCase())) return true;
    if (m.deadline) {
      const [day, month, year] = m.deadline.split('/');
      const deadlineDate = new Date(`${year}-${month}-${day}T23:59:59`);
      const today = new Date();
      return deadlineDate < today;
    }
    return false;
  }).length;

  const getStatusBadge = (status: string, memoProcessNumber?: string) => {
    // Override status visually via internal logic if it's lacking a process number
    let effectiveStatus = status.toUpperCase();
    if (!isExternal && !memoProcessNumber && effectiveStatus !== 'RASCUNHO') {
      effectiveStatus = 'RASCUNHO';
    }

    switch (effectiveStatus) {
      case 'RASCUNHO':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">Rascunho</span>;
      case 'DOWNLOAD':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">Download</span>;
      case 'ASSINADO':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-lime-100 text-lime-700">Assinado</span>;
      case 'PENDENTE':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Pendente</span>;
      case 'CONCLUIDO':
      case 'RESPONDIDO':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Respondido</span>;
      case 'EXPIRADO':
      case 'VENCIDO':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">Vencido</span>;
      case 'RESOLVIDO':
      case 'ARQUIVADO':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700">Resolvido</span>;
      default: return null;
    }
  };

  const handleNewClick = () => {
    if (setView) {
      if (isExternal) {
        setView(AppViewAlias.NEW_EXTERNAL_MEMO);
      } else if (isExtra) {
        setView(AppViewAlias.NEW_EXTRA_MEMO);
      } else {
        setView(AppViewAlias.NEW_MEMO);
      }
    }
  };

  const handleViewMemo = (memo: Memo) => {
    if (setView && setSelectedMemo) {
      setSelectedMemo(memo);
      if (memo.type === 'EXTERNO') {
        setView(AppViewAlias.VIEW_EXTERNAL_MEMO);
      } else if (memo.type === 'EXTRA') {
        setView(AppViewAlias.VIEW_EXTRA_MEMO);
      } else {
        setView(AppViewAlias.VIEW_INTERNAL_MEMO);
      }
    }
  };

  const handleEditMemo = (memo: Memo) => {
    if (setView && setSelectedMemo) {
      setSelectedMemo(memo);
      if (memo.type === 'EXTERNO') {
        setView(AppViewAlias.EDIT_EXTERNAL_MEMO);
      } else if (memo.type === 'EXTRA') {
        setView(AppViewAlias.EDIT_EXTRA_MEMO);
      } else {
        setView(AppViewAlias.EDIT_INTERNAL_MEMO);
      }
    }
  };

  return (
    <div className="p-8 animate-in fade-in duration-500 font-sans">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isKpiMode ? (
              kpiFilter === 'RECEIVED' ? 'Memorandos Recebidos' :
                kpiFilter === 'SENT' ? 'Memorandos Enviados' :
                  kpiFilter === 'ANSWERED' ? 'Memorandos Respondidos' :
                    kpiFilter === 'PENDING' ? 'Memorandos Pendentes' :
                      kpiFilter === 'RESOLVED' ? 'Memorandos Resolvidos' :
                        'Memorandos Expirados'
            ) : isExternal ? 'Memorandos Externos' : isExtra ? 'Memorandos Extras' : 'Memorandos Internos'}
          </h2>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
            <span className="text-red-600 hover:underline cursor-pointer">Home</span>
            <span>/</span>
            <span>Listagem Geral</span>
          </div>
        </div>
        {!isKpiMode && (
          <div className="flex items-center gap-3">
            {!isExternal && !isExtra && (
              <button
                onClick={() => {
                  if (setView) setView(AppViewAlias.NEW_LEGACY_MEMO);
                }}
                className="px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all 
                           bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              >
                <span className="material-symbols-outlined text-[18px]">history_edu</span>
                Registrar Documento Antigo
              </button>
            )}
            <button
              onClick={handleNewClick}
              className="bg-primary hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              Novo Memorando
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-blue-50 p-3 rounded-lg">
            <span className="material-symbols-outlined text-blue-600 text-3xl">inbox</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">TOTAL</p>
            <p className="text-2xl font-black text-slate-900">{filteredMemos.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-amber-50 p-3 rounded-lg">
            <span className="material-symbols-outlined text-amber-600 text-3xl">pending_actions</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">PENDENTES</p>
            <p className="text-2xl font-black text-slate-900">{countPendentes()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-red-50 p-3 rounded-lg">
            <span className="material-symbols-outlined text-red-600 text-3xl">error</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{isExternal ? 'VENCIDOS' : 'EXPIRADOS'}</p>
            <p className="text-2xl font-black text-slate-900">{countVencidos()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-green-50 p-3 rounded-lg">
            <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              {isExternal ? 'RESPONDIDOS' : 'RESOLVIDOS'}
            </p>
            <p className="text-2xl font-black text-slate-900">{countRespondidos()}</p>
          </div>
        </div>
      </div>

      {!isKpiMode && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="TODOS">Todos</option>
              {isExternal ? (
                <>
                  <option value="PENDENTES">Pendentes</option>
                  <option value="RESPONDIDOS">Respondidos</option>
                  <option value="VENCIDOS">Vencidos</option>
                  <option value="RESOLVIDOS">Resolvidos</option>
                </>
              ) : (
                <>
                  <option value="RASCUNHOS">Rascunhos</option>
                  <option value="DOWNLOAD">Download</option>
                  <option value="ASSINADOS">Assinados</option>
                  <option value="PENDENTES">Pendentes</option>
                  <option value="VENCIDOS">Vencidos</option>
                  <option value="RESOLVIDOS">Resolvidos</option>
                </>
              )}
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Data</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {isExternal ? (
            <div className="flex-1 min-w-[150px]">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Enviado por</label>
              <input
                type="text"
                placeholder="Ex: SECOM..."
                value={filterSender}
                onChange={(e) => setFilterSender(e.target.value)}
                className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          ) : (
            <div className="flex-1 min-w-[150px]">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Área Interna</label>
              <select
                value={filterArea}
                onChange={(e) => setFilterArea(e.target.value)}
                className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="TODOS">Todas</option>
                <option value="ASCOM">ASCOM</option>
                <option value="TIC">TIC</option>
                <option value="GABINETE">Gabinete</option>
                <option value="JURÍDICO">Jurídico</option>
                <option value="FORMALIZAÇÃO">Formalização</option>
                <option value="CAPTAÇÃO">Captação</option>
              </select>
            </div>
          )}

          <div className="flex-1 min-w-[150px]">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Destinatário {(isExternal || isExtra) && 'Interno'}
            </label>
            <select
              value={filterRecipient}
              onChange={(e) => setFilterRecipient(e.target.value)}
              className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="TODOS">Todos (Sem filtro)</option>
              <option value="ASCOM">ASCOM</option>
              <option value="TIC">TIC</option>
              <option value="GABINETE">Gabinete</option>
              <option value="JURÍDICO">Jurídico</option>
              <option value="FORMALIZAÇÃO">Formalização</option>
              <option value="CAPTAÇÃO">Captação</option>
              {!isExternal && <option value="SECRETARIA DE TURISMO">Sec. de Turismo</option>}
              {!isExternal && <option value="CODEMAR">Codemar</option>}
            </select>
          </div>

          <button
            onClick={() => {
              setFilterStatus('TODOS');
              setFilterDate('');
              setFilterSender('');
              setFilterRecipient('TODOS');
              setFilterArea('TODOS');
            }}
            className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0"
            title="Limpar Filtros"
          >
            <span className="material-symbols-outlined text-[20px]">filter_alt_off</span>
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible min-h-[400px]">
        <div className="overflow-visible">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Número</th>
                <th className="px-6 py-4">Assunto</th>
                {isKpiMode ? (
                  <>
                    <th className="px-6 py-4">Origem / Destino</th>
                  </>
                ) : isExternal ? (
                  <th className="px-6 py-4">Enviado por</th>
                ) : (
                  <th className="px-6 py-4">Destinatário</th>
                )}
                <th className="px-6 py-4">Prazo</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMemos.map((memo) => (
                <tr key={memo.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-black text-slate-900">
                    {memo.processNumber || <span className="text-slate-400 font-normal italic text-[11px] uppercase tracking-wider bg-slate-100 py-1 px-2 rounded-md">Sem Número</span>}
                  </td>

                  {isKpiMode ? (
                    <>
                      <td className="px-6 py-4">
                        <p
                          className="text-sm font-bold text-slate-900 mb-0.5 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleViewMemo(memo)}
                        >
                          {memo.subject}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{memo.type}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-800 font-medium">De: {memo.sender || memo.responsibleArea || 'N/A'}</p>
                        <p className="text-sm text-slate-500">Para: {memo.recipient || 'N/A'}</p>
                      </td>
                    </>
                  ) : isExternal ? (
                    <>
                      <td className="px-6 py-4">
                        <p
                          className="text-sm font-bold text-slate-900 mb-0.5 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleViewMemo(memo)}
                        >
                          {memo.subject}
                        </p>
                        <p className="text-xs text-slate-500">Para: {memo.recipient}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-medium">{memo.sender}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <p
                          className="text-sm font-bold text-slate-900 mb-0.5 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleViewMemo(memo)}
                        >
                          {memo.subject}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-900 font-medium">{memo.recipient}</p>
                        <p className="text-xs text-slate-500">Enviado por: <span className="text-slate-700 font-medium">{memo.responsibleArea}</span></p>
                      </td>
                    </>
                  )}

                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{memo.deadline}</td>

                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(memo.status, memo.processNumber)}
                  </td>

                  <td className="px-6 py-4 text-center relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === memo.id ? null : memo.id)}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none p-2 rounded hover:bg-slate-200"
                    >
                      <span className="material-symbols-outlined pointer-events-none">more_vert</span>
                    </button>

                    {activeMenuId === memo.id && (
                      <div className="absolute right-10 top-12 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-[100] py-1 flex flex-col items-start overflow-hidden animate-in fade-in duration-200">
                        <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 w-full text-left">
                          Ações
                        </div>

                        <button
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors flex items-center gap-3"
                          onClick={() => { setActiveMenuId(null); handleEditMemo(memo); }}
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span> Editar Mem.
                        </button>
                        <div className="w-full h-px bg-slate-100 my-0.5"></div>

                        {(!memo.hasSignedPdf || memo.type === 'EXTERNO') && (
                          <>
                            <button
                              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 font-medium"
                              onClick={() => { setActiveMenuId(null); alert('Tem certeza que deseja deletar o memorando?'); }}
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span> Deletar Mem.
                            </button>
                            <div className="w-full h-px bg-slate-100 my-0.5"></div>
                          </>
                        )}

                        <button
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors flex items-center gap-3 font-medium"
                          onClick={async () => {
                            setActiveMenuId(null);
                            if (memo.fileUrl) {
                              const a = document.createElement('a');
                              a.href = memo.fileUrl;
                              a.download = memo.fileName || 'download.pdf';
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              return;
                            }

                            // For Internal Memos without an external file link, generate PDF
                            if (memo.type !== 'EXTERNO') {
                              let updatedMemo = { ...memo };
                              let isNewOfficial = false;

                              if (!memo.processNumber) {
                                alert('Atenção: Número Oficial gerado e retido!\n\n(Isto atualizará o banco de dados marcando este Rascunho com o número final).\nIniciando Download do PDF...');

                                updatedMemo = {
                                  ...memo,
                                  processNumber: '077/2026/SERAI/PMM',
                                  status: 'DOWNLOAD'
                                };

                                memo.processNumber = '077/2026/SERAI/PMM';
                                memo.status = 'DOWNLOAD';
                                isNewOfficial = true;
                              }

                              if (setSelectedMemo) {
                                setSelectedMemo(updatedMemo);
                              }

                              // Wait for React to re-render App.tsx which contains MemoPrintTemplate
                              await new Promise(resolve => setTimeout(resolve, 300));

                              const element = document.getElementById('memo-print-container');
                              if (!element) {
                                console.error("Template de impressão não encontrado no DOM.");
                                return;
                              }

                              element.classList.remove('hidden');

                              const opt = {
                                margin: 0,
                                filename: `Memorando_${updatedMemo.processNumber ? updatedMemo.processNumber.replace(/\//g, '-') : 'Rascunho'}.pdf`,
                                image: { type: 'jpeg' as const, quality: 0.98 },
                                html2canvas: { scale: 2 },
                                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' as const }
                              };

                              try {
                                await html2pdf().from(element).set(opt).save();
                              } catch (error) {
                                console.error("Erro ao gerar PDF:", error);
                                alert("Ocorreu um erro ao gerar o PDF.");
                              } finally {
                                element.classList.add('hidden');
                              }
                            } else {
                              alert('Este é um documento de teste e não possui arquivo real.');
                            }
                          }}
                        >
                          <span className="material-symbols-outlined text-[18px]">download</span> Download
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {filteredMemos.length === 0 && (
                <tr>
                  <td colSpan={isExternal ? 6 : 8} className="px-6 py-12 text-center text-slate-500">
                    Nenhum memorando encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">Exibindo {filteredMemos.length} de {filteredMemos.length} resultados</p>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
            <button className="w-8 h-8 rounded bg-red-600 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-red-600/20">1</button>
            <button className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default MemoList;
