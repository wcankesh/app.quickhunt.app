import React, {useState, useEffect, Fragment, useCallback} from 'react';
import {Button} from "../ui/button";
import {BarChart, BookCheck, ChevronLeft, Circle, ClipboardList, Ellipsis, Filter, Plus, ScrollText, SquareMousePointer, X} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../ui/command";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {Card} from "../ui/card";
import {useTheme} from "../theme-provider";
import {Skeleton} from "../ui/skeleton";
import {Badge} from "../ui/badge";
import {useNavigate, useSearchParams} from "react-router-dom";
import {baseUrl, WIDGET_DOMAIN} from "../../utils/constent";
import {ApiService} from "../../utils/ApiService";
import {useSelector} from "react-redux";
import EmptyData from "../Comman/EmptyData";
import {Select, SelectGroup, SelectValue} from "@radix-ui/react-select";
import {SelectContent, SelectItem, SelectTrigger} from "../ui/select";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import moment from "moment";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../ui/dropdown-menu";
import {toast} from "../ui/use-toast";
import Pagination from "../Comman/Pagination";
import DeleteDialog from "../Comman/DeleteDialog";
import {RadioGroup, RadioGroupItem} from "../ui/radio-group";
import {EmptyDataContent} from "../Comman/EmptyDataContent";
import {debounce} from "lodash";
import {CommSearchBar} from "../Comman/CommentEditor";
import CopyCode from "../Comman/CopyCode";
import {EmptyInAppContent} from "../Comman/EmptyContentForModule";

const perPageLimit = 10;

const status = [
    {name: "Live", value: 1, fillColor: "#CEF291", strokeColor: "#CEF291",},
    {name: "Draft", value: 3, fillColor: "#CF1322", strokeColor: "#CF1322",},
    // {name: "Scheduled", value: 2, fillColor: "#63C8D9", strokeColor: "#63C8D9",},
    // {name: "Paused", value: 4, fillColor: "#6392D9", strokeColor: "#6392D9",},
];

const status2 = [
    {name: "Live", value: 1, fillColor: "#CEF291", strokeColor: "#CEF291",},
    {name: "Draft", value: 3, fillColor: "#CF1322", strokeColor: "#CF1322",},
    {name: "Scheduled", value: 2, fillColor: "#63C8D9", strokeColor: "#63C8D9",},
    // {name: "Paused", value: 4, fillColor: "#6392D9", strokeColor: "#6392D9",},
];

const contentType = [
    {label: "Post", value: 1, icon: <ScrollText size={16}/>,},
    {label: "Banner", value: 2, icon: <ClipboardList size={16}/>,},
    {label: "Survey", value: 3, icon: <BookCheck size={16}/>,},
    {label: "Checklist", value: 4, icon: <SquareMousePointer size={16}/>,}
];

const typeNames = {
    1: "Post",
    2: "Banner",
    3: "Survey",
    4: "Checklist"
};
const typeIcon = {
    1: <ScrollText size={16}/>,
    2: <ClipboardList size={16}/>,
    3: <BookCheck size={16}/>,
    4: <SquareMousePointer size={16}/>,
};

const initialStateFilter = {search: "", type: ""}

const InAppMessage = () => {
    const {theme} = useTheme();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const getPageNo = searchParams.get("pageNo") || 1;
    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);

    const [filter, setFilter] = useState(initialStateFilter);
    const [messageList, setMessageList] = useState([]);
    const [openFilterType, setOpenFilterType] = useState('');
    const [selectedId, setSelectedId] = useState("");
    const [pageNo, setPageNo] = useState(Number(getPageNo));
    const [totalRecord, setTotalRecord] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [openFilter, setOpenFilter] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [openCopyCode, setOpenCopyCode] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [emptyContentBlock, setEmptyContentBlock] = useState(false);

    useEffect(() => {
        if (projectDetailsReducer.id) {
            getAllInAppMessageList(filter.search, filter.type);
        }
        navigate(`${baseUrl}/app-message?pageNo=${pageNo}`)
    }, [projectDetailsReducer.id, pageNo, allStatusAndTypes,])

    const getAllInAppMessageList = async (search, type) => {
        setIsLoading(true);
        const payload = {
            projectId: projectDetailsReducer.id,
            page: pageNo,
            limit: perPageLimit,
            search: search,
            type: type,
        }
        const data = await apiService.getAllInAppMessage(payload);
        setIsLoading(false);
        if (data.success) {
            setMessageList(data.data.data);
            setTotalRecord(data.data.total || 0);
        }
    }

    const filterMessage = async (event) => {
        setIsLoading(true)
        setFilter({...filter, [event.name]: event.value,});
        await getAllInAppMessageList(filter.search, event.value);
    }

    const throttledDebouncedSearch = useCallback(
        debounce((value) => {
            const updatedFilter = {
                ...filter,
                projectId: projectDetailsReducer.id,
                search: value,
                page: 1,
            };
            getAllInAppMessageList(updatedFilter.search, updatedFilter.type);
        }, 500),
        [projectDetailsReducer.id]
    );

    const onChangeSearch = (e) => {
        const value = e.target.value;
        setFilter({...filter, search: value});
        throttledDebouncedSearch(value);
    };

    const clearSearchFilter = () => {
        setFilter(prev => ({...prev, search: '', type: ''}));
        setPageNo(1);
        getAllInAppMessageList('', '', filter.search);
    };

    const removeBadge = () => {
        setFilter({...filter, type: "",});
        getAllInAppMessageList(filter.search, '');
    }

    const totalPages = Math.ceil(totalRecord / perPageLimit);

    const handlePaginationClick = async (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setIsLoading(true);
            setPageNo(newPage);
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (object, value) => {
        const payload = {status: value,}
        setMessageList(messageList.map(x => x.id === object.id ? {...x, status: value,} : x));
        const data = await apiService.updateInAppMessageStatus(payload, object.id);
        if (data.success) {
            toast({description: data.message,});
        } else {
            toast({variant: "destructive", description: data.error.message})
        }
    };

    const handleCreateUpdate = (id, type) => {
        if (id == "type") {
            navigate(`${baseUrl}/app-message/${id}`);
        } else {
            navigate(`${baseUrl}/app-message/${type}/${id}?pageNo=${getPageNo}`);
        }
    }

    const openDeletePost = (id) => {
        setDeleteId(id)
        setOpenDelete(true)
    }

    const onDelete = async () => {
        setIsLoadingDelete(true);
        const data = await apiService.deleteInAppMessage(deleteId);
        const clone = [...messageList];
        const deleteIndex = clone.findIndex((x) => x.id == deleteId);
        if (data.success) {
            clone.splice(deleteIndex, 1);
            setMessageList(clone);
            if (clone.length === 0 && pageNo > 1) {
                navigate(`${baseUrl}/app-message?pageNo=${pageNo - 1}`);
                setPageNo((prev) => prev - 1);
            } else {
                getAllInAppMessageList();
            }
            setIsLoadingDelete(false);
            toast({description: data.message})
        } else {
            toast({variant: "destructive", description: data.error.message})
        }
        setOpenDelete(false);
        setDeleteId(null);
    }

    const getCodeCopy = (id) => {
        setOpenCopyCode(!openCopyCode)
        setSelectedId(id)
    }

    const handleCopyCode = (id) => {
        navigator.clipboard.writeText(id).then(() => {
            toast({description: "Copied to clipboard"})
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    const codeString = `
<script>
    window.quickhuntSettings = {name: "", email: "", };
</script>
<script>
    window.Quickhunt_In_App_Message_Config = window.Quickhunt_In_App_Message_Config || [];
    window.Quickhunt_In_App_Message_Config.push({ Quickhunt_In_App_Message_Key: 
     "${selectedId}"});
</script>
<script src="${WIDGET_DOMAIN}/widgetScript.js"></script>`;

    return (
        <Fragment>

            {
                deleteId &&
                <DeleteDialog
                    title={"You really want to delete this Message?"}
                    isOpen={openDelete}
                    onOpenChange={() => setOpenDelete(false)}
                    onDelete={onDelete}
                    isDeleteLoading={isLoadingDelete}
                    deleteRecord={deleteId}
                />
            }

            {
                openCopyCode &&
                <Fragment>
                    <CopyCode
                        open={openCopyCode}
                        title={"In App Message"}
                        description={"Choose how you would like to embed your message."}
                        onClick={() => getCodeCopy("")}
                        onOpenChange={setOpenCopyCode}
                        codeString={codeString}
                        handleCopyCode={() => handleCopyCode(codeString)}
                    />
                </Fragment>
            }

            <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>
                <div className={"flex items-center justify-between flex-wrap gap-2"}>
                    <div className={"flex flex-col flex-1 gap-y-0.5"}>
                        <h1 className="text-2xl font-normal flex-initial w-auto">In App Messages ({totalRecord})</h1>
                        <p className={"text-sm text-muted-foreground"}>Engage users use posts, banners, surveys, and
                            checklists to share updates, gather feedback, and improve their experience.</p>
                    </div>
                    <div className={"w-full lg:w-auto flex sm:flex-nowrap flex-wrap gap-2 items-center"}>
                        <div className={"flex gap-2 items-center w-full lg:w-auto"}>
                            <CommSearchBar
                                value={filter.search}
                                onChange={onChangeSearch}
                                onClear={clearSearchFilter}
                                placeholder="Search title"
                            />
                            <div className={"flex items-center"}>
                                <Popover open={openFilter}
                                         onOpenChange={() => {
                                             setOpenFilter(!openFilter);
                                             setOpenFilterType('');
                                         }}
                                >
                                    <PopoverTrigger asChild>
                                        <Button className={"h-9 w-9"} size={"icon"} variant="outline"><Filter
                                            fill="true" className='w-4 -h4'/></Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0" align={"end"}>
                                        <Command className="w-full">
                                            <CommandInput placeholder="Search filter..."/>
                                            <CommandList className="w-full">
                                                <CommandEmpty>No filter found.</CommandEmpty>
                                                {
                                                    openFilterType === 'contentType' ?
                                                        <CommandGroup className={"w-full"}>
                                                            <CommandItem
                                                                className={"p-0 flex gap-2 items-center cursor-pointer p-1"}
                                                                onSelect={() => {
                                                                    setOpenFilterType('');
                                                                }}>
                                                                <ChevronLeft className="mr-2 h-4 w-4"/> <span
                                                                className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"}>Back</span>
                                                            </CommandItem>
                                                            <RadioGroup value={filter.type}
                                                                        onValueChange={(value) => filterMessage({
                                                                            name: "type",
                                                                            value
                                                                        })} className={"gap-0.5"}>
                                                                {(contentType || []).map((x) => (
                                                                    <CommandItem key={x.value}
                                                                                 className={"p-0 flex items-center gap-1 cursor-pointer"}>
                                                                        <div
                                                                            onClick={() => filterMessage({
                                                                                name: "type",
                                                                                value: x.value
                                                                            })}
                                                                            className="flex items-center gap-1 w-full"
                                                                        >
                                                                            <RadioGroupItem className="m-2"
                                                                                            value={x.value}
                                                                                            checked={x.value === filter.type}/>
                                                                            <span
                                                                                className={"flex-1 w-full text-sm font-normal cursor-pointer"}>{x.label}</span>
                                                                        </div>
                                                                    </CommandItem>
                                                                ))}
                                                            </RadioGroup>
                                                        </CommandGroup>
                                                        : <CommandGroup>
                                                            <CommandItem onSelect={() => {
                                                                setOpenFilterType('contentType');
                                                            }}>
                                                                <span className={"text-sm font-normal cursor-pointer"}>Content Type</span>
                                                            </CommandItem>
                                                        </CommandGroup>
                                                }
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <Button onClick={() => handleCreateUpdate("type")}
                                className={"gap-2 font-medium hover:bg-primary"}><Plus size={20} strokeWidth={3}/><span
                            className={"text-xs md:text-sm font-medium"}>New Content</span></Button>
                    </div>
                </div>

                {
                    (filter.type) && <div className={"flex flex-wrap gap-2 mt-6"}>
                            <Badge variant="outline" className="rounded p-0 font-medium">
                                <span
                                    className="px-3 py-1.5 border-r">{filter.type === 1 ? "Post" : filter.type === 2 ? "Banners" : filter.type === 3 ? "Survey" : filter.type === 4 ? "Checklist" : ""}</span>
                                <span className="w-7 h-7 flex items-center justify-center cursor-pointer"
                                      onClick={() => removeBadge({name: "contentType", value: "type"})}><X
                                    className='w-4 h-4'/></span>
                            </Badge>
                    </div>
                }

                <Card className={"my-6"}>
                    <div className={"grid grid-cols-1 overflow-auto whitespace-nowrap"}>
                        <Table>
                            <TableHeader className={`${theme === "dark" ? "" : "bg-muted"}`}>
                                <TableRow>
                                    {
                                        ["Title", "Status", "Sender", "Content type", "Created at", "", "Action"].map((x, i) => {
                                            return (
                                                <TableHead
                                                    className={`px-2 py-[10px] md:px-3 font-medium text-card-foreground ${(i === 5 || i === 2) ? 'text-center' : ''}`}
                                                    key={i}>{x}</TableHead>
                                            )
                                        })
                                    }
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    isLoading ? (
                                            [...Array(10)].map((x, index) => {
                                                return (
                                                    <TableRow key={index}>
                                                        {
                                                            [...Array(7)].map((_, i) => {
                                                                return (
                                                                    <TableCell key={i} className={"px-2 py-[10px] md:px-3"}>
                                                                        <Skeleton className={"rounded-md w-full h-7"}/>
                                                                    </TableCell>
                                                                )
                                                            })
                                                        }
                                                    </TableRow>
                                                )
                                            })
                                        )
                                        :
                                        messageList.length > 0 ?
                                            <Fragment>
                                                {
                                                    messageList.map((x, i) => {
                                                        const sender = allStatusAndTypes?.members.find((y) => y.userId == x.from);
                                                        return (
                                                            <TableRow key={i}>
                                                                <TableCell
                                                                    className={"px-2 py-[10px] md:px-3 font-normal max-w-[270px] cursor-pointer truncate text-ellipsis overflow-hidden whitespace-nowrap"}
                                                                    onClick={() => handleCreateUpdate(x.id, x.type)}>{x.title}</TableCell>
                                                                <TableCell className={"px-2 py-[10px] md:px-3"}>
                                                                    <Select value={x.status}
                                                                            onValueChange={(value) => handleStatusChange(x, value)}>
                                                                        <SelectTrigger className="w-[135px] h-7">
                                                                            <SelectValue
                                                                                placeholder={x.postStatus ? status.find(s => s.value == x.status)?.name : "Publish"}/>
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectGroup>
                                                                                {
                                                                                    (x.status === 2 ? status2 : status || []).map((x, i) => {
                                                                                        return (
                                                                                            <Fragment key={i}>
                                                                                                <SelectItem
                                                                                                    value={x.value}
                                                                                                    disabled={x.value === 2}>
                                                                                                    <div
                                                                                                        className={"flex items-center gap-2"}>
                                                                                                        {x.fillColor &&
                                                                                                        <Circle
                                                                                                            fill={x.fillColor}
                                                                                                            stroke={x.strokeColor}
                                                                                                            className={`${theme === "dark" ? "" : "text-muted-foreground"} w-2 h-2`}/>}
                                                                                                        {x.name}
                                                                                                    </div>
                                                                                                </SelectItem>
                                                                                            </Fragment>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </SelectGroup>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </TableCell>
                                                                <TableCell className={`px-2 py-[10px] md:px-3`}>
                                                                    <div
                                                                        className={"flex items-center gap-2 justify-center"}>
                                                                        {sender ? (
                                                                            <Fragment>
                                                                                <Avatar className={"w-[20px] h-[20px]"}>
                                                                                    <AvatarImage
                                                                                        src={sender.profileImage}
                                                                                        alt={`${sender?.firstName} ${sender?.lastName}`}/>
                                                                                    <AvatarFallback>{sender?.firstName?.substring(0, 1)}</AvatarFallback>
                                                                                </Avatar>
                                                                                <p className={"font-normal"}>{`${sender?.firstName} ${sender?.lastName}`}</p>
                                                                            </Fragment>
                                                                        ) : (
                                                                            <p className={"font-normal"}>-</p>
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell
                                                                    className={`px-2 py-[10px] md:px-3 font-normal`}>
                                                                    <div
                                                                        className={"flex items-center gap-1"}>{typeIcon[x.type]}{typeNames[x.type] || "-"}</div>
                                                                </TableCell>
                                                                <TableCell
                                                                    className={`px-2 py-[10px] md:px-3 font-normal`}>
                                                                    {x?.createdAt ? moment.utc(x.createdAt).local().startOf('seconds').fromNow() : "-"}
                                                                </TableCell>
                                                                <TableCell
                                                                    className={"px-2 py-[10px] md:px-3 text-center"}>
                                                                    <Button
                                                                        className={"py-[6px] px-3 h-auto text-xs font-medium hover:bg-primary"}
                                                                        onClick={() => getCodeCopy(x.uuid)}>Get
                                                                        code</Button>
                                                                </TableCell>
                                                                <TableCell
                                                                    className={`px-2 py-[10px] md:px-3 text-center`}>
                                                                    <div className={"flex justify-between"}>
                                                                        <div className={"cursor-pointer"}
                                                                             onClick={() => navigate(`${baseUrl}/app-message/${x.type}/analytic/${x.id}`)}>
                                                                            <BarChart size={18}/>
                                                                        </div>
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger>
                                                                                <Ellipsis className={`font-normal`}
                                                                                          size={18}/>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent align={"end"}>
                                                                                <DropdownMenuItem
                                                                                    className={"cursor-pointer"}
                                                                                    onClick={() => handleCreateUpdate(x.id, x.type)}>Edit</DropdownMenuItem>
                                                                                <DropdownMenuItem
                                                                                    className={"cursor-pointer"}
                                                                                    onClick={() => openDeletePost(x.id)}>Delete</DropdownMenuItem>
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                }
                                            </Fragment>
                                            :
                                            <TableRow>
                                                <TableCell colSpan={7}>
                                                    <EmptyData/>
                                                </TableCell>
                                            </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </div>
                    {
                        messageList.length > 0 ?
                            <Pagination
                                pageNo={pageNo}
                                totalPages={totalPages}
                                isLoading={isLoading}
                                handlePaginationClick={handlePaginationClick}
                                stateLength={messageList.length}
                            /> : ""
                    }
                </Card>
                {
                    (isLoading || emptyContentBlock || messageList.length > 0) ? "" :
                        <EmptyDataContent data={EmptyInAppContent} onClose={() => setEmptyContentBlock(true)}/>
                }
            </div>
        </Fragment>
    )
};

export default InAppMessage;