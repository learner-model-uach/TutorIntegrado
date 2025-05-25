import React from "react";
import { withAuth } from "../components/Auth";
import { useGQLQuery } from "rq-gql";
import { gql } from "../graphql";
import { LoadingOverlay } from "../components/challenge/LoadingOverlay";

const queryGetActions = gql(`
    query getActions2($input: ActionsTopicInput!, $pagination: CursorConnectionArgs!) {
          actionsTopic {
            allActionsByContent(input: $input, pagination: $pagination) {
              nodes {
                actions {
                  timestamp
                  id
                  extra
                  content {
                    code
                    id
                  }
                  verb {
                    name
                  }
                  user {
                    email
                }
                topic {
                id
                code
                }
                }
              }
            }
          }
        }
    `);

const queryGetChallenges = gql(/* GraphQL */ `
  query GetChallenges2($challengesIds: [IntID!]!) {
    challenges(ids: $challengesIds) {
      code
      content {
        code
        id
        json
        kcs {
          code
          id
        }
      }
      description
      enabled
      endDate
      groups {
        code
        id
        projectsIds
        tags
        users {
          email
          id
          name
          role
          tags
        }
      }
      id
      projectId
      startDate
      tags
      title
      topics {
        id
        code
        kcs {
          id
          code
        }
      }
    }
  }
`);

const DownloadJsonButton = ({ jsonData, fileName = "data.json" }) => {
  const downloadJson = () => {
    // Convertir el objeto JSON a string
    const jsonString = JSON.stringify(jsonData, null, 2);

    // Crear un blob con los datos
    const blob = new Blob([jsonString], { type: "application/json" });

    // Crear un enlace de descarga
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    // Simular click en el enlace
    document.body.appendChild(link);
    link.click();

    // Limpiar
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return <button onClick={downloadJson}>Descargar JSON</button>;
};

//-------------------------
export default withAuth(function GetData() {
  const { data: dataChallenges, isLoading: isChallengesLoading } = useGQLQuery(
    queryGetChallenges,
    {
      challengesIds: ["25", "26", "27", "28"],
    },
    {
      staleTime: 0,
      cacheTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
  );

  const {
    data: actionsData,
    isLoading: actionsLoading,
    // error: actionsError,
  } = useGQLQuery(queryGetActions, {
    input: {
      endDate: "2025-12-31T12:00:00.000Z", // El 31 de Diciembre del 2025
      projectId: 4,
      startDate: "2025-03-01T00:00:00.000Z", // El 1 de Marzo del 2025
      verbNames: [
        "challengeContentCompleted",
        "challengeCompleted",
        "challengeUpdate",
        "challengeCreate",
        "challengeLoad",
        "challengePublish",
      ], // lo usan los estudiantes: challengeContentCompleted, challengeCompleted. Lo usan los profesores: challengeUpdate, challengeCreate, challengePublish. Lo usan estudiantes y profesores: challengeLoad
      topicsIds: [44, 4, 31, 19, 68, 24, 52], // mismo topicos usados para el modulo desafío
    },
    pagination: { last: 1 },
  });

  console.log("dataChallenge", dataChallenges);
  console.log("actionsData", actionsData);
  //--------------------------------------------

  const isAnythingLoading = isChallengesLoading || actionsLoading;

  if (isAnythingLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div>
      <h1>Guardar JSON de desafíos en el PC</h1>
      <DownloadJsonButton jsonData={dataChallenges} fileName="mis-datos.json" />
      <h1>Guardar JSON de acticiones en el PC</h1>
      <DownloadJsonButton jsonData={actionsData} fileName="mis-datos.json" />
    </div>
  );
});
