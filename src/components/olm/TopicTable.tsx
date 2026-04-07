import React, { useEffect, useState, useMemo } from "react";
import { Table, Spinner, Center, Box, Text } from "@chakra-ui/react";
import { ImUsers } from "react-icons/im";
import { useAuth } from "../Auth";
import { useGQLQuery } from "rq-gql";
import { progresscalc } from "../progressbar/progresscalc";
import TopicAccordionRow from "./TopicAccordionRow";
import { useSubtopics, PARENT_IDS, useKcsByTopics } from "./hooks/useOlmTopics";
import { useUserModel, useGroupModel } from "./hooks/useOlmModels";
import { useUserActions } from "./hooks/useOlmActions";
import { Tooltip } from "../ui/tooltip";
import type { Topic } from "./types";
import { isTryStepActionExtra } from "./types";
import { aggregateCompleteContentActions } from "./helpers/actionAggregates";

export default function TopicTable() {
  const { user, isLoading: authLoading, project } = useAuth();
  const parentIds = PARENT_IDS;
  const { topics: subtopics, isLoading: subtopicLoading } = useSubtopics(parentIds);
  const { modelData: userModel, isLoading: userModelLoading } = useUserModel(user?.id);
  const { modelData: groupModel, isLoading: groupModelLoading } = useGroupModel(
    user?.groups?.[0]?.id,
    project?.code,
  );
  const [topicCodes, setTopicCodes] = useState<string[]>([]);

  useEffect(() => {
    if (subtopics.length > 0) {
      const codes = subtopics.flatMap(t => t.childrens?.map(c => c.code) ?? []);
      setTopicCodes(codes);
    }
  }, [subtopics]);

  const { kcByTopic, isLoading: exerciseLoading } = useKcsByTopics(topicCodes);
  const endDate = useMemo(() => new Date().toISOString(), []);
  const {
    data: dataActions,
    isLoading: actionsLoading,
    error: actionsError,
  } = useGQLQuery(useUserActions, { endDate, verbNames: ["completeContent"] });

  const {
    data: tryStepData,
    isLoading: tryStepLoading,
    error: tryStepError,
  } = useGQLQuery(useUserActions, { endDate, verbNames: ["tryStep"] });

  const [completeContentIds, setCompleteContentIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (tryStepLoading || tryStepError || !tryStepData?.actionsTopic) return;
    console.log("RAW tryStepData:", tryStepData);
    const nodes = tryStepData.actionsTopic.allActionsByUser.nodes;
    console.log("NODES tryStep:", nodes);
    const tryStepActions = nodes.flatMap(node =>
      node.actions.map(a => ({
        verb: a.verb.name,
        result: a.result,
        extra: a.extra,
        contentId: a.content?.id,
        contentCode: a.content?.code,
        topicIds: a.content?.topics?.map(t => t.id),
        topicCodes: a.content?.topics?.map(t => t.code),
        topicLabels: a.content?.topics?.map(t => t.label),
      })),
    );
    console.log("TRYSTEP ACTIONS FLATTENED:", tryStepActions);
  }, [tryStepLoading, tryStepError, tryStepData]);
  // Complete Actions by subtopics
  const [excerciseCountsByChild, setExcerciseCountsByChild] = useState<Record<number, number>>({});
  const childIdSet = useMemo(() => {
    const set = new Set<number>();
    for (const t of subtopics) {
      for (const c of t.childrens ?? []) {
        if (c?.id != null) set.add(Number(c.id));
      }
    }
    return set;
  }, [subtopics]);

  // tryStep (result === 1) por subtópico
  const [tryStepResult1ByChild, setTryStepResult1ByChild] = useState<Record<number, number>>({});
  // tryStep (result === 1, attempts === 0, hints === 0) por subtópico
  const [tryStepResult1NoHelpByChild, setTryStepResult1NoHelpByChild] = useState<
    Record<number, number>
  >({});

  //Complete Content
  useEffect(() => {
    if (authLoading || actionsLoading || actionsError || !dataActions?.actionsTopic) return;
    const { exerciseCountsByChild, completeContentIds } = aggregateCompleteContentActions(
      dataActions,
      childIdSet,
    );
    setExcerciseCountsByChild(exerciseCountsByChild);
    setCompleteContentIds(completeContentIds);
  }, [authLoading, actionsLoading, actionsError, dataActions?.actionsTopic, childIdSet]);

  //se cuentan los tryStep solo si hay un completeContent

  useEffect(() => {
    if (authLoading || tryStepLoading || tryStepError || !tryStepData?.actionsTopic) return;
    if (completeContentIds.size === 0) return;
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
        const attempts = typeof extra?.attempts === "number" ? extra.attempts : undefined;
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
    setTryStepResult1ByChild(byChildResult1);
    setTryStepResult1NoHelpByChild(byChildResult1NoHelp);

    console.log("tryStep result=1 por subtópico:", byChildResult1);
    console.log("tryStep result=1, attempts=0, hints=0 por subrópico:", byChildResult1NoHelp);
  }, [authLoading, tryStepLoading, tryStepError, tryStepData?.actionsTopic, childIdSet]);

  const efficiencyByChild = useMemo(() => {
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
  }, [tryStepResult1ByChild, tryStepResult1NoHelpByChild]);

  // Count complete content by parent topic
  const getParentTotal = (parentId: number) => {
    const parent = subtopics.find(t => Number(t.id) === parentId);
    if (!parent) return 0;
    const childs = parent.childrens ?? [];
    return childs.reduce((sum, child) => sum + (excerciseCountsByChild[Number(child.id)] ?? 0), 0);
  };
  if (
    authLoading ||
    subtopicLoading ||
    exerciseLoading ||
    userModelLoading ||
    groupModelLoading ||
    tryStepLoading
  ) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }
  const orderedTopics = parentIds
    .map(id => subtopics.find(t => String(t.id) === id))
    .filter((topic): topic is Topic => Boolean(topic));

  return (
    <Box w="full">
      <Text display={{ base: "block", md: "none" }} fontSize="xs" color="fg.muted" mb="2" px="1">
        Desliza horizontalmente para ver todas las columnas.
      </Text>
      <Box
        w="full"
        overflowX="auto"
        overflowY="hidden"
        pb="2"
        css={{ WebkitOverflowScrolling: "touch" }}
      >
        <Box minW={{ base: "720px", md: "full" }}>
          <Table.Root variant="line" size="sm">
            <Table.Header>
              <Table.Row textStyle="xs" bg="bg.secondary">
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
              {orderedTopics.map(topic => {
                const childs = topic.childrens ?? [];
                const kcs = childs.flatMap(child => (kcByTopic[child.id] ?? []).map(kc => kc.code));
                const modelData = userModel;
                const groupModelData = groupModel;
                console.log("childs", childs);
                // console.log("groupModel", groupModel);
                const progress = Math.round(progresscalc(kcs, modelData) * 100);
                const groupProgress = groupModelData?.length
                  ? Math.round(progresscalc(kcs, groupModelData) * 100)
                  : 0;
                // const count1 = topicExerciseCounts[Number(topic.id)] ?? 0;
                const count2 = getParentTotal(Number(topic.id));
                return (
                  <TopicAccordionRow
                    key={topic.id}
                    topic={topic}
                    progress={progress}
                    groupProgress={groupProgress}
                    exerciseCount={count2}
                    model={modelData}
                    groupModel={groupModelData}
                    kcsByTopic={Object.fromEntries(
                      Object.entries(kcByTopic).map(([k, v]) => [k, v.map(kc => ({ ...kc }))]),
                    )}
                    exerciseCountsByChild={excerciseCountsByChild}
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
