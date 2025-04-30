import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {Button} from "../ui/button";
import {ArrowBigUp, ChevronLeft, Circle, Dot, Ellipsis, Filter, MessageCircleMore, Pin, Plus, X,} from "lucide-react";
import {Card, CardContent} from "../ui/card";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../ui/command";
import {Checkbox} from "../ui/checkbox";
import {useNavigate} from "react-router";
import {useSelector} from "react-redux";
import {apiService, baseUrl} from "../../utils/constent";
import moment from "moment";
import {useToast} from "../ui/use-toast";
import ReadMoreText from "../Comman/ReadMoreText";
import {commonLoad} from "../Comman/CommSkel";
import EmptyData from "../Comman/EmptyData";
import CreateIdea from "./CreateIdea";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem,} from "../ui/dropdown-menu";
import {Badge} from "../ui/badge";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {Avatar, AvatarFallback} from "../ui/avatar";
import Pagination from "../Comman/Pagination";
import DeleteDialog from "../Comman/DeleteDialog";
import {RadioGroup, RadioGroupItem} from "../ui/radio-group";
import {debounce} from "lodash";
import {EmptyDataContent} from "../Comman/EmptyDataContent";
import {CommSearchBar} from "../Comman/CommentEditor";
import {DisplayReactQuill} from "../Comman/ReactQuillEditor";
import {EmptyIdeaContent} from "../Comman/EmptyContentForModule";

const filterByStatus = [
    {name: "Archived", value: "isArchive",},
    {name: "Bugs", value: "isActive",},
]

const perPageLimit = 10

const initialStateFilter = {
    all: "",
    roadmapStatusId: [],
    search: "",
    tagId: [],
    status: [],
    isArchive: "",
    isActive: "",
    noStatus: "",
};

const Ideas = () => {
    const navigate = useNavigate();
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo") || 1;
    const getNavOpenSheet = UrlParams.get("opensheet") || false;
    const {toast} = useToast()
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const [ideasList, setIdeasList] = useState([]);
    const [topicLists, setTopicLists] = useState([]);
    const [roadmapStatus, setRoadmapStatus] = useState([]);
    const [filter, setFilter] = useState({...initialStateFilter, projectId: projectDetailsReducer.id});
    const [openFilter, setOpenFilter] = useState('');
    const [openFilterType, setOpenFilterType] = useState('');
    const [pageNo, setPageNo] = useState(Number(getPageNo));
    const [totalRecord, setTotalRecord] = useState(0);
    const [isSheetOpenCreate, setSheetOpenCreate] = useState(false);
    const [isDeleteLoading, setDeleteIsLoading] = useState(false);
    const [load, setLoad] = useState('list');
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteRecord, setDeleteRecord] = useState(null);
    const [emptyContentBlock, setEmptyContentBlock] = useState(true);

    const emptyContent = (status) => {setEmptyContentBlock(status);};

    const openCreateIdea = () => {
        setSheetOpenCreate(true)
        navigate(`${baseUrl}/ideas`);
    };

    useEffect(() => {
        if(getNavOpenSheet === "open"){
            openCreateIdea();
        }
    }, [getNavOpenSheet])

    const closeCreateIdea = () => {setSheetOpenCreate(false)};

    useEffect(() => {
        if(projectDetailsReducer.id){
            getAllIdea(filter);
        }
        setTopicLists( allStatusAndTypes.topics)
        setRoadmapStatus(allStatusAndTypes.roadmapStatus)
        if(getNavOpenSheet) {
            navigate(`${baseUrl}/ideas?opensheet=${getNavOpenSheet}&pageNo=${pageNo}`);
        } else {
            navigate(`${baseUrl}/ideas?pageNo=${pageNo}`);
        }
    }, [projectDetailsReducer.id, pageNo, allStatusAndTypes])

    const getAllIdea = async (getFilter = {}) => {
        setLoad('list');
        const data = await apiService.getAllIdea({
            projectId: projectDetailsReducer.id,
            page: pageNo,
            limit: perPageLimit,
            search: getFilter?.search,
            tagId: getFilter?.tagId,
            roadmapStatusId: getFilter?.roadmapStatusId,
            isArchive: getFilter?.isArchive,
            isActive: getFilter?.isActive,
        })
        if (data.success) {
            setIdeasList(data?.data?.ideas)
            setTotalRecord(data.data.total)
            setLoad('')
            if (!data.data.ideas || data.data.ideas.length === 0) {
                emptyContent(true);
            } else {
                emptyContent(false);
            }
        } else {
            setLoad('');
            emptyContent(true);
        }
    }

    const throttledDebouncedSearch = useCallback(
        debounce((value) => {
            const trimmedValue = value.trim();
            if (trimmedValue || value === '') {
                const updatedFilter = {
                    ...filter,
                    projectId: projectDetailsReducer.id,
                    search: trimmedValue,
                    page: 1,
                };
                setFilter(updatedFilter);
                getAllIdea(updatedFilter);
            }
        }, 500),
        [filter, projectDetailsReducer.id]
    );

    const onChangeSearch = (e) => {
        const value = e.target.value;
        const trimmedValue = value.trim();
        if (trimmedValue || value === '') {
            setFilter(prev => ({ ...prev, search: value }));
            throttledDebouncedSearch(value);
        }
    };

    const clearSearchFilter = () => {
        const updatedFilter = {
            ...filter,
            search: '',
            page: 1,
        };
        setFilter(updatedFilter);
        getAllIdea(updatedFilter);
    };

    const openDetailsSheet = (record) => {
        setIdeasList(prevIdeas =>
            prevIdeas.map(idea =>
                idea.id === record.id
                    ? {
                        ...idea,
                        isRead: 1,
                        comments: idea.comments.map(comment => ({
                            ...comment,
                            isRead: 1
                        }))
                    }
                    : idea
            )
        );
        navigate(`${baseUrl}/ideas/${record.id}`)
        // navigate(`${baseUrl}/ideas/${record.id}?pageNo=${getPageNo}`)
    };

    const handleChange = (e) => {
        let payload = {
            ...filter,
            projectId: projectDetailsReducer.id,
            page: 1,
            limit: perPageLimit,
        };
        if (e.name === "tagId") {
            if (e.value !== null) {
                const clone = [...payload.tagId];
                const index = clone.findIndex(item => item === e.value);
                if (index !== -1) {
                    clone.splice(index, 1);
                } else {
                    clone.push(e.value);
                }
                payload.tagId = clone;
            } else {
                payload.tagId = [];
            }
        } else if (e.name === "roadmapStatusId") {
            if (e.value !== null) {
                const clone = [...payload.roadmapStatusId];
                const index = clone.findIndex(item => item === e.value);
                if (index !== -1) {
                    clone.splice(index, 1);
                } else {
                    clone.push(e.value);
                }
                payload.roadmapStatusId = clone;
            } else {
                payload.roadmapStatusId = [];
            }
        } else if (e.name === "status") {
            if (e.value === "isActive") {
                payload.isActive = payload.isActive === false;
                payload.isArchive = '';
                payload.all = "";
            } else if (e.value === "isArchive") {
                payload.isArchive = payload.isArchive !== true;
                payload.isActive = "";
                payload.all = "";
            } else if (e.value === null) {
                payload.isArchive = "";
                payload.isActive = "";
                payload.all = "";
            }
        }
        setFilter(payload);
        getAllIdea(payload);
    };

    const giveVote = async (record, type) => {
        if (record.createdBy !== 1) {
            if (record.userVote === (type == 1)) {
            } else {
                const payload = {
                    ideaId: record.id,
                    type: type
                };
                const data = await apiService.giveVote(payload);
                if (data.success) {
                    const clone = [...ideasList];
                    const index = clone.findIndex((x) => x.id === record.id);
                    if (index !== -1) {
                        let newVoteCount = clone[index].vote;
                        newVoteCount = type == 1 ? newVoteCount + 1 : newVoteCount >= 1 ? newVoteCount - 1 : 0;
                        clone[index].vote = newVoteCount;
                        clone[index].userVote = type == 1;
                        setIdeasList(clone);
                        toast({ description: data.message });
                    }
                } else {
                    toast({ variant: "destructive", description: data.error });
                }
            }
        } else {
            toast({ variant: "destructive", description: "You can't vote on admin-created ideas" });
        }
    }

    const totalPages = Math.ceil(totalRecord / perPageLimit);

    const handlePaginationClick = async (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setLoad('search');
            setLoad('list');
            setPageNo(newPage);
        } else {
        }
    };

    const handleStatusUpdate = async (name, value, index, record) => {
        const formData = new FormData();
        if (name === "roadmapStatusId" && value === null) {
            value = "";
        }
        formData.append(name, value);
        const data = await apiService.updateIdea(formData, record?.id);
        if (data.success) {
            const clone = [...ideasList];
            if (name === "isArchive" || name === "isActive") {
                clone[index][name] = value;
                const removeStatus =
                    (filter.isActive === false && clone[index].isActive === false) ||
                    (filter.isArchive && clone[index]?.isArchive === false);
                if (removeStatus) {
                    clone.splice(index, 1);
                    setTotalRecord(clone.length)
                }
            } else if (name === "roadmapStatusId") {
                clone[index].roadmapStatusId = value;
            }
            setIdeasList(clone);
            // let payload = {...filter, projectId: projectDetailsReducer.id, page: pageNo, limit: perPageLimit}
            // ideaSearch(payload)
            toast({description: data.message});
        } else {
            toast({variant: "destructive", description: data?.error?.message});
        }
    };

    const onDeleteIdea = async (id) => {
        if (id) {
            setDeleteIsLoading(true)
            const data = await apiService.onDeleteIdea(id);
            if (data.success) {
                const filteredIdeas = ideasList.filter((idea) => idea.id !== id);
                setIdeasList(filteredIdeas);
                setTotalRecord(Number(totalRecord) - 1)
                if (filteredIdeas.length === 0 && pageNo > 1) {
                    setPageNo(pageNo - 1);
                    getAllIdea(pageNo - 1);
                } else {
                    getAllIdea(pageNo);
                }
                setOpenDelete(false)
                setDeleteIsLoading(false)
                setDeleteRecord(null)
                toast({description: data.message});
            } else {
                toast({variant: "destructive", description: data.message});
            }
        }
    };

    const deleteIdea = (record) => {
        setDeleteRecord(record.id)
        setOpenDelete(!openDelete)
    }

    return (
        <Fragment>
            {
                openDelete &&
                <DeleteDialog
                    title={"You really want to delete this Idea?"}
                    isOpen={openDelete}
                    onOpenChange={deleteIdea}
                    onDelete={onDeleteIdea}
                    isDeleteLoading={isDeleteLoading}
                    deleteRecord={deleteRecord}
                />
            }
            <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>

                {
                    isSheetOpenCreate &&
                    <CreateIdea
                        isOpen={isSheetOpenCreate}
                        onOpen={openCreateIdea}
                        onClose={closeCreateIdea}
                        closeCreateIdea={closeCreateIdea}
                        setIdeasList={setIdeasList}
                        ideasList={ideasList}
                        getAllIdea={getAllIdea}
                        pageNo={pageNo}
                    />
                }

                <div className="flex flex-wrap items-center gap-2 justify-between">
                    <div className={"flex flex-col flex-1 gap-y-0.5"}>
                        <h1 className="text-2xl font-normal flex-initial w-auto">Ideas ({totalRecord})</h1>
                        <p className={"text-sm text-muted-foreground"}>Create and display your ideas on your website and encourage users to upvote and comment with their feedback.</p>
                    </div>
                    <div className="w-full lg:w-auto flex sm:flex-nowrap flex-wrap gap-2 items-center">
                        <div className={"flex gap-2 items-center w-full lg:w-auto"}>
                            <CommSearchBar
                                value={filter.search}
                                onChange={onChangeSearch}
                                onClear={clearSearchFilter}
                                placeholder="Search..."
                            />
                            <Popover
                                open={openFilter}
                                onOpenChange={() => {
                                    setOpenFilter(!openFilter);
                                    setOpenFilterType('');
                                }}
                                className="w-full p-0"
                            >
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="icon" className={"w-9 h-9 "}><Filter fill="true" className='w-4 -h4' /></Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0" align='end'>
                                    <Command className="w-full">
                                        <CommandInput placeholder="Search filter..."/>
                                        <CommandList className="w-full">
                                            <CommandEmpty>No filter found.</CommandEmpty>
                                            {
                                                openFilterType === 'tagId' ? <CommandGroup>
                                                    <CommandItem onSelect={() => {setOpenFilterType('')}} className={"p-0 flex gap-2 items-center cursor-pointer p-1"}>
                                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                                        <span className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"}>
                                                            Back
                                                        </span>
                                                    </CommandItem>
                                                    {(topicLists || []).map((x, i) => {
                                                        return (
                                                            <CommandItem key={i} value={x.id} className={"p-0 flex gap-1 items-center cursor-pointer"}>
                                                                <Checkbox
                                                                    className={'m-2'}
                                                                    checked={filter.tagId.includes(x.id)}
                                                                    onClick={() => {
                                                                        handleChange({name: "tagId" , value: x.id});
                                                                        setOpenFilter(true);
                                                                        setOpenFilterType('tagId');
                                                                    }}
                                                                />
                                                                <span
                                                                    onClick={() => {
                                                                        handleChange({name: "tagId" , value: x.id});
                                                                        setOpenFilter(true);
                                                                        setOpenFilterType('tagId');
                                                                    }}
                                                                    className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"}
                                                                >
                                                                    {x.title}
                                                                </span>
                                                            </CommandItem>
                                                        )
                                                    })}
                                                </CommandGroup> : openFilterType === 'roadmapStatusId' ?
                                                    <CommandGroup>
                                                        <CommandItem onSelect={() => {setOpenFilterType('')}} className={"p-0 flex gap-2 items-center cursor-pointer p-1"}>
                                                            <ChevronLeft className="mr-2 h-4 w-4" />
                                                            <span className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"}>
                                                                Back
                                                            </span>
                                                        </CommandItem>
                                                        {(roadmapStatus || []).map((x, i) => {
                                                            return (
                                                                <CommandItem key={i} value={x.value} className={"p-0 flex gap-1 items-center cursor-pointer"}>
                                                                    <Checkbox
                                                                        className={'m-2'}
                                                                        checked={filter.roadmapStatusId.includes(x.id)}
                                                                        onClick={() => {
                                                                            handleChange({name: "roadmapStatusId" , value: x.id});
                                                                            setOpenFilter(true);
                                                                            setOpenFilterType('roadmapStatusId');
                                                                        }}
                                                                    />
                                                                    <span
                                                                        onClick={() => {
                                                                            handleChange({name: "roadmapStatusId" , value: x.id});
                                                                            setOpenFilter(true);
                                                                            setOpenFilterType('roadmapStatusId');
                                                                        }}
                                                                        className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center capitalize"}
                                                                    >
                                                                    <span className={"w-2.5 h-2.5 rounded-full"} style={{backgroundColor: x.colorCode}}/>
                                                                        {x.title}
                                                                </span>
                                                                </CommandItem>
                                                            )
                                                        })}
                                                    </CommandGroup> : openFilterType === 'status' ?
                                                        <CommandGroup>
                                                            <CommandItem onSelect={() => { setOpenFilterType('') }} className={"p-0 flex gap-2 items-center cursor-pointer p-1"}>
                                                                <ChevronLeft className="mr-2 h-4 w-4" />
                                                                <span className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"}>Back</span>
                                                            </CommandItem>
                                                            <RadioGroup
                                                                value={filter.status}
                                                                onValueChange={(value) => {
                                                                    handleChange({ name: "status", value });
                                                                    setOpenFilter(true);
                                                                    setOpenFilterType('status');
                                                                }}
                                                                className={"gap-0.5"}
                                                            >
                                                                {(filterByStatus || []).map((x, i) => {
                                                                    return (
                                                                        <CommandItem key={i} value={x.value} className={"p-0 flex gap-1 items-center cursor-pointer"}>
                                                                            <RadioGroupItem
                                                                                id={x.value}
                                                                                value={x.value}
                                                                                className="m-2"
                                                                                checked={filter[x.value] == 1}
                                                                            />
                                                                            <span
                                                                                onClick={() => {
                                                                                    handleChange({ name: "status", value: x.value });
                                                                                    setOpenFilter(true);
                                                                                    setOpenFilterType('status');
                                                                                }}
                                                                                className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"}
                                                                            >
                                                                                {x.name}</span>
                                                                        </CommandItem>
                                                                    );
                                                                })}
                                                            </RadioGroup>
                                                        </CommandGroup> :
                                                        <CommandGroup>
                                                            <CommandItem onSelect={() => {setOpenFilterType('status');}}>
                                                                <span className={"text-sm font-normal cursor-pointer"}>Status</span>
                                                            </CommandItem>  <CommandItem onSelect={() => {setOpenFilterType('tagId');}}>
                                                            <span className={"text-sm font-normal cursor-pointer"}>Topics</span>
                                                        </CommandItem>
                                                            <CommandItem onSelect={() => {setOpenFilterType('roadmapStatusId');}}>
                                                                <span className={"text-sm font-normal cursor-pointer"}>Roadmap</span>
                                                            </CommandItem>
                                                        </CommandGroup>
                                            }
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Button className={"gap-2 font-medium hover:bg-primary"} onClick={openCreateIdea}><Plus size={20} strokeWidth={3}/><span className={"text-xs md:text-sm font-medium"}>Create Idea</span></Button>
                    </div>
                </div>
                {
                    (filter?.tagId?.length > 0 || filter?.roadmapStatusId?.length > 0 || filter?.isArchive || filter?.isActive === false) && <div className="flex flex-wrap gap-2 my-6">
                        {
                            (filter.tagId || []).map((data,index) =>{
                                const findTopic = (topicLists || []).find((tagId) => tagId.id === data);
                                return(
                                    <Badge key={`selected-${findTopic.id}`} variant="outline" className="rounded p-0 font-medium"><span className="px-3 py-1.5 border-r">{findTopic.title}</span>
                                        <span className="w-7 h-7 flex items-center justify-center cursor-pointer" onClick={() => handleChange({name: "tagId" , value: data})}>
                                                <X className='w-4 h-4'/>
                                            </span>
                                    </Badge>
                                )
                            })
                        }
                        {
                            (filter.roadmapStatusId || []).map((data,index) =>{
                                const findRoadmap = (roadmapStatus || []).find((roadmapStatusId) => roadmapStatusId.id === data);
                                return(
                                    <Badge key={`selected-${findRoadmap.id}`} variant="outline" className="rounded p-0 font-medium">
                                            <span className="px-3 py-1.5 border-r flex gap-2 items-center">
                                                <span className={"w-2.5 h-2.5  rounded-full"} style={{backgroundColor: findRoadmap.colorCode}}/>
                                                {findRoadmap.title}
                                            </span>
                                        <span className="w-7 h-7 flex items-center justify-center cursor-pointer" onClick={() => handleChange({name: "roadmapStatusId" , value: data})}>
                                                <X className='w-4 h-4'/>
                                            </span>
                                    </Badge>
                                )
                            })
                        }
                        {
                            filter.isArchive &&
                            <Badge key={`selected-${filter.isArchive}`} variant="outline" className="rounded p-0 font-medium">
                                <span className="px-3 py-1.5 border-r">Archived</span>
                                <span className="w-7 h-7 flex items-center justify-center cursor-pointer" onClick={() =>  handleChange({name: "status" , value: "isArchive"})}>
                                        <X className='w-4 h-4'/>
                                    </span>
                            </Badge>
                        }
                        {
                            filter.isActive === false &&
                            <Badge key={`selected-${filter.isActive === false}`} variant="outline" className="rounded p-0 font-medium">
                                <span className="px-3 py-1.5 border-r">Bugs</span>
                                <span className="w-7 h-7 flex items-center justify-center cursor-pointer" onClick={() =>  handleChange({name: "status" , value: "isActive"})}>
                                        <X className='w-4 h-4'/>
                                    </span>
                            </Badge>
                        }
                    </div>
                }

                <Card className={"my-6"}>
                    {
                        (load === 'search' || load === 'list') ? (commonLoad.commonParagraphFourIdea) : ideasList.length > 0 ?
                            <CardContent className={"p-0 divide-y"}>
                                {
                                    (ideasList || []).map((x, i) => {
                                        return (
                                            <Fragment key={x.id || i}>
                                                <div className={"flex gap-[5px] md:gap-8 p-2 sm:p-3 lg:py-4 lg:px-5"}>
                                                    <div className={"flex gap-1 md:gap-2"}>
                                                        <Button
                                                            className={"p-0 bg-white shadow border hover:bg-white w-[20px] h-[20px] md:w-[30px] md:h-[30px]"}
                                                            variant={"outline"}
                                                            onClick={() => giveVote(x, 1)}
                                                        >
                                                            <ArrowBigUp size={15} className={"fill-primary stroke-primary"}/>
                                                        </Button>
                                                        <p className={"text-base md:text-xl font-normal"}>{x.vote}</p>
                                                    </div>
                                                    <div className={"flex flex-col w-full gap-3 max-w-[1045px]"}>
                                                        <div className={"flex flex-col gap-3"}>
                                                            <div className={"flex flex-wrap items-center justify-between gap-3"}>
                                                                <div
                                                                    className={"flex flex-wrap items-center gap-1 cursor-pointer xl:gap-3"}
                                                                    onClick={() => openDetailsSheet(x)}
                                                                >
                                                                    <h3 className={"text-base font-normal max-w-[278px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-wrap sm:text-nowrap"}>{x.title}</h3>
                                                                    <div className={"flex gap-2 items-center"}>
                                                                        <h4 className={"text-xs font-normal text-muted-foreground"}>{x.name ? x.name : x?.userName}</h4>
                                                                        <p className={"text-xs font-normal flex items-center text-muted-foreground"}>
                                                                            <Dot size={20} className={"fill-text-card-foreground stroke-text-card-foreground"}/>
                                                                            {moment(x.createdAt).format('D MMM')}
                                                                        </p>
                                                                    </div>
                                                                    <div
                                                                        className={"flex items-center gap-1 sm:gap-2 cursor-pointer"}
                                                                        onClick={() => openDetailsSheet(x)}
                                                                    >
                                                                        <span><MessageCircleMore size={16} className={"stroke-primary"}/></span>
                                                                        <p className={"text-base font-normal"}>
                                                                            {x?.commentCount}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className={"flex flex-wrap gap-2 items-center"}>
                                                                    {
                                                                        (x && x?.tags && x?.tags?.length) ? (
                                                                            <Popover>
                                                                                <PopoverTrigger asChild>
                                                                                    <Button variant={"ghost hove:none"} className={"p-0 h-[24px]"}>
                                                                                        <div className={"flex justify-between items-center"}>
                                                                                            <div className={"text-sm text-center"}>
                                                                                                <div className={`flex flex-wrap gap-2`}>
                                                                                                    {
                                                                                                        x?.tags?.slice(0, 1).map((tagId, i) => (
                                                                                                            <div className={"text-sm font-normal"} key={i}>
                                                                                                                {tagId?.title}
                                                                                                            </div>
                                                                                                        ))
                                                                                                    }
                                                                                                </div>
                                                                                            </div>
                                                                                            {
                                                                                                (x?.tags?.length > 1) &&
                                                                                                <div
                                                                                                    className={"update-idea text-sm rounded-full border text-center"}>
                                                                                                    <Avatar>
                                                                                                        <AvatarFallback>+{x?.tags?.length - 1}</AvatarFallback>
                                                                                                    </Avatar>
                                                                                                </div>
                                                                                            }
                                                                                        </div>
                                                                                    </Button>
                                                                                </PopoverTrigger>
                                                                                <PopoverContent className="p-0" align={"start"}>
                                                                                    <div className={""}>
                                                                                        <div className={"py-3 px-4"}>
                                                                                            <h4 className="font-normal leading-none text-sm">{`Topics (${x?.tags?.length})`}</h4>
                                                                                        </div>
                                                                                        <div className="border-t px-4 py-3 space-y-2">
                                                                                            {x.tags && x.tags.length > 0 && (
                                                                                                <div className="space-y-2">
                                                                                                    {x.tags.map((y, i) => (
                                                                                                        <div className="text-sm font-normal" key={i}>
                                                                                                            {y?.title}
                                                                                                        </div>
                                                                                                    ))}
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                </PopoverContent>
                                                                            </Popover>
                                                                        ) : ""
                                                                    }
                                                                    <Select
                                                                        onValueChange={(value) => handleStatusUpdate("roadmapStatusId", value, i, x)}
                                                                        value={x.roadmapStatusId !== "" ? x.roadmapStatusId : null}>
                                                                        <SelectTrigger className="md:w-[200px] w-[170px] h-8 bg-card">
                                                                            <SelectValue>
                                                                                {x.roadmapStatusId ?  <div className="flex items-center gap-2">
                                                                                    <Circle
                                                                                        fill={
                                                                                            allStatusAndTypes.roadmapStatus.find((status) => status.id === x.roadmapStatusId)?.colorCode
                                                                                        }
                                                                                        stroke={
                                                                                            allStatusAndTypes.roadmapStatus.find((status) => status.id === x.roadmapStatusId)?.colorCode
                                                                                        }
                                                                                        className="w-[10px] h-[10px]"
                                                                                    />
                                                                                    <span className={"max-w-[100px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}>{allStatusAndTypes.roadmapStatus.find((status) => status.id === x.roadmapStatusId)?.title ?? "No status"}</span>
                                                                                </div> : (
                                                                                    <span className="text-gray-500">No status</span>
                                                                                )}
                                                                            </SelectValue>
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectGroup>
                                                                                <SelectItem value={null}>
                                                                                    <div className={"flex items-center gap-2"}>No status</div>
                                                                                </SelectItem>
                                                                                {
                                                                                    (allStatusAndTypes.roadmapStatus || []).map((x, i) => {
                                                                                        return (
                                                                                            <SelectItem key={i}
                                                                                                        value={x.id}>
                                                                                                <div
                                                                                                    className={"flex capitalize items-center gap-2 truncate text-ellipsis overflow-hidden whitespace-nowrap"}>
                                                                                                    <Circle
                                                                                                        fill={x.colorCode}
                                                                                                        stroke={x.colorCode}
                                                                                                        className={` w-[10px] h-[10px]`}/>
                                                                                                    {x.title || "No status"}
                                                                                                </div>
                                                                                            </SelectItem>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </SelectGroup>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {
                                                                        x.isActive === false &&
                                                                        <Badge
                                                                            variant={"outline"}
                                                                            className={`border border-red-500 text-red-500 bg-red-100 `}
                                                                        >
                                                                            Bug
                                                                        </Badge>
                                                                    }
                                                                    {
                                                                        x?.isArchive &&
                                                                        <Badge
                                                                            variant={"outline"}
                                                                            className={`border border-green-500 text-green-500 bg-green-100
                                                                               `}
                                                                        >
                                                                            Archive
                                                                        </Badge>
                                                                    }
                                                                    {x.pinToTop == 1 && <Pin size={16} className={`fill-card-foreground`}/>}
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger>
                                                                            <Ellipsis size={16}/>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align={"end"}>
                                                                            <DropdownMenuItem
                                                                                className={"cursor-pointer"}
                                                                                onClick={() => openDetailsSheet(x)}>Edit</DropdownMenuItem>
                                                                            <DropdownMenuItem
                                                                                className={"cursor-pointer"}
                                                                                onClick={() => handleStatusUpdate("isArchive", x?.isArchive !== true, i, x)}>
                                                                                {x?.isArchive ? "Unarchive" : "Archive"}
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem
                                                                                className={"cursor-pointer capitalize"}
                                                                                onClick={() => handleStatusUpdate("isActive", x.isActive === false, i, x)}>
                                                                                {x.isActive === false ? "Convert to Idea" : "Mark as Bug"}
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem
                                                                                className={"cursor-pointer"}
                                                                                onClick={() => deleteIdea(x)}>Delete</DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </div>
                                                            </div>
                                                            <div className={"description-container text-sm text-muted-foreground"}>
                                                                {
                                                                    <DisplayReactQuill value={x.description} /> ? <ReadMoreText html={x.description} maxLength={300}/> : null
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Fragment>
                                        )
                                    })
                                }
                            </CardContent> : <EmptyData/>
                    }

                    {
                        ideasList.length > 0 ?
                            <Pagination
                                pageNo={pageNo}
                                totalPages={totalPages}
                                isLoading={load === 'search' || load === 'list'}
                                handlePaginationClick={handlePaginationClick}
                                stateLength={ideasList.length}
                            /> : ""
                    }

                </Card>
                {
                    (load === "search" || load === "list" || !emptyContentBlock) ? "" :
                        <EmptyDataContent data={EmptyIdeaContent} onClose={() => emptyContent(false)} setSheetOpenCreate={openCreateIdea}/>
                }
            </div>
        </Fragment>
    );
};

export default Ideas;