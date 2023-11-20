import type Plain from "../components/lvltutor/Plain";
import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import ejemplo from "./../contents/ejemplo.json";
import type { ExType } from "../components/lvltutor/Tools/ExcerciseType";

const DynamicPlain = dynamic<ComponentProps<typeof Plain>>(() =>
  import("../components/lvltutor/Plain").then(mod => mod.Plain),
);
export default function lvlContent() {
  return <DynamicPlain key="2" steps={ejemplo as ExType} topicId={""}></DynamicPlain>;
}
