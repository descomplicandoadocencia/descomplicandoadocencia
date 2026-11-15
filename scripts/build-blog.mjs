import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();

const postsDir = path.join(ROOT, "posts");
const outputDir = path.join(ROOT, "blog");

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

  if (!fs.existsSync(postsDir)) {
    console.warn("Pasta 'posts' não encontrada.");
    return;
  }

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  const allPosts = [];

  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data: meta, content } = matter(fileContent);

    const slug = file.replace(/\.md$/, "");
    const htmlContent = renderMarkdown(content);

    const postHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>${meta.title || slug}</title>
</head>
<body>
  <article>
    <h1>${meta.title || slug}</h1>
    ${htmlContent}
  </article>
</body>
</html>`;

    fs.writeFileSync(path.join(outputDir, `${slug}.html`), postHtml, "utf8");

    allPosts.push({
      slug,
      ...meta,
    });
  }

  fs.writeFileSync(
    path.join(outputDir, "posts.json"),
    JSON.stringify(allPosts, null, 2),
    "utf8"
  );

  console.log(`Build concluído. ${allPosts.length} post(s) gerado(s).`);
};

build();
