import { addStyles, StaticMathField } from "react-mathquill";
import { useState, useEffect } from "react";

addStyles();

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
