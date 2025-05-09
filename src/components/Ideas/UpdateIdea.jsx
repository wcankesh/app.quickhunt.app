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
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,} from "../ui/dialog";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {useTheme} from "../theme-provider";
import {useToast} from "../ui/use-toast";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../ui/dropdown-menu";
import ReactQuillEditor, {DisplayReactQuill} from "../Comman/ReactQuillEditor";
import {useLocation, useParams} from "react-router-dom";
import {Skeleton} from "../ui/skeleton";
import CommonBreadCrumb from "../Comman/CommonBreadCrumb";
import ImageUploader from "../Comman/ImageUploader";
import {
    ActionButtons,
    CommentEditor,
    SaveCancelButton,
    StatusButtonGroup,
    UploadButton,
    UserAvatar
} from "../Comman/CommentEditor";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../ui/command";
import {debounce} from "lodash";
import EmptyData from "../Comman/EmptyData";
import Pagination from "../Comman/Pagination";
import {inboxMarkReadAction} from "../../redux/action/InboxMarkReadAction";
import {apiService, DO_SPACES_ENDPOINT, handleImageOpen} from "../../utils/constent";

const perPageLimit = 10

const initialStateError = {
    title: "",
    description: "",
    boardId: "",
}

const initialUserError = {
    email: "",
    name: "",
}

const initialStateUser = {
    projectId: '',
    name: '',
    email: '',
    emailNotification: false,
    firstSeen: '',
    lastSeen: '',
    browser: '',
    ipAddress: '',
}

const UpdateIdea = () => {
    const location = useLocation();
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo") || 1;
    const {theme} = useTheme()
    const {toast} = useToast();
    const {id} = useParams();
    const dispatch = useDispatch();
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const inboxMarkReadReducer = useSelector(state => state.inboxMarkRead);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);

    const [commentLimit, setCommentLimit] = useState(10);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const [isLoadingComments, setIsLoadingComments] = useState(false);

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
    const [subCommentText, setSubCommentText] = useState([])
    const [subCommentTextEditIdx, setSubCommentTextEditIdx] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingIdeaVoteList, setIsLoadingIdeaVoteList] = useState(false);
    const [isLoadingCreateIdea, setIsLoadingCreateIdea] = useState(false);
    const [isLoadingArchive, setIsLoadingArchive] = useState(false);
    const [isLoadingBug, setIsLoadingBug] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);
    const [selectedSubComment, setSelectedSubComment] = useState(null);
    const [selectedCommentIndex, setSelectedCommentIndex] = useState(null);
    const [selectedSubCommentIndex, setSelectedSubCommentIndex] = useState(null);
    const [isEditComment, setIsEditComment] = useState(false);
    const [isEditIdea, setIsEditIdea] = useState(false);
    const [ideaComment, setIdeaComment] = useState([]);
    const [isSaveComment, setIsSaveComment] = useState(false);
    const [isSaveUpdateComment, setIsSaveUpdateComment] = useState(false);
    const [isSaveUpdateSubComment, setIsSaveUpdateSubComment] = useState(false);
    const [isSaveSubComment, setIsSaveSubComment] = useState(false);
    const [filter, setFilter] = useState({search: "", projectId: projectDetailsReducer.id});
    const [usersDetails, setUsersDetails] = useState(initialStateUser);
    const [ideasVoteList, setIdeasVoteList] = useState([]);
    const [getAllUsersList, setGetAllUsersList] = useState([]);
    const [addUserDialog, setAddUserDialog] = useState({addUser: false, viewUpvote: false});
    const [imageSizeError, setImageSizeError] = useState('');
    const listRef = useRef(null);

    const openDialogs = (name, value) => {
        setAddUserDialog(prev => ({...prev, [name]: value}));
        handlePopoverOpenChange();
    }

    const getAllComments = async () => {
        setIsLoadingComments(true);
        const data = await apiService.getIdeaComments({ideaId: id, page: 1, limit: commentLimit })
        if (data.success) {
            const commentsWithShowReply = data.data.comments.map((comment) => ({
                ...comment,
                showReply: comment.showReply ?? false,
                reply: comment.reply
                    ? comment.reply.map((subComment) => ({
                        ...subComment,
                        isEdited: subComment.isEdited ?? false,
                        images: Array.isArray(subComment.images) ? subComment.images : [],
                    }))
                    : [],
            }));
            setIdeaComment({ ...data.data, comments: commentsWithShowReply });
            setHasMoreComments(data.data.comments.length < data.data.total);
        }
        setIsLoadingComments(false);
    }

    const loadMoreComments = () => {
        setCommentLimit(prevLimit => prevLimit + 10);
    };

    const handlePopoverOpenChange = (isOpen) => {
        if (!isOpen) {
            setGetAllUsersList([]);
            setUsersDetails(initialStateUser);
            setUserDetailError(initialUserError)
            setFilter({search: '', projectId: null});
        }
    };

    const getIdeaVotes = async (type = '', clone = []) => {
        setIsLoadingIdeaVoteList(true);
        const payload = {
            ideaId: selectedIdea.id,
            page: pageNo,
            limit: perPageLimit
        }
        const data = await apiService.getIdeaVote(payload)
        if (data.success) {
            setIdeasVoteList(data.data.data)
            setTotalRecord(data.data.total)
            setSelectedIdea({
                ...selectedIdea,
                vote: data.data.total,
                voteLists: type === 'delete' ? pageNo === 1 ? clone : selectedIdea.voteLists : type === 'add' ? [...data.data.data] : [...selectedIdea.voteLists]
            })
            setIsLoadingIdeaVoteList(false);
        }
    }

    useEffect(() => {
        if (addUserDialog.viewUpvote) {
            getIdeaVotes()
        }
    }, [addUserDialog.viewUpvote, pageNo])

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
            getSingleIdea()
        }
    }, [projectDetailsReducer.id, getPageNo]);

    useEffect(() => {
        if (allStatusAndTypes.topics || allStatusAndTypes.roadmapStatus) {
            setTopicLists(allStatusAndTypes.topics)
            setRoadmapStatus(allStatusAndTypes.roadmapStatus)
        }
    }, [allStatusAndTypes]);

    useEffect(() => {
        if (projectDetailsReducer.id) {
            getAllComments();
        }
    }, [projectDetailsReducer.id, commentLimit]);

    const getAllUsers = async (value, projectId) => {
        const payload = {
            projectId: projectId,
            search: value,
        }
        const data = await apiService.getAllUsers(payload);
        if (data.success) {
            setGetAllUsersList(data.data)
        }
    };

    const handleSearchChange = (value) => {
        const trimmedValue = value.trim();
        if (trimmedValue || value === '') {
            setFilter(prev => ({
                ...prev,
                search: value,
                projectId: projectDetailsReducer.id
            }));
            throttledDebouncedSearch(trimmedValue, projectDetailsReducer.id);
        }
    };

    const throttledDebouncedSearch = useCallback(
        debounce((value, projectId) => {
            if (value || value === '') {
                getAllUsers(value, projectId);
            }
        }, 500),
        []
    );

    const addUser = async () => {
        let validationErrors = {};
        Object.keys(usersDetails).forEach(name => {
            const error = formValidate(name, usersDetails[name], "addUser");
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
            projectId: projectDetailsReducer.id,
            firstSeen: new Date(),
            lastSeen: new Date(),
        };
        const data = await apiService.createUsers(payload);
        setIsLoading(false);
        if (data.success) {
            const newUser = {
                id: data.data.id,
                name: data.data.name,
                email: data.data.email,
                profileImage: null,
            };
            setIdeasVoteList(prev => {
                const clone = [...prev];
                const filterEmail = clone.some(x => x.email === newUser.email);
                if (filterEmail) {
                    toast({description: "User with this email already exists.", variant: "destructive"});
                    return prev;
                }
                return [newUser, ...clone];
            });
            setSelectedIdea(prev => ({
                ...prev,
                vote: prev.vote + 1,
                voteLists: [newUser, ...(prev.voteLists || [])]
            }));
            const upvoteResponse = await apiService.userManualUpVote({
                ideaId: selectedIdea.id,
                userId: data.data.id,
            });
            if (upvoteResponse.success) {
                toast({description: upvoteResponse.message});
                await getIdeaVotes('add');
            } else {
                setIdeasVoteList(prev => prev.filter(x => x.id !== newUser.id));
                setSelectedIdea(prev => ({
                    ...prev,
                    vote: prev.vote - 1,
                    voteLists: prev.voteLists.filter(x => x.id !== newUser.id)
                }));
                toast({description: upvoteResponse.error.message, variant: "destructive"});
            }
            setUserDetailError(initialUserError);
            openDialogs("addUser", false);
        } else {
            toast({description: data.error.message, variant: "destructive"});
        }
    };

    const onDeleteUser = async (id, index) => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        const payload = {
            id: id,
            ideaId: selectedIdea.id
        }
        const data = await apiService.removeUserVote(payload)
        let clone = [...ideasVoteList];
        if (data.success) {
            clone.splice(index, 1);
            setIdeasVoteList(clone);
            toast({description: data.message});
            const filterData = (selectedIdea?.voteLists || []).filter((x) => x.id !== id)

            setSelectedIdea(prev => ({
                ...prev,
                voteLists: pageNo === 1 ? filterData : prev.voteLists,
                vote: filterData.length
            }));

            if (clone.length === 0 && pageNo > 1) {
                setPageNo(pageNo - 1);
            } else {
                await getIdeaVotes('delete', clone);
            }
        } else {
            toast({description: data?.error?.message, variant: "destructive",});
        }
        setIsLoading(false);
    };

    const handleUserClick = async (user) => {
        const selectedUser = getAllUsersList?.customers?.find((u) => u.name === user.name);
        if (selectedUser) {
            const updatedVoteList = [...ideasVoteList];
            const existingUserIndex = updatedVoteList.findIndex((u) => u.name === selectedUser.name);

            if (existingUserIndex !== -1) {
                toast({description: "User already exists in the upvote list.", variant: "destructive"});
                return;
            }

            if (existingUserIndex === -1) {
                const newUserPayload = {
                    name: selectedUser.name,
                    id: '',
                    profileImage: '',
                    email: selectedUser.email,
                };
                updatedVoteList.push(newUserPayload);
                const upvoteResponse = await apiService.userManualUpVote({
                    ideaId: selectedIdea.id,
                    userId: selectedUser.id,
                });
                if (upvoteResponse.success) {
                    toast({description: upvoteResponse.message,});
                    setPageNo(1);
                } else {
                    toast({description: upvoteResponse?.error?.message, variant: "destructive",})
                }
            } else {
                updatedVoteList.splice(existingUserIndex, 1);
            }
            setIdeasVoteList(updatedVoteList);
            getIdeaVotes('add');
        }
    };

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
        const data = await apiService.getSingleIdea(id);
        if (data.success) {
            setIsLoading(false)
            const ideaData = {...data.data, isRead: 1,}
            setSelectedIdea(ideaData)
            setOldSelectedIdea(ideaData)
            const updateInbox = inboxMarkReadReducer.map(item => {
                if ((item.source === 'feature_idea_comments' || item.source === 'feature_ideas' || item.source === 'feature_idea_votes') && item.id === data.data.id) {
                    return {...item, isRead: 1};
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
        if (selectedIdea.createdBy !== 1) {
            if (selectedIdea.userVote === (type == 1) || selectedIdea.userVote == 1) {

            } else {
                const payload = {
                    ideaId: selectedIdea.id,
                    type: type
                };
                const data = await apiService.giveVote(payload);
                if (data.success) {
                    const clone = {...selectedIdea};
                    let newVoteCount = clone.vote;
                    newVoteCount = type == 1 ? newVoteCount + 1 : newVoteCount >= 1 ? newVoteCount - 1 : 0;
                    let voteLists = [...clone.voteLists];
                    if (type == 1) {
                        voteLists.push(data.data);
                    } else {
                        const voteIndex = voteLists.findIndex((x) => (x.name || x?.firstname) == (data.data.name || data.data?.firstname));
                        if (voteIndex !== -1) {
                            voteLists.splice(voteIndex, 1);
                        }
                    }
                    setSelectedIdea({
                        ...clone,
                        vote: newVoteCount,
                        userVote: type === 1,
                        voteLists: voteLists
                    });
                    toast({description: data.message});
                } else {
                    toast({variant: "destructive", description: data.error?.message});
                }
            }
        } else {
            toast({variant: "destructive", description: "You can't vote on admin-created ideas"});
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
        formData.append('ideaId', selectedIdea.id);
        formData.append('parentId', '');
        const data = await apiService.createComment(formData)
        if (data.success) {
            const newComment = {
                ...data.data,
                createdAt: data.data.createdAt || new Date().toISOString(),
                userId: data.data.userId || 1,
                name: data.data.name || userDetailsReducer?.name || 'Anonymous',
                profileImage: data.data.profileImage || null,
                reply: [],
                showReply: false,
                isEdited: false,
            };
            setIdeaComment((prev) => ({
                ...prev,
                comments: [newComment, ...(prev.comments || [])],
            }));
            setSelectedIdea((prev) => ({
                ...prev,
                comments: [newComment, ...(prev.comments || [])],
            }));
            toast({description: data.message})
            setCommentText('');
            setCommentFiles([])
            setIsSaveComment(false)
        } else {
            setIsSaveComment(false)
            toast({variant: "destructive", description: data.error.message})
        }
    }

    const onShowSubComment = (index) => {
        setIdeaComment((prev) => {
            const updatedComments = (prev.comments || []).map((comment, i) => ({
                ...comment,
                showReply: i === index ? !comment.showReply : false,
                reply: comment.reply || [],
            }));
            return { ...prev, comments: updatedComments };
        });
        setIdeaComment((prev) => {
            if (prev.comments[index]?.showReply) {
                setSubCommentText((prevText) => {
                    const newText = [...prevText];
                    newText[index] = "";
                    return newText;
                });
                setSubCommentTextEditIdx(index);
            } else {
                setSubCommentText((prevText) => {
                    const newText = [...prevText];
                    newText[index] = "";
                    return newText;
                });
                setSubCommentTextEditIdx(null);
            }
            return prev;
        });
        setSelectedIdea((prev) => {
            const updatedComments = (prev.comments || []).map((comment, i) => ({
                ...comment,
                showReply: i === index ? !comment.showReply : false,
                reply: comment.reply || [],
            }));
            return { ...prev, comments: updatedComments };
        });
    };

    const onCreateSubComment = async (record, index) => {
        setIsSaveSubComment(true)
        let formData = new FormData();
        for (let i = 0; i < subCommentFiles.length; i++) {
            formData.append(`images`, subCommentFiles[i]);
        }
        const commentText = subCommentText[index] || "";
        formData.append('comment', commentText);
        formData.append('ideaId', selectedIdea.id);
        formData.append('parentId', record.id);
        const data = await apiService.createComment(formData)
        setIsSaveSubComment(false)
        if (data.success) {
            const newSubComment = {
                ...data.data,
                createdAt: data.data.createdAt || new Date().toISOString(),
                userId: data.data.userId || userDetailsReducer?.id || 1,
                name: data.data.name || userDetailsReducer?.name || "Anonymous",
                profileImage: data.data.profileImage || null,
                isEdited: false,
                images: Array.isArray(data.data.images) ? data.data.images : [],
            };
            setIdeaComment((prev) => {
                const comments = prev.comments || [];
                if (!comments[index]) {
                    return prev;
                }
                const updatedComments = [...comments];
                updatedComments[index] = {
                    ...updatedComments[index],
                    reply: [...(updatedComments[index].reply || []), newSubComment],
                    showReply: true,
                };
                return { ...prev, comments: updatedComments };
            });
            setSelectedIdea((prev) => {
                const comments = prev.comments || [];
                if (!comments[index]) {
                    return prev;
                }
                const updatedComments = [...comments];
                updatedComments[index] = {
                    ...updatedComments[index],
                    reply: [...(updatedComments[index].reply || []), newSubComment],
                    showReply: true,
                };
                return { ...prev, comments: updatedComments };
            });
            setSubCommentText((prev) => {
                const newText = [...prev];
                newText[index] = "";
                return newText;
            });
            setSubCommentFiles([])
            toast({description: data.message})
        } else {
            toast({variant: "destructive", description: data?.error?.message})
        }
    }

    const handleFeatureImgUpload = async (event) => {
        const file = event.target?.files[0];
        if (!file) return;
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            setFormError(prev => ({ ...prev, coverImage: "Featured image must be less than 5MB" }));
            // toast({ variant: "destructive", description: "Featured image must be less than 5MB" });
            event.target.value = "";
            return;
        }
        setFormError(prev => ({ ...prev, coverImage: "" }));
        setSelectedIdea({...selectedIdea, coverImage: file})
        let formData = new FormData();
        formData.append("coverImage", file);
        const data = await apiService.updateIdea(formData, selectedIdea.id)
        if (data.success) {
            setSelectedIdea({...data.data})
            setIsLoading(false)
            setIsEditIdea(false)
            toast({description: data.message})
        } else {
            setIsLoading(false)
            toast({variant: "destructive", description: data?.error?.message})
        }
        // event.target.value = "";
    };

    const handleAddCommentImg = (event) => {
        const files = Array.from(event.target.files);
        const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
        if (validFiles.length < files.length) {
            toast({variant: "destructive", description: 'File exceeded the 5MB limit.'})
        }
        if (selectedComment && selectedComment.id) {
            const clone = [...selectedComment.images, ...validFiles];
            setSelectedComment({
                ...selectedComment,
                images: clone,
            });
        } else {
            setCommentFiles(prev => [...prev, ...validFiles]);
        }
        event.target.value = "";
    };

    const handleSubCommentUploadImg = (event) => {
        const files = Array.from(event.target.files);
        const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
        if (validFiles.length < files.length) {
            toast({variant: "destructive", description: 'File exceeded the 5MB limit.'})
        }
        if (selectedSubComment && selectedSubComment.id && selectedComment && selectedComment.id) {
            const currentImages = Array.isArray(selectedSubComment.images) ? selectedSubComment.images : [];
            const clone = [...currentImages, ...validFiles];
            let selectedSubCommentObj = {...selectedSubComment, images: clone};
            setSelectedSubComment(selectedSubCommentObj);
            let index = ((selectedComment && selectedComment.reply) || []).findIndex((x) => x.id === selectedSubComment.id);
            if (index !== -1) {
                const cloneReplay = [...selectedComment.reply];
                cloneReplay[index] = selectedSubCommentObj;
                setSelectedComment({...selectedComment, reply: cloneReplay});
            }
        } else {
            setSubCommentFiles([...subCommentFiles, ...validFiles]);
        }
        event.target.value = "";
    };

    const onChangeStatus = async (name, value) => {
        if (name === "isActive") {
            setIsLoadingBug(true)
        } else if (name === "isArchive") {
            setIsLoadingArchive(true)
        }
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
        const data = await apiService.updateIdea(formData, selectedIdea.id)
        if (data.success) {
            setIsLoading(false)
            setIsLoadingBug(false)
            setIsLoadingArchive(false)
            setIsEditIdea(false)
            toast({description: data.message})
        } else {
            setIsLoading(false)
            setIsLoadingBug(false)
            setIsLoadingArchive(false)
            toast({variant: "destructive", description: data?.error?.message})
        }
    }

    const onEditComment = (record, index) => {
        setSelectedComment(record);
        setSelectedCommentIndex(index)
        setIsEditComment(true)
        setDeletedCommentImage([]);
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

            const imageToDelete = cloneImages[index];
            if (typeof imageToDelete === 'string') {
                cloneDeletedImages.push(imageToDelete);
            } else if (imageToDelete instanceof File) {
            }

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
        // for (let i = 0; i < deletedCommentImage.length; i++) {
        //     formData.append(`removeImages[${i}]`, deletedCommentImage[i]);
        // }
        const currentImageFilenames = selectedComment?.images.map(img => {
            if (typeof img === 'string') {
                return img;
            } else if (img instanceof File) {
                return img.name;
            }
            return '';
        });

        const validDeletedImages = deletedCommentImage.filter(deletedImg => {
            return !currentImageFilenames.includes(deletedImg);
        });

        for (let i = 0; i < validDeletedImages.length; i++) {
            formData.append(`removeImages[${i}]`, validDeletedImages[i]);
        }

        formData.append('comment', selectedComment.comment);
        const data = await apiService.updateComment(selectedComment.id, formData)
        setIsSaveUpdateComment(false)
        if (data.success) {
            const updatedComment = {
                ...selectedComment,
                ...data.data,
                images: Array.isArray(data.data.images) ? data.data.images : [],
                isEdited: true,
                showReply: selectedComment.showReply || false,
                reply: selectedComment.reply || [],
            };
            setIdeaComment((prev) => {
                const updatedComments = [...(prev.comments || [])];
                updatedComments[selectedCommentIndex] = updatedComment;
                return { ...prev, comments: updatedComments };
            });
            setSelectedIdea((prev) => {
                const updatedComments = [...(prev.comments || [])];
                updatedComments[selectedCommentIndex] = updatedComment;
                return { ...prev, comments: updatedComments };
            });
            setSelectedCommentIndex(null)
            setSelectedComment(null);
            setIsEditComment(false)
            setDeletedCommentImage([])
            toast({description: data.message})
        } else {
            toast({variant: "destructive", description: data?.error?.message})
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
            setIdeaComment(prev => {
                const updatedComments = [...(prev.comments || [])];
                const parentCommentIndex = updatedComments.findIndex(
                    comment => comment.id === selectedComment.id
                );
                if (parentCommentIndex !== -1) {
                    const subCommentIndex = updatedComments[parentCommentIndex].reply.findIndex(
                        reply => reply.id === selectedSubComment.id
                    );
                    if (subCommentIndex !== -1) {
                        const updatedReplies = [...updatedComments[parentCommentIndex].reply];
                        updatedReplies[subCommentIndex] = {
                            ...updatedReplies[subCommentIndex],
                            ...data.data,
                            isEdited: true,
                            images: Array.isArray(data.data.images) ? data.data.images : [],
                        };
                        updatedComments[parentCommentIndex] = {
                            ...updatedComments[parentCommentIndex],
                            reply: updatedReplies,
                        };
                    }
                }
                return { ...prev, comments: updatedComments };
            });
            setSelectedIdea(prev => {
                const updatedComments = [...(prev.comments || [])];
                const parentCommentIndex = updatedComments.findIndex(
                    comment => comment.id === selectedComment.id
                );
                if (parentCommentIndex !== -1) {
                    const subCommentIndex = updatedComments[parentCommentIndex].reply.findIndex(
                        reply => reply.id === selectedSubComment.id
                    );
                    if (subCommentIndex !== -1) {
                        const updatedReplies = [...updatedComments[parentCommentIndex].reply];
                        updatedReplies[subCommentIndex] = {
                            ...updatedReplies[subCommentIndex],
                            ...data.data,
                            isEdited: true,
                            images: Array.isArray(data.data.images) ? data.data.images : [],
                        };
                        updatedComments[parentCommentIndex] = {
                            ...updatedComments[parentCommentIndex],
                            reply: updatedReplies,
                        };
                    }
                }
                return { ...prev, comments: updatedComments };
            });
            setSelectedComment(null);
            setSelectedCommentIndex(null);
            setSelectedSubComment(null);
            setSelectedSubCommentIndex(null);
            setDeletedSubCommentImage([]);
            toast({ description: data.message });
        } else {
            toast({ variant: "destructive", description: data?.error?.message });
        }
        setIsSaveUpdateSubComment(false);
    }

    const deleteComment = async (id, indexs) => {
        const data = await apiService.deleteComment(id);
        if (data.success) {
            setIdeaComment((prev) => {
                const updatedComments = [...(prev.comments || [])];
                updatedComments.splice(indexs, 1);
                const updatedIdeaComment = { ...prev, comments: updatedComments };
                return updatedIdeaComment;
            });
            setSelectedIdea((prev) => {
                const updatedComments = [...(prev.comments || [])];
                updatedComments.splice(indexs, 1);
                const updatedSelectedIdea = { ...prev, comments: updatedComments };
                return updatedSelectedIdea;
            });

            toast({ description: data.message });
        } else {
            toast({ variant: "destructive", description: data?.error?.message });
        }
    };

    const deleteSubComment = async (id, record, index, subIndex) => {
        const data = await apiService.deleteComment(id);
        if (data.success) {
            setIdeaComment((prev) => {
                const updatedComments = [...(prev.comments || [])];
                if (!updatedComments[index]) {
                    return prev;
                }
                const updatedReplies = [...(updatedComments[index].reply || [])];
                if (!updatedReplies[subIndex]) {
                    return prev;
                }
                updatedReplies.splice(subIndex, 1);
                updatedComments[index] = {
                    ...updatedComments[index],
                    reply: updatedReplies,
                    showReply: updatedReplies.length > 0 ? true : false,
                };
                const updatedIdeaComment = { ...prev, comments: updatedComments };
                return updatedIdeaComment;
            });
            setSelectedIdea((prev) => {
                const updatedComments = [...(prev.comments || [])];
                if (!updatedComments[index]) {
                    return prev;
                }
                const updatedReplies = [...(updatedComments[index].reply || [])];
                if (!updatedReplies[subIndex]) {
                    return prev;
                }
                updatedReplies.splice(subIndex, 1);
                updatedComments[index] = {
                    ...updatedComments[index],
                    reply: updatedReplies,
                    showReply: updatedReplies.length > 0 ? true : false,
                };
                const updatedSelectedIdea = { ...prev, comments: updatedComments };
                return updatedSelectedIdea;
            });
            toast({ description: data.message });
        } else {
            toast({ variant: "destructive", description: data?.error?.message});
        }
    };

    const onEditSubComment = (record, subRecord, index, subIndex) => {
        setSelectedComment(record)
        setSelectedCommentIndex(index)
        setSelectedSubComment(subRecord)
        setSelectedSubCommentIndex(subIndex)

        // setSelectedComment({...record});
        // setSelectedCommentIndex(index);
        // setSelectedSubComment({...subRecord});
        // setSelectedSubCommentIndex(subIndex);
        // setDeletedSubCommentImage([]);
    }

    const formValidate = (name, value, type) => {
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
            case "name":
                if (type === 'addUser') {
                    if (!value || value.trim() === "") {
                        return "User name is required";
                    }
                }
                return "";
            case "email":
                if (type === 'addUser') {
                    if (value.trim() === "") return "User email is required";
                    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value))
                        return "Enter a valid email address";
                }
                return "";
            default: {
                return "";
            }
        }
    };

    const onChangeText = (event) => {
        const { name, value } = event.target;
        const trimmedValue = name === "title" || name === "description" ? value.trimStart() : value;
        setSelectedIdea(prev => ({ ...prev, [name]: trimmedValue }));
        setUsersDetails(prev => ({ ...prev, [name]: trimmedValue }));
        setFormError(prev => ({
            ...prev,
            [name]: formValidate(name, trimmedValue)
        }));
        setUserDetailError(prev => ({
            ...prev,
            [name]: formValidate(name, trimmedValue, "addUser")
        }));
        // Clear image size error if description changes
        if (name === "description" && imageSizeError) {
            setImageSizeError('');
        }
    }

    const onCreateIdea = async () => {
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
        // Check for image size error
        if (imageSizeError) {
            validationErrors.imageSizeError = imageSizeError;
        }
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setIsLoadingCreateIdea(true)
        let formData = new FormData();
        let topics = (selectedIdea.topic || []).map(x => x.id).filter(id => id != null);

        formData.append('title', selectedIdea.title);
        formData.append('boardId', selectedIdea.boardId);
        formData.append('slugUrl', selectedIdea.title ? selectedIdea.title.replace(/ /g, "-").replace(/\?/g, "-") : "");
        formData.append('description', selectedIdea.description ? selectedIdea.description : "");

        if (topics.length > 0) {
            topics.forEach(id => formData.append('topicId[]', id));
        } else {
            formData.append('topicId[]', '');
        }

        if (selectedIdea.image) {
            const resizedImage = await resizeImage(selectedIdea.image);
            formData.append('image', resizedImage);
        }

        const data = await apiService.updateIdea(formData, selectedIdea.id)
        if (data.success) {
            setOldSelectedIdea({...selectedIdea})
            setIsEditIdea(false)
            setImageSizeError('');
            toast({description: data.message})
        } else {
            toast({description: data?.error?.message, variant: "destructive"})
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
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
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
                }, 'image/jpeg', 0.7);
            };
            img.onerror = (err) => reject(err);
        });
    };

    const handleOnCreateCancel = () => {
        setSelectedIdea(oldSelectedIdea);
        setFormError(initialStateError);
        setIsEditIdea(false);
        setImageSizeError('');
        setSelectedComment(null);
        setDeletedCommentImage([]);
        setCommentFiles([]);
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

    const links = [{label: 'Ideas', path: `/ideas?pageNo=${getPageNo}`}];

    const handleSubCommentTextChange = (e, index) => {
        setSubCommentText((prev) => {
            const newSubCommentText = [...prev];
            newSubCommentText[index] = e.target.value;
            return newSubCommentText;
        });
    };

    return (
        <Fragment>
            {
                (addUserDialog.addUser) &&
                <Dialog open={addUserDialog.addUser} onOpenChange={(value) => openDialogs("addUser", value)}>
                    <DialogContent className={"max-w-[576px]"}>
                        <DialogHeader className={"flex-row gap-2 justify-between space-y-0 items-center"}>
                            <DialogTitle>Add new user</DialogTitle>
                            <span className={"max-w-[24px]"}><X className={"cursor-pointer m-0"}
                                                                onClick={() => openDialogs("addUser", false)}/></span>
                        </DialogHeader>
                        <div className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name" className="font-medium">Email</Label>
                                <Input id="name" value={usersDetails.email} name="email" onChange={onChangeText}
                                       placeholder="Enter upvoter email" className="col-span-3"/>
                                {userDetailError.email &&
                                <span className="text-red-500 text-sm">{userDetailError.email}</span>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="userName" className="font-medium">Name</Label>
                                <Input id="userName" value={usersDetails.name} name="name" onChange={onChangeText}
                                       placeholder="Enter upvoter name" className="col-span-3"/>
                                {userDetailError.name &&
                                <span className="text-red-500 text-sm">{userDetailError.name}</span>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button className={"font-medium w-[83px]"} onClick={addUser}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Add User"}
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
                            <span className={"max-w-[24px]"}><X className={"cursor-pointer m-0"}
                                                                onClick={() => openDialogs("viewUpvote", false)}/></span>
                        </DialogHeader>
                        <div className={"overflow-y-auto h-full flex-1"}>
                            <Table>
                                <TableHeader className={`bg-muted`}>
                                    <TableRow>
                                        {['Name', 'Email', "Action"].map((x, i) => {
                                            const icons = [<User className="w-4 h-4"/>, <Mail className="w-4 h-4"/>];
                                            return (
                                                <TableHead
                                                    className={`font-medium text-card-foreground px-2 py-[10px] md:px-3 ${
                                                        i > 0 ? 'max-w-[140px] truncate text-ellipsis overflow-hidden whitespace-nowrap' : ''
                                                    }`}
                                                    key={i}
                                                >
                                                    <div
                                                        className={`flex gap-2 items-center ${i === 2 ? "justify-center" : ""}`}>
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
                                        isLoadingIdeaVoteList ? (
                                            [...Array(10)].map((_, index) => {
                                                return (
                                                    <TableRow key={index}>
                                                        {
                                                            [...Array(3)].map((_, i) => {
                                                                return (
                                                                    <TableCell key={i}
                                                                               className={"px-2 py-[10px] md:px-3"}>
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
                                                (ideasVoteList || []).map((x, index) => {
                                                    return (
                                                        <TableRow key={index} className={"font-normal"}>
                                                            <TableCell
                                                                className={`px-2 py-[10px] md:px-3 max-w-[140px] cursor-pointer truncate text-ellipsis overflow-hidden whitespace-nowrap`}>{x.name ? x.name : "-"}</TableCell>
                                                            <TableCell
                                                                className={`px-2 py-[10px] md:px-3 max-w-[140px] cursor-pointer truncate text-ellipsis overflow-hidden whitespace-nowrap`}>{x?.email ? x?.email : "-"}</TableCell>
                                                            <TableCell className={`px-2 py-[10px] md:px-3 text-center`}>
                                                                <Button onClick={() => onDeleteUser(x.id, index)}
                                                                        variant={"outline hover:bg-transparent"}
                                                                        className={`p-1 border w-[30px] h-[30px]`}>
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
                                    const recipients = selectedIdea?.voteLists?.map((x) => x.email).join(",");
                                    window.location.href = `mailto:${recipients}`;
                                }}
                            >
                                <Mail size={18} className={"mr-2"} strokeWidth={2}/>Email all upvoters
                            </Button>
                            <Popover onOpenChange={handlePopoverOpenChange}>
                                <PopoverTrigger asChild>
                                    <Button role="combobox" className={"font-medium"}><CirclePlus size={18} className={"mr-2"} strokeWidth={2}/> Add new upvoter</Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search users..." name={"search"}
                                                      value={filter?.search} onValueChange={handleSearchChange}/>
                                        <CommandList ref={listRef} onWheel={handleWheelScroll}
                                                     onTouchMove={handleTouchScroll}>
                                            <CommandEmpty>No User found.</CommandEmpty>
                                            <CommandGroup className={"p-0"}>
                                                {getAllUsersList?.customers?.length > 0 && (getAllUsersList?.customers || []).map((x, i) => {
                                                    return (
                                                        <Fragment key={i}>
                                                            <CommandItem value={x.name}>
                                                                        <span
                                                                            className={"flex justify-between items-center w-full text-sm font-medium cursor-pointer"}
                                                                            onClick={() => handleUserClick(x)}
                                                                        >
                                                                            {x.name}
                                                                        </span>
                                                            </CommandItem>
                                                        </Fragment>
                                                    )
                                                })}
                                            </CommandGroup>
                                            <div className={"border-t"}>
                                                <Button variant="ghost" className={"w-full font-medium"}
                                                        onClick={() => openDialogs("addUser", true)}><CirclePlus
                                                    size={16} className={"mr-2"}/>Add a brand new user</Button>
                                            </div>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            }
            <div className={"px-4 py-3 lg:p-6 border-b"}>
                <CommonBreadCrumb
                    links={links}
                    currentPage={selectedIdea?.title}
                    truncateLimit={30}
                />
            </div>
            <div className={`flex h-[calc(100%_-_45px)] lg:h-[calc(100%_-_69px)] overflow-y-auto`}>
                <div className={`max-w-[407px] w-full h-full border-r lg:block hidden lg:overflow-auto`}>
                    {
                        isLoading ? (
                                [...Array(22)].map((_, index) => {
                                    return (
                                        <Fragment key={index}>
                                            {
                                                [...Array(1)].map((_, i) => {
                                                    return (
                                                        <div key={i} className={"w-full px-2 py-[8px] md:px-3"}>
                                                            <Skeleton className={"rounded-md w-full h-5"}/>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Fragment>
                                    )})
                        ) : <Fragment>
                            <div className={"border-b py-4 px-6 flex flex-col gap-3"}>
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
                                <div className="py-4 px-6 w-full space-y-1.5">
                                    <Label htmlFor="picture" className={"font-medium capitalize"}>Featured image</Label>
                                    <div className="w-[282px] h-[128px] flex gap-1">
                                        <ImageUploader
                                            image={selectedIdea?.coverImage}
                                            onDelete={() => onChangeStatus('removeCoverImage', selectedIdea && selectedIdea?.coverImage && selectedIdea.coverImage?.name ? "" : [selectedIdea.coverImage])}
                                            onUpload={handleFeatureImgUpload}
                                            altText="Cover Image"
                                        />
                                    </div>
                                    {formError.coverImage && (
                                        <span className="text-red-500 text-sm">{formError.coverImage}</span>
                                    )}
                                </div>
                            </div>
                            <div className={"py-4 px-6 flex flex-col gap-[26px]"}>
                                <div className={"flex gap-1 justify-between items-center"}>
                                    <div className={"flex flex-col gap-1"}>
                                        <h4 className={"text-sm font-medium capitalize"}>Mark as bug</h4>
                                        <p className={"text-muted-foreground text-xs font-normal"}>Hides Idea from your
                                            users</p>
                                    </div>
                                    <Button
                                        variant={"outline"}
                                        className={`hover:bg-muted w-[125px] ${theme === "dark" ? "" : "border-muted-foreground text-muted-foreground"} capitalize text-sm font-medium`}
                                        onClick={() => onChangeStatus(
                                            "isActive",
                                            selectedIdea?.isActive === false
                                        )}
                                    >
                                        {
                                            isLoadingBug ? <Loader2
                                                className="h-4 w-4 animate-spin"/> : (selectedIdea?.isActive === false ? "Convert to Idea" : "Mark as bug")
                                        }
                                    </Button>
                                </div>
                                <div className={"flex gap-1 justify-between items-center"}>
                                    <div className={"flex flex-col gap-1"}>
                                        <h4 className={"text-sm font-medium"}>Archive</h4>
                                        <p className={"text-muted-foreground text-xs font-normal"}>Remove Idea from
                                            Board
                                            and Roadmap</p>
                                    </div>
                                    <Button
                                        variant={"outline"}
                                        className={`w-[89px] hover:bg-muted ${theme === "dark" ? "" : "border-muted-foreground text-muted-foreground"} text-sm font-medium`}
                                        onClick={() => onChangeStatus(
                                            "isArchive",
                                            selectedIdea?.isArchive !== true
                                        )}
                                    >
                                        {
                                            isLoadingArchive ? <Loader2
                                                className="h-4 w-4 animate-spin"/> : (selectedIdea?.isArchive ? "Unarchive" : "Archive")
                                        }
                                    </Button>
                                </div>
                            </div>
                        </Fragment>
                    }
                </div>
                <div className={"update-idea-right-side w-full h-full overflow-y-auto"}>
                    {
                        isEditIdea ?
                            <Fragment>
                                <div
                                    className={"px-4 py-3 lg:py-6 lg:px-8 flex flex-col gap-4 ld:gap-6 border-b"}>
                                    <div className="space-y-2">
                                        <Label htmlFor="text" className={"font-medium"}>Title</Label>
                                        <Input type="text" id="text" placeholder="" value={selectedIdea.title}
                                               name={"title"} onChange={onChangeText}/>
                                        {
                                            formError.title &&
                                            <span className="text-red-500 text-sm">{formError.title}</span>
                                        }
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description" className={"font-medium"}>Description</Label>
                                        <ReactQuillEditor value={selectedIdea.description} name={"description"}
                                                          onChange={onChangeText} setImageSizeError={setImageSizeError}/>
                                        {/*{formError.description &&*/}
                                        {/*<span className="text-red-500 text-sm">{formError.description}</span>}*/}
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
                                    <Select onValueChange={handleChangeTopic} value={selectedIdea.topic.map(x => x.id)}>
                                        <SelectTrigger className="bg-card">
                                            <SelectValue className={"text-muted-foreground text-sm"}>
                                                <div className={"flex gap-[2px]"}>
                                                    {
                                                        (selectedIdea.topic || []).length === 0 ? (
                                                            <span className={"text-muted-foreground"}>Select topic</span>
                                                        ) : (
                                                            (selectedIdea.topic || []).map((x, index) => {
                                                                const findObj = (topicLists || []).find((y) => y.id === x?.id);
                                                                return (
                                                                    <div key={index}
                                                                         className={`text-xs flex gap-[2px] ${theme === "dark" ? "text-card" : ""} bg-slate-300 items-center rounded py-0 px-2`}>
                                                                <span
                                                                    className={"max-w-[85px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}>
                                                                    {findObj?.title}
                                                                </span>
                                                                    </div>
                                                                );
                                                            })
                                                        )
                                                    }
                                                    {(selectedIdea.topic || []).length > 2}
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
                                                                            <Check size={18}/> :
                                                                            <div className={"h-[18px] w-[18px]"}/>}
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
                                {
                                    isLoading ? (
                                        [...Array(22)].map((_, index) => {
                                            return (
                                                <Fragment key={index}>
                                                    {
                                                        [...Array(1)].map((_, i) => {
                                                            return (
                                                                <div key={i} className={"w-full px-2 py-[8px] md:px-3"}>
                                                                    <Skeleton className={"rounded-md w-full h-5"}/>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </Fragment>
                                            )
                                        })
                                    ) : <Fragment>
                                        <div className={"px-4 py-3 lg:py-6 lg:px-8"}>
                                            <div className={"flex flex-col gap-6"}>
                                                <div className={"flex justify-between items-center gap-4 md:flex-nowrap flex-wrap"}>

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
                                                            selectedIdea && selectedIdea?.voteLists && selectedIdea?.voteLists.length ?
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <Button variant={"ghost hover-none"}
                                                                                className={"rounded-full p-0 h-[24px]"}>
                                                                            {
                                                                                (selectedIdea?.voteLists.slice(0, 1) || []).map((x, i) => {
                                                                                    return (
                                                                                        <div className={"flex"} key={i}>
                                                                                            <div className={"relative"}>
                                                                                                <div
                                                                                                    className={"update-idea text-sm rounded-full text-center"}>
                                                                                                    <UserAvatar
                                                                                                        userPhoto={x?.profileImage}
                                                                                                        userName={x?.name ? x?.name : x?.userName}
                                                                                                        className="w-[20px] h-[20px]"
                                                                                                        initialStyle={"text-sm"}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            {
                                                                                                (selectedIdea?.voteLists.length > 1) &&
                                                                                                <div
                                                                                                    className={"update-idea text-sm rounded-full text-center ml-[-5px]"}>
                                                                                                    <Avatar>
                                                                                                        <AvatarFallback>+{selectedIdea?.voteLists.length - 1}</AvatarFallback>
                                                                                                    </Avatar>
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
                                                                            <div
                                                                                className={" flex gap-2 justify-between items-center py-3 px-4"}>
                                                                                <h4 className="font-normal text-sm">{`Voters (${selectedIdea?.voteLists.length})`}</h4>
                                                                                <Button variant={"link"}
                                                                                        className={"h-auto p-0 text-card-foreground font-normal text-sm"}
                                                                                        onClick={() => openDialogs("viewUpvote", true)}>View
                                                                                    upvoters</Button>
                                                                            </div>
                                                                            <div
                                                                                className="border-t px-4 py-3 space-y-2 max-h-[300px] overflow-y-auto">
                                                                                {
                                                                                    (selectedIdea?.voteLists || []).map((x, i) => {
                                                                                        return (
                                                                                            <div
                                                                                                className={"flex gap-2"}
                                                                                                key={i}>
                                                                                                <div
                                                                                                    className={"update-idea text-sm rounded-full text-center"}>
                                                                                                    <UserAvatar
                                                                                                        userPhoto={x?.profileImage}
                                                                                                        userName={x?.name ? x?.name : x?.userName}
                                                                                                        className="w-[20px] h-[20px]"
                                                                                                        initialStyle={"text-sm"}
                                                                                                    />
                                                                                                </div>
                                                                                                <h4 className={"text-sm font-normal"}>{x?.name ? x?.name : x?.userName}</h4>
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

                                                    <div className={"flex gap-2 items-center"}>
                                                        <div className={"hidden md:block"}>
                                                            <ActionButtons
                                                                isEditable={selectedIdea?.createdBy == 1}
                                                                onEdit={() => setIsEditIdea(true)}
                                                                onPinChange={(newPinState) => onChangeStatus("pinToTop", newPinState ? 1 : 0)}
                                                                isPinned={selectedIdea?.pinToTop == 1}
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
                                                                                      onClick={() => onChangeStatus("pinToTop", selectedIdea?.pinToTop === 0 ? 1 : 0)}>
                                                                        {selectedIdea?.pinToTop == 0 ? "Pinned" : "Unpinned"}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        className={"cursor-pointer capitalize"}
                                                                        onClick={() => onChangeStatus(
                                                                            "isActive",
                                                                            selectedIdea?.isActive === false
                                                                        )}>
                                                                        {selectedIdea?.isActive === false ? "Convert to Idea" : "Mark as bug"}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem className={"cursor-pointer"}
                                                                                      onClick={() => onChangeStatus(
                                                                                          "isArchive",
                                                                                          selectedIdea?.isArchive !== true
                                                                                      )}>
                                                                        {selectedIdea?.isArchive ? "Unarchive" : "Archive"}
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>

                                                        <div className={"lg:hidden md:block hidden"}>
                                                            <StatusButtonGroup
                                                                onChangeStatus={(statusKey, statusValue) => onChangeStatus(statusKey, statusValue)}
                                                                statusButtons={[
                                                                    {
                                                                        statusKey: "isActive",
                                                                        statusValue: selectedIdea?.isActive === false,
                                                                        isLoading: isLoadingBug,
                                                                        label: selectedIdea?.isActive === false ? "Convert to Idea" : "Mark as Bug",
                                                                        width: "w-[110px]"
                                                                    },
                                                                    {
                                                                        statusKey: "isArchive",
                                                                        statusValue: selectedIdea?.isArchive !== true,
                                                                        isLoading: isLoadingArchive,
                                                                        label: selectedIdea?.isArchive ? "Unarchive" : "Archive",
                                                                        width: "w-[80px]"
                                                                    }
                                                                ]}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={"flex flex-col gap-4"}>
                                                    <div className={"flex items-center gap-2"}>
                                                        <h2 className={"text-xl font-normal"}>{selectedIdea?.title}</h2>
                                                    </div>
                                                    <DisplayReactQuill value={selectedIdea.description}/>
                                                </div>
                                                <Fragment>
                                                    {
                                                        selectedIdea && selectedIdea?.images && selectedIdea?.images?.length > 0 ?
                                                            <div className={"flex gap-3 flex-wrap"}>
                                                                <Fragment>
                                                                    {
                                                                        (selectedIdea?.images || []).map((x, i) => {
                                                                                return (
                                                                                    <Fragment key={i}>
                                                                                        {x &&
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
                                                                                        }
                                                                                    </Fragment>
                                                                                )
                                                                            }
                                                                        )}
                                                                </Fragment>
                                                            </div> : ""
                                                    }
                                                </Fragment>
                                                <div className={"flex items-center"}>
                                                    <div className={"flex items-center gap-4 md:flex-nowrap flex-wrap"}>
                                                        <div className={"flex items-center gap-2"}>
                                                            <UserAvatar initialStyle={"text-sm"}
                                                                        userPhoto={selectedIdea?.profileImage}
                                                                        userName={selectedIdea?.name ? selectedIdea?.name : selectedIdea?.userName}
                                                            />
                                                            <div className={"flex items-center"}>
                                                                <Fragment>
                                                                    <h4 className={"text-sm font-normal"}>{selectedIdea?.name ? selectedIdea?.name : selectedIdea?.userName}</h4>
                                                                    <p className={"text-sm font-normal flex items-center text-muted-foreground"}>
                                                                        <Dot size={20}
                                                                             className={"fill-text-card-foreground stroke-text-card-foreground"}/>
                                                                        {moment(selectedIdea?.createdAt).format('D MMM')}
                                                                    </p>
                                                                </Fragment>
                                                            </div>
                                                        </div>
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
                                                    </div>
                                                </div>

                                                <div className="w-full space-y-1.5 lg:hidden">
                                                    <Label htmlFor="picture" className={"font-medium capitalize"}>Featured
                                                        image</Label>
                                                    <div className="w-[282px] h-[128px] flex gap-1">
                                                        <ImageUploader
                                                            image={selectedIdea?.coverImage}
                                                            onDelete={() => onChangeStatus('removeCoverImage', selectedIdea && selectedIdea?.coverImage && selectedIdea.coverImage?.name ? "" : [selectedIdea.coverImage])}
                                                            onUpload={handleFeatureImgUpload}
                                                            altText="Cover Image"
                                                        />
                                                        {formError.coverImage && (
                                                            <span className="text-red-500 text-sm">{formError.coverImage}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className={"flex flex-col gap-2"}>
                                                    <div className="w-full flex flex-col gap-2">
                                                        <Label htmlFor="message" className={"font-medium capitalize"}>Add
                                                            comment</Label>
                                                        <Fragment>
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
                                                                                    <Fragment key={i}>
                                                                                        {x && (
                                                                                            <div
                                                                                                className="w-[50px] h-[50px] md:w-[100px] md:h-[100px] relative border p-[3px]">
                                                                                                <img
                                                                                                    className="upload-img"
                                                                                                    src={x.name ? URL.createObjectURL(x) : `${DO_SPACES_ENDPOINT}/${x}`}
                                                                                                    alt={x.name || x}
                                                                                                />
                                                                                                <CircleX
                                                                                                    size={20}
                                                                                                    className="stroke-gray-500 dark:stroke-white cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10"
                                                                                                    onClick={() => onDeleteImageComment(i, false)}
                                                                                                />
                                                                                            </div>
                                                                                        )}
                                                                                    </Fragment>
                                                                                )
                                                                            })
                                                                        }
                                                                    </div>
                                                                    : ""
                                                            }
                                                        </Fragment>
                                                    </div>
                                                    <div className={"flex justify-end gap-1"}>
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
                                            </div>
                                        </div>
                                        <div className={"tabs"}>
                                            <Tabs defaultValue="comment">
                                                <div className={"px-4 lg:px-8 border-b"}>
                                                    <TabsList
                                                        className={"bg-transparent border-b-2 border-b-primary rounded-none"}>
                                                        <TabsTrigger className={"ideas-tab-comm-bgCol"} value="comment">Comments</TabsTrigger>
                                                    </TabsList>
                                                </div>

                                                {
                                                    ideaComment?.comments?.length > 0 ?
                                                        <TabsContent value="comment" className={`${theme === "dark" ? "" : "bg-muted"}`}>
                                                            <Fragment>
                                                                {
                                                                    ideaComment && ideaComment?.comments && ideaComment?.comments.length > 0 ?
                                                                        (ideaComment?.comments || []).map((x, i) => {
                                                                            return (
                                                                                <Fragment key={i}>
                                                                                    <div className={"flex gap-2 p-4 lg:px-8 border-b last:border-b-0"}>
                                                                                        <div>
                                                                                            <div
                                                                                                className={"update-idea text-sm rounded-full text-center"}>
                                                                                                <UserAvatar
                                                                                                    userPhoto={x?.profileImage}
                                                                                                    userName={x?.name && x.name !== "null" ? x.name : x?.userName}
                                                                                                    initialStyle={"text-sm"}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className={"w-full flex flex-col space-y-3"}>
                                                                                            <div className={"flex gap-1 flex-wrap justify-between"}>
                                                                                                <div className={"flex items-start"}>
                                                                                                    <h4 className={"text-sm font-normal"}>{x?.name && x.name !== "null" ? x.name : x?.userName}</h4>
                                                                                                    <p className={"text-sm font-normal flex items-center text-muted-foreground"}>
                                                                                                        <Dot size={20}
                                                                                                             className={"fill-text-card-foreground stroke-text-card-foreground"}/>
                                                                                                        {moment.utc(x?.createdAt).local().startOf('seconds').fromNow()}
                                                                                                        {x.isEdited && <span className={"text-sm font-normal text-muted-foreground ml-1"}>(edited)</span>}
                                                                                                    </p>
                                                                                                </div>
                                                                                                <div className={"flex gap-2"}>
                                                                                                    {
                                                                                                        selectedCommentIndex === i && isEditComment ? "" :
                                                                                                            x?.createdBy === 1 ?
                                                                                                                (userDetailsReducer?.id == x.userId) ?
                                                                                                                    <Fragment>
                                                                                                                        <ActionButtons
                                                                                                                            isEditable={x?.createdBy === 1}
                                                                                                                            onEdit={() => onEditComment(x, i)}
                                                                                                                            onDelete={() => deleteComment(x.id, i)}
                                                                                                                        />
                                                                                                                    </Fragment>
                                                                                                                    : ""
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
                                                                                                                onCommentChange={(e) => setSelectedComment({
                                                                                                                    ...selectedComment,
                                                                                                                    comment: e.target.value
                                                                                                                })}
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
                                                                                                    <div className={"flex justify-between"}>
                                                                                                        <Button
                                                                                                            className="p-0 text-sm h-auto font-medium text-primary"
                                                                                                            variant={"ghost hover-none"}
                                                                                                            onClick={() => {onShowSubComment(i)}}
                                                                                                            key={`comment-nested-reply-to-${i}`}
                                                                                                        >
                                                                                                            Reply
                                                                                                        </Button>
                                                                                                        <div
                                                                                                            className={"flex items-center gap-2 cursor-pointer"}
                                                                                                            onClick={() => onShowSubComment(i)}
                                                                                                        >
                                                                                                    <span>
                                                                                                        <MessageCircleMore className={"stroke-primary w-[16px] h-[16px]"}/>
                                                                                                    </span>
                                                                                                            <p className={"text-base font-normal"}>
                                                                                                                {x?.reply?.length}
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                            }
                                                                                            {
                                                                                                x.showReply ?
                                                                                                    <div className={"space-y-3"}>
                                                                                                        {
                                                                                                            (x?.reply || []).map((y, j) => {
                                                                                                                return (
                                                                                                                    <Fragment key={j}>
                                                                                                                        <div className={"flex gap-2"}>
                                                                                                                            <div>
                                                                                                                                <div className={"update-idea text-sm rounded-full text-center"}>
                                                                                                                                    <UserAvatar
                                                                                                                                        userPhoto={y.profileImage} initialStyle={"text-sm"}
                                                                                                                                        userName={y?.name && y.name !== "null" ? y.name : y?.userName}/>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div className={"w-full space-y-2"}>
                                                                                                                                <div className={"flex justify-between"}>
                                                                                                                                    <div className={"flex items-start"}>
                                                                                                                                        <h4 className={"text-sm font-normal"}>{y?.name && y.name !== "null" ? y.name : y?.userName}</h4>
                                                                                                                                        <p className={"text-sm font-normal flex items-center text-muted-foreground"}>
                                                                                                                                            <Dot
                                                                                                                                                size={20}
                                                                                                                                                className={"fill-text-card-foreground stroke-text-card-foreground"}/>
                                                                                                                                            {moment.utc(y.createdAt).local().startOf('seconds').fromNow()}
                                                                                                                                            {y.isEdited && <span className={"text-sm font-normal text-muted-foreground ml-1"}>(edited)</span>}
                                                                                                                                        </p>
                                                                                                                                    </div>
                                                                                                                                    {
                                                                                                                                        selectedCommentIndex === i && selectedSubCommentIndex === j ? "" :
                                                                                                                                            y.createdBy === 1 ?
                                                                                                                                                (userDetailsReducer?.id == y.userId) ?
                                                                                                                                                    <ActionButtons
                                                                                                                                                        isEditable={y?.createdBy === 1}
                                                                                                                                                        onEdit={() => onEditSubComment(x, y, i, j)}
                                                                                                                                                        onDelete={() => deleteSubComment(y.id, x, i, j)}
                                                                                                                                                    />
                                                                                                                                                    : ''
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
                                                                                                                        </div>
                                                                                                                    </Fragment>
                                                                                                                )
                                                                                                            })
                                                                                                        }

                                                                                                        <div className={"space-y-2"}>
                                                                                                            {
                                                                                                                subCommentTextEditIdx === i &&
                                                                                                                <Textarea
                                                                                                                    value={subCommentText[i] || ""}
                                                                                                                    onChange={(e) => handleSubCommentTextChange(e, i)}/>
                                                                                                            }
                                                                                                            {
                                                                                                                subCommentFiles && subCommentFiles.length ?
                                                                                                                    <div className={"flex gap-3 flex-wrap"}>
                                                                                                                        {
                                                                                                                            (subCommentFiles || []).map((z, i) => {
                                                                                                                                return (
                                                                                                                                    <div key={i}>
                                                                                                                                        {z && (
                                                                                                                                            <div className="w-[50px] h-[50px] md:w-[100px] md:h-[100px] relative border p-[3px]">
                                                                                                                                                <img
                                                                                                                                                    className="upload-img"
                                                                                                                                                    src={z.name ? URL.createObjectURL(z) : `${DO_SPACES_ENDPOINT}/${z}`}
                                                                                                                                                    alt={z.name || z}
                                                                                                                                                />
                                                                                                                                                <CircleX
                                                                                                                                                    size={20}
                                                                                                                                                    className="stroke-gray-500 dark:stroke-white cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10"
                                                                                                                                                    onClick={() => onDeleteSubCommentImageOld(i, false)}
                                                                                                                                                />
                                                                                                                                            </div>
                                                                                                                                        )}
                                                                                                                                    </div>
                                                                                                                                )
                                                                                                                            })
                                                                                                                        }
                                                                                                                    </div> : ""
                                                                                                            }
                                                                                                            {
                                                                                                                subCommentTextEditIdx === i &&
                                                                                                                <div className={"flex gap-2"}>
                                                                                                                    <Button
                                                                                                                        className={`${isSaveSubComment === true ? "py-2 px-6" : "py-2 px-6"} w-[86px] h-[30px] text-sm font-medium`}
                                                                                                                        disabled={(!subCommentText[i] || subCommentText[i].trim() === "")}
                                                                                                                        onClick={() => onCreateSubComment(x, i)}
                                                                                                                    >
                                                                                                                        {
                                                                                                                            isSaveSubComment && subCommentTextEditIdx === i ?
                                                                                                                                <Loader2 size={16} className="animate-spin"/> : "Reply"
                                                                                                                        }
                                                                                                                    </Button>
                                                                                                                    <UploadButton onChange={handleSubCommentUploadImg}/>
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
                                                                {ideaComment?.comments?.length > 0 && (
                                                                    <div className="flex justify-center py-4">
                                                                        {hasMoreComments ? (
                                                                            <Button
                                                                                onClick={loadMoreComments}
                                                                                disabled={isLoadingComments}
                                                                                className="font-medium"
                                                                            >
                                                                                {isLoadingComments ? (
                                                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                                                ) : null}
                                                                                Load More
                                                                            </Button>
                                                                        ) : ""}
                                                                    </div>
                                                                )}
                                                            </Fragment>
                                                        </TabsContent> : <p className={'py-10 text-center text-muted-foreground text-sm'}>No comments yet, be the first to share your thoughts!</p>
                                                }
                                            </Tabs>
                                        </div>
                                    </Fragment>
                                }
                            </Fragment>
                    }
                </div>
            </div>
        </Fragment>
    );
};

export default UpdateIdea;