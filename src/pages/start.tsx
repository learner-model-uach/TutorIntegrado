import { Spinner, Flex } from "@chakra-ui/react";
import { AssigndUser } from "../components/startComponents/projectUser";
import { NewUser } from "../components/startComponents/noProjectUser";
import { useAuth } from "./../components/Auth";

export default function Start() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="50vh">
        <Spinner />
      </Flex>
    );
  }

  const proyecto = user?.projects?.some(x => x.code === "NivPreAlg");

  return proyecto ? <AssigndUser /> : <NewUser />;
}
