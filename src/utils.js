import { errorLegend } from './data';

export const formatNumber = (value) => new Intl.NumberFormat('pt-BR').format(value);
export const pct = (num, den) => (den ? Math.round((num / den) * 100) : 0);

export function getPerformance(template) {
  const taxaResposta = pct(template.respostas, template.entregues);
  if (taxaResposta > 40) return 'Alta';
  if (taxaResposta > 0) return 'Média';
  return 'Baixa';
}

export function buildEnrichedTemplates(items) {
  return items.map((template) => ({
    ...template,
    taxaLeitura: pct(template.lidas, template.entregues),
    taxaResposta: pct(template.respostas, template.entregues),
    totalErros: Object.values(template.erros || {}).reduce((total, value) => total + value, 0),
    performance: getPerformance(template),
  }));
}

export function buildErrorSummary(items) {
  const totals = {};

  items.forEach((template) => {
    Object.entries(template.erros || {}).forEach(([codigo, quantidade]) => {
      const legend = errorLegend[codigo] || {};
      if (!totals[codigo]) {
        totals[codigo] = {
          codigo,
          quantidade: 0,
          templatesAfetados: 0,
          titulo: legend.titulo || 'Erro não mapeado',
          severidade: legend.severidade || 'Média',
          significado: legend.significado || 'Descrição não mapeada.',
          impacto: legend.impacto || 'Impacto não mapeado.',
          acao: legend.acao || 'Avaliar logs e documentação do provedor.',
          causaRaiz: legend.causaRaiz || 'Não classificado',
        };
      }

      totals[codigo].quantidade += quantidade;
      totals[codigo].templatesAfetados += 1;
    });
  });

  const totalErros = Object.values(totals).reduce((total, item) => total + item.quantidade, 0);

  return Object.values(totals)
    .map((item) => ({ ...item, percentual: pct(item.quantidade, totalErros) }))
    .sort((a, b) => b.quantidade - a.quantidade);
}

export function buildRootCauseSummary(errorSummary) {
  const grouped = {};

  errorSummary.forEach((error) => {
    const groupName = error.causaRaiz || 'Não classificado';

    if (!grouped[groupName]) {
      grouped[groupName] = {
        causaRaiz: groupName,
        quantidade: 0,
        codigos: [],
        severidadeAlta: 0,
      };
    }

    grouped[groupName].quantidade += error.quantidade;
    grouped[groupName].codigos.push(error.codigo);
    if (error.severidade === 'Alta') grouped[groupName].severidadeAlta += 1;
  });

  const total = Object.values(grouped).reduce((acc, item) => acc + item.quantidade, 0);

  return Object.values(grouped)
    .map((item) => ({ ...item, percentual: pct(item.quantidade, total), codigos: item.codigos.sort().join(', ') }))
    .sort((a, b) => b.quantidade - a.quantidade);
}

export function getShortName(name) {
  return name.replace('iniciar_atendimento_', 'inicio_').replace('retomar_atendimento_', 'retomar_');
}
