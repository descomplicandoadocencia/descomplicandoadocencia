/**
 * shell.js — comportamento comum das páginas estáticas
 * (termos.html, privacidade.html, blog.html e blog/<post>.html):
 * tema claro/escuro, menu recolhível e skip link.
 *
 * Os imports são relativos a ESTE arquivo, por isso funcionam a partir de
 * qualquer profundidade de página (raiz ou blog/).
 */
import { initTheme } from "../../modules/theme.js";
import { initMenu } from "../../modules/menu.js";
import { initSkipLink } from "../../modules/a11y.js";

initTheme(document.querySelector(".theme-toggle"));
initMenu({
  toggle: document.querySelector(".nav-toggle"),
  nav: document.getElementById("site-nav")
});
initSkipLink(document.querySelector(".skip-link"));
