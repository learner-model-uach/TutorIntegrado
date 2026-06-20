import {
  Box,
  Input,
  Heading,
  Field,
  Text,
  Badge,
  Textarea,
  Accordion,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { EditButton } from "./EditButton";
import { SaveButton } from "./SaveButton";

/**
 * Editor de pregunta para ejercicios wordProblem.
 * Cada pregunta (Question) tiene: question, steps[].
 * Cada step tiene: stepTitle, correctMsg, hints[],
 * componentToAnswer (mathComponent | selectionComponent | graphComponent).
 */

function EditableWPStep({ step, stepIndex, onSave }) {
  const safeStep = step ?? {};
  const [localCopy, setLocalCopy] = useState({ ...safeStep });
  const [isEditingBase, setIsEditingBase] = useState(false);
  const [isEditingComponent, setIsEditingComponent] = useState(false);
  const [isEditingHints, setIsEditingHints] = useState(false);

  const formBg = "gray.300";
  const componentType = safeStep.componentToAnswer?.nameComponent ?? "—";

  useEffect(() => {
    setLocalCopy({ ...safeStep });
  }, [step]);

  const handleField = (field, value) => {
    setLocalCopy(prev => ({ ...prev, [field]: value }));
  };

  const handleHint = (i, field, value) => {
    const updated = [...(localCopy.hints ?? [])];
    updated[i] = { ...updated[i], [field]: value };
    setLocalCopy(prev => ({ ...prev, hints: updated }));
  };

  // Editar campos de componentToAnswer.meta según tipo
  const handleMeta = (field, value) => {
    setLocalCopy(prev => ({
      ...prev,
      componentToAnswer: {
        ...prev.componentToAnswer,
        meta: { ...prev.componentToAnswer?.meta, [field]: value },
      },
    }));
  };

  const handleMetaAnswer = (i, field, value) => {
    const updated = [...(localCopy.componentToAnswer?.meta?.answers ?? [])];
    updated[i] = { ...updated[i], [field]: value };
    handleMeta("answers", updated);
  };

  return (
    <Box borderWidth="1px" borderColor="gray.200" borderRadius="md" p={3} mb={3}>
      <Text fontWeight="bold" fontSize="sm" mb={2}>
        Paso {stepIndex + 1}
        <Badge ml={2} colorPalette="teal" fontSize="xs">{componentType}</Badge>
      </Text>

      {/* Editar campos base */}
      <EditButton
        width="full"
        isEditing={isEditingBase}
        onClick={() => {
          if (isEditingBase) setLocalCopy({ ...safeStep });
          setIsEditingBase(!isEditingBase);
        }}
        editText="Editar título y mensaje"
      />
      {isEditingBase && (
        <Box>
          <SaveButton width="full" onSave={() => { onSave(localCopy); setIsEditingBase(false); }} />
          <Box bg={formBg} borderRadius="md" p={3} mt={2}>
            <Field.Root mb={3}>
              <Field.Label>Título del paso</Field.Label>
              <Input
                value={localCopy.stepTitle || ""}
                onChange={e => handleField("stepTitle", e.target.value)}
                placeholder="Título"
              />
            </Field.Root>
            <Field.Root mb={3}>
              <Field.Label>Mensaje correcto</Field.Label>
              <Input
                value={localCopy.correctMsg || ""}
                onChange={e => handleField("correctMsg", e.target.value)}
                placeholder="Mensaje correcto"
              />
            </Field.Root>
            {localCopy.stepExplanation !== undefined && (
              <Field.Root>
                <Field.Label>Explicación del paso</Field.Label>
                <Textarea
                  value={localCopy.stepExplanation?.explanation || ""}
                  onChange={e =>
                    handleField("stepExplanation", {
                      ...localCopy.stepExplanation,
                      explanation: e.target.value,
                    })
                  }
                  placeholder="Explicación"
                />
              </Field.Root>
            )}
          </Box>
        </Box>
      )}

      {/* Editar componentToAnswer según tipo */}
      <EditButton
        width="full"
        isEditing={isEditingComponent}
        onClick={() => {
          if (isEditingComponent) setLocalCopy({ ...safeStep });
          setIsEditingComponent(!isEditingComponent);
        }}
        editText={`Editar componente (${componentType})`}
        mt={2}
      />
      {isEditingComponent && (
        <Box>
          <SaveButton width="full" onSave={() => { onSave(localCopy); setIsEditingComponent(false); }} />
          <Box bg={formBg} borderRadius="md" p={3} mt={2}>

            {/* mathComponent: expression + answers[] */}
            {componentType === "mathComponent" && (
              <>
                <Field.Root mb={3}>
                  <Field.Label>Expresión (LaTeX)</Field.Label>
                  <Input
                    value={localCopy.componentToAnswer?.meta?.expression || ""}
                    onChange={e => handleMeta("expression", e.target.value)}
                    placeholder="Expresión matemática"
                  />
                </Field.Root>
                <Text fontSize="sm" color="gray.600" mb={2}>
                  idCorrectAnswers: {JSON.stringify(localCopy.componentToAnswer?.meta?.idCorrectAnswers)}
                </Text>
                <Field.Root mb={3}>
                  <Field.Label>idCorrectAnswers (JSON)</Field.Label>
                  <Input
                    value={JSON.stringify(localCopy.componentToAnswer?.meta?.idCorrectAnswers ?? [])}
                    onChange={e => {
                      try { handleMeta("idCorrectAnswers", JSON.parse(e.target.value)); }
                      catch { handleMeta("idCorrectAnswers", e.target.value); }
                    }}
                    placeholder="[0] o [0, 1]"
                  />
                </Field.Root>
                {(localCopy.componentToAnswer?.meta?.answers ?? []).map((ans, i) => (
                  <Box key={i} mb={3} p={2} bg="white" borderRadius="md">
                    <Text fontSize="xs" color="gray.500" mb={1}>Respuesta {i + 1} — id: {ans.id}</Text>
                    <Field.Root mb={2}>
                      <Field.Label>placeholderId</Field.Label>
                      <Input
                        value={ans.placeholderId || ""}
                        onChange={e => handleMetaAnswer(i, "placeholderId", e.target.value)}
                        placeholder="placeholder"
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>value</Field.Label>
                      <Input
                        value={ans.value || ""}
                        onChange={e => handleMetaAnswer(i, "value", e.target.value)}
                        placeholder="Valor correcto"
                      />
                    </Field.Root>
                  </Box>
                ))}
              </>
            )}

            {/* selectionComponent: answers[] + idCorrectAnswers */}
            {componentType === "selectionComponent" && (
              <>
                <Text fontSize="sm" color="gray.600" mb={2}>
                  idCorrectAnswers: {JSON.stringify(localCopy.componentToAnswer?.meta?.idCorrectAnswers)}
                </Text>
                <Field.Root mb={3}>
                  <Field.Label>idCorrectAnswers</Field.Label>
                  <Input
                    value={String(localCopy.componentToAnswer?.meta?.idCorrectAnswers ?? "")}
                    onChange={e => {
                      const v = Number(e.target.value);
                      handleMeta("idCorrectAnswers", isNaN(v) ? e.target.value : v);
                    }}
                    placeholder="id de la respuesta correcta"
                  />
                </Field.Root>
                {(localCopy.componentToAnswer?.meta?.answers ?? []).map((ans, i) => (
                  <Box key={i} mb={3} p={2} bg="white" borderRadius="md">
                    <Text fontSize="xs" color="gray.500" mb={1}>Opción {i + 1} — id: {ans.id}</Text>
                    <Field.Root>
                      <Field.Label>value</Field.Label>
                      <Input
                        value={ans.value || ""}
                        onChange={e => handleMetaAnswer(i, "value", e.target.value)}
                        placeholder="Texto de la opción"
                      />
                    </Field.Root>
                  </Box>
                ))}
              </>
            )}

            {/* graphComponent: solo informativo por ahora */}
            {componentType === "graphComponent" && (
              <Box p={3} bg="orange.50" borderRadius="md">
                <Text color="orange.700" fontSize="sm" fontWeight="bold">
                  Editor de graphComponent no disponible aún
                </Text>
                <Text color="orange.600" fontSize="xs" mt={1}>
                  La edición de componentes gráficos requiere herramientas especializadas.
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Editar pistas */}
      <EditButton
        width="full"
        isEditing={isEditingHints}
        onClick={() => {
          if (isEditingHints) setLocalCopy({ ...safeStep });
          setIsEditingHints(!isEditingHints);
        }}
        editText="Editar pistas"
        mt={2}
      />
      {isEditingHints && localCopy?.hints?.length > 0 && (
        <Box>
          <SaveButton width="full" onSave={() => { onSave(localCopy); setIsEditingHints(false); }} />
          <Box bg={formBg} borderRadius="md" p={3} mt={2}>
            {localCopy.hints.map((hint, i) => (
              <Field.Root key={i} mb={3}>
                <Field.Label>Pista {i + 1}</Field.Label>
                <Input
                  value={hint.hint || ""}
                  onChange={e => handleHint(i, "hint", e.target.value)}
                  placeholder={`Pista ${i + 1}`}
                />
              </Field.Root>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default function EditableWPQuestion({
  question,
  questionIndex,
  setQuestions,
}) {
  const safeQ = question ?? {};
  const [localQ, setLocalQ] = useState({ ...safeQ });
  const [localQCopy, setLocalQCopy] = useState({ ...safeQ });
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);

  const formBg = "gray.300";

  useEffect(() => {
    const safe = question ?? {};
    setLocalQ({ ...safe });
    setLocalQCopy({ ...safe });
  }, [question]);

  const applyChanges = updated => {
    setLocalQ(updated);
    setQuestions(updated);
  };

  const handleStepSave = (stepIndex, updatedStep) => {
    const updatedSteps = [...(localQ.steps ?? [])];
    updatedSteps[stepIndex] = updatedStep;
    const updated = { ...localQ, steps: updatedSteps };
    setLocalQ(updated);
    setQuestions(updated);
  };

  return (
    <Box borderWidth="2px" borderColor={formBg} borderRadius="lg" p={4} mb={4}>
      <Heading as="h2" textAlign="center" mb={4} fontSize="lg">
        Pregunta {questionIndex + 1}
      </Heading>

      {/* Vista previa */}
      <Box mb={4} p={3} bg="gray.50" borderRadius="md">
        <Text fontSize="sm" color="gray.500" mb={1}>Pregunta actual:</Text>
        <Text fontWeight="bold">{localQ.question || "—"}</Text>
      </Box>

      {/* Editar texto de la pregunta */}
      <EditButton
        width="full"
        isEditing={isEditingQuestion}
        onClick={() => {
          if (isEditingQuestion) setLocalQCopy({ ...localQ });
          setIsEditingQuestion(!isEditingQuestion);
        }}
        editText="Editar pregunta"
      />
      {isEditingQuestion && (
        <Box>
          <SaveButton
            width="full"
            onSave={() => {
              applyChanges(localQCopy);
              setIsEditingQuestion(false);
            }}
          />
          <Box bg={formBg} borderRadius="md" p={4} mt={2}>
            <Field.Root mb={3}>
              <Field.Label>Texto de la pregunta</Field.Label>
              <Textarea
                value={localQCopy.question || ""}
                onChange={e => setLocalQCopy(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Texto de la pregunta (LaTeX permitido)"
              />
            </Field.Root>
            {localQCopy.quesExplanation !== undefined && (
              <Field.Root>
                <Field.Label>Explicación de la pregunta</Field.Label>
                <Textarea
                  value={localQCopy.quesExplanation || ""}
                  onChange={e =>
                    setLocalQCopy(prev => ({ ...prev, quesExplanation: e.target.value }))
                  }
                  placeholder="Explicación (opcional)"
                />
              </Field.Root>
            )}
          </Box>
        </Box>
      )}

      {/* Pasos de la pregunta */}
      <Box mt={4}>
        <Text fontWeight="bold" fontSize="sm" mb={3} color="gray.600">
          Pasos ({localQ.steps?.length ?? 0})
        </Text>
        {(localQ.steps ?? []).map((step, stepIndex) => (
          <EditableWPStep
            key={stepIndex}
            step={step}
            stepIndex={stepIndex}
            onSave={updatedStep => handleStepSave(stepIndex, updatedStep)}
          />
        ))}
      </Box>
    </Box>
  );
}