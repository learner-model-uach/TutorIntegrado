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
  Td,
  Alert,
  AlertIcon} from "@chakra-ui/react";
  
import type { align, Exercise, MathComponentMeta, SelectionMeta } from "./types";
import  { components, AlertStatus } from "./types.d";
import dynamic from "next/dynamic";
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import ResAlert from "./Alert/responseAlert";
 
const MathField = dynamic(() => import("./Components/tools/mathLive"),{
  ssr:false
})
const SelectionComponent = dynamic(()=> import("./Components/answerSelection"),{
  ssr:false
})
const MathComponent = dynamic(()=> import("./Components/mathComponent"),{
  ssr:false
})
export const TutorWordProblem = ({exercise}: {exercise: Exercise}) => {
  
  return(
    <>
      <Tabs isFitted variant='enclosed' align="center" width='auto' >
        <TabList >
          <Tab>Presentación</Tab>
          <Tab>Aprendizajes</Tab>
          <Tab>Ejercicio</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Container maxW='100%'>
              <Heading size="lg" pb="12"> {exercise?.presentation.title}</Heading>
              <Image w={['sm','md']} src={exercise.presentation.urlImg} alt="Imagen de presentación"/>
            </Container>              
          </TabPanel>
          <TabPanel >
            <Container maxW='100%' >
              {exercise.learningObjetives.title}
              <br/>
              <ResAlert title="Titulo" status={AlertStatus.warning} alertHidden={false} text={1+2+"esto es texto"} />
          
            </Container>
           
          </TabPanel>

          <TabPanel>
            <Container maxW='100%' >
              {exercise.statement 
              && <Box textAlign='left'>{exercise.statement}</Box> 
              }
              {exercise.table 
              && 
              
              <TableContainer mb='5' mt='10' overflowX='auto' maxW='80%'>
                <Table 
                variant="simple"     
                size='md'
                borderWidth="2px"
               
                >
                  <TableCaption>{exercise.table.tableCaption}</TableCaption>
                  <Thead bgColor="gray.100">
                    <Tr>
                      {exercise.table.header.map((head, index) =>{
                        return(
                          <Th key={index} align={head.align as align }>
                            {head.value}
                          </Th>
                        )
                      })}
                    </Tr>
                  </Thead>
                  <Tbody >
                    {exercise.table.rows.map((row,index)=>{
                      const backgroundColor = index % 2 === 0 ? '#333' : '#555'
                      return(
                        <Tr key={index} >
                          {row.data?.map((value,i) => {
                            return(
                              <Td key={i} >
                                {<Latex>{value}</Latex>}
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
                            <Accordion allowMultiple key={index} >
                              {step.explanation && 
                              <Alert status="warning" width='100%' textAlign="left" m='1' bgColor='feebc8'>
                                <Latex>{step.explanation}</Latex>
                              </Alert>
                              }
                              <AccordionItem bgColor='#bde3f8'>
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
                                        ? <SelectionComponent meta={step.componentToAnswer.meta as SelectionMeta }/>
                                        : (step.componentToAnswer.nameComponent === components.MLC)
                                        ? <MathComponent meta={step.componentToAnswer.meta as MathComponentMeta}/>
                                        : <p>otro componente</p>
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

       
            </Container>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
    
  )
}

