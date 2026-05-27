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
  latex_styled?: string;
  latex?: string;
  error?: string;
  error_info?: {
    id?: string;
    message?: string;
  };
}

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
