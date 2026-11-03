import {
  Avatar,
  Box,
  Flex,
  HStack,
  Popover,
  Spinner,
  Text,
  CloseButton,
  Portal,
} from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";

import { Logout } from "./Logout";
import { useAuth } from "./Auth";

export const UserInfo = () => {
  const { isLoading, user } = useAuth();
  const emailTextColor = useColorModeValue("whiteAlpha.700", "gray.400");

  if (isLoading)
    return (
      <Flex justifyContent="center">
        <Spinner />
      </Flex>
    );

  if (!user) return null;

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
            {picture ? (
              <Avatar.Root size="sm">
                <Avatar.Fallback name={name || ""} />
                <Avatar.Image src={picture} />
              </Avatar.Root>
            ) : null}

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
                <CloseButton size="xs" variant="ghost" />
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
