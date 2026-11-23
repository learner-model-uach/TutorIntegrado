import React from "react";
import { Box } from "@chakra-ui/react";
import { useColorModeValue } from "../../ui/color-mode";

// Piezas compartidas por todas las figuras: paleta, lienzo SVG, segmentos y etiquetas con resaltado.
export const usePaleta = () => ({
  a: useColorModeValue("#2f6fdf", "#6ea2ff"),
  b: useColorModeValue("#0f9d76", "#3fd0a4"),
  c: useColorModeValue("#e0592a", "#ff8a5c"),
  d: useColorModeValue("#8b5cf6", "#b49cff"),
  relleno: useColorModeValue("#eef2fa", "#232a36"),
  rellenoActivo: useColorModeValue("#fde3d6", "#4a2b20"),
  tenue: useColorModeValue("#8a93a6", "#98a0b3"),
  tinta: useColorModeValue("#3a4252", "#c3c9d6"),
});

export const formatear = v =>
  typeof v === "number"
    ? Number.isInteger(v)
      ? String(v)
      : String(Math.round(v * 100) / 100).replace(".", ",")
    : v;

export const Lienzo = ({ W = 420, H = 330, label, children }) => (
  <Box w="500px" maxW="100%">
    <style>{`.geo-pulso{animation:geoPulso 1.2s ease-in-out infinite}@keyframes geoPulso{50%{stroke-width:12}}.geo-aparece{animation:geoAparece .5s ease-out}@keyframes geoAparece{from{opacity:0}}@media (prefers-reduced-motion:reduce){.geo-pulso,.geo-aparece{animation:none}}`}</style>
    {/* margen lateral de 40 px a cada lado para que ninguna etiqueta se corte */}
    <svg
      viewBox={`-40 0 ${W + 80} ${H}`}
      role="img"
      aria-label={label}
      style={{ width: "100%", height: "auto" }}
    >
      {children}
    </svg>
  </Box>
);

// Estado visual de un elemento según el paso: activo (grueso), atenuado o pulsando (incógnita resuelta)
export const estado = (id, foco, resuelto, incognita) => {
  const pulsa = resuelto && id === incognita;
  const activo = foco.includes(id) || pulsa;
  const visible = foco.length === 0 || activo;
  return { pulsa, activo, visible };
};

export const Segmento = ({ id, p, q, color, foco, resuelto, incognita, base = 5, dash }) => {
  const e = estado(id, foco, resuelto, incognita);
  return (
    <line
      x1={p.x}
      y1={p.y}
      x2={q.x}
      y2={q.y}
      stroke={color}
      strokeLinecap="round"
      strokeDasharray={dash}
      className={e.pulsa ? "geo-pulso" : undefined}
      style={{
        strokeWidth: e.activo ? base + 4 : base,
        opacity: e.visible ? 1 : 0.35,
        transition: "stroke-width .35s, opacity .35s",
      }}
    />
  );
};

export const Etiqueta = ({
  id,
  x,
  y,
  color,
  texto,
  foco,
  resuelto,
  incognita,
  anchor = "middle",
  size = 17,
}) => {
  const e = estado(id, foco, resuelto, incognita);
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={color}
      style={{
        font: `600 ${size}px system-ui, sans-serif`,
        opacity: e.visible ? 1 : 0.35,
        transition: "opacity .35s",
      }}
    >
      {texto}
    </text>
  );
};

// Texto de un dato: valor conocido, nombre de la incógnita o su resultado al resolver
export const textoDato = (figura, id, nombre, resuelto) => {
  const u = figura.unidad ? ` ${figura.unidad}` : "";
  if (id === figura.incognita)
    return resuelto && figura.resultado != null ? `${nombre} = ${figura.resultado}` : nombre;
  const v = figura[id];
  return v == null ? nombre : `${nombre} = ${formatear(v)}${typeof v === "number" ? u : ""}`;
};

// Valor numérico para dibujar: usa el dato si es número, si no la proporción de `figura.dibujo`
export const medida = (figura, id, respaldo) =>
  typeof figura[id] === "number" ? figura[id] : (figura.dibujo?.[id] ?? respaldo);
