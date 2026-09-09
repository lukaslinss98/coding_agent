import { listFiles } from "./listFiles.ts";
import { readFileTool } from "./readFile.ts";
import { writeToFile } from "./writeFile.ts";

type Tool = {
  description: string;
  function: (arg: unknown) => Promise<string>;
};

export const tools: Record<string, Tool> = {
  read_file: {
    description: `Read one text file. Args: {"path": string} - path relative to project root, must stay inside the project. Returns the file text. Fails if missing or outside the project.`,
    function: readFileTool,
  },
  list_files: {
    description: `List names in one directory. Not recursive - call again to go deeper. Args: {"path": string} - directory relative to project root, use "." for root. Returns one name per line, directories end with "/". Fails if outside the project.`,
    function: listFiles,
  },
  write_file: {
    description: `Write full new content to a file. Creates the file if missing. Overwrites the whole file without warning. Args: {"path": string, "content": string} - path relative to project root, must stay inside the project. Returns a short confirmation.`,
    function: writeToFile,
  },
};

export const toolsDescription = Object.entries(tools)
  .map(([name, tool]) => `${name} - ${tool.description}`)
  .join("\n\n");
