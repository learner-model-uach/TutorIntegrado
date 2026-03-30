import { clamp01 } from "./mathHelpers";

export function estimateEffort(n: number, pPercent: number): number {
  const p = clamp01(pPercent / 100);
  if (n === 0) return 6 * (1 - p);
  if (p === 0) return n; //evita división por 0
  return Math.ceil((n / p) * (1 - p));
}

export function pluralizeExercise(k: number): string {
  return `${k} ejercicio${k === 1 ? "" : "s"}`;
}

export function getEffortCounts(n: number, estimated: number) {
  const done = Math.max(0, Math.floor(n));
  const needed = Math.max(0, Math.floor(estimated));
  return { done, needed };
}

export function infoText(n: number, estimatedLabel: string): string {
  if (n === 0) {
    return `No has realizado ejercicios. Mateo estima que debes hacer ${estimatedLabel} para completar este subtópico.`;
  }
  return `Has realizado ${pluralizeExercise(n)}. Mateo estima que debes hacer ${estimatedLabel} para completar este subtópico`;
}

export function getMoodEmoji(n: number, rawEfficiency: number): { char: string; label: string } {
  if (n === 0) return { char: "", label: "" };
  if (rawEfficiency >= 0.85) {
    return {
      char: "😄",
      label:
        "Tu eficiencia ha sido alta porque has demostrado con respuestas correctas y poco uso de pistas que puedes completar los ejercicios.",
    };
  }
  if (rawEfficiency <= 0) return { char: "", label: "" };
  if (rawEfficiency <= 0.5) {
    return {
      char: "🤔",
      label:
        "Tu eficiencia ha sido baja. Trata de contestar los pasos de los ejercicios correctamente en el primer intento y solo usa pistas cuando las necesites.",
    };
  }
  return { char: "", label: "" };
}
