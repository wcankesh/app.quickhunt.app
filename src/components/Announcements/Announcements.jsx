import React, {useState, useEffect, useCallback,} from 'react';
import {Button} from "../ui/button";
import AnnouncementsTable from "./AnnouncementsTable";
import {ChevronLeft, Circle, Filter, Plus, X} from "lucide-react";
import CreateAnnouncement from "./CreateAnnouncement";
import {useTheme} from "../theme-provider";
import {useSelector} from "react-redux";
import {Card} from "../ui/card";
import {toast} from "../ui/use-toast";
import {Popover, PopoverTrigger} from "@radix-ui/react-popover";
import {PopoverContent} from "../ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../ui/command";
import {Badge} from "../ui/badge";
import {useLocation, useNavigate} from "react-router-dom";
import {apiService, baseUrl} from "../../utils/constent";
import Pagination from "../Comman/Pagination";
import {RadioGroup, RadioGroupItem} from "../ui/radio-group";
import {EmptyDataContent} from "../Comman/EmptyDataContent";
import {debounce} from "lodash";
import {CommSearchBar} from "../Comman/CommentEditor";
import {EmptyAnnounceContent} from "../Comman/EmptyContentForModule";

const initialStateFilter = {labels: "", status: "", search:""}
const perPageLimit = 10;
const status = [{label: "Published", value: 1}, {label: "Scheduled", value: 2}, {label: "Draft", value: 4},];

const Announcements = () => {
    const location = useLocation();
    let navigate = useNavigate();
    const {theme} = useTheme();
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo") || 1;
    const getNavOpenSheet = UrlParams.get("opensheet") || false;
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);

    const [announcementList, setAnnouncementList] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState({})
    const [filter, setFilter] = useState({...initialStateFilter, projectId: projectDetailsReducer.id});
    const [pageNo, setPageNo] = useState(Number(getPageNo));
    const [openFilterType, setOpenFilterType] = useState('');
    const [openFilter, setOpenFilter] = useState('');
    const [totalRecord, setTotalRecord] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [emptyContentBlock, setEmptyContentBlock] = useState(true);

    const emptyContent = (status) => {setEmptyContentBlock(status);};

    const openSheet = () => {
        setSelectedRecord({id: "new"})
    };

    useEffect(() => {
        if(getNavOpenSheet === "open"){
            openSheet();
        }
    }, [getNavOpenSheet])

    useEffect(() => {
        if(projectDetailsReducer.id){
            getAllPosts(filter);
        }
        if(getNavOpenSheet) {
            navigate(`${baseUrl}/announcements?opensheet=${getNavOpenSheet}&pageNo=${pageNo}`);
        } else {
            navigate(`${baseUrl}/announcements?pageNo=${pageNo}`);
        }
    }, [projectDetailsReducer.id, allStatusAndTypes, pageNo,]);

    const getAllPosts = async (getFilter = {}) => {
        const payload = {
            projectId: projectDetailsReducer.id,
            page: pageNo,
            limit: perPageLimit,
            search: getFilter?.search,
            labels: getFilter?.labels,
            status: getFilter?.status
        }
        setIsLoading(true);
        const data = await apiService.getAllPosts(payload)
        setIsLoading(false)
        if (data.success) {
            setAnnouncementList(data.data.data)
            setTotalRecord(data.data.total)
            if (!data.data.data || data.data.data.length === 0) {
                emptyContent(true);
            } else {
                emptyContent(false);
            }
        } else {
            emptyContent(true);
        }
    }

    const throttledDebouncedSearch = useCallback(
        debounce((value) => {
            const updatedFilter = {
                ...filter,
                projectId: projectDetailsReducer.id,
                search: value,
                page: 1,
            };
            setFilter(updatedFilter);
            getAllPosts(updatedFilter);
        }, 500),
        []
    );

    const onChangeSearch = (e) => {
        const value = e.target.value;
        setFilter( { ...filter, search: value });
        throttledDebouncedSearch(value)
    };

    const filterPosts = async (event) => {
        setIsLoading(true)
        const updatedFilter = { ...filter, [event.name]: event.value };
        setFilter(updatedFilter);
        const payload = {
            projectId: projectDetailsReducer.id,
            page: 1,
            limit: perPageLimit,
            search: updatedFilter.search,
            labels: event.name === "labels" ? event.value : updatedFilter.labels,
            status: event.name === "status" ? event.value : updatedFilter.status
        };
        await getAllPosts(payload);
    }

    const clearSearchFilter = () => {
        const clone = {...filter, search: ''}
        setFilter(clone);
        setPageNo(1);
        getAllPosts(clone);
    };

    const closeSheet = (record,addRecord) => {
        if (record) {
            const updatedItems = announcementList.map((x) => x.id === record.id ? {...x, ...record, status: record.status} : x);
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
        const data = await apiService.deletePosts(id)
        if (data.success) {
            setIsLoadingDelete(false)
            const clone = [...announcementList];
            const index = clone.findIndex((x) => x.id === id)
            if (index !== -1) {
                clone.splice(index, 1)
                setAnnouncementList(clone);
            }
            setTotalRecord(Number(totalRecord) - 1)
            if (clone.length === 0 && pageNo > 1) {
                navigate(`${baseUrl}/announcements?pageNo=${pageNo - 1}`);
                setPageNo((prev) => prev - 1);
            } else {
                getAllPosts();
            }
            toast({description: data.message,})
        } else {
            setIsLoadingDelete(false)
            toast({description: data.error.message, variant: "destructive"})
        }
    }

    const totalPages = Math.ceil(totalRecord / perPageLimit);

    const handlePaginationClick = async (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            navigate(`${baseUrl}/announcements?pageNo=${newPage}`);
            setIsLoading(true);
            setPageNo(newPage);
            setIsLoading(false);
        }
    };

    const handleBadge = (obj) => {
        const updatedFilter = { ...filter, [obj.value]: "" };
        setFilter(updatedFilter);
        getAllPosts(updatedFilter);
    };

    const matchedObject = allStatusAndTypes.labels ? allStatusAndTypes.labels.find(x => x.id === filter.labels) : null;

    return (
        <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>

            {selectedRecord.id &&
            <CreateAnnouncement
                isOpen={selectedRecord.id}
                onOpen={openSheet}
                onClose={closeSheet}
                getAllPosts={getAllPosts}
                setSelectedRecord={setSelectedRecord}
                announcementList={announcementList}
                setAnnouncementList={setAnnouncementList}
            />}

            <div className={"flex items-center justify-between flex-wrap gap-2"}>
                <div className={"flex flex-col flex-1 gap-y-0.5"}>
                    <h1 className="text-2xl font-normal flex-initial w-auto">Announcement ({totalRecord})</h1>
                    <p className={"text-sm text-muted-foreground"}>Use announcements to keep your users informed about the latest updates, bug fixes, enhancements, and other important changes.</p>
                </div>
                <div className={"w-full lg:w-auto flex sm:flex-nowrap flex-wrap gap-2 items-center"}>
                    <div className={"flex gap-2 items-center w-full lg:w-auto"}>
                        <CommSearchBar
                            value={filter.search}
                            onChange={onChangeSearch}
                            onClear={clearSearchFilter}
                            placeholder="Search..."
                        />
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
                                                        <RadioGroup value={filter.status} onValueChange={(value) => filterPosts({ name: "status", value })} className={"gap-0.5"}>
                                                            {(status || []).map((x, i) => (
                                                                <CommandItem key={i} className={"p-0 flex items-center gap-1 cursor-pointer"}>
                                                                    <div
                                                                        onClick={() => filterPosts({ name: "status", value: x.value })}
                                                                        className="flex items-center gap-1 w-full"
                                                                    >
                                                                        <RadioGroupItem className="m-2" value={x.value} checked={x.value === filter.status} />
                                                                        <span className={"flex-1 w-full text-sm font-normal cursor-pointer"}>{x.label}</span>
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </RadioGroup>
                                                    </CommandGroup>
                                                    : openFilterType === 'label' ?
                                                    <CommandGroup className={"w-full"}>
                                                        <CommandItem className={"p-0 flex gap-2 items-center cursor-pointer p-1"} onSelect={() => {setOpenFilterType('');}}>
                                                            <ChevronLeft className="mr-2 h-4 w-4"  />  <span className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"}>Back</span>
                                                        </CommandItem>
                                                        <RadioGroup value={filter.labels} onValueChange={(value) => filterPosts({ name: "labels", value })} className={"gap-0.5"}>
                                                            {(allStatusAndTypes.labels || []).map((x, i) => (
                                                                <CommandItem key={i} className={"p-0 flex items-center gap-1 cursor-pointer"}>
                                                                    <div
                                                                        onClick={() => filterPosts({ name: "labels", value: x.id })}
                                                                        className="flex items-center gap-1 w-full"
                                                                    >
                                                                        <RadioGroupItem className="m-2" value={x.id} checked={x.id == filter.labels} />
                                                                        <Circle
                                                                            fill={x.colorCode}
                                                                            stroke={x.colorCode}
                                                                            className={`${theme === "dark" ? "" : "text-muted-foreground"} w-[10px] h-[10px]`}
                                                                        />
                                                                        <span className={"flex-1 w-full text-sm font-normal"}>{x.name}</span>
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </RadioGroup>
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
                    <Button
                        onClick={openSheet}
                        className={"gap-2 font-medium hover:bg-primary"}
                    >
                        <Plus size={20} strokeWidth={3} />
                        <span className={"text-xs md:text-sm font-medium"}>New Announcement</span>
                    </Button>
                </div>
            </div>

            {(filter.status  || filter.labels) && <div className={"flex flex-wrap gap-2 mt-6"}>
                {
                    filter.status &&
                    <Badge variant="outline" className="rounded p-0 font-medium">
                        <span
                            className="px-3 py-1.5 border-r">{filter.status == 1 ? "Published" : filter.status === 2 ? "Scheduled" : filter.status == 4 ? "Draft" : ""}</span>
                        <span className="w-7 h-7 flex items-center justify-center cursor-pointer"
                              onClick={() => handleBadge({name: "status", value: "status"})}>
                            <X className='w-4 h-4'/>
                        </span>
                    </Badge>
                }
                {
                    filter.labels && <Badge variant="outline" className="rounded p-0 font-medium">
                        <span className="px-3 py-1.5 border-r flex gap-2 items-center">
                            <span className={"w-2.5 h-2.5 rounded-full"} style={{backgroundColor: matchedObject.colorCode}}/>{matchedObject?.name}
                        </span>
                        <span className="w-7 h-7 flex items-center justify-center cursor-pointer" onClick={() => handleBadge({name: "label", value: "labels"})}><X className='w-4 h-4'/></span>
                    </Badge>
                }
            </div>}

            <Card className={"my-6"}>
                <AnnouncementsTable
                    handleDelete={handleDelete}
                    data={announcementList}
                    setSelectedRecord={setSelectedRecord}
                    isLoading={isLoading}
                    isLoadingDelete={isLoadingDelete}
                    getAllPosts={getAllPosts}
                />
                {
                    announcementList?.length > 0 ?
                        <Pagination
                            pageNo={pageNo}
                            totalPages={totalPages}
                            isLoading={isLoading}
                            handlePaginationClick={handlePaginationClick}
                            theme={"light"}
                            stateLength={announcementList?.length}
                        /> : ""
                }
            </Card>
            {
                (isLoading || !emptyContentBlock) ? "" :
                        <EmptyDataContent data={EmptyAnnounceContent} onClose={() => emptyContent(false)} setSheetOpenCreate={openSheet}/>
            }
        </div>
    );
}

export default Announcements