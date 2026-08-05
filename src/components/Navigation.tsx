import { Stack, Text } from "@chakra-ui/react";
import { FaBookOpen, FaHome, FaQuestionCircle, FaSearch, FaChartLine } from "react-icons/fa";
import { useAuth } from "./Auth";
import { ScrollArea } from "./ScrollArea";
import { SidebarLink } from "./SidebarLink";

export function Navigation() {
  const { user, isLoading } = useAuth();

  const admin = (user?.role ?? "") == "ADMIN" ? true : false;
  const isPreLogin = !isLoading && !user;

  if (isPreLogin) {
    return (
      <ScrollArea height="10vh" display="flex" flexDirection="column">
        <Stack flex="1" justify="center">
          <Stack>
            <SidebarLink icon={<FaHome />} href="/">
              Inicio
            </SidebarLink>
          </Stack>

          <Stack fontWeight="black" pb="2">
            <SidebarLink icon={<FaQuestionCircle />} href="/tutorial">
              Tutorial
            </SidebarLink>
          </Stack>
        </Stack>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea pt="5" pb="6">
      <Stack pb="6">
        <SidebarLink icon={<FaHome />} href="/">
          Inicio
        </SidebarLink>
        <SidebarLink icon={<FaQuestionCircle />} href="/tutorial">
          Tutorial
        </SidebarLink>
        {user && !user.tags.includes("wp-test-user") && (
          <>
            <SidebarLink icon={<FaChartLine />} href="/progress">
              Mi progreso
            </SidebarLink>
          </>
        )}
        {user && admin && (
          <>
            <Text fontWeight="black">Selección por Código</Text>
            <SidebarLink icon={<FaSearch />} href={"/selectByCode"}>
              Search by Code
            </SidebarLink>
          </>
        )}
      </Stack>

      <Stack>
        {user && !user.tags.includes("wp-test-user") && (
          <>
            <Text fontWeight="black">Evaluación e Investigación</Text>
            <SidebarLink key="1" href={"/encuestaInicial"}>
              Encuesta inicial
            </SidebarLink>
            <SidebarLink key="2" href={"/practicaEstudiantes"}>
              Práctica estudiantes
            </SidebarLink>
            <SidebarLink key="3" href={"/pruebaEstudiantes"}>
              Prueba estudiantes
            </SidebarLink>
            <Stack fontWeight="black" pb="6">
              <SidebarLink icon={<FaBookOpen />} href="/challenge">
                Desafíos
              </SidebarLink>
            </Stack>
          </>
        )}
      </Stack>
    </ScrollArea>
  );
}
