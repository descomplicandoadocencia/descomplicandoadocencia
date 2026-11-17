/**
 * Skip link ("Pular para o conteúdo") compatível com roteamento por hash.
 *
 * Um <a href="#app"> comum mudaria location.hash para "#app" e dispararia o
 * roteador. Aqui interceptamos o clique, movemos o foco para o alvo e NÃO
 * alteramos o hash. Sem JavaScript, o link nativo continua funcionando.
 */
export function initSkipLink(link) {
  if (!link) return;
  link.addEventListener("click", (event) => {
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return; // sem alvo: deixa o navegador agir normalmente
    event.preventDefault();
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus();
  });
}
