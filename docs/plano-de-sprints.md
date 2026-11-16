# Diagnóstico do Projeto legado e Plano de Sprints

```markdown
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
````

Após o diagnostico do copilot.ia do github realizou traçou o seguinte plano de sprints:

## Seção 2: Plano de Sprints para Modernização Incremental

### Sprint 1 — Diagnóstico e base visual Objetivos:

- Revisar conteúdo atual e adaptar estrutura.
- Definir design tokens, paleta e componentes.
- Reestruturar o shell base do HTML.
- Entregáveis:

	- index.html com estrutura semântica.
	- termos.html;
	- blog.html (tendo um menu lateral com nomes dos colunistas/autores), e gere também o template do blog;
	- assets/css/styles.css com tokens e reset.
	- Navegação principal com hash routing.
	- Rodapé, skip link e foco visível.
	- uma versão alternativa com estrutura em módulos ES6 (/modules, /data, /components);


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
	- uma revisão final com foco em WCAG 2.1 AA e UX para educação básica.

### Sprint 5 — Conteúdo editorial e institucional Objetivos:

- Refinar páginas de equipe, missão, visão, licenciamento e serviços.
- Definir linguagem institucional.
- Preparar integração com CMS leve ou conteúdo em JSON/Markdown.
- Entregáveis:

	- conteúdo final de equipe
	- texto institucional
	- páginas de serviços
	- páginas de licenciamento e sobre
	- editorial
	- colunas

### Sprint 6 — Publicação e validação Objetivos:

- Validar em GitHub Pages.
- Testar em responsividade.
- Entregar estrutura pronta para produção.
- Entregáveis:

	- uma versão com build automatizado para blog/Markdown usando marked + gray-matter
	- verificação de links
	- validação final em produção

## Seção 3: Código Refatorado e Otimizado

Os arquivos essenciais para a implantação em GitHub Pages, mantendo a arquitetura estática, client-side e compatível com hash routing já foram realizado. 

---

1. CONTEXTO E ATUAÇÃO PROFISSIONAL
Atue como Engenheiro de Software Sênior, Especialista em Refatoração de Sistemas Legados e Arquiteto de Soluções Web para o setor Educacional (EdTech). Você possui ampla experiência em UX/UI responsiva para estudantes e professores da educação básica, acessibilidade digital (WCAG 2.1 AA) e otimização de performance para plataformas web estáticas.

2. OBJETIVO DO PROJETO
O objetivo principal é reutilizar a arquitetura e estrutura base do projeto Bio+Tech EduDesign (armazenado em GitHub Repositório) para clonar, refatorar e estruturar a nova plataforma estática do projeto Descomplicando a Docência (descomplicandoadocencia.com.br). Aproveitar algumas informações/ conteúdo do projeto antigo do site armazenado em https://github.com/descomplicandoadocencia/descomplicandoadocencia.git, tipo equipe.

Escopo funcional e pedagógico da plataforma:
- Divulgação de Recursos Educacionais Abertos (REA), Objetos de Aprendizagem Digitais (OAD) e Recursos Educacionais Digitais (RED) focados na intersecção de todas às areas do conhecimento da educação básica e com o ensino da Computação.
- Apresentação de serviços educacionais: Consultoria, Mentorias, Treinamentos e Assessoria Pedagógica.
- Mapeamento de competências e alinhamento às diretrizes da BNCC e BNCC Computação.
- Licenciamento transparente: Conteúdos em CC BY-SA 4.0 e código-fonte sob licença MIT.
- Arquitetura Client-Side estática (HTML, CSS e JavaScript puros), publicada via GitHub Pages, com rotinas de build leves em Node.js (Markdown/marked/gray-matter) restritas à compilação de posts/blog e posts/landingpage.


3. RESTRIÇÕES TÉCNICAS RÍGIDAS (GITHUB PAGES)
A arquitetura proposta deve cumprir estritamente os seguintes requisitos operacionais:
1. Execução 100% Client-Side: Sem dependência de servidores dinâmicos em runtime (Node.js/Python/PHP). Toda a lógica deve rodar no navegador do cliente.
2. Persistência Local e Serverless: Gerenciamento de estado via LocalStorage/IndexedDB ou integração assíncrona com APIs REST/Serverless públicas.
3. Roteamento de SPA Adaptado: Uso exclusivo de Hash Routing (`/#/`) para evitar erros 404 durante a navegação direta ou recarregamento de páginas no GitHub Pages.
4. Gerenciamento de Ativos Estáticos: Emprego rigoroso de caminhos relativos para garantir a resolução correta de imagens, scripts e folhas de estilo no subdomínio do GitHub Pages.


4. DIRETRIZES DE MODIFICAÇÃO E QUALIDADE DE CÓDIGO
1. Reutilização e Reestruturação Modular: Aproveitar o padrão arquitetural legado, organizando módulos reutilizáveis sem reescrever a base do zero desnecessariamente.
2. Foco Educacional e Acessibilidade (WCAG 2.1 AA): Garantir alto contraste, navegação por teclado, suporte a leitores de tela e visualização adaptada para dispositivos móveis.
3. Separação Estrita de Responsabilidades: Desacoplar rigorosamente a estrutura (HTML5), estilos/tokens de design (CSS3) e regras de negócio/comportamento (JavaScript ES6+).
4. Autonomia sem Frameworks Pesados: Priorizar Web APIs nativas e bibliotecas leves via CDN para evitar complexidade em esteiras CI/CD.


5. ENTREGÁVEIS ESPERADOS
Elabore uma resposta técnica estruturada contendo os arquivos entregavéis do sprint 1, atualize esse plano de print em formato marldown, indicando o próximo etapa e também atualize o arquivo README.md
