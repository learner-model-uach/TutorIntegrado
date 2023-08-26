import { Alert, AlertIcon, AlertTitle, AlertDescription, Collapse } from "@chakra-ui/react";
import Latex from "react-latex-next";
import { AlertStatus } from "../types.d";

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
    <Collapse in={!alertHidden} animateOpacity>
      <Alert margin={2} status={status}>
        <AlertIcon />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription
          width="100%"
          whiteSpace="normal" // Permite que el texto se ajuste en varias líneas
          maxW="100%" // Evita que el botón se desborde de su contenedor
        >
          <Latex>{text}</Latex>
        </AlertDescription>
      </Alert>
    </Collapse>
  );
};
export default ResAlert;
