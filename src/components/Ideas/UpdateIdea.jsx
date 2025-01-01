import React, {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {Button} from "../ui/button";
import {ArrowBigUp, Check, Circle, CirclePlus, CircleX, Dot, Ellipsis, Loader2, Mail, MessageCircleMore, Paperclip, Trash2, User, X} from "lucide-react";
import {RadioGroup, RadioGroupItem} from "../ui/radio-group";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Avatar, AvatarFallback} from "../ui/avatar";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {Textarea} from "../ui/textarea";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "../ui/dialog";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {useTheme} from "../theme-provider";
import {useToast} from "../ui/use-toast";
import {ApiService} from "../../utils/ApiService";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../ui/dropdown-menu";
import ReactQuillEditor, {DisplayReactQuill} from "../Comman/ReactQuillEditor";
import {useLocation, useParams} from "react-router-dom";
import {cleanQuillHtml} from "../../utils/constent";
import {Skeleton} from "../ui/skeleton";
import CommonBreadCrumb from "../Comman/CommonBreadCrumb";
import ImageUploader from "../Comman/ImageUploader";
import {ActionButtons, CommentEditor, SaveCancelButton, StatusButtonGroup, UploadButton, UserAvatar} from "../Comman/CommentEditor";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../ui/command";
import {debounce} from "lodash";
import EmptyData from "../Comman/EmptyData";
import Pagination from "../Comman/Pagination";
import {inboxMarkReadAction} from "../../redux/action/InboxMarkReadAction";

const perPageLimit = 10

const initialStateError = {
    title: "",
    description: "",
    board: "",
}

const initialUserError = {
    customer_email_id: "",
    customer_name: "",
}

const initialStateUser = {
    project_id: '',
    customer_name: '',
    customer_email_id: '',
    customer_email_notification: false,
    customer_first_seen: '',
    customer_last_seen: '',
    user_browser: '',
    user_ip_address : '',
}

const pathUrl = "https://code.quickhunt.app/public/storage/feature_idea/";

const UpdateIdea = () => {
    const location = useLocation();
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo") || 1;
    const {theme} = useTheme()
    let apiSerVice = new ApiService();
    const {toast} = useToast();
    const { id } = useParams();
    const dispatch = useDispatch();
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const inboxMarkReadReducer = useSelector(state => state.inboxMarkRead);

    const [pageNo, setPageNo] = useState(Number(getPageNo));
    const [totalRecord, setTotalRecord] = useState(0);
    const [formError, setFormError] = useState(initialStateError);
    const [userDetailError, setUserDetailError] = useState(initialUserError);
    const [topicLists, setTopicLists] = useState([]);
    const [commentFiles, setCommentFiles] = useState([])
    const [subCommentFiles, setSubCommentFiles] = useState([])
    const [deletedCommentImage, setDeletedCommentImage] = useState([])
    const [deletedSubCommentImage, setDeletedSubCommentImage] = useState([])
    const [roadmapStatus, setRoadmapStatus] = useState([]);
    const [selectedIdea, setSelectedIdea] = useState({}); // update idea
    const [oldSelectedIdea, setOldSelectedIdea] = useState({});
    const [commentText, setCommentText] = useState("")
    const [subCommentText, setSubCommentText] = useState("")
    const [subCommentTextEditIdx, setSubCommentTextEditIdx] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCreateIdea, setIsLoadingCreateIdea] = useState(false);
    const [isLoadingArchive, setIsLoadingArchive] = useState(false);
    const [isLoadingBug, setIsLoadingBug] = useState(false);
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
    const [filter, setFilter] = useState({search: "", project_id: projectDetailsReducer.id});
    const [usersDetails, setUsersDetails] = useState(initialStateUser);
    const [ideasVoteList, setIdeasVoteList] = useState([]);
    const [getAllUsersList, setGetAllUsersList] = useState([]);
    const [addUserDialog, setAddUserDialog] = useState({addUser: false, viewUpvote: false});
    const [deleteId,setDeleteId]=useState(null);

    const openDialogs = (name, value) => {
        setAddUserDialog(prev => ({...prev, [name]: value}));
        handlePopoverOpenChange();
        if (!value){
            getSingleIdea();
        }
    }

    const handlePopoverOpenChange = (isOpen) => {
        if (!isOpen) {
            setGetAllUsersList([]);
            setUsersDetails(initialStateUser);
            setUserDetailError(initialUserError)
            setFilter({ search: '', project_id: null });
        }
    };

    const getIdeaVotes = async (name, value) => {
        setIsLoading(true);
        const payload = {
            feature_idea_id: selectedIdea.id,
            page: pageNo,
            limit: perPageLimit
        }
        const data = await apiSerVice.getIdeaVote(payload)
        if(data.status === 200) {
            setIdeasVoteList(data.data)
            setTotalRecord(data.total)
            setSelectedIdea({...selectedIdea, vote:data.total})
            setAddUserDialog(prev => ({...prev, [name]: value}))
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if(addUserDialog.viewUpvote){
            getIdeaVotes()
        }
    },[addUserDialog.viewUpvote, pageNo])

    const totalPages = Math.ceil(totalRecord / perPageLimit);

    const handlePaginationClick = async (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setIsLoading(true);
            setPageNo(newPage);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (projectDetailsReducer.id) {
            setTopicLists(allStatusAndTypes.topics)
            setRoadmapStatus(allStatusAndTypes.roadmap_status)
            getSingleIdea()
        }
    }, [projectDetailsReducer.id, allStatusAndTypes, getPageNo]);

    const getAllUsers = async (value,project_id) => {
        const payload = {
            project_id: project_id,
            search: value,
        }
        const data = await apiSerVice.getAllUsers(payload);
        if (data.status === 200) {
            setGetAllUsersList(data.data)
        }
    };

    const throttledDebouncedSearch = useCallback(
        debounce((value, project_id) => {
            getAllUsers(value, project_id);
        }, 500),
        []
    );

    const handleSearchChange = (value) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            search: value,
            project_id: projectDetailsReducer.id,
        }));
        throttledDebouncedSearch(value, projectDetailsReducer.id);
    };

    const addUser = async () => {
        let validationErrors = {};
        Object.keys(usersDetails).forEach(name => {
            const error = formValidate(name, usersDetails[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setUserDetailError(validationErrors);
            return;
        }
        setIsLoading(true);
        const payload = {
            ...usersDetails,
            project_id: projectDetailsReducer.id,
            customer_first_seen: new Date(),
            customer_last_seen: new Date(),
        }
        const data = await apiSerVice.createUsers(payload)
        if(data.status === 200) {
            const newUser  = {
                id: data.data.id,
                name: data.data.customer_name,
                customer_first_name: null,
                email: data.data.customer_email_id,
                user_photo: null,
            };
            const clone = [...ideasVoteList];
            const filterEmail = clone.some((x) => x.email === newUser.email)
            if(filterEmail) {
                toast({description: "User with this email already exist.", variant: "destructive",})
            } else {
                // clone.unshift(newUser);
            }
            setIdeasVoteList(clone);
            setPageNo(1);
            setSelectedIdea(prev => ({
                ...prev,
                vote_list: clone
            }));
            const upvoteResponse = await apiSerVice.userManualUpVote({
                feature_idea_id: selectedIdea.id,
                user_id: data.data.id,
            });
            if(upvoteResponse.status === 200) {
                toast({description: upvoteResponse.message,});
            } else {
                toast({description:upvoteResponse.message, variant: "destructive",})
            }
            setUserDetailError(initialUserError);
            getIdeaVotes();
        } else {
            toast({description:data.message, variant: "destructive",})
        }
            setIsLoading(false);
        openDialogs("addUser", false);
    };

    const onDeleteUser = async (id, index) => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        const payload = {
            id: id,
            feature_idea_id: selectedIdea.id
        }
        const data = await apiSerVice.removeUserVote(payload)
        let clone = [...ideasVoteList];
        if(data.status === 200) {
            clone.splice(index,1);
            setIdeasVoteList(clone);
            toast({description: data.message});
            const filterData = (selectedIdea?.vote_list || []).filter((x) => x.id !== id)
            setSelectedIdea(prev => ({
                ...prev,
                vote_list: filterData,
                vote: filterData.length
            }));
            if (clone.length === 0 && pageNo > 1) {
                setPageNo(pageNo - 1);
                await getIdeaVotes(pageNo - 1);
            } else {
                await getIdeaVotes(pageNo);
            }
        } else {
            toast({description: data.message, variant: "destructive",});
        }
        setIsLoading(false);
        setDeleteId(null);
    };

    const handleUserClick = async (user) => {
        const selectedUser = getAllUsersList.find((u) => u.customer_name === user.customer_name);
        if (selectedUser) {
            const updatedVoteList = [...ideasVoteList];
            const existingUserIndex = updatedVoteList.findIndex((u) => u.name === selectedUser.customer_name);

            if (existingUserIndex !== -1) {
                toast({ description: "User  already exists in the upvote list.", variant: "destructive" });
                return;
            }

            if (existingUserIndex === -1) {
                const newUserPayload = {
                    name: selectedUser.customer_name,
                    id: '',
                    user_photo: '',
                    email: selectedUser.customer_email_id,
                };
                updatedVoteList.push(newUserPayload);
                const upvoteResponse = await apiSerVice.userManualUpVote({
                    feature_idea_id: selectedIdea.id,
                    user_id: selectedUser.id,
                });
                if(upvoteResponse.status === 200) {
                    toast({description: upvoteResponse.message,});
                    setPageNo(1);
                } else {
                    toast({description:upvoteResponse.message, variant: "destructive",})
                }
            } else {
                updatedVoteList.splice(existingUserIndex, 1);
            }
            setIdeasVoteList(updatedVoteList);
            getIdeaVotes();
        }
    };

    const listRef = useRef(null);
    const handleWheelScroll = (event) => {
        if (listRef.current) {
            listRef.current.scrollTop += event.deltaY;
        }
    };
    const handleTouchScroll = (e) => {
        e.stopPropagation();
    };

    const getSingleIdea = async () => {
        setIsLoading(true)
        const data = await apiSerVice.getSingleIdea(id);
        if (data.status === 200) {
            setIsLoading(false)
            const ideaData = {...data.data, is_read: 1,
                comments: data.data.comments.map(comment => ({
                    ...comment,
                    is_read: 1
                }))}
            setSelectedIdea(ideaData)
            setOldSelectedIdea(ideaData)
            const updateInbox = inboxMarkReadReducer.map(item => {
                if ((item.source === 'feature_idea_comments' || item.source === 'feature_ideas' || item.source === 'feature_idea_votes') && item.id === data.data.id) {
                    return {...item, is_read: 1};
                }
                return item;
            });

            dispatch(inboxMarkReadAction(updateInbox));

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
                        let voteIndex = vote_list.findIndex((x) => (x.name || x?.user_name) === (data.data.name || data.data?.user_name));
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
            toast({variant: "destructive", description: "You can't vote your own ideas"})
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
            clone.unshift(data.data)
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
        const updatedComments = selectedIdea.comments.map((comment, i) => ({
            ...comment,
            show_reply: i === index ? !comment.show_reply : false,
        }));
        setSelectedIdea({ ...selectedIdea, comments: updatedComments });
        if (updatedComments[index].show_reply) {
            setSubCommentTextEditIdx(index);
            setSubCommentText("");
        } else {
            setSubCommentTextEditIdx(null);
        }
    };

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
        const files = Array.from(event.target.files);
        if (selectedComment && selectedComment.id) {
            const clone = [...selectedComment.images, ...files];
            // let old = selectedComment.images && selectedComment.images.length ? [...selectedComment.images] : [];
            // const newImageClone = [...old, ...files];
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
        const files = event.target.files;
        if (selectedSubComment && selectedSubComment.id && selectedComment && selectedComment.id) {
            const clone = [...selectedSubComment.images, ...files,]
            // let old = selectedSubComment && selectedSubComment.images && selectedSubComment.images.length ? [...selectedSubComment.images] : [];
            // const newImageClone = [...old, ...files,];
            let selectedSubCommentObj = {...selectedSubComment, images: clone}
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
            setIsLoadingBug(true)
        } else if (name === "is_archive") {
            setIsLoadingArchive(true)
        }
        if (name === "delete_cover_image") {
            setSelectedIdea({...selectedIdea, cover_image: ""})
        } else {
            setSelectedIdea({...selectedIdea, [name]: value})
        }
        let formData = new FormData();
        if (name === "roadmap_id" && value === null) {
            value = "";
        }
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
            setIsLoadingBug(false)
            setIsLoadingArchive(false)
            setIsEditIdea(false)
            toast({description: data.message})
        } else {
            setIsLoading(false)
            setIsLoadingBug(false)
            setIsLoadingArchive(false)
            toast({variant: "destructive", description: data.message})
        }
    }

    const onEditComment = (record, index) => {
        setSelectedComment(record);
        setSelectedCommentIndex(index)
        // setSubCommentTextEditIdx(null);
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
        if (isOld) {
            const cloneImages = [...selectedComment.images];
            const cloneDeletedImages = [...deletedCommentImage];
            cloneDeletedImages.push(cloneImages[index].replace('https://code.quickhunt.app/public/storage/feature_idea/', ''));
            cloneImages.splice(index, 1);
            setSelectedComment({
                ...selectedComment,
                images: cloneImages,
            });
            setDeletedCommentImage(cloneDeletedImages);
        } else {
            const cloneNewImages = [...selectedComment.images];
            cloneNewImages.splice(index, 1);
            setSelectedComment({
                ...selectedComment,
                images: cloneNewImages,
            });
        }
    };

    const onDeleteSubCommentImage = (index, isOld) => {
        if (isOld) {
            const cloneImages = [...selectedSubComment.images];
            const cloneDeletedImages = [...deletedSubCommentImage];
            cloneDeletedImages.push(cloneImages[index].replace('https://code.quickhunt.app/public/storage/feature_idea/', ''));
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
                formData.append(`images[${i}]`, selectedComment.images[i]);
            }
        }
        for (let i = 0; i < deletedCommentImage.length; i++) {
            formData.append(`delete_image[${i}]`, deletedCommentImage[i].replace('https://code.quickhunt.app/public/storage/feature_idea/', ''));
        }
        formData.append('comment', selectedComment.comment);
        formData.append('id', selectedComment.id);
        const data = await apiSerVice.updateComment(formData)
        if (data.status === 200) {
            let updatedImages = Array.isArray(data.data.images) ? data.data.images : [];
            let obj = { ...selectedComment, images: updatedImages };
            // let obj = {...selectedComment, images: data.data.images, newImage: []} // old code line
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
        if (selectedSubComment && selectedSubComment.images && selectedSubComment.images.length) {
            for (let i = 0; i < selectedSubComment.images.length; i++) {
                formData.append(`images[${i}]`, selectedSubComment.images[i]);
            }
        }
        for (let i = 0; i < deletedSubCommentImage.length; i++) {
            formData.append(`delete_image[${i}]`, deletedSubCommentImage[i].replace('https://code.quickhunt.app/public/storage/feature_idea/', ''));
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
            case "customer_name":
                if (!value || value.trim() === "") {
                    return "User name is required";
                } else {
                    return "";
                }
            case "customer_email_id":
                if (value.trim() === "") return "User email is required";
                if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value))
                    return "Enter a valid email address";
                return "";
            default: {
                return "";
            }
        }
    };

    const onChangeText = (event) => {
        setSelectedIdea(selectedIdea => ({...selectedIdea, [event.target.name]: event.target.value}))
        setUsersDetails({...usersDetails, [event.target.name]: event.target.value});
        setFormError(formError => ({
            ...formError,
            [event.target.name]: formValidate(event.target.name, event.target.value)
        }));
        setUserDetailError(formError => ({
            ...formError,
            [event.target.name]: formValidate(event.target.name, event.target.value)
        }));
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
        setIsLoadingCreateIdea(true)
        let formData = new FormData();
        let topics = [];

        (selectedIdea.topic || []).map((x) => {
            topics.push(x.id)
        })
        formData.append('title', selectedIdea.title);
        formData.append('board', selectedIdea.board);
        formData.append('slug_url', selectedIdea.title ? selectedIdea.title.replace(/ /g, "-").replace(/\?/g, "-") : "");
        // formData.append('description', selectedIdea.description?.trim() === '' ? "" : selectedIdea.description);
        formData.append('description', selectedIdea.description ? selectedIdea.description : "");
        formData.append('topic', topics.join(","));

        // Handle image resizing/compression here
        if (selectedIdea.image) {
            const resizedImage = await resizeImage(selectedIdea.image); // Implement this function to resize/compress
            formData.append('image', resizedImage);
        }

        const data = await apiSerVice.updateIdea(formData, selectedIdea.id)
        if (data.status === 200) {
            setSelectedIdea({...data.data})
            setOldSelectedIdea({...data.data})
            setIsEditIdea(false)
            toast({description: data.message})
        } else {
            toast({description: data.message, variant: "destructive"})
        }
            setIsLoadingCreateIdea(false)
    }

    const resizeImage = (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const MAX_WIDTH = 800; // Set your desired max width
                const MAX_HEIGHT = 800; // Set your desired max height
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/jpeg', 0.7); // Adjust quality as needed
            };
            img.onerror = (err) => reject(err);
        });
    };

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

    const handleImageClick = (imageSrc) => {window.open(imageSrc, '_blank');};

    const links = [{ label: 'Ideas', path: `/ideas?pageNo=${getPageNo}` }];

    const handleSubCommentTextChange = (e, index) => {
        const newSubCommentText = [...subCommentText];
        newSubCommentText[index] = e.target.value;
        setSubCommentText(newSubCommentText);
    };

    return (
        <Fragment>
            {
                (addUserDialog.addUser) &&
                <Dialog open={addUserDialog.addUser} onOpenChange={(value) => openDialogs("addUser", value)}>
                    <DialogContent className={"max-w-[576px]"}>
                        <DialogHeader className={"flex-row gap-2 justify-between space-y-0 items-center"}>
                            <DialogTitle>Add new user</DialogTitle>
                            <span className={"max-w-[24px]"}><X className={"cursor-pointer m-0"} onClick={() => openDialogs("addUser", false)}/></span>
                        </DialogHeader>
                        <div className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name" className="font-normal">Email</Label>
                                <Input id="name" value={usersDetails.customer_email_id} name="customer_email_id" onChange={onChangeText} placeholder="Enter upvoter email" className="col-span-3" />
                                {userDetailError.customer_email_id && <span className="text-red-500 text-sm">{userDetailError.customer_email_id}</span>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="username" className="font-normal">Name</Label>
                                <Input id="username" value={usersDetails.customer_name} name="customer_name" onChange={onChangeText} placeholder="Enter upvoter name" className="col-span-3" />
                                {userDetailError.customer_name && <span className="text-red-500 text-sm">{userDetailError.customer_name}</span>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button className={"font-medium w-[83px]"} onClick={addUser}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add User"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            }
            {
                (addUserDialog.viewUpvote) &&
                    <Dialog open={addUserDialog.viewUpvote} onOpenChange={(value) => openDialogs("viewUpvote", value)}>
                        <DialogContent className={"max-w-[1022px] p-0 gap-0"}>
                            <DialogHeader className={"flex-row justify-between gap-2 p-3 lg:p-6 space-y-0"}>
                                <div className={"flex flex-col gap-2"}>
                                    <DialogTitle className={"font-medium"}>View & add upvoters</DialogTitle>
                                    <DialogDescription>
                                        Upvoters will receive notifications by email when you make changes to the post.
                                    </DialogDescription>
                                </div>
                                <span className={"max-w-[24px]"}><X className={"cursor-pointer m-0"} onClick={() => openDialogs("viewUpvote", false)}/></span>
                            </DialogHeader>
                            <div className={"overflow-y-auto h-full flex-1"}>
                                <Table>
                                    <TableHeader className={`bg-muted`}>
                                        <TableRow>
                                            {['Name', 'Email', "Action"].map((x, i) => {
                                                const icons = [<User className="w-4 h-4" />, <Mail className="w-4 h-4" />];
                                                return (
                                                    <TableHead
                                                        className={`font-medium text-card-foreground px-2 py-[10px] md:px-3 ${
                                                            i > 0 ? 'max-w-[140px] truncate text-ellipsis overflow-hidden whitespace-nowrap' : ''
                                                        }`}
                                                        key={i}
                                                    >
                                                        <div className={`flex gap-2 items-center ${i === 2 ? "justify-center" : ""}`}>
                                                            {icons[i]}
                                                            {x}
                                                        </div>
                                                    </TableHead>
                                                );
                                            })}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className={"overflow-y-auto"}>
                                        {
                                            isLoading ? (
                                                [...Array(10)].map((_, index) => {
                                                    return (
                                                        <TableRow key={index}>
                                                            {
                                                                [...Array(3)].map((_, i) => {
                                                                    return (
                                                                        <TableCell className={"px-2 py-[10px] md:px-3"}>
                                                                            <Skeleton className={"rounded-md w-full h-7"}/>
                                                                        </TableCell>
                                                                    )
                                                                })
                                                            }
                                                        </TableRow>
                                                    )
                                                })
                                            ) : (ideasVoteList?.length > 0) ? <>
                                                {
                                                    (ideasVoteList || []).map((x,index)=>{
                                                        return(
                                                            <TableRow key={index} className={"font-normal"}>
                                                                <TableCell className={`px-2 py-[10px] md:px-3 max-w-[140px] cursor-pointer truncate text-ellipsis overflow-hidden whitespace-nowrap`}>{x.name ? x.name : "-"}</TableCell>
                                                                <TableCell className={`px-2 py-[10px] md:px-3 max-w-[140px] cursor-pointer truncate text-ellipsis overflow-hidden whitespace-nowrap`}>{x?.email ? x?.email : "-"}</TableCell>
                                                                <TableCell className={`px-2 py-[10px] md:px-3 text-center`}>
                                                                    <Button onClick={() => onDeleteUser(x.id,index)} variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px]`}>
                                                                        <Trash2 size={16}/>
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                }
                                            </> : <TableRow>
                                                <TableCell colSpan={6}>
                                                    <EmptyData/>
                                                </TableCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                                {
                                    ideasVoteList?.length > 0 ?
                                        <Pagination
                                            pageNo={pageNo}
                                            totalPages={totalPages}
                                            isLoading={isLoading}
                                            handlePaginationClick={handlePaginationClick}
                                            stateLength={ideasVoteList?.length}
                                        /> : ""
                                }
                            </div>
                            <DialogFooter className={"p-3 lg:p-6 gap-3 border-t"}>
                                <Button
                                    variant={"outline hover:none"}
                                    className={"font-medium border bg-muted-foreground/5"}
                                    onClick={() => {
                                        const recipients = selectedIdea?.vote_list?.map((x) => x.email).join(",");
                                        window.location.href = `mailto:${recipients}`;
                                    }}
                                >
                                    <Mail size={18} className={"mr-2"} strokeWidth={2} />Email all upvoters
                                </Button>
                                <Popover onOpenChange={handlePopoverOpenChange}>
                                    <PopoverTrigger asChild>
                                        <Button role="combobox" className={"font-medium"}><CirclePlus size={18} className={"mr-2"} strokeWidth={2} /> Add new upvoter</Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search users..." name={"search"} value={filter?.search} onValueChange={handleSearchChange}/>
                                            <CommandList ref={listRef} onWheel={handleWheelScroll} onTouchMove={handleTouchScroll}>
                                                <CommandEmpty>No User found.</CommandEmpty>
                                                    <CommandGroup className={"p-0"}>
                                                        {getAllUsersList.length > 0 && (getAllUsersList || []).map((x, i) => {
                                                            return (
                                                                <Fragment key={i}>
                                                                    <CommandItem value={x.customer_name}>
                                                                        <span className={"flex justify-between items-center w-full text-sm font-medium cursor-pointer"}
                                                                            onClick={() => handleUserClick(x)}
                                                                        >
                                                                            {x.customer_name}
                                                                        </span>
                                                                    </CommandItem>
                                                                </Fragment>
                                                            )
                                                        })}
                                                    </CommandGroup>
                                                <div className={"border-t"}>
                                                    <Button variant="ghost" className={"w-full font-medium"} onClick={() => openDialogs("addUser", true)}><CirclePlus size={16} className={"mr-2"}/>Add a brand new user</Button>
                                                </div>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
            }
            <div className={"px-4 py-3 lg:py-6 lg:px-8 border-b"}>
                <CommonBreadCrumb
                    links={links}
                    currentPage={selectedIdea?.title}
                    truncateLimit={30}
                />
            </div>
            <div className={`flex h-[calc(100%_-_45px)] lg:h-[calc(100%_-_69px)] overflow-y-auto`}>
                <div className={`max-w-[407px] w-full h-full border-r lg:block hidden lg:overflow-auto`}>
                    <div className={"border-b py-4 px-6 flex flex-col gap-3"}>
                        <div className={"flex flex-col gap-1"}>
                            <h3 className={"text-sm font-normal"}>Status</h3>
                            <p className={"text-muted-foreground text-xs font-normal"}>Apply a status to Manage this idea on roadmap.</p>
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
                            <Label htmlFor="picture" className={"font-normal capitalize"}>Featured image</Label>
                            <div className="w-[282px] h-[128px] flex gap-1">
                                <ImageUploader
                                    // selectedImage={selectedIdea}
                                    // onChangeStatus={onChangeStatus}
                                    // handleUpload={handleFeatureImgUpload}

                                    image={selectedIdea?.cover_image}
                                    onDelete={() => onChangeStatus('delete_cover_image', selectedIdea && selectedIdea?.cover_image && selectedIdea.cover_image?.name ? "" : [selectedIdea.cover_image.replace("https://code.quickhunt.app/public/storage/feature_idea/", "")])}
                                    onUpload={handleFeatureImgUpload}
                                    altText="Cover Image"
                                />
                            </div>
                        </div>
                    </div>
                    <div className={"py-4 px-6 flex flex-col gap-[26px]"}>
                        <div className={"flex gap-1 justify-between items-center"}>
                            <div className={"flex flex-col gap-1"}>
                                <h4 className={"text-sm font-normal capitalize"}>Mark as bug</h4>
                                <p className={"text-muted-foreground text-xs font-normal"}>Hides Idea from your
                                    users</p>
                            </div>
                            <Button
                                variant={"outline"}
                                className={`hover:bg-muted w-[125px] ${theme === "dark" ? "" : "border-muted-foreground text-muted-foreground"} capitalize text-sm font-medium`}
                                onClick={() => onChangeStatus(
                                    "is_active",
                                    selectedIdea?.is_active === 1 ? 0 : 1
                                )}
                            >
                                {
                                    isLoadingBug ? <Loader2
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
                                className={`w-[89px] hover:bg-muted ${theme === "dark" ? "" : "border-muted-foreground text-muted-foreground"} text-sm font-medium`}
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
                                        <Label htmlFor="description" className={"font-normal"}>Description</Label>
                                        <ReactQuillEditor value={selectedIdea.description} name={"description"}
                                                          onChange={onChangeText}/>
                                        {formError.description && <span className="text-red-500 text-sm">{formError.description}</span>}
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
                                        {formError.board && <span className="text-red-500 text-sm">{formError.board}</span>}
                                    </div>
                                </div>
                                <div className={"px-4 py-3 lg:py-6 lg:px-8 border-b space-y-2"}>
                                    <Label className={"font-normal"}>Choose Topics for this Idea (optional)</Label>
                                    <Select onValueChange={handleChangeTopic} value={selectedIdea.topic.map(x => x.id)}>
                                        <SelectTrigger className="bg-card">
                                            <SelectValue className={"text-muted-foreground text-sm"} placeholder="Assign to">
                                                <div className={"flex gap-[2px]"}>
                                                    {/*{(selectedIdea.topic || []).slice(0, 2).map((x, index) => {*/}
                                                    {(selectedIdea.topic || []).map((x, index) => {
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
                                                    {(selectedIdea.topic || []).length > 2}
                                                    {/*{(selectedIdea.topic || []).length > 2 && (<div className="text-xs flex items-center">...</div>)}*/}
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
                                <SaveCancelButton
                                    onClickSave={onCreateIdea}
                                    load={isLoadingCreateIdea}
                                    onClickCancel={handleOnCreateCancel}
                                />
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
                                                            <ArrowBigUp className={"fill-primary stroke-primary"}/>
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
                                                                                                    <UserAvatar
                                                                                                        userPhoto={x.user_photo}
                                                                                                        userName={x?.name ? x?.name : x?.user_name}
                                                                                                        className="w-[20px] h-[20px]"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            {
                                                                                                (selectedIdea?.vote_list.length > 1) &&
                                                                                                <div
                                                                                                    className={"update-idea text-sm rounded-full border text-center ml-[-5px]"}>
                                                                                                    <Avatar><AvatarFallback>+{selectedIdea?.vote_list.length - 1}</AvatarFallback></Avatar>
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
                                                                            <div className={" flex gap-2 justify-between items-center py-3 px-4"}>
                                                                                <h4 className="font-normal text-sm">{`Voters (${selectedIdea?.vote_list.length})`}</h4>
                                                                                <Button variant={"link"} className={"h-auto p-0 text-card-foreground font-normal text-sm"} onClick={() => openDialogs("viewUpvote", true)}>View upvoters</Button>
                                                                            </div>
                                                                            <div className="border-t px-4 py-3 space-y-2 max-h-[300px] overflow-y-auto">
                                                                                {
                                                                                    (selectedIdea?.vote_list || []).map((x, i) => {
                                                                                        return (
                                                                                            <div className={"flex gap-2"} key={i}>
                                                                                                <div
                                                                                                    className={"update-idea text-sm rounded-full border text-center"}>
                                                                                                    <UserAvatar
                                                                                                        userPhoto={x.user_photo}
                                                                                                        userName={x?.name ? x?.name : x?.user_name}
                                                                                                        className="w-[20px] h-[20px]"
                                                                                                    />
                                                                                                </div>
                                                                                                <h4 className={"text-sm font-normal"}>{x?.name ? x?.name : x?.user_name}</h4>
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

                                            <div className={"flex gap-2 items-center"}>
                                                {
                                                    isLoading ?
                                                        <div className={"flex gap-2"}>
                                                            {
                                                                selectedIdea?.is_edit === 1 ?
                                                                    <Skeleton
                                                                        className="w-[30px] h-[30px] rounded-full"/>
                                                                    : ""
                                                            }
                                                            <Skeleton className="w-[30px] h-[30px] rounded-full"/>
                                                        </div>
                                                        :
                                                        <Fragment>
                                                            <div className={"hidden md:block"}>
                                                                <ActionButtons
                                                                    isEditable={selectedIdea?.is_edit === 1}
                                                                    onEdit={() => setIsEditIdea(true)}
                                                                    onPinChange={(newPinState) => onChangeStatus("pin_to_top", newPinState ? 1 : 0)}
                                                                    isPinned={selectedIdea?.pin_to_top === 1}
                                                                />
                                                            </div>

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
                                                                        <DropdownMenuItem className={"cursor-pointer capitalize"}
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
                                                                <StatusButtonGroup
                                                                    onChangeStatus={(statusKey, statusValue) => onChangeStatus(statusKey, statusValue)}
                                                                    statusButtons={[
                                                                        {
                                                                            statusKey: "is_active",
                                                                            statusValue: selectedIdea?.is_active === 1 ? 0 : 1,
                                                                            isLoading: isLoadingBug,
                                                                            label: selectedIdea?.is_active === 0 ? "Convert to Idea" : "Mark as Bug",
                                                                            width: "w-[110px]"
                                                                        },
                                                                        {
                                                                            statusKey: "is_archive",
                                                                            statusValue: selectedIdea?.is_archive === 1 ? 0 : 1,
                                                                            isLoading: isLoadingArchive,
                                                                            label: selectedIdea?.is_archive === 1 ? "Unarchive" : "Archive",
                                                                            width: "w-[80px]"
                                                                        }
                                                                    ]}
                                                                />
                                                            </div>
                                                        </Fragment>
                                                }
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
                                                    {/*{*/}
                                                    {/*    cleanQuillHtml(selectedIdea?.description) ?*/}
                                                    {/*        <div*/}
                                                    {/*            className={`description-container text-sm ${theme === "dark" ? "" : "text-muted-foreground" }`}*/}
                                                    {/*            dangerouslySetInnerHTML={{ __html: selectedIdea?.description }}*/}
                                                    {/*        /> : null*/}
                                                    {/*}*/}
                                                    <DisplayReactQuill value={selectedIdea.description} />
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
                                                            <div className={"flex gap-3 flex-wrap"}>
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
                                                                                                    <img className={"upload-img cursor-pointer"} src={x} alt=""/>
                                                                                                </div>
                                                                                                : ""
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
                                                    {
                                                        isLoading ? (
                                                            <Fragment>
                                                                <Skeleton className="w-[20px] h-[20px] rounded-lg"/>
                                                                <div className={"flex items-center"}><Skeleton className="w-[50px] h-[20px]" /></div>
                                                            </Fragment>
                                                        ) : (
                                                            <Fragment>
                                                                <UserAvatar
                                                                    userPhoto={selectedIdea?.user_photo}
                                                                    userName={selectedIdea?.name ? selectedIdea?.name : selectedIdea?.user_name}
                                                                />
                                                                <div className={"flex items-center"}>
                                                                <Fragment>
                                                                    <h4 className={"text-sm font-normal"}>{selectedIdea?.name ? selectedIdea?.name : selectedIdea?.user_name}</h4>
                                                                    <p className={"text-sm font-normal flex items-center text-muted-foreground"}>
                                                                        <Dot size={20}
                                                                             className={"fill-text-card-foreground stroke-text-card-foreground"}/>
                                                                        {moment(selectedIdea?.created_at).format('D MMM')}
                                                                    </p>
                                                                </Fragment>
                                                                </div>
                                                            </Fragment>
                                                        )
                                                    }
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

                                        <div className="w-full space-y-1.5 lg:hidden">
                                            <Label htmlFor="picture" className={"font-normal capitalize"}>Featured image</Label>
                                            <div className="w-[282px] h-[128px] flex gap-1">
                                                <ImageUploader
                                                    // selectedImage={selectedIdea}
                                                    // onChangeStatus={onChangeStatus}
                                                    // handleUpload={handleFeatureImgUpload}

                                                    image={selectedIdea?.cover_image}
                                                    onDelete={() => onChangeStatus('delete_cover_image', selectedIdea && selectedIdea?.cover_image && selectedIdea.cover_image?.name ? "" : [selectedIdea.cover_image.replace("https://code.quickhunt.app/public/storage/feature_idea/", "")])}
                                                    onUpload={handleFeatureImgUpload}
                                                    altText="Cover Image"
                                                />
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
                                                        <Label htmlFor="message" className={"font-normal capitalize"}>Add comment</Label>
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
                                                                                                        className={`light:text-muted-foreground dark:text-card cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
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
                                                                                                        className={`light:text-muted-foreground dark:text-card cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
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
                                                                    accept={"image/*"}
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
                                                                    <div className={"flex gap-2 p-4 lg:px-8 border-b last:border-b-0"}>
                                                                        <div>
                                                                            <div className={"update-idea text-sm rounded-full border text-center"}>
                                                                                <UserAvatar
                                                                                    userPhoto={x?.user_photo}
                                                                                    userName={x?.name ? x?.name : x?.user_name}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className={"w-full flex flex-col space-y-3"}>
                                                                            <div className={"flex gap-1 flex-wrap justify-between"}>
                                                                                <div className={"flex items-start"}>
                                                                                    <h4 className={"text-sm font-normal"}>{x?.name ? x?.name : x?.user_name}</h4>
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
                                                                                                <ActionButtons
                                                                                                    isEditable={x?.is_edit === 1}
                                                                                                    onEdit={() => onEditComment(x, i)}
                                                                                                    onDelete={() => deleteComment(x.id, i)}
                                                                                                />
                                                                                                // <>
                                                                                                //     <Button
                                                                                                //     variant={"outline"}
                                                                                                //     className={"w-[30px] h-[30px] p-1"}
                                                                                                //     onClick={() => onEditComment(x, i)}
                                                                                                // >
                                                                                                //     <Pencil className={"w-[16px] h-[16px]"}/>
                                                                                                // </Button>
                                                                                                //     <Button
                                                                                                //         variant={"outline"}
                                                                                                //         className={"w-[30px] h-[30px] p-1"}
                                                                                                //         onClick={() => deleteComment(x.id, i)}
                                                                                                //     >
                                                                                                //         <Trash2 className={"w-[16px] h-[16px]"}/>
                                                                                                //     </Button></>
                                                                                                : ""
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
                                                                                                onDeleteImage={(i) => onDeleteCommentImage(i, true)}
                                                                                                onImageUpload={handleAddCommentImg}
                                                                                                onCommentChange={(e) => setSelectedComment({...selectedComment, comment: e.target.value})}
                                                                                                isSaving={isSaveUpdateComment}
                                                                                                idImageUpload={"selectedCommentImg"}
                                                                                            /> :
                                                                                                <CommentEditor
                                                                                                    comment={x.comment}
                                                                                                    images={x.images}
                                                                                                    onImageClick={(img) => handleImageClick(img)}
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
                                                                                            onClick={() => {
                                                                                                onShowSubComment(i)
                                                                                            }}
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
                                                                                                                    <UserAvatar userPhoto={y.user_photo} userName={y?.name ? y?.name : y?.user_name}/>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div
                                                                                                                className={"w-full space-y-2"}>
                                                                                                                <div className={"flex justify-between"}>
                                                                                                                    <div className={"flex items-start"}>
                                                                                                                        <h4 className={"text-sm font-normal"}>{y?.name ? y?.name : y?.user_name}</h4>
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
                                                                                                                                <ActionButtons
                                                                                                                                    isEditable={y?.is_edit === 1}
                                                                                                                                    onEdit={() => onEditSubComment(x, y, i, j)}
                                                                                                                                    onDelete={() => deleteSubComment(y.id, x, i, j)}
                                                                                                                                />
                                                                                                                                // <div
                                                                                                                                //     className="flex gap-2">
                                                                                                                                //     <Button
                                                                                                                                //         variant={"outline"}
                                                                                                                                //         className={"w-[30px] h-[30px] p-1"}
                                                                                                                                //         onClick={() => onEditSubComment(x, y, i, j)}>
                                                                                                                                //         <Pencil className={"w-[16px] h-[16px]"}/>
                                                                                                                                //     </Button>
                                                                                                                                //     <Button
                                                                                                                                //         variant={"outline"}
                                                                                                                                //         className={"w-[30px] h-[30px] p-1"}
                                                                                                                                //         onClick={() => deleteSubComment(y.id, x, i, j)}>
                                                                                                                                //         <Trash2
                                                                                                                                //             className={"w-[16px] h-[16px]"}/>
                                                                                                                                //     </Button>
                                                                                                                                // </div>
                                                                                                                        : ''
                                                                                                                    }
                                                                                                                </div>
                                                                                                                <div>

                                                                                                                    {
                                                                                                                        selectedCommentIndex === i && selectedSubCommentIndex === j ?
                                                                                                                            <CommentEditor
                                                                                                                                isEditMode={selectedCommentIndex === i && selectedSubCommentIndex === j}
                                                                                                                                comment={selectedSubComment?.comment}
                                                                                                                                images={selectedSubComment?.images}
                                                                                                                                onUpdateComment={onUpdateSubComment}
                                                                                                                                onCancelComment={onCancelSubComment}
                                                                                                                                onDeleteImage={(i) => onDeleteSubCommentImage(i)}
                                                                                                                                onImageUpload={handleSubCommentUploadImg}
                                                                                                                                onCommentChange={(e) => onChangeTextSubComment(e)}
                                                                                                                                isSaving={isSaveUpdateSubComment}
                                                                                                                                idImageUpload={"commentFileInput"}
                                                                                                                            /> :
                                                                                                                            <CommentEditor
                                                                                                                                comment={y.comment}
                                                                                                                                images={y.images}
                                                                                                                                onImageClick={(img) => handleImageClick(img)}
                                                                                                                            />
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
                                                                                            {
                                                                                                subCommentTextEditIdx === i &&
                                                                                            <Textarea
                                                                                                value={subCommentText[i] || ""}
                                                                                                onChange={(e) => handleSubCommentTextChange(e, i)}/>
                                                                                            }
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
                                                                                                                                        className={`light:text-muted-foreground dark:text-card cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
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
                                                                                                                                        className={`light:text-muted-foreground dark:text-card cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
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
                                                                                            {
                                                                                                    subCommentTextEditIdx === i &&
                                                                                                <div
                                                                                                    className={"flex gap-2"}>
                                                                                                    <Button
                                                                                                        className={`${isSaveSubComment === true ? "py-2 px-6" : "py-2 px-6"} w-[86px] h-[30px] text-sm font-medium`}
                                                                                                        disabled={(!subCommentText[i] || subCommentText[i].trim() === "")}
                                                                                                        onClick={() => {
                                                                                                            onCreateSubComment(x, i)
                                                                                                        }}
                                                                                                    >
                                                                                                        {
                                                                                                            isSaveSubComment && subCommentTextEditIdx === i ?
                                                                                                                <Loader2
                                                                                                                    size={16}
                                                                                                                    className="animate-spin"/> : "Reply"
                                                                                                        }
                                                                                                    </Button>
                                                                                                    <UploadButton onChange={handleSubCommentUploadImg}/>
                                                                                                    {/*<div className="p-2 max-w-sm relative w-[36px]">*/}
                                                                                                    {/*    <Input*/}
                                                                                                    {/*        id="commentFileInput"*/}
                                                                                                    {/*        type="file"*/}
                                                                                                    {/*        className="hidden"*/}
                                                                                                    {/*        onChange={handleSubCommentUploadImg}*/}
                                                                                                    {/*        accept={"image/*"}*/}
                                                                                                    {/*    />*/}
                                                                                                    {/*    <label*/}
                                                                                                    {/*        htmlFor="commentFileInput"*/}
                                                                                                    {/*        className="absolute inset-0 flex items-center justify-center bg-white border border-primary rounded cursor-pointer">*/}
                                                                                                    {/*        <Paperclip*/}
                                                                                                    {/*            size={16}*/}
                                                                                                    {/*            className={"stroke-primary"}/>*/}
                                                                                                    {/*    </label>*/}
                                                                                                    {/*</div>*/}
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
        </Fragment>
    );
};

export default UpdateIdea;