import { Usuario } from '../types';
import { supabase } from './supabaseClient';

type AllowlistRow = {
  id: string;
  email: string;
  nome: string | null;
  role: string | null;
  ativo: boolean | null;
  payload: Partial<Usuario> | null;
};

const rowToUser = (row: AllowlistRow): Usuario => {
  const payload = row.payload || {};

  return {
    id: row.id,
    nomeCompleto: payload.nomeCompleto || row.nome || row.email,
    cargo: payload.cargo || '',
    email: row.email,
    whatsapp: payload.whatsapp || '',
    areaId: payload.areaId || '',
    isSignatario: !!payload.isSignatario,
    status: row.ativo === false || payload.status === 'Arquivado' ? 'Arquivado' : 'Ativo',
  };
};

const userToPayload = (user: Usuario) => ({
  nomeCompleto: user.nomeCompleto,
  cargo: user.cargo,
  whatsapp: user.whatsapp,
  areaId: user.areaId,
  isSignatario: user.isSignatario,
  status: user.status || 'Ativo',
});

export const listUsers = async () => {
  const { data, error } = await supabase
    .from('allowlist_users')
    .select('id,email,nome,role,ativo,payload')
    .order('nome', { ascending: true });

  if (error) throw error;
  return ((data || []) as AllowlistRow[]).map(rowToUser);
};

export const saveUser = async (user: Usuario) => {
  const email = user.email.trim().toLowerCase();

  const { data, error } = await supabase
    .from('allowlist_users')
    .upsert({
      id: user.id.includes('-') && user.id.length === 36 ? user.id : undefined,
      email,
      nome: user.nomeCompleto,
      role: 'user',
      ativo: user.status !== 'Arquivado',
      payload: userToPayload({ ...user, email }),
    }, { onConflict: 'email' })
    .select('id,email,nome,role,ativo,payload')
    .single();

  if (error) throw error;
  return rowToUser(data as AllowlistRow);
};

export const archiveUser = async (user: Usuario, archived: boolean) => {
  return saveUser({
    ...user,
    status: archived ? 'Arquivado' : 'Ativo',
  });
};

export const deleteUser = async (id: string) => {
  const { error } = await supabase
    .from('allowlist_users')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
