import fs from "fs";
import { dirname, join as joinPath } from "path";

export const ESM_TS_JS_TRANSFORM_PATTERN = "^.+\\.m?[tj]sx?$";

const __dirname = dirname(import.meta.filename);
/**
 * @param {string} name
 * @returns {string}
 */
export const joinLocalPath = (name) => joinPath(__dirname, name);

const config = {
  clearMocks: true,
  extensionsToTreatAsEsm: [".mts", ".ts", ".tsx"],
  moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
  moduleDirectories: ["node_modules", "src", "tests"],
  resolver: "ts-jest-resolver",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    [ESM_TS_JS_TRANSFORM_PATTERN]: [
      "@swc/jest",
      JSON.parse(fs.readFileSync(joinLocalPath(".swcrc"), "utf-8")),
    ],
  },
  testMatch: ['<rootDir>/tests/**/*.+(spec|test).+(ts|tsx)'],
  globals: { __DEVELOPMENT__: false },
};

export default config;
