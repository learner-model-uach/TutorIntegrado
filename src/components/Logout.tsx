import { useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Dialog, Button, Portal, CloseButton, Text } from "@chakra-ui/react";
import { Browser } from "@capacitor/browser";
import { AuthState } from "./Auth";
import { getNativeRedirectUri, isWrapper } from "../utils/auth0Platform";

export function Logout() {
  const { logout } = useAuth0();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const doLogout = async () => {
    AuthState.isLoading = true;

    if (isWrapper()) {
      await logout({
        logoutParams: {
          returnTo: getNativeRedirectUri(),
        },
        async openUrl(url) {
          await Browser.open({
            url,
            windowName: "_self",
          });
        },
      });
      return;
    }

    await logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button colorPalette="red">Logout</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                <Text fontSize="lg" fontWeight="bold">
                  Logout
                </Text>
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>Are you sure you want to log out?</Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button ref={cancelRef} variant="outline">
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button colorPalette="red" onClick={doLogout}>
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
