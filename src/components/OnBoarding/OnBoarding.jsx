import React, {useEffect, useState} from 'react';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import {Icon} from "../../utils/Icon";
import {Label} from "../ui/label";
import {Progress} from "../ui/progress";
import ThankYou from "./Steps/ThankYou";

const OnBoarding = () => {
    const [step, setStep] = useState(1)
    const [progress, setProgress] = useState(33.33);

    useEffect(() => {
        setProgress(step == 1 ? 0 : step == 2 ? 50 : step == 3 ? 100 : 0);
    }, [step]);

    return (
        <div>
            <div className="h-full">
                <div className="ltr">
                    <div>
                        <div className={"min-h-screen bg-background overflow-hidden w-full"}>
                            <div className={"min-h-screen flex w-full justify-center items-center overflow-y-auto px-5"}>
                                <div className={"flex flex-col items-center gap-8 max-w-[414px] w-full "}>
                                    <div>{Icon.blackLogo}</div>
                                    <div className={"w-full space-y-8"}>
                                        {(step === 1 || step === 2 || step === 3) && (
                                            <div className="flex flex-col gap-3 items-center">
                                                <Label>Step {step} of 3</Label>
                                                <Progress value={progress} className="h-3 bg-muted-foreground/20" />
                                            </div>
                                        )}
                                        <div className={"space-y-8"}>
                                            {
                                                step == 1 && <Step1 {...{setStep}}/>
                                            }

                                            {
                                                step == 2 && <Step2 {...{setStep}}/>
                                            }

                                            {
                                                step == 3 && <Step3 {...{setStep}}/>
                                            }

                                            {
                                                step == 4 && <ThankYou {...{setStep}}/>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnBoarding;
