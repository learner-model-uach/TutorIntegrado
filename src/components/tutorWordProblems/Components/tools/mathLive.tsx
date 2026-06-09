import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type {
  MathfieldElement,
  VirtualKeyboardInterface,
  VirtualKeyboardLayoutCore,
  NormalizedVirtualKeyboardLayer,
} from "mathlive";
import "mathlive/static.css";
import { Box } from "@chakra-ui/react";
import {
  activatePromptInput,
  applyPromptOnlyMode,
  collectPromptValues,
  getPromptIdFromPoint,
  isSelectionInsidePrompt,
  keepSelectionInsidePrompt,
  revealActivePrompt,
  setSafeMathFieldClassName,
} from "../../../../utils/mathLivePromptGuard";

type ExtendedVirtualKeyboard = VirtualKeyboardInterface & {
  readonly normalizedLayouts: (VirtualKeyboardLayoutCore & {
    layers: NormalizedVirtualKeyboardLayer[];
  })[];
};

const getMathVirtualKeyboard = () =>
  (
    window as Window & {
      mathVirtualKeyboard?: VirtualKeyboardInterface;
    }
  ).mathVirtualKeyboard;

const isMathVirtualKeyboardVisible = () =>
  Boolean(
    getMathVirtualKeyboard()?.visible || document.querySelector("body > .ML__keyboard.is-visible"),
  );

const isVirtualKeyboardToggleTarget = (event: PointerEvent) =>
  event.composedPath().some(target => {
    if (!(target instanceof Element)) return false;

    const part = target.getAttribute("part") ?? "";

    return (
      (target instanceof HTMLElement && target.classList.contains("ML__virtual-keyboard-toggle")) ||
      part.split(/\s+/).includes("virtual-keyboard-toggle") ||
      Boolean(target.closest(".ML__virtual-keyboard-toggle, [part~='virtual-keyboard-toggle']"))
    );
  });

const isMathVirtualKeyboardTarget = (event: PointerEvent) =>
  event.composedPath().some(target => {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest(".ML__keyboard"));
  });

export type MathEditorProps = {
  readOnly?: boolean;
  value: string;
  onChange: (latex: string, prompts: Record<string, string>) => void;
  className?: string;
  onMount?: (mfe: MathfieldElement) => void;
};

const Mathfield = (props: MathEditorProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentValue = useRef<string>("");
  const lastPropValue = useRef<string | null>(null);
  const mfeRef = useRef<MathfieldElement | null>(null);
  const restoringPromptSelection = useRef(false);
  const suppressKeyboardOpenUntil = useRef(0);
  const [mfe, setMfe] = useState<MathfieldElement | null>(null);
  const onChangeRef = useRef(props.onChange);
  const onMountRef = useRef(props.onMount);

  const hideKeyboard = () => {
    suppressKeyboardOpenUntil.current = Date.now() + 900;
    document.body.classList.remove("word-problem-keyboard-active");
    mfeRef.current?.executeCommand("hideVirtualKeyboard");
    getMathVirtualKeyboard()?.hide({ animate: true });

    requestAnimationFrame(() => {
      mfeRef.current?.executeCommand("hideVirtualKeyboard");
      getMathVirtualKeyboard()?.hide({ animate: true });
    });

    window.setTimeout(() => {
      mfeRef.current?.executeCommand("hideVirtualKeyboard");
      getMathVirtualKeyboard()?.hide({ animate: true });
    }, 120);
  };

  const openKeyboard = (promptId?: string) => {
    const activeMfe = mfeRef.current;
    if (!activeMfe) return;

    suppressKeyboardOpenUntil.current = Date.now() + 120;
    document.body.classList.add("word-problem-keyboard-active");
    activatePromptInput(activeMfe, promptId);
  };

  const handleKeyboardButtonPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isMathVirtualKeyboardVisible()) {
      hideKeyboard();
    } else {
      openKeyboard();
    }
  };

  const handleKeyboardButtonClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

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

    mfe.mathVirtualKeyboardPolicy = "manual";
    mfe.environmentPopoverPolicy = "off";
    mfe.menuItems = [];
    mfe.resetUndo();
    mfe.setValue(props.value ?? "", { focus: false, feedback: false });
    applyPromptOnlyMode(mfe, props.readOnly);
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

    const schedulePromptSelectionGuard = () => {
      if (restoringPromptSelection.current) return;
      restoringPromptSelection.current = true;

      requestAnimationFrame(() => {
        keepSelectionInsidePrompt(mfe);
        restoringPromptSelection.current = false;
      });
    };

    const isKeyboardOpenSuppressed = () => Date.now() < suppressKeyboardOpenUntil.current;

    const onKey = (ev: KeyboardEvent) => {
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

    const onPointerDown = (ev: PointerEvent) => {
      if (isVirtualKeyboardToggleTarget(ev)) {
        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        if (isMathVirtualKeyboardVisible()) {
          hideKeyboard();
        } else {
          openKeyboard();
        }
        return;
      }

      const promptId = getPromptIdFromPoint(mfe, ev.clientX, ev.clientY);

      if (promptId) {
        ev.preventDefault();
        openKeyboard(promptId);
        return;
      }

      requestAnimationFrame(() => {
        openKeyboard();
      });
    };

    const onSelectionChange = () => {
      schedulePromptSelectionGuard();
      revealActivePrompt(mfe);
    };

    const onFocus = () => {
      schedulePromptSelectionGuard();
      requestAnimationFrame(() => {
        if (isKeyboardOpenSuppressed()) {
          if (!isMathVirtualKeyboardVisible()) {
            document.body.classList.remove("word-problem-keyboard-active");
          }
          return;
        }
        document.body.classList.add("word-problem-keyboard-active");
        activatePromptInput(mfe);
      });
    };

    const onDocumentPointerDown = (ev: PointerEvent) => {
      if (!isMathVirtualKeyboardVisible()) return;
      if (wrapperRef.current && ev.composedPath().includes(wrapperRef.current)) return;
      if (isMathVirtualKeyboardTarget(ev)) return;

      hideKeyboard();
    };

    mfe.addEventListener("keydown", onKey, { capture: true });
    mfe.addEventListener("beforeinput", onBeforeInput);
    mfe.addEventListener("input", onInput);
    mfe.addEventListener("pointerdown", onPointerDown, { capture: true });
    mfe.addEventListener("selection-change", onSelectionChange);
    mfe.addEventListener("focus", onFocus);
    document.addEventListener("pointerdown", onDocumentPointerDown, { capture: true });

    onChangeRef.current(props.value ?? "", collectPromptValues(mfe));

    return () => {
      // limpieza
      mfe.removeEventListener("keydown", onKey, { capture: true } as any);
      mfe.removeEventListener("beforeinput", onBeforeInput);
      mfe.removeEventListener("input", onInput);
      mfe.removeEventListener("pointerdown", onPointerDown, { capture: true } as any);
      mfe.removeEventListener("selection-change", onSelectionChange);
      mfe.removeEventListener("focus", onFocus);
      document.removeEventListener("pointerdown", onDocumentPointerDown, {
        capture: true,
      } as EventListenerOptions);
      document.body.classList.remove("word-problem-keyboard-active");
    };
  }, [mfe]);

  useEffect(() => {
    if (!mfe) return;
    setSafeMathFieldClassName(mfe, props.className);
    applyPromptOnlyMode(mfe, props.readOnly);
  }, [mfe, props.className, props.readOnly]);

  // actualiza cuando cambie props.value
  useEffect(() => {
    if (!mfe) return;
    if (lastPropValue.current !== (props.value ?? "")) {
      const pos = mfe.position;
      mfe.setValue(props.value ?? "", { focus: false, feedback: false });
      applyPromptOnlyMode(mfe, props.readOnly);
      try {
        mfe.position = pos;
      } catch {
        // Ignore invalid cursor restoration when placeholders changed.
      }
      if (document.activeElement === mfe && !isSelectionInsidePrompt(mfe)) {
        activatePromptInput(mfe);
      }
      currentValue.current = props.value ?? "";
      lastPropValue.current = props.value ?? "";
      (mfe as any).requestUpdate?.();
    }
  }, [mfe, props.readOnly, props.value]);

  const handleContainerPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!mfe) return;
    if (event.target === containerRef.current) {
      event.preventDefault();
      document.body.classList.add("word-problem-keyboard-active");
      activatePromptInput(mfe);
    }
  };

  return (
    <Box
      ref={wrapperRef}
      position="relative"
      borderWidth="1px"
      borderRadius="md"
      borderColor="black"
      width="100%"
      maxW="100%"
      marginX="auto"
      padding="2"
      paddingRight="3.25rem"
      overflow="hidden"
      minH="58px"
      cursor="text"
    >
      <Box
        ref={containerRef}
        onPointerDown={handleContainerPointerDown}
        width="100%"
        maxW="100%"
        overflowX="auto"
        overflowY="hidden"
        minH="48px"
        paddingRight="0.35rem"
        style={{ WebkitOverflowScrolling: "touch" }}
      />
      <button
        type="button"
        aria-label="Mostrar u ocultar teclado matematico"
        className="word-problem-keyboard-toggle"
        onPointerDown={handleKeyboardButtonPointerDown}
        onClick={handleKeyboardButtonClick}
      >
        ⌨
      </button>
    </Box>
  );
};

export default Mathfield;
