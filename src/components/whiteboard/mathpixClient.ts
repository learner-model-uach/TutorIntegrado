export interface MathpixStrokesPayload {
  strokes: {
    strokes: {
      x: number[][];
      y: number[][];
    };
  };
  formats?: string[];
}

export interface MathpixStrokesResponse {
  text?: string;
  expressions?: string[];
  latex_styled?: string;
  latex?: string;
  error?: string;
  error_info?: {
    id?: string;
    message?: string;
  };
  confidence?: number;
  is_printed?: boolean;
  request_id?: string;
  is_handwritten?: boolean;
  confidence_rate?: number;
  auto_rotate_degrees?: number;
  auto_rotate_confidence?: number;
  version?: string;
}

export interface NormalizedMathpixResponse extends MathpixStrokesResponse {
  expressions: string[];
}

const unwrapLatex = (value: string) => {
  const trimmed = value.trim();
  if (trimmed.startsWith("\\(") && trimmed.endsWith("\\)")) {
    return trimmed.slice(2, -2).trim();
  }

  if (trimmed.startsWith("$") && trimmed.endsWith("$")) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
};

const extractExpressions = (value: string) => {
  const matches = [...value.matchAll(/\\\[([\s\S]*?)\\\]/g)];
  if (matches.length > 0) {
    return matches
      .map(match => unwrapLatex(match[1].replace(/\\n/g, "\n")))
      .filter(Boolean);
  }

  const arrayMatch = value.match(/\\begin\{array\}\{l\}([\s\S]*?)\\end\{array\}/);
  if (arrayMatch?.[1]) {
    return arrayMatch[1]
      .split(/\\\\/)
      .map(unwrapLatex)
      .filter(Boolean);
  }

  const cleaned = unwrapLatex(value);
  return cleaned ? [cleaned] : [];
};

export const normalizeMathpixResponse = (
  response: MathpixStrokesResponse
): NormalizedMathpixResponse => {
  const rawExpressions = response.expressions ?? [];
  const rawText = response.text ?? response.latex_styled ?? response.latex ?? "";
  const expressions = rawExpressions.length > 0 ? rawExpressions.flatMap(extractExpressions) : extractExpressions(rawText);

  return {
    ...response,
    expressions,
  };
};

export const requestMathpixStrokes = async (
  payload: MathpixStrokesPayload,
  options?: { appId?: string; appKey?: string }
): Promise<MathpixStrokesResponse> => {
  const appId = options?.appId ?? process.env.NEXT_PUBLIC_MATHPIX_APP_ID;
  const appKey = options?.appKey ?? process.env.NEXT_PUBLIC_MATHPIX_APP_KEY;

  if (!appId || !appKey) {
    throw new Error("Faltan credenciales de Mathpix en .env.");
  }

  const response = await fetch("https://api.mathpix.com/v3/strokes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "app_id": appId,
      "app_key": appKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Error al procesar Mathpix.");
  }

  return response.json() as Promise<MathpixStrokesResponse>;
};
