# Diagnóstico do projeto legado e plano de sprints

> **Status em 16/11/2026:** Sprint 1 concluída · **próxima etapa: Sprint 2 — Reestruturação de módulos**
>
> Repositório de trabalho: <https://github.com/descomplicandoadocencia/descomplicandoadocencia>
> (o plano original citava `/site`; a base real é este repositório legado, refatorado no lugar).

## Painel de acompanhamento

| Sprint | Tema | Status |
| --- | --- | --- |
| 1 | Diagnóstico e base visual | ✅ Concluída (com pendências listadas abaixo) |
| 2 | Reestruturação de módulos | ⏭️ **Próxima** |
| 3 | Catálogo de recursos e serviços educacionais | ⏳ Planejada |
| 4 | Acessibilidade e performance (inclui VLibras) | ⏳ Planejada |
| 5 | Conteúdo editorial e institucional | ⏳ Planejada |
| 6 | Publicação e validação | ⏳ Planejada |

---

## Seção 1: Diagnóstico da arquitetura legada

O repositório legado era uma base sólida para um portal estático em GitHub Pages, mas precisava de refinamento estrutural para atender ao objetivo de portfólio institucional, catálogo de recursos e serviços educacionais com foco pedagógico e acessibilidade.

### Pontos positivos

- Arquitetura estática compatível com GitHub Pages.
- HTML, CSS e JavaScript puros, sem runtime de servidor.
- Roteamento por hash e landing pages já iniciados.
- Base modular iniciada em `assets/js`, `assets/css` e `index.html`.
- Tema claro/escuro com persistência em `localStorage`.

### Pontos críticos (encontrados no legado)

- Código concentrado em poucos arquivos, sem separação entre dados, regra de negócio, layout e comportamento.
- Forte acoplamento entre template de página e conteúdo.
- Lógica de SPA embutida em strings HTML (pouca legibilidade e testabilidade).
- Conteúdo de equipe, produtos e serviços parcialmente duplicado ou disperso, sem fonte única.
- Brechas de acessibilidade e UX: foco, contraste, hierarquia de títulos, semântica e alvos de toque pequenos.
- Pouca clareza entre conteúdo institucional, catálogo de recursos, blog e landing pages.

### Oportunidades de refatoração

- Reestruturar em camadas: `index.html` como shell, `assets/css/styles.css` como design system, `assets/js/app.js` como orquestrador, `data/` para conteúdo reutilizável.
- Separar conteúdo de renderização: serviços, recursos, equipe, licenciamento e páginas pedagógicas/landing.
- Manter o padrão do Bio+Tech EduDesign adaptado ao público do Descomplicando a Docência.
- Aproveitar a equipe do legado, sem migrar conteúdo antigo sem revisão editorial.
- Manter consistência visual da marca, com identidade mais institucional, afetiva e educacional.

### Estratégia de reaproveitamento

Mesmo espírito do Bio+Tech EduDesign: shell global, CSS tokens, SPA por hash, recursos em JavaScript e build leve com Node apenas para gerar conteúdo estático. O site permanece estável em GitHub Pages sem servidor dinâmico.

---

## Seção 2: Plano de sprints para modernização incremental

### Sprint 1 — Diagnóstico e base visual ✅

**Objetivos:** revisar o conteúdo atual e adaptar a estrutura; definir tokens, paleta e componentes; reestruturar o shell base do HTML.

#### Entregáveis → onde estão

| Entregável | Arquivo(s) | Situação |
| --- | --- | --- |
| `index.html` com estrutura semântica | `index.html` | ✅ |
| `termos.html` | `termos.html` (e `privacidade.html`, normalizada com o mesmo shell) | ✅ — texto jurídico alterado, **precisa de revisão** (ver pendências) |
| `blog.html` com menu lateral de colunistas/autores | `blog.html`, `assets/js/blog.js` (filtro por `#/autor/<slug>`, autores vindos de `data/team.json`) | ✅ |
| Template do blog | `templates/post.html`, `posts/_modelo.md`, `scripts/build-blog.mjs` | ✅ |
| `assets/css/styles.css` com tokens e reset | `assets/css/styles.css` | ✅ |
| Navegação principal com hash routing | `modules/router.js`, `assets/js/app.js` | ✅ |
| Rodapé, skip link e foco visível | todas as páginas; `modules/a11y.js`, `assets/js/shell.js`, `styles.css` | ✅ |
| Versão alternativa em módulos ES6 | `index-modular.html`, `assets/js/main.js`, `/modules`, `/components`, `/data` | ✅ |
| Atualizar este plano e o `README.md` | `docs/plano-de-sprints.md`, `README.md` | ✅ |

#### Como ficaram as duas versões

- **Principal (`index.html`)** — usa a infraestrutura de `/modules` (roteador, tema, menu, skip link, filtro), mas o **conteúdo ainda está escrito dentro de `assets/js/app.js`**.
- **Modular (`index-modular.html`)** — mesma infraestrutura, com o conteúdo vindo de `data/*.json` e renderizado por `modules/views.js` + `/components`. É a arquitetura-alvo; está marcada `noindex,follow` e com `canonical` apontando para a principal enquanto as duas coexistem.

#### Verificação realizada

- 324 verificações automáticas em Chromium real (Playwright) contra servidor HTTP local, nas duas versões e em 360 px e 1280 px: renderização das rotas, foco no `<h1>` após navegar, skip link sem alterar o hash, menu móvel (abre, `Esc` fecha e devolve o foco), tema claro/escuro (segue o sistema, escolha manual gravada), filtro e busca insensível a acentos, filtro de autores no blog, ausência de rolagem horizontal, erros de console e 143 referências locais (links/imagens/scripts) em 6 páginas.
- axe-core 4.10.2 (regras `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` e `best-practice`) em tema escuro e claro, sem violações.
- Contraste texto/fundo conferido por script para as combinações de cores dos tokens (AA).
- `npm run build`, `scripts/check-links.mjs` e `scripts/check-comments.mjs` executados sem erros.
- O teste automatizado vive fora do repositório; trazê-lo para `tests/` está previsto na Sprint 2.
- **Não verificado:** leitor de tela real (NVDA/VoiceOver), Firefox/Safari, e a publicação efetiva no GitHub Pages.

#### Decisões e desvios em relação ao plano

1. **Reaproveitar o repositório legado** em vez de criar um novo do zero (diretriz de reutilização). Classes CSS legadas (`.hero`, `.service-card`, `.grid-3`…) foram mantidas.
2. **Âncoras internas não são rotas:** `#app` e `#conteudo` (skip link) são ignoradas pelo roteador; só `#/rota` navega.
3. **Páginas estáticas** (`termos`, `privacidade`, `blog`) compartilham o mesmo cabeçalho/rodapé das páginas SPA e usam `<main id="conteudo">`; as SPA usam `<main id="app">`.
4. **`scripts/build-blog.mjs` reescrito** (exporta funções puras, ignora rascunhos, gera um único `<h1>`). Consequência: `blog/_modelo.html` (página gerada de um rascunho) deixou de existir; `posts/_modelo.md` continua sendo o modelo.
5. **CI:** `templates/**` foi incluído nos `paths` do workflow e o passo de commit foi corrigido (ver pendências).

#### Pendências e riscos conhecidos da Sprint 1

| # | Item | Impacto | Onde tratar |
| --- | --- | --- | --- |
| P1 | `termos.html`: 6 parágrafos foram ajustados (nome da marca, escopo, atribuição CC BY-SA, canal de denúncia do Disqus, remoção de "Google Fonts", e-mail de contato). **Requer revisão jurídica/editorial.** | Alto | Sprint 5 (ou antes da publicação) |
| P2 | Conteúdo duplicado: a versão principal tem 3 recursos escritos em `app.js`; `data/products.json` tem 4. | Médio | **Sprint 2** (principal passa a ler os JSON) |
| P3 | Cabeçalho/rodapé repetidos em 6 páginas HTML (gerados por script fora do repositório). Risco de divergência. | Médio | **Sprint 2** (script de consistência ou parciais no build) |
| P4 | Fotos da equipe (`assets/img/team/*.jpg`) existem; Foi corrigido manualmente | Baixo | OK |
| P5 | Post de exemplo com campo `autor`; o menu lateral só filtra quando há autores nos posts. | Baixo | OK |
| P6 | Passo "Publicar arquivos gerados" do workflow falhava (`git add` com `recursos`/`sitemap.xml` inexistentes). Corrigido para adicionar apenas caminhos existentes; **não foi executado no GitHub Actions**. | Médio | Validar no primeiro push (Sprint 6) |
| P7 | `scripts/check-links.mjs` do legado cobre apenas os posts gerados; as páginas HTML da raiz não passam por ele. | Baixo | Sprint 6 |
| P8 | VLibras só existe em `404.html`; carrossel legado (`js/carousel.js`, `js/publicacoes.json`) não está ligado à nova home. | Baixo | Sprints 4 e 5 |
| P9 | **Inconsistência de licença:** `LICENSE-CONTEUDO.md` (herdado do legado) declara **CC BY 4.0**, enquanto todas as páginas, `data/site.json` e a definição do projeto declaram **CC BY-SA 4.0**. O arquivo não foi alterado: a escolha da licença é decisão da autoria. | Alto | Resolver antes de publicar (Sprint 5) |
| P10 | Após adicionar o recurso de leitor de voz documentado em `docs/leitor-de-voz.md`, mas sem documentá-lo no `docs/plano de sprints.md` | Baixo | Auditar as pendências antes de transitar entre as (Sprint 1-2)|

---

### Sprint 2 — Reestruturação de módulos ⏭️ (próxima etapa)

**Objetivos:**

- Extrair a lógica de renderização para módulos JavaScript.
- Criar conteúdo em objetos reutilizáveis.
- Melhorar a responsividade e a manutenção.

**Entregáveis:**

- `renderHome()`
- `renderServices()`
- `renderResources()`
- `renderTeam()`
- `renderAbout()`
- `renderLicensing()`

**Ponto de partida (já existente na Sprint 1):** as seis funções já existem em `modules/views.js` e funcionam na versão modular. O trabalho da Sprint 2 é **promovê-las a padrão do site**:

1. Fazer `index.html` usar `modules/views.js` + `data/*.json` e remover o conteúdo escrito à mão de `assets/js/app.js` (resolve P2).
2. Decidir o destino de `index-modular.html` (remover ou manter como página de demonstração) e retirar o `noindex`/`canonical` provisórios.
3. Garantir fonte única de conteúdo: `data/site.json`, `services.json`, `products.json`, `team.json`.
4. Eliminar a duplicação de cabeçalho/rodapé (P3): trazer o gerador para o repositório (`scripts/`) ou adicionar uma checagem de consistência no CI.
5. Revisar responsividade (grades `.grid-2/3/4`, menu móvel, sidebar do blog) em 320, 768 e 1280 px.
6. Trazer a verificação automática (Playwright + axe-core) para o repositório em `tests/` e ligá-la ao `npm test`, que hoje apenas executa o build. Playwright e axe-core entram como `devDependencies` — não afetam o site publicado.

**Critério de aceite:** as 6 rotas renderizam a partir dos JSON; nenhum texto de conteúdo em `app.js`; mesmas verificações automáticas da Sprint 1 passando; zero violações axe.

---

### Sprint 3 — Catálogo de recursos e serviços educacionais

**Objetivos:**

- Exibir produtos (REA, OAD e RED) e serviços.
- Filtrar por tipo.
- Busca por competências e temas.
- Estruturar blocos pedagógicos com foco em BNCC.

**Entregáveis:** seção de catálogo; cards com descrições; filtros por categoria/tipo; busca funcional.

> Já adiantado na Sprint 1: filtro por tipo e busca insensível a acentos (`modules/filter.js`). Falta a página de detalhe `#/recursos/<slug>` (os `link` em `products.json` já apontam para ela), campos de competência/habilidade BNCC e filtro por categoria.

### Sprint 4 — Acessibilidade e performance

**Objetivos:** ajustar contraste e tamanho de texto; melhorar navegação por teclado; reduzir JS desnecessário; garantir carregamento leve.

**Entregáveis:**

- `prefers-reduced-motion` *(base já feita)*
- `aria-label` e semântica
- acessibilidade do tema
- CSS otimizado e componentes compactos
- Uso do recurso VLibras
- Revisão final com foco em WCAG 2.1 AA e UX para educação básica (incluir teste com leitor de tela real)

### Sprint 5 — Conteúdo editorial e institucional

**Objetivos:** refinar equipe, missão, visão, licenciamento e serviços; definir linguagem institucional; preparar integração com CMS leve ou conteúdo em JSON/Markdown.

**Entregáveis:** conteúdo final de equipe; texto institucional; páginas de serviços; páginas de licenciamento e sobre; editorial; colunas.

> Inclui P1 (revisão de `termos.html`), P4 (fotos), P5 (autores nos posts), P9 (alinhar `LICENSE-CONTEUDO.md` a CC BY-SA 4.0) e a decisão sobre o carrossel de publicações.

### Sprint 6 — Publicação e validação

**Objetivos:** validar em GitHub Pages; testar responsividade; entregar estrutura pronta para produção.

**Entregáveis:** build automatizado para blog/Markdown usando marked + gray-matter *(base já em `scripts/build-blog.mjs` e `.github/workflows/blog.yml`)*; verificação de links; validação final em produção (inclui P6 e P7).

---

## Seção 3: Código refatorado e otimizado

Os arquivos da Sprint 1 estão no repositório, mantendo a arquitetura estática, client-side e compatível com hash routing. A estrutura e as instruções de uso estão no [`README.md`](../README.md).

---

## Anexo — Prompt técnico original

### 1. Contexto e atuação profissional

Atue como Engenheiro de Software Sênior, Especialista em Refatoração de Sistemas Legados e Arquiteto de Soluções Web para o setor Educacional (EdTech), com ampla experiência em UX/UI responsiva para estudantes e professores da educação básica, acessibilidade digital (WCAG 2.1 AA) e otimização de performance para plataformas web estáticas.

### 2. Objetivo do projeto

Reutilizar a arquitetura e a estrutura base do projeto Bio+Tech EduDesign para clonar, refatorar e estruturar a nova plataforma estática do Descomplicando a Docência (descomplicandoadocencia.com.br), aproveitando informações e conteúdo do site antigo (<https://github.com/descomplicandoadocencia/descomplicandoadocencia>), como a equipe.

Escopo funcional e pedagógico:

- Divulgação de Recursos Educacionais Abertos (REA), Objetos de Aprendizagem Digitais (OAD) e Recursos Educacionais Digitais (RED), na intersecção de todas as áreas do conhecimento da educação básica com o ensino da Computação.
- Serviços educacionais: Consultoria, Mentorias, Treinamentos e Assessoria Pedagógica.
- Mapeamento de competências e alinhamento às diretrizes da BNCC e da BNCC Computação.
- Licenciamento transparente: conteúdos em CC BY-SA 4.0 e código-fonte sob licença MIT.
- Arquitetura client-side estática (HTML, CSS e JavaScript puros), publicada via GitHub Pages, com rotinas de build leves em Node.js (Markdown/marked/gray-matter) restritas à compilação de posts/blog e posts/landingpage.

### 3. Restrições técnicas rígidas (GitHub Pages)

1. **Execução 100% client-side:** sem dependência de servidores dinâmicos em runtime.
2. **Persistência local e serverless:** estado via LocalStorage/IndexedDB ou APIs REST/serverless públicas.
3. **Roteamento adaptado:** exclusivamente Hash Routing (`/#/`), para evitar 404 em acesso direto ou recarga.
4. **Ativos estáticos:** caminhos relativos para imagens, scripts e folhas de estilo.

### 4. Diretrizes de modificação e qualidade de código

1. **Reutilização e reestruturação modular**, sem reescrever a base do zero desnecessariamente.
2. **Foco educacional e acessibilidade (WCAG 2.1 AA):** alto contraste, navegação por teclado, suporte a leitores de tela e visualização adaptada a dispositivos móveis.
3. **Separação estrita de responsabilidades:** estrutura (HTML5), estilos/tokens (CSS3) e comportamento (JavaScript ES6+).
4. **Autonomia sem frameworks pesados:** Web APIs nativas e bibliotecas leves via CDN.

### 5. Entregáveis esperados

Resposta técnica estruturada com os arquivos da Sprint 1, este plano atualizado em Markdown indicando a próxima etapa, e o `README.md` atualizado.
