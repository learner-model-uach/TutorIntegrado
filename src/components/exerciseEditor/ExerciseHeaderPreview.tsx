import { Stack } from "@chakra-ui/react";
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";

interface ExerciseHeaderPreviewProps {
  title?: string;
  eqc?: string;
}

// ✅ Extraído tal cual del bloque de encabezado en Tutor.jsx —
// sin order_steps, SortSteps, Feedback ni routing, que no aplican en el editor.
// Se usa para dar preview en vivo del título + ecuación principal (eqc)
// para los tipos de ejercicio "fac" y "ecu".
export function ExerciseHeaderPreview({ title, eqc }: ExerciseHeaderPreviewProps) {
  return (
    <Stack textAlign="center" fontSize={{ base: "15px", sm: "20px", lg: "25px" }}>
      <TeX as="figcaption">{title}</TeX>
      <TeX math={eqc || ""} as="figcaption" />
    </Stack>
  );
}

export default ExerciseHeaderPreview;
