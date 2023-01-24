import { Stack, Text } from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "./Auth";
import { DarkModeToggle } from "./DarkModeToggle";
import { ScrollArea } from "./ScrollArea";
import { SidebarLink } from "./SidebarLink";

export function Navigation() {
  const { user } = useAuth();
  return (
    <ScrollArea pt="5" pb="6">
      <Stack pb="6">
        <SidebarLink icon={<FaHome />} href="/">
          Inicio
        </SidebarLink>
        <Text fontWeight="black">Selección por Código</Text>
        <SidebarLink icon={<FaSearch />} href={"selectByCode"}>
          Search by Code
        </SidebarLink>
      </Stack>

      <Stack pb="6">
        {user && (
          <>
            <Text fontWeight="black">Rudimentos Algebraicos</Text>

            <SidebarLink href={"contentSelect?topic=16,4,3,5,6,7,8" /*17,18*/}>
              Rudimentos Algebraicos
            </SidebarLink>
            <SidebarLink href={"contentSelect?topic=5"}>
              Factor Común Compuesto
            </SidebarLink>
            <SidebarLink href={"contentSelect?topic=6"}>
              Diferencia de Cuadrados
            </SidebarLink>
            <SidebarLink href={"contentSelect?topic=7"}>
              Diferencia y Suma de Cubos
            </SidebarLink>
            <SidebarLink href={"contentSelect?topic=8"}>
              Trinomios Cuadraticos
            </SidebarLink>
            <Text fontWeight="medium">-Fracción Algebraica</Text>
            <SidebarLink href={"contentSelect?topic=9"}>
              Operatoria de Fracciones
            </SidebarLink>
            <SidebarLink href={"contentSelect?topic=10"}>
              Suma de Fracciones MCM
            </SidebarLink>
            <Text fontWeight="black">Ecuaciones</Text>
            <SidebarLink href={"contentSelect?topic=11"}>
              Ecuaciones
            </SidebarLink>
            <SidebarLink href={"contentSelect?topic=12"}>
              Sistema de ecuaciones
            </SidebarLink>
            <Text fontWeight="black">Potencias y Raices</Text>
            <SidebarLink href={"contentSelect?topic=13"}>
              Notación Cientifica
            </SidebarLink>
            <SidebarLink href={"contentSelect?topic=14"}>
              Evaluar Expresión
            </SidebarLink>
            <SidebarLink href={"contentSelect?topic=15"}>
              Reducción de Expresión
            </SidebarLink>
            <SidebarLink href={"contentSelect?topic=16"}>
              Racionalización
            </SidebarLink>
            <Text fontWeight="black">Geometría</Text>
            <SidebarLink href={"contentSelect?topic=17"}>
              Área y Perímetro
            </SidebarLink>
            <SidebarLink href={"contentSelect?topic=18"}>
              Teorema de Thales
            </SidebarLink>
            <SidebarLink href={"contentSelect?topic=19"}>
              Teorema de Pitágoras
            </SidebarLink>
          </>
        )}
      </Stack>

      <Stack alignItems="center">
        <DarkModeToggle />
      </Stack>
    </ScrollArea>
  );
}
