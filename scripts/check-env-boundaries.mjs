import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const sourceRoot = join(root, "src");
const sourceExtensions = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx"]);
const failures = [];

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? collectFiles(path) : [path];
    }),
  );
  return nested.flat();
}

const sourceFiles = (await collectFiles(sourceRoot)).filter((path) =>
  sourceExtensions.has(extname(path)),
);

for (const path of sourceFiles) {
  const content = await readFile(path, "utf8");
  const displayPath = relative(root, path);
  const isClientModule = /^\s*["']use client["'];/m.test(content);

  if (/NEXT_PUBLIC_[A-Z0-9_]*(SECRET|SERVICE_ROLE|PASSWORD|PRIVATE|TOKEN)/.test(content)) {
    failures.push(`${displayPath}: privileged name uses NEXT_PUBLIC_`);
  }

  if (
    isClientModule &&
    /(SUPABASE_SECRET_KEY|getSupabaseServerEnv|createAdminClient|\/env\/server|\/supabase\/admin)/.test(
      content,
    )
  ) {
    failures.push(`${displayPath}: client module references a server-only secret boundary`);
  }
}

const envExample = await readFile(join(root, ".env.example"), "utf8");
for (const line of envExample.split("\n")) {
  const match = line.match(/^([A-Z][A-Z0-9_]*)=/);
  if (!match) continue;
  const name = match[1];
  if (/^NEXT_PUBLIC_.*(SECRET|SERVICE_ROLE|PASSWORD|PRIVATE|TOKEN)/.test(name)) {
    failures.push(`.env.example: ${name} must remain server-only`);
  }
}

const gitignore = await readFile(join(root, ".gitignore"), "utf8");
if (!gitignore.includes(".env*")) {
  failures.push(".gitignore: .env files are not ignored");
}

if (failures.length > 0) {
  console.error(`[환경변수 경계 오류]\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log("환경변수 경계 검증 통과");
