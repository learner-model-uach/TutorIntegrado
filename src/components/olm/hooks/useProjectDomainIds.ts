import { useGQLQuery } from "rq-gql";
import { gql } from "../../../graphql";

function toInt(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

export function useProjectDomainIds(projectCode?: string, domainCode?: string) {
  const q = useGQLQuery(
    gql(`
      query GetProjectDomains($projectCode: String!) {
        project(code: $projectCode) {
          id
          domains {
            id
            code
            label
          }
        }
      }
    `),
    { projectCode: projectCode ?? "" },
    {
      enabled: Boolean(projectCode),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const projectId = toInt(q.data?.project?.id);

  const domainId = toInt(q.data?.project?.domains?.find(d => d.code === domainCode)?.id);

  return {
    ...q,
    projectId,
    domainId,
    domains: q.data?.project?.domains ?? [],
  };
}
