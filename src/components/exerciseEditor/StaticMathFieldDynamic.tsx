"use client";

import dynamic from "next/dynamic";

const StaticMathField = dynamic(
  async () => {
    const mod = await import("react-mathquill");
    mod.addStyles(); // asegura que los estilos de MathQuill se carguen una vez
    return mod.StaticMathField;
  },
  { ssr: false },
);

export default StaticMathField;
