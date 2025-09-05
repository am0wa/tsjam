import { ComparisonResult } from 'core/comparison.js';
import { jamver, SemanticRange } from 'core/versioning.js';

import compareVersions = jamver.compareVersions;
import compareVersionsSemantically = jamver.compareVersionsSemantically;

describe('Versioning', () => {
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
  });

  describe('compareVersionsSemantically', () => {
    it('Should accept *', () => {
      expect(compareVersionsSemantically('*', '77.7')).toBe(true);
    });
    it('Should be same up to max available precision', () => {
      expect(compareVersionsSemantically('77.7.8.9', '77.7.8.9')).toBe(true);
    });
    it('Should accept with same Minor and latest Patch version', () => {
      expect(compareVersionsSemantically('77.7.0', '77.7.7', SemanticRange.Compatible)).toBe(true);
    });
    it('Should ditch with different Minor version', () => {
      expect(compareVersionsSemantically('77.0.0', '77.7.7', SemanticRange.Compatible)).toBe(false);
    });
    it('Should accept with same Major and latest Minor version', () => {
      expect(compareVersionsSemantically('77.0.0', '77.7.0', SemanticRange.Approximate)).toBe(true);
    });
    it('Should ditch with different Major version', () => {
      expect(compareVersionsSemantically('77.0.0', '78.0.0', SemanticRange.Approximate)).toBe(false);
    });
    it('Should be lower', () => {
      expect(compareVersionsSemantically('67.0', '77.0', SemanticRange.Lower)).toBe(true);
    });
    it('Should be higher', () => {
      expect(compareVersionsSemantically('77.0', '67.0.1', SemanticRange.Higher)).toBe(true);
    });
  });
});
