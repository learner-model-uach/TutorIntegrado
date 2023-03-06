import { Stack, Heading, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAuth } from "../components/Auth";
import { useUpdateModel } from "../utils/updateModel";
//import { withAuth } from "./../components/Auth";

export default function Start() {
  //Lógica del último state, si no crearlo
  const { user } = useAuth();
  const model = useUpdateModel();

  useEffect(() => {
    user &&
      model({
        typeModel: "BKT",
        domainID: "1",
      });
    console.log("Update Model");
  }, []);

  return (
    <Stack width="100%" padding="1em" alignItems="center">
      <>
        <Stack alignItems="center">
          <Heading>Tutor pre-álgebra</Heading>
        </Stack>
        <Stack padding="2em">
          <Text>Página inicial [start] presentando el tutor (por definir)</Text>
        </Stack>
      </>
    </Stack>
  );
}
