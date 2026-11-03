import { Box, Highlight, IconButton, Popover, Table, TableCell, Text } from "@chakra-ui/react";
import { FaEye, FaInfoCircle, FaRegEyeSlash } from "react-icons/fa";
import { EffortDots } from "./EffortDots";
import {
  estimateEffort,
  getMoodEmoji,
  infoText,
  pluralizeExercise,
} from "./helpers/efficiencyAndEffortHelpers";
import { getSubtopicGroupPercent, getSubtopicPercent } from "./helpers/topicHelpers";
import OlmProgress from "./OlmProgress";
import type { KcByTopicMap, OlmModelState, TopicChild } from "./types";
import { useAction } from "../../utils/action";

interface SubtopicRowProps {
  child: TopicChild;
  model: OlmModelState[];
  groupModel?: OlmModelState[];
  kcsByTopic: KcByTopicMap;
  exerciseCount: number;
  rawEfficiency: number;
  showGroupProgress: boolean;
  showEfficiency: boolean;
  showEffort: boolean;
  showGroupChild: boolean;
  onToggleGroup: (
    childId: number,
    showGroupChild: boolean,
    groupSubtopicPercent: number,
    userSubtopicPercent: number,
  ) => void;
}

export default function SubtopicRow({
  child,
  model,
  groupModel,
  kcsByTopic,
  exerciseCount,
  rawEfficiency,
  showGroupProgress,
  showEfficiency,
  showEffort,
  showGroupChild,
  onToggleGroup,
}: SubtopicRowProps) {
  const childId = Number(child.id);
  const userSubtopicPercent = getSubtopicPercent(child.id, kcsByTopic, model);
  const groupSubtopicPercent = getSubtopicGroupPercent(child.id, kcsByTopic, groupModel);
  const estimatedEffort = showEffort ? estimateEffort(exerciseCount, userSubtopicPercent) : 0;
  const effortLabel = showEffort ? pluralizeExercise(estimatedEffort) : "";
  const effortInfo = showEffort
    ? infoText(exerciseCount, estimatedEffort, effortLabel, child.label)
    : "";
  const efficiencyPercent = showEfficiency ? Math.round(rawEfficiency * 100) : 0;
  const { char: moodEmoji, label: moodLabel } = showEfficiency
    ? getMoodEmoji(exerciseCount, rawEfficiency)
    : { char: "", label: "" };
  const action = useAction();

  return (
    <Table.Row bg="bg.secondary">
      <Table.Cell whiteSpace="normal" overflowWrap="break-word" pr="3">
        {userSubtopicPercent === 100 ? (
          <Highlight
            query={child.label}
            styles={{
              px: "0.5",
              bg: { base: "teal.100", _dark: "teal.900" },
              color: { base: "teal.600", _dark: "teal.500" },
              fontWeight: "semibold",
            }}
          >
            {child.label}
          </Highlight>
        ) : (
          child.label
        )}
      </Table.Cell>
      <Table.Cell>
        <OlmProgress.Bar
          percent={userSubtopicPercent}
          groupPercent={groupSubtopicPercent}
          showGroupPercent={showGroupProgress && showGroupChild}
        />
      </Table.Cell>

      <Table.Cell whiteSpace="nowrap">
        <OlmProgress.Value
          percent={userSubtopicPercent}
          groupPercent={groupSubtopicPercent}
          showGroupPercent={showGroupProgress && showGroupChild}
        />
      </Table.Cell>

      {showGroupProgress && (
        <Table.Cell
          onClick={() =>
            onToggleGroup(childId, showGroupChild, groupSubtopicPercent, userSubtopicPercent)
          }
          cursor="pointer"
          color={{ base: "gray.600", _dark: "indigo.50" }}
        >
          <Box display="grid" placeItems="center">
            {showGroupChild ? <FaEye size={18} /> : <FaRegEyeSlash size={18} />}
          </Box>
        </Table.Cell>
      )}

      {showEffort && (
        <>
          <TableCell textAlign="end" whiteSpace="nowrap">
            <EffortDots n={exerciseCount} estimated={estimatedEffort} />
          </TableCell>

          <TableCell textAlign="center">
            <Popover.Root>
              <Popover.Trigger asChild>
                <IconButton
                  aria-label="Información de ejercicios"
                  size="xs"
                  variant="ghost"
                  color={{ base: "bg/90", _dark: "gray.200" }}
                  _icon={{ boxSize: 4 }}
                  onClick={() => {
                    action({
                      verbName: "dshbShowEffortInfo",
                      topicID: String(child.id),
                    });
                  }}
                >
                  <FaInfoCircle />
                </IconButton>
              </Popover.Trigger>
              <Popover.Positioner>
                <Popover.Content
                  maxW="xs"
                  p="3"
                  bg="black"
                  color="gray.200"
                  css={{ "--popover-bg": "black" }}
                >
                  <Popover.Arrow />
                  <Popover.CloseTrigger />
                  <Text fontSize="sm">{effortInfo}</Text>
                </Popover.Content>
              </Popover.Positioner>
            </Popover.Root>
          </TableCell>
        </>
      )}

      {showEfficiency && (
        <TableCell textAlign="center" title="Eficiencia = B / A">
          <Box as="span" display="inline-flex" alignItems="center" justifyContent="center" gap="2">
            <span>
              {Number.isFinite(efficiencyPercent) && efficiencyPercent > 0
                ? `${efficiencyPercent}%`
                : "—"}
            </span>
            {moodEmoji ? (
              <Popover.Root>
                <Popover.Trigger asChild>
                  <Box
                    as="span"
                    cursor="pointer"
                    display="inline-flex"
                    alignItems="center"
                    onClick={() => {
                      action({
                        verbName: "dshbShowEfficiencyInfo",
                        topicID: String(child.id),
                        extra: {
                          efficiency: efficiencyPercent,
                        },
                      });
                    }}
                  >
                    <span role="img" aria-label={moodLabel} style={{ fontSize: 25 }}>
                      {moodEmoji}
                    </span>
                  </Box>
                </Popover.Trigger>
                <Popover.Positioner>
                  <Popover.Content
                    maxW="xs"
                    p="3"
                    bg="black"
                    color="gray.200"
                    css={{ "--popover-bg": "black" }}
                  >
                    <Popover.Arrow />
                    <Popover.CloseTrigger />
                    <Text fontSize="sm">{moodLabel}</Text>
                  </Popover.Content>
                </Popover.Positioner>
              </Popover.Root>
            ) : (
              <span style={{ fontSize: 25 }}> </span>
            )}
          </Box>
        </TableCell>
      )}
    </Table.Row>
  );
}
