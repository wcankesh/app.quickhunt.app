import React, {useState,useEffect,Fragment} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../ui/card";
import {useTheme} from "../../theme-provider";
import {Button} from "../../ui/button";
import {Loader2, Pencil, Plus, Trash2, X} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import {Input} from "../../ui/input";
import {Sheet, SheetContent, SheetHeader} from "../../ui/sheet";
import {Label} from "../../ui/label";
import {Separator} from "../../ui/separator";
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
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [topicDetails,setTopicDetails]=useState(initialState);
    const [formError, setFormError] = useState(initialState);
    const [topicLists, setTopicLists] = useState([]);
    const [isLoading,setIsLoading]=useState(false);
    const [isSave,setIsSave]= useState(false);
    const [deleteId,setDeleteId]=useState(null);
    let apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);
    const { theme } = useTheme();
    const dispatch = useDispatch();

    const onEditTopics = (record) => {
        setTopicDetails({...record});
        setSheetOpen(true);
    }

    const onChange = (e) => {
        setTopicDetails({...topicDetails,[e.target.name]:e.target.value});
        setFormError(formError => ({...formError, [e.target.name]: ""}));
    }

    const onBlur = (e) => {
        const { name, value } = e.target;
        setFormError({
            ...formError,
            [name]: formValidate(name, value)
        });
    };

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

    const openSheet = () => setSheetOpen(true);
    const closeSheet = () => {
        setSheetOpen(false);
        setTopicDetails(initialState)
    };

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

    const addCategory = async () => {
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
        } else {
            setIsSave(false);
        }
        closeSheet();
    };
    const updateCategory = async () => {
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
        const data = await apiService.updateTopics(payload, topicDetails.id);
        if(data.status === 200){
            const clone = [...topicLists];
            const index = clone.findIndex((x) => x.id === topicDetails.id)
            if(index !== -1){
                clone[index] = data.data;
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, topics: clone}))
                setTopicLists(clone)
            }
            setIsSave(false);
            toast({
                title:"Topic update successfully"
            });
            setTopicDetails(initialState);
            closeSheet();
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
                        <Button onClick={openSheet} className={"text-sm font-semibold"}><Plus size={16} className={"mr-1 text-[#f9fafb]"} />New Topics</Button>
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
                        </Table> : topicLists.length === 0 ? <SettingEmptyDataTable tableHeadings={tableHeadingsArray}/> :
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
                                                   <TableCell className={`font-medium text-xs pl-4 ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                         {x.title}
                                                   </TableCell>
                                                    <TableCell className={`font-medium text-xs text-center ${theme === "dark" ? "" : "text-muted-foreground"}`}>{moment.utc(x.updated_at).local().startOf('seconds').fromNow()}</TableCell>
                                                    <TableCell className={"flex justify-end "}>
                                                        <div className="pr-0">
                                                           <Button onClick={() => onEditTopics(x)} variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px] ${theme === "dark" ? "" : "text-muted-foreground"}`}><Pencil size={16}/></Button>
                                                        </div>
                                                        <div className="pl-2"><Button onClick={()=>deleteTopic(x.id)} variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px] ${theme === "dark" ? "" : "text-muted-foreground"}`}><Trash2 size={16} /></Button></div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                    }

                </CardContent>
                {isSheetOpen && (
                    <Sheet open={isSheetOpen} onOpenChange={isSheetOpen ? closeSheet : openSheet}>
                        <SheetContent className={"lg:max-w-[661px] sm:max-w-[520px] p-0"} >
                            <SheetHeader className={"px-8 py-6 border-b"}>
                                <div className={"flex justify-between items-center w-full"}>
                                    <h2 className={"text-xl font-medium capitalize"}>{topicDetails.id ? "Edit Topic" : "Add New Topics"}</h2>
                                    <X onClick={closeSheet} className={"cursor-pointer"}/>
                                </div>
                            </SheetHeader>
                            <div className={"px-8 py-6"}>
                                <div className="grid w-full gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input onBlur={onBlur} onChange={onChange} value={topicDetails.title} name="title" placeholder={"Enter the name of Category"} type="text" id="name" className={"h-9"}/>
                                    {formError?.title && <span className={"text-red-500 text-sm"}>{formError?.title}</span>}
                                </div>
                            </div>
                            <Separator/>
                            <div className={"px-8 py-6"}>
                                <Button onClick={topicDetails.id ? updateCategory : addCategory}>{isSave ? <Loader2 className={"mr-2 h-4 w-4 animate-spin"}/> : topicDetails.id ? "Update Category" :"Add Category"}</Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                )}
            </Card>
        </Fragment>
    );
};

export default Topics;