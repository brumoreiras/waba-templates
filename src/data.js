export const errorLegend = {
  '131000': {
    titulo: 'Erro desconhecido / falha genérica',
    significado: 'A requisição não foi processada corretamente pela API ou ocorreu uma falha não categorizada.',
    impacto: 'Pode impedir a entrega da mensagem e exige análise técnica do payload, logs e tentativa de reprocessamento.',
    acao: 'Validar payload, parâmetros enviados e logs do provedor antes de reenviar.',
    severidade: 'Média',
    causaRaiz: 'Implementação / Payload',
  },
  '131026': {
    titulo: 'Mensagem não entregue (Message Undeliverable)',
    significado:
      'A mensagem não pôde ser entregue ao destinatário. Geralmente está relacionada ao número do usuário, e não à configuração técnica do envio. Pode ocorrer quando o número não possui WhatsApp, está inativo, bloqueou o contato ou não aceitou os termos do app.',
    impacto: 'Impacta diretamente a entregabilidade e indica oportunidade de higienização da base de contatos.',
    acao: 'Higienizar a base de contatos, remover números inválidos e evitar reenvio para usuários inativos.',
    severidade: 'Média',
    causaRaiz: 'Base de contatos / Destinatário',
  },
  '131031': {
    titulo: 'Conta restrita ou bloqueada',
    significado: 'A conta do WhatsApp Business foi restringida ou desabilitada por possível violação de política.',
    impacto: 'Alto risco operacional, pois pode afetar envio, reputação, Quality Rating e continuidade do canal.',
    acao: 'Verificar suporte do Business Manager, revisar políticas, reclamações, bloqueios e abrir tratativa com Meta/360Dialog.',
    severidade: 'Alta',
    causaRaiz: 'Política / Restrição Meta',
  },
  '131049': {
    titulo: 'Entrega bloqueada pela Meta',
    significado: 'A Meta optou por não entregar a mensagem para preservar a qualidade do ecossistema de mensagens.',
    impacto: 'Pode indicar baixa qualidade, baixa relevância, excesso de frequência ou limite de marketing por usuário.',
    acao: 'Revisar categoria, copy, personalização, opt-in, segmentação e frequência de envio.',
    severidade: 'Alta',
    causaRaiz: 'Política / Qualidade Meta',
  },
  '131055': {
    titulo: 'Method not allowed — somente templates de marketing permitidos',
    significado:
      'A requisição foi rejeitada porque o tipo de mensagem enviado não é permitido nesse contexto. Ocorre ao tentar enviar uma mensagem que não é de marketing, como utilidade, autenticação ou mensagem livre, em um endpoint ou fluxo que aceita apenas templates de marketing.',
    impacto: 'Bloqueia totalmente o envio da mensagem e indica erro de uso da API ou categorização incorreta do template.',
    acao: 'Garantir que o template utilizado seja da categoria Marketing, validar o tipoTemplate e usar o endpoint correto.',
    severidade: 'Alta',
    causaRaiz: 'Implementação / Categoria do template',
  },
  '130472': {
    titulo: 'Número em experimento da Meta',
    significado: 'O número do usuário faz parte de um experimento conduzido pela Meta/WhatsApp.',
    impacto: 'Normalmente não indica problema do template ou da integração. É uma condição controlada pela Meta.',
    acao: 'Registrar ocorrência, separar da análise de qualidade e tentar novamente futuramente.',
    severidade: 'Baixa',
    causaRaiz: 'Experimento Meta / Fora de controle',
  },
};

export const templates = [
  {
    nome: 'retomar_atendimento_2', tipo: 'Marketing', atualizado: '11/09/2024', enviados: 3100, entregues: 3100, lidas: 1700, respostas: 1100,
    erros: { '131049': 205, '130472': 51, '131026': 9, '131031': 8 },
    diagnostico: 'Boa performance de resposta, porém com volume relevante de falhas de entrega.',
    acao: 'Manter o uso, revisar base de contatos e monitorar bloqueios.',
  },
  {
    nome: 'retomar_atendimento_1', tipo: 'Marketing', atualizado: '19/09/2025', enviados: 2000, entregues: 2000, lidas: 1300, respostas: 1300,
    erros: { '131049': 105, '131026': 14, '130472': 31, '131031': 12 },
    diagnostico: 'Template com melhor taxa de resposta entre os modelos de alto volume.',
    acao: 'Usar como referência para novos modelos de retomada.',
  },
  {
    nome: 'iniciar_atendimento_geral', tipo: 'Utilidade', atualizado: '11/09/2024', enviados: 1800, entregues: 1800, lidas: 1200, respostas: 0,
    erros: { '131055': 84, '131026': 40, '131031': 20 },
    diagnostico: 'Boa leitura, mas sem geração de resposta; CTA possivelmente pouco efetivo.',
    acao: 'Reescrever copy e CTA, testando botões mais objetivos.',
  },
  {
    nome: 'iniciar_atendimento_reabastecimento', tipo: 'Utilidade', atualizado: '12/09/2024', enviados: 1400, entregues: 1400, lidas: 800, respostas: 0,
    erros: { '131055': 52, '131031': 10, '131026': 48 },
    diagnostico: 'Leitura abaixo do benchmark informado e nenhuma resposta registrada.',
    acao: 'Revisar mensagem, contexto de envio e segmentação.',
  },
  {
    nome: 'iniciar_atendimento_com_pedido', tipo: 'Utilidade', atualizado: '02/10/2024', enviados: 1100, entregues: 1100, lidas: 626, respostas: 0,
    erros: { '131055': 62, '131026': 53, '131031': 11, '131000': 1 },
    diagnostico: 'Baixa conversão apesar do contexto de pedido, com erros técnicos recorrentes.',
    acao: 'Priorizar revisão por ser template operacional com alto potencial.',
  },
  {
    nome: 'bot_atendimento_inicio', tipo: 'Utilidade', atualizado: '27/03/2025', enviados: 499, entregues: 499, lidas: 347, respostas: 0,
    erros: { '131026': 3 },
    diagnostico: 'Boa taxa de leitura, mas sem resposta capturada.',
    acao: 'Validar se a interação do botão está sendo mensurada corretamente.',
  },
  {
    nome: 'bot_orcamento_sugestao', tipo: 'Utilidade', atualizado: '28/03/2025', enviados: 415, entregues: 415, lidas: 293, respostas: 0,
    erros: { '131000': 2 },
    diagnostico: 'Boa leitura, porém sem resposta; baixo volume de erro.',
    acao: 'Ajustar CTA e acompanhar em novo ciclo de medição.',
  },
  {
    nome: 'bot_orcamento_pronto', tipo: 'Utilidade', atualizado: '18/03/2025', enviados: 312, entregues: 312, lidas: 224, respostas: 0,
    erros: {},
    diagnostico: 'Boa leitura e ausência de erros informados, mas sem resposta registrada.',
    acao: 'Investigar mensuração de resposta e clareza da chamada para ação.',
  },
  {
    nome: 'bot_inatividade_1_nova', tipo: 'Marketing', atualizado: '31/03/2025', enviados: 262, entregues: 262, lidas: 162, respostas: 218,
    erros: { '131026': 3, '131049': 2 },
    diagnostico: 'Melhor taxa de resposta relativa, mesmo com volume menor.',
    acao: 'Escalar com cautela e usar como referência de copy.',
  },
  {
    nome: 'bot_inatividade_2_new', tipo: 'Utilidade', atualizado: '31/03/2025', enviados: 125, entregues: 125, lidas: 87, respostas: 0,
    erros: { '131026': 2 },
    diagnostico: 'Boa leitura, mas sem resposta; baixo volume analisado.',
    acao: 'Revisar proposta da mensagem antes de escalar volume.',
  },
  {
    nome: 'bot_setores_main', tipo: 'Utilidade', atualizado: '04/04/2025', enviados: 12, entregues: 12, lidas: 8, respostas: 0,
    erros: {},
    diagnostico: 'Volume muito baixo para conclusão estatística.',
    acao: 'Manter em observação até obter amostra maior.',
  },
  {
    nome: 'confirmacao_recebimento', tipo: 'Utilidade', atualizado: '11/09/2024', enviados: 11, entregues: 11, lidas: 8, respostas: 0,
    erros: { '131026': 5, '131055': 1 },
    diagnostico: 'Volume baixo, porém erro 131026 proporcionalmente alto.',
    acao: 'Avaliar base antes de considerar problema de template.',
  },
];
