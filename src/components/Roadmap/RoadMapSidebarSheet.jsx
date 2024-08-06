import React, {Fragment, useState, useEffect} from 'react';
import {Sheet, SheetContent, SheetHeader, SheetOverlay} from "../ui/sheet";
import {Button} from "../ui/button";
import {ArrowBigUp, Check, Circle, CircleX, Dot, Loader2, MessageCircleMore, Paperclip, Pencil, Pin, Trash2, X} from "lucide-react";
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
import ReadMoreText from "../Comman/ReadMoreText";
import moment from "moment";
import ReactQuillEditor from "../Comman/ReactQuillEditor";

const initialStateError = {
    title: "",
    description: "",
    board: "",
}

const RoadMapSidebarSheet = ({
                                 isOpen,
                                 onOpen,
                                 onClose,
                                 selectedIdea,
                                 setSelectedIdea,
                                 setSelectedRoadmap,
                                 selectedRoadmap,
                                 roadmapList,
                                 setRoadmapList,
                             }) => {
    const {theme} = useTheme()
    let apiSerVice = new ApiService();
    const {toast} = useToast()

    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCreateIdea, setIsLoadingCreateIdea] = useState(false);
    const [isLoadingSidebar, setIsLoadingSidebar] = useState('');
    const [topicLists, setTopicLists] = useState([]);
    const [description, setDescription] = useState("");
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
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteRecord, setDeleteRecord] = useState(null);

    useEffect(() => {
        setTopicLists(allStatusAndTypes.topics)
        setDescription(selectedIdea?.description)
        setRoadmapStatus(allStatusAndTypes.roadmap_status)
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
        if (selectedIdea?.is_edit !== 1) {
            if (selectedIdea?.user_vote === type) {

            } else {
                const payload = {
                    feature_idea_id: selectedIdea?.id,
                    type: type
                }

                const data = await apiSerVice.giveVote(payload);
                if (data.status === 200) {
                    let cloneRoadmap = [...roadmapList.columns];
                    const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap.id);
                    if(roadmapIndex !== -1){
                        const clone = [...cloneRoadmap[roadmapIndex].ideas];
                        const index = clone.findIndex((x) => x.id === selectedIdea?.id)
                        if (index !== -1) {
                            let newVoteCount = clone[index].vote;
                            newVoteCount = type === 1 ? newVoteCount + 1 : newVoteCount >= 1 ? newVoteCount - 1 : 0;
                            clone[index].vote = newVoteCount;
                            clone[index].user_vote = type;
                            let vote_list = [...clone[index].vote_list];
                            if (type === 1) {
                                vote_list.push(data.data)
                                clone[index].vote_list = vote_list;
                            } else {
                                let voteIndex = vote_list.findIndex((x) => x.name === data.data.name);
                                if (voteIndex !== -1) {
                                    vote_list.splice(voteIndex, 1)
                                    clone[index].vote_list = vote_list;
                                }
                            }
                            cloneRoadmap[roadmapIndex] = {...cloneRoadmap[roadmapIndex], ideas: clone, cards: clone};

                        }
                    }
                    setRoadmapList({columns: cloneRoadmap})

                    toast({description: data.message})
                } else {
                    toast({variant: "destructive", description: data.error})
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
        formData.append('feature_idea_id', selectedIdea?.id);
        formData.append('reply_id', '');
        const data = await apiSerVice.createComment(formData)

        if (data.status === 200) {
            setIsSaveComment(false)
            let cloneRoadmap = [...roadmapList.columns];
            const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap?.id);
            if(roadmapIndex !== -1){
                const ideaIndex = cloneRoadmap[roadmapIndex].ideas.findIndex((x) => x.id === selectedIdea?.id);
                if(ideaIndex !== -1){
                    let cloneIdeas = [cloneRoadmap[roadmapIndex].ideas];
                    let cloneIdea = {...cloneRoadmap[roadmapIndex].ideas[ideaIndex]};
                    const cloneComments = cloneIdea && cloneIdea?.comments ?[...cloneIdea?.comments] :[];
                    cloneComments.push(data.data);
                    cloneIdea = {...cloneIdea,comments: cloneComments};
                    cloneIdeas[ideaIndex] = cloneIdea;
                    setSelectedIdea(cloneIdea);
                     cloneRoadmap[roadmapIndex] = {...cloneRoadmap[roadmapIndex], ideas:cloneIdeas, cards: cloneIdeas}
                }
            }
            setRoadmapList({columns: cloneRoadmap});
            toast({description: data.message})
            setCommentText('');
            setCommentFiles([])
        } else {
            setIsSaveComment(false)
            toast({variant: "destructive", description: data.error})
        }
    }

    const onShowSubComment = (index) => {
        const clone = [...selectedIdea?.comments];
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
        formData.append('feature_idea_id', selectedIdea?.id);
        formData.append('reply_id', record.id);
        const data = await apiSerVice.createComment(formData)
        if (data.status === 200) {

            let cloneRoadmap = [...roadmapList.columns];
            const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap?.id);
            if(roadmapIndex !== -1){
                const ideaIndex = cloneRoadmap[roadmapIndex].ideas.findIndex((x) => x.id === selectedIdea?.id);

                if(ideaIndex !== -1){
                    let cloneIdeas = [cloneRoadmap[roadmapIndex].ideas];
                    let cloneIdea = {...cloneRoadmap[roadmapIndex].ideas[ideaIndex]};
                    const cloneComments = cloneIdea && cloneIdea?.comments ? [...cloneIdea?.comments] : [];
                    const cloneSubComment = [...cloneComments[index]?.reply] || [];
                    cloneSubComment.push(data.data)
                    cloneComments[index]["reply"] = cloneSubComment;
                    cloneIdea = {...cloneIdea,comments: cloneComments};
                    cloneIdeas[ideaIndex] = cloneIdea;
                    setSelectedIdea(cloneIdea)
                    cloneRoadmap[roadmapIndex] = {...cloneRoadmap[roadmapIndex], ideas: cloneIdeas, cards: cloneIdeas}
                }
            }
            setRoadmapList({columns: cloneRoadmap});
            setSubCommentText('');
            setSubCommentFiles([])
            setIsSaveSubComment(false)
            toast({description: data.message})
        } else {
            setIsSaveSubComment(false)
            toast({variant: "destructive", description: data.error})
        }
    }

    const handleFeatureImgUpload = async (event) => {
        const file = event.target?.files[0];
        setSelectedIdea({...selectedIdea, cover_image: file})
        let formData = new FormData();
        formData.append("cover_image", file);
        const data = await apiSerVice.updateIdea(formData, selectedIdea?.id)
        if (data.status === 200) {
            let cloneRoadmap = [...roadmapList.columns];
            const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap?.id);
            if(roadmapIndex !== -1) {
                let clone = [...cloneRoadmap[roadmapIndex].ideas];
                const ideaIndex = clone.findIndex((x) => x.id === selectedIdea?.id)
                clone[ideaIndex] = data.data
                cloneRoadmap[roadmapIndex] = {...cloneRoadmap[roadmapIndex], ideas: clone, cards: clone};
            }
            setRoadmapList({columns: cloneRoadmap})
            setIsLoading(false)
            setIsEditIdea(false)
            toast({description: data.message})
        } else {
            setIsLoading(false)
            toast({variant: "destructive", description: data.error})
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
        setIsLoadingSidebar(name);
        setSelectedIdea({...selectedIdea, [name]: value})
        if(name === "delete_cover_image"){
            setSelectedIdea({...selectedIdea, cover_image: ""})
        } else {
            setSelectedIdea({...selectedIdea, [name]: value})
        }
        let formData = new FormData();
        formData.append(name, value);
        const data = await apiSerVice.updateIdea(formData, selectedIdea?.id)
        if (data.status === 200) {
            let cloneRoadmap = [...roadmapList.columns];
            const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap?.id);
            if(roadmapIndex !== -1){
                const ideaIndex = cloneRoadmap[roadmapIndex].ideas.findIndex((x) => x.id === selectedIdea?.id);
                let cloneIdeas = [...cloneRoadmap[roadmapIndex].ideas];
                if(name === "pin_to_top"){
                    if(ideaIndex !== -1){
                        const obj = data.data
                        if(value == 1){
                            cloneIdeas.splice(ideaIndex, 1)
                            cloneIdeas.unshift(obj)
                        } else {
                            cloneIdeas[ideaIndex] =  obj
                        }
                        setSelectedIdea(data.data)
                        cloneRoadmap[roadmapIndex] = {...cloneRoadmap[roadmapIndex], ideas: cloneIdeas, cards: cloneIdeas}
                    }
                } else if(name === "roadmap_id"){
                    const oldIdeaIndex =  cloneRoadmap[roadmapIndex].ideas.findIndex((x) => x.id === selectedIdea?.id);
                    const oldRoadmapIndex =  roadmapIndex;
                    const newRoadmapIndex =  cloneRoadmap.findIndex((x) => x.id == value);
                    if(oldIdeaIndex !== -1){
                        let cloneOldIdeas = [...cloneRoadmap[oldRoadmapIndex].ideas];
                        cloneOldIdeas.splice(oldIdeaIndex, 1)
                        cloneRoadmap[oldRoadmapIndex] = {...cloneRoadmap[oldRoadmapIndex], ideas: cloneOldIdeas, cards: cloneOldIdeas}
                    }
                    if(newRoadmapIndex !== -1){
                        let cloneIdeas = [...cloneRoadmap[newRoadmapIndex].ideas];
                        const obj = data.data
                        cloneIdeas.push(obj)
                        cloneRoadmap[newRoadmapIndex] = {...cloneRoadmap[newRoadmapIndex], ideas: cloneIdeas, cards: cloneIdeas}
                        setSelectedRoadmap(cloneRoadmap[newRoadmapIndex]);
                        setSelectedIdea(obj)
                    }

                } else {
                    cloneIdeas[ideaIndex] =  {...data.data,}
                    cloneRoadmap[roadmapIndex] = {...cloneRoadmap[roadmapIndex], ideas: cloneIdeas, cards: cloneIdeas}
                }

            }
            setRoadmapList({columns: cloneRoadmap});


            setIsLoading(false)

            setIsEditIdea(false)
            setIsLoadingSidebar('');
            toast({description: data.message})
        } else {
            setIsLoading(false)

            setIsLoadingSidebar('');
            toast({variant: "destructive", description: data.error})
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
            let cloneRoadmap = [...roadmapList.columns];
            const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap?.id);
            if(roadmapIndex !== -1){
                const ideaIndex = cloneRoadmap[roadmapIndex].ideas.findIndex((x) => x.id === selectedIdea?.id);
                if(ideaIndex !== -1){
                    let cloneIdeas = [cloneRoadmap[roadmapIndex].ideas];
                    let cloneIdea = {...cloneRoadmap[roadmapIndex].ideas[ideaIndex]};
                    const cloneComments = cloneIdea && cloneIdea?.comments ? [...cloneIdea?.comments] : [];
                    let obj = {...selectedComment, images: data.data.images}
                    cloneComments[selectedCommentIndex] = obj;
                    cloneIdea = {...cloneIdea,comments: cloneComments};
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
            toast({variant: "destructive", description: data.error})
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
            let cloneRoadmap = [...roadmapList.columns];
            const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap.id);
            if(roadmapIndex !== -1){
                const ideaIndex = cloneRoadmap[roadmapIndex].ideas.findIndex((x) => x.id === selectedIdea.id);
                if(ideaIndex !== -1){
                    let cloneIdeas = [cloneRoadmap[roadmapIndex].ideas];
                    let cloneIdea = {...cloneRoadmap[roadmapIndex].ideas[ideaIndex]};
                    const cloneComments = cloneIdea && cloneIdea?.comments ? [...cloneIdea?.comments] : [];
                    const cloneSubComment = [...cloneComments[selectedCommentIndex]?.reply] || [];
                    cloneSubComment[selectedSubCommentIndex] = data.data;
                    cloneComments[selectedCommentIndex]["reply"] = cloneSubComment;
                    cloneIdea = {...cloneIdea,comments: cloneComments};
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
            toast({variant: "destructive", description: data.error})
            setIsSaveUpdateSubComment(false)
        }
    }

    const deleteComment = async (id, indexs) => {
        const data = await apiSerVice.deleteComment({id: id})
        if (data.status === 200) {
            let cloneRoadmap = [...roadmapList.columns];
            const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap?.id);
            if(roadmapIndex !== -1){
                const ideaIndex = cloneRoadmap[roadmapIndex].ideas.findIndex((x) => x.id === selectedIdea?.id);
                if(ideaIndex !== -1){
                    let cloneIdeas = [cloneRoadmap[roadmapIndex].ideas];
                    let cloneIdea = {...cloneRoadmap[roadmapIndex].ideas[ideaIndex]};
                    const cloneComments = cloneIdea && cloneIdea?.comments ? [...cloneIdea?.comments] : [];
                    cloneComments.splice(indexs, 1);
                    cloneIdea = {...cloneIdea,comments: cloneComments};
                    cloneIdeas[ideaIndex] = cloneIdea;
                    setSelectedIdea(cloneIdea)
                    cloneRoadmap[roadmapIndex] = {...cloneRoadmap[roadmapIndex], ideas: cloneIdeas, cards: cloneIdeas}
                }
            }
            setRoadmapList({columns: cloneRoadmap});
            toast({description: data.message})
        } else {
            toast({variant: "destructive", description: data.error})
        }
    }

    const deleteSubComment = async (id, record, index, subIndex) => {
        const data = await apiSerVice.deleteComment({id: id})
        if (data.status === 200) {
            let cloneRoadmap = [...roadmapList.columns];
            const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap?.id);
            if(roadmapIndex !== -1){
                const ideaIndex = cloneRoadmap[roadmapIndex].ideas.findIndex((x) => x.id === selectedIdea?.id);
                if(ideaIndex !== -1){
                    let cloneIdeas = [cloneRoadmap[roadmapIndex].ideas];
                    let cloneIdea = {...cloneRoadmap[roadmapIndex].ideas[ideaIndex]};
                    const cloneComments = cloneIdea && cloneIdea?.comments ? [...cloneIdea?.comments] : [];
                    const cloneSubComment = [...cloneComments[index]?.reply] || [];
                    cloneSubComment.splice(subIndex, 1);
                    cloneComments[index]["reply"] = cloneSubComment;
                    cloneIdea = {...cloneIdea,comments: cloneComments};
                    cloneIdeas[ideaIndex] = cloneIdea;
                    setSelectedIdea(cloneIdea)
                    cloneRoadmap[roadmapIndex] = {...cloneRoadmap[roadmapIndex], ideas: cloneIdeas, cards: cloneIdeas}
                }
            }
            setRoadmapList({columns: cloneRoadmap})
            toast({description: data.message})
        } else {
            toast({variant: "destructive", description: data.error})
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
            case "description":
                if (!value || value.trim() === "") {
                    return "Description is required";
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

    const handleUpdate = (event) => {
        const {value} = event.target;
        setDescription(value);
        setSelectedIdea(selectedIdea => ({...selectedIdea, description: value}));
        setFormError(formError => ({
            ...formError,
            description: formValidate("description", value)
        }));
    };

    const handleChange = (tag) => {
        const clone = selectedIdea && selectedIdea?.topic && selectedIdea?.topic.length ? [...selectedIdea?.topic] : [];
        let index = clone.findIndex((t) => t.id === tag.id);
        if (index === -1) {
            clone.push(tag);
        } else {
            clone.splice(index, 1);
        }
        setSelectedIdea({...selectedIdea, topic: clone})
    }

    const onCreateIdea = async () => {
        debugger
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

        (selectedIdea?.topic || []).map((x) => {
            topics.push(x.id)
        })
        formData.append('title', selectedIdea?.title);
        formData.append('board', selectedIdea.board);
        formData.append('slug_url', selectedIdea?.title ? selectedIdea?.title.replace(/ /g, "-").replace(/\?/g, "-") : "");
        formData.append('description', selectedIdea?.description?.trim() === '' ? "" : selectedIdea?.description);
        formData.append('topic', topics.join(","));
        const data = await apiSerVice.updateIdea(formData, selectedIdea?.id)
        if (data.status === 200) {
            setSelectedIdea({...data.data})
            setIsEditIdea(false)
            setIsLoadingCreateIdea(false)
            toast({description: data.message})
        } else {
            setIsLoadingCreateIdea(false)
            toast({variant: "destructive", description: data.error})
        }
    }

    const handleOnCreateCancel = () => {
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

    const onCloseBoth = () => {
        onClose()
        setIsEditIdea(false)
    }

    // const onDeleteIdea = async () => {
    //     setIsLoadingSidebar("delete")
    //     const data = await apiSerVice.onDeleteIdea(selectedIdea?.id)
    //     if (data.status === 200) {
    //         debugger
    //         let cloneRoadmap = [...roadmapList.columns];
    //         const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap?.id);
    //         if(roadmapIndex !== -1) {
    //             const ideaIndex = cloneRoadmap[roadmapIndex].ideas.findIndex((x) => x.id === selectedIdea?.id);
    //             if (ideaIndex !== -1) {
    //                 const cloneRoadmapIdeas = [...cloneRoadmap[roadmapIndex].ideas]
    //                 cloneRoadmapIdeas.splice(ideaIndex, 1);
    //                 cloneRoadmap[roadmapIndex].ideas = cloneRoadmapIdeas
    //                 // setRoadmapList(cloneRoadmap)
    //                 // setSelectedIdea({})
    //                 // setSelectedRoadmap({})
    //             } else {
    //                 // const clone = [...roadmapList.columns];
    //                 // const index = cloneRoadmap.findIndex((x) => x.id === selectedIdea?.id)
    //                 // if (index !== -1) {
    //                 //     cloneRoadmap.splice(index, 1);
    //                 // }
    //             }
    //         }
    //         setRoadmapList({columns: cloneRoadmap})
    //
    //         setSelectedIdea({});
    //         setSelectedRoadmap({});
    //
    //         setIsUpdateIdea(false);
    //         setOpenDelete(false)
    //         onClose()
    //         setDeleteRecord(null)
    //         toast({description: "Idea delete successfully"})
    //         setIsLoadingSidebar("")
    //     } else {
    //         setIsLoadingSidebar("")
    //         toast({description: data.error})
    //     }
    // }
    //
    // const deleteIdea = (record) => {
    //     setDeleteRecord(record.id)
    //     setOpenDelete(!openDelete)
    // }

    return (
        <Fragment>
            {/*{*/}
            {/*    openDelete &&*/}
            {/*    <Fragment>*/}
            {/*        <Dialog open onOpenChange={deleteIdea}>*/}
            {/*            <DialogContent className="sm:max-w-[425px]">*/}
            {/*                <DialogHeader className={"flex flex-col gap-2"}>*/}
            {/*                    <DialogTitle>You really want delete this idea?</DialogTitle>*/}
            {/*                    <DialogDescription>*/}
            {/*                        This action can't be undone.*/}
            {/*                    </DialogDescription>*/}
            {/*                </DialogHeader>*/}
            {/*                <DialogFooter>*/}
            {/*                    <Button type="submit" variant={"outline"}*/}
            {/*                            className={"text-sm font-semibold"}*/}
            {/*                            onClick={() => setOpenDelete(false)}>Cancel</Button>*/}
            {/*                    <Button*/}
            {/*                        type="submit"*/}
            {/*                        variant={"hover:bg-destructive"}*/}
            {/*                        className={`text-sm ${theme === "dark" ? "text-card-foreground" : "text-card"} w-[77px] font-semibold bg-destructive`}*/}
            {/*                        onClick={() => onDeleteIdea(deleteRecord)}*/}
            {/*                    >*/}
            {/*                        {isLoadingSidebar ? <Loader2 size={16} className={"animate-spin"}/> : "Delete"}*/}
            {/*                    </Button>*/}
            {/*                </DialogFooter>*/}
            {/*            </DialogContent>*/}
            {/*        </Dialog>*/}
            {/*    </Fragment>*/}
            {/*}*/}
            <Sheet open={isOpen} onOpenChange={isOpen ? onCloseBoth : onOpen}>
                <SheetOverlay className={"inset-0"} />
                <SheetContent className={"lg:max-w-[1101px] md:max-w-[720px] sm:max-w-full p-0"}>
                    <SheetHeader className={"px-4 py-3 md:py-5 lg:px-8 lg:py-[20px] border-b"}>
                        <X onClick={onCloseBoth} className={"cursor-pointer"}/>
                    </SheetHeader>
                    <div className={"grid lg:grid-cols-12 md:grid-cols-1 overflow-auto idea-sheet-height"}>
                        <div
                            className={`col-span-4 lg:block hidden ${theme === "dark" ? "" : "bg-muted"} border-r lg:overflow-auto idea-sheet-height`}>
                            <div className={"border-b py-4 pl-8 pr-6 flex flex-col gap-3"}>
                                <div className={"flex flex-col gap-1"}>
                                    <h3 className={"text-sm font-medium"}>Status</h3>
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
                                <div className="py-4 pl-8 pr-6 w-full items-center gap-1.5">
                                    <Label htmlFor="picture">Featured image</Label>
                                    <div className="w-[282px] h-[128px] flex gap-1">

                                        {
                                            selectedIdea?.cover_image ?
                                                <div>
                                                    {selectedIdea && selectedIdea?.cover_image && selectedIdea?.cover_image?.name ?
                                                        <div className={"w-[282px] h-[128px] relative border p-[5px]"}>
                                                            <img
                                                                className={"upload-img"}
                                                                src={selectedIdea && selectedIdea?.cover_image && selectedIdea?.cover_image?.name ? URL.createObjectURL(selectedIdea?.cover_image) : selectedIdea?.cover_image}
                                                                alt=""/>
                                                            <CircleX
                                                                size={20}
                                                                className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                                onClick={() => onChangeStatus('delete_cover_image', selectedIdea && selectedIdea?.cover_image && selectedIdea?.cover_image?.name ? "" : [selectedIdea?.cover_image.replace("https://code.quickhunt.app/public/storage/feature_idea/", "")])}
                                                            />
                                                        </div> : selectedIdea?.cover_image ?
                                                            <div className={"w-[282px] h-[128px] relative border p-[5px]"}>
                                                                <img className={"upload-img"} src={selectedIdea?.cover_image} alt=""/>
                                                                <CircleX
                                                                    size={20}
                                                                    className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                                    onClick={() => onChangeStatus('delete_cover_image', selectedIdea && selectedIdea?.cover_image && selectedIdea?.cover_image?.name ? "" : selectedIdea?.cover_image.replace("https://code.quickhunt.app/public/storage/feature_idea/", ""))}
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
                                                    />
                                                    <label
                                                        htmlFor="pictureInput"
                                                        className="border-dashed w-[282px] h-[128px] py-[52px] flex items-center justify-center bg-muted border border-muted-foreground rounded cursor-pointer"
                                                    >
                                                        <h4 className="text-xs font-semibold">Upload</h4>
                                                    </label>
                                                </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"col-span-8 lg:overflow-auto"}>

                            {
                                isEditIdea ?
                                    <div className={"pb-100px"}>
                                        <div className={"px-4 py-3 lg:py-6 lg:px-8 flex flex-col gap-4 ld:gap-6 border-b"}>
                                            <div className="space-y-2">
                                                <Label htmlFor="text">Title</Label>
                                                <Input type="text" id="text" placeholder="" value={selectedIdea?.title}
                                                       name={"title"} onChange={onChangeText}/>
                                                {
                                                    formError.title &&
                                                    <span className="text-red-500 text-sm">{formError.title}</span>
                                                }
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="message">Description</Label>
                                                <ReactQuillEditor value={selectedIdea?.description} name={"description"} onChange={handleUpdate}/>
                                                {formError.description && <span className="text-red-500 text-sm">{formError.description}</span>}
                                            </div>
                                        <div className={"space-y-2"}>
                                            <Label>Choose Board for this Idea</Label>
                                            <Select
                                                onValueChange={(value) => onChangeText({target:{name: "board", value}})}
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
                                            {formError.board && <span className="text-red-500 text-sm">{formError.board}</span>}
                                        </div>
                                        </div>
                                        <div className={"px-4 py-3 lg:py-6 lg:px-8 border-b space-y-2"}>
                                            <Label>Choose Topics for this Idea (optional)</Label>
                                            <Select onValueChange={handleChangeTopic}
                                                    value={selectedIdea?.topic.map(x => x.id)}>
                                                <SelectTrigger>
                                                    <SelectValue className={"text-muted-foreground text-sm"}
                                                                 placeholder="Assign to">
                                                        <div className={"flex flex-wrap gap-[2px]"}>
                                                            {(selectedIdea?.topic || []).map((x, index) => {
                                                                const findObj = (topicLists || []).find((y) => y.id === x?.id);
                                                                return (
                                                                    <div key={index}
                                                                         className={`text-xs flex gap-[2px] ${theme === "dark" ? "text-card" : ""} bg-slate-300 items-center rounded py-0 px-2`}>
                                                                        {findObj?.title}
                                                                    </div>
                                                                );
                                                            })}
                                                            {(selectedIdea?.topic || []).length > 2 && <div>...</div>}
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
                                                                                {(selectedIdea?.topic.map((x) => x.id) || []).includes(x.id) ?
                                                                                    <Check size={18}/> : <div
                                                                                        className={"h-[18px] w-[18px]"}></div>}
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
                                                className={`${isLoadingCreateIdea === true ? "py-2 px-6" : "py-2 px-6"} w-[81px] text-sm font-semibold`}
                                                onClick={onCreateIdea}
                                            >
                                                {
                                                    isLoadingCreateIdea ? <Loader2 className="h-4 w-4 animate-spin"/> :
                                                        "Save"
                                                }
                                            </Button>
                                            <Button
                                                variant={"outline hover:bg-transparent"}
                                                className={"border border-primary py-2 px-6 text-sm font-semibold"}
                                                onClick={handleOnCreateCancel}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                    :
                                    <Fragment>
                                        <div className={"px-4 py-3 lg:py-6 lg:px-8"}>
                                            <div className={"flex flex-col gap-6"}>
                                                <div className={"flex justify-between items-center gap-4 md:flex-nowrap flex-wrap"}>
                                                    <div className={"flex gap-2"}>
                                                        <Button
                                                            className={"p-[7px] bg-white shadow border hover:bg-white w-[30px] h-[30px]"}
                                                            variant={"outline"}
                                                            onClick={() => giveVote(1)}
                                                        >
                                                            <ArrowBigUp
                                                                className={"fill-primary stroke-primary"}/>
                                                        </Button>
                                                        <p className={"text-xl font-medium"}>{selectedIdea?.vote}</p>
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
                                                                <Pin className={"w-[16px] h-[16px]"}/> :
                                                                <Pin fill={"bg-card-foreground"}
                                                                     className={"w-[16px] h-[16px]"}/>}
                                                        </Button>
                                                        {/*<Button*/}
                                                        {/*    variant={"outline"}*/}
                                                        {/*    className={"w-[30px] h-[30px] p-1"}*/}
                                                        {/*    onClick={deleteIdea}*/}
                                                        {/*    loading={isLoadingSidebar === "delete"}*/}
                                                        {/*>*/}
                                                        {/*    <Trash2 className={"w-[16px] h-[16px]"}/>*/}
                                                        {/*</Button>*/}
                                                    </div>
                                                </div>
                                                <div className={"flex flex-col gap-4"}>
                                                    <div className={"flex items-center gap-2"}>
                                                        <h2 className={"text-xl font-medium"}>{selectedIdea?.title}</h2>
                                                    </div>
                                                    <div
                                                        className={"description-container text-xs text-muted-foreground"}>
                                                        <ReadMoreText html={selectedIdea?.description}/>
                                                    </div>
                                                </div>
                                                {
                                                    selectedIdea && selectedIdea?.images && selectedIdea?.images.length > 0 ?
                                                        <div className={"flex gap-2 flex-wrap"}>
                                                            {
                                                                (selectedIdea?.images || []).map((x, i) => {
                                                                        return (
                                                                            <Fragment>
                                                                                {
                                                                                    x && x.name ?
                                                                                        <div
                                                                                            className="w-[50px] h-[50px] md:w-[100px] md:h-[100px] border p-[3px] relative">
                                                                                            <img className={"upload-img"}
                                                                                                 src={x && x.name ? URL.createObjectURL(x) : x}
                                                                                                 alt=""/>
                                                                                        </div> : x ?
                                                                                        <div
                                                                                            className="w-[50px] h-[50px] md:w-[100px] md:h-[100px] border p-[3px] relative">
                                                                                            <img className={"upload-img"}
                                                                                                 src={x} alt=""/>
                                                                                        </div> : ""
                                                                                }
                                                                            </Fragment>
                                                                        )
                                                                    }
                                                                )}
                                                        </div> : ""
                                                }
                                                <div className={"flex items-center"}>
                                                    <div className={"flex items-center gap-4 md:flex-nowrap flex-wrap"}>
                                                        <div className={"flex items-center gap-2"}>
                                                            <Avatar className={"w-[20px] h-[20px]"}>
                                                                {
                                                                    selectedIdea?.user_photo ?
                                                                        <AvatarImage src={selectedIdea?.user_photo}
                                                                                     alt="@shadcn"/>
                                                                        :
                                                                        <AvatarFallback>{selectedIdea && selectedIdea?.name && selectedIdea?.name.substring(0, 1)}</AvatarFallback>
                                                                }
                                                            </Avatar>
                                                            <div className={"flex items-center"}>
                                                                <h4 className={"text-sm font-medium"}>{selectedIdea?.name}</h4>
                                                                <p className={"text-sm font-normal flex items-center text-muted-foreground"}>
                                                                    <Dot
                                                                        className={"fill-text-card-foreground stroke-text-card-foreground"}/>
                                                                    {moment(selectedIdea?.created_at).format('D MMM')}
                                                                </p>
                                                            </div>
                                                            {
                                                                selectedIdea && selectedIdea?.vote_list && selectedIdea?.vote_list.length ?
                                                                    <Popover>
                                                                        <PopoverTrigger asChild>
                                                                            <Button variant="ghost hover-none"
                                                                                    className={"rounded-full p-0 h-[24px]"}>
                                                                                {
                                                                                    (selectedIdea.vote_list.slice(0, 1) || []).map((x, i) => {
                                                                                        return (
                                                                                            <div className={"flex"} key={i}>
                                                                                                <div
                                                                                                    className={"relative"}>
                                                                                                    <div
                                                                                                        className={"update-idea text-sm rounded-full border text-center"}>
                                                                                                        <Avatar>
                                                                                                            {
                                                                                                                x.user_photo ?
                                                                                                                    <AvatarImage
                                                                                                                        src={x.user_photo}
                                                                                                                        alt={x && x.name && x.name.substring(0, 1)} /> :
                                                                                                                    <AvatarFallback>{x && x.name && x.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                                                                                                            }
                                                                                                        </Avatar>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div
                                                                                                    className={"update-idea  text-sm rounded-full border text-center ml-[-5px]"}>
                                                                                                    <Avatar><AvatarFallback>+{selectedIdea?.vote_list.length}</AvatarFallback></Avatar>
                                                                                                </div>
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="p-0" align={"end"}>
                                                                            <div className="">
                                                                                <div
                                                                                    className="space-y-2 px-4 py-[5px]">
                                                                                    <h4 className="font-medium leading-none text-sm">{`Voters (${selectedIdea?.vote})`}</h4>
                                                                                </div>
                                                                                <div
                                                                                    className="border-t px-4 py-3 space-y-2">
                                                                                    {
                                                                                        (selectedIdea?.vote_list || []).map((x, i) => {
                                                                                            return (
                                                                                                <div
                                                                                                    className={"flex gap-2"}>
                                                                                                    <div
                                                                                                        className={"update-idea text-sm rounded-full border text-center"}>
                                                                                                        <Avatar
                                                                                                            className={"w-[20px] h-[20px]"}>
                                                                                                            {
                                                                                                                selectedIdea?.user_photo ?
                                                                                                                    <AvatarImage
                                                                                                                        src={selectedIdea?.user_photo}
                                                                                                                        alt="@shadcn"/>
                                                                                                                    :
                                                                                                                    <AvatarFallback>{selectedIdea && selectedIdea?.name && selectedIdea?.name?.substring(0, 1).toUpperCase()}</AvatarFallback>
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
                                                        <Select
                                                            onValueChange={(value) => onChangeStatus('roadmap_id', value)}
                                                            value={selectedIdea?.roadmap_id}
                                                        >
                                                            <SelectTrigger className="w-[234px] h-[24px] px-3 py-1">
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
                                                    </div>
                                                </div>
                                                <div className={"flex flex-col gap-2"}>
                                                    <div className="w-full flex flex-col gap-2">
                                                        <Label htmlFor="message">Add comment</Label>
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
                                                            {/*       className={"text-sm font-medium"}>Private*/}
                                                            {/*    note</Label>*/}
                                                        </div>
                                                        <div className={"flex gap-2 items-center"}>
                                                            <div className="p-2 max-w-sm relative w-[36px] h-[36px]">

                                                                <input
                                                                    id="commentFile"
                                                                    type="file"
                                                                    className="hidden"
                                                                    onChange={handleAddCommentImg}
                                                                />
                                                                <label htmlFor="commentFile"
                                                                       className="absolute inset-0 flex items-center justify-center bg-white border border-primary rounded cursor-pointer"
                                                                >
                                                                    <Paperclip size={16} className={"stroke-primary"}/>
                                                                </label>

                                                            </div>
                                                            <Button
                                                                className={"w-[128px] h-[36px] text-sm font-semibold"}
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
                                            </div>
                                        </div>
                                        <div>
                                            <Tabs defaultValue="comment" className="">
                                                <div className={"px-4 lg:px-8"}>
                                                    <TabsList
                                                        className="bg-transparent border-b-2 border-b-primary rounded-none">
                                                        <TabsTrigger value="comment">Comment</TabsTrigger>
                                                    </TabsList>
                                                </div>


                                                <TabsContent value="comment"
                                                             className={`${theme === "dark" ? "" : "bg-muted"}`}>
                                                    {
                                                        selectedIdea && selectedIdea?.comments && selectedIdea?.comments.length > 0 ?
                                                            (selectedIdea?.comments || []).map((x, i) => {
                                                                return (
                                                                    <Fragment>
                                                                        <div
                                                                            className={"flex gap-2 p-4 lg:p-8 lg:pb-0 pt-3 pb-0"}>
                                                                            <div className={""}>
                                                                                <div
                                                                                    className={"update-idea text-sm rounded-full border text-center"}>
                                                                                    <Avatar
                                                                                        className={"w-[20px] h-[20px]"}>
                                                                                        {
                                                                                            x.user_photo ?
                                                                                                <AvatarImage
                                                                                                    src={x.user_photo}
                                                                                                    alt="@shadcn"/>
                                                                                                :
                                                                                                <AvatarFallback>{x && x.name && x.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                                                                                        }
                                                                                    </Avatar>
                                                                                </div>
                                                                            </div>
                                                                            <div className={"w-full flex flex-col space-y-3"}>
                                                                                <div className={"flex gap-1 flex-wrap justify-between"}>
                                                                                    <div className={"flex items-start"}>
                                                                                        <h4 className={"text-sm font-medium"}>{x.name}</h4>
                                                                                        <p className={"text-sm font-normal flex items-center text-muted-foreground"}>
                                                                                            <Dot size={20}
                                                                                                className={"fill-text-card-foreground stroke-text-card-foreground"}/>
                                                                                            {moment.utc(x.created_at).local().startOf('seconds').fromNow()}
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className={"flex gap-2"}>
                                                                                        {
                                                                                            selectedCommentIndex === i && isEditComment ? "" :
                                                                                                x.is_edit === 1 ?
                                                                                                    <Fragment><Button
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
                                                                                                            <Trash2 className={"w-[16px] h-[16px]"}/>
                                                                                                        </Button></Fragment> : ""
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                                <div>
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
                                                                                                    selectedComment && selectedComment.images && selectedComment.images.length ?
                                                                                                        <div className={"flex gap-2"}>
                                                                                                            {
                                                                                                                (selectedComment.images || []).map((x, i) => {
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
                                                                                                <div
                                                                                                    className={"flex gap-2"}>
                                                                                                    <Button
                                                                                                        className={`${isSaveUpdateComment === true ? "py-2 px-6" : "py-2 px-6"} w-[81px] h-[30px] text-sm font-semibold`}
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
                                                                                                        className={"px-3 py-2 h-[30px] text-sm font-semibold text-primary border border-primary"}
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
                                                                                                <p className={"text-xs"}>
                                                                                                    <ReadMoreText className={"text-xs"} html={x.comment}/>
                                                                                                </p>
                                                                                                <div className={"flex gap-2"}>
                                                                                                    {
                                                                                                        ((x && x.images) || []).map((img, ind) => {
                                                                                                            return (
                                                                                                                <div key={ind} className={"w-[50px] h-[50px] md:w-[100px] md:h-[100px] border p-[3px]"}>
                                                                                                                    <img className={"upload-img"} src={img} alt={img}/>
                                                                                                                </div>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </div>
                                                                                            </div>
                                                                                    }
                                                                                </div>

                                                                                {
                                                                                    selectedCommentIndex === i ? "" :
                                                                                        <div className={"flex justify-between"}>
                                                                                            <Button
                                                                                                className="p-0 text-sm h-auto font-semibold text-primary"
                                                                                                variant={"ghost hover-none"}
                                                                                                onClick={() => onShowSubComment(i)}
                                                                                                key={`comment-nested-reply-to-${i}`}
                                                                                            >
                                                                                                Reply
                                                                                            </Button>
                                                                                            <div className={"flex items-center gap-2 cursor-pointer"}
                                                                                                 onClick={() => onShowSubComment(i)}
                                                                                            >
                                                                                                    <span>
                                                                                                        <MessageCircleMore
                                                                                                            className={"stroke-primary w-[16px] h-[16px]"}/>
                                                                                                    </span>
                                                                                                <p className={"text-base font-medium"}>
                                                                                                    {x.reply.length}
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>
                                                                                }
                                                                                    {
                                                                                        x.show_reply ?
                                                                                            <div
                                                                                                className={"space-y-2"}>
                                                                                                {
                                                                                                    (x.reply || []).map((y, j) => {
                                                                                                        return (
                                                                                                            <Fragment>
                                                                                                                <div
                                                                                                                    className={"flex gap-2"}>
                                                                                                                    <div>
                                                                                                                        <div
                                                                                                                            className={"update-idea text-sm rounded-full border text-center"}>
                                                                                                                            <Avatar><AvatarFallback>{y.name.substring(0, 1).toUpperCase()}</AvatarFallback></Avatar>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div
                                                                                                                        className={"w-full space-y-2"}>
                                                                                                                        <div
                                                                                                                            className={"flex flex-wrap justify-between items-start gap-2"}>
                                                                                                                            <div
                                                                                                                                className={"flex gap-2"}>
                                                                                                                                <h4 className={"text-sm font-medium"}>{y.name}</h4>
                                                                                                                                <p className={"text-sm font-normal text-muted-foreground"}>
                                                                                                                                    {moment.utc(y.created_at).local().startOf('seconds').fromNow()}
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
                                                                                                                                                <Trash2 className={"w-[16px] h-[16px]"}/>
                                                                                                                                            </Button>
                                                                                                                                        </div> : ''
                                                                                                                            }
                                                                                                                        </div>
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
                                                                                                                                                <div className={"flex gap-2"}>
                                                                                                                                                    {
                                                                                                                                                        (selectedSubComment.images || []).map((x, ind) => {
                                                                                                                                                            return (
                                                                                                                                                                <Fragment>
                                                                                                                                                                    {
                                                                                                                                                                        x && x.name ?
                                                                                                                                                                            <div
                                                                                                                                                                                className={"w-[50px] h-[50px] md:w-[100px] md:h-[100px] relative border p-[3px]"}>
                                                                                                                                                                                <img className={"upload-img"} src={x && x.name ? URL.createObjectURL(x) : x} alt=""/>
                                                                                                                                                                                <CircleX
                                                                                                                                                                                    size={20}
                                                                                                                                                                                    className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                                                                                                                                                    onClick={() => onDeleteSubCommentImage(ind, true)}
                                                                                                                                                                                />
                                                                                                                                                                            </div> : x ?
                                                                                                                                                                            <div
                                                                                                                                                                                className={"w-[50px] h-[50px] md:w-[100px] md:h-[100px] relative border p-[3px]"}>
                                                                                                                                                                                <img className={"upload-img"} src={x} alt={x}/>
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
                                                                                                                                                className={`${isSaveUpdateSubComment === true ? "py-2 px-6" : "py-2 px-6"} w-[81px] h-[30px] text-sm font-semibold`}
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
                                                                                                                                                className={"px-3 py-2 h-[30px] text-sm font-semibold text-primary border border-primary"}
                                                                                                                                                variant={"outline hover:none"}
                                                                                                                                                onClick={onCancelSubComment}>Cancel</Button>
                                                                                                                                            <div
                                                                                                                                                className="p-2 max-w-sm relative w-[36px]">
                                                                                                                                                <Input
                                                                                                                                                    id="commentFileInput"
                                                                                                                                                    type="file"
                                                                                                                                                    className="hidden"
                                                                                                                                                    onChange={handleSubCommentUploadImg}
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
                                                                                                                                    <div
                                                                                                                                        className={"space-y-2"}>
                                                                                                                                        <p className={"text-xs"}>{y.comment}</p>
                                                                                                                                        <div className={"flex gap-2 flex-wrap"}>
                                                                                                                                        {
                                                                                                                                            y && y.images && y.images.length ?
                                                                                                                                                <Fragment>
                                                                                                                                                    {
                                                                                                                                                        (y.images || []).map((z, i) => {
                                                                                                                                                            return (
                                                                                                                                                                <div className={"w-[50px] h-[50px] md:w-[100px] md:h-[100px] border p-[3px]"}>
                                                                                                                                                                    <img className={"upload-img"} src={z} alt={z}/>
                                                                                                                                                                </div>
                                                                                                                                                            )
                                                                                                                                                        })
                                                                                                                                                    }
                                                                                                                                                </Fragment> : ''
                                                                                                                                        }
                                                                                                                                        </div>
                                                                                                                                    </div>
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
                                                                                                        value={subCommentText}
                                                                                                        onChange={(e) => setSubCommentText(e.target.value)}/>
                                                                                                    {
                                                                                                        subCommentFiles && subCommentFiles.length ?
                                                                                                            <div className={"flex gap-2"}>
                                                                                                                {
                                                                                                                    (subCommentFiles || []).map((z, i) => {
                                                                                                                        return (
                                                                                                                            <Fragment>
                                                                                                                                {
                                                                                                                                    z && z.name ?
                                                                                                                                        <div className={"w-[50px] h-[50px] md:w-[100px] md:h-[100px] relative border p-[3px]"}>
                                                                                                                                            <img className={"upload-img"} src={z && z.name ? URL.createObjectURL(z) : z}/>
                                                                                                                                            <CircleX
                                                                                                                                                size={20}
                                                                                                                                                className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                                                                                                                onClick={() => onDeleteSubCommentImageOld(i, false)}
                                                                                                                                            />
                                                                                                                                        </div> : z ?
                                                                                                                                        <div className={"w-[50px] h-[50px] md:w-[100px] md:h-[100px] relative border p-[3px]"}>
                                                                                                                                            <img className={"upload-img"} src={z} alt={z}/>
                                                                                                                                            <CircleX
                                                                                                                                                size={20}
                                                                                                                                                className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                                                                                                                onClick={() => onDeleteSubCommentImageOld(i, false)}
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
                                                                                                            className={`${isSaveSubComment === true ? "py-2 px-6" : "w-[86px] py-2 px-6"} h-[30px] text-sm font-semibold`}
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
                                                                                                                onChange={handleSubCommentUploadImg} />
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

export default RoadMapSidebarSheet;