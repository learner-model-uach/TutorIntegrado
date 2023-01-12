import { useRouter } from "next/router";
import { SimpleGrid, Center } from "@chakra-ui/react";
import NextLink from "next/link";
import { subscribe } from "valtio";
import { sessionState, sessionStateBD } from "../components/SessionState";
function Chao() {
  const router = useRouter();
  subscribe(sessionState.currentContent, () => {
    /*update currentContent*/
    sessionStateBD.setItem(
      "currentContent",
      JSON.parse(JSON.stringify(sessionState.currentContent))
    );
  });
  return (
    <>
      <p>{sessionState.currentContent.code}</p>
      <NextLink
                href={"hello"}
        >Ir a otra pagina</NextLink>
    </>
  );
}

export default Chao;