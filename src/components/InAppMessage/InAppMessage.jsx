import React, {useState, useEffect, Fragment} from 'react';
import {Button} from "../ui/button";
import {BookCheck, Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Circle, ClipboardList, Ellipsis, Filter, Loader2, Plus, ScrollText, SquareMousePointer, User, Users, X} from "lucide-react";
import {Input} from "../ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../ui/command";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {Card, CardFooter} from "../ui/card";
import {useTheme} from "../theme-provider";
import {Skeleton} from "../ui/skeleton";
import {Checkbox} from "../ui/checkbox";
import {Badge} from "../ui/badge";
import {useNavigate} from "react-router-dom";
import {baseUrl, urlParams} from "../../utils/constent";
import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../ui/dialog";
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

const perPageLimit = 10;

const status = [
    {name: "Draft", value: 3, fillColor: "#CF1322", strokeColor: "#CF1322",},
    {name: "Live", value: 1, fillColor: "#CEF291", strokeColor: "#CEF291",},
    {name: "Paused", value: 4, fillColor: "#6392D9", strokeColor: "#6392D9",},
    {name: "Scheduled", value: 2, fillColor: "#63C8D9", strokeColor: "#63C8D9",},
];

const contentType = [
    {
        label: "Post",
        value: 1,
        icon:<ScrollText size={16}/>,
    },
    {
        label: "Survey",
        value: 2,
        icon:<ClipboardList size={16}/>,

    },
    {
        label: "Checklist",
        value: 3,
        icon:<BookCheck size={16}/>,
    },
    {
        label: "Banners",
        value: 4,
        icon:<SquareMousePointer size={16}/>,
    }
];

const filterType = [
    {
        label: "People",
        value: 1,
        icon:<Users  size={16}/>,
    },
    {
        label: "State",
        value: 2,
        icon:<ClipboardList size={16}/>,

    },
    {
        label: "Sender",
        value: 3,
        icon:<User  size={16}/>,
    },
    {
        label: "Date",
        value: 4,
        icon:<Calendar  size={16}/>,
    }
]


const initialState = {
    project_id: "2",
    title: "Shipped",
    type: 1, //1=post,2=banner,3=survey,4=checklist
    from: "",
    reply_to: "",
    bg_color: "",
    text_color: "",
    icon_color: "",
    btn_color: "",
    delay: "", //time in seconds
    start_at: "",
    end_at: "",
    position: "", //top/bottom
    alignment: "", //left/right
    is_close_button: "", //true/false
    question_type: "", //1=Net Promoter Score,2=Numeric Scale,3=Star rating scale,4=Emoji rating scale,5=Drop Down / List,6=Questions
    start_number: "",
    end_number: "",
    start_label: "",
    end_label: "",
    placeholder_text: "",
    options: [],
}

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

const InAppMessage = () => {
    const {theme} = useTheme();
    const [isLoading,setIsLoading]=useState(false);
    const [messageList,setMessageList]=useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [open,setOpen]=useState(false);
    const [openFilter,setOpenFilter]=useState(false);
    const [openFilterType, setOpenFilterType] = useState('');
    const [formData,setFormData]=useState(initialState);
    const [deleteId,setDeleteId] = useState(null);
    const [isLoadingDelete,setIsLoadingDelete] = useState(false);
    const navigate = useNavigate();
    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);

    useEffect(()=>{
        if(projectDetailsReducer.id){
            getAllInAppMessageList(pageNo, perPageLimit);
        }
    },[projectDetailsReducer.id, pageNo, allStatusAndTypes, perPageLimit])

    const getAllInAppMessageList = async () => {
        setIsLoading(true);
        const data = await  apiService.getAllInAppMessage({
            project_id: projectDetailsReducer.id,
            page: pageNo,
            limit: perPageLimit
        });
        if(data.status === 200) {
            setMessageList(data.data);
            setTotalRecord(data.total || 1);
            setIsLoading(false)
        }
        else{
            setIsLoading(false);
        }
    }

    const filterPosts = (event) => {
        setFormData({...formData,[event.name]:event.value})
    }

    const totalPages = Math.ceil(totalRecord / perPageLimit);
    console.log(totalRecord)

    const handlePaginationClick = async (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setIsLoading(true);
            setPageNo(newPage);
            setIsLoading(false);
        }
    };

    const handleStatusChange = () =>{

    }

    const removeBadge = (name) => {
        setFormData({...formData,[name]:""});
    }

    const handleCreateNew = (id, type) => {
        if(id == "type"){
            navigate(`${baseUrl}/in-app-message/${id}`);
        } else{
            navigate(`${baseUrl}/in-app-message/${type}/${id}`);
        }
    }

    const onDelete = async () => {
        setIsLoadingDelete(true);
        const clone = [...messageList];
        const deleteIndex = clone.findIndex((x)=> x.id === deleteId);
        const data = await apiService.deleteInAppMessage(deleteId);
        if (data.status === 200) {
            setDeleteId(null);
            clone.splice(deleteIndex,1);
            setMessageList(clone);
            setIsLoadingDelete(false);
            toast({
                description:data.message
            })
        } else {
            setIsLoadingDelete(false);
            toast({
                description:data.message
            })
        }
    }

    return (
        <Fragment>
            {
                deleteId &&
                <Fragment>
                    <Dialog open onOpenChange={()=> setDeleteId(null)}>
                        <DialogContent className="max-w-[350px] w-full sm:max-w-[525px] p-3 md:p-6 rounded-lg">
                            <DialogHeader className={"flex flex-row justify-between gap-2"}>
                                <div className={"flex flex-col gap-2"}>
                                    <DialogTitle className={"text-start"}>You really want delete this label?</DialogTitle>
                                    <DialogDescription className={"text-start"}>This action can't be undone.</DialogDescription>
                                </div>
                                <X size={16} className={"m-0 cursor-pointer"} onClick={() => setDeleteId(null)}/>
                            </DialogHeader>
                            <DialogFooter className={"flex-row justify-end space-x-2"}>
                                <Button variant={"outline hover:none"}
                                        className={"text-sm font-semibold border"}
                                        onClick={() => setDeleteId(null)}>Cancel</Button>
                                <Button
                                    variant={"hover:bg-destructive"}
                                    className={` ${theme === "dark" ? "text-card-foreground" : "text-card"} ${isLoadingDelete === true ? "py-2 px-6" : "py-2 px-6"} w-[76px] text-sm font-semibold bg-destructive`}
                                    onClick={onDelete}
                                >
                                    {isLoadingDelete ? <Loader2 size={16} className={"animate-spin"}/> : "Delete"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Fragment>
            }

            <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>
                <div className={""}>
                    <div className={"flex justify-between items-center"}>
                        <h4 className={"font-medium text-lg sm:text-2xl leading-8"}>In App Messages</h4>
                        <Button size="sm" onClick={()=>handleCreateNew("type")} className={"gap-2 font-semibold hover:bg-primary"}> <Plus size={20} strokeWidth={3}/>New Content</Button>
                    </div>
                    <div className={"flex justify-between pt-7"}>
                        <div className={"flex gap-4"}>
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="pl-4 pr-4 text-sm font-normal h-9"
                                value={formData.search}
                                onChange={(e)=>setFormData({...formData,search: e.target.value})}
                            />

                            <Popover open={openFilter}
                                     onOpenChange={() => {
                                         setOpenFilter(!openFilter);
                                         setOpenFilterType('');
                                     }}>
                                <PopoverTrigger asChild>
                                    <Button className={"h-9 p-0 w-[45px] flex justify-center"} size={"icon"}  variant="outline"><Filter fill="true" className='w-4 h-4' /></Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0" align={"end"}>
                                    <Command className="w-full">
                                        <CommandInput placeholder="Search filter..."/>
                                        <CommandList className="w-full">
                                            <CommandEmpty>No filter found.</CommandEmpty>
                                            {
                                                openFilterType === 'content_type' ?
                                                    <CommandGroup className={"w-full"}>
                                                        <CommandItem className={"p-0 flex gap-2 items-center cursor-pointer p-1"} onSelect={() => {setOpenFilterType('');}}>
                                                            <ChevronLeft className="mr-2 h-4 w-4"  />  <span className={"flex-1 w-full text-sm font-medium cursor-pointer flex gap-2 items-center"}>Back</span>
                                                        </CommandItem>
                                                        {
                                                            (contentType || []).map((x, i) => {
                                                                return (
                                                                    <CommandItem key={i} className={"p-0 w-full flex flex-row gap-1 items-center cursor-pointer"}>
                                                                        <div className={"flex"} onClick={(event)=>filterPosts({name:"content_type",value:x.value == formData.content_type ? "" :x.value })}>
                                                                            <Checkbox className={'m-2'} checked={x.value === formData.content_type} onClick={(event)=>filterPosts({name:"content_type",value:x.value == formData.content_type ? "" :x.value })} />
                                                                            <span onClick={(event)=>filterPosts({name:"content_type",value:x.value == formData.content_type ? "" :x.value })} className={`w-full font-medium flex items-center ${theme === "dark" ? "" : "text-muted-foreground"} hover:none`} onSelect={()=>setOpen(false)}>{x.icon} <span className={"ml-2"}>{x.label}</span></span>
                                                                        </div>
                                                                    </CommandItem>
                                                                )
                                                            })
                                                        }
                                                    </CommandGroup>
                                                    : openFilterType === 'add_filter' ?
                                                    <CommandGroup className={"w-full"}>
                                                        <CommandItem className={"p-0 flex gap-2 items-center cursor-pointer p-1"} onSelect={() => {setOpenFilterType('');}}>
                                                            <ChevronLeft className="mr-2 h-4 w-4"  />  <span className={"flex-1 w-full text-sm font-medium cursor-pointer flex gap-2 items-center"}>Back</span>
                                                        </CommandItem>
                                                        {
                                                            (filterType || []).map((x,i)=>{
                                                                return (
                                                                    <CommandItem key={i}  className={"p-0 w-full flex flex-row gap-1 items-center cursor-pointer"}>
                                                                        <div className={"flex"} onClick={(event)=>filterPosts({name:"add_filter",value:x.value == formData.add_filter ? "" :x.value })}>
                                                                            <Checkbox className={'m-2'} checked={x.value === formData.add_filter} onClick={(event)=>filterPosts({name:"add_filter",value:x.value == formData.add_filter ? "" :x.value })} />
                                                                            <span onClick={(event)=>filterPosts({name:"add_filter",value:x.value == formData.add_filter ? "" :x.value })} className={`w-full font-medium flex items-center ${theme === "dark" ? "" : "text-muted-foreground"} hover:none`} onSelect={()=>setOpen(false)}>{x.icon} <span className={"ml-2"}>{x.label}</span></span>
                                                                        </div>
                                                                    </CommandItem>
                                                                )
                                                            })
                                                        }

                                                    </CommandGroup>
                                                    :<CommandGroup>
                                                        <CommandItem onSelect={() => {setOpenFilterType('content_type');}}>
                                                            <span className={"text-sm font-medium cursor-pointer"}>Content Type</span>
                                                        </CommandItem>
                                                        <CommandItem onSelect={() => {setOpenFilterType('add_filter');}}>
                                                            <span className={"text-sm font-medium cursor-pointer"}>Add Filter</span>
                                                        </CommandItem>
                                                    </CommandGroup>
                                            }
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    {
                        (formData.add_filter || formData.content_type) && <div className={"flex flex-wrap gap-2 mt-6"}>
                            {
                                formData.add_filter &&
                                <Badge variant="outline" className="rounded p-0">
                                    <span className="px-3 py-1.5 border-r">{formData.add_filter == 1 ? "People" : formData.add_filter === 2 ? "State" : formData.add_filter === 3 ? "Sender" : formData.add_filter === 4 ? "Date" : ""}</span>
                                    <span className="w-7 h-7 flex items-center justify-center cursor-pointer" onClick={() => removeBadge("add_filter")}><X className='w-4 h-4'/></span>
                                </Badge>
                            }

                            {
                                formData.content_type &&
                                <Badge variant="outline" className="rounded p-0">
                                    <span className="px-3 py-1.5 border-r">{formData.content_type === 1 ? "Post" : formData.content_type === 2 ? "Survey": formData.content_type === 3 ? "Checklist" : formData.content_type === 4 ? "Banners" : ""}</span>
                                    <span className="w-7 h-7 flex items-center justify-center cursor-pointer" onClick={() => removeBadge("content_type")}><X className='w-4 h-4'/></span>
                                </Badge>
                            }
                        </div>
                    }
                    <Card className={"mt-8"}>
                        <div className={"grid grid-cols-1 overflow-auto whitespace-nowrap"}>
                            <Table>
                                <TableHeader className={`${theme === "dark" ? "" : "bg-muted"}`}>
                                    <TableRow>
                                        {
                                            ["Title","State","Sender","Content type","Created at","Action"].map((x,i)=>{
                                                return(
                                                    <TableHead  className={`px-2 py-[10px] md:px-3 font-semibold ${i >= 5 ? 'text-center' : ''}`} key={i}>{x}</TableHead>
                                                )
                                            })
                                        }
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        isLoading ? (
                                                [...Array(10)].map((x,index)=>{
                                                    return(
                                                        <TableRow key={index}>
                                                            {
                                                                [...Array(6)].map((_, i) => {
                                                                    return (
                                                                        <TableCell key={i} className={"max-w-[373px] px-2 py-[10px] md:px-3"}>
                                                                            <Skeleton className={"rounded-md  w-full h-7"}/>
                                                                        </TableCell>
                                                                    )
                                                                })
                                                            }
                                                        </TableRow>
                                                    )
                                                })
                                            )
                                            :
                                            messageList.length >  0 ?
                                                <Fragment>
                                                    {
                                                        messageList.map((x,i)=>{
                                                            const sender = allStatusAndTypes?.members.find((y)=> y.user_id == x.from);
                                                            return(
                                                                <TableRow key={x.id}>
                                                                    <TableCell className={"px-2 py-[10px] md:px-3 font-medium cursor-pointer"} onClick={()=>handleCreateNew(x.id, x.type)}>{x.title}</TableCell>
                                                                    <TableCell className={"px-2 py-[10px] md:px-3"}>
                                                                        <Select value={x.status}
                                                                                onValueChange={(value) => handleStatusChange(x, value)}>
                                                                            <SelectTrigger className="w-[135px] h-7">
                                                                                <SelectValue placeholder="Publish"/>
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectGroup>
                                                                                    {
                                                                                        (status || []).map((x, i) => {
                                                                                            return (
                                                                                                <Fragment key={i}>
                                                                                                    <SelectItem value={x.value}>
                                                                                                        <div
                                                                                                            className={"flex items-center gap-2"}>
                                                                                                            {x.fillColor && <Circle fill={x.fillColor}
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
                                                                    {/*<TableCell className={`flex items-center mt-1 px-2 py-[10px] md:px-3 flex gap-2`}>*/}
                                                                    {/*    <Avatar className={"w-[20px] h-[20px] "}>*/}
                                                                    {/*        {*/}
                                                                    {/*            sender?.user_photo ? <AvatarImage src={sender?.user_photo} alt="@shadcn"/>*/}
                                                                    {/*                :*/}
                                                                    {/*                <AvatarFallback>{sender && sender.user_first_name && sender.user_first_name.substring(0, 1)}</AvatarFallback>*/}
                                                                    {/*        }*/}
                                                                    {/*    </Avatar>*/}
                                                                    {/*    <p className={"font-medium"}>{sender && sender?.user_first_name}</p>*/}
                                                                    {/*</TableCell>*/}
                                                                    <TableCell className={`flex items-center mt-1 px-2 py-[10px] md:px-3 gap-2 ${sender ? sender : "justify-center"}`}>
                                                                        {sender ? (
                                                                            <>
                                                                                <Avatar className={"w-[20px] h-[20px]"}>
                                                                                    {sender.user_photo ? (
                                                                                        <AvatarImage src={sender.user_photo} alt="@shadcn" />
                                                                                    ) : (
                                                                                        <AvatarFallback>{sender.user_first_name.substring(0, 1)}</AvatarFallback>
                                                                                    )}
                                                                                </Avatar>
                                                                                <p className={"font-medium"}>{sender.user_first_name}</p>
                                                                            </>
                                                                        ) : (
                                                                            <p className={"font-medium"}>-</p>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 font-medium`}>
                                                                        <div className={"flex items-center gap-1"}>{typeIcon[x.type]}{typeNames[x.type] || "-"}</div>
                                                                    </TableCell>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 font-medium`}>
                                                                        {x?.created_at ? moment.utc(x.created_at).local().startOf('seconds').fromNow() : "-"}
                                                                    </TableCell>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 text-center`}>
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger>
                                                                                <Ellipsis className={`font-medium`} size={18}/>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent align={"end"}>
                                                                                <DropdownMenuItem onClick={()=>handleCreateNew(x.id, x.type)}>Edit</DropdownMenuItem>
                                                                                <DropdownMenuItem onClick={()=>setDeleteId(x.id)}>Delete</DropdownMenuItem>
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })
                                                    }
                                                </Fragment>
                                                :
                                                <TableRow>
                                                    <TableCell colSpan={6}>
                                                        <EmptyData/>
                                                    </TableCell>
                                                </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </div>
                        {
                            messageList.length > 0 ?
                                <CardFooter className={`p-0 ${theme === "dark" ? "border-t" : ""}`}>
                                    <div
                                        className={`w-full ${theme === "dark" ? "" : "bg-muted"} rounded-b-lg rounded-t-none flex justify-end p-2 md:px-3 md:py-[10px]`}>
                                        <div className={"w-full flex gap-2 items-center justify-between sm:justify-end"}>
                                            <div>
                                                <h5 className={"text-sm font-semibold"}>Page {messageList.length <= 0 ? 0 :pageNo} of {totalPages}</h5>
                                            </div>
                                            <div className={"flex flex-row gap-2 items-center"}>
                                                <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}
                                                        onClick={() => handlePaginationClick(1)}
                                                        disabled={pageNo === 1 || isLoading}>
                                                    <ChevronsLeft
                                                        className={pageNo === 1 || isLoading ? "stroke-muted-foreground" : "stroke-primary"} />
                                                </Button>
                                                <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}
                                                        onClick={() => handlePaginationClick(pageNo - 1)}
                                                        disabled={pageNo === 1 || isLoading}>
                                                    <ChevronLeft
                                                        className={pageNo === 1 || isLoading ? "stroke-muted-foreground" : "stroke-primary"} />
                                                </Button>
                                                <Button variant={"outline"} className={" h-[30px] w-[30px] p-1.5"}
                                                        onClick={() => handlePaginationClick(pageNo + 1)}
                                                        disabled={pageNo === totalPages || isLoading || messageList.length <= 0}>
                                                    <ChevronRight
                                                        className={pageNo === totalPages || isLoading || messageList.length <= 0 ? "stroke-muted-foreground" : "stroke-primary"} />
                                                </Button>
                                                <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}
                                                        onClick={() => handlePaginationClick(totalPages)}
                                                        disabled={pageNo === totalPages || isLoading || messageList.length <= 0}>
                                                    <ChevronsRight
                                                        className={pageNo === totalPages || isLoading || messageList.length <= 0 ? "stroke-muted-foreground" : "stroke-primary"} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardFooter> : ""
                        }
                    </Card>
                </div>
            </div>
        </Fragment>
    )
};

export default InAppMessage;