import { Image, Box, Flex } from "@chakra-ui/react";

import { MobileMenuButton } from "./MobileMenuButton";
import { Navigation } from "./Navigation";
import { SearchInput } from "./SearchInput";
import { useMobileMenuState } from "./useMobileMenuState";
import { UserInfo } from "./UserInfo";
import { DarkModeToggle } from "./DarkModeToggle";

import type { ReactNode } from "react";
import { GroupSelect } from "./GroupSelect";

export function MainLayout({ children }: { children: ReactNode }) {
  const { open, onToggle } = useMobileMenuState();

  const mainContainerBackground = "bg";
  const contentContainerBackground = "bg.secondary";

  return (
    <Flex
      height="100vh"
      bg={mainContainerBackground}
      overflow="clip"
      minW={0}
      style={{ "--sidebar-width": "16rem" } as React.CSSProperties}
    >
      <Box
        as="nav"
        display="flex"
        flexDirection="column"
        flex="1"
        height="100vh"
        width="var(--sidebar-width)"
        left="0"
        py="5"
        px="3"
        color="gray.200"
        position="fixed"
      >
        {/* <Image src="/img/logo.svg" alt="Logo" ml="6"mb="4" /> */}
        <Image src="/img/logo.png" alt="Logo" w="220px" h="80px" mb="1" ml="6" />
        <Box
          fontSize="sm"
          lineHeight="tall"
          display="flex"
          flexDirection="column"
          flex="1"
          minH="0"
        >
          <UserInfo />
          <GroupSelect />
          <Box flex="1" minH="0">
            <Navigation />
          </Box>
          <Flex justify="center" pt="4" pb="2">
            <DarkModeToggle />
          </Flex>
        </Box>
      </Box>
      <Box
        flex="1"
        minW={0}
        p={{ base: "0", md: "6" }}
        marginStart={{ md: "var(--sidebar-width)" }}
        position="relative"
        left={open ? "var(--sidebar-width)" : "0"}
        transition="left 0.2s"
      >
        <Box bg={contentContainerBackground} height="100%" pb="6" rounded={{ md: "lg" }}>
          <Flex direction="column" height="full" minW={0}>
            <Flex
              w="full"
              py="4"
              justify="space-between"
              align="center"
              px="10"
              display={{ base: "block", md: "none" }}
            >
              <Flex align="center" minH="8">
                <MobileMenuButton onClick={onToggle} isOpen={open} />
              </Flex>
              {false && <SearchInput />}
            </Flex>
            <Flex
              overflowY="auto"
              direction="column"
              flex="1"
              minW={0}
              overflow="auto"
              padding="12px"
              px={{
                md: "10",
              }}
              pt={{
                md: "8",
              }}
              maxW={{
                md: "calc(97vw - var(--sidebar-width))",
              }}
            >
              {children}
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
}
