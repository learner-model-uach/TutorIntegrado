import { Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";

const Potato = () => {
  const router = useRouter();
  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" background="gray.100" p={12} rounded={6}>
        <Heading onClick={() => router.push({ pathname: "logicTest", query: { pid: "Inter" } })}>
          Representación de conjuntos
        </Heading>
        <Heading onClick={() => router.push({ pathname: "logicTest", query: { pid: "Sucesion" } })}>
          Sucesión
        </Heading>
        <Heading onClick={() => router.push({ pathname: "logicTest", query: { pid: "Inters" } })}>
          Intersección
        </Heading>
        <Heading onClick={() => router.push({ pathname: "logicTest", query: { pid: "Table1" } })}>
          Tablas de Verdad
        </Heading>
        <Heading onClick={() => router.push({ pathname: "logicTest", query: { pid: "Union1" } })}>
          Union
        </Heading>
        <Heading onClick={() => router.push({ pathname: "logicTest", query: { pid: "Prop1" } })}>
          Proposiciones
        </Heading>
        <Heading onClick={() => router.push({ pathname: "logicTest", query: { pid: "Conj1" } })}>
          Conjunciones
        </Heading>
      </Flex>
    </Flex>
  );
};

export default Potato;
