/**
 * Busca e filtro do catálogo (funções puras, testáveis sem DOM).
 *
 * normalize(): minúsculas e sem acentos, então "computacao" encontra "Computação".
 * filterResources(): cada palavra da busca precisa aparecer em algum campo
 * (título, resumo, descrição, categoria, tipo ou tags) — busca "E", não "OU".
 */

export const normalize = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();

const haystack = (item) =>
  normalize([item.title, item.summary, item.description, item.category, item.type, ...(item.tags ?? [])].join(" "));

export function filterResources(items, { type = "all", query = "" } = {}) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  return items.filter((item) => {
    if (type !== "all" && item.type !== type) return false;
    if (words.length === 0) return true;
    const text = haystack(item);
    return words.every((word) => text.includes(word));
  });
}

/** Tipos presentes nos dados, na ordem de exibição do catálogo (REA, OAD, RED, depois outros). */
export function typesOf(items) {
  const order = ["REA", "OAD", "RED"];
  const found = [...new Set(items.map((item) => item.type))];
  return found.sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    return (ia === -1 ? order.length : ia) - (ib === -1 ? order.length : ib) || a.localeCompare(b);
  });
}
