// import * as React from "react";
import { useMemo } from "react";
import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { Chart, useChart } from "@chakra-ui/charts";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import type { MergedProgressPoint, ProgressAreaDatum } from "../types";
import ProgressOverTimeBoxInfo from "../ProgressOverTimeBoxInfo";

type ActivityReferencePoint = {
  date: string;
  count: number;
};

type ProgressOverTimeAvgLevelAreaProps = {
  points: MergedProgressPoint[];
  activityReferencePoint?: ActivityReferencePoint | null;
  showGroupProgress?: boolean;
};

const MONTH_LABELS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

function getIsoDate(iso: string) {
  return iso.slice(0, 10);
}

function formatShortDate(iso: string) {
  const [year, month, day] = getIsoDate(iso).split("-");

  if (!year || !month || !day) return iso;

  const monthIndex = Number(month) - 1;
  const monthLabel = MONTH_LABELS[monthIndex];

  if (!monthLabel) return iso;

  return `${day} ${monthLabel}`;
}

function formatFullDate(iso: string) {
  const [year, month, day] = getIsoDate(iso).split("-");

  if (!year || !month || !day) return iso;

  const monthIndex = Number(month) - 1;
  const monthLabel = MONTH_LABELS[monthIndex];

  if (!monthLabel) return iso;

  return `${day} ${monthLabel} ${year}`;
}

function buildXAxisTicks(dates: string[]) {
  if (dates.length <= 8) return dates;

  const targetTicks = 8;
  const step = Math.ceil(dates.length / targetTicks);
  const selected = new Set<string>();

  dates.forEach((date, index) => {
    const prevDate = dates[index - 1];
    const monthChanged = prevDate ? prevDate.slice(0, 7) !== date.slice(0, 7) : false;

    if (index === 0 || index === dates.length - 1 || index % step === 0 || monthChanged) {
      selected.add(date);
    }
  });

  return dates.filter(date => selected.has(date));
}

type CustomProgressTooltipProps = Partial<TooltipContentProps<number, string>> & {
  percentFmt: Intl.NumberFormat;
};

function CustomProgressTooltip({ active, payload, label, percentFmt }: CustomProgressTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <Box
      minW="xs"
      rounded="md"
      borderWidth="1px"
      borderColor="border"
      bg="bg.secondary"
      color="text_info"
      boxShadow="md"
      p="3"
    >
      <Text fontWeight="bold" mb="2">
        Fecha: {formatFullDate(String(label))}
      </Text>
      <Stack gap="1.5">
        {payload.map(item => {
          const value = typeof item.value === "number" ? percentFmt.format(item.value) : item.value;

          return (
            <HStack key={`${item.name}-${item.dataKey}`} align="start">
              <Box boxSize="2" bg={item.color} rounded="full" mt="1.5" />
              <Text>
                {item.name}: {value}
              </Text>
            </HStack>
          );
        })}
      </Stack>
    </Box>
  );
}

export function ProgressOverTimeAvgLevelArea({
  points,
  activityReferencePoint,
  showGroupProgress = true,
}: ProgressOverTimeAvgLevelAreaProps) {
  const data: ProgressAreaDatum[] = useMemo(
    () =>
      points.map(p => ({
        date: getIsoDate(p.at),
        userAvg: p.userAvg ?? null,
        groupAvg: p.groupAvg ?? null,
        nUsers: p.nUsers ?? null,
      })),
    [points],
  );
  const xAxisTicks = useMemo(() => buildXAxisTicks(data.map(point => point.date)), [data]);
  const series = useMemo(
    () => [
      { name: "userAvg" as keyof ProgressAreaDatum, color: "blue.500" },
      ...(showGroupProgress
        ? [{ name: "groupAvg" as keyof ProgressAreaDatum, color: "teal.500" }]
        : []),
    ],
    [showGroupProgress],
  );

  const chart = useChart({
    data,
    series,
  });

  const percentFmt = useMemo(
    () =>
      new Intl.NumberFormat("es-CL", {
        style: "percent",
        maximumFractionDigits: 0,
      }),
    [],
  );

  return (
    <>
      <ProgressOverTimeBoxInfo
        message={
          showGroupProgress
            ? "Aquí podrás revisar la evolución de tu progreso y el progreso de tu grupo durante un período máximo de 4 meses. Si notas una caída drástica en el progreso grupal se debe a que nuevos usuarios dentro de tu grupo han empezado a resolver ejercicios."
            : "Aquí podrás revisar la evolución de tu progreso durante un período máximo de 4 meses."
        }
        highlightQuery={[
          "periodo más relevante",
          "máximo de 4 meses",
          "tu progreso",
          ...(showGroupProgress ? ["progreso de tu grupo"] : []),
        ]}
      />
      <Text
        color="heading"
        pt="1.5rem"
        pb=".8rem"
        textStyle="xl"
        textAlign="center"
        fontWeight="semibold"
      >
        PROGRESO EN EL TIEMPO
      </Text>
      <Chart.Root maxH="sm" chart={chart}>
        <AreaChart data={chart.data} responsive>
          <CartesianGrid stroke="gray" strokeDasharray="3 3" opacity={0.5} />
          <XAxis
            dataKey="date"
            ticks={xAxisTicks}
            tickFormatter={formatShortDate}
            tickMargin={8}
            minTickGap={24}
          />

          <YAxis tickFormatter={(v: number) => percentFmt.format(v)} domain={[0, 1]} />

          <Tooltip content={<CustomProgressTooltip percentFmt={percentFmt} />} />

          <Legend />

          <defs>
            <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
              <stop offset="15%" stopColor={"#75B06F"} stopOpacity={0.7} />
              <stop offset="95%" stopColor={"#75B06F"} stopOpacity={0.1} />
            </linearGradient>

            <linearGradient id="colorGroup" x1="0" y1="0" x2="0" y2="1">
              <stop offset="15%" stopColor={"#d8881e"} stopOpacity={0.6} />
              <stop offset="95%" stopColor={"#d8881e"} stopOpacity={0.1} />
            </linearGradient>
          </defs>

          {showGroupProgress && (
            <Area
              type="monotone"
              dataKey={chart.key("groupAvg")}
              stroke={"#d8881e"}
              fill="url(#colorGroup)"
              connectNulls
              name="Progreso Grupo"
            />
          )}

          <Area
            type="monotone"
            dataKey={chart.key("userAvg")}
            stroke={"#75B06F"}
            fill="url(#colorUser)"
            connectNulls
            name="Mi progreso"
          />

          {activityReferencePoint && (
            <ReferenceLine
              x={activityReferencePoint.date}
              stroke={chart.color("mayorActividad")}
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{
                value: `Mayor actividad: ${activityReferencePoint.count}`,
                position: "insideTopRight",
                fill: chart.color("mayorActividad"),
                fontSize: 12,
              }}
            />
          )}
        </AreaChart>
      </Chart.Root>
    </>
  );
}
