/**
 * Menu de navegação recolhível (telas estreitas).
 *
 * O CSS só recolhe o menu quando <html> tem a classe "js" (aplicada no <head>)
 * e o <nav> está com data-open="false" — sem JavaScript o menu fica sempre visível.
 *
 * Teclado: Esc fecha o menu e devolve o foco ao botão; clicar em um link fecha.
 */
export function initMenu({ toggle, nav } = {}) {
  if (!toggle || !nav) return { close() {} };

  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";
  const set = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.dataset.open = String(open);
  };

  set(false);
  toggle.addEventListener("click", () => set(!isOpen()));
  nav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) set(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      set(false);
      toggle.focus();
    }
  });

  return { close: () => set(false) };
}
