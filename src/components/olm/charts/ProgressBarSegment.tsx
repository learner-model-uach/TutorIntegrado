import { BarSegment, useChart } from "@chakra-ui/charts";
import { Spinner, Center } from "@chakra-ui/react";
import type { GetUserActionsQuery } from "../../../graphql/graphql";
import { PARENT_IDS, useSubtopics } from "../hooks/useOlmTopics";
import { aggregateCompleteContentActions } from "../helpers/actionAggregates";

const PARENT_TOPIC_COLORS: Record<string, string> = {
  "4": "factorizacion_4",
  "19": "potencias_19",
  "24": "ecuacuaciones_24",
  "31": "fracciones_31",
  "37": "logica_y_conjuntos_37",
  "44": "productos_notables_44",
  "52": "algebra_pol_52",
  "68": "raices_68",
};

type Props = {
  dataActions?: GetUserActionsQuery;
};

export function ProgressBarSegment({ dataActions }: Props) {
  const { topics: parentTopics, isLoading: subtopicsLoading } = useSubtopics(PARENT_IDS);

  const childIdSet = new Set<number>();
  for (const topic of parentTopics) {
    for (const child of topic.childrens ?? []) {
      if (child?.id != null) childIdSet.add(Number(child.id));
    }
  }

  const { exerciseCountsByChild } = aggregateCompleteContentActions(dataActions, childIdSet);

  const chartData = PARENT_IDS.map(parentId => {
    const parentTopic = parentTopics.find(topic => String(topic.id) === parentId);
    const total = (parentTopic?.childrens ?? []).reduce(
      (sum, child) => sum + (exerciseCountsByChild[Number(child.id)] ?? 0),
      0,
    );

    return {
      name: parentTopic?.label ?? parentId,
      value: total,
      color: PARENT_TOPIC_COLORS[parentId] ?? "teal.500",
    };
  }).filter(item => item.value > 0);

  const chart = useChart({
    sort: { by: "value", direction: "desc" },
    data: chartData,
  });

  if (subtopicsLoading) {
    return (
      <Center py="4">
        <Spinner size="sm" />
      </Center>
    );
  }

  if (chartData.length === 0) {
    return null;
  }

  return (
    <BarSegment.Root chart={chart} pt="8px">
      <BarSegment.Content>
        <BarSegment.Value />
        <BarSegment.Bar />
      </BarSegment.Content>
      <BarSegment.Legend showPercent />
    </BarSegment.Root>
  );
}
