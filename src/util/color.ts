import md5 from 'js-md5';

/**
 * Generate deterministic, pseudo-random color, which is CSS-compatible.
 * <p>
 * The generated color's "vividness" aims to be consistent with the Somnus theme.
 */
export function getVividColor(s: string, opacity: number = 1): string {
  const hue = hash(s, 360);
  // Somnus' primary theme color has s/l of 50%/45%, but we use slightly poppier ones here
  return `hsl(${hue}, 60%, 50%, ${opacity})`;
}

function hash(s: string, max: number): number {
  const numbers = md5.array(s);
  let combined = 0;
  for (let i = 0; i < 4; i++) {
    combined <<= 8;
    combined |= numbers[i];
  }
  return combined % max;
}
