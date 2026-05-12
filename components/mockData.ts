import { AreaInterna, Usuario, Autarquia } from '../types';

export const INITIAL_AUTARQUIAS: Autarquia[] = [
    {
        id: 'aut-1',
        nome: 'Serviço de Obras de Maricá',
        sigla: 'SOMAR',
        responsavel: 'Presidente da Autarquia'
    },
    {
        id: 'aut-2',
        nome: 'Companhia de Desenvolvimento de Maricá',
        sigla: 'CODEMAR',
        responsavel: 'Presidente'
    }
];

export const INITIAL_AREAS: AreaInterna[] = [
    { id: 'area-1', nome: 'Gabinete da Secretária', sigla: 'GAB' },
    { id: 'area-2', nome: 'Subsecretaria Executiva', sigla: 'SUBEX' },
    { id: 'area-3', nome: 'Coordenadoria de Tecnologia', sigla: 'COTEC' },
    { id: 'area-4', nome: 'Departamento de Recursos Humanos', sigla: 'DRH' },
    { id: 'area-5', nome: 'Setor de Protocolo e Arquivo', sigla: 'PROT' },
];

export const INITIAL_USUARIOS: Usuario[] = [
    {
        id: 'usr-1',
        nomeCompleto: 'Ivana Cristina de Melo Moura',
        cargo: 'Secretária',
        email: 'ivana.moura@marica.rj.gov.br',
        whatsapp: '(21) 99999-0001',
        areaId: 'area-1',
        isSignatario: true
    },
    {
        id: 'usr-2',
        nomeCompleto: 'João Carlos da Silva',
        cargo: 'Subsecretário Executivo',
        email: 'joao.silva@marica.rj.gov.br',
        whatsapp: '(21) 99999-0002',
        areaId: 'area-2',
        isSignatario: true
    },
    {
        id: 'usr-3',
        nomeCompleto: 'Maria Eduarda Fernandes',
        cargo: 'Coordenadora de Tecnologia',
        email: 'maria.fernandes@marica.rj.gov.br',
        whatsapp: '(21) 99999-0003',
        areaId: 'area-3',
        isSignatario: false
    },
    {
        id: 'usr-4',
        nomeCompleto: 'Roberto Santos Almeida',
        cargo: 'Analista de Sistemas',
        email: 'roberto.almeida@marica.rj.gov.br',
        whatsapp: '(21) 99999-0004',
        areaId: 'area-3',
        isSignatario: false
    },
    {
        id: 'usr-5',
        nomeCompleto: 'Ana Luiza Peixoto',
        cargo: 'Diretora de RH',
        email: 'ana.peixoto@marica.rj.gov.br',
        whatsapp: '(21) 99999-0005',
        areaId: 'area-4',
        isSignatario: false
    }
];
