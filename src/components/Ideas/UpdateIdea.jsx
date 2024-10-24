import React, {Fragment, useState, useEffect} from 'react';
import {Button} from "../ui/button";
import {ArrowBigUp, Check, Circle, CircleX, Dot, Ellipsis, Loader2, MessageCircleMore, Paperclip, Pencil, Pin, Trash2, Upload, X} from "lucide-react";
import {RadioGroup, RadioGroupItem} from "../ui/radio-group";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {Popover, PopoverTrigger, PopoverContent} from "../ui/popover";
import {Textarea} from "../ui/textarea";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs";
import {useTheme} from "../theme-provider";
import {useToast} from "../ui/use-toast";
import {ApiService} from "../../utils/ApiService";
import {useSelector} from "react-redux";
import moment from "moment";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../ui/dropdown-menu";
import ReactQuillEditor from "../Comman/ReactQuillEditor";
import {useNavigate, useParams} from "react-router-dom";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "../ui/breadcrumb";
import {baseUrl} from "../../utils/constent";
import {Skeleton} from "../ui/skeleton";

const initialStateError = {
    title: "",
    description: "",
    board: "",
}

const UpdateIdea = () => {

    const {theme} = useTheme()
    let apiSerVice = new ApiService();
    const {toast} = useToast();
    const { id } = useParams();
    const navigate = useNavigate();

    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCreateIdea, setIsLoadingCreateIdea] = useState(false);
    const [isLoadingArchive, setIsLoadingArchive] = useState(false);
    const [topicLists, setTopicLists] = useState([]);
    const [commentFiles, setCommentFiles] = useState([])
    const [subCommentFiles, setSubCommentFiles] = useState([])
    const [deletedCommentImage, setDeletedCommentImage] = useState([])
    const [deletedSubCommentImage, setDeletedSubCommentImage] = useState([])
    const [commentText, setCommentText] = useState("")
    const [subCommentText, setSubCommentText] = useState("")
    const [selectedComment, setSelectedComment] = useState(null);
    const [selectedSubComment, setSelectedSubComment] = useState(null);
    const [selectedCommentIndex, setSelectedCommentIndex] = useState(null);
    const [selectedSubCommentIndex, setSelectedSubCommentIndex] = useState(null);
    const [isEditComment, setIsEditComment] = useState(false);
    const [isEditIdea, setIsEditIdea] = useState(false);
    const [isSaveComment, setIsSaveComment] = useState(false);
    const [isSaveUpdateComment, setIsSaveUpdateComment] = useState(false);
    const [isSaveUpdateSubComment, setIsSaveUpdateSubComment] = useState(false);
    const [isSaveSubComment, setIsSaveSubComment] = useState(false);
    const [roadmapStatus, setRoadmapStatus] = useState([]);
    const [formError, setFormError] = useState(initialStateError);
    const [selectedIdea, setSelectedIdea] = useState({}); // update idea
    const [oldSelectedIdea, setOldSelectedIdea] = useState({});

    useEffect(() => {
        if (projectDetailsReducer.id) {
            setTopicLists(allStatusAndTypes.topics)
            setRoadmapStatus(allStatusAndTypes.roadmap_status)
            getSingleIdea()
        }
    }, [projectDetailsReducer.id, allStatusAndTypes]);

    const getSingleIdea = async () => {
        setIsLoading(true)
        const data = await apiSerVice.getSingleIdea(id);
        if (data.status === 200) {
            setIsLoading(false)
            setSelectedIdea(data.data)
            setOldSelectedIdea(data.data)
        }
    }

    const handleChangeTopic = (id) => {
        const clone = [...selectedIdea.topic];
        const index = clone.findIndex(item => item.id === id);
        if (index !== -1) {
            clone.splice(index, 1);
        } else {
            const topicToAdd = topicLists.find(item => item.id === id);
            if (topicToAdd) {
                clone.push(topicToAdd);
            }
        }
        setSelectedIdea({...selectedIdea, topic: clone});
    };

    const giveVote = async (type) => {
        if (selectedIdea.is_edit !== 1) {
            if (selectedIdea.user_vote === type) {
            } else {
                const payload = {
                    feature_idea_id: selectedIdea.id,
                    type: type
                }
                const data = await apiSerVice.giveVote(payload);
                if (data.status === 200) {
                    const clone = {...selectedIdea};
                    let newVoteCount = clone.vote;
                    newVoteCount = type === 1 ? newVoteCount + 1 : newVoteCount >= 1 ? newVoteCount - 1 : 0;
                    let vote_list = [...clone.vote_list];
                    if (type === 1) {
                        vote_list.push(data.data)
                    } else {
                        let voteIndex = vote_list.findIndex((x) => x.name === data.data.name);
                        if (voteIndex !== -1) {
                            vote_list.splice(voteIndex, 1)
                        }
                    }
                    setSelectedIdea({...clone, vote:newVoteCount, user_vote: type, vote_list: vote_list});
                    toast({description: data.message})
                } else {
                    toast({variant: "destructive", description: data.message})
                }
            }
        } else {
            toast({variant: "destructive", description: "Login user can not use upvote or down vote"})
        }
    }

    const onChangeTextSubComment = (e) => {
        let selectedSubCommentObj = {...selectedSubComment, comment: e.target.value};
        setSelectedSubComment(selectedSubCommentObj);
        let index = ((selectedComment && selectedComment.reply) || []).findIndex((x) => x.id === selectedSubComment.id)
        if (index !== -1) {
            const cloneReplay = [...selectedComment.reply];
            cloneReplay[index] = selectedSubCommentObj;
            setSelectedComment({...selectedComment, reply: cloneReplay})
        }
    }

    const onCreateComment = async () => {
        setIsSaveComment(true)
        let formData = new FormData();
        for (let i = 0; i < commentFiles.length; i++) {
            formData.append(`images[]`, commentFiles[i]);
        }
        formData.append('comment', commentText);
        formData.append('feature_idea_id', selectedIdea.id);
        formData.append('reply_id', '');
        const data = await apiSerVice.createComment(formData)
        if (data.status === 200) {
            const clone = selectedIdea && selectedIdea.comments ? [...selectedIdea.comments] : [];
            clone.push(data.data)
            let obj = {...selectedIdea, comments: clone}
            setSelectedIdea(obj)
            toast({description: data.message})
            setCommentText('');
            setCommentFiles([])
            setIsSaveComment(false)
        } else {
            setIsSaveComment(false)
            toast({variant: "destructive", description: data.message})
        }
    }

    const onShowSubComment = (index) => {
        const clone = [...selectedIdea.comments];
        clone[index].show_reply = !clone[index].show_reply;
        setSelectedIdea({...selectedIdea, comments: clone})
    }

    const onCreateSubComment = async (record, index) => {
        setIsSaveSubComment(true)
        let formData = new FormData();
        for (let i = 0; i < subCommentFiles.length; i++) {
            formData.append(`images[]`, subCommentFiles[i]);
        }
        formData.append('comment', subCommentText);
        formData.append('feature_idea_id', selectedIdea.id);
        formData.append('reply_id', record.id);
        const data = await apiSerVice.createComment(formData)
        if (data.status === 200) {
            const clone = [...selectedIdea.comments];
            clone[index].reply.push(data.data)
            let obj = {...selectedIdea, comments: clone};
            setSelectedIdea(obj);
            setSubCommentText('');
            setSubCommentFiles([])
            setIsSaveSubComment(false)
            toast({description: data.message})
        } else {
            setIsSaveSubComment(false)
            toast({variant: "destructive", description: data.message})
        }
    }

    const handleFeatureImgUpload = async (event) => {
        const file = event.target?.files[0];
        setSelectedIdea({...selectedIdea, cover_image: file})
        let formData = new FormData();
        formData.append("cover_image", file);
        const data = await apiSerVice.updateIdea(formData, selectedIdea.id)
        if (data.status === 200) {
            setSelectedIdea({...data.data})
            // setIdeasList(clone);
            setIsLoading(false)
            setIsEditIdea(false)
            toast({description: data.message})
        } else {
            setIsLoading(false)
            toast({variant: "destructive", description: data.message})
        }
    };

    const handleAddCommentImg = (event) => {
        const files = event.target.files;
        if (selectedComment && selectedComment.id) {
            const clone = [...selectedComment.images, ...files];
            let old = selectedComment.newImage && selectedComment.newImage.length ? [...selectedComment.newImage] : [];
            const newImageClone = [...old, ...files];
            setSelectedComment({
                ...selectedComment,
                images: clone,
                newImage: newImageClone
            });
        } else {
            setCommentFiles([...commentFiles, ...files]);
        }
    };

    const handleSubCommentUploadImg = (event) => {
        const files = event.target.files;
        if (selectedSubComment && selectedSubComment.id && selectedComment && selectedComment.id) {
            const clone = [...selectedSubComment.images, ...files,]
            let old = selectedSubComment && selectedSubComment.newImage && selectedSubComment.newImage.length ? [...selectedSubComment.newImage] : [];
            const newImageClone = [...old, ...files,];
            let selectedSubCommentObj = {...selectedSubComment, images: clone, newImage: newImageClone}
            setSelectedSubComment(selectedSubCommentObj);
            let index = ((selectedComment && selectedComment.reply) || []).findIndex((x) => x.id === selectedSubComment.id)
            if (index !== -1) {
                const cloneReplay = [...selectedComment.reply];
                cloneReplay[index] = selectedSubCommentObj;
                setSelectedComment({...selectedComment, reply: cloneReplay})
            }
        } else {
            setSubCommentFiles([...subCommentFiles, ...files])
        }
    }

    const onChangeStatus = async (name, value) => {
        if (name === "is_active") {
            setIsLoading(true)
        } else if (name === "is_archive") {
            setIsLoadingArchive(true)
        }
        if (name === "delete_cover_image") {
            setSelectedIdea({...selectedIdea, cover_image: ""})
        } else {
            setSelectedIdea({...selectedIdea, [name]: value})
        }
        let formData = new FormData();
        formData.append(name, value);
        const data = await apiSerVice.updateIdea(formData, selectedIdea.id)
        if (data.status === 200) {
            setSelectedIdea({
                ...data.data,
                roadmap_color: data.data.roadmap_color,
                roadmap_id: data.data.roadmap_id,
                roadmap_title: data.data.roadmap_title
            })
            setIsLoading(false)
            setIsLoadingArchive(false)
            setIsEditIdea(false)
            toast({description: data.message})
        } else {
            setIsLoading(false)
            setIsLoadingArchive(false)
            toast({variant: "destructive", description: data.message})
        }
    }

    const onEditComment = (record, index) => {
        setSelectedComment(record);
        setSelectedCommentIndex(index)
        setIsEditComment(true)
    }

    const onCancelComment = () => {
        setSelectedComment(null);
        setSelectedCommentIndex(null)
        setIsEditComment(false)
    }

    const onCancelSubComment = () => {
        setSelectedComment(null);
        setSelectedCommentIndex(null)
        setSelectedSubComment(null)
        setSelectedSubCommentIndex(null)
    }

    const onDeleteCommentImage = (index, isOld) => {
        const clone = [...selectedComment.images];
        if (isOld) {
            clone.splice(index, 1);
            if (selectedComment && selectedComment.newImage && selectedComment.newImage.length) {
                const cloneNewImage = [...selectedComment.newImage];
                cloneNewImage.splice(index, 1);
                setSelectedComment({...selectedComment, newImage: cloneNewImage});
            }
            setSelectedComment({...selectedComment, images: clone});
        } else {
            const cloneImage = [...deletedCommentImage];
            cloneImage.push(clone[index]);
            clone.splice(index, 1);
            setSelectedComment({...selectedComment, images: clone});
            setDeletedCommentImage(cloneImage);
        }
    }

    const onDeleteSubCommentImage = (index, isOld) => {
        const clone = [...selectedSubComment.images];
        if (isOld) {
            clone.splice(index, 1);
            if (selectedSubComment && selectedSubComment.newImage && selectedSubComment.newImage.length) {
                const cloneNewImage = [...selectedSubComment.newImage];
                cloneNewImage.splice(index, 1);
                setSelectedSubComment({...selectedSubComment, newImage: cloneNewImage});
            }
            setSelectedSubComment({...selectedSubComment, images: clone});
        } else {
            const cloneImage = [...deletedSubCommentImage];
            cloneImage.push(clone[index]);
            clone.splice(index, 1);
            setSelectedSubComment({...selectedSubComment, images: clone});
            setDeletedSubCommentImage(cloneImage);
        }
    }

    const onUpdateComment = async () => {
        setIsSaveUpdateComment(true)
        let formData = new FormData();
        if (selectedComment && selectedComment.newImage && selectedComment.newImage.length) {
            for (let i = 0; i < selectedComment.newImage.length; i++) {
                formData.append(`images[${i}]`, selectedComment.newImage[i]);
            }
        }
        for (let i = 0; i < deletedCommentImage.length; i++) {
            formData.append(`delete_image[${i}]`, deletedCommentImage[i].replace('https://code.quickhunt.app/public/storage/feature_idea/', ''));
        }
        formData.append('comment', selectedComment.comment);
        formData.append('id', selectedComment.id);
        const data = await apiSerVice.updateComment(formData)
        if (data.status === 200) {
            let obj = {...selectedComment, images: data.data.images, newImage: []}
            const cloneComment = [...selectedIdea.comments];
            cloneComment[selectedCommentIndex] = obj;
            let selectedIdeaObj = {...selectedIdea, comments: cloneComment}
            setSelectedIdea(selectedIdeaObj)

            setSelectedCommentIndex(null)
            setSelectedComment(null);
            setIsEditComment(false)
            setDeletedCommentImage([])
            setIsSaveUpdateComment(false)
            toast({description: data.message})
        } else {
            toast({variant: "destructive", description: data.message})
            setIsSaveUpdateComment(false)
        }
    }

    const onUpdateSubComment = async () => {
        setIsSaveUpdateSubComment(true)
        let formData = new FormData();
        if (selectedSubComment && selectedSubComment.newImage && selectedSubComment.newImage.length) {
            for (let i = 0; i < selectedSubComment.newImage.length; i++) {
                formData.append(`images[]`, selectedSubComment.newImage[i]);
            }
        }
        for (let i = 0; i < deletedSubCommentImage.length; i++) {
            formData.append(`delete_image[]`, deletedSubCommentImage[i].replace('https://code.quickhunt.app/public/storage/feature_idea/', ''));
        }
        formData.append('comment', selectedSubComment.comment);
        formData.append('id', selectedSubComment.id);
        const data = await apiSerVice.updateComment(formData)
        if (data.status === 200) {

            const commentIndex = ((selectedIdea.comments) || []).findIndex((x) => x.id === selectedComment.id);
            if (commentIndex !== -1) {
                const cloneComment = [...selectedIdea.comments];
                cloneComment[commentIndex].reply[selectedSubCommentIndex] = data.data;
                let selectedIdeaObj = {...selectedIdea, comments: cloneComment}
                setSelectedIdea(selectedIdeaObj)
            }
            setSelectedCommentIndex(null)
            setSelectedComment(null);
            setSelectedSubComment(null);
            setSelectedSubCommentIndex(null);
            setDeletedSubCommentImage([]);
            setIsSaveUpdateSubComment(false)
            toast({description: data.message})
        } else {
            toast({variant: "destructive", description: data.message})
            setIsSaveUpdateSubComment(false)
        }
    }

    const deleteComment = async (id, indexs) => {
        const data = await apiSerVice.deleteComment({id: id})
        if (data.status === 200) {
            const cloneComment = [...selectedIdea.comments];
            cloneComment.splice(indexs, 1);
            let selectedIdeaObj = {...selectedIdea, comments: cloneComment};
            setSelectedIdea(selectedIdeaObj)

            toast({description: data.message})
        } else {
            toast({variant: "destructive", description: data.message})
        }
    }

    const deleteSubComment = async (id, record, index, subIndex) => {
        const data = await apiSerVice.deleteComment({id: id})
        if (data.status === 200) {
            const cloneComment = [...selectedIdea.comments];
            cloneComment[index].reply.splice(subIndex, 1);
            let selectedIdeaObj = {...selectedIdea, comments: cloneComment};
            setSelectedIdea(selectedIdeaObj)

            toast({description: data.message})
        } else {
            toast({variant: "destructive", description: data.message})
        }
    }

    const onEditSubComment = (record, subRecord, index, subIndex) => {
        setSelectedComment(record)
        setSelectedCommentIndex(index)
        setSelectedSubComment(subRecord)
        setSelectedSubCommentIndex(subIndex)
    }

    const formValidate = (name, value) => {
        switch (name) {
            case "title":
                if (!value || value.trim() === "") {
                    return "Title is required";
                } else {
                    return "";
                }
            case "board":
                if (!value || value?.toString()?.trim() === "") {
                    return "Board is required";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const onChangeText = (event) => {
        setSelectedIdea(selectedIdea => ({...selectedIdea, [event.target.name]: event.target.value}))
        setFormError(formError => ({
            ...formError,
            [event.target.name]: formValidate(event.target.name, event.target.value)
        }));
    }

    const onCreateIdea = async () => {
        setIsLoadingCreateIdea(true)
        let validationErrors = {};
        Object.keys(selectedIdea).forEach(name => {
            const error = formValidate(name, selectedIdea[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        let formData = new FormData();
        let topics = [];

        (selectedIdea.topic || []).map((x) => {
            topics.push(x.id)
        })
        formData.append('title', selectedIdea.title);
        formData.append('board', selectedIdea.board);
        formData.append('slug_url', selectedIdea.title ? selectedIdea.title.replace(/ /g, "-").replace(/\?/g, "-") : "");
        formData.append('description', selectedIdea.description?.trim() === '' ? "" : selectedIdea.description);
        formData.append('topic', topics.join(","));
        const data = await apiSerVice.updateIdea(formData, selectedIdea.id)
        if (data.status === 200) {
            setSelectedIdea({...data.data})
            setOldSelectedIdea({...data.data})
            setIsEditIdea(false)
            setIsLoadingCreateIdea(false)
            toast({description: data.message})
        } else {
            setIsLoadingCreateIdea(false)
            toast({description: data.message, variant: "destructive"})
        }
    }

    const handleOnCreateCancel = () => {
        setSelectedIdea(oldSelectedIdea);
        setFormError(initialStateError);
        setIsEditIdea(false);
    }

    const onDeleteImageComment = (index) => {
        const clone = [...commentFiles];
        clone.splice(index, 1)
        setCommentFiles(clone)
    }

    const onDeleteSubCommentImageOld = (index) => {
        const clone = [...subCommentFiles];
        clone.splice(index, 1)
        setSubCommentFiles(clone)
    }

    const handleImageClick = (imageSrc) => {
        window.open(imageSrc, '_blank');
    };

    return (
        <Fragment>
            <div className={"px-4 py-3 lg:py-6 lg:px-8 border-b"}>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className={"cursor-pointer"}>
                            <BreadcrumbLink onClick={() => navigate(`${baseUrl}/ideas`)}>
                                Ideas
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem className={"cursor-pointer"}>
                            <BreadcrumbPage className={`w-full ${selectedIdea?.title?.length > 30 ? "max-w-[200px] truncate" : ""}`}>{selectedIdea?.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className={`flex h-[calc(100%_-_45px)] lg:h-[calc(100%_-_69px)] overflow-y-auto`}>
                <div className={`max-w-[407px] w-full h-full border-r lg:block hidden lg:overflow-auto`}>
                    <div className={"border-b py-4 px-6 flex flex-col gap-3"}>
                        <div className={"flex flex-col gap-1"}>
                            <h3 className={"text-sm font-normal"}>Status</h3>
                            <p className={"text-muted-foreground text-xs font-normal"}>Apply a status to Manage
                                this
                                idea on roadmap.</p>
                        </div>
                        <div className={"flex flex-col "}>
                            <RadioGroup
                                onValueChange={(value) => onChangeStatus('roadmap_id', value)}
                                value={selectedIdea?.roadmap_id}
                            >
                                {
                                    (roadmapStatus || []).map((x, i) => {
                                        return (
                                            <div key={i} className="flex items-center space-x-2">
                                                <RadioGroupItem value={x.id} id={x.id}/>
                                                <Label
                                                    className={"text-secondary-foreground text-sm font-normal"}
                                                    htmlFor={x.id}>{x.title}</Label>
                                            </div>
                                        )
                                    })
                                }
                            </RadioGroup>
                        </div>
                    </div>
                    <div className={"border-b"}>
                        <div className="py-4 px-6 w-full space-y-1.5">
                            <Label htmlFor="picture" className={"font-normal"}>Featured image</Label>
                            <div className="w-[282px] h-[128px] flex gap-1">

                                {
                                    selectedIdea?.cover_image ?
                                        <div>
                                            {selectedIdea && selectedIdea.cover_image && selectedIdea.cover_image.name ?
                                                <div className={"w-[282px] h-[128px] relative border p-[5px]"}>
                                                    <img
                                                        className={"upload-img"}
                                                        src={selectedIdea && selectedIdea.cover_image && selectedIdea.cover_image.name ? URL.createObjectURL(selectedIdea.cover_image) : selectedIdea.cover_image}
                                                        alt=""
                                                    />
                                                    <CircleX
                                                        size={20}
                                                        className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                        onClick={() => onChangeStatus('delete_cover_image', selectedIdea && selectedIdea?.cover_image && selectedIdea.cover_image?.name ? "" : [selectedIdea.cover_image.replace("https://code.quickhunt.app/public/storage/feature_idea/", "")])}
                                                    />
                                                </div> : selectedIdea.cover_image ?
                                                    <div
                                                        className={"w-[282px] h-[128px] relative border p-[5px]"}>
                                                        <img className={"upload-img"}
                                                             src={selectedIdea.cover_image} alt=""/>
                                                        <CircleX
                                                            size={20}
                                                            className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                            onClick={() => onChangeStatus('delete_cover_image', selectedIdea && selectedIdea?.cover_image && selectedIdea.cover_image?.name ? "" : selectedIdea.cover_image.replace("https://code.quickhunt.app/public/storage/feature_idea/", ""))}
                                                        />
                                                    </div>
                                                    : ''}
                                        </div> :
                                        <div>

                                            <input
                                                id="pictureInput"
                                                type="file"
                                                className="hidden"
                                                multiple
                                                onChange={handleFeatureImgUpload}
                                                accept={".jpg,.jpeg"}
                                            />
                                            <label
                                                htmlFor="pictureInput"
                                                className="border-dashed w-[282px] h-[128px] py-[52px] flex items-center justify-center bg-muted border border-muted-foreground rounded cursor-pointer"
                                            >
                                                <Upload className="h-4 w-4 text-muted-foreground" />
                                            </label>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={"py-4 px-6 flex flex-col gap-[26px]"}>
                        <div className={"flex gap-1 justify-between items-center"}>
                            <div className={"flex flex-col gap-1"}>
                                <h4 className={"text-sm font-normal"}>Mark as bug</h4>
                                <p className={"text-muted-foreground text-xs font-normal"}>Hides Idea from your
                                    users</p>
                            </div>
                            <Button
                                variant={"outline"}
                                className={`hover:bg-muted w-[105px] ${theme === "dark" ? "" : "border-muted-foreground text-muted-foreground"} text-sm font-medium`}
                                onClick={() => onChangeStatus(
                                    "is_active",
                                    selectedIdea?.is_active === 1 ? 0 : 1
                                )}
                            >
                                {
                                    isLoadingCreateIdea ? <Loader2
                                        className="h-4 w-4 animate-spin"/> : (selectedIdea?.is_active === 0 ? "Convert to Idea" : "Mark as bug")
                                }
                            </Button>
                        </div>
                        <div className={"flex gap-1 justify-between items-center"}>
                            <div className={"flex flex-col gap-1"}>
                                <h4 className={"text-sm font-normal"}>Archive</h4>
                                <p className={"text-muted-foreground text-xs font-normal"}>Remove Idea from
                                    Board
                                    and Roadmap</p>
                            </div>
                            <Button
                                variant={"outline"}
                                className={`w-[73px] hover:bg-muted ${theme === "dark" ? "" : "border-muted-foreground text-muted-foreground"} text-sm font-medium`}
                                onClick={() => onChangeStatus(
                                    "is_archive",
                                    selectedIdea?.is_archive === 1 ? 0 : 1
                                )}
                            >
                                {
                                    isLoadingArchive ? <Loader2
                                        className="h-4 w-4 animate-spin"/> : (selectedIdea?.is_archive === 1 ? "Unarchive" : "Archive")
                                }
                            </Button>
                        </div>
                    </div>
                </div>
                <div className={"update-idea-right-side w-full h-full overflow-y-auto"}>
                    {
                        isEditIdea ?
                            <Fragment>
                                <div
                                    className={"px-4 py-3 lg:py-6 lg:px-8 flex flex-col gap-4 ld:gap-6 border-b"}>
                                    <div className="space-y-2">
                                        <Label htmlFor="text" className={"font-normal"}>Title</Label>
                                        <Input type="text" id="text" placeholder="" value={selectedIdea.title}
                                               name={"title"} onChange={onChangeText}/>
                                        {
                                            formError.title &&
                                            <span className="text-red-500 text-sm">{formError.title}</span>
                                        }
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message" className={"font-normal"}>Description</Label>
                                        <ReactQuillEditor value={selectedIdea.description} name={"description"}
                                                          onChange={onChangeText}/>
                                        {formError.description &&
                                        <span className="text-red-500 text-sm">{formError.description}</span>}
                                    </div>
                                    <div className={"space-y-2"}>
                                        <Label className={"font-normal"}>Choose Board for this Idea</Label>
                                        <Select
                                            onValueChange={(value) => onChangeText({
                                                target: {
                                                    name: "board",
                                                    value
                                                }
                                            })}
                                            value={selectedIdea.board}>
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
                                        {formError.board &&
                                        <span className="text-red-500 text-sm">{formError.board}</span>}
                                    </div>
                                </div>
                                <div className={"px-4 py-3 lg:py-6 lg:px-8 border-b space-y-2"}>
                                    <Label className={"font-normal"}>Choose Topics for this Idea (optional)</Label>
                                    <Select onValueChange={handleChangeTopic}
                                            value={selectedIdea.topic.map(x => x.id)}>
                                        <SelectTrigger className="bg-card">
                                            <SelectValue className={"text-muted-foreground text-sm"}
                                                         placeholder="Assign to">
                                                <div className={"flex flex-wrap gap-[2px]"}>
                                                    {(selectedIdea.topic || []).map((x, index) => {
                                                        const findObj = (topicLists || []).find((y) => y.id === x?.id);
                                                        return (
                                                            <div key={index}
                                                                 className={`text-xs flex gap-[2px] ${theme === "dark" ? "text-card" : ""} bg-slate-300 items-center rounded py-0 px-2`}>
                                                                {findObj?.title}
                                                            </div>
                                                        );
                                                    })}
                                                    {(selectedIdea.topic || []).length > 2 && <div>...</div>}
                                                </div>
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {
                                                    (topicLists || []).map((x, i) => {
                                                        return (
                                                            <SelectItem className={""} key={i} value={x.id}>
                                                                <div className={"flex gap-2"}>
                                                                    <div onClick={() => handleChangeTopic(x.id)}
                                                                         className="checkbox-icon">
                                                                        {(selectedIdea.topic.map((x) => x.id) || []).includes(x.id) ?
                                                                            <Check size={18}/> : <div className={"h-[18px] w-[18px]"}/>}
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
                                <div className={"p-4 lg:p-8 flex gap-3"}>
                                    <Button
                                        className={`w-[54px] text-sm font-medium hover:bg-primary`}
                                        onClick={onCreateIdea}
                                    >
                                        {
                                            isLoadingCreateIdea ? <Loader2 className="h-4 w-4 animate-spin"/> :
                                                "Save"
                                        }
                                    </Button>
                                    <Button
                                        variant={"outline hover:bg-transparent"}
                                        className={"border border-primary text-sm font-medium text-primary"}
                                        onClick={handleOnCreateCancel}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Fragment>
                            :
                            <Fragment>
                                <div className={"px-4 py-3 lg:py-6 lg:px-8"}>
                                    <div className={"flex flex-col gap-6"}>
                                        <div className={"flex justify-between items-center gap-4 md:flex-nowrap flex-wrap"}>
                                            {
                                                isLoading ?
                                                    <div className={"flex gap-2 items-center"}>
                                                        <Skeleton className="w-[30px] h-[30px] rounded-full" />
                                                        <Skeleton className="w-[30px] h-[30px] rounded-full" />
                                                    </div>
                                                        :
                                                    <div className={"flex gap-2 items-center"}>
                                                        <Button
                                                            className={"p-[7px] bg-white shadow border hover:bg-white w-[30px] h-[30px]"}
                                                            variant={"outline"}
                                                            onClick={() => giveVote(1)}
                                                        >
                                                            <ArrowBigUp
                                                                className={"fill-primary stroke-primary"}/>
                                                        </Button>
                                                        <p className={"text-xl font-normal"}>{selectedIdea?.vote}</p>
                                                        {
                                                            selectedIdea && selectedIdea?.vote_list && selectedIdea?.vote_list.length ?
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <Button variant={"ghost hover-none"}
                                                                                className={"rounded-full p-0 h-[24px]"}>
                                                                            {
                                                                                (selectedIdea?.vote_list.slice(0, 1) || []).map((x, i) => {
                                                                                    return (
                                                                                        <div className={"flex"}
                                                                                             key={i}>
                                                                                            <div
                                                                                                className={"relative"}>
                                                                                                <div
                                                                                                    className={"update-idea text-sm rounded-full border text-center"}>
                                                                                                    <Avatar>
                                                                                                        {
                                                                                                            x.user_photo ?
                                                                                                                <AvatarImage
                                                                                                                    src={x.user_photo}
                                                                                                                    alt={x && x.name && x.name.substring(0, 1)}/> :
                                                                                                                <AvatarFallback>{x && x.name && x.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                                                                                                        }
                                                                                                    </Avatar>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div
                                                                                                className={"update-idea text-sm rounded-full border text-center ml-[-5px]"}>
                                                                                                <Avatar><AvatarFallback>+{selectedIdea?.vote_list.length}</AvatarFallback></Avatar>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </Button>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="p-0" align={"start"}>
                                                                        <div className={""}>
                                                                            <div className={"py-3 px-4"}>
                                                                                <h4 className="font-normal leading-none text-sm">{`Voters (${selectedIdea?.vote_list.length})`}</h4>
                                                                            </div>
                                                                            <div
                                                                                className="border-t px-4 py-3 space-y-2">
                                                                                {
                                                                                    (selectedIdea?.vote_list || []).map((x, i) => {
                                                                                        return (
                                                                                            <div
                                                                                                className={"flex gap-2"}
                                                                                                key={i}>
                                                                                                <div
                                                                                                    className={"update-idea text-sm rounded-full border text-center"}>
                                                                                                    <Avatar
                                                                                                        className={"w-[20px] h-[20px]"}>
                                                                                                        {
                                                                                                            x.user_photo ?
                                                                                                                <AvatarImage
                                                                                                                    src={x.user_photo}
                                                                                                                    alt=""/>
                                                                                                                :
                                                                                                                <AvatarFallback>{x && x.name && x.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                                                                                                        }
                                                                                                    </Avatar>
                                                                                                </div>
                                                                                                <h4 className={"text-sm font-normal"}>{x.name}</h4>
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </PopoverContent>
                                                                </Popover>
                                                                : ""
                                                        }
                                                    </div>
                                            }
                                            <div className={"md:hidden"}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger>
                                                        <Ellipsis size={16}/>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align={"end"}>
                                                        <DropdownMenuItem className={"cursor-pointer"}
                                                                          onClick={() => setIsEditIdea(true)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className={"cursor-pointer"}
                                                                          onClick={() => onChangeStatus("pin_to_top", selectedIdea?.pin_to_top === 0 ? 1 : 0)}>
                                                            {selectedIdea?.pin_to_top == 0 ? "Pinned" : "Unpinned"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className={"cursor-pointer"}
                                                                          onClick={() => onChangeStatus(
                                                                              "is_active",
                                                                              selectedIdea?.is_active === 1 ? 0 : 1
                                                                          )}>
                                                            {selectedIdea?.is_active === 0 ? "Convert to Idea" : "Mark as bug"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className={"cursor-pointer"}
                                                                          onClick={() => onChangeStatus(
                                                                              "is_archive",
                                                                              selectedIdea?.is_archive === 1 ? 0 : 1
                                                                          )}>
                                                            {selectedIdea?.is_archive === 1 ? "Unarchive" : "Archive"}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <div className={"lg:hidden md:block hidden"}>
                                                <div className={"flex items-center gap-2"}>
                                                    <div className={"flex gap-2"}>
                                                        <div className={"flex gap-1 justify-between"}>
                                                            <Button
                                                                variant={"outline"}
                                                                className={`hover:bg-muted w-[95px] h-[30px] ${theme === "dark" ? "" : "border-muted-foreground text-muted-foreground"} text-xs font-medium`}
                                                                onClick={() => onChangeStatus(
                                                                    "is_active",
                                                                    selectedIdea?.is_active === 1 ? 0 : 1
                                                                )}
                                                            >
                                                                {
                                                                    isLoadingCreateIdea ? <Loader2
                                                                        className="h-4 w-4 animate-spin"/> : (selectedIdea?.is_active === 0 ? "Convert to Idea" : "Mark as bug")
                                                                }
                                                            </Button>
                                                        </div>
                                                        <div className={"flex gap-1 justify-between"}>
                                                            <Button
                                                                variant={"outline"}
                                                                className={`hover:bg-muted w-[80px] h-[30px] ${theme === "dark" ? "" : "border-muted-foreground text-muted-foreground"} text-xs font-medium`}
                                                                onClick={() => onChangeStatus(
                                                                    "is_archive",
                                                                    selectedIdea?.is_archive === 1 ? 0 : 1
                                                                )}
                                                            >
                                                                {
                                                                    isLoadingArchive ? <Loader2
                                                                        className="h-4 w-4 animate-spin"/> : (selectedIdea?.is_archive === 1 ? "Unarchive" : "Archive")
                                                                }
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className={"flex gap-2"}>
                                                        {
                                                            selectedIdea?.is_edit === 1 ?
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={"w-[30px] h-[30px] p-1"}
                                                                    onClick={() => setIsEditIdea(true)}
                                                                >
                                                                    <Pencil className={"w-[16px] h-[16px]"}/>
                                                                </Button> : ""
                                                        }

                                                        <Button
                                                            variant={"outline"}
                                                            className={`w-[30px] h-[30px] p-1`}
                                                            onClick={() => onChangeStatus("pin_to_top", selectedIdea?.pin_to_top === 0 ? 1 : 0)}
                                                        >
                                                            {selectedIdea?.pin_to_top == 0 ?
                                                                <Pin size={16}/> :
                                                                <Pin size={16} className={`${theme === "dark" ? "fill-card-foreground" : "fill-card-foreground"}`}/>}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={"hidden lg:block"}>
                                                <div className={"flex gap-2"}>
                                                    {
                                                        isLoading ?
                                                            <div className={"flex gap-2"}>
                                                                {
                                                                    selectedIdea?.is_edit === 1 ?
                                                                        <Skeleton className="w-[30px] h-[30px] rounded-full"/>
                                                                        : ""
                                                                }
                                                                <Skeleton className="w-[30px] h-[30px] rounded-full" />
                                                            </div>
                                                                :
                                                            <Fragment>
                                                                {
                                                                    selectedIdea?.is_edit === 1 ?
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={"w-[30px] h-[30px] p-1"}
                                                                            onClick={() => setIsEditIdea(true)}
                                                                        >
                                                                            <Pencil className={"w-[16px] h-[16px]"}/>
                                                                        </Button> : ""
                                                                }
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={`w-[30px] h-[30px] p-1`}
                                                                    onClick={() => onChangeStatus("pin_to_top", selectedIdea?.pin_to_top === 0 ? 1 : 0)}
                                                                >
                                                                    {selectedIdea?.pin_to_top == 0 ?
                                                                        <Pin size={16}/> :
                                                                        <Pin size={16} className={`${theme === "dark" ? "fill-card-foreground" : "fill-card-foreground"}`}/>}
                                                                </Button>
                                                            </Fragment>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            isLoading ?
                                                <div className={"flex flex-col gap-4"}>
                                                    <Skeleton className="h-4 " />
                                                    <div className={"space-y-1"}>
                                                        <Skeleton className="h-4 " />
                                                        <Skeleton className="h-4 " />
                                                    </div>
                                                </div> :
                                                <div className={"flex flex-col gap-4"}>
                                                    <div className={"flex items-center gap-2"}>
                                                        <h2 className={"text-xl font-normal"}>{selectedIdea?.title}</h2>
                                                    </div>
                                                    <div
                                                        className={`description-container text-sm ${theme === "dark" ? "" : "text-muted-foreground" }`}
                                                        dangerouslySetInnerHTML={{ __html: selectedIdea?.description }}
                                                    />
                                                </div>
                                        }
                                        {
                                            isLoading ?
                                                <div className={"flex gap-2 flex-wrap"}>
                                                    <Skeleton className="w-[50px] h-[50px] md:w-[100px] md:h-[100px] border p-[3px] relative" />
                                                </div>
                                                :
                                                <Fragment>
                                                    {
                                                        selectedIdea && selectedIdea?.images && selectedIdea?.images?.length > 0 ?
                                                            <div className={"flex gap-2 flex-wrap"}>
                                                                <Fragment>
                                                                    {
                                                                        (selectedIdea?.images || []).map((x, i) => {
                                                                                return (
                                                                                    <Fragment>
                                                                                        {
                                                                                            x && x.name ?
                                                                                                <div
                                                                                                    className="w-[50px] h-[50px] md:w-[100px] md:h-[100px] border p-[3px] relative"
                                                                                                    onClick={() => handleImageClick(URL.createObjectURL(x))}
                                                                                                >
                                                                                                    <img className={"upload-img cursor-pointer"}
                                                                                                         src={x && x.name ? URL.createObjectURL(x) : x}
                                                                                                         alt=""/>
                                                                                                </div> : x ?
                                                                                                <div
                                                                                                    className="w-[50px] h-[50px] md:w-[100px] md:h-[100px] border p-[3px] relative"
                                                                                                    onClick={() => handleImageClick(x)}
                                                                                                >
                                                                                                    <img className={"upload-img cursor-pointer"}
                                                                                                         src={x} alt=""/>
                                                                                                </div> : ""
                                                                                        }
                                                                                    </Fragment>
                                                                                )
                                                                            }
                                                                        )}
                                                                </Fragment>
                                                            </div> : ""
                                                    }
                                                </Fragment>
                                        }
                                        <div className={"flex items-center"}>
                                            <div className={"flex items-center gap-4 md:flex-nowrap flex-wrap"}>
                                                <div className={"flex items-center gap-2"}>
                                                    <Avatar className={"w-[20px] h-[20px]"}>
                                                        {
                                                            isLoading ?
                                                                <Skeleton className="w-[20px] h-[20px] rounded-full" /> :
                                                                <Fragment>
                                                                    {
                                                                        selectedIdea?.user_photo ?
                                                                            <AvatarImage src={selectedIdea?.user_photo}
                                                                                         alt="@shadcn"/>
                                                                            :
                                                                            <AvatarFallback>{selectedIdea && selectedIdea?.name && selectedIdea?.name.substring(0, 1)}</AvatarFallback>
                                                                    }
                                                                </Fragment>
                                                        }
                                                    </Avatar>
                                                    <div className={"flex items-center"}>
                                                        {
                                                            isLoading ?
                                                                <Skeleton className="w-[50px] h-[20px]" />
                                                                :
                                                                <Fragment>
                                                                    <h4 className={"text-sm font-normal"}>{selectedIdea?.name}</h4>
                                                                    <p className={"text-sm font-normal flex items-center text-muted-foreground"}>
                                                                        <Dot size={20}
                                                                             className={"fill-text-card-foreground stroke-text-card-foreground"}/>
                                                                        {moment(selectedIdea?.created_at).format('D MMM')}
                                                                    </p>
                                                                </Fragment>
                                                        }

                                                    </div>
                                                </div>
                                                {
                                                    isLoading ? <Skeleton className={"w-[224px] h-[24px] px-3 py-1"} /> :
                                                        <Select
                                                            onValueChange={(value) => onChangeStatus('roadmap_id', value)}
                                                            value={selectedIdea?.roadmap_id}
                                                        >
                                                            <SelectTrigger className="w-[224px] h-[24px] px-3 py-1">
                                                                <SelectValue/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectItem value={null}>
                                                                        <div className={"flex items-center gap-2"}>
                                                                            No status
                                                                        </div>
                                                                    </SelectItem>
                                                                    {
                                                                        (roadmapStatus || []).map((x, i) => {
                                                                            return (
                                                                                <SelectItem key={i} value={x.id}>
                                                                                    <div
                                                                                        className={"flex items-center gap-2"}>
                                                                                        <Circle fill={x.color_code}
                                                                                                stroke={x.color_code}
                                                                                                className={` w-[10px] h-[10px]`}/>
                                                                                        {x.title ? x.title : "No status"}
                                                                                    </div>
                                                                                </SelectItem>
                                                                            )
                                                                        })
                                                                    }
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                }
                                            </div>
                                        </div>
                                        {
                                            isLoading ?
                                                <div className={"flex flex-col gap-2"}>
                                                    <div className="w-full flex flex-col gap-2">
                                                        <Skeleton className={"w-[100px] h-[20px]"} />
                                                        <Skeleton className={"w-full h-[80px]"} />
                                                    </div>
                                                    <div className={"flex justify-end gap-2 items-center"}>
                                                        <Skeleton className={"w-[36px] h-[36px]"} />
                                                        <Skeleton className={"w-[128px] h-[36px]"} />
                                                    </div>
                                                </div>
                                                :
                                                <div className={"flex flex-col gap-2"}>
                                                    <div className="w-full flex flex-col gap-2">
                                                        <Label htmlFor="message" className={"font-normal"}>Add comment</Label>
                                                        {/*{*/}
                                                        {/*    privateNote ?*/}
                                                        {/*        <Card*/}
                                                        {/*            className={`shadow-none ${theme === "dark" ? "" : "border-amber-300"}`}>*/}
                                                        {/*            <div*/}
                                                        {/*                className={`text-xs text-card-foreground font-normal py-1 px-3 ${theme === "dark" ? "" : "bg-orange-100"} rounded-tl-md rounded-tr-md`}>Add*/}
                                                        {/*                a private note for your team*/}
                                                        {/*            </div>*/}
                                                        {/*            <Textarea*/}
                                                        {/*                className={"rounded-tl-none rounded-tr-none"}*/}
                                                        {/*                placeholder="Private Start writing..."*/}
                                                        {/*                id="message"*/}
                                                        {/*                value={commentText}*/}
                                                        {/*                onChange={(e) => setCommentText(e.target.value)}*/}
                                                        {/*            />*/}
                                                        {/*        </Card>*/}
                                                        {/*        :*/}
                                                        <>
                                                            <Textarea
                                                                placeholder="Start writing..."
                                                                id="message"
                                                                value={commentText}
                                                                onChange={(e) => setCommentText(e.target.value)}
                                                            />
                                                            {
                                                                commentFiles && commentFiles.length ?
                                                                    <div className={"flex flex-wrap gap-3 mt-1"}>
                                                                        {
                                                                            (commentFiles || []).map((x, i) => {
                                                                                return (
                                                                                    <Fragment>
                                                                                        {
                                                                                            x && x.name ?
                                                                                                <div
                                                                                                    className={"w-[50px] h-[50px] md:w-[100px] md:h-[100px] relative border p-[3px]"}>
                                                                                                    <img
                                                                                                        className={"upload-img"}
                                                                                                        src={x && x.name ? URL.createObjectURL(x) : x}
                                                                                                        alt=""/>
                                                                                                    <CircleX
                                                                                                        size={20}
                                                                                                        className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                                                                        onClick={() => onDeleteImageComment(i, false)}
                                                                                                    />
                                                                                                </div> : x ?
                                                                                                <div
                                                                                                    className={"w-[50px] h-[50px] md:w-[100px] md:h-[100px] relative border p-[3px]"}>
                                                                                                    <img
                                                                                                        className={"upload-img"}
                                                                                                        src={x}
                                                                                                        alt={x}/>
                                                                                                    <CircleX
                                                                                                        size={20}
                                                                                                        className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                                                                        onClick={() => onDeleteImageComment(i, false)}
                                                                                                    />
                                                                                                </div> : ''
                                                                                        }
                                                                                    </Fragment>
                                                                                )
                                                                            })
                                                                        }
                                                                    </div>
                                                                    : ""
                                                            }
                                                        </>
                                                        {/*}*/}
                                                    </div>
                                                    <div className={"flex justify-between gap-1"}>
                                                        <div className="flex items-center space-x-2">
                                                            {/*<Switch id="airplane-mode"*/}
                                                            {/*        onCheckedChange={handlePrivateNote}/>*/}
                                                            {/*<Label htmlFor="airplane-mode"*/}
                                                            {/*       className={"text-sm font-normal"}>Private*/}
                                                            {/*    note</Label>*/}
                                                        </div>
                                                        <div className={"flex gap-2 items-center"}>
                                                            <div className="p-2 max-w-sm relative w-[36px] h-[36px]">

                                                                <input
                                                                    id="commentFile"
                                                                    type="file"
                                                                    className="hidden"
                                                                    onChange={handleAddCommentImg}
                                                                    accept={".jpg,.jpeg"}
                                                                />
                                                                <label htmlFor="commentFile"
                                                                       className="absolute inset-0 flex items-center justify-center bg-white border border-primary rounded cursor-pointer"
                                                                >
                                                                    <Paperclip size={16} className={"stroke-primary"}/>
                                                                </label>

                                                            </div>
                                                            <Button
                                                                className={"w-[117px] text-sm font-medium"}
                                                                onClick={onCreateComment}
                                                                disabled={commentText.trim() === "" || commentText === ""}
                                                            >
                                                                {
                                                                    isSaveComment ? <Loader2
                                                                        className="h-4 w-4 animate-spin"/> : "Add Comment"
                                                                }
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                        }
                                    </div>
                                </div>
                                <div className={"tabs"}>
                                    <Tabs defaultValue="comment">
                                        <div className={"px-4 lg:px-8"}>
                                            <TabsList className={"bg-transparent border-b-2 border-b-primary rounded-none"}>
                                                <TabsTrigger className={"ideas-tab-comm-bgCol"} value="comment">Comment</TabsTrigger>
                                            </TabsList>
                                        </div>

                                        {
                                            selectedIdea?.comments?.length > 0 &&
                                            <TabsContent value="comment" className={`${theme === "dark" ? "" : "bg-muted"} pb-5`}>
                                                {
                                                    selectedIdea && selectedIdea?.comments && selectedIdea?.comments.length > 0 ?
                                                        (selectedIdea?.comments || []).map((x, i) => {
                                                            return (
                                                                <Fragment>
                                                                    <div className={"flex gap-2 p-4 lg:p-8 lg:pb-0 pt-3 pb-0"}>
                                                                        <div>
                                                                            <div className={"update-idea text-sm rounded-full border text-center"}>
                                                                                <Avatar className={"w-[20px] h-[20px]"}>
                                                                                    {
                                                                                        x?.user_photo ?
                                                                                            <AvatarImage
                                                                                                src={x?.user_photo}
                                                                                                alt="@shadcn"/>
                                                                                            :
                                                                                            <AvatarFallback>{x && x?.name && x?.name?.substring(0, 1).toUpperCase()}</AvatarFallback>
                                                                                    }
                                                                                </Avatar>
                                                                            </div>
                                                                        </div>
                                                                        <div className={"w-full flex flex-col space-y-3"}>
                                                                            <div className={"flex gap-1 flex-wrap justify-between"}>
                                                                                <div className={"flex items-start"}>
                                                                                    <h4 className={"text-sm font-normal"}>{x?.name}</h4>
                                                                                    <p className={"text-sm font-normal flex items-center text-muted-foreground"}>
                                                                                        <Dot size={20}
                                                                                             className={"fill-text-card-foreground stroke-text-card-foreground"}/>
                                                                                        {moment.utc(x?.created_at).local().startOf('seconds').fromNow()}
                                                                                    </p>
                                                                                </div>
                                                                                <div className={"flex gap-2"}>
                                                                                    {
                                                                                        selectedCommentIndex === i && isEditComment ? "" :
                                                                                            x?.is_edit === 1 ?
                                                                                                <><Button
                                                                                                    variant={"outline"}
                                                                                                    className={"w-[30px] h-[30px] p-1"}
                                                                                                    onClick={() => onEditComment(x, i)}
                                                                                                >
                                                                                                    <Pencil
                                                                                                        className={"w-[16px] h-[16px]"}/>
                                                                                                </Button>
                                                                                                    <Button
                                                                                                        variant={"outline"}
                                                                                                        className={"w-[30px] h-[30px] p-1"}
                                                                                                        onClick={() => deleteComment(x.id, i)}
                                                                                                    >
                                                                                                        <Trash2
                                                                                                            className={"w-[16px] h-[16px]"}/>
                                                                                                    </Button></> : ""
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <Fragment>
                                                                                    {
                                                                                        selectedCommentIndex === i && isEditComment ?
                                                                                            <div className={"space-y-2"}>
                                                                                                <Textarea
                                                                                                    value={selectedComment.comment}
                                                                                                    onChange={(e) => setSelectedComment({
                                                                                                        ...selectedComment,
                                                                                                        comment: e.target.value
                                                                                                    })}
                                                                                                />
                                                                                                {
                                                                                                    selectedComment && selectedComment?.images && selectedComment?.images?.length ?
                                                                                                        <div className={"flex gap-3 flex-wrap"}>
                                                                                                            {
                                                                                                                (selectedComment?.images || []).map((x, i) => {
                                                                                                                    return (
                                                                                                                        <Fragment>
                                                                                                                            {
                                                                                                                                x && x.name ?
                                                                                                                                    <div
                                                                                                                                        className={"w-[50px] h-[50px] md:w-[100px] md:h-[100px] relative border p-[3px]"}>
                                                                                                                                        <img
                                                                                                                                            className={"upload-img"}
                                                                                                                                            src={x && x.name ? URL.createObjectURL(x) : x}
                                                                                                                                            alt=""/>
                                                                                                                                        <CircleX
                                                                                                                                            size={20}
                                                                                                                                            className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                                                                                                            onClick={() => onDeleteCommentImage(i, true)}/>
                                                                                                                                    </div> : x ?
                                                                                                                                    <div
                                                                                                                                        className={"w-[50px] h-[50px] md:w-[100px] md:h-[100px] relative border p-[3px]"}>
                                                                                                                                        <img
                                                                                                                                            className={"upload-img"}
                                                                                                                                            src={x}
                                                                                                                                            alt={x}/>
                                                                                                                                        <CircleX
                                                                                                                                            size={20}
                                                                                                                                            className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                                                                                                            onClick={() => onDeleteCommentImage(i, false)}/>
                                                                                                                                    </div> : ''
                                                                                                                            }
                                                                                                                        </Fragment>
                                                                                                                    )
                                                                                                                })
                                                                                                            }
                                                                                                        </div> : ""
                                                                                                }
                                                                                                <div className={"flex gap-2"}>
                                                                                                    <Button
                                                                                                        className={`w-[81px] h-[30px] text-sm font-medium hover:bg-primary`}
                                                                                                        onClick={onUpdateComment}
                                                                                                        disabled={selectedComment.comment.trim() === "" || selectedComment.comment === ""}>
                                                                                                        {
                                                                                                            isSaveUpdateComment ?
                                                                                                                <Loader2
                                                                                                                    size={16}
                                                                                                                    className="animate-spin"/> : "Save"
                                                                                                        }
                                                                                                    </Button>
                                                                                                    <Button
                                                                                                        className={`h-[30px] text-sm font-medium text-primary border border-primary`}
                                                                                                        variant={"outline hover:none"}
                                                                                                        onClick={onCancelComment}>
                                                                                                        Cancel
                                                                                                    </Button>
                                                                                                    <div
                                                                                                        className="p-2 max-w-sm relative w-[36px]">
                                                                                                        <Input
                                                                                                            id="selectedCommentImg"
                                                                                                            type="file"
                                                                                                            className="hidden"
                                                                                                            onChange={handleAddCommentImg}
                                                                                                            accept={".jpg,.jpeg"}
                                                                                                        />
                                                                                                        <label
                                                                                                            htmlFor="selectedCommentImg"
                                                                                                            className="absolute inset-0 flex items-center justify-center bg-white border border-primary rounded cursor-pointer">
                                                                                                            <Paperclip
                                                                                                                size={16}
                                                                                                                className={"stroke-primary"}/>
                                                                                                        </label>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            : <div className={"space-y-2"}>
                                                                                                <p className={"text-xs"}>{x.comment}</p>
                                                                                                <div className={"flex gap-2 flex-wrap"}>
                                                                                                    {
                                                                                                        (Array.isArray(x?.images) ? x.images : []).map((img, ind) => (
                                                                                                            <div
                                                                                                                key={ind}
                                                                                                                className={"w-[50px] h-[50px] md:w-[100px] md:h-[100px] border p-[3px]"}
                                                                                                                onClick={() => handleImageClick(img)}
                                                                                                            >
                                                                                                                <img
                                                                                                                    className={"upload-img cursor-pointer"}
                                                                                                                    src={img}
                                                                                                                    alt={img}
                                                                                                                />
                                                                                                            </div>
                                                                                                        ))
                                                                                                    }

                                                                                                </div>
                                                                                            </div>
                                                                                    }
                                                                                </Fragment>
                                                                            </div>

                                                                            {
                                                                                selectedCommentIndex === i ? "" :
                                                                                    <div
                                                                                        className={"flex justify-between"}>
                                                                                        <Button
                                                                                            className="p-0 text-sm h-auto font-medium text-primary"
                                                                                            variant={"ghost hover-none"}
                                                                                            onClick={() => onShowSubComment(i)}
                                                                                            key={`comment-nested-reply-to-${i}`}
                                                                                        >
                                                                                            Reply
                                                                                        </Button>
                                                                                        <div
                                                                                            className={"flex items-center gap-2 cursor-pointer"}
                                                                                            onClick={() => onShowSubComment(i)}
                                                                                        >
                                                                                                    <span>
                                                                                                        <MessageCircleMore
                                                                                                            className={"stroke-primary w-[16px] h-[16px]"}/>
                                                                                                    </span>
                                                                                            <p className={"text-base font-normal"}>
                                                                                                {x.reply.length}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                            }
                                                                            {
                                                                                x.show_reply ?
                                                                                    <div
                                                                                        className={"space-y-3"}>
                                                                                        {
                                                                                            (x?.reply || []).map((y, j) => {
                                                                                                return (
                                                                                                    <Fragment>
                                                                                                        <div
                                                                                                            className={"flex gap-2"}>
                                                                                                            <div>
                                                                                                                <div
                                                                                                                    className={"update-idea text-sm rounded-full border text-center"}>
                                                                                                                    <Avatar><AvatarFallback>{y?.name?.substring(0, 1).toUpperCase()}</AvatarFallback></Avatar>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div
                                                                                                                className={"w-full space-y-2"}>
                                                                                                                <div
                                                                                                                    className={"flex justify-between"}>
                                                                                                                    <div
                                                                                                                        className={"flex items-start"}>
                                                                                                                        <h4 className={"text-sm font-normal"}>{x.name}</h4>
                                                                                                                        <p className={"text-sm font-normal flex items-center text-muted-foreground"}>
                                                                                                                            <Dot
                                                                                                                                size={20}
                                                                                                                                className={"fill-text-card-foreground stroke-text-card-foreground"}/>
                                                                                                                            {moment.utc(x.created_at).local().startOf('seconds').fromNow()}
                                                                                                                        </p>
                                                                                                                    </div>
                                                                                                                    {
                                                                                                                        selectedCommentIndex === i && selectedSubCommentIndex === j ? "" :
                                                                                                                            y.is_edit === 1 ?
                                                                                                                                <div
                                                                                                                                    className="flex gap-2">
                                                                                                                                    <Button
                                                                                                                                        variant={"outline"}
                                                                                                                                        className={"w-[30px] h-[30px] p-1"}
                                                                                                                                        onClick={() => onEditSubComment(x, y, i, j)}>
                                                                                                                                        <Pencil
                                                                                                                                            className={"w-[16px] h-[16px]"}/>
                                                                                                                                    </Button>
                                                                                                                                    <Button
                                                                                                                                        variant={"outline"}
                                                                                                                                        className={"w-[30px] h-[30px] p-1"}
                                                                                                                                        onClick={() => deleteSubComment(y.id, x, i, j)}>
                                                                                                                                        <Trash2
                                                                                                                                            className={"w-[16px] h-[16px]"}/>
                                                                                                                                    </Button>
                                                                                                                                </div> : ''
                                                                                                                    }
                                                                                                                </div>
                                                                                                                <div>
                                                                                                                    {
                                                                                                                        selectedCommentIndex === i && selectedSubCommentIndex === j ?
                                                                                                                            <div
                                                                                                                                className={"space-y-2"}>
                                                                                                                                <Textarea
                                                                                                                                    value={selectedSubComment.comment}
                                                                                                                                    onChange={(e) => onChangeTextSubComment(e)}
                                                                                                                                />
                                                                                                                                {
                                                                                                                                    selectedSubComment && selectedSubComment.images && selectedSubComment.images.length ?
                                                                                                                                        <div
                                                                                                                                            className={"flex gap-2 flex-wrap"}>
                                                                                                                                            {
                                                                                                                                                (selectedSubComment.images || []).map((x, ind) => {
                                                                                                                                                    return (
                                                                                                                                                        <Fragment>
                                                                                                                                                            {
                                                                                                                                                                x && x.name ?
                                                                                                                                                                    <div
                                                                                                                                                                        className={"w-[50px] h-[50px] md:w-[100px] md:h-[100px] relative border p-[3px]"}>
                                                                                                                                                                        <img
                                                                                                                                                                            className={"upload-img"}
                                                                                                                                                                            src={x && x.name ? URL.createObjectURL(x) : x}
                                                                                                                                                                            alt=""/>
                                                                                                                                                                        <CircleX
                                                                                                                                                                            size={20}
                                                                                                                                                                            className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                                                                                                                                            onClick={() => onDeleteSubCommentImage(ind, true)}
                                                                                                                                                                        />
                                                                                                                                                                    </div> : x ?
                                                                                                                                                                    <div
                                                                                                                                                                        className={"w-[50px] h-[50px] md:w-[100px] md:h-[100px] relative border p-[3px]"}>
                                                                                                                                                                        <img
                                                                                                                                                                            className={"upload-img"}
                                                                                                                                                                            src={x}
                                                                                                                                                                            alt={x}/>
                                                                                                                                                                        <CircleX
                                                                                                                                                                            size={20}
                                                                                                                                                                            className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                                                                                                                                            onClick={() => onDeleteSubCommentImage(ind, false)}
                                                                                                                                                                        />
                                                                                                                                                                    </div> : ''
                                                                                                                                                            }
                                                                                                                                                        </Fragment>
                                                                                                                                                    )
                                                                                                                                                })
                                                                                                                                            }
                                                                                                                                        </div> : ""
                                                                                                                                }
                                                                                                                                <div
                                                                                                                                    className={"flex gap-2"}>
                                                                                                                                    <Button
                                                                                                                                        className={`w-[81px] h-[30px] text-sm font-medium hover:bg-primary`}
                                                                                                                                        onClick={onUpdateSubComment}
                                                                                                                                        disabled={selectedSubComment.comment.trim() === "" || selectedSubComment.comment === ""}>
                                                                                                                                        {
                                                                                                                                            isSaveUpdateSubComment ?
                                                                                                                                                <Loader2
                                                                                                                                                    size={16}
                                                                                                                                                    className="animate-spin"/> : "Save"
                                                                                                                                        }
                                                                                                                                    </Button>
                                                                                                                                    <Button
                                                                                                                                        className={"px-3 py-2 h-[30px] text-sm font-medium text-primary border border-primary"}
                                                                                                                                        variant={"outline hover:none"}
                                                                                                                                        onClick={onCancelSubComment}>Cancel</Button>
                                                                                                                                    <div
                                                                                                                                        className="p-2 max-w-sm relative w-[36px]">
                                                                                                                                        <Input
                                                                                                                                            id="commentFileInput"
                                                                                                                                            type="file"
                                                                                                                                            className="hidden"
                                                                                                                                            onChange={handleSubCommentUploadImg}
                                                                                                                                            accept={".jpg,.jpeg"}
                                                                                                                                        />
                                                                                                                                        <label
                                                                                                                                            htmlFor="commentFileInput"
                                                                                                                                            className="absolute inset-0 flex items-center justify-center bg-white border border-primary rounded cursor-pointer">
                                                                                                                                            <Paperclip
                                                                                                                                                size={16}
                                                                                                                                                className={"stroke-primary"}/>
                                                                                                                                        </label>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </div> :
                                                                                                                            <div className={"space-y-2"}>
                                                                                                                                <p className={"text-xs"}>{y.comment}</p>
                                                                                                                                <div className={"flex gap-2 flex-wrap"}>
                                                                                                                                    {
                                                                                                                                        y && y.images && y.images.length ?
                                                                                                                                            <Fragment>
                                                                                                                                                {
                                                                                                                                                    (Array.isArray(y?.images) ? y.images : []).map((z, i) => {
                                                                                                                                                        return (
                                                                                                                                                            <div key={i}
                                                                                                                                                                 className={"w-[50px] h-[50px] md:w-[100px] md:h-[100px] border p-[3px]"}
                                                                                                                                                                 onClick={() => handleImageClick(z)}
                                                                                                                                                            >
                                                                                                                                                                <img
                                                                                                                                                                    className={"upload-img cursor-pointer"}
                                                                                                                                                                    src={z}
                                                                                                                                                                    alt={z}/>
                                                                                                                                                            </div>
                                                                                                                                                        )
                                                                                                                                                    })
                                                                                                                                                }
                                                                                                                                            </Fragment>
                                                                                                                                            : ''
                                                                                                                                    }
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                    }
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </Fragment>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                        <div
                                                                                            className={"space-y-2"}>
                                                                                            <Textarea
                                                                                                value={subCommentText}
                                                                                                onChange={(e) => setSubCommentText(e.target.value)}/>
                                                                                            {
                                                                                                subCommentFiles && subCommentFiles.length ?
                                                                                                    <div
                                                                                                        className={"flex gap-3 flex-wrap"}>
                                                                                                        {
                                                                                                            (subCommentFiles || []).map((z, i) => {
                                                                                                                return (
                                                                                                                    <div>
                                                                                                                        {
                                                                                                                            z && z.name ?
                                                                                                                                <div
                                                                                                                                    className={"w-[50px] h-[50px] md:w-[100px] md:h-[100px] relative border p-[3px]"}>
                                                                                                                                    <img
                                                                                                                                        className={"upload-img"}
                                                                                                                                        src={z && z.name ? URL.createObjectURL(z) : z}/>
                                                                                                                                    <CircleX
                                                                                                                                        size={20}
                                                                                                                                        className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                                                                                                        onClick={() => onDeleteSubCommentImageOld(i, false)}
                                                                                                                                    />
                                                                                                                                </div> : z ?
                                                                                                                                <div
                                                                                                                                    className={"w-[50px] h-[50px] md:w-[100px] md:h-[100px] relative border p-[3px]"}>
                                                                                                                                    <img
                                                                                                                                        className={"upload-img"}
                                                                                                                                        src={z}
                                                                                                                                        alt={z}/>
                                                                                                                                    <CircleX
                                                                                                                                        size={20}
                                                                                                                                        className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                                                                                                        onClick={() => onDeleteSubCommentImageOld(i, false)}
                                                                                                                                    />
                                                                                                                                </div> : ''
                                                                                                                        }
                                                                                                                    </div>
                                                                                                                )
                                                                                                            })
                                                                                                        }
                                                                                                    </div> : ""
                                                                                            }
                                                                                            <div
                                                                                                className={"flex gap-2"}>
                                                                                                <Button
                                                                                                    className={`${isSaveSubComment === true ? "py-2 px-6" : "py-2 px-6"} w-[86px] h-[30px] text-sm font-medium`}
                                                                                                    disabled={subCommentText.trim() === "" || subCommentText === ""}
                                                                                                    onClick={() => onCreateSubComment(x, i)}
                                                                                                >
                                                                                                    {
                                                                                                        isSaveSubComment ?
                                                                                                            <Loader2
                                                                                                                size={16}
                                                                                                                className="animate-spin"/> : "Reply"
                                                                                                    }
                                                                                                </Button>
                                                                                                <div
                                                                                                    className="p-2 max-w-sm relative w-[36px]">
                                                                                                    <Input
                                                                                                        id="commentFileInput"
                                                                                                        type="file"
                                                                                                        className="hidden"
                                                                                                        onChange={handleSubCommentUploadImg}
                                                                                                        accept={".jpg,.jpeg"}
                                                                                                    />
                                                                                                    <label
                                                                                                        htmlFor="commentFileInput"
                                                                                                        className="absolute inset-0 flex items-center justify-center bg-white border border-primary rounded cursor-pointer">
                                                                                                        <Paperclip
                                                                                                            size={16}
                                                                                                            className={"stroke-primary"}/>
                                                                                                    </label>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div> : ""
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </Fragment>
                                                            )
                                                        })
                                                        : ""
                                                }
                                            </TabsContent>
                                        }

                                    </Tabs>
                                </div>
                            </Fragment>
                    }
                </div>
            </div>
        </Fragment>
    );
};

export default UpdateIdea;