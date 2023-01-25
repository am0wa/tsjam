#!/usr/bin/env node

const fs = require('fs');
const { resolveToNodeModules, resolveToRoot } = require('./resolve-path');

const [, , pkg] = process.argv;

if (!pkg) {
  console.error('Please pass the target <package> you want to sync with!');
  process.exit(1);
}

const browserListPath = resolveToNodeModules(pkg, '.browserslistrc');
const rootPath = resolveToRoot('.browserslistrc');

if (!fs.existsSync(browserListPath)) {
  console.error(`Package ${pkg} doesn't contain .browserslistrc file;`);
  process.exit(1);
}

fs.copyFileSync(browserListPath, rootPath);
