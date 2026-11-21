# Plano de Sprints - Descomplicando a Docência

Este documento define o roteiro de desenvolvimento e evolução da arquitetura do portal **Descomplicando a Docência**, priorizando a hospedagem estática no GitHub Pages, acessibilidade rigorosa (WCAG 2.1 AA) e performance sem dependência de servidores backend em tempo de execução.

## Sprint 1: Fundação e Padrões (Concluída)
- **Objetivo:** Estabelecer a base do repositório, documentação inicial e tokens de design.
- **Entregas:**
  - `README.md` estruturado.
  - Definição do `docs/plano-de-sprints.md`.
  - Configuração do `assets/css/styles.css` com tokens semânticos (tema claro/escuro).
  - Arquitetura de diretórios para componentes, módulos e scripts de build.

## Sprint 2: Acessibilidade Inclusiva (Concluída)
- **Objetivo:** Implementar ferramentas de tecnologia assistiva nativas e acessíveis.
- **Entregas:**
  - Desenvolvimento do **Leitor em Voz Alta** (`docs/leitor-voz.md`), resolvendo a prioridade P10.
  - Implementação via Web Speech API, totalmente *client-side*.
  - Controles semânticos e navegáveis por teclado.

## Sprint 3: Descoberta e Organização de Conteúdo (Planejada)
- **Objetivo:** Melhorar a vitrine do blog e a navegação transversal por temas educacionais, sem comprometer a performance estática.
- **Funcionalidades:**
  1. **Carrossel de Destaques no Topo do Blog:**
     - Exibição de posts recentes/destaques no `blog.html` (capa, título, autor, resumo).
     - **Critérios de Aceite:** Autoplay deve conter botão explícito de Pausar/Reproduzir (WCAG 2.2.2); pausa automática no `:focus` ou `:hover`; botões Anterior/Próximo acessíveis via teclado; desativação de animações se `prefers-reduced-motion: reduce` estiver ativo.
  2. **Barra de Navegação Taxonômica:**
     - Menu de filtros combinados permitindo navegação cruzada entre **Colunas**, **Autores** e **Áreas do Conhecimento** (BNCC / Educação Básica / Computação).
     - **Critérios de Aceite:** Uso de `<nav>` com rótulos `aria-label`; botões de estado com `aria-pressed`; rotas via hash (`#/coluna/...`) integradas ao `modules/router.js`.

## Sprint 4: Recuperação de Dados e Ferramentas Acadêmicas (Planejada)
- **Objetivo:** Facilitar a pesquisa rápida e o uso acadêmico do conteúdo publicado.
- **Funcionalidades:**
  1. **Busca Avançada em Metadados:**
     - Filtro instantâneo e insensível a acentos buscando em títulos, resumos, tags, palavras-chave e taxonomia.
     - **Critérios de Aceite:** Reaproveitamento/expansão do `modules/filter.js`; leitura de índice estático `search-index.json` (gerado previamente pelo `scripts/build-blog.mjs`); feedback dinâmico de resultados utilizando `role="status"` ou `aria-live="polite"`.
  2. **Gerador Acadêmico "Como Citar" (`templates/post.html`):**
     - Módulo de rodapé para geração dinâmica de referências bibliográficas do post.
     - **Critérios de Aceite:** Controles para alternar entre ABNT, APA, Vancouver, MLA e Chicago; botão "Copiar Citação" utilizando `navigator.clipboard`; alerta audível para leitores de tela confirmando a cópia (`role="status"`).

## Sprint 5: Modernização EdTech e Resiliência (Planejada)
- **Objetivo:** Elevar o nível profissional (SEO, compartilhamento e conectividade instável) estritamente dentro do ambiente GitHub Pages.
- **Funcionalidades:**
  1. **Geração Estática para SEO e Feed:**
     - Criação automática de `sitemap.xml` e `feed.xml` (RSS) durante o processo de *build* (`scripts/build-blog.mjs`).
  2. **SEO Acadêmico e Metadados Ricos:**
     - Inclusão de Open Graph e Schema.org (`ScholarlyArticle`, `LearningResource`) no template padrão para melhorar a indexação em motores de busca educacionais.
  3. **Resiliência Offline (PWA / Service Worker):**
     - Implementação de um Service Worker leve para *cache* offline, permitindo que professores com internet instável em escolas acessem artigos previamente carregados.
  4. **Compartilhamento Nativo:**
     - Integração da *Web Share API* para facilitar o envio rápido de conteúdos via dispositivos móveis.