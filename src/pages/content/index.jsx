import Router from "next/router";
import { useEffect } from "react";

export default function Index() {
  //content/content/solve?type=5
  useEffect(() => {
    Router.replace("exercise/solve");
  }, []);

  return <div></div>;
}
