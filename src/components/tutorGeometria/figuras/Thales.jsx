import React from "react";
import { usePaleta, Lienzo, Segmento, Etiqueta, formatear } from "./comunes";

// Figuras de Thales. Los segmentos se nombran s1, s2 (primera recta) y s3, s4 (segunda recta);
// la proporción es s1/s2 = s3/s4. `incognita` es el id del segmento desconocido (normalmente "s4").
const texto = (figura, id, resuelto) => {
  const u = figura.unidad ? ` ${figura.unidad}` : "";
  const nombre = figura.etiquetas?.[id] ?? "x";
  if (id === figura.incognita)
    return resuelto && figura.resultado ? `${nombre} = ${figura.resultado}` : nombre;
  return `${formatear(figura[id])}${u}`;
};
const largo = (figura, id) =>
  typeof figura[id] === "number" ? figura[id] : (figura.dibujo?.[id] ?? 1);

// Dos transversales cortadas por tres paralelas L1 // L2 // L3
export const Paralelas = ({ figura, foco = [], resuelto = false }) => {
  const p = usePaleta();
  const W = 420,
    H = 330;
  const s = { foco, resuelto, incognita: figura.incognita };
  const izq = [largo(figura, "s1"), largo(figura, "s2")],
    der = [largo(figura, "s3"), largo(figura, "s4")];
  const total = Math.max(izq[0] + izq[1], 1);
  const y0 = 50,
    alto = 230;
  const yA = y0,
    yB = y0 + (alto * izq[0]) / total,
    yC = y0 + alto;
  const xi = y => 110 + (y - y0) * 0.25; // transversal izquierda inclinada
  const xd = y => 300 - (y - y0) * 0.18; // transversal derecha
  const P = (x, y) => ({ x, y });
  return (
    <Lienzo W={W} H={H} label="Rectas paralelas cortadas por dos transversales">
      {[yA, yB, yC].map((y, i) => (
        <g key={i}>
          <line x1={40} y1={y} x2={380} y2={y} stroke={p.tenue} strokeWidth={2} />
          <text x={392} y={y + 5} fill={p.tenue} style={{ font: "600 14px system-ui" }}>{`L${
            3 - i
          }`}</text>
        </g>
      ))}
      <line
        x1={xi(y0 - 25)}
        y1={y0 - 25}
        x2={xi(yC + 25)}
        y2={yC + 25}
        stroke={p.tinta}
        strokeWidth={2}
      />
      <line
        x1={xd(y0 - 25)}
        y1={y0 - 25}
        x2={xd(yC + 25)}
        y2={yC + 25}
        stroke={p.tinta}
        strokeWidth={2}
      />
      <Segmento id="s1" p={P(xi(yA), yA)} q={P(xi(yB), yB)} color={p.a} {...s} />
      <Segmento id="s2" p={P(xi(yB), yB)} q={P(xi(yC), yC)} color={p.b} {...s} />
      <Segmento id="s3" p={P(xd(yA), yA)} q={P(xd(yB), yB)} color={p.a} {...s} />
      <Segmento id="s4" p={P(xd(yB), yB)} q={P(xd(yC), yC)} color={p.b} {...s} />
      <Etiqueta
        id="s1"
        x={xi((yA + yB) / 2) - 12}
        y={(yA + yB) / 2 + 6}
        anchor="end"
        color={p.a}
        texto={texto(figura, "s1", resuelto)}
        {...s}
      />
      <Etiqueta
        id="s2"
        x={xi((yB + yC) / 2) - 12}
        y={(yB + yC) / 2 + 6}
        anchor="end"
        color={p.b}
        texto={texto(figura, "s2", resuelto)}
        {...s}
      />
      <Etiqueta
        id="s3"
        x={xd((yA + yB) / 2) + 12}
        y={(yA + yB) / 2 + 6}
        anchor="start"
        color={p.a}
        texto={texto(figura, "s3", resuelto)}
        {...s}
      />
      <Etiqueta
        id="s4"
        x={xd((yB + yC) / 2) + 12}
        y={(yB + yC) / 2 + 6}
        anchor="start"
        color={p.b}
        texto={texto(figura, "s4", resuelto)}
        {...s}
      />
      <text
        x={210}
        y={H - 8}
        textAnchor="middle"
        fill={p.tenue}
        style={{ font: "600 14px system-ui" }}
      >
        L1 // L2 // L3
      </text>
    </Lienzo>
  );
};

// Triángulo cortado por una paralela a la base: s1,s2 en el lado izquierdo y s3,s4 en el derecho
export const TrianguloParalela = ({ figura, foco = [], resuelto = false }) => {
  const p = usePaleta();
  const W = 420,
    H = 330;
  const s = { foco, resuelto, incognita: figura.incognita };
  const t = largo(figura, "s1") / (largo(figura, "s1") + largo(figura, "s2"));
  const V = { x: 190, y: 30 },
    A = { x: 50, y: 290 },
    B = { x: 380, y: 290 };
  const L = (P, Q, f) => ({ x: P.x + (Q.x - P.x) * f, y: P.y + (Q.y - P.y) * f });
  const M = L(V, A, t),
    N = L(V, B, t);
  return (
    <Lienzo W={W} H={H} label="Triángulo cortado por una paralela a la base">
      <polygon points={`${V.x},${V.y} ${A.x},${A.y} ${B.x},${B.y}`} fill={p.relleno} />
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={p.tinta} strokeWidth={3} />
      <line x1={M.x} y1={M.y} x2={N.x} y2={N.y} stroke={p.tinta} strokeWidth={3} />
      <Segmento id="s1" p={V} q={M} color={p.a} {...s} />
      <Segmento id="s2" p={M} q={A} color={p.b} {...s} />
      <Segmento id="s3" p={V} q={N} color={p.a} {...s} />
      <Segmento id="s4" p={N} q={B} color={p.b} {...s} />
      <Etiqueta
        id="s1"
        x={(V.x + M.x) / 2 - 12}
        y={(V.y + M.y) / 2}
        anchor="end"
        color={p.a}
        texto={texto(figura, "s1", resuelto)}
        {...s}
      />
      <Etiqueta
        id="s2"
        x={(M.x + A.x) / 2 - 12}
        y={(M.y + A.y) / 2}
        anchor="end"
        color={p.b}
        texto={texto(figura, "s2", resuelto)}
        {...s}
      />
      <Etiqueta
        id="s3"
        x={(V.x + N.x) / 2 + 12}
        y={(V.y + N.y) / 2}
        anchor="start"
        color={p.a}
        texto={texto(figura, "s3", resuelto)}
        {...s}
      />
      <Etiqueta
        id="s4"
        x={(N.x + B.x) / 2 + 12}
        y={(N.y + B.y) / 2}
        anchor="start"
        color={p.b}
        texto={texto(figura, "s4", resuelto)}
        {...s}
      />
    </Lienzo>
  );
};

// Sombras: objeto alto (altoGrande, sombraGrande) y objeto chico (altoChico, sombraChica) con el rayo de sol común.
export const Sombras = ({ figura, foco = [], resuelto = false }) => {
  const p = usePaleta();
  const W = 420,
    H = 330;
  const s = { foco, resuelto, incognita: figura.incognita };
  const SG = largo(figura, "sombraGrande"),
    SC = largo(figura, "sombraChica");
  const AG =
    typeof figura.altoGrande === "number"
      ? figura.altoGrande
      : (largo(figura, "altoChico") * SG) / SC;
  const AC = typeof figura.altoChico === "number" ? figura.altoChico : (AG * SC) / SG;
  const k = Math.min(320 / SG, 200 / AG);
  const yS = 250,
    xE = 50 + SG * k; // fin de las sombras (punto común)
  const xG = 50,
    xC = xE - SC * k;
  const n = id => figura.etiquetas?.[id];
  const t = (id, def) => {
    const u = figura.unidad ? ` ${figura.unidad}` : "";
    if (id === figura.incognita)
      return resuelto && figura.resultado
        ? `${n(id) ?? "x"} = ${figura.resultado}`
        : (n(id) ?? "x");
    return `${formatear(figura[id])}${u}`;
  };
  return (
    <Lienzo W={W} H={H} label="Objetos y sus sombras">
      <line x1={20} y1={yS} x2={400} y2={yS} stroke={p.tenue} strokeWidth={2} />
      <polygon points={`${xG},${yS} ${xG},${yS - AG * k} ${xE},${yS}`} fill={p.relleno} />
      <line
        x1={xG}
        y1={yS - AG * k}
        x2={xE}
        y2={yS}
        stroke={p.c}
        strokeWidth={2}
        strokeDasharray="6 5"
      />
      <Segmento
        id="altoGrande"
        p={{ x: xG, y: yS }}
        q={{ x: xG, y: yS - AG * k }}
        color={p.a}
        base={7}
        {...s}
      />
      <Segmento
        id="altoChico"
        p={{ x: xC, y: yS }}
        q={{ x: xC, y: yS - AC * k }}
        color={p.d}
        base={7}
        {...s}
      />
      <Segmento
        id="sombraGrande"
        p={{ x: xG, y: yS + 16 }}
        q={{ x: xE, y: yS + 16 }}
        color={p.b}
        base={4}
        {...s}
      />
      <Segmento
        id="sombraChica"
        p={{ x: xC, y: yS + 46 }}
        q={{ x: xE, y: yS + 46 }}
        color={p.b}
        base={4}
        dash="5 4"
        {...s}
      />
      <Etiqueta
        id="altoGrande"
        x={xG + 12}
        y={yS - AG * k - 8}
        anchor="start"
        color={p.a}
        texto={`${figura.nombres?.[0] ?? "objeto"}: ${t("altoGrande")}`}
        {...s}
        size={15}
      />
      <Etiqueta
        id="altoChico"
        x={xC - 10}
        y={yS - (AC * k) / 2}
        anchor="end"
        color={p.d}
        texto={`${figura.nombres?.[1] ?? "objeto"}: ${t("altoChico")}`}
        {...s}
        size={15}
      />
      <Etiqueta
        id="sombraGrande"
        x={xG}
        y={yS + 36}
        anchor="start"
        color={p.b}
        texto={`sombra ${figura.nombres?.[0] ?? ""}: ${t("sombraGrande")}`}
        {...s}
        size={14}
      />
      <Etiqueta
        id="sombraChica"
        x={xE}
        y={yS + 66}
        anchor="end"
        color={p.b}
        texto={`sombra ${figura.nombres?.[1] ?? ""}: ${t("sombraChica")}`}
        {...s}
        size={14}
      />
    </Lienzo>
  );
};

// Escala: objeto real y su representación (mapa, foto, maqueta), dibujados proporcionales
export const Escala = ({ figura, foco = [], resuelto = false }) => {
  const p = usePaleta();
  const W = 420,
    H = 330;
  const s = { foco, resuelto, incognita: figura.incognita };
  const items = figura.items ?? [];
  return (
    <Lienzo W={W} H={H} label="Comparación a escala">
      <text
        x={110}
        y={28}
        textAnchor="middle"
        fill={p.tinta}
        style={{ font: "700 15px system-ui" }}
      >
        {figura.titulos?.[0] ?? "Real"}
      </text>
      <text
        x={310}
        y={28}
        textAnchor="middle"
        fill={p.tinta}
        style={{ font: "700 15px system-ui" }}
      >
        {figura.titulos?.[1] ?? "Escala"}
      </text>
      <line
        x1={210}
        y1={40}
        x2={210}
        y2={300}
        stroke={p.tenue}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      {items.map((it, i) => {
        const hr = 230 * (it.relReal ?? 1),
          hm = 230 * (it.relModelo ?? 0.4);
        const x = 70 + i * 60,
          xm = 270 + i * 50;
        const col = i === 0 ? p.a : p.b;
        return (
          <g key={it.id}>
            <Segmento
              id={`${it.id}Real`}
              p={{ x, y: 290 }}
              q={{ x, y: 290 - hr }}
              color={col}
              base={10}
              {...s}
            />
            <Segmento
              id={`${it.id}Modelo`}
              p={{ x: xm, y: 290 }}
              q={{ x: xm, y: 290 - hm }}
              color={col}
              base={10}
              {...s}
            />
            <Etiqueta
              id={`${it.id}Real`}
              x={x}
              y={278 - hr}
              color={col}
              texto={it.real}
              {...s}
              size={13}
            />
            <Etiqueta
              id={`${it.id}Modelo`}
              x={xm}
              y={278 - hm}
              color={col}
              texto={it.modelo}
              {...s}
              size={13}
            />
          </g>
        );
      })}
      {resuelto && figura.resultado && (
        <text
          x={210}
          y={322}
          textAnchor="middle"
          fill={p.c}
          className="geo-aparece"
          style={{ font: "700 16px system-ui" }}
        >
          {figura.resultado}
        </text>
      )}
    </Lienzo>
  );
};
