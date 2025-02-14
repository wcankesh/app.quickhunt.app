import React, {useState} from 'react';
import {useTheme} from "../theme-provider";
import {ApiService} from "../../utils/ApiService";
import {useNavigate} from "react-router-dom";
import {useToast} from "../ui/use-toast";
import {baseUrl, setProjectDetails} from "../../utils/constent";
import Autoplay from "embla-carousel-autoplay";
import carousel_1 from "../../img/carousel1.png";
import carousel_2 from "../../img/carousel2.png";
import carousel_3 from "../../img/carousel3.png";
import {Icon} from "../../utils/Icon";
import {Carousel, CarouselContent, CarouselItem} from "../ui/carousel";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Button} from "../ui/button";
import {Loader2} from "lucide-react";
import {projectDetailsAction} from "../../redux/action/ProjectDetailsAction";
import {useDispatch} from "react-redux";

const initialStateProject = {
    project_name: '',
    project_website: "",
    project_language_id: '3',
    project_timezone_id: '90',
    project_logo: '',
    project_favicon: '',
    project_api_key: '',
    project_status: '',
    project_browser: '',
    project_ip_address: '',
    domain: ''
}
const initialStateErrorProject = {
    project_name: '',
}
const Project = () => {
    const {theme} = useTheme();
    let apiSerVice = new ApiService()
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const {toast} = useToast();

    const [isCreateLoading, setIsCreateLoading] = useState(false);
    const [createProjectDetails, setCreateProjectDetails] = useState(initialStateProject);
    const [formError, setFormError] = useState(initialStateErrorProject);

    const plugin = React.useRef(Autoplay({delay: 2000, stopOnInteraction: true}))
    const imageSources = [carousel_1, carousel_2, carousel_3];

    const onChangeText = (event) => {
        const { name, value } = event.target;
        if(name === "project_name" || name === 'domain'){
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
            case "project_name":
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
        const sanitizedProjectName = cleanDomain(createProjectDetails.project_name);
        const domain = `${cleanDomain(createProjectDetails.domain || sanitizedProjectName)}.quickhunt.app`;
        const payload = {
            ...createProjectDetails,
            domain
        };

        const data = await apiSerVice.createProjects(payload)
        if (data.status === 200) {
            let obj = {
                ...data.data,
                Title: data.data.project_name,
            };
            setProjectDetails(obj);
            dispatch(projectDetailsAction(obj))
            toast({description: data.message})
            setCreateProjectDetails(initialStateProject)
            setIsCreateLoading(false);
            navigate(`${baseUrl}/dashboard`);
        } else {
            setIsCreateLoading(false);
            toast({variant: "destructive" ,description: data.message})
        }
    }

    const sheetCommInput = [
        {
            title: "Project Name",
            placeholder: "Project Name",
            className: `${theme === "dark" ? "" : "placeholder:text-muted-foreground/75"}`,
            name: "project_name",
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
        <div className="h-full">
            <div className="ltr">
                <div>
                    <div className={"min-h-screen bg-background  flex items-center  overflow-hidden w-full"}>
                        <div className={"min-h-screen basis-full flex w-full  justify-center overflow-y-auto"}>
                            <div className="min-h-screen basis-1/2 bg-purple-400 w-full relative hidden xl:flex justify-center p-16 ">
                                <div className={"custom-width"}>
                                    <div className={"h-full flex flex-col justify-center"}>
                                        <div className={"app-logo"}>{theme === "dark" ? Icon.whiteLogo : Icon.blackLogo}</div>
                                        <Carousel
                                            plugins={[plugin.current]}
                                            className="w-full mt-[25px] mb-[25px]"
                                            onMouseEnter={plugin.current.stop}
                                            onMouseLeave={plugin.current.reset}
                                        >
                                            <CarouselContent>
                                                {imageSources.map((src, index) => (
                                                    <CarouselItem key={index} className={"max-w-[706px] w-full shrink-0 grow pl-4"}>
                                                        <img className={"w-[706px]"} src={src} alt={`Carousel image ${index + 1}`} />
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                        </Carousel>
                                        <div className={"description"}>
                                            <p className={"text-white text-center text-[20px]"}>“This library has saved me
                                                countless hours of work and
                                                helped me deliver stunning designs to my clients faster than ever
                                                before.”</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className=" min-h-screen md:basis-1/2 md:p-16 flex justify-center items-center">
                                <div className={"lg:w-[641px] h-full"}>
                                    <div className={"w-full h-full pt-5"}>
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
                                                                    <Label htmlFor="name" className="text-right font-normal">{x.title}</Label>
                                                                    <Input
                                                                        id={x.name}
                                                                        placeholder={x.placeholder}
                                                                        className={x.className}
                                                                        value={createProjectDetails[x.name]}
                                                                        name={x.name}
                                                                        onChange={onChangeText}
                                                                    />
                                                                    {
                                                                        formError[x.name] &&
                                                                        <span className="text-destructive text-sm">{formError[x.name]}</span>
                                                                    }
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Project;