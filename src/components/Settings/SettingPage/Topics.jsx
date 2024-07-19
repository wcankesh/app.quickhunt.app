import React, {useState,useEffect,Fragment} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../ui/card";
import {useTheme} from "../../theme-provider";
import {Button} from "../../ui/button";
import {Check, Loader2, Pencil, Plus, Trash2, X} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import {Input} from "../../ui/input";
import {ApiService} from "../../../utils/ApiService";
import {useSelector,useDispatch} from "react-redux";
import moment from "moment";
import {Skeleton} from "../../ui/skeleton";
import {allStatusAndTypesAction} from "../../../redux/action/AllStatusAndTypesAction";
import {toast} from "../../ui/use-toast";
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
import SettingEmptyDataTable from "../../Comman/SettingEmptyDataTable";

const initialState ={
    title:""
}

const tableHeadingsArray = [
    {label:"Topic Name"},
    {label:"Last Update"},
    {label:"Action"}
];

const Topics = () => {
    const [topicDetails,setTopicDetails]=useState(initialState);
    const [formError, setFormError] = useState(initialState);
    const [topicLists, setTopicLists] = useState([]);
    const [isLoading,setIsLoading]=useState(false);
    const [isSave,setIsSave]= useState(false);
    const [deleteId,setDeleteId]=useState(null);
    const [showNewTopics, setShowNewTopics] = useState(false);
    const [isEdit,setIsEdit] =useState(null);
    let apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const { theme } = useTheme();
    const dispatch = useDispatch();

    useEffect(() => {
        getAllTopics()
    }, [projectDetailsReducer.id]);

    const getAllTopics = async () => {
        setIsLoading(true);
        const data = await apiService.getAllTopics(projectDetailsReducer.id)
        if(data.status === 200){
            setTopicLists(data.data);
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    }

    const formValidate = (name, value) => {
        switch (name) {
            case "title":
                if (!value || value.trim() === "") {
                    return "Title is required";
                }else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const addTopic = async () => {
        let validationErrors = {};
        Object.keys(topicDetails).forEach(name => {
            const error = formValidate(name, topicDetails[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setIsSave(true);
        const payload = {
            title: topicDetails.title,
            project_id: projectDetailsReducer.id
        }
        const data = await apiService.createTopics(payload);
        if(data.status === 200){
            const clone = [...topicLists];
            clone.push(data.data);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, topics: clone}))
            setTopicLists(clone);
            setIsSave(false);
            toast({
                title:"Topic create successfully"
            });
            setTopicDetails(initialState);
            setShowNewTopics(false);
        } else {
            setIsSave(false);
        }
    };

    const updateTopic = async (record) => {
        let validationErrors = {};
        Object.keys(topicDetails).forEach(name => {
            const error = formValidate(name, topicDetails[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setIsSave(true);
        const payload = {
            title: topicDetails.title,
            project_id: projectDetailsReducer.id
        }
        const data = await apiService.updateTopics(payload, record.id);
        if(data.status === 200){
            const clone = [...topicLists];
            const index = clone.findIndex((x) => x.id === record.id)
            if(index !== -1){
                clone[index] = data.data;
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, topics: clone}))
                setTopicLists(clone)
            }
            setIsSave(false);
            toast({
                title:"Topic update successfully"
            });
            setIsEdit(null);
            setTopicDetails(initialState);
        } else {
            setIsSave(false);
            toast({
                title:"Something went wrong",
                variant: "destructive"
            });
        }
    }

    const deleteTopic = (id) => {
        setDeleteId(id);
    }

    const onDelete = async ()=> {
        const data = await apiService.deleteTopics(deleteId)
        if(data.status === 200){
            const clone = [...topicLists];
            const index = clone.findIndex((x) => x.id === deleteId)
            if(index !== -1){
                clone.splice(index, 1);
                setTopicLists(clone)
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, topics: clone}));
                setDeleteId(null);
            }
            toast({
                title:"Topic delete successfully"
            });
        } else {
            toast({
                title:"Something went wrong",
                variant: "destructive"
            })
        }
    }

    const handleNewTopics = () => {
        setShowNewTopics(true);
    }

    const handleInputChange = (e,index) => {
        const {name,value}= e.target;
        if(index != undefined){
            const clone =[...topicLists];
            clone[index]= {...clone[index],[name]:value}
            setTopicLists(clone);
            setTopicDetails({...topicDetails,[name]:value});
        }
        else{
            setTopicDetails({...topicDetails,[name]:value});
        }
        setFormError(formError => ({...formError, [e.target.name]: ""}));
    }

    const onBlur = (e) => {
        const { name, value } = e.target;
        setFormError({
            ...formError,
            [name]: formValidate(name, value)
        });
    };

    const handleEditTopic = (index) => {
        setIsEdit(index);
    }

    return (
        <Fragment>
            <AlertDialog open={deleteId} onOpenChange={setDeleteId}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>You really want delete Topic?</AlertDialogTitle>
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
            <Card>
                <CardHeader className={"p-6 gap-1 border-b flex flex-row justify-between items-center"}>
                    <div>
                        <CardTitle className={"text-2xl font-medium leading-8"}>Topics</CardTitle>
                        <CardDescription className={"text-sm text-muted-foreground p-0 mt-1 leading-5"}>Add Topics so that users can tag them when creating Ideas.</CardDescription>
                    </div>
                    <div className={"m-0"}>
                        <Button onClick={handleNewTopics} disabled={showNewTopics} className={"text-sm font-semibold"}><Plus size={16} className={"mr-1 text-[#f9fafb]"} />New Topics</Button>
                    </div>
                </CardHeader>
                <CardContent className={"p-0"}>
                    {
                        isLoading ?  <Table>
                            <TableHeader className={""}>
                                <TableRow>
                                    <TableHead className={`w-2/5 pl-4 ${theme === "dark" ? "" : "text-card-foreground"}`}>Topic Name</TableHead>
                                    <TableHead className={`text-center ${theme === "dark" ? "" : "text-card-foreground"}`}>Last Update</TableHead>
                                    <TableHead className={`pr-[39px] text-end ${theme === "dark" ? "" : "text-card-foreground"}`}>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    [...Array(5)].map((_,index)=>{
                                        return(
                                            <TableRow key={index}>
                                                <TableCell><Skeleton className={"w-full h-[24px] rounded-md"}/></TableCell>
                                                <TableCell><Skeleton className={"w-full h-[24px] rounded-md"}/></TableCell>
                                                <TableCell><Skeleton className={"w-full h-[24px] rounded-md"}/></TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table> : showNewTopics === false && topicLists.length === 0 ? <SettingEmptyDataTable tableHeadings={tableHeadingsArray}/> :
                            <Table>
                                <TableHeader className={"p-0"}>
                                    <TableRow>
                                        <TableHead className={`pl-4 w-2/5 ${theme === "dark" ? "" : "text-card-foreground"}`}>Topic Name</TableHead>
                                        <TableHead className={`text-center ${theme === "dark" ? "" : "text-card-foreground"}`}>Last Update</TableHead>
                                        <TableHead className={`text-end pr-[39px] ${theme === "dark" ? "" : "text-card-foreground"}`}>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        (topicLists || []).map((x,index)=>{
                                            return(
                                                <TableRow key={x.id}>
                                                    {isEdit === index ?
                                                        <TableCell className={`font-medium text-xs pl-4 ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                            <Input value={x.title} placeholder="Enter Topic Name" onChange={(e) => handleInputChange(e, index)} name="title" type={"text"}/>
                                                        </TableCell>
                                                         :
                                                        <TableCell className={`font-medium text-xs pl-4 ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                            {x.title}
                                                        </TableCell>
                                                    }
                                                    <TableCell className={`font-medium text-xs text-center ${theme === "dark" ? "" : "text-muted-foreground"}`}>{moment.utc(x.updated_at).local().startOf('seconds').fromNow()}</TableCell>
                                                    <TableCell className={"flex justify-end "}>
                                                        {isEdit === index ?
                                                            <Fragment>
                                                                <div className="pr-0">
                                                                    <Button variant={"outline hover:bg-transparent"} onClick={()=>updateTopic(x)} className={`p-1 border w-[30px] h-[30px]`}>
                                                                        {isSave ? <Loader2 className="mr-1 h-4 w-4 animate-spin justify-center"/> :<Check size={16}/>}
                                                                    </Button>
                                                                </div>
                                                                <div className="pl-2">
                                                                    <Button variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px]`}>
                                                                        <X onClick={()=>setIsEdit(null)} size={16}/>
                                                                    </Button>
                                                                </div>
                                                            </Fragment>
                                                            :
                                                            <Fragment>
                                                                <div className="pr-0">
                                                                    <Button onClick={() => handleEditTopic(index)} variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px] `}>
                                                                        <Pencil size={16}/>
                                                                    </Button>
                                                                </div>
                                                                <div className="pl-2">
                                                                    <Button onClick={() => deleteTopic(x.id)} variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px]`}>
                                                                        <Trash2 size={16}/>
                                                                    </Button>
                                                                </div>
                                                            </Fragment>}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                    {
                                        showNewTopics && <TableRow>
                                            <TableCell>
                                                <Input
                                                    value={topicDetails.title}
                                                    type={"text"}
                                                    id={"title"}
                                                    onChange={(e)=>handleInputChange(e)}
                                                    name={"title"}
                                                    onBlur={onBlur}
                                                    placeholder={"Enter topic name"}
                                                />
                                                {formError?.title && <span className={"text-red-500 text-sm"}>{formError?.title}</span>}
                                            </TableCell>
                                            <TableCell className={"text-center"}>

                                            </TableCell>
                                            <TableCell className={"flex justify-end"}>
                                               <Button onClick={addTopic}>{isSave ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Add Topic"}</Button>
                                            </TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                    }
                </CardContent>
            </Card>
        </Fragment>
    )
};

export default Topics;