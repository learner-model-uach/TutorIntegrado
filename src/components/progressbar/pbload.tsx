import dynamic from "next/dynamic";

interface model {
  mth: number;
  level: number;
}

const Progressbar = dynamic(
  () => {
    return import("./progressbar");
  },
  { ssr: false },
);

export const PBLoad = ({
  kcnames,
  values,
  oldvalues,
}: {
  kcnames: Array<string>;
  values: Record<string, model>;
  oldvalues?: Record<string, model>;
}) => {
  return kcnames && values ? (
    <Progressbar kcnames={kcnames} values={values} oldvalues={oldvalues} />
  ) : (
    <>potato fail:kcnames or values not provided</>
  );
};

export default PBLoad;
