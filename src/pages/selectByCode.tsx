import { Button } from "@chakra-ui/react";
import Link from "next/link";
import DQ2 from '../components/lvltutor/Tools/DQ2';

export default function SelectByCode() {
  
  /*const [codigo, setCodigo] = useState('');
  const [texto, setTexto] = useState('');
  
  
  useEffect(() => {

    const { data } = useGQLQuery(
      gql(`
      query {
        contentByCode(code: "${codigo}" ){
          code
          id
          description
          label
          json
          kcs{code}
        }
      }
    `)
    );

    console.log(codigo)
    sessionState.currentContent = data?.contentByCode;
    data?.contentByCode.json.type;
  
  }, [codigo])
  
  function guardar() {
    setCodigo(texto);
  }

  function handleChange(event: { target: { value: React.SetStateAction<string>; }; }) {
    setTexto(event.target.value);
  }

  subscribe(sessionState.currentContent, () => {
    /*update currentContent
    sessionStateBD.setItem(
      "currentContent",
      JSON.parse(JSON.stringify(sessionState.currentContent)),
    );
  });*/

  return (
    <>
      
      <div>
        <DQ2/>
      </div>
      <div>
       <Link href="showContent">
          <Button >Mostrar Ejercicio</Button>
       </Link>
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
