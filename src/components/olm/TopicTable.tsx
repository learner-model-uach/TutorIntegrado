import React, { useMemo } from "react";
import { Table, Center, Box, Text } from "@chakra-ui/react";
import { ImUsers } from "react-icons/im";
import { useSnapshot } from "valtio";
import { useAuth } from "../Auth";
import { gSelect } from "../GroupSelect";
import { useGQLQuery } from "rq-gql";
import { progressCal } from "../progressbar/progressCal";
import TopicAccordionRow from "./TopicAccordionRow";
import { useSubtopics, PARENT_IDS, useKcsByTopics } from "./hooks/useOlmTopics";
import { useUserModel, useGroupModel } from "./hooks/useOlmModels";
import { useUserActions } from "./hooks/useOlmActions";
import { Tooltip } from "../ui/tooltip";
import type { Topic } from "./types";
import { isTryStepActionExtra } from "./types";
import { aggregateCompleteContentActions } from "./helpers/actionAggregates";
import TopicAccordionRowSkeleton from "./TopicAccordionRowSkeleton";
import { getStableProgressEndDate } from "./utils/progressQueryDates";

const OLM_STALE_TIME = 5 * 60 * 1000;

type TopicTableProps = {
  showGroupProgress?: boolean;
  showEfficiency?: boolean;
  showEffort?: boolean;
};

export default function TopicTable({
  showGroupProgress = true,
  showEfficiency = true,
  showEffort = true,
}: TopicTableProps) {
  const { user, isLoading: authLoading, project } = useAuth();
  const groupSelection = useSnapshot(gSelect);
  const parentIds = PARENT_IDS;
  const { topics: subtopics, isLoading: subtopicLoading } = useSubtopics(parentIds);
  const { modelData: userModel, isLoading: userModelLoading } = useUserModel(user?.id);
  const selectedGroup = showGroupProgress ? (groupSelection.group ?? user?.groups?.[0]) : undefined;
  const { modelData: groupModel, isLoading: groupModelLoading } = useGroupModel(
    selectedGroup?.id,
    project?.code,
  );

  const topicCodes = useMemo(() => {
    return subtopics.flatMap(t => t.childrens?.map(c => c.code) ?? []);
  }, [subtopics]);

  const { kcByTopic, isLoading: exerciseLoading } = useKcsByTopics(topicCodes);
  const endDate = useMemo(() => getStableProgressEndDate(), []);
  const {
    data: dataActions,
    isLoading: actionsLoading,
    error: actionsError,
  } = useGQLQuery(
    useUserActions,
    { endDate, verbNames: ["completeContent"] },
    {
      staleTime: OLM_STALE_TIME,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const {
    data: tryStepData,
    isLoading: tryStepLoading,
    error: tryStepError,
  } = useGQLQuery(
    useUserActions,
    { endDate, verbNames: ["tryStep"] },
    {
      enabled: showEfficiency,
      staleTime: OLM_STALE_TIME,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const childIdSet = useMemo(() => {
    const set = new Set<number>();
    for (const t of subtopics) {
      for (const c of t.childrens ?? []) {
        if (c?.id != null) set.add(Number(c.id));
      }
    }
    return set;
  }, [subtopics]);

  const { exerciseCountsByChild, completeContentIds } = useMemo(() => {
    if (authLoading || actionsLoading || actionsError || !dataActions?.actionsTopic) {
      return {
        exerciseCountsByChild: {} as Record<number, number>,
        completeContentIds: new Set<string>(),
      };
    }

    return aggregateCompleteContentActions(dataActions, childIdSet);
  }, [authLoading, actionsLoading, actionsError, dataActions, childIdSet]);

  const { tryStepResult1ByChild, tryStepResult1NoHelpByChild } = useMemo(() => {
    if (
      !showEfficiency ||
      authLoading ||
      tryStepLoading ||
      tryStepError ||
      !tryStepData?.actionsTopic ||
      completeContentIds.size === 0
    ) {
      return {
        tryStepResult1ByChild: {} as Record<number, number>,
        tryStepResult1NoHelpByChild: {} as Record<number, number>,
      };
    }

    const byChildResult1: Record<number, number> = {};
    const byChildResult1NoHelp: Record<number, number> = {};

    for (const node of tryStepData.actionsTopic.allActionsByUser.nodes) {
      for (const a of node.actions) {
        // considerando result === 1
        if (a.result !== 1) continue;
        const contentId = a.content?.id;
        if (!contentId) continue;
        //se cuentan tryStep solo los contenidos que tienen completeContent
        if (!completeContentIds.has(contentId)) continue;
        // Extra puede que no exista
        const extra = isTryStepActionExtra(a.extra) ? a.extra : undefined;
        const attempts =
          typeof extra?.attempts === "number"
            ? extra.attempts
            : typeof extra?.attemps === "number"
              ? extra.attemps
              : undefined;
        const hints = typeof extra?.hints === "number" ? extra.hints : undefined;

        for (const t of a.content?.topics ?? []) {
          const childId = Number(t?.id);
          if (!Number.isFinite(childId)) continue;
          if (!childIdSet.has(childId)) continue; // sólo subtópicos válidos

          // A) conteo de todos los tryStep con result === 1
          byChildResult1[childId] = (byChildResult1[childId] ?? 0) + 1;

          // B) conteo sin ayuda: attempts=0, hints=0
          if (attempts === 0 && hints === 0) {
            byChildResult1NoHelp[childId] = (byChildResult1NoHelp[childId] ?? 0) + 1;
          }
        }
      }
    }

    return {
      tryStepResult1ByChild: byChildResult1,
      tryStepResult1NoHelpByChild: byChildResult1NoHelp,
    };
  }, [
    authLoading,
    tryStepLoading,
    tryStepError,
    tryStepData?.actionsTopic,
    childIdSet,
    completeContentIds,
    showEfficiency,
  ]);

  const efficiencyByChild = useMemo(() => {
    if (!showEfficiency) return {};

    const result: Record<number, number> = {};
    for (const key of Object.keys(tryStepResult1ByChild)) {
      const childId = Number(key);
      const A = tryStepResult1ByChild[childId] ?? 0; // result=1
      const B = tryStepResult1NoHelpByChild[childId] ?? 0; // result=1, sin hint

      if (A > 0) {
        result[childId] = B / A; // Eficiencia en [0..1]
      } else {
        result[childId] = 0; // si no hay A, entonces se define E=0
      }
    }
    return result;
  }, [showEfficiency, tryStepResult1ByChild, tryStepResult1NoHelpByChild]);

  const parentExerciseTotals = useMemo(() => {
    const totals: Record<number, number> = {};
    for (const parent of subtopics) {
      const parentId = Number(parent.id);
      totals[parentId] = (parent.childrens ?? []).reduce(
        (sum, child) => sum + (exerciseCountsByChild[Number(child.id)] ?? 0),
        0,
      );
    }
    return totals;
  }, [subtopics, exerciseCountsByChild]);

  const orderedTopics = useMemo(() => {
    return parentIds
      .map(id => subtopics.find(t => String(t.id) === id))
      .filter((topic): topic is Topic => Boolean(topic));
  }, [parentIds, subtopics]);

  const parentProgressByTopic = useMemo(() => {
    const progressByTopic: Record<string, { progress: number; groupProgress: number }> = {};

    for (const topic of orderedTopics) {
      const kcs = (topic.childrens ?? []).flatMap(child =>
        (kcByTopic[child.id] ?? []).map(kc => kc.code),
      );

      progressByTopic[String(topic.id)] = {
        progress: Math.round(progressCal(kcs, userModel) * 100),
        groupProgress:
          showGroupProgress && groupModel?.length
            ? Math.round(progressCal(kcs, groupModel) * 100)
            : 0,
      };
    }

    return progressByTopic;
  }, [groupModel, kcByTopic, orderedTopics, showGroupProgress, userModel]);

  if (authLoading || subtopicLoading || exerciseLoading || userModelLoading || groupModelLoading) {
    return (
      <Box w="full" minW={0}>
        <Text display={{ base: "block", md: "none" }} fontSize="xs" color="fg.muted" mb="2" px="1">
          Desliza horizontalmente para ver todos los detalles de la tabla.
        </Text>
        <Box
          w="full"
          minW={0}
          overflowX="auto"
          overflowY="hidden"
          pb="2"
          touchAction="auto"
          overscrollBehaviorX="contain"
          css={{ WebkitOverflowScrolling: "touch" }}
        >
          <Box w="full" minW={{ base: "720px", md: "100%" }} verticalAlign="top">
            <Table.Root
              variant="line"
              size="sm"
              width="100%"
              minW={{ base: "720px", md: "100%" }}
              css={{
                background: "transparent",
              }}
            >
              <Table.Body bg="transparent">
                {Array.from({ length: 8 }).map((_, index) => (
                  <TopicAccordionRowSkeleton key={index} />
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Box>
      </Box>
    );
  }
  return (
    <Box w="full" minW={0}>
      <Text display={{ base: "block", md: "none" }} fontSize="xs" color="fg.muted" mb="2" px="1">
        Desliza horizontalmente para ver todos los detalles de la tabla.
      </Text>
      <Box
        w="full"
        minW={0}
        overflowX="auto"
        overflowY="hidden"
        pb="2"
        touchAction="auto"
        overscrollBehaviorX="contain"
        css={{ WebkitOverflowScrolling: "touch" }}
      >
        <Box w="full" minW={{ base: "720px", md: "100%" }} verticalAlign="top">
          <Table.Root variant="line" size="sm" width="100%" minW={{ base: "720px", md: "100%" }}>
            <Table.Header>
              <Table.Row textStyle="xs" bg="bg.secondary">
                <Table.ColumnHeader></Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold" color={"heading"} htmlWidth="30%">
                  TÓPICOS
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  fontWeight="bold"
                  color={"heading"}
                  htmlWidth="20%"
                  textAlign="center"
                >
                  PROGRESO
                </Table.ColumnHeader>
                <Table.ColumnHeader htmlWidth="10%"></Table.ColumnHeader>
                {showGroupProgress && (
                  <Table.ColumnHeader
                    fontWeight="bold"
                    color={"heading"}
                    htmlWidth="5%"
                    textAlign="center"
                  >
                    <Center w="100%">
                      <Tooltip
                        showArrow
                        content="Mostrar progreso de grupo"
                        positioning={{ placement: "top" }}
                        contentProps={{ css: { "--tooltip-bg": "colors.gray.700" } }}
                      >
                        <ImUsers size={18} />
                      </Tooltip>
                    </Center>
                  </Table.ColumnHeader>
                )}
                <Table.ColumnHeader
                  htmlWidth="30%"
                  fontWeight="bold"
                  color={"heading"}
                  textAlign="end"
                >
                  <Text display={{ base: "none", md: "inline" }}>EJERCICIOS REALIZADOS</Text>
                  <Text display={{ base: "inline", md: "none" }}>EJERCICIOS</Text>
                </Table.ColumnHeader>
                <Table.ColumnHeader htmlWidth="5%"></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {orderedTopics.map((topic, index) => {
                const modelData = userModel;
                const groupModelData = groupModel;
                const parentProgress = parentProgressByTopic[String(topic.id)] ?? {
                  progress: 0,
                  groupProgress: 0,
                };
                return (
                  <TopicAccordionRow
                    key={topic.id}
                    topic={topic}
                    progress={parentProgress.progress}
                    groupProgress={parentProgress.groupProgress}
                    exerciseCount={parentExerciseTotals[Number(topic.id)] ?? 0}
                    defaultOpen={index === 0}
                    showGroupProgress={showGroupProgress}
                    showEfficiency={showEfficiency}
                    showEffort={showEffort}
                    model={modelData}
                    groupModel={showGroupProgress ? groupModelData : undefined}
                    kcsByTopic={kcByTopic}
                    exerciseCountsByChild={exerciseCountsByChild}
                    efficiencyByChild={efficiencyByChild}
                  />
                );
              })}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>
    </Box>
  );
}
