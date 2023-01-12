import { useGQLQuery } from "rq-gql";
import { gql } from "../graphql";
import React, {useState} from 'react';
import Router from "next/router";
import { useEffect } from "react";
import router from "next/router";


export default function Index() {
    //content/content/solve?type=5
    //useEffect(() => {
    //  Router.replace("exercise/solve");
    //}, []);
  
    return (
      <>
       <div>
       <input type="text" placeholder="Escribe Codigo"></input>
       <button onClick={() => router.push("/contentSelect?type=" + router.query.type)}>
        Salir
      </button>
       </div>
      </>
      
      
    ) 

  }


//return <div></div>;

//<input type="text" onChange={e => CrearQuery(e.target.value)} placeholder="Escribe Codigo">
//</input>
//<button onclick={ e => }