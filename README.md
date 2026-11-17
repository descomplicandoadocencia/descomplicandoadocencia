# Descomplicando a Docência

Portal de serviços e produtos educacionais — [descomplicandoadocencia.com.br](https://descomplicandoadocencia.com.br).

Divulga Recursos Educacionais Abertos (REA), Objetos de Aprendizagem Digitais (OAD) e Recursos Educacionais Digitais (RED) na intersecção das áreas do conhecimento da educação básica com o ensino da Computação, além de serviços de consultoria, mentoria, treinamento e assessoria pedagógica, com alinhamento à BNCC e à BNCC Computação.

> **Status:** Sprint 1 concluída · próxima etapa: **Sprint 2 — Reestruturação de módulos**.
> Veja o [plano de sprints](docs/plano-de-sprints.md) para entregas, pendências e riscos.

## Como funciona

- **100% client-side**: HTML, CSS e JavaScript (ES6+) puros, publicados no GitHub Pages. Sem servidor em tempo de execução.
- **Hash routing** (`#/inicio`, `#/recursos`…): recarregar ou abrir um endereço direto nunca gera 404. Âncoras internas (`#app`, `#conteudo`) não são rotas.
- **Caminhos relativos** em todos os ativos, para funcionar em qualquer subcaminho do Pages.
- **Build em Node** apenas para o blog e as landing pages (Markdown → HTML com `marked` + `gray-matter`). O site em si não precisa de build.
- **Acessibilidade (meta WCAG 2.1 AA)**: skip link, foco visível, foco movido para o `<h1>` a cada rota, `aria-current`, `aria-pressed`, regiões `role="status"`, alvos de toque de 44 px, `prefers-reduced-motion`, `forced-colors`, impressão e tema claro/escuro com contraste conferido por script.

## Requisitos

- Node.js 20 ou superior (o CI usa 22) — necessário só para gerar o blog
- Git
- Qualquer servidor HTTP estático para visualizar localmente (as páginas usam módulos ES e **não funcionam abrindo o arquivo direto, via `file://`**)

## Uso local

```bash
git clone https://github.com/descomplicandoadocencia/descomplicandoadocencia.git
cd descomplicandoadocencia
npm install

# visualizar o site (escolha um)
python3 -m http.server 8000      # ou: npx serve .
# abra http://localhost:8000/
```

### Gerar o blog

```bash
npm run build                    # posts/*.md  →  blog/*.html + blog/posts.json
node scripts/build-landings.mjs  # landings/*.md → lp/*.html (a pasta landings/ ainda não existe)
node scripts/check-links.mjs     # confere links e imagens do que foi gerado
node scripts/check-comments.mjs  # confere a configuração de comentários
```

O workflow `.github/workflows/blog.yml` executa essas etapas e publica os arquivos gerados a cada push em `main` que altere `posts/`, `templates/`, `data/`, `scripts/` etc.

## Duas versões da home

| Versão | Entrada | Como o conteúdo chega à tela |
| --- | --- | --- |
| **Principal** | `index.html` → `assets/js/app.js` | Infraestrutura em `/modules`; textos ainda escritos em `app.js` |
| **Modular** (alvo da Sprint 2) | `index-modular.html` → `assets/js/main.js` | `modules/views.js` + `/components` + `data/*.json` |

As duas compartilham roteador, tema, menu, skip link e filtro (`/modules`). A modular está com `noindex` e `canonical` apontando para a principal enquanto as duas coexistem; na Sprint 2 ela vira o padrão.

## Estrutura

```text
.
├── index.html                 # shell da home (SPA por hash) — versão principal
├── index-modular.html         # mesma home, conteúdo vindo de data/*.json
├── blog.html                  # lista de publicações + menu lateral de colunistas
├── termos.html                # termos de uso
├── privacidade.html           # política de privacidade
├── 404.html
├── assets/
│   ├── css/styles.css         # tokens de design, reset, layout e componentes
│   ├── js/app.js              # versão principal (conteúdo embutido)
│   ├── js/main.js             # versão modular (entrada)
│   ├── js/blog.js             # blog.html: lista, filtro por autor (#/autor/<slug>)
│   ├── js/shell.js            # tema, menu e skip link nas páginas estáticas
│   ├── js/vlibras.js          # plugin VLibras (integração prevista na Sprint 4)
│   └── img/
├── modules/                   # infraestrutura e views (ES modules)
│   ├── router.js  theme.js  menu.js  a11y.js  dom.js  data.js  filter.js
│   └── views.js               # renderHome, renderServices, renderResources, renderTeam,
│                              # renderAbout, renderLicensing, renderNotFound
├── components/                # blocos reutilizáveis: Hero, Section, cards, ExternalLink
├── data/                      # fonte do conteúdo: site, services, products, team (JSON)
├── posts/                     # textos do blog em Markdown (_modelo.md = modelo)
├── templates/post.html        # template das páginas de post
├── blog/                      # GERADO por scripts/build-blog.mjs
├── lp/                        # GERADO por scripts/build-landings.mjs
├── scripts/                   # build-blog, build-landings, check-links, check-comments
├── docs/plano-de-sprints.md   # plano, status e próxima etapa
└── .github/workflows/         # blog.yml (build + validação) e static.yml (Pages)
```

Não edite à mão o que está em `blog/` e `lp/`: o build sobrescreve.

## Design tokens

Ficam em `assets/css/styles.css`, como variáveis CSS em `:root`. O tema escuro é o padrão; o claro vem de `:root[data-theme="light"]`. Um pequeno script inline no `<head>` aplica o tema antes da primeira pintura (escolha salva em `localStorage` na chave `theme`, ou `prefers-color-scheme`). Se mudar uma cor, confira o contraste AA texto/fundo.

## Publicar um texto no blog

1. Copie `posts/_modelo.md` para `posts/AAAA-MM-DD-titulo.md` e remova a linha `rascunho: true`.
2. Preencha o cabeçalho (cada campo uma única vez). Para aparecer no menu lateral de colunistas, use `autor: [slug]` com o `slug` de uma pessoa de `data/team.json` (ex.: `autor: [andre-duran]`).
3. Imagens ficam em `assets/img/blog/` e entram no texto com caminho a partir da raiz: `![descrição](assets/img/blog/figura.webp)`.
4. Rode `npm run build` e confira `blog/`, ou faça push em `main` e deixe o CI gerar.

Arquivos que começam com `_` ou têm `rascunho: true` não são publicados.

## Editar conteúdo institucional

Equipe, serviços, recursos e textos de "Sobre" e "Licenciamento" ficam em `data/*.json`. Na versão modular, basta editar o JSON. Na versão principal, parte do conteúdo ainda está em `assets/js/app.js` até a Sprint 2 — veja o plano.

## Licenças

- **Conteúdo** (textos e imagens autorais): [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.pt-br)
- **Código-fonte**: [MIT](LICENSE)

> O arquivo `LICENSE-CONTEUDO.md`, herdado do repositório anterior, ainda cita CC BY 4.0. O alinhamento com CC BY-SA 4.0 está registrado como pendência P9 no plano de sprints.

## Contribuindo

Abra uma *issue* ou *pull request*. Mudanças de interface devem manter foco visível, navegação por teclado e contraste AA; mudanças em rotas devem usar apenas `#/…`.
