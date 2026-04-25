import React from "react";
import { Alert, CloseButton } from "@chakra-ui/react";

export const AlertAnswer = ({ status, text, setOpenAlert, openAlert }) => {
  if (!openAlert) return null;

  return (
    <Alert.Root
      status={status}
      variant="subtle"
      fontSize="12px"
      w="150px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap={2}
    >
      <Alert.Indicator />
      <Alert.Content>{text}</Alert.Content>
      <CloseButton onClick={() => setOpenAlert(false)} />
    </Alert.Root>
  );
};
