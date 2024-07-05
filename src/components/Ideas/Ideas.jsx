import React, {Fragment, useEffect, useState} from 'react';
import {Button} from "../ui/button";
import {
    ArrowBigDown,
    ArrowBigUp,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Circle,
    Dot,
    MessageCircleMore,
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
import {record} from "zod";

const filterByStatus = [
    {name: "Archived", value: "archived",},
    {name: "Bugs", value: "bugs",},
    {name: "No Status", value: "nostatus",},
]

const perPageLimit = 2

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
    const [sheetType, setSheetType] = useState('');
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const [ideasList, setIdeasList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIdea, setSelectedIdea] = useState({}); // update idea
    const [isUpdateIdea, setIsUpdateIdea] = useState(false); // update idea close
    const [topicLists, setTopicLists] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [roadmapStatus, setRoadmapStatus] = useState([]);
    const [filter, setFilter] = useState(initialStateFilter);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const [isCreateIdea, setIsCreateIdea] = useState(false);

    const openSheet = () => setSheetOpen(true);
    const closeSheet = () => setSheetOpen(false);

    const openCreateIdea = () => setSheetOpenCreate(true);
    const closeCreateIdea = () => setSheetOpenCreate(false);

    useEffect(() => {
        if (filter.topic.length || filter.roadmap.length || filter.bug || filter.archive || filter.no_status || filter.all) {
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
            setIsUpdateIdea(true)
            navigate(`${baseUrl}/ideas`)
        }
    }

    const ideaSearch = async (payload) => {
        setIsLoading(true)
        const data = await apiSerVice.ideaSearch(payload)
        if (data.status === 200) {
            setIdeasList(data.data)
            setTotalRecord(data.total)
            setIsLoading(false)
            setPageNo(payload.page)
        } else {
            setIsLoading(false)
        }
    }

    const onType = (type) => {
        setSheetType(type)
        openSheet()
    }

    const openDetailsSheet = (record) => {
        setSheetType('viewDetails');
        setSelectedIdea(record)
        openSheet();
    };

    const handleChange = async (e) => {
        let obj = {...filter, [e.name]: e.value}

        let indexArchived = obj.status.findIndex((x) => x === "Archived");
        let indexBugs = obj.status.findIndex((x) => x === "Bugs");
        let indexNoStatus = obj.status.findIndex((x) => x === "NoStatus");

        setFilter({
            ...obj,
            archive: indexArchived !== -1 ? 1 : "",
            bug: indexBugs !== -1 ? 1 : "",
            no_status: indexNoStatus !== -1 ? 1 : "",
        })
        let payload1 = {
            ...filter,
            archive: indexArchived !== -1 ? 1 : "",
            bug: indexBugs !== -1 ? 1 : "",
            no_status: indexNoStatus !== -1 ? 1 : "",
            project_id: projectDetailsReducer.id,
            page: 1,
            limit: perPageLimit
        }
        let payload = {...filter, [e.name]: e.value, project_id: projectDetailsReducer.id, page: 1, limit: perPageLimit, roadmap : [e.value], topic : [e.value], status : [e.value]}
        ideaSearch(e.name === "status" ? payload1 : payload)
    }

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
            toast({variant: "destructive",description: "Login user can not use upvote or down vote"})
        }
    }

    const onUpdateIdea = (record) => {
        setIsUpdateIdea(true);
        setSelectedIdea(record)
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

    return (
        <Fragment>
            <div
                className={"xl:container xl:max-w-[1200px] lg:container lg:max-w-[992px] md:container md:max-w-[768px] sm:container sm:max-w-[639px] xs:container xs:max-w-[475px] pt-8 pb-5"}>
                <SidebarSheet
                    isOpen={isSheetOpen}
                    onOpen={openSheet}
                    onClose={closeSheet}
                    sheetType={sheetType}

                    isRoadmap={false}
                    isUpdateIdea={isUpdateIdea}
                    setIsUpdateIdea={setIsUpdateIdea}
                    setIdeasList={setIdeasList}
                    ideasList={ideasList}
                    selectedIdea={selectedIdea}
                    setSelectedIdea={setSelectedIdea}
                    onUpdateIdeaClose={onUpdateIdeaClose}
                    isNoStatus={false}
                />
                <CreateIdea
                    isOpen={isSheetOpenCreate}
                    onOpen={openCreateIdea}
                    onClose={closeCreateIdea}

                    isRoadmap={false}
                    isCreateIdea={isCreateIdea}
                    setIsCreateIdea={setIsCreateIdea}
                    setIdeasList={setIdeasList}
                    ideasList={ideasList}
                    isNoStatus={false}
                />
                <div className={"flex flex-row flex-wrap gap-6 items-center"}>
                    <span><h1 className={"text-2xl font-medium"}>Ideas</h1></span>
                    <div className="ml-auto gap-6">
                        <div className={"flex flex-row flex-wrap gap-6 items-center"}>
                            <Select
                                onValueChange={(selectedItems ) => handleChange({name: "status", value: selectedItems})}
                            >
                                <SelectTrigger className="w-[173px] bg-card">
                                    <SelectValue placeholder="Filter by status"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
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
                            <Select onValueChange={(selectedItems ) => handleChange({name: "topic", value: selectedItems})}
                            >
                                <SelectTrigger className="w-[193px] bg-card">
                                    <SelectValue placeholder={"Filter by topic"}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {/*<SelectItem value="">All</SelectItem>*/}
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
                            <Select onValueChange={(selectedItems ) => handleChange({name: "roadmap", value: selectedItems})}>
                                <SelectTrigger className="w-[262px] bg-card">
                                    <SelectValue placeholder="Filter by roadmap status"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
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
                    {
                        isLoading ? <Card><CardContent className={"p-0"}><CommSkel count={4}/></CardContent></Card> :
                            ideasList.length === 0 ? (
                                    <Card>
                                        <CardContent className={"p-0"}>
                                            <EmptyData/>
                                        </CardContent>
                                    </Card>
                                ) :
                            <Card>
                                <CardContent className={"p-0"}>
                                    {
                                        (ideasList || []).map((x, i) => {
                                            return (
                                                <Fragment key={i}>
                                                    <div className={"flex gap-8 py-6 px-16"}>
                                                        <div className={"flex gap-2"}>
                                                            <div className={"flex flex-col gap-2"}>
                                                                <Button
                                                                    className={"p-[7px] bg-white shadow border hover:bg-white w-[30px] h-[30px]"}
                                                                    variant={"outline"}
                                                                    onClick={() => giveVote(x, 1)}
                                                                >
                                                                    <ArrowBigUp
                                                                        className={"fill-primary stroke-primary"}/>
                                                                </Button>
                                                                <Button
                                                                    className={"p-[7px] bg-white shadow border hover:bg-white w-[30px] h-[30px]"}
                                                                    variant={"outline"}
                                                                    onClick={() => giveVote(x, 0)}
                                                                >
                                                                    <ArrowBigDown className={"stroke-primary"}/>
                                                                </Button>
                                                            </div>
                                                            <p className={"text-xl font-medium"}>{x.vote}</p>
                                                        </div>
                                                        <div className={"flex flex-col w-full gap-6"}>
                                                            <div className={"flex flex-col gap-[11px]"}>
                                                                <div className={"flex items-center gap-3 cursor-pointer"} onClick={() => openDetailsSheet(x)}>
                                                                    <h3 className={"text-base font-medium"}>{x.title}</h3>
                                                                    <h4 className={"text-sm font-medium"}>{x.name}</h4>
                                                                    <p className={"text-xs font-normal flex items-center text-muted-foreground"}>
                                                                        <Dot className={"fill-text-card-foreground stroke-text-card-foreground"}/>
                                                                        {moment(x.created_at).format('D MMM')}
                                                                    </p>
                                                                </div>
                                                                <div className={"description-container text-sm text-muted-foreground"}>
                                                                    <ReadMoreText html={x.description}/>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className={"flex flex-wrap justify-between items-center gap-1"}>
                                                                <div className={"flex gap-2"}>
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
                                                                    <Select>
                                                                        <SelectTrigger className="w-[291px] bg-card">
                                                                            <SelectValue/>
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectGroup>
                                                                                <SelectItem value={x.value}>
                                                                                    <div
                                                                                        className={"flex items-center gap-2"}>
                                                                                        <Circle fill={x.roadmap_color}
                                                                                                stroke={x.roadmap_color}
                                                                                                className={` w-[10px] h-[10px]`}/>
                                                                                        {x.roadmap_title ? x.roadmap_title : "No status"}
                                                                                    </div>
                                                                                </SelectItem>
                                                                            </SelectGroup>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <div
                                                                        className={"flex items-center gap-2 cursor-pointer"}
                                                                        onClick={openDetailsSheet}>
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
                                </CardContent>
                                <CardFooter className={"p-0"}>
                                    <div
                                        className={`w-full p-5 ${theme === "dark" ? "" : "bg-muted"} rounded-b-lg rounded-t-none flex justify-end pe-16 py-15px`}>
                                        <div className={"flex flex-row gap-8 items-center"}>
                                            <div>
                                                <h5 className={"text-sm font-semibold"}>Page {pageNo} of {totalPages}</h5>
                                            </div>
                                            <div className={"flex flex-row gap-2 items-center"}>
                                                <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"} onClick={() => handlePaginationClick(1)} disabled={pageNo === 1}>
                                                    <ChevronsLeft className={pageNo === 1 ? "stroke-muted-foreground" : "stroke-primary"}/>
                                                </Button>
                                                <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"} onClick={() => handlePaginationClick(pageNo - 1)} disabled={pageNo === 1}>
                                                    <ChevronLeft className={pageNo === 1 ? "stroke-muted-foreground" : "stroke-primary"}/>
                                                </Button>
                                                <Button variant={"outline"} className={" h-[30px] w-[30px] p-1.5"} onClick={() => handlePaginationClick(pageNo + 1)} disabled={pageNo === totalPages}>
                                                    <ChevronRight className={pageNo === totalPages ? "stroke-muted-foreground" : "stroke-primary"}/>
                                                </Button>
                                                <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"} onClick={() => handlePaginationClick(totalPages)} disabled={pageNo === totalPages}>
                                                    <ChevronsRight className={pageNo === totalPages ? "stroke-muted-foreground" : "stroke-primary"}/>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                    }
                </div>
            </div>
        </Fragment>
    );
};

export default Ideas;