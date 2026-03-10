import { useRef } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import {
  Dialog,
  Button,
  Portal,
  CloseButton, 
  Text
} from "@chakra-ui/react";
import { AuthState } from "./Auth";

export function Logout() {
  const { logout } = useAuth0();
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button colorPalette="red">
          Logout
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                <Text fontSize="lg" fontWeight="bold">Logout</Text>
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              Are you sure you want to log out?
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button ref={cancelRef} variant="outline">
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                colorPalette="red"
                onClick={() => {
                  AuthState.isLoading = true;
                  logout({
                    logoutParams: {
                      returnTo: window.location.origin,
                    },
                  });
                }}
              >
                Confirm
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
