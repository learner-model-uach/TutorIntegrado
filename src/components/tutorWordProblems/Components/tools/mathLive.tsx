import * as React from "react";

import { useEffect, useMemo } from "react";
import { FontSize, MathfieldElement, Selector } from "mathlive";
import { useMediaQuery } from "@chakra-ui/react";

export type MathEditorProps = {
  readOnly?: boolean;
  value: string;
  mfe?: MathfieldElement;
  onChange: (latex: string, prompts: Record<string, string>) => void;
  className?: string;
};
/**
 * @returns a styled math-editor as a non-controlled React component with placeholder support.
 */

const Mathfield = (props: MathEditorProps) => {
  const [isScreenLarge] = useMediaQuery("(min-width: 768px)");

  const containerRef = React.useRef<HTMLDivElement>(null);
  const mfe = useMemo(() => {
    const mathfield = props.mfe ?? new MathfieldElement();
    mathfield.virtualKeyboardTargetOrigin = "off";
    return mathfield;
  }, []);

  mfe.readOnly = props.readOnly ?? true;
  //mfe.disabled = false
  var size = isScreenLarge ? 6 : 3;

  mfe.applyStyle({ fontSize: size as FontSize }, { operation: "set", range: [0, -1] });
  const currentValue = React.useRef<string>(""); // Esta variable se utilizará para realizar un seguimiento del valor actual del editor de matemáticas.

  //console.log("Renderizado mathLive")

  useEffect(() => {
    // ejecuta un efecto secundario cuando el componente se monta por primera vez
    const container = containerRef.current!!;
    container.innerHTML = "";
    container.appendChild(mfe);
    mfe.className = props.className || "";
    mfe.mathVirtualKeyboardPolicy = "auto";
    /** 
    mfe.addEventListener("focusin", (evt) => {
      window.mathVirtualKeyboard.show()
    });
    */
    //mfe.addEventListener("keydown", (evt) =>  evt.preventDefault(), {capture: true});
    mfe.addEventListener(
      "mouseup",
      evt => {
        //console.log("CAPTURA DE EVENTO")
        evt.stopPropagation();
        evt.cancelBubble = true;
        evt.preventDefault();
      },
      { capture: true },
    );

    /*
    mfe.addEventListener("focusout", (evt) =>{
      window.mathVirtualKeyboard.hide()
    })
    */

    mfe.addEventListener("input", evt => {
      //evt.preventDefault()
      const value = (evt.target as HTMLInputElement).value || "";
      const promptValues: Record<string, string> = mfe
        .getPrompts()
        .reduce((acc, id) => ({ ...acc, [id]: mfe.getPromptValue(id) }), {});
      if (currentValue.current !== value) {
        currentValue.current = value;
        props.onChange(value, promptValues);
      }
    });
  }, []);

  useEffect(() => {
    // Este efecto se encarga de actualizar el valor del editor de matemáticas cuando props.value cambia.

    if (currentValue.current !== props.value) {
      const position = mfe.position;
      mfe.setValue(props.value, { focus: true, feedback: false });
      mfe.position = position;
      currentValue.current = props.value;
    }
  }, [props.value]); //se ejecutará cada vez que el valor de props.value

  const showVirtualKeyboard = () => {
    mfe.executeCommand("toggleVirtualKeyboard" as Selector);
  };
  return (
    <>
      <div
        onTouchStart={evt => evt.preventDefault()}
        onFocus={() => {
          console.log("FOCUS!!!!!");
        }}
        ref={containerRef}
        style={{ maxWidth: "100%" }}
      />
      {/**
         <ButtonGroup>
           <Button onClick={()=> {
             mfe.focus()
             mfe.executeCommand("moveToPreviousChar")
           }}>
             {'<'}
           </Button>
           <Button onClick={()=>{
             mfe.focus()
             mfe.executeCommand("moveToNextChar")
           }}>
             {'>'}
           </Button>
           <Button onClick={showVirtualKeyboard}>
             {'Toggle Keyboard'}
           </Button>
         </ButtonGroup>
         
         */}
    </>
  );
};

export default Mathfield;
