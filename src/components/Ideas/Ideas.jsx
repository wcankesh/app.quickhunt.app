import React, {Fragment, useEffect, useState} from 'react';
import {Button} from "../ui/button";
import {ArrowBigUp, ChevronLeft, Circle, Dot, Ellipsis, Filter, MessageCircleMore, Pin, Plus, X,} from "lucide-react";
import {Card, CardContent} from "../ui/card";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../ui/command";
import {Checkbox} from "../ui/checkbox";
import {ApiService} from "../../utils/ApiService";
import {useNavigate} from "react-router";
import {useSelector} from "react-redux";
import {baseUrl, cleanQuillHtml} from "../../utils/constent";
import moment from "moment";
import {useToast} from "../ui/use-toast";
import ReadMoreText from "../Comman/ReadMoreText";
import {CommSkel} from "../Comman/CommSkel";
import EmptyData from "../Comman/EmptyData";
import CreateIdea from "./CreateIdea";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem,} from "../ui/dropdown-menu";
import {Badge} from "../ui/badge";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import Pagination from "../Comman/Pagination";
import DeleteDialog from "../Comman/DeleteDialog";
import {RadioGroup, RadioGroupItem} from "../ui/radio-group";

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
    const navigate = useNavigate();
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo") || 1;
    let apiSerVice = new ApiService();
    const {toast} = useToast()
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const [ideasList, setIdeasList] = useState([]);
    const [topicLists, setTopicLists] = useState([]);
    const [roadmapStatus, setRoadmapStatus] = useState([]);
    const [filter, setFilter] = useState(initialStateFilter);
    const [openFilter, setOpenFilter] = useState('');
    const [openFilterType, setOpenFilterType] = useState('');
    const [pageNo, setPageNo] = useState(Number(getPageNo));
    const [totalRecord, setTotalRecord] = useState(0);
    const [isSheetOpenCreate, setSheetOpenCreate] = useState(false);
    const [isDeleteLoading, setDeleteIsLoading] = useState(false);
    const [load, setLoad] = useState('');
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteRecord, setDeleteRecord] = useState(null);

    const openCreateIdea = () => {setSheetOpenCreate(true)};

    const closeCreateIdea = () => {setSheetOpenCreate(false)};

    useEffect(() => {
        if (filter.topic.length || filter.roadmap.length || filter.bug || filter.archive /*|| filter.no_status*/ || filter.all) {
            let payload = {...filter, project_id: projectDetailsReducer.id, page: pageNo, limit: perPageLimit}
            ideaSearch(payload)
        } else {
            if(projectDetailsReducer.id){
                getAllIdea()
            }
        }
        setTopicLists(allStatusAndTypes.topics)
        setRoadmapStatus(allStatusAndTypes.roadmap_status)
        navigate(`${baseUrl}/ideas?pageNo=${pageNo}`);
    }, [projectDetailsReducer.id, pageNo, allStatusAndTypes])

    const getAllIdea = async () => {
        setLoad('list');
        const data = await apiSerVice.getAllIdea({
            project_id: projectDetailsReducer.id,
            page: pageNo,
            limit: perPageLimit
        })
        if (data.status === 200) {
            setIdeasList(data.data)
            setTotalRecord(data.total)
            setLoad('')
        } else {
            setLoad('')
        }
    }

    const ideaSearch = async (payload) => {
        setLoad('search')
        const data = await apiSerVice.ideaSearch(payload)
        if (data.status === 200) {
            setIdeasList(data.data)
            setTotalRecord(data.total)
            setPageNo(payload.page)
            setLoad('')
        } else {
            setLoad('')
        }
    }

    const openDetailsSheet = (record) => {
        navigate(`${baseUrl}/ideas/${record.id}?pageNo=${getPageNo}`)
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
                    toast({variant: "destructive", description: data.message})
                }
            }
        } else {
            toast({variant: "destructive", description: "You can't vote your own ideas"})
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
        if (name === "roadmap_id" && value === null) {
            value = "";
        }
        formData.append(name, value);
        const data = await apiSerVice.updateIdea(formData, record?.id);
        if (data.status === 200) {
            const clone = [...ideasList];
            if (name === "is_archive" || name === "is_active") {
                clone[index][name] = value;
                const removeStatus =
                    (filter.bug == 1 && clone[index].is_active == 1) ||
                    (filter.archive == 1 && clone[index].is_archive == 0);
                if (removeStatus) {
                    clone.splice(index, 1);
                    setTotalRecord(clone.length)
                }
            } else if (name === "roadmap_id") {
                clone[index].roadmap_id = value;
            }
            setIdeasList(clone);
            // let payload = {...filter, project_id: projectDetailsReducer.id, page: pageNo, limit: perPageLimit}
            // ideaSearch(payload)
            toast({description: data.message});
        } else {
            toast({variant: "destructive", description: data.message});
        }
    };

    const onDeleteIdea = async (id) => {
        if (id) {
            setDeleteIsLoading(true)
            const data = await apiSerVice.onDeleteIdea(id);
            if (data.status === 200) {
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
                    />
                }

                    <div className="flex flex-wrap items-center gap-2 justify-between">
                        <div className={"flex flex-col gap-y-0.5"}>
                            <h1 className="text-2xl font-normal flex-initial w-auto">Ideas ({totalRecord})</h1>
                            <p className={"text-sm text-muted-foreground"}>Create and display your ideas on your website and encourage users to upvote and comment with their feedback.</p>
                        </div>
                        <div className="flex gap-2">
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
                                                                    className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"}
                                                                >
                                                                    {x.title}
                                                                </span>
                                                            </CommandItem>
                                                        )
                                                    })}
                                                </CommandGroup> : openFilterType === 'roadmap' ?
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
                                                                    className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center capitalize"}
                                                                >
                                                                    <span className={"w-2.5 h-2.5 rounded-full"} style={{backgroundColor: x.color_code}}/>
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
                                                                                checked={filter[x.value] === 1}
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
                                                            </CommandItem>  <CommandItem onSelect={() => {setOpenFilterType('topic');}}>
                                                                <span className={"text-sm font-normal cursor-pointer"}>Topics</span>
                                                            </CommandItem>
                                                            <CommandItem onSelect={() => {setOpenFilterType('roadmap');}}>
                                                                <span className={"text-sm font-normal cursor-pointer"}>Roadmap</span>
                                                            </CommandItem>
                                                        </CommandGroup>
                                            }
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <Button className={"gap-2 font-medium hover:bg-primary"} onClick={openCreateIdea}><Plus size={20} strokeWidth={3}/>Create Idea</Button>
                        </div>
                    </div>
                    {
                        (filter.topic.length > 0 || filter.roadmap.length > 0 || filter.archive === 1 || filter.bug === 1) && <div className="flex flex-wrap gap-2 my-6">
                            {
                                (filter.topic || []).map((data,index) =>{
                                    const findTopic = (topicLists || []).find((topic) => topic.id === data);
                                    return(
                                        <Badge key={`selected-${findTopic.id}`} variant="outline" className="rounded p-0 font-medium"><span className="px-3 py-1.5 border-r">{findTopic.title}</span>
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
                                        <Badge key={`selected-${findRoadmap.id}`} variant="outline" className="rounded p-0 font-medium">
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
                                <Badge key={`selected-${filter.archive}`} variant="outline" className="rounded p-0 font-medium">
                                    <span className="px-3 py-1.5 border-r">Archived</span>
                                    <span className="w-7 h-7 flex items-center justify-center cursor-pointer" onClick={() =>  handleChange({name: "status" , value: "archive"})}>
                                        <X className='w-4 h-4'/>
                                    </span>
                                </Badge>
                            }
                            {
                                filter.bug === 1 &&
                                <Badge key={`selected-${filter.bug}`} variant="outline" className="rounded p-0 font-medium">
                                    <span className="px-3 py-1.5 border-r">Bugs</span>
                                    <span className="w-7 h-7 flex items-center justify-center cursor-pointer" onClick={() =>  handleChange({name: "status" , value: "bug"})}>
                                        <X className='w-4 h-4'/>
                                    </span>
                                </Badge>
                            }
                        </div>
                    }

                <Card className={"mt-6"}>
                    {
                        (load === 'search' || load === 'list') ? (CommSkel.commonParagraphFourIdea) : ideasList.length > 0 ?
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
                                                                    <h3 className={"text-base font-normal max-w-[278px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}>{x.title}</h3>
                                                                    <div className={"flex gap-2 items-center"}>
                                                                        <h4 className={"text-xs font-normal text-muted-foreground"}>{x.name}</h4>
                                                                        <p className={"text-xs font-normal flex items-center text-muted-foreground"}>
                                                                            <Dot size={20} className={"fill-text-card-foreground stroke-text-card-foreground"}/>
                                                                            {moment(x.created_at).format('D MMM')}
                                                                        </p>
                                                                    </div>
                                                                    <div
                                                                        className={"flex items-center gap-1 sm:gap-2 cursor-pointer"}
                                                                        onClick={() => openDetailsSheet(x)}
                                                                    >
                                                                        <span><MessageCircleMore size={16} className={"stroke-primary"}/></span>
                                                                        <p className={"text-base font-normal"}>
                                                                            {x && x.comments && x.comments.length ? x.comments.length : 0}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className={"flex flex-wrap gap-2 items-center"}>
                                                                    {
                                                                        (x && x?.topic && x?.topic?.length) ? (
                                                                            <Popover>
                                                                                <PopoverTrigger asChild>
                                                                                    <Button variant={"ghost hove:none"} className={"p-0 h-[24px]"}>
                                                                                        <div className={"flex justify-between items-center"}>
                                                                                                <div className={"text-sm text-center"}>
                                                                                                    <div className={`flex flex-wrap gap-2`}>
                                                                                                        {
                                                                                                            x?.topic?.slice(0, 1).map((topic, i) => (
                                                                                                                <div className={"text-sm font-normal"} key={i}>
                                                                                                                    {topic?.title}
                                                                                                                </div>
                                                                                                            ))
                                                                                                        }
                                                                                                    </div>
                                                                                                </div>
                                                                                            {
                                                                                                (x?.topic?.length > 1) &&
                                                                                                <div
                                                                                                    className={"update-idea text-sm rounded-full border text-center"}>
                                                                                                    <Avatar>
                                                                                                        <AvatarFallback>+{x?.topic?.length - 1}</AvatarFallback>
                                                                                                    </Avatar>
                                                                                                </div>
                                                                                            }
                                                                                        </div>
                                                                                    </Button>
                                                                                </PopoverTrigger>
                                                                                <PopoverContent className="p-0" align={"start"}>
                                                                                    <div className={""}>
                                                                                        <div className={"py-3 px-4"}>
                                                                                            <h4 className="font-normal leading-none text-sm">{`Topics (${x?.topic?.length})`}</h4>
                                                                                        </div>
                                                                                        <div className="border-t px-4 py-3 space-y-2">
                                                                                            {x.topic && x.topic.length > 0 && (
                                                                                                <div className="space-y-2">
                                                                                                    {x.topic.map((y, i) => (
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
                                                                        onValueChange={(value) => handleStatusUpdate("roadmap_id", value, i, x)}
                                                                        value={x.roadmap_id}>
                                                                        <SelectTrigger className="md:w-[200px] w-[170px] h-8 bg-card">
                                                                            <SelectValue/>
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectGroup>
                                                                                <SelectItem value={null}>
                                                                                    <div className={"flex items-center gap-2"}>No status</div>
                                                                                </SelectItem>
                                                                                {
                                                                                    (allStatusAndTypes.roadmap_status || []).map((x, i) => {
                                                                                        return (
                                                                                            <SelectItem key={i}
                                                                                                        value={x.id}>
                                                                                                <div
                                                                                                    className={"flex capitalize items-center gap-2 truncate text-ellipsis overflow-hidden whitespace-nowrap"}>
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
                                                                    {x.pin_to_top === 1 && <Pin size={16} className={`fill-card-foreground`}/>}
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
                                                                                className={"cursor-pointer capitalize"}
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
                                                                {
                                                                    cleanQuillHtml(x?.description) ? <ReadMoreText html={x.description} maxLength={300}/> : null
                                                                }
                                                            </div>
                                                        </div>
                                                        {/*<div className={`flex ${x.topic && x.topic.length > 0 ? "justify-between gap-2" : "sm:justify-between gap-0 justify-start"} items-center flex-wrap`}>*/}
                                                        {/*    /!*<div className={`flex flex-wrap gap-2`}>*!/*/}
                                                        {/*    /!*    {*!/*/}
                                                        {/*    /!*        (x.topic && x.topic.length > 0) &&*!/*/}
                                                        {/*    /!*        <div className={`flex flex-wrap gap-2`}>*!/*/}
                                                        {/*    /!*            {*!/*/}
                                                        {/*    /!*                x.topic.map((y, i) => (*!/*/}
                                                        {/*    /!*                    <div className={"text-sm font-normal"} key={i}> {y?.title}</div>*!/*/}
                                                        {/*    /!*                ))*!/*/}
                                                        {/*    /!*            }*!/*/}
                                                        {/*    /!*        </div>*!/*/}
                                                        {/*    /!*    }*!/*/}
                                                        {/*    /!*</div>*!/*/}
                                                        {/*    /!*<div className={"flex items-center md:gap-8 gap-1"}>*!/*/}
                                                        {/*    /!*    <Select*!/*/}
                                                        {/*    /!*        onValueChange={(value) => handleStatusUpdate("roadmap_id", value, i, x)}*!/*/}
                                                        {/*    /!*        value={x.roadmap_id}>*!/*/}
                                                        {/*    /!*        <SelectTrigger*!/*/}
                                                        {/*    /!*            className="md:w-[224px] w-[170px] h-8 bg-card"*!/*/}
                                                        {/*    /!*            // className="md:w-[291px] w-[170px] h-[24px] px-3 py-1 bg-card"*!/*/}
                                                        {/*    /!*        >*!/*/}
                                                        {/*    /!*            <SelectValue/>*!/*/}
                                                        {/*    /!*        </SelectTrigger>*!/*/}
                                                        {/*    /!*        <SelectContent>*!/*/}
                                                        {/*    /!*            <SelectGroup>*!/*/}
                                                        {/*    /!*                <SelectItem value={null}>*!/*/}
                                                        {/*    /!*                    <div className={"flex items-center gap-2"}>No status</div>*!/*/}
                                                        {/*    /!*                </SelectItem>*!/*/}
                                                        {/*    /!*                {*!/*/}
                                                        {/*    /!*                    (allStatusAndTypes.roadmap_status || []).map((x, i) => {*!/*/}
                                                        {/*    /!*                        return (*!/*/}
                                                        {/*    /!*                            <SelectItem key={i}*!/*/}
                                                        {/*    /!*                                        value={x.id}>*!/*/}
                                                        {/*    /!*                                <div*!/*/}
                                                        {/*    /!*                                    className={"flex items-center gap-2"}>*!/*/}
                                                        {/*    /!*                                    <Circle*!/*/}
                                                        {/*    /!*                                        fill={x.color_code}*!/*/}
                                                        {/*    /!*                                        stroke={x.color_code}*!/*/}
                                                        {/*    /!*                                        className={` w-[10px] h-[10px]`}/>*!/*/}
                                                        {/*    /!*                                    {x.title || "No status"}*!/*/}
                                                        {/*    /!*                                </div>*!/*/}
                                                        {/*    /!*                            </SelectItem>*!/*/}
                                                        {/*    /!*                        )*!/*/}
                                                        {/*    /!*                    })*!/*/}
                                                        {/*    /!*                }*!/*/}
                                                        {/*    /!*            </SelectGroup>*!/*/}
                                                        {/*    /!*        </SelectContent>*!/*/}
                                                        {/*    /!*    </Select>*!/*/}
                                                        {/*    /!*    <div*!/*/}
                                                        {/*    /!*        className={"flex items-center gap-1 sm:gap-2 cursor-pointer"}*!/*/}
                                                        {/*    /!*        onClick={() => openDetailsSheet(x)}*!/*/}
                                                        {/*    /!*    >*!/*/}
                                                        {/*    /!*        <span><MessageCircleMore size={16} className={"stroke-primary"}/></span>*!/*/}
                                                        {/*    /!*        <p className={"text-base font-normal"}>*!/*/}
                                                        {/*    /!*            {x && x.comments && x.comments.length ? x.comments.length : 0}*!/*/}
                                                        {/*    /!*        </p>*!/*/}
                                                        {/*    /!*    </div>*!/*/}
                                                        {/*    /!*</div>*!/*/}
                                                        {/*</div>*/}
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
            </div>
        </Fragment>
    );
};

export default Ideas;