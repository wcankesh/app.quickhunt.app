import React, {Fragment, useEffect, useState} from 'react';
import {Button} from "../ui/button";
import {
    Archive,
    ArrowBigUp, Ban, Bug,
    Check,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Circle, Cloud, CreditCard,
    Dot,
    Ellipsis, Github, Keyboard, LifeBuoy, ListFilter,
    Loader2, LogOut, Mail,
    MessageCircleMore, MessageSquare,
    Pin,
    Plus, PlusCircle, Settings,
    User, UserPlus, Users,
} from "lucide-react";
import {Card, CardContent, CardFooter} from "../ui/card";
import {Select, SelectItem, SelectGroup, SelectContent, SelectTrigger, SelectValue} from "../ui/select";
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
import {DropdownMenu, DropdownMenuGroup, DropdownMenuSub, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSubContent, DropdownMenuSubTrigger,
} from "../ui/dropdown-menu";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../ui/dialog";
import {Badge} from "../ui/badge";


const filterByStatus = [
    {name: "Archived", value: "archived",},
    {name: "Bugs", value: "bugs",},
    // {name: "No Status", value: "nostatus",},
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

    // const handleChange = async (e) => {
    //     let payload = {
    //         ...filter,
    //         project_id: projectDetailsReducer.id,
    //         page: 1,
    //         limit: perPageLimit,
    //     };
    //     if (e.name === "topic") {
    //         payload.topic = e.value !== null ? [e.value] : [];
    //     } else if (e.name === "roadmap") {
    //         payload.roadmap = e.value !== null ? [e.value] : [];
    //     }
    //     if (e.name === "status" && e.value === "bugs") {
    //         payload.bug = 1;
    //         payload.archive = 0;
    //         // payload.no_status = 0;
    //         payload.all = 0;
    //     } else if (e.name === "status" && e.value === "archived") {
    //         payload.archive = 1;
    //         payload.bug = 0;
    //         // payload.no_status = 0;
    //         payload.all = 0;
    //     } /*else if (e.name === "status" && e.value === "nostatus") {
    //         payload.archive = 0;
    //         payload.bug = 0;
    //         payload.no_status = 1;
    //         payload.all = 0;
    //     }*/ else if (e.name === "status" && e.value === null) {
    //         payload.archive = 1;
    //         payload.bug = 1;
    //         // payload.no_status = 1;
    //         payload.all = 1;
    //     } else if(e.name === 'topic') {
    //         if(e.value){
    //             const clone = [...filter.topic];
    //             const index = clone.findIndex(item => item === e.value);
    //             if (index !== -1) {
    //                 clone.splice(index, 1);
    //             } else {
    //                 clone.push(e.value);
    //             }
    //             payload.topic = clone
    //         } else {
    //             payload.topic = []
    //         }
    //     } else if(e.name === 'roadmap') {
    //         if(e.value){
    //             const clone = [...filter.roadmap];
    //             const index = clone.findIndex(item => item === e.value);
    //             if (index !== -1) {
    //                 clone.splice(index, 1);
    //             } else {
    //                 clone.push(e.value);
    //             }
    //             payload.roadmap = clone
    //         } else {
    //             payload.roadmap = []
    //         }
    //     }
    //     setFilter(payload);
    //     ideaSearch(payload);
    // };

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
            if (e.value === "bugs") {
                payload.bug = 1;
                payload.archive = 0;
                payload.all = 0;
            } else if (e.value === "archived") {
                payload.archive = 1;
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
                } else {

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
            setIsLoading(true)
            const data = await apiSerVice.onDeleteIdea(id);
            if (data.status === 200) {
                const filteredIdeas = ideasList.filter((idea) => idea.id !== id);
                setIdeasList(filteredIdeas);
                setOpenDelete(false)
                setIsLoading(false)
                setDeleteRecord(null)
                toast({description: "Idea deleted successfully"});
            } else {
                toast({variant: "destructive", description: "Failed to delete idea"});
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
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader className={"flex flex-col gap-2"}>
                                <DialogTitle>You really want delete this idea?</DialogTitle>
                                <DialogDescription>This action can't be undone.</DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant={"outline hover:none"}
                                        className={"text-sm font-semibold border"}
                                        onClick={() => setOpenDelete(false)}>Cancel</Button>
                                <Button
                                    variant={"hover:bg-destructive"}
                                    className={`${theme === "dark" ? "text-card-foreground" : "text-card"} ${isLoading === true ? "py-2 px-6" : "py-2 px-6"} w-[76px] text-sm font-semibold bg-destructive`}
                                    onClick={() => onDeleteIdea(deleteRecord)}
                                >
                                    {isLoading ? <Loader2 size={16} className={"animate-spin"}/> : "Delete"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Fragment>
            }
            <div
                className={"xl:container xl:max-w-[1200px] lg:container lg:max-w-[992px] md:container md:max-w-[768px] sm:container sm:max-w-[639px] pt-8 pb-5 px-4"}>
                <SidebarSheet
                    isOpen={isSheetOpen}
                    onOpen={openSheet}
                    onClose={closeSheet}

                    isRoadmap={false}
                    isUpdateIdea={isUpdateIdea}
                    setIsUpdateIdea={setIsUpdateIdea}
                    setIdeasList={setIdeasList}
                    ideasList={ideasList}
                    selectedIdea={selectedIdea}
                    setSelectedIdea={setSelectedIdea}
                    oldSelectedIdea={oldSelectedIdea}
                    setOldSelectedIdea={setOldSelectedIdea}
                    onUpdateIdeaClose={onUpdateIdeaClose}
                    isNoStatus={false}
                />
                <CreateIdea
                    isOpen={isSheetOpenCreate}
                    onOpen={openCreateIdea}
                    onClose={closeCreateIdea}

                    isRoadmap={false}
                    closeCreateIdea={closeCreateIdea}
                    setIdeasList={setIdeasList}
                    ideasList={ideasList}
                    isNoStatus={false}
                />
                <div className={"flex flex-nowrap items-center gap-6 lg:flex-nowrap md:flex-wrap"}>
                    <span><h1 className={"text-2xl font-medium"}>Ideas</h1></span>
                    <div className={"w-full md:block hidden"}>
                        <div className={"flex flex-wrap gap-6"}>
                            <div className={"xl:ml-auto gap-6"}>
                                <div className={"flex flex-row flex-wrap gap-6 items-center"}>
                                    <Select defaultValue={null}
                                            onValueChange={(selectedItems) => handleChange({
                                                name: "status",
                                                value: selectedItems
                                            })}>
                                        <SelectTrigger className="w-[173px] bg-card">
                                            <SelectValue placeholder="Filter by status"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value={null}>
                                                    <div className={"flex items-center gap-2"}>
                                                        All Status
                                                    </div>
                                                </SelectItem>
                                                {
                                                    (filterByStatus || []).map((x, i) => {
                                                        return (
                                                            <SelectItem key={i} value={x.value}>{x.name}</SelectItem>
                                                        )
                                                    })
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <Select onValueChange={(selectedItems) => handleChange({
                                        name: "topic",
                                        value: selectedItems
                                    })} value={filter.topic.map(x => x)}>
                                        <SelectTrigger className="w-[193px] bg-card">
                                            <SelectValue className={"text-muted-foreground text-sm"}
                                                         placeholder={filter.topic.length === 0 ? "All Topics" : ""}>
                                                <div className={"flex gap-[2px]"}>
                                                    {(filter.topic || []).map((x, index) => {
                                                        const findObj = (topicLists || []).find((y) => y.id === x);
                                                        return (
                                                            <div key={index}
                                                                 className={"text-xs flex gap-[2px] bg-slate-300 items-center rounded py-0 px-2"}>
                                                                {findObj?.title}
                                                            </div>
                                                        );
                                                    })}
                                                    {(filter.topic || []).length > 2 && <div>...</div>}
                                                </div>
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value={null}>
                                                    <div className={"flex items-center gap-2"}>
                                                        All Topics
                                                    </div>
                                                </SelectItem>
                                                {
                                                    (topicLists || []).map((x, i) => {
                                                        return (
                                                            <SelectItem className={"p-2"} key={i} value={x.id}>
                                                                <div className={"flex gap-2"}>
                                                                    <div onClick={() => handleChange({
                                                                        name: "topic",
                                                                        value: x.id
                                                                    })} className="checkbox-icon">
                                                                        {(filter.topic.map((x) => x) || []).includes(x.id) ?
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
                                    <Select onValueChange={(selectedItems) => handleChange({
                                        name: "roadmap",
                                        value: selectedItems
                                    })} value={filter.roadmap.map(x => x)}>
                                        <SelectTrigger className="w-[262px] bg-card">
                                            <SelectValue className={"text-muted-foreground text-sm"}
                                                         placeholder={filter.roadmap.length === 0 ? "All Roadmap" : "Filter by roadmap status"}>
                                                <div className={"flex gap-[2px]"}>
                                                    {(filter.roadmap || []).map((x, index) => {
                                                        const findObj = (roadmapStatus || []).find((y) => y.id === x);
                                                        return (
                                                            <div key={index}
                                                                 className={"text-xs flex gap-[5px] bg-slate-300 items-center rounded py-0 px-2"}>
                                                                <Circle fill={findObj.color_code}
                                                                        stroke={findObj.color_code}
                                                                        className={` w-[10px] h-[10px]`}/>
                                                                {findObj?.title}
                                                            </div>
                                                        );
                                                    })}
                                                    {(filter.roadmap || []).length > 2 && <div>...</div>}
                                                </div>
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value={null}>
                                                    <div className={"flex items-center gap-2"}>
                                                        All Roadmap
                                                    </div>
                                                </SelectItem>
                                                {
                                                    (roadmapStatus || []).map((x, i) => {
                                                        return (
                                                            <SelectItem className={"p-2"} key={i} value={x.id}>
                                                                <div className={"flex gap-2"}>
                                                                    <div onClick={() => handleChange({
                                                                        name: "roadmap",
                                                                        value: x.id
                                                                    })} className="checkbox-icon">
                                                                        {(filter.roadmap.map((x) => x) || []).includes(x.id) ?
                                                                            <Check size={18}/> : <div
                                                                                className={"h-[18px] w-[18px]"}></div>}
                                                                    </div>
                                                                    <div className={"flex items-center gap-2"}>
                                                                        <Circle fill={x.color_code}
                                                                                stroke={x.color_code}
                                                                                className={` w-[10px] h-[10px]`}/>
                                                                        <span>{x.title ? x.title : ""}</span>
                                                                    </div>
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
                            <div className="flex justify-end">
                                <Button className="gap-2 text-sm font-semibold w-[139px]"
                                        onClick={openCreateIdea}><Plus/>Create Idea</Button>
                            </div>
                        </div>
                    </div>
                    <div className={"w-full flex justify-end md:hidden gap-2"}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className={"gap-2"}><ListFilter size={15}/>Filter</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuGroup>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            {/*<UserPlus className="mr-2 h-4 w-4" />*/}
                                            <span>Status</span>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem className={"flex flex-col items-start"}>
                                                    {/*<Circle size={15} className="mr-2" />*/}
                                                    <div className={"p-2"}
                                                         onClick={() => handleChange({name: "status", value: null})}>All
                                                        Status
                                                    </div>
                                                    <div>
                                                        {
                                                            (filterByStatus || []).map((x, i) => {
                                                                return (
                                                                    <div className={"p-2"} onClick={() => handleChange({
                                                                        name: "status",
                                                                        value: x.value
                                                                    })}>
                                                                        <span key={i}>{x.name}</span>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            {/*<UserPlus className="mr-2 h-4 w-4" />*/}
                                            <span>Topics</span>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem className={"flex flex-col items-start p-0"}>
                                                    {
                                                        (topicLists || []).map((x, i) => {
                                                            return (
                                                                <div className={"p-2 w-full"} key={i}
                                                                     onClick={(e) => handleChange({
                                                                         name: "topic",
                                                                         value: x.id
                                                                     })}>
                                                                    <div className={"flex gap-2"}>
                                                                        <div className="checkbox-icon">
                                                                            {(filter.topic.map((x) => x) || []).includes(x.id) ?
                                                                                <Check size={18}/> :
                                                                                <div className={"h-[15px] w-[15px]"}/>}
                                                                        </div>
                                                                        <span>{x.title ? x.title : ""}</span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            {/*<UserPlus className="mr-2 h-4 w-4" />*/}
                                            <span>Roadmap</span>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem className={"flex flex-col items-start p-0"}>
                                                    {
                                                        (roadmapStatus || []).map((x, i) => {
                                                            return (
                                                                <div className={"p-2 w-full"} key={i}
                                                                     onClick={(e) => handleChange({
                                                                         name: "roadmap",
                                                                         value: x.id
                                                                     })}>
                                                                    <div className={"flex items-center gap-2"}>
                                                                        <div className="checkbox-icon">
                                                                            {(filter.roadmap.map((x) => x) || []).includes(x.id) ?
                                                                                <Check size={18}/> :
                                                                                <div className={"h-[18px] w-[18px]"}/>}
                                                                        </div>
                                                                        <div className={"flex items-center gap-2"}>
                                                                            <Circle fill={x.color_code}
                                                                                    stroke={x.color_code}
                                                                                    className={` w-[10px] h-[10px]`}/>
                                                                            <span>{x.title ? x.title : ""}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem>
                                        <Plus size={15} className="mr-2"/>
                                        <span onClick={openCreateIdea}>Create Idea</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className={"mt-8"}>
                    <Card>
                        {
                            (isLoading || isLoadingSearch) ? CommSkel.commonParagraphFourIdea : ideasList.length > 0 ?
                                <CardContent className={"p-0"}>
                                    {
                                        (ideasList || []).map((x, i) => {
                                            return (
                                                <Fragment key={i}>
                                                    <div className={"flex gap-[5px] md:gap-8 md:py-6 md:px-16 p-3"}>
                                                        <div className={"flex gap-1 md:gap-2"}>
                                                            <Button
                                                                className={"p-0 bg-white shadow border hover:bg-white w-[20px] h-[20px] md:w-[30px] md:h-[30px]"}
                                                                variant={"outline"}
                                                                onClick={() => giveVote(x, 1)}
                                                            >
                                                                <ArrowBigUp size={15}
                                                                            className={"fill-primary stroke-primary"}/>
                                                            </Button>
                                                            <p className={"text-base md:text-xl font-medium"}>{x.vote}</p>
                                                        </div>
                                                        <div className={"flex flex-col w-full gap-6"}>
                                                            <div className={"flex flex-col gap-[11px]"}>
                                                                <div
                                                                    className={"flex flex-wrap items-center justify-between gap-3 md:flex-nowrap"}>
                                                                    <div
                                                                        className={"flex flex-wrap items-center gap-1 cursor-pointer xl:gap-3"}
                                                                        onClick={() => openDetailsSheet(x)}>
                                                                        <h3 className={"text-base font-medium"}>{x.title}</h3>
                                                                        <div className={"flex gap-2"}>
                                                                            <h4 className={"text-sm font-medium"}>{x.name}</h4>
                                                                            <p className={"text-xs font-normal flex items-center text-muted-foreground"}>
                                                                                <Dot
                                                                                    className={"fill-text-card-foreground stroke-text-card-foreground"}/>
                                                                                {moment(x.created_at).format('D MMM')}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className={"flex gap-2 items-center"}>
                                                                        {
                                                                            x.is_active == 0 && <Badge
                                                                                variant={"outline"}
                                                                                className={`border border-red-500 text-red-500 bg-red-100 `}
                                                                            >
                                                                                Bug
                                                                            </Badge>
                                                                        }
                                                                        {
                                                                            x.is_archive == 1 && <Badge
                                                                                variant={"outline"}
                                                                                className={`border border-green-500 text-green-500 bg-green-100
                                                                           `}
                                                                            >

                                                                                Archive
                                                                            </Badge>
                                                                        }
                                                                        {x.pin_to_top === 1 &&
                                                                        <Pin size={16} fill={"bg-card-foreground"}/>}
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger>
                                                                                <Ellipsis size={16}/>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent>
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
                                                                <div
                                                                    className={"description-container text-sm text-muted-foreground"}>
                                                                    <ReadMoreText html={x.description}/>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className={`flex justify-between items-center flex-wrap gap-2`}>
                                                                <div className={`flex flex-wrap gap-2`}>
                                                                    {
                                                                        (x.topic && x.topic.length > 0) &&
                                                                        <div className={`flex flex-wrap gap-2`}>
                                                                            {
                                                                                x.topic.map((y, i) => (
                                                                                    <div
                                                                                        className={"text-sm font-medium"}
                                                                                        key={i}> {y?.title}</div>
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
                                                                        className={"flex items-center gap-2 cursor-pointer"}
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
                                className={`w-full ${theme === "dark" ? "" : "bg-muted"} rounded-b-lg rounded-t-none flex justify-end px-4 py-4 md:px-16 md:py-15px`}>
                                <div className={"w-full flex gap-8 items-center justify-between sm:justify-end"}>
                                    {/*<div className={"w-full flex justify-between gap-2 items-center"}>*/}
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