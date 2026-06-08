import type { MathfieldElement, Range, Selection, VirtualKeyboardInterface } from "mathlive";

export const SAFE_MATHFIELD_CLASS = "safe-math-field";

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

export const focusEditablePrompt = (mfe: MathfieldElement, preferredId?: string) => {
  const prompts = getPromptEntries(mfe);
  if (prompts.length === 0) return false;

  const prompt =
    prompts.find(entry => entry.id === preferredId) ||
    prompts.find(entry => mfe.getPromptValue(entry.id).trim() === "") ||
    prompts[0];

  mfe.focus();
  mfe.selection = { ranges: [prompt.range], direction: "none" };
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

export const keepSelectionInsidePrompt = (mfe: MathfieldElement) => {
  if (mfe.getPrompts().length === 0 || isSelectionInsidePrompt(mfe)) return false;
  return focusEditablePrompt(mfe);
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
