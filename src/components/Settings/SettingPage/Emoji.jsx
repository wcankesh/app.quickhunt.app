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
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "../../ui/alert-dialog";
import {Skeleton} from "../../ui/skeleton";
import {ApiService} from "../../../utils/ApiService";
import {useSelector} from "react-redux";
import {toast} from "../../ui/use-toast";
import {useDispatch} from "react-redux";
import {allStatusAndTypesAction} from "../../../redux/action/AllStatusAndTypesAction";
import NoDataThumbnail from "../../../img/Frame.png";

const Emoji = () => {
    const [showEmojiInput, setShowEmojiList] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState({});
    const [emojiList, setEmojiList] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [isLoading,setIsLoading] = useState(false);
    const [isSave,setIsSave]=useState(false);
    const [isEdit,setIsEdit]=useState(false)
    const [isChangeEditEmoji,setIsChangeEditEmoji]=useState(false);
    const [validationError, setValidationError] = useState('');
    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const dispatch = useDispatch();
    const theme = useTheme();

    useEffect(()=>{
        getAllEmoji();
    },[projectDetailsReducer.id])

    const getAllEmoji = async () => {
        setIsLoading(true);
        const data = await apiService.getAllEmoji(projectDetailsReducer.id)
        if(data.status === 200){
          setEmojiList(data.data);
          setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    }

    const handleEmojiSelect = (event) => {
        if(isEdit){
            setIsChangeEditEmoji(true);
        }
        setSelectedEmoji(event);
        setValidationError('');
    };

    const addEmoji = async () => {
        if (!selectedEmoji.imageUrl) {
            setValidationError('Emoji is required');
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
        setShowEmojiList(false);
        setSelectedEmoji({});
    }

    const handleDeleteEmoji = (id, index) => {
        setDeleteId(id);
        setDeleteIndex(index);
    };

    const handleDelete = async () => {
        const data = await apiService.deleteEmoji(deleteId);
        if (data.status === 200) {
            const clone = [...emojiList];
            clone.splice(deleteIndex, 1);
            setEmojiList(clone);
            setDeleteId(null);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, emoji: clone}));
            toast({
                description:data.message
            })
        } else {
            toast({
                description:"Something went wrong",
                variant: "destructive"
            })
        }
    }

    const handleEditEmoji = (record, index) => {
        setEditIndex(index);
        setSelectedEmoji(record);
        setIsEdit(true);
    }

    const handleSaveEmoji = async (record,index) => {
        setIsSave(true);
        const payload ={
            project_id:projectDetailsReducer.id,
            emoji:selectedEmoji.emoji,
            emoji_url:selectedEmoji.imageUrl ? selectedEmoji.imageUrl : record.emoji_url
        }
        const data = await apiService.updateEmoji(payload,record.id);
        if(data.status === 400) {
            setIsSave(false);
            const clone = [...emojiList];
            clone[index] = {project_id:projectDetailsReducer.id, emoji:selectedEmoji.emoji, emoji_url:payload.emoji_url,id:record.id};
            setEmojiList(clone);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, emoji: clone}))
            setEditIndex(null);
            setSelectedEmoji({});
            toast({
                description:data.message
            })
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
    }

    return (
        <Fragment>
            <AlertDialog open={deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className={"w-[310px] md:w-full rounded-lg"}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>You really want delete Emoji ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action can't be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className={"flex justify-end gap-2"}>
                        <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className={"bg-red-600 hover:bg-red-600"}>Delete</AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
            <Card>
                <CardHeader className={"p-4 sm:p-6 gap-1 border-b flex flex-row justify-between items-center flex-wrap gap-y-2"}>
                    <div>
                        <CardTitle className={"text-lg sm:text-2xl font-medium leading-8"}>Emoji</CardTitle>
                        <CardDescription className={"text-sm text-muted-foreground p-0 mt-1 leading-5"}>Use Emoji to organise your Changelog</CardDescription>
                    </div>
                    <div className={"m-0"}>
                        <Button onClick={()=>setShowEmojiList(true)} disabled={showEmojiInput} className={"text-sm font-semibold"}><Plus size={16} className={"mr-1 text-[#f9fafb]"} /> New Emoji</Button>
                    </div>
                </CardHeader>
                <CardContent className={"p-0"}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className={`pl-4 w-1/2 ${theme === "dark" ? "" : "text-card-foreground"}`}>Emoji</TableHead>
                                <TableHead className={`pl-4 text-end ${theme === "dark" ? "" : "text-card-foreground"}`}>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        {
                            isLoading ? <TableBody>
                                {
                                    [...Array(5)].map((_, index) => {
                                        return (
                                            <TableRow key={index}>
                                                {
                                                    [...Array(2)].map((_, i) => {
                                                        return (
                                                            <TableCell key={i} className={"px-2"}>
                                                                <Skeleton className={`rounded-md  w-full h-[24px] ${i == 0 ? "w-full" : ""}`}/>
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
                                        (emojiList || []).map((x, index) => {
                                            return (
                                                <TableRow key={x.id}>
                                                    <TableCell>
                                                        {editIndex === index ?
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <div className={"flex gap-2"}>
                                                                        {selectedEmoji?.emoji_url ?
                                                                            <div
                                                                                className={"border border-input w-full p-1 rounded-md bg-background cursor-pointer"}>
                                                                                <img className={"cursor-pointer h-[30px] w-[30px]"} alt={"not-found"} src={selectedEmoji?.emoji_url}/>
                                                                            </div>
                                                                            : isChangeEditEmoji ? <div className={"border border-input w-full p-1 rounded-md bg-background cursor-pointer"}>
                                                                                    <img className={"cursor-pointer h-[30px] w-[30px]"} alt={"not-found"} src={selectedEmoji?.imageUrl}/>
                                                                                </div>
                                                                                :
                                                                                <Input placeholder="Choose Emoji"/>}
                                                                    </div>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-full p-0 border-none w-[310px]]">
                                                                    <EmojiPicker theme={theme === "dark" ? "dark" : "light"} height={350} autoFocusSearch={false} open={true} searchDisabled={true} onEmojiClick={handleEmojiSelect}/>
                                                                </PopoverContent>
                                                            </Popover>
                                                            :
                                                            <img className={"h-[30px] w-[30px] m-[5px]"} alt={"not-found"} src={x.emoji_url}/>
                                                        }
                                                    </TableCell>
                                                    <TableCell className={"flex justify-end items-center"}>
                                                        {editIndex === index ?
                                                            <Fragment>
                                                                <Button onClick={() => handleSaveEmoji(x,index)} variant={"outline hover:bg-transparent"} className={`p-1 mt-[6px] border w-[30px] h-[30px]`}>
                                                                    {isSave ? <Loader2 className="mr-1 h-4 w-4 animate-spin justify-center"/> : <Check size={16}/>}
                                                                </Button>
                                                                <div className={"pl-2"}>
                                                                    <Button onClick={() => setEditIndex(null)} variant={"outline hover:bg-transparent"} className={`p-1 mt-[6px] border w-[30px] h-[30px] `}>
                                                                        <X size={16}/>
                                                                    </Button>
                                                                </div>
                                                            </Fragment>
                                                            :
                                                            <Fragment>
                                                                <Button onClick={() => handleEditEmoji(x, index)} variant={"outline hover:bg-transparent"} className={`p-1 mt-[6px] border w-[30px] h-[30px]`}>
                                                                    <Pencil size={16}/>
                                                                </Button>
                                                                <div className={"pl-2"}>
                                                                    <Button onClick={() => handleDeleteEmoji(x.id, index)} variant={"outline hover:bg-transparent"} className={"p-1 mt-[6px] border w-[30px] h-[30px]"}>
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
                                        showEmojiInput && (
                                            <TableRow>
                                                <TableCell>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <div className={"flex flex-col"}>
                                                                {selectedEmoji?.imageUrl ? <div className={"border border-input w-full p-1 rounded-md bg-background cursor-pointer"}>
                                                                        <img className={"cursor-pointer h-[30px] w-[30px]"} alt={"not-found"} src={selectedEmoji?.imageUrl}/></div>
                                                                    :
                                                                    <Input placeholder="Choose Emoji"/>
                                                                }
                                                                {validationError && <span className={"text-red-500 text-sm"}>{validationError}</span>}
                                                            </div>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-full p-0 border-none relative">
                                                            <div className={"absolute bottom-[55px] left-[-67px] sm:bottom-[50px] sm:left-[-170px]"}>
                                                                <EmojiPicker height={350} width={280} autoFocusSearch={false}  open={true} searchDisabled={true} onEmojiClick={handleEmojiSelect}/>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </TableCell>
                                                <TableCell className={"text-end"}>
                                                    <Button onClick={addEmoji}>
                                                        {isSave ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> :"Add Emoji"}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                        }

                    </Table>
                    {isLoading === false && emojiList.length === 0 && <div className={"flex flex-row justify-center py-[45px]"}>
                        <div className={"flex flex-col items-center gap-2"}>
                            <img src={NoDataThumbnail} className={"flex items-center"}/>
                            <h5 className={`text-center text-2xl font-medium leading-8 ${theme === "dark" ? "" : "text-[#A4BBDB]"}`}>No Data</h5>
                        </div>
                    </div>}
                </CardContent>
            </Card>
        </Fragment>
    )
};

export default Emoji;