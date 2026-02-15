
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  INTERNAL_MEMOS = 'INTERNAL_MEMOS',
  EXTERNAL_MEMOS = 'EXTERNAL_MEMOS',
  NEW_MEMO = 'NEW_MEMO',
  SETTINGS = 'SETTINGS',
  LOGS = 'LOGS',
  LOGIN = 'LOGIN'
}

export interface Memo {
  id: string;
  processNumber: string;
  subject: string;
  type: 'INTERNO' | 'EXTERNO';
  status: 'PENDENTE' | 'CONCLUIDO' | 'EXPIRADO' | 'ENCAMINHADO' | 'ARQUIVADO';
  date: string;
  sender: string;
  recipient: string;
  content: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  user: {
    name: string;
    avatar: string;
  };
  action: 'EDIÇÃO' | 'INCLUSÃO' | 'EXCLUSÃO' | 'ACESSO';
  affectedDoc: string;
  description: string;
}
