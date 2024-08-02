import React, {Fragment, useState, useEffect,} from 'react';
import {Button} from "../ui/button";
import {Input} from "../ui/input";
import AnnouncementsView from "./AnnouncementsView";
import AnnouncementsTable from "./AnnouncementsTable";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Circle,
    Ellipsis, Filter,
    LayoutList,
    Plus,
    Text
} from "lucide-react";
import CreateAnnouncementsLogSheet from "./CreateAnnouncementsLogSheet";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {useTheme} from "../theme-provider";
import {useSelector} from "react-redux";
import {ApiService} from "../../utils/ApiService";
import {getProjectDetails} from "../../utils/constent";
import {Card, CardFooter} from "../ui/card";
import SidebarSheet from "./SidebarSheet";
import {toast} from "../ui/use-toast";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../ui/dropdown-menu";
import {Popover, PopoverTrigger} from "@radix-ui/react-popover";
import {PopoverContent} from "../ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../ui/command";
import {Checkbox} from "../ui/checkbox";

const initialStateFilter = {
    l: "",
    s: "",
}
const perPageLimit = 15;

const status = [
    {
        label: "All",
        value: 0
    },
    {
        label: "Draft",
        value: 1
    },
    {
        label: "Published",
        value: 2
    }
];

const Announcements = () => {
    const activeTab = localStorage.getItem("tabIndex") || 0;
    const [tab, setTab] = useState(Number(activeTab));
    const {theme} = useTheme();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const [announcementList, setAnnouncementList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState(initialStateFilter);
    const [pageNo, setPageNo] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [selectedRecord, setSelectedRecord] = useState({})
    const [analyticsObj, setAnalyticsObj] = useState({})
    const apiService = new ApiService();
    const totalPages = Math.ceil(totalRecord / perPageLimit);
    const [openFilterType, setOpenFilterType] = useState('');


    const openSheet = () => {
        setSelectedRecord({id: "new"})
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
    };

    const handleDelete = async (id) => {
        const data = await apiService.deletePosts(id, pageNo)
        if (data.status === 200) {
            const clone = [...announcementList];
            const index = clone.findIndex((x) => x.id === id)
            if (index !== -1) {
                clone.splice(index, 1)
                setAnnouncementList(clone);
            }
            toast({
                description: data.message,
            })
        } else {
            toast({
                description: data.message,
                variant: "destructive"
            })
        }
    }

    useEffect(() => {
        if(filter.l || filter.s){
            let payload = {...filter, project_id: projectDetailsReducer.id, page: pageNo, limit: perPageLimit}
            searchAnnouncement(payload);
        }
        else{
            getAllPosts();
        }
    }, [projectDetailsReducer.id, allStatusAndTypes, pageNo,]);

    const getAllPosts = async () => {
        setIsLoading(true)
        const data = await apiService.getAllPosts({
            project_id: projectDetailsReducer.id,
            page: pageNo,
            limit: perPageLimit
        })
        if (data.status === 200) {
            setIsLoading(false)
            setAnnouncementList(data.data)
            setTotalRecord(data.total)
        } else {
            setIsLoading(false)
        }
    }

    const filterPosts =  (event) => {
        setIsLoading(true)
        const payload = {
            ...filter,
            [event.name]: event.value,
            project_id: projectDetailsReducer.id,
            q: "",
            page:1,
        }
        setFilter({...filter, [event.name]: event.value,});

        searchAnnouncement(payload);
    }

    const searchAnnouncement = async (payload) => {
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

    const handleTab = (tabIndex) => {
        setTab(tabIndex);
        localStorage.setItem("tabIndex", tabIndex);
    }

    const handlePaginationClick = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPageNo(newPage);
        }
    };

    console.log(allStatusAndTypes.labels);

    return (
        <div
            className={"xl:container xl:max-w-[1200px] lg:container lg:max-w-[992px] md:container md:max-w-[768px] sm:container sm:max-w-[639px] pt-8 pb-5 px-4"}>
            {selectedRecord.id &&
            <CreateAnnouncementsLogSheet isOpen={selectedRecord.id}
                                         selectedRecord={selectedRecord}
                                         onOpen={openSheet}
                                         onClose={closeSheet}
            />}
            {analyticsObj.id && <SidebarSheet selectedViewAnalyticsRecord={analyticsObj}
                                              analyticsObj={analyticsObj}
                                              isOpen={analyticsObj.id}
                                              onClose={onCloseAnalyticsSheet}/>}
            <div className={"flex items-center justify-between flex-wrap gap-6"}>
                <div className={"flex justify-between items-center w-full md:w-auto"}>
                    <h3 className={"text-2xl font-medium leading-8"}>{getProjectDetails('project_name')}</h3>
                    <div className={"md:hidden"}>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Ellipsis size={16}/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem className={"cursor-pointer p-0"}>
                                <div className={"w-full"}>
                                    {
                                        (status || []).map((x, index) => {
                                            return (
                                                <div className={"p-2"} onClick={(event) => filterPosts({name: "s", value: x.value})}>
                                                    <span key={x.label}>{x.label}</span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                </div>
                <div className={"flex gap-6 flex-wrap items-center"}>
                    <div className={"flex gap-6 items-center w-full md:w-auto"}>
                    <div className={"md:block hidden"}>
                        <div className={"flex gap-6 items-center"}>
                            <Popover>
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
                                                                            <ChevronLeft className="mr-2 h-4 w-4"  />  <span className={"flex-1 w-full text-sm font-medium cursor-pointer flex gap-2 items-center"}>Back</span>
                                                                        </CommandItem>
                                                                        {
                                                                            (status || []).map((x, index) => {
                                                                                return (
                                                                                    <CommandItem className={"p-0 flex gap-1 items-center cursor-pointer"}>
                                                                                        <Checkbox className={'m-2'} checked={x.value === filter.s} onClick={(event) => filterPosts({name: "s", value: x.value })} />
                                                                                        <span className={"flex-1 w-full text-sm font-medium cursor-pointer flex gap-2 items-center"} onClick={(event) => filterPosts({name: "s", value: x.value})} key={x.label}>{x.label}</span>
                                                                                    </CommandItem>
                                                                                )
                                                                            })
                                                                        }
                                                                    </CommandGroup>
                                                : openFilterType === 'label' ?
                                                                    <CommandGroup className={"w-full"}>
                                                                        <CommandItem className={"p-0 flex gap-2 items-center cursor-pointer p-1"} onSelect={() => {setOpenFilterType('');}}>
                                                                            <ChevronLeft className="mr-2 h-4 w-4"  />  <span className={"flex-1 w-full text-sm font-medium cursor-pointer flex gap-2 items-center"}>Back</span>
                                                                        </CommandItem>
                                                                        {
                                                                            (allStatusAndTypes.labels || []).map((x, i) => {
                                                                                return (
                                                                                    <CommandItem key={x.id}>
                                                                                        <div className={"w-full flex items-center gap-1"}  key={x.label}>
                                                                                            <Checkbox className={'m-2'} checked={x.id == filter.l} onClick={(event) => filterPosts({name: "l", value: x.id })} />
                                                                                            <div className={"flex items-center gap-2 w-full"} onClick={(event) => filterPosts({name: "l", value: x.id })}>
                                                                                                <Circle fill={x.label_color_code}
                                                                                                        stroke={x.label_color_code}
                                                                                                        className={`${theme === "dark" ? "" : "text-muted-foreground"} w-[10px] h-[10px]`}/>
                                                                                                <span className={"flex-1 w-full text-sm font-medium cursor-pointer flex gap-2 items-center"}>{x.label_name}</span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </CommandItem>
                                                                                )
                                                                            })
                                                                        }
                                                                    </CommandGroup>
                                                                    :<CommandGroup>
                                                                        <CommandItem onSelect={() => {setOpenFilterType('status');}}>
                                                                            <span className={"text-sm font-medium cursor-pointer"}>Status</span>
                                                                        </CommandItem>
                                                                        <CommandItem onSelect={() => {setOpenFilterType('label');}}>
                                                                            <span className={"text-sm font-medium cursor-pointer"}>Labels</span>
                                                                        </CommandItem>
                                                                    </CommandGroup>
                                            }
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        <Select value={filter.s} onValueChange={(select) => filterPosts({name: "s", value: select})}>
                            <SelectTrigger className="h-9 w-[115px]">
                                <SelectValue placeholder="All"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        (status || []).map((x, index) => {
                                            return (
                                                <SelectItem key={x.label} value={x.value}>{x.label}</SelectItem>
                                            )
                                        })
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {/*<ComboBox items={items2} isSearchBox={true}  classNames={"w-[165px] custom-shadow"} value={selected} setValue={setSelected} onSelect={handleSelect} placeholder={"All Updates"}/>*/}
                        <Select value={filter.l} placeholder="Publish"
                                onValueChange={(select) => filterPosts({name: "l", value: select})} className={""}>
                            <SelectTrigger className="w-[165px] h-9">
                                <SelectValue placeholder="Publish"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem>All Updates</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                    {
                                        (allStatusAndTypes.labels || []).map((x, i) => {
                                            return (
                                                <Fragment key={x.id}>
                                                    <SelectItem value={x.id}>
                                                        <div className={"flex items-center gap-2"}>
                                                            <Circle fill={x.label_color_code}
                                                                    stroke={x.label_color_code}
                                                                    className={`${theme === "dark" ? "" : "text-muted-foreground"} w-[10px] h-[10px]`}/>
                                                            {x.label_name}
                                                        </div>
                                                    </SelectItem>
                                                </Fragment>
                                            )
                                        })
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        </div>
                    </div>
                            <div className={"w-full"}>
                                <Input
                                    type="search"
                                    placeholder="Search..."
                                    className="w-full pl-4 pr-14 text-sm font-normal h-9"
                                    // onChange={(event) => filterPosts({name: "q", value: x.value})}

                                />
                            </div>

                    </div>
                    <div className={"flex flex-grow gap-2 items-center"}>
                        <Button onClick={() => handleTab(0)} variant={"outline"}
                                className={`h-9 w-9 p-2 ${tab == 0 ? "bg-primary hover:bg-primary" : ""} `}>
                            <Text color={`${tab == 0 ? "#FFFFFF" : "#5F5F5F"}`}/>
                        </Button>
                        <Button onClick={() => handleTab(1)} variant={"outline"}
                                className={`h-9 w-9 p-2 ${tab == 1 ? "bg-primary hover:bg-primary" : ""} `}>
                            <LayoutList color={`${tab == 1 ? "#FFFFFF" : "#5F5F5F"}`}/>
                        </Button>
                        <Button onClick={openSheet} className={"flex gap-2 px-3 md:px-6 w-[195px] md:w-auto hover:bg-primary"}>
                            <Plus className={"w-[15px] h-[15px] md:w-[20px] md:h-[20px]"}/>
                            <span className={"text-xs md:text-sm font-semibold"}>New Announcement</span>
                        </Button>
                    </div>
                </div>
            </div>



            <Card className={"mt-8"}>
                {tab == 0 && <AnnouncementsTable
                    setAnalyticsObj={setAnalyticsObj}
                    handleDelete={handleDelete}
                    data={announcementList}
                    setSelectedRecord={setSelectedRecord}
                    isLoading={isLoading}/>
                }
                {tab == 1 && <AnnouncementsView
                    setAnalyticsObj={setAnalyticsObj}
                    handleDelete={handleDelete}
                    isLoading={isLoading}
                    setSelectedRecord={setSelectedRecord}
                    data={announcementList}/>
                }
                <CardFooter className={"p-0"}>
                    <div
                        className={`w-full p-5 ${theme === "dark" ? "" : "bg-muted"} rounded-b-lg rounded-t-none flex justify-end px-4 py-4 md:px-16 md:py-15px`}>
                        <div className={"w-full flex gap-8 items-center justify-between sm:justify-end"}>
                            {/*<div className={"w-full flex justify-between gap-2 items-center"}>*/}
                            <div>
                                <h5 className={"text-xs md:text-sm font-semibold"}>Page {pageNo} of {totalPages}</h5>
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
    );
}

export default Announcements