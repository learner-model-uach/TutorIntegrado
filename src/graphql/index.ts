/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
import * as graphql from "./graphql";

const documents = {
  '\n      query currentUser {\n        currentUser {\n          id\n          email\n          name\n          role\n          picture\n          tags\n          projects {\n            id\n            code\n            label\n          }\n          groups {\n            id\n            code\n            label\n            tags\n          }\n        }\n        project(code: "NivPreAlg") {\n          id\n          code\n          label\n        }\n      }\n    ':
    graphql.CurrentUserDocument,
  '\n      query ProjectData0 {\n\t\t\t  contentByCode(code: "fc1"){\n          json\n        }\n      }\n    ':
    graphql.ProjectData0Document,
  '\n      query ProjectData1 {\n        contentByCode(code: "dc1"){\n          json\n        }\n      }\n    ':
    graphql.ProjectData1Document,
  '\n      query ProjectData2 {\n        contentByCode(code: "fcc1"){\n          json\n        }\n      }\n    ':
    graphql.ProjectData2Document,
  '\n      query ProjectData3 {\n        contentByCode(code: "dsc1"){\n          json\n        }\n      }\n    ':
    graphql.ProjectData3Document,
  '\n      query ProjectData4 {\n        contentByCode(code: "fracc1"){\n          json\n        }\n      }\n    ':
    graphql.ProjectData4Document,
  '\n      query ProjectData5 {\n        contentByCode(code: "fracc2"){\n          json\n        }\n      }\n    ':
    graphql.ProjectData5Document,
  '\n      query ProjectData6 {\n        contentByCode(code: "tc1"){\n          json\n        }\n      }\n    ':
    graphql.ProjectData6Document,
  '\n      query ProjectData7 {\n        contentByCode(code: "pot1"){\n          json\n        }\n      }\n    ':
    graphql.ProjectData7Document,
  '\n      query ProjectData8 {\n        contentByCode(code: "pot2"){\n          json\n        }\n      }\n    ':
    graphql.ProjectData8Document,
  '\n      query ProjectData9 {\n        contentByCode(code: "pot3"){\n          json\n        }\n      }\n    ':
    graphql.ProjectData9Document,
  '\n      query ProjectData10 {\n        contentByCode(code: "pot4"){\n          json\n        }\n      }\n    ':
    graphql.ProjectData10Document,
  '\n      query ProjectData11 {\n        contentByCode(code: "ecc1"){\n          json\n        }\n      }\n    ':
    graphql.ProjectData11Document,
  '\n      query ProjectData12 {\n        contentByCode(code: "secl1"){\n          json\n        }\n      }\n    ':
    graphql.ProjectData12Document,
  "\n      mutation Action($data: ActionInput!) {\n        action(data: $data)\n      }\n    ":
    graphql.ActionDocument,
  "\n      mutation updateModelState($input: UpdateModelStateInput!) {\n        updateModelState(input: $input)\n      }\n    ":
    graphql.UpdateModelStateDocument,
};

export function gql(
  source: '\n      query currentUser {\n        currentUser {\n          id\n          email\n          name\n          role\n          picture\n          tags\n          projects {\n            id\n            code\n            label\n          }\n          groups {\n            id\n            code\n            label\n            tags\n          }\n        }\n        project(code: "NivPreAlg") {\n          id\n          code\n          label\n        }\n      }\n    ',
): typeof documents['\n      query currentUser {\n        currentUser {\n          id\n          email\n          name\n          role\n          picture\n          tags\n          projects {\n            id\n            code\n            label\n          }\n          groups {\n            id\n            code\n            label\n            tags\n          }\n        }\n        project(code: "NivPreAlg") {\n          id\n          code\n          label\n        }\n      }\n    '];
export function gql(
  source: "\n      query potatoquery($code: String!) {\n        contentByCode(code: $code) {\n          id\n          code\n          description\n          label\n          json\n          kcs {\n            code\n          }\n        }\n      }\n    ",
): typeof documents["\n      query potatoquery($code: String!) {\n        contentByCode(code: $code) {\n          id\n          code\n          description\n          label\n          json\n          kcs {\n            code\n          }\n        }\n      }\n    "];
export function gql(
  source: '\n      query ProjectData1 {\n        contentByCode(code: "dc1"){\n          json\n        }\n      }\n    ',
): typeof documents['\n      query ProjectData1 {\n        contentByCode(code: "dc1"){\n          json\n        }\n      }\n    '];
export function gql(
  source: '\n      query ProjectData2 {\n        contentByCode(code: "fcc1"){\n          json\n        }\n      }\n    ',
): typeof documents['\n      query ProjectData2 {\n        contentByCode(code: "fcc1"){\n          json\n        }\n      }\n    '];
export function gql(
  source: '\n      query ProjectData3 {\n        contentByCode(code: "dsc1"){\n          json\n        }\n      }\n    ',
): typeof documents['\n      query ProjectData3 {\n        contentByCode(code: "dsc1"){\n          json\n        }\n      }\n    '];
export function gql(
  source: '\n      query ProjectData4 {\n        contentByCode(code: "fracc1"){\n          json\n        }\n      }\n    ',
): typeof documents['\n      query ProjectData4 {\n        contentByCode(code: "fracc1"){\n          json\n        }\n      }\n    '];
export function gql(
  source: '\n      query ProjectData5 {\n        contentByCode(code: "fracc2"){\n          json\n        }\n      }\n    ',
): typeof documents['\n      query ProjectData5 {\n        contentByCode(code: "fracc2"){\n          json\n        }\n      }\n    '];
export function gql(
  source: '\n      query ProjectData6 {\n        contentByCode(code: "tc1"){\n          json\n        }\n      }\n    ',
): typeof documents['\n      query ProjectData6 {\n        contentByCode(code: "tc1"){\n          json\n        }\n      }\n    '];
export function gql(
  source: '\n      query ProjectData7 {\n        contentByCode(code: "pot1"){\n          json\n        }\n      }\n    ',
): typeof documents['\n      query ProjectData7 {\n        contentByCode(code: "pot1"){\n          json\n        }\n      }\n    '];
export function gql(
  source: '\n      query ProjectData8 {\n        contentByCode(code: "pot2"){\n          json\n        }\n      }\n    ',
): typeof documents['\n      query ProjectData8 {\n        contentByCode(code: "pot2"){\n          json\n        }\n      }\n    '];
export function gql(
  source: '\n      query ProjectData9 {\n        contentByCode(code: "pot3"){\n          json\n        }\n      }\n    ',
): typeof documents['\n      query ProjectData9 {\n        contentByCode(code: "pot3"){\n          json\n        }\n      }\n    '];
export function gql(
  source: '\n      query ProjectData10 {\n        contentByCode(code: "pot4"){\n          json\n        }\n      }\n    ',
): typeof documents['\n      query ProjectData10 {\n        contentByCode(code: "pot4"){\n          json\n        }\n      }\n    '];
export function gql(
  source: '\n      query ProjectData11 {\n        contentByCode(code: "ecc1"){\n          json\n        }\n      }\n    ',
): typeof documents['\n      query ProjectData11 {\n        contentByCode(code: "ecc1"){\n          json\n        }\n      }\n    '];
export function gql(
  source: '\n      query ProjectData12 {\n        contentByCode(code: "secl1"){\n          json\n        }\n      }\n    ',
): typeof documents['\n      query ProjectData12 {\n        contentByCode(code: "secl1"){\n          json\n        }\n      }\n    '];
export function gql(
  source: "\n      mutation Action($data: ActionInput!) {\n        action(data: $data)\n      }\n    ",
): typeof documents["\n      mutation Action($data: ActionInput!) {\n        action(data: $data)\n      }\n    "];
export function gql(
  source: "\n      mutation updateModelState($input: UpdateModelStateInput!) {\n        updateModelState(input: $input)\n      }\n    ",
): typeof documents["\n      mutation updateModelState($input: UpdateModelStateInput!) {\n        updateModelState(input: $input)\n      }\n    "];

export function gql(source: string): DocumentNode | string;
export function gql(source: string) {
  return (documents as any)[source] || source;
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;

export * from "rq-gql";
export * from "./graphql";
