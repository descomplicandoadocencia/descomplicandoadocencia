/**
 * Acesso à camada de dados (JSON em /data e blog/posts.json).
 *
 * Os caminhos são resolvidos a partir da RAIZ do site usando import.meta.url,
 * então funcionam igual em index.html, blog.html ou blog/<post>.html e no
 * subcaminho do GitHub Pages (nunca começam com "/").
 *
 * Requer servidor HTTP (GitHub Pages ou `npx serve`/`python -m http.server`):
 * fetch não lê arquivos via file://.
 */
const cache = new Map();

export function loadJSON(pathFromRoot) {
  if (!cache.has(pathFromRoot)) {
    const url = new URL(`../${pathFromRoot}`, import.meta.url);
    const request = fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`${pathFromRoot}: HTTP ${response.status}`);
        return response.json();
      })
      .catch((error) => {
        cache.delete(pathFromRoot); // permite nova tentativa depois de uma falha
        throw error;
      });
    cache.set(pathFromRoot, request);
  }
  return cache.get(pathFromRoot);
}

export const getSite = () => loadJSON("data/site.json");
export const getServices = () => loadJSON("data/services.json");
export const getProducts = () => loadJSON("data/products.json");
export const getTeam = () => loadJSON("data/team.json");
export const getPosts = () => loadJSON("blog/posts.json");
