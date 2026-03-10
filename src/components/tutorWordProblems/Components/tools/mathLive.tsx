import { useEffect, useMemo, useRef } from "react";
import {
  MathfieldElement,
  Selector,
  VirtualKeyboardInterface,
  VirtualKeyboardLayoutCore,
  NormalizedVirtualKeyboardLayer,
} from "mathlive";
import "mathlive/static.css"; // Puedes moverlo a global si prefieres
import { Box } from "@chakra-ui/react";

type ExtendedVirtualKeyboard = VirtualKeyboardInterface & {
  readonly normalizedLayouts: (VirtualKeyboardLayoutCore & {
    layers: NormalizedVirtualKeyboardLayer[];
  })[];
};

export type MathEditorProps = {
  readOnly?: boolean;
  value: string;
  mfe?: MathfieldElement;
  onChange: (latex: string, prompts: Record<string, string>) => void;
  className?: string;
};

/**
 * Wrapper no-controlado de MathLive para React/Chakra v3.
 * - Monta un único MathfieldElement
 * - Fuerza repintado con requestUpdate() tras setValue()
 * - Ajusta el teclado virtual (remueve "deleteAll" si existe)
 */
const Mathfield = (props: MathEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentValue = useRef<string>("");

  // Instancia única (o usa la provista via props)
  const mfe = useMemo(() => {
    const mathfield = props.mfe ?? new MathfieldElement();
    mathfield.virtualKeyboardTargetOrigin = "off";
    return mathfield;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const container = containerRef.current!;
    container.innerHTML = "";
    container.appendChild(mfe);

    // Config base
    mfe.className = props.className || "";
    mfe.mathVirtualKeyboardPolicy = "auto";
    mfe.readOnly = props.readOnly ?? false; // Si quieres comportamiento v1, usa ?? true
    mfe.environmentPopoverPolicy = "off";
    mfe.resetUndo();

    // Set valor inicial después de montar en el DOM + repintar forzado
    const anyMfe = mfe as unknown as { requestUpdate?: () => void };
    requestAnimationFrame(() => {
      mfe.setValue(props.value ?? "", { focus: true, feedback: false });
      anyMfe.requestUpdate?.();
      requestAnimationFrame(() => anyMfe.requestUpdate?.());
    });

    // Teclado virtual: proteger contra cambios de índices entre versiones
    const vk = (window as any).mathVirtualKeyboard as ExtendedVirtualKeyboard | undefined;
    if (vk?.normalizedLayouts?.[0]) {
      const layout = vk.normalizedLayouts[0];
      const row = layout.layers?.[0]?.rows?.[2];
      const key = row?.[10];
      if (key && "shift" in (key as any)) {
        // @ts-ignore
        delete (key as any).shift; // eliminar "deleteAll" si existe
      }
      (window as any).mathVirtualKeyboard.layouts = layout;
    }

    // Handlers
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
      const promptValues: Record<string, string> = mfe
        .getPrompts()
        .reduce((acc, id) => {
          acc[id] = mfe.getPromptValue(id);
          return acc;
        }, {} as Record<string, string>);

      if (currentValue.current !== value) {
        currentValue.current = value;
        props.onChange(value, promptValues);
      }
    };

    mfe.addEventListener("keydown", onKey, { capture: true });
    mfe.addEventListener("input", onInput);

    return () => {
      // Limpieza
      mfe.removeEventListener("keydown", onKey, { capture: true } as any);
      mfe.removeEventListener("input", onInput);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Actualiza cuando cambie props.value
  useEffect(() => {
    if (currentValue.current !== props.value) {
      const pos = mfe.position;
      mfe.setValue(props.value ?? "", { focus: true, feedback: false });
      mfe.position = pos;
      currentValue.current = props.value ?? "";
      (mfe as any).requestUpdate?.();
    }
  }, [mfe, props.value]);

  // @ts-ignore - util opcional para disparar el teclado
  const showVirtualKeyboard = () => {
    mfe.executeCommand("toggleVirtualKeyboard" as Selector);
  };

  return (
    <Box
      ref={containerRef}
      border="1px"
      borderRadius="5"
      borderColor="black"
      width="fit-content"
      marginX="auto"
      padding="2"
      minH="48px" // fallback visual si aún no cargan estilos
    />
  );
};

export default Mathfield;
