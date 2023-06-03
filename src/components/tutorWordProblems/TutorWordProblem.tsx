import { 
  Tabs, 
  TabList, 
  Tab, 
  TabPanel, 
  TabPanels, 
  Flex, 
  Heading, 
  Box, 
  Image, 
  Container, 
  Accordion, 
  AccordionItem, 
  AccordionPanel, 
  AccordionButton,
  AccordionIcon,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Th,
  Tbody,
  Tr,
  Td} from "@chakra-ui/react";
  
import type { align, Exercise } from "./types";
import dynamic from "next/dynamic";
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

const MathField = dynamic(() => import("./Components/mathLiveV2"),{
  ssr:false
})
export const TutorWordProblem = ({exercise}: {exercise: Exercise}) => {
  
  console.log('exercise ---->',exercise);
  return(
    <>
      <Tabs isFitted variant='enclosed' align="center" width='auto' >
        <TabList>
          <Tab>Presentación</Tab>
          <Tab>Aprendizajes</Tab>
          <Tab>Ejercicio</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Flex alignItems="center" justifyContent="center">
              <Flex direction="column" p="12" w="100%" alignItems="center" justifyContent="center" margin="auto">
                <Heading size="lg" pb="12"> {exercise?.presentation.title}</Heading>

                <Box boxSize="sm">
                  <Image w="100%" src={exercise.presentation.urlImg} alt="Imagen de presentación"/>
                </Box>
              </Flex>              

            </Flex>
          </TabPanel>
          <TabPanel >
            <Flex>

              <Container maxW='100%' >
                {exercise.learningObjetives.title}
                <br/>
                <MathField value={"f(x)= \\frac{\\placeholder[numerator][x]{}}{\\placeholder[denominator]{y}}"} onChange={()=>{console.log("MathfieldCambio")}}/>
              </Container>
            </Flex>
          </TabPanel>

          <TabPanel width='auto'>
            <Flex  direction="column">
              {exercise.statement 
              && <Container maxW="100%" paddingY="5" textAlign="left" >{exercise.statement}</Container> 
              }
              {exercise.table 
              && <TableContainer width='auto' >
                <Table variant="simple" size="md" width="auto" borderWidth="2px">
                  <TableCaption>{exercise.table.tableCaption}</TableCaption>
                  <Thead bgColor="gray.100">
                    {exercise.table.header.map((head, index) =>{
                      return(
                        <Th key={index} align={head.align as align }>
                          {head.value}
                        </Th>
                      )
                    })}
                  </Thead>
                  <Tbody>
                    {exercise.table.rows.map((row,index)=>{
                      const backgroundColor = index % 2 === 0 ? '#333' : '#555'
                      return(
                        <Tr key={index} >
                          {row.data?.map((value,i) => {
                            return(
                              <Td key={i}>
                                <MathField readOnly value={value} onChange={()=>{}}/>
                              </Td>
                            )
                          })}
                        </Tr>
                      )
                    })}
                  </Tbody>
                </Table>
              </TableContainer> 

              }
              <Accordion allowMultiple pt="12px">
                {exercise.questions && exercise.questions.map((ques, index) =>{
                  return (
                    <>
                    <Box maxW='100%' textAlign='left'>
                      <Latex >{ques.tip}</Latex>
                    </Box>
                    <AccordionItem bg="gray.100" key={index}>
                      
                      <h2>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left">
                            {ques.question}
                          </Box>
                          <AccordionIcon/>
                        </AccordionButton>
                      </h2>
                      <AccordionPanel bg="white">
                        {ques.steps.map(step => {
                          return(
                            <>
                              {step.componentToAnswer}
                            </>
                          )
                        })}
                        En esta seccion irian los pasos
                      </AccordionPanel>
                    </AccordionItem>
                    </>
                  )
                })

                }
              </Accordion>

       
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
    
  )
}

