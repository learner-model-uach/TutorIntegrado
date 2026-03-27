import { useEffect } from "react";
import { useDisclosure, useBreakpointValue } from "@chakra-ui/react";

export const useMobileMenuState = () => {
  const { open, onOpen, onClose, onToggle } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, lg: false });

  useEffect(() => {
    if (isMobile === false) {
      onClose();
    }
  }, [isMobile, onClose]);

  return { open, onOpen, onClose, onToggle };
};
