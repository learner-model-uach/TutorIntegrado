import { useEffect, useRef, useState } from "react";
import type {
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

    const vk = window.mathVirtualKeyboard as ExtendedVirtualKeyboard | undefined;
    if (vk?.normalizedLayouts?.[0]) {
      const layout = vk.normalizedLayouts[0];
      const row = layout.layers?.[0]?.rows?.[2];
      const key = row?.[10] as { shift?: unknown } | undefined;
      if (key && "shift" in key) delete key.shift;
      window.mathVirtualKeyboard.layouts = layout;
    }

    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === "Tab") {
        ev.preventDefault();
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
        .reduce((acc, id) => ({ ...acc, [id]: mfe.getPromptValue(id) }), {});
      if (currentValue.current !== value) {
        currentValue.current = value;
        onChangeRef.current(value, promptValues);
      }
    };

    mfe.addEventListener("keydown", onKeyDown, { capture: true });
    mfe.addEventListener("input", onInput);

    return () => {
      mfe.removeEventListener("keydown", onKeyDown, { capture: true } as EventListenerOptions);
      mfe.removeEventListener("input", onInput);
    };
  }, [mfe]);

  useEffect(() => {
    if (!mfe) return;
    mfe.className = props.className || "";
    mfe.readOnly = props.readOnly ?? false;
  }, [mfe, props.className, props.readOnly]);

  useEffect(() => {
    if (!mfe) return;
    if (lastPropValue.current !== (props.value ?? "")) {
      const position = mfe.position;
      mfe.setValue(props.value ?? "", { focus: false, feedback: false });
      try {
        mfe.position = position;
      } catch {
        // Ignore invalid cursor restoration when placeholders changed.
      }
      currentValue.current = props.value ?? "";
      lastPropValue.current = props.value ?? "";
      (mfe as MathfieldElement & { requestUpdate?: () => void }).requestUpdate?.();
    }
  }, [mfe, props.value]);

  return (
    <>
      <Box
        ref={containerRef}
        border="1px"
        borderRadius="5"
        borderColor="black"
        width="100%"
        maxW="100%"
        marginX="auto"
        padding="2"
        overflow="visible"
        minH="48px"
      />
    </>
  );
};

export default Mathfield;
