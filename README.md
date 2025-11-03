# VerdeVivo — ONG Ambiental (Demo)

Projeto exemplo para entrega acadêmica (EX02 / EX03 / EX04).

## Resumo
Site demo com:
- Grid responsivo 12-col e 5 breakpoints (mobile-first)
- Navegação com submenu dropdown e menu hambúrguer (acessível)
- Cards, badges, botões, formulário com validação e armazenamento local
- SPA simples (hash routing) e templates JS
- Modais, toasts e foco acessível
- Preparado para versionamento GitFlow e deploy

## Como usar (local)
1. Clone seu repositório ou faça upload dos arquivos.
2. Abra `index.html` no navegador (ou use `live-server` para rotas hash).
3. Para produção, copie os arquivos para GitHub Pages (branch `main`) ou outro host.

## Branching (sugestão)
- `main`, `develop`, `feature/*`, `release/*`, `hotfix/*`
- Commits usando Conventional Commits: `feat`, `fix`, `chore`, etc.

## Acessibilidade
- Uso de roles ARIA e navegação por teclado.
- Skip link para conteúdo principal.
- Modais com `aria-modal` e foco preso.

## Estrutura de arquivos
- `index.html`
- `src/css/main.css`
- `src/js/app.js`

## Observações para entrega
- Complete o README com imagens, screenshots e relatório de acessibilidade.
- Configure minificação e pipeline de build se necessário (ex.: npm scripts).
