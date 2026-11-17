/**
 * Tema claro/escuro.
 *
 *  - A escolha manual fica em localStorage na chave "theme" ("light" | "dark").
 *  - Sem escolha manual, o tema acompanha o sistema (prefers-color-scheme) e
 *    muda junto com ele. Nada é gravado até a pessoa clicar no botão.
 *  - O atributo data-theme é aplicado ANTES da pintura por um script inline no
 *    <head> (evita o "flash" de tema errado); aqui mantemos botão e persistência.
 *  - O botão usa aria-pressed (true = tema escuro ativo) com rótulo fixo.
 */

const KEY = "theme";
const VALID = ["light", "dark"];

const lightQuery = () => (typeof matchMedia === "function" ? matchMedia("(prefers-color-scheme: light)") : null);

export function systemTheme() {
  return lightQuery()?.matches ? "light" : "dark";
}

function readStored() {
  try {
    const value = localStorage.getItem(KEY);
    return VALID.includes(value) ? value : null;
  } catch {
    return null; // armazenamento bloqueado (modo privado, políticas do navegador)
  }
}

function store(theme) {
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* sem persistência: o tema vale apenas para esta visita */
  }
}

export function currentTheme() {
  return document.documentElement.dataset.theme || readStored() || systemTheme();
}

function apply(theme, button) {
  document.documentElement.dataset.theme = theme;
  button?.setAttribute("aria-pressed", String(theme === "dark"));
}

export function initTheme(button) {
  apply(readStored() || systemTheme(), button);

  button?.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    apply(next, button);
    store(next);
  });

  lightQuery()?.addEventListener?.("change", () => {
    if (!readStored()) apply(systemTheme(), button);
  });
}
