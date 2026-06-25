/**
 * Normalize a pinyin string for tone-insensitive comparison.
 * Strips tone marks (combining + precomposed) and lower-cases, trims.
 * e.g. "Nǐ hǎo" → "ni hao", "Shànghǎi" → "shanghai".
 */
export function normalizePinyin(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip combining diacritics
    .replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/gi, (m) => stripTone(m))
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function stripTone(ch: string): string {
  const map: Record<string, string> = {
    ā: 'a', á: 'a', ǎ: 'a', à: 'a',
    ē: 'e', é: 'e', ě: 'e', è: 'e',
    ī: 'i', í: 'i', ǐ: 'i', ì: 'i',
    ō: 'o', ó: 'o', ǒ: 'o', ò: 'o',
    ū: 'u', ú: 'u', ǔ: 'u', ù: 'u',
    ǖ: 'v', ǘ: 'v', ǚ: 'v', ǜ: 'v', ü: 'v',
  };
  return map[ch] ?? ch;
}

export function safeParseOptions(optionsJson: string): string[] {
  try {
    const parsed = JSON.parse(optionsJson);
    return Array.isArray(parsed) ? parsed.map((o) => String(o)) : [];
  } catch {
    return [];
  }
}