import React, {useState, Fragment, useEffect} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {Badge} from "../ui/badge";
import {Button} from "../ui/button";
import {
    BarChart,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight, Circle,
    Ellipsis,
    Eye,
} from "lucide-react";
import {useTheme} from "../theme-provider"
import SidebarSheet from "./SidebarSheet";
import {Card, CardContent, CardFooter} from "../ui/card";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../ui/dropdown-menu";
import {Separator} from "../ui/separator";
import {Select, SelectItem, SelectGroup, SelectContent, SelectTrigger, SelectValue} from "../ui/select";
import moment from "moment";
import NoDataThumbnail from "../../img/Frame.png"
import CreateAnnouncementsLogSheet from "./CreateAnnouncementsLogSheet";
import {apiService} from "../../utils/constent";
import {Toaster} from "../ui/toaster";
import {toast} from "../ui/use-toast";

const status = [
    {name: "Public", value: 0, fillColor: "#389E0D", strokeColor: "#389E0D",},
    {name: "Draft", value: 1, fillColor: "#CF1322", strokeColor: "#CF1322",},
]

const dummyDetails ={
    data:[
        {
            title:"Welcome To Our Release Notes",
            description:"All great things around you were not built in a day, some took weeks, quite a few of them took months and a rare few even decades. As builders, our quest is to reach for that perfect product that solves your problems and adds value to your lives, and we too realise it will be a journey of minor and major improvements made day after day...",
            isNew:0,
            isImp:0,
            author:"testingapp",
            date:"17 Jun",
            msg:25,
            up:25,
            status:0,
            value:0,
        },
        {
            title:"Welcome To Our Release Notes",
            description:"All great things around you were not built in a day, some took weeks, quite a few of them took months and a rare few even decades. As builders, our quest is to reach for that perfect product that solves your problems and adds value to your lives, and we too realise it will be a journey of minor and major improvements made day after day...",
            isNew:0,
            isImp:1,
            author:"testingapp",
            date:"17 Jun",
            msg:25,
            up:25,
            status:0,
            value:1,

        },
        {
            title:"Welcome To Our Release Notes",
            description:"All great things around you were not built in a day, some took weeks, quite a few of them took months and a rare few even decades. As builders, our quest is to reach for that perfect product that solves your problems and adds value to your lives, and we too realise it will be a journey of minor and major improvements made day after day...",
            isNew:0,
            isImp:0,
            author:"testingapp",
            date:"17 Jun",
            msg:25,
            up:25,
            status:1,
            value:1,
        },

    ],
    page:1,
    preview:0,
}


const AnnouncementsTable = ({data}) => {
    const [announcementData,setAnnouncementData]=useState(data);
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [isCreateSheetOpen,setIsCreateSheetOpen]=useState(false);
    const [isViewAnalytics, setIsViewAnalytics] = useState(false);
    const [isEditAnalysis,setIsEditAnalysis] =useState(false);
    const [editTitle,setEditTitle]=useState("");
    const [selectedViewAnalyticsRecord, setSelectedViewAnalyticsRecord] = useState({id: ""});

    useEffect(()=>{
        setAnnouncementData(data);
    },[data])

    const openSheet = (x) => {
        setSheetOpen(true);
        setSelectedViewAnalyticsRecord(x);
        setIsViewAnalytics(true);
    };
    const closeSheet = () => {
        setSelectedViewAnalyticsRecord({id: ''});
        setSheetOpen(false);
        setIsViewAnalytics(false);
    };
    const { theme }= useTheme();

    const rgb2hex = (rgb, alpha) => {
        if(rgb){
            let r = parseInt(rgb.slice(1, 3), 16),
                g = parseInt(rgb.slice(3, 5), 16),
                b = parseInt(rgb.slice(5, 7), 16);
            if (alpha) {
                return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
            } else {
                return "rgb(" + r + ", " + g + ", " + b + ")";
            }
        }
    }

    const handleStatusChange = async (object, value) => {
        setAnnouncementData(announcementData.map(x => x.id === object.id ? { ...x, post_save_as_draft: value } : x));
        const payload = {...object,post_save_as_draft:value}
        const data = await apiService.updatePosts(payload,object.id);
        if(data.status === 200){
            toast({
                title: data.success,
            });
        } else {
            toast({
                title: data.success,
                variant: "destructive",
            });
        }
    };

    const onEdit =(title)=>{
        setIsCreateSheetOpen(true);
        setIsEditAnalysis(true);
        setEditTitle(title);
    };

    const closeCreateSheet = () =>{
        setIsCreateSheetOpen(false);
        setIsEditAnalysis(false);
    }

    const shareFeedback = (slug)=>{
        window.open(`/${slug}`,'_blank')
    }


    return (
        <div className={"mt-9"}>
            <Toaster/>
            {isViewAnalytics && <SidebarSheet selectedViewAnalyticsRecord={selectedViewAnalyticsRecord} isOpen={isSheetOpen} onOpen={openSheet} onClose={closeSheet}/>}
            {isEditAnalysis && <CreateAnnouncementsLogSheet editTitle={editTitle} isOpen={isCreateSheetOpen} onOpen={onEdit} onClose={closeCreateSheet}/>}
                <Card>
                    <CardContent className={"p-0 rounded-md"}>
                        <Table className={""}>
                            <TableHeader className={"py-8 px-5"}>
                                <TableRow className={""}>
                                    <TableHead className={`text-base font-semibold py-5 rounded-tl-sm ${theme === "dark"? "text-[]" : "bg-muted"}`}>Title</TableHead>
                                    <TableHead className={`text-base font-semibold py-5 ${theme === "dark"? "text-[]" : "bg-muted"}`}>Last Updated</TableHead>
                                    <TableHead className={`text-base font-semibold py-5 ${theme === "dark"? "text-[]" : "bg-muted"}`}>Published At</TableHead>
                                    <TableHead  className={`text-base font-semibold py-5 ${theme === "dark"? "text-[]" : "bg-muted"}`}>Status</TableHead>
                                    <TableHead  className={`text-base font-semibold py-5 ${theme === "dark"? "" : "bg-muted"}`}></TableHead>
                                    <TableHead  className={`text-base font-semibold py-5 ${theme === "dark"? "" : "bg-muted"}`}></TableHead>
                                    <TableHead  className={`text-base font-semibold py-5 rounded-tr-sm ${theme === "dark"? "" : "bg-muted"}`}></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    (announcementData || []).map((x,index)=>{
                                        return(
                                            <TableRow key={x?.id} className={"font-medium"}>
                                                <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}><span className={"mr-4"}> {x?.post_title}</span>
                                                    <Badge variant={"outline"} className={"h-[20px] py-0 px-2 text-xs rounded-[5px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.09)] font-medium text-blue-500 border-blue-500"}>New</Badge>
                                                </TableCell>
                                                <TableCell className={`${theme === "dark" ? "" : "text-muted-foreground"}`}>{x?.post_modified_date ? moment.utc(x.post_modified_date).local().startOf('seconds').fromNow() : "-"}</TableCell>
                                                <TableCell className={`${theme === "dark" ? "" : "text-muted-foreground"}`}>{x?.post_published_at ? moment.utc(x.post_published_at).local().startOf('seconds').fromNow() : "-"}</TableCell>
                                                <TableCell>
                                                    <Select value={x.post_save_as_draft} onValueChange={(value) => handleStatusChange(x,value)}>
                                                        <SelectTrigger className="w-[111px] h-7">
                                                            <SelectValue placeholder="Publish" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {
                                                                    (   status || []).map((x, i) => {
                                                                        return (
                                                                            <Fragment key={i}>
                                                                                <SelectItem value={x.value}>
                                                                                    <div className={"flex items-center gap-2"}>
                                                                                        <Circle fill={x.fillColor} stroke={x.strokeColor} className={`${theme === "dark" ? "" : "text-muted-foreground"} w-2 h-2`}/>
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
                                                <TableCell>
                                                    <Button  variant={"ghost"} onClick={()=> shareFeedback (x.post_slug_url)}><Eye size={18} className={`${theme === "dark" ? "" : "text-muted-foreground"}`} /></Button>
                                                </TableCell>
                                                <TableCell>
                                                    <Button onClick={ ()=> openSheet(x)} variant={"ghost"} ><BarChart size={18} className={`${theme === "dark" ? "" : "text-muted-foreground"}`} /></Button>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger><Button variant={"ghost"} ><Ellipsis className={`${theme === "dark" ? "" : "text-muted-foreground"}`} size={18} /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem onClick={()=>onEdit(x.post_slug_url)}>Edit</DropdownMenuItem>
                                                            <DropdownMenuItem>Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </CardContent>
                    {announcementData.length > 0 &&  <Separator/>}
                    {announcementData?.length > 0 ? <CardFooter className={"p-0"}>
                        <div
                            className={`w-full p-5 ${theme === "dark" ? "" : "bg-muted"} rounded-b-lg rounded-t-none flex justify-end pe-16 py-15px`}>
                            <div className={"flex flex-row gap-8 items-center"}>
                                <div>
                                    <h5 className={"text-sm font-semibold"}>Page {dummyDetails.page} of 10</h5>
                                </div>
                                <div className={"flex flex-row gap-2 items-center"}>
                                    <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5 hover:none"}>
                                        <ChevronsLeft
                                            className={`${dummyDetails.preview === 0 ? "stroke-slate-300" : "stroke-primary"}`}/>
                                    </Button>
                                    <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5 hover:none"}>
                                        <ChevronLeft
                                            className={`${dummyDetails.preview === 0 ? "stroke-slate-300" : "stroke-primary"}`}/>
                                    </Button>
                                    <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5 hover:none"}>
                                        <ChevronRight className={"stroke-primary"}/>
                                    </Button>
                                    <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5 hover:none"}>
                                        <ChevronsRight disabled={""} className={"stroke-primary"}/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardFooter> :  <div className={"flex flex-row justify-center py-[45px]"}>
                        <div className={"flex flex-col items-center gap-2"}>
                            <img src={NoDataThumbnail} className={"flex items-center"}/>
                            <h5 className={`text-center text-2xl font-medium leading-8 ${theme === "dark" ? "" : "text-[#A4BBDB]"}`}>No Data</h5>
                        </div>
                    </div>}
                </Card>
        </div>
    );
};

export default AnnouncementsTable;