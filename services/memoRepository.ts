import { Memo } from '../types';
import { supabase } from './supabaseClient';

type MemoRow = {
  id: string;
  tipo: string;
  numero_seq: number;
  ano: number;
  numero_formatado: string | null;
  data_criacao: string | null;
  assunto: string;
  corpo: string | null;
  prazo_resposta: string | null;
  status: string | null;
  app_tipo: Memo['type'];
  payload: Partial<Memo> | null;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const statusToDb = (status?: string) => {
  const normalized = (status || '').toUpperCase();
  if (normalized === 'ASSINADO') return 'assinado';
  if (normalized === 'BAIXADO' || normalized === 'DOWNLOAD' || normalized === 'ENCAMINHADO') return 'enviado';
  if (normalized === 'ARQUIVADO' || normalized === 'CANCELADO') return 'cancelado';
  if (normalized === 'PENDENTE') return 'aguardando_assinatura';
  return 'rascunho';
};

const toIsoDate = (date?: string) => {
  if (!date) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  if (date.includes('/')) {
    const [day, month, year] = date.split('/');
    if (day && month && year) return `${year}-${month}-${day}`;
  }
  return null;
};

const parseProcess = (processNumber?: string, fallbackDate?: string) => {
  const match = processNumber?.match(/(\d+)/);
  const yearMatch = processNumber?.match(/(?:^|\/)(20\d{2})(?:\/|$)/);
  const dateYear = toIsoDate(fallbackDate)?.slice(0, 4);

  return {
    seq: match ? Number(match[1]) : 0,
    year: Number(yearMatch?.[1] || dateYear || new Date().getFullYear()),
  };
};

const attachmentNames = (attachments: Memo['attachments']) =>
  (attachments || []).map((attachment) => ({
    name: attachment.name,
    url: attachment.url,
  }));

const serializeMemo = (memo: Memo): Memo => ({
  ...memo,
  attachments: attachmentNames(memo.attachments),
  fileUrl: memo.fileUrl?.startsWith('blob:') ? undefined : memo.fileUrl,
});

const rowToMemo = (row: MemoRow): Memo => {
  const payload = row.payload || {};

  return {
    processNumber: row.numero_formatado || payload.processNumber || '',
    subject: row.assunto || payload.subject || '',
    type: row.app_tipo || payload.type || 'INTERNO',
    status: payload.status || row.status || 'RASCUNHO',
    date: payload.date || row.data_criacao || '',
    deadline: payload.deadline || row.prazo_resposta || '',
    sender: payload.sender || '',
    recipient: payload.recipient || '',
    institution: payload.institution || 'SERAI',
    content: payload.content || row.corpo || '',
    ...payload,
    id: row.id,
    year: payload.year || String(row.ano || new Date().getFullYear()),
  };
};

export const listMemos = async () => {
  const { data, error } = await supabase
    .from('memorandos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return ((data || []) as MemoRow[]).map(rowToMemo);
};

export const saveMemo = async (memo: Memo) => {
  const cleanMemo = serializeMemo(memo);
  const { seq, year } = parseProcess(cleanMemo.processNumber, cleanMemo.date);

  const row = {
    tipo: 'memorando',
    numero_seq: seq,
    ano: year,
    numero_formatado: cleanMemo.processNumber || null,
    data_criacao: toIsoDate(cleanMemo.date),
    assunto: cleanMemo.subject,
    corpo: cleanMemo.content || cleanMemo.body || null,
    prazo_resposta: toIsoDate(cleanMemo.deadline),
    status: statusToDb(cleanMemo.status),
    app_tipo: cleanMemo.type,
    payload: cleanMemo,
  };

  const query = UUID_RE.test(cleanMemo.id)
    ? supabase.from('memorandos').update(row).eq('id', cleanMemo.id).select('*').single()
    : supabase.from('memorandos').insert(row).select('*').single();

  const { data, error } = await query;
  if (error) throw error;

  return rowToMemo(data as MemoRow);
};

export const getNextInternalMemoNumber = async (year = new Date().getFullYear()) => {
  const { data, error } = await supabase
    .from('memorandos')
    .select('numero_seq')
    .eq('app_tipo', 'INTERNO')
    .eq('ano', year)
    .gt('numero_seq', 0)
    .order('numero_seq', { ascending: false })
    .limit(1);

  if (error) throw error;

  const current = data?.[0]?.numero_seq || 0;
  const next = current + 1;

  return {
    seq: next,
    year,
    processNumber: `${String(next).padStart(3, '0')}/${year}`,
  };
};

export const makeMemoOfficial = async (memo: Memo) => {
  if (memo.processNumber) {
    return saveMemo({ ...memo, status: memo.status || 'BAIXADO' });
  }

  const year = Number(toIsoDate(memo.date)?.slice(0, 4) || new Date().getFullYear());
  const official = await getNextInternalMemoNumber(year);

  return saveMemo({
    ...memo,
    processNumber: official.processNumber,
    status: 'BAIXADO',
    history: [{
      id: crypto.randomUUID(),
      action: `Número oficial ${official.processNumber} gerado no download`,
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      userName: 'Patrícia Berezowski',
      userRole: 'Administrador',
    }, ...(memo.history || [])],
  });
};

export const uploadSignedMemo = async (memo: Memo, file: File) => {
  const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
  const filePath = `${memo.id}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from('memorandos_assinados')
    .upload(filePath, file, {
      contentType: file.type || 'application/pdf',
      upsert: true,
    });

  if (uploadError) throw uploadError;

  return saveMemo({
    ...memo,
    status: 'ASSINADO',
    hasSignedPdf: true,
    fileName: file.name,
    signedFilePath: filePath,
    history: [{
      id: crypto.randomUUID(),
      action: 'Upload do memorando assinado',
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      userName: 'Patrícia Berezowski',
      userRole: 'Administrador',
    }, ...(memo.history || [])],
  });
};

export const getSignedMemoUrl = async (filePath: string) => {
  const { data, error } = await supabase.storage
    .from('memorandos_assinados')
    .createSignedUrl(filePath, 60);

  if (error) throw error;
  return data.signedUrl;
};
