import { useEffect, useRef, useState, type MouseEvent } from "react";
import type {
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
  const lastPropValue = useRef<string | null>(null);
  const mfeRef = useRef<MathfieldElement | null>(null);
  const [mfe, setMfe] = useState<MathfieldElement | null>(null);
  const onChangeRef = useRef(props.onChange);
  const onMountRef = useRef(props.onMount);

  useEffect(() => {
    onChangeRef.current = props.onChange;
    onMountRef.current = props.onMount;
  }, [props.onChange, props.onMount]);

  useEffect(() => {
    let active = true;

    void import("mathlive").then(() => {
      if (!active || mfeRef.current) return;
      const mathfield = document.createElement("math-field") as MathfieldElement & {
        virtualKeyboardTargetOrigin?: string;
      };
      mathfield.virtualKeyboardTargetOrigin = "off";
      mfeRef.current = mathfield;
      setMfe(mathfield);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!mfe) return;
    const container = containerRef.current!;
    container.replaceChildren(mfe);
    onMountRef.current?.(mfe);

    mfe.mathVirtualKeyboardPolicy = "auto";
    mfe.environmentPopoverPolicy = "off";
    mfe.resetUndo();
    mfe.setValue(props.value ?? "", { focus: false, feedback: false });
    currentValue.current = props.value ?? "";
    lastPropValue.current = props.value ?? "";

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
        onChangeRef.current(value, promptValues);
      }
    };

    const focusFirstPlaceholder = () => {
      mfe.focus();

      const promptIds = mfe.getPrompts();
      if (promptIds.length === 0) return;

      try {
        mfe.position = 0;
      } catch {
        // Ignore if the cursor cannot be repositioned safely.
      }

      try {
        mfe.executeCommand("moveToNextPlaceholder");
      } catch {
        // Ignore if MathLive rejects the command in the current state.
      }
    };

    const onPointerDown = () => {
      requestAnimationFrame(focusFirstPlaceholder);
    };

    mfe.addEventListener("keydown", onKey, { capture: true });
    mfe.addEventListener("input", onInput);
    mfe.addEventListener("pointerdown", onPointerDown, { capture: true });

    onChangeRef.current(
      props.value ?? "",
      mfe.getPrompts().reduce(
        (acc, id) => {
          acc[id] = mfe.getPromptValue(id);
          return acc;
        },
        {} as Record<string, string>,
      ),
    );

    return () => {
      // limpieza
      mfe.removeEventListener("keydown", onKey, { capture: true } as any);
      mfe.removeEventListener("input", onInput);
      mfe.removeEventListener("pointerdown", onPointerDown, { capture: true } as any);
    };
  }, [mfe, props.value]);

  useEffect(() => {
    if (!mfe) return;
    mfe.className = props.className || "";
    mfe.readOnly = props.readOnly ?? false;
  }, [mfe, props.className, props.readOnly]);

  // actualiza cuando cambie props.value
  useEffect(() => {
    if (!mfe) return;
    if (lastPropValue.current !== (props.value ?? "")) {
      const pos = mfe.position;
      mfe.setValue(props.value ?? "", { focus: false, feedback: false });
      try {
        mfe.position = pos;
      } catch {
        // Ignore invalid cursor restoration when placeholders changed.
      }
      currentValue.current = props.value ?? "";
      lastPropValue.current = props.value ?? "";
      (mfe as any).requestUpdate?.();
    }
  }, [mfe, props.value]);

  const handleContainerMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (!mfe) return;
    event.preventDefault();
    mfe.focus();
  };

  return (
    <Box
      ref={containerRef}
      onMouseDown={handleContainerMouseDown}
      borderWidth="1px"
      borderRadius="md"
      borderColor="black"
      width="fit-content"
      maxW="100%"
      marginX="auto"
      padding="2"
      overflow="visible"
      minH="48px"
      cursor="text"
    />
  );
};

export default Mathfield;
