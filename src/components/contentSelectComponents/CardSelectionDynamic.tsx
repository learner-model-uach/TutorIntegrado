import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { CardSelection } from "./CardSelection";

const CardSelectionDynamic = dynamic<ComponentProps<typeof CardSelection>>(
  () => import("./CardSelection").then(v => v.CardSelection),
  {
    ssr: false,
  },
);

export { CardSelectionDynamic as CardSelection };
