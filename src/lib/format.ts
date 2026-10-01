/**
 * Presentation formatters.
 *
 * Pure functions over the fixed units of the domain: prices are integer euro
 * cents and weights are integer grams. Formatting happens only here, so no
 * calculation ever has to guess at a locale or a rounding rule.
 */

const LOCALE = 'pt-PT';

const euroFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const decimalFormatter = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** Integer cents to a localized euro string. */
export function formatPrice(cents: number): string {
  return euroFormatter.format(cents / 100);
}

/** Integer grams to a localized weight, switching to kilograms above 1 kg. */
export function formatWeight(grams: number): string {
  if (Math.abs(grams) >= 1000) {
    return `${decimalFormatter.format(grams / 1000)} kg`;
  }

  return `${new Intl.NumberFormat(LOCALE).format(grams)} g`;
}

/** Millimetres to a localized length, switching to metres above 1 m. */
export function formatLength(millimetres: number): string {
  if (Math.abs(millimetres) >= 1000) {
    return `${decimalFormatter.format(millimetres / 1000)} m`;
  }

  return `${new Intl.NumberFormat(LOCALE).format(millimetres)} mm`;
}

/** A compact list, in the Portuguese style with "e" before the last item. */
export function formatList(items: readonly string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0] ?? '';

  const head = items.slice(0, -1).join(', ');

  return `${head} e ${items[items.length - 1] ?? ''}`;
}
