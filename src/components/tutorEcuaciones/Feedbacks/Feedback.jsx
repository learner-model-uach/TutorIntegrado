import React from "react";
import { Text, Container, Stack, Flex, Box } from "@chakra-ui/react";
import TeX from "@matejmazur/react-katex";
export const Feedback = () => {
  return (
    <Container
      style={{ justifyContent: "center", margin: "auto", display: "flex" }}
    >
      <Stack>
        <Flex
          textAlign="center"
          justifyContent="center"
          fontSize={{ base: "11px", sm: "13px", lg: "16px" }}
        >
          <TeX
            style={{
              textAlign: "center",
              padding: "7px",
            }}
            math={"\\text{Felicidades has resuelto correctamente el ejercicio}"}
          />
        </Flex>
        <Text fontSize={{ base: "8.4px", sm: "12px", lg: "15px" }}>
          <Box>
            <TeX
              math={
                "\\text{Recuerda que para resolver una ecuación cuadrática en }\\R , \\text{ cuya forma es} "
              }
              as="figcaption"
            />
          </Box>
        </Text>

        <Stack fontSize={{ base: "8.4px", sm: "12px", lg: "15px" }}>
          <TeX
            math={
              "ax²+-bx+c=0 \\enspace , \\enspace a,b,c \\in \\R \\enspace \\wedge \\enspace a \\neq 0"
            }
            as="figcaption"
            style={{ textAlign: "center" }}
          />
          <TeX math={"\\text{Se utiliza la formúla general}"} />

          <TeX
            math={"x = \\frac {-b \\pm \\sqrt {b^2 - 4ac}}{2a}"}
            as="figcaption"
            style={{ textAlign: "center" }}
          />
          <TeX math={"\\text{Así el conjunto de solucion se define como:}"} />
          <TeX
            math={
              "S = \\Big \\{\\frac {-b - \\sqrt {b^2 - 4ac}}{2a},\\frac {-b + \\sqrt {b^2 - 4ac}}{2a} \\Big \\}  , si \\hspace{0.2cm}  b²-4ac > 0  "
            }
            as="figcaption"
            style={{ alignItems: "center" }}
          />
          <TeX
            math={
              "S = \\Big \\{\\frac {-b }{2a} \\Big \\}  , si \\hspace{0.2cm}  b²-4ac = 0  "
            }
            as="figcaption"
            style={{ alignItems: "center" }}
          />
          <TeX
            math={"S = \\emptyset  , si \\hspace{0.2cm}  b²-4ac < 0  "}
            as="figcaption"
            style={{ alignItems: "center" }}
          />
        </Stack>
      </Stack>
    </Container>
  );
};
