import React, {useState, useEffect, Fragment} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../ui/card";
import {Button} from "../../ui/button";
import {Check, Loader2, Pencil, Plus, Trash2, X} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import {useSelector,useDispatch} from "react-redux";
import {ApiService} from "../../../utils/ApiService";
import {useTheme} from "../../theme-provider";
import {Input} from "../../ui/input";
import moment from "moment";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "../../ui/alert-dialog";
import {Skeleton} from "../../ui/skeleton";
import {allStatusAndTypesAction} from "../../../redux/action/AllStatusAndTypesAction";
import {toast} from "../../ui/use-toast";
import NoDataThumbnail from "../../../img/Frame.png";
import {Separator} from "../../ui/separator";

const initialState ={
    title:""
}

const Board = () => {
    const [boardList,setBoardList]=useState([]);
    const [isLoading,setIsLoading]=useState(false);
    const [isSave,setIsSave]= useState(false);
    const [boardDetail,setBoardDetail]=useState(initialState);
    const [formError, setFormError] = useState(initialState);
    const [showNewBoard, setShowNewBoard] = useState(false);
    const [isEdit,setIsEdit]=useState(null)
    const [deleteId,setDeleteId]=useState(null);
    const dispatch = useDispatch();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    let apiService = new ApiService();
    const {theme}=useTheme();

    useEffect(()=>{
        getBoardList();
    },[projectDetailsReducer.id])

    const getBoardList = async () => {
        setIsLoading(true);
        const payload ={
            project_id:projectDetailsReducer.id,
            search:""
        }
        const data = await apiService.getAllBoards(payload);
        if(data.status === 200){
           setBoardList(data.data);
           setIsLoading(false);
        }else{
            setIsLoading(false);
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

    const onBlur = (e) => {
        const { name, value } = e.target;
        setFormError({
            ...formError,
            [name]: formValidate(name, value)
        });
    };

    const handleInputChange = (e,index) => {
        const {name,value}= e.target;
        if(index != undefined){
            const clone =[...boardList];
            clone[index]= {...clone[index],[name]:value}
            setBoardList(clone);
            setBoardDetail({...boardDetail,[name]:value});
        }
        else{
            setBoardDetail({...boardDetail,[name]:value});
        }
        setFormError(formError => ({...formError, [e.target.name]: ""}));
    }

    const addBoard = async () => {
        let validationErrors = {};
        Object.keys(boardDetail).forEach(name => {
            const error = formValidate(name, boardDetail[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setIsSave(true);
        const payload ={
            project_id: projectDetailsReducer.id,
            title:boardDetail.title
        }
        const data = await apiService.createBoard(payload);
        if(data.status === 200){
            setIsSave(false)
            const clone = [...boardList];
            clone.push(data.data);
            setBoardList(clone);
            setBoardDetail(initialState);
            setIsEdit(null);
            setShowNewBoard(null);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, boards: clone}));
            toast({
                description:"Board inserted successfully"
            });
        }
        else{
            setIsSave(false)
            toast({
                description:"Something went wrong",
                variant: "destructive"
            });
        }
    }

    const deleteTopic =(id) =>{
        setDeleteId(id)
    }

    const handleEditBoard = (index) => {
        setIsEdit(index)
    }

    const updateBoard = async (record,index)=>{
        const clone = [...boardList];
        const boardToSave = clone[index];

        if (!boardToSave.title || boardToSave.title.trim() === "") {
            setFormError({
                ...formError,
                title: "Label name is required."
            });
            return;
        }
        setIsSave(true);
        const payload = {
            title: boardToSave.title,
            project_id: projectDetailsReducer.id
        }
        const data = await apiService.updateBoard(payload, record.id);
        if(data.status === 200){
            const clone = [...boardList];
            const index = clone.findIndex((x) => x.id === record.id)
            if(index !== -1){
                clone[index] = data.data;
                setBoardList(clone);
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, boards: clone}));
            }
            setIsSave(false);
            toast({
                description:"Board updated successfully"
            });
            setIsEdit(null);
            setBoardDetail(initialState);
        } else {
            setIsSave(false);
            toast({
                description:"Something went wrong",
                variant: "destructive"
            });
        }
    }

    const onDelete = async ()=> {
        const data = await apiService.deleteBoard(deleteId);
        if(data.status === 200){
            const clone = [...boardList];
            const index = clone.findIndex((x) => x.id === deleteId);
            if(index !== -1){
                clone.splice(index, 1);
                setBoardList(clone);
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, boards: clone}));
                setDeleteId(null);
            }
            toast({
                description:"Board deleted successfully"
            });
        } else {
            toast({
                description:"Something went wrong",
                variant: "destructive"
            });
        }
    }

    return (
        <Fragment>
            <AlertDialog open={deleteId} onOpenChange={setDeleteId}>
                <AlertDialogContent className={"w-[310px] md:w-full rounded-lg"}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>You really want delete board?</AlertDialogTitle>
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
                <CardHeader className={"flex flex-row flex-wrap md:flex-nowrap justify-between gap-x-6 items-center p-4 sm:p-6 "}>
                    <div>
                        <CardTitle className={"text-lg sm:text-2xl font-medium"}>Board</CardTitle>
                        <CardDescription className={"text-sm text-muted-foreground p-0"}>Use Boards to track Ideas on your Roadmap.</CardDescription>
                    </div>
                    <div className={"mt-1 md:m-0"}>
                        <Button
                            disabled={showNewBoard}
                            className="flex gap-1 items-center text-sm font-semibold m-0"
                            onClick={()=>setShowNewBoard(true)}
                        >
                            <div><Plus size={20} /></div>New Board
                        </Button>
                    </div>
                </CardHeader>
                <Separator/>
                <CardContent className="p-0">
                    <div className={"grid grid-cols-1 overflow-auto whitespace-nowrap"}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {
                                        ["Board name","Last Update","Action"].map((x,i)=>{
                                            return(
                                                <TableHead key={i} className={` pl-4 ${i === 0 ? "pl-4 w-2/5" : i === 1 ? "text-center" : "pr-[39px] text-end "} ${theme === "dark" ? "" : "text-card-foreground"}`}>{x}</TableHead>
                                            )
                                        })
                                    }
                                </TableRow>
                            </TableHeader>
                            {
                                isLoading ? <TableBody>
                                    {
                                        [...Array(4)].map((_, index) => {
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
                                        })
                                    }
                                </TableBody>
                                    :
                                <TableBody>
                                        {
                                            (boardList || []).map((x,i)=>{
                                                return(
                                                    <TableRow key={x.id}>
                                                        {isEdit == i ?
                                                            <TableCell className={`font-medium text-xs pl-4 ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                <Input value={x.title} placeholder="Enter Board Name" onChange={(e) => handleInputChange(e, i)} name="title" type={"text"}/>
                                                                {formError?.title && <span className={"text-red-500 text-sm"}>{formError?.title}</span>}
                                                            </TableCell>
                                                            :
                                                            <TableCell className={`font-medium text-xs pl-4 ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                {x.title}
                                                            </TableCell>
                                                        }
                                                        <TableCell className={`font-medium text-xs text-center ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                            {moment.utc(x?.updated_at).local().startOf('seconds').fromNow()}
                                                        </TableCell>
                                                        <TableCell className={"flex justify-end "}>
                                                            {isEdit == i ?
                                                                <Fragment>
                                                                    <div className="pr-0">
                                                                        <Button variant={"outline hover:bg-transparent"} onClick={()=>updateBoard(x,i)} className={`p-1 border w-[30px] h-[30px]`}>
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
                                                                        <Button onClick={() => handleEditBoard(i)} variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px] `}>
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
                                            showNewBoard && <TableRow>
                                                <TableCell>
                                                    <Input
                                                        value={boardDetail.title}
                                                        type={"text"}
                                                        id={"title"}
                                                        onChange={(e)=>handleInputChange(e)}
                                                        name={"title"}
                                                        onBlur={onBlur}
                                                        placeholder={"Enter board name"}
                                                    />
                                                    {formError?.title && <span className={"text-red-500 text-sm"}>{formError?.title}</span>}
                                                </TableCell>
                                                <TableCell className={"text-center"}>

                                                </TableCell>
                                                <TableCell className={"flex justify-end"}>
                                                    <Button onClick={addBoard}>{isSave ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Add Board"}</Button>
                                                </TableCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                            }
                        </Table>
                        {isLoading === false && boardList.length === 0 && <div className={"flex flex-row justify-center py-[45px]"}>
                            <div className={"flex flex-col items-center gap-2"}>
                                <img src={NoDataThumbnail} className={"flex items-center"}/>
                                <h5 className={`text-center text-2xl font-medium leading-8 ${theme === "dark" ? "" : "text-[#A4BBDB]"}`}>No Data</h5>
                            </div>
                        </div>}
                    </div>
                </CardContent>
            </Card>
        </Fragment>

    );
};

export default Board;