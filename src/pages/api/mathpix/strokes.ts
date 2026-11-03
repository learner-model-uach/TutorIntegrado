import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth } from "../../../utils/verifyAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido." });
  }

  const isAuthenticated = await verifyAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({
      error: "No autorizado. Inicie sesión para usar este servicio.",
    });
  }

  const appId = process.env.MATHPIX_APP_ID;
  const appKey = process.env.MATHPIX_APP_KEY;
  const apiUrl = process.env.MATHPIX_STROKES_API_URL ?? "https://api.mathpix.com/v3/strokes";

  if (!appId || !appKey) {
    return res.status(500).json({
      error: "Credenciales de Mathpix no configuradas en el servidor.",
    });
  }

  try {
    const mathpixResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        app_id: appId,
        app_key: appKey,
      },
      body: JSON.stringify(req.body),
    });

    const data = await mathpixResponse.json();
    return res.status(mathpixResponse.status).json(data);
  } catch (error) {
    console.error("Error al procesar trazos en Mathpix:", error);
    return res.status(500).json({
      error: "Error de comunicación con el servicio de Mathpix.",
    });
  }
}
