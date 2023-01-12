import Router from "next/router";
import { useEffect } from "react";

export default function Index() {
  //content/content/solve?type=5
  useEffect(() => {
    alert("hello!");
    Router.replace("exercise/solve");
    //Router.replace("/");
  }, []);

  return <div></div>;
}
