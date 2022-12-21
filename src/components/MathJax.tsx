import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

export const MathComponent = dynamic<
  ComponentProps<typeof import("mathjax-react").MathComponent>
>(() => import("mathjax-react").then((v) => v.MathComponent), {
  ssr: false,
});