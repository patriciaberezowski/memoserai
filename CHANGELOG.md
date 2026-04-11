# Histórico de Desenvolvimento - SERAI Memorandos

Este documento consolida todas as implementações, correções e padronizações realizadas no sistema até o presente momento (Fevereiro de 2026). Serve como uma memória contínua do projeto para garantir a manutenção do fluxo e contexto do desenvolvimento.

## Funcionalidades e Telas
### Dashboard e KPIs
- Implementação inicial das caixinhas numéricas (KPIs) no topo do Dashboard.
- As caixinhas do Dashboard agora são clicáveis e filtram automaticamente a listagem de Memos (Ex: Clicar em "Pendentes" redireciona para a lista já filtrada).

### Listagem de Memorandos (Internos e Externos)
- Lógica avançada para cálculo das caixas superiores (Total, Pendentes, Vencidos, Respondidos/Resolvidos) de acordo com os filtros aplicados em tempo real na listagem.
- **Filtros Dinâmicos**: Barra de pesquisa avançada por Status, Data, Remetente/Área, Destinatário e botão de limpeza de critérios.
- **Ordenação Nativa**: Decrescente pelo Ano e, em seguida, pelo Número, dando prioridade visual aos Rascunhos do topo.

### Status e Regras de Negócio
- Implementada a hierarquia rigorosa de status temporais dos Memorandos **Internos**:
  - `RASCUNHO`: Inicial, sem número emitido (crachá cinza).
  - `DOWNLOAD`: Rascunho que recebeu número (crachá azul/roxo).
  - `ASSINADO`: Arquivo anexado digitalmente (crachá verde limão).
  - `RESOLVIDO`: Concluído.
- Padronizada a nomenclatura de Status de conclusão dos Memorandos **Externos**, alterando de "Arquivado" para "Resolvido", unificando o conceito com a modalidade interna em todo o sistema (filtros, formulário e visualização).

---

## Correções e Melhorias (Bugfixes)

### 1. Geração de Mem. Rascunhos via IA (Gemini)
- A tela falhava de forma não-responsiva ao invocar a IA para gerar textos caso houvesse instabilidade de rede ou erro na credencial.
- O botão (que estava agindo como submit) foi corrigido para não enviar a página acidentalmente.
- O método de importação de credenciais foi adaptado corretamente para uso com Vite (`import.meta.env`).
- **Modo Simulação (Fallback)**: Implementou-se um mock automático se faltar a chave de API local no arquivo `.env`. Em vez do sistema quebrar na máquina local do mock, uma resposta textual simulando um documento preenchido é injetada para destravar a experimentação na tela.
- Os alertas (errors) agora notificam o usuário nativamente utilizando o `alert()`.

### 2. Upload de Aquivos (PDF) em Memorandos Externos
- A simulação de um arquivo PDF anexado no formulário não exibia sinais visuais de sucesso. O front-end não retinha a exibição daquele arquivo.
- Ajustado o estado local da tela de ExternalMemo para interpretar o evento do input `<input type="file">`.
- Agora o form exibe uma caixa verde traçejada com o respectivo tamanho convertido em Megabytes e botões customizados quando um arquivo entra em cache.

### 3. Persistência de Sessão & Download do PDF (Mock)
- Como a plataforma opera em um front-end Mockado sem backend, o anexo desaparecia.
- Implementado um cache de vida temporário (Sessão): a plataforma usa o truque de salvar interinamente um `URL.createObjectURL(file)` dentro do objeto da tabela na memória crua.
- Modos "Edição de Memo" e "Listagem Geral" agora exibem um ícone interativo de Download para permitir a devolução (salvamento de volta na máquina) do arquivo mockado.

---

## Novos Campos e Formulários

### Data de Recebimento (Externos)
- Uma demanda real da Secretaria demandava saber além de quando o documento foi emitido na origem, quando ele atracou no setor de Protocolo.
- Adicionado o campo `receiptDate` à estrutura principal do Typescript.
- Inserção do input obrigatório "Data de Recebimento" na interface gráfica do formulário para o registro fiel no balcão da unidade de destinação.
- Reforço visual de exibição na tela isolada de Detalhes (`ExternalMemoView`).

---
_Documento gerado como registro vivo do desenvolvimento contínuo local do App (Fev/26)._
