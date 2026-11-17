import { h, initials } from "../modules/dom.js";

/**
 * Cartões. O parâmetro `level` é o nível do título do cartão: 3 quando o cartão
 * está sob um <h2> (home) e 2 quando está direto sob o <h1> da página — assim a
 * hierarquia de títulos nunca "pula" nível (WCAG 1.3.1).
 */

export function TagList(tags = [], label = "Temas") {
  if (!tags.length) return null;
  return h("ul", { class: "meta-list", "aria-label": label }, tags.map((tag) => h("li", { class: "tag" }, tag)));
}

export function ServiceCard({ title, description, tags }, level = 3) {
  return h("article", { class: "service-card" }, h(`h${level}`, {}, title), h("p", {}, description), TagList(tags));
}

export function ResourceCard({ type, title, summary, tags }, level = 3) {
  return h(
    "article",
    { class: "resource-card" },
    h("span", { class: "tag" }, type),
    h(`h${level}`, {}, title),
    h("p", {}, summary),
    TagList(tags)
  );
}

/** Foto da pessoa; se o arquivo não existir (ainda), troca por um avatar com iniciais. */
function Photo(person) {
  const avatar = () => h("span", { class: "avatar", "aria-hidden": "true" }, initials(person.name));
  if (!person.photo) return avatar();
  const img = h("img", { src: person.photo, alt: "", width: 96, height: 96 });
  img.addEventListener("error", () => img.replaceWith(avatar()), { once: true });
  return img;
}

export function TeamCard(person, level = 2) {
  return h(
    "article",
    { class: "team-card" },
    Photo(person),
    h(`h${level}`, {}, person.name),
    h("p", {}, h("strong", {}, person.role)),
    h("p", {}, person.bio)
  );
}
