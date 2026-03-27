import { Stack, Heading, VStack, Spinner, Text } from "@chakra-ui/react";
import { useAuth } from "../Auth";

export const AssigndUser = () => {
  const { user } = useAuth();
  const userName = user?.name?.trim().split(/\s+/)[0] || "usuario";

  return (
    <Stack width="100%" padding="1em" alignItems="flex-start">
      <Heading size="5xl" color={"heading"} fontWeight="bold">Hola, {userName}</Heading>
    </Stack>
  );
};
