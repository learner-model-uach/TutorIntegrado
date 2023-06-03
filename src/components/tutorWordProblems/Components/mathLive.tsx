import type { DOMAttributes } from "react";
import type { MathfieldElementAttributes } from 'mathlive'

type CustomElement<T> = Partial<T & DOMAttributes<T>>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["math-field"]: CustomElement<MathfieldElementAttributes>;
    }
  }
}


import * as React from "react";

import { useEffect, useRef, useMemo, CSSProperties} from "react";
import  { MathfieldElement, MathfieldOptions} from "mathlive";

export type MathfieldProps = {
  options?: Partial<MathfieldOptions>;

  value: string;
  onChange: (latex: string) => void;
  readOnly?: boolean

  className?: string;
  onPlaceholderChange?: (placeholderId: string, latex: string) => void;
  containerStyle?: CSSProperties;
  placeholderStyle?: CSSProperties;

};

/**
 * @returns a styled math-editor as a non-controlled React component with placeholder support.
 */
const Mathfield = (props: MathfieldProps) => {
  //const mathfieldRef = useRef<MathfieldElement>(null);
  const mathfieldRef = useRef<MathfieldElement>(null);
  const mfe = useMemo(()=> new MathfieldElement(props.options), [])

  useEffect(() => {
    
    // mathfieldRef.current.<option> = <value>;
    const container = mathfieldRef.current!!
    container.innerHTML = "" //establecemos HTML a string vacio
    container.appendChild(mfe)
    
    mfe.className = props.className || "" // recuperamos el className desde la props de lo contrario ""
    
    // Escuchamos los cambios en el campo principal de mathfield
    /**
     * addEventListener registra un evento a un objeto
     * recibe un tipo  que es una cadena representando el tipo de evento a escuchar "input", es decir una entrada de texto}
     * y un listener que es una funcion o un objeto que recibe la notificación cuando un evento del tipo especificaod ocurre
     */
    mfe.addEventListener("input",({target}) => {
      props.onChange((target as  HTMLInputElement).value || "")
    })



  },[])

 
  useEffect(() => {
    mfe.value = props.value;
  }, [props.value]);

  //return <div ref={containerRef} style={props.containerStyle} />
  return (
    <math-field  read-only={props.readOnly} ref={mathfieldRef}>{props.value}</math-field>
  );
};

export default Mathfield