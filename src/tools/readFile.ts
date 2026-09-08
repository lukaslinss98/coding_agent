import z from "zod";
import { readFile } from "node:fs/promises";

const readFileScheme = z.object({
  path: z.string()
})

export async function readFileTool(args: unknown): Promise<string> {

  const parsed = readFileScheme.safeParse(args)

  if (!parsed.success) {
    return z.prettifyError(parsed.error)
  }

  const filePath = parsed.data.path
  try {
    return await readFile(filePath, "utf-8")
  } catch (err) {
    return `$Could not read ${filePath}: ${err}`
  }
}
