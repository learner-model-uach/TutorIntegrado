import { Stack, Text } from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";
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
      </Stack>

      <Stack pb="6">
        {user && (
          <>
            <Text fontWeight="black">Rudimentos Algebraicos</Text>
            <Text fontWeight="medium">-Factorización</Text>
            <SidebarLink href={"contentSelect?type=4"}>
              Factor Común
            </SidebarLink>
            <SidebarLink href={"contentSelect?type=5"}>
              Factor Común Compuesto
            </SidebarLink>
            <SidebarLink href={"contentSelect?type=6"}>
              Diferencia de Cuadrados
            </SidebarLink>
            <SidebarLink href={"contentSelect?type=7"}>
              Diferencia y Suma de Cubos
            </SidebarLink>
            <SidebarLink href={"contentSelect?type=8"}>
              Trinomios Cuadraticos
            </SidebarLink>
            <Text fontWeight="medium">-Fracción Algebraica</Text>
            <SidebarLink href={"contentSelect?type=9"}>
              Operatoria de Fracciones
            </SidebarLink>
            <SidebarLink href={"contentSelect?type=10"}>
              Suma de Fracciones MCM
            </SidebarLink>
            <Text fontWeight="black">Ecuaciones</Text>
            <SidebarLink href={"contentSelect?type=11"}>
              Ecuaciones
            </SidebarLink>
            <SidebarLink href={"contentSelect?type=12"}>
              Sistema de ecuaciones
            </SidebarLink>
            <Text fontWeight="black">Potencias y Raices</Text>
            <SidebarLink href={"contentSelect?type=13"}>
              Notación Cientifica
            </SidebarLink>
            <SidebarLink href={"contentSelect?type=14"}>
              Evaluar Expresión
            </SidebarLink>
            <SidebarLink href={"contentSelect?type=15"}>
              Reducción de Expresión
            </SidebarLink>
            <SidebarLink href={"contentSelect?type=16"}>
              Racionalización
            </SidebarLink>
            <Text fontWeight="black">Geometría</Text>
            <SidebarLink href={"contentSelect?type=17"}>Área y Perímetro</SidebarLink>
            <SidebarLink href={"contentSelect?type=18"}>
              Teorema de Thales
            </SidebarLink>
            <SidebarLink href={"contentSelect?type=19"}>
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
