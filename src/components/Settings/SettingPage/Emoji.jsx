import React, { Fragment, useState,useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import {Check, Loader2, Pencil, Plus, Trash2, X} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { useTheme } from "../../theme-provider";
import EmojiPicker from "emoji-picker-react";
import { Popover, PopoverContent } from "../../ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Input } from "../../ui/input";
import {ApiService} from "../../../utils/ApiService";
import {useSelector} from "react-redux";
import {toast} from "../../ui/use-toast";
import {useDispatch} from "react-redux";
import {allStatusAndTypesAction} from "../../../redux/action/AllStatusAndTypesAction";
import EmptyData from "../../Comman/EmptyData";
import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../../ui/dialog";
import DeleteDialog from "../../Comman/DeleteDialog";

const Emoji = () => {
    const [selectedEmoji, setSelectedEmoji] = useState({});
    const [emojiList, setEmojiList] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [isLoading,setIsLoading] = useState(true);
    const [isSave,setIsSave]=useState(false);
    const [isEdit,setIsEdit]=useState(false);
    const [isChangeEditEmoji,setIsChangeEditEmoji]=useState(false);
    const [validationError, setValidationError] = useState('');
    const [openDelete,setOpenDelete] = useState(false);
    const [isDeleteLoading,setIsDeleteLoading] = useState(false);

    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const dispatch = useDispatch();
    const theme = useTheme();

    useEffect(()=>{
        if(allStatusAndTypes.emoji){
            getAllEmoji();
        }
    },[allStatusAndTypes.emoji])

    const getAllEmoji = async () => {
        setEmojiList(allStatusAndTypes.emoji);
        setIsLoading(false);
    }

    const handleEmojiSelect = (event) => {
        if(isEdit){
            setIsChangeEditEmoji(true);
        }
        setSelectedEmoji(event);
        setValidationError('');
    };

    const newEmoji = () => {
        const clone = [...emojiList];
        clone.push({});
        setEmojiList(clone);
        setEditIndex(clone.length - 1);
        setValidationError("");
    };

    const addEmoji = async (index) => {
        if (!selectedEmoji.imageUrl) {
            setValidationError('Emoji is required.');
            return;
        }
        setIsSave(true);
        const payload ={
            emoji:selectedEmoji.emoji,
            emoji_url:selectedEmoji.imageUrl,
            project_id:projectDetailsReducer.id
        }
        const data = await apiService.createEmoji(payload);
        if (data.status === 200){
            const clone = [...emojiList];
            clone.push({emoji:selectedEmoji.emoji,emoji_url:selectedEmoji.imageUrl,id:data.data});
            clone.splice(index,1);
            setEmojiList(clone);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, emoji: clone}))
            toast({
                description: data.message
            });
            setIsSave(false);
        }
        else{
            setIsSave(false);
            toast({
                description: data.message,
                variant: "destructive"
            });
        }
        setSelectedEmoji({});
        setIsChangeEditEmoji(false);
        setEditIndex(null);
    };

    const handleSaveEmoji = async (index) => {
        const cloneEmojiList = [...emojiList];
        const emojiToSave = cloneEmojiList[index];

        setIsSave(true);
        const payload ={
            project_id:projectDetailsReducer.id,
            emoji:selectedEmoji.emoji,
            emoji_url:selectedEmoji.imageUrl ? selectedEmoji.imageUrl : emojiToSave.emoji_url
        }
        const data = await apiService.updateEmoji(payload,emojiToSave.id);
        if(data.status === 400) {
            setIsSave(false);
            const clone = [...emojiList];
            clone[index] = {project_id:projectDetailsReducer.id, emoji:selectedEmoji.emoji, emoji_url:payload.emoji_url,id:emojiToSave.id};
            setEmojiList(clone);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, emoji: clone}))
            setEditIndex(null);
            setSelectedEmoji({});
            toast({
                description:data.message
            });
            setIsEdit(false);
            setIsChangeEditEmoji(false);
        }
        else{
            toast({
                description:data.message,
                variant: "destructive"
            });
            setIsEdit(false);
            setIsChangeEditEmoji(false);
        }
    };

    const onEdit = (record = {},index = null) => {
        setSelectedEmoji(record);
        setIsEdit(true);
        const clone = [...emojiList]
        if(editIndex !== null && !clone[editIndex]?.id){
            clone.splice(editIndex, 1)
            setEditIndex(index)
            setEmojiList(clone)
        }
        else if (editIndex !== index){
            setEmojiList(allStatusAndTypes?.emoji);
            setEditIndex(index);
        }else {
            setEditIndex(index);
        }
        setIsChangeEditEmoji(false);
    };

    const onEditCancel = () => {
        setEditIndex(null);
        setIsChangeEditEmoji(false);
        setEmojiList(allStatusAndTypes.emoji);
        setSelectedEmoji({});
    };

    const handleDelete = async () => {
        setIsDeleteLoading(true);
        const data = await apiService.deleteEmoji(deleteId);
        const clone = [...emojiList];
        const deleteToIndex = clone.findIndex((x)=> x.id == deleteId);
        if (data.status === 200) {
            clone.splice(deleteToIndex, 1);
            setEmojiList(clone);
            setDeleteId(null);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, emoji: clone}));
            toast({
                description:data.message
            });
            setIsDeleteLoading(false);
            setOpenDelete(false);
        } else {
            toast({
                description:data.message,
                variant: "destructive"
            });
            setIsDeleteLoading(false);
            setOpenDelete(false);
        }
    };

    const handleDeleteEmoji = (id) => {
        setDeleteId(id);
        setOpenDelete(true);
        setEmojiList(allStatusAndTypes.emoji);
        setEditIndex(null);
    };

    return (
        <Fragment>
            {
                openDelete &&
                <DeleteDialog
                    title={"You really want to delete this Emoji ?"}
                    isOpen={openDelete}
                    onOpenChange={() => setOpenDelete(false)}
                    onDelete={handleDelete}
                    isDeleteLoading={isDeleteLoading}
                    deleteRecord={deleteId}
                />
            }
            <Card>
                <CardHeader className={"p-4 sm:px-5 sm:py-4 gap-1 border-b flex flex-row justify-between items-center flex-wrap gap-y-2"}>
                    <div>
                        <CardTitle className={"text-lg sm:text-2xl font-normal"}>Emoji</CardTitle>
                        <CardDescription className={"text-sm text-muted-foreground p-0"}>Use Emoji to organise your Changelog</CardDescription>
                    </div>
                    <Button onClick={newEmoji} disabled={editIndex != null} className={"gap-2 font-medium hover:bg-primary m-0"}><Plus strokeWidth={3} size={18}/> New Emoji</Button>
                </CardHeader>
                <CardContent className={"p-0"}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {
                                    ["Emoji","Action"].map((x,i)=>{
                                        return(
                                            <TableHead className={`px-2 py-[10px] md:px-3 ${i === 0 ? "w-1/2" : "text-end"} w-1/2 ${theme === "dark" ? "" : "text-card-foreground"}`} key={x}>{x}</TableHead>
                                        )
                                    })
                                }
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                 emojiList.length > 0 ? <>
                                    {
                                        (emojiList || []).map((x, i) => {
                                            return (
                                                <TableRow key={i}>
                                                    {
                                                        editIndex == i ?
                                                            <Fragment>
                                                                 <TableCell className={"px-2 py-[10px] md:px-3"}>
                                                                     <Popover>
                                                                         <PopoverTrigger asChild>
                                                                             <div className={""}>
                                                                                 {selectedEmoji.emoji_url ?
                                                                                     <div
                                                                                         className={"border border-input w-full p-1 rounded-md bg-background cursor-pointer"}>
                                                                                         <img className={"cursor-pointer h-[25px] w-[25px]"} alt={"not-found"} src={selectedEmoji?.emoji_url}/>
                                                                                     </div>
                                                                                     : selectedEmoji?.imageUrl ? <div className={"border border-input w-full p-1 rounded-md bg-background cursor-pointer"}>
                                                                                                                    <img className={"cursor-pointer h-[25px] w-[25px]"} alt={"not-found"} src={selectedEmoji?.imageUrl}/>
                                                                                     </div>
                                                                                     : isChangeEditEmoji ? <div className={"border border-input w-full p-1 rounded-md bg-background cursor-pointer"}>
                                                                                                                <img className={"cursor-pointer h-[25px] w-[25px]"} alt={"not-found"} src={selectedEmoji?.imageUrl}/>
                                                                                                            </div>
                                                                                     :
                                                                                     <Input placeholder="Choose Emoji"/>}
                                                                                 {validationError && <span className={"text-destructive text-sm"}>{validationError}</span>}
                                                                             </div>
                                                                         </PopoverTrigger>
                                                                         <PopoverContent className="w-full p-0 border-none w-[310px]]">
                                                                             <EmojiPicker theme={theme === "dark" ? "dark" : "light"} height={350} autoFocusSearch={false} open={true} searchDisabled={true} onEmojiClick={handleEmojiSelect}/>
                                                                         </PopoverContent>
                                                                     </Popover>
                                                                 </TableCell>
                                                                <TableCell className={`pr-4 align-top ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                    <div className={"flex justify-end items-center gap-2"}>
                                                                        <Fragment>
                                                                            {
                                                                                x.id ? <Button
                                                                                    variant="outline hover:bg-transparent"
                                                                                    className={`p-1 border w-[30px] h-[30px]`}
                                                                                   onClick={() => handleSaveEmoji(i)}
                                                                                >
                                                                                    {isSave ? <Loader2 className="h-4 w-4 animate-spin"/> : <Check size={16}/>}
                                                                                </Button> : <Button
                                                                                    className="text-sm font-medium h-[30px] w-[99px] hover:bg-primary"
                                                                                    onClick={()=>addEmoji(i)}
                                                                                >
                                                                                    {isSave ? <Loader2 className={"h-4 w-4 animate-spin"}/> : "Add emoji"}
                                                                                </Button>
                                                                            }

                                                                            <Button
                                                                                variant="outline hover:bg-transparent"
                                                                                className="p-1 border w-[30px] h-[30px]"
                                                                                 onClick={() =>  x.id ? onEditCancel() : onEdit()}
                                                                            >
                                                                                <X size={16}/>
                                                                            </Button>
                                                                        </Fragment>
                                                                    </div>
                                                                </TableCell>
                                                            </Fragment>
                                                            :
                                                            <Fragment>
                                                                 <TableCell className={"px-2 py-[10px] md:px-3"}>
                                                                     <img className={"h-[30px] w-[30px] m-[5px]"} alt={"not-found"} src={x.emoji_url}/>
                                                                 </TableCell>
                                                                <TableCell className={`flex justify-end gap-2 pr-4 ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                    <Fragment>
                                                                        <Button
                                                                            variant="outline hover:bg-transparent"
                                                                            className="p-1 border w-[30px] h-[30px]"
                                                                           onClick={() => onEdit(x,i)}
                                                                        >
                                                                            <Pencil size={16}/>
                                                                        </Button>
                                                                        <Button
                                                                            variant="outline hover:bg-transparent"
                                                                            className="p-1 border w-[30px] h-[30px]"
                                                                            onClick={() => handleDeleteEmoji(x.id)}
                                                                        >
                                                                            <Trash2 size={16}/>
                                                                        </Button>
                                                                    </Fragment>
                                                                </TableCell>
                                                            </Fragment>
                                                    }
                                                </TableRow>
                                            )
                                        })
                                    }
                                    </> : <TableRow><TableCell colSpan={6}><EmptyData /></TableCell></TableRow>
                            }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </Fragment>
    )
}

export default Emoji;