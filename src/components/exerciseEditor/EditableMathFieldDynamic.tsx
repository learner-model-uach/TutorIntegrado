"use client";

import dynamic from "next/dynamic";

// Importa solo el componente que necesitas, y evita SSR
const EditableMathField = dynamic(
  async () => {
    const mod = await import("react-mathquill");
    mod.addStyles(); // inyecta los estilos de MathQuill
    return mod.EditableMathField;
  },
  { ssr: false },
);

export default EditableMathField;
