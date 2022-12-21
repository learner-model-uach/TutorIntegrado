/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
import * as graphql from "./graphql";

const documents = {
  '\n      query currentUser {\n        currentUser {\n          id\n          email\n          name\n          role\n          picture\n          tags\n          projects {\n            id\n            code\n            label\n          }\n          groups {\n            id\n            code\n            label\n            tags\n          }\n        }\n        project(code: "NivPreAlg") {\n          id\n          code\n          label\n        }\n      }\n    ':
    graphql.CurrentUserDocument,
  '\n      query ProjectData0 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 3 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    ':
    graphql.ProjectData0Document,
  '\n      query ProjectData1 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 6 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    ':
    graphql.ProjectData1Document,
  '\n      query ProjectData2 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 5 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    ':
    graphql.ProjectData2Document,
  '\n      query ProjectData3 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 7 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    ':
    graphql.ProjectData3Document,
  '\n      query ProjectData4 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 17 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    ':
    graphql.ProjectData4Document,
  '\n      query ProjectData5 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 18 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    ':
    graphql.ProjectData5Document,
  '\n      query ProjectData6 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 8 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    ':
    graphql.ProjectData6Document,
  '\n      query ProjectData7 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 20 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    ':
    graphql.ProjectData7Document,
  '\n      query ProjectData8 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 21 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    ':
    graphql.ProjectData8Document,
  '\n      query ProjectData9 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 22 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    ':
    graphql.ProjectData9Document,
  '\n      query ProjectData10 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 23 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    ':
    graphql.ProjectData10Document,
  "\n      mutation Action($data: ActionInput!) {\n        action(data: $data)\n      }\n    ":
    graphql.ActionDocument,
};

export function gql(
  source: '\n      query currentUser {\n        currentUser {\n          id\n          email\n          name\n          role\n          picture\n          tags\n          projects {\n            id\n            code\n            label\n          }\n          groups {\n            id\n            code\n            label\n            tags\n          }\n        }\n        project(code: "NivPreAlg") {\n          id\n          code\n          label\n        }\n      }\n    '
): typeof documents['\n      query currentUser {\n        currentUser {\n          id\n          email\n          name\n          role\n          picture\n          tags\n          projects {\n            id\n            code\n            label\n          }\n          groups {\n            id\n            code\n            label\n            tags\n          }\n        }\n        project(code: "NivPreAlg") {\n          id\n          code\n          label\n        }\n      }\n    '];
export function gql(
  source: '\n      query ProjectData0 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 3 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    '
): typeof documents['\n      query ProjectData0 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 3 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    '];
export function gql(
  source: '\n      query ProjectData1 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 6 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    '
): typeof documents['\n      query ProjectData1 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 6 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    '];
export function gql(
  source: '\n      query ProjectData2 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 5 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    '
): typeof documents['\n      query ProjectData2 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 5 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    '];
export function gql(
  source: '\n      query ProjectData3 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 7 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    '
): typeof documents['\n      query ProjectData3 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 7 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    '];
export function gql(
  source: '\n      query ProjectData4 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 17 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    '
): typeof documents['\n      query ProjectData4 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 17 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    '];
export function gql(
  source: '\n      query ProjectData5 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 18 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    '
): typeof documents['\n      query ProjectData5 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 18 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    '];
export function gql(
  source: '\n      query ProjectData6 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 8 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    '
): typeof documents['\n      query ProjectData6 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 8 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    '];
export function gql(
  source: '\n      query ProjectData7 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 20 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    '
): typeof documents['\n      query ProjectData7 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 20 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    '];
export function gql(
  source: '\n      query ProjectData8 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 21 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    '
): typeof documents['\n      query ProjectData8 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 21 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    '];
export function gql(
  source: '\n      query ProjectData9 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 22 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    '
): typeof documents['\n      query ProjectData9 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 22 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    '];
export function gql(
  source: '\n      query ProjectData10 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 23 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    '
): typeof documents['\n      query ProjectData10 {\n        project(code: "NivPreAlg") {\n          content(pagination: { first: 25 }, filters: { topics: 23 }) {\n            nodes {\n              json\n            }\n          }\n        }\n      }\n    '];
export function gql(
  source: "\n      mutation Action($data: ActionInput!) {\n        action(data: $data)\n      }\n    "
): typeof documents["\n      mutation Action($data: ActionInput!) {\n        action(data: $data)\n      }\n    "];

export function gql(source: string): DocumentNode | string;
export function gql(source: string) {
  return (documents as any)[source] || source;
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;

export * from "rq-gql";
export * from "./graphql";
