import { useState } from "react";
import { AiOutlineLogin } from "react-icons/ai";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Popover,
  Spinner,
  Stack,
  Text,
  CloseButton,
  Portal,
} from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";

import { Logout } from "./Logout";
import { useAuth } from "./Auth";

export const UserInfo = () => {
  const { isLoading, user, auth0User } = useAuth();
  const { loginWithRedirect } = useAuth0();
  const emailTextColor = useColorModeValue("whiteAlpha.700", "gray.400");

  const [isRedirecting, setIsRedirecting] = useState(false);

  const loginVariant = useColorModeValue("solid", "outline");

  if (isLoading)
    return (
      <Flex justifyContent="center">
        <Spinner />
      </Flex>
    );

  if (!user || !auth0User)
    return (
      <Stack gap={3}>
        <Button   //Boton de login
          // colorPalette="blue"
          bg={{ base: "loginButton", _hover: "stealblue.600" }}
          
          color="white"
          fontSize="md"
          fontWeight="semibold"
          onClick={() => {
            setIsRedirecting(true);
            loginWithRedirect();
          }}
          loading={isRedirecting}
          disabled={isRedirecting}
          variant={loginVariant}
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          rounded="md"
        >
          <HStack>
            <AiOutlineLogin />
            <span>Login</span>
          </HStack>
        </Button>
        <Text textAlign="center" color={emailTextColor}>
          o solicita tu cuenta{" "}
          <Box display="inline-flex" alignItems="center">
            <Link
              color="blue.500"
              href="https://forms.gle/dJgg9H53fTxm56mHA"
              target="_blank"
              rel="noopener noreferrer"
            >
              aquí!{" "}
            </Link>
            <FaExternalLinkAlt size="0.8em" style={{ marginLeft: "0.3em", marginTop: "0.2em" }} />
          </Box>
        </Text>
      </Stack>
    );

  const { name, email, picture } = user;
  // @ts-ignore
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Box
          p="3"
          cursor="pointer"
          display="block"
          transition="background 0.1s"
          rounded="xl"
          _hover={{ bg: "whiteAlpha.200" }}
          whiteSpace="normal"
        >
          <HStack display="inline-flex">
            {picture ?
              <Avatar.Root size="sm">
                <Avatar.Fallback name={name || ""} />
                <Avatar.Image src={picture} />
              </Avatar.Root> : null}

            <Box lineHeight="1" textAlign="left">
              {name ? (
                <Text fontSize="2xl" fontWeight="semibold">
                  {name}
                </Text>
              ) : null}

              {email ? (
                <Text fontSize="xs" mt="1" color={emailTextColor}>
                  {email}
                </Text>
              ) : null}
            </Box>
          </HStack>
        </Box>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content width="auto" position="relative">
            <Flex justify="flex-end" p="2" pb="0">
              <Popover.CloseTrigger asChild>
                <CloseButton
                  size="xs"
                  variant="ghost" />
              </Popover.CloseTrigger>
            </Flex>
            <Popover.Body pt="1">
              <Logout />
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};