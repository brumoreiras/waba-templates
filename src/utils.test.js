import { describe, expect, it } from 'vitest';
import { templates } from './data';
import { buildEnrichedTemplates, buildErrorSummary, buildRootCauseSummary, pct } from './utils';

describe('utils', () => {
  it('calcula percentual com denominador válido e zero', () => {
    expect(pct(5, 10)).toBe(50);
    expect(pct(1, 0)).toBe(0);
  });

  it('enriquece templates com taxas e performance', () => {
    const [alta, baixa, media] = buildEnrichedTemplates([
      { enviados: 10, entregues: 10, lidas: 7, respostas: 5, erros: { a: 1, b: 2 } },
      { enviados: 10, entregues: 0, lidas: 0, respostas: 0, erros: {} },
      { enviados: 100, entregues: 100, lidas: 60, respostas: 1, erros: {} },
    ]);

    expect(alta.taxaLeitura).toBe(70);
    expect(alta.taxaResposta).toBe(50);
    expect(alta.totalErros).toBe(3);
    expect(alta.performance).toBe('Alta');
    expect(baixa.performance).toBe('Baixa');
    expect(media.performance).toBe('Média');
  });

  it('agrupa erros por frequência', () => {
    const summary = buildErrorSummary([
      { erros: { '131026': 2, '131031': 1 } },
      { erros: { '131026': 3 } },
    ]);

    expect(summary[0].codigo).toBe('131026');
    expect(summary[0].quantidade).toBe(5);
    expect(summary[0].percentual).toBe(83);
    expect(summary[0].causaRaiz).toBe('Base de contatos / Destinatário');
  });

  it('agrupa erros por causa raiz', () => {
    const summary = buildErrorSummary([
      { erros: { '131026': 2, '131031': 1 } },
      { erros: { '131026': 3 } },
    ]);
    const grouped = buildRootCauseSummary(summary);

    expect(grouped[0].quantidade).toBe(5);
    expect(grouped[0].causaRaiz).toBe('Base de contatos / Destinatário');
  });

  it('processa todos os templates reais', () => {
    const enriched = buildEnrichedTemplates(templates);
    const errors = buildErrorSummary(templates);

    expect(enriched.length).toBe(templates.length);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].quantidade).toBeGreaterThan(errors[errors.length - 1].quantidade);
  });
});
