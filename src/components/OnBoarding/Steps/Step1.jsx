import React, {Fragment} from 'react';;
import {Button} from "../../ui/button";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../../utils/constent";

const Step1 = ({setStep}) => {
    let navigate = useNavigate();

    const onStep = (stepCount) => {
        setStep(stepCount)
        // navigate(`${baseUrl}/on-boarding`)
    }

    return (
        <Fragment>
            <div className={"flex flex-col items-center justify-center gap-[48px]"}>
                <h1 className={"font-semibold text-[32px]"}>Welcome to Quickhunt !!</h1>
                <div className={""}>
                    <h3 className={"text-2xl text-primary font-semibold mb-2"}>Let’s set you up !</h3>
                    <p className={"text-sm"}>Capture feedback, prioritize ideas, manage helpdesk inquiries, and share progress with your users—all in one place.</p>
                </div>
            </div>
            <div className={"flex justify-end"}>
                <Button className={"font-semibold px-[29px] hover:bg-primary"} onClick={() => onStep(2)}>Let’s Get Started</Button>
            </div>
        </Fragment>
    );
};

export default Step1;