export function toTitleCase(text: string): string {
  return text.toLowerCase().replace(/(^|[\s([{])(\p{L})/gu, (_, separator, letter) => {
    return separator + letter.toLocaleUpperCase();
  });
}
