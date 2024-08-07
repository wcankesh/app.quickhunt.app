import React, {useState, useEffect} from 'react';
import {Button} from "../ui/button";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {ApiService} from "../../utils/ApiService";
import {useSelector} from "react-redux";
import {Check, Loader2, X} from "lucide-react";
import {Sheet, SheetContent, SheetHeader, SheetOverlay} from "../ui/sheet";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {useToast} from "../ui/use-toast";
import ReactQuillEditor from "../Comman/ReactQuillEditor";
import {useTheme} from "../theme-provider";

const initialState = {
    title: "",
    images: [],
    topic: [],
    project_id: "",
    description: "",
    board: ""
}

const initialStateError = {
    title: "",
    description: "",
    board: ""

}

const CreateIdea = ({
                        isOpen,
                        onOpen,
                        onClose,
                        closeCreateIdea,
                        setIdeasList,
                        ideasList,
                    }) => {
    const {theme} = useTheme()
    let apiSerVice = new ApiService();
    const { toast } = useToast()
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const [ideaDetail, setIdeaDetail] = useState(initialState);
    const [topicLists, setTopicLists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const [formError, setFormError] = useState(initialStateError);

    useEffect(() => {
        setTopicLists(allStatusAndTypes.topics)
        setIdeaDetail({...initialState, board: allStatusAndTypes?.boards[0]?.id})
    }, [projectDetailsReducer.id, allStatusAndTypes]);



    const handleChange = (id) => {
        const clone = [...ideaDetail.topic];
        const index = clone.indexOf(id);
        if (index > -1) {
            clone.splice(index, 1);
        } else {
            clone.push(id);
        }
        setIdeaDetail({ ...ideaDetail, topic: clone });
    };


    const onChangeText = (event) => {
        setIdeaDetail(ideaDetail => ({...ideaDetail, [event.target.name]:event.target.value}))
        setFormError(formError => ({
            ...formError,
            [event.target.name]: formValidate(event.target.name, event.target.value)
        }));
    }

    const onCreateIdea = async () => {
        let validationErrors = {};
        Object.keys(ideaDetail).forEach(name => {
            const error = formValidate(name, ideaDetail[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }

        setIsLoading(true)
        let formData = new FormData();
        formData.append('title', ideaDetail.title);
        formData.append('slug_url', ideaDetail.title ? ideaDetail.title.replace(/ /g,"-").replace(/\?/g, "-") :"");
        formData.append('description', ideaDetail.description);
        formData.append('project_id', projectDetailsReducer.id);
        formData.append('board', ideaDetail.board);
        formData.append('topic', ideaDetail.topic.join());
        const data = await apiSerVice.createIdea(formData)
        if(data.status === 200){
            debugger
            const clone = [...ideasList];
            const newArray = [data.data].concat(clone)
            setIdeasList(newArray);
            setIsLoading(false)
            setIdeaDetail(initialState)
            closeCreateIdea()
            toast({description: data.message})
        } else {
            setIsLoading(false)
            toast({description: data.message,variant: "destructive" })
        }
    }

    const formValidate = (name, value) => {
        switch (name) {
            case "title":
                if (!value || value.trim() === "") {
                    return "Title is required";
                } else {
                    return "";
                }
            case "description":
                if (!value || value.trim() === "") {
                    return "Description is required";
                } else {
                    return "";
                }
            case "board":
                if (!value || value.toString().trim() === "") {
                    return "Board is required";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const onCancel = () => {
        setIdeaDetail(initialState);
        setFormError(initialStateError);
        onClose();
    }

    return (
        <div>
            <Sheet open={isOpen} onOpenChange={isOpen ? onCancel : onOpen} closeCreateIdea={closeCreateIdea}>
                <SheetOverlay className={"inset-0"} />
                <SheetContent className={"lg:max-w-[800px] md:max-w-full sm:max-w-full p-0"}>
                    <SheetHeader className={"px-4 py-5 lg:px-8 lg:py-[20px] border-b"}>
                        <div className={"flex justify-between items-center w-full"}>
                            <h2 className={"text-xl font-medium"}>Tell us your Idea!</h2>
                            <X onClick={onCancel} className={"cursor-pointer"}/>
                        </div>
                    </SheetHeader>
                    <div className={"w-full overflow-y-auto create-sheet-height"}>
                            <div className={""}>
                                <div className={"px-4 py-3 lg:py-6 lg:px-8 flex flex-col gap-6 border-b"}>
                                    <div className="space-y-2">
                                        <Label htmlFor="text">Title</Label>
                                        <Input type="text" id="text" placeholder="" value={ideaDetail.title} name={"title"} onChange={onChangeText} />
                                        {
                                            formError.title && <span className="text-red-500 text-sm">{formError.title}</span>
                                        }
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Description</Label>

                                        <ReactQuillEditor value={ideaDetail.description} name={"description"} onChange={onChangeText}/>

                                        {formError.description && <span className="text-red-500 text-sm">{formError.description}</span>}
                                    </div>
                                    <div className={"space-y-2"}>
                                        <Label>Choose Board for this Idea</Label>
                                        <Select
                                            onValueChange={(value) => onChangeText({target:{name: "board", value}})}
                                            value={ideaDetail.board}>
                                            <SelectTrigger className="bg-card">
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {
                                                        (allStatusAndTypes?.boards || []).map((x, i) => {
                                                            return (
                                                                <SelectItem key={i} value={x.id}>
                                                                    <div className={"flex items-center gap-2"}>
                                                                        {x.title}
                                                                    </div>
                                                                </SelectItem>
                                                            )
                                                        })
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {formError.board && <span className="text-red-500 text-sm">{formError.board}</span>}
                                    </div>
                                </div>

                                <div className={"px-4 py-3 lg:py-6 lg:px-8 border-b space-y-2"}>
                                    <Label>Choose Topics for this Idea (optional)</Label>
                                        <Select onValueChange={handleChange} value={[]}>
                                            <SelectTrigger className="bg-card">
                                                <SelectValue className={"text-muted-foreground text-sm"} placeholder="Assign to">
                                                    <div className={"flex gap-[2px]"}>
                                                        {
                                                            (ideaDetail.topic || []).map((x,index)=>{
                                                                const findObj = topicLists.find((y) => y.id === x);
                                                                return(
                                                                    <>
                                                                        <div key={index} className={`text-xs flex gap-[2px] ${theme === "dark" ? "text-card" : ""} bg-slate-300 items-center rounded py-0 px-2`}>
                                                                            {findObj?.title}
                                                                        </div>
                                                                    </>

                                                                )
                                                            })
                                                        }
                                                        {(ideaDetail.topic || []).length > 2 && <div>...</div>}
                                                    </div>
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {
                                                        (topicLists || []).map((x, i) => {
                                                            return (
                                                                <SelectItem className={"p-2"} key={i} value={x.id}>
                                                                    <div className={"flex gap-2"}>
                                                                        <div onClick={() => handleChange(x.id)} className="checkbox-icon">
                                                                            {ideaDetail.topic.includes(x.id) ? <Check size={18} />: <div className={"h-[18px] w-[18px]"}></div>}
                                                                        </div>
                                                                        <span>{x.title ? x.title : ""}</span>
                                                                    </div>
                                                                </SelectItem>
                                                            )
                                                        })
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                </div>
                                <div className={"p-4 lg:p-8 flex gap-6"}>
                                    <Button className={`${isLoading === true ? "py-2 px-6" : "py-2 px-6"} w-[126px] text-sm font-semibold`} onClick={onCreateIdea}>
                                        {
                                            isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Create Idea"
                                        }
                                        </Button>
                                    <Button variant={"outline hover:bg-transparent"} className={"border border-primary py-2 px-6 text-sm font-semibold"} onClick={onCancel}>Cancel</Button>
                                </div>
                            </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default CreateIdea;