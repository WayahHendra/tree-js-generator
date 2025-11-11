import fs from "fs";
import path from "path";
import { shouldIgnore } from "../utils/ignoreUtils";
import { GenerateTreeOptions } from "../config/types";

/**
 * Generates a string representation of a directory tree.
 *
 * @param {string} dir - The directory to generate the tree for.
 * @param {GenerateTreeOptions} options - Options for generating the tree.
 * @param {string} rootDir - The root directory of the project.
 * @param {string} [prefix=""] - The prefix to add to each line of the tree.
 * @param {number} [currentDepth=0] - The current depth of the tree.
 * @returns {Promise<string>} - A promise that resolves to a string representation of the directory tree.
 */
export async function generateTree(
  dir: string,
  options: GenerateTreeOptions,
  rootDir: string,
  prefix = "",
  currentDepth = 0,
): Promise<string> {
  if (options.depth !== undefined && currentDepth > options.depth) {
    return "";
  }

  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => {
      const entryPath = path.join(dir, entry.name);
      return !shouldIgnore(
        entry.name,
        entryPath,
        options.ignorePatterns,
        rootDir,
      );
    })
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });
  // .sort((a, b) => a.name.localeCompare(b.name));

  const lines: string[] = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const isLast = i === entries.length - 1;
    const branch = isLast ? "└── " : "├── ";
    const subPrefix = prefix + (isLast ? "    " : "│   ");
    lines.push(prefix + branch + entry.name);

    if (entry.isDirectory()) {
      const subTree = await generateTree(
        path.join(dir, entry.name),
        options,
        rootDir,
        subPrefix,
        currentDepth + 1,
      );
      if (subTree) lines.push(subTree);
    }
  }

  return lines.join("\n");
}
