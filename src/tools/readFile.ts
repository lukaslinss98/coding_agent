import z from "zod";
import { readFile } from "node:fs/promises";
import { safePath } from "./safePath.ts";

const readFileScheme = z.object({
  path: z.string(),
});

export async function readFileTool(args: unknown): Promise<string> {
  const parsed = readFileScheme.safeParse(args);

  if (!parsed.success) {
    return z.prettifyError(parsed.error);
  }

  const filePath = safePath(parsed.data.path);

  if (filePath === null) {
    return `Refused: ${parsed.data.path} is outside the project directory.`;
  }

  try {
    return await readFile(filePath, "utf-8");
  } catch (err) {
    return `Could not read ${parsed.data.path}: ${err}`;
  }
}
