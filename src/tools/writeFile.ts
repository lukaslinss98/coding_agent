import z from "zod";
import { safePath } from "./safePath.ts";
import { writeFile } from "node:fs/promises";

const writeToFileSchema = z.object({
  path: z.string(),
  content: z.string(),
});

export async function writeToFile(args: unknown): Promise<string> {
  const parsed = writeToFileSchema.safeParse(args);

  if (!parsed.success) {
    return z.prettifyError(parsed.error);
  }

  const filePath = safePath(parsed.data.path);

  if (filePath === null) {
    return `Refused: ${parsed.data.path} is outside the project directory.`;
  }

  const content = parsed.data.content;

  try {
    await writeFile(filePath, content, "utf-8");
  } catch (err) {
    return `Error while invoking tool, write_file: ${err}`;
  }

  const bytes = Buffer.byteLength(content, "utf-8");

  return `Wrote ${bytes} to ${parsed.data.path}`;
}
