import fs from "fs";
import path from "path";

/**
 * Checks if a given path is a directory.
 * @param {string} filePath The path to check.
 * @returns {boolean} True if the path is a directory, false otherwise.
 */
export function isDirectory(filePath: string): boolean {
  return fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory();
}

/**
 * Reads the contents of a directory safely, returning an array of
 * Dirent objects if the directory exists, and an empty array if the
 * directory does not exist.
 * @param {string} dir The path to the directory to read.
 * @returns {fs.Dirent[]} An array of Dirent objects representing the
 * contents of the directory.
 */
export function readDirSafe(dir: string): fs.Dirent[] {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

/**
 * Resolve a path by joining the given segments and
 * normalizing the path using path.resolve.
 * @param {...string[]} segments The segments to join and resolve.
 * @returns {string} The resolved path.
 */
export function resolvePath(...segments: string[]): string {
  return path.resolve(...segments);
}

/**
 * Writes content to a file safely.
 * Creates all the necessary directories if the file path does not exist.
 * @param {string} filePath The path to the file to write.
 * @param {string} content The content to write to the file.
 */
export function writeFileSafe(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

/**
 * Reads a file safely, returning the file contents if the file exists,
 * and an empty string if the file does not exist.
 *
 * @param {string} filePath The path to the file to read.
 * @returns {string} The contents of the file, or an empty string if the file does not exist.
 */
export function readFileSafe(filePath: string): string {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}
