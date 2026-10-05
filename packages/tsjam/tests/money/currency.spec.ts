import { CurrencyCodes, isCurrencyCode, worldCurrencies, worldCurrencyMap } from 'money/currency.js';

describe('currency', () => {
  it('CurrencyCodes has no duplicates', () => {
    expect(new Set(CurrencyCodes).size).toBe(CurrencyCodes.length);
  });

  it('worldCurrencies has one entry per code, all of them listed codes', () => {
    const codes = worldCurrencies.map(({ code }) => code);
    expect(new Set(codes).size).toBe(codes.length);
    expect(codes.filter((code) => !isCurrencyCode(code))).toEqual([]);
    expect(worldCurrencyMap.size).toBe(worldCurrencies.length);
  });

  it('isCurrencyCode – current codes yes, retired / unknown no', () => {
    expect(isCurrencyCode('EUR')).toBe(true);
    expect(isCurrencyCode('VES')).toBe(true);
    expect(isCurrencyCode('ZWG')).toBe(true);
    expect(isCurrencyCode('HRK')).toBe(false);
    expect(isCurrencyCode('VEF')).toBe(false);
    expect(isCurrencyCode('eur')).toBe(false);
  });

  it('symbols', () => {
    expect(worldCurrencyMap.get('BOB')?.symbol).toBe('Bs');
    expect(worldCurrencyMap.get('KWD')?.symbol).toBe('KD');
    expect(worldCurrencyMap.get('USD')?.symbol).toBe('$');
  });
});
