const unwrapLatexText = (value: string) => {
  const match = value.trim().match(/^\\text\{([\s\S]*)\}$/);
  return match ? match[1] : value.trim();
};

const hasMathDelimiters = (value: string) => /\${1,2}[\s\S]*\${1,2}/.test(value);

const looksLikeLatexMath = (value: string) =>
  /\\(?:begin|cdot|div|frac|geq?|in|leq?|left|mathbb|overline|pm|right|sqrt|sum|times|underline)\b/.test(
    value,
  ) || /[_^]\s*(?:\{|[A-Za-z0-9-])/.test(value);

const looksLikeProse = (value: string) => {
  const words = value
    .replace(/\\[A-Za-z]+/g, " ")
    .replace(/[{}_^$=+\-*/(),.;:\d]/g, " ")
    .match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{2,}/g);

  return (words?.length ?? 0) >= 3;
};

export const normalizeLatexForRender = (value?: string | null, display = false) => {
  if (typeof value !== "string") return "";

  const normalized = unwrapLatexText(value);

  if (!normalized || hasMathDelimiters(normalized)) return normalized;
  if (!looksLikeLatexMath(normalized) || looksLikeProse(normalized)) return normalized;

  const delimiter = display ? "$$" : "$";
  return `${delimiter}${normalized}${delimiter}`;
};
