import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { withAuth } from "../components/Auth";
import { useState } from "react";
import React from "react";

export default withAuth(function ProtectedStudentModel() {

    const steps = [
        {
            "stepId": "0",
            "KCs": [2],
            "expression": "ax + bx + ay + by",
            "stepTitle": "Agrupar los sumandos",
            "displayResult": ["(ax + ay) + (bx + by)", "(ax + bx) + (ay + by)"],
            "hints": [
                {
                    "hintId": 0,
                    "hint": "agrupa los sumandos con los términos que se repiten"
                },
                { "hintId": 1, "hint": "agrupa los sumandos que contengan x" },
                {
                    "hintId": 2,
                    "hint": "los grupos a ingresar son: (ax + ay) + (bx + by)"
                }
            ],
            "matchingError": [
                {
                    "error": ["", ""],
                    "hintId": 3,
                    "hint": "No ha ingresado respuesta"
                },
                {
                    "error": ["", "*"],
                    "hintId": 4,
                    "hint": "No ha ingresado el primer grupo"
                },
                {
                    "error": ["*", ""],
                    "hintId": 5,
                    "hint": "No ha ingresado el segundo grupo"
                }
            ],
            "answers": [
                { "answer": ["ax+ay", "bx+by"], "nextStep": "1" },
                { "answer": ["ay+ax", "bx+by"], "nextStep": "1" },
                { "answer": ["ax+ay", "by+bx"], "nextStep": "1" },
                { "answer": ["ay+ax", "by+bx"], "nextStep": "1" },
                { "answer": ["ax+bx", "ay+by"], "nextStep": "2" },
                { "answer": ["bx+ax", "ay+by"], "nextStep": "2" },
                { "answer": ["ax+bx", "by+ay"], "nextStep": "2" },
                { "answer": ["bx+ax", "by+ay"], "nextStep": "2" }
            ],
            "incorrectMsg": "no se ha agrupado correctamente la expresión",
            "correctMsg": "Has agrupado los sumandos",
            "summary": "1) se agrupan los sumandos que contengan factores en común en dos grupos diferentes (este ejercicio puede desarrollarse de dos formas diferentes)"
        },
        {
            "stepId": "1",
            "expression": "(ax + ay) + (bx + by)",
            "stepTitle": "Ingresar factor común a cada grupo",
            "displayResult": [
                ["(a)", "(x+y)"],
                ["(b)", "(x+y)"]
            ],
            "KCs": [1],
            "hints": [
                {
                    "hintId": 0,
                    "hint": "El factor común del primer grupo es el término que se repite en ambos sumando del primer grupo"
                },
                { "hintId": 1, "hint": "El factor común del primer grupo es a" },
                { "hintId": 2, "hint": "Los factores comunes a ingresar son a y b" }
            ],
            "matchingError": [
                {
                    "error": ["", ""],
                    "hintId": 3,
                    "hint": "No ha ingresado respuesta"
                },
                {
                    "error": ["", "*"],
                    "hintId": 4,
                    "hint": "No ha factorizado el primer grupo"
                },
                {
                    "error": ["*", ""],
                    "hintId": 5,
                    "hint": "No ha factorizado el segundo grupo"
                }
            ],
            "answers": { "answer": ["a", "b"], "nextStep": "3" },
            "incorrectMsg": "factor común incorrecto, ingrese el factor común correspondiente a la expresión dada",
            "correctMsg": "Has encontrado el factor común",
            "summary": "2) De los grupos creados en el paso anterior, se busca el factor común a cada grupo"
        },
        {
            "stepId": "2",
            "expression": "(ax + bx) + (ay + by)",
            "stepTitle": "Ingresar factor común a cada grupo",
            "displayResult": [
                ["(x)", "(a+b)"],
                ["(y)", "(a+b)"]
            ],
            "KCs": [1],
            "hints": [
                {
                    "hintId": 0,
                    "hint": "El factor común del primer grupo es el término que se repite en ambos sumando del primer grupo"
                },
                { "hintId": 1, "hint": "El factor común del primer grupo es x" },
                { "hintId": 2, "hint": "Los factores comunes a ingresar son x e y" }
            ],
            "matchingError": [
                {
                    "error": ["", ""],
                    "hintId": 3,
                    "hint": "No ha ingresado respuesta"
                },
                {
                    "error": ["", "*"],
                    "hintId": 4,
                    "hint": "No ha factorizado el primer grupo"
                },
                {
                    "error": ["*", ""],
                    "hintId": 5,
                    "hint": "No ha factorizado el segundo grupo"
                }
            ],
            "answers": { "answer": ["x", "y"], "nextStep": "4" },
            "incorrectMsg": "factor común incorrecto, ingrese el factor común correspondiente a la expresión dada",
            "correctMsg": "Haz encontrado el factor común",
            "summary": "2) De los grupos creados en el paso anterior, se busca el factor común a cada grupo"
        },
        {
            "stepId": "3",
            "expression": "a(x+y)+b(x+y)",
            "stepTitle": "Ingresar factor común de toda la expresión",
            "displayResult": "(a+b)",
            "hints": [
                {
                    "hintId": 0,
                    "hint": "Ver variables que se repite en ambos sumandos"
                },
                { "hintId": 1, "hint": "El factor común es una suma de variables" },
                { "hintId": 2, "hint": "El factor común de la expresión es: x + y" }
            ],
            "matchingError": [
                { "error": [""], "hintId": 3, "hint": "No ha ingresado respuesta" }
            ],
            "answers": [{ "answer": "x+y", "nextStep": null }],
            "incorrectMsg": "factor común incorrecto, ingrese el factor común correspondiente a la expresión dada",
            "correctMsg": "Haz encontrado el factor común  compuesto",
            "summary": "3) Finalmente se factoriza por factor común la expresión general"
        },
        {
            "stepId": "4",
            "expression": "x(a+b)+y(a+b)",
            "stepTitle": "Ingresar factor común de toda la expresión",
            "displayResult": "(x+y)",
            "KCs": [1],
            "hints": [
                {
                    "hintId": 0,
                    "hint": "Ver variables que se repite en ambos sumandos"
                },
                { "hintId": 1, "hint": "El factor común es una suma de variables" },
                { "hintId": 2, "hint": "El factor común de la expresión es: a + b" }
            ],
            "matchingError": [
                { "error": [""], "hintId": 3, "hint": "No ha ingresado respuesta" }
            ],
            "answers": [{ "answer": "a+b", "nextStep": null }],
            "incorrectMsg": "factor común incorrecto, ingrese el factor común correspondiente a la expresión dada",
            "correctMsg": "Has factorizado por factor común compuesto",
            "summary": "3) Finalmente se factoriza por factor común la expresión general"
        }
    ]

    const [nStep, setNstep] = useState(1)
    const [openStep, setOpenStep] = useState(0)


    const ItemArray = ({ element, key }: any) => {
        console.log(key)
        return (
            <AccordionItem key={key} >
                <h2>
                    <AccordionButton onClick={() => {
                        setOpenStep(Number(element.stepId))
                    }}>
                        <Box as="span" flex='1' textAlign='left'>
                            Section {Number(element.stepId)}
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4} >
                    Contenido del panel
                </AccordionPanel>
            </AccordionItem>
        );
    };

    return (
        <Stack p={8} width={"100%"}>
            <Accordion defaultIndex={0} allowToggle index={openStep}>
                {steps.slice(0, nStep).map((element, index) => (
                    console.log(steps),
                    <ItemArray key={index} element={element} />
                ))}
            </Accordion>
            <Button onClick={() => setNstep(nStep + 1)}>Agregar Paso</Button>
        </Stack>
    );
});