import { Box, Table, Text } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
import { FaChevronDown, FaChevronRight, FaEye, FaRegEyeSlash } from "react-icons/fa";
import { MdDone } from "react-icons/md";
import { TbProgress } from "react-icons/tb";
import OlmProgress from "./OlmProgress";
import type { Topic } from "./types";

const iconColor = { base: "gray.700", _dark: "gray.200" } as const;

interface TopicParentRowProps {
  topic: Topic;
  progress: number;
  groupProgress?: number;
  exerciseCount: number;
  isOpen: boolean;
  showGroupParent: boolean;
  onToggleGroup: () => void;
  onToggleSubtopics: () => void;
}

function ExerciseCountCell({ exerciseCount }: { exerciseCount: number }) {
  if (exerciseCount === 0) {
    return (
      <Text color="fg.warning" fontWeight="semibold" fontSize={{ base: "sm", md: "md" }}>
        No has realizado ejercicios
      </Text>
    );
  }

  if (exerciseCount === 1) {
    return (
      <>
        <Text fontWeight="normal" display={{ base: "none", md: "block" }}>
          Has realizado 1 ejercicio
        </Text>
        <Text fontWeight="normal" display={{ base: "block", md: "none" }} fontSize="sm">
          1 ejercicio
        </Text>
      </>
    );
  }

  return (
    <>
      <Text fontWeight="normal" display={{ base: "none", md: "block" }}>
        Has realizado {exerciseCount} ejercicios
      </Text>
      <Text fontWeight="normal" display={{ base: "block", md: "none" }} fontSize="sm">
        {exerciseCount} ejercicios
      </Text>
    </>
  );
}

export default function TopicParentRow({
  topic,
  progress,
  groupProgress,
  exerciseCount,
  isOpen,
  showGroupParent,
  onToggleGroup,
  onToggleSubtopics,
}: TopicParentRowProps) {
  return (
    <Table.Row bg="bg.secondary">
      <Table.Cell>
        {progress === 100 ? (
          <Tooltip content="Completado">
            <MdDone color="teal" />
          </Tooltip>
        ) : (
          <Tooltip content="Progreso en curso">
            <TbProgress />
          </Tooltip>
        )}
      </Table.Cell>
      <Table.Cell
        fontWeight="semibold"
        color={{ base: "gray.600", _dark: "indigo.50" }}
        fontSize={{ base: "sm", md: "md" }}
      >
        {topic.label}
      </Table.Cell>

      <Table.Cell>
        <OlmProgress.Bar
          percent={progress}
          groupPercent={groupProgress}
          showGroupPercent={showGroupParent}
        />
      </Table.Cell>

      <Table.Cell>
        <OlmProgress.Value
          percent={progress}
          groupPercent={groupProgress}
          showGroupPercent={showGroupParent}
        />
      </Table.Cell>

      <Table.Cell
        onClick={onToggleGroup}
        cursor="pointer"
        color={{ base: "gray.600", _dark: "indigo.50" }}
      >
        <Box display="grid" placeItems="center">
          {showGroupParent ? <FaEye size={18} /> : <FaRegEyeSlash size={18} />}
        </Box>
      </Table.Cell>

      <Table.Cell
        textAlign="end"
        color={{ base: "gray.600", _dark: "indigo.50" }}
        minW={{ base: "150px", md: "unset" }}
      >
        <ExerciseCountCell exerciseCount={exerciseCount} />
      </Table.Cell>

      <Table.Cell textAlign="center" onClick={onToggleSubtopics} color={iconColor}>
        {isOpen ? <FaChevronDown cursor="pointer" /> : <FaChevronRight cursor="pointer" />}
      </Table.Cell>
    </Table.Row>
  );
}
