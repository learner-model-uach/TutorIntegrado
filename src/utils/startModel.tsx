import { useGraphQLQuery as useGQLQuery } from "../graphql-hooks";
import { gql, Topic } from "../graphql";
import { proxy } from "valtio";
import { useEffect } from "react";
import type { ExType } from "../components/lvltutor/Tools/ExcerciseType";
import { gSelect } from "../components/GroupSelect";
export interface model {
  mth: number;
  level: number;
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
  const {
    data,
    isLoading: userModelData,
    isSuccess,
    isError,
  } = useGQLQuery(
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
      refetchOnWindowFocus: false,
      //refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  // v5 eliminó onSuccess/onSettled en useQuery: se reemplazan reaccionando
  // a data/isSuccess/isError con useEffect.
  useEffect(() => {
    if (isSuccess && data) {
      InitialModel.data[0].json = data.users[0].modelStates.nodes[0].json;
      InitialModel.data[0].id = "-1";
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isSuccess || isError) {
      InitialModel.isLoading = false;
    }
  }, [isSuccess, isError]);

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
  const {
    data,
    isLoading: subtopicLoading,
    isSuccess,
    isError,
  } = useGQLQuery(
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
      refetchOnWindowFocus: false,
      //refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  useEffect(() => {
    if (isSuccess && data) {
      Subtopic.data = data.topics as Array<Partial<Topic>>;
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isSuccess || isError) {
      Subtopic.isLoading = false;
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    Subtopic.isLoading = subtopicLoading;
  }, [subtopicLoading]);
}

export function UserModel(uid: string) {
  const {
    data,
    isLoading: userModelData,
    isSuccess,
    isError,
  } = useGQLQuery(
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
      refetchOnWindowFocus: false,
      //refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  useEffect(() => {
    if (isSuccess && data) {
      uModel.data[0].json = data.users[0].modelStates.nodes[0].json;
      uModel.data[0].id = "-1";
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isSuccess || isError) {
      uModel.isLoading = false;
    }
  }, [isSuccess, isError]);

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
  const {
    data,
    isLoading: userModelData,
    isSuccess,
    isError,
  } = useGQLQuery(
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
      refetchOnWindowFocus: false,
      //refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  useEffect(() => {
    if (isSuccess && data) {
      gModel.data = data.groupModelStates;
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isSuccess || isError) {
      gModel.isLoading = false;
    }
  }, [isSuccess, isError]);

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
  kcXtopic: Array<Record<string, Array<{ code: string }>>>;
}>({
  isLoading: true,
  ejercicio: [],
  kcXtopic: [],
});

export function SelectExcercise(topicCodes: Array<string>) {
  const {
    data,
    isLoading: userModelData,
    isSuccess,
    isError,
  } = useGQLQuery(
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
      refetchOnWindowFocus: false,
      //refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  useEffect(() => {
    if (isSuccess && data) {
      let jl: Array<ExType> = [];
      for (var e of data.kcsByContentByTopics) {
        let max = 0;
        let json;
        //let code = e.topic.code;
        for (var f of e.topic.content) {
          if (max < f.kcs.length) {
            max = f.kcs.length;
            json = f.json;
          }
        }
        if (json) jl.push(json);
      }
      selectedExcercise.ejercicio = jl;

      let kcsByTopic = [];
      data.kcsByContentByTopics.forEach(({ topic, kcs }) => {
        kcsByTopic[topic.id] = kcs.map(kc => kc); // Guarda el objeto completo de KCs
      });

      selectedExcercise.kcXtopic = kcsByTopic;
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isSuccess || isError) {
      selectedExcercise.isLoading = false;
    }
  }, [isSuccess, isError]);

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
  const {
    data,
    isLoading: userModelData,
    isSuccess,
    isError,
  } = useGQLQuery(
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
      refetchOnWindowFocus: false,
      //refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  useEffect(() => {
    if (isSuccess && data) {
      contentByTopic.data = data.topics[0] as Partial<Topic>;
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isSuccess || isError) {
      contentByTopic.isLoading = false;
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    contentByTopic.isLoading = false;
  }, [userModelData]);
}
