import { resolve, join, dirname } from "path";

/** @see https://nodejs.org/api/esm.html#importmetaurl */
const __dirname = dirname(import.meta.filename);

/**
 * Resolves paths relative to project's root directory.
 *
 * @example
 * resolvePath('src/assets') // output: '/absolute/path/to/root/directory/src/assets'
 */

const packageRoot = process.cwd();

/**
 * @param {string[]} pathSegments
 * @returns {string}
 */
export const resolvePath = (...pathSegments) =>
  resolve(packageRoot, ...pathSegments);

/**
 * @param {string[]} pathSegments
 * @returns {string}
 */
export const resolveRepoRootPath = (...pathSegments) =>
  resolve(packageRoot, "../..", ...pathSegments);

/**
 * @param {string[]} pathSegments
 * @returns {string}
 */
export const resolveInternalPath = (...pathSegments) =>
  resolve(__dirname, "../", ...pathSegments);

/**
 * @param {string[]} toPath
 * @returns {string}
 */
export const joinPath = (...toPath) => join(...toPath);
