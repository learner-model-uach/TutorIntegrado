// import * as React from "react";
import { useMemo } from "react";
import { Chart, useChart } from "@chakra-ui/charts";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipPayloadEntry,
  type TooltipValueType,
} from "recharts";
import type { MergedProgressPoint, ProgressAreaDatum } from "../types";

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

export function ProgressOverTimeAvgLevelArea({ points }: { points: MergedProgressPoint[] }) {
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

  const chart = useChart({
    data,
    series: [
      { name: "userAvg", color: "blue.500" },
      { name: "groupAvg", color: "teal.500" },
    ],
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
    <Chart.Root maxH="sm" chart={chart}>
      <AreaChart data={chart.data} responsive>
        <CartesianGrid stroke="teal" strokeDasharray="3 3" opacity={0.5} />
        <XAxis
          dataKey="date"
          ticks={xAxisTicks}
          tickFormatter={formatShortDate}
          tickMargin={8}
          minTickGap={24}
        />

        <YAxis tickFormatter={(v: number) => percentFmt.format(v)} domain={[0, 1]} />

        <Tooltip
          formatter={(value, name, payload) => {
            const point = (
              payload as TooltipPayloadEntry<TooltipValueType, string> & {
                payload?: ProgressAreaDatum;
              }
            ).payload;
            const v = typeof value === "number" ? percentFmt.format(value) : value;

            if (name === "groupAvg") {
              const nUsers = point?.nUsers;
              if (typeof nUsers === "number") return [`${v} (${nUsers} users)`, "groupAvg"];
            }

            return [v, name];
          }}
          labelFormatter={label => `Fecha: ${formatFullDate(String(label))}`}
        />

        <Legend />

        <defs>
          <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={"#75B06F"} stopOpacity={0.7} />
            <stop offset="95%" stopColor={"#75B06F"} stopOpacity={0} />
          </linearGradient>

          <linearGradient id="colorGroup" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={"#ff8c73"} stopOpacity={0.6} />
            <stop offset="95%" stopColor={"#ff8c73"} stopOpacity={0} />
          </linearGradient>
        </defs>

        <Area
          type="monotone"
          dataKey={chart.key("groupAvg")}
          stroke={"#ff8c73"}
          fill="url(#colorGroup)"
          connectNulls
          name="Progreso Grupo"
        />

        <Area
          type="monotone"
          dataKey={chart.key("userAvg")}
          stroke={"#75B06F"}
          fill="url(#colorUser)"
          connectNulls
          name="Mi progreso"
        />
      </AreaChart>
    </Chart.Root>
  );
}
