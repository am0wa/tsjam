import { assert } from './assert.js';
import { ComparisonResult } from './comparison.js';
import { stringToEnum } from './from-it.js';

const semver = /^$|^([v=~^><*]?(\d+[a-z-]*\.?)+)|(\*)/; // empty or numeric or semantic version or star(*)
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

export namespace jamver {
  export const semanticRangeFromVersion = (ver: string): SemanticRange | undefined => {
    validateVersion(ver);
    return ver.length > 0 ? stringToEnum(SemanticRange, ver.charAt(0)) : undefined;
  };

  export const compareVersions = (
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

  export const compareVersionsSemantically = (
    ver1: string,
    ver2: string,
    sem: SemanticRange = SemanticRange.Same,
  ): boolean => {
    if (ver1 === SemanticRange.All || ver2 === SemanticRange.All || sem === SemanticRange.All) {
      return true;
    }

    switch (sem) {
      case SemanticRange.Compatible:
        return compareVersions(ver1, ver2, VersionSignificanceLvl.Minor) === ComparisonResult.Same;

      case SemanticRange.Approximate:
        return compareVersions(ver1, ver2, VersionSignificanceLvl.Major) === ComparisonResult.Same;

      case SemanticRange.Higher:
        return compareVersions(ver1, ver2) === ComparisonResult.Higher;

      case SemanticRange.Lower:
        return compareVersions(ver1, ver2) === ComparisonResult.Lower;

      case SemanticRange.Same:
        return compareVersions(ver1, ver2) === ComparisonResult.Same;

      default:
        return assert.never(sem);
    }
  };
}
