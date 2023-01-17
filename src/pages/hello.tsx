import { useRouter } from "next/router";
import { SimpleGrid, Center } from "@chakra-ui/react";
import NextLink from "next/link";
import { subscribe } from "valtio";
import { sessionState, sessionStateBD } from "../components/SessionState";

function Hello() {
  const router = useRouter();
  
  subscribe(sessionState.currentContent, () => {
    /*update currentContent*/
    sessionStateBD.setItem(
      "currentContent",
      JSON.parse(JSON.stringify(sessionState.currentContent))
    );
  });

  sessionState.currentContent.code = "fc1"; //code de sessionState
  sessionState.currentContent.description = "hola"; //descripcion del ejercicio ofrecido
  sessionState.currentContent.id = 1; //identificador del ejercicio
  sessionState.currentContent.json = { json: "json del ejercicio" }; //json del ejercicio
  sessionState.currentContent.kcs = [1, 2, 3]; //kcs del ejercicio
  sessionState.currentContent.label = ""; //enunciado o tipo de ejercicio

  return (
    <>
      <p>Hola!</p>
      <NextLink
                href={"cargarContenido"}
        >Ir a otra pagina</NextLink>
    </>
  );
}

export default Hello;