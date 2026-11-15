import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const dirsToScan = [
  path.join(ROOT, "posts"),
  path.join(ROOT, "landings"),
  path.join(ROOT, "blog"),
  path.join(ROOT, "lp"),
];

const getTargetFiles = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") || file.endsWith(".html"))
    .map((file) => path.join(dir, file));
};

const checkComments = () => {
  const files = dirsToScan.flatMap(getTargetFiles);
  let foundComments = 0;

  const htmlCommentRegex = /<!--([\s\S]*?)-->/g;

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf8");
    const relativeFile = path.relative(ROOT, filePath);
    let match;

    while ((match = htmlCommentRegex.exec(content)) !== null) {
      const commentText = match[1].trim();
      console.warn(`[AVISO] Comentário encontrado em ${relativeFile}: <!-- ${commentText} -->`);
      foundComments++;
    }
  }

  if (foundComments > 0) {
    console.error(`\nVerificação falhou: ${foundComments} comentário(s) encontrado(s).`);
    process.exit(1);
  }

  console.log(`Nenhum comentário pendente encontrado em ${files.length} arquivo(s).`);
};

checkComments();
