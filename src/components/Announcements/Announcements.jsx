import React, {useState, useEffect, useRef,} from 'react';
import {Button} from "../ui/button";
import {Input} from "../ui/input";
import AnnouncementsTable from "./AnnouncementsTable";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Circle, Filter, Plus, X} from "lucide-react";
import CreateAnnouncement from "./CreateAnnouncement";
import {useTheme} from "../theme-provider";
import {useSelector} from "react-redux";
import {ApiService} from "../../utils/ApiService";
import {Card, CardFooter} from "../ui/card";
import AnalyticsView from "./AnalyticsView";
import {toast} from "../ui/use-toast";
import {Popover, PopoverTrigger} from "@radix-ui/react-popover";
import {PopoverContent} from "../ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../ui/command";
import {Checkbox} from "../ui/checkbox";
import {Badge} from "../ui/badge";
import {useLocation, useNavigate} from "react-router-dom";
import {baseUrl} from "../../utils/constent";
import AnnouncementAnalyticsViews from "./AnnouncementAnalyticsViews";
import Pagination from "../Comman/Pagination";


const initialStateFilter = {
    l: "",
    s: "",
    q:""
}

const perPageLimit = 10;

const status = [
    {
        label: "Published",
        value: 1
    },
    {
        label: "Scheduled",
        value: 2
    },
    {
        label: "Draft",
        value: 4
    },
];

const Announcements = () => {
    const location = useLocation();
    let navigate = useNavigate();
    const {theme} = useTheme();
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo") || 1;
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const [announcementList, setAnnouncementList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [filter, setFilter] = useState(initialStateFilter);
    const [pageNo, setPageNo] = useState(Number(getPageNo));
    const [totalRecord, setTotalRecord] = useState(0);
    const [selectedRecord, setSelectedRecord] = useState({})
    const [analyticsObj, setAnalyticsObj] = useState({})
    const apiService = new ApiService();
    const [openFilterType, setOpenFilterType] = useState('');
    const timeoutHandler = useRef(null);
    const [openFilter, setOpenFilter] = useState('');
    const [isFilter, setIsFilter] = useState(false);

    useEffect(() => {
            if(filter.l || filter.s || filter.q || isFilter){
                searchAnnouncement({...filter, page: pageNo, project_id: projectDetailsReducer.id,})
            } else {
                if(!isFilter && projectDetailsReducer.id){
                    getAllPosts()
                }
            }
            navigate(`${baseUrl}/announcements?pageNo=${pageNo}`);
    }, [projectDetailsReducer.id, allStatusAndTypes, pageNo]);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const postId = urlParams.get("postId");
        if(postId){
            setAnalyticsObj({id: postId})
        }
    }, []);

    const getAllPosts = async () => {
        setIsLoading(true);
        const data = await apiService.getAllPosts({
            project_id: projectDetailsReducer.id,
            page: pageNo,
            limit: perPageLimit
        })
        if (data.status === 200) {
            setAnnouncementList(data.data)
            setTotalRecord(data.total)
            setIsFilter(true)
        }
        setIsLoading(false)
    }

    const searchAnnouncement = async (payload) => {
        setIsLoading(true);
        const data = await apiService.filterPost(payload)
        if (data.status === 200) {
            setIsLoading(false);
            setAnnouncementList(data.data);
            setPageNo(payload.page);
            setTotalRecord(data.total);
        } else {
            setIsLoading(false);
        }
    }

    const openSheet = () => {
        setSelectedRecord({id: "new"})
        navigate(`${baseUrl}/announcements`);
    };

    const onCloseAnalyticsSheet = () => {
        setAnalyticsObj({})
    }

    const closeSheet = (record,addRecord) => {
        if (record) {
            const updatedItems = announcementList.map((x) => x.id === record.id ? {...x, ...record} : x);
            setAnnouncementList(updatedItems);
            setSelectedRecord({});
        } else if (addRecord) {
            const clone = [...announcementList];
            clone.unshift(addRecord);
            setAnnouncementList(clone);
            setSelectedRecord({});
        }
        else {
            setSelectedRecord({});
        }
        navigate(`${baseUrl}/announcements?pageNo=${pageNo}`);
    };

    const handleDelete = async (id) => {
        setIsLoadingDelete(true)
        const data = await apiService.deletePosts(id, pageNo)
        if (data.status === 200) {
            setIsLoadingDelete(false)
            const clone = [...announcementList];
            const index = clone.findIndex((x) => x.id === id)
            if (index !== -1) {
                clone.splice(index, 1)
                setAnnouncementList(clone);
            }
            setTotalRecord(Number(totalRecord) - 1)
            toast({
                description: data.message,
            })
        } else {
            setIsLoadingDelete(false)
            toast({
                description: data.message,
                variant: "destructive"
            })
        }
    }

    const onChange = async (event) => {
        const payload = {
            ...filter,
            project_id: projectDetailsReducer.id,
            page:1,
            [event.target.name]: event.target.value,
        }
        setFilter({...filter, [event.target.name]: event.target.value,});
        setIsLoading(true);

        if (timeoutHandler.current) {
            clearTimeout(timeoutHandler.current);
        }
        timeoutHandler.current = setTimeout(() => {
             searchAnnouncement(payload);
        }, 2000);
    }

    const filterPosts = async  (event) => {
        setIsLoading(true)
        setFilter({...filter, [event.name]: event.value,});
        const payload = {
            ...filter,
            project_id: projectDetailsReducer.id,
            page:1,
            [event.name]: event.value,
        }
        await searchAnnouncement(payload);
    }

    const totalPages = Math.ceil(totalRecord / perPageLimit);

    const handlePaginationClick = async (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setIsLoading(true);
            setPageNo(newPage);
            setIsLoading(false);
            setIsFilter(false)
        }
    };

    const handleBadge = (obj) =>{
        const payload = {
            ...filter,
            project_id: projectDetailsReducer.id,
            page:1,
            [obj.value]:""
        }
        setFilter({...filter, [obj.value]:"",});
        searchAnnouncement(payload);
    }

    const matchedObject = allStatusAndTypes.labels ? allStatusAndTypes.labels.find(x => x.id === filter.l) : null;

    return (
        <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>
            {selectedRecord.id &&
            <CreateAnnouncement
                isOpen={selectedRecord.id}
                onOpen={openSheet}
                onClose={closeSheet}
                getAllPosts={getAllPosts}
                selectedRecord={selectedRecord}
                setSelectedRecord={setSelectedRecord}
                announcementList={announcementList}
                setAnnouncementList={setAnnouncementList}
            />}
            {analyticsObj?.id &&
            <AnalyticsView
                onClose={onCloseAnalyticsSheet}
                analyticsObj={analyticsObj}
                setAnalyticsObj={setAnalyticsObj}
            />}

            {/*{analyticsObj?.id &&*/}
            {/*<AnnouncementAnalyticsViews*/}
            {/*    onClose={onCloseAnalyticsSheet}*/}
            {/*    analyticsObj={analyticsObj}*/}
            {/*    setAnalyticsObj={setAnalyticsObj}*/}
            {/*/>}*/}

            <div className={"flex items-center justify-between flex-wrap gap-2"}>
                <div className={"flex justify-between items-center w-full md:w-auto"}>
                    <h1 className="text-2xl font-normal flex-initial w-auto">Announcement ({totalRecord})</h1>
                </div>
                <div className={"w-full lg:w-auto flex sm:flex-nowrap flex-wrap gap-2 items-center"}>
                    <div className={"flex gap-2 items-center w-full md:w-auto"}>
                        <div className={"w-full"}>
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="w-full pl-4 pr-14 text-sm font-normal h-9"
                                name={"q"}
                                onChange={onChange}
                            />
                        </div>
                        <div className={"flex items-center"}>
                            <Popover open={openFilter}
                                     onOpenChange={() => {
                                         setOpenFilter(!openFilter);
                                         setOpenFilterType('');
                                     }}>
                                <PopoverTrigger asChild>
                                    <Button className={"h-9 w-9"} size={"icon"} variant="outline"><Filter fill="true" className='w-4 -h4' /></Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0" align={"end"}>
                                    <Command className="w-full">
                                        <CommandInput placeholder="Search filter..."/>
                                        <CommandList className="w-full">
                                            <CommandEmpty>No filter found.</CommandEmpty>
                                            {
                                                openFilterType === 'status' ?
                                                    <CommandGroup className={"w-full"}>
                                                        <CommandItem className={"p-0 flex gap-2 items-center cursor-pointer p-1"} onSelect={() => {setOpenFilterType('');}}>
                                                            <ChevronLeft className="mr-2 h-4 w-4"  />  <span className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"}>Back</span>
                                                        </CommandItem>
                                                        {
                                                            (status || []).map((x, index) => {
                                                                return (
                                                                    <CommandItem className={"p-0 flex gap-1 items-center cursor-pointer"}>
                                                                        <Checkbox className={'m-2'} checked={x.value === filter.s} onClick={(event) => filterPosts({name: "s", value: x.value == filter.s ? "" :x.value })} />
                                                                        <span className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"} onClick={(event) => filterPosts({name: "s", value: x.value == filter.s ? "" :x.value })} key={x.label}>{x.label}</span>
                                                                    </CommandItem>
                                                                )
                                                            })
                                                        }
                                                    </CommandGroup>
                                                    : openFilterType === 'label' ?
                                                    <CommandGroup className={"w-full"}>
                                                        <CommandItem className={"p-0 flex gap-2 items-center cursor-pointer p-1"} onSelect={() => {setOpenFilterType('');}}>
                                                            <ChevronLeft className="mr-2 h-4 w-4"  />  <span className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"}>Back</span>
                                                        </CommandItem>
                                                        {
                                                            (allStatusAndTypes.labels || []).map((x, i) => {
                                                                return (
                                                                    <CommandItem key={x.id}>
                                                                        <div className={"w-full flex items-center gap-1"}  key={x.label}>
                                                                            <Checkbox className={'m-2'} checked={x.id == filter.l} onClick={(event) => filterPosts({name: "l", value: x.id == filter.l ? "" : x.id })} />
                                                                            <div className={"flex items-center gap-2 w-full"} onClick={(event) => filterPosts({name: "l", value: x.id == filter.l ? "" : x.id })}>
                                                                                <Circle fill={x.label_color_code}
                                                                                        stroke={x.label_color_code}
                                                                                        className={`${theme === "dark" ? "" : "text-muted-foreground"} w-[10px] h-[10px]`}/>
                                                                                <span className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"}>{x.label_name}</span>
                                                                            </div>
                                                                        </div>
                                                                    </CommandItem>
                                                                )
                                                            })
                                                        }
                                                    </CommandGroup>
                                                    :<CommandGroup>
                                                        <CommandItem onSelect={() => {setOpenFilterType('status');}}>
                                                            <span className={"text-sm font-normal cursor-pointer"}>Status</span>
                                                        </CommandItem>
                                                        <CommandItem onSelect={() => {setOpenFilterType('label');}}>
                                                            <span className={"text-sm font-normal cursor-pointer"}>Labels</span>
                                                        </CommandItem>
                                                    </CommandGroup>
                                            }
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    {/*<div className={"flex flex-grow gap-2 items-center"}>*/}
                        <Button
                            onClick={openSheet}
                            className={"gap-2 font-medium hover:bg-primary"}
                        >
                            <Plus size={20} strokeWidth={3} />
                            <span className={"text-xs md:text-sm font-medium"}>New Announcement</span>
                        </Button>
                    {/*</div>*/}
                </div>
            </div>

            {(filter.s  || filter.l) && <div className={"flex flex-wrap gap-2 mt-6"}>
                {
                    filter.s &&
                    <Badge variant="outline" className="rounded p-0 font-medium">
                        <span
                            className="px-3 py-1.5 border-r">{filter.s == 1 ? "Published" : filter.s === 2 ? "Scheduled" : filter.s == 4 ? "Draft" : ""}</span>
                        <span className="w-7 h-7 flex items-center justify-center cursor-pointer"
                              onClick={() => handleBadge({name: "status", value: "s"})}>
                                            <X className='w-4 h-4'/>
                        </span>
                    </Badge>
                }
                {
                    filter.l && <Badge variant="outline" className="rounded p-0 font-medium">
                        <span className="px-3 py-1.5 border-r flex gap-2 items-center">
                            <span className={"w-2.5 h-2.5 rounded-full"} style={{backgroundColor: matchedObject.label_color_code}}/>{matchedObject?.label_name}
                        </span>
                        <span className="w-7 h-7 flex items-center justify-center cursor-pointer" onClick={() => handleBadge({name: "label", value: "l"})}><X className='w-4 h-4'/></span>
                    </Badge>
                }
            </div>}

            <Card className={"mt-6"}>
                <AnnouncementsTable
                    pageNo={pageNo}
                    setAnalyticsObj={setAnalyticsObj}
                    handleDelete={handleDelete}
                    data={announcementList}
                    setSelectedRecord={setSelectedRecord}
                    isLoading={isLoading}
                    isLoadingDelete={isLoadingDelete}
                />
                {
                    announcementList.length > 0 ?
                        <Pagination
                            pageNo={pageNo}
                            totalPages={totalPages}
                            isLoading={isLoading}
                            handlePaginationClick={handlePaginationClick}
                            theme={"light"} // or "dark"
                            stateLength={announcementList.length}
                        /> : ""
                }
            </Card>

        </div>
    );
}

export default Announcements