import { listFiles } from "./listFiles.ts";
import { readFileTool } from "./readFile.ts";
import { writeToFile } from "./writeFile.ts";

type Tool = {
  description: string,
  function: (arg: unknown) => Promise<string>
}

export const tools: Record<string, Tool> = {
  read_file: {
    description:
      `Read the contents of a single text file. Args: {"path": string} - the path to the file, relative to the project root. Returns the file contents as text.`,
    function: readFileTool
  },
  list_files: {
    description:
      `List the names in one directory. Not recursive - call it again to go deeper. Args: {"path": string} - the directory, relative to the project root. Use "." for the root. Returns one name per line. Directories end with a slash.`,
    function: listFiles
  },
  write_file: {
    description:
      `Write text to a file, creating it if needed. Overwrites the whole file without warning - read it first if you only mean to change part of it. Args: {"path": string, "content": string} - the path relative to the project root, and the complete new contents. Returns a short confirmation.`,
    function: writeToFile
  }
}

export const toolsDescription = Object.entries(tools)
  .map(([name, tool]) => `${name} - ${tool.description}`)
  .join('\n\n')
