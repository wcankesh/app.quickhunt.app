import React, {useState} from 'react';
import {useTheme} from "../theme-provider";
import {ApiService} from "../../utils/ApiService";
import {useNavigate} from "react-router-dom";
import {useToast} from "../ui/use-toast";
import {apiService, baseUrl, setProjectDetails} from "../../utils/constent";
import {Button} from "../ui/button";
import {Loader2} from "lucide-react";
import {projectDetailsAction} from "../../redux/action/ProjectDetailsAction";
import {useDispatch} from "react-redux";
import AuthLayout from "./CommonAuth/AuthLayout";
import FormInput from "./CommonAuth/FormInput";

const initialStateProject = {
    name: '',
    website: "",
    domain: '',
    languageId: '3',
    timezoneId: '90',
    logo: '',
    favicon: '',
    apiKey: '',
    status: 1,
    browser: '',
    ipAddress: '',
}

const initialStateErrorProject = {
    name: '',
}
const Project = () => {
    const {theme} = useTheme();
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const {toast} = useToast();

    const [isCreateLoading, setIsCreateLoading] = useState(false);
    const [createProjectDetails, setCreateProjectDetails] = useState(initialStateProject);
    const [formError, setFormError] = useState(initialStateErrorProject);

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

    const onCreateProject = async () => {
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

        const cleanDomain = (name) => name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const sanitizedProjectName = cleanDomain(createProjectDetails.name);
        const domain = `${cleanDomain(createProjectDetails.domain || sanitizedProjectName)}.quickhunt.app`;
        const payload = {
            ...createProjectDetails,
            domain
        };

        const data = await apiService.createProjects(payload)
        setIsCreateLoading(false);
        if (data.success) {
            let obj = {
                ...data.data,
                Title: data.data.name,
            };
            setProjectDetails(obj);
            dispatch(projectDetailsAction(obj))
            toast({description: data.message})
            setCreateProjectDetails(initialStateProject)
            navigate(`${baseUrl}/dashboard`);
        } else {
            toast({variant: "destructive" ,description: data?.error?.message})
        }
    }

    const sheetCommInput = [
        {
            title: "Project Name",
            placeholder: "Project Name",
            className: `${theme === "dark" ? "" : "placeholder:text-muted-foreground/75"}`,
            name: "name",
        },
        {
            title: "Project Website",
            placeholder: "https://yourcompany.com",
            className: `${theme === "dark" ? "placeholder:text-card-foreground/80" : "placeholder:text-muted-foreground/75"}`,
            name: "project_website",
        },
        {
            title: "Project Domain",
            placeholder: "Project Domain",
            className: `${theme === "dark" ? "placeholder:text-muted-foreground/75 pr-[115px]" : "placeholder:text-muted-foreground/75 pr-[115px]"}`,
            name: "domain",
            span: "quickhunt.app",
        },
    ]

    return (
        <AuthLayout>
            <div className="mx-auto flex items-center w-[320px] md:w-[392px] px-3 h-full">
                <div className={"w-full flex flex-col gap-8"}>
                    <div className="gap-2 flex flex-col items-start">
                        <h1 className="text-2xl md:text-3xl font-medium">Create Your Project</h1>
                    </div>

                    <div className="grid gap-6">

                        <div className="grid gap-6">
                            {
                                sheetCommInput.map((x) => (
                                    <div className="grid gap-2">
                                        <FormInput
                                            label={x.title}
                                            error={formError[x.name]}

                                            id={x.name}
                                            placeholder={x.placeholder}
                                            className={x.className}
                                            value={createProjectDetails[x.name]}
                                            name={x.name}
                                            onChange={onChangeText}
                                        />
                                        {/*<Label htmlFor="name" className="text-right font-normal">{x.title}</Label>*/}
                                        {/*<Input*/}
                                        {/*    id={x.name}*/}
                                        {/*    placeholder={x.placeholder}*/}
                                        {/*    className={x.className}*/}
                                        {/*    value={createProjectDetails[x.name]}*/}
                                        {/*    name={x.name}*/}
                                        {/*    onChange={onChangeText}*/}
                                        {/*/>*/}
                                        {/*{*/}
                                        {/*    formError[x.name] &&*/}
                                        {/*    <span className="text-destructive text-sm">{formError[x.name]}</span>*/}
                                        {/*}*/}
                                    </div>
                                ))
                            }
                            <Button
                                type="submit"
                                className={"w-full bg-primary hover:bg-primary font-medium"}
                                onClick={onCreateProject}
                            >
                                {isCreateLoading ? <Loader2 className={"mr-2 h-4 w-4 animate-spin"}/> : ""}
                                Continue Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    )
};

export default Project;