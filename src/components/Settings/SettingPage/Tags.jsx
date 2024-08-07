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
    AlertDialogHeader,
    AlertDialogTitle
} from "../../ui/alert-dialog";
import NoDataThumbnail from "../../../img/Frame.png"
import EmptyData from "../../Comman/EmptyData";

const initialState ={
    title:""
}

const Tags = () => {
    const [topicDetails,setTopicDetails]=useState(initialState);
    const [formError, setFormError] = useState(initialState);
    const [topicLists, setTopicLists] = useState([]);
    const [isLoading,setIsLoading]=useState(true);
    const [isSave,setIsSave]= useState(false);
    const [deleteId,setDeleteId]=useState(null);
    const [showNewTopics, setShowNewTopics] = useState(false);
    const [isEdit,setIsEdit] =useState(null);
    const [disableTagBtn,setDisableTagBtn]=useState(false);
    let apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const { theme } = useTheme();
    const dispatch = useDispatch();

    useEffect(() => {
        if(allStatusAndTypes.topics){
            getAllTopics();
        }
    }, [allStatusAndTypes.topics]);

    const getAllTopics = async () => {
        setIsLoading(true)
        setTopicLists(allStatusAndTypes.topics);
        setIsLoading(false)
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
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, topics: clone}));
            toast({
                description:"Topic create successfully"
            });
            setTopicDetails(initialState);
            setShowNewTopics(false);
        } else {
            setIsSave(false);
            toast({
                description:data.message,
                variant: "destructive",
            });
        }
        setDisableTagBtn(false);
    };

    const updateTopic = async (record,index) => {
        const clone = [...topicLists];
        const topicToSave = clone[index];

        if (!topicToSave.title || topicToSave.title.trim() === "") {
            setFormError({
                ...formError,
                title: "Label name is required."
            });
            return;
        }
        setIsSave(true);
        const payload = {
            title: topicToSave.title,
            project_id: projectDetailsReducer.id
        }
        const data = await apiService.updateTopics(payload, record.id);
        if(data.status === 200){
            const clone = [...topicLists];
            const index = clone.findIndex((x) => x.id === record.id)
            if(index !== -1){
                clone[index] = data.data;
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, topics: clone}));
                setTopicLists(clone)
            }
            setIsSave(false);
            toast({
                description:"Topic update successfully"
            });
            setIsEdit(null);
            setTopicDetails(initialState);
        } else {
            setIsSave(false);
            toast({
                description:"Something went wrong",
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
                description:"Topic deleted successfully"
            });
        } else {
            toast({
                description:"Something went wrong",
                variant: "destructive"
            })
        }
    }

    const handleNewTopics = () => {
        setShowNewTopics(true);
        setDisableTagBtn(true);
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
                <AlertDialogContent className={"w-[310px] md:w-full rounded-lg"}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>You really want delete tag?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action can't be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className={"flex justify-end gap-2"}>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className={"bg-red-600 hover:bg-red-600"} onClick={onDelete}>Delete</AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
            <Card>
                <CardHeader className={"p-4 sm:p-6 gap-1 border-b flex flex-row flex-wrap justify-between items-center gap-y-2"}>
                    <div>
                        <CardTitle className={"text-lg sm:text-2xl font-medium leading-8"}>Tags</CardTitle>
                        <CardDescription className={"text-sm text-muted-foreground p-0 mt-1 leading-5"}>Add Tags so that users can tag them when creating Ideas.</CardDescription>
                    </div>
                    <div className={"m-0"}>
                        <Button onClick={handleNewTopics} disabled={disableTagBtn} className={"text-sm font-semibold"}><Plus size={16} className={"mr-1 text-[#f9fafb]"} />New Tags</Button>
                    </div>
                </CardHeader>
                <CardContent className={"p-0"}>
                    <div className={"grid grid-cols-1 overflow-auto whitespace-nowrap"}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {
                                        ["Tag Name","Last Update","Action"].map((x,i)=>{
                                            return(
                                                <TableHead className={`${i === 0 ? "w-2/5" : i === 1 ? "text-center" : i === 2 ? "text-end" :""} ${theme === "dark" ? "" : "text-card-foreground"}`}>{x}</TableHead>
                                            )
                                        })
                                    }
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {
                                    isLoading ? [...Array(4)].map((_, index) => {
                                        return (
                                            <TableRow key={index}>
                                                {
                                                    [...Array(3)].map((_, i) => {
                                                        return (
                                                            <TableCell key={i} className={"px-2"}>
                                                                <Skeleton className={"rounded-md  w-full h-[24px]"}/>
                                                            </TableCell>
                                                        )
                                                    })
                                                }
                                            </TableRow>
                                        )
                                    }) :
                                        topicLists.length > 0 ?
                                        <>
                                            {
                                                (topicLists || []).map((x,index)=>{
                                                    return(
                                                        <TableRow key={x.id}>
                                                            {isEdit === index ?
                                                                <TableCell className={`font-medium text-xs pl-4 ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                    <Input value={x.title} placeholder="Enter Topic Name" onChange={(e) => handleInputChange(e, index)} name="title" type={"text"}/>
                                                                    {formError?.title && <span className={"text-red-500 text-sm"}>{formError?.title}</span>}
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
                                                                            <Button variant={"outline hover:bg-transparent"} onClick={()=>updateTopic(x,index)} className={`p-1 border w-[30px] h-[30px]`}>
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
                                                    <TableCell className={"pt-[21px] text-end flex flex-row justify-end gap-2"}>
                                                        <Button className={"h-[30px]"} onClick={addTopic}>{isSave ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Add Topic"}</Button>
                                                        <Button
                                                            variant="outline hover:bg-transparent"
                                                            className="p-1 border w-[30px] h-[30px]"
                                                            onClick={()=> {
                                                                setShowNewTopics(false);
                                                                setDisableTagBtn(false);
                                                            }}
                                                        >
                                                            <X size={16}/>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            }
                                        </> : <TableRow>
                                                <TableCell colSpan={6}>
                                                    <EmptyData />
                                                </TableCell>
                                            </TableRow>
                                }
                            </TableBody>
                        </Table>

                    </div>
                </CardContent>
            </Card>
        </Fragment>
    )
};

export default Tags;