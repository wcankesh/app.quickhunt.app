import React, {Fragment} from 'react';
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { baseUrl } from "../../../utils/constent";
import { useNavigate } from "react-router-dom";
import {Input} from "../../ui/input";

const Step3 = ({setStep}) => {
    let navigate = useNavigate();

    const onStep = (stepCount) => {
        setStep(stepCount)
        // navigate(`${baseUrl}/dashboard`)
    }

    return (
        <Fragment>
            <div className={"flex flex-col justify-center gap-6"}>
                <div>
                    <h2 className={"font-semibold text-2xl text-primary"}>Let’s Create Your first Project</h2>
                    <p className={"text-sm"}>Lorem ipsum dolor sit amet consectetur. Risus ut enim eu ut elementum bibendum tempor fermentum. Massa neque.</p>
                </div>
                <div className={`space-y-3`}>
                    <div className="space-y-1">
                        <Label htmlFor="name" className="text-right font-normal">Project Name</Label>
                        <Input
                            id="project_name"
                            placeholder="Project Name"
                            // className={`${theme === "dark" ? "" : "placeholder:text-muted-foreground/75"}`}
                            // value={createProjectDetails.project_name}
                            name="project_name"
                            // onChange={onChangeText}
                            // onBlur={onBlur}
                        />
                        {/*{*/}
                        {/*    formError.project_name &&*/}
                        {/*    <span className="text-destructive text-sm">{formError.project_name}</span>*/}
                        {/*}*/}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="website" className="text-right font-normal">Project URL</Label>
                        <Input
                            id="project_website"
                            placeholder="https://yourcompany.com"
                            // className={`${theme === "dark" ? "placeholder:text-card-foreground/80" : "placeholder:text-muted-foreground/75"}`}
                            // value={createProjectDetails.project_website}
                            name="project_website"
                            // onChange={onChangeText}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="domain" className="text-right font-normal">Project Domain</Label>
                        <div className={"relative"}>
                            <Input
                                id="domain"
                                placeholder="Project Domain"
                                // className={`${theme === "dark" ? "placeholder:text-muted-foreground/75 pr-[115px]" : "placeholder:text-muted-foreground/75 pr-[115px]"}`}
                                // value={createProjectDetails.domain}
                                name="domain"
                                // onChange={onChangeText}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="domain" className="text-right font-normal">Send invites to your team.</Label>
                        <div className={"flex items-center gap-3"}>
                        <div className={"relative w-full"}>
                            <Input
                                type={"email"}
                                id="domain"
                                placeholder="Email"
                                // className={`${theme === "dark" ? "placeholder:text-muted-foreground/75 pr-[115px]" : "placeholder:text-muted-foreground/75 pr-[115px]"}`}
                                // value={createProjectDetails.domain}
                                name="domain"
                                // onChange={onChangeText}
                            />
                        </div>
                            <Button className={"font-semibold px-4 py-[6px] hover:bg-primary"}>Send invite</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"flex justify-between gap-2"}>
                <Button variant={"ghost hover:none"} className={"h-auto p-0 text-primary text-sm font-bold"}>Need help?</Button>
                <Button className={"font-semibold px-[29px] hover:bg-primary"} onClick={() => onStep(4)}>Finish Signing up</Button>
            </div>
        </Fragment>
    );
};

export default Step3;