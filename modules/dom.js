/**
 * Helpers mínimos para montar DOM sem concatenar strings HTML.
 * Textos entram sempre por createTextNode, então conteúdo vindo de JSON
 * nunca é interpretado como HTML.
 *
 *   h("a", { href: "#/sobre", class: "btn primary" }, "Sobre")
 */

function appendAll(parent, children) {
  for (const child of children.flat(Infinity)) {
    if (child === null || child === undefined || child === false) continue;
    parent.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

export function h(tag, attrs = {}, ...children) {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs ?? {})) {
    if (value === null || value === undefined || value === false) continue;
    if (name === "class") element.className = value;
    else if (name.startsWith("on") && typeof value === "function") {
      element.addEventListener(name.slice(2).toLowerCase(), value);
    } else element.setAttribute(name, value === true ? "" : String(value));
  }
  appendAll(element, children);
  return element;
}

export function frag(...children) {
  const fragment = document.createDocumentFragment();
  appendAll(fragment, children);
  return fragment;
}

/** Iniciais para avatar de reserva: primeira e última palavra do nome. */
export function initials(name = "") {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}
