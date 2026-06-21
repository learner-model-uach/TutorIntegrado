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
import { Box } from "@chakra-ui/react";
import {
  activateMathVirtualKeyboardViewport,
  activatePromptInput,
  applyPromptOnlyMode,
  collectPromptValues,
  deactivateMathVirtualKeyboardViewport,
  getPromptIdFromPointerEvent,
  getPromptIdFromPoint,
  getSelectedPromptId,
  isActiveMathVirtualKeyboardViewport,
  isInteractiveControlEvent,
  isMathVirtualKeyboardOpen,
  isSelectionInsidePrompt,
  keepSelectionInsidePrompt,
  revealActivePrompt,
  setSafeMathFieldClassName,
} from "../../../utils/mathLivePromptGuard";

const ACTIVE_KEYBOARD_CLASS = "logic-keyboard-active";
const PROMPT_GEOMETRY_STYLE_ID = "logic-prompt-geometry";

const stabilizePromptGeometry = (mfe: MathfieldElement) => {
  const shadowRoot = mfe.shadowRoot;
  if (!shadowRoot || shadowRoot.getElementById(PROMPT_GEOMETRY_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = PROMPT_GEOMETRY_STYLE_ID;
  style.textContent = `
    .ML__prompt-atom {
      align-items: center !important;
      background: var(--mathlive-field-prompt-bg) !important;
      border: 1px solid var(--mathlive-field-prompt-border) !important;
      border-radius: 4px !important;
      box-shadow: 0 1px 4px var(--mathlive-field-prompt-shadow) !important;
      box-sizing: border-box !important;
      display: inline-flex !important;
      height: auto !important;
      justify-content: center !important;
      line-height: 1 !important;
      margin: 0 0.12em !important;
      min-height: 1.45em !important;
      min-width: 1.25em !important;
      overflow: visible !important;
      padding: 0.04em 0.2em !important;
      position: relative !important;
      top: 0 !important;
      transform: none !important;
      vertical-align: middle !important;
    }

    .ML__prompt-atom > :not(.ML__prompt) {
      height: auto !important;
      line-height: 1 !important;
      position: relative !important;
      top: 0 !important;
      transform: none !important;
      vertical-align: middle !important;
    }

    .ML__prompt-atom:has(.ML__mfrac) {
      min-height: 2.55em !important;
      min-width: 2.15em !important;
      padding: 0.18em 0.38em !important;
    }

    .ML__prompt-atom:has(.ML__mfrac) > :not(.ML__prompt) {
      font-size: 0.92em !important;
      line-height: 1 !important;
    }

    .ML__prompt-atom .ML__prompt {
      display: none !important;
    }

    :host(.logic-nested-prompts) .ML__mfrac .ML__prompt-atom,
    :host(.logic-nested-prompts) .ML__msubsup .ML__prompt-atom {
      margin-left: 0.08em !important;
      margin-right: 0.08em !important;
      max-width: 2.3em !important;
      min-height: 1.05em !important;
      min-width: 1.05em !important;
      overflow-x: auto !important;
      overflow-y: hidden !important;
      padding: 0.02em 0.12em !important;
      scrollbar-width: none;
    }

    :host(.logic-nested-prompts) .ML__mfrac .ML__prompt-atom::-webkit-scrollbar,
    :host(.logic-nested-prompts) .ML__msubsup .ML__prompt-atom::-webkit-scrollbar {
      display: none;
    }

    :host(.logic-nested-prompts) .ML__mfrac .ML__prompt-atom > :not(.ML__prompt),
    :host(.logic-nested-prompts) .ML__msubsup .ML__prompt-atom > :not(.ML__prompt) {
      font-size: 0.82em !important;
    }

    :host(.logic-nested-prompts) .ML__prompt-atom:has(.ML__mfrac) {
      max-width: 3.4em !important;
      min-height: 2.45em !important;
      min-width: 2em !important;
      overflow: hidden !important;
      padding: 0.16em 0.3em !important;
    }

    :host(.logic-nested-prompts) .ML__prompt-atom:has(.ML__mfrac) > :not(.ML__prompt) {
      font-size: 0.86em !important;
    }

    @media (max-width: 640px) {
      .ML__prompt-atom:has(.ML__mfrac),
      :host(.logic-nested-prompts) .ML__prompt-atom:has(.ML__mfrac) {
        max-width: 3.1em !important;
        min-height: 2.3em !important;
        min-width: 1.9em !important;
        padding: 0.14em 0.26em !important;
      }

      .ML__prompt-atom:has(.ML__mfrac) > :not(.ML__prompt),
      :host(.logic-nested-prompts) .ML__prompt-atom:has(.ML__mfrac) > :not(.ML__prompt) {
        font-size: 0.84em !important;
      }

      .ML__mtable .ML__prompt-atom {
        margin-bottom: 0 !important;
        margin-top: 0 !important;
        min-height: 1.2em !important;
        min-width: 1.1em !important;
        padding: 0 0.14em !important;
      }
    }
  `;
  shadowRoot.append(style);
};

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

const normalizePromptIds = (value: string) => {
  const usedIds = new Set<string>();
  let generatedId = 1;

  const nextGeneratedId = () => {
    let id = `logic_prompt_${generatedId++}`;
    while (usedIds.has(id)) id = `logic_prompt_${generatedId++}`;
    return id;
  };

  return value.replace(/\\placeholder(?:\[([^\]]+)\])?\{/g, (_match, currentId?: string) => {
    const trimmedId = currentId?.trim();
    const id = trimmedId && !usedIds.has(trimmedId) ? trimmedId : nextGeneratedId();
    usedIds.add(id);
    return `\\placeholder[${id}]{`;
  });
};

const formatMobileIntervalExpression = (value: string) => {
  if (typeof window === "undefined" || !window.matchMedia("(max-width: 640px)").matches) {
    return value;
  }

  return value.replace(
    intervalExtremesPattern,
    (_match, inferiorPrompt, superiorPrompt) =>
      String.raw`\begin{array}{lc}\text{Extremo Inferior} & ${inferiorPrompt} \\[0.55em] \text{Extremo Superior} & ${superiorPrompt}\end{array}`,
  );
};

const hasNestedPrompts = (value: string) =>
  value.includes("\\placeholder") &&
  (value.includes("\\frac") || /\^\s*\{[^{}]*\\placeholder/.test(value));

const fitNestedExpression = (
  mfe: MathfieldElement,
  container: HTMLElement | null,
  value: string,
) => {
  const isMobile = window.matchMedia("(max-width: 640px)").matches;
  const shouldFitExpression = isMobile ? value.includes("\\placeholder") : hasNestedPrompts(value);

  if (!container || !shouldFitExpression) {
    mfe.style.removeProperty("font-size");
    return;
  }

  const baseFontSize = isMobile ? 20 : 22;
  const minimumFontSize = isMobile ? 13.5 : 15;
  mfe.style.fontSize = `${baseFontSize}px`;

  const content = mfe.shadowRoot?.querySelector<HTMLElement>("[part~='content']");
  if (!content) return;

  const availableWidth = Math.max(container.clientWidth - 8, 1);
  const contentWidth = Math.max(content.scrollWidth, content.getBoundingClientRect().width);
  if (contentWidth <= availableWidth) return;

  const fittedFontSize = Math.max(
    minimumFontSize,
    Math.floor(((baseFontSize * availableWidth) / contentWidth) * 10) / 10,
  );
  mfe.style.fontSize = `${fittedFontSize}px`;
};

const scheduleNestedExpressionFit = (
  mfe: MathfieldElement,
  container: HTMLElement | null,
  value: string,
) => {
  requestAnimationFrame(() => fitNestedExpression(mfe, container, value));
  window.setTimeout(() => fitNestedExpression(mfe, container, value), 60);
};

const getMathVirtualKeyboard = () =>
  (
    window as Window & {
      mathVirtualKeyboard?: VirtualKeyboardInterface;
    }
  ).mathVirtualKeyboard;

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

const isMathVirtualKeyboardTarget = (event: Event) =>
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
/**
 * @returns a styled math-editor as a non-controlled React component with placeholder support.
 */

const Mathfield = (props: MathEditorProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentValue = useRef<string>("");
  const lastPropValue = useRef<string | null>(null);
  const mfeRef = useRef<MathfieldElement | null>(null);
  const activePromptId = useRef<string | undefined>(undefined);
  const restoringPromptSelection = useRef(false);
  const suppressKeyboardOpenUntil = useRef(0);
  const [mfe, setMfe] = useState<MathfieldElement | null>(null);
  const onChangeRef = useRef(props.onChange);
  const onMountRef = useRef(props.onMount);

  const hideKeyboard = () => {
    if (!isActiveMathVirtualKeyboardViewport(ACTIVE_KEYBOARD_CLASS, wrapperRef.current)) return;

    suppressKeyboardOpenUntil.current = Date.now() + 900;
    deactivateMathVirtualKeyboardViewport(ACTIVE_KEYBOARD_CLASS, wrapperRef.current);
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

    if (promptId) activePromptId.current = promptId;
    suppressKeyboardOpenUntil.current = Date.now() + 120;
    if (wrapperRef.current) {
      activateMathVirtualKeyboardViewport(ACTIVE_KEYBOARD_CLASS, wrapperRef.current);
    }
    activatePromptInput(activeMfe, promptId);
  };

  const handleKeyboardButtonPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (
      isMathVirtualKeyboardOpen(ACTIVE_KEYBOARD_CLASS) &&
      isActiveMathVirtualKeyboardViewport(ACTIVE_KEYBOARD_CLASS, wrapperRef.current)
    ) {
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
    const keyboardAnchor = wrapperRef.current;
    container.replaceChildren(mfe);
    stabilizePromptGeometry(mfe);
    onMountRef.current?.(mfe);
    mfe.mathVirtualKeyboardPolicy = "manual";
    mfe.environmentPopoverPolicy = "off";
    mfe.menuItems = [];
    mfe.resetUndo();
    const initialValue = normalizePromptIds(formatMobileIntervalExpression(props.value ?? ""));
    mfe.setValue(initialValue, { focus: false, feedback: false });
    applyPromptOnlyMode(mfe, props.readOnly);
    currentValue.current = initialValue;
    lastPropValue.current = props.value ?? "";
    scheduleNestedExpressionFit(mfe, container, initialValue);

    let observedContainerWidth = container.clientWidth;
    const resizeObserver = new ResizeObserver(entries => {
      const nextWidth = entries[0]?.contentRect.width ?? container.clientWidth;
      if (Math.abs(nextWidth - observedContainerWidth) < 1) return;
      observedContainerWidth = nextWidth;
      scheduleNestedExpressionFit(mfe, container, currentValue.current);
    });
    resizeObserver.observe(container);

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
        keepSelectionInsidePrompt(mfe, activePromptId.current);
        restoringPromptSelection.current = false;
      });
    };

    const isKeyboardOpenSuppressed = () => Date.now() < suppressKeyboardOpenUntil.current;

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
        scheduleNestedExpressionFit(mfe, container, value);
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
        if (
          isMathVirtualKeyboardOpen(ACTIVE_KEYBOARD_CLASS) &&
          isActiveMathVirtualKeyboardViewport(ACTIVE_KEYBOARD_CLASS, wrapperRef.current)
        ) {
          hideKeyboard();
        } else {
          openKeyboard();
        }
        return;
      }

      if (hasNestedPrompts(currentValue.current)) {
        const { clientX, clientY } = ev;

        window.setTimeout(() => {
          const promptId = getSelectedPromptId(mfe) ?? getPromptIdFromPoint(mfe, clientX, clientY);

          if (!promptId) return;
          activePromptId.current = promptId;
          openKeyboard(promptId);
        }, 0);
        return;
      }

      const promptId = getPromptIdFromPointerEvent(mfe, ev);

      if (promptId) {
        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        activePromptId.current = promptId;
        requestAnimationFrame(() => openKeyboard(promptId));
        return;
      }

      requestAnimationFrame(() => openKeyboard());
    };

    const onSelectionChange = () => {
      const selectedPromptId = getSelectedPromptId(mfe);
      if (selectedPromptId) activePromptId.current = selectedPromptId;
      schedulePromptSelectionGuard();
      revealActivePrompt(mfe);
    };

    const onFocus = () => {
      schedulePromptSelectionGuard();
      requestAnimationFrame(() => {
        if (isKeyboardOpenSuppressed()) {
          if (!isMathVirtualKeyboardOpen(ACTIVE_KEYBOARD_CLASS)) {
            deactivateMathVirtualKeyboardViewport(ACTIVE_KEYBOARD_CLASS, wrapperRef.current);
          }
          return;
        }
        if (wrapperRef.current) {
          activateMathVirtualKeyboardViewport(ACTIVE_KEYBOARD_CLASS, wrapperRef.current);
        }
        activatePromptInput(mfe);
      });
    };

    const onDocumentPointerDown = (ev: PointerEvent) => {
      if (!isMathVirtualKeyboardOpen(ACTIVE_KEYBOARD_CLASS)) return;
      if (!isActiveMathVirtualKeyboardViewport(ACTIVE_KEYBOARD_CLASS, wrapperRef.current)) return;
      if (wrapperRef.current && ev.composedPath().includes(wrapperRef.current)) return;
      if (isMathVirtualKeyboardTarget(ev)) return;
      if (isInteractiveControlEvent(ev)) return;

      hideKeyboard();
    };

    const onDocumentClick = (ev: MouseEvent) => {
      if (!isMathVirtualKeyboardOpen(ACTIVE_KEYBOARD_CLASS)) return;
      if (!isActiveMathVirtualKeyboardViewport(ACTIVE_KEYBOARD_CLASS, wrapperRef.current)) return;
      if (wrapperRef.current && ev.composedPath().includes(wrapperRef.current)) return;
      if (isMathVirtualKeyboardTarget(ev)) return;
      if (!isInteractiveControlEvent(ev)) return;

      hideKeyboard();
    };

    const closeKeyboardForNavigation = () => {
      if (!isActiveMathVirtualKeyboardViewport(ACTIVE_KEYBOARD_CLASS, keyboardAnchor)) return;

      suppressKeyboardOpenUntil.current = Date.now() + 900;
      mfe.blur();
      mfe.executeCommand("hideVirtualKeyboard");
      getMathVirtualKeyboard()?.hide({ animate: false });
      deactivateMathVirtualKeyboardViewport(ACTIVE_KEYBOARD_CLASS, keyboardAnchor);

      requestAnimationFrame(() => {
        mfe.executeCommand("hideVirtualKeyboard");
        getMathVirtualKeyboard()?.hide({ animate: false });
      });
    };

    mfe.addEventListener("keydown", onKeyDown, { capture: true });
    mfe.addEventListener("beforeinput", onBeforeInput);
    mfe.addEventListener("input", onInput);
    mfe.addEventListener("pointerdown", onPointerDown, { capture: true });
    mfe.addEventListener("selection-change", onSelectionChange);
    mfe.addEventListener("focus", onFocus);
    document.addEventListener("pointerdown", onDocumentPointerDown, { capture: true });
    document.addEventListener("click", onDocumentClick, { capture: true });
    window.addEventListener("popstate", closeKeyboardForNavigation);

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
      resizeObserver.disconnect();
      document.removeEventListener("pointerdown", onDocumentPointerDown, {
        capture: true,
      } as EventListenerOptions);
      document.removeEventListener("click", onDocumentClick, {
        capture: true,
      } as EventListenerOptions);
      window.removeEventListener("popstate", closeKeyboardForNavigation);
      closeKeyboardForNavigation();
    };
  }, [mfe]);

  useEffect(() => {
    if (!mfe) return;
    setSafeMathFieldClassName(
      mfe,
      [
        "logic-math-field",
        hasNestedPrompts(props.value ?? "") ? "logic-nested-prompts" : "",
        props.className,
      ]
        .filter(Boolean)
        .join(" "),
    );
    applyPromptOnlyMode(mfe, props.readOnly);
  }, [mfe, props.className, props.readOnly, props.value]);

  useEffect(() => {
    if (!mfe) return;
    if (lastPropValue.current !== (props.value ?? "")) {
      const position = mfe.position;
      const nextValue = normalizePromptIds(formatMobileIntervalExpression(props.value ?? ""));
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
      scheduleNestedExpressionFit(mfe, containerRef.current, nextValue);
      (mfe as MathfieldElement & { requestUpdate?: () => void }).requestUpdate?.();
    }
  }, [mfe, props.readOnly, props.value]);

  const handleContainerPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!mfe) return;
    if (event.target === containerRef.current) {
      event.preventDefault();
      activateMathVirtualKeyboardViewport(ACTIVE_KEYBOARD_CLASS, wrapperRef.current);
      activatePromptInput(mfe);
    }
  };

  return (
    <Box
      ref={wrapperRef}
      position="relative"
      border="1px"
      borderRadius="5"
      borderColor="black"
      width="100%"
      maxW="100%"
      marginX="auto"
      padding="2"
      paddingRight="3.2rem"
      overflow="hidden"
      minH="76px"
      cursor="text"
    >
      <Box
        ref={containerRef}
        onPointerDown={handleContainerPointerDown}
        width="100%"
        maxW="100%"
        overflowX="auto"
        overflowY="visible"
        minH="62px"
        paddingY="0.35rem"
        paddingRight="0.35rem"
        style={{ WebkitOverflowScrolling: "touch" }}
      />
      <button
        type="button"
        aria-label="Mostrar u ocultar teclado matematico"
        className="logic-keyboard-toggle"
        onPointerDown={handleKeyboardButtonPointerDown}
        onClick={handleKeyboardButtonClick}
      >
        ⌨
      </button>
    </Box>
  );
};

export default Mathfield;
