import { h } from "../modules/dom.js";

/**
 * Seção com cabeçalho padrão (eyebrow + título + texto opcional).
 * level 1 → página inteira (h1); level 2 → seção dentro da página (h2).
 * Seções com h2 ganham aria-labelledby para aparecerem como regiões nomeadas.
 */
export function Section({ id, eyebrow, title, text, level = 2, className = "" }, ...children) {
  const head = h(
    "div",
    { class: "section-head" },
    eyebrow ? h("span", { class: "eyebrow" }, eyebrow) : null,
    h(`h${level}`, { id }, title),
    text ? h("p", {}, text) : null
  );
  return h(
    "section",
    { class: "section", "aria-labelledby": level === 2 ? id : null },
    h("div", { class: `container ${className}`.trim() }, head, ...children)
  );
}
