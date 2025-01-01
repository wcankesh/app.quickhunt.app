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
import EmptyData from "../../Comman/EmptyData";
import DeleteDialog from "../../Comman/DeleteDialog";

const initialState ={title:""}

const Tags = () => {
    let apiService = new ApiService();
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);

    const [formError, setFormError] = useState(initialState);
    const [topicLists, setTopicLists] = useState([]);
    const [isLoading,setIsLoading]=useState(true);
    const [isSave,setIsSave]= useState(false);
    const [deleteId,setDeleteId]=useState(null);
    const [isEdit,setIsEdit] =useState(null);
    const [openDelete,setOpenDelete] = useState(false);
    const [isLoadingDelete,setIsLoadingDelete] = useState(false);


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
                    return "Tag name is required";
                }else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const handleInputChange = (event,index) => {
        const { name, value } = event.target;
        const updatedTopic = [...topicLists];
        updatedTopic[index] = { ...updatedTopic[index], [name]: value };
        setTopicLists(updatedTopic);
        setFormError({
            ...formError,
            [name]: formValidate(name, value)
        });
    }

    const addTag = async (newTag,index) => {
        let validationErrors = {};
        Object.keys(newTag).forEach(name => {
            const error = formValidate(name, newTag[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }

        setIsSave(true)
        const payload = {
            project_id: `${projectDetailsReducer.id}`,
            title: newTag.title,
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
        } else {
            setIsSave(false);
            toast({
                description:data.message,
                variant: "destructive",
            });
        }
        setIsEdit(null);
    };

    const handleSaveTopic = async (index) => {
        const clone = [...topicLists];
        const topicToSave = clone[index];

        if (!topicToSave.title || topicToSave.title.trim() === "") {
            setFormError({...formError, title: "Label name is required."});
            return;
        }
        setIsSave(true);
        const payload = {
            title: topicToSave.title,
            project_id: projectDetailsReducer.id
        }
        const data = await apiService.updateTopics(payload, topicToSave.id);
        if(data.status === 200){
            const clone = [...topicLists];
            const index = clone.findIndex((x) => x.id === topicToSave.id)
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
       setIsEdit(clone.length - 1);
       setFormError(initialState);
    }

    const onBlur = (e) => {
        const { name, value } = e.target;
        setFormError({
            ...formError,
            [name]: formValidate(name, value)
        });
    };

    const onEdit = (index) => {
        setFormError(initialState);
        const clone =[...topicLists];
        if(isEdit !== null && !clone[isEdit]?.id){
            clone.splice(isEdit, 1)
            setIsEdit(index)
            setTopicLists(clone);
        } else if (isEdit !== index){
            setTopicLists(allStatusAndTypes?.topics);
            setIsEdit(index);
        }
        else {
            setIsEdit(index);
        }
    }

    const handleDeleteStatus = (id) => {
        setDeleteId(id);
        setOpenDelete(true);
        setTopicLists(allStatusAndTypes.topics);
        setIsEdit(null)
    };

    const onEditCancel = () => {
        setIsEdit(null)
        setTopicLists(allStatusAndTypes.topics);
    }

    return (
        <Fragment>
            {
                openDelete &&
                <DeleteDialog
                    title={"You really want to delete this Tag?"}
                    isOpen={openDelete}
                    onOpenChange={() => setOpenDelete(false)}
                    onDelete={onDelete}
                    isDeleteLoading={isLoadingDelete}
                    deleteRecord={deleteId}
                />
            }

            <Card>
                <CardHeader className={"p-4 sm:px-5 sm:py-4 gap-1 border-b flex flex-row flex-wrap justify-between items-center gap-y-2"}>
                    <div>
                        <CardTitle className={"text-xl lg:text-2xl font-normal"}>Tags</CardTitle>
                        <CardDescription className={"text-sm text-muted-foreground p-0"}>Create tags for users to assign when submitting ideas.</CardDescription>
                    </div>
                    <Button onClick={handleNewTopics} disabled={isEdit != null} className={"gap-2 font-medium hover:bg-primary m-0"}><Plus size={18} strokeWidth={3}/>New Tag</Button>
                </CardHeader>
                <CardContent className={"p-0"}>
                    <div className={"grid grid-cols-1 overflow-auto whitespace-nowrap"}>
                        <Table>
                            <TableHeader className={`dark:bg-transparent bg-muted`}>
                                <TableRow>
                                    {
                                        ["Tag Name","Last Update","Action"].map((x,i)=>{
                                            return(
                                                <TableHead key={x} className={`px-2 py-[10px] md:px-3 font-normal text-card-foreground dark:text-muted-foreground ${i === 0 ? "w-2/5" : i === 1 ? "w-2/5" : ""}`}>{x}</TableHead>
                                            )
                                        })
                                    }
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {
                                    topicLists.length > 0 ?
                                        <Fragment>
                                            {
                                                (topicLists || []).map((x,i)=>{
                                                    return(
                                                        <TableRow key={i}>
                                                            {
                                                                isEdit == i ?
                                                                    <Fragment>
                                                                        <TableCell className={"px-[12px] py-[10px]"}>
                                                                            <Input
                                                                                placeholder={"Enter Tag Name"}
                                                                                className={"bg-card h-9"}
                                                                                type="title"
                                                                                value={x.title}
                                                                                name={"title"}
                                                                                onBlur={onBlur}
                                                                                onChange={(e) => handleInputChange(e, i)}
                                                                            />
                                                                            {
                                                                                formError.title ?
                                                                                    <div className="grid gap-2 mt-[4px]">
                                                                                        {formError.title && <span
                                                                                            className="text-red-500 text-sm">{formError.title}</span>}
                                                                                    </div> : ""
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell/>
                                                                        <TableCell className={`px-2 py-[10px] md:px-3 font-normal align-top text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                            <div className={"flex gap-2 items-center"}>
                                                                                <Fragment>
                                                                                    {
                                                                                        x.id ? <Button
                                                                                            variant="outline hover:bg-transparent"
                                                                                            className={`p-1 border w-[30px] h-[30px] ${isSave ? "justify-center items-center" : ""}`}
                                                                                            onClick={() => handleSaveTopic(i)}
                                                                                        >
                                                                                            {isSave ? <Loader2 className="mr-1 h-4 w-4 animate-spin justify-center"/> : <Check size={16}/>}
                                                                                        </Button> : <Button
                                                                                            className="text-sm font-medium h-[30px] w-[76px] hover:bg-primary"
                                                                                            onClick={() => addTag(x, i)}
                                                                                        >
                                                                                            {isSave ? <Loader2 className={"mr-2  h-4 w-4 animate-spin"}/> : "Add Tag"}
                                                                                        </Button>
                                                                                    }

                                                                                    <Button
                                                                                        variant="outline hover:bg-transparent"
                                                                                        className="p-1 border w-[30px] h-[30px]"
                                                                                        onClick={() =>  x.id ? onEditCancel() : onEdit(null)}
                                                                                    >
                                                                                        <X size={16}/>
                                                                                    </Button>
                                                                                </Fragment>
                                                                            </div>
                                                                        </TableCell>
                                                                    </Fragment>
                                                                    :
                                                                    <Fragment>
                                                                        <TableCell className={`px-2 py-[10px] md:px-3 font-normal text-xs max-w-[140px] truncate text-ellipsis overflow-hidden whitespace-nowrap ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                                {x.title}
                                                                            </TableCell>
                                                                            <TableCell className={`px-2 py-[10px] md:px-3 font-normal text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>{moment.utc(x.updated_at).local().startOf('seconds').fromNow()}</TableCell>
                                                                            <TableCell className={`flex px-2 py-[10px] md:px-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                                <Fragment>
                                                                                    <div className="pr-0">
                                                                                        <Button onClick={() => onEdit(i)} variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px] `}>
                                                                                            <Pencil size={16}/>
                                                                                        </Button>
                                                                                    </div>
                                                                                    <div className="pl-2">
                                                                                        <Button onClick={() => {handleDeleteStatus(x.id);}} variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px]`}>
                                                                                            <Trash2 size={16}/>
                                                                                        </Button>
                                                                                    </div>
                                                                                </Fragment>
                                                                            </TableCell>
                                                                    </Fragment>
                                                            }
                                                        </TableRow>
                                                    )
                                                })
                                            }
                                        </Fragment>
                                        :
                                        <TableRow><TableCell colSpan={6}><EmptyData /></TableCell></TableRow>
                                }
                            </TableBody>
                        </Table>

                    </div>
                </CardContent>
            </Card>
        </Fragment>
    )
}

export default Tags;