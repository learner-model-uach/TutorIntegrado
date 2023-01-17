import React, {useState} from 'react';
import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { subscribe } from "valtio";
import { sessionState, sessionStateBD } from "../components/SessionState";
import Link from "next/link";


export default function SelectByCode() {

  const [codigo, setCodigo] = useState('');
  const [texto, setTexto] = useState('');
  
  
  useEffect(() => {
    console.log(codigo)
    sessionState.currentContent.code = codigo;
    sessionState.currentContent.description = "hola"; //descripcion del ejercicio ofrecido
    sessionState.currentContent.id = 1; //identificador del ejercicio
    sessionState.currentContent.json = { json: "json del ejercicio" }; //json del ejercicio
    sessionState.currentContent.kcs = [1, 2, 3]; //kcs del ejercicio
    sessionState.currentContent.label = ""; //enunciado o tipo de ejercicio
    
  
  }, [codigo])
  
  function guardar() {
    setCodigo(texto);
  }

  function handleChange(event) {
    setTexto(event.target.value);
  }

  subscribe(sessionState.currentContent, () => {
    /*update currentContent*/
    sessionStateBD.setItem(
      "currentContent",
      JSON.parse(JSON.stringify(sessionState.currentContent))
    );
  });


  return (
    <>
      <div>
          <div>
            <input onChange={handleChange} />
            <Link href="showContent">
              <Button onClick={() => guardar()} >
                Cargar
              </Button>
            </Link>
            
          </div>
      </div>
    </> 
  );
  
}


/*export default function Index() {
    //content/content/solve?type=5
    //useEffect(() => {
    //  Router.replace("exercise/solve");
    //}, []);
  
    return (
      <>
       <div>
       <input type="text" placeholder="Escribe codigo"></input>
       <button onClick={() => router.push("/contentSelect?type=" + router.query.type)}>
        Salir
      </button>
       </div>
      </>
      
      
    ) 

  }*/


//return <div></div>;

//<input type="text" onChange={e => CrearQuery(e.target.value)} placeholder="Escribe codigo">
//</input>
//<button onclick={ e => }