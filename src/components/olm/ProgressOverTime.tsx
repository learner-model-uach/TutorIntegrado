"use client";
import React, { useMemo } from "react";
import { Box, HStack, Stack, Text, Spinner, Center, Image, Heading } from "@chakra-ui/react";
import { Chart, useChart } from "@chakra-ui/charts";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import type { TooltipContentProps } from "recharts";
import { useGQLQuery } from "rq-gql";
import { useUserActions } from "./hooks/useOlmActions";
import { PARENT_IDS, useSubtopics } from "./hooks/useOlmTopics";
import { ProgressBarSegment } from "./charts/ProgressBarSegment";
import { aggregateCompleteContentActions } from "./helpers/actionAggregates";
import ProgressOverTimeBoxInfo from "./ProgressOverTimeBoxInfo";

type Props = {
  endDate: string; // e.g. new Date().toISOString()
};

const OLM_STALE_TIME = 5 * 60 * 1000;

function CustomTooltip(props: Partial<TooltipContentProps<string, string>>) {
  const { active, payload, label } = props;
  if (!active || !payload || payload.length === 0) return null;

  return (
    <Box w="40" rounded="sm" bg="teal.subtle" p="3">
      <HStack>
        <Text fontWeight="bold">{label}</Text>
      </HStack>
      <Stack>
        {payload.map(item => (
          <HStack key={item.name}>
            <Box boxSize="2" bg={item.color} />
            <Text textStyle="xl">{item.value}</Text>
          </HStack>
        ))}
      </Stack>
    </Box>
  );
}

export default function ProgressOverTime({ endDate }: Props) {
  const { topics: parentTopics, isLoading: subtopicsLoading } = useSubtopics(PARENT_IDS);
  const { data, isLoading, error } = useGQLQuery(
    useUserActions,
    {
      endDate,
      verbNames: ["completeContent"],
    },
    {
      staleTime: OLM_STALE_TIME,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const childIdSet = useMemo(() => {
    const set = new Set<number>();
    for (const topic of parentTopics) {
      for (const child of topic.childrens ?? []) {
        if (child?.id != null) {
          set.add(Number(child.id));
        }
      }
    }
    return set;
  }, [parentTopics]);

  const chartData = useMemo(() => {
    const { exerciseCountsByDate } = aggregateCompleteContentActions(data, childIdSet);

    return Object.entries(exerciseCountsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data, childIdSet]);

  const chart = useChart({
    data: chartData,
    series: [{ name: "count", color: "#75B06F" }],
  });

  if (isLoading || subtopicsLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  if (error)
    return (
      <Center>
        <Text color="red.500">Error al cargar los datos.</Text>
      </Center>
    );

  if (chartData.length === 0)
    return (
      <Stack px="2" py="2">
        <Center>
          <Text fontSize="md">No has realizado ejercicios.</Text>
        </Center>
        <Center>
          <Image src="../img/sad_mateo.svg" alt="no encontrado" width="60px" marginTop="10px" />
        </Center>
      </Stack>
    );

  return (
    <>
      <Box pt="2rem">
        <ProgressOverTimeBoxInfo
          message="Aquí podrás revisar cuántos ejercicios has completado en Mateo, organizados por fecha desde que comenzaste a usar la plataforma."
          highlightQuery={["ejercicios has completado"]}
        />
        <Heading
          color="heading"
          pt="1.5rem"
          pb=".8rem"
          fontSize={"xl"}
          textAlign="center"
          fontWeight="semibold"
        >
          EJERCICIOS COMPLETADOS POR FECHA
        </Heading>
        <Chart.Root maxH="sm" chart={chart}>
          <BarChart data={chart.data} responsive>
            <CartesianGrid stroke={chart.color("border")} vertical={false} />
            <XAxis
              axisLine={false}
              dataKey={chart.key("date")}
              stroke={chart.color("border")}
              tickMargin={10}
              label={{ value: "Fecha", position: "bottom" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              stroke={chart.color("border")}
              label={{ value: "Ejercicios", position: "left", angle: -90 }}
            />
            <Tooltip animationDuration={100} cursor={false} content={<CustomTooltip />} />
            {chart.series.map(item => (
              <Bar
                key={item.name}
                dataKey={chart.key(item.name)}
                fill={chart.color(item.color)}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </Chart.Root>

        <ProgressBarSegment dataActions={data} />
      </Box>
    </>
  );
}
