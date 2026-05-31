"use client";
import dynamic from "next/dynamic"
import { useState, useEffect } from "react";

const StaticMathField = dynamic(
  () => import("react-mathquill").then((mod) => mod.StaticMathField),
  { ssr: false, loading: () => <span /> }
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

  return <StaticMathField style={mqo}>{texExp}</StaticMathField>;
};
export default MQStaticMathField;
