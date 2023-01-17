import { withAuth } from "../components/Auth";
import { sessionState } from "../components/SessionState";
import { useGQLQuery } from "rq-gql";
import { gql } from "../graphql";
import dynamic from "next/dynamic";

const DynamicTutorFac = dynamic(() =>
    import("../components/tutorFactorizacion/TutorFac").then((mod) => mod.TutorFac)
  );

  const DynamicPlain = dynamic(() =>
    import("../components/lvltutor/Plain").then((mod) => mod.Plain)
  );

export default withAuth(function showContent() {

  const codigo = sessionState.currentContent.code;
 
  const { data } = useGQLQuery(
    gql(`
    query ProjectData0 {
      contentByCode(code: "${codigo}" ){
        json
      }
    }
  `)
  );

  console.log(data);

  return (
    <>
      <div>
      {data?.contentByCode?.json?.type == ("fc1s" || "fcc3s" || "fdc2s" || "fdsc2" || "ftc5s" ) && data ? (
          <DynamicTutorFac
            key = "1"
            exercise={data?.contentByCode?.json}
          ></DynamicTutorFac>
        ) : 
        data?.contentByCode?.json?.type == "lvltutor" && data ? (
          <DynamicPlain
            key = "2"
            steps={data?.contentByCode?.json}
            topicId=""
          ></DynamicPlain>
        ) : <p>No existe el contenido que desea cargar</p>
      } 
      </div>
    </>
  );
})