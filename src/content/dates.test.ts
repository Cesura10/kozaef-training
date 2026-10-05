import { describe, expect, it } from 'vitest';
import { isIsoDate } from './dates';

describe('isIsoDate', () => {
  it('acepta fechas reales en formato AAAA-MM-DD', () => {
    expect(isIsoDate('2026-10-04')).toBe(true);
    expect(isIsoDate('2028-02-29')).toBe(true);
  });
  it('rechaza fechas inexistentes o con otro formato', () => {
    expect(isIsoDate('2026-02-31')).toBe(false);
    expect(isIsoDate('2026-13-01')).toBe(false);
    expect(isIsoDate('2027-02-29')).toBe(false);
    expect(isIsoDate('2026-10-04T00:00:00.000Z')).toBe(false);
    expect(isIsoDate('4/10/2026')).toBe(false);
  });
});
