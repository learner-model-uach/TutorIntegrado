import React from "react";
import { Box, Image } from "@chakra-ui/react";
import { Figura, tieneFigura } from "./Figura";

// Miniatura de un ejercicio de geometría para las tarjetas de selección:
// la figura dinámica sin resaltar o, si el ejercicio no la tiene, su imagen.
export const VistaPreviaGeom = ({ ejercicio }) => (
  <Box maxW="220px" mx="auto" bg="white" borderRadius="md" p={1}>
    {tieneFigura(ejercicio) ? (
      <Figura figura={ejercicio.figura} pasoActual={-1} resuelto={false} />
    ) : ejercicio?.image ? (
      <Image
        src={ejercicio.image}
        alt={ejercicio.title ?? "Ejercicio de geometría"}
        maxH="160px"
        mx="auto"
      />
    ) : null}
  </Box>
);

export default VistaPreviaGeom;
