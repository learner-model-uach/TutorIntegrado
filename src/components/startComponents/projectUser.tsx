import { Avatar, Box, Button, Heading, HStack, Highlight, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useGQLQuery } from "rq-gql";
import { useRef } from "react";
import { FaArrowRight, FaBookOpen, FaHistory, FaPencilAlt } from "react-icons/fa";
import { gql } from "../../graphql";
import { useAuth } from "../Auth";

const RECENT_ACTIVITY_QUERY = gql(/* GraphQL */ `
  query RecentProjectUserActivity($input: ActionsTopicInput!, $pagination: CursorConnectionArgs!) {
    actionsTopic {
      firstUsers: allActionsByUser(input: $input, pagination: $pagination) {
        nodes {
          id
          email
          actions {
            id
            timestamp
            topic {
              label
              parent {
                label
              }
            }
            content {
              label
              code
              topics {
                label
                parent {
                  label
                }
              }
            }
          }
        }
      }
      lastUsers: allActionsByUser(input: $input, pagination: { last: 50 }) {
        nodes {
          id
          email
          actions {
            id
            timestamp
            topic {
              label
              parent {
                label
              }
            }
            content {
              label
              code
              topics {
                label
                parent {
                  label
                }
              }
            }
          }
        }
      }
    }
  }
`);

const ACTIVITY_VERBS = [
  "displaySubTopics",
  "displaySelection",
  "selectTopic",
  "selectSubtopic",
  "selectContent",
  "loadContent",
  "tryStep",
  "requestHint",
  "openStep",
  "closeStep",
  "completeContent",
  "nextContent",
  "challengeLoad",
  "challengeCompleted",
  "challengeContentCompleted",
  "pollResponse",
  "selectionRating",
  "DisplayHelp",
];

function formatRecentActivity(timestamp?: number | string, topicLabel?: string) {
  if (!timestamp || !topicLabel) return "Sin actividad reciente";

  const activityDate = new Date(Number(timestamp));
  const currentDate = new Date();

  const isToday =
    activityDate.getFullYear() === currentDate.getFullYear() &&
    activityDate.getMonth() === currentDate.getMonth() &&
    activityDate.getDate() === currentDate.getDate();

  if (isToday) {
    return `Hoy en ${topicLabel}`;
  }

  const formattedDate = new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })
    .format(activityDate)
    .replace(/\//g, "-");

  return `${formattedDate} en ${topicLabel}`;
}

function getActionTopicLabel(action?: {
  topic?: {
    label?: string | null;
    parent?: { label?: string | null } | null;
  } | null;
  content?: {
    topics?: Array<{
      label?: string | null;
      parent?: { label?: string | null } | null;
    } | null> | null;
  } | null;
}) {
  return (
    action?.topic?.parent?.label ||
    action?.topic?.label ||
    action?.content?.topics?.[0]?.parent?.label ||
    action?.content?.topics?.[0]?.label ||
    undefined
  );
}

function getActionContentLabel(action?: {
  content?: {
    label?: string | null;
    code?: string | null;
  } | null;
}) {
  return action?.content?.label || action?.content?.code || undefined;
}

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactElement;
}) {
  return (
    <Box
      flex="1"
      minW={{ base: "100%", md: "180px" }}
      // bg="whiteAlpha.700"
      bg={{ base: "whiteAlpha.700", _dark: "gray.900" }}
      borderWidth="1px"
      borderColor="whiteAlpha.400"
      borderRadius="2xl"
      px={{ base: 4, md: 5 }}
      py={{ base: 4, md: 5 }}
      backdropFilter="blur(8px)"
    >
      <HStack gap="3" align="flex-start">
        <Box
          color="white"
          bg="tangerine.500"
          borderRadius="xl"
          p="3"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
        >
          {icon}
        </Box>
        <Box>
          <Text fontSize="sm" color="text_info" opacity={0.75}>
            {label}
          </Text>
          <Text color="heading" fontSize={{ base: "md", md: "lg" }} fontWeight="semibold">
            {value}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
}

export const AssigndUser = () => {
  const { user, project } = useAuth();
  const recentActivityEndDate = useRef(new Date().toISOString());

  const userName = user?.name?.trim().split(/\s+/)[0] || "usuario";
  const userEmail = user?.email || "Correo no disponible";
  const groupIds = user?.groups?.map(group => Number(group.id)) ?? [];

  const {
    data: recentActivityData,
    isLoading: isRecentActivityLoading,
    isError: isRecentActivityError,
  } = useGQLQuery(
    RECENT_ACTIVITY_QUERY,
    {
      input: {
        endDate: recentActivityEndDate.current,
        groupIds: groupIds.length ? groupIds : undefined,
        projectId: Number(project?.id),
        startDate: "2025-01-01T00:00:00.000Z",
        verbNames: ACTIVITY_VERBS,
      },
      pagination: { first: 50 },
    },
    {
      enabled: Boolean(project?.id && user?.id),
      refetchOnWindowFocus: false,
    },
  );

  const actionNodes = [
    ...(recentActivityData?.actionsTopic?.firstUsers?.nodes ?? []),
    ...(recentActivityData?.actionsTopic?.lastUsers?.nodes ?? []),
  ];

  const currentUserActions = actionNodes
    .filter(node => String(node.id) === String(user?.id) || node.email === userEmail)
    .flatMap(node => node.actions ?? [])
    .slice()
    .sort((actionA, actionB) => Number(actionB.timestamp) - Number(actionA.timestamp));

  const currentUserTopicActions = currentUserActions
    .filter(action => Boolean(getActionTopicLabel(action)))
    .slice()
    .sort((actionA, actionB) => Number(actionB.timestamp) - Number(actionA.timestamp));

  const currentUserContentActions = currentUserActions
    .filter(action => Boolean(getActionContentLabel(action)))
    .slice()
    .sort((actionA, actionB) => Number(actionB.timestamp) - Number(actionA.timestamp));

  const recentActivityValue = isRecentActivityLoading
    ? "Buscando actividad..."
    : isRecentActivityError
      ? "Sin actividad reciente"
      : formatRecentActivity(
          currentUserTopicActions?.[0]?.timestamp,
          getActionTopicLabel(currentUserTopicActions?.[0]),
        );

  const lastExerciseValue = isRecentActivityLoading
    ? "Buscando ejercicio..."
    : isRecentActivityError
      ? "Sin ejercicios recientes"
      : getActionContentLabel(currentUserContentActions?.[0]) || "Sin ejercicios recientes";

  return (
    <Stack width="100%" px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
      <Box
        width="100%"
        borderRadius={{ base: "2xl", md: "3xl" }}
        overflow="hidden"
        bg={{ base: "gray.200", _dark: "indigo.950" }}
      >
        <Stack
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 6, lg: 10 }}
          align={{ base: "stretch", lg: "center" }}
          px={{ base: 5, md: 8, lg: 10 }}
          py={{ base: 6, md: 8 }}
        >
          <Stack flex="1" gap="5">
            <HStack gap="4" align={{ base: "flex-start", md: "center" }}>
              <Avatar.Root size="2xl" variant="subtle">
                <Avatar.Fallback name={user?.name || ""} />
                <Avatar.Image src={user?.picture || ""} />
              </Avatar.Root>

              <Stack gap="1">
                <Text
                  color="tangerine.600"
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                  fontSize="sm"
                >
                  Tu espacio de aprendizaje
                </Text>
                <Heading
                  color="heading"
                  fontWeight="bold"
                  fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                  lineHeight={1.05}
                >
                  Hola, {userName}
                </Heading>
              </Stack>
            </HStack>

           
            <Text maxW="3xl" fontSize={{ base: "md", md: "lg" }} color="text_info">
              <Highlight
                query="Tutor Inteligente"
                styles={{ px: "0.5", color: "tangerine.600", fontWeight: "semibold" }}
              >
                Mateo es un Tutor Inteligente que te ayuda a aprender y ejercitar tus habilidades de
                resolución de problemas, paso a paso. Esta plataforma te permitirá practicar
                resolviendo ejercicios de diversos tópicos en el curso de Álgebra para Ingeniería.
              </Highlight>
            </Text>
            <Text maxW="3xl" fontSize={{ base: "md", md: "lg" }} color="text_info">
              <Highlight
                query="tópico"
                styles={{ px: "0.5", color: "tangerine.600", fontWeight: "semibold" }}
              >
                Para comenzar escoje un tópico en barra de navegación izquierda.
              </Highlight>
            </Text>

            <HStack flexWrap="wrap" gap="4" align="stretch">
              <InfoCard
                label="Actividad Reciente"
                value={recentActivityValue}
                icon={<FaHistory aria-hidden="true" />}
              />
              <InfoCard
                label="Último Ejercicio Realizado"
                value={lastExerciseValue}
                icon={<FaBookOpen aria-hidden="true" />}
              />
              <InfoCard
                label="Ejercicios Completados"
                value={"-"}
                icon={<FaPencilAlt aria-hidden="true" />}
              />
            </HStack>
          </Stack>

          <Box
            w={{ base: "100%", lg: "360px" }}
            borderRadius="2xl"
            bg="bg.secondary"
            borderWidth="1px"
            borderColor="border"
            // boxShadow="lg"
            p={{ base: 5, md: 6 }}
          >
            <Stack gap="4">
              <Text fontSize="sm" fontWeight="bold" color="tangerine.600" textTransform="uppercase">
                Acceso rápido
              </Text>

              {/* <Box>
                <Text fontSize="sm" color="text_info" opacity={0.75}>
                  Correo asociado
                </Text>
                <HStack gap="2" mt="1" color="heading" align="flex-start">
                  <Box pt="1">
                    <FaEnvelope aria-hidden="true" />
                  </Box>
                  <Text fontWeight="medium" wordBreak="break-word">
                    {userEmail}
                  </Text>
                </HStack>
              </Box>

              <Separator /> */}

              <Stack gap="3">
                <Button asChild bg="tangerine.500" color="white" borderRadius="2xl" size="lg">
                  <NextLink href="/challenge">
                    Ir a desafíos <FaArrowRight />
                  </NextLink>
                </Button>

                <Button
                  asChild
                  bg="tangerine.500"
                  color="white"
                  borderRadius="2xl"
                  size="lg"
                  variant="outline"
                >
                  <NextLink href="/challenge">
                    Ver Mi progreso
                    <FaArrowRight />
                  </NextLink>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  borderRadius="2xl"
                  size="lg"
                  colorPalette="orange"
                >
                  <NextLink href="/tutorial">Ver tutorial</NextLink>
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};
