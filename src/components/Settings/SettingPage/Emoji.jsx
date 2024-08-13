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

const Emoji = () => {
    const [selectedEmoji, setSelectedEmoji] = useState({});
    const [emojiList, setEmojiList] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [isLoading,setIsLoading] = useState(true);
    const [isSave,setIsSave]=useState(false);
    const [isEdit,setIsEdit]=useState(false)
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
        setIsLoading(true);
        setEmojiList(allStatusAndTypes.emoji);
        setIsLoading(false)
    }

    const handleEmojiSelect = (event) => {
        if(isEdit){
            setIsChangeEditEmoji(true);
        }
        setSelectedEmoji(event);
        setValidationError('');
    };

    const addEmoji = async (index) => {
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
        // setShowEmojiList(false);
        setSelectedEmoji({});
        setEditIndex(null);
    }

    const handleDeleteEmoji = (id) => {
        setDeleteId(id);
        setOpenDelete(true);
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
    }

    const handleEditEmoji = (record, index) => {
        const findIndex = emojiList.findIndex((x)=> !x.id);
        if(findIndex != -1 ){
            const clone = [...emojiList];
            clone.splice(findIndex,1);
            setEmojiList(clone);
        }
        setEditIndex(index);
        setSelectedEmoji(record);
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

    const newEmoji = () => {
        const clone = [...emojiList];
        clone.push(selectedEmoji);
        setEmojiList(clone);
        setEditIndex(clone.length - 1);
    }

    const deleteAddEmoji = (index) => {
        const clone = [...emojiList];
        clone.splice(index,1);
        setEmojiList(clone);
        setEditIndex(null);
        setSelectedEmoji({});
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
                                    <DialogTitle className={"text-start"}>You really want delete this Emoji?</DialogTitle>
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
                                    className={` ${theme === "dark" ? "text-card-foreground" : "text-card"} ${isDeleteLoading === true ? "py-2 px-6" : "py-2 px-6"} w-[76px] text-sm font-semibold bg-destructive`}
                                    onClick={handleDelete}
                                >
                                    {isDeleteLoading ? <Loader2 size={16} className={"animate-spin"}/> : "Delete"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Fragment>
            }

            <Card>
                <CardHeader className={"p-4 sm:p-6 gap-1 border-b flex flex-row justify-between items-center flex-wrap gap-y-2"}>
                    <div>
                        <CardTitle className={"text-lg sm:text-2xl font-medium leading-8"}>Emoji</CardTitle>
                        <CardDescription className={"text-sm text-muted-foreground p-0 mt-1 leading-5"}>Use Emoji to organise your Changelog</CardDescription>
                    </div>
                    <div className={"m-0"}>
                        <Button onClick={newEmoji} disabled={editIndex != null} className={"text-sm font-semibold"}><Plus size={16} className={"mr-1 text-[#f9fafb]"} /> New Emoji</Button>
                    </div>
                </CardHeader>
                <CardContent className={"p-0"}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className={`px-2 py-[10px] md:px-3 w-1/2 ${theme === "dark" ? "" : "text-card-foreground"}`}>Emoji</TableHead>
                                <TableHead className={`px-2 py-[10px] md:px-3 text-end ${theme === "dark" ? "" : "text-card-foreground"}`}>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                 emojiList.length > 0 ? <>
                                    {
                                        (emojiList || []).map((x, index) => {
                                            return (

                                                <TableRow key={x.id}>
                                                    {
                                                        editIndex === index && x.id ?
                                                            <Fragment>
                                                                <TableCell className={"px-2 py-[10px] md:px-3"}>
                                                                    <Popover>
                                                                        <PopoverTrigger asChild>
                                                                            <div className={"flex gap-2"}>
                                                                                {selectedEmoji?.emoji_url ?
                                                                                    <div
                                                                                        className={"border border-input w-full p-1 rounded-md bg-background cursor-pointer"}>
                                                                                        <img className={"cursor-pointer h-[25px] w-[25px]"} alt={"not-found"} src={selectedEmoji?.emoji_url}/>
                                                                                    </div>
                                                                                    : isChangeEditEmoji ? <div className={"border border-input w-full p-1 rounded-md bg-background cursor-pointer"}>
                                                                                            <img className={"cursor-pointer h-[25px] w-[25px]"} alt={"not-found"} src={selectedEmoji?.imageUrl}/>
                                                                                        </div>
                                                                                        :
                                                                                        <Input placeholder="Choose Emoji"/>}
                                                                            </div>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-full p-0 border-none w-[310px]]">
                                                                            <EmojiPicker theme={theme === "dark" ? "dark" : "light"} height={350} autoFocusSearch={false} open={true} searchDisabled={true} onEmojiClick={handleEmojiSelect}/>
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </TableCell>
                                                                <TableCell className={"px-2 py-[10px] md:px-3 flex justify-end items-center"}>
                                                                    <Fragment>
                                                                        <Button onClick={() => handleSaveEmoji(x,index)} variant={"outline hover:bg-transparent"} className={`p-1 mt-[6px] border w-[30px] h-[30px]`}>
                                                                            {isSave ? <Loader2 className="mr-1 h-4 w-4 animate-spin justify-center"/> : <Check size={16}/>}
                                                                        </Button>
                                                                        <div className={"pl-2"}>
                                                                            <Button onClick={() => {
                                                                                setEditIndex(null);
                                                                                setSelectedEmoji({});
                                                                            }} variant={"outline hover:bg-transparent"} className={`p-1 mt-[6px] border w-[30px] h-[30px] `}>
                                                                                <X size={16}/>
                                                                            </Button>
                                                                        </div>
                                                                    </Fragment>
                                                                </TableCell>
                                                            </Fragment>

                                                            : <Fragment>
                                                                {x.id ? <Fragment>
                                                                            <TableCell className={"px-2 py-[10px] md:px-3"}>
                                                                                <img className={"h-[30px] w-[30px] m-[5px]"}
                                                                                     alt={"not-found"} src={x.emoji_url}/>
                                                                            </TableCell>
                                                                            <TableCell className={"px-2 py-[10px] md:px-3 flex justify-end items-center"}>
                                                                                <Fragment>
                                                                                    <Button
                                                                                        onClick={() => handleEditEmoji(x, index)}
                                                                                        variant={"outline hover:bg-transparent"}
                                                                                        className={`p-1 mt-[6px] border w-[30px] h-[30px]`}>
                                                                                        <Pencil size={16}/>
                                                                                    </Button>
                                                                                    <div className={"pl-2"}>
                                                                                        <Button
                                                                                            onClick={() => handleDeleteEmoji(x.id)}
                                                                                            variant={"outline hover:bg-transparent"}
                                                                                            className={"p-1 mt-[6px] border w-[30px] h-[30px]"}>
                                                                                            <Trash2 size={16}/>
                                                                                        </Button>
                                                                                    </div>
                                                                                </Fragment>
                                                                            </TableCell>
                                                                </Fragment>
                                                                    :<Fragment>
                                                                        <TableCell className={"px-2 py-[10px] md:px-3"}>
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
                                                                        <TableCell className={"px-2 py-[15px] md:px-3 text-end flex flex-row justify-end gap-2"}>
                                                                            <Button className={`${isSave === true ? "py-2 px-4" : "py-2 px-4"} w-[100px] h-[30px] text-sm font-semibold`} onClick={()=>addEmoji(index)}>
                                                                                {isSave ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> :"Add Emoji"}
                                                                            </Button>
                                                                            <Button
                                                                                variant="outline hover:bg-transparent"
                                                                                className="p-1 border w-[30px] h-[30px]"
                                                                                onClick={()=>deleteAddEmoji(index)}
                                                                            >
                                                                                <X size={16}/>
                                                                            </Button>
                                                                        </TableCell>
                                                                    </Fragment>}
                                                            </Fragment>
                                                    }
                                                </TableRow>
                                            )
                                        })
                                    }
                                    </> : (emojiList.length == 0 && isLoading == false) ? <TableRow>
                                    <TableCell colSpan={6}>
                                        <EmptyData />
                                    </TableCell>
                                </TableRow> : null
                            }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </Fragment>
    )
};

export default Emoji;
