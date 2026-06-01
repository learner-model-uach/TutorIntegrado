import { useEffect, useRef, useState, type PointerEvent } from "react";
import type {
  MathfieldElement,
  VirtualKeyboardInterface,
  VirtualKeyboardLayoutCore,
  NormalizedVirtualKeyboardLayer,
} from "mathlive";
import { Box } from "@chakra-ui/react";
import {
  activatePromptInput,
  applyPromptOnlyMode,
  collectPromptValues,
  isSelectionInsidePrompt,
  keepSelectionInsidePrompt,
  revealActivePrompt,
  setSafeMathFieldClassName,
} from "../../../utils/mathLivePromptGuard";

type ExtendedVirtualKeyboard = VirtualKeyboardInterface & {
  readonly normalizedLayouts: (VirtualKeyboardLayoutCore & {
    layers: NormalizedVirtualKeyboardLayer[];
  })[];
};

const promptPattern = String.raw`\\placeholder(?:\[[^\]]+\])?\{[^{}]*\}`;
const latexSpacePattern = String.raw`(?:\s|\\,|\\;|\\:|\\!|\\quad|\\qquad|~)*`;
const intervalExtremesPattern = new RegExp(
  String.raw`\\text\{\s*Extremo\s+Inferior\s*\}${latexSpacePattern}(${promptPattern})${latexSpacePattern}\\text\{\s*Extremo\s+Superior\s*\}${latexSpacePattern}(${promptPattern})`,
  "i",
);

const formatMobileIntervalExpression = (value: string) => {
  if (typeof window === "undefined" || !window.matchMedia("(max-width: 640px)").matches) {
    return value;
  }

  return value.replace(
    intervalExtremesPattern,
    (_match, inferiorPrompt, superiorPrompt) =>
      String.raw`\begin{array}{lc}\text{Extremo Inferior} & ${inferiorPrompt} \\ \text{Extremo Superior} & ${superiorPrompt}\end{array}`,
  );
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
  const restoringPromptSelection = useRef(false);
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
    mfe.menuItems = [];
    mfe.resetUndo();
    const initialValue = formatMobileIntervalExpression(props.value ?? "");
    mfe.setValue(initialValue, { focus: false, feedback: false });
    applyPromptOnlyMode(mfe, props.readOnly);
    currentValue.current = initialValue;
    lastPropValue.current = props.value ?? "";

    const vk = window.mathVirtualKeyboard as ExtendedVirtualKeyboard | undefined;
    if (vk?.normalizedLayouts?.[0]) {
      const layout = vk.normalizedLayouts[0];
      const row = layout.layers?.[0]?.rows?.[2];
      const key = row?.[10] as { shift?: unknown } | undefined;
      if (key && "shift" in key) delete key.shift;
      window.mathVirtualKeyboard.layouts = layout;
    }

    const schedulePromptSelectionGuard = () => {
      if (restoringPromptSelection.current) return;
      restoringPromptSelection.current = true;

      requestAnimationFrame(() => {
        keepSelectionInsidePrompt(mfe);
        restoringPromptSelection.current = false;
      });
    };

    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === "Tab" || ev.key === "Enter") {
        if (mfe.getPrompts().length === 0) return;
        ev.preventDefault();
        mfe.executeCommand("moveToNextPlaceholder");
        schedulePromptSelectionGuard();
        revealActivePrompt(mfe);
      } else if (ev.key === "\\") {
        ev.preventDefault();
        mfe.executeCommand(["insert", "\\backslash"]);
      } else if (ev.key === "Escape") {
        ev.preventDefault();
      }
    };

    const onInput = (evt: Event) => {
      const value = (evt.target as HTMLInputElement).value || "";
      const promptValues = collectPromptValues(mfe);
      if (currentValue.current !== value) {
        currentValue.current = value;
        onChangeRef.current(value, promptValues);
        revealActivePrompt(mfe);
      }
    };

    const onBeforeInput = (ev: Event) => {
      if (mfe.getPrompts().length === 0) return;
      if (keepSelectionInsidePrompt(mfe)) {
        ev.preventDefault();
      }
    };

    const onPointerDown = () => {
      requestAnimationFrame(() => {
        activatePromptInput(mfe);
      });
    };

    const onSelectionChange = () => {
      schedulePromptSelectionGuard();
      revealActivePrompt(mfe);
    };

    const onFocus = () => {
      schedulePromptSelectionGuard();
      requestAnimationFrame(() => {
        activatePromptInput(mfe);
      });
    };

    mfe.addEventListener("keydown", onKeyDown, { capture: true });
    mfe.addEventListener("beforeinput", onBeforeInput);
    mfe.addEventListener("input", onInput);
    mfe.addEventListener("pointerdown", onPointerDown, { capture: true });
    mfe.addEventListener("selection-change", onSelectionChange);
    mfe.addEventListener("focus", onFocus);

    onChangeRef.current(props.value ?? "", collectPromptValues(mfe));

    return () => {
      mfe.removeEventListener("keydown", onKeyDown, { capture: true } as EventListenerOptions);
      mfe.removeEventListener("beforeinput", onBeforeInput);
      mfe.removeEventListener("input", onInput);
      mfe.removeEventListener("pointerdown", onPointerDown, {
        capture: true,
      } as EventListenerOptions);
      mfe.removeEventListener("selection-change", onSelectionChange);
      mfe.removeEventListener("focus", onFocus);
    };
  }, [mfe]);

  useEffect(() => {
    if (!mfe) return;
    setSafeMathFieldClassName(mfe, ["logic-math-field", props.className].filter(Boolean).join(" "));
    applyPromptOnlyMode(mfe, props.readOnly);
  }, [mfe, props.className, props.readOnly]);

  useEffect(() => {
    if (!mfe) return;
    if (lastPropValue.current !== (props.value ?? "")) {
      const position = mfe.position;
      const nextValue = formatMobileIntervalExpression(props.value ?? "");
      mfe.setValue(nextValue, { focus: false, feedback: false });
      applyPromptOnlyMode(mfe, props.readOnly);
      try {
        mfe.position = position;
      } catch {
        // Ignore invalid cursor restoration when placeholders changed.
      }
      if (document.activeElement === mfe && !isSelectionInsidePrompt(mfe)) {
        activatePromptInput(mfe);
      }
      currentValue.current = nextValue;
      lastPropValue.current = props.value ?? "";
      (mfe as MathfieldElement & { requestUpdate?: () => void }).requestUpdate?.();
    }
  }, [mfe, props.readOnly, props.value]);

  const handleContainerPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!mfe) return;
    if (event.target === containerRef.current) {
      event.preventDefault();
      activatePromptInput(mfe);
    }
  };

  return (
    <>
      <Box
        ref={containerRef}
        onPointerDown={handleContainerPointerDown}
        border="1px"
        borderRadius="5"
        borderColor="black"
        width="100%"
        maxW="100%"
        marginX="auto"
        padding="2"
        overflowX="auto"
        overflowY="hidden"
        minH="48px"
        cursor="text"
        style={{ WebkitOverflowScrolling: "touch" }}
      />
    </>
  );
};

export default Mathfield;
