import {
  Stack,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Carousel from "../components/Carrusel";

//import { withAuth } from "./../components/Auth";

export default function Start() {
  const bgColor = "#2A4365";
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
    <Stack width="100%" padding="1em" alignItems="center">
      <>
        <Stack alignItems="center">
          <Heading color={bgColor}>Bienvenid@ al Tutor Cognitivo de Nivelación</Heading>
        </Stack>
        <Stack padding="2em">
          <Text marginBottom={10}>
            {" "}
            Un tutor cognitivo es un sistema que te ayuda a aprender y ejercitar tus habilidades de
            resolución de problemas, paso a paso. El Tutor Cognitivo de Nivelación te permitirá
            practicar resolviendo ejercicios de diversos tópicos que hemos identificado como
            importantes para prepararse para los cursos de Algebra I y Geometría I: factorización,
            fracciones algebraicas, potencias y raíces, ecuaciones cuadráticas, sistemas de
            ecuaciones lineales, semejanza de triángulos, teorema de pitágoras, y cálculo de área y
            perímetro.
          </Text>

          <Tabs mt={100} isFitted align="start" variant="enclosed">
            <TabList>
              <Tab>Sobre el Tutor</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Accordion defaultIndex={[0]} allowMultiple>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          <Text textColor={bgColor} fontWeight="extrabold">
                            ¿Cómo aprendo con el tutor?
                          </Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      Accede a uno de lo tópicos del menú de la izquierda y el Tutor te presentará
                      ejercicios para resolver. En cada ejercicio deberás avanzar paso a paso y el
                      tutor te indicará que hacer en cada paso y corregirá tus respuestas. Además,
                      en cada paso hay ayudas (hints) que se activan cuando las respuestas son
                      incorrectas. A medida que completas ejercicios, el tutor escogerá ejercicios
                      de acuerdo a tu nivel de aprendizaje. Existen 3 implementaciones distintas
                      para resolver los ejercicios, las cuales te presentamos a continuación.
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box as="span" flex="1" textAlign="left">
                              <Text textColor={bgColor} fontWeight="extrabold">
                                Factorización
                              </Text>
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4} alignItems="center">
                          <Box>
                            <Carousel images={imagesfac} />
                          </Box>
                        </AccordionPanel>
                      </AccordionItem>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box as="span" flex="1" textAlign="left">
                              <Text textColor={bgColor} fontWeight="extrabold">
                                Ecuaciones Cuadráticas y Ecuaciones Lineales
                              </Text>
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          <Box>
                            <Carousel images={imagesecu} />
                          </Box>
                        </AccordionPanel>
                      </AccordionItem>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box as="span" flex="1" textAlign="left">
                              <Text textColor={bgColor} fontWeight="extrabold">
                                Fracción Algebraica | Potencias y Raíces
                              </Text>
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          <Box>
                            <Carousel images={imagesfrac} />
                          </Box>
                        </AccordionPanel>
                      </AccordionItem>
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          <Text textColor={bgColor} fontWeight="extrabold">
                            ¿Cómo funciona el tutor?
                          </Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      Cada vez que respondes correctamente un paso en un ejercicio sin ver hints, el
                      Tutor lo considera como evidencia de que has incrementado tu nivel de
                      aprendizaje. Si tu respuesta al paso es incorrecta puedes intentar nuevamente
                      y ver hints, pero ya no contará como evidencia de aprendizaje, hasta que
                      resuelvas correctamente el mismo paso en otro ejercicio.
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Box mt={4} p={4} bg="gray.200" textAlign="center">
            <p>Más información sobre el proyecto:</p>
            <p>
              Esta plataforma de Tutores para nivelación de matemáticas está siendo desarrollada y
              mantenida gracias el proyecto Fondecyt Iniciación 11220709, titulado "Diseño
              motivacional de tutores cognitivos para apoyar el aprendizaje de matemáticas en los
              estudiantes de primer año de ingeniería". Para consultas o más información,
              contactarse con el Investigador Principal: Julio Daniel Guerra Hollstein
              jguerra@inf.uach.cl
            </p>{" "}
          </Box>
        </Stack>
      </>
    </Stack>
  );
}
