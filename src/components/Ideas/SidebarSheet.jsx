import React, {Fragment, useState, useRef, useEffect} from 'react';
import {Sheet, SheetContent, SheetHeader,} from "../ui/sheet";
import {Button} from "../ui/button";
import {ArrowBigDown, ArrowBigUp, Circle, CircleX, Dot, Lock, Paperclip, Pencil, Pin, PinOff, Trash2, X} from "lucide-react";
import {RadioGroup, RadioGroupItem} from "../ui/radio-group";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {DialogTrigger, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogClose, DialogOverlay, DialogTitle, DialogPortal} from "../ui/dialog";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {Popover, PopoverTrigger, PopoverContent} from "../ui/popover";
import {Textarea} from "../ui/textarea";
import {Switch} from "../ui/switch";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs";
import {useTheme} from "../theme-provider";
import {Card} from "../ui/card";
import {useToast} from "../ui/use-toast";
import {useNavigate} from "react-router";
import {ApiService} from "../../utils/ApiService";
import {useSelector} from "react-redux";
import ReadMoreText from "../Comman/ReadMoreText";
import moment from "moment";

const initialStateError = {
    title: "",
    description: null,

}

const SidebarSheet = ({
                          isOpen,
                          onOpen,
                          onClose,
                          setIsUpdateIdea,
                          selectedIdea,
                          setSelectedIdea,
                          isUpdateIdea,
                          ideasList,
                          setIdeasList,
                          onUpdateIdeaClose,
                          isRoadmap,
                          selectedRoadmap,
                          setSelectedRoadmap,
                          roadmapList,
                          setRoadmapList,
                          isNoStatus,
                          setIsNoStatus,
                          setNoStatus
                      }) => {
    const {theme} = useTheme()
    let navigate = useNavigate();
    let apiSerVice = new ApiService();
    const {toast} = useToast()
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [privateNote, setPrivateNote] = useState(false);
    const [openTextField, setOpenTextField] = useState(false);
    const [openReplyTextField, setOpenRreplyTextField] = useState(false);
    const [openPrivateReplyTextField, setOpenPrivateRreplyTextField] = useState(false);
    const [textareaValue, setTextareaValue] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const editor = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSidebar, setIsLoadingSidebar] = useState('');
    const [topicLists, setTopicLists] = useState([]);
    const [description, setDescription] = useState(null);
    const [selectedTab, setSelectedTab] = useState("1")
    const [commentFiles, setCommentFiles] = useState([])
    const [subCommentFiles, setSubCommentFiles] = useState([])
    const [deletedCommentImage, setDeletedCommentImage] = useState([])
    const [deletedIdeaImage, setDeletedIdeaImage] = useState([])
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

    const [comment, setComment] = useState('');
    const [commentsList, setCommentsList] = useState([]);

    useEffect(() => {
        setTopicLists(allStatusAndTypes.topics)
        setDescription(selectedIdea.description)
        setRoadmapStatus(allStatusAndTypes.roadmap_status)
    }, [projectDetailsReducer.id, allStatusAndTypes]);

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
                    const clone = [...ideasList];
                    const index = clone.findIndex((x) => x.id === selectedIdea.id)
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
                        setIdeasList(clone);
                        if (isRoadmap) {
                            const cloneRoadmap = [...roadmapList]
                            const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap.id);
                            if (roadmapIndex !== -1) {
                                cloneRoadmap[roadmapIndex].ideas = clone
                                setRoadmapList(cloneRoadmap);
                            }
                            if (isNoStatus) {
                                setNoStatus(clone)
                            }
                        }
                    }
                    toast({description: 'Vote successfully'})
                } else {
                    toast({description: data.error})
                }
            }
        } else {
            toast({variant: "destructive", description: "Login user can not use upvote or down vote"})
        }
    }

    const dummyRequest = ({file, onSuccess}) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const dummyRequestSubComment = ({file, onSuccess}) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const beforeUpload = (file, files) => {
        if (selectedComment && selectedComment.id) {
            const clone = [...selectedComment.images, ...files,]
            let old = selectedComment && selectedComment.newImage && selectedComment.newImage.length ? [...selectedComment.newImage] : [];
            const newImageClone = [...old, ...files,]
            setSelectedComment({...selectedComment, images: clone, newImage: newImageClone})
        } else {
            setCommentFiles([...commentFiles, ...files])
        }
    }

    const beforeUploadIdea = (file, files) => {
        if (isEditIdea) {
            const clone = [...selectedIdea.images, ...files,]
            let old = selectedIdea && selectedIdea.newImage && selectedIdea.newImage.length ? [...selectedIdea.newImage] : [];
            const newImageClone = [...old, ...files,]
            setSelectedIdea({...selectedIdea, images: clone, newImage: newImageClone})

        } else {
            setSelectedIdea({...selectedIdea, images: [...selectedIdea.images, ...files]})
        }
    }

    const beforeUploadSubComment = (file, files) => {
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
            let index = ideasList.findIndex((x) => x.id === selectedIdea.id)
            const cloneIdea = [...ideasList];
            if (index !== -1) {
                cloneIdea[index] = obj;
                setIdeasList(cloneIdea)
                if (isRoadmap) {
                    const cloneRoadmap = [...roadmapList]
                    const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap.id);
                    if (roadmapIndex !== -1) {
                        cloneRoadmap[roadmapIndex].ideas = cloneIdea
                        setRoadmapList(cloneRoadmap);
                    }
                    if (isNoStatus) {
                        setNoStatus(cloneIdea)
                    }
                }
            }
            toast({description: 'Comment create successfully'})
            setCommentText('');
            setCommentFiles([])
            setIsSaveComment(false)
        } else {
            setIsSaveComment(false)
            toast({description: data.error})
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
            let indexIdea = ideasList.findIndex((x) => x.id === selectedIdea.id);
            const cloneIdea = [...ideasList];
            if (indexIdea !== -1) {
                cloneIdea[indexIdea] = obj;
                setIdeasList(cloneIdea);
                if (isRoadmap) {
                    const cloneRoadmap = [...roadmapList]
                    const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap.id);
                    if (roadmapIndex !== -1) {
                        cloneRoadmap[roadmapIndex].ideas = cloneIdea
                        setRoadmapList(cloneRoadmap);
                    }
                    if (isNoStatus) {
                        setNoStatus(cloneIdea)
                    }
                }
            }
            setSubCommentText('');
            setSubCommentFiles([])
            setIsSaveSubComment(false)
            toast({description: 'Comment create successfully'})
        } else {
            setIsSaveSubComment(false)
            toast({description: data.error})
        }
    }

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleAddComments = () => {
        if (comment.trim() !== '') {
            setCommentsList([...commentsList, comment]);
            setComment('');
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedFile(file);
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setImagePreview(null);
    };

    const onChangeStatus = async (name,value) => {
        setIsLoadingSidebar(name);
        setSelectedIdea({...selectedIdea, [name]: value})
        let formData = new FormData();
        formData.append(name, value);
        const data = await apiSerVice.updateIdea(formData, selectedIdea.id)
        if (data.status === 200) {
            let clone = [...ideasList];
            let index = clone.findIndex((x) => x.id === selectedIdea.id);
            if (index !== -1) {
                if (name === "pin_to_top" && value == 1) {
                    clone.splice(index, 1)
                    clone.unshift(data.data)
                } else {
                    clone[index] = {...data.data,};
                }
                if (isRoadmap) {
                    const cloneRoadmap = [...roadmapList]
                    const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap.id);
                    if (name === "roadmap_id") {
                        if (isNoStatus) {
                            let ideaIndex = clone.findIndex((x) => x.id === selectedIdea.id);
                            if (ideaIndex !== -1) {
                                let ideaObj = clone[ideaIndex]
                                const roadmapIndexChange = cloneRoadmap.findIndex((x) => x.id == value);
                                const cloneRoadmapIdeas = [...cloneRoadmap[roadmapIndexChange].ideas]
                                cloneRoadmapIdeas.push(ideaObj)
                                cloneRoadmap[roadmapIndexChange].ideas = cloneRoadmapIdeas
                                clone.splice(ideaIndex, 1)
                                setRoadmapList(cloneRoadmap);
                                setNoStatus(clone);
                            }
                        } else {
                            if (roadmapIndex !== -1) {
                                let cloneIdea = [...cloneRoadmap[roadmapIndex].ideas];
                                let ideaIndex = cloneIdea.findIndex((x) => x.id === selectedIdea.id);
                                if (ideaIndex !== -1) {
                                    let ideaObj = cloneIdea[ideaIndex]
                                    const roadmapIndexChange = cloneRoadmap.findIndex((x) => x.id == value);
                                    const cloneRoadmapIdeas = [...cloneRoadmap[roadmapIndexChange].ideas]
                                    cloneRoadmapIdeas.push(ideaObj);
                                    cloneIdea.splice(ideaIndex, 1);
                                    cloneRoadmap[roadmapIndexChange].ideas = cloneRoadmapIdeas
                                    cloneRoadmap[roadmapIndex].ideas = cloneIdea
                                    setRoadmapList(cloneRoadmap);
                                }
                            }
                        }
                    } else {
                        if (roadmapIndex !== -1) {
                            cloneRoadmap[roadmapIndex].ideas = clone
                            setRoadmapList(cloneRoadmap);
                        }
                    }
                }
            }
            setSelectedIdea({...data.data,})
            setIdeasList(clone);
            setIsLoading(false)
            setIsEditIdea(false)
            setIsLoadingSidebar('');
            toast({description: "Idea Update successfully"})
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

    const onDeleteIdeaImage = (index, isOld) => {
        const clone = [...selectedIdea.images];
        if (isOld) {
            clone.splice(index, 1);
            if (selectedIdea && selectedIdea.newImage && selectedIdea.newImage.length) {
                const cloneNewImage = [...selectedIdea.newImage];
                cloneNewImage.splice(index, 1);
                setSelectedIdea({...selectedIdea, newImage: cloneNewImage});
            }
            setSelectedIdea({...selectedIdea, images: clone});
        } else {
            const cloneImage = [...deletedIdeaImage];
            cloneImage.push(clone[index]);
            clone.splice(index, 1);
            setSelectedIdea({...selectedIdea, images: clone});
            setDeletedIdeaImage(cloneImage);
        }
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
                formData.append(`images[]`, selectedComment.newImage[i]);
            }
        }
        for (let i = 0; i < deletedCommentImage.length; i++) {
            formData.append(`delete_image[]`, deletedCommentImage[i].replace('https://code.quickhunt.app/public/storage/feature_idea/', ''));
        }
        formData.append('comment', selectedComment.comment);
        formData.append('id', selectedComment.id);
        const data = await apiSerVice.updateComment(formData)
        if (data.status === 200) {
            let obj = {...selectedComment, images: data.data.images}
            const cloneComment = [...selectedIdea.comments];
            cloneComment[selectedCommentIndex] = obj;
            let selectedIdeaObj = {...selectedIdea, comments: cloneComment}
            setSelectedIdea(selectedIdeaObj)
            const index = ideasList.findIndex((x) => x.id === selectedIdea.id)
            if (index !== -1) {
                const cloneIdea = [...ideasList];
                cloneIdea[index] = selectedIdeaObj;
                setIdeasList(cloneIdea)
                if (isRoadmap) {
                    const cloneRoadmap = [...roadmapList]
                    const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap.id);
                    if (roadmapIndex !== -1) {
                        cloneRoadmap[roadmapIndex].ideas = cloneIdea
                        setRoadmapList(cloneRoadmap);
                    }
                    if (isNoStatus) {
                        setNoStatus(cloneIdea)
                    }
                }
            }
            setSelectedCommentIndex(null)
            setSelectedComment(null);
            setIsEditComment(false)
            setDeletedCommentImage([])
            setIsSaveUpdateComment(false)
            toast({description: 'Comment update successfully'})
        } else {
            toast({description: data.error})
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
            const ideaIndex = ideasList.findIndex((x) => x.id === selectedIdea.id)
            const commentIndex = ((selectedIdea.comments) || []).findIndex((x) => x.id === selectedComment.id);
            if (commentIndex !== -1) {
                const cloneComment = [...selectedIdea.comments];
                cloneComment[commentIndex].reply[selectedSubCommentIndex] = data.data;
                let selectedIdeaObj = {...selectedIdea, comments: cloneComment}
                setSelectedIdea(selectedIdeaObj)
                if (ideaIndex !== -1) {
                    const cloneIdea = [...ideasList];
                    cloneIdea[ideaIndex] = selectedIdeaObj;
                    setIdeasList(cloneIdea)
                    if (isRoadmap) {
                        const cloneRoadmap = [...roadmapList]
                        const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap.id);
                        if (roadmapIndex !== -1) {
                            cloneRoadmap[roadmapIndex].ideas = cloneIdea
                            setRoadmapList(cloneRoadmap);
                        }
                        if (isNoStatus) {
                            setNoStatus(cloneIdea)
                        }
                    }
                }
            }
            setSelectedCommentIndex(null)
            setSelectedComment(null);
            setSelectedSubComment(null);
            setSelectedSubCommentIndex(null);
            setDeletedSubCommentImage([]);
            setIsSaveUpdateSubComment(false)
            toast({description: 'Comment update successfully'})
        } else {
            toast({description: data.error})
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
            const index = ideasList.findIndex((x) => x.id === selectedIdea.id)
            if (index !== -1) {
                const cloneIdea = [...ideasList];
                cloneIdea[index] = selectedIdeaObj;
                setIdeasList(cloneIdea)
                if (isRoadmap) {
                    const cloneRoadmap = [...roadmapList]
                    const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap.id);
                    if (roadmapIndex !== -1) {
                        cloneRoadmap[roadmapIndex].ideas = cloneIdea
                        setRoadmapList(cloneRoadmap);
                    }
                    if (isNoStatus) {
                        setNoStatus(cloneIdea)
                    }
                }
            }
            toast({description: 'Comment delete successfully'})
        } else {
            toast({description: data.error})
        }
    }

    const deleteSubComment = async (id, record, index, subIndex) => {
        const data = await apiSerVice.deleteComment({id: id})
        if (data.status === 200) {
            const cloneComment = [...selectedIdea.comments];
            cloneComment[index].reply.splice(subIndex, 1);
            let selectedIdeaObj = {...selectedIdea, comments: cloneComment};
            setSelectedIdea(selectedIdeaObj)
            const indexs = ideasList.findIndex((x) => x.id === selectedIdea.id)
            if (indexs !== -1) {
                const cloneIdea = [...ideasList];
                cloneIdea[indexs] = selectedIdeaObj;
                setIdeasList(cloneIdea)
                if (isRoadmap) {
                    const cloneRoadmap = [...roadmapList]
                    const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap.id);
                    if (roadmapIndex !== -1) {
                        cloneRoadmap[roadmapIndex].ideas = cloneIdea
                        setRoadmapList(cloneRoadmap);
                    }
                    if (isNoStatus) {
                        setNoStatus(cloneIdea)
                    }
                }
            }
            toast({description: 'Comment delete successfully'})
        } else {
            toast({description: data.error})
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
        setDescription(event);
        setSelectedIdea(selectedIdea => ({...selectedIdea, description: event}))
        setFormError(formError => ({
            ...formError,
            description: formValidate("description", event)
        }));
    };

    const handleChange = (tag) => {
        const clone = selectedIdea && selectedIdea.topic && selectedIdea.topic.length ? [...selectedIdea.topic] : [];
        let index = clone.findIndex((t) => t.id === tag.id);
        if (index === -1) {
            clone.push(tag);
        } else {
            clone.splice(index, 1);
        }
        setSelectedIdea({...selectedIdea, topic: clone})
    }

    const onCreateIdea = async () => {
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
        setIsLoading(true)
        let formData = new FormData();
        let topics = [];
        (selectedIdea.topic || []).map((x) => {
            topics.push(x.id)
        })
        formData.append('title', selectedIdea.title);
        formData.append('slug_url', selectedIdea.title ? selectedIdea.title.replace(/ /g, "-").replace(/\?/g, "-") : "");
        formData.append('is_hide', selectedIdea.is_hide);
        formData.append('is_active', selectedIdea.is_active);
        formData.append('is_archive', selectedIdea.is_archive);
        formData.append('roadmap_id', selectedIdea.roadmap_id || '');
        formData.append('cover_image', selectedIdea.cover_image || "");
        formData.append('description', description);
        formData.append('topic', topics.join());
        if (selectedIdea && selectedIdea.newImage && selectedIdea.newImage.length) {
            for (var i = 0; i < selectedIdea.newImage.length; i++) {
                formData.append('images[]', selectedIdea.newImage[i]);
            }
        }
        for (var i = 0; i < deletedIdeaImage.length; i++) {
            formData.append('delete_image[]', deletedIdeaImage[i].replace('https://code.quickhunt.app/public/storage/feature_idea/', ''));
        }
        const data = await apiSerVice.updateIdea(formData, selectedIdea.id)
        if (data.status === 200) {
            let clone = [...ideasList];
            let index = clone.findIndex((x) => x.id === selectedIdea.id);
            if (index !== -1) {
                clone[index] = {
                    ...data.data,
                    comments: data && data.data && data.data.comments ? data.data.comments : []
                };
                if (isRoadmap) {
                    const cloneRoadmap = [...roadmapList]
                    const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap.id);
                    if (roadmapIndex !== -1) {
                        cloneRoadmap[roadmapIndex].ideas = clone
                        setRoadmapList(cloneRoadmap);
                    }
                    if (isNoStatus) {
                        setNoStatus(clone)
                    }
                }
            }
            setSelectedIdea({...data.data, comments: data && data.data && data.data.comments ? data.data.comments : []})
            setIdeasList(clone);
            setIsLoading(false)
            setIsEditIdea(false)
            toast({description: "Idea Update successfully"})
        } else {
            setIsLoading(false)
            toast({description: data.error})
        }
    }

    const beforeUploadRoadmapImage = async (file, files) => {
        setSelectedIdea({...selectedIdea, cover_image: file})
        let formData = new FormData();
        formData.append("cover_image", file);
        const data = await apiSerVice.updateIdea(formData, selectedIdea.id)
        if (data.status === 200) {
            let clone = [...ideasList];
            let index = clone.findIndex((x) => x.id === selectedIdea.id);

            if (index !== -1) {
                clone[index] = data.data;
                if (isRoadmap) {
                    const cloneRoadmap = [...roadmapList]
                    const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap.id);
                    if (roadmapIndex !== -1) {
                        cloneRoadmap[roadmapIndex].ideas = clone
                        setRoadmapList(cloneRoadmap);
                    }
                }
            }
            setSelectedIdea({...data.data,})
            setIdeasList(clone);
            setIsLoading(false)
            setIsEditIdea(false)
            toast({description: "Idea Update successfully"})
        } else {
            setIsLoading(false)
            toast({description: data.error})
        }
    }

    const onDeleteIdea = async () => {
        setIsLoadingSidebar("delete")
        const data = await apiService.onDeleteIdea(selectedIdea.id)
        if (data.status === 200) {
            if (isRoadmap) {
                if (isNoStatus) {
                    let clone = [...ideasList];
                    let ideaIndex = clone.findIndex((x) => x.id === selectedIdea.id);
                    clone.splice(ideaIndex, 1)
                    setSelectedIdea({})
                    setNoStatus(clone);
                    setIsNoStatus(false)
                } else {
                    const cloneRoadmap = [...roadmapList]
                    const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap.id);
                    const cloneRoadmapIdeas = [...cloneRoadmap[roadmapIndex].ideas]
                    let ideaIndex = cloneRoadmapIdeas.findIndex((x) => x.id === selectedIdea.id);
                    cloneRoadmapIdeas.splice(ideaIndex, 1);
                    cloneRoadmap[roadmapIndex].ideas = cloneRoadmapIdeas
                    setRoadmapList(cloneRoadmap)
                    setSelectedIdea({})
                    setSelectedRoadmap({})
                }

            } else {
                const clone = [...ideasList];
                const index = clone.findIndex((x) => x.id === selectedIdea.id)
                if (index !== -1) {
                    clone.splice(index, 1)
                    setIdeasList(clone)
                    setSelectedIdea({})
                }
            }

            setIsUpdateIdea(false);
            toast({description: "Idea delete successfully"})
            setIsLoadingSidebar("")
        } else {
            setIsLoadingSidebar("")
            toast({description: data.error})
        }
    }

    const deleteIdea = () =>  {
        debugger
        setOpenDelete(!openDelete)
        // Modal.confirm({
        //     title: `You really want delete this idea?`,
        //     content: 'This action can\'t be undone.',
        //     icon: "",
        //     okText: 'Delete',
        //     okType: 'danger',
        //     cancelText: 'Cancel',
        //     centered:true,
        //     onOk:onDeleteIdea,
        //     onCancel() {
        //         console.log('Cancel');
        //     },
        // });

        // return (
        //     <Fragment>
        //         <Dialog>
        //             <DialogTrigger asChild>
        //                 <Button variant="outline">You really want delete this idea?</Button>
        //             </DialogTrigger>
        //             <DialogContent className="sm:max-w-[425px]">
        //                 <DialogHeader>
        //                     <DialogTitle>Edit profile</DialogTitle>
        //                     <DialogDescription>
        //                         Make changes to your profile here. Click save when you're done.
        //                     </DialogDescription>
        //                 </DialogHeader>
        //                 <div className="grid gap-4 py-4">
        //                     <div className="grid grid-cols-4 items-center gap-4">
        //                         <Label htmlFor="name" className="text-right">
        //                             Name
        //                         </Label>
        //                         <Input
        //                             id="name"
        //                             defaultValue="Pedro Duarte"
        //                             className="col-span-3"
        //                         />
        //                     </div>
        //                     <div className="grid grid-cols-4 items-center gap-4">
        //                         <Label htmlFor="username" className="text-right">
        //                             Username
        //                         </Label>
        //                         <Input
        //                             id="username"
        //                             defaultValue="@peduarte"
        //                             className="col-span-3"
        //                         />
        //                     </div>
        //                 </div>
        //                 <DialogFooter>
        //                     <Button type="submit">Save changes</Button>
        //                 </DialogFooter>
        //             </DialogContent>
        //         </Dialog>
        //     </Fragment>
        //     )

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

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    const handlePrivateNote = () => {
        setPrivateNote(!privateNote)
    };

    const handleOpenTextField = () => {
        setOpenTextField(!openTextField)
    };

    const handleOpenReply = () => {
        setOpenRreplyTextField(!openReplyTextField)
    };

    const handleOpenPrivateReply = () => {
        setOpenPrivateRreplyTextField(!openPrivateReplyTextField)
    };

    const handleSaveText = () => {
        setOpenTextField(false);
    };

    const handleTextareaChange = (e) => {
        setTextareaValue(e.target.value);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <Fragment>
        <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
            <SheetContent className={"lg:max-w-[1101px] md:max-w-[720px] sm:max-w-[520px] p-0"}>
                <SheetHeader className={"px-[32px] py-[22px] border-b"}>
                    <X onClick={onClose} className={"cursor-pointer"}/>
                </SheetHeader>
                <div className={"lg:flex md:block overflow-auto h-[100vh]"}>
                    <div
                        className={`basis-[440px] ${theme === "dark" ? "" : "bg-muted"} border-r overflow-auto pb-[100px]`}>
                        <div className={"border-b py-4 pl-8 pr-6 flex flex-col gap-3"}>
                            <div className={"flex flex-col gap-1"}>
                                <h3 className={"text-sm font-medium"}>Status</h3>
                                <p className={"text-muted-foreground text-xs font-normal"}>Apply a status to Manage this
                                    idea on roadmap.</p>
                            </div>
                            <div className={"flex flex-col "}>
                                <RadioGroup
                                    onValueChange={(value) => onChangeStatus('roadmap_id', value)}
                                    value={selectedIdea.roadmap_id}
                                >
                                    {
                                        (roadmapStatus || []).map((x, i) => {
                                            return (
                                                <div key={i} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={x.id} id={x.id}/>
                                                    <Label className={"text-secondary-foreground text-sm font-normal"}
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
                                <div className="w-[282px] h-[128px] relative">

                                    {selectedFile ? (
                                        <>
                                            <img src={imagePreview} alt="Preview"
                                                 className="w-full h-full object-cover rounded"/>
                                            <Button
                                                variant="outline"
                                                onClick={handleRemoveImage}
                                                className={`${theme === "light" ? "text-card" : ""} w-[129px] px-4 py-2 absolute top-[50%] left-[50%] origin-center translate-x-[-50%] translate-y-[-50%] border-0 flex justify-center items-center bg-primary hover:bg-primary hover:text-card text-sm font-semibold`}
                                            >
                                                Change image
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                id="pictureInput"
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                            <label
                                                htmlFor="pictureInput"
                                                className="border-dashed w-full h-full py-[52px] inset-0 flex items-center justify-center bg-muted border border-muted-foreground rounded cursor-pointer"
                                            >
                                                <h4 className={"text-sm font-semibold"}>Upload Image</h4>
                                            </label>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={"py-4 pl-8 pr-6 flex flex-col gap-[26px]"}>
                            <div className={"flex flex-wrap gap-1 justify-between"}>
                                <div className={"flex flex-col gap-1"}>
                                    <h4 className={"text-sm font-medium"}>Mark as bug</h4>
                                    <p className={"text-muted-foreground text-xs font-normal"}>Hides Idea from your
                                        users</p>
                                </div>
                                <Button
                                    variant={"outline"}
                                    className={`hover:bg-muted w-[132px] ${theme === "dark" ? "" : "border-card-foreground text-muted-foreground"} text-sm font-semibold`}
                                    onClick={() => onChangeStatus({name: "is_active",value: selectedIdea.is_active === 1 ? 0 : 1})}
                                >
                                    {selectedIdea.is_active === 0 ? "Convert to Idea": "Mark as bug"}
                                </Button>
                            </div>
                            <div className={"flex flex-wrap gap-1 justify-between"}>
                                <div className={"flex flex-col gap-1"}>
                                    <h4 className={"text-sm font-medium"}>Archive</h4>
                                    <p className={"text-muted-foreground text-xs font-normal"}>Remove Idea from Board
                                        and Roadmap</p>
                                </div>
                                <Button
                                    variant={"outline"}
                                    className={`w-[100px] hover:bg-muted ${theme === "dark" ? "" : "border-card-foreground text-muted-foreground"} text-sm font-semibold`}
                                    onClick={() => onChangeStatus({name: "is_archive",value: selectedIdea.is_archive === 1 ? 0 : 1})}
                                >
                                    {selectedIdea.is_archive === 1 ? "Unarchive" : "Archive"}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className={"basis-[661px] overflow-auto"}>

                        {
                            isEditIdea ?
                                <div className={"pb-100px"}>
                                    <div className={"py-6 px-8 flex flex-col gap-6 border-b"}>
                                        <div className="items-center gap-1.5">
                                            <Label htmlFor="text">Title</Label>
                                            <Input type="text" id="text" placeholder="" value={selectedIdea.title}
                                                   name={"title"} onChange={onChangeText}/>
                                            {
                                                formError.title &&
                                                <span className="text-red-500 text-sm">{formError.title}</span>
                                            }
                                        </div>
                                        <div className="gap-1.5">
                                            <Label htmlFor="message">Description</Label>
                                            <Textarea placeholder="Start writing..." id="message"
                                                      value={description}
                                                      onChange={handleUpdate}
                                            />
                                            {formError.description &&
                                            <span className="text-red-500 text-sm">{formError.description}</span>}
                                        </div>
                                    </div>
                                    <div className={"py-6 px-8 border-b"}>
                                        <Label>Choose Topics for this Idea (optional)</Label>
                                        <Select>
                                            <SelectTrigger className="">
                                                <SelectValue placeholder="Select topic"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {
                                                        (topicLists || []).map((x, i) => {
                                                            return (
                                                                <SelectItem key={i} value={x.id}>{x.title}</SelectItem>
                                                            )
                                                        })
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className={"p-8 flex gap-6"}>
                                        <Button
                                            className={"py-2 px-6 text-sm font-semibold"}
                                            onClick={onCreateIdea}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            variant={"outline hover:bg-transparent"}
                                            className={"border border-primary py-2 px-6 text-sm font-semibold"}
                                            onClick={()=> setIsEditIdea(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                                :
                                <Fragment>
                                    <div className={"py-6 px-8"}>
                                        <div className={"flex flex-col gap-6"}>
                                            <div className={"flex justify-between items-center"}>
                                                <div className={"flex gap-2"}>
                                                    <div className={"flex flex-col gap-2"}>
                                                        <Button
                                                            className={"p-[7px] bg-white shadow border hover:bg-white w-[30px] h-[30px]"}
                                                            variant={"outline"}
                                                            onClick={() => giveVote(selectedIdea, 1)}
                                                        >
                                                            <ArrowBigUp
                                                                className={"fill-primary stroke-primary"}/>
                                                        </Button>
                                                        <Button
                                                            className={"p-[7px] bg-white shadow border hover:bg-white w-[30px] h-[30px]"}
                                                            variant={"outline"}
                                                            onClick={() => giveVote(selectedIdea, 0)}
                                                        >
                                                            <ArrowBigDown className={"stroke-primary"}/>
                                                        </Button>
                                                    </div>
                                                    <p className={"text-xl font-medium"}>{selectedIdea.vote}</p>
                                                </div>
                                                <div className={"flex gap-2"}>
                                                    {
                                                        selectedIdea.is_edit === 1 ?
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
                                                        className={"w-[30px] h-[30px] p-1"}
                                                        onClick={() => onChangeStatus("pin_to_top", selectedIdea.pin_to_top === 0 ? 1 : 0)}
                                                    >
                                                        {selectedIdea.pin_to_top == 0 ? <PinOff className={"w-[16px] h-[16px]"}/> : <Pin className={"w-[16px] h-[16px]"}/>}
                                                    </Button>
                                                    <Button
                                                        variant={"outline"}
                                                        className={"w-[30px] h-[30px] p-1"}
                                                        onClick={deleteIdea}
                                                        loading={isLoadingSidebar === "delete"}
                                                    >
                                                        <Trash2 className={"w-[16px] h-[16px]"}/>
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className={"flex flex-col gap-4"}>
                                                <div className={"flex items-center gap-2"}>
                                                    {selectedIdea.pin_to_top === 1 && <span className={"text-xs flex gap-1 p-1 bg-orange-500/10 border border-amber-300"}><Pin className={"w-[16px] h-[16px]"}/>Pinned</span>}
                                                    <h2 className={"text-xl font-medium"}>{selectedIdea.title}</h2>
                                                </div>
                                                <div className={"description-container text-sm text-muted-foreground"}>
                                                    <ReadMoreText html={selectedIdea.description}/>
                                                </div>
                                            </div>
                                            <div className={"flex items-center"}>
                                                <div className={"flex items-center gap-4"}>
                                                    <div className={"flex items-center gap-2"}>
                                                        <Avatar className={"w-[20px] h-[20px]"}>
                                                            {
                                                                selectedIdea.user_photo ?
                                                                    <AvatarImage src={selectedIdea.user_photo}
                                                                                 alt="@shadcn"/>
                                                                    :
                                                                    <AvatarFallback>{selectedIdea.name}</AvatarFallback>
                                                            }
                                                        </Avatar>
                                                        <div className={"flex items-center"}>
                                                            <h4 className={"text-sm font-medium"}>{selectedIdea.name}</h4>
                                                            <p className={"text-sm font-normal flex items-center text-muted-foreground"}>
                                                                <Dot
                                                                    className={"fill-text-card-foreground stroke-text-card-foreground"}/>
                                                                {moment(selectedIdea.created_at).format('D MMM')}
                                                            </p>
                                                        </div>
                                                        {
                                                            selectedIdea && selectedIdea.vote_list && selectedIdea.vote_list.length ?
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <Button variant="outline">Open popover</Button>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-80">
                                                                        <div className="grid gap-4">
                                                                            <div className="space-y-2">
                                                                                <h4 className="font-medium leading-none">Dimensions</h4>
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    Set the dimensions for the layer.
                                                                                </p>
                                                                            </div>
                                                                            <div className="grid gap-2">
                                                                                <div
                                                                                    className="grid grid-cols-3 items-center gap-4">
                                                                                    <Label htmlFor="width">Width</Label>
                                                                                    <Input
                                                                                        id="width"
                                                                                        defaultValue="100%"
                                                                                        className="col-span-2 h-8"
                                                                                    />
                                                                                </div>
                                                                                <div
                                                                                    className="grid grid-cols-3 items-center gap-4">
                                                                                    <Label htmlFor="maxWidth">Max.
                                                                                        width</Label>
                                                                                    <Input
                                                                                        id="maxWidth"
                                                                                        defaultValue="300px"
                                                                                        className="col-span-2 h-8"
                                                                                    />
                                                                                </div>
                                                                                <div
                                                                                    className="grid grid-cols-3 items-center gap-4">
                                                                                    <Label
                                                                                        htmlFor="height">Height</Label>
                                                                                    <Input
                                                                                        id="height"
                                                                                        defaultValue="25px"
                                                                                        className="col-span-2 h-8"
                                                                                    />
                                                                                </div>
                                                                                <div
                                                                                    className="grid grid-cols-3 items-center gap-4">
                                                                                    <Label htmlFor="maxHeight">Max.
                                                                                        height</Label>
                                                                                    <Input
                                                                                        id="maxHeight"
                                                                                        defaultValue="none"
                                                                                        className="col-span-2 h-8"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </PopoverContent>
                                                                </Popover>
                                                                : ""
                                                        }
                                                    </div>
                                                    <Select>
                                                        <SelectTrigger className="w-[234px] h-[24px] px-3 py-1">
                                                            <SelectValue className={"text-xs"}
                                                                         placeholder="Under consideration"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {
                                                                    (roadmapStatus || []).map((x, i) => {
                                                                        return (
                                                                            <SelectItem key={i} value={x.id}>
                                                                                <div
                                                                                    className={"flex items-center gap-2"}>
                                                                                    <Circle fill={x.color_code}
                                                                                            stroke={x.color_code}
                                                                                            className={` w-[10px] h-[10px]`}/>
                                                                                    {x.title}
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
                                                <div className="grid w-full gap-1.5">
                                                    <Label htmlFor="message">Add comment</Label>
                                                    {
                                                        privateNote ?
                                                            <Card
                                                                className={`shadow-none ${theme === "dark" ? "" : "border-amber-300"}`}>
                                                                <div
                                                                    className={`text-xs text-card-foreground font-normal py-1 px-3 ${theme === "dark" ? "" : "bg-orange-100"} rounded-tl-md rounded-tr-md`}>Add
                                                                    a private note for your team
                                                                </div>
                                                                <Textarea
                                                                    className={"rounded-tl-none rounded-tr-none"}
                                                                    placeholder="Private Start writing..."
                                                                    id="message"
                                                                    value={commentText}
                                                                    onChange={(e) => setCommentText(e.target.value)}
                                                                />
                                                            </Card>
                                                            :
                                                            <>
                                                                <Textarea
                                                                    className={""}
                                                                    placeholder="Start writing..."
                                                                    id="message"
                                                                    value={comment}
                                                                    // onChange={handleCommentChange}
                                                                    onChange={(e) => setCommentText(e.target.value)}
                                                                />
                                                                {
                                                                    commentFiles && commentFiles.length ?
                                                                        <div>
                                                                            {
                                                                                (commentFiles || []).map((x, i) => {
                                                                                    return (
                                                                                        <div>
                                                                                            {
                                                                                                x && x.name ?
                                                                                                    <div
                                                                                                        className='bgTransparent image_fix_height bgTransparent-border'>
                                                                                                        <div
                                                                                                            className="img-delete">
                                                                                                            <Button
                                                                                                                shape="circle"
                                                                                                                icon={
                                                                                                                    <CircleX/>}
                                                                                                                onClick={() => onDeleteImageComment(i, false)}/>
                                                                                                        </div>
                                                                                                        <img
                                                                                                            src={x && x.name ? URL.createObjectURL(x) : x}
                                                                                                            alt=""/>
                                                                                                    </div> : x ?
                                                                                                    <div
                                                                                                        className='bgTransparent image_fix_height bgTransparent-border'>
                                                                                                        <div
                                                                                                            className="img-delete">
                                                                                                            <Button
                                                                                                                shape="circle"
                                                                                                                icon={
                                                                                                                    <CircleX/>}
                                                                                                                onClick={() => onDeleteImageComment(i, false)}/>
                                                                                                        </div>
                                                                                                        <img src={x}
                                                                                                             alt={x}/>
                                                                                                    </div> : ''
                                                                                            }
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                        : ""
                                                                }
                                                            </>
                                                    }
                                                </div>
                                                <div className={"flex justify-between gap-1"}>
                                                    <div className="flex items-center space-x-2">
                                                        <Switch id="airplane-mode" onCheckedChange={handlePrivateNote}/>
                                                        <Label htmlFor="airplane-mode"
                                                               className={"text-sm font-medium"}>Private note</Label>
                                                    </div>
                                                    <div className={"flex gap-2 items-center"}>
                                                        <div className="p-2 max-w-sm relative w-[36px] h-[36px]">
                                                            <Input id="commentFileInput" type="file"
                                                                   className="hidden"/>
                                                            <label htmlFor="commentFileInput"
                                                                   className="absolute inset-0 flex items-center justify-center bg-white border border-primary rounded cursor-pointer">
                                                                <Paperclip className={"stroke-primary"}/>
                                                            </label>
                                                        </div>
                                                        <Button
                                                            className={"w-[128px] h-[36px] text-sm font-semibold"}
                                                            // onClick={handleAddComments}
                                                            onClick={onCreateComment}
                                                            loading={isSaveComment}
                                                            disabled={commentText.trim() === "" || commentText === ""}
                                                        >
                                                            Add Comment
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"pb-[100px]"}>
                                        <Tabs defaultValue="comment" className="">
                                            <div className={"px-8"}>
                                                <TabsList
                                                    className="bg-transparent border-b-2 border-b-primary rounded-none">
                                                    <TabsTrigger value="comment">Comment</TabsTrigger>
                                                </TabsList>
                                            </div>

                                            {
                                                privateNote ?
                                                    <TabsContent value="comment"
                                                                 className={`${theme === "dark" ? "" : "bg-orange-100"}`}>
                                                        <div className={"flex gap-2 p-[32px]"}>
                                                            <Avatar className={"w-[20px] h-[20px]"}>
                                                                <AvatarImage src="https://github.com/shadcn.png"
                                                                             alt="@shadcn"/>
                                                                <AvatarFallback>CN</AvatarFallback>
                                                            </Avatar>
                                                            <div className={"w-full flex flex-col gap-3"}>
                                                                <div className={"flex justify-between"}>
                                                                    <div className={"flex items-center"}>
                                                                        <h4 className={"text-sm font-medium"}>Ankesh
                                                                            Ramani</h4>
                                                                        <p className={"text-sm font-normal flex items-center text-muted-foreground"}>
                                                                            <Dot
                                                                                className={"fill-text-card-foreground stroke-text-card-foreground"}/>2
                                                                            minutes ago</p>
                                                                    </div>
                                                                    <div className={"flex gap-2"}>
                                                                        <Button variant={"outline"}
                                                                                className={"w-[30px] h-[30px] p-1"}><Pencil
                                                                            className={"w-[16px] h-[16px]"}/></Button>
                                                                        <Button variant={"outline"}
                                                                                className={"w-[30px] h-[30px] p-1"}><Pin
                                                                            className={"w-[16px] h-[16px]"}/></Button>
                                                                        <Button variant={"outline"}
                                                                                className={"w-[30px] h-[30px] p-1"}><Trash2
                                                                            className={"w-[16px] h-[16px]"}/></Button>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p className={"text-sm font-normal text-muted-foreground"}>All
                                                                        great things around
                                                                        you were not built in a day, some took weeks,
                                                                        quite a
                                                                        few of them took months and a rare few even
                                                                        decades. As
                                                                        builders, our quest is to reach for that perfect
                                                                        product
                                                                        that solves your problems and adds value to your
                                                                        lives,
                                                                        and we too realise it will be a journey of minor
                                                                        and
                                                                        major improvements made day after day....<span
                                                                            className={"text-primary text-sm font-semibold"}>Read more</span>
                                                                    </p>
                                                                </div>
                                                                <div className={"flex justify-between"}>
                                                                    <Button variant={"ghost hover:bg-none"}
                                                                            onClick={handleOpenPrivateReply}
                                                                            className={"p-0 h-[25px] text-primary font-semibold text-sm"}>Reply</Button>
                                                                    <Button variant={"ghost hover:bg-none"}
                                                                            className={"p-0 h-[25px] font-normal text-sm flex gap-1"}><Lock
                                                                        className={"w-[16px] h-[16px]"}/>Private
                                                                        note</Button>
                                                                </div>
                                                                {
                                                                    openPrivateReplyTextField && (
                                                                        <div className={"flex flex-col gap-2"}>
                                                                            <Textarea
                                                                                className={""}
                                                                                placeholder="Start writing..."
                                                                            />
                                                                            <div className={"flex gap-2 items-center"}>
                                                                                <Button
                                                                                    className={"w-[70px] h-[30px] text-sm font-semibold"}>Reply</Button>
                                                                                <div
                                                                                    className="p-2 max-w-sm relative w-[36px] h-[30px]">
                                                                                    <Input id="commentFileInput"
                                                                                           type="file"
                                                                                           className="hidden" /*onChange={handleFileChangeTextarea}*/ />
                                                                                    <label htmlFor="commentFileInput"
                                                                                           className="absolute inset-0 flex items-center justify-center bg-white border border-primary rounded cursor-pointer">
                                                                                        <Paperclip
                                                                                            className={"stroke-primary"}/>
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                    </TabsContent>
                                                    :
                                                    ""
                                            }
                                            <TabsContent value="comment"
                                                         className={`${theme === "dark" ? "" : "bg-muted"}`}>
                                                {
                                                    selectedIdea && selectedIdea.comments && selectedIdea.comments.length > 0 ?
                                                        (selectedIdea.comments || []).map((x, i) => {
                                                            return (
                                                                <Fragment>
                                                                    {
                                                                        selectedCommentIndex === i ? "" :
                                                                            <Button className="p-0"
                                                                                    onClick={() => onShowSubComment(i)}
                                                                                    key={`comment-nested-reply-to-${i}`}>Reply</Button>
                                                                    }
                                                                    <div className={"flex gap-2 p-[32px]"}>
                                                                        <Avatar className={"w-[20px] h-[20px]"}>
                                                                            <AvatarImage
                                                                                src="https://github.com/shadcn.png"
                                                                                alt="@shadcn"/>
                                                                            <AvatarFallback>CN</AvatarFallback>
                                                                        </Avatar>
                                                                        <div className={"w-full flex flex-col gap-3"}>
                                                                            <div className={"flex justify-between"}>
                                                                                <div className={"flex items-center"}>
                                                                                    <h4 className={"text-sm font-medium"}>{x.name}</h4>
                                                                                    <p className={"text-sm font-normal flex items-center text-muted-foreground"}>
                                                                                        <Dot
                                                                                            className={"fill-text-card-foreground stroke-text-card-foreground"}/>
                                                                                        {moment.utc(x.created_at).local().startOf('seconds').fromNow()}
                                                                                    </p>
                                                                                </div>
                                                                                <div className={"flex gap-2"}>
                                                                                    <Button variant={"outline"}
                                                                                            className={"w-[30px] h-[30px] p-1"}
                                                                                            onClick={handleOpenTextField}><Pencil
                                                                                        className={"w-[16px] h-[16px]"}/></Button>
                                                                                    <Button variant={"outline"}
                                                                                            className={"w-[30px] h-[30px] p-1"}><Pin
                                                                                        className={"w-[16px] h-[16px]"}/></Button>
                                                                                    <Button variant={"outline"}
                                                                                            className={"w-[30px] h-[30px] p-1"}><Trash2
                                                                                        className={"w-[16px] h-[16px]"}/></Button>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                {
                                                                                    selectedCommentIndex === i && isEditComment ?
                                                                                        <div
                                                                                            className={"flex flex-col gap-2"}>
                                                                                            <Textarea
                                                                                                placeholder="Start writing..."
                                                                                                value={selectedComment.comment}
                                                                                                onChange={(e) => setSelectedComment({
                                                                                                    ...selectedComment,
                                                                                                    comment: e.target.value
                                                                                                })}
                                                                                                // value={textareaValue}
                                                                                                // onChange={handleTextareaChange}
                                                                                            />
                                                                                            <div
                                                                                                className={"flex gap-2 items-center"}>
                                                                                                <Button
                                                                                                    className={"w-[70px] h-[30px] text-sm font-semibold"}
                                                                                                    // onClick={handleSaveText}
                                                                                                    onClick={onUpdateComment}
                                                                                                    loading={isSaveUpdateComment}
                                                                                                    disabled={selectedComment.comment.trim() === "" || selectedComment.comment === ""}
                                                                                                >
                                                                                                    Save
                                                                                                </Button>
                                                                                                <Button
                                                                                                    variant={"outline hover:transparent"}
                                                                                                    className={`border ${theme === "dark" ? "" : "border-primary"} w-[90px] h-[30px] text-sm font-semibold`}
                                                                                                    // onClick={() => setIsEditing(false)}
                                                                                                    onClick={onCancelComment}
                                                                                                >
                                                                                                    Cancel
                                                                                                </Button>
                                                                                                <div
                                                                                                    className="p-2 max-w-sm relative w-[36px] h-[30px]">
                                                                                                    <Input
                                                                                                        id="commentFileInput"
                                                                                                        type="file"
                                                                                                        className="hidden" /*onChange={handleFileChangeTextarea}*/ />
                                                                                                    <label
                                                                                                        htmlFor="commentFileInput"
                                                                                                        className="absolute inset-0 flex items-center justify-center bg-white border border-primary rounded cursor-pointer">
                                                                                                        <Paperclip
                                                                                                            className={"stroke-primary"}/>
                                                                                                    </label>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        :
                                                                                        <p className={"text-sm font-normal text-muted-foreground"}>
                                                                                            {/*{textareaValue || (*/}
                                                                                            {/*    <>*/}
                                                                                            {/*        All great things around you were not*/}
                                                                                            {/*        built in a day, some took weeks, quite a*/}
                                                                                            {/*        few of them*/}
                                                                                            {/*        took months and a rare few even decades.*/}
                                                                                            {/*        As builders, our quest is to reach for*/}
                                                                                            {/*        that*/}
                                                                                            {/*        perfect product that solves your*/}
                                                                                            {/*        problems and adds value to your lives,*/}
                                                                                            {/*        and we too realize*/}
                                                                                            {/*        it will be a journey of minor and major*/}
                                                                                            {/*        improvements made day after day....*/}
                                                                                            {/*        <span*/}
                                                                                            {/*            className="text-primary text-sm font-semibold">Read more</span>*/}
                                                                                            {/*    </>*/}
                                                                                            {/*)}*/}
                                                                                            {x.comment}
                                                                                        </p>
                                                                                }
                                                                            </div>
                                                                            {
                                                                                x.show_reply ?
                                                                                    <div>
                                                                                        {
                                                                                            (x.reply || []).map((y, j) => {
                                                                                                return (
                                                                                                    <Fragment>
                                                                                                        <div>
                                                                                                            <Avatar
                                                                                                                className={"w-[20px] h-[20px]"}>
                                                                                                                <AvatarImage
                                                                                                                    src="https://github.com/shadcn.png"
                                                                                                                    alt="@shadcn"/>
                                                                                                                <AvatarFallback>CN</AvatarFallback>
                                                                                                            </Avatar>
                                                                                                            <h2>{y.name}</h2>
                                                                                                            <p>{moment.utc(y.created_at).local().startOf('seconds').fromNow()}</p>
                                                                                                        </div>
                                                                                                        {
                                                                                                            selectedCommentIndex === i && selectedSubCommentIndex === j ?
                                                                                                                <div
                                                                                                                    className={"flex flex-col gap-2"}>
                                                                                                                    <Textarea
                                                                                                                        placeholder="Start writing..."
                                                                                                                        value={selectedSubComment.comment}
                                                                                                                        onChange={(e) => onChangeTextSubComment(e)}
                                                                                                                        // value={textareaValue}
                                                                                                                        // onChange={handleTextareaChange}
                                                                                                                    />
                                                                                                                    <div
                                                                                                                        className={"flex gap-2 items-center"}>
                                                                                                                        <Button
                                                                                                                            className={"w-[70px] h-[30px] text-sm font-semibold"}
                                                                                                                            // onClick={handleSaveText}
                                                                                                                            onClick={onUpdateSubComment}
                                                                                                                            loading={isSaveUpdateSubComment}
                                                                                                                            disabled={selectedSubComment.comment.trim() === "" || selectedSubComment.comment === ""}
                                                                                                                        >
                                                                                                                            Save
                                                                                                                        </Button>
                                                                                                                        <Button
                                                                                                                            variant={"outline hover:transparent"}
                                                                                                                            className={`border ${theme === "dark" ? "" : "border-primary"} w-[90px] h-[30px] text-sm font-semibold`}
                                                                                                                            // onClick={() => setIsEditing(false)}
                                                                                                                            onClick={onCancelSubComment}
                                                                                                                        >
                                                                                                                            Cancel
                                                                                                                        </Button>
                                                                                                                        <div
                                                                                                                            className="p-2 max-w-sm relative w-[36px] h-[30px]">
                                                                                                                            <Input
                                                                                                                                id="commentFileInput"
                                                                                                                                type="file"
                                                                                                                                className="hidden" /*onChange={handleFileChangeTextarea}*/ />
                                                                                                                            <label
                                                                                                                                htmlFor="commentFileInput"
                                                                                                                                className="absolute inset-0 flex items-center justify-center bg-white border border-primary rounded cursor-pointer">
                                                                                                                                <Paperclip
                                                                                                                                    className={"stroke-primary"}/>
                                                                                                                            </label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                : <div>
                                                                                                                    <p className="mb-1">
                                                                                                                        {y.comment}
                                                                                                                    </p>
                                                                                                                </div>
                                                                                                        }
                                                                                                    </Fragment>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </div>
                                                                                    : ""
                                                                            }
                                                                            <div>
                                                                                <Button variant={"ghost hover:bg-none"}
                                                                                        onClick={handleOpenReply}
                                                                                        className={"p-0 h-[25px] text-primary font-semibold text-sm"}>Reply</Button>
                                                                            </div>

                                                                            {
                                                                                openReplyTextField && (
                                                                                    <div
                                                                                        className={"flex flex-col gap-2"}>
                                                                                        <Textarea
                                                                                            className={""}
                                                                                            placeholder="Start writing..."
                                                                                        />
                                                                                        <div
                                                                                            className={"flex gap-2 items-center"}>
                                                                                            <Button
                                                                                                className={"w-[70px] h-[30px] text-sm font-semibold"}>Reply</Button>
                                                                                            <div
                                                                                                className="p-2 max-w-sm relative w-[36px] h-[30px]">
                                                                                                <Input
                                                                                                    id="commentFileInput"
                                                                                                    type="file"
                                                                                                    className="hidden" /*onChange={handleFileChangeTextarea}*/ />
                                                                                                <label
                                                                                                    htmlFor="commentFileInput"
                                                                                                    className="absolute inset-0 flex items-center justify-center bg-white border border-primary rounded cursor-pointer">
                                                                                                    <Paperclip
                                                                                                        className={"stroke-primary"}/>
                                                                                                </label>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )
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
            {
                openDelete &&
                    <Fragment>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">You really want delete this idea?</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit profile</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your profile here. Click save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            defaultValue="Pedro Duarte"
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="username" className="text-right">
                                            Username
                                        </Label>
                                        <Input
                                            id="username"
                                            defaultValue="@peduarte"
                                            className="col-span-3"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </Fragment>
            }
        </Sheet>
        </Fragment>
    );
};

export default SidebarSheet;