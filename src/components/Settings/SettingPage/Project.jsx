import React, {useState, useEffect} from 'react';
import {Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription} from "../../ui/card";
import {Label} from "../../ui/label";
import {Button} from "../../ui/button";
import {Icon} from "../../../utils/Icon";
import {Input} from "../../ui/input";
import {useDispatch, useSelector,} from "react-redux";
import {projectDetailsAction} from "../../../redux/action/ProjectDetailsAction";
import {allProjectAction} from "../../../redux/action/AllProjectAction";
import {apiService, DO_SPACES_ENDPOINT, setProjectDetails} from "../../../utils/constent";
import {toast} from "../../ui/use-toast";
import {CircleX, Loader2} from "lucide-react";
import DeleteDialog from "../../Comman/DeleteDialog";

const initialState = {
    name: '',
    website: "",
    languageId: '',
    timezoneId: '',
    logo: '',
    favicon: '',
    apiKey: '',
    status: '',
    browser: '',
    ipAddress: ''
}
const initialStateError = {
    name: '',
    website: "",
    logo: '',
    favicon: '',
}

const Project = () => {
    const dispatch = useDispatch();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allProjectReducer = useSelector(state => state.allProjectReducer);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);

    const [createProjectDetails, setCreateProjectDetails] = useState(initialState);
    const [formError, setFormError] = useState(initialStateError);
    const [isSave, setIsSave] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const userProjectCount = allProjectReducer?.projectList?.filter(x => x.userId == userDetailsReducer?.id)

    useEffect(() => {
        if (projectDetailsReducer.id) {
            getSingleProjects()
        }
    }, [projectDetailsReducer.id]);

    const getSingleProjects = async () => {
        const data = await apiService.getSingleProjects(projectDetailsReducer.id)
        if (data.success) {
            setCreateProjectDetails({...data.data});
        }
    }

    const formValidate = (name, value) => {
        switch (name) {
            case "name":
                if (!value || value.trim() === "") {
                    return "Project name is required";
                } else {
                    return "";
                }
            case "website":
                if (value && !value.match(/^https:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/)) {
                    return "Project website is invalid";
                } else {
                    return "";
                }
            case "logo":
                if (value && value.size > 5 * 1024 * 1024) { // 5 MB
                    return "Image size must be less than 5 MB.";
                } else {
                    return "";
                }
            case "favicon":
                if (value && value.size > 5 * 1024 * 1024) { // 5 MB
                    return "Image size must be less than 5 MB.";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const onChangeText = (event) => {
        const { name, value } = event.target;
        const trimmedValue = (name === "name" || name === "website") ? value.trimStart() : value;
        setCreateProjectDetails(prev => ({ ...prev, [name]: trimmedValue }));
        setFormError(prev => ({
            ...prev,
            [name]: formValidate(name, trimmedValue)
        }));
    };

    const handleFileChange = (file) => {
        const selectedFile = file.target.files[0];
        setCreateProjectDetails({
            ...createProjectDetails,
            logo: selectedFile
        });
        setFormError(formError => ({
            ...formError,
            'logo': formValidate('logo', selectedFile)
        }));
    };

    const handleFileChangeFav = (file) => {
        const selectedFile = file.target.files[0];
        setCreateProjectDetails({
            ...createProjectDetails,
            favicon: selectedFile
        });
        setFormError(formError => ({
            ...formError,
            'favicon': formValidate('favicon', selectedFile)
        }));
    };

    const onDeleteImgLogo = async (name, value) => {
        if (createProjectDetails && createProjectDetails?.logo && createProjectDetails.logo?.name) {
            setCreateProjectDetails({...createProjectDetails, logo: ""})
        } else {
            setCreateProjectDetails({...createProjectDetails, [name]: value, logo: ""})
        }
    }

    const onDeleteImgFav = async (name, value) => {
        if (createProjectDetails && createProjectDetails?.favicon && createProjectDetails.favicon?.name) {
            setCreateProjectDetails({...createProjectDetails, favicon: ""})
        } else {
            setCreateProjectDetails({...createProjectDetails, [name]: value, favicon: ""})
        }
    }

    const updateProjects = async (record) => {
        const trimmedName = createProjectDetails.name ? createProjectDetails.name.trim() : "";
        const trimmedWebsite = createProjectDetails.website ? createProjectDetails.website.trim() : "";
        const updatedIdea = {
            ...createProjectDetails,
            name: trimmedName,
            website: trimmedWebsite,
        };
        setCreateProjectDetails(updatedIdea);
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
            if ((key === "deleteLogo" && createProjectDetails?.logo?.name) || (key === "deleteFavicon" && createProjectDetails?.favicon?.name)) {
            } else {
                formData.append(key, createProjectDetails[key] || '');
            }
        })
        setIsSave(true)
        const data = await apiService.updateProjects(formData, projectDetailsReducer.id)
        setIsSave(false)
        if (data.success) {
            setProjectDetails(data.data);
            dispatch(projectDetailsAction(data.data))
            toast({description: data.message})
        } else {
            toast({description: data.error.message, variant: "destructive"})
        }
    }

    const deleteAlert = () => {
        setOpenDelete(true);
    }

    const closeDialog = () => {
        setOpenDelete(false);
    }

    const onDelete = async () => {
        setIsLoadingDelete(true);
        const data = await apiService.deleteProjects(projectDetailsReducer.id)
        setIsLoadingDelete(false);
        if (data.success) {
            const cloneProject = [...allProjectReducer.projectList]
            const index = cloneProject.findIndex((x) => x.id === projectDetailsReducer.id)
            if (index !== -1) {
                cloneProject.splice(index, 1)
                setProjectDetails(cloneProject[0]);
                dispatch(projectDetailsAction(cloneProject[0]))
                dispatch(allProjectAction({projectList: cloneProject}))
            }
            toast({title: "Project delete successfully"})
        } else {
            toast({description: data.error?.message, variant: "destructive"})
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
                <CardTitle className={"text-xl lg:text-2xl font-medium capitalize"}>Project Setting</CardTitle>
                <CardDescription className={"text-sm text-muted-foreground p-0"}>Configure and manage your project
                    settings.</CardDescription>
            </CardHeader>
            <CardContent className={"p-4 sm:px-5 sm:py-4 border-b space-y-4"}>
                <h3 className={"text-base font-medium"}>Edit Images</h3>
                <div className="w-full items-center ">
                    <div className={"flex flex-wrap sm:flex-nowrap gap-4 gap-x-[94px]"}>
                        <div className={"space-y-2"}>
                            <div className={"flex gap-2"}>
                                <div className="w-[50px] h-[50px] relative">
                                    <div className="flex gap-2 basis-1/2 items-center justify-center">
                                        {
                                            createProjectDetails?.logo ?
                                                <div>
                                                    {createProjectDetails?.logo && (
                                                        <div className="h-[50px] w-[50px] relative border rounded-lg">
                                                            <img
                                                                className="h-full w-full rounded-md object-cover"
                                                                src={createProjectDetails.logo?.name ? URL.createObjectURL(createProjectDetails.logo) : `${DO_SPACES_ENDPOINT}/${createProjectDetails.logo}`}
                                                                alt="logo"
                                                            />
                                                            <CircleX
                                                                size={20}
                                                                className="stroke-gray-500 dark:stroke-white cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10"
                                                                onClick={() => onDeleteImgLogo("deleteLogo", createProjectDetails?.logo?.name ? "" : createProjectDetails?.logo)}
                                                            />
                                                        </div>
                                                    )}
                                                </div> :
                                                <div>
                                                    <input
                                                        id="logo"
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                    />
                                                    <label
                                                        htmlFor="logo"
                                                        className="flex w-[50px] bg-muted h-[50px] py-0 justify-center items-center flex-shrink-0 rounded cursor-pointer"
                                                    >
                                                        <span
                                                            className="text-center text-muted-foreground font-medium text-[14px]">{Icon.editImgLogo}</span>
                                                    </label>
                                                </div>
                                        }
                                    </div>

                                </div>
                                <div className={"flex flex-col gap-1 "}>
                                    <h4 className={"text-sm font-medium"}>Logo</h4>
                                    <p className={"text-xs font-normal text-muted-foreground"}>50px By 50px</p>
                                </div>
                            </div>
                            {formError.logo && <div className={"text-xs text-destructive"}>{formError.logo}</div>}
                        </div>
                        <div className={"space-y-2"}>
                            <div className={"flex gap-2"}>
                                {
                                    createProjectDetails?.favicon ?
                                        <div>
                                            {createProjectDetails?.favicon && (
                                                <div className="h-[50px] w-[50px] relative border rounded-lg">
                                                    <img
                                                        className="h-full w-full rounded-md object-cover"
                                                        src={createProjectDetails.favicon?.name ? URL.createObjectURL(createProjectDetails.favicon) : `${DO_SPACES_ENDPOINT}/${createProjectDetails.favicon}`}
                                                        alt="favicon"
                                                    />
                                                    <CircleX
                                                        size={20}
                                                        className="stroke-gray-500 dark:stroke-white cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10"
                                                        onClick={() => onDeleteImgFav("deleteFavicon", createProjectDetails.favicon?.name ? "" : createProjectDetails.favicon)}
                                                    />
                                                </div>
                                            )}
                                        </div> :
                                        <div>
                                            <input
                                                id="favicon"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileChangeFav}
                                            />
                                            <label
                                                htmlFor="favicon"
                                                className="flex w-[50px] bg-muted h-[50px] py-0 justify-center items-center flex-shrink-0 rounded cursor-pointer"
                                            >
                                                <span
                                                    className="text-center text-muted-foreground font-medium text-[14px]">{Icon.editImgLogo}</span>
                                            </label>
                                        </div>
                                }
                                <div className={"flex flex-col gap-1"}>
                                    <h4 className={"text-sm font-medium"}>Favicon</h4>
                                    <p className={"text-xs font-normal text-muted-foreground"}>64px By 64px</p>
                                </div>
                            </div>
                            {formError.favicon && <div className={"text-xs text-destructive"}>{formError.favicon}</div>}
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardContent className={"p-4 sm:px-5 sm:py-4 border-b"}>
                <div className={"flex flex-wrap sm:flex-nowrap gap-4 w-full"}>
                    <div className="basis-full sm:basis-1/2 space-y-1">
                        <Label htmlFor="name" className={"font-medium capitalize after:ml-1 after:content-['*'] after:text-destructive"}>Project Name</Label>
                        <Input type="text" onChange={onChangeText} name={"name"} value={createProjectDetails.name}
                               id="name" placeholder="Project Name"/>
                        {
                            formError.name && <p className="text-red-500 text-xs mt-1">{formError.name}</p>
                        }
                    </div>
                    <div className="basis-full sm:basis-1/2 space-y-1">
                        <Label htmlFor="website" className={"font-medium capitalize after:ml-1 after:content-['*'] after:text-destructive"}>Project website</Label>
                        <Input type="text" name={"website"} onChange={onChangeText} value={createProjectDetails.website}
                               id="website" placeholder="https://yourcompany.com"/>
                        {
                            formError.website && <p className="text-destructive text-xs mt-1">{formError.website}</p>
                        }
                    </div>
                </div>
            </CardContent>
            <CardFooter className={"p-4 sm:px-5 sm:py-4 flex flex-wrap justify-end sm:justify-end gap-4"}>
                {
                    (userDetailsReducer?.id == createProjectDetails?.userId && userProjectCount > 1) &&
                    <Button
                        variant={"outline hover:bg-transparent"} onClick={deleteAlert}
                        className={`text-sm font-medium border w-[115px] text-destructive border-destructive capitalize`}
                    >Delete project</Button>
                }
                <Button
                    className={`w-[119px] text-sm font-medium hover:bg-primary capitalize`}
                    onClick={() => updateProjects('')}>{isSave ?
                    <Loader2 className="h-4 w-4 animate-spin"/> : "Update project"}</Button>
            </CardFooter>
        </Card>
    );
};

export default Project;