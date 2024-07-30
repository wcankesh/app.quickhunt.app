import React, {useState, useEffect, Fragment} from 'react';
import {Button} from "../ui/button";
import {
    ArrowRight,
    BookCheck, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
    ChevronsUpDown,
    Circle,
    ClipboardList,
    Ellipsis, Loader2,
    Plus,
    ScrollText,
    SquareMousePointer, X
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
import {Sheet, SheetClose, SheetContent, SheetHeader, SheetOverlay, SheetTitle} from "../ui/sheet";
import {Label} from "../ui/label";
import PostSheet from "./PostSheet";
import SurveySheet from "./SurveySheet";
import BannerSheet from "./BannerSheet";
import CheckListSheet from "./CheckListSheet";

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
}

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
        value: 0,
        icon:<ScrollText size={16}/>,
    },
    {
        label: "Survey",
        value: 1,
        icon:<ClipboardList size={16}/>,

    },
    {
        label: "Checklist",
        value: 2,
        icon:<BookCheck size={16}/>,
    },
    {
        label: "Banners",
        value: 3,
        icon:<SquareMousePointer size={16}/>,
    }
];

const filterType = [
    {
        label: "People",
        value: 0,
        icon:<ScrollText size={16}/>,
    },
    {
        label: "State",
        value: 1,
        icon:<ClipboardList size={16}/>,

    },
    {
        label: "Sender",
        value: 2,
        icon:<BookCheck size={16}/>,
    },
    {
        label: "Date",
        value: 3,
        icon:<SquareMousePointer size={16}/>,
    }
]


const InAppMessage = () => {
    const {theme} = useTheme();
    const [isLoading,setIsLoading]=useState(false);
    const [messageList,setMessageList]=useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [open,setOpen]=useState(false);
    const [openFilter,setOpenFilter]=useState(false);
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [contentValue,setContentValue]=useState(null);

    const openSheet = () => setSheetOpen(true);

    const closeSheet = () => { setSheetOpen(false);};

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

    const contentClose = () =>{
        setContentValue(null)
    }
    const contentOpen = () =>{
        setContentValue(0)
    }

    const closeSheet123 = () => {
        setContentValue(null);
    }

    return (
        <div className={"pt-9  xl:container xl:max-w-[1590px] lg:container lg:max-w-[992px] md:container md:max-w-[768px] sm:container sm:max-w-[639px] m-0"}>
           <div className={"px-4"}>
                <div className={"flex justify-between items-center"}>
                    <h4 className={"font-medium text-lg sm:text-2xl leading-8"}>In App Messages</h4>
                    <Button onClick={()=> setSheetOpen(true)} className={"hover:bg-violet-600"}> <Plus className={"mr-4"} />New Customer</Button>
                </div>
               <div className={"flex justify-between pt-7"}>
                    <div className={"flex gap-4"}>
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="w-[352px] pl-4 pr-14 text-sm font-normal h-9"
                        />
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="min-w-[150px] md:w-[236px] justify-between bg-card h-9"
                                >
                                    Content Type
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[236px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search content type..."/>
                                    <CommandList>
                                        <CommandEmpty>No framework found.</CommandEmpty>
                                        <CommandGroup>
                                            {
                                                contentType.map((x)=>{
                                                    return(
                                                        <CommandItem className={`font-medium ${theme === "dark" ? "" : "text-muted-foreground"} hover:none`} onSelect={()=>setOpen(false)}>{x.icon} <span className={"ml-2"}>{x.label}</span></CommandItem>
                                                    )
                                                })
                                            }
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div>
                        <Popover open={openFilter} onOpenChange={setOpenFilter}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="min-w-[150px] md:w-[236px] justify-between bg-card h-9"
                                >
                                    Add Filter
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[236px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search filter..."/>
                                    <CommandList>
                                        <CommandEmpty>No framework found.</CommandEmpty>
                                        <CommandGroup>
                                            {
                                                filterType.map((x)=>{
                                                    return(
                                                        <CommandItem className={`font-medium ${theme === "dark" ? "" : "text-muted-foreground"} hover:none`} onSelect={()=>setOpen(false)}>{x.icon} <span className={"ml-2"}>{x.label}</span></CommandItem>
                                                    )
                                                })
                                            }
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
               </div>
               <Card className={"mt-8"}>
                   <Table className={""}>
                        <TableHeader>
                            <TableRow className={""}>
                                {
                                    ["Title","State","Sender","Content type","Seen","Created at","Live at",""].map((x,i)=>{
                                        return(
                                            <TableHead  className={`text-base font-semibold py-5 ${i === 0 ? "pl-10" : ""} ${theme === "dark"? "text-[]" : "bg-muted"} ${i == 0 ? "rounded-tl-lg" : i == 9 ? "rounded-tr-lg" : ""}`} key={i}>{x}</TableHead>
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
                                                    <TableCell className={`pl-10 font-medium ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.title}</TableCell>
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
                                                        <Ellipsis className={"cursor-pointer"} size={20} />
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            }
                   </Table>
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
            {isSheetOpen && (
                <Sheet open={isSheetOpen} onOpenChange={isSheetOpen ? closeSheet : openSheet}>

                    <SheetOverlay className={"inset-0"} />
                    <SheetContent className={"sm:max-w-[660px] sm:overflow-auto p-0"}>
                        <SheetHeader className={"px-3 py-4 sm:px-8 sm:py-6 border-b flex"}>
                            <SheetTitle className={`text-sm md:text-xl font-medium flex justify-between items-center capitalize ${theme === "dark" ? "" : "text-muted-foreground"}`}>Start from scratch
                                <Button className={`h-5 w-5 p-0 ${theme === "dark" ? "" : "text-muted-foreground"}`} onClick={closeSheet}  variant={"ghost"}><X size={18} className={"h-5 w-5"}/></Button>
                            </SheetTitle>
                        </SheetHeader>
                        <div className="px-8 py-6 flex flex-wrap gap-6">
                            {
                                (contentType || []).map((x, index) => (
                                    <Card onClick={()=>setContentValue(x.value)} key={index} className="w-[calc(50%-12px)] cursor-pointer p-4 pr-8 flex justify-between items-center rounded-mds" style={{ boxShadow: '0px 4px 6px 0px rgba(0, 0, 0, 0.09)' }}>
                                        <div className={"flex items-center gap-3"}>
                                            <span className={"text-[#7C3AED]"}>{x.icon}</span>
                                            <span className={`text-base font-medium ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.label}</span>
                                        </div>
                                        <ArrowRight className={"text-[#7C3AED]"} size={20} />
                                    </Card>
                                ))
                            }
                        </div>

                    </SheetContent>
                </Sheet>
            )}
            {
                contentValue === 0 && <PostSheet isOpen={contentValue == 0 ? true :false} onClose={closeSheet123}/>
            }
            {
                contentValue === 1 && <SurveySheet isOpen={contentValue == 1 ? true :false} onClose={closeSheet123}/>
            }
            {
                contentValue === 2 && <CheckListSheet isOpen={contentValue == 2 ? true :false} onClose={closeSheet123}/>
            }
            {
                contentValue === 3 && <BannerSheet isOpen={contentValue == 3 ? true :false} onClose={closeSheet123}/>
            }
        </div>
    )
};

export default InAppMessage;