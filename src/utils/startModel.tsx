import { useGQLQuery } from "rq-gql";
import { gql, Topic } from "../graphql";
import { proxy } from "valtio";
import { useEffect } from "react";
import type { ExType } from "../components/lvltutor/Tools/ExcerciseType";
import { gSelect } from "../components/GroupSelect";
import type { GetKcsByTopicsQuery } from "../graphql/graphql";
export interface model {
  mth: number;
  level: number;
}

type TopicKc = GetKcsByTopicsQuery["kcsByContentByTopics"][number]["kcs"][number];

function isExerciseJson(json: Record<string, unknown> | null | undefined): json is ExType {
  const hasPreviewExpression =
    typeof json?.eqc === "string" ||
    typeof json?.initialExpression === "string" ||
    typeof json?.img === "string" ||
    (Array.isArray(json?.steps) &&
      typeof (json.steps[0] as { expression?: unknown } | undefined)?.expression === "string");

  return typeof json?.type === "string" && hasPreviewExpression;
}

export const InitialModel = proxy<{
  isLoading: boolean;
  data: Array<{
    id: string;
    json: Record<string, model>;
  }>;
}>({
  isLoading: true,
  data: [
    {
      id: "-2",
      json: {},
    },
  ],
});

export default function StartModel(uid: string) {
  const { isLoading: userModelData } = useGQLQuery(
    gql(/* GraphQL */ `
      query potatoUM($userId: IntID!) {
        users(ids: [$userId]) {
          modelStates(
            input: { filters: { type: ["BKT"] }, orderBy: { id: DESC }, pagination: { first: 1 } }
          ) {
            nodes {
              json
            }
          }
        }
      }
    `),
    { userId: uid },
    {
      enabled: Number(InitialModel.data[0].id) < -1,
      onSuccess(data) {
        InitialModel.data[0].json = data.users[0].modelStates.nodes[0].json;
        InitialModel.data[0].id = "-1";
      },
      onSettled() {
        InitialModel.isLoading = false;
      },
      refetchOnWindowFocus: false,
      //refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  useEffect(() => {
    InitialModel.isLoading = userModelData;
  }, [userModelData]);
}

export const uModel = proxy<{
  isLoading: boolean;
  osml: boolean;
  motivmsg: boolean;
  sprog: boolean;
  pol1: boolean;
  pol2: boolean;
  data: Array<{
    id: string;
    json: Record<string, model>;
  }>;
}>({
  isLoading: true,
  osml: false,
  motivmsg: false,
  sprog: false,
  pol1: false,
  pol2: false,
  data: [
    {
      id: "-2",
      json: {},
    },
  ],
});

export const Subtopic = proxy<{
  isLoading: boolean;
  data: Array<Partial<Topic>>;
}>({
  isLoading: true,
  data: [],
});

export function GetSubtopics(parentid: string) {
  const { isLoading: subtopicLoading } = useGQLQuery(
    gql(/* GraphQL */ `
      query GetSubtopics($parentIds: [IntID!]!) {
        topics(ids: $parentIds) {
          childrens {
            id
            code
            label
            sortIndex
          }
        }
      }
    `),
    {
      parentIds: [parentid], // Convertir a número para la consulta
    },
    {
      //enabled: false,
      onSuccess(data) {
        Subtopic.data = data.topics as Array<Partial<Topic>>;
      },
      onSettled() {
        Subtopic.isLoading = false;
      },
      refetchOnWindowFocus: false,
      //refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  useEffect(() => {
    Subtopic.isLoading = subtopicLoading;
  }, [subtopicLoading]);
}

export function UserModel(uid: string) {
  const { isLoading: userModelData } = useGQLQuery(
    gql(/* GraphQL */ `
      query usermodel($userId: IntID!) {
        users(ids: [$userId]) {
          modelStates(
            input: { filters: { type: ["BKT"] }, orderBy: { id: DESC }, pagination: { first: 1 } }
          ) {
            nodes {
              json
            }
          }
        }
      }
    `),
    { userId: uid },
    {
      //enabled: false,
      onSuccess(data) {
        uModel.data[0].json = data.users[0].modelStates.nodes[0].json;
        uModel.data[0].id = "-1";
      },
      onSettled() {
        uModel.isLoading = false;
      },
      refetchOnWindowFocus: false,
      //refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  useEffect(() => {
    uModel.isLoading = userModelData;
  }, [userModelData]);
}

export const gModel = proxy<{
  isLoading: boolean;
  data: Array<{
    id: string;
    json: Record<string, model>;
  }>;
}>({
  isLoading: true,
  data: [
    {
      id: "-2",
      json: {},
    },
  ],
});

export function GroupModel(gid: string, pid: string) {
  const { isLoading: userModelData } = useGQLQuery(
    gql(`
      query potato($groupId: IntID!,$projectCode: String!) {
        groupModelStates(groupId: $groupId,projectCode: $projectCode){
          id
          json
        }
      }
    `),
    { groupId: gid, projectCode: pid },
    {
      enabled: gSelect.group ? true : false && uModel.osml,
      onSuccess(data) {
        gModel.data = data.groupModelStates;
      },
      onSettled() {
        gModel.isLoading = false;
      },
      refetchOnWindowFocus: false,
      //refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  useEffect(() => {
    gModel.isLoading = userModelData;
  }, [userModelData]);
}

export const kcsyejercicio = proxy<{
  lista: Array<string>;
  ejercicio: Object;
  title: string;
}>({
  lista: [],
  ejercicio: {},
  title: "",
});

export const selectedExcercise = proxy<{
  isLoading: boolean;
  ejercicio: Array<ExType>;
  kcXtopic: Record<string, TopicKc[]>;
}>({
  isLoading: true,
  ejercicio: [],
  kcXtopic: {},
});

export function SelectExcercise(topicCodes: Array<string>) {
  const { isLoading: userModelData } = useGQLQuery(
    gql(`
     query GetKcsByTopics($topicsCodes: [String!]!) {
        kcsByContentByTopics(projectCode: "NivPreAlg", topicsCodes: $topicsCodes) {
          topic {
            id
            content {
              code
              kcs {
                id
                code
              }
              json
            }
          }
          kcs {
            code
          }
        }
      }
    `),
    { topicsCodes: topicCodes },
    {
      //enabled: false,
      onSuccess(data) {
        const jl: ExType[] = [];
        for (const e of data.kcsByContentByTopics) {
          let max = 0;
          let json: ExType | undefined;
          for (const f of e.topic.content) {
            if (max < f.kcs.length && isExerciseJson(f.json)) {
              max = f.kcs.length;
              json = f.json;
            }
          }
          if (json) jl.push(json);
        }
        selectedExcercise.ejercicio = jl;

        const kcsByTopic: Record<string, TopicKc[]> = {};
        data.kcsByContentByTopics.forEach(({ topic, kcs }) => {
          kcsByTopic[topic.id] = [...kcs];
        });

        selectedExcercise.kcXtopic = kcsByTopic;
      },
      onSettled() {
        selectedExcercise.isLoading = false;
      },
      refetchOnWindowFocus: false,
      //refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  useEffect(() => {
    selectedExcercise.isLoading = false;
  }, [userModelData]);
}

export const contentByTopic = proxy<{
  isLoading: boolean;
  data: Partial<Topic>;
}>({
  isLoading: true,
  data: {},
});

export function AllContent(topicCodes: Array<string>) {
  const { isLoading: userModelData } = useGQLQuery(
    gql(`
     query potatocontentbytopicid($topicsCodes: [IntID!]!){
      topics(ids: $topicsCodes) {
        code
        content {
          code
          description
          id
          kcs {
            code
          }
          json
          label
          tags
        }
      }
    }
    `),
    { topicsCodes: topicCodes },
    {
      //enabled: false,
      onSuccess(data) {
        contentByTopic.data = data.topics[0] as Partial<Topic>;
      },
      onSettled() {
        contentByTopic.isLoading = false;
      },
      refetchOnWindowFocus: false,
      //refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  useEffect(() => {
    contentByTopic.isLoading = false;
  }, [userModelData]);
}
