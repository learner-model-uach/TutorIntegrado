import { HStack, Box, Tooltip } from "@chakra-ui/react";

interface model {
  mth: number;
  level: number;
}

const pval = (kcnames: Array<string>, values: Record<string, model>): number => {
  let val = 0;
  let length = kcnames.length;
  if (length > 1) {
    for (var k of kcnames) {
      let value = values[k];
      if (!value) continue;
      let value2 = value.level;
      if (!value || !value2) {
        length = length - 1;
        continue;
      }
      val = val + value2;
    }
    if (length > 0) val = val / length;
    else val = 0;
  } else {
    let value = values[kcnames[0]];
    if (value) val = value.level;
  }
  return val;
};

const wstring = (value: number) => {
  //Creating a % string for width size
  let val = Number(value.toPrecision(2)) * 100;
  let w = String(val) + "%";
  return w;
};

const ProgressComparison = ({
  kcnames,
  values,
  oldvalues,
}: {
  kcnames: Array<string>;
  values: Record<string, model>;
  oldvalues: Record<string, model>;
}) => {
  let v = pval(kcnames, values);
  let ov = pval(kcnames, oldvalues);

  let maxw = wstring(v);
  let diffw = wstring(v - ov);
  let bgc = "teal.300";
  let label = "Tu dominio aumento un ";

  if (ov > v) {
    maxw = wstring(ov);
    diffw = wstring(ov - v);
    bgc = "red.300";
    label = "Tu dominio disminuyo un ";
  }

  return (
    <HStack w={"240px"} bg={"gray.50"} h={"40px"} borderRadius="md" padding={1}>
      <HStack border={"1px"} borderRadius="md" bg={"gray.300"} w={"100%"} spacing={0}>
        <Tooltip label="Este es tu progreso de dominio Anterior">
          <Box borderLeftRadius="md" bg={"green.300"} w={maxw} textAlign="center" minW={12}>
            {maxw}
          </Box>
        </Tooltip>
        <Tooltip label={label + diffw}>
          <Box borderRightRadius="md" bg={bgc} w={diffw} textAlign="center" minW={12}>
            {diffw}
          </Box>
        </Tooltip>
      </HStack>
    </HStack>
  );
};

const Progress = ({
  kcnames,
  values,
}: {
  kcnames: Array<string>;
  values: Record<string, model>;
}) => {
  let v = pval(kcnames, values);

  let pw = wstring(v);

  return (
    <HStack w={"240px"} bg={"gray.50"} h={"40px"} borderRadius="md" padding={1}>
      <HStack border={"1px"} borderRadius="md" bg={"gray.300"} w={"100%"} spacing={0}>
        <Tooltip label="Este es tu dominio Actual">
          <Box borderLeftRadius="md" bg={"green.300"} w={pw} textAlign="center" minW={12}>
            {pw}
          </Box>
        </Tooltip>
      </HStack>
    </HStack>
  );
};

export const Progressbar = ({
  kcnames,
  values,
  oldvalues,
}: {
  kcnames: Array<string>;
  values: Record<string, model>;
  oldvalues?: Record<string, model>;
}) => {
  return (
    <>
      {oldvalues ? (
        <ProgressComparison kcnames={kcnames} values={values} oldvalues={oldvalues} />
      ) : (
        <Progress kcnames={kcnames} values={values} />
      )}
    </>
  );
};

export default Progressbar;
