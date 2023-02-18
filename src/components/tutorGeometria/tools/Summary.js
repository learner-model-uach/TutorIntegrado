import React from "react";
import { Alert, Wrap, Heading, Spacer, Text, Box } from "@chakra-ui/react";
import { MathComponent } from "../../MathJax";

export const Summary4 = ({ expression, step1, step2, step3, step4 }) => {
  return (
    <Box>
      <Alert status="info">
        <Wrap>
          <Heading w="100%" fontSize="xl" align="center">
            Resumen
          </Heading>
          <Text w="100%" />
          {expression}
          <Text w="100%" />
          <Text w="100%">{step1.summary}</Text>
          <MathComponent tex={String.raw`${step1.displayResult}`} display={false} />
          <Text w="100%" />
          <Text w="100%">{step2.summary}</Text>
          <MathComponent tex={String.raw`${step2.displayResult}`} display={false} />
          <Text w="100%" />
          <Text w="100%">{step3.summary}</Text>
          <MathComponent tex={String.raw`${step3.displayResult}`} display={false} />
          <Text w="100%" />
          <Text w="100%">{step4.summary}</Text>
          <MathComponent tex={String.raw`${step4.displayResult}`} display={false} />
        </Wrap>
      </Alert>
    </Box>
  );
};

export const Summary6 = ({ expression, step1, step2, step3, step4, step5, step6 }) => {
  return (
    <Box>
      <Alert status="info">
        <Wrap>
          <Heading w="100%" fontSize="xl" align="center">
            Resumen
          </Heading>
          <Text w="100%" />
          {expression}
          <Text w="100%" />
          <Text w="100%">{step1.summary}</Text>
          <MathComponent tex={String.raw`${step1.displayResult}`} display={false} />
          <Text w="100%" />
          <Text w="100%">{step2.summary}</Text>
          <MathComponent tex={String.raw`${step2.displayResult}`} display={false} />
          <Text w="100%" />
          <Text w="100%">{step3.summary}</Text>
          <MathComponent tex={String.raw`${step3.displayResult}`} display={false} />
          <Text w="100%" />
          <Text w="100%">{step4.summary}</Text>
          <MathComponent tex={String.raw`${step4.displayResult}`} display={false} />
          <Text w="100%">{step5.summary}</Text>
          <MathComponent tex={String.raw`${step5.displayResult}`} display={false} />
          <Text w="100%">{step6.summary}</Text>
          <MathComponent tex={String.raw`${step6.displayResult}`} display={false} />
        </Wrap>
      </Alert>
    </Box>
  );
};

export const Summary3 = ({ expression, step1, step2, step3 }) => {
  return (
    <Box>
      <Alert status="info">
        <Wrap>
          <Heading w="100%" fontSize="xl" align="center">
            Resumen
          </Heading>
          <Text w="100%" />
          {expression}
          <Text w="100%" />
          <Text w="100%">{step1.summary}</Text>
          <MathComponent tex={String.raw`${step1.displayResult}`} display={false} />
          <Text w="100%" />
          <Text w="100%">{step2.summary}</Text>
          <MathComponent tex={String.raw`${step2.displayResult}`} display={false} />
          <Text w="100%" />
          <Text w="100%">{step3.summary}</Text>
          <MathComponent tex={String.raw`${step3.displayResult}`} display={false} />
        </Wrap>
      </Alert>
    </Box>
  );
};
