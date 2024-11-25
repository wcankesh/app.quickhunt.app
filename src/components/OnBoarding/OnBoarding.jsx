import React, {useEffect, useState} from 'react';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import {Icon} from "../../utils/Icon";
import {Label} from "../ui/label";
import {Progress} from "../ui/progress";
import ThankYou from "./Steps/ThankYou";
import {useLocation, useNavigate} from "react-router-dom";
import {baseUrl} from "../../utils/constent";

const OnBoarding = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const UrlParams = new URLSearchParams(location.search);
    const stepType = UrlParams.get("step") || 1;
    const [step, setStep] = useState(Number(stepType) <= 3 ? Number(stepType) : 1);

    const [progress, setProgress] = useState(33.33);

    // useEffect(() => {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const token = urlParams.get('token') || localStorage.getItem("token");
    //     if (token) {
    //         navigate(`${baseUrl}/login`);
    //     }
    //     // setProgress(step == 1 ? 0 : step == 2 ? 50 : step == 3 ? 100 : 0);
    // }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const urlStep = parseInt(urlParams.get('step'), 10);

        if (urlStep && urlStep >= 1 && urlStep <= 4) {
            setStep(urlStep);
            setProgress((urlStep - 1) * 33.33);
        }
    }, [location.search]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('step', step);
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.replaceState(null, '', newUrl);

        setProgress((step - 1) * 33.33);
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
