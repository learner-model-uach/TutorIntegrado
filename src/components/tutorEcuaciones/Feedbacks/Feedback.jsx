import React from "react";
import { Text, Container, Stack, Flex, Box } from "@chakra-ui/react";
import TeX from "@matejmazur/react-katex";

// Warning: If the text is modified or another feedback is created, care must
// be taken with the width of the message, since if it is too wide it leaves
// the Container component and does not render well, it is recommended to use
// \\\\ (line break) to shorten the width of the text and border="1px" borderColor="red.200"
//  in the Container component to verify that the text does not spill out of
// the Container component.

// Do not forget to shrink or enlarge the screen, to verify that the text
// does not spill out the Container component.

export const Feedback = ({ type }) => {
  const FeedbackNotFound = () => (
    <>
      <Text fontSize={{ base: "8.4px", sm: "12px", lg: "15px" }}>Feedback no encontrado</Text>
    </>
  );

  const FeedbackQuadraticSystem = () => (
    <Stack maxWidth="100%">
      <Text fontSize={{ base: "8.4px", sm: "12px", lg: "15px" }}>
        <Box>
          <TeX
            math={
              "\\text{Recuerda que para resolver una ecuación cuadrática en }\\R , \\text{ cuya forma es:} "
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
        <TeX math={"\\text{Se utiliza la formúla general:}"} />

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
          math={"S = \\Big \\{\\frac {-b }{2a} \\Big \\}  , si \\hspace{0.2cm}  b²-4ac = 0  "}
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
  );

  const FeedbackSystemOfLinearEquations = () => (
    <>
      <Text fontSize={{ base: "8.4px", sm: "12px", lg: "15px" }}>
        <Box>
          <TeX
            math={
              "\\text{Recuerda que para resolver un sistema de 2 ecuaciones lineales en }\\\\ \\R, \\text{ cuya forma es:} "
            }
            as="figcaption"
          />
        </Box>
      </Text>

      <Stack fontSize={{ base: "8.4px", sm: "12px", lg: "15px" }}>
        <TeX math={"ax + by = e"} as="figcaption" style={{ textAlign: "center" }} />
        <TeX math={"cx + dy = f"} as="figcaption" style={{ textAlign: "center" }} />

        <TeX
          math={
            "\\text{donde } a, b, c, d, e, f \\in \\R \\text{ son constantes, x e y son las incognitas.}"
          }
          as="figcaption"
        />

        <TeX
          math={
            "\\text{Si } ad-bc \\neq 0, \\text{entonces el sistema tiene solución única y se} \\\\ \\text{pueden utilizar los siguientes métodos: }"
          }
          as="figcaption"
        />
        <TeX
          math={
            "\\text{Sustitución: se despeja una variable de una de las ecuaciones y se} \\\\ \\text{reemplaza en la otra.}"
          }
          as="figcaption"
        />
        <TeX
          math={
            "\\text{Reducción: se multiplica una o ambas ecuaciones de modo que al} \\\\ \\text{sumarlas algebraicamente se obtenga una ecuación con una incógnita.}"
          }
          as="figcaption"
        />
        <TeX
          math={
            "\\text{Gráfico: se grafican las rectas definidas por cada ecuación y se procede} \\\\ \\text{a encontrar el punto de intersección de ellas.}"
          }
          as="figcaption"
        />
        <TeX
          math={
            "\\text{Si ad-bc = 0, entonces el sistema no tiene solución o tiene infinitas} \\\\ \\text{soluciones.}"
          }
          as="figcaption"
        />
      </Stack>
    </>
  );

  const FeedbackLinearEquation = () => (
    <>
      <Stack maxWidth="100%">
        <Text fontSize={{ base: "8.4px", sm: "12px", lg: "15px" }}>
          <Box>
            <TeX
              math={
                "\\text{Recuerda que para resolver una ecuación lineal en } \\R , \\text{ cuya forma es:} "
              }
              as="figcaption"
            />
          </Box>
        </Text>

        <Stack fontSize={{ base: "8.4px", sm: "12px", lg: "15px" }}>
          <TeX
            math={"ax+b=0 \\enspace , \\enspace a,b \\in \\R \\enspace \\wedge \\enspace a \\neq 0"}
            as="figcaption"
            style={{ textAlign: "center" }}
          />
          <TeX math={"\\text{Se resuelve utilizando la siguiente fórmula:}"} />

          <TeX math={"x = \\frac{-b}{a}"} as="figcaption" style={{ textAlign: "center" }} />
        </Stack>
      </Stack>
    </>
  );

  return (
    <Container
      style={{ justifyContent: "center", margin: "auto", display: "flex", maxWidth: "100%" }}
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
        {type === "ecc5s" ? (
          <FeedbackQuadraticSystem />
        ) : type === "secl5s" ? (
          <FeedbackSystemOfLinearEquations />
        ) : type === "ecl2s" ? (
          <FeedbackLinearEquation />
        ) : (
          <FeedbackNotFound />
        )}
      </Stack>
    </Container>
  );
};
