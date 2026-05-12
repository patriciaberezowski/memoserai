import { AreaInterna, Usuario, Autarquia, Memo } from '../types';

export const mockInternalMemos: Memo[] = [
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

export const mockExternalMemos: Memo[] = [
  { id: '4', processNumber: '003/2026', year: '2026', subject: 'Informações sobre cartões de visitas', type: 'EXTERNO', status: 'PENDENTE', date: '15/02/2026', deadline: '23/02/2026', sender: 'SECOM', recipient: 'ASCOM', institution: 'SECOM', content: '', hasSignedPdf: true },
  { id: '5', processNumber: '042/2026', year: '2026', subject: 'Levantamento de sistemas para contratação', type: 'EXTERNO', status: 'CONCLUIDO', date: '10/02/2026', deadline: '28/02/2026', sender: 'CODEMAR', recipient: 'Gabinete', institution: 'CODEMAR', content: '', hasSignedPdf: true },
];

export const mockExtraMemos: Memo[] = [
  { id: '100', processNumber: '58A/2026/SERAI/PMM', year: '2026', subject: 'Ata de registro extra', type: 'EXTRA', status: 'PENDENTE', date: '12/05/2026', deadline: '20/05/2026', sender: 'SERAI', recipient: 'SECOM', institution: 'SERAI', content: '', responsibleArea: 'Gabinete', signer: 'Ivana Cristina de Melo Moura', category: 'Demanda', hasSignedPdf: true },
];

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
    { id: 'area-1', nome: 'Gabinete', sigla: 'GAB' },
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
        isSignatario: false
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
