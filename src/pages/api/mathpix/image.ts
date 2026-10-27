import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido." });
  }

  const appId = process.env.MATHPIX_APP_ID;
  const appKey = process.env.MATHPIX_APP_KEY;
  const apiUrl = process.env.MATHPIX_IMAGE_API_URL ?? "https://api.mathpix.com/v3/text";

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
    console.error("Error al procesar imagen en Mathpix:", error);
    return res.status(500).json({
      error: "Error de comunicación con el servicio de Mathpix.",
    });
  }
}
