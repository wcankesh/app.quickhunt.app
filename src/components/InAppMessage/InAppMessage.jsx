import React, {useState, useEffect, Fragment} from 'react';
import {Button} from "../ui/button";
import {
    BarChart,
    BookCheck,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Circle,
    ClipboardList,
    Copy,
    Ellipsis,
    Filter,
    Loader2,
    Plus,
    ScrollText,
    SquareMousePointer,
    User,
    Users,
    X
} from "lucide-react";
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
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs";
import Pagination from "../Comman/Pagination";
import DeleteDialog from "../Comman/DeleteDialog";

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
    const navigate = useNavigate();
    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);

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
    const [openCopyCode, setOpenCopyCode] = useState(false);
    const [selectedId, setSelectedId] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [isCopyLoading, setCopyIsLoading] = useState(false);
    const [openDelete,setOpenDelete]=useState(false);

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

    const openDeleteWidget = (id) => {
        setDeleteId(id)
        setOpenDelete(true)
    }

    const onDelete = async () => {
        setIsLoadingDelete(true);
        debugger
        const data = await apiService.deleteInAppMessage(deleteId);
        const clone = [...messageList];
        const deleteIndex = clone.findIndex((x)=> x.id == deleteId);
        if (data.status === 200) {
            // setDeleteId(null);
            clone.splice(deleteIndex,1);
            setMessageList(clone);
            setIsLoadingDelete(false);
            toast({
                description:data.message
            })
        } else {
            setIsLoadingDelete(false);
            toast({
                description:data.message,
                variant: "destructive",
            })
        }
        setOpenDelete(false);
        setDeleteId(null);
    }

    const getCodeCopy = (id, type) => {
        setOpenCopyCode(!openCopyCode)
        setSelectedId(id)
        setSelectedType(type)
    }

    const handleCopyCode = (id) => {
        setCopyIsLoading(true)
        navigator.clipboard.writeText(id).then(() => {
            setCopyIsLoading(false)
            toast({description: "Copied to clipboard"})
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    const codeString = `
<script>
    window.quickhuntSettings = {
      name: "",
      email: "",
    };
</script>
<script>
    window.Quickhunt_In_App_Message_Config = window.Quickhunt_In_App_Message_Config || [];
    window.Quickhunt_In_App_Message_Config.push({ Quickhunt_In_App_Message_Key:  "${selectedId}"});
</script>
<script src="https://fw.quickhunt.app/widgetScript.js"></script>`;

    return (
        <Fragment>
            {/*{*/}
            {/*    openDelete &&*/}
            {/*    <Fragment>*/}
            {/*        <Dialog open onOpenChange={() => setOpenDelete(!openDelete)}>*/}
            {/*            <DialogContent className="max-w-[350px] w-full sm:max-w-[525px] p-3 md:p-6 rounded-lg">*/}
            {/*                <DialogHeader className={"flex flex-row justify-between gap-2"}>*/}
            {/*                    <div className={"flex flex-col gap-2"}>*/}
            {/*                        <DialogTitle className={"text-start font-medium"}>You really want delete this label?</DialogTitle>*/}
            {/*                        <DialogDescription className={"text-start"}>This action can't be undone.</DialogDescription>*/}
            {/*                    </div>*/}
            {/*                    <X size={16} className={"m-0 cursor-pointer"} onClick={() => setOpenDelete(false)}/>*/}
            {/*                </DialogHeader>*/}
            {/*                <DialogFooter className={"flex-row justify-end space-x-2"}>*/}
            {/*                    <Button variant={"outline hover:none"}*/}
            {/*                            className={"text-sm font-medium border"}*/}
            {/*                            onClick={() => setOpenDelete(false)}>Cancel</Button>*/}
            {/*                    <Button*/}
            {/*                        variant={"hover:bg-destructive"}*/}
            {/*                        className={` ${theme === "dark" ? "text-card-foreground" : "text-card"} w-[65px] text-sm font-medium bg-destructive`}*/}
            {/*                        onClick={() => onDelete(deleteId)}*/}
            {/*                    >*/}
            {/*                        {isLoadingDelete ? <Loader2 size={16} className={"animate-spin"}/> : "Delete"}*/}
            {/*                    </Button>*/}
            {/*                </DialogFooter>*/}
            {/*            </DialogContent>*/}
            {/*        </Dialog>*/}
            {/*    </Fragment>*/}
            {/*}*/}

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
                    <Dialog open onOpenChange={() => getCodeCopy("")}>
                        <DialogContent className="max-w-[350px] w-full sm:max-w-[580px] bg-white rounded-lg p-3 md:p-6">
                            <DialogHeader className={"flex flex-row justify-between gap-2"}>
                                <div className={"flex flex-col gap-2"}>
                                    <DialogTitle className={`text-left font-medium ${theme === "dark" ? "text-card" : ""}`}>In App Message</DialogTitle>
                                    <DialogDescription className={"text-left"}>Choose how you would like to embed your
                                        message.</DialogDescription>
                                </div>
                                <X size={16} className={`${theme === "dark" ? "text-card" : ""} m-0 cursor-pointer`}
                                   onClick={() => getCodeCopy("")}/>
                            </DialogHeader>
                            <div className={"space-y-2"}>
                                <h4 className={`${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} text-sm`}>
                                    Place the code below before the closing body tag on your site.
                                </h4>
                                <div>
                                    <div className={"relative px-6 rounded-md bg-black mb-2"}>
                                        <div className={"relative"}>
                                                <pre id="text"
                                                     className={"py-4 whitespace-pre overflow-x-auto scrollbars-none text-[10px] text-text-invert text-white max-w-[230px] w-full md:max-w-[450px]"}>
                                                      {codeString}
                                                  </pre>

                                            <Button
                                                variant={"ghost hover:none"}
                                                className={`${isCopyLoading === true ? "absolute top-0 right-0 px-0" : "absolute top-0 right-0 px-0"}`}
                                                onClick={() => handleCopyCode(codeString)}
                                            >
                                                {isCopyLoading ? <Loader2 size={16} className={"animate-spin"}
                                                                          color={"white"}/> :
                                                    <Copy size={16} color={"white"}/>}
                                            </Button>

                                        </div>
                                    </div>

                                    <p className={`${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} text-xs`}>Read
                                        the {" "}
                                        <Button variant={"ghost hover:none"}
                                                className={"p-0 h-auto text-xs text-primary font-medium"}>
                                            Setup Guide
                                        </Button>
                                        {" "}for more information or {" "}
                                        <Button
                                            variant={"ghost hover:none"}
                                            className={"p-0 h-auto text-xs text-primary font-medium"}
                                        >
                                            download the HTML example.
                                        </Button>
                                    </p>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant={"outline hover:none"}
                                        className={`text-sm font-medium border ${theme === "dark" ? "text-card" : "text-card-foreground"}`}
                                        onClick={() => getCodeCopy("")}>Cancel</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Fragment>
            }

            <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>
                <div className={""}>
                    <div className={"flex items-center justify-between flex-wrap gap-2"}>
                        <div className={"flex justify-between items-center w-full md:w-auto"}>
                            <h1 className="text-2xl font-normal flex-initial w-auto">In App Messages</h1>
                        </div>
                        <div className={"w-full lg:w-auto flex sm:flex-nowrap flex-wrap gap-2 items-center"}>
                            <div className={"flex gap-2 items-center w-full md:w-auto"}>
                                <div className={"w-full"}>
                                <Input
                                    type="search"
                                    placeholder="Search..."
                                    className="w-full pl-4 pr-14 text-sm font-normal h-9"
                                    value={formData.search}
                                    onChange={(e)=>setFormData({...formData,search: e.target.value})}
                                />
                                </div>
                                <div className={"flex items-center"}>
                                <Popover open={openFilter}
                                         onOpenChange={() => {
                                             setOpenFilter(!openFilter);
                                             setOpenFilterType('');
                                         }}
                                >
                                    <PopoverTrigger asChild>
                                        <Button className={"h-9 w-9"} size={"icon"} variant="outline"><Filter fill="true" className='w-4 -h4' /></Button>
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
                                                                <ChevronLeft className="mr-2 h-4 w-4"  />  <span className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"}>Back</span>
                                                            </CommandItem>
                                                            {
                                                                (contentType || []).map((x, i) => {
                                                                    return (
                                                                        <CommandItem key={i} className={"p-0 w-full flex flex-row gap-1 items-center cursor-pointer"}>
                                                                            <div className={"flex"} onClick={(event)=>filterPosts({name:"content_type",value:x.value == formData.content_type ? "" :x.value })}>
                                                                                <Checkbox className={'m-2'} checked={x.value === formData.content_type} onClick={(event)=>filterPosts({name:"content_type",value:x.value == formData.content_type ? "" :x.value })} />
                                                                                <span onClick={(event)=>filterPosts({name:"content_type",value:x.value == formData.content_type ? "" :x.value })} className={`w-full font-normal flex items-center ${theme === "dark" ? "" : "text-muted-foreground"} hover:none`} onSelect={()=>setOpen(false)}>{x.icon} <span className={"ml-2"}>{x.label}</span></span>
                                                                            </div>
                                                                        </CommandItem>
                                                                    )
                                                                })
                                                            }
                                                        </CommandGroup>
                                                        : openFilterType === 'add_filter' ?
                                                        <CommandGroup className={"w-full"}>
                                                            <CommandItem className={"p-0 flex gap-2 items-center cursor-pointer p-1"} onSelect={() => {setOpenFilterType('');}}>
                                                                <ChevronLeft className="mr-2 h-4 w-4"  />  <span className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"}>Back</span>
                                                            </CommandItem>
                                                            {
                                                                (filterType || []).map((x,i)=>{
                                                                    return (
                                                                        <CommandItem key={i}  className={"p-0 w-full flex flex-row gap-1 items-center cursor-pointer"}>
                                                                            <div className={"flex"} onClick={(event)=>filterPosts({name:"add_filter",value:x.value == formData.add_filter ? "" :x.value })}>
                                                                                <Checkbox className={'m-2'} checked={x.value === formData.add_filter} onClick={(event)=>filterPosts({name:"add_filter",value:x.value == formData.add_filter ? "" :x.value })} />
                                                                                <span onClick={(event)=>filterPosts({name:"add_filter",value:x.value == formData.add_filter ? "" :x.value })} className={`w-full font-normal flex items-center ${theme === "dark" ? "" : "text-muted-foreground"} hover:none`} onSelect={()=>setOpen(false)}>{x.icon} <span className={"ml-2"}>{x.label}</span></span>
                                                                            </div>
                                                                        </CommandItem>
                                                                    )
                                                                })
                                                            }

                                                        </CommandGroup>
                                                        :<CommandGroup>
                                                            <CommandItem onSelect={() => {setOpenFilterType('content_type');}}>
                                                                <span className={"text-sm font-normal cursor-pointer"}>Content Type</span>
                                                            </CommandItem>
                                                            <CommandItem onSelect={() => {setOpenFilterType('add_filter');}}>
                                                                <span className={"text-sm font-normal cursor-pointer"}>Add Filter</span>
                                                            </CommandItem>
                                                        </CommandGroup>
                                                }
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                </div>
                            </div>
                            <Button onClick={()=>handleCreateNew("type")} className={"gap-2 font-medium hover:bg-primary"}><Plus size={20} strokeWidth={3}/><span className={"text-xs md:text-sm font-medium"}>New Content</span></Button>
                        </div>
                    </div>

                    {
                        (formData.add_filter || formData.content_type) && <div className={"flex flex-wrap gap-2 mt-6"}>
                            {
                                formData.add_filter &&
                                <Badge variant="outline" className="rounded p-0 font-medium">
                                    <span className="px-3 py-1.5 border-r">{formData.add_filter == 1 ? "People" : formData.add_filter === 2 ? "State" : formData.add_filter === 3 ? "Sender" : formData.add_filter === 4 ? "Date" : ""}</span>
                                    <span className="w-7 h-7 flex items-center justify-center cursor-pointer" onClick={() => removeBadge("add_filter")}><X className='w-4 h-4'/></span>
                                </Badge>
                            }

                            {
                                formData.content_type &&
                                <Badge variant="outline" className="rounded p-0 font-medium">
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
                                            ["Title","State","Sender","Content type","Created at","", "Action"].map((x,i)=>{
                                                return(
                                                    <TableHead  className={`px-2 py-[10px] md:px-3 font-medium text-card-foreground ${i >= 5 ? 'text-center' : ''}`} key={i}>{x}</TableHead>
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
                                                                [...Array(7)].map((_, i) => {
                                                                    return (
                                                                        <TableCell key={i} className={"max-w-[373px] px-2 py-[10px] md:px-3"}>
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
                                            messageList.length >  0 ?
                                                <Fragment>
                                                    {
                                                        messageList.map((x,i)=>{
                                                            const sender = allStatusAndTypes?.members.find((y)=> y.user_id == x.from);
                                                            return(
                                                                <TableRow key={x.id}>
                                                                    <TableCell className={"px-2 py-[10px] md:px-3 font-normal max-w-[270px] cursor-pointer truncate text-ellipsis overflow-hidden whitespace-nowrap"} onClick={()=>handleCreateNew(x.id, x.type)}>{x.title}</TableCell>
                                                                    <TableCell className={"px-2 py-[10px] md:px-3"}>
                                                                        <Select value={x.status} onValueChange={(value) => handleStatusChange(x, value)}>
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
                                                                                <p className={"font-normal"}>{sender.user_first_name}</p>
                                                                            </>
                                                                        ) : (
                                                                            <p className={"font-normal"}>-</p>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 font-normal`}>
                                                                        <div className={"flex items-center gap-1"}>{typeIcon[x.type]}{typeNames[x.type] || "-"}</div>
                                                                    </TableCell>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 font-normal`}>
                                                                        {x?.created_at ? moment.utc(x.created_at).local().startOf('seconds').fromNow() : "-"}
                                                                    </TableCell>
                                                                    <TableCell className={"px-2 py-[10px] md:px-3"}>
                                                                        <Button
                                                                            className={"py-[6px] px-3 h-auto text-xs font-medium hover:bg-primary"}
                                                                            onClick={() => getCodeCopy(x.uuid)}>Get code</Button>
                                                                    </TableCell>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 text-center flex justify-between`}>
                                                                        <div className={"cursor-pointer"} onClick={() => navigate(`${baseUrl}/in-app-message/${x.type}/analytic/${x.id}`)}>
                                                                            <BarChart size={18}/>
                                                                        </div>
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger>
                                                                                <Ellipsis className={`font-normal`} size={18}/>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent align={"end"}>
                                                                                <DropdownMenuItem onClick={()=>handleCreateNew(x.id, x.type)}>Edit</DropdownMenuItem>
                                                                                <DropdownMenuItem onClick={()=>openDeleteWidget(x.id)}>Delete</DropdownMenuItem>
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
                </div>
            </div>
        </Fragment>
    )
};

export default InAppMessage;