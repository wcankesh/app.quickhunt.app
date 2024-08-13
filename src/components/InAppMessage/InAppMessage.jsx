import React, {useState, useEffect, Fragment} from 'react';
import {Button} from "../ui/button";
import {
    BookCheck, Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
    Circle,
    ClipboardList,
    Ellipsis, Filter,
    Plus,
    ScrollText,
    SquareMousePointer, User, Users, X
} from "lucide-react";
import {Input} from "../ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../ui/command";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {Card, CardFooter} from "../ui/card";
import {useTheme} from "../theme-provider";
import {Skeleton} from "../ui/skeleton";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import moment from "moment";
import {Separator} from "../ui/separator";
import {Checkbox} from "../ui/checkbox";
import {Badge} from "../ui/badge";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../utils/constent";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../ui/dropdown-menu";
import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../ui/dialog";

const dummyTable = {
    data: [{
        title: "Untitled",
        state: 1,
        sender: "Testingapp",
        content_type: 1,
        seen: 0,
        created_at: "2024-06-21T04:35:37.000000Z",
        live_at: "",
        avatar:"https://avatars.githubusercontent.com/u/124599?v=4&size=40",
    },
        {
            title: "Untitled",
            state: 2,
            sender: "Testingapp",
            content_type: 2,
            seen: 0,
            created_at: "2024-06-21T04:35:37.000000Z",
            live_at: "",
            avatar:"https://avatars.githubusercontent.com/u/124599?v=4&size=40",
        },
        {
            title: "Untitled",
            state: 3,
            sender: "Testingapp",
            content_type: 3,
            seen: 0,
            created_at: "2024-06-21T04:35:37.000000Z",
            live_at: "",
            avatar:"https://avatars.githubusercontent.com/u/124599?v=4&size=40",
        },
        {
            title: "Untitled",
            state: 4,
            sender: "Testingapp",
            content_type: 4,
            seen: 0,
            created_at: "2024-06-21T04:35:37.000000Z",
            live_at: "",
            avatar:"https://avatars.githubusercontent.com/u/124599?v=4&size=40",
        }]
};

const perPageLimit = 10;

const status = [
    {name: "Any", value: 0, fillColor: "", strokeColor: "",},
    {name: "Draft", value: 1, fillColor: "#CF1322", strokeColor: "#CF1322",},
    {name: "Live", value: 2, fillColor: "#CEF291", strokeColor: "#CEF291",},
    {name: "Paused", value: 3, fillColor: "#6392D9", strokeColor: "#6392D9",},
    {name: "Scheduled", value: 4, fillColor: "#63C8D9", strokeColor: "#63C8D9",},
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
    content_type:"",
    add_filter:"",
    search:""
}

const InAppMessage = () => {
    const {theme} = useTheme();
    const [isLoading,setIsLoading]=useState(false);
    const [messageList,setMessageList]=useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [open,setOpen]=useState(false);
    const [openFilter,setOpenFilter]=useState(false);
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [openFilterType, setOpenFilterType] = useState('');
    const [formData,setFormData]=useState(initialState);
    const [openDelete, setOpenDelete] = useState(false);
    const navigate = useNavigate();

    const filterPosts = (event) => {
        setFormData({...formData,[event.name]:event.value})
    }

    const totalPages = Math.ceil(totalRecord / perPageLimit);

    const handlePaginationClick = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPageNo(newPage);
        }
    };

    useEffect(()=>{
        setMessageList(dummyTable.data);
    },[]);

    const handleStatusChange = () =>{

    }

    const removeBadge = (name) => {
        setFormData({...formData,[name]:""});
    }

    return (
        <Fragment>
            {
                openDelete &&
                <Fragment>
                    <Dialog open onOpenChange={""}>
                        <DialogContent className="max-w-[350px] w-full sm:max-w-[525px] p-3 md:p-6 rounded-lg">
                            <DialogHeader className={"flex flex-row justify-between gap-2"}>
                                <div className={"flex flex-col gap-2"}>
                                    <DialogTitle>You really want delete this announcement?</DialogTitle>
                                    <DialogDescription>This action can't be undone.</DialogDescription>
                                </div>
                                <X size={16} className={"m-0 cursor-pointer"}/>
                            </DialogHeader>
                            <DialogFooter className={"flex-row justify-end space-x-2"}>
                                <Button variant={"outline hover:none"}
                                        className={"text-sm font-semibold border"}
                                        onClick={() => setOpenDelete(false)}>Cancel
                                    </Button>
                                <Button
                                    variant={"hover:bg-destructive"}
                                    className={` ${theme === "dark" ? "text-card-foreground" : "text-card"} ${isLoading === true ? "py-2 px-6" : "py-2 px-6"} w-[76px] text-sm font-semibold bg-destructive`}
                                    // onClick={deleteParticularRow}
                                >
                                    {isLoading ? <Loader2 size={16} className={"animate-spin"}/> : "Delete"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Fragment>
            }
            <div className={"pt-8 container xl:max-w-[1574px]  lg:max-w-[992px]  md:max-w-[768px] sm:max-w-[639px] px-4"}>
               <div className={""}>
                    <div className={"flex justify-between items-center"}>
                        <h4 className={"font-medium text-lg sm:text-2xl leading-8"}>In App Messages</h4>
                        <Button onClick={()=> {
                            setSheetOpen(true);
                            navigate(`${baseUrl}/in-app-message/new`);
                        }} className={"hover:bg-violet-600"}> <Plus className={"mr-4"} />New Content</Button>
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
                           <Table className={""}>
                                <TableHeader>
                                    <TableRow className={""}>
                                        {
                                            ["Title","State","Sender","Content type","Seen","Created at","Live at",""].map((x,i)=>{
                                                return(
                                                    <TableHead  className={`text-base font-semibold py-5 ${i === 0 ? "md:pl-10 pl-4" : ""} ${theme === "dark"? "text-[]" : "bg-muted"} ${i == 0 ? "rounded-tl-lg" : i == 9 ? "rounded-tr-lg" : ""}`} key={i}>{x}</TableHead>
                                                )
                                            })
                                        }
                                    </TableRow>
                                </TableHeader>
                                    {
                                        isLoading ? <TableBody>
                                                {
                                                    [...Array(10)].map((_, index) => {
                                                        return (
                                                            <TableRow key={index}>
                                                                {
                                                                    [...Array(8)].map((_, i) => {
                                                                        return (
                                                                            <TableCell key={i} className={"px-2"}>
                                                                                <Skeleton className={"rounded-md  w-full h-[24px]"}/>
                                                                            </TableCell>
                                                                        )
                                                                    })
                                                                }
                                                            </TableRow>
                                                        )
                                                    })
                                                }
                                            </TableBody>
                                        :
                                        <TableBody>
                                            {
                                                (messageList || []).map((x,i)=>{
                                                    return(
                                                        <TableRow key={i}>
                                                            <TableCell className={`md:pl-10 pl-4 font-medium ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.title}</TableCell>
                                                            <TableCell>
                                                                <Select value={x.state}
                                                                        onValueChange={(value) => handleStatusChange(x, value)}>
                                                                    <SelectTrigger className="w-[135px] h-7">
                                                                        <SelectValue placeholder="Publish"/>
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectGroup>
                                                                            {
                                                                                (   status || []).map((x, i) => {
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
                                                            <TableCell className={`flex items-center mt-1`}>
                                                                <img className={"h-5 w-5 rounded-full mr-2"} src={x?.avatar} alt={"not_found"}/>
                                                                <p className={`font-medium ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.sender ? x.sender : "-"}</p>
                                                            </TableCell>
                                                            <TableCell className={`font-medium ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                {
                                                                    x.content_type === 1 ? <div className={"flex items-center gap-1"}><ScrollText  size={16}/>Post</div> : x.content_type === 2 ? <div className={"flex items-center gap-1"}><ClipboardList  size={16}/>Survey</div> : x.content_type === 3 ? <div className={"flex items-center gap-1"}><BookCheck size={16}/>Checklist</div> : x.content_type === 4 ? <div className={"flex items-center gap-1"}><SquareMousePointer size={16}/>Banners</div> : ""
                                                                }
                                                            </TableCell>
                                                            <TableCell className={`font-medium ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.seen}</TableCell>
                                                            <TableCell className={`font-medium ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                {x?.created_at ? moment.utc(x.created_at).local().startOf('seconds').fromNow() : "-"}
                                                            </TableCell>
                                                            <TableCell className={`font-medium ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.live_at ? x.live_at : "-"}</TableCell>
                                                            <TableCell className={`font-medium ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger>
                                                                        <Ellipsis className={`font-medium`} size={18}/>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align={"end"}>
                                                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                                                        <DropdownMenuItem>Delete</DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            }
                                        </TableBody>
                                    }
                           </Table>
                       </div>
                           <Separator/>
                           <CardFooter className={"p-0"}>
                               <div className={`w-full p-5 rounded-b-lg rounded-t-none flex justify-end px-8 py-4 md:px-16 md:py-15px ${theme === "dark"? "" : "bg-muted"}`}>
                                   <div className={"w-full flex gap-8 items-center justify-between sm:justify-end"}>
                                       <h5 className={"text-sm font-semibold"}>Page {pageNo} of 10</h5>
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
               </div>
            </div>
        </Fragment>
    )
};

export default InAppMessage;