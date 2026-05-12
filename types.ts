
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
  MEMOS_EXTRA = 'MEMOS_EXTRA',
  MEMOS_EXTRA_NEW = 'MEMOS_EXTRA_NEW',
  MEMOS_EXTRA_VIEW = 'MEMOS_EXTRA_VIEW',
  MEMOS_EXTRA_EDIT = 'MEMOS_EXTRA_EDIT',
  REPORTS = 'REPORTS',
  REGISTERS_SECRETARIAS = 'REGISTERS_SECRETARIAS',
  REGISTERS_AUTARQUIAS = 'REGISTERS_AUTARQUIAS',
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
  EXTRA_MEMOS: AppView.MEMOS_EXTRA,
  NEW_EXTRA_MEMO: AppView.MEMOS_EXTRA_NEW,
  VIEW_EXTRA_MEMO: AppView.MEMOS_EXTRA_VIEW,
  EDIT_EXTRA_MEMO: AppView.MEMOS_EXTRA_EDIT,
  LOGS: AppView.AUDIT_LOGS
};

export interface Memo {
  id: string;
  processNumber: string;
  subject: string;
  type: 'INTERNO' | 'EXTERNO' | 'EXTRA';
  status: 'PENDENTE' | 'CONCLUIDO' | 'RESPONDIDO' | 'EXPIRADO' | 'ENCAMINHADO' | 'ARQUIVADO' | 'RASCUNHO' | 'DOWNLOAD' | 'ASSINADO' | 'VENCIDO' | 'RESOLVIDO' | string;
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
  signedFilePath?: string;
  destinos?: {
      tipo: 'Secretaria' | 'Autarquia';
      orgao: string;
      nome: string;
      cargo: string;
  }[];

  // Novos campos Internos e Externos Adicionais
  receiptDate?: string;
  receiptTime?: string;
  receiverName?: string;
  needsReply?: boolean;
  internalDeadline?: string;
  responsibleUsers?: string[];
  recipientName?: string;
  recipientRole?: string;
  responsibleArea?: string;
  signer?: string;
  signerRole?: string;
  hasSignedPdf?: boolean;
  category?: 'Informativo' | 'Demanda';
  body?: string;
  attachments?: { name: string, url?: string }[];
  history?: MemoHistoryEntry[];
}

export interface MemoHistoryEntry {
  id: string;
  action: string;
  date: string;
  time: string;
  userName: string;
  userRole: string;
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

export interface Secretaria {
  id: string;
  pasta: string;
  isFemaleSecretary: boolean;
  responsavel: string;
  quemSao: string;
  oqueFazem: string;
  enderecos: string[];
  telefones: string[];
  ramais: string[];
  emails: string[];
}

export interface AreaInterna {
  id: string;
  nome: string;
  sigla: string;
}

export interface Usuario {
  id: string;
  nomeCompleto: string;
  cargo: string;
  email: string;
  whatsapp: string;
  areaId: string;
  isSignatario: boolean;
  senha?: string;
  status?: 'Ativo' | 'Arquivado';
}

export interface Autarquia {
  id: string;
  nome: string;
  sigla: string;
  responsavel: string;
}
