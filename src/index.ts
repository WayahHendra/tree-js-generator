#!/usr/bin/env node
import path from "path";
import fs from "fs-extra";
import { program } from "commander";
import { cosmiconfig } from "cosmiconfig";
import ora from "ora";
import chokidar from "chokidar";
import { minimatch } from "minimatch";
import { generateTree } from "./core/generateTree";
import { updateReadme } from "./core/updateReadme";
import { logError, logInfo } from "./utils/logger";
import { DEFAULT_IGNORES } from "./config/constants";
import { GenerateTreeOptions } from "./config/types";
import {
  resetIgnoreCache,
  getTreeIgnorePatterns,
} from "./utils/ignoreUtils";

const pkg = require("../package.json");

const explorer = cosmiconfig("treerc");
const cwd = process.cwd();

let isGenerating = false;
let debounceTimer: NodeJS.Timeout;


/**
 * Removes all undefined values from the given options object.
 * This is useful for cleaning up CLI options before passing them to
 * other functions.
 * @param {any} options - The options object to clean.
 * @returns {any} - The cleaned options object.
 */
function cleanCliOptions(options: any) {
  const cleaned: any = {};
  for (const key in options) {
    if (options[key] !== undefined) {
      cleaned[key] = options[key];
    }
  }
  return cleaned;
}

/**
 * Returns an array of all ignore patterns from the given configuration.
 * The array contains ignore patterns from the following sources, in order:
 * 1. DEFAULT_IGNORES (hardcoded default ignore patterns)
 * 2. CLI ignore patterns (option -i, --ignore)
 * 3. Config ignore patterns (config.ignoreFromFile)
 * 4. File ignore patterns (from .treeignore file)
 * @param {any} config - The configuration object
 * @param {string} rootDir - The root directory where the .treeignore file is located
 * @returns {string[]} An array of all ignore patterns
 */
function getAllIgnorePatterns(config: any, rootDir: string): string[] {
  const cliIgnores = config.ignore ? config.ignore.split(",") : [];
  const configIgnores = Array.isArray(config.ignoreFromFile)
    ? config.ignoreFromFile
    : [];
  const fileIgnores = getTreeIgnorePatterns(rootDir);

  return [...DEFAULT_IGNORES, ...cliIgnores, ...configIgnores, ...fileIgnores];
}

/**
* The main generator function, executed so that it can be called again
* by watch mode.
* This function will return a tree from the current directory
* based on the given configuration.
* If the output configuration is not empty, it will be saved
* to a file named output. If the update configuration is
* not empty, it will be updated to README.md.
* If there is no output configuration and update, it will be
* printed to the terminal.
 * @param {object} config - The given configuration
 * @return {Promise<void>} 
 */
async function runGenerator(config: any) {
  if (isGenerating) return;
  isGenerating = true;
  const spinner = ora("🌳 Generating project tree...").start();

  try {
    resetIgnoreCache();

    const allIgnorePatterns = getAllIgnorePatterns(config, cwd);
    const treeOptions: GenerateTreeOptions = {
      depth: config.depth ? parseInt(config.depth, 10) : undefined,
      ignorePatterns: allIgnorePatterns,
    };

    const tree = await generateTree(cwd, treeOptions, cwd);

    const formattedTree = config.root ? `${config.root}\n${tree}` : tree;

    if (config.output) {
      await fs.writeFile(path.resolve(cwd, config.output), formattedTree);
      spinner.succeed(`Tree successfully saved to ${config.output}!`);
    } else if (config.update) {
      await updateReadme(cwd, formattedTree);
      spinner.succeed("Tree successfully updated in README.md!");
    } else {
      spinner.stop();
      console.log(formattedTree);
    }
  } catch (err) {
    spinner.fail("Failed to generate tree");
    logError("", err);
  } finally {
    isGenerating = false;
  }
}

/**
 * Debounces the runGenerator function to prevent multiple runs when watching for file changes.
 * The function will only run once after 300ms of inactivity.
 * It will log an info message when the file change is detected and a tree regeneration is triggered.
 * If an error occurs during the tree regeneration, it will log an error message.
 * @param {any} config - The configuration object passed from the CLI.
 */
function debouncedRun(config: any) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    logInfo("File change detected, regenerating tree...");
    runGenerator(config).catch((err) =>
      logError("Error during watch run", err)
    );
  }, 300);
}

/**
 * Main entry point of the program.
 * Parses command line options and runs the generator.
 * If the watch flag is set, it will watch for file changes and update the tree accordingly.
 * @throws {Error} If there is an error while initializing the CLI.
 */
async function main() {
  try {
    const result = await explorer.search();
    const loadedConfig = result ? result.config : {};

    if (!result) {
      console.warn("⚠️  No configuration file found. Using defaults.");
    }

    program
      .version(pkg.version)
      .description(pkg.description)
      .option("-d, --depth <number>", "Max depth of folder scan")
      .option(
        "-i, --ignore <patterns>",
        "Comma-separated patterns (e.g., 'dist,build')"
      )
      .option("-u, --update", "Update README.md automatically")
      .option("-r, --root <name>", "Specify a root name (e.g., '.')")
      .option("-o, --output <file>", "Save the tree to a specific file")
      .option("-w, --watch", "Watch for file changes and update")
      .action(async (cliOptions) => {
        // const cleanedOptions = cleanCliOptions(cliOptions);

        // if (Array.isArray(loadedConfig.ignore)) {
        //   loadedConfig.ignoreFromFile = loadedConfig.ignore;
        //   delete loadedConfig.ignore;
        // }

        // const finalConfig = {
        //   ...loadedConfig,
        //   ...cleanedOptions, 
        // };

        const finalConfig = { ...loadedConfig };

        if (cliOptions.depth !== undefined) finalConfig.depth = cliOptions.depth;
        if (cliOptions.ignore !== undefined) finalConfig.ignore = cliOptions.ignore;
        if (cliOptions.update !== undefined) finalConfig.update = cliOptions.update;
        if (cliOptions.root !== undefined) finalConfig.root = cliOptions.root;
        if (cliOptions.output !== undefined) finalConfig.output = cliOptions.output;
        if (cliOptions.watch !== undefined) finalConfig.watch = cliOptions.watch;

        if (Array.isArray(loadedConfig.ignore)) {
          finalConfig.ignoreFromFile = loadedConfig.ignore;
          if (cliOptions.ignore === undefined) {
             delete finalConfig.ignore;
          }
        }

        if (finalConfig.watch) {
          await runGenerator(finalConfig);
          logInfo(`👀 Watching for file changes... (Press Ctrl+C to stop)`);
          const allIgnores = getAllIgnorePatterns(finalConfig, cwd);
          chokidar
            .watch(".", {
              /**
               * A function that determines whether a file or directory should be ignored.
               * Returns true if the path matches any of the ignore patterns, false otherwise.
               * @param {string} p - The path of the file or directory.
               * @returns {boolean} true if the path should be ignored, false otherwise.
               */
              ignored: (p: string) =>
                allIgnores.some((pattern) =>
                  minimatch(p, pattern, { dot: true })
                ),
              ignoreInitial: true,
            })
            .on("add", () => debouncedRun(finalConfig))
            .on("unlink", () => debouncedRun(finalConfig))
            .on("addDir", () => debouncedRun(finalConfig))
            .on("unlinkDir", () => debouncedRun(finalConfig));
        } else {
          await runGenerator(finalConfig);
        }
      });

    await program.parseAsync(process.argv);
  } catch (err) {
    logError("Failed to initialize CLI", err);
    process.exit(1);
  }
}

main();
