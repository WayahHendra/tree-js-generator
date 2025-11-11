import chalk from "chalk";

/**
 * Logs an info message to the console with a yellow color.
 * @param {string} message - The info message to log.
 */
export function logInfo(message: string) {
  console.log(chalk.cyan("ℹ️  " + message));
}

/**
 * Logs a success message to the console with a green color.
 * @param {string} message - The success message to log.
 */
export function logSuccess(message: string) {
  console.log(chalk.green("✅ " + message));
}

/**
 * Logs a warning message to the console with a yellow color.
 * @param {string} message - The warning message to log.
 */
export function logWarning(message: string) {
  console.log(chalk.yellow("⚠️  " + message));
}

/**
 * Logs an error message to the console with a red color.
 * If the err parameter is provided, it will be logged to the console
 * with a gray color.
 * @param {string} message - The error message to log.
 * @param {unknown} [err] - The error to log, if any.
 */
export function logError(message: string, err?: unknown) {
  console.error(chalk.red("❌ " + message));
  if (err)
    console.error(chalk.gray(err instanceof Error ? err.message : String(err)));
}
