/**
 * blog.js — lista de publicações com menu lateral de colunistas/autores.
 *
 * Fontes de dados (única fonte de verdade, sem duplicar conteúdo no HTML):
 *   - blog/posts.json  → gerado por scripts/build-blog.mjs a partir de posts/*.md
 *   - data/team.json   → pessoas; o campo "slug" liga `autor:` do post ao menu
 *
 * Filtro por hash, no mesmo padrão do site:  blog.html#/autor/<slug>
 */
import { getPosts, getTeam } from "../../modules/data.js";
import { h } from "../../modules/dom.js";

const asList = (value) => (Array.isArray(value) ? value : value ? [value] : []);

/** Rascunhos e arquivos iniciados por "_" (modelos) nunca aparecem na lista. */
export const isPublished = (post) =>
  Boolean(post) && post.rascunho !== true && !String(post.slug ?? "").startsWith("_");

/** "#/autor/pamella-balcacar" → "pamella-balcacar"; qualquer outro hash → null (sem filtro). */
export function authorFromHash(hash) {
  const match = /^#\/autor\/([a-z0-9-]+)\/?$/i.exec(hash);
  return match ? match[1].toLowerCase() : null;
}

/** Datas do JSON são UTC à meia-noite; sem timeZone "UTC" o dia recuaria em fusos como UTC-4. */
export function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function postCard(post, team) {
  const names = asList(post.autor).map((slug) => team.find((person) => person.slug === slug)?.name ?? slug);
  const when = post.date ? h("time", { datetime: String(post.date).slice(0, 10) }, formatDate(post.date)) : null;
  const tags = asList(post.tags);
  return h(
    "article",
    { class: "post-card" },
    h("h3", {}, h("a", { href: `blog/${post.slug}.html` }, post.title ?? post.slug)),
    h("p", { class: "meta" }, when, when && names.length ? " · " : null, names.length ? `por ${names.join(", ")}` : null),
    post.summary ? h("p", {}, post.summary) : null,
    tags.length ? h("ul", { class: "meta-list", "aria-label": "Tags" }, tags.map((tag) => h("li", { class: "tag" }, tag))) : null
  );
}

function renderSidebar(listEl, posts, team, selected) {
  const count = (slug) => posts.filter((post) => asList(post.autor).includes(slug)).length;
  const link = (href, label, detail, active) =>
    h(
      "li",
      {},
      h("a", { href, "aria-current": active ? "true" : null }, label, detail ? h("small", {}, detail) : null)
    );

  listEl.replaceChildren(
    link("#/", "Todas as publicações", plural(posts.length, "texto", "textos"), selected === null),
    ...team.map((person) =>
      link(`#/autor/${person.slug}`, person.name, `${person.role} · ${plural(count(person.slug), "texto", "textos")}`, selected === person.slug)
    )
  );
}

export function renderBlog({ posts, team, hash, els }) {
  const selected = authorFromHash(hash);
  const person = selected ? team.find((member) => member.slug === selected) : null;
  const visible = (selected ? posts.filter((post) => asList(post.autor).includes(selected)) : posts)
    .slice()
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  renderSidebar(els.authors, posts, team, selected);
  els.title.textContent = person ? `Publicações de ${person.name}` : "Todas as publicações";

  if (selected && !person) {
    els.status.textContent = "Colunista não encontrado. Escolha um nome no menu lateral.";
  } else if (visible.length === 0) {
    els.status.textContent = person ? `${person.name} ainda não tem publicações.` : "Ainda não há publicações.";
  } else {
    els.status.textContent = plural(visible.length, "publicação encontrada.", "publicações encontradas.");
  }
  els.posts.replaceChildren(...visible.map((post) => postCard(post, team)));
}

async function init() {
  const els = {
    authors: document.getElementById("author-list"),
    posts: document.getElementById("post-list"),
    status: document.getElementById("blog-status"),
    title: document.getElementById("posts-title"),
  };
  if (!els.authors || !els.posts || !els.status || !els.title) return;

  try {
    const [allPosts, team] = await Promise.all([getPosts(), getTeam()]);
    const posts = allPosts.filter(isPublished);
    const draw = () => renderBlog({ posts, team, hash: window.location.hash, els });
    draw();
    window.addEventListener("hashchange", draw);
  } catch (error) {
    console.error("[blog] falha ao carregar os dados", error);
    els.status.textContent =
      "Não foi possível carregar as publicações. Se você abriu este arquivo direto do disco (file://), use um servidor local — veja o README.";
  }
}

init();
