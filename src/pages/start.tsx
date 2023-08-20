import { Stack, Heading, Text } from "@chakra-ui/react";
import { useAuth } from "../components/Auth";
//import { withAuth } from "./../components/Auth";

export default function Start() {
  const { user } = useAuth();

  return (
    <Stack width="100%" padding="1em" alignItems="center">
      <>
        <Stack alignItems="center">
          <Heading>Tutor pre-álgebra</Heading>
        </Stack>
        {user && (
          <Stack padding="2em">
            <Heading>¡Bienvenido {user?.name}!</Heading>
            <Text>
              {" "}
              <br /> Te damos la bienvenida a esta sesión de prueba. Tu participación es esencial
              para nosotros. Durante esta sesión, te presentaremos tres ejercicios matemátcos que te
              permitirán explorar y aplicar tus habilidades. Después de resolver cada ejercicio, te
              pediremos que respondas a una breve encuesta para obtener tus comentarios y opiniones.
              <br /> <br /> Una vez hayas completado los tres ejercicios y las encuestas
              correspondientes, te pediremos que respondas a una última encuesta general. <br />{" "}
              <br /> Tu contribución nos ayudará a mejorar y perfeccionar nuestro contenido para
              futuros estudiantes. <br /> <br /> ¡Gracias por participar!
            </Text>
          </Stack>
        )}
      </>
    </Stack>
  );
}
