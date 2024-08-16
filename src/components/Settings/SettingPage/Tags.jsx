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
import {allStatusAndTypesAction} from "../../../redux/action/AllStatusAndTypesAction";
import {toast} from "../../ui/use-toast";
import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../../ui/dialog";
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
    const [isEdit,setIsEdit] =useState(null);
    const [openDelete,setOpenDelete] = useState(false);
    const [isLoadingDelete,setIsLoadingDelete] = useState(false);

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
        setTopicLists(allStatusAndTypes.topics);
        setIsLoading(false);
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

    const addTopic = async (index) => {
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
        const clone = [...topicLists];

        if(data.status === 200){

            clone.push(data.data);
            clone.splice(index,1);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, topics: clone}))
            setTopicLists(clone);
            setIsSave(false);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, topics: clone}));
            toast({
                description:data.message
            });
            setTopicDetails(initialState);
        } else {
            setIsSave(false);
            toast({
                description:data.message,
                variant: "destructive",
            });
        }
        setIsEdit(null);
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
                description:data.message
            });
            setIsEdit(null);
            setTopicDetails(initialState);
        } else {
            setIsSave(false);
            toast({
                description:data.message,
                variant: "destructive"
            });
        }
    }

    const onDelete = async ()=> {
        setIsLoadingDelete(true);
        const data = await apiService.deleteTopics(deleteId);
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
                description:data.message
            });
            setIsLoadingDelete(false);
            setOpenDelete(false);
        } else {
            toast({
                description:data.message,
                variant: "destructive"
            });
            setIsLoadingDelete(false);
            setOpenDelete(false);
        }
    }

    const handleNewTopics = () => {
       const clone = [...topicLists];
       clone.push(initialState);
       setTopicLists(clone);
       setIsEdit(clone.length-1);
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
        setFormError(initialState);
        const clone =[...topicLists];
        if(isEdit !== null && !clone[isEdit]?.id){
            clone.splice(isEdit, 1)
            setIsEdit(index)
            setTopicLists(clone);
        } else {
            setIsEdit(index)
        }
    }

    const handleCancel = (index) => {
        const clone = [...topicLists];
        clone.splice(index,1);
        setTopicLists(clone);
        setIsEdit(null);
        setTopicDetails(initialState);
        setFormError(initialState);
    }

    return (
        <Fragment>
            {
                openDelete &&
                <Fragment>
                    <Dialog open onOpenChange={()=> setOpenDelete(false)}>
                        <DialogContent className="max-w-[350px] w-full sm:max-w-[525px] p-3 md:p-6 rounded-lg">
                            <DialogHeader className={"flex flex-row justify-between gap-2"}>
                                <div className={"flex flex-col gap-2"}>
                                    <DialogTitle className={"text-start"}>You really want delete this tag?</DialogTitle>
                                    <DialogDescription className={"text-start"}>This action can't be undone.</DialogDescription>
                                </div>
                                <X size={16} className={"m-0 cursor-pointer"} onClick={() => setOpenDelete(false)}/>
                            </DialogHeader>
                            <DialogFooter className={"flex-row justify-end space-x-2"}>
                                <Button variant={"outline hover:none"}
                                        className={"text-sm font-semibold border"}
                                        onClick={() => setOpenDelete(false)}>Cancel</Button>
                                <Button
                                    variant={"hover:bg-destructive"}
                                    className={` ${theme === "dark" ? "text-card-foreground" : "text-card"} ${isLoading === true ? "py-2 px-6" : "py-2 px-6"} w-[76px] text-sm font-semibold bg-destructive`}
                                    onClick={onDelete}
                                >
                                    {isLoadingDelete ? <Loader2 size={16} className={"animate-spin"}/> : "Delete"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Fragment>
            }

            <Card>
                <CardHeader className={"p-4 sm:p-6 gap-1 border-b flex flex-row flex-wrap justify-between items-center gap-y-2"}>
                    <div>
                        <CardTitle className={"text-lg sm:text-2xl font-medium leading-8"}>Tags</CardTitle>
                        <CardDescription className={"text-sm text-muted-foreground p-0 mt-1 leading-5"}>Add Tags so that users can tag them when creating Ideas.</CardDescription>
                    </div>
                    <div className={"m-0"}>
                        <Button onClick={handleNewTopics} disabled={isEdit != null} className={"text-sm font-semibold"}><Plus size={16} className={"mr-1 text-[#f9fafb]"} />New Tags</Button>
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
                                                <TableHead className={`px-2 py-[10px] md:px-3 ${i === 0 ? "w-2/5" : i === 1 ? "text-center" : i === 2 ? "text-end" :""} ${theme === "dark" ? "" : "text-card-foreground"}`}>{x}</TableHead>
                                            )
                                        })
                                    }
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {
                                        topicLists.length > 0 ?
                                        <>
                                            {
                                                (topicLists || []).map((x,index)=>{
                                                    return(

                                                        <TableRow key={x.id}>
                                                            {
                                                                isEdit == index && x.id ?
                                                                    <Fragment>
                                                                        <TableCell className={`px-2 py-[10px] md:px-3 font-medium text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                            <Input value={x.title} placeholder="Enter Topic Name" onChange={(e) => handleInputChange(e, index)} name="title" type={"text"}/>
                                                                            {formError?.title && <span className={"text-red-500 text-sm"}>{formError?.title}</span>}
                                                                        </TableCell>
                                                                        <TableCell/>
                                                                        <TableCell className={"flex justify-end px-2 py-[10px] md:px-3"}>
                                                                                <div className="pr-0">
                                                                                    <Button variant={"outline hover:bg-transparent"} onClick={()=>updateTopic(x,index)} className={`p-1 border w-[30px] h-[30px]`}>
                                                                                        {isSave ? <Loader2 className="mr-1 h-4 w-4 animate-spin justify-center"/> :<Check size={16}/>}
                                                                                    </Button>
                                                                                </div>
                                                                                <div className="pl-2">
                                                                                    <Button onClick={()=>{
                                                                                     setIsEdit(null);
                                                                                     setTopicLists(allStatusAndTypes.topics);
                                                                                     setTopicDetails(initialState);
                                                                                    }} variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px]`}>
                                                                                        <X  size={16}/>
                                                                                    </Button>
                                                                                </div>
                                                                        </TableCell>
                                                                    </Fragment>
                                                                    :
                                                                    <Fragment>
                                                                        {
                                                                            x.id ? <Fragment>
                                                                                        <TableCell className={`px-2 py-[10px] md:px-3 font-medium text-xs  ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                                            {x.title}
                                                                                        </TableCell>
                                                                                        <TableCell className={`px-2 py-[10px] md:px-3 font-medium text-xs text-center ${theme === "dark" ? "" : "text-muted-foreground"}`}>{moment.utc(x.updated_at).local().startOf('seconds').fromNow()}</TableCell>
                                                                                        <TableCell className={"flex justify-end px-2 py-[10px] md:px-3"}>
                                                                                            <Fragment>
                                                                                                <div className="pr-0">
                                                                                                    <Button onClick={() => handleEditTopic(index)} variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px] `}>
                                                                                                        <Pencil size={16}/>
                                                                                                    </Button>
                                                                                                </div>
                                                                                                <div className="pl-2">
                                                                                                    <Button onClick={() => {
                                                                                                        setDeleteId(x.id);
                                                                                                        setOpenDelete(true);
                                                                                                    }} variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px]`}>
                                                                                                        <Trash2 size={16}/>
                                                                                                    </Button>
                                                                                                </div>
                                                                                            </Fragment>
                                                                                        </TableCell>
                                                                                </Fragment>
                                                                                 :
                                                                                    <Fragment>
                                                                                            <TableCell className={"px-2 py-[10px] md:px-3"}>
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
                                                                                            <TableCell className={"text-center px-2 py-[10px] md:px-3"}/>
                                                                                            <TableCell className={"px-2 py-[15px] md:px-3 text-end flex flex-row justify-end gap-2"}>
                                                                                                <Button className={`${isSave === true ? "py-2 px-4" : "py-2 px-4"} w-[100px] h-[30px] text-sm font-semibold`} onClick={()=>addTopic(index)}>{isSave ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Add Tag"}</Button>
                                                                                                <Button
                                                                                                    variant="outline hover:bg-transparent"
                                                                                                    className="p-1 border w-[30px] h-[30px]"
                                                                                                    onClick={()=>handleCancel(index)}
                                                                                                >
                                                                                                    <X size={16}/>
                                                                                                </Button>
                                                                                            </TableCell>
                                                                                    </Fragment>
                                                                        }
                                                                    </Fragment>
                                                            }
                                                        </TableRow>
                                                    )
                                                })
                                            }
                                        </> : (topicLists.length == 0 && isLoading == false) ? <TableRow>
                                                <TableCell colSpan={6}>
                                                    <EmptyData />
                                                </TableCell>
                                            </TableRow> : null
                                }
                            </TableBody>
                        </Table>

                    </div>
                </CardContent>
            </Card>
        </Fragment>
    );
};

export default Tags;