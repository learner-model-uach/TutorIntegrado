// Vista previa LOCAL de los ejercicios de geometría con figuras dinámicas.
// Lee los JSON de components/tutorGeometria/preview (no el admin) y no registra acciones.
import { useState } from "react";
import { Box, Button, Text, Wrap } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import pitagoras from "../components/tutorGeometria/preview/pitagoras.json";
import thales from "../components/tutorGeometria/preview/thales.json";
import areaPerimetro from "../components/tutorGeometria/preview/areaPerimetro.json";

const TutorGeom = dynamic<{ exercise?: Object; topicId?: string }>(
  () => import("../components/tutorGeometria/TutorGeom").then(mod => mod.TutorGeom),
  { ssr: false },
);

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (globalThis as any).__TUTOR_PREVIEW__ = true;
}

const grupos: [string, any[]][] = [
  ["Área y perímetro", areaPerimetro],
  ["Thales", thales],
  ["Pitágoras", pitagoras],
];

// Sin withAuth: la vista previa no envía acciones, así que no necesita sesión
export default function VistaGeometria() {
  const [sel, setSel] = useState<[number, number]>([0, 0]);
  if (process.env.NODE_ENV !== "development") return <Text>Solo disponible en desarrollo.</Text>;
  const ejercicio = grupos[sel[0]][1][sel[1]];
  return (
    <Box>
      <Text fontSize="sm" color="gray.500" mb={2}>
        Vista previa local · sin registro de acciones
      </Text>
      {grupos.map(([titulo, lista], g) => (
        <Box key={titulo} mb={2}>
          <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={1}>
            {titulo} ({lista.length})
          </Text>
          <Wrap>
            {lista.map((e, k) => (
              <Button
                key={e.code}
                size="xs"
                colorScheme={g === sel[0] && k === sel[1] ? "blue" : "gray"}
                onClick={() => setSel([g, k])}
              >
                {e.code.toLowerCase()}
              </Button>
            ))}
          </Wrap>
        </Box>
      ))}
      <Box mt={4}>
        <TutorGeom key={ejercicio.code} exercise={ejercicio} topicId="preview" />
      </Box>
    </Box>
  );
}
