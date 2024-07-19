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
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "../../ui/alert-dialog";
import {Skeleton} from "../../ui/skeleton";
import SettingEmptyDataTable from "../../Comman/SettingEmptyDataTable";
import {ApiService} from "../../../utils/ApiService";
import {useSelector} from "react-redux";
import {toast} from "../../ui/use-toast";
import {useDispatch} from "react-redux";
import {allStatusAndTypesAction} from "../../../redux/action/AllStatusAndTypesAction";


const tableHeadingsArray = [
    {label:"Emoji"},
    {label:"Action"}
];

const Emoji = () => {
    const [showEmojiInput, setShowEmojiList] = useState(false);
    const theme = useTheme();
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

    const handleShowInput = () => setShowEmojiList(true);

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
                title: data.success
            });
            setIsSave(false);
        }
        else{
            setIsSave(false);
            toast({
                title: "Something went wrong",
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
                title:"Emoji deleted successfully"
            })
        } else {
            toast({
                title:"Something went wrong",
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
            emoji_url:selectedEmoji.imageUrl
        }
        const data = await apiService.updateEmoji(payload,record.id);
        if(data.status === 401) {
            setIsSave(false);
            const clone = [...emojiList];
            clone[index] = {project_id:projectDetailsReducer.id, emoji:selectedEmoji.emoji, emoji_url:selectedEmoji.imageUrl,id:record.id};
            setEmojiList(clone);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, emoji: clone}))
            setEditIndex(null);
            setSelectedEmoji({});
            toast({
                title:"Emoji updated successfully"
            })
            setIsEdit(false);
            setIsChangeEditEmoji(false);
        }
        else{
            toast({
                title:"Something went wrong",
                variant: "destructive"
            });
            setIsEdit(false);
            setIsChangeEditEmoji(false);
        }
    }

    return (
        <Fragment>
            <AlertDialog open={deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>You really want delete Emoji ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action can't be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className={"bg-red-600 hover:bg-red-600"}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Card>
                <CardHeader className={"p-6 gap-1 border-b flex flex-row justify-between items-center"}>
                    <div>
                        <CardTitle className={"text-2xl font-medium leading-8"}>Emoji</CardTitle>
                        <CardDescription className={"text-sm text-muted-foreground p-0 mt-1 leading-5"}>Use Emoji to organise your Changelog</CardDescription>
                    </div>
                    <div className={"m-0"}>
                        <Button onClick={handleShowInput} disabled={showEmojiInput} className={"text-sm font-semibold"}><Plus size={16} className={"mr-1 text-[#f9fafb]"} /> New Emoji</Button>
                    </div>
                </CardHeader>
                <CardContent className={"p-0"}>
                    {isLoading ? <Table>
                        <TableHeader className="p-0">
                            <TableRow>
                                <TableHead className={`w-2/5 pl-4 ${theme === "dark" ? "" : "text-card-foreground"}`}>Emoji</TableHead>
                                <TableHead className={`w-1/5 text-end ${theme === "dark" ? "" : "text-card-foreground"}`}>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                [...Array(5)].map((_,index)=>{
                                    return(
                                        <TableRow key={index}>
                                            <TableCell><Skeleton className={"w-full h-[24px] rounded-md"}/></TableCell>
                                            <TableCell><Skeleton className={"w-full h-[24px] rounded-md"}/></TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table> : showEmojiInput === false && emojiList.length === 0 ? <SettingEmptyDataTable tableHeadings={tableHeadingsArray}/> : <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className={`pl-4 w-1/2 ${theme === "dark" ? "" : "text-card-foreground"}`}>Emoji</TableHead>
                                <TableHead className={`pl-4 text-end ${theme === "dark" ? "" : "text-card-foreground"}`}>Action</TableHead>
                            </TableRow>
                        </TableHeader>
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
                                                                        <img className={"cursor-pointer h-[30px] w-[30px]"} src={selectedEmoji?.emoji_url}/>
                                                                    </div>
                                                                     : isChangeEditEmoji ? <div className={"border border-input w-full p-1 rounded-md bg-background cursor-pointer"}>
                                                                                <img className={"cursor-pointer h-[30px] w-[30px]"} src={selectedEmoji?.imageUrl}/>
                                                                              </div>
                                                                     :
                                                                    <Input placeholder="Choose Emoji"/>}
                                                            </div>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-full p-0 border-none">
                                                            <EmojiPicker theme={theme === "dark" ? "dark" : "light"} height={350} autoFocusSearch={false} open={true} searchDisabled={true} onEmojiClick={handleEmojiSelect}/>
                                                        </PopoverContent>
                                                    </Popover>
                                                    :
                                                    <img className={"h-[30px] w-[30px] m-[5px]"} src={x.emoji_url}/>
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
                                                                <img className={"cursor-pointer h-[30px] w-[30px]"} src={selectedEmoji?.imageUrl}/></div>
                                                                :
                                                                <Input placeholder="Choose Emoji"/>
                                                        }
                                                        {validationError && <span className={"text-red-500 text-sm"}>{validationError}</span>}
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0 border-none">
                                                    <EmojiPicker height={350} autoFocusSearch={false} open={true} searchDisabled={true} onEmojiClick={handleEmojiSelect}/>
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
                    </Table>}
                </CardContent>
            </Card>
        </Fragment>
    )
};

export default Emoji;
