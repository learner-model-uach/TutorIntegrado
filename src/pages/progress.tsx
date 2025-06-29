import { Heading, Stack, Text } from "@chakra-ui/react";


export default function olmDashboard(){
  const textColor= "#2A4365"
  return (
    <>
      <Stack width="100%" padding="1em" alignItems="center">
        <Heading color={textColor}>Mi progreso en Mateo</Heading>
        <Text pb="2rem" fontWeight="normal" marginBottom={10} mt={40}>
          Aquí podrás ver el porcentaje de tu progreso en todos los tópicos de Matemáticas que se encuentran en Mateo. Cada vez que realices un ejercicio el porcentaje irá variando. Recuerda que el objetivo es llegar al 100% en todos los tópicos.
        </Text>
      </Stack>
    </>
  );
}