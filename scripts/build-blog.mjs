/**
 * build-blog.mjs — posts/*.md  →  blog/<slug>.html  +  blog/posts.json
 *
 * Executado pelo workflow .github/workflows/blog.yml (npm run build).
 * Usa gray-matter (front matter YAML) e marked (Markdown → HTML) e preenche
 * templates/post.html trocando {{marcadores}} em UMA passada: o conteúdo já
 * inserido nunca é reprocessado, então um "{{x}}" dentro de um post não é trocado.
 *
 * Regras:
 *  - `rascunho: true` ou arquivo iniciado por "_" (ex.: _modelo.md) não é publicado
 *    e a página gerada anteriormente, se existir, é removida.
 *  - Caminhos relativos no Markdown (imagens e links) são escritos a partir da RAIZ
 *    do repositório; aqui ganham "../" porque as páginas ficam em blog/.
 *  - Um "# Título" inicial igual ao título do front matter é removido (o template já
 *    tem o <h1>); qualquer outro "#" vira <h2> para existir um único <h1> por página.
 *  - Se um post tiver erro, os demais continuam e o processo termina com código 1;
 *    a linha "::error file=…" aparece como anotação no GitHub Actions.
 *  - HTML bruto escrito dentro do Markdown é mantido como está (conteúdo da equipe).
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "posts");
const OUT_DIR = path.join(ROOT, "blog");
const TEMPLATE_FILE = path.join(ROOT, "templates", "post.html");
const TEAM_FILE = path.join(ROOT, "data", "team.json");

let failures = 0;
const fail = (file, message) => {
  failures += 1;
  console.error(`::error file=${file}::${message}`);
  console.error(`[ERRO] ${file}: ${message}`);
};

export const escapeHtml = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Aceita "a", ["a", "b"] ou vazio e devolve sempre um array de textos limpos. */
export const asList = (value) =>
  (Array.isArray(value) ? value : value == null ? [] : [value]).map((item) => String(item).trim()).filter(Boolean);

/** YAML `date: 2026-11-14` vira Date (UTC); texto "2026-11-14" também é aceito. */
export function toIsoDay(value) {
  const text = value instanceof Date ? value.toISOString() : String(value ?? "");
  if (!/^\d{4}-\d{2}-\d{2}/.test(text)) throw new Error('campo "date" ausente ou fora do formato AAAA-MM-DD');
  return text.slice(0, 10);
}

const longDate = (isoDay) =>
  new Date(`${isoDay}T00:00:00Z`).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** Prefixa "../" em caminhos relativos; mantém http(s):, mailto:, #âncora, //cdn, /abs e ../ */
export function rewriteUrl(href) {
  if (!href || /^([a-z][a-z0-9+.-]*:|#|\/|\.\.\/)/i.test(href)) return href;
  return `../${href}`;
}

const plainText = (value) => String(value).replace(/\s+/g, " ").trim().toLowerCase();

export function renderMarkdown(markdown, title) {
  const tokens = marked.lexer(markdown);
  const first = tokens.find((token) => token.type !== "space");
  if (first && first.type === "heading" && first.depth === 1 && plainText(first.text) === plainText(title)) {
    tokens.splice(tokens.indexOf(first), 1);
  }
  marked.walkTokens(tokens, (token) => {
    if (token.type === "heading" && token.depth === 1) token.depth = 2;
    if (token.type === "link" || token.type === "image") token.href = rewriteUrl(token.href);
  });
  return marked.parser(tokens);
}

/** Preenche {{chave}} em uma única passada. Chave desconhecida vira texto vazio. */
export const fillTemplate = (template, values) => template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? "");

function readTeam() {
  try {
    return JSON.parse(fs.readFileSync(TEAM_FILE, "utf8"));
  } catch (error) {
    fail("data/team.json", `JSON inválido ou ausente (${error.message}). Nomes de autores não serão resolvidos.`);
    return [];
  }
}

function buildPost(file, template, team) {
  const relative = `posts/${file}`;
  const slug = file.replace(/\.md$/, "");
  if (!/^[A-Za-z0-9._-]+$/.test(slug)) throw new Error("nome do arquivo deve usar só letras, números, ponto, hífen e sublinhado");

  const { data: meta, content } = matter(fs.readFileSync(path.join(POSTS_DIR, file), "utf8"));
  if (!meta.title || !String(meta.title).trim()) throw new Error('campo "title" é obrigatório');
  const title = String(meta.title).trim();
  const day = toIsoDay(meta.date);

  const authors = asList(meta.autor);
  const authorNames = authors.map((slugOrName) => team.find((person) => person.slug === slugOrName)?.name ?? slugOrName);
  const tags = asList(meta.tags);

  if (meta.cover && !meta.cover_alt) throw new Error('"cover_alt" é obrigatório quando há "cover" (texto alternativo da capa)');

  const byline = [
    `<time datetime="${day}">${longDate(day)}</time>`,
    authorNames.length ? `por ${escapeHtml(authorNames.join(", "))}` : "",
    meta.atualizado ? `atualizado em <time datetime="${toIsoDay(meta.atualizado)}">${longDate(toIsoDay(meta.atualizado))}</time>` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  const html = fillTemplate(template, {
    title: escapeHtml(title),
    description: escapeHtml(meta.summary ?? ""),
    slug,
    byline,
    cover: meta.cover
      ? `<figure><img src="${escapeHtml(rewriteUrl(String(meta.cover)))}" alt="${escapeHtml(meta.cover_alt)}" /></figure>`
      : "",
    content: renderMarkdown(content, title),
    tags: tags.length
      ? `<ul class="meta-list" aria-label="Tags">${tags.map((tag) => `<li class="tag">${escapeHtml(tag)}</li>`).join("")}</ul>`
      : "",
  });
  fs.writeFileSync(path.join(OUT_DIR, `${slug}.html`), html, "utf8");

  // Registro público para o blog.html (somente campos definidos, listas normalizadas).
  const entry = {
    slug,
    title,
    date: new Date(`${day}T00:00:00Z`).toISOString(),
    summary: meta.summary,
    area: meta.area && asList(meta.area),
    atuacao: meta.atuacao && asList(meta.atuacao),
    tags: tags.length ? tags : undefined,
    autor: authors.length ? authors : undefined,
    destaque: meta.destaque,
    formato: meta.formato,
    publico: meta.publico && asList(meta.publico),
    cover: meta.cover,
    cover_alt: meta.cover_alt,
    habilidades: meta.habilidades && asList(meta.habilidades),
    atualizado: meta.atualizado ? toIsoDay(meta.atualizado) : undefined,
    comentarios: meta.comentarios,
  };
  return Object.fromEntries(Object.entries(entry).filter(([, value]) => value !== undefined));
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  if (!fs.existsSync(POSTS_DIR)) {
    console.warn("Pasta 'posts' não encontrada.");
    return;
  }
  if (!fs.existsSync(TEMPLATE_FILE)) {
    fail("templates/post.html", "template do blog não encontrado");
    return;
  }
  const template = fs.readFileSync(TEMPLATE_FILE, "utf8");
  const team = readTeam();
  const published = [];

  for (const file of fs.readdirSync(POSTS_DIR).filter((name) => name.endsWith(".md")).sort()) {
    const slug = file.replace(/\.md$/, "");
    try {
      const raw = matter(fs.readFileSync(path.join(POSTS_DIR, file), "utf8")).data;
      const isDraft = raw.rascunho === true || String(raw.rascunho).toLowerCase() === "true" || slug.startsWith("_");
      if (isDraft) {
        fs.rmSync(path.join(OUT_DIR, `${slug}.html`), { force: true });
        console.log(`Ignorado (rascunho/modelo): ${file}`);
        continue;
      }
      published.push(buildPost(file, template, team));
    } catch (error) {
      fail(`posts/${file}`, error.message);
    }
  }

  published.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  fs.writeFileSync(path.join(OUT_DIR, "posts.json"), `${JSON.stringify(published, null, 2)}\n`, "utf8");
  console.log(`Build concluído. ${published.length} post(s) publicado(s).`);
}

// Permite importar as funções puras em testes sem executar o build.
if (import.meta.url === new URL(process.argv[1] ?? "", "file://").href || process.argv[1]?.endsWith("build-blog.mjs")) {
  main();
  process.exitCode = failures ? 1 : 0;
}
