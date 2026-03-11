import { useEffect, useRef } from "react";
import {
  MathfieldElement,
  VirtualKeyboardInterface,
  VirtualKeyboardLayoutCore,
  NormalizedVirtualKeyboardLayer,
} from "mathlive";
import { Box } from "@chakra-ui/react";

type ExtendedVirtualKeyboard = VirtualKeyboardInterface & {
  readonly normalizedLayouts: (VirtualKeyboardLayoutCore & {
    layers: NormalizedVirtualKeyboardLayer[];
  })[];
};

export type MathEditorProps = {
  readOnly?: boolean;
  value: string;
  onChange: (latex: string, prompts: Record<string, string>) => void;
  className?: string;
  onMount?: (mfe: MathfieldElement) => void;
};
/**
 * @returns a styled math-editor as a non-controlled React component with placeholder support.
 */

const Mathfield = (props: MathEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mfeRef = useRef<MathfieldElement | null>(null);
  if (!mfeRef.current) {
    const mathfield = new MathfieldElement();
    mathfield.virtualKeyboardTargetOrigin = "off";
    mfeRef.current = mathfield;
  }
  const mfe = mfeRef.current;

  //mfe.readOnly = props.readOnly ?? true;
  //mfe.disabled = false;
  //const size = isScreenLarge ? 6 : 3;
  //const size = 6 ;

  //mfe.applyStyle({ fontSize: size as FontSize }, { operation: "set", range: [0, -1] });
  const currentValue = useRef<string>(""); // Esta variable se utilizará para realizar un seguimiento del valor actual del editor de matemáticas.

  useEffect(() => {
    // ejecuta un efecto secundario cuando el componente se monta por primera vez
    const container = containerRef.current!!;
    container.innerHTML = "";
    container.appendChild(mfe);
    props.onMount?.(mfe);
    mfe.className = props.className || "";
    mfe.mathVirtualKeyboardPolicy = "auto";
    mfe.readOnly = true;
    mfe.environmentPopoverPolicy = "off";
    mfe.resetUndo();

    const keyboardLayout = (window.mathVirtualKeyboard as ExtendedVirtualKeyboard | undefined)
      ?.normalizedLayouts?.[0];
    const keyboardKey = keyboardLayout?.layers?.[0]?.rows?.[2]?.[10] as
      | { shift?: unknown }
      | undefined;
    if (keyboardLayout) {
      delete keyboardKey?.shift;
      window.mathVirtualKeyboard.layouts = keyboardLayout;
    }

    mfe.addEventListener(
      "keydown",
      ev => {
        if (ev.key === "Tab") {
          mfe.executeCommand("moveToNextPlaceholder");
        } else if (ev.key === "\\") {
          ev.preventDefault();
          mfe.executeCommand(["insert", "\\backslash"]);
        } else if (ev.key === "Escape") ev.preventDefault();
      },
      { capture: true },
    );

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
  }, [mfe, props]);

  useEffect(() => {
    // actualiza el valor del editor de matemáticas cuando props.value cambia.
    if (currentValue.current !== props.value) {
      const position = mfe.position;
      mfe.setValue(props.value, { focus: true, feedback: false });
      mfe.position = position;
      currentValue.current = props.value;
    }
  }, [mfe, props.value]); //se ejecutará cada vez que el valor de props.value

  return (
    <>
      <Box
        ref={containerRef}
        border="1px"
        borderRadius="5"
        borderColor="black"
        width="fit-content"
        marginX="auto"
        padding="2"
      />
    </>
  );
};

export default Mathfield;
