import { Tabs, TabList, Tab, TabPanel, TabPanels, Flex, Heading, Box, Image} from "@chakra-ui/react";
import type { Exercise } from "./types";
export const TutorWordProblem = ({exercise}: {exercise: Exercise}) => {
  
  console.log('exercise ---->',exercise);
  return(
    <>
      <Tabs isFitted variant='enclosed' align="center" >
        <TabList>
          <Tab>Presentación</Tab>
          <Tab>Aprendizajes</Tab>
          <Tab>Ejercicio</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Flex alignItems="center" justifyContent="center">
              <Flex direction="column" p="12" w="100%" alignItems="center" justifyContent="center" margin="auto">
                <Heading size="lg" pb="12"> {exercise?.title}</Heading>

                <Box boxSize="sm">
                  <Image w="100%" src={exercise.presentationImg} alt="Imagen de presentación"/>
                </Box>
              </Flex>              

            </Flex>
          </TabPanel>
          <TabPanel>
            <p>dos</p>
          </TabPanel>
          <TabPanel>
            <p>tres</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
    
  )
}

