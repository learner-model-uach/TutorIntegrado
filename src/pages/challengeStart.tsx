import dynamic from "next/dynamic";

export default dynamic(() => import("../pageModules/challengeStart"), {
  ssr: false,
});
