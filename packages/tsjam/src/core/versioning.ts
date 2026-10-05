import { assert, assertNever } from './assert.js';
import { ComparisonResult } from './comparison.js';
import { stringToEnum } from './from-it.js';

// whole string: empty, `*`, or range prefix + N(.N)* + optional -prerelease; linear, no nested quantifiers
const semver = /^(?:\*|[v=~^><]*\d+(?:\.\d+)*(?:-[0-9a-z.-]+)?)?$/i;
const validateVersion = (ver: string): void => {
  assert(semver.test(ver), `Invalid semantic version received '${ver}'`);
};

const sanitizeSemantic = (ver: string): string => {
  const sem = /^[v=~^><*]+/; // trims leading semver
  return ver.replace(sem, '');
};

export enum VersionSignificanceLvl {
  Major = 1,
  Minor = 2,
  Patch = 3,
}

export enum SemanticRange {
  All = '*',
  Compatible = '^',
  Approximate = '~',
  Higher = '>',
  Lower = '<',
  Same = '=',
}

const levelsOf = (ver: string): number[] =>
  sanitizeSemantic(ver)
    .split('.')
    .map((level) => parseInt(level, 10));

/** Levels a caret range locks: up to and including the first non-zero one (all given levels if every one is 0). */
const caretLevels = (ver: string): number => {
  const levels = levelsOf(ver);
  const firstNonZero = levels.findIndex((level) => level !== 0);
  return firstNonZero === -1 ? levels.length : firstNonZero + 1;
};

/** `candidate >= base` and both equal on the first `lockedLevels` levels. */
const withinRange = (base: string, candidate: string, lockedLevels: number): boolean => {
  return (
    compareVersions(base, candidate, lockedLevels) === ComparisonResult.Same &&
    compareVersions(candidate, base) !== ComparisonResult.Lower
  );
};

const semanticRangeFromVersion = (ver: string): SemanticRange | undefined => {
  validateVersion(ver);
  return ver.length > 0 ? stringToEnum(SemanticRange, ver.charAt(0)) : undefined;
};

const compareVersions = (
  ver1: string,
  ver2: string,
  maxPrecision: number = Number.MAX_SAFE_INTEGER,
): ComparisonResult => {
  validateVersion(ver1);
  validateVersion(ver2);

  const levelsVer1 = sanitizeSemantic(ver1).split('.');
  const levelsVer2 = sanitizeSemantic(ver2).split('.');
  const minLength = Math.min(maxPrecision, levelsVer1.length, levelsVer2.length);

  for (let significance = 0; significance < minLength; significance++) {
    const subVer1 = parseInt(levelsVer1[significance], 10);
    const subVer2 = parseInt(levelsVer2[significance], 10);

    if (subVer1 > subVer2) {
      return ComparisonResult.Higher;
    }
    if (subVer1 < subVer2) {
      return ComparisonResult.Lower;
    }
  }
  return ComparisonResult.Same;
};

/**
 * Whether `ver2` satisfies the range `sem` + `ver1`, npm semantics:
 * - `^` (Compatible): `>= ver1`, same up to its first non-zero level – `^1.2.3` <2.0.0, `^0.2.3` <0.3.0, `^0.0.3` =0.0.3
 * - `~` (Approximate): `>= ver1`, same major.minor (major only if `ver1` has no minor) – `~1.2.3` <1.3.0, `~1` <2.0.0
 * - `>` / `<` / `=`: `ver2` is higher / lower / same as `ver1` – `>1.2` accepts 1.3, `<1.2` accepts 1.1
 * Complexity: O(L) for L version levels.
 */
const compareVersionsSemantically = (ver1: string, ver2: string, sem: SemanticRange = SemanticRange.Same): boolean => {
  if (ver1 === SemanticRange.All || ver2 === SemanticRange.All || sem === SemanticRange.All) {
    return true;
  }

  switch (sem) {
    case SemanticRange.Compatible:
      return withinRange(ver1, ver2, caretLevels(ver1));

    case SemanticRange.Approximate:
      return withinRange(ver1, ver2, Math.min(levelsOf(ver1).length, VersionSignificanceLvl.Minor));

    case SemanticRange.Higher:
      return compareVersions(ver2, ver1) === ComparisonResult.Higher;

    case SemanticRange.Lower:
      return compareVersions(ver2, ver1) === ComparisonResult.Lower;

    case SemanticRange.Same:
      return compareVersions(ver1, ver2) === ComparisonResult.Same;

    default:
      return assertNever(sem);
  }
};

/** Semantic version helpers. */
export const jamver = { semanticRangeFromVersion, compareVersions, compareVersionsSemantically } as const;
