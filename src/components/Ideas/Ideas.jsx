import React, {Fragment, useEffect, useState} from 'react';
import {Button} from "../ui/button";
import {ArrowBigUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Circle, Dot, Ellipsis, Filter, Loader2, MessageCircleMore, Pin, Plus, X,} from "lucide-react";
import {Card, CardContent, CardFooter} from "../ui/card";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../ui/command";
import {Checkbox} from "../ui/checkbox";
import SidebarSheet from "../Ideas/SidebarSheet";
import {useTheme} from "../theme-provider";
import {ApiService} from "../../utils/ApiService";
import {useNavigate} from "react-router";
import {useSelector} from "react-redux";
import {baseUrl, urlParams} from "../../utils/constent";
import moment from "moment";
import {useToast} from "../ui/use-toast";
import ReadMoreText from "../Comman/ReadMoreText";
import {CommSkel} from "../Comman/CommSkel";
import EmptyData from "../Comman/EmptyData";
import CreateIdea from "./CreateIdea";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem,} from "../ui/dropdown-menu";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../ui/dialog";
import {Badge} from "../ui/badge";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";

const filterByStatus = [
    {name: "Archived", value: "archive",},
    {name: "Bugs", value: "bug",},
]

const perPageLimit = 10

const initialStateFilter = {
    all: "",
    archive: "",
    bug: "",
    no_status: "",
    roadmap: [],
    topic: [],
    status: [],
};

const Ideas = () => {
    const {theme} = useTheme()
    const navigate = useNavigate();
    let apiSerVice = new ApiService();
    const {toast} = useToast()
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [isSheetOpenCreate, setSheetOpenCreate] = useState(false);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const [ideasList, setIdeasList] = useState([]);
    const [isDeleteLoading, setDeleteIsLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const [selectedIdea, setSelectedIdea] = useState({}); // update idea
    const [oldSelectedIdea, setOldSelectedIdea] = useState({});
    const [isUpdateIdea, setIsUpdateIdea] = useState(false); // update idea close
    const [topicLists, setTopicLists] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [roadmapStatus, setRoadmapStatus] = useState([]);
    const [filter, setFilter] = useState(initialStateFilter);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteRecord, setDeleteRecord] = useState(null);

    const [openFilter, setOpenFilter] = useState('');
    const [openFilterType, setOpenFilterType] = useState('');

    const openSheet = () => setSheetOpen(true);
    const closeSheet = () => setSheetOpen(false);

    const openCreateIdea = () => setSheetOpenCreate(true);
    const closeCreateIdea = () => setSheetOpenCreate(false);

    useEffect(() => {
        if (filter.topic.length || filter.roadmap.length || filter.bug || filter.archive /*|| filter.no_status*/ || filter.all) {
            let payload = {...filter, project_id: projectDetailsReducer.id, page: pageNo, limit: perPageLimit}
            ideaSearch(payload)
        } else {
            getAllIdea()
        }
        setTopicLists(allStatusAndTypes.topics)
        setRoadmapStatus(allStatusAndTypes.roadmap_status)
    }, [projectDetailsReducer.id, pageNo, allStatusAndTypes])

    const getAllIdea = async () => {
        setIsLoading(true)
        const data = await apiSerVice.getAllIdea({
            project_id: projectDetailsReducer.id,
            page: pageNo,
            limit: perPageLimit
        })
        if (data.status === 200) {
            setIdeasList(data.data)
            setTotalRecord(data.total)
            const id = urlParams.get('id') || "";
            if (id) {
                getSingleIdea()
            }
            setIsLoading(false)
        } else {
            // setIsLoading(false)
        }
    }

    const getSingleIdea = async () => {
        const id = urlParams.get('id') || "";
        const data = await apiSerVice.getSingleIdea(id);
        if (data.status === 200) {
            setSelectedIdea(data.data)
            setOldSelectedIdea(data.data)
            setIsUpdateIdea(true)
            navigate(`${baseUrl}/ideas`)
        }
    }

    const ideaSearch = async (payload) => {
        setIsLoadingSearch(true)
        const data = await apiSerVice.ideaSearch(payload)
        if (data.status === 200) {
            setIdeasList(data.data)
            setTotalRecord(data.total)
            setIsLoadingSearch(false)
            setPageNo(payload.page)
        } else {
            setIsLoadingSearch(false)
        }
    }

    const openDetailsSheet = (record) => {
        setSelectedIdea(record)
        setOldSelectedIdea(record)
        openSheet();
    };

    const handleChange = (e) => {
        let payload = {
            ...filter,
            project_id: projectDetailsReducer.id,
            page: 1,
            limit: perPageLimit,
        };
        if (e.name === "topic") {
            if (e.value !== null) {
                const clone = [...payload.topic];
                const index = clone.findIndex(item => item === e.value);
                if (index !== -1) {
                    clone.splice(index, 1);
                } else {
                    clone.push(e.value);
                }
                payload.topic = clone;
            } else {
                payload.topic = [];
            }
        } else if (e.name === "roadmap") {
            if (e.value !== null) {
                const clone = [...payload.roadmap];
                const index = clone.findIndex(item => item === e.value);
                if (index !== -1) {
                    clone.splice(index, 1);
                } else {
                    clone.push(e.value);
                }
                payload.roadmap = clone;
            } else {
                payload.roadmap = [];
            }
        } else if (e.name === "status") {
            if (e.value === "bug") {
                payload.bug = payload.bug === 1 ? 0 : 1;
                payload.archive = 0;
                payload.all = 0;
            } else if (e.value === "archive") {
                payload.archive = payload.archive === 1 ? 0 : 1;
                payload.bug = 0;
                payload.all = 0;
            } else if (e.value === null) {
                payload.archive = 1;
                payload.bug = 1;
                payload.all = 1;
            }
        }
        setFilter(payload);
        ideaSearch(payload);
    };

    const giveVote = async (record, type) => {
        if (record.is_edit !== 1) {
            if (record.user_vote === type) {
            } else {
                const payload = {
                    feature_idea_id: record.id,
                    type: type
                }
                const data = await apiSerVice.giveVote(payload);
                if (data.status === 200) {
                    const clone = [...ideasList];
                    const index = clone.findIndex((x) => x.id === record.id)
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
                    }
                    toast({description: data.message})
                } else {
                    toast({variant: "destructive", description: data.error})
                }
            }
        } else {
            toast({variant: "destructive", description: "Login user can not use upvote or down vote"})
        }
    }

    const onUpdateIdeaClose = () => {
        setIsUpdateIdea(false);
        setSelectedIdea({})
    }

    const totalPages = Math.ceil(totalRecord / perPageLimit);

    const handlePaginationClick = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPageNo(newPage);
        }
    };

    const handleStatusUpdate = async (name, value, index, record) => {
        const formData = new FormData();
        formData.append(name, value);
        const data = await apiSerVice.updateIdea(formData, record?.id);
        if (data.status === 200) {
            const clone = [...ideasList];
            if (name === "is_archive" || name === "is_active") {
                clone[index][name] = value;
            } else if (name === "roadmap_id") {
                clone[index].roadmap_id = value;
            }
            setIdeasList(clone);
            toast({description: `${name.replace('_', ' ')} status updated successfully`});
        } else {
            toast({variant: "destructive", description: `Failed to update ${name.replace('_', ' ')} status`});
        }
    };

    const onDeleteIdea = async (id) => {
        if (id) {
            setDeleteIsLoading(true)
            const data = await apiSerVice.onDeleteIdea(id);
            if (data.status === 200) {
                const filteredIdeas = ideasList.filter((idea) => idea.id !== id);
                setIdeasList(filteredIdeas);
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
                <Fragment>
                    <Dialog open onOpenChange={deleteIdea}>
                        <DialogContent className={"max-w-[350px] w-full sm:max-w-[425px] p-3 md:p-6 rounded-lg"}>
                            <DialogHeader className={"flex flex-row justify-between gap-2"}>
                                <div className={"flex flex-col gap-2"}>
                                    <DialogTitle className={"text-start"}>You really want delete this idea?</DialogTitle>
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
                                    className={`${theme === "dark" ? "text-card-foreground" : "text-card"} ${isDeleteLoading === true ? "py-2 px-6" : "py-2 px-6"} w-[76px] text-sm font-semibold bg-destructive`}
                                    onClick={() => onDeleteIdea(deleteRecord)}
                                >
                                    {isDeleteLoading ? <Loader2 size={16} className={"animate-spin"}/> : "Delete"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Fragment>
            }
            <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>
                <SidebarSheet
                    isOpen={isSheetOpen}
                    onOpen={openSheet}
                    onClose={closeSheet}
                    selectedIdea={selectedIdea}
                    setSelectedIdea={setSelectedIdea}
                    ideasList={ideasList}
                    setIdeasList={setIdeasList}
                    setOldSelectedIdea={setOldSelectedIdea}
                    oldSelectedIdea={oldSelectedIdea}
                />
                <CreateIdea
                    isOpen={isSheetOpenCreate}
                    onOpen={openCreateIdea}
                    onClose={closeCreateIdea}
                    closeCreateIdea={closeCreateIdea}
                    setIdeasList={setIdeasList}
                    ideasList={ideasList}
                />

                    <div className="flex items-center gap-4 mb-6 justify-between">
                        <h1 className="text-2xl font-medium flex-initial w-auto">Ideas</h1>
                        <div className="flex gap-2 flex-1 w-full justify-end">
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
                                                openFilterType === 'topic' ? <CommandGroup>
                                                    <CommandItem  className={"p-0 flex gap-2 items-center cursor-pointer p-1"}>
                                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                                        <span
                                                            onClick={() => {setOpenFilterType('');}}
                                                            className={"flex-1 w-full text-sm font-medium cursor-pointer flex gap-2 items-center"}
                                                        >
                                                            Back
                                                        </span>
                                                    </CommandItem>
                                                    {(topicLists || []).map((x, i) => {
                                                        return (
                                                            <CommandItem key={i} value={x.id} className={"p-0 flex gap-1 items-center cursor-pointer"}>
                                                                <Checkbox
                                                                    className={'m-2'}
                                                                    checked={filter.topic.includes(x.id)}
                                                                    onClick={() => {
                                                                        handleChange({name: "topic" , value: x.id});
                                                                        setOpenFilter(true);
                                                                        setOpenFilterType('topic');
                                                                    }}
                                                                />
                                                                <span
                                                                    onClick={() => {
                                                                        handleChange({name: "topic" , value: x.id});
                                                                        setOpenFilter(true);
                                                                        setOpenFilterType('topic');
                                                                    }}
                                                                    className={"flex-1 w-full text-sm font-medium cursor-pointer flex gap-2 items-center"}
                                                                >
                                                                    {x.title}
                                                                </span>
                                                            </CommandItem>
                                                        )
                                                    })}
                                                </CommandGroup> : openFilterType === 'roadmap' ?
                                                    <CommandGroup>
                                                        <CommandItem className={"p-0 flex gap-2 items-center cursor-pointer p-1"}>
                                                            <ChevronLeft className="mr-2 h-4 w-4" />
                                                            <span
                                                                onClick={() => {setOpenFilterType('')}}
                                                                className={"flex-1 w-full text-sm font-medium cursor-pointer flex gap-2 items-center"}
                                                            >
                                                                Back
                                                            </span>
                                                        </CommandItem>
                                                    {(roadmapStatus || []).map((x, i) => {
                                                        return (
                                                            <CommandItem key={i} value={x.value} className={"p-0 flex gap-1 items-center cursor-pointer"}>
                                                                <Checkbox
                                                                    className={'m-2'}
                                                                    checked={filter.roadmap.includes(x.id)}
                                                                    onClick={() => {
                                                                        handleChange({name: "roadmap" , value: x.id});
                                                                        setOpenFilter(true);
                                                                        setOpenFilterType('roadmap');
                                                                    }}
                                                                />
                                                                <span
                                                                    onClick={() => {
                                                                        handleChange({name: "roadmap" , value: x.id});
                                                                        setOpenFilter(true);
                                                                        setOpenFilterType('roadmap');
                                                                    }}
                                                                    className={"flex-1 w-full text-sm font-medium cursor-pointer flex gap-2 items-center"}
                                                                >
                                                                    <span className={"w-2.5 h-2.5 rounded-full"} style={{backgroundColor: x.color_code}}/>
                                                                    {x.title}
                                                                </span>
                                                            </CommandItem>
                                                        )
                                                    })}
                                                </CommandGroup> : openFilterType === 'status' ?
                                                    <CommandGroup>
                                                        <CommandItem  className={"p-0 flex gap-2 items-center cursor-pointer p-1"}>
                                                            <ChevronLeft className="mr-2 h-4 w-4" />
                                                            <span
                                                                onClick={() => {
                                                                    setOpenFilterType('');
                                                                }}
                                                                className={"flex-1 w-full text-sm font-medium cursor-pointer flex gap-2 items-center"}
                                                            >
                                                                Back
                                                            </span>
                                                        </CommandItem>
                                                        {(filterByStatus || []).map((x, i) => {
                                                            return (
                                                                <CommandItem key={i} value={x.value} className={"p-0 flex gap-1 items-center cursor-pointer"}>
                                                                    <Checkbox className={'m-2'} checked={filter[x.value] === 1} onClick={() => {
                                                                        handleChange({name: "status" , value: x.value});
                                                                        setOpenFilter(true);
                                                                        setOpenFilterType('status');
                                                                    }}/>
                                                                    <span onClick={() => {
                                                                        handleChange({name: "status" , value: x.value});
                                                                        setOpenFilter(true);
                                                                        setOpenFilterType('status');
                                                                    }} className={"flex-1 w-full text-sm font-medium cursor-pointer flex gap-2 items-center"}>{x.name}</span>
                                                                </CommandItem>
                                                            )
                                                        })}
                                                    </CommandGroup> :
                                                        <CommandGroup>
                                                            <CommandItem onSelect={() => {setOpenFilterType('status');}}>
                                                                <span className={"text-sm font-medium cursor-pointer"}>Status</span>
                                                            </CommandItem>  <CommandItem onSelect={() => {setOpenFilterType('topic');}}>
                                                                <span className={"text-sm font-medium cursor-pointer"}>Topics</span>
                                                            </CommandItem>
                                                            <CommandItem onSelect={() => {setOpenFilterType('roadmap');}}>
                                                                <span className={"text-sm font-medium cursor-pointer"}>Roadmap</span>
                                                            </CommandItem>
                                                        </CommandGroup>
                                            }
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <Button size="sm" className="gap-2" onClick={openCreateIdea}><Plus/>Create Idea</Button>
                        </div>
                    </div>
                    {
                        (filter.topic.length > 0 || filter.roadmap.length > 0 || filter.archive === 1 || filter.bug === 1) && <div className="flex flex-wrap gap-2 mb-6">
                            {
                                (filter.topic || []).map((data,index) =>{
                                    const findTopic = (topicLists || []).find((topic) => topic.id === data);
                                    return(
                                        <Badge key={`selected-${findTopic.id}`} variant="outline" className="rounded p-0"><span className="px-3 py-1.5 border-r">{findTopic.title}</span>
                                            <span className="w-7 h-7 flex items-center justify-center cursor-pointer" onClick={() => handleChange({name: "topic" , value: data})}>
                                                <X className='w-4 h-4'/>
                                            </span>
                                        </Badge>
                                    )
                                })
                            }
                            {
                                (filter.roadmap || []).map((data,index) =>{
                                    const findRoadmap = (roadmapStatus || []).find((roadmap) => roadmap.id === data);
                                    return(
                                        <Badge key={`selected-${findRoadmap.id}`} variant="outline" className="rounded p-0">
                                            <span className="px-3 py-1.5 border-r flex gap-2 items-center">
                                                <span className={"w-2.5 h-2.5  rounded-full"} style={{backgroundColor: findRoadmap.color_code}}/>
                                                {findRoadmap.title}
                                            </span>
                                            <span className="w-7 h-7 flex items-center justify-center cursor-pointer" onClick={() => handleChange({name: "roadmap" , value: data})}>
                                                <X className='w-4 h-4'/>
                                            </span>
                                        </Badge>
                                    )
                                })
                            }
                            {
                                filter.archive === 1 &&
                                <Badge key={`selected-${filter.archive}`} variant="outline" className="rounded p-0">
                                    <span className="px-3 py-1.5 border-r">Archived</span>
                                    <span className="w-7 h-7 flex items-center justify-center cursor-pointer" onClick={() =>  handleChange({name: "status" , value: "archive"})}>
                                        <X className='w-4 h-4'/>
                                    </span>
                                </Badge>
                            }
                            {
                                filter.bug === 1 &&
                                <Badge key={`selected-${filter.bug}`} variant="outline" className="rounded p-0">
                                    <span className="px-3 py-1.5 border-r">Bugs</span>
                                    <span className="w-7 h-7 flex items-center justify-center cursor-pointer" onClick={() =>  handleChange({name: "status" , value: "bug"})}>
                                        <X className='w-4 h-4'/>
                                    </span>
                                </Badge>
                            }
                        </div>
                    }

                    <div className={"mt-8"}>
                        <Card>
                            {
                                (isLoading || isLoadingSearch) ? CommSkel.commonParagraphFourIdea : ideasList.length > 0 ?
                                    <CardContent className={"p-0"}>
                                        {
                                            (ideasList || []).map((x, i) => {
                                                return (
                                                    <Fragment key={i}>
                                                        <div className={"flex gap-[5px] md:gap-8 p-2 sm:p-3 lg:py-6 lg:px-16"}>
                                                            <div className={"flex gap-1 md:gap-2"}>
                                                                <Button
                                                                    className={"p-0 bg-white shadow border hover:bg-white w-[20px] h-[20px] md:w-[30px] md:h-[30px]"}
                                                                    variant={"outline"}
                                                                    onClick={() => giveVote(x, 1)}
                                                                >
                                                                    <ArrowBigUp size={15} className={"fill-primary stroke-primary"}/>
                                                                </Button>
                                                                <p className={"text-base md:text-xl font-medium"}>{x.vote}</p>
                                                            </div>
                                                            <div className={"flex flex-col w-full gap-6"}>
                                                                <div className={"flex flex-col gap-[11px]"}>
                                                                    <div className={"flex flex-wrap items-center justify-between gap-3 md:flex-nowrap"}>
                                                                        <div
                                                                            className={"flex flex-wrap items-center gap-1 cursor-pointer xl:gap-3"}
                                                                            onClick={() => openDetailsSheet(x)}
                                                                        >
                                                                            <h3 className={"text-base font-medium"}>{x.title}</h3>
                                                                            <div className={"flex gap-2"}>
                                                                                <h4 className={"text-sm font-medium"}>{x.name}</h4>
                                                                                <p className={"text-xs font-normal flex items-center text-muted-foreground"}>
                                                                                    <Dot className={"fill-text-card-foreground stroke-text-card-foreground"}/>
                                                                                    {moment(x.created_at).format('D MMM')}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className={"flex gap-2 items-center"}>
                                                                            {
                                                                                x.is_active == 0 &&
                                                                                <Badge
                                                                                    variant={"outline"}
                                                                                    className={`border border-red-500 text-red-500 bg-red-100 `}
                                                                                >
                                                                                    Bug
                                                                                </Badge>
                                                                            }
                                                                            {
                                                                                x.is_archive == 1 &&
                                                                                <Badge
                                                                                    variant={"outline"}
                                                                                    className={`border border-green-500 text-green-500 bg-green-100
                                                                               `}
                                                                                >
                                                                                    Archive
                                                                                </Badge>
                                                                            }
                                                                            {x.pin_to_top === 1 && <Pin size={16} fill={"bg-card-foreground"}/>}
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
                                                                                        onClick={() => handleStatusUpdate("is_archive", x.is_archive == 1 ? 0 : 1, i, x)}>
                                                                                        {x?.is_archive === 1 ? "Unarchive" : "Archive"}
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem
                                                                                        className={"cursor-pointer"}
                                                                                        onClick={() => handleStatusUpdate("is_active", x.is_active === 1 ? 0 : 1, i, x)}>
                                                                                        {x.is_active === 0 ? "Convert to Idea" : "Mark as bug"}
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem
                                                                                        className={"cursor-pointer"}
                                                                                        onClick={() => deleteIdea(x)}>Delete</DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                        </div>
                                                                    </div>
                                                                    <div className={"description-container text-sm text-muted-foreground"}>
                                                                        <ReadMoreText html={x.description}/>
                                                                    </div>
                                                                </div>
                                                                <div className={`flex ${x.topic && x.topic.length > 0 ? "justify-between" : "sm:justify-between gap-0 justify-start"} items-center flex-wrap gap-2`}>
                                                                    <div className={`flex flex-wrap gap-2`}>
                                                                        {
                                                                            (x.topic && x.topic.length > 0) &&
                                                                            <div className={`flex flex-wrap gap-2`}>
                                                                                {
                                                                                    x.topic.map((y, i) => (
                                                                                        <div className={"text-sm font-medium"} key={i}> {y?.title}</div>
                                                                                    ))
                                                                                }
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                    <div className={"flex items-center md:gap-8 gap-1"}>
                                                                        <Select
                                                                            onValueChange={(value) => handleStatusUpdate("roadmap_id", value, i, x)}
                                                                            value={x.roadmap_id}>
                                                                            <SelectTrigger
                                                                                className="md:w-[291px] w-[170px] bg-card">
                                                                                <SelectValue/>
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectGroup>
                                                                                    <SelectItem value={null}>
                                                                                        <div
                                                                                            className={"flex items-center gap-2"}>
                                                                                            No status
                                                                                        </div>
                                                                                    </SelectItem>
                                                                                    {
                                                                                        (allStatusAndTypes.roadmap_status || []).map((x, i) => {
                                                                                            return (
                                                                                                <SelectItem key={i}
                                                                                                            value={x.id}>
                                                                                                    <div
                                                                                                        className={"flex items-center gap-2"}>
                                                                                                        <Circle
                                                                                                            fill={x.color_code}
                                                                                                            stroke={x.color_code}
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
                                                                        <div
                                                                            className={"flex items-center gap-1 sm:gap-2 cursor-pointer"}
                                                                            onClick={() => openDetailsSheet(x)}
                                                                        >
                                                                            <span>
                                                                                <MessageCircleMore
                                                                                    className={"stroke-primary w-[16px] h-[16px]"}/>
                                                                            </span>
                                                                            <p className={"text-base font-medium"}>
                                                                                {x && x.comments && x.comments.length ? x.comments.length : 0}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={"border-b"}/>
                                                    </Fragment>
                                                )
                                            })
                                        }
                                    </CardContent> : <EmptyData/>
                            }

                        <CardFooter className={"p-0"}>
                            <div
                                className={`w-full ${theme === "dark" ? "" : "bg-muted"} rounded-b-lg rounded-t-none flex justify-end p-2 md:p-4`}>
                                <div className={"w-full flex gap-2 items-center justify-between sm:justify-end"}>
                                    <div>
                                        <h5 className={"text-sm font-semibold"}>Page {pageNo} of {totalPages}</h5>
                                    </div>
                                    <div className={"flex flex-row gap-2 items-center"}>
                                        <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}
                                                onClick={() => handlePaginationClick(1)} disabled={pageNo === 1}>
                                            <ChevronsLeft
                                                className={pageNo === 1 ? "stroke-muted-foreground" : "stroke-primary"}/>
                                        </Button>
                                        <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}
                                                onClick={() => handlePaginationClick(pageNo - 1)}
                                                disabled={pageNo === 1}>
                                            <ChevronLeft
                                                className={pageNo === 1 ? "stroke-muted-foreground" : "stroke-primary"}/>
                                        </Button>
                                        <Button variant={"outline"} className={" h-[30px] w-[30px] p-1.5"}
                                                onClick={() => handlePaginationClick(pageNo + 1)}
                                                disabled={pageNo === totalPages}>
                                            <ChevronRight
                                                className={pageNo === totalPages ? "stroke-muted-foreground" : "stroke-primary"}/>
                                        </Button>
                                        <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}
                                                onClick={() => handlePaginationClick(totalPages)}
                                                disabled={pageNo === totalPages}>
                                            <ChevronsRight
                                                className={pageNo === totalPages ? "stroke-muted-foreground" : "stroke-primary"}/>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </Fragment>
    );
};

export default Ideas;