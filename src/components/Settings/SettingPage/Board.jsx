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
import {allStatusAndTypesAction} from "../../../redux/action/AllStatusAndTypesAction";
import {toast} from "../../ui/use-toast";
import {Separator} from "../../ui/separator";
import EmptyData from "../../Comman/EmptyData";
import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../../ui/dialog";

const initialState ={
    title:""
}

const Board = () => {
    const [boardList,setBoardList]=useState([]);
    const [isLoading,setIsLoading]=useState(true);
    const [isSave,setIsSave]= useState(false);
    const [formError, setFormError] = useState(initialState);
    const [isEdit,setIsEdit]=useState(null);
    const [deleteId,setDeleteId]=useState(null);
    const [openDelete,setOpenDelete] =useState(false);
    const [isLoadingDelete,setIsLoadingDelete]=useState(false);
    const dispatch = useDispatch();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);
    let apiService = new ApiService();
    const {theme, onProModal} = useTheme();

    useEffect(()=>{
        if(allStatusAndTypes?.boards){
            getBoardList();
        }
    },[allStatusAndTypes?.boards])

    const getBoardList = async () => {
       setBoardList(allStatusAndTypes.boards);
       setIsLoading(false);
    }

    const formValidate = (name, value) => {
        switch (name) {
            case "title":
                if (!value || value.trim() === "") {
                    return "Board name is required";
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

    const handleInputChange = (event,index) => {
        const { name, value } = event.target;
        const updateBoard = [...boardList];
        updateBoard[index] = { ...updateBoard[index], [name]: value };
        setBoardList(updateBoard);
        setFormError(x => ({...x, [name]: ""}));
    }

    const onEdit = (index) => {
        setFormError(initialState);
        const clone =[...boardList];
        if(isEdit !== null && !clone[isEdit]?.id){
            clone.splice(isEdit, 1)
            setIsEdit(index)
            setBoardList(clone);
        } else if (isEdit !== index){
            setBoardList(allStatusAndTypes?.boards);
            setIsEdit(index);
        } else {
            setIsEdit(index);
        }
    }

    const updateBoard = async (index)=>{
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
        setIsSave(true);
        const payload = {
            title: boardToSave.title,
            project_id: projectDetailsReducer.id
        }
        const data = await apiService.updateBoard(payload, boardToSave.id);
        if(data.status === 200){
            const clone = [...boardList];
            const index = clone.findIndex((x) => x.id === boardToSave.id)
            if(index !== -1){
                clone[index] = data.data;
                setBoardList(clone);
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, boards: clone}));
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

    const addBoard = async (newStatus,index) => {
        let validationErrors = {};
        Object.keys(newStatus).forEach(name => {
            const error = formValidate(name, newStatus[name]);
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
            title: newStatus.title,
        }
        const data = await apiService.createBoard(payload);
        const clone = [...boardList];

        if(data.status === 200){
            clone.push(data.data);
            clone.splice(index,1);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, boards: clone}))
            setBoardList(clone);
            setIsSave(false);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, boards: clone}));
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

    const onDelete = async ()=> {
        setIsLoadingDelete(true);
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
                description:data.message
            });
            setOpenDelete(false)
            setIsLoadingDelete(false);
        } else {
            toast({
                description:data.message,
                variant: "destructive"
            });
            setOpenDelete(false);
            setIsLoadingDelete(false);
        }
    }

    const createNewBoard = () => {
        const clone = [...boardList];
        let length = boardList?.length;
        if(userDetailsReducer.plan === 0){
            if(length < 1){
                onProModal(false)
            }  else{
                onProModal(true)
            }
        } else if(userDetailsReducer.plan === 1){
            onProModal(false)
            clone.push(initialState);
            setBoardList(clone);
            setIsEdit(clone.length - 1);
        }
    }

    const handleDeleteBoard = (id) => {
        setDeleteId(id);
        setOpenDelete(true);
        setBoardList(allStatusAndTypes.boards);
        setIsEdit(null)
    };

    const onEditCancel = () => {
        setIsEdit(null)
        setBoardList(allStatusAndTypes?.boards);
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
                                    <DialogTitle className={"text-start"}>You really want delete this board?</DialogTitle>
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
                <CardHeader className={"flex flex-row flex-wrap md:flex-nowrap justify-between gap-x-6 items-center p-4 sm:p-6 gap-y-2"}>
                    <div>
                        <CardTitle className={"text-lg sm:text-2xl font-medium"}>Board</CardTitle>
                        <CardDescription className={"text-sm text-muted-foreground p-0"}>Use Boards to track Ideas on your Roadmap.</CardDescription>
                    </div>
                    <Button
                        size={"sm"}
                        disabled={isEdit != null}
                        className={"gap-2 font-semibold hover:bg-primary m-0"}
                        onClick={createNewBoard}
                    >
                        <Plus size={18} strokeWidth={3} />New Board
                    </Button>
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
                                                <TableHead key={i} className={` px-2 py-[10px] md:px-3 ${i === 0 ? "w-2/5" : i === 1 ? "text-center" : "text-end "} ${theme === "dark" ? "" : "text-card-foreground"}`}>{x}</TableHead>
                                            )
                                        })
                                    }
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {
                                    boardList.length > 0 ?
                                    <Fragment>
                                        {
                                            (boardList || []).map((x,i)=>{
                                                return(
                                                    <TableRow key={i}>
                                                        {
                                                            isEdit == i ?
                                                                <Fragment>
                                                                    <TableCell className={"px-2 py-[10px] md:px-3"}>
                                                                        <Input
                                                                            className={"bg-card h-9"}
                                                                            type="title"
                                                                            value={x.title}
                                                                            name={"title"}
                                                                            onBlur={onBlur}
                                                                            onChange={(e) => handleInputChange(e, i)}
                                                                            placeholder={"Add category name"}
                                                                        />
                                                                        <div className="grid gap-2">
                                                                            {
                                                                                formError.title &&
                                                                                <span className="text-red-500 text-sm">{formError.title}</span>
                                                                            }
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell/>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 font-medium text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                        <div className={"flex justify-end gap-2 items-center"}>
                                                                            <Fragment>
                                                                                {
                                                                                    x.id ? <Button
                                                                                        variant="outline hover:bg-transparent"
                                                                                        className={`p-1 border w-[30px] h-[30px] ${isSave ? "justify-center items-center" : ""}`}
                                                                                        onClick={() => updateBoard(i)}
                                                                                    >
                                                                                        {isSave ? <Loader2 className="mr-1 h-4 w-4 animate-spin justify-center"/> : <Check size={16}/>}
                                                                                    </Button> : <Button
                                                                                        variant=""
                                                                                        className="text-sm font-semibold h-[30px] w-[126px]"
                                                                                        onClick={() => addBoard(x, i)}
                                                                                    >
                                                                                        {isSave ? <Loader2 className={"mr-2  h-4 w-4 animate-spin"}/> : "Add Board"}
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
                                                                    <TableCell className={`font-medium text-xs px-2 py-[10px] md:px-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                        {x.title}
                                                                    </TableCell>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 font-medium text-xs text-center ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                        {moment.utc(x?.updated_at).local().startOf('seconds').fromNow()}
                                                                    </TableCell>
                                                                    <TableCell className={`flex justify-end px-2 py-[10px] md:px-3 ${theme === "dark" ? "" : "text-muted-foreground"} `}>
                                                                        <Fragment>
                                                                            <div className="pr-0">
                                                                                <Button onClick={() => onEdit(i)} variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px] `}>
                                                                                    <Pencil size={16}/>
                                                                                </Button>
                                                                            </div>
                                                                            <div className="pl-2">
                                                                                <Button onClick={() => {handleDeleteBoard(x.id);}} variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px]`}>
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
                                    </Fragment> : (boardList.length == 0 && isLoading == false) ? <TableRow>
                                            <TableCell colSpan={6}>
                                                <EmptyData />
                                            </TableCell>
                                        </TableRow> :null
                                }
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </Fragment>
    );
};

export default Board;