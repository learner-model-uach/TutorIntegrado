import React from "react";
import { Alert, Box, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { MathComponent } from "../../MathJax";
import RatingQuestion from "../../RatingQuestion";

const texValue = value => String.raw`${value ?? ""}`;

const SummaryText = ({ children, ...props }) => (
  <Text
    w="100%"
    maxW="100%"
    minW={0}
    lineHeight="1.6"
    whiteSpace="normal"
    overflowWrap="anywhere"
    wordBreak="normal"
    {...props}
  >
    {children}
  </Text>
);

const MathLine = ({ tex }) => (
  <Box w="100%" maxW="100%" minW={0} overflowX="auto" overflowY="hidden" py="1">
    <Box w="max-content" mx="auto">
      <MathComponent tex={texValue(tex)} display={false} />
    </Box>
  </Box>
);

const LabeledMathLine = ({ label, tex }) => (
  <Box w="100%" maxW="100%" minW={0}>
    <SummaryText fontWeight="semibold">{label}</SummaryText>
    <MathLine tex={tex} />
  </Box>
);

const FormGrid = ({ children }) => (
  <SimpleGrid columns={{ base: 1, md: 2 }} gap="3" w="100%" maxW="100%" minW={0}>
    {children}
  </SimpleGrid>
);

const SummaryShell = ({ children }) => (
  <Box w="100%" maxW="100%" minW={0}>
    <Alert.Root
      status="info"
      alignItems="stretch"
      w="100%"
      maxW="100%"
      minW={0}
      overflow="hidden"
      px={{ base: "4", md: "5" }}
      py="4"
      className="factorization-summary"
    >
      <Alert.Content w="100%" maxW="100%" minW={0}>
        <VStack align="stretch" gap="3" w="100%" maxW="100%" minW={0}>
          <Heading w="100%" fontSize="xl" textAlign="center">
            Resumen
          </Heading>
          {children}
        </VStack>
      </Alert.Content>
    </Alert.Root>
    <RatingQuestion />
  </Box>
);

const ExpressionLine = ({ tex }) => (
  <Box w="100%" maxW="100%" minW={0}>
    <SummaryText fontWeight="semibold">{"Expresi\u00f3n:"}</SummaryText>
    <MathLine tex={tex} />
  </Box>
);

export const FCsummary = ({ exercise }) => {
  return (
    <SummaryShell>
      <ExpressionLine tex={exercise.expression} />
      <SummaryText>{exercise.summary}</SummaryText>
      <MathLine tex={`(${exercise.answers[0].answer})${exercise.displayResult}`} />
    </SummaryShell>
  );
};

export const FCCsummary = ({ exercise }) => {
  return (
    <SummaryShell>
      <ExpressionLine tex={exercise.steps[0].expression} />
      <SummaryText>{exercise.steps[0].summary}</SummaryText>

      {exercise.steps.length > 3 ? (
        <FormGrid>
          <LabeledMathLine label="Forma 1:" tex={exercise.steps[1].expression} />
          <LabeledMathLine label="Forma 2:" tex={exercise.steps[2].expression} />
        </FormGrid>
      ) : (
        <MathLine tex={exercise.steps[1].expression} />
      )}

      <SummaryText>{exercise.steps[1].summary}</SummaryText>

      {exercise.steps.length > 3 ? (
        <FormGrid>
          <LabeledMathLine label="Forma 1:" tex={exercise.steps[3].expression} />
          <LabeledMathLine label="Forma 2:" tex={exercise.steps[4].expression} />
        </FormGrid>
      ) : (
        <MathLine tex={exercise.steps[2].expression} />
      )}

      {exercise.steps.length > 3 ? (
        <>
          <SummaryText>{exercise.steps[4].summary}</SummaryText>
          <FormGrid>
            <LabeledMathLine
              label="Forma 1:"
              tex={`(${exercise.steps[3].answers[0].answer})${exercise.steps[3].displayResult}`}
            />
            <LabeledMathLine
              label="Forma 2:"
              tex={`(${exercise.steps[4].answers[0].answer})${exercise.steps[4].displayResult}`}
            />
          </FormGrid>
        </>
      ) : (
        <>
          <SummaryText>{exercise.steps[2].summary}</SummaryText>
          <MathLine
            tex={`(${exercise.steps[2].answers[0].answer})${exercise.steps[2].displayResult}`}
          />
        </>
      )}
    </SummaryShell>
  );
};

export const DCsummary = ({ exercise }) => {
  return (
    <SummaryShell>
      <ExpressionLine tex={exercise.steps[0].expression} />
      <SummaryText>{exercise.steps[0].summary}</SummaryText>

      <FormGrid>
        <LabeledMathLine label="Forma 1:" tex={exercise.steps[1].displayResult} />
        <LabeledMathLine label="Forma 2:" tex={exercise.steps[2].displayResult} />
        <LabeledMathLine label="Forma 3:" tex={exercise.steps[3].displayResult} />
        <LabeledMathLine label="Forma 4:" tex={exercise.steps[4].displayResult} />
      </FormGrid>

      <SummaryText>{exercise.steps[1].summary}</SummaryText>

      <FormGrid>
        <LabeledMathLine
          label="Forma 1:"
          tex={`(${exercise.steps[1].answers[0].answer[0]})(${exercise.steps[1].answers[0].answer[1]})`}
        />
        <LabeledMathLine
          label="Forma 2:"
          tex={`(${exercise.steps[2].answers[0].answer[0]})(${exercise.steps[2].answers[0].answer[1]})`}
        />
        <LabeledMathLine
          label="Forma 3:"
          tex={`(${exercise.steps[3].answers[0].answer[0]})(${exercise.steps[3].answers[0].answer[1]})`}
        />
        <LabeledMathLine
          label="Forma 4:"
          tex={`(${exercise.steps[4].answers[0].answer[0]})(${exercise.steps[4].answers[0].answer[1]})`}
        />
      </FormGrid>
    </SummaryShell>
  );
};

export const DSCsummary = ({ step1, step2 }) => {
  return (
    <SummaryShell>
      <ExpressionLine tex={step1.expression} />
      <SummaryText>{step1.summary}</SummaryText>
      <MathLine tex={step1.displayResult} />
      <SummaryText>{step2.summary}</SummaryText>
      <MathLine tex={step2.displayResult} />
    </SummaryShell>
  );
};

export const TCsummary = ({ step1, step2, step3, step4, step5 }) => {
  return (
    <SummaryShell>
      <ExpressionLine tex={step1.expression} />
      <SummaryText>{step1.summary}</SummaryText>
      <MathLine tex={step1.displayResult} />
      <SummaryText>{step2.summary}</SummaryText>
      <MathLine tex={step2.displayResult} />
      <SummaryText>{step3.summary}</SummaryText>
      <SummaryText fontWeight="semibold">{step3.displayResult}</SummaryText>
      {step4 && (
        <>
          <SummaryText>{step4.summary}</SummaryText>
          <MathLine tex={step4.displayResult} />
          <SummaryText>{step5.summary}</SummaryText>
          <MathLine tex={step5.displayResult} />
        </>
      )}
    </SummaryShell>
  );
};
