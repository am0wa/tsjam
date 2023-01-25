const path = require('path');

/**
 * Resolves paths relative to project's root directory.
 *
 * @example
 * resolveToPath('src/assets') => /absolute/path/to/root/directory/src/assets
 */
const resolveToPath = (toPath) => (...args) => path.join(toPath, ...args);
const resolveToRoot = resolveToPath(process.cwd());

const resolveToNodeModules = resolveToPath(resolveToRoot('./node_modules'));

module.exports = {
  resolveToPath,
  resolveToRoot,
  resolveToNodeModules,
};
