import React, {Fragment, useState} from 'react';
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import {apiService, baseUrl, setProjectDetails} from "../../../utils/constent";
import { useNavigate } from "react-router-dom";
import {Input} from "../../ui/input";
import {projectDetailsAction} from "../../../redux/action/ProjectDetailsAction";
import {useDispatch} from "react-redux";
import {useToast} from "../../ui/use-toast";
import {useTheme} from "../../theme-provider";
import {Loader2} from "lucide-react";

const initialState = {
    projectName: '',
    projectUrl: '',
    projectDomain: '',
    sendInvite: '',
}

const initialStateError = {
    projectName: '',
    projectUrl: '',
    projectDomain: '',
    sendInvite: '',
}
const initialStateProject = {
    name: '',
    website: "",
    domain: '',
    // project_language_id: '3',
    // project_timezone_id: '90',
    // project_logo: '',
    // project_favicon: '',
    // project_api_key: '',
    // project_status: '',
    // project_browser: '',
    // project_ip_address: '',
}

const initialStateErrorProject = {
    name: '',
}

const Step3 = ({setStep}) => {
    const {theme} = useTheme()
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const {toast} = useToast();

    const [projectDetail, setProjectDetail] = useState();
    const [projectDetailError, setProjectDetailError] = useState();
    const [createProjectDetails, setCreateProjectDetails] = useState(initialStateProject);
    const [formError, setFormError] = useState(initialStateErrorProject);
    const [isCreateLoading, setIsCreateLoading] = useState(false);

    const onBoardingFlowComplete = async () => {
        const data = await apiService.onBoardingFlowComplete();
        if(data.status === 200) {
            setStep(4);
        }
    }

    const onChangeText = (event) => {
        const { name, value } = event.target;
        if(name === "name" || name === 'domain'){
            const cleanDomain = (name) => name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const sanitizedProjectName = cleanDomain(value);
            setCreateProjectDetails({
                ...createProjectDetails,
                [name]: value,
                domain: sanitizedProjectName
            });
        } else {
            setCreateProjectDetails({
                ...createProjectDetails,
                [name]: value,
            });
        }
        setFormError(formError => ({
            ...formError,
            [name]: ""
        }));
    };

    const formValidate = (name, value) => {
        switch (name) {
            case "name":
                if (!value || value.trim() === "") {
                    return "Project name is required";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const onFinishSetup = async () => {
        setIsCreateLoading(true);
        let validationErrors = {};
        Object.keys(createProjectDetails).forEach(name => {
            const error = formValidate(name, createProjectDetails[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            setIsCreateLoading(false);
            return;
        }
        debugger
        const cleanDomain = (name) => name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const sanitizedProjectName = cleanDomain(createProjectDetails.name);
        const domain = `${cleanDomain(createProjectDetails.domain || sanitizedProjectName)}.quickhunt.app`;

        const payload = {
            ...createProjectDetails,
            onBoardComplete: 1,
            domain
        };
        const token = localStorage.getItem('token-verify-onboard') || null

        const data = await apiService.createProjects(payload, {Authorization: `Bearer ${token}`})
        console.log("data before", data)
        if (data.success) {
            let obj = {
                ...data.data,
                Title: data.data.name,
                Link: 'onProject',
                icon: '',
                selected: false,
                onBoardComplete: 1
            };
            console.log("data after", data.data)
            setProjectDetails(obj);
            dispatch(projectDetailsAction(obj))
            toast({description: data.message})
            setCreateProjectDetails(initialStateProject)
            setIsCreateLoading(false);
            setStep(4);
            // onBoardingFlowComplete();
            localStorage.setItem("token", token);
            localStorage.removeItem('token-verify-onboard')
        } else {
            setIsCreateLoading(false);
            toast({variant: "destructive" ,description: data.error.message})
        }

        setStep(stepCount)
        // navigate(`${baseUrl}/dashboard`)
    }

    return (
        <Fragment>
            <div className={"flex flex-col justify-center gap-6"}>
                <div>
                    {/*<h2 className={"font-semibold text-2xl text-primary"}>Let’s Create Your first Project</h2>*/}
                    <h2 className={"font-semibold text-2xl text-primary"}>Let’s Get Started!</h2>
                    <p className={"text-sm"}>Get started by creating your first project and streamline feedback management effortlessly.</p>
                </div>
                <div className={`space-y-3`}>
                    <div className="space-y-1">
                        <Label htmlFor="name" className="text-right font-normal">Project Name</Label>
                        <Input
                            id="name"
                            placeholder="Project Name"
                            className={`${theme === "dark" ? "" : "placeholder:text-muted-foreground/75"}`}
                            value={createProjectDetails.name}
                            name="name"
                            onChange={onChangeText}
                        />
                        {
                            formError.name &&
                            <span className="text-destructive text-sm">{formError.name}</span>
                        }
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="website" className="text-right font-normal">Project URL</Label>
                        <Input
                            id="website"
                            placeholder="https://yourcompany.com"
                            className={`${theme === "dark" ? "placeholder:text-card-foreground/80" : "placeholder:text-muted-foreground/75"}`}
                            value={createProjectDetails.website}
                            name="website"
                            onChange={onChangeText}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="domain" className="text-right font-normal">Project Domain</Label>
                        <div className={"relative"}>
                            <Input
                                id="domain"
                                placeholder="Project Domain"
                                className={`${theme === "dark" ? "placeholder:text-muted-foreground/75 pr-[115px]" : "placeholder:text-muted-foreground/75 pr-[115px]"}`}
                                value={createProjectDetails.domain}
                                name="domain"
                                onChange={onChangeText}
                            />
                        </div>
                    </div>
                    {/*<div className="space-y-1">*/}
                    {/*    <Label htmlFor="domain" className="text-right font-normal">Send invites to your team.</Label>*/}
                    {/*    <div className={"flex items-center gap-3"}>*/}
                    {/*    <div className={"relative w-full"}>*/}
                    {/*        <Input*/}
                    {/*            type={"email"}*/}
                    {/*            id="domain"*/}
                    {/*            placeholder="Email"*/}
                    {/*            className={`${theme === "dark" ? "placeholder:text-muted-foreground/75 pr-[115px]" : "placeholder:text-muted-foreground/75 pr-[115px]"}`}*/}
                    {/*            value={createProjectDetails.domain}*/}
                    {/*            name="domain"*/}
                    {/*            onChange={onChangeText}*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*        <Button className={"font-semibold px-4 py-[6px] hover:bg-primary"}>Send invite</Button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </div>
            <div className={"flex justify-end gap-2"}>
                <Button className={"font-semibold px-[29px] hover:bg-primary w-[167px]"} onClick={() => onFinishSetup(4)}>{isCreateLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Finish Signing up"}</Button>
            </div>
        </Fragment>
    );
};

export default Step3;