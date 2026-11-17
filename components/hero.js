import { h } from "../modules/dom.js";

/** Primeira dobra da home. É o único componente que gera o <h1> da página inicial. */
export function Hero({ eyebrow, title, text, visual, actions = [] }) {
  return h(
    "section",
    { class: "section" },
    h(
      "div",
      { class: "container hero" },
      h(
        "div",
        { class: "hero-copy" },
        eyebrow ? h("span", { class: "eyebrow" }, eyebrow) : null,
        h("h1", {}, title),
        h("p", {}, text),
        h(
          "div",
          { class: "cta-row" },
          actions.map(({ label, href, variant = "primary" }) => h("a", { class: `btn ${variant}`, href }, label))
        )
      ),
      // Painel puramente decorativo: escondido de leitores de tela.
      visual ? h("div", { class: "hero-panel", "aria-hidden": "true" }, h("div", { class: "hero-visual" }, visual)) : null
    )
  );
}
