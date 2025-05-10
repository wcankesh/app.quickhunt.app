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
import DeleteDialog from "../../Comman/DeleteDialog";

const Emoji = () => {
    const apiService = new ApiService();
    const dispatch = useDispatch();
    const theme = useTheme();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);

    const [selectedEmoji, setSelectedEmoji] = useState({});
    const [emojiList, setEmojiList] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [isSave,setIsSave]=useState(false);
    const [isEdit,setIsEdit]=useState(false);
    const [isChangeEditEmoji,setIsChangeEditEmoji]=useState(false);
    const [validationError, setValidationError] = useState('');
    const [openDelete,setOpenDelete] = useState(false);
    const [isDeleteLoading,setIsDeleteLoading] = useState(false);

    useEffect(()=>{
        if(allStatusAndTypes.emoji){
            getAllEmoji();
        }
    },[allStatusAndTypes.emoji])

    const getAllEmoji = async () => {
        setEmojiList(allStatusAndTypes.emoji);
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
            emojiUrl:selectedEmoji.imageUrl,
            projectId:projectDetailsReducer.id
        }
        const data = await apiService.createEmoji(payload);
        if (data.success){
            const clone = [...emojiList];
            clone.push({id: data.data.id,emoji: selectedEmoji.emoji, emojiUrl: selectedEmoji.imageUrl, });
            clone.splice(index, 1);
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
                description: data?.error?.message,
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
            projectId:projectDetailsReducer.id,
            emoji:selectedEmoji.emoji,
            emojiUrl:selectedEmoji.imageUrl ? selectedEmoji.imageUrl : emojiToSave.emojiUrl
        }
        const data = await apiService.updateEmoji(payload,emojiToSave.id);
        if(data.success) {
            setIsSave(false);
            const clone = [...emojiList];
            clone[index] = {projectId:projectDetailsReducer.id, emoji:selectedEmoji.emoji, emojiUrl:payload.emojiUrl,id:emojiToSave.id};
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
                description:data?.error?.message,
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
        if (data.success) {
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
                description:data?.error?.message,
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
                    title={"You really want to delete this Emoji?"}
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
                        <CardTitle className={"text-xl lg:text-2xl font-medium"}>Emoji</CardTitle>
                        <CardDescription className={"text-sm text-muted-foreground p-0"}>Enhance and organize your changelog with emojis.</CardDescription>
                    </div>
                    <Button onClick={newEmoji} disabled={editIndex != null} className={"gap-2 font-medium hover:bg-primary m-0"}><Plus strokeWidth={3} size={18}/> New Emoji</Button>
                </CardHeader>
                <CardContent className={"p-0"}>
                    <Table>
                        <TableHeader className={`dark:bg-transparent bg-muted`}>
                            <TableRow>
                                {
                                    ["Emoji", "Action"].map((x,i)=>{
                                        return(
                                            <TableHead className={`px-2 py-[10px] md:px-3 text-sm font-medium text-card-foreground dark:text-muted-foreground w-1/2 ${i == 0 ? "w-2/5" : i == 1 ? "w-2/5 text-end" : ""}`} key={x}>{x}</TableHead>
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
                                                                <TableCell className={"px-[12px] py-[10px]"}>
                                                                     <Popover>
                                                                         <PopoverTrigger asChild>
                                                                             <div className={""}>
                                                                                 {selectedEmoji.emojiUrl ?
                                                                                     <div
                                                                                         className={"border border-input w-full p-1 rounded-md bg-background cursor-pointer"}>
                                                                                         <img className={"cursor-pointer h-[25px] w-[25px]"} alt={"not-found"} src={selectedEmoji?.emojiUrl}/>
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
                                                                <TableCell className={`px-[12px] py-[10px] align-top ${theme === "dark" ? "" : "text-muted-foreground"}`}>
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
                                                                                    className="text-sm font-medium h-[30px] w-[90px] hover:bg-primary"
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
                                                                     <img className={"h-[30px] w-[30px]"} alt={"not-found"} src={x.emojiUrl}/>
                                                                 </TableCell>
                                                                <TableCell className={`flex justify-end gap-2 px-3 py-[10px] ${theme === "dark" ? "" : "text-muted-foreground"}`}>
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
                                                                            disabled={emojiList.filter(moj => moj.id).length === 1}
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