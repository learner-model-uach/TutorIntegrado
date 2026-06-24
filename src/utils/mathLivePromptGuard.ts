import type {
  MathfieldElement,
  NormalizedVirtualKeyboardLayer,
  Range,
  Selection,
  VirtualKeyboardInterface,
  VirtualKeyboardKeycap,
  VirtualKeyboardLayoutCore,
} from "mathlive";

export const SAFE_MATHFIELD_CLASS = "safe-math-field";

const KEYBOARD_SELECTOR = "body > .ML__keyboard";
const KEYBOARD_BODY_CLASSES = ["logic-keyboard-active", "word-problem-keyboard-active"];

type MathVirtualKeyboardEventTarget = VirtualKeyboardInterface & EventTarget;
type ExtendedVirtualKeyboard = VirtualKeyboardInterface & {
  readonly normalizedLayouts: (VirtualKeyboardLayoutCore & {
    layers: NormalizedVirtualKeyboardLayer[];
  })[];
};

const SET_SYMBOL_KEYS: Partial<VirtualKeyboardKeycap>[] = [
  { label: "ℝ", insert: "R", tooltip: "Reales", class: "MLK__tex" },
  { label: "ℕ", insert: "N", tooltip: "Naturales", class: "MLK__tex" },
  { label: "ℤ", insert: "Z", tooltip: "Enteros", class: "MLK__tex" },
  { label: "ℚ", insert: "Q", tooltip: "Racionales", class: "MLK__tex" },
];
const keyboardSpacer = (width: number): Partial<VirtualKeyboardKeycap> => ({
  class: "separator",
  width: width as VirtualKeyboardKeycap["width"],
});

let activeKeyboardAnchor: HTMLElement | null = null;
let activeKeyboardBodyClass: string | null = null;
let observedKeyboard: MathVirtualKeyboardEventTarget | null = null;

const getMathVirtualKeyboard = () =>
  (
    window as Window & {
      mathVirtualKeyboard?: VirtualKeyboardInterface;
    }
  ).mathVirtualKeyboard as MathVirtualKeyboardEventTarget | undefined;

export const configureMateoMathKeyboard = () => {
  const keyboard = getMathVirtualKeyboard() as ExtendedVirtualKeyboard | undefined;
  const layout = keyboard?.normalizedLayouts?.[0];
  const rows = layout?.layers?.[0]?.rows;
  if (!keyboard || !layout || !rows) return;

  const setSymbolsRowIndex = rows.findIndex(row =>
    row.some(key => SET_SYMBOL_KEYS.some(symbol => symbol.insert === key.insert)),
  );
  const hasSetSymbols = setSymbolsRowIndex >= 0;
  const originalThirdRowIndex = hasSetSymbols && setSymbolsRowIndex <= 2 ? 3 : 2;
  const shiftKey = rows[originalThirdRowIndex]?.[10] as { shift?: unknown } | undefined;
  if (shiftKey && "shift" in shiftKey) delete shiftKey.shift;

  const alignedSetSymbolsRow = [
    keyboardSpacer(1),
    keyboardSpacer(1),
    keyboardSpacer(0.5),
    ...SET_SYMBOL_KEYS.map(key => ({ ...key })),
    keyboardSpacer(0.5),
    keyboardSpacer(1),
    keyboardSpacer(1),
    keyboardSpacer(1),
  ];

  if (hasSetSymbols) rows.splice(setSymbolsRowIndex, 1);
  rows.splice(0, 0, alignedSetSymbolsRow);

  keyboard.layouts = layout;
};

const getKeyboardBackdrop = () =>
  document.querySelector<HTMLElement>(`${KEYBOARD_SELECTOR} > .MLK__backdrop`);

const clearKeyboardViewportSpace = () => {
  if (typeof document === "undefined") return;
  if (KEYBOARD_BODY_CLASSES.some(className => document.body.classList.contains(className))) return;
  document.documentElement.style.removeProperty("--mathlive-keyboard-height");
};

const updateKeyboardViewport = () => {
  if (!activeKeyboardAnchor?.isConnected || typeof window === "undefined") return;

  const keyboard = getMathVirtualKeyboard();
  const keyboardRect = keyboard?.boundingRect;
  const backdropRect = getKeyboardBackdrop()?.getBoundingClientRect();
  const keyboardHeight = Math.ceil(Math.max(keyboardRect?.height ?? 0, backdropRect?.height ?? 0));

  if (keyboardHeight <= 0) return;

  document.documentElement.style.setProperty("--mathlive-keyboard-height", `${keyboardHeight}px`);

  const scrollContainer = activeKeyboardAnchor.closest<HTMLElement>(".app-scroll-container");
  if (!scrollContainer) return;

  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  const keyboardTop =
    backdropRect && backdropRect.top > 0 && backdropRect.top < viewportHeight
      ? backdropRect.top
      : viewportHeight - keyboardHeight;
  const containerRect = scrollContainer.getBoundingClientRect();
  const anchorRect = activeKeyboardAnchor.getBoundingClientRect();
  const visibleBottom = Math.min(containerRect.bottom, keyboardTop) - 16;
  const hiddenAmount = anchorRect.bottom - visibleBottom;

  if (hiddenAmount > 0) {
    scrollContainer.scrollBy({ top: hiddenAmount + 12, behavior: "smooth" });
  }
};

const scheduleKeyboardViewportUpdate = () => {
  requestAnimationFrame(updateKeyboardViewport);
  window.setTimeout(updateKeyboardViewport, 120);
  window.setTimeout(updateKeyboardViewport, 300);
  window.setTimeout(updateKeyboardViewport, 520);
};

const handleKeyboardGeometryChange = () => {
  if (!activeKeyboardBodyClass) return;

  const keyboard = getMathVirtualKeyboard();
  if (keyboard?.visible) {
    document.body.classList.add(activeKeyboardBodyClass);
    scheduleKeyboardViewportUpdate();
    return;
  }

  document.body.classList.remove(activeKeyboardBodyClass);
  clearKeyboardViewportSpace();
};

const observeMathVirtualKeyboard = () => {
  const keyboard = getMathVirtualKeyboard();
  if (!keyboard || observedKeyboard === keyboard) return;

  observedKeyboard?.removeEventListener("geometrychange", handleKeyboardGeometryChange);
  observedKeyboard?.removeEventListener("virtual-keyboard-toggle", handleKeyboardGeometryChange);
  keyboard.addEventListener("geometrychange", handleKeyboardGeometryChange);
  keyboard.addEventListener("virtual-keyboard-toggle", handleKeyboardGeometryChange);
  observedKeyboard = keyboard;
};

export const isMathVirtualKeyboardOpen = (bodyClass: string) => {
  if (typeof document === "undefined") return false;

  return Boolean(
    document.body.classList.contains(bodyClass) ||
    getMathVirtualKeyboard()?.visible ||
    document.querySelector(`${KEYBOARD_SELECTOR}.is-visible`),
  );
};

export const isActiveMathVirtualKeyboardViewport = (
  bodyClass: string,
  anchor: HTMLElement | null,
) => Boolean(anchor && activeKeyboardBodyClass === bodyClass && activeKeyboardAnchor === anchor);

export const isInteractiveControlEvent = (event: Event) =>
  event
    .composedPath()
    .some(
      target =>
        target instanceof Element &&
        target.matches('button, a[href], input, select, textarea, [role="button"], [role="link"]'),
    );

export const activateMathVirtualKeyboardViewport = (bodyClass: string, anchor: HTMLElement) => {
  if (typeof document === "undefined") return;

  if (activeKeyboardBodyClass && activeKeyboardBodyClass !== bodyClass) {
    document.body.classList.remove(activeKeyboardBodyClass);
  }

  activeKeyboardAnchor = anchor;
  activeKeyboardBodyClass = bodyClass;
  document.body.classList.add(bodyClass);
  observeMathVirtualKeyboard();
  scheduleKeyboardViewportUpdate();
};

export const deactivateMathVirtualKeyboardViewport = (
  bodyClass: string,
  anchor?: HTMLElement | null,
) => {
  if (typeof document === "undefined") return;
  if (activeKeyboardAnchor && anchor !== activeKeyboardAnchor) return;

  document.body.classList.remove(bodyClass);
  if (activeKeyboardBodyClass === bodyClass) {
    activeKeyboardAnchor = null;
    activeKeyboardBodyClass = null;
  }
  clearKeyboardViewportSpace();
};

const getPromptEntries = (mfe: MathfieldElement) =>
  mfe
    .getPrompts()
    .map(id => ({ id, range: mfe.getPromptRange(id) }))
    .filter((entry): entry is { id: string; range: Range } => Boolean(entry.range));

const rangeIsInside = (range: Range, parentRange: Range) => {
  const start = Math.min(range[0], range[1]);
  const end = Math.max(range[0], range[1]);
  const parentStart = Math.min(parentRange[0], parentRange[1]);
  const parentEnd = Math.max(parentRange[0], parentRange[1]);

  return start >= parentStart && end <= parentEnd;
};

const offsetIsInsideRange = (offset: number, range: Range) => {
  const start = Math.min(range[0], range[1]);
  const end = Math.max(range[0], range[1]);

  return offset >= start && offset <= end;
};

const offsetDistanceToRange = (offset: number, range: Range) => {
  const start = Math.min(range[0], range[1]);
  const end = Math.max(range[0], range[1]);

  if (offset < start) return start - offset;
  if (offset > end) return offset - end;
  return 0;
};

export const collectPromptValues = (mfe: MathfieldElement) =>
  mfe.getPrompts().reduce(
    (acc, id) => {
      acc[id] = mfe.getPromptValue(id);
      return acc;
    },
    {} as Record<string, string>,
  );

export const applyPromptOnlyMode = (mfe: MathfieldElement, readOnly?: boolean) => {
  mfe.readOnly = mfe.getPrompts().length > 0 || (readOnly ?? false);
};

export const setSafeMathFieldClassName = (mfe: MathfieldElement, className?: string) => {
  mfe.className = [SAFE_MATHFIELD_CLASS, className].filter(Boolean).join(" ");
};

export const isSelectionInsidePrompt = (mfe: MathfieldElement) => {
  const prompts = getPromptEntries(mfe);
  if (prompts.length === 0) return true;

  const selection = mfe.selection as Selection | undefined;
  const ranges = selection?.ranges?.length
    ? selection.ranges
    : ([[mfe.position, mfe.position]] as Range[]);

  return ranges.every(range => prompts.some(prompt => rangeIsInside(range, prompt.range)));
};

export const getSelectedPromptId = (mfe: MathfieldElement) => {
  const prompts = getPromptEntries(mfe);
  if (prompts.length === 0) return undefined;

  const selection = mfe.selection as Selection | undefined;
  const ranges = selection?.ranges?.length
    ? selection.ranges
    : ([[mfe.position, mfe.position]] as Range[]);

  return prompts.find(prompt => ranges.every(range => rangeIsInside(range, prompt.range)))?.id;
};

export const focusEditablePrompt = (mfe: MathfieldElement, preferredId?: string) => {
  const prompts = getPromptEntries(mfe);
  if (prompts.length === 0) return false;

  const prompt =
    prompts.find(entry => entry.id === preferredId) ||
    prompts.find(entry => mfe.getPromptValue(entry.id).trim() === "") ||
    prompts[0];

  const caretPosition = Math.max(prompt.range[0], prompt.range[1]);

  mfe.focus();
  mfe.selection = { ranges: [[caretPosition, caretPosition]], direction: "none" };
  return true;
};

export const getPromptIdFromPoint = (mfe: MathfieldElement, x: number, y: number) => {
  const prompts = getPromptEntries(mfe);
  if (prompts.length === 0) return undefined;

  try {
    const offset = Number(mfe.getOffsetFromPoint(x, y, { bias: 0 }));
    const exactPrompt = prompts.find(prompt => offsetIsInsideRange(offset, prompt.range));

    if (exactPrompt) return exactPrompt.id;

    const nearestPrompt = prompts
      .map(prompt => ({
        id: prompt.id,
        distance: offsetDistanceToRange(offset, prompt.range),
      }))
      .sort((a, b) => a.distance - b.distance)[0];

    return nearestPrompt?.distance <= 1 ? nearestPrompt.id : undefined;
  } catch {
    return undefined;
  }
};

export const getPromptIdFromPointerEvent = (mfe: MathfieldElement, event: PointerEvent) => {
  if (!mfe.shadowRoot) return undefined;

  const promptIds = mfe.getPrompts();
  const renderedPrompts = Array.from(
    mfe.shadowRoot.querySelectorAll<HTMLElement>(".ML__prompt-atom"),
  );
  if (promptIds.length === 0 || renderedPrompts.length !== promptIds.length) return undefined;

  const x = event.clientX;
  const y = event.clientY;
  const candidates = renderedPrompts.map((element, index) => {
    const rect = element.getBoundingClientRect();
    const horizontalDistance = x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0;
    const verticalDistance = y < rect.top ? rect.top - y : y > rect.bottom ? y - rect.bottom : 0;
    const centerDistance = Math.hypot(
      x - (rect.left + rect.right) / 2,
      y - (rect.top + rect.bottom) / 2,
    );

    return {
      id: promptIds[index],
      distance: Math.hypot(horizontalDistance, verticalDistance),
      centerDistance,
    };
  });

  const nearestPrompt = candidates.sort(
    (left, right) => left.distance - right.distance || left.centerDistance - right.centerDistance,
  )[0];

  if (nearestPrompt?.distance <= 18) return nearestPrompt.id;

  const clickedPrompt = event.composedPath().find((target): target is HTMLElement => {
    if (!(target instanceof HTMLElement)) return false;
    return target.classList.contains("ML__prompt-atom");
  });
  const clickedIndex = clickedPrompt ? renderedPrompts.indexOf(clickedPrompt) : -1;

  return clickedIndex >= 0 ? promptIds[clickedIndex] : undefined;
};

export const keepSelectionInsidePrompt = (mfe: MathfieldElement, preferredId?: string) => {
  if (mfe.getPrompts().length === 0 || isSelectionInsidePrompt(mfe)) return false;
  return focusEditablePrompt(mfe, preferredId);
};

export const openMathVirtualKeyboard = (mfe: MathfieldElement) => {
  mfe.focus();
  mfe.executeCommand("showVirtualKeyboard");

  const mathVirtualKeyboard = (
    window as Window & {
      mathVirtualKeyboard?: VirtualKeyboardInterface;
    }
  ).mathVirtualKeyboard;

  mathVirtualKeyboard?.show?.({ animate: true });
};

export const revealActivePrompt = (mfe: MathfieldElement) => {
  requestAnimationFrame(() => {
    mfe.executeCommand("scrollIntoView");
    mfe.scrollIntoView({ block: "nearest", inline: "nearest" });
  });
};

export const activatePromptInput = (mfe: MathfieldElement, preferredId?: string) => {
  if (preferredId) {
    focusEditablePrompt(mfe, preferredId);
  } else if (!isSelectionInsidePrompt(mfe)) {
    focusEditablePrompt(mfe);
  } else {
    mfe.focus();
  }

  openMathVirtualKeyboard(mfe);
  revealActivePrompt(mfe);
};
