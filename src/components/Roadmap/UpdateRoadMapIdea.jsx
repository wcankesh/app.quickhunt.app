import React, {Fragment, useEffect, useState} from 'react';
import {Sheet, SheetContent, SheetHeader} from "../ui/sheet";
import {Button} from "../ui/button";
import {ArrowBigUp, Check, Circle, CircleX, Dot, Loader2, MessageCircleMore, Paperclip, Pencil, Trash2, X} from "lucide-react";
import {RadioGroup, RadioGroupItem} from "../ui/radio-group";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Avatar, AvatarFallback} from "../ui/avatar";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {Textarea} from "../ui/textarea";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs";
import {useTheme} from "../theme-provider";
import {useToast} from "../ui/use-toast";
import {useSelector} from "react-redux";
import moment from "moment";
import ReactQuillEditor from "../Comman/ReactQuillEditor";
import ImageUploader from "../Comman/ImageUploader";
import {CommentEditor, ImageGallery, SaveCancelButton, UserAvatar} from "../Comman/CommentEditor";
import {Skeleton} from "../ui/skeleton";
import {apiService, DO_SPACES_ENDPOINT, handleImageOpen} from "../../utils/constent";
import {DialogTitle} from "../ui/dialog";

const initialStateError = {
    title: "",
    description: "",
    boardId: "",
    coverImage: "",
}

const UpdateRoadMapIdea = ({isOpen, onOpen, onClose, selectedIdea, setSelectedIdea, setSelectedRoadmap, selectedRoadmap, roadmapList, setRoadmapList, originalIdea, setOriginalIdea}) => {
    const {theme} = useTheme()
    const {toast} = useToast()
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const [commentText, setCommentText] = useState("")
    const [subCommentText, setSubCommentText] = useState("")
    const [subCommentTextEditIdx, setSubCommentTextEditIdx] = useState(null);
    const [topicLists, setTopicLists] = useState([]);
    const [commentFiles, setCommentFiles] = useState([])
    const [subCommentFiles, setSubCommentFiles] = useState([])
    const [deletedCommentImage, setDeletedCommentImage] = useState([])
    const [deletedSubCommentImage, setDeletedSubCommentImage] = useState([])
    const [roadmapStatus, setRoadmapStatus] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCreateIdea, setIsLoadingCreateIdea] = useState(false);
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
    const [formError, setFormError] = useState(initialStateError);
    const [imageSizeError, setImageSizeError] = useState('');

    useEffect(() => {
        if (projectDetailsReducer.id) {
            setTopicLists(allStatusAndTypes.topics)
            setRoadmapStatus(allStatusAndTypes.roadmapStatus)
        }
    }, [projectDetailsReducer.id, allStatusAndTypes]);

    const handleChangeTopic = (id) => {
        const clone = [...selectedIdea?.topic];
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
        if (selectedIdea?.isEdit !== 1) {
            if (selectedIdea?.userVote === type) {

            } else {
                const payload = {
                    ideaId: selectedIdea?.id,
                    type: type
                }
                const data = await apiService.giveVote(payload);
                if (data.success) {
                    let cloneRoadmap = [...roadmapList.columns];
                    const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap.id);
                    if (roadmapIndex !== -1) {
                        const clone = [...cloneRoadmap[roadmapIndex].ideas];
                        const index = clone.findIndex((x) => x.id === selectedIdea?.id)
                        if (index !== -1) {
                            let newVoteCount = clone[index].vote;
                            newVoteCount = type === 1 ? newVoteCount + 1 : newVoteCount >= 1 ? newVoteCount - 1 : 0;
                            clone[index].vote = newVoteCount;
                            clone[index].userVote = type;
                            let voteLists = [...clone[index].voteLists];
                            if (type === 1) {
                                voteLists.push(data.data)
                                clone[index].voteLists = voteLists;
                            } else {
                                let voteIndex = voteLists.findIndex((x) => (x.name || x?.firstname) == (data.data.name || data.data?.firstname));
                                if (voteIndex !== -1) {
                                    voteLists.splice(voteIndex, 1)
                                    clone[index].voteLists = voteLists;
                                }
                            }
                            cloneRoadmap[roadmapIndex] = {...cloneRoadmap[roadmapIndex], ideas: clone, cards: clone};
                        }
                    }
                    setRoadmapList({columns: cloneRoadmap})
                    toast({description: data.message})
                } else {
                    toast({variant: "destructive", description: data?.error?.message})
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
            formData.append(`images`, commentFiles[i]);
        }
        formData.append('comment', commentText);
        formData.append('ideaId', selectedIdea?.id);
        formData.append('parentId', '');
        const data = await apiService.createComment(formData)

        if (data.success) {
            setIsSaveComment(false)
            const cloneRoadmap = JSON.parse(JSON.stringify(roadmapList.columns));
            const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap?.id);
            if (roadmapIndex !== -1) {
                const ideaIndex = cloneRoadmap[roadmapIndex].ideas.findIndex((x) => x.id === selectedIdea?.id);
                if (ideaIndex !== -1) {
                    let cloneIdea = { ...cloneRoadmap[roadmapIndex].ideas[ideaIndex] };
                    const cloneComments = cloneIdea.comments ? [...cloneIdea.comments] : [];
                    cloneComments.unshift(data.data);
                    cloneIdea = { ...cloneIdea, comments: cloneComments };
                    cloneRoadmap[roadmapIndex].ideas[ideaIndex] = cloneIdea;
                    setSelectedIdea(cloneIdea);
                    cloneRoadmap[roadmapIndex].cards = [...cloneRoadmap[roadmapIndex].ideas];
                }
            }
            setRoadmapList({columns: cloneRoadmap});
            toast({description: data.message})
            setCommentText('');
            setCommentFiles([])
        } else {
            setIsSaveComment(false)
            toast({variant: "destructive", description: data?.error?.message})
        }
    }

    const onShowSubComment = (index) => {
        const updatedComments = selectedIdea.comments.map((comment, i) => ({
            ...comment,
            showReply: i === index ? !comment.showReply : false,
        }));
        setSelectedIdea({ ...selectedIdea, comments: updatedComments });
        if (updatedComments[index].showReply) {
            setSubCommentTextEditIdx(index);
            setSubCommentText((prev) => ({
                ...prev,
                [index]: "",
            }));
            setSubCommentFiles((prev) => ({
                ...prev,
                [index]: [],
            }));
        } else {
            setSubCommentTextEditIdx(null);
            setSubCommentText((prev) => ({
                ...prev,
                [index]: "",
            }));
            setSubCommentFiles((prev) => ({
                ...prev,
                [index]: [],
            }));
        }
    };

    const onCreateSubComment = async (record, index) => {
        setIsSaveSubComment(true);
        let formData = new FormData();
        for (let i = 0; i < subCommentFiles.length; i++) {
            formData.append(`images`, subCommentFiles[i]);
        }
        formData.append('comment', subCommentText);
        formData.append('ideaId', selectedIdea?.id);
        formData.append('parentId', record.id);
        const data = await apiService.createComment(formData);
        setIsSaveSubComment(false);
        if (data.success) {
            let cloneRoadmap = [...roadmapList.columns];
            const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap?.id);
            if (roadmapIndex !== -1) {
                const ideaIndex = cloneRoadmap[roadmapIndex].ideas.findIndex((x) => x.id === selectedIdea?.id);
                if (ideaIndex !== -1) {
                    let cloneIdeas = [ ...cloneRoadmap[roadmapIndex].ideas ];
                    let cloneIdea = { ...cloneRoadmap[roadmapIndex].ideas[ideaIndex] };
                    const cloneComments = cloneIdea?.comments ? [ ...cloneIdea.comments ] : [];
                    const wasShowReplyOpen = selectedIdea.comments[index]?.showReply;
                    const cloneSubComment = [ ...(cloneComments[index]?.reply || []) ];
                    cloneSubComment.push(data.data);
                    cloneComments[index]["reply"] = cloneSubComment;
                    cloneComments[index]["showReply"] = wasShowReplyOpen;
                    cloneIdea = { ...cloneIdea, comments: cloneComments };
                    cloneIdeas[ideaIndex] = cloneIdea;
                    cloneRoadmap[roadmapIndex] = {
                        ...cloneRoadmap[roadmapIndex],
                        ideas: cloneIdeas,
                        cards: cloneIdeas
                    };
                    setSelectedIdea(cloneIdea);
                    setRoadmapList({ columns: cloneRoadmap });
                }
            }
            setSubCommentText((prev) => ({
                ...prev,
                [index]: "",
            }));
            setSubCommentFiles((prev) => ({
                ...prev,
                [index]: [],
            }));
            toast({ description: data.message });
        } else {
            toast({ variant: "destructive", description: data?.error?.message });
        }
    };

    const handleFeatureImgUpload = async (event) => {
        const file = event.target?.files[0];
        setSelectedIdea({...selectedIdea, coverImage: file})
        let formData = new FormData();
        formData.append("coverImage", file);
        const data = await apiService.updateIdea(formData, selectedIdea?.id)
        if (data.success) {
            let cloneRoadmap = [...roadmapList.columns];
            const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap?.id);
            if (roadmapIndex !== -1) {
                let clone = [...cloneRoadmap[roadmapIndex].ideas];
                const ideaIndex = clone.findIndex((x) => x.id === selectedIdea?.id)
                if (ideaIndex !== -1) {
                    clone[ideaIndex] = data.data
                    cloneRoadmap[roadmapIndex] = {...cloneRoadmap[roadmapIndex], ideas: clone, cards: clone};
                }
            }
            setRoadmapList({columns: cloneRoadmap})
            setIsLoading(false)
            setIsEditIdea(false)
            toast({description: data.message})
        } else {
            setIsLoading(false)
            toast({variant: "destructive", description: data?.error?.message})
        }
    };

    const handleAddCommentImg = (event) => {
        const { files } = event.target;
        if (selectedComment && selectedComment.id) {
            const images = Array.isArray(selectedComment.images) ? selectedComment.images : [];
            const clone = [...images, ...Array.from(files)];
            setSelectedComment({
                ...selectedComment,
                images: clone,
            });
        } else {
            setCommentFiles([...commentFiles, ...files]);
        }
        event.target.value = "";
    };

    const handleSubCommentUploadImg = (event) => {
        const { files } = event.target;
        if (selectedSubComment && selectedSubComment.id && selectedComment && selectedComment.id) {
            const images = Array.isArray(selectedSubComment.images) ? selectedSubComment.images : [];
            const newImages = [...images, ...Array.from(files)];
            const updatedSubComment = {...selectedSubComment, images: newImages,};
            setSelectedSubComment(updatedSubComment);
            const replyIndex = (selectedComment.reply || []).findIndex(
                (reply) => reply.id === selectedSubComment.id
            );
            if (replyIndex !== -1) {
                const updatedReplies = [...selectedComment.reply];
                updatedReplies[replyIndex] = updatedSubComment;
                setSelectedComment({
                    ...selectedComment,
                    reply: updatedReplies,
                });
            }
        } else {
            // setSubCommentFiles([...subCommentFiles, files[0]]);
            setSubCommentFiles((prev) => ({
                ...prev,
                [subCommentTextEditIdx]: [...(prev[subCommentTextEditIdx] || []), ...Array.from(files)],
            }));
        }
        event.target.value = "";
    };

    const onChangeStatus = async (name, value) => {
        setSelectedIdea({...selectedIdea, [name]: value})
        if (name === "removeCoverImage") {
            setSelectedIdea({...selectedIdea, coverImage: ""})
        } else {
            setSelectedIdea({...selectedIdea, [name]: value})
        }
        let formData = new FormData();
        if (name === "roadmapStatusId" && value === null) {
            value = "";
        }
        formData.append(name, value);
        const data = await apiService.updateIdea(formData, selectedIdea?.id)
        if (data.success) {
            let cloneRoadmap = [...roadmapList.columns];
            const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap?.id);
            if (roadmapIndex !== -1) {
                const ideaIndex = cloneRoadmap[roadmapIndex].ideas.findIndex((x) => x.id === selectedIdea?.id);
                let cloneIdeas = [...cloneRoadmap[roadmapIndex].ideas];
                if (name === "pin_to_top") {
                    if (ideaIndex !== -1) {
                        const obj = data.data
                        if (value == 1) {
                            cloneIdeas.splice(ideaIndex, 1)
                            cloneIdeas.unshift(obj)
                        } else {
                            cloneIdeas[ideaIndex] = obj
                        }
                        setSelectedIdea(data.data)
                        cloneRoadmap[roadmapIndex] = {
                            ...cloneRoadmap[roadmapIndex],
                            ideas: cloneIdeas,
                            cards: cloneIdeas
                        }
                    }
                } else if (name === "roadmapStatusId") {
                    const oldIdeaIndex = cloneRoadmap[roadmapIndex].ideas.findIndex((x) => x.id === selectedIdea?.id);
                    const oldRoadmapIndex = roadmapIndex;
                    const newRoadmapIndex = cloneRoadmap.findIndex((x) => x.id == value);
                    if (oldIdeaIndex !== -1) {
                        let cloneOldIdeas = [...cloneRoadmap[oldRoadmapIndex].ideas];
                        cloneOldIdeas.splice(oldIdeaIndex, 1)
                        cloneRoadmap[oldRoadmapIndex] = {
                            ...cloneRoadmap[oldRoadmapIndex],
                            ideas: cloneOldIdeas,
                            cards: cloneOldIdeas
                        }
                    }
                    if (newRoadmapIndex !== -1) {
                        let cloneIdeas = [...cloneRoadmap[newRoadmapIndex].ideas];
                        const obj = data.data
                        cloneIdeas.push(obj)
                        cloneRoadmap[newRoadmapIndex] = {
                            ...cloneRoadmap[newRoadmapIndex],
                            ideas: cloneIdeas,
                            cards: cloneIdeas
                        }
                        setSelectedRoadmap(cloneRoadmap[newRoadmapIndex]);
                        setSelectedIdea(obj)
                    }
                } else {
                    cloneIdeas[ideaIndex] = {...data.data,}
                    cloneRoadmap[roadmapIndex] = {...cloneRoadmap[roadmapIndex], ideas: cloneIdeas, cards: cloneIdeas}
                }

            }
            setRoadmapList({columns: cloneRoadmap});
            setIsLoading(false)
            setIsEditIdea(false)
            toast({description: data.message})
        } else {
            setIsLoading(false)
            toast({variant: "destructive", description: data?.error?.message})
        }
    }

    const onEditComment = (record, index) => {
        setSelectedComment({ ...record, images: record.images || [] });
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

    const onDeleteCommentImage = (index) => {
        const cloneImages = [...selectedComment.images];
        // const isServerImage = typeof cloneImages[index] === "string" && cloneImages[index].startsWith('https://code.quickhunt.app/public/');
        const isServerImage = typeof cloneImages[index] === "string";
        if (isServerImage) {
            const cloneDeletedImages = [...deletedCommentImage];
            cloneDeletedImages.push(
                cloneImages[index]
            );
            cloneImages.splice(index, 1);
            setDeletedCommentImage(cloneDeletedImages);
        } else {
            cloneImages.splice(index, 1);
        }
        setSelectedComment({
            ...selectedComment,
            images: cloneImages,
        });
    }

    const onDeleteSubCommentImage = (index, isOld) => {
        if (isOld) {
            const cloneImages = [...selectedSubComment.images];
            const cloneDeletedImages = [...deletedSubCommentImage];
            cloneDeletedImages.push(cloneImages[index]);
            cloneImages.splice(index, 1);
            setSelectedSubComment({
                ...selectedSubComment,
                images: cloneImages,
            });
            setDeletedSubCommentImage(cloneDeletedImages);
        } else {
            const cloneNewImages = [...selectedSubComment.images];
            cloneNewImages.splice(index, 1);
            setSelectedSubComment({
                ...selectedSubComment,
                images: cloneNewImages,
            });
        }
    };

    const onUpdateComment = async () => {
        setIsSaveUpdateComment(true)
        let formData = new FormData();
        if (selectedComment && selectedComment.images && selectedComment.images.length) {
            for (let i = 0; i < selectedComment.images.length; i++) {
                formData.append(`images`, selectedComment.images[i]);
            }
        }
        for (let i = 0; i < deletedCommentImage.length; i++) {
            formData.append(`removeImages[${i}]`, deletedCommentImage[i]);
        }

        formData.append('comment', selectedComment.comment);
        const data = await apiService.updateComment(selectedComment.id, formData)
        if (data.success) {
            let cloneRoadmap = [...roadmapList.columns];
            const roadmapIndex = cloneRoadmap.findIndex((x) => x.id == selectedRoadmap?.id);
            if (roadmapIndex !== -1) {
                const ideaIndex = cloneRoadmap[roadmapIndex].ideas.findIndex((x) => x.id == selectedIdea?.id);
                if (ideaIndex !== -1) {
                    let cloneIdeas = [cloneRoadmap[roadmapIndex].ideas];
                    let cloneIdea = {...cloneRoadmap[roadmapIndex].ideas[ideaIndex]};
                    const cloneComments = cloneIdea && cloneIdea?.comments ? [...cloneIdea?.comments] : [];
                    cloneComments[selectedCommentIndex] = {...selectedComment, images: data.data.images};
                    cloneIdea = {...cloneIdea, comments: cloneComments};
                    cloneIdeas[ideaIndex] = cloneIdea;
                    setSelectedIdea(cloneIdea);
                    cloneRoadmap[roadmapIndex] = {...cloneRoadmap[roadmapIndex], ideas: cloneIdeas, cards: cloneIdeas}
                }
            }
            setRoadmapList({columns: cloneRoadmap})
            setSelectedCommentIndex(null)
            setSelectedComment(null);
            setIsEditComment(false)
            setDeletedCommentImage([])
            setIsSaveUpdateComment(false)
            toast({description: data.message})
        } else {
            toast({variant: "destructive", description: data?.error?.message})
            setIsSaveUpdateComment(false)
        }
    }

    const onUpdateSubComment = async () => {
        setIsSaveUpdateSubComment(true)
        let formData = new FormData();
        if (selectedSubComment && selectedSubComment.images && selectedSubComment.images.length) {
            for (let i = 0; i < selectedSubComment.images.length; i++) {
                formData.append(`images`, selectedSubComment.images[i]);
            }
        }
        for (let i = 0; i < deletedSubCommentImage.length; i++) {
            formData.append(`removeImages[${i}]`, deletedSubCommentImage[i]);
        }
        formData.append('comment', selectedSubComment.comment);
        const data = await apiService.updateComment(selectedSubComment.id, formData)
        if (data.success) {
            let cloneRoadmap = [...roadmapList.columns];
            const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap.id);
            if (roadmapIndex !== -1) {
                const ideaIndex = cloneRoadmap[roadmapIndex].ideas.findIndex((x) => x.id === selectedIdea.id);
                if (ideaIndex !== -1) {
                    let cloneIdeas = [cloneRoadmap[roadmapIndex].ideas];
                    let cloneIdea = {...cloneRoadmap[roadmapIndex].ideas[ideaIndex]};
                    const cloneComments = cloneIdea && cloneIdea?.comments ? [...cloneIdea?.comments] : [];
                    const cloneSubComment = [...cloneComments[selectedCommentIndex]?.reply] || [];
                    cloneSubComment[selectedSubCommentIndex] = data.data;
                    cloneComments[selectedCommentIndex]["reply"] = cloneSubComment;
                    cloneIdea = {...cloneIdea, comments: cloneComments};
                    cloneIdeas[ideaIndex] = cloneIdea;
                    setSelectedIdea(cloneIdea)
                    cloneRoadmap[roadmapIndex] = {...cloneRoadmap[roadmapIndex], ideas: cloneIdeas, cards: cloneIdeas}
                }
            }
            setRoadmapList({columns: cloneRoadmap})
            setSelectedCommentIndex(null)
            setSelectedComment(null);
            setSelectedSubComment(null);
            setSelectedSubCommentIndex(null);
            setDeletedSubCommentImage([]);
            setIsSaveUpdateSubComment(false)
            toast({description: data.message})
        } else {
            toast({variant: "destructive", description: data?.error?.message})
            setIsSaveUpdateSubComment(false)
        }
    }

    const deleteComment = async (id, indexs) => {
        const data = await apiService.deleteComment(id)
        if (data.success) {
            let cloneRoadmap = [...roadmapList.columns];
            const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap?.id);
            if (roadmapIndex !== -1) {
                const ideaIndex = cloneRoadmap[roadmapIndex].ideas.findIndex((x) => x.id === selectedIdea?.id);
                if (ideaIndex !== -1) {
                    let cloneIdeas = [cloneRoadmap[roadmapIndex].ideas];
                    let cloneIdea = {...cloneRoadmap[roadmapIndex].ideas[ideaIndex]};
                    const cloneComments = cloneIdea && cloneIdea?.comments ? [...cloneIdea?.comments] : [];
                    cloneComments.splice(indexs, 1);
                    cloneIdea = {...cloneIdea, comments: cloneComments};
                    cloneIdeas[ideaIndex] = cloneIdea;
                    setSelectedIdea(cloneIdea)
                    cloneRoadmap[roadmapIndex] = {...cloneRoadmap[roadmapIndex], ideas: cloneIdeas, cards: cloneIdeas}
                }
            }
            setRoadmapList({columns: cloneRoadmap});
            toast({description: data.message})
        } else {
            toast({variant: "destructive", description: data?.error?.message})
        }
    }

    const deleteSubComment = async (id, record, index, subIndex) => {
        const data = await apiService.deleteComment(id)
        if (data.success) {
            let cloneRoadmap = [...roadmapList.columns];
            const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap?.id);
            if (roadmapIndex !== -1) {
                const ideaIndex = cloneRoadmap[roadmapIndex].ideas.findIndex((x) => x.id === selectedIdea?.id);
                if (ideaIndex !== -1) {
                    let cloneIdeas = [cloneRoadmap[roadmapIndex].ideas];
                    let cloneIdea = {...cloneRoadmap[roadmapIndex].ideas[ideaIndex]};
                    const cloneComments = cloneIdea && cloneIdea?.comments ? [...cloneIdea?.comments] : [];
                    const cloneSubComment = [...cloneComments[index]?.reply] || [];
                    cloneSubComment.splice(subIndex, 1);
                    cloneComments[index]["reply"] = cloneSubComment;
                    cloneIdea = {...cloneIdea, comments: cloneComments};
                    cloneIdeas[ideaIndex] = cloneIdea;
                    setSelectedIdea(cloneIdea);
                    cloneRoadmap[roadmapIndex] = {...cloneRoadmap[roadmapIndex], ideas: cloneIdeas, cards: cloneIdeas}
                }
            }
            setRoadmapList({columns: cloneRoadmap})
            toast({description: data.message})
        } else {
            toast({variant: "destructive", description: data?.error?.message})
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
            case "boardId":
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
        const { name, value } = event.target;
        const trimmedValue = name === "title" || name === "description" ? value.trimStart() : value;
        setSelectedIdea(prev => ({ ...prev, [name]: trimmedValue }));
        setFormError(prev => ({
            ...prev,
            [name]: formValidate(name, trimmedValue)
        }));
        if (name === "description" && imageSizeError) {
            setImageSizeError('');
        }
    }

    const handleUpdate = (event) => {
        const {value} = event.target;
        setSelectedIdea(selectedIdea => ({...selectedIdea, description: value}));
    };

    const onUpdateIdea = async () => {
        const trimmedTitle = selectedIdea.title ? selectedIdea.title.trim() : "";
        const trimmedDescription = selectedIdea.description ? selectedIdea.description.trim() : "";
        const updatedIdea = {
            ...selectedIdea,
            title: trimmedTitle,
            description: trimmedDescription,
        };
        setSelectedIdea(updatedIdea);
        let validationErrors = {};
        Object.keys(selectedIdea).forEach(name => {
            const error = formValidate(name, selectedIdea[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (imageSizeError) {
            validationErrors.imageSizeError = imageSizeError;
        }
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setIsLoadingCreateIdea(true)
        let formData = new FormData();
        let topics = [];

        (selectedIdea?.topic || []).map((x) => {
            topics.push(x.id)
        })
        formData.append('title', selectedIdea?.title);
        formData.append('boardId', selectedIdea.boardId);
        formData.append('slugUrl', selectedIdea?.title ? selectedIdea?.title.replace(/ /g, "-").replace(/\?/g, "-") : "");
        formData.append('description', selectedIdea.description ? selectedIdea.description : "");
        topics.forEach(id => {
            formData.append('topicId[]', id);
        });
        const data = await apiService.updateIdea(formData, selectedIdea?.id)
        if (data.success) {
            let cloneRoadmap = [...roadmapList.columns];
            const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedIdea?.roadmapStatusId);
            if (roadmapIndex !== -1) {
                const ideaIndex = cloneRoadmap[roadmapIndex].ideas.findIndex((x) => x.id === selectedIdea?.id);
                if (ideaIndex !== -1) {
                    cloneRoadmap[roadmapIndex].ideas[ideaIndex] = { ...data.data };
                    cloneRoadmap[roadmapIndex].cards = [...cloneRoadmap[roadmapIndex].ideas];
                }
            }
            setRoadmapList({ columns: cloneRoadmap });
            setSelectedIdea({...data.data})
            setOriginalIdea({...data.data})
            setIsEditIdea(false)
            setIsLoadingCreateIdea(false)
            toast({description: data.message})
        } else {
            setIsLoadingCreateIdea(false)
            toast({variant: "destructive", description: data?.error?.message})
        }
    }

    const openEdit = () => {setIsEditIdea(true)}

    const handleOnUpdateCancel = () => {
        setFormError(initialStateError);
        setSelectedIdea({...originalIdea});
        setIsEditIdea(false);
    }

    const onDeleteImageComment = (index) => {
        const clone = [...commentFiles];
        clone.splice(index, 1)
        setCommentFiles(clone)
    }

    const onDeleteSubCommentImageOld = (index) => {
        setSubCommentFiles((prev) => {
            const files = [...(prev[subCommentTextEditIdx] || [])];
            files.splice(index, 1);
            return {
                ...prev,
                [subCommentTextEditIdx]: files,
            };
        });
    }

    const onCloseBoth = () => {
        onClose()
        setIsEditIdea(false)
        setCommentText("")
        setSubCommentText("")
        setSelectedComment(null);
        setSelectedCommentIndex(null)
        setSelectedSubComment(null)
        setSelectedSubCommentIndex(null)
    }

    const handleSubCommentTextChange = (e, index) => {
        const newSubCommentText = [...subCommentText];
        newSubCommentText[index] = e.target.value;
        setSubCommentText(newSubCommentText);
    };

    return (
        <Fragment>
            <Sheet open={isOpen} onOpenChange={isOpen ? onCloseBoth : onOpen}>
                <SheetContent className={"lg:max-w-[1101px] md:max-w-[720px] sm:max-w-full p-0"}>
                    <SheetHeader className={"px-4 py-3 md:py-5 lg:px-8 lg:py-[20px] border-b"}>
                        <DialogTitle>
                            <X onClick={onCloseBoth} className={"cursor-pointer"}/>
                        </DialogTitle>
                    </SheetHeader>
                    <div className={`grid lg:grid-cols-12 md:grid-cols-1 overflow-auto ${selectedIdea?.comments?.length > 2 ? "h-[calc(100vh_-_100px)]" : "h-[calc(100vh_-_50px)]"} sm:h-[calc(100vh_-_65px)]`}>
                        <div
                            className={`col-span-4 lg:block hidden ${theme === "dark" ? "" : "bg-muted"} border-r lg:overflow-auto idea-sheet-height`}>
                            <div className={"border-b py-4 pl-8 pr-6 flex flex-col gap-3"}>
                                <div className={"flex flex-col gap-1"}>
                                    <h3 className={"text-sm font-medium"}>Status</h3>
                                    <p className={"text-muted-foreground text-xs font-normal"}>Apply a status to Manage this idea on roadmap.</p>
                                </div>
                                <div className={"flex flex-col "}>
                                    <RadioGroup
                                        onValueChange={(value) => onChangeStatus('roadmapStatusId', value)}
                                        value={selectedIdea?.roadmapStatusId}
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
                                <div className="py-4 pl-8 pr-6 w-full space-y-1.5">
                                    <Label htmlFor="picture" className={"font-medium capitalize"}>Featured image</Label>
                                    <div className="w-[282px] h-[128px] flex gap-1">
                                        <ImageUploader
                                            image={selectedIdea?.coverImage}
                                            onDelete={() => onChangeStatus('removeCoverImage', selectedIdea && selectedIdea?.coverImage && selectedIdea?.coverImage?.name ? "" : [selectedIdea?.coverImage])}
                                            onUpload={handleFeatureImgUpload}
                                            altText="Cover Image"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"col-span-8 lg:overflow-auto"}>

                            {
                                isEditIdea ?
                                    <div className={"pb-100px"}>
                                        <div
                                            className={"px-4 py-3 lg:py-6 lg:px-8 flex flex-col gap-4 ld:gap-6 border-b"}>
                                            <div className="space-y-2">
                                                <Label htmlFor="text" className={"font-medium"}>Title</Label>
                                                <Input type="text" id="text" placeholder="" value={selectedIdea?.title}
                                                       name={"title"} onChange={onChangeText}/>
                                                {
                                                    formError.title &&
                                                    <span className="text-red-500 text-sm">{formError.title}</span>
                                                }
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="message" className={"font-medium"}>Description</Label>
                                                <ReactQuillEditor value={selectedIdea?.description} name={"description"}
                                                                  onChange={handleUpdate} setImageSizeError={setImageSizeError}/>
                                                {(formError.imageSizeError || imageSizeError) && (
                                                    <span className="text-red-500 text-sm">{formError.imageSizeError || imageSizeError}</span>
                                                )}
                                            </div>
                                            <div className={"space-y-2"}>
                                                <Label className={"font-medium"}>Choose Board for this Idea</Label>
                                                <Select
                                                    onValueChange={(value) => onChangeText({
                                                        target: {
                                                            name: "boardId",
                                                            value
                                                        }
                                                    })}
                                                    value={selectedIdea.boardId}>
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
                                                {formError.boardId &&
                                                <span className="text-red-500 text-sm">{formError.boardId}</span>}
                                            </div>
                                        </div>
                                        <div className={"px-4 py-3 lg:py-6 lg:px-8 border-b space-y-2"}>
                                            <Label className={"font-medium"}>Choose Topics for this Idea (optional)</Label>
                                            <Select onValueChange={handleChangeTopic}
                                                    value={selectedIdea?.topic.map(x => x.id)}>
                                                <SelectTrigger>
                                                    <SelectValue className={"text-muted-foreground text-sm"}
                                                                 placeholder="Assign to">
                                                        <div className={"flex gap-[2px]"}>
                                                            {(selectedIdea?.topic || []).map((x, index) => {
                                                                const findObj = (topicLists || []).find((y) => y.id === x?.id);
                                                                return (
                                                                    <div key={index}
                                                                         className={`text-xs flex gap-[2px] ${theme === "dark" ? "text-card" : ""} bg-slate-300 items-center rounded py-0 px-2`}>
                                                                        <span className={"max-w-[85px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}>
                                                                    {findObj?.title}
                                                                </span>
                                                                    </div>
                                                                );
                                                            })}
                                                            {(selectedIdea?.topic || []).length > 2}
                                                        </div>
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {
                                                            (topicLists || []).map((x, i) => {
                                                                return (
                                                                    <SelectItem className={"px-2"} key={i} value={x.id}>
                                                                        <div className={"flex gap-2"}>
                                                                            <div onClick={() => handleChangeTopic(x.id)}
                                                                                 className="checkbox-icon">
                                                                                {(selectedIdea?.topic.map((x) => x.id) || []).includes(x.id) ?
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
                                        <SaveCancelButton
                                            onClickSave={onUpdateIdea}
                                            load={isLoadingCreateIdea}
                                            onClickCancel={handleOnUpdateCancel}
                                        />
                                    </div>
                                    :
                                    <Fragment>
                                        <div className={"px-4 py-3 lg:py-6 lg:px-8"}>
                                            <div className={"flex flex-col gap-6"}>
                                                <div className={"flex justify-between items-center gap-4 md:flex-nowrap flex-wrap"}>
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
                                                            selectedIdea && selectedIdea?.voteLists && selectedIdea?.voteLists.length ?
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <Button variant="ghost hover-none"
                                                                                className={"rounded-full p-0 h-[24px]"}>
                                                                            {
                                                                                (selectedIdea.voteLists.slice(0, 1) || []).map((x, i) => {
                                                                                    return (
                                                                                        <div className={"flex"}
                                                                                             key={i}>
                                                                                            <div
                                                                                                className={"relative"}>
                                                                                                <div
                                                                                                    className={"update-idea text-sm rounded-full text-center"}>
                                                                                                    <UserAvatar
                                                                                                        userPhoto={x.profileImage}
                                                                                                        userName={x.name ? x.name : x?.username}
                                                                                                        className="w-[20px] h-[20px]"
                                                                                                        initialStyle={"text-sm"}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            {
                                                                                                (selectedIdea?.voteLists.length > 1) &&
                                                                                                <div
                                                                                                    className={"update-idea text-sm rounded-full border text-center ml-[-5px]"}>
                                                                                                    <Avatar><AvatarFallback>+{selectedIdea?.voteLists.length - 1}</AvatarFallback></Avatar>
                                                                                                </div>
                                                                                            }
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </Button>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="p-0" align={"start"}>
                                                                        <div>
                                                                            <div className="py-3 px-4">
                                                                                <h4 className="font-normal leading-none text-sm">{`Voters (${selectedIdea?.voteLists.length})`}</h4>
                                                                            </div>
                                                                            <div
                                                                                className="border-t px-4 py-3 space-y-2">
                                                                                {
                                                                                    (selectedIdea?.voteLists || []).map((x, i) => {
                                                                                        return (
                                                                                            <div className={"flex gap-2"} key={i}>
                                                                                                <div
                                                                                                    className={"update-idea text-sm rounded-full text-center"}>
                                                                                                    <UserAvatar
                                                                                                        userPhoto={x.profileImage}
                                                                                                        userName={x?.name ? x?.name : x?.username}
                                                                                                        className="w-[20px] h-[20px]"
                                                                                                        initialStyle={"text-sm"}
                                                                                                    />
                                                                                                </div>
                                                                                                <h4 className={"text-sm font-normal"}>{x?.name ? x?.name : x?.username}</h4>
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
                                                    <div className={"flex gap-2"}>
                                                        {
                                                            selectedIdea?.isEdit === 1 ?
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={"w-[30px] h-[30px] p-1"}
                                                                    onClick={openEdit}
                                                                >
                                                                    <Pencil size={16}/>
                                                                </Button> : ""
                                                        }
                                                    </div>
                                                </div>
                                                <div className={"flex flex-col gap-4"}>
                                                    <div className={"flex items-center gap-2"}>
                                                        <h2 className={"text-xl font-normal"}>{selectedIdea?.title}</h2>
                                                    </div>
                                                    <div
                                                        className={`description-container text-sm ${theme === "dark" ? "" : "text-muted-foreground" }`}
                                                        dangerouslySetInnerHTML={{ __html: selectedIdea.description }}
                                                    />
                                                </div>
                                                {
                                                    selectedIdea && selectedIdea?.images && selectedIdea?.images.length > 0 ?
                                                        <div className={"flex gap-2 flex-wrap"}>
                                                            {
                                                                (selectedIdea?.images || []).map((x, i) => {
                                                                        return (
                                                                            <Fragment>
                                                                                {x && (
                                                                                    <div
                                                                                        className="w-[50px] h-[50px] md:w-[100px] md:h-[100px] border p-[3px] relative"
                                                                                        onClick={() => handleImageOpen(x.name ? URL.createObjectURL(x) : x)}
                                                                                    >
                                                                                        <img
                                                                                            className="upload-img cursor-pointer"
                                                                                            src={x.name ? URL.createObjectURL(x) : `${DO_SPACES_ENDPOINT}/${x}`}
                                                                                            alt=""
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                            </Fragment>
                                                                        )
                                                                    }
                                                                )}
                                                        </div> : ""
                                                }
                                                <div className={"flex items-center"}>
                                                    <div className={"flex items-center gap-4 md:flex-nowrap flex-wrap"}>
                                                        <div className={"flex items-center gap-2"}>
                                                            <UserAvatar
                                                                userPhoto={selectedIdea?.profileImage}
                                                                userName={selectedIdea?.name}
                                                                initialStyle={"text-sm"}
                                                            />
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
                                                                                {moment(selectedIdea?.createdAt).format('D MMM')}
                                                                            </p>
                                                                        </Fragment>
                                                                }

                                                            </div>
                                                        </div>
                                                        {
                                                            isLoading ? <Skeleton className={"w-[224px] h-[24px] px-3 py-1"} /> :
                                                                <Select
                                                                    onValueChange={(value) => onChangeStatus('roadmapStatusId', value)}
                                                                    value={selectedIdea?.roadmapStatusId}
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
                                                                                                <Circle fill={x.colorCode}
                                                                                                        stroke={x.colorCode}
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

                                                <div className="w-full space-y-1.5 lg:hidden">
                                                    <Label htmlFor="picture" className={"font-medium capitalize"}>Featured image</Label>
                                                    <div className="w-[282px] h-[128px] flex gap-1">

                                                        <ImageUploader
                                                            image={selectedIdea?.coverImage}
                                                            onDelete={() => onChangeStatus('removeCoverImage', selectedIdea && selectedIdea?.coverImage && selectedIdea?.coverImage?.name ? "" : [selectedIdea?.coverImage])}
                                                            onUpload={handleFeatureImgUpload}
                                                            altText="Cover Image"

                                                        />
                                                    </div>
                                                </div>

                                                {
                                                    isLoading ?
                                                        <div className={"flex flex-col gap-2"}>
                                                            <div className="w-full flex flex-col gap-2">
                                                                <Skeleton className={"w-[100px] h-[20px]"}/>
                                                                <Skeleton className={"w-full h-[80px]"}/>
                                                            </div>
                                                            <div className={"flex justify-end gap-2 items-center"}>
                                                                <Skeleton className={"w-[36px] h-[36px]"}/>
                                                                <Skeleton className={"w-[128px] h-[36px]"}/>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className={"flex flex-col gap-2"}>
                                                            <div className="w-full flex flex-col gap-2">
                                                                <Label htmlFor="message"
                                                                       className={"font-medium capitalize"}>Add comment</Label>
                                                                <>
                                                                    <Textarea
                                                                        placeholder="Start writing..."
                                                                        id="message"
                                                                        value={commentText}
                                                                        onChange={(e) => setCommentText(e.target.value)}
                                                                    />
                                                                    <ImageGallery
                                                                        commentFiles={commentFiles}
                                                                        onDeleteImageComment={onDeleteImageComment}
                                                                    />
                                                                </>
                                                            </div>
                                                            <div className={"flex justify-end gap-1"}>
                                                                <div className={"flex gap-2 items-center"}>
                                                                    <div
                                                                        className="p-2 max-w-sm relative w-[36px] h-[36px]">
                                                                        <input
                                                                            id="commentFile"
                                                                            type="file"
                                                                            className="hidden"
                                                                            onChange={handleAddCommentImg}
                                                                            accept={"image/*"}
                                                                        />
                                                                        <label htmlFor="commentFile"
                                                                               className="absolute inset-0 flex items-center justify-center bg-white border border-primary rounded cursor-pointer"
                                                                        >
                                                                            <Paperclip size={16}
                                                                                       className={"stroke-primary"}/>
                                                                        </label>

                                                                    </div>
                                                                    <Button
                                                                        className={"w-[128px] h-[36px] text-sm font-medium"}
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
                                        <div>
                                            <Tabs defaultValue="comment" className="">
                                                <div className={"px-4 lg:px-8"}>
                                                    <TabsList
                                                        className="bg-transparent border-b-2 border-b-primary rounded-none">
                                                        <TabsTrigger value="comment" className={"font-medium"}>Comment</TabsTrigger>
                                                    </TabsList>
                                                </div>

                                                {
                                                    selectedIdea?.comments?.length > 0 &&
                                                    <TabsContent value="comment"
                                                                 className={`${theme === "dark" ? "" : "bg-muted"} pb-5`}>
                                                        {
                                                            selectedIdea && selectedIdea?.comments && selectedIdea?.comments.length > 0 ?
                                                                (selectedIdea?.comments || []).map((x, i) => {
                                                                    return (
                                                                        <Fragment>
                                                                            <div className={"flex gap-2 p-4 lg:px-8 border-b last:border-b-0"}>
                                                                                <div>
                                                                                    <UserAvatar
                                                                                        userPhoto={x?.profileImage}
                                                                                        userName={x?.name && x.name !== "null" ? x.name : x?.userName}
                                                                                        initialStyle={"text-sm"}
                                                                                    />
                                                                                </div>
                                                                                <div
                                                                                    className={"w-full flex flex-col space-y-3"}>
                                                                                    <div
                                                                                        className={"flex gap-1 flex-wrap justify-between"}>
                                                                                        <div className={"flex items-start"}>
                                                                                            <h4 className={"text-sm font-normal"}>{x?.name && x.name !== "null" ? x.name : x?.userName}</h4>
                                                                                            <p className={"text-sm font-normal flex items-center text-muted-foreground"}>
                                                                                                <Dot size={20}
                                                                                                     className={"fill-text-card-foreground stroke-text-card-foreground"}/>
                                                                                                {moment.utc(x.createdAt).local().startOf('seconds').fromNow()}
                                                                                            </p>
                                                                                        </div>
                                                                                        <div className={"flex gap-2"}>
                                                                                            {
                                                                                                selectedCommentIndex === i && isEditComment ? "" :
                                                                                                    x.isEdit === 1 ?
                                                                                                        <><Button
                                                                                                            variant={"outline"}
                                                                                                            className={"w-[30px] h-[30px] p-1"}
                                                                                                            onClick={() => onEditComment(x, i)}
                                                                                                        >
                                                                                                            <Pencil size={16}/>
                                                                                                        </Button>
                                                                                                            <Button
                                                                                                                variant={"outline"}
                                                                                                                className={"w-[30px] h-[30px] p-1"}
                                                                                                                onClick={() => deleteComment(x.id, i)}
                                                                                                            >
                                                                                                                <Trash2 size={16}/>
                                                                                                            </Button></> : ""
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                    <div>
                                                                                        <Fragment>
                                                                                            {
                                                                                                selectedCommentIndex === i && isEditComment ?
                                                                                                    <CommentEditor
                                                                                                        isEditMode={selectedCommentIndex === i && isEditComment}
                                                                                                        comment={selectedComment?.comment}
                                                                                                        images={selectedComment?.images}
                                                                                                        onUpdateComment={onUpdateComment}
                                                                                                        onCancelComment={onCancelComment}
                                                                                                        onDeleteImage={(i) => onDeleteCommentImage(i)}
                                                                                                        onImageUpload={handleAddCommentImg}
                                                                                                        onCommentChange={(e) => setSelectedComment({...selectedComment, comment: e.target.value})}
                                                                                                        isSaving={isSaveUpdateComment}
                                                                                                        idImageUpload={"selectedCommentImg"}
                                                                                                    /> :
                                                                                                    <CommentEditor
                                                                                                        comment={x.comment}
                                                                                                        images={x.images}
                                                                                                        onImageClick={(img) => handleImageOpen(img)}
                                                                                                    />
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
                                                                                        x.showReply ?
                                                                                            <div
                                                                                                className={"space-y-3"}>
                                                                                                {
                                                                                                    (x.reply || []).map((y, j) => {
                                                                                                        return (
                                                                                                            <Fragment>
                                                                                                                <div
                                                                                                                    className={"flex gap-2"}>
                                                                                                                    <div>
                                                                                                                        <div
                                                                                                                            className={"update-idea text-sm rounded-full text-center"}>
                                                                                                                            <UserAvatar userPhoto={y.profileImage} userName={y?.name && y.name !== "null" ? y.name : y?.userName} initialStyle={"text-sm"}/>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div
                                                                                                                        className={"w-full space-y-2"}>
                                                                                                                        <div className={"flex justify-between"}>
                                                                                                                            <div className={"flex items-start"}>
                                                                                                                                <h4 className={"text-sm font-normal"}>{y?.name && y.name !== "null" ? y.name : y?.userName}</h4>
                                                                                                                                <p className={"text-sm font-normal flex items-center text-muted-foreground"}>
                                                                                                                                    <Dot
                                                                                                                                        size={20}
                                                                                                                                        className={"fill-text-card-foreground stroke-text-card-foreground"}/>
                                                                                                                                    {moment.utc(y.createdAt).local().startOf('seconds').fromNow()}
                                                                                                                                </p>
                                                                                                                            </div>
                                                                                                                            {
                                                                                                                                selectedCommentIndex === i && selectedSubCommentIndex === j ? "" :
                                                                                                                                    y.isEdit === 1 ?
                                                                                                                                        <div
                                                                                                                                            className="flex gap-2">
                                                                                                                                            <Button
                                                                                                                                                variant={"outline"}
                                                                                                                                                className={"w-[30px] h-[30px] p-1"}
                                                                                                                                                onClick={() => onEditSubComment(x, y, i, j)}>
                                                                                                                                                <Pencil size={16}/>
                                                                                                                                            </Button>
                                                                                                                                            <Button
                                                                                                                                                variant={"outline"}
                                                                                                                                                className={"w-[30px] h-[30px] p-1"}
                                                                                                                                                onClick={() => deleteSubComment(y.id, x, i, j)}>
                                                                                                                                                <Trash2 size={16}/>
                                                                                                                                            </Button>
                                                                                                                                        </div> : ''
                                                                                                                            }
                                                                                                                        </div>
                                                                                                                        {
                                                                                                                            selectedCommentIndex === i && selectedSubCommentIndex === j ?
                                                                                                                                <CommentEditor
                                                                                                                                    isEditMode={selectedCommentIndex === i && selectedSubCommentIndex === j}
                                                                                                                                    comment={selectedSubComment?.comment}
                                                                                                                                    images={selectedSubComment?.images}
                                                                                                                                    onUpdateComment={onUpdateSubComment}
                                                                                                                                    onCancelComment={onCancelSubComment}
                                                                                                                                    onDeleteImage={(i) => onDeleteSubCommentImage(i, true)}
                                                                                                                                    onImageUpload={handleSubCommentUploadImg}
                                                                                                                                    onCommentChange={(e) => onChangeTextSubComment(e)}
                                                                                                                                    isSaving={isSaveUpdateSubComment}
                                                                                                                                    idImageUpload={"commentFileInput"}
                                                                                                                                /> :
                                                                                                                                <CommentEditor
                                                                                                                                    comment={y.comment}
                                                                                                                                    images={y.images}
                                                                                                                                    onImageClick={(img) => handleImageOpen(img)}
                                                                                                                                />
                                                                                                                        }
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </Fragment>
                                                                                                        )
                                                                                                    })
                                                                                                }
                                                                                                <div
                                                                                                    className={"space-y-2"}>
                                                                                                    <Textarea
                                                                                                        value={subCommentText[i] || ""}
                                                                                                        onChange={(e) => handleSubCommentTextChange(e, i)}/>
                                                                                                    {
                                                                                                        subCommentFiles[i] && subCommentFiles[i].length ?
                                                                                                            <div
                                                                                                                className={"flex gap-2 flex-wrap"}>
                                                                                                                {
                                                                                                                    (subCommentFiles || []).map((z, i) => {
                                                                                                                        return (
                                                                                                                            <Fragment key={i}>
                                                                                                                                {z && (
                                                                                                                                    <div className="w-[50px] h-[50px] md:w-[100px] md:h-[100px] relative border p-[3px]">
                                                                                                                                        <img
                                                                                                                                            className="upload-img"
                                                                                                                                            src={z.name ? URL.createObjectURL(z) : `${DO_SPACES_ENDPOINT}/${z}`}
                                                                                                                                            alt={z.name || ""}
                                                                                                                                        />
                                                                                                                                        <CircleX
                                                                                                                                            size={20}
                                                                                                                                            className="stroke-gray-500 dark:stroke-white cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10"
                                                                                                                                            onClick={() => onDeleteSubCommentImageOld(i, false)}
                                                                                                                                        />
                                                                                                                                    </div>
                                                                                                                                )}
                                                                                                                            </Fragment>
                                                                                                                        )
                                                                                                                    })
                                                                                                                }
                                                                                                            </div> : ""
                                                                                                    }
                                                                                                    {
                                                                                                        subCommentTextEditIdx === i &&
                                                                                                        <div
                                                                                                            className={"flex gap-2"}>
                                                                                                            <Button
                                                                                                                className={`w-[86px] h-[30px] text-sm font-medium`}
                                                                                                                disabled={(!subCommentText[i] || subCommentText[i].trim() === "")}
                                                                                                                onClick={() => onCreateSubComment(x, i)}
                                                                                                            >
                                                                                                                {
                                                                                                                    isSaveSubComment && subCommentTextEditIdx === i ?
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
                                                                                                                    accept={"image/*"}
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
                                                                                                    }
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
                </SheetContent>
            </Sheet>
        </Fragment>
    );
};

export default UpdateRoadMapIdea;