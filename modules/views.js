/**
 * Views da versão modular (index-modular.html).
 *
 * Cada função devolve um nó DOM (ou uma Promise dele) e o roteador o insere no
 * <main>. Nenhuma string HTML é montada à mão: textos entram por createTextNode,
 * dados vêm de /data/*.json e a marcação repetida vive em /components.
 *
 * Nomes alinhados às entregas da Sprint 2 (renderHome, renderServices, ...).
 */
import { h, frag } from "./dom.js";
import { getSite, getServices, getProducts, getTeam } from "./data.js";
import { filterResources, typesOf } from "./filter.js";
import { Hero } from "../components/hero.js";
import { Section } from "../components/section.js";
import { ServiceCard, ResourceCard, TeamCard } from "../components/cards.js";
import { ExternalLink } from "../components/link.js";

export async function renderHome() {
  const [site, services, products] = await Promise.all([getSite(), getServices(), getProducts()]);
  return frag(
    Hero({
      ...site.home,
      actions: [
        { label: "Explorar recursos", href: "#/recursos" },
        { label: "Nossos serviços", href: "#/servicos", variant: "secondary" },
      ],
    }),
    Section(
      { id: "home-servicos", eyebrow: "Serviços", title: "Atuação profissional" },
      h("div", { class: "grid-4" }, services.map((item) => ServiceCard(item, 3)))
    ),
    Section(
      { id: "home-recursos", eyebrow: "Recursos", title: "Catálogo de materiais" },
      h("div", { class: "grid-3" }, products.slice(0, 3).map((item) => ResourceCard(item, 3))),
      h("div", { class: "cta-row" }, h("a", { class: "btn secondary", href: "#/recursos" }, "Ver catálogo completo"))
    )
  );
}

export async function renderServices() {
  const services = await getServices();
  return Section(
    { eyebrow: "Serviços", title: "Consultoria, mentoria e formação", level: 1 },
    h("div", { class: "grid-2" }, services.map((item) => ServiceCard(item, 2)))
  );
}

export async function renderResources() {
  const products = await getProducts();
  const state = { type: "all", query: "" };

  const input = h("input", { id: "resource-search", type: "search", placeholder: "Buscar por tema ou competência" });
  const status = h("p", { class: "status", role: "status" });
  const grid = h("div", { class: "grid-3" });

  const buttons = ["all", ...typesOf(products)].map((type) =>
    h(
      "button",
      {
        type: "button",
        class: "filter-btn",
        "data-filter": type,
        "aria-pressed": String(type === "all"),
        onclick: () => {
          state.type = type;
          buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === type)));
          draw();
        },
      },
      type === "all" ? "Todos" : type
    )
  );

  function draw() {
    const list = filterResources(products, state);
    status.textContent =
      list.length === 0
        ? "Nenhum recurso encontrado para esta busca."
        : `${list.length} ${list.length === 1 ? "recurso encontrado" : "recursos encontrados"}.`;
    grid.replaceChildren(...list.map((item) => ResourceCard(item, 2)));
  }

  input.addEventListener("input", () => {
    state.query = input.value;
    draw();
  });
  draw();

  return Section(
    { eyebrow: "Recursos", title: "Catálogo de recursos educacionais", level: 1 },
    h(
      "div",
      { class: "search-box" },
      h("label", { for: "resource-search", class: "visually-hidden" }, "Buscar recursos por tema ou competência"),
      input
    ),
    h("div", { class: "filters", role: "group", "aria-label": "Filtrar por tipo de recurso" }, buttons),
    status,
    grid
  );
}

export async function renderTeam() {
  const team = await getTeam();
  return Section(
    { eyebrow: "Equipe", title: "Quem desenvolve a proposta", level: 1 },
    h("div", { class: "grid-3" }, team.map((person) => TeamCard(person, 2)))
  );
}

export async function renderAbout() {
  const { about } = await getSite();
  return Section(
    { eyebrow: about.eyebrow, title: about.title, level: 1, className: "prose" },
    about.paragraphs.map((text) => h("p", {}, text))
  );
}

export async function renderLicensing() {
  const { licensing } = await getSite();
  return Section(
    { eyebrow: licensing.eyebrow, title: licensing.title, level: 1, className: "prose" },
    h("p", {}, "Os conteúdos educativos desta plataforma estão licenciados sob ", ExternalLink(licensing.content.name, licensing.content.href), "."),
    h("p", {}, "O código-fonte está disponível sob a licença ", ExternalLink(licensing.code.name, licensing.code.href), ".")
  );
}

export function renderNotFound() {
  return Section(
    { eyebrow: "Erro 404", title: "Página não encontrada", level: 1, className: "prose" },
    h("p", {}, "O endereço que você abriu não existe neste portal."),
    h("p", {}, h("a", { class: "btn primary", href: "#/inicio" }, "Voltar ao início"))
  );
}
