import React, {useState, useEffect} from 'react';
import {Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription} from "../../ui/card";
import {Label} from "../../ui/label";
import {Button} from "../../ui/button";
import {Icon} from "../../../utils/Icon";
import {useTheme} from "../../theme-provider";
import {Input} from "../../ui/input";
import {useDispatch,useSelector,} from "react-redux";
import {ApiService} from "../../../utils/ApiService";
import {projectDetailsAction} from "../../../redux/action/ProjectDetailsAction";
import {allProjectAction} from "../../../redux/action/AllProjectAction";
import {setProjectDetails} from "../../../utils/constent";
import {toast} from "../../ui/use-toast";
import {CircleX, Loader2} from "lucide-react";
import DeleteDialog from "../../Comman/DeleteDialog";

const initialState = {
    project_name: '',
    project_website: "",
    project_language_id: '',
    project_timezone_id: '',
    project_logo: '',
    project_favicon: '',
    project_api_key: '',
    project_status: '',
    project_browser: '',
    project_ip_address: ''
}
const initialStateError = {
    project_name: '',
    project_website: "",
}

const Project = () => {
    const {theme} = useTheme();
    const dispatch = useDispatch();
    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allProjectReducer = useSelector(state => state.allProjectReducer);

    const [createProjectDetails, setCreateProjectDetails] = useState(initialState);
    const [formError, setFormError] = useState(initialStateError);
    const [isSave, setIsSave] = useState(false);
    const [isDel, setIsDel] = useState(false);
    const [openDelete,setOpenDelete] = useState(false);
    const [isLoadingDelete,setIsLoadingDelete]= useState(false);

    useEffect(() => {
        if(projectDetailsReducer.id){
            getSingleProjects()
        }
    }, [projectDetailsReducer.id]);

    const getSingleProjects = async () => {
        const data = await apiService.getSingleProjects(projectDetailsReducer.id)
        if(data.status === 200) {
            setCreateProjectDetails({...data.data});
        } else {

        }
    }

    const formValidate = (name, value) => {
        switch (name) {
            case "project_name":
                if (!value || value.trim() === "") {
                    return "Project name is required";
                } else {
                    return "";
                }
            case "project_website":
                if (value && !value.match(/^https:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/)) {
                    return "Project website is invalid";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const onChangeText = (event) => {
        setCreateProjectDetails({...createProjectDetails, [event.target.name]: event.target.value})
        setFormError(formError => ({
            ...formError,
            [event.target.name]: formValidate(event.target.name, event.target.value)
        }));
    };

    const updateProjects = async (record) =>{
        let validationErrors = {};
        Object.keys(createProjectDetails).forEach(name => {
            const error = formValidate(name, createProjectDetails[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        const payload = {...createProjectDetails, ...record}
        let formData = new FormData()
        Object.keys(payload).forEach((key) => {
            // formData.append(key, payload[key] || '')
            if((key === "delete_logo" && createProjectDetails?.project_logo?.name) || (key === "delete_favicon" && createProjectDetails?.project_favicon?.name)){
            }  else {
                formData.append(key,createProjectDetails[key] || '');
            }
        })

        setIsSave(true)
        const data = await apiService.updateProjects(formData, projectDetailsReducer.id)
        if(data.status === 200){
            setProjectDetails(data.data);
            dispatch(projectDetailsAction(data.data))
            setIsSave(false)
            toast({
                description: data.message
            })
        } else {
            setIsSave(false);
            toast({
                description: data.message,
                variant: "destructive"
            })
        }
    }

    const handleFileChange =(file)=>{
        setCreateProjectDetails({...createProjectDetails, project_logo: file.target.files[0]})
    }
    const handleFileChangeFav =(file)=>{
        setCreateProjectDetails({...createProjectDetails, project_favicon: file.target.files[0]})
    }

    const onDeleteImgLogo = async (name, value) => {
        if(createProjectDetails && createProjectDetails?.project_logo && createProjectDetails.project_logo?.name){
            setCreateProjectDetails({...createProjectDetails, project_logo: ""})
        } else {
            setCreateProjectDetails({...createProjectDetails, [name]: value, project_logo: ""})
        }
    }

    const onDeleteImgFav = async (name, value) => {
        if(createProjectDetails && createProjectDetails?.project_favicon && createProjectDetails.project_favicon?.name){
            setCreateProjectDetails({...createProjectDetails, project_favicon: ""})
        } else {
            setCreateProjectDetails({...createProjectDetails, [name]: value, project_favicon: ""})
        }
    }

    const deleteAlert =()=>{
        setOpenDelete(true);
        setIsDel(true);
    }

    const closeDialog = () => {
        setOpenDelete(false);
        setIsDel(false);
    }

    const onDelete = async () => {
        setIsLoadingDelete(true);
        debugger
        const data = await apiService.deleteProjects(projectDetailsReducer.id)
        if(data.status === 200){
            const cloneProject = [...allProjectReducer.projectList]
            const index = cloneProject.findIndex((x) => x.id === projectDetailsReducer.id)
            if(index !== -1){
                cloneProject.splice(index, 1)
                setProjectDetails(cloneProject[0]);
                dispatch(projectDetailsAction(cloneProject[0]))
                dispatch(allProjectAction({projectList: cloneProject}))
            }
            setIsDel(false);
            toast({
                title:"Project delete successfully"
            })
            setTimeout(() => {
                history.push('/')
            },2000)
        } else {

        }
        setOpenDelete(false);
    }

    return (
        <Card>
            {
                openDelete &&
                <DeleteDialog
                    title={"You really want to delete this Project?"}
                    isOpen={openDelete}
                    onOpenChange={closeDialog}
                    onDelete={onDelete}
                    isDeleteLoading={isLoadingDelete}
                />
            }

            <CardHeader className={"p-6 gap-1 border-b p-4 sm:px-5 sm:py-4"}>
                <CardTitle className={"text-lg sm:text-2xl font-normal capitalize"}>Project Setting</CardTitle>
                <CardDescription className={"text-sm text-muted-foreground p-0"}>Configure and manage your project settings.</CardDescription>
            </CardHeader>
            <CardContent className={"p-4 sm:px-5 sm:py-4 border-b space-y-4"}>
                <h3 className={"text-base font-normal"}>Edit Images</h3>
                <div className="w-full items-center ">
                    <div className={"flex flex-wrap sm:flex-nowrap gap-4 gap-x-[94px]"}>
                        <div className={"flex gap-2"}>
                            <div className="w-[50px] h-[50px] relative">
                                <div className="flex gap-2 basis-1/2 items-center justify-center">
                                    {
                                        createProjectDetails?.project_logo ?
                                            <div>
                                                {createProjectDetails && createProjectDetails.project_logo && createProjectDetails.project_logo.name ?
                                                    <div className={"h-[50px] w-[50px] relative border rounded-lg"}>
                                                        <img
                                                            // className={"upload-img"}
                                                            className="h-full w-full rounded-md object-cover"
                                                            src={createProjectDetails && createProjectDetails.project_logo && createProjectDetails.project_logo.name ? URL.createObjectURL(createProjectDetails.project_logo) : createProjectDetails.project_logo}
                                                            alt=""
                                                        />
                                                        <CircleX
                                                            size={20}
                                                            className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                            onClick={() => onDeleteImgLogo('delete_logo', createProjectDetails && createProjectDetails?.project_logo && createProjectDetails.project_logo?.name ? "" : createProjectDetails.project_logo.replace("https://code.quickhunt.app/public/storage/project/", ""))}
                                                        />
                                                    </div> : createProjectDetails.project_logo ?
                                                        <div className={"h-[50px] w-[50px] relative border rounded-lg"}>
                                                            <img
                                                                // className={"upload-img"}
                                                                className="h-full w-full rounded-md object-cover"
                                                                src={createProjectDetails.project_logo}
                                                                alt=""/>
                                                            <CircleX
                                                                size={20}
                                                                className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                                onClick={() => onDeleteImgLogo('delete_logo', createProjectDetails && createProjectDetails?.project_logo && createProjectDetails.project_logo?.name ? "" : createProjectDetails.project_logo.replace("https://code.quickhunt.app/public/storage/project/", ""))}
                                                            />
                                                        </div>
                                                        : ''}
                                            </div> :
                                            <div>

                                                <input
                                                    id="project_logo"
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                                <label
                                                    htmlFor="project_logo"
                                                    // className="border-dashed w-[80px] h-[80px] sm:w-[132px] sm:h-[128px] py-[52px] flex items-center justify-center bg-muted border border-muted-foreground rounded cursor-pointer"
                                                    className="flex w-[50px] bg-muted h-[50px] py-0 justify-center items-center flex-shrink-0 rounded cursor-pointer"
                                                >
                                                    <span className="text-center text-muted-foreground font-medium text-[14px]">{Icon.editImgLogo}</span>
                                                </label>
                                            </div>
                                    }
                                </div>

                            </div>
                            <div className={"flex flex-col gap-1 "}>
                                <h4 className={"text-sm font-normal"}>Logo</h4>
                                <p className={"text-xs font-normal text-muted-foreground"}>50px By 50px</p>
                            </div>
                        </div>
                        <div className={"flex gap-2"}>
                            {
                                createProjectDetails?.project_favicon ?
                                    <div>
                                        {createProjectDetails && createProjectDetails.project_favicon && createProjectDetails.project_favicon.name ?
                                            <div className={"h-[50px] w-[50px] relative border rounded-lg"}>
                                                <img
                                                    // className={"upload-img"}
                                                    className="h-full w-full rounded-md object-cover"
                                                    src={createProjectDetails && createProjectDetails.project_favicon && createProjectDetails.project_favicon.name ? URL.createObjectURL(createProjectDetails.project_favicon) : createProjectDetails.project_favicon}
                                                    alt=""
                                                />
                                                <CircleX
                                                    size={20}
                                                    className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                    onClick={() => onDeleteImgFav('delete_favicon', createProjectDetails && createProjectDetails?.project_favicon && createProjectDetails.project_favicon?.name ? "" : createProjectDetails.project_favicon.replace("https://code.quickhunt.app/public/storage/project/", ""))}
                                                />
                                            </div> : createProjectDetails.project_favicon ?
                                                <div className={"h-[50px] w-[50px] relative border rounded-lg"}>
                                                    <img
                                                        // className={"upload-img"}
                                                        className="h-full w-full rounded-md object-cover"
                                                        src={createProjectDetails.project_favicon}
                                                        alt=""/>
                                                    <CircleX
                                                        size={20}
                                                        className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                        onClick={() => onDeleteImgFav('delete_favicon', createProjectDetails && createProjectDetails?.project_favicon && createProjectDetails.project_favicon?.name ? "" : createProjectDetails.project_favicon.replace("https://code.quickhunt.app/public/storage/project/", ""))}
                                                    />
                                                </div>
                                                : ''}
                                    </div> :
                                    <div>

                                        <input
                                            id="project_favicon"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChangeFav}
                                        />
                                        <label
                                            htmlFor="project_favicon"
                                            className="flex w-[50px] bg-muted h-[50px] py-0 justify-center items-center flex-shrink-0 rounded cursor-pointer"
                                        >
                                            <span className="text-center text-muted-foreground font-medium text-[14px]">{Icon.editImgLogo}</span>
                                        </label>
                                    </div>
                            }
                            <div className={"flex flex-col gap-1"}>
                                <h4 className={"text-sm font-normal"}>Favicon</h4>
                                <p className={"text-xs font-normal text-muted-foreground"}>64px By 64px</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardContent className={"p-4 sm:px-5 sm:py-4 border-b"}>
                <div className={"flex flex-wrap sm:flex-nowrap gap-4 w-full"}>
                    <div className="basis-full sm:basis-1/2 space-y-1">
                        <Label htmlFor="project_name" className={"font-normal capitalize"}>Project Name</Label>
                        <Input type="text" onChange={onChangeText} name={"project_name"} value={createProjectDetails.project_name} id="project_name" placeholder="Project Name" />
                        {
                            formError.project_name &&  <p className="text-red-500 text-xs mt-1" >{formError.project_name}</p>
                        }
                    </div>
                    <div className="basis-full sm:basis-1/2 space-y-1">
                        <Label htmlFor="project_website" className={"font-normal capitalize"}>Project website</Label>
                        <Input type="text" name={"project_website"} onChange={onChangeText} value={createProjectDetails.project_website} id="project_website" placeholder="https://yourcompany.com" />
                        {
                            formError.project_website &&  <p className="text-destructive text-xs mt-1" >{formError.project_website}</p>
                        }
                    </div>
                </div>
            </CardContent>
            <CardFooter className={"p-4 sm:px-5 sm:py-4 flex flex-wrap justify-end sm:justify-end gap-4"}>
                <Button
                    variant={"outline hover:bg-transparent"} onClick={deleteAlert}
                    className={`text-sm font-medium border w-[115px] text-destructive border-destructive capitalize`}
                >{isDel ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete project"}</Button>
                <Button
                    className={`w-[119px] text-sm font-medium hover:bg-primary capitalize`}
                    onClick={() => updateProjects('')}>{isSave ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update project"}</Button>
            </CardFooter>
        </Card>
    );
};

export default Project;