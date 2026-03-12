import { HStack, Box, Image, Text, Grid, GridItem, Popover, Button } from "@chakra-ui/react";

function Pbinfo(info?: string) {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button
          size="xs"
          borderRadius="full"
          // En v3 colorPalette="teal"
          bg="teal.500"
          fontSize="xs"
        >
          i
        </Button>
      </Popover.Trigger>

      <Popover.Positioner>
        <Popover.Content>
          <Popover.Arrow />
          <Popover.CloseTrigger />
          <Popover.Body color="gray.fg" textAlign="justify">
            {info ?? ""}
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
}

const wstring = (value: number) => {
  const val = value * 100;
  return val.toFixed(0) + "%";
};

const ProgressComparison = ({
  uservalues,
  groupvalues,
  uLabel,
  gLabel,
  deltau,
  info,
}: {
  uservalues: number;
  groupvalues: number;
  uLabel?: string;
  gLabel?: string;
  deltau?: string;
  info?: string;
}) => {
  const pw = wstring(uservalues);
  const pwg = wstring(groupvalues);

  const label1 = uLabel ?? pw;
  const label2 = gLabel ?? pwg;

  return (
    <>
      <Grid
        color="progress_text"
        templateColumns={[
          "repeat(13, 1fr)",
          "repeat(13, 1fr)",
          "repeat(13, 1fr)",
          "repeat(12, 1fr)",
        ]}
        pt={["0", "0", "0", "2"]}
        fontSize={["xs", "xs", "xs", "md"]}
        templateRows="repeat(3, 1fr)"
        w={["90%", "90%", "90%", "100%"]}
      >
        <GridItem textAlign="right" colSpan={[4, 4, 4, 3]}>
          <Text pr="2" alignSelf="center">
            Yo
          </Text>
        </GridItem>
        {/* //user bar */}
        <GridItem textAlign="center" colSpan={[5, 5, 5, 6]} pt={["1", "1", "1", "2"]}>
          <Box w="100%" bg="gray.200" borderRadius={"xs"} border="2px" borderColor="gray.200">
            <Box bg="progress_user" w={pw} textAlign="center" h="10px" borderRadius={"xs"} />
          </Box>
        </GridItem>
        <GridItem textAlign="left" colSpan={1}>
          <Text pl="1" color="progress_text">
            {label1}
          </Text>
        </GridItem>
        <GridItem
          textAlign="center"
          alignSelf="center"
          colSpan={[2, 2, 2, 1]}
          pt={["0", "0", "0", "1"]}
          pl="2"
        >
          {deltau != undefined ? (
            <Text
              color="white"
              bg={Number(deltau) >= 0 ? "green.500" : "red.500"}
              borderRadius="md"
              fontSize="xs"
            >
              {Number(deltau) > 0 ? "+" + deltau : deltau}
            </Text>
          ) : (
            ""
          )}
        </GridItem>
        <GridItem pl="4" colSpan={1} rowSpan={2} pt={["1.5", "1.5", "1.5", "2"]}>
          {Pbinfo(info)}
        </GridItem>

        <GridItem textAlign="right" colSpan={[4, 4, 4, 3]}>
          <Text pr="2" alignSelf="center">
            Grupo
          </Text>
        </GridItem>
        {/* //group bar */}
        <GridItem textAlign="center" colSpan={[5, 5, 5, 6]} pt={["1", "1", "1", "2"]}>
          <Box w="100%" bg="gray.200" border="2px" borderColor="gray.200" borderRadius={"xs"}>
            <Box bg="progress_group" w={pwg} textAlign="center" h="10px" borderRadius={"xs"} />
          </Box>
        </GridItem>
        <GridItem textAlign="left" colSpan={1}>
          <Text pl="1" color="progress_text">
            {label2}
          </Text>
        </GridItem>
        <GridItem textAlign="left" colSpan={1} pt="1" />
      </Grid>
    </>
  );
};

const Progress = ({
  uservalues,
  uLabel,
  deltau,
  info,
}: {
  uservalues: number;
  uLabel?: string;
  deltau?: string;
  info?: string;
}) => {
  const pw = wstring(uservalues);
  const label1 = uLabel ?? pw;

  return (
    <>
      <Grid
        color="progress_text"
        templateColumns={[
          "repeat(13, 1fr)",
          "repeat(13, 1fr)",
          "repeat(13, 1fr)",
          "repeat(12, 1fr)",
        ]}
        pt={["0", "0", "0", "2"]}
        fontSize={["xs", "xs", "xs", "md"]}
        w={["90%", "90%", "90%", "100%"]}
      >
        <GridItem textAlign="right" colSpan={[4, 4, 4, 3]}>
          <Text pr="2" alignSelf="center">
            Yo
          </Text>
        </GridItem>
        <GridItem textAlign="center" colSpan={[5, 5, 5, 6]} pt={["1", "1", "1", "2"]}>
          <Box w="100%" bg="gray.200" borderRadius={"xs"} border="2px" borderColor="gray.200">
            <Box bg="progress_user" w={pw} textAlign="center" h="10px" borderRadius={"xs"} />
          </Box>
        </GridItem>
        <GridItem textAlign="left" colSpan={1}>
          <Text pl="1" color="progress_text">
            {label1}
          </Text>
        </GridItem>
        <GridItem textAlign="center" colSpan={[2, 2, 2, 1]} pt={["0", "0", "0", "1"]} pl="2">
          {deltau != undefined ? (
            <Text
              color="progress_text"
              bg={Number(deltau) >= 0 ? "green.500" : "red.500"}
              borderRadius="md"
              fontSize="xs"
            >
              {Number(deltau) > 0 ? "+" + deltau : deltau}
            </Text>
          ) : (
            ""
          )}
        </GridItem>
        <GridItem pl="4" colSpan={1}>
          {Pbinfo(info)}
        </GridItem>
      </Grid>
    </>
  );
};

const before2 = {
  content: "",
  width: "0px",
  height: "0px",
  borderRight: "7px solid #f4f4f5",
  borderLeft: "7px solid transparent",
  borderBottom: "7px solid #f4f4f5",
  borderTop: "7px solid transparent",
};

const Encouragement = (msg: string, maxW?: string) => {
  return (
    <HStack p={0} gap={0} maxW={maxW} paddingTop="2" alignContent={"center"}>
      <Image mx="auto" src="/img/mateo.png" alt="Logo" w="28px" h="28px" align="left" />
      <Box style={before2}></Box>
      <Box bg="gray.100" borderRadius="md" p={1} w={["70%", "70%", "70%", "80%"]}>
        <Text lineClamp={[3]} color="black">
          {msg}
        </Text>
      </Box>
    </HStack>
  );
};

export const Progressbar2 = ({
  uservalues,
  groupvalues,
  msg,
  dMaxW,
  uLabel,
  gLabel,
  deltau,
  info,
}: {
  uservalues: number;
  groupvalues?: number;
  msg?: string;
  dMaxW?: string;
  uLabel?: string;
  gLabel?: string;
  deltau?: string;
  info?: string;
}) => {
  const minw = "275px";
  const minh = "50px";

  return (
    <Box minW={minw} minH={minh} p={1} mx="auto">
      {groupvalues ? (
        <ProgressComparison
          uservalues={uservalues}
          groupvalues={groupvalues}
          uLabel={uLabel}
          gLabel={gLabel}
          deltau={deltau}
          info={info}
        />
      ) : (
        <Progress uservalues={uservalues} uLabel={uLabel} deltau={deltau} info={info} />
      )}
      {msg ? Encouragement(msg, dMaxW) : <></>}
    </Box>
  );
};

export default Progressbar2;
