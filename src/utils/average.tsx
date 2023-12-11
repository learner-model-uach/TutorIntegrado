export const average = (user: any, topicInfo: any) => {
    let usersMeans: { user: any; email: any; topicsMean: { topicLabel: any; topicCode: any; promedio: number; }[]; }[] = []
    user.userData.map((specificUser:any)=>{
        const modelState = specificUser.modelStates.nodes[0].json
        let userTopics: { topicLabel: any; topicCode: any; promedio: number; }[] = []
        topicInfo.topics.map((topic:any)=>{
            const kcsSize = topic.kcs.length
            let sum = 0;
            topic.kcs.map((kc:any)=>{
                if(modelState[kc.code]){
                    sum += modelState[kc.code].level
                }
            })
            const promedio = sum/kcsSize
            let topicData = {
                topicLabel: topic.label,
                topicCode: topic.code,
                promedio: promedio
            }
            userTopics.push(topicData)
        })
        let dataUsers ={
            "user": specificUser.name,
            "email": specificUser.email,
            "modelStates": specificUser.modelStates.nodes[0].json,
            "topicsMean": userTopics
        }
        usersMeans.push(dataUsers)
    })
    return usersMeans
};
