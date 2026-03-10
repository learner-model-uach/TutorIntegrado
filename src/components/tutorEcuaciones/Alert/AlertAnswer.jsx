import React, { useState } from "react";
import { Alert, CloseButton } from "@chakra-ui/react";

export const AlertAnswer = ({ status, text, setOpenAlert, openAlert }) => {
  const [alert] = useState(openAlert);

  return (
    alert != null && (
      <Alert.Root
        status={status}
        variant="subtle"
        style={{
          fontSize: "12px",
          width: "150px",
        }}
      >
        <Alert.Indicator />
        <Alert.Content>
          {text}
        </Alert.Content>
        <CloseButton onClick={() => setOpenAlert(false)} />
      </Alert.Root>
    )
  );
};
