import { Alert, Collapsible } from "@chakra-ui/react";
import Latex from "react-latex-next";
import { AlertStatus } from "../types";

interface AlertProps {
  title?: string;
  status?: AlertStatus;
  text: string;
  alertHidden?: boolean;
}

const ResAlert = ({
  title,
  status = AlertStatus.success,
  alertHidden = false,
  text,
}: AlertProps) => {
  return (
    <Collapsible.Root open={!alertHidden} unmountOnExit>
      <Collapsible.Content>
        <Alert.Root margin={2} status={status}>
          <Alert.Indicator />
          <Alert.Content>
            {title ? <Alert.Title>{title}</Alert.Title> : null}
            <Alert.Description width="100%" whiteSpace="normal" maxW="100%">
              <Latex>{text}</Latex>
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
export default ResAlert;
