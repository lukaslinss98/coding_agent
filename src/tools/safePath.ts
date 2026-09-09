import { isAbsolute, relative, resolve } from "node:path";

const ROOT = process.cwd();

export function safePath(input: string, root: string = ROOT): string | null {
  const full = resolve(root, input);
  const rel = relative(root, full);

  if (rel === "") {
    return full;
  }
  if (rel.startsWith("..") || isAbsolute(rel)) {
    return null;
  }
  return full;
}
