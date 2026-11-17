import { h } from "../modules/dom.js";

/** Link para outro site: abre em nova aba e avisa leitores de tela (WCAG 3.2.5 / G201). */
export function ExternalLink(label, href) {
  return h(
    "a",
    { href, target: "_blank", rel: "noopener" },
    label,
    h("span", { class: "visually-hidden" }, " (abre em nova aba)")
  );
}
