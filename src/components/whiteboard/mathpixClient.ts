export interface MathpixImagePayload {
  src: string;
  formats?: string[];
  data_options?: Record<string, unknown>;
  include_line_data?: boolean;
  include_word_data?: boolean;
  auto_rotate_confidence_threshold?: number;
}

export interface MathpixResponse {
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

export interface NormalizedMathpixResponse extends MathpixResponse {
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
    return matches.map(match => unwrapLatex(match[1].replace(/\\n/g, "\n"))).filter(Boolean);
  }

  const arrayMatch = value.match(/\\begin\{array\}\{[lcr]\}([\s\S]*?)\\end\{array\}/);
  if (arrayMatch?.[1]) {
    return arrayMatch[1].split(/\\\\/).map(unwrapLatex).filter(Boolean);
  }

  const cleaned = unwrapLatex(value);
  return cleaned ? [cleaned] : [];
};

export const normalizeMathpixResponse = (response: MathpixResponse): NormalizedMathpixResponse => {
  const rawExpressions = response.expressions ?? [];
  const rawText = response.text ?? response.latex_styled ?? response.latex ?? "";
  const expressions =
    rawExpressions.length > 0
      ? rawExpressions.flatMap(extractExpressions)
      : extractExpressions(rawText);

  return {
    ...response,
    expressions,
  };
};

export const requestMathpixImage = async (
  payload: MathpixImagePayload,
  options?: { appId?: string; appKey?: string },
): Promise<NormalizedMathpixResponse> => {
  const appId = options?.appId ?? process.env.NEXT_PUBLIC_MATHPIX_APP_ID;
  const appKey = options?.appKey ?? process.env.NEXT_PUBLIC_MATHPIX_APP_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_MATHPIX_IMAGE_API_URL ?? "https://api.mathpix.com/v3/text";

  if (!appId || !appKey) {
    throw new Error("Faltan credenciales de Mathpix en .env.");
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      app_id: appId,
      app_key: appKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Error al procesar la imagen con Mathpix.");
  }

  const result = (await response.json()) as MathpixResponse;
  return normalizeMathpixResponse(result);
};
