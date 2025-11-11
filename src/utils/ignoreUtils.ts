import fs from "fs";
import path from "path";
import { minimatch } from "minimatch"; //

let treeIgnorePatterns: string[] | null = null;


/**
* Returns the ignore pattern contained in the .treeignore file
* in the given directory.
* If the .treeignore file is not found, it returns an empty array.
 * @param {string} rootDir - The directory where the .treeignore file is located
 * @returns {string[]} The ignore pattern contained in the .treeignore file
 */
export function getTreeIgnorePatterns(rootDir: string): string[] {
  if (treeIgnorePatterns !== null) return treeIgnorePatterns;

  const ignoreFile = path.resolve(rootDir, ".treeignore");
  if (fs.existsSync(ignoreFile)) {
    treeIgnorePatterns = fs
      .readFileSync(ignoreFile, "utf8")
      .split("\n")
      .map(line => line.trim())
      .filter(line => line && !line.startsWith("#"));
  } else {
    treeIgnorePatterns = [];
  }
  return treeIgnorePatterns;
}


/**
 * Checks if the given entry should be ignored based on the base ignore list and the root directory.
 * The base ignore list is expanded by adding a trailing '**' to each pattern that does not contain a '/'.
 * The expanded list is then used to check if the entry name or relative path matches any of the patterns.
 * If a match is found, the entry is considered ignored and the function returns true.
 * Otherwise, the function returns false.
 * @param entryName - The name of the entry to check.
 * @param entryPath - The path of the entry to check.
 * @param baseIgnoreList - The base list of ignore patterns.
 * @param rootDir - The root directory to resolve the relative path against.
 * @returns True if the entry should be ignored, false otherwise.
 */
export function shouldIgnore(
  entryName: string,
  entryPath: string,
  baseIgnoreList: string[],
  rootDir: string
): boolean {
  
  const allPatterns = baseIgnoreList;
  const relativePath = path.relative(rootDir, entryPath);

  for (const pattern of allPatterns) {
    const patternsToTest = [
      pattern, 
    ];

    if (!pattern.includes('/')) {
      patternsToTest.push(`${pattern}/**`);
    } else if (pattern.endsWith('/')) {
      patternsToTest.push(`${pattern}**`);
    }
    
    for (const p of patternsToTest) {
      if (
        minimatch(entryName, p, { dot: true }) || 
        minimatch(relativePath, p, { dot: true }) 
      ) {
        return true; 
      }
    }
  }

  return false;
}

/**
 * Resets the tree ignore patterns cache.
 * This function should be called when the tree ignore patterns change (e.g. when the .treeignore file is updated).
 * It resets the cache so that the next call to getTreeIgnorePatterns will re-read the .treeignore file.
 */
export function resetIgnoreCache(): void {
  treeIgnorePatterns = null;
}