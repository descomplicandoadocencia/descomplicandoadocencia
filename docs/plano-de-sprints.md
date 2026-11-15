# Diagnóstico do Projeto legado e Plano de Sprints

## Seção 1: Diagnóstico da Arquitetura Legada

O repositório atual apresenta uma base sólida para um portal estático em GitHub Pages, mas ainda precisa de refinamento estrutural para atender ao objetivo de uma plataforma de portfólio institucional, catálogo de recursos e serviços educacionais com foco pedagógico e acessibilidade.

### Principais pontos positivos:

Arquitetura estática compatível com GitHub Pages.
Uso de HTML, CSS e JavaScript puros, sem runtime do servidor.
Presença de roteamento por hash e estrutura inicial de landing pages.
Base de conteúdo e estrutura modular já iniciada em assets/js, assets/css e index.html.
Aplicação de tema claro/escuro com persistência em localStorage, alinhada ao padrão moderno de web estática.

### Pontos críticos:

O código legado está concentrado em poucos arquivos, sem separação clara entre dados, regra de negócio, layout e comportamento.
Há forte acoplamento entre template de página e conteúdo, dificultando evolução e manutenção.
A lógica de SPA está embutida em strings HTML, o que reduz legibilidade, testabilidade e escalabilidade.
A navegação é dependente do hash routing, mas a estrutura de páginas ainda é frágil em termos de organização semântica.
O conteúdo da equipe, produtos e serviços está parcialmente duplicado ou disperso, sem uma fonte única.
Existem brechas de acessibilidade e UX: foco, contraste, hierarquia de títulos, semântica e componentes pequenos para mobile.

O código atual não deixa claro a separação entre conteúdo institucional, catálogo de recursos, blog e landing pages.
Oportunidades de refatoração:

* Reestruturar em camadas:
	- index.html como shell global.
	- assets/css/styles.css como design system.
	- assets/js/app.js como orchestrator da interface.
	- data/ para conteúdo semântico e reutilizável.

* Separar conteúdo de rendering:
	- serviços
	- recursos
	- equipe
	- licenciamento
	- páginas pedagógicas/landing

Manter o padrão do Bio+Tech EduDesign, mas adaptá-lo ao público do Descomplicando a Docência, com linguagem e posicionamento específicos.
Aproveitar a equipe do repositório legado, mas evitar migrar conteúdo antigo sem revisão editorial.
Reaproveitar o padrão visual da marca, mantendo a consistência, mas com identidade mais institucional, afetiva e educacional.

### Estratégia de reaproveitamento:

Adotar o mesmo espírito da arquitetura do Bio+Tech EduDesign:
- shell global
- CSS tokens
- SPA por hash
- recursos em JavaScript
- build leve com Node apenas para geração de conteúdo estático, se necessário

Reaproveitar os elementos de:
- hero section
- cards de catalogação
- navegação
- blocos de serviços
- foco em acessibilidade e boas práticas
- Reduzir divergência de conteúdo para que o site permaneça estável em GitHub Pages sem depender de servidor dinâmico.

## Seção 2: Plano de Sprints para Modernização Incremental

### Sprint 1 — Diagnóstico e base visual Objetivos:

- Revisar conteúdo atual e adaptar estrutura.
- Definir design tokens, paleta e componentes.
- Reestruturar o shell base do HTML.
- Entregáveis:

	- index.html com estrutura semântica.
	- assets/css/styles.css com tokens e reset.
	- Navegação principal com hash routing.
	- Rodapé, skip link e foco visível.

### Sprint 2 — Reestruturação de módulos Objetivos:

- Extrair lógica de renderização para um módulo JavaScript.
- Criar conteúdo em objetos reutilizáveis.
- Melhorar a responsividade e a manutenção.
- Entregáveis:

	- renderHome()
	- renderServices()
	- renderResources()
	- renderTeam()
	- renderAbout()
	- renderLicensing()

### Sprint 3 — Catálogo de recursos e serviços educacionais Objetivos:

- Exibir produtos (REA, OAD e RED) e serviços.
- Filtrar por tipo.
- Exibir busca por competências e temas.
- Estruturar blocos pedagógicos com foco em BNCC.
- Entregáveis:

	- seção de catálogo
	- cards com descrições
	- filtros por categioria/ tipo
	- busca funcional

### Sprint 4 — Acessibilidade e performance Objetivos:

- Ajustar contraste e tamanho de texto.
- Melhorar navegação por teclado.
- Reduzir JS desnecessário.
- Garantir carregamento leve.
- Entregáveis:

	- prefers-reduced-motion
	- aria-label e semântica
	- acessibilidade do tema
	- CSS otimizado e componentes compactos
	- Uso do recurso Vlibras

### Sprint 5 — Conteúdo editorial e institucional Objetivos:

- Refinar páginas de equipe, missão, visão, licenciamento e serviços.
- Definir linguagem institucional.
- Preparar integração com CMS leve ou conteúdo em JSON/Markdown.
- Entregáveis:

	- conteúdo final de equipe
	- texto institucional
	- páginas de serviços
	- páginas de licenciamento e sobre

### Sprint 6 — Publicação e validação Objetivos:

- Validar em GitHub Pages.
- Testar em responsividade.
- Entregar estrutura pronta para produção.
- Entregáveis:

	- build local
	- verificação de links
	- validação final em produção

## Seção 3: Código Refatorado e Otimizado

Os arquivos essenciais para a implantação em GitHub Pages, mantendo a arquitetura estática, client-side e compatível com hash routing.