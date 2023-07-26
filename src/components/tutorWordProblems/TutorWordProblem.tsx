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
  Accordion, 
  AccordionItem, 
  AccordionPanel, 
  AccordionButton,
  AccordionIcon,
  Table,
  TableCaption,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  Center,
  useColorModeValue} from "@chakra-ui/react";
  
import type {Exercise, GraphMeta, MathComponentMeta, SelectionMeta, textAlign } from "./types";
import  { components, graphComponents } from "./types.d";
import dynamic from "next/dynamic";
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { CardInfo } from "./infCard/informationCard";
import GraphComp from "./Components/graphComponent";
import JSXGraphComponent from "./Components/jsxGraphComponent";
 
const SelectionComponent = dynamic(()=> import("./Components/answerSelection"),{
  ssr:false
})
const MathComponent = dynamic(()=> import("./Components/mathComponent"),{
  ssr:false
})
export const TutorWordProblem = ({exercise}: {exercise: Exercise}) => {
  const textColor = useColorModeValue("dark","white")
  const itemBgColor = useColorModeValue("#bde3f8","#1A202C")
  const bgContentColor = useColorModeValue("white","#2D3748")
  const explanationBgColor = useColorModeValue("#feebc8","#080E1B")
  const bg = useColorModeValue("#2B4264","#1A202C")
  return(
    <>
      <Tabs isFitted variant='enclosed' width='100%' >
        <TabList >
          <Tab>Presentación</Tab>
          <Tab>Aprendizajes</Tab>
          <Tab>Ejercicio</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Center flexDirection="column">

              <Heading size="lg" pb="12"> {exercise?.presentation.title}</Heading>
              <Image w={['sm','md']} src={exercise.presentation.urlImg} alt="Imagen de presentación"/>
            </Center>
          </TabPanel>
          <TabPanel>
            <Center width='100%' flexDirection="column" >
              {exercise.learningObjetives.title}
              <br/>
              <GraphComp></GraphComp>
              
              
              <Box width='100%' bg='green' display='flex' justifyContent='center'>
                hola
              </Box>
            </Center>
           
          </TabPanel>

          <TabPanel>
            <Flex flexDirection='column' alignItems='center'>
              {exercise.statement 
              && <Box textAlign='left'>{exercise.statement}</Box> 
              }
              {exercise.table 
              && 
              <Box
              marginY={5}
              shadow="sm"
              rounded="lg"
              w="auto"
              overflowX="auto"
              >
                <Table 
                variant="striped"     
                size='sm'
                borderColor={textColor}
                >
                  <TableCaption>{exercise.table.tableCaption}</TableCaption>
                  <Thead bgColor={bg}>
                    <Tr>
                      {exercise.table.header.map((head, index) =>{
                        return(
                          <Th key={index} textAlign={head.align as textAlign } color='white' fontWeight="bold">
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
                              <Td key={i} textAlign={exercise.table.alignRows} >
                                {<Latex strict>{value}</Latex>}
                              </Td>
                            )
                          })}
                        </Tr>
                      )
                    })}
                  </Tbody>
                </Table>
              </Box> 
              }
              {exercise.img
                &&
                <Image src={exercise.img} w="md" paddingY={5} alt="Imagen del ejercicio"/>
                
              }
              {exercise.text 
                && 
                <Box width="100%" textAlign="left" >
                  <Latex>{exercise.text}</Latex>
                  
                </Box>
              }

              <Accordion allowMultiple pt="12px" w='90%'>
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
                      <AccordionPanel bg={bgContentColor}>
                        {ques.steps.map((step,index) => {
                          return(
                            <Accordion allowMultiple key={index}  >
                              {step.stepExplanation && 
                              <CardInfo text={step.stepExplanation}  bgColor= {explanationBgColor} hideCard={false}></CardInfo>
                              }
                              <AccordionItem bgColor={itemBgColor} isDisabled={false}>
                                <h2>
                                  <AccordionButton _expanded={{ bg: '#2B4264', color: 'white' }}>
                                    <Box as="span" flex="1" textAlign="left">
                                      {step.stepTitle}
                                    </Box>
                                    <AccordionIcon/>
                                  </AccordionButton>
                                </h2>
                                <AccordionPanel bg={bgContentColor}>
                                  <Box paddingTop={2}>
                                    {
                                      step.componentToAnswer.nameComponent === components.SLC 
                                        ? <SelectionComponent 
                                            correctMsg={step.correctMsg ?? "Muy bien!"} 
                                            hints={step.hints} 
                                            meta={step.componentToAnswer.meta as SelectionMeta }
                                          />
                                        : (step.componentToAnswer.nameComponent === components.MLC)
                                        ? <MathComponent 
                                            correctMsg={step.correctMsg ?? "Muy bien!"} 
                                            hints={step.hints} 
                                            meta={step.componentToAnswer.meta as MathComponentMeta}
                                          />
                                        :(step.componentToAnswer.nameComponent === components.GHPC)
                                        ? <JSXGraphComponent 
                                            hints={step.hints}
                                            meta={step.componentToAnswer.meta as GraphMeta}></JSXGraphComponent> 
                                        :<p>otro componente</p>
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

