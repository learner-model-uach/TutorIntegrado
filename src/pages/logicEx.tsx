import { Flex, Heading } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const Potato = () => {
    const router = useRouter()
    return (
        <Flex height="100vh"  alignItems="center" justifyContent="center">
            <Flex direction="column" background="gray.100" p={12} rounded={6}>
                <Heading onClick={() => router.push({pathname:"logicTutor",query:{pid:"Inter"}})}>
                    Representacion de conjuntos1
                </Heading>
                <Heading onClick={() => router.push({pathname:"logicTutor",query:{pid:"Inter1"}})}>
                    Representacion de conjuntos2
                </Heading>
                <Heading onClick={() => router.push({pathname:"logicTutor",query:{pid:"Sucesion"}})}>
                    Sucesion
                </Heading>
                <Heading onClick={() => router.push({pathname:"logicTutor",query:{pid:"Inters"}})}>
                    Interseccion
                </Heading>
                <Heading onClick={() => router.push({pathname:"logicTutor",query:{pid:"Table1"}})}>
                    TablaVerdad
                </Heading>
                <Heading onClick={() => router.push({pathname:"logicTutor",query:{pid:"Union1"}})}>
                    Union
                </Heading>
                <Heading onClick={() => router.push({pathname:"logicTutor",query:{pid:"Prop1"}})}>
                    Proposiciones
                </Heading>
                <Heading onClick={() => router.push({pathname:"logicTutor",query:{pid:"Conj1"}})}>
                    Conjunciones
                </Heading>
                <Heading onClick={() => router.push({pathname:"logicTutor",query:{pid:"pot1"}})}>
                    TestLvlTutor
                </Heading>
            </Flex> 
        </Flex>
    )
}
  
  export default Potato