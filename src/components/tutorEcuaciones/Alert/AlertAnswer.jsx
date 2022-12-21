import { React, useState, useEffect, useContext } from "react";
import { Alert, AlertIcon, CloseButton } from "@chakra-ui/react";

export const AlertAnswer = ({ status, text, setOpenAlert, openAlert }) => {
   const [alert, setAlert] = useState(openAlert);

   return (
      alert != null && (
         <Alert
            status={status}
            variant="subtle"
            style={{
               fontSize: "12px",
               width: "150px",
            }}
         >
            <AlertIcon />
            {text}
            <CloseButton onClick={() => setOpenAlert(false)} />
         </Alert>
      )
   );
};
