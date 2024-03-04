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
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { Logout } from "./Logout";
import { useAuth } from "./Auth";

export const UserInfo = () => {
  const { isLoading, user, auth0User } = useAuth();
  const { loginWithRedirect } = useAuth0();
  const emailTextColor = useColorModeValue("whiteAlpha.700", "gray.400");

  const [isRedirecting, setIsRedirecting] = useState(false);

  const loginVariant = useColorModeValue("solid", "outline");

  const fontColor = useColorModeValue("black", "white");

  if (isLoading)
    return (
      <Flex justifyContent="center">
        <Spinner />
      </Flex>
    );

  if (!user || !auth0User)
    return (
      <Stack spacing={3}>
        <Button
          colorScheme="blue"
          onClick={() => {
            setIsRedirecting(true);
            loginWithRedirect();
          }}
          isLoading={isRedirecting}
          isDisabled={isRedirecting}
          variant={loginVariant}
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          leftIcon={<AiOutlineLogin />}
        >
          Login
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

  return (
    <Popover>
      <PopoverTrigger>
        <Box
          p="3"
          cursor="pointer"
          display="block"
          transition="background 0.1s"
          rounded="xl"
          _hover={{ bg: "whiteAlpha.200" }}
          whiteSpace="nowrap"
        >
          <HStack display="inline-flex">
            {picture ? <Avatar size="sm" name={name || undefined} src={picture} /> : null}

            <Box lineHeight="1">
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
      </PopoverTrigger>
      <PopoverContent width="100%">
        <PopoverCloseButton color={fontColor} />
        <PopoverBody>
          <Stack alignItems="flex-start" paddingTop="2em" paddingBottom="1em">
            <Logout />
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
