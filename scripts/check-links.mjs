import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const targetDirs = [path.join(ROOT, "blog"), path.join(ROOT, "lp")];

const getHtmlFiles = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".html"))
    .map((file) => path.join(dir, file));
};

const checkLinks = () => {
  const htmlFiles = targetDirs.flatMap(getHtmlFiles);
  let errors = 0;

  if (htmlFiles.length === 0) {
    console.log("Nenhum arquivo HTML encontrado para verificar links.");
    return;
  }

  const hrefRegex = /href=["']([^"']*)["']/gi;

  for (const filePath of htmlFiles) {
    const content = fs.readFileSync(filePath, "utf8");
    const relativeFile = path.relative(ROOT, filePath);
    let match;

    while ((match = hrefRegex.exec(content)) !== null) {
      const url = match[1].trim();

      if (!url || url === "#" || url.startsWith("javascript:")) {
        console.error(`[ERRO] Link vazio ou inválido em ${relativeFile}: "${url}"`);
        errors++;
        continue;
      }

      if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("mailto:")) {
        const cleanUrl = url.split("#")[0].split("?")[0];
        const localTarget = path.resolve(path.dirname(filePath), cleanUrl);

        if (!fs.existsSync(localTarget)) {
          console.error(`[ERRO] Link interno quebrado em ${relativeFile}: "${url}"`);
          errors++;
        }
      }
    }
  }

  if (errors > 0) {
    console.error(`\nVerificação falhou com ${errors} link(s) inválido(s).`);
    process.exit(1);
  }

  console.log(`Links verificados com sucesso em ${htmlFiles.length} arquivo(s).`);
};

checkLinks();
