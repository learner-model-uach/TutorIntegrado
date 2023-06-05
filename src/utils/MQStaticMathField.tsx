import { addStyles, StaticMathField } from "react-mathquill";
import { useState, useEffect } from "react";

addStyles();

//wrapper created because expresion elements render distorted on document changes
const MQStaticMathField = ({ exp, currentExpIndex }: { exp: string; currentExpIndex: boolean }) => {
  const [texExp, setTexExp] = useState("");
  useEffect(() => {
    if (currentExpIndex)
      setTimeout(() => {
        setTexExp(exp);
      }, 10);
  }, [exp, currentExpIndex]);

  return <StaticMathField>{texExp}</StaticMathField>;
};
export default MQStaticMathField;
