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
import {useDispatch, useSelector} from "react-redux";
import {baseUrl, urlParams} from "../../utils/constent";
import moment from "moment";

const filterByStatus= [
    {name: "Archived", value: "archived",},
    {name: "Bugs", value: "bugs",},
    {name: "No Status", value: "nostatus",},
]

const filterByTopic = [
    {name: "Welcome 👋  ", value: "welcome",},
    {name: "Improvement 👍 ", value: "improvement",},
    {name: "Integrations 🔗 ", value: "integrations",},
    {name: "Mics 🤷‍♀️", value: "mics",},
    {name: "Deal Breaker 💔 ", value: "dealbreaker",},
    {name: "Bug 🐛", value: "bug",},
]

const filterByRoadMapStatus = [
    {name: "Under consideration", value: "underconsideration", fillColor: "#EB765D", strokeColor: "#EB765D",},
    {name: "Planned", value: "planned", fillColor: "#6392D9", strokeColor: "#6392D9",},
    {name: "In Development", value: "indevelopment", fillColor: "#D96363", strokeColor: "#D96363",},
    {name: "Shipped", value: "shipped", fillColor: "#63C8D9", strokeColor: "#63C8D9",},
    {name: "AC", value: "ac", fillColor: "#CEF291", strokeColor: "#CEF291",},
]

const perPageLimit = 15

const initialStateFilter = {
    archive: "",
    bug: "",
    no_status: "",
    roadmap: [],
    topic: [],
    status: [],
};

const Ideas = () => {
    const { theme } = useTheme()
    const navigate = useNavigate();
    let apiSerVice = new ApiService();
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [sheetType, setSheetType] = useState('');
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const [ideasList, setIdeasList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateIdea, setIsCreateIdea] = useState(false);
    const [selectedIdea, setSelectedIdea] = useState({});
    const [isUpdateIdea, setIsUpdateIdea] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [topicLists, setTopicLists] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [roadmapStatus, setRoadmapStatus] = useState([]);
    const [filter, setFilter] = useState(initialStateFilter);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const openSheet = () => setSheetOpen(true);
    const closeSheet = () => setSheetOpen(false);

    useEffect(() => {
        if(filter.topic.length || filter.roadmap.length || filter.bug || filter.archive || filter.no_status){
            let payload = {...filter, project_id:projectDetailsReducer.id, page:pageNo, limit: perPageLimit}
            ideaSearch(payload)

        } else {
            getAllIdea()
        }

        setTopicLists(allStatusAndTypes.topics)
        setRoadmapStatus(allStatusAndTypes.roadmap_status)
    }, [projectDetailsReducer.id, pageNo, allStatusAndTypes])

    const getAllIdea = async () => {
        setIsLoading(true)
        const data = await apiSerVice.getAllIdea({project_id: projectDetailsReducer.id,page: pageNo,limit: perPageLimit})
        if (data.status === 200) {
            setIdeasList(data.data)
            setTotalRecord(data.total)
            const id = urlParams.get('id') || "";
            if(id){
                getSingleIdea()
            }
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    }

    const getSingleIdea = async () => {
        const id = urlParams.get('id') || "";
        const data = await apiSerVice.getSingleIdea(id);
        if(data.status === 200){
            setSelectedIdea(data.data)
            setIsUpdateIdea(true)
            history.replace(`${baseUrl}/ideas`)
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

    const handleExpandDescription = () => {setShowFullDescription(!showFullDescription)}

    const onType = (type) => {
        setSheetType(type)
        openSheet()
    }

    const openDetailsSheet = () => {
        setSheetType('viewDetails');
        openSheet();
    };

    const onchangePage = (pagination) => {
        setPageNo(pagination);
    };

    return (
        <div className={"xl:container xl:max-w-[1200px] lg:container lg:max-w-[992px] md:container md:max-w-[768px] sm:container sm:max-w-[639px] xs:container xs:max-w-[475px] pt-8"}>
            <SidebarSheet isOpen={isSheetOpen} onOpen={openSheet} onClose={closeSheet} sheetType={sheetType}/>
            <div className={"flex flex-row flex-wrap gap-6 items-center"}>
                <span><h1 className={"text-2xl font-medium"}>Ideas</h1></span>
                <div className="ml-auto gap-6">
                    <div className={"flex flex-row flex-wrap gap-6 items-center"}>
                        <Select>
                            <SelectTrigger className="w-[173px] bg-card">
                                <SelectValue placeholder="Filter by status" />
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
                        <Select>
                            <SelectTrigger className="w-[193px] bg-card">
                                <SelectValue placeholder="Filter by topic" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        (filterByTopic || []).map((x, i) => {
                                            return (
                                                <SelectItem key={i} value={x.value}>{x.name}</SelectItem>
                                            )
                                        })
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-[262px] bg-card">
                                <SelectValue placeholder="Filter by roadmap status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        (filterByRoadMapStatus || []).map((x, i) => {
                                            return (
                                                <SelectItem key={i} value={x.value}>{x.name}</SelectItem>
                                            )
                                        })
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button className="gap-2 text-sm font-semibold w-[139px]" onClick={() => onType('createNewIdeas')}><Plus />Create Idea</Button>
                </div>
            </div>
            <div className={"mt-8"}>
                <Card>
                    <CardContent className={"p-0"}>
                            {
                                (ideasList || []).map((x, i) => {
                                    return (
                                        <Fragment key={i}>
                                            <div className={"flex gap-8 py-6 px-16"}>
                                                    <div className={"flex gap-2"}>
                                                        <div>
                                                        <Button className={"p-[7px] bg-white shadow border hover:bg-white w-[30px] h-[30px]"} variant={"outline"}>
                                                            <ArrowBigUp className={"fill-primary stroke-primary"} />
                                                        </Button>
                                                        <Button className={"p-[7px] bg-white shadow border hover:bg-white w-[30px] h-[30px]"} variant={"outline"}>
                                                            <ArrowBigDown className={"stroke-primary"} />
                                                        </Button>
                                                        </div>
                                                        <p className={"text-xl font-medium"}>{x.vote}</p>
                                                    </div>
                                                    <div className={"flex flex-col"}>
                                                        <div className={"flex items-center gap-3"}>
                                                            <h3 className={"text-base font-medium cursor-pointer"} onClick={openDetailsSheet}>{x.title}</h3>
                                                            <h4 className={"text-sm font-medium"}>{x.name}</h4>
                                                            <p className={"text-sm font-normal flex items-center text-muted-foreground"}><Dot className={"fill-text-card-foreground stroke-text-card-foreground"} />
                                                                {moment(x.created_at).format('D MMM')}
                                                            </p>
                                                        </div>
                                                        {/*<div>*/}
                                                        {/*<p className={"text-sm font-normal text-muted-foreground pt-[11px] pb-[24px]"} dangerouslySetInnerHTML={{__html: x.description}}/>*/}
                                                        {/*<Button onClick={openSheet} variant={"ghost hover:none"} className={"h-0 p-0 text-primary text-sm font-semibold"}>Read more</Button>*/}
                                                        {/*</div>*/}
                                                        <div className={"description-container"}>
                                                            <p className={"text-sm font-normal text-muted-foreground truncate-overflow"} dangerouslySetInnerHTML={{__html: x.description}}/>
                                                            {x.description.length > 10 && (
                                                                <Button onClick={() => handleExpandDescription(i)} variant={"ghost hover:none"} className={"h-0 p-0 text-primary text-sm font-semibold"}>
                                                                    {showFullDescription ? "Read less" : "Read more"}
                                                                </Button>
                                                            )}
                                                        </div>
                                                        <div className={"flex flex-wrap justify-between items-center gap-1"}>
                                                            <div className={"flex gap-2"}>
                                                            {
                                                                (x.topic || []).map((y, i) => {
                                                                    return (
                                                                        <div className={"text-sm font-medium"} key={i}> {y.title}</div>
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
                                                                            {/*{*/}
                                                                            {/*    (x.roadmapStatus || []).map((z, i) => {*/}
                                                                            {/*        return (*/}
                                                                            {/*            <Fragment key={i}>*/}
                                                                                            <SelectItem value={x.value}>
                                                                                                <div className={"flex items-center gap-2"}>
                                                                                                <Circle fill={x.roadmap_color} stroke={x.roadmap_color} className={` w-[10px] h-[10px]`}/>
                                                                                                {x.roadmap_title ? x.roadmap_title : "No status"}
                                                                                                </div>
                                                                                            </SelectItem>
                                                                            {/*            </Fragment>*/}
                                                                            {/*        )*/}
                                                                            {/*    })*/}
                                                                            {/*}*/}
                                                                            {/*<SelectItem value={x.value}>*/}
                                                                            {/*    <div className={"flex items-center gap-2"}>*/}
                                                                            {/*        <Circle fill={x.fillColor} stroke={x.strokeColor} className={` w-[10px] h-[10px]`}/>*/}
                                                                            {/*        {x.roadmap_title}*/}
                                                                            {/*    </div>*/}
                                                                            {/*</SelectItem>*/}
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                                <div className={"flex items-center gap-2"}>
                                                                    <span>
                                                                        <MessageCircleMore className={"stroke-primary w-[16px] h-[16px]"} />
                                                                    </span>
                                                                    <p className={"text-base font-medium"}>{x.up}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                            </div>
                                            <div className={"border-b"} />
                                        </Fragment>
                                    )
                                })
                            }
                    </CardContent>
                    <CardFooter className={"p-0"}>
                        <div className={`w-full p-5 ${theme === "dark"? "" : "bg-muted"} rounded-b-lg rounded-t-none flex justify-end pe-16 py-15px`}>
                            <div className={"flex flex-row gap-8 items-center"}>
                                <div>
                                    <h5 className={"text-sm font-semibold"}>Page {ideasList.page} of 10</h5>
                                </div>
                                <div className={"flex flex-row gap-2 items-center"}>
                                    <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}>
                                        <ChevronsLeft  className={ideasList.preview === 0 ? "stroke-slate-300" : "stroke-primary"} />
                                    </Button>
                                    <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5 "}>
                                        <ChevronLeft  className={ideasList.preview === 0 ? "stroke-slate-300" : "stroke-primary"} />
                                    </Button>
                                    <Button variant={"outline"} className={" h-[30px] w-[30px] p-1.5"}>
                                        <ChevronRight  className={"text-primary"} />
                                    </Button>
                                    <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5 "}>
                                        <ChevronsRight className={"text-primary"} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default Ideas;