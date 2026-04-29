import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { errorLegend, templates } from './data';
import {
  buildEnrichedTemplates,
  buildErrorSummary,
  buildRootCauseSummary,
  formatNumber,
  getShortName,
  pct,
} from './utils';

function getBadgeClass(tipo) {
  return tipo === 'Marketing' ? 'badge badge-marketing' : 'badge badge-utility';
}

function getPerformanceClass(performance) {
  if (performance === 'Alta') return 'template-card template-high';
  if (performance === 'Média') return 'template-card template-medium';
  return 'template-card template-low';
}

function getSeverityClass(severidade) {
  if (severidade === 'Alta') return 'severity severity-high';
  if (severidade === 'Média') return 'severity severity-medium';
  return 'severity severity-low';
}

function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>;
}

function MetricCard({ title, value, description, icon }) {
  return (
    <Card className="metric-card">
      <div>
        <p className="muted small">{title}</p>
        <p className="metric-value">{value}</p>
        <p className="muted xsmall">{description}</p>
      </div>
      <div className="metric-icon" aria-hidden="true">{icon}</div>
    </Card>
  );
}

function SectionHeader({ title, description, badge }) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        {description ? <p className="muted">{description}</p> : null}
      </div>
      {badge ? <span className="section-badge">{badge}</span> : null}
    </div>
  );
}

function ErrorTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;

  return (
    <div className="chart-tooltip">
      <div className="tooltip-top">
        <div>
          <p className="muted xsmall">Código de erro</p>
          <p className="tooltip-code">{data.codigo}</p>
        </div>
        <span className={getSeverityClass(data.severidade)}>{data.severidade}</span>
      </div>
      <p className="tooltip-title">{data.titulo}</p>
      <p><strong>Descrição:</strong> {data.significado}</p>
      <p><strong>Causa raiz:</strong> {data.causaRaiz}</p>
      <div className="tooltip-grid">
        <div><span>Qtd.</span><strong>{formatNumber(data.quantidade)}</strong></div>
        <div><span>Share</span><strong>{data.percentual}%</strong></div>
        <div><span>Templates</span><strong>{data.templatesAfetados}</strong></div>
      </div>
    </div>
  );
}

function KpiSection({ totals, topError }) {
  return (
    <div className="kpi-grid">
      <MetricCard title="Enviados" value={formatNumber(totals.enviados)} description="Volume total analisado" icon="📤" />
      <MetricCard title="Entregues" value={formatNumber(totals.entregues)} description={`${pct(totals.entregues, totals.enviados)}% de entrega`} icon="✅" />
      <MetricCard title="Lidas" value={formatNumber(totals.lidas)} description={`${pct(totals.lidas, totals.entregues)}% de leitura`} icon="👀" />
      <MetricCard title="Respostas" value={formatNumber(totals.respostas)} description={`${pct(totals.respostas, totals.entregues)}% de resposta`} icon="💬" />
      <MetricCard title="Erros" value={formatNumber(totals.erros)} description={`${topError?.codigo || '-'} é o mais frequente`} icon="⚠️" />
    </div>
  );
}

function PerformanceAndRanking({ performanceData, ranking }) {
  return (
    <section className="split-grid">
      <Card className="wide-card">
        <SectionHeader title="Taxa de leitura x taxa de resposta" description="Comparação percentual por template." />
        <div className="chart-box chart-large">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData} margin={{ top: 10, right: 16, left: -10, bottom: 95 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" angle={-35} textAnchor="end" interval={0} height={100} fontSize={10} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="leitura" name="Leitura %" radius={[6, 6, 0, 0]} fill="#64748b" />
              <Bar dataKey="resposta" name="Resposta %" radius={[6, 6, 0, 0]} fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Ranking por resposta" description="Templates com maior conversão relativa." />
        <div className="ranking-list">
          {ranking.map((template, index) => (
            <div key={template.nome} className="ranking-item">
              <div>
                <p>{index + 1}. {template.nome}</p>
                <span>{template.tipo}</span>
              </div>
              <strong>{template.taxaResposta}%</strong>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

function ErrorFrequencyDashboard({ errorSummary }) {
  return (
    <section className="card section-card">
      <SectionHeader
        title="Dashboard de erros por frequência"
        description="Consolidação dos códigos de erro que mais ocorreram nos templates analisados. Passe o mouse sobre o gráfico para ver a descrição, causa raiz e impacto de cada erro."
        badge="Ordenado por maior frequência"
      />
      <div className="error-dashboard-grid">
        <div className="chart-box chart-medium">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={errorSummary} layout="vertical" margin={{ top: 10, right: 24, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="codigo" width={70} />
              <Tooltip content={<ErrorTooltip />} />
              <Bar dataKey="quantidade" name="Ocorrências" radius={[0, 8, 8, 0]} fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="error-ranking">
          {errorSummary.map((error, index) => (
            <div key={error.codigo} className="error-rank-card">
              <div className="error-rank-top">
                <div>
                  <p className="muted xsmall">#{index + 1} mais frequente</p>
                  <h3>{error.codigo}</h3>
                </div>
                <span className={getSeverityClass(error.severidade)}>{error.severidade}</span>
              </div>
              <p className="error-title">{error.titulo}</p>
              <p className="muted xsmall">{error.causaRaiz}</p>
              <div className="mini-grid">
                <div><span>Qtd.</span><strong>{formatNumber(error.quantidade)}</strong></div>
                <div><span>Share</span><strong>{error.percentual}%</strong></div>
                <div><span>Templates</span><strong>{error.templatesAfetados}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RootCauseSection({ rootCauseSummary }) {
  return (
    <section className="card section-card">
      <SectionHeader
        title="Agrupamento de erros por causa raiz"
        description="Classificação dos erros por origem provável, facilitando a priorização entre ações de negócio, base de contatos, política da Meta e ajustes técnicos."
        badge="Visão estratégica"
      />
      <div className="root-grid">
        {rootCauseSummary.map((group) => (
          <div key={group.causaRaiz} className="root-card">
            <div className="root-top">
              <div>
                <p className="muted xsmall">Causa raiz</p>
                <h3>{group.causaRaiz}</h3>
              </div>
              {group.severidadeAlta > 0 ? <span className="severity severity-high">Alta</span> : null}
            </div>
            <div className="mini-grid two">
              <div><span>Ocorrências</span><strong>{formatNumber(group.quantidade)}</strong></div>
              <div><span>Share</span><strong>{group.percentual}%</strong></div>
            </div>
            <p className="muted xsmall">Códigos relacionados</p>
            <p className="related-codes">{group.codigos}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ErrorByTemplateAndType({ performanceData, typeData }) {
  return (
    <section className="split-grid">
      <Card className="wide-card">
        <SectionHeader title="Volume de erros por template" description="Indica quais templates concentram maior volume de falhas." />
        <div className="chart-box chart-medium">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData} margin={{ top: 10, right: 20, left: -10, bottom: 95 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" angle={-35} textAnchor="end" interval={0} height={100} fontSize={10} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="erros" name="Erros" strokeWidth={3} dot={{ r: 4 }} stroke="#dc2626" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Distribuição por tipo" description="Quantidade de templates por categoria." />
        <div className="chart-box chart-small">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={typeData} dataKey="value" nameKey="name" outerRadius={88} label>
                <Cell fill="#7c3aed" />
                <Cell fill="#2563eb" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="type-list">
          {typeData.map((item) => (
            <div key={item.name}><span>{item.name}</span><strong>{item.value}</strong></div>
          ))}
        </div>
      </Card>
    </section>
  );
}

function ErrorLegendSection() {
  return (
    <section className="card section-card">
      <SectionHeader
        title="Legenda dos códigos de erro"
        description="Área de referência para interpretar os erros retornados durante o envio dos templates."
        badge="Base: Meta / 360Dialog"
      />
      <div className="legend-grid">
        {Object.entries(errorLegend).map(([codigo, info]) => (
          <div key={codigo} className="legend-card">
            <div className="legend-top">
              <div>
                <p className="muted xsmall">Código</p>
                <h3>{codigo}</h3>
              </div>
              <span className={getSeverityClass(info.severidade)}>{info.severidade}</span>
            </div>
            <h4>{info.titulo}</h4>
            <p className="muted xsmall"><strong>Causa raiz:</strong> {info.causaRaiz}</p>
            <p><strong>Representa:</strong> {info.significado}</p>
            <p><strong>Ação:</strong> {info.acao}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TemplateCardsSection({ filtrados, tipoFiltro, setTipoFiltro, performanceFiltro, setPerformanceFiltro }) {
  return (
    <section className="card section-card">
      <div className="filters-header">
        <div>
          <h2>Cards por template</h2>
          <p className="muted">Visualização detalhada para apresentação e tomada de decisão.</p>
        </div>
        <div className="filters">
          {['Todos', 'Marketing', 'Utilidade'].map((tipo) => (
            <button key={tipo} className={tipoFiltro === tipo ? 'active' : ''} onClick={() => setTipoFiltro(tipo)}>{tipo}</button>
          ))}
          {['Todos', 'Alta', 'Média', 'Baixa'].map((performance) => (
            <button key={performance} className={performanceFiltro === performance ? 'active' : ''} onClick={() => setPerformanceFiltro(performance)}>{performance}</button>
          ))}
        </div>
      </div>

      <div className="templates-grid">
        {filtrados.map((template) => (
          <div key={template.nome} className={getPerformanceClass(template.performance)}>
            <div className="template-top">
              <div>
                <h3>{template.nome}</h3>
                <p className="muted xsmall">Atualizado em {template.atualizado}</p>
              </div>
              <span className={getBadgeClass(template.tipo)}>{template.tipo}</span>
            </div>
            <div className="template-metrics">
              <div><span>Enviados</span><strong>{formatNumber(template.enviados)}</strong></div>
              <div><span>Entregues</span><strong>{formatNumber(template.entregues)}</strong></div>
              <div><span>Lidas</span><strong>{formatNumber(template.lidas)} · {template.taxaLeitura}%</strong></div>
              <div><span>Respostas</span><strong>{formatNumber(template.respostas)} · {template.taxaResposta}%</strong></div>
            </div>
            <div className="error-tags">
              <p>⚠️ Erros</p>
              <div>
                {Object.entries(template.erros).length === 0 ? (
                  <span>Sem erros informados</span>
                ) : (
                  Object.entries(template.erros).map(([codigo, quantidade]) => (
                    <span key={codigo} className={codigo === '131031' ? 'danger-tag' : ''}>{codigo}: {quantidade}</span>
                  ))
                )}
              </div>
            </div>
            <div className="template-copy">
              <p><strong>Diagnóstico:</strong> {template.diagnostico}</p>
              <p><strong>Ação recomendada:</strong> {template.acao}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalInsights() {
  return (
    <section className="insights-grid">
      <Card className="insight success"><h3>O que escalar</h3><p>Templates de retomada e inatividade com alta taxa de resposta.</p></Card>
      <Card className="insight warning"><h3>O que investigar</h3><p>Templates com boa leitura e resposta zero, principalmente os operacionais.</p></Card>
      <Card className="insight danger"><h3>Risco principal</h3><p>Erros 131049 e 131031 devem ser monitorados por impacto em qualidade e continuidade do canal.</p></Card>
    </section>
  );
}

export default function App() {
  const [tipoFiltro, setTipoFiltro] = useState('Todos');
  const [performanceFiltro, setPerformanceFiltro] = useState('Todos');

  const enriched = useMemo(() => buildEnrichedTemplates(templates), []);
  const errorSummary = useMemo(() => buildErrorSummary(templates), []);
  const rootCauseSummary = useMemo(() => buildRootCauseSummary(errorSummary), [errorSummary]);

  const filtrados = enriched.filter(
    (template) =>
      (tipoFiltro === 'Todos' || template.tipo === tipoFiltro) &&
      (performanceFiltro === 'Todos' || template.performance === performanceFiltro),
  );

  const totals = enriched.reduce(
    (acc, template) => {
      acc.enviados += template.enviados;
      acc.entregues += template.entregues;
      acc.lidas += template.lidas;
      acc.respostas += template.respostas;
      acc.erros += template.totalErros;
      return acc;
    },
    { enviados: 0, entregues: 0, lidas: 0, respostas: 0, erros: 0 },
  );

  const performanceData = enriched.map((template) => ({
    nome: getShortName(template.nome),
    leitura: template.taxaLeitura,
    resposta: template.taxaResposta,
    erros: template.totalErros,
    tipo: template.tipo,
  }));

  const typeData = [
    { name: 'Marketing', value: enriched.filter((template) => template.tipo === 'Marketing').length },
    { name: 'Utilidade', value: enriched.filter((template) => template.tipo === 'Utilidade').length },
  ];

  const ranking = [...enriched].sort((a, b) => b.taxaResposta - a.taxaResposta).slice(0, 5);
  const topError = errorSummary[0];

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-inner">
          <div>
            <div className="eyebrow">📈 Análise de performance — últimos 90 dias</div>
            <h1>Dashboard de Templates WABA</h1>
            <p>Visão consolidada dos templates com métricas de envio, entrega, leitura, respostas, erros e recomendações para reduzir risco e melhorar conversão.</p>
          </div>
          <Card className="hero-card">
            <p>Resumo executivo</p>
            <h2>Marketing performa melhor; utilidade precisa de revisão.</h2>
            <span>Templates de utilidade possuem leitura relevante, mas registram resposta zero, indicando oportunidade de ajuste de copy, CTA e mensuração.</span>
          </Card>
        </div>
      </header>

      <main className="container">
        <KpiSection totals={totals} topError={topError} />
        <PerformanceAndRanking performanceData={performanceData} ranking={ranking} />
        <ErrorFrequencyDashboard errorSummary={errorSummary} />
        <RootCauseSection rootCauseSummary={rootCauseSummary} />
        <ErrorByTemplateAndType performanceData={performanceData} typeData={typeData} />
        <ErrorLegendSection />
        <TemplateCardsSection
          filtrados={filtrados}
          tipoFiltro={tipoFiltro}
          setTipoFiltro={setTipoFiltro}
          performanceFiltro={performanceFiltro}
          setPerformanceFiltro={setPerformanceFiltro}
        />
        <FinalInsights />
      </main>
    </div>
  );
}
