const DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Convert a number (or numeric string) to Bangla digits. */
export function bn(n: number | string): string {
  return String(n).replace(/\d/g, (d) => DIGITS[Number(d)]);
}
