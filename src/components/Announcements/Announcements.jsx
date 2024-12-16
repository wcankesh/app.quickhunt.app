import React, {useState, useEffect, useRef, useCallback,} from 'react';
import {Button} from "../ui/button";
import {Input} from "../ui/input";
import AnnouncementsTable from "./AnnouncementsTable";
import {ChevronLeft, Circle, Filter, Plus, X} from "lucide-react";
import CreateAnnouncement from "./CreateAnnouncement";
import {useTheme} from "../theme-provider";
import {useSelector} from "react-redux";
import {ApiService} from "../../utils/ApiService";
import {Card} from "../ui/card";
import AnalyticsView from "./AnalyticsView";
import {toast} from "../ui/use-toast";
import {Popover, PopoverTrigger} from "@radix-ui/react-popover";
import {PopoverContent} from "../ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../ui/command";
import {Checkbox} from "../ui/checkbox";
import {Badge} from "../ui/badge";
import {useLocation, useNavigate} from "react-router-dom";
import {baseUrl} from "../../utils/constent";
import Pagination from "../Comman/Pagination";
import {RadioGroup, RadioGroupItem} from "../ui/radio-group";
import {EmptyDataContent} from "../Comman/EmptyDataContent";
import {debounce} from "lodash";

const initialStateFilter = {l: "", s: "", q:""}

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
    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);

    const [announcementList, setAnnouncementList] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState({})
    const [analyticsObj, setAnalyticsObj] = useState({})
    const [filter, setFilter] = useState({...initialStateFilter, project_id: projectDetailsReducer.id});
    const [pageNo, setPageNo] = useState(Number(getPageNo));
    const [openFilterType, setOpenFilterType] = useState('');
    const [openFilter, setOpenFilter] = useState('');
    const [totalRecord, setTotalRecord] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [isFilter, setIsFilter] = useState(false);
    const [emptyContentBlock, setEmptyContentBlock] = useState(true);

    const emptyContent = (status) => {setEmptyContentBlock(status);};

    useEffect(() => {
            // if(filter.l || filter.s || filter.q || isFilter){
                // searchAnnouncement({...filter, page: pageNo, project_id: projectDetailsReducer.id,})
            // } else {
                if(!isFilter && projectDetailsReducer.id){
                    getAllPosts()
                }
            // }
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
            if (!data.data || data.data.length === 0) {
                emptyContent(true);
            } else {
                emptyContent(false);
            }
        } else {
            emptyContent(true);
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

    const throttledDebouncedSearch = useCallback(
        debounce((value) => {
            const updatedFilter = {
                ...filter,
                project_id: projectDetailsReducer.id,
                q: value,
                page: 1,
            };
            searchAnnouncement(updatedFilter);
        }, 500),
        []
    );

    const onChange = (e) => {
        const value = e.target.value;
        setFilter( { ...filter, q: value });
        throttledDebouncedSearch(value)
    };

    const filterPosts = async (event) => {
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

    const clearSearchFilter = () => {
        setFilter(prev => ({ ...prev, q: '' }));
        setPageNo(1);
        getAllPosts('', filter.q);
    };

    const openSheet = () => {
        setSelectedRecord({id: "new"})
        navigate(`${baseUrl}/announcements`);
    };

    const onCloseAnalyticsSheet = () => {
        setAnalyticsObj({})
    }

    const closeSheet = (record,addRecord) => {
        if (record) {
            const updatedItems = announcementList.map((x) => x.id === record.id ? {...x, ...record, post_status: record.post_status} : x);
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
            getAllPosts()
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

    const EmptyAnnounceContent = [
        {
            title: "Start Sharing Updates",
            description: `No announcements yet? Create your first one to keep users informed about product updates, new features, and improvements.`,
            btnText: [
                {title: "Create Announcement", openSheet: true, icon: <Plus size={18} className={"mr-1"} strokeWidth={3}/>},
            ],
        },
        {
            title: "Create Labels",
            description: `Organize your announcements by adding labels like "Update," "New Feature," or "Bug Fix" for easy categorization and clarity.`,
            btnText: [
                {title: "Create Labels", navigateTo: `${baseUrl}/settings/labels`, icon: <Plus size={18} className={"mr-1"} strokeWidth={3}/>},
            ],
        },
        {
            title: "Create Categories",
            description: `Group your announcements into categories such as "Product Updates," "Feature Launches," or "Changelog" to help users find relevant information quickly.`,
            btnText: [
                {title: "Create Categories", navigateTo: `${baseUrl}/settings/categories`, icon: <Plus size={18} className={"mr-1"} strokeWidth={3}/>},
            ],
        },
        {
            title: "Add Emoji",
            description: `Make your announcements more engaging by adding emojis to highlight key updates or set the tone for your message.`,
            btnText: [
                {title: "Add Emojis", navigateTo: `${baseUrl}/settings/emoji`, icon: <Plus size={18} className={"mr-1"} strokeWidth={3}/>},
            ],
        },
        {
            title: "Create In-App Message",
            description: `Share announcements directly with users through in-app messages to ensure they stay informed about important updates.`,
            btnText: [
                {title: "Create In-App Message", navigateTo: `${baseUrl}/app-message/type`, icon: <Plus size={18} className={"mr-1"} strokeWidth={3}/>},
            ],
        },
        {
            title: "Explore Examples",
            description: `See how platforms like Utterbond, Webform, and Rivyo efficiently share announcements to keep their users informed.`,
            btnText: [
                {title: "Utterbond", redirect: "https://webform.quickhunt.app/announcements"},
                {title: "Webform", redirect: "https://utterbond.quickhunt.app/announcements"},
                {title: "Rivyo", redirect: "https://rivyo.quickhunt.app/announcements"},
            ],
        },
    ];

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

            <div className={"flex items-center justify-between flex-wrap gap-2"}>
                <div className={"flex flex-col flex-1 gap-y-0.5"}>
                    <h1 className="text-2xl font-normal flex-initial w-auto">Announcement ({totalRecord})</h1>
                    <p className={"text-sm text-muted-foreground"}>Use announcements to keep your users informed about the latest updates, bug fixes, enhancements, and other important changes.</p>
                </div>
                <div className={"w-full lg:w-auto flex sm:flex-nowrap flex-wrap gap-2 items-center"}>
                    <div className={"flex gap-2 items-center w-full lg:w-auto"}>
                        <div className={"relative w-full"}>
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="w-full pl-4 pr-14 text-sm font-normal h-9"
                                name={"q"}
                                value={filter.q}
                                onChange={onChange}
                            />
                            {filter?.q?.trim() !== '' && (
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
                                    onClick={clearSearchFilter}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
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
                                                        {/*{*/}
                                                        {/*    (status || []).map((x, index) => {*/}
                                                        {/*        return (*/}
                                                        {/*            <CommandItem className={"p-0 flex gap-1 items-center cursor-pointer"}>*/}
                                                        {/*                <Checkbox className={'m-2'} checked={x.value === filter.s} onClick={(event) => filterPosts({name: "s", value: x.value == filter.s ? "" :x.value })} />*/}
                                                        {/*                <span className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"} onClick={(event) => filterPosts({name: "s", value: x.value == filter.s ? "" :x.value })} key={x.label}>{x.label}</span>*/}
                                                        {/*            </CommandItem>*/}
                                                        {/*        )*/}
                                                        {/*    })*/}
                                                        {/*}*/}
                                                        <RadioGroup value={filter.s} onValueChange={(value) => filterPosts({ name: "s", value })} className={"gap-0.5"}>
                                                            {(status || []).map((x) => (
                                                                <CommandItem key={x.value} className={"p-0 flex items-center gap-1 cursor-pointer"}>
                                                                    <div
                                                                        onClick={() => filterPosts({ name: "s", value: x.value })}
                                                                        className="flex items-center gap-1 w-full"
                                                                    >
                                                                        <RadioGroupItem className="m-2" value={x.value} checked={x.value === filter.s} />
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
                                                        {/*{*/}
                                                        {/*    (allStatusAndTypes.labels || []).map((x, i) => {*/}
                                                        {/*        return (*/}
                                                        {/*            <CommandItem key={x.id} className={"p-0"}>*/}
                                                        {/*                <div className={"w-full flex items-center gap-1"}  key={x.label}>*/}
                                                        {/*                    <Checkbox className={'m-2'} checked={x.id == filter.l} onClick={(event) => filterPosts({name: "l", value: x.id == filter.l ? "" : x.id })} />*/}
                                                        {/*                    <div className={"flex items-center gap-2 w-full"} onClick={(event) => filterPosts({name: "l", value: x.id == filter.l ? "" : x.id })}>*/}
                                                        {/*                        <Circle fill={x.label_color_code}*/}
                                                        {/*                                stroke={x.label_color_code}*/}
                                                        {/*                                className={`${theme === "dark" ? "" : "text-muted-foreground"} w-[10px] h-[10px]`}/>*/}
                                                        {/*                        <span className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"}>{x.label_name}</span>*/}
                                                        {/*                    </div>*/}
                                                        {/*                </div>*/}
                                                        {/*            </CommandItem>*/}
                                                        {/*        )*/}
                                                        {/*    })*/}
                                                        {/*}*/}
                                                        <RadioGroup value={filter.l} onValueChange={(value) => filterPosts({ name: "l", value })} className={"gap-0.5"}>
                                                            {(allStatusAndTypes.labels || []).map((x) => (
                                                                <CommandItem key={x.id} className={"p-0 flex items-center gap-1 cursor-pointer"}>
                                                                    <div
                                                                        onClick={() => filterPosts({ name: "l", value: x.id })}
                                                                        className="flex items-center gap-1 w-full"
                                                                    >
                                                                        <RadioGroupItem className="m-2" value={x.id} checked={x.id == filter.l} />
                                                                        <Circle
                                                                            fill={x.label_color_code}
                                                                            stroke={x.label_color_code}
                                                                            className={`${theme === "dark" ? "" : "text-muted-foreground"} w-[10px] h-[10px]`}
                                                                        />
                                                                        <span className={"flex-1 w-full text-sm font-normal"}>{x.label_name}</span>
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

            <Card className={"my-6"}>
                <AnnouncementsTable
                    setAnalyticsObj={setAnalyticsObj}
                    handleDelete={handleDelete}
                    data={announcementList}
                    setSelectedRecord={setSelectedRecord}
                    isLoading={isLoading}
                    isLoadingDelete={isLoadingDelete}
                    getAllPosts={getAllPosts}
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
            {
                (isLoading || !emptyContentBlock) ? "" :
                        <EmptyDataContent data={EmptyAnnounceContent} onClose={() => emptyContent(false)} setSheetOpenCreate={openSheet}/>
            }
        </div>
    );
}

export default Announcements