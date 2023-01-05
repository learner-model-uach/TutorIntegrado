import dynamic from "next/dynamic";

const Lvltutor = dynamic(
    () => {
        return import("./Tools/Solver2");
    },
    { ssr: false }
);

export const Plain = ({steps, topicId}) => {
    //currentContent={id:0,code:"topic code?",label:"algo",description:"algo",KCs=[{}],extra={ejercicio:JSON, clientStorage ...}}
    //currentContent={id:0,code:"topic code?",label:"algo",description:"algo",KCs=[{}],ejercicio:JSON}

    

    return (
        <>
        {steps?.type == "lvltutor" ? (
            <Lvltutor topicId={topicId} steps={steps} nextRouter="/" />
        ) : "potato"}
        </>
    )
}

export default Plain

