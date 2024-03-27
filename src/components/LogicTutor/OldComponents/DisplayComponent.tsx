import { DualInputs } from "./DualInputs"
import { ExLog, ExType } from '../../Tools/ExcerciseType';
import dynamic from "next/dynamic";
const TrueFalse = dynamic(() => import("../TrueFalse"),{
    ssr:false,
});
const Blank = dynamic(() => import("../Blank"),{
    ssr:false,
});
const InputButtons = dynamic(() => import("../InputButtons"),{
    ssr:false,
});

const Alternatives = dynamic(() => import("../Alternatives"),{
    ssr:false,
});

const Mathfield = dynamic(() => import("../../Tools/mathLive"),{
    ssr:false,
});

const MultiplePlaceholders = dynamic(() => import("../MultiplePlaceholders"),{
    ssr:false,
})

const TableStep = dynamic(() => import("../TableStepRadio"),{
    ssr:false,
})

const SinglePlaceholder = dynamic(() => import("../SinglePlaceholder"),{
    ssr:false,
})

export const DisplayComponent = ({ exc, nStep }: { exc: ExLog; nStep: number }) => {
    const type = exc.steps[nStep].StepType
    //console.log(type)
    return type === "DualInputs"
        ? <DualInputs exc={exc} nStep={nStep} />
            : type === "TrueFalse"
                ? <TrueFalse exc={exc} nStep={nStep}/>
                : type === "Blank"
                    ? <Blank exc={exc} nStep={nStep}/>
                    : type === "Alternatives"
                        ? <Alternatives exc={exc} nStep={nStep}/>
                        : type === "InputButtons"
                            ? <InputButtons exc={exc} nStep={nStep}/>
                                :  type === "MultiplePlaceholders"
                                    ? <MultiplePlaceholders exc={exc} nStep={nStep}/>
                                        :  type==="SinglePlaceholder"
                                            ?<SinglePlaceholder exc={exc} nStep={nStep}/>
                                                :type==="TableStep"
                                                    ?<TableStep exc={exc} nStep={nStep}/>
                                                        :null
}