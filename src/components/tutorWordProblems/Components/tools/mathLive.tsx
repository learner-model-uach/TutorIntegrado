import { useEffect, useRef } from "react";
import {
  MathfieldElement,
  VirtualKeyboardInterface,
  VirtualKeyboardLayoutCore,
  NormalizedVirtualKeyboardLayer,
} from "mathlive";
import "mathlive/static.css";
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

const Mathfield = (props: MathEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentValue = useRef<string>("");
  const mfeRef = useRef<MathfieldElement | null>(null);

  if (!mfeRef.current) {
    const mathfield = new MathfieldElement();
    mathfield.virtualKeyboardTargetOrigin = "off";
    mfeRef.current = mathfield;
  }
  const mfe = mfeRef.current;

  useEffect(() => {
    const container = containerRef.current!;
    container.innerHTML = "";
    container.appendChild(mfe);
    props.onMount?.(mfe);

    mfe.className = props.className || "";
    mfe.mathVirtualKeyboardPolicy = "auto";
    mfe.readOnly = props.readOnly ?? false;
    mfe.environmentPopoverPolicy = "off";
    mfe.resetUndo();

    // set valor inicial después de montar en el DOM + repintar forzado
    const anyMfe = mfe as unknown as { requestUpdate?: () => void };
    requestAnimationFrame(() => {
      mfe.setValue(props.value ?? "", { focus: true, feedback: false });
      anyMfe.requestUpdate?.();
      requestAnimationFrame(() => anyMfe.requestUpdate?.());
    });

    // teclado virtual: proteger contra cambios de índices entre versiones
    const vk = (window as any).mathVirtualKeyboard as ExtendedVirtualKeyboard | undefined;
    if (vk?.normalizedLayouts?.[0]) {
      const layout = vk.normalizedLayouts[0];
      const row = layout.layers?.[0]?.rows?.[2];
      const key = row?.[10];
      if (key && "shift" in (key as any)) {
        // @ts-ignore
        delete (key as any).shift;
      }
      (window as any).mathVirtualKeyboard.layouts = layout;
    }

    // handlers
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Tab") {
        mfe.executeCommand("moveToNextPlaceholder");
      } else if (ev.key === "\\") {
        ev.preventDefault();
        mfe.executeCommand(["insert", "\\backslash"]);
      } else if (ev.key === "Escape") {
        ev.preventDefault();
      }
    };

    const onInput = (evt: Event) => {
      const value = (evt.target as HTMLInputElement).value || "";
      const promptValues: Record<string, string> = mfe.getPrompts().reduce(
        (acc, id) => {
          acc[id] = mfe.getPromptValue(id);
          return acc;
        },
        {} as Record<string, string>,
      );

      if (currentValue.current !== value) {
        currentValue.current = value;
        props.onChange(value, promptValues);
      }
    };

    mfe.addEventListener("keydown", onKey, { capture: true });
    mfe.addEventListener("input", onInput);

    return () => {
      // limpieza
      mfe.removeEventListener("keydown", onKey, { capture: true } as any);
      mfe.removeEventListener("input", onInput);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mfe, props]);

  // actualiza cuando cambie props.value
  useEffect(() => {
    if (currentValue.current !== props.value) {
      const pos = mfe.position;
      mfe.setValue(props.value ?? "", { focus: true, feedback: false });
      mfe.position = pos;
      currentValue.current = props.value ?? "";
      (mfe as any).requestUpdate?.();
    }
  }, [mfe, props.value]);

  return (
    <Box
      ref={containerRef}
      border="1px"
      borderRadius="5"
      borderColor="black"
      width="fit-content"
      marginX="auto"
      padding="2"
      minH="48px"
    />
  );
};

export default Mathfield;
