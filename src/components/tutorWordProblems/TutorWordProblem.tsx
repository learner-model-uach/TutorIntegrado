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
  
import type { align, Exercise, SelectionMeta } from "./types";
import  { components } from "./types.d";
import dynamic from "next/dynamic";
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import ResAlert, { AlertStatus } from "./Alert/responseAlert";

const MathField = dynamic(() => import("./Components/mathLiveV2"),{
  ssr:false
})
const AnswerSelection = dynamic(()=> import("./Components/answerSelection"),{
  ssr:false
})
export const TutorWordProblem = ({exercise}: {exercise: Exercise}) => {
  
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
                <ResAlert title="Titulo" status={AlertStatus.warning} >
                  esto es texto
                </ResAlert>
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
              {exercise.text 
                && 
                <Box width="100%" textAlign="left">
                  <Latex>{exercise.text}</Latex>
                  
                </Box>
              }

              <Accordion allowMultiple pt="12px">
                {exercise.questions && exercise.questions.map((ques, index) =>{
                  return (
                    <>

                    <AccordionItem  key={index}>
                      
                      <h2>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left">
                            {(ques.questionId+1)+". "+ ques.question}
                          </Box>
                          <AccordionIcon/>
                    
                        </AccordionButton>
                      </h2>
                      <AccordionPanel bg="white">
                        {ques.steps.map((step,index) => {
                          return(
                            <Accordion allowMultiple key={index}>
                              <AccordionItem bgColor='gray.100'>
                                <h2>
                                  <AccordionButton>
                                    <Box as="span" flex="1" textAlign="left">
                                      {step.stepTitle}
                                    </Box>
                                    <AccordionIcon/>
                                  </AccordionButton>
                                </h2>
                                <AccordionPanel bg='white'>
                                  <Box padding={2}>
                                    {
                                      step.componentToAnswer.nameComponent === components.SLC 
                                        ? <AnswerSelection meta={step.componentToAnswer.meta as SelectionMeta }></AnswerSelection>
                                        : (step.componentToAnswer.nameComponent === components.MLC)
                                        ? <p>otro componente 1</p>
                                        : <p>otro componente 2</p>
                                    }
                                  </Box>
                                </AccordionPanel>
                              </AccordionItem>
                            </Accordion>
                        
                          )
                        })}
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

