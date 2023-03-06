import { useRouter } from "next/router";
import { SimpleGrid, Center, Text, useColorModeValue, Checkbox } from "@chakra-ui/react";
import { useUpdateModel } from "../utils/updateModel";
import { useEffect, useState } from "react";
import { useAuth, withAuth } from "../components/Auth";
import { useGQLQuery } from "rq-gql";
import { gql } from "../graphql";
import { CardSelectionDynamic } from "../components/contentSelectComponents/CardSelectionDynamic";
import type { ExType } from "../components/lvltutor/Tools/ExcerciseType";
//import { CompleteTopic } from "../components/contentSelectComponents/CompleteTopic";
import { useAction } from "../utils/action";
import { Card } from "../components/Card";

export default withAuth(function ContentSelect() {
  const { user, project } = useAuth();
  const router = useRouter();
  const topics = router.query.topic?.toString() || ""; //topics in array
  const registerTopic = router.query.registerTopic + ""; //topics in array
  const nextContentPath = router.asPath + ""; //topics in array
  const domainId = "1";

  //problema!!! ver en detalle.

  const { data, isLoading, isError } = useGQLQuery(
    gql(/* GraphQL */ `
      query ProjectData($input: ContentSelectionInput!) {
        contentSelection {
          contentSelected(input: $input) {
            contentResult {
              P {
                id
                code
                json
                kcs {
                  code
                }
                description
                label
              }
              Msg {
                label
                text
              }
              Order
              Preferred
            }
            model
            newP
            PU
            pAVGsim
            pAVGdif
            tableSim {
              contentCode
              sim
              diff
              probSuccessAvg
              probSuccessMult
            }
            tableDifEasy {
              contentCode
              sim
              diff
              probSuccessAvg
              probSuccessMult
            }
            tableDifHarder {
              contentCode
              sim
              diff
              probSuccessAvg
              probSuccessMult
            }
            topicCompletedMsg {
              label
              text
            }
          }
        }
      }
    `),
    {
      input: {
        domainId,
        projectId: project.id,
        userId: user.id,
        topicId: topics.split(","),
        discardLast: 2,
      },
    },
    {
      refetchOnWindowFocus: false,
      //refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );
  const contentResult = data?.contentSelection?.contentSelected?.contentResult.sort((a, b) => {
    return parseInt(a.Order) - parseInt(b.Order);
  });
  console.log(isError);
  console.log(data?.contentSelection?.contentSelected);

  const bestExercise =
    !isLoading &&
    !isError &&
    ((contentResult ?? [])
      .map(x => x.Preferred)
      .reduce((out, bool, index) => (bool ? out.concat(index) : out), [])[0] ??
      0);

  const experimentGroup =
    !isError && user.tags.indexOf("joint-control") >= 0 ? "joint-control" : "tutor-control";

  const selectionData =
    !isLoading &&
    !isError &&
    (experimentGroup == "tutor-control"
      ? [
          {
            optionCode: contentResult[bestExercise].P.code,
            optionTitle: contentResult[bestExercise].Msg.label,
            optionBest: true,
            optionSelected: false,
          },
        ]
      : (contentResult ?? []).map((content, index) => {
          return {
            optionCode: content.P.code,
            optionTitle: content.Msg.label,
            optionBest: index == bestExercise,
            optionSelected: false,
          };
        }));

  const action = useAction();
  useEffect(() => {
    data &&
      action({
        verbName: "displaySelection",
        topicID: registerTopic,
        extra: { selectionData },
      });
  }, [data]); //duplicate Action :c
  const json = {
    code: "tc4",
    meta: {},
    text: "Factorice la expresión de la forma: 𝑎(x - x₁)(x - x₂)",
    type: "ftc5s",
    steps: [
      {
        KCs: ["IdeCoef"],
        hints: [
          {
            hint: "El valor de a es el coeficiente de x² y el valor de b es el coeficiente de x",
            hintId: 0,
          },
          { hint: "El valor de a es 1 y el valor de b es -2", hintId: 1 },
          { hint: "a=1, b=-2, c=5", hintId: 2 },
        ],
        stepId: "0",
        answers: [{ answer: ["1", "-2", "5"], nextStep: "1" }],
        summary:
          "1) Para factorizar la expresión de la forma a(x - x₁)(x - x₂), es necesario determinar los valores de a, x₁ y x₂. Donde x₁, x₂ son las soluciones de la ecuación ax² + bx + c = 0. Por lo tanto, para llevar a cabo esta factorización, se debe identificar los valores de a, b y c.",
        stepTitle: "Identificar coeficientes 𝑎, 𝑏 y 𝑐",
        correctMsg: "Has identificado los valores de a, b y c",
        expression: "x^2-2x+5",
        incorrectMsg: "No son los valores correspondientes a los valores a, b y c",
        displayResult: "a=1, b=-2, c=5",
        matchingError: [
          { hint: "No ha ingresado respuesta", error: ["", "", ""], hintId: 3 },
          { hint: "No ha ingresado el valor de 𝑎", error: ["", "*", "*"], hintId: 4 },
          { hint: "No ha ingresado el valor de 𝑏", error: ["*", "", "*"], hintId: 5 },
          { hint: "No ha ingresado el valor de 𝑐", error: ["*", "*", ""], hintId: 6 },
        ],
      },
      {
        KCs: ["CalDis"],
        hints: [
          {
            hint: "Utilice la fórmula para calcular Δ usando los coeficientes de la expresión cuadrática",
            hintId: 0,
          },
          { hint: "Reemplace en la fórmula Δ los valores de: a=1, b=-2, c=5", hintId: 1 },
          { hint: "El valor del discriminante (Δ) es -16", hintId: 2 },
        ],
        stepId: "1",
        answers: [{ answer: "-16", nextStep: "2" }],
        summary:
          "2) Ya con los valores de a, b y c se puede calcular x₁ y x₂ con la fórmula x₁ = (-b + √Δ)/(2a), x₂ = (-b - √Δ)/(2a). Entonces es necesario calcular el discriminante Δ=b²-4ac",
        stepTitle: "Calcular discriminante  Δ = b² - 4ac",
        correctMsg: "Has calculado correctamente el discriminante",
        expression: "a=1, b=-2, c=5",
        incorrectMsg: "No se ha ingresado correctamente el discriminante de la expresión",
        displayResult: "Δ=-16",
        matchingError: [{ hint: "No ha ingresado respuesta", error: [""], hintId: 3 }],
      },
      {
        KCs: ["IdeTipSol"],
        hints: [
          {
            hint: "Recuerda que el discriminante determina si el trinomio tiene soluciones reales o complejas conjugadas",
            hintId: 0,
          },
          { hint: "Como el discriminante es menor a cero, ver a qué caso corresponde", hintId: 1 },
          {
            hint: "Δ<0, por lo tanto este ejercicio posee dos raíces complejas conjugadas",
            hintId: 2,
          },
        ],
        stepId: "2",
        answers: [{ answer: "3", nextStep: null }],
        summary:
          "3) Si Δ>0 posee dos raices reales diferentes, si Δ=0 posee dos raices reales iguales y Δ<0 posee raices complejas conjugadas, aquí:",
        stepTitle: "¿A qué caso corresponde el discriminante?",
        correctMsg:
          "Has descubierto a que caso corresponde el discriminante.  Sin embargo, este ejercicio se resuelve con valores complejos",
        expression: "Δ=-16",
        incorrectMsg: "Caso mal ingresado",
        displayResult: "Δ<0, por lo tanto este ejercicio posee dos raíces complejas conjugadas",
        matchingError: [
          { hint: "Debe seleccionar la alternativa correcta", error: ["*"], hintId: 3 },
        ],
      },
    ],
    title: "Trinomios cuadráticos.",
    selectSteps: false,
  };
  //test with teachers
  const [displayStar, setDisplayStar] = useState(false);
  const [displayProb, setDisplayProb] = useState(false);

  return (
    <>
      <p>{router.asPath}</p>
      <p>Selección del contenido del tópico: {topics}</p>
      {isError ? (
        <p>Error al cargar datos</p>
      ) : (
        <SimpleGrid
          columns={{
            lg: 1,
            xl: experimentGroup != "joint-control" ? 1 : (contentResult ?? []).length,
          }}
          spacing="8"
          p="10"
          textAlign="center"
          rounded="lg"
        >
          {
            //agregar componente de tópico completado
            !isLoading ? (
              experimentGroup == "tutor-control" ? (
                <Center>
                  <CardSelectionDynamic
                    id={contentResult[bestExercise]?.P.id}
                    code={contentResult[bestExercise]?.P.code}
                    json={contentResult[bestExercise]?.P.json as unknown as ExType}
                    description={contentResult[bestExercise]?.P.description}
                    label={contentResult[bestExercise]?.P.label}
                    kcs={contentResult[bestExercise]?.P.kcs}
                    selectionTitle={contentResult[bestExercise]?.Msg.label}
                    selectionText={contentResult[bestExercise]?.Msg.text}
                    selectionBest={false}
                    registerTopic={registerTopic}
                    nextContentPath={nextContentPath}
                    selectionData={selectionData}
                    indexSelectionData={0}
                    displayStar={displayStar}
                    key={0}
                  ></CardSelectionDynamic>
                </Center>
              ) : (
                <>
                  {contentResult.length > 1
                    ? contentResult?.map((content, index) => (
                        <CardSelectionDynamic
                          id={content.P.id}
                          code={content.P.code}
                          json={content.P.json as unknown as ExType}
                          description={content.P.description}
                          label={content.P.label}
                          kcs={content.P.kcs}
                          selectionTitle={content.Msg.label}
                          selectionText={content.Msg.text}
                          selectionBest={index == bestExercise}
                          registerTopic={registerTopic}
                          nextContentPath={nextContentPath}
                          selectionData={selectionData}
                          indexSelectionData={index}
                          displayStar={displayStar}
                          key={index}
                        ></CardSelectionDynamic>
                      ))
                    : contentResult?.map((content, index) => (
                        <Center key={index + "center"}>
                          <CardSelectionDynamic
                            id={content.P.id}
                            code={content.P.code}
                            json={content.P.json as unknown as ExType}
                            description={content.P.description}
                            label={content.P.label}
                            kcs={content.P.kcs}
                            selectionTitle={content.Msg.label}
                            selectionText={content.Msg.text}
                            selectionBest={index == bestExercise}
                            registerTopic={registerTopic}
                            nextContentPath={nextContentPath}
                            selectionData={selectionData}
                            indexSelectionData={index}
                            displayStar={displayStar}
                            key={index}
                          ></CardSelectionDynamic>
                        </Center>
                      ))}
                </>
              )
            ) : (
              <Text>Cargando ejercicios</Text>
            )
          }
        </SimpleGrid>
      )}
      <Checkbox isChecked={displayStar} onChange={e => setDisplayStar(e.target.checked)}>
        {" "}
        Mostrar opción recomendada del sistema
      </Checkbox>

      <Checkbox isChecked={displayProb} onChange={e => setDisplayProb(e.target.checked)}>
        {" "}
        Mostrar probabilidad de saber el ejercicio
      </Checkbox>

      {displayProb && (
        <Card
          bg={useColorModeValue("blue.700", "gray.800")}
          _hover={{
            color: "white",
            bg: useColorModeValue("blue.900", "gray.600"),
          }}
          color="white"
        >
          <Text>
            Mas Fácil: {data?.contentSelection?.contentSelected?.tableDifEasy[0]?.probSuccessAvg}
          </Text>
          <Text>
            Similar: {data?.contentSelection?.contentSelected?.tableSim[0]?.probSuccessAvg}
          </Text>
          <Text>
            Más Dificil:{" "}
            {data?.contentSelection?.contentSelected?.tableDifHarder[0]?.probSuccessAvg}
          </Text>
        </Card>
      )}
    </>
  );
});
