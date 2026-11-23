import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";

// Triángulo rectángulo paramétrico (Pitágoras). Se dibuja con los datos del ejercicio:
//   a = cateto vertical, b = cateto horizontal, c = hipotenusa.
// Campos de `figura`:
//   a, b, c           números o texto ("x", "2x"); uno puede faltar si es la incógnita
//   incognita         "a" | "b" | "c" | null (null = ejercicio de verificación, sin incógnita)
//   unidad            "cm", "m", "km"…
//   etiquetas         letras del enunciado, p. ej. { c: "x" }
//   resultado         texto a mostrar al resolver (obligatorio si los valores son texto)
//   dibujo            { a, b } proporciones para dibujar cuando los valores son texto
//   marcarAnguloRecto false = el ángulo recto aparece solo al resolver (ejercicios "¿es rectángulo?")
//   rectangulo        true = dibuja el rectángulo completo y la hipotenusa es su diagonal
// `foco` = lados resaltados en el paso actual; `resuelto` muestra el resultado.

const formatear = n =>
  Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100).replace(".", ",");
const esNumero = v => typeof v === "number";

const calcular = (lado, f) => {
  const s =
    lado === "c"
      ? f.a * f.a + f.b * f.b
      : lado === "a"
      ? f.c * f.c - f.b * f.b
      : f.c * f.c - f.a * f.a;
  const r = Math.sqrt(s);
  return Math.abs(r - Math.round(r * 100) / 100) < 1e-9
    ? formatear(r)
    : `√${formatear(s)} ≈ ${formatear(r)}`;
};

export const TrianguloRectangulo = ({ figura, foco = [], resuelto = false }) => {
  const color = {
    a: useColorModeValue("#2f6fdf", "#6ea2ff"),
    b: useColorModeValue("#0f9d76", "#3fd0a4"),
    c: useColorModeValue("#e0592a", "#ff8a5c"),
  };
  const relleno = useColorModeValue("#eef2fa", "#232a36");
  const tenue = useColorModeValue("#8a93a6", "#98a0b3");

  const unidad = figura.unidad ? ` ${figura.unidad}` : "";
  const incognita = figura.incognita === undefined ? "c" : figura.incognita;
  const numerico = ["a", "b", "c"].filter(l => l !== incognita).every(l => esNumero(figura[l]));

  // valores para dibujar
  let d;
  if (numerico) {
    const { a, b, c } = figura;
    d =
      incognita === "a"
        ? { a: Math.sqrt(c * c - b * b), b }
        : incognita === "b"
        ? { a, b: Math.sqrt(c * c - a * a) }
        : { a, b };
  } else {
    d = figura.dibujo ?? { a: 3, b: 4 };
  }

  const W = 420,
    H = 330,
    m = 70;
  const k = Math.min((W - 2 * m) / d.b, (H - 2 * m) / d.a);
  const C = { x: m, y: H - m };
  const A = { x: m, y: H - m - d.a * k };
  const B = { x: m + d.b * k, y: H - m };
  const D = { x: B.x, y: A.y }; // cuarta esquina del rectángulo

  const visible = lado =>
    foco.length === 0 || foco.includes(lado) || (resuelto && lado === incognita);
  const grueso = lado => foco.includes(lado) || (resuelto && lado === incognita);
  const nombre = lado => figura.etiquetas?.[lado] ?? lado;
  const texto = lado => {
    if (lado !== incognita)
      return `${nombre(lado)} = ${
        esNumero(figura[lado]) ? formatear(figura[lado]) : figura[lado]
      }${unidad}`;
    if (!resuelto) return nombre(lado);
    const valor = figura.resultado ?? (numerico ? calcular(lado, figura) : "?");
    return `${nombre(lado)} = ${valor}${unidad}`;
  };
  const mostrarAngulo = figura.marcarAnguloRecto !== false || resuelto;

  const segmento = (lado, p, q) => (
    <line
      key={lado}
      x1={p.x}
      y1={p.y}
      x2={q.x}
      y2={q.y}
      stroke={color[lado]}
      strokeLinecap="round"
      className={resuelto && lado === incognita ? "geo-pulso" : undefined}
      style={{
        strokeWidth: grueso(lado) ? 9 : 5,
        opacity: visible(lado) ? 1 : 0.35,
        transition: "stroke-width .35s, opacity .35s",
      }}
    />
  );

  const etiqueta = (lado, x, y, anchor) => (
    <text
      key={`t${lado}`}
      x={x}
      y={y}
      textAnchor={anchor}
      fill={color[lado]}
      style={{
        font: "600 17px system-ui, sans-serif",
        opacity: visible(lado) ? 1 : 0.35,
        transition: "opacity .35s",
      }}
    >
      {texto(lado)}
    </text>
  );

  return (
    <Box w="500px" maxW="100%">
      <style>{`.geo-pulso{animation:geoPulso 1.2s ease-in-out infinite}@keyframes geoPulso{50%{stroke-width:12}}.geo-aparece{animation:geoAparece .5s ease-out}@keyframes geoAparece{from{opacity:0}}@media (prefers-reduced-motion:reduce){.geo-pulso,.geo-aparece{animation:none}}`}</style>
      <svg
        viewBox={`-40 0 ${W + 80} ${H}`}
        role="img"
        aria-label={figura.rectangulo ? "Rectángulo con su diagonal" : "Triángulo rectángulo"}
        style={{ width: "100%", height: "auto" }}
      >
        {figura.rectangulo ? (
          <>
            <rect x={A.x} y={A.y} width={B.x - A.x} height={C.y - A.y} fill={relleno} />
            <path
              d={`M${A.x},${A.y} H${D.x} V${B.y}`}
              fill="none"
              stroke={tenue}
              strokeWidth={3}
              strokeDasharray="8 6"
            />
          </>
        ) : (
          <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill={relleno} />
        )}
        {mostrarAngulo && (
          <path
            d={`M${C.x + 14},${C.y} V${C.y - 14} H${C.x}`}
            fill="none"
            stroke={tenue}
            strokeWidth={2}
            className={figura.marcarAnguloRecto === false ? "geo-aparece" : undefined}
          />
        )}
        {segmento("a", C, A)}
        {segmento("b", C, B)}
        {segmento("c", A, B)}
        {etiqueta("a", C.x - 12, (C.y + A.y) / 2 + 6, "end")}
        {etiqueta("b", (C.x + B.x) / 2, C.y + 30, "middle")}
        {figura.rectangulo
          ? etiqueta("c", (A.x + B.x) / 2 + 10, (A.y + B.y) / 2 - 14, "start")
          : etiqueta("c", (A.x + B.x) / 2 + 14, (A.y + B.y) / 2 - 12, "start")}
      </svg>
    </Box>
  );
};

export default TrianguloRectangulo;
