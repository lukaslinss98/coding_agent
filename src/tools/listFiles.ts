import type { Dirent } from "node:fs";
import { readdir } from "node:fs/promises";
import z from "zod";
import { safePath } from "./safePath.ts";

const IGNORED_FILES = new Set(["node_modules", ".git"]);
const listFilesScheme = z.object({
  path: z.string(),
});

export async function listFiles(args: unknown) {
  const parsed = listFilesScheme.safeParse(args);

  if (!parsed.success) {
    return z.prettifyError(parsed.error);
  }

  const directoryPath = safePath(parsed.data.path);

  if (directoryPath === null) {
    return `Refused: ${parsed.data.path} is outside the project directory.`;
  }

  try {
    const contents = await readdir(directoryPath, { withFileTypes: true });

    return contents.filter(useEntry).map(mapEntry).join("\n");
  } catch (err) {
    return `Error while exectuing list_files tool: ${err}`;
  }
}

function mapEntry(entry: Dirent<string>): string {
  return entry.isDirectory() ? `${entry.name}/` : entry.name;
}

function useEntry(entry: Dirent<string>): boolean {
  return !IGNORED_FILES.has(entry.name);
}
