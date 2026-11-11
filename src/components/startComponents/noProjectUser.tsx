import { useState } from "react";
import { Stack, Heading, Box, VStack, Text, Button, Image, Link } from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { Browser } from "@capacitor/browser";
import { MdAdsClick } from "react-icons/md";
import { isWrapper } from "../../utils/auth0Platform";

export function NewUser() {
  const { loginWithRedirect } = useAuth0();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const doLogin = async () => {
    try {
      setIsRedirecting(true);

      if (isWrapper()) {
        await loginWithRedirect({
          appState: {
            returnTo: "/start",
          },
          async openUrl(url) {
            await Browser.open({
              url,
              windowName: "_self",
            });
          },
        });
      } else {
        await loginWithRedirect({
          appState: {
            returnTo: "/start",
          },
        });
      }
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <VStack
      minH="full"
      flex="1"
      width="100%"
      align="stretch"
      justify="flex-start"
      gap={{ base: 4, lg: 6 }}
      px={{ base: 4, md: 6 }}
      py={{ base: 4, md: 6 }}
    >
      <Stack
        flex="1"
        width="100%"
        direction={{ base: "column", lg: "row" }}
        gap={{ base: 8, lg: 4 }}
        align="center"
        justify="center"
        px={{ base: "0", lg: "3rem", xl: "4rem" }}
      >
        <Box
          flex={{ base: "1", lg: "0 0 50%" }}
          maxW={{ base: "100%", lg: "50%" }}
          pl={{ base: "0", lg: "1rem", xl: "2rem" }}
        >
          <Heading
            color={"heading"}
            fontWeight="bold"
            fontSize={{ base: "3xl", sm: "4xl", md: "4xl", lg: "5xl" }}
            lineHeight={{ base: 1.05, lg: 1 }}
          >
            Tutor Inteligente de Matemáticas
          </Heading>

          <Text fontSize={{ base: "md", sm: "lg" }} mt="1em" color="text_info">
            Aprende y ejercita paso a paso tus habilidades de resolución de problemas. Resuelve
            ejercicios de diversos tópicos que hemos identificado como importantes en la preparación
            de Álgebra para Ingeniería.
          </Text>
          <Text fontSize={{ base: "md", sm: "lg" }} mt="1em" color="text_info">
            Para comenzar, inicia sesión con tu cuenta o solicita acceso si aún no la tienes.
          </Text>
          <Box mt={{ base: 8, md: 12 }}>
            <Stack
              direction={{ base: "column", sm: "row" }}
              gap={{ base: 3, sm: 6 }}
              justify="center"
              align={{ base: "stretch", sm: "center" }}
            >
              <Button
                variant="solid"
                fontWeight="semibold"
                shadow="md"
                bg="tangerine.500"
                borderRadius="2xl"
                w={{ base: "100%", sm: "200px" }}
                onClick={doLogin}
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
                w={{ base: "100%", sm: "200px" }}
                shadow="md"
              >
                <a
                  href="https://forms.gle/dJgg9H53fTxm56mHA"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Solicita tu cuenta
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
            w={{ base: "72%", sm: "60%", md: "52%", lg: "85%" }}
            ml={{ base: "0", lg: "auto" }}
            display="flex"
            justifyContent={{ base: "center", lg: "flex-end" }}
          >
            <Image
              w="100%"
              maxW="100%"
              maxH={{ base: "40vh", sm: "46vh", md: "50vh", lg: "50vh" }}
              src="/img/home_mateo.svg"
              fit="contain"
              alt="Mateo"
            />
          </Box>
        </Box>
      </Stack>

      <Text
        mt="auto"
        pt={{ base: 4, lg: 6 }}
        fontSize={{ base: "xs", sm: "sm" }}
        textAlign="center"
        color="gray.500"
      >
        Esta plataforma está siendo desarrollada y mantenida gracias el proyecto Fondecyt Iniciación
        11220709, titulado &quot;Diseño motivacional de tutores cognitivos para apoyar el
        aprendizaje de matemáticas en los estudiantes de primer año de ingeniería&quot; Para más
        información contactarse con el Investigador Principal: Julio Daniel Guerra Hollstein (
        <Link color="gray.500" href="mailto:jguerra@inf.uach.cl?subject=Tutor%20Integrado">
          {" "}
          jguerra@inf.uach.cl
        </Link>
        )
      </Text>
    </VStack>
  );
}
