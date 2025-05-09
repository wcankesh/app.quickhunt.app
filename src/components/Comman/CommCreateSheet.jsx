import React from 'react';
import {Check, Loader2, X} from "lucide-react";
import {Button} from "../ui/button";
import {SelectContent, SelectItem, SelectTrigger, SelectValue, Select, SelectGroup} from "../ui/select";
import {Sheet, SheetContent, SheetHeader, SheetTitle} from "../ui/sheet";
import {Label} from "../ui/label";
import ReactQuillEditor from "./ReactQuillEditor";
import {Input} from "../ui/input";

const CommCreateSheet = ({
                             isOpen,
                             onOpen,
                             onCancel,
                             ideaDetail,
                             handleChange,
                             topicLists,
                             allStatusAndTypes,
                             formError,
                             isLoading,
                             onCreateIdea,
                             setIdeaDetail,
                             setFormError,
                             formValidate,
                         }) => {

    const onChangeText = (e) => {
        const { name, value } = e.target;
        let cleanedValue;
        if (name === "description") {
            cleanedValue = value.replace(/<p><br><\/p>|<[^>]+>|&nbsp;|\s/g, "").length > 0 ? value : "";
        } else {
            cleanedValue = value;
        }

        setIdeaDetail({ ...ideaDetail, [name]: cleanedValue });
        // setFormError(formError => ({
        //     ...formError,
        //     [name]: formValidate(name, cleanedValue)
        // }));
    };

    const onChangeBoard = (value) => {
        setIdeaDetail({...ideaDetail, boardId: value});
        setFormError(formError => ({
            ...formError,
            boardId: formValidate("boardId", value),
        }));
    };

    return (
        <Sheet open={isOpen} onOpenChange={isOpen ? onCancel : onOpen}>
            <SheetContent className={"lg:max-w-[800px] md:max-w-full sm:max-w-full p-0"}>
                <SheetHeader className={"px-4 py-5 lg:px-8 lg:py-[20px] border-b"}>
                    <div className={"flex justify-between items-center w-full"}>
                        <SheetTitle className={"text-xl font-medium capitalize"}>Tell us your Idea!</SheetTitle>
                        <span className={"max-w-[24px]"}><X onClick={onCancel} className={"cursor-pointer"} /></span>
                    </div>
                </SheetHeader>
                <div className={"w-full overflow-y-auto h-[calc(100vh_-_69px)]"}>
                    <div className={"pb-[60px] sm:p-0"}>
                        <div className={"px-4 py-3 lg:py-6 lg:px-8 flex flex-col gap-6 border-b"}>
                            <div className="space-y-2">
                                <Label htmlFor="title" className={"font-medium after:ml-1 after:content-['*'] after:text-destructive"}>Title</Label>
                                <Input type="text" id="title" value={ideaDetail.title} placeholder={"Enter your Idea"} name={"title"} onChange={onChangeText} />
                                {formError.title && <span className="text-red-500 text-sm">{formError.title}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className={"font-medium"}>Description</Label>
                                <ReactQuillEditor value={ideaDetail.description} name={"description"} onChange={onChangeText} />
                            </div>
                            <div className={"space-y-2"}>
                                <Label className={"font-medium capitalize"}>Choose Board for this Idea</Label>
                                <Select onValueChange={onChangeBoard} value={ideaDetail.boardId || ""}>
                                    <SelectTrigger className={"bg-card"}>
                                        {ideaDetail.boardId ? (
                                            <SelectValue>
                                                {allStatusAndTypes?.boards.find(boardId => boardId.id === ideaDetail.boardId)?.title}
                                            </SelectValue>
                                        ) : (
                                            <span className="text-muted-foreground">Choose Board</span>
                                        )}
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {allStatusAndTypes?.boards?.length > 0 ? (
                                                allStatusAndTypes.boards.map((x, i) => (
                                                    <SelectItem key={i} value={x.id}>
                                                        <div className={"flex items-center gap-2"}>
                                                            {x.title}
                                                        </div>
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <span className="text-muted-foreground flex justify-center text-sm">No Boards</span>
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {formError.boardId && <span className="text-red-500 text-sm">{formError.boardId}</span>}
                            </div>
                        </div>
                        <div className={"px-4 py-3 lg:py-6 lg:px-8 border-b space-y-2"}>
                            <Label className={"font-medium capitalize"}>Choose Topics for this Idea (optional)</Label>
                            <Select onValueChange={handleChange} value={ideaDetail.topicId || []}>
                                <SelectTrigger className="bg-card">
                                    <SelectValue className={"text-muted-foreground text-sm"}>
                                        <div className={"flex gap-[2px]"}>
                                            {(ideaDetail.topicId || []).length === 0 ? (
                                                <span className={"text-muted-foreground"}>Select topic</span>
                                            ) : (
                                                (ideaDetail.topicId || []).map((x, index) => {
                                                    const findObj = topicLists.find((y) => y.id === x);
                                                    return (
                                                        <div key={index} className={`text-xs flex gap-[2px] dark:text-card bg-slate-300 items-center rounded py-0 px-2`}>
                                                            <span className={"max-w-[85px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}>
                                                                {findObj?.title}
                                                            </span>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {topicLists?.length > 0 ? (
                                            topicLists.map((x, i) => (
                                                <SelectItem key={i} value={x.id} className={"p-2"}>
                                                    <div className={"flex gap-2"}>
                                                        <div onClick={() => handleChange(x.id)} className="checkbox-icon">
                                                            {ideaDetail?.topicId?.includes(x.id) ? <Check size={18} /> : <div className={"h-[18px] w-[18px]"}></div>}
                                                        </div>
                                                        <span>{x.title ? x.title : ""}</span>
                                                    </div>
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <span className="text-muted-foreground flex justify-center text-sm">No Topics</span>
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className={"p-4 lg:p-8 flex gap-6"}>
                            <Button className={`w-[96px] text-sm font-medium hover:bg-primary`} onClick={onCreateIdea}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Idea"}
                            </Button>
                            <Button variant={"outline hover:bg-transparent"} className={"border border-primary text-sm font-medium text-primary"} onClick={onCancel}>Cancel</Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default CommCreateSheet;