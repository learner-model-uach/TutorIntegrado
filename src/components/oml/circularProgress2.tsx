import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import { useGQLQuery } from "rq-gql";
import { gql } from "../../graphql";
import { average } from '../../utils/average';

export const CircularP = ({usersInfo, userTopics}: any) => {
    
    return (
        <CircularProgress value={promedioLevel * 100}>
        <CircularProgressLabel>{`${(promedioLevel * 100).toFixed(2)}%`}</CircularProgressLabel>
        </CircularProgress>
        );
    };