import { Text, Box, Accordion, Heading } from "@chakra-ui/react";
import Carousel from "../components/Carrusel";

export default function Tutorial() {
  const imagesfac = ["imgfac1.jpg", "imgfac2.jpg", "imgfac3.jpg", "imgfac4.jpg", "imgfac5.jpg"];
  const imagesecu = [
    "imgecu1.jpg",
    "imgecu2.jpg",
    "imgecu3.jpg",
    "imgecu4.jpg",
    "imgecu5.jpg",
    "imgecu6.jpg",
    "imgecu7.jpg",
  ];
  const imagesfrac = ["imgfrac1.jpg", "imgfrac2.jpg", "imgfrac3.jpg", "imgfrac4.jpg"];
  return (
    <>
      <Heading textAlign={"center"} size={"4xl"} mb="2">
        {" "}
        Sobre el Tutor
      </Heading>
      <Accordion.Root defaultValue={["0", "4"]} multiple>
        <Accordion.Item value="0">
          <h2>
            <Accordion.ItemTrigger>
              <Box as="span" flex="1" textAlign="left">
                <Text fontWeight="extrabold">¿Cómo aprendo con el tutor?</Text>
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
          </h2>
          <Accordion.ItemContent>
            <Accordion.ItemBody pb={4}>
              Accede a uno de lo tópicos del menú de la izquierda y el Tutor te presentará
              ejercicios para resolver. En cada ejercicio deberás avanzar paso a paso y el tutor te
              indicará que hacer en cada paso y corregirá tus respuestas. Además, en cada paso hay
              ayudas (hints) que se activan cuando las respuestas son incorrectas. A medida que
              completas ejercicios, el tutor escogerá ejercicios de acuerdo a tu nivel de
              aprendizaje. Existen 3 implementaciones distintas para resolver los ejercicios, las
              cuales te presentamos a continuación.
            </Accordion.ItemBody>

            <Accordion.Item value="1">
              <h2>
                <Accordion.ItemTrigger>
                  <Box as="span" flex="1" textAlign="left">
                    <Text fontWeight="extrabold">Factorización</Text>
                  </Box>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
              </h2>
              <Accordion.ItemContent>
                <Accordion.ItemBody pb={4} alignItems="center">
                  <Carousel images={imagesfac} />
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>

            <Accordion.Item value="2">
              <h2>
                <Accordion.ItemTrigger>
                  <Box as="span" flex="1" textAlign="left">
                    <Text fontWeight="extrabold">Ecuaciones Cuadráticas y Ecuaciones Lineales</Text>
                  </Box>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
              </h2>
              <Accordion.ItemContent>
                <Accordion.ItemBody pb={4}>
                  <Carousel images={imagesecu} />
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>

            <Accordion.Item value="3">
              <h2>
                <Accordion.ItemTrigger>
                  <Box as="span" flex="1" textAlign="left">
                    <Text fontWeight="extrabold">Fracción Algebraica | Potencias y Raíces</Text>
                  </Box>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
              </h2>
              <Accordion.ItemContent>
                <Accordion.ItemBody pb={4}>
                  <Carousel images={imagesfrac} />
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>

            <Accordion.Item value="4">
              <h2>
                <Accordion.ItemTrigger>
                  <Box as="span" flex="1" textAlign="left">
                    <Text fontWeight="extrabold">¿Cómo funciona el tutor?</Text>
                  </Box>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
              </h2>
              <Accordion.ItemContent>
                <Accordion.ItemBody pb={4}>
                  Cada vez que respondes correctamente un paso en un ejercicio sin ver hints, el
                  Tutor lo considera como evidencia de que has incrementado tu nivel de aprendizaje.
                  Si tu respuesta al paso es incorrecta puedes intentar nuevamente y ver hints, pero
                  ya no contará como evidencia de aprendizaje, hasta que resuelvas correctamente el
                  mismo paso en otro ejercicio.
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </>
  );
}
