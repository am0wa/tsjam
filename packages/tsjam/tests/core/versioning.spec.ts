import { ComparisonResult } from 'core/comparison.js';
import { jamver, SemanticRange } from 'core/versioning.js';

const { compareVersions, compareVersionsSemantically } = jamver;

describe('Versioning', () => {
  it('jamver holds the functions only, enums are root exports', () => {
    expect(Object.keys(jamver).sort()).toEqual([
      'compareVersions',
      'compareVersionsSemantically',
      'semanticRangeFromVersion',
    ]);
    expect(SemanticRange.Compatible).toBe('^');
  });
  describe('compareVersions', () => {
    it('Should be same', () => {
      expect(compareVersions('77.7', '77.7')).toBe(ComparisonResult.Same);
    });
    it('Should be compared by lowest available significance level', () => {
      expect(compareVersions('77.7', '77.7.7')).toBe(ComparisonResult.Same);
    });
    it('Should be lower', () => {
      expect(compareVersions('67.0', '77.0')).toBe(ComparisonResult.Lower);
    });
    it('Should be higher', () => {
      expect(compareVersions('77.0', '67.0.1')).toBe(ComparisonResult.Higher);
    });
    it('Should ignore leading v', () => {
      expect(compareVersions('v77.0.2', 'v77.0.1')).toBe(ComparisonResult.Higher);
    });
    it('Should ignore leading semantic', () => {
      expect(compareVersions('^77.0.2', '~77.0.2')).toBe(ComparisonResult.Same);
    });
    it('Should not be f*ckd up be specific releases', () => {
      expect(compareVersions('v77.0.2-rc', 'v77.0.1-beta')).toBe(ComparisonResult.Higher);
    });
    it('Should accept empty string', () => {
      expect(compareVersions('', '*')).toBe(ComparisonResult.Same);
    });
    it('Should throw if ver1 not a number', () => {
      expect(() => compareVersions('fakeVersion1', '77.0')).toThrow();
    });
    it('Should throw if ver2 not a number', () => {
      expect(() => compareVersions('77.0', 'fakeVersion2')).toThrow();
    });
    it('Should accept a multi-char range prefix', () => {
      expect(compareVersions('>=1.2.3', '1.2.3')).toBe(ComparisonResult.Same);
    });
    it.each(['1.2.3garbage!!', '1abc', 'fake*', '1..2', '1.2.', '1rc.2'])('Should throw on malformed %p', (ver) => {
      expect(() => compareVersions(ver, '1.0')).toThrow();
    });
  });

  describe('compareVersionsSemantically', () => {
    it('Should accept *', () => {
      expect(compareVersionsSemantically('*', '77.7')).toBe(true);
    });
    it('Should be same up to max available precision', () => {
      expect(compareVersionsSemantically('77.7.8.9', '77.7.8.9')).toBe(true);
    });
    describe('^ Compatible (npm caret)', () => {
      const caret = (base: string, candidate: string): boolean =>
        compareVersionsSemantically(base, candidate, SemanticRange.Compatible);

      it('accepts newer minor and patch within the same major', () => {
        expect(caret('77.7.0', '77.7.7')).toBe(true);
        expect(caret('77.0.0', '77.7.7')).toBe(true);
      });
      it('rejects a different major', () => {
        expect(caret('77.0.0', '78.0.0')).toBe(false);
      });
      it('rejects a lower version', () => {
        expect(caret('1.2.3', '1.2.0')).toBe(false);
        expect(caret('1.2.3', '1.1.9')).toBe(false);
      });
      it('locks up to the first non-zero level for 0.x', () => {
        expect(caret('0.2.3', '0.2.9')).toBe(true);
        expect(caret('0.2.3', '0.3.0')).toBe(false);
        expect(caret('0.0.3', '0.0.3')).toBe(true);
        expect(caret('0.0.3', '0.0.4')).toBe(false);
      });
    });

    describe('~ Approximate (npm tilde)', () => {
      const tilde = (base: string, candidate: string): boolean =>
        compareVersionsSemantically(base, candidate, SemanticRange.Approximate);

      it('accepts a newer patch within the same major.minor', () => {
        expect(tilde('1.2.3', '1.2.9')).toBe(true);
      });
      it('rejects a different minor or major', () => {
        expect(tilde('77.0.0', '77.7.0')).toBe(false);
        expect(tilde('77.0.0', '78.0.0')).toBe(false);
      });
      it('rejects a lower version', () => {
        expect(tilde('1.2.3', '1.2.2')).toBe(false);
      });
      it('locks the major only when no minor is given', () => {
        expect(tilde('1', '1.9.0')).toBe(true);
        expect(tilde('1', '2.0.0')).toBe(false);
      });
    });
    describe('> < = (candidate ver2 against base ver1)', () => {
      it('> accepts only a higher candidate', () => {
        expect(compareVersionsSemantically('67.0', '77.0', SemanticRange.Higher)).toBe(true);
        expect(compareVersionsSemantically('77.0', '67.0.1', SemanticRange.Higher)).toBe(false);
        expect(compareVersionsSemantically('77.0', '77.0', SemanticRange.Higher)).toBe(false);
      });
      it('< accepts only a lower candidate', () => {
        expect(compareVersionsSemantically('77.0', '67.0.1', SemanticRange.Lower)).toBe(true);
        expect(compareVersionsSemantically('67.0', '77.0', SemanticRange.Lower)).toBe(false);
        expect(compareVersionsSemantically('77.0', '77.0', SemanticRange.Lower)).toBe(false);
      });
      it('= accepts only the same version', () => {
        expect(compareVersionsSemantically('77.0', '77.0', SemanticRange.Same)).toBe(true);
        expect(compareVersionsSemantically('77.0', '77.1', SemanticRange.Same)).toBe(false);
      });
    });
  });
});
