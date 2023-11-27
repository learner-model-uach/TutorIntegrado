import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import { useGQLQuery } from "rq-gql";
import { gql } from "../../graphql";

export const CircularP = (href?: String) => {
    //console.log(href);
    const { data, isLoading, isError } = useGQLQuery(
        gql(/* GraphQL */ `
          query LastExercises {
            currentUser {
                email
                modelStates(input: { pagination: {first: 1} }) {
                nodes{json}
                }
                lastOnline
                projects{
                topics{
                    code
                    id
                    childrens{
                    code
                    id
                    content{
                        kcs{
                        id
                        code
                        }
                    }
                    }
                }
            }

        }
          }
        `),
        {
          //code: "fcc1" ?? "",
        },
        {
          refetchOnWindowFocus: false,
          //refetchOnMount: false,
          refetchOnReconnect: false,
        },
      );

    !isLoading && console.log(data?.currentUser?.projects[0].topics)




    return (
        <CircularProgress value={40} color='green.400'>
            <CircularProgressLabel>40% </CircularProgressLabel>
        </CircularProgress>
    )
}