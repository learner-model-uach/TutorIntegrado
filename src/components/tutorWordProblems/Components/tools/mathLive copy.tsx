import * as React from 'react';

import { useEffect, useMemo } from 'react';
import { MathfieldElement} from 'mathlive';
import { Button } from '@chakra-ui/react';

export type MathEditorProps = {
  readOnly?: boolean;
  value: string;
  onChange: (latex: string, prompts: Record<string, string>) => void;

  className?: string;
};

/**
 * @returns a styled math-editor as a non-controlled React component with placeholder support.
 */
const Mathfield = (props: MathEditorProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mfe = useMemo(() => new MathfieldElement(), []);
  mfe.readOnly = props.readOnly ?? false;
  mfe.disabled = false
  const currentValue = React.useRef<string>(''); // Esta variable se utilizará para realizar un seguimiento del valor actual del editor de matemáticas.
  /*
  mfe.applyStyle(
    {backgroundColor: 'yellow' },
    {range: [0, -1]}
    )
    */
  useEffect(() => { // ejecuta un efecto secundario cuando el componente se monta por primera vez
    const container = containerRef.current!!;
    container.innerHTML = '';
    container.appendChild(mfe);
    mfe.className = props.className || '';

    mfe.addEventListener('input', ({ target }) => {
      const value = (target as HTMLInputElement).value || '';
      const promptValues: Record<string, string> = mfe
        .getPrompts()
        .reduce((acc, id) => ({ ...acc, [id]: mfe.getPromptValue(id) }), {});

      if (currentValue.current !== value) {
        currentValue.current = value;
        props.onChange(value, promptValues);
      }
    });

  }, []);

  useEffect(() => { // Este efecto se encarga de actualizar el valor del editor de matemáticas cuando props.value cambia.
    
    if (currentValue.current !== props.value) {
      const position = mfe.position;
      mfe.setValue(props.value, { focus: true, feedback: false });
      mfe.position = position;
      currentValue.current = props.value;
    }
  }, [props.value]);//se ejecutará cada vez que el valor de props.value

  return (
    <>

      <div onFocus={()=>{console.log("FOCUS!!!!!")}} ref={containerRef} style={{ maxWidth: '100%'}} />
      {/*
      <Button onClick={()=>{
        console.log(mfe.getPrompts())
        mfe.setPromptState('a',"correct",true)
        }}>Aceptar</Button>
      */
      }
    </>
  )
}

export default Mathfield