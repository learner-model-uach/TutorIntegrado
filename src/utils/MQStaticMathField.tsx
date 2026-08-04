"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const StaticMathFieldComponent = dynamic(
  () =>
    import("react-mathquill").then(mod => {
      if (typeof window !== "undefined") {
        mod.addStyles();
      }
      return mod.StaticMathField;
    }),
  { ssr: false },
);

const mqo = {
  overflow: "visible",
};

//wrapper created because expresion elements render distorted on document changes
const MQStaticMathField = ({ exp, currentExpIndex }: { exp: string; currentExpIndex: boolean }) => {
  const [texExp, setTexExp] = useState("");
  useEffect(() => {
    if (currentExpIndex)
      setTimeout(() => {
        setTexExp(exp);
      }, 10);
  }, [exp, currentExpIndex]);

  return <StaticMathFieldComponent style={mqo}>{texExp}</StaticMathFieldComponent>;
};
export default MQStaticMathField;
