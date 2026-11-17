/**
 * app.js — versão principal (index.html)
 *
 * Sprint 1: a infraestrutura (roteador, tema, menu, skip link) vive em /modules
 * e é compartilhada com a versão modular (index-modular.html). As funções
 * render*() e os dados abaixo continuam aqui, sem mudança de conteúdo, e serão
 * extraídos para módulos/JSON na Sprint 2.
 */
import { createRouter } from "../../modules/router.js";
import { initTheme } from "../../modules/theme.js";
import { initMenu } from "../../modules/menu.js";
import { initSkipLink } from "../../modules/a11y.js";
import { initials } from "../../modules/dom.js";
import { filterResources } from "../../modules/filter.js";

const app = document.getElementById("app");

/* ---------------------------------------------------------------- dados -- */

const team = [
  {
    name: "Lidiane Silveira Soares",
    role: "Co-fundadora | CEO e editora de Ciências Humanas e suas tecnologias",
    bio: "Pesquisadora e educadora com atuação em relações raciais, formação de professores e educação aplicada, atuando principalmente nos seguintes temas: Educação Patrimonial; Patrimônio histórico e cultural, Educação de Jovens e Adultos, Educação étnico-racial, Estudos arqueológicos.",
    lattes: "http://lattes.cnpq.br/8913787579242413",
    photo: "assets/img/team/lidiane.jpeg"
  },
  {
    name: "Pâmella Araújo Balcaçar",
    role: "Co-fundadora | CTO e editora de Ciência da Natureza e suas tecnologias",
    bio: "Bióloga, Tecnóloga em Informática e educadora, com atuação em tecnologias educacionais e desenvolvimento de soluções digitais.",
    lattes: "http://lattes.cnpq.br/1206643836491711",
    linkedin: "https://www.linkedin.com/in/pamellabiotec/",
    photo: "assets/img/team/pamella.jpeg"
  },
  {
    name: "Thais Silva Rodrigues",
    role: "Co-fundadora | CEO e editora da Educação Infantil",
    bio: "Pedagóga e Química. Docente da educação Infantil (efetiva) lotada no CMEI Monteiro Lobato. Mestranda do PROFCOMP (Programa de pós-graduação Stricto sensu em Ensino de Ciência da Computação), em Rede Nacional, polo Rondonópolis/ UFR. | Projeto: Desenvolvimento e validação de um produto educacional baseado em Computação Desplugada para o ensino introdutório da arquitetura de computadores na Educação Infantil, alinhado à Base Nacional Comum Curricular da Computação.",
    lattes: "https://lattes.cnpq.br/8581015130355377",
    photo: "assets/img/team/thais.jpeg"
  }
];

const resources = [
  {
    title: "REA: Mais Educação",
    type: "REA",
    summary: "Estratégias de planejamento e desenvolvimento de competências para a educação básica.",
    tags: ["BNCC", "Planejamento", "Gestão"]
  },
  {
    title: "OAD: Robótica e Computação",
    type: "OAD",
    summary: "Objetos de aprendizagem digitais para raciocínio lógico, programação e pensamento computacional.",
    tags: ["Computação", "Pensamento Computacional", "Algoritmos"]
  },
  {
    title: "RED: Formação Docente",
    type: "RED",
    summary: "Módulos e materiais de formação para professores e equipes escolares.",
    tags: ["Treinamento", "Educação", "Metodologias"]
  }
];

/* ---------------------------------------------------------------- views -- */
/* Cada página tem exatamente um <h1> (o roteador move o foco para ele). */

const renderHome = () => {
  app.innerHTML = `
    <section class="section">
      <div class="container hero">
        <div class="hero-copy">
          <span class="eyebrow">EdTech para educação básica</span>
          <h1>Recursos digitais, serviços e formação para transformar a prática docente.</h1>
          <p>
            Descomplicando a Docência é uma plataforma de recursos pedagógicos, consultoria e
            mentoria para educação básica, com foco em acessibilidade, qualidade e impacto escolar.
          </p>
          <div class="cta-row">
            <a class="btn primary" href="#/recursos">Explorar recursos</a>
            <a class="btn secondary" href="#/servicos">Nossos serviços</a>
          </div>
        </div>

        <div class="hero-panel">
          <div class="hero-visual">
          <img src="./assets/img/hero-dad.webp" alt="Ilustração dos serviços educativos">
          </div>
        </div>

      </div>
    </section>

    <section class="section" aria-labelledby="home-servicos">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Serviços</span>
          <h2 id="home-servicos">Atuação profissional</h2>
        </div>

        <div class="grid-4">
          <article class="service-card">
            <h3>Consultoria Pedagógica</h3>
            <p>Diagnóstico, mapeamento de competências e alinhamento curricular à BNCC e BNCC Computação.</p>
          </article>
          <article class="service-card">
            <h3>Mentorias</h3>
            <p>Acompanhamento personalizado para professores, gestores e equipes escolares.</p>
          </article>
          <article class="service-card">
            <h3>Treinamentos</h3>
            <p>Formação em metodologias ativas, formação digital e práticas avaliativas.</p>
          </article>
          <article class="service-card">
            <h3>Assessoria Pedagógica</h3>
            <p>Estruturação de projetos, materiais e estratégias para ensino de qualidade.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="home-recursos">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Recursos</span>
          <h2 id="home-recursos">Catálogo de materiais</h2>
        </div>
        <div class="grid-3">
          <article class="resource-card">
            <h3>REA: Mais Educação</h3>
            <p>Conjunto de materiais abertos para planejamento de aulas e desenvolvimento de competências.</p>
          </article>
          <article class="resource-card">
            <h3>OAD: Robótica e Computação</h3>
            <p>Recursos digitais com foco em raciocínio lógico, programação e pensamento computacional.</p>
          </article>
          <article class="resource-card">
            <h3>RED: Formação Docente</h3>
            <p>Programas e módulos de capacitação para uso responsável da tecnologia em sala de aula.</p>
          </article>
        </div>
      </div>
    </section>
  `;
};

const renderServices = () => {
  app.innerHTML = `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Serviços</span>
          <h1>Consultoria, mentoria e formação</h1>
        </div>

        <div class="grid-2">
          <article class="service-card">
            <h2>Consultoria Pedagógica</h2>
            <p>Diagnóstico pedagógico, mapeamento de competências e alinhamento curricular.</p>
          </article>
          <article class="service-card">
            <h2>Mentorias</h2>
            <p>Acompanhamento personalizado para professores, equipes e escolas.</p>
          </article>
          <article class="service-card">
            <h2>Treinamentos</h2>
            <p>Formação profissional em metodologias ativas e tecnologias de ensino.</p>
          </article>
          <article class="service-card">
            <h2>Assessoria Pedagógica</h2>
            <p>Estruturação de projetos pedagógicos e materiais digitais de apoio ao ensino.</p>
          </article>
        </div>
      </div>
    </section>
  `;
};

const renderResources = () => {
  app.innerHTML = `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Recursos</span>
          <h1>Catálogo de recursos educacionais</h1>
        </div>

        <div class="search-box">
          <label for="resource-search" class="visually-hidden">Buscar recursos por tema ou competência</label>
          <input id="resource-search" type="search" placeholder="Buscar por tema ou competência" />
        </div>

        <div class="filters" role="group" aria-label="Filtrar por tipo de recurso">
          <button type="button" class="filter-btn" data-filter="all" aria-pressed="true">Todos</button>
          <button type="button" class="filter-btn" data-filter="REA" aria-pressed="false">REA</button>
          <button type="button" class="filter-btn" data-filter="OAD" aria-pressed="false">OAD</button>
          <button type="button" class="filter-btn" data-filter="RED" aria-pressed="false">RED</button>
        </div>

        <p id="resource-count" class="status" role="status"></p>
        <div id="resource-grid" class="grid-3"></div>
      </div>
    </section>
  `;

  let currentFilter = "all";

  const renderProductGrid = () => {
    // Busca sem acentos e por todas as palavras (mesma regra da versão modular).
    const list = filterResources(resources, {
      type: currentFilter,
      query: document.getElementById("resource-search")?.value || ""
    });

    document.getElementById("resource-count").textContent =
      list.length === 0
        ? "Nenhum recurso encontrado para esta busca."
        : `${list.length} ${list.length === 1 ? "recurso encontrado" : "recursos encontrados"}.`;

    document.getElementById("resource-grid").innerHTML = list
      .map(
        (item) => `
          <article class="resource-card">
            <span class="tag">${item.type}</span>
            <h2>${item.title}</h2>
            <p>${item.summary}</p>
            <ul class="meta-list" aria-label="Temas">
              ${item.tags.map((tag) => `<li class="tag">${tag}</li>`).join("")}
            </ul>
          </article>
        `
      )
      .join("");
  };

  document.getElementById("resource-search")?.addEventListener("input", renderProductGrid);

  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter;
      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.setAttribute("aria-pressed", String(btn === button));
      });
      renderProductGrid();
    });
  });

  renderProductGrid();
};

const renderTeam = () => {
  app.innerHTML = `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Equipe</span>
          <h1>Quem desenvolve a proposta</h1>
        </div>

        <div class="grid-3">
          ${team
            .map(
              (person) => `
                <article class="team-card">
                  <img src="${person.photo}" alt="" width="96" height="96" data-name="${person.name}" />
                  <h2>${person.name}</h2>
                  <p><strong>${person.role}</strong></p>
                  <p>${person.bio}</p>
                  
                  <div class="social-buttons">
                    ${
                      person.lattes
                        ? `<a href="${person.lattes}" target="_blank" rel="noopener noreferrer" class="btn-social btn-lattes">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                            </svg>
                            Lattes
                          </a>`
                        : ""
                    }
                    ${
                      person.linkedin
                        ? `<a href="${person.linkedin}" target="_blank" rel="noopener noreferrer" class="btn-social btn-linkedin">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                            </svg>
                            LinkedIn
                          </a>`
                        : ""
                    }
                  </div>
                </article>
              `
            )
            .join("")}
        </div>


    
      </div>
    </section>
  `;
};

const renderAbout = () => {
  app.innerHTML = `
    <section class="section">
      <div class="container prose">
        <div class="section-head">
          <span class="eyebrow">Sobre</span>
          <h1>Educação, tecnologia e impacto pedagógico</h1>
        </div>

        <p>Somos uma plataforma dedicada a recursos digitais, consultoria e formação para a educação básica.</p>
        <p>
          Entendemos a educação como direito público e a tecnologia como ferramenta de democratização do
          acesso ao conhecimento. A nossa proposta combina pesquisa, design pedagógico, inovação e
          responsabilidade social.
        </p>
        <p>
          A transparência, a acessibilidade, a inclusão e o respeito ao conteúdo educativo livre são eixos
          centrais da nossa atuação.
        </p>
      </div>
    </section>
  `;
};

const renderLicensing = () => {
  app.innerHTML = `
    <section class="section">
      <div class="container prose">
        <div class="section-head">
          <span class="eyebrow">Licenciamento</span>
          <h1>Conteúdo e código em transparência</h1>
        </div>

        <p>Os conteúdos educativos desta plataforma estão licenciados sob <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.pt" target="_blank" rel="noopener">CC BY-SA 4.0<span class="visually-hidden"> (abre em nova aba)</span></a>.</p>
        <p>O código-fonte está disponível sob a licença <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener">MIT<span class="visually-hidden"> (abre em nova aba)</span></a>.</p>
      </div>
    </section>
  `;
};

const renderNotFound = () => {
  app.innerHTML = `
    <section class="section">
      <div class="container prose">
        <div class="section-head">
          <span class="eyebrow">Erro 404</span>
          <h1>Página não encontrada</h1>
        </div>
        <p>O endereço que você abriu não existe neste portal.</p>
        <p><a class="btn primary" href="#/inicio">Voltar ao início</a></p>
      </div>
    </section>
  `;
};

/* --------------------------------------------------------------- rotas ---- */

const routes = {
  "/inicio": { title: "Início", render: renderHome },
  "/servicos": { title: "Serviços", render: renderServices },
  "/recursos": { title: "Recursos", render: renderResources },
  "/equipe": { title: "Equipe", render: renderTeam },
  "/sobre": { title: "Sobre", render: renderAbout },
  "/licenciamento": { title: "Licenciamento", render: renderLicensing }
};

const notFound = { title: "Página não encontrada", render: renderNotFound };

/* ------------------------------------------------------------ inicialização */

// Fotos ainda não enviadas ao repositório: troca a imagem quebrada por iniciais.
// (O evento "error" não borbulha; por isso usamos a fase de captura.)
app?.addEventListener(
  "error",
  (event) => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement) || !img.dataset.name) return;
    const avatar = document.createElement("span");
    avatar.className = "avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = initials(img.dataset.name);
    img.replaceWith(avatar);
  },
  true
);

initTheme(document.querySelector(".theme-toggle"));
const menu = initMenu({
  toggle: document.querySelector(".nav-toggle"),
  nav: document.getElementById("site-nav")
});
initSkipLink(document.querySelector(".skip-link"));

if (app) {
  createRouter({
    routes,
    notFound,
    outlet: app,
    siteName: "Descomplicando a Docência",
    homeTitle: "Descomplicando a Docência · Recursos educacionais abertos",
    onChange: () => menu.close()
  }).start();
}
