import fs from "fs";
import path from "path";

import { TAG_START, TAG_END, README_FILE } from "../config/constants";

/**
 * Update the README.md file with the given tree.
 * If the README.md file does not exist, create a new one.
 * If the README.md file exists, replace the existing tree block with the given tree.
 * The tree block is defined by the TAG_START and TAG_END constants.
 * If the tree block does not exist, append the given tree to the end of the file.
 * @param {string} rootDir - The root directory of the project.
 * @param {string} tree - The tree string to be inserted into the README.md file.
 * @returns {Promise<void>} - A promise that resolves when the README.md file has been updated.
 */
export async function updateReadme(rootDir: string, tree: string) {
  const readmePath = path.join(rootDir, README_FILE); //

  let readme = fs.existsSync(readmePath)
    ? fs.readFileSync(readmePath, "utf8")
    : "# Project Tree\n";

  //
  const content = `${TAG_START}\n\`\`\`\n${tree}\n\`\`\`\n${TAG_END}`;
  const regex = new RegExp(`${TAG_START}[\\s\\S]*?${TAG_END}`, "g");

  if (readme.match(regex)) {
    readme = readme.replace(regex, content);
  } else {
    readme = `${readme.trim()}\n\n${content}\n`;
  }

  fs.writeFileSync(readmePath, readme, "utf8");
}
