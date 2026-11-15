const app = document.getElementById("app");
const themeToggle = document.querySelector(".theme-toggle");

const defaultTheme = () => {
  try {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  } catch {
    return "dark";
  }
};

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeToggle) {
    themeToggle.textContent = theme === "dark" ? "Claro" : "Escuro";
  }
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Ignora falhas em ambientes restritos
  }
};

const team = [
  {
    name: "Lidiane Silveira Soares",
    role: "Co-fundadora | CEO e editora de Ciências Humanas",
    bio: "Pesquisadora e educadora com atuação em políticas públicas, formação de professores e educação aplicada.",
    photo: "assets/img/team/lidiane.jpg"
  },
  {
    name: "Pâmella Araújo Balcaçar",
    role: "Co-fundadora | CTO e editora de Ciências Naturais",
    bio: "Bióloga, tecnologista e educadora, com atuação em design educacional e desenvolvimento de soluções digitais.",
    photo: "assets/img/team/pamella.jpg"
  },
  {
    name: "André Luiz Gomes Duran",
    role: "Colunista jurídico e assessor",
    bio: "Especialista em legislação e formação docente com olhar crítico para o ensino e a prática educativa.",
    photo: "assets/img/team/andre.jpg"
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
          <div class="hero-visual">Plataforma educativa</div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Serviços</span>
          <h2>Atuação profissional</h2>
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

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Recursos</span>
          <h2>Catálogo de materiais</h2>
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
          <h2>Consultoria, mentoria e formação</h2>
        </div>

        <div class="grid-2">
          <article class="service-card">
            <h3>Consultoria Pedagógica</h3>
            <p>Diagnóstico pedagógico, mapeamento de competências e alinhamento curricular.</p>
          </article>
          <article class="service-card">
            <h3>Mentorias</h3>
            <p>Acompanhamento personalizado para professores, equipes e escolas.</p>
          </article>
          <article class="service-card">
            <h3>Treinamentos</h3>
            <p>Formação profissional em metodologias ativas e tecnologias de ensino.</p>
          </article>
          <article class="service-card">
            <h3>Assessoria Pedagógica</h3>
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
          <h2>Catálogo de recursos educacionais</h2>
        </div>

        <div class="search-box">
          <input id="resource-search" type="search" placeholder="Buscar por tema ou competência" aria-label="Buscar recursos" />
        </div>

        <div class="filters" aria-label="Filtros de recursos">
          <button type="button" class="filter-btn active" data-filter="all">Todos</button>
          <button type="button" class="filter-btn" data-filter="REA">REA</button>
          <button type="button" class="filter-btn" data-filter="OAD">OAD</button>
          <button type="button" class="filter-btn" data-filter="RED">RED</button>
        </div>

        <div id="resource-grid" class="grid-3"></div>
      </div>
    </section>
  `;

  let currentFilter = "all";

  const renderProductGrid = () => {
    const q = (document.getElementById("resource-search")?.value || "").trim().toLowerCase();
    const list = resources.filter((item) => {
      const matchesType = currentFilter === "all" || item.type === currentFilter;
      const haystack = `${item.title} ${item.summary} ${item.tags.join(" ")} `.toLowerCase();
      return matchesType && haystack.includes(q);
    });

    document.getElementById("resource-grid").innerHTML = list
      .map(
        (item) => `
          <article class="resource-card">
            <span class="tag">${item.type}</span>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            <div class="meta-list">
              ${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
            </div>
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
        btn.classList.toggle("active", btn === button);
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
          <h2>Quem desenvolve a proposta</h2>
        </div>

        <div class="grid-3">
          ${team
            .map(
              (person) => `
                <article class="team-card">
                  <img src="${person.photo}" alt="${person.name}" />
                  <h3>${person.name}</h3>
                  <p><strong>${person.role}</strong></p>
                  <p>${person.bio}</p>
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
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Sobre</span>
          <h2>Educação, tecnologia e impacto pedagógico</h2>
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
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Licenciamento</span>
          <h2>Conteúdo e código em transparência</h2>
        </div>

        <p>Os conteúdos educativos desta plataforma estão licenciados sob <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.pt" target="_blank" rel="noopener">CC BY-SA 4.0</a>.</p>
        <p>O código-fonte está disponível sob a licença <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener">MIT</a>.</p>
      </div>
    </section>
  `;
};

const routes = {
  "#/inicio": renderHome,
  "#/servicos": renderServices,
  "#/recursos": renderResources,
  "#/equipe": renderTeam,
  "#/sobre": renderAbout,
  "#/licenciamento": renderLicensing
};

const route = () => {
  const hash = window.location.hash || "#/inicio";
  const handler = routes[hash] || renderHome;
  handler();
};

const initTheme = () => {
  const theme = defaultTheme();
  applyTheme(theme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }
};

window.addEventListener("hashchange", route);
initTheme();
route();