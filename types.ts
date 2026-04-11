
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  MEMOS_INTERNAL = 'MEMOS_INTERNAL',
  MEMOS_INTERNAL_VIEW = 'MEMOS_INTERNAL_VIEW',
  MEMOS_INTERNAL_EDIT = 'MEMOS_INTERNAL_EDIT',
  MEMOS_NEW = 'MEMOS_NEW',
  MEMOS_LEGACY_NEW = 'MEMOS_LEGACY_NEW',
  MEMOS_EXTERNAL = 'MEMOS_EXTERNAL',
  MEMOS_EXTERNAL_NEW = 'MEMOS_EXTERNAL_NEW',
  MEMOS_EXTERNAL_VIEW = 'MEMOS_EXTERNAL_VIEW',
  MEMOS_EXTERNAL_EDIT = 'MEMOS_EXTERNAL_EDIT',
  MEMOS_RECEIVED = 'MEMOS_RECEIVED',
  MEMOS_SENT = 'MEMOS_SENT',
  MEMOS_ANSWERED = 'MEMOS_ANSWERED',
  MEMOS_EXPIRED = 'MEMOS_EXPIRED',
  MEMOS_PENDING = 'MEMOS_PENDING',
  MEMOS_RESOLVED = 'MEMOS_RESOLVED',
  REPORTS = 'REPORTS',
  REGISTERS_DEPARTMENTS = 'REGISTERS_DEPARTMENTS',
  REGISTERS_AREAS = 'REGISTERS_AREAS',
  REGISTERS_USERS = 'REGISTERS_USERS',
  REGISTERS_SIGNERS = 'REGISTERS_SIGNERS',
  REGISTERS_FUNCTIONS = 'REGISTERS_FUNCTIONS',
  REGISTERS_ALLOWLIST = 'REGISTERS_ALLOWLIST',
  AUDIT_LOGS = 'AUDIT_LOGS',
  AUDIT_HISTORY = 'AUDIT_HISTORY',
  SETTINGS = 'SETTINGS',
  LOGIN = 'LOGIN',
  SUPPORT = 'SUPPORT'
}
// Legacy aliases for compatibility if needed, though we will update usages
export const AppViewAlias = {
  INTERNAL_MEMOS: AppView.MEMOS_INTERNAL,
  EXTERNAL_MEMOS: AppView.MEMOS_EXTERNAL,
  NEW_MEMO: AppView.MEMOS_NEW,
  NEW_LEGACY_MEMO: AppView.MEMOS_LEGACY_NEW,
  VIEW_INTERNAL_MEMO: AppView.MEMOS_INTERNAL_VIEW,
  EDIT_INTERNAL_MEMO: AppView.MEMOS_INTERNAL_EDIT,
  NEW_EXTERNAL_MEMO: AppView.MEMOS_EXTERNAL_NEW,
  VIEW_EXTERNAL_MEMO: AppView.MEMOS_EXTERNAL_VIEW,
  EDIT_EXTERNAL_MEMO: AppView.MEMOS_EXTERNAL_EDIT,
  LOGS: AppView.AUDIT_LOGS
};

export interface Memo {
  id: string;
  processNumber: string;
  subject: string;
  type: 'INTERNO' | 'EXTERNO';
  status: 'PENDENTE' | 'CONCLUIDO' | 'EXPIRADO' | 'ENCAMINHADO' | 'ARQUIVADO' | 'RASCUNHO' | 'DOWNLOAD' | 'ASSINADO' | 'VENCIDO' | 'RESOLVIDO' | string;
  date: string;
  deadline: string;
  sender: string;
  recipient: string;
  institution: string;
  content: string;
  year: string;
  linkedMemo?: string;
  fileName?: string;
  fileUrl?: string;

  // Novos campos Internos e Externos Adicionais
  receiptDate?: string;
  recipientName?: string;
  recipientRole?: string;
  responsibleArea?: string;
  signer?: string;
  signerRole?: string;
  hasSignedPdf?: boolean;
  category?: 'Informativo' | 'Demanda';
  body?: string;
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
