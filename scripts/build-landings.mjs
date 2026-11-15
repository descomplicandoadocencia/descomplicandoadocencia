import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();

const landingsDir = path.join(ROOT, "landings");
const outputDir = path.join(ROOT, "lp");

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });

const renderMarkdown = (text) => {
  const html = text
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\n/g, "<br />");
  return html;
};

const build = () => {
  ensureDir(outputDir);

  if (!fs.existsSync(landingsDir)) {
    console.warn("Pasta 'landings' não encontrada.");
    return;
  }

  const files = fs.readdirSync(landingsDir).filter((f) => f.endsWith(".md"));
  const allLandings = [];

  for (const file of files) {
    const filePath = path.join(landingsDir, file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data: meta, content } = matter(fileContent);

    const slug = file.replace(/\.md$/, "");
    const htmlContent = renderMarkdown(content);

    const ctaHtml =
      meta.ctaText && meta.ctaUrl
        ? `<a href="${meta.ctaUrl}" class="cta-button">${meta.ctaText}</a>`
        : "";

    const landingHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${meta.description || ""}" />
  <title>${meta.title || slug}</title>
</head>
<body>
  <header class="hero">
    <h1>${meta.headline || meta.title || slug}</h1>
    ${meta.subheadline ? `<p class="subheadline">${meta.subheadline}</p>` : ""}
    ${ctaHtml}
  </header>
  <main class="content">
    ${htmlContent}
  </main>
  ${ctaHtml ? `<footer>${ctaHtml}</footer>` : ""}
</body>
</html>`;

    fs.writeFileSync(path.join(outputDir, `${slug}.html`), landingHtml, "utf8");

    allLandings.push({
      slug,
      ...meta,
    });
  }

  fs.writeFileSync(
    path.join(outputDir, "landings.json"),
    JSON.stringify(allLandings, null, 2),
    "utf8"
  );

  console.log(`Build concluído. ${allLandings.length} landing page(s) gerada(s).`);
};

build();
