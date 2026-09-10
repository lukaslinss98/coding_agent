import { mkdtemp } from "node:fs/promises";
import { join } from "node:path";

export function makeTempDirInsideProject(prefix: string): Promise<string> {
  return mkdtemp(join(process.cwd(), prefix));
}
