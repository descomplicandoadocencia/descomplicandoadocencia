/**
 * main.js — ponto de entrada da versão modular (index-modular.html).
 *
 * Usa a mesma infraestrutura da versão principal (/modules) e troca apenas a
 * origem do conteúdo: views em modules/views.js + dados em /data/*.json.
 */
import { createRouter } from "../../modules/router.js";
import { initTheme } from "../../modules/theme.js";
import { initMenu } from "../../modules/menu.js";
import { initSkipLink } from "../../modules/a11y.js";
import * as views from "../../modules/views.js";

const routes = {
  "/inicio": { title: "Início", render: views.renderHome },
  "/servicos": { title: "Serviços", render: views.renderServices },
  "/recursos": { title: "Recursos", render: views.renderResources },
  "/equipe": { title: "Equipe", render: views.renderTeam },
  "/sobre": { title: "Sobre", render: views.renderAbout },
  "/licenciamento": { title: "Licenciamento", render: views.renderLicensing },
};

const outlet = document.getElementById("app");

initTheme(document.querySelector(".theme-toggle"));
const menu = initMenu({
  toggle: document.querySelector(".nav-toggle"),
  nav: document.getElementById("site-nav"),
});
initSkipLink(document.querySelector(".skip-link"));

if (outlet) {
  createRouter({
    routes,
    notFound: { title: "Página não encontrada", render: views.renderNotFound },
    outlet,
    siteName: "Descomplicando a Docência",
    homeTitle: "Descomplicando a Docência · Recursos educacionais abertos",
    onChange: () => menu.close(),
  }).start();
}
