# Dashboard Templates WABA

Landing page em React + Vite para análise de performance de templates WhatsApp/WABA nos últimos 90 dias.

## O que contém

- KPIs gerais de envio, entrega, leitura, resposta e erros.
- Dashboard de erros por frequência com tooltip explicativo.
- Agrupamento de erros por causa raiz.
- Legenda dos códigos de erro.
- Gráficos de leitura, resposta, distribuição por tipo e volume de erros.
- Cards por template com filtros por tipo e performance.
- Testes unitários para funções de cálculo e agrupamento.

## Como rodar no VSCode

```bash
npm install
npm run dev
```

Depois, acesse a URL exibida no terminal, normalmente:

```bash
http://localhost:5173
```

## Como compilar para publicação

```bash
npm run build
```

O build será gerado na pasta `dist`.

## Como visualizar o build localmente

```bash
npm run preview
```

## Como rodar os testes

```bash
npm test
```

## Publicar no GitHub

```bash
git init
git add .
git commit -m "feat: adiciona dashboard de templates WABA"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
git push -u origin main
```

## Publicar no GitHub Pages

Após subir no GitHub, você pode publicar usando GitHub Pages, Vercel ou Netlify. Para Vite, em alguns cenários de GitHub Pages pode ser necessário configurar `base` no `vite.config.js` caso o projeto seja publicado em subdiretório.
