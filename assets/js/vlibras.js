(function () {
  "use strict";

  const pluginId = "vlibras-plugin";
  const root = document.getElementById(pluginId);

  if (!root) return;

  const script = document.createElement("script");
  script.src = "https://vlibras.gov.br/app.js";
  script.async = true;
  script.defer = true;
  script.onload = () => {
    console.log("VLibras carregado com sucesso.");
  };
  script.onerror = () => {
    console.log("VLibras plugin não carregado.");
  };
  document.body.appendChild(script);

  const widget = document.createElement("div");
  const widgetClass = "vlibras-container";
  widget.className = widgetClass;
  widget.setAttribute("aria-label", "Acesso por libras");
  widget.setAttribute("role", "img");
  document.body.appendChild(widget);
})();