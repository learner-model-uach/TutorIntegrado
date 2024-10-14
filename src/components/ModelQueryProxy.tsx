import { proxy } from "valtio";

export interface g {
  code: string;
  ids: string;
  tags: Array<string>;
}

export interface n {
  json: Object;
  fecha: string;
}

export interface ms {
  nodes: Array<n>;
}

export interface u {
  email: string;
  groups: Array<g>;
  modelStates: ms;
}

export interface usuario {
  users: Array<u>;
}

export interface query {
  usuario: Object;
}

const initialObj: query = {
  usuario: {},
};
/*const initialObj: usuario = {
  user: [
    {
      email: "incialprueba",
      groups: [
        {
          code: "",
          ids: "",
          tags: [],
        },
      ],
      modelStates: {
        nodes: [
          {
            json: {},

            fecha: "",
          },
        ],
      },
    },
  ],
};*/

const UmProxy = proxy(initialObj);

export const reset = () => {
  Object.assign(UmProxy, initialObj);
};

export default UmProxy;
