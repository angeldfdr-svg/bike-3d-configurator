import { describe, expect, it } from 'vitest';

import { formatLength, formatList, formatPrice, formatWeight } from '@/lib/format';

/**
 * Presentation formatters.
 *
 * The domain stores integer cents and integer grams; these are the only places
 * that decide how those numbers reach the screen.
 */

describe('formatPrice', () => {
  it('renders integer cents as euros', () => {
    // Non breaking spaces are used by the Portuguese locale.
    expect(formatPrice(329000).replace(/\s/g, ' ')).toBe('3290,00 €');
    expect(formatPrice(4990).replace(/\s/g, ' ')).toBe('49,90 €');
    expect(formatPrice(0).replace(/\s/g, ' ')).toBe('0,00 €');
  });

  it('never loses precision to floating point', () => {
    expect(formatPrice(123456).replace(/\s/g, ' ')).toBe('1234,56 €');
  });
});

describe('formatWeight', () => {
  it('keeps grams below a kilogram and switches above it', () => {
    expect(formatWeight(890)).toBe('890 g');
    expect(formatWeight(999)).toBe('999 g');
    expect(formatWeight(1000).replace(/\s/g, ' ')).toBe('1,0 kg');
    expect(formatWeight(1250).replace(/\s/g, ' ')).toBe('1,3 kg');
  });

  it('switches to kilograms for anything above a kilogram', () => {
    expect(formatWeight(7400).replace(/\s/g, ' ')).toBe('7,4 kg');
    expect(formatWeight(999).replace(/\s/g, ' ')).toBe('999 g');
  });
});

describe('formatLength', () => {
  it('keeps millimetres below a metre and switches above it', () => {
    expect(formatLength(28)).toBe('28 mm');
    expect(formatLength(172)).toBe('172 mm');
    expect(formatLength(1000).replace(/\s/g, ' ')).toBe('1,0 m');
  });
});

describe('formatList', () => {
  it('joins with the Portuguese conjunction', () => {
    expect(formatList(['a'])).toBe('a');
    expect(formatList(['a', 'b'])).toBe('a e b');
    expect(formatList(['a', 'b', 'c'])).toBe('a, b e c');
    expect(formatList([])).toBe('');
  });
});
