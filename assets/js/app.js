const app = document.getElementById("app");

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
  document.body.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem("theme", theme);
  } catch {}
};

const renderHome = () => {
  app.innerHTML = `
    <section class="section">
      <div class="container hero">
        <div class="hero-copy">
          <span class="eyebrow">EdTech para educação básica</span>
          <h1>Recursos digitais, serviços e formação para transformar a prática docente.</h1>
          <p>Descomplicando a Docência é uma plataforma de recursos pedagógicos, consultoria e tecnologias educacionais com foco em acessibilidade, qualidade e impacto escolar.</p>
          <div class="cta-row">
            <a class="btn primary" href="#/recursos">Explorar recursos</a>
            <a class="btn secondary" href="#/servicos">Nossos serviços</a>
          </div>
        </div>

        <div class="hero-panel">
          <div class="hero-visual">Plataforma educacional</div>
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
            <p>Diagnóstico e alinhamento de práticas pedagógicas à BNCC e BNCC Computação.</p>
          </article>
          <article class="service-card">
            <h3>Mentorias</h3>
            <p>Acompanhamento de professores e gestores na implementação de práticas digitais.</p>
          </article>
          <article class="service-card">
            <h3>Treinamentos</h3>
            <p>Formação em metodologias ativas, ferramentas digitais e tecnologias educacionais.</p>
          </article>
          <article class="service-card">
            <h3>Assessoria Pedagógica</h3>
            <p>Estruturação de materiais, currículos e projetos de ensino com foco em impacto escolar.</p>
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
            <p>Programas e módulos de capacitação para orientar o uso responsável da tecnologia em sala.</p>
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
            <p>Estruturação de projeto pedagógico e material educacional produzido em ambiente digital.</p>
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
          <input id="resource-search" type="search" placeholder="Buscar por tema ou competência" />
        </div>
        <div class="filters">
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
  const productData = [
    { title: "REA: Mais Educação", type: "REA", summary: "Material aberto", tags: ["BNCC", "Planejamento"] },
    { title: "OAD: Robótica e Computação", type: "OAD", summary: "Objetos de aprendizagem digitais", tags: ["Computação", "Pensamento Computacional"] },
    { title: "RED: Formação Docente", type: "RED", summary: "Módulos de formação docente", tags: ["Treinamento", "Educação"] }
  ];

  const renderProductGrid = () => {
    const q = (document.getElementById("resource-search")?.value || "").trim().toLowerCase();
    const list = productData.filter((item) => {
      const matchesType = currentFilter === "all" || item.type === currentFilter;
      const haystack = `${item.title} ${item.summary} ${item.tags.join(" ")}`.toLowerCase();
      return matchesType && haystack.includes(q);
    });

    document.getElementById("resource-grid").innerHTML = list.map((item) => `
      <article class="resource-card">
        <span class="tag">${item.type}</span>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <div class="meta-list">
          ${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
      </article>
    `).join("");
  };

  document.getElementById("resource-search")?.addEventListener("input", renderProductGrid);
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter;
      document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.toggle("active", btn === button));
      renderProductGrid();
    });
  });

  renderProductGrid();
};

const renderTeam = async () => {
  const res = await fetch("data/team.json");
  const team = await res.json();
  app.innerHTML = `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Equipe</span>
          <h2>Quem desenvolve a proposta</h2>
        </div>

        <div class="grid-3">
          ${team.map((person) => `
            <article class="team-card">
              <img src="${person.photo}" alt="${person.name}" style="width:100%;height:220px;object-fit:cover;border-radius:12px;" />
              <h3>${person.name}</h3>
              <p><strong>${person.role}</strong></p>
              <p>${person.bio}</p>
            </article>
          `).join("")}
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
          <h2>EdTech com fins educacionais e comerciais</h2>
        </div>

        <p>Somos uma plataforma digital focada em educação, com produtos e serviços que combinam pesquisa, design pedagógico e estratégia comercial responsável. Nossa proposta busca gerar impacto educacional, com sustentabilidade e ética no uso de dados, conteúdo e tecnologia.</p>
        <br />
        <p>Entendemos a educação como direito público e a tecnologia como ferramenta de democratização do acesso ao conhecimento. Por isso, enfatizamos acessibilidade, transparência e licenciamento aberto para conteúdos e código.</p>
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
        <p>O código-fonte da solução está disponível sob a licença <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener">MIT</a>.</p>
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
  const routeHandler = routes[hash] || renderHome;
  routeHandler();
};

window.addEventListener("hashchange", route);
route();