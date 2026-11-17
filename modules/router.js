/**
 * Roteador por hash (#/rota) — compatível com GitHub Pages (nunca gera 404 em
 * recarregamento, pois o servidor sempre entrega o mesmo index.html).
 *
 * Contrato de cada rota:  { title: string, render(outlet) }
 *   render pode (a) devolver uma string HTML, (b) devolver um Node/DocumentFragment,
 *   (c) devolver uma Promise de (a)/(b) ou (d) alterar o outlet por conta própria e
 *   devolver undefined (formato do app.js atual).
 */

export const HOME = "/inicio";

/**
 * Converte location.hash em caminho de rota.
 *  - "", "#", "#/"          → rota inicial
 *  - "#/servicos?x=1"       → "/servicos" (a query é ignorada)
 *  - "#/Recursos/"          → "/recursos" (minúsculas, sem barra final)
 *  - "#app", "#conteudo"    → null: é uma âncora interna (ex.: skip link), NÃO uma rota.
 *    Sem esse retorno nulo, clicar no skip link trocaria a página.
 */
export function parseHash(hash, home = HOME) {
  if (hash === "" || hash === "#" || hash === "#/") return home;
  if (!hash.startsWith("#/")) return null;
  const path = hash.slice(1).split("?")[0].replace(/\/+$/, "").toLowerCase();
  return path || home;
}

function errorView() {
  const section = document.createElement("section");
  section.className = "section";
  const box = document.createElement("div");
  box.className = "container";
  const title = document.createElement("h1");
  title.textContent = "Não foi possível carregar esta página";
  const text = document.createElement("p");
  text.textContent = "Tente recarregar. Se o problema continuar, volte para o início.";
  box.append(title, text);
  section.append(box);
  return section;
}

export function createRouter({
  routes,
  notFound,
  outlet,
  siteName,
  homeTitle,
  home = HOME,
  navSelector = "[data-route]",
  onChange,
}) {
  const has = (path) => Object.prototype.hasOwnProperty.call(routes, path);
  let ticket = 0; // identifica a navegação mais recente (renders assíncronos)
  let firstPaint = true;

  function markCurrent(path) {
    document.querySelectorAll(navSelector).forEach((link) => {
      if (link.dataset.route === path) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  async function navigate() {
    const path = parseHash(window.location.hash, home);
    if (path === null) return; // âncora interna: mantém a página atual

    const known = has(path);
    const route = known ? routes[path] : notFound;
    const mine = ++ticket;

    let result;
    try {
      result = await route.render(outlet);
    } catch (error) {
      console.error(`[router] falha ao renderizar ${path}`, error);
      result = errorView();
    }
    // Se a pessoa já navegou para outra rota enquanto esta carregava, descarta.
    if (mine !== ticket) return;

    if (typeof result === "string") outlet.innerHTML = result;
    else if (result) outlet.replaceChildren(result);

    document.title = path === home ? homeTitle || siteName : `${route.title} · ${siteName}`;
    markCurrent(known ? path : null);

    // Gestão de foco: após trocar de "página", leitores de tela precisam ser
    // levados ao novo título. Não roubamos o foco na carga inicial.
    const heading = outlet.querySelector("h1");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      if (!firstPaint) heading.focus({ preventScroll: true });
    }
    if (!firstPaint) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    firstPaint = false;

    onChange?.(path, route);
  }

  return {
    navigate,
    start() {
      window.addEventListener("hashchange", navigate);
      return navigate();
    },
  };
}
