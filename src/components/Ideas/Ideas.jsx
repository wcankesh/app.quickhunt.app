import React, {Fragment, useEffect, useState} from 'react';
import {Button} from "../ui/button";
import {
    ArrowBigUp, Check,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Circle,
    Dot, Ellipsis, Loader2,
    MessageCircleMore, Pin,
    Plus,
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
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../ui/dropdown-menu";
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

    {console.log("selectedIdea", selectedIdea)}

    {console.log("topicLists", topicLists)}


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

    const handleChange = async (e) => {
        let payload = {
            ...filter,
            project_id: projectDetailsReducer.id,
            page: 1,
            limit: perPageLimit,
        };
        if (e.name === "topic") {
            payload.topic = e.value !== null ? [e.value] : [];
        } else if (e.name === "roadmap") {
            payload.roadmap = e.value !== null ? [e.value] : [];
        }
        if (e.name === "status" && e.value === "bugs") {
            payload.bug = 1;
            payload.archive = 0;
            // payload.no_status = 0;
            payload.all = 0;
        } else if (e.name === "status" && e.value === "archived") {
            payload.archive = 1;
            payload.bug = 0;
            // payload.no_status = 0;
            payload.all = 0;
        } /*else if (e.name === "status" && e.value === "nostatus") {
            payload.archive = 0;
            payload.bug = 0;
            payload.no_status = 1;
            payload.all = 0;
        }*/ else if (e.name === "status" && e.value === null) {
            payload.archive = 1;
            payload.bug = 1;
            // payload.no_status = 1;
            payload.all = 1;
        } else if(e.name === 'topic') {
            debugger
            if(e.value){
                const clone = [...filter.topic];
                const index = clone.findIndex(item => item === e.value);
                if (index !== -1) {
                    clone.splice(index, 1);
                } else {
                    clone.push(e.value);
                }
                payload.topic = clone
            } else {
                payload.topic = []
            }


            // setSelectedIdea({...selectedIdea, topic: clone});
        }
        console.log(payload)
        console.log(e.value)
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

    const updateIdeaStatus = async (id, name, value, index) => {
        const formData = new FormData();
        formData.append(name, value == 1 ? 0 : 1);

        const data = await apiSerVice.updateIdea(formData, id);
        if (data.status === 200) {
            console.log(id,name, value, index)
            const clone = [...ideasList];
            clone[index] = data.data;
            setIdeasList(clone);
            toast({ description: "Idea status updated successfully" });
        } else {
            toast({ variant: "destructive", description: "Failed to update idea status" });
        }
    };

    const handleRoadmapUpdate = async (name, value, index, record) => {
        let formData = new FormData();
        formData.append(name, value);
        const data = await apiSerVice.updateIdea(formData, record.id);
        if (data.status === 200) {
            let clone = [...ideasList]
            clone[index].roadmap_id = value
            setIdeasList(clone);
            toast({description: "Roadmap status updated successfully"});
        } else {
            toast({variant: "destructive", description: "Failed to update roadmap status"});
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
                className={"xl:container xl:max-w-[1200px] lg:container lg:max-w-[992px] md:container md:max-w-[768px] sm:container sm:max-w-[639px] xs:container xs:max-w-[475px] pt-8 pb-5"}>
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
                <div className={"flex flex-row flex-wrap gap-6 items-center"}>
                    <span><h1 className={"text-2xl font-medium"}>Ideas</h1></span>
                    <div className="ml-auto gap-6">
                        <div className={"flex flex-row flex-wrap gap-6 items-center"}>
                            <Select defaultValue={null}
                                onValueChange={(selectedItems) => handleChange({name: "status", value: selectedItems})}>
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
                            <Select onValueChange={(selectedItems) => handleChange({name: "topic", value: selectedItems})} value={filter.topic.map(x => x)}>
                                <SelectTrigger className="w-[193px] bg-card">
                                    <SelectValue className={"text-muted-foreground text-sm"} placeholder="Assign to">
                                        <div className={"flex flex-wrap gap-[2px]"}>
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
                                                    <SelectItem className={""} key={i} value={x.id}>
                                                        <div className={"flex gap-2"}>
                                                            <div onClick={() => handleChange({name: "topic", value: x.id})} className="checkbox-icon">
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
                            })}>
                                <SelectTrigger className="w-[262px] bg-card">
                                    <SelectValue placeholder="Filter by roadmap status"/>
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
                                                    <SelectItem key={i} value={x.id}>
                                                        <div className={"flex items-center gap-2"}>
                                                            <Circle fill={x.color_code} stroke={x.color_code}
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
                    <div className="flex justify-end">
                        <Button className="gap-2 text-sm font-semibold w-[139px]"
                                onClick={openCreateIdea}><Plus/>Create Idea</Button>
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
                                                    <div className={"flex gap-8 py-6 px-16"}>
                                                        <div className={"flex gap-2"}>
                                                            <Button
                                                                className={"p-[7px] bg-white shadow border hover:bg-white w-[30px] h-[30px]"}
                                                                variant={"outline"}
                                                                onClick={() => giveVote(x, 1)}
                                                            >
                                                                <ArrowBigUp className={"fill-primary stroke-primary"}/>
                                                            </Button>
                                                            <p className={"text-xl font-medium"}>{x.vote}</p>
                                                        </div>
                                                        <div className={"flex flex-col w-full gap-6"}>
                                                            <div className={"flex flex-col gap-[11px]"}>
                                                                <div className={"flex items-center justify-between"}>
                                                                    <div
                                                                        className={"flex items-center gap-3 cursor-pointer"}
                                                                        onClick={() => openDetailsSheet(x)}>
                                                                        <h3 className={"text-base font-medium"}>{x.title}</h3>
                                                                        <h4 className={"text-sm font-medium"}>{x.name}</h4>
                                                                        <p className={"text-xs font-normal flex items-center text-muted-foreground"}>
                                                                            <Dot
                                                                                className={"fill-text-card-foreground stroke-text-card-foreground"}/>
                                                                            {moment(x.created_at).format('D MMM')}
                                                                        </p>
                                                                    </div>
                                                                    <div className={"flex gap-2 items-center"}>
                                                                        {
                                                                            x.is_active == 0 &&  <Badge
                                                                                variant={"outline"}
                                                                                className={`border border-red-500 text-red-500 bg-red-100 `}
                                                                            >
                                                                                Bug
                                                                            </Badge>
                                                                        }
                                                                        {
                                                                            x?.is_archive ==  1 && <Badge
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
                                                                                <DropdownMenuItem className={"cursor-pointer"} onClick={() => openDetailsSheet(x)}>Edit</DropdownMenuItem>
                                                                                <DropdownMenuItem className={"cursor-pointer"} onClick={() => updateIdeaStatus(x.id, "is_archive", x.is_archive, i)}>
                                                                                    {x?.is_archive === 1 ? "Unarchive" : "Archive"}
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem className={"cursor-pointer"} onClick={() => updateIdeaStatus(x.id, "is_active",  x.is_active, i)}>
                                                                                    {x.is_active === 0 ? "Convert to Idea" : "Mark as bug"}
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem className={"cursor-pointer"} onClick={() => deleteIdea(x)}>Delete</DropdownMenuItem>
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className={"description-container text-sm text-muted-foreground"}>
                                                                    <ReadMoreText html={x.description}/>
                                                                </div>
                                                            </div>
                                                            <div className={"flex justify-between items-center gap-1"}>
                                                                <div className={"flex flex-wrap gap-2"}>
                                                                    {
                                                                        (x.topic || []).map((y, i) => {
                                                                            return (
                                                                                <div className={"text-sm font-medium"}
                                                                                     key={i}> {y.title}</div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                                <div className={"flex items-center gap-8"}>
                                                                    <Select
                                                                        onValueChange={(value) => handleRoadmapUpdate("roadmap_id", value, i, x)}
                                                                        value={x.roadmap_id}>
                                                                        <SelectTrigger className="w-[291px] bg-card">
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
                                                                            <MessageCircleMore className={"stroke-primary w-[16px] h-[16px]"}/>
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
                                className={`w-full p-5 ${theme === "dark" ? "" : "bg-muted"} rounded-b-lg rounded-t-none flex justify-end pe-16 py-15px`}>
                                <div className={"flex flex-row gap-8 items-center"}>
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