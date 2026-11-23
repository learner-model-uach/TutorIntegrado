import React from "react";
import { usePaleta, Lienzo, Segmento, Etiqueta, textoDato, medida, estado } from "./comunes";

// Figuras de Área y Perímetro. Ids resaltables:
//   círculo: "radio" | "diametro" | "area" | "perimetro"
//   rectángulo: "largo" | "ancho" | "area" | "perimetro"
//   triángulo: "base" | "altura" | "lados" | "area" | "perimetro"
// `incognita` suele ser "area" o "perimetro"; `resultado` es el texto que aparece al resolver.

const Resultado = ({ figura, resuelto, x, y, color }) =>
  resuelto && figura.resultado ? (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill={color}
      className="geo-aparece"
      style={{ font: "700 18px system-ui, sans-serif" }}
    >
      {`${
        figura.incognita === "perimetro"
          ? "P"
          : figura.incognita === "area"
            ? "A"
            : (figura.etiquetas?.[figura.incognita] ?? figura.incognita)
      } = ${figura.resultado}`}
    </text>
  ) : null;

export const Circulo = ({ figura, foco = [], resuelto = false }) => {
  const p = usePaleta();
  const W = 420,
    H = 330,
    cx = 210,
    cy = 160,
    R = 115;
  const usaDiametro = figura.diametro != null;
  const area = estado("area", foco, resuelto, figura.incognita);
  const per = estado("perimetro", foco, resuelto, figura.incognita);
  const s = { foco, resuelto, incognita: figura.incognita };
  return (
    <Lienzo W={W} H={H} label="Círculo">
      <circle
        cx={cx}
        cy={cy}
        r={R}
        fill={area.activo ? p.rellenoActivo : p.relleno}
        style={{ transition: "fill .35s" }}
      />
      <circle
        cx={cx}
        cy={cy}
        r={R}
        fill="none"
        stroke={p.c}
        className={per.pulsa ? "geo-pulso" : undefined}
        style={{
          strokeWidth: per.activo ? 8 : 3,
          opacity: per.visible || area.visible ? 1 : 0.35,
          transition: "stroke-width .35s",
        }}
      />
      <circle cx={cx} cy={cy} r={4} fill={p.tinta} />
      {usaDiametro ? (
        <>
          <Segmento
            id="diametro"
            p={{ x: cx - R, y: cy }}
            q={{ x: cx + R, y: cy }}
            color={p.a}
            {...s}
          />
          <Etiqueta
            id="diametro"
            x={cx}
            y={cy - 12}
            color={p.a}
            texto={textoDato(figura, "diametro", "d", resuelto)}
            {...s}
          />
          {figura.mostrarRadio && (
            <Etiqueta
              id="radio"
              x={cx + R / 2}
              y={cy + 26}
              color={p.b}
              texto={textoDato(figura, "radio", "r", resuelto)}
              {...s}
            />
          )}
        </>
      ) : (
        <>
          <Segmento id="radio" p={{ x: cx, y: cy }} q={{ x: cx + R, y: cy }} color={p.a} {...s} />
          <Etiqueta
            id="radio"
            x={cx + R / 2}
            y={cy - 12}
            color={p.a}
            texto={textoDato(figura, "radio", "r", resuelto)}
            {...s}
          />
        </>
      )}
      <Resultado figura={figura} resuelto={resuelto} x={cx} y={H - 12} color={p.c} />
    </Lienzo>
  );
};

export const Rectangulo = ({ figura, foco = [], resuelto = false }) => {
  const p = usePaleta();
  const W = 420,
    H = 330,
    m = 70;
  const L = medida(figura, "largo", 2),
    An = medida(figura, "ancho", 1);
  // espacio extra a la izquierda para la etiqueta "ancho = …"
  const k = Math.min((W - 2 * m - 60) / L, (H - 2 * m - 20) / An);
  const w = L * k,
    h = An * k,
    x0 = (W - w) / 2 + 30,
    y0 = (H - 20 - h) / 2;
  const area = estado("area", foco, resuelto, figura.incognita);
  const per = estado("perimetro", foco, resuelto, figura.incognita);
  const s = { foco, resuelto, incognita: figura.incognita };
  const nombre = figura.cuadrado ? "lado" : null;
  return (
    <Lienzo W={W} H={H} label={figura.cuadrado ? "Cuadrado" : "Rectángulo"}>
      <rect
        x={x0}
        y={y0}
        width={w}
        height={h}
        fill={area.activo ? p.rellenoActivo : p.relleno}
        style={{ transition: "fill .35s" }}
      />
      <rect
        x={x0}
        y={y0}
        width={w}
        height={h}
        fill="none"
        stroke={p.c}
        className={per.pulsa ? "geo-pulso" : undefined}
        style={{
          strokeWidth: per.activo ? 8 : 2,
          opacity: per.activo ? 1 : 0.5,
          transition: "stroke-width .35s",
        }}
      />
      <Segmento
        id="largo"
        p={{ x: x0, y: y0 + h }}
        q={{ x: x0 + w, y: y0 + h }}
        color={p.b}
        {...s}
      />
      <Segmento id="ancho" p={{ x: x0, y: y0 }} q={{ x: x0, y: y0 + h }} color={p.a} {...s} />
      <Etiqueta
        id="largo"
        x={x0 + w / 2}
        y={y0 + h + 28}
        color={p.b}
        texto={textoDato(figura, "largo", nombre ?? figura.etiquetas?.largo ?? "largo", resuelto)}
        {...s}
      />
      {!figura.cuadrado && (
        <Etiqueta
          id="ancho"
          x={x0 - 10}
          y={y0 + h / 2 + 6}
          anchor="end"
          color={p.a}
          texto={textoDato(figura, "ancho", figura.etiquetas?.ancho ?? "ancho", resuelto)}
          {...s}
        />
      )}
      <Resultado
        figura={figura}
        resuelto={resuelto}
        x={x0 + w / 2}
        y={y0 + h / 2 + 6}
        color={p.c}
      />
    </Lienzo>
  );
};

// Triángulo con base horizontal. `forma`: "general" | "rectangulo" | "equilatero"
export const Triangulo = ({ figura, foco = [], resuelto = false }) => {
  const p = usePaleta();
  const W = 420,
    H = 330,
    m = 70;
  const forma = figura.forma ?? "general";
  const b = forma === "equilatero" ? medida(figura, "lado", 1) : medida(figura, "base", 2);
  const hgt = forma === "equilatero" ? (b * Math.sqrt(3)) / 2 : medida(figura, "altura", 1);
  const k = Math.min((W - 2 * m) / b, (H - 2 * m - 10) / hgt);
  const w = b * k,
    h = hgt * k,
    x0 = (W - w) / 2,
    yb = (H - 10 + h) / 2;
  const apexX = forma === "rectangulo" ? x0 : forma === "equilatero" ? x0 + w / 2 : x0 + w * 0.35;
  const A = { x: x0, y: yb },
    B = { x: x0 + w, y: yb },
    Cc = { x: apexX, y: yb - h };
  const area = estado("area", foco, resuelto, figura.incognita);
  const per = estado("perimetro", foco, resuelto, figura.incognita);
  const s = { foco, resuelto, incognita: figura.incognita };
  const lados = forma === "equilatero" || figura.lados;
  return (
    <Lienzo W={W} H={H} label="Triángulo">
      <polygon
        points={`${A.x},${A.y} ${B.x},${B.y} ${Cc.x},${Cc.y}`}
        fill={area.activo ? p.rellenoActivo : p.relleno}
        style={{ transition: "fill .35s" }}
      />
      <polygon
        points={`${A.x},${A.y} ${B.x},${B.y} ${Cc.x},${Cc.y}`}
        fill="none"
        stroke={per.activo || lados ? p.c : p.tinta}
        className={per.pulsa ? "geo-pulso" : undefined}
        style={{
          strokeWidth: per.activo ? 8 : 3,
          opacity: per.visible || area.visible ? 1 : 0.4,
          transition: "stroke-width .35s",
        }}
      />
      {forma === "rectangulo" && (
        <path
          d={`M${A.x + 14},${A.y} V${A.y - 14} H${A.x}`}
          fill="none"
          stroke={p.tenue}
          strokeWidth={2}
        />
      )}
      {lados ? (
        <>
          <Etiqueta
            id="lados"
            x={(A.x + Cc.x) / 2 - 10}
            y={(A.y + Cc.y) / 2}
            anchor="end"
            color={p.c}
            texto={figura.ladosTexto?.[0] ?? `${figura.lado} ${figura.unidad ?? ""}`}
            {...s}
          />
          <Etiqueta
            id="lados"
            x={(B.x + Cc.x) / 2 + 10}
            y={(B.y + Cc.y) / 2}
            anchor="start"
            color={p.c}
            texto={figura.ladosTexto?.[1] ?? `${figura.lado} ${figura.unidad ?? ""}`}
            {...s}
          />
          <Etiqueta
            id="lados"
            x={(A.x + B.x) / 2}
            y={A.y + 28}
            color={p.c}
            texto={figura.ladosTexto?.[2] ?? `${figura.lado} ${figura.unidad ?? ""}`}
            {...s}
          />
        </>
      ) : (
        <>
          <Segmento id="base" p={A} q={B} color={p.b} {...s} />
          <Etiqueta
            id="base"
            x={(A.x + B.x) / 2}
            y={A.y + 28}
            color={p.b}
            texto={textoDato(figura, "base", figura.etiquetas?.base ?? "base", resuelto)}
            {...s}
          />
          <Segmento
            id="altura"
            p={{ x: Cc.x, y: Cc.y }}
            q={{ x: Cc.x, y: yb }}
            color={p.a}
            dash={forma === "rectangulo" ? undefined : "7 6"}
            {...s}
          />
          <Etiqueta
            id="altura"
            x={Cc.x - 10}
            y={(Cc.y + yb) / 2}
            anchor="end"
            color={p.a}
            texto={textoDato(figura, "altura", figura.etiquetas?.altura ?? "altura", resuelto)}
            {...s}
          />
        </>
      )}
      <Resultado figura={figura} resuelto={resuelto} x={W / 2} y={22} color={p.c} />
    </Lienzo>
  );
};
