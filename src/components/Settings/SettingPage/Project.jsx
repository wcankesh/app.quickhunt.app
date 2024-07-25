import React, {useState,useEffect,} from 'react';
import {Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription} from "../../ui/card";
import {Label} from "../../ui/label";
import {Button} from "../../ui/button";
import {Icon} from "../../../utils/Icon";
import {useTheme} from "../../theme-provider";
import {Input} from "../../ui/input";
import {useDispatch,useSelector,} from "react-redux";
import {ApiService} from "../../../utils/ApiService";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "../../ui/alert-dialog";
import {projectDetailsAction} from "../../../redux/action/ProjectDetailsAction";
import {allProjectAction} from "../../../redux/action/AllProjectAction";
import {setProjectDetails} from "../../../utils/constent";
import {toast} from "../../ui/use-toast";
import {Loader2} from "lucide-react";

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
    const [previewImage,setPreviewImage] = useState("");
    const [createProjectDetails, setCreateProjectDetails] = useState(initialState);
    const [formError, setFormError] = useState(initialStateError);
    const [isSave, setIsSave] = useState(false);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allProjectReducer = useSelector(state => state.allProjectReducer);
    const [previewImageFav,setPreviewImageFav]=useState("");
    const [isOpenDeleteAlert,setIsOpenDeleteAlert]=useState(false);
    const dispatch = useDispatch();
    const apiService = new ApiService();

    useEffect(() => {
        if(projectDetailsReducer.id){
            getSingleProjects()
        }
    }, [projectDetailsReducer.id]);

    const getSingleProjects = async () => {
        const data = await apiService.getSingleProjects(projectDetailsReducer.id)
        if(data.status === 200) {
            setCreateProjectDetails({...data.data});
            setPreviewImage(data.data.project_logo);
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
                if (!value.match(/^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/)) {
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
            formData.append(key, payload[key] || '')
        })
        setIsSave(true)
        const data = await apiService.updateProjects(formData, projectDetailsReducer.id)
        if(data.status === 200){
            setProjectDetails(data.data);
            dispatch(projectDetailsAction(data.data))
            setIsSave(false)
            toast({
                description :"Project update successfully"
            })
        } else {
            setIsSave(false);
            toast({
                description :"Something went wrong",
                variant: "destructive"
            })
        }
    }

    const handleFileChange =(file)=>{
        setPreviewImage(URL.createObjectURL(file.target.files[0]));
        setCreateProjectDetails({...createProjectDetails, project_logo: file.target.files[0]})
        updateProjects({...createProjectDetails, project_logo: file.target.files[0]})
    }
    const handleFileChangeFav =(file)=>{
        setPreviewImageFav(URL.createObjectURL(file.target.files[0]));
        setCreateProjectDetails({...createProjectDetails, project_favicon: file.target.files[0]})
        updateProjects({...createProjectDetails, project_favicon: file.target.files[0]})
    }
    const deleteAlert =()=>{
        setIsOpenDeleteAlert(true);
    }
    const onDelete = async () => {
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
            toast({
                title:"Project delete successfully"
            })
            setTimeout(() => {
                history.push('/')
            },2000)
        } else {

        }
    }

    return (
        <Card>
            <AlertDialog open={isOpenDeleteAlert} onOpenChange={setIsOpenDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>You really want delete project?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action can't be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className={"bg-red-600 hover:bg-red-600"} onClick={onDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <CardHeader className={"p-6 gap-1 border-b"}>
                <CardTitle className={"text-2xl font-medium"}>Project Setting</CardTitle>
                <CardDescription className={"text-sm text-muted-foreground p-0"}>Manage your project settings.</CardDescription>
            </CardHeader>
            <CardContent className={"p-0 border-b"}>
                <div className={"px-6 pt-6"}><h3 className={"text-sm font-medium"}>Edit Images</h3></div>
                <div className={"pt-4 p-6"}>
                    <div className="w-full items-center ">
                        <div className={"flex gap-[94px]"}>
                            <div className={"flex gap-2"}>
                                <div className="w-[50px] h-[50px] relative">
                                    <div className="flex basis-1/2 items-center justify-center">
                                        <label
                                            htmlFor="upload_image"
                                            className="flex w-[50px] bg-muted h-[50px] py-0 justify-center items-center flex-shrink-0 rounded cursor-pointer"
                                        >
                                            {previewImage ? <img className={"h-[50px] w-[50px] rounded-md object-cover"} src={previewImage} alt={"not_found"} /> : <span className="text-center text-muted-foreground font-semibold text-[14px]">{Icon.editImgLogo}</span>}
                                            <input
                                                id="upload_image"
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>

                                </div>
                                <div className={"flex flex-col gap-1"}>
                                    <h4 className={"text-sm font-medium"}>Logo</h4>
                                    <p className={"text-xs font-medium text-muted-foreground"}>50px By 50px</p>
                                </div>
                            </div>
                            <div className={"flex gap-2"}>
                                <div className="w-[64px] h-[64px] relative">
                                    <label
                                        htmlFor="upload_image_fav"
                                        className="flex w-[64px] bg-muted h-[64px] py-0 justify-center items-center flex-shrink-0 rounded cursor-pointer"
                                    >
                                        {previewImageFav ? <img className={"h-[64px] w-[64px] rounded-md object-cover"} src={previewImageFav} alt={"not_found"} /> : <span className="text-center text-muted-foreground font-semibold text-[14px]">{Icon.editImgLogo}</span>}
                                        <input
                                            id="upload_image_fav"
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileChangeFav}
                                            accept="image/*"
                                        />
                                    </label>


                                </div>
                                <div className={"flex flex-col gap-1"}>
                                    <h4 className={"text-sm font-medium"}>Favicon</h4>
                                    <p className={"text-xs font-medium text-muted-foreground"}>64px By 64px</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardContent className={"p-6 border-b"}>
                <div className={"flex gap-4 w-full"}>
                    <div className="basis-1/2">
                        <Label htmlFor="project_name">Project Name</Label>
                        <Input type="text" onChange={onChangeText} name={"project_name"} value={createProjectDetails.project_name} id="project_name" placeholder="testingapp" className={"mt-1 mb-1 bg-card"} />
                        {
                            formError.project_name &&  <p className="text-red-500 text-xs mt-1" >{formError.project_name}</p>
                        }
                    </div>
                    <div className="basis-1/2">
                        <Label htmlFor="project_website">Project website</Label>
                        <Input type="text" name={"project_website"} onChange={onChangeText} value={createProjectDetails.project_website} id="project_website" placeholder="https://yourcompany.com" className={"mt-1 mb-1 bg-card"} />
                        {
                            formError.project_website &&  <p className="text-red-500 text-xs mt-1" >{formError.project_website}</p>
                        }
                    </div>
                </div>
            </CardContent>
            <CardFooter className={"pt-4 justify-end gap-6"}>
                <Button variant={"outline hover:bg-transparent"} onClick={deleteAlert} className={`text-sm font-semibold ${theme === "dark" ? "text-card-foreground" : "text-primary"} border border-primary`}>Delete project</Button>
                <Button className={"text-sm font-semibold"} onClick={() => updateProjects('')}>{isSave ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update project"}</Button>
            </CardFooter>
        </Card>
    );
};

export default Project;