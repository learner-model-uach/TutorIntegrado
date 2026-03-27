import { useState } from "react";
import { Stack, Heading, Box, VStack, Text, Icon, Link, Button, Image } from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { FaEnvelope } from "react-icons/fa";
import { MdAdsClick } from "react-icons/md";

export default function StarAternative() {
  const { loginWithRedirect } = useAuth0();
  const [isRedirecting, setIsRedirecting] = useState(false);

  return (
    <VStack h="100vh" width="100%" align="stretch" justify="space-between" padding="1em">
      <Stack
        width="100%"
        direction={{ base: "column", lg: "row" }}
        // gap={{ base: "2rem", lg: "1rem" }}
        align="center"
        justify="center"
        flex="1"
        px={{ base: "0", lg: "3rem", xl: "4rem" }}
      >
        <Box
          flex={{ base: "1", lg: "0 0 50%" }}
          maxW={{ base: "100%", lg: "50%" }}
          pl={{ base: "0", lg: "1rem", xl: "2rem" }}
        >
          <Heading size="5xl" color={"heading"} fontWeight="bold">
            Tutor Inteligente de Matemáticas
          </Heading>

          <Text fontSize="lg" mt="1em" color="text_info">
            Aprende y ejercita paso a paso tus habilidades de resolución de problemas. Resolviendo
            ejercicios de diversos tópicos que hemos identificado como importantes para prepararse
            para Álgebra para Ingeniería.
          </Text>
          <Box mt="3em">
            <Stack direction="row" gap="2em" justify="center">
              <Button
                variant="solid"
                fontWeight="semibold"
                shadow="md"
                bg="tangerine.500"
                borderRadius="2xl"
                w="200px"
                onClick={() => {
                  setIsRedirecting(true);
                  loginWithRedirect({
                    appState: {
                      returnTo: "/start",
                    },
                  });
                }}
                loading={isRedirecting}
                disabled={isRedirecting}
              >
                <MdAdsClick /> Ingresar
              </Button>
              <Button
                asChild
                variant="outline"
                colorPalette="orange"
                borderRadius="2xl"
                w="200px"
                shadow="md"
              >
                <a
                  href="https://forms.gle/dJgg9H53fTxm56mHA"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Solicia tu cuenta
                </a>
              </Button>
            </Stack>
          </Box>
        </Box>

        <Box
          flex={{ base: "1", lg: "0 0 50%" }}
          maxW={{ base: "100%", lg: "50%" }}
          display="flex"
          justifyContent={{ base: "center", lg: "flex-end" }}
          alignItems="center"
          pr={{ base: "0", lg: "1rem", xl: "2rem" }}
        >
          <Box
            w={{ base: "100%", lg: "85%" }}
            ml={{ base: "0", lg: "auto" }}
            display="flex"
            justifyContent={{ base: "center", lg: "flex-end" }}
          >
            <Image
              w="100%"
              maxW="100%"
              maxH="50vh"
              src="/img/home_mateo.svg"
              fit="contain"
              alt="Robot"
            />
          </Box>
        </Box>
        {/* <Box  w="100%">
        </Box> */}
      </Stack>

      <Text fontSize="xs" textAlign="center" color="gray.500">
        Para más información contactarse con el Investigador Principal: Julio Daniel Guerra
        Hollstein{" "}
        <Text as="span" whiteSpace="nowrap" color="gray.500">
          <Icon as={FaEnvelope} verticalAlign="middle" />{" "}
          <Link href="mailto:jguerra@inf.uach.cl?subject=Tutor%20Integrado">
            {" "}
            jguerra@inf.uach.cl
          </Link>
        </Text>
      </Text>
    </VStack>
  );
}
