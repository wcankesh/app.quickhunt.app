import React, {useState, Fragment, useEffect} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {Badge} from "../ui/badge";
import {Button} from "../ui/button";
import {
    BarChart,
    Circle,
    Ellipsis,
    Eye,
} from "lucide-react";
import {useTheme} from "../theme-provider"
import SidebarSheet from "./SidebarSheet";
import { CardContent} from "../ui/card";
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
import {Skeleton} from "../ui/skeleton";

const status = [
    {name: "Publish", value: 0, fillColor: "#389E0D", strokeColor: "#389E0D",},
    {name: "Draft", value: 1, fillColor: "#CF1322", strokeColor: "#CF1322",},
]

const AnnouncementsTable = ({data,isLoading ,callBack}) => {
    const [announcementData,setAnnouncementData]=useState(data);
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [isCreateSheetOpen,setIsCreateSheetOpen]=useState(false);
    const [isViewAnalytics, setIsViewAnalytics] = useState(false);
    const [isEditAnalysis,setIsEditAnalysis] =useState(false);
    const [editTitle,setEditTitle]=useState("");
    const [selectedViewAnalyticsRecord, setSelectedViewAnalyticsRecord] = useState({id: ""});
    const { theme }= useTheme();

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

    const handleStatusChange = async (object, value) => {
        setAnnouncementData(announcementData.map(x => x.id === object.id ? { ...x, post_save_as_draft: value } : x));
        const payload = {...object,post_save_as_draft:value}
        const data = await apiService.updatePosts(payload,object.id);
        if(data.status === 200){
            callBack();
            toast({
                title: "Status updated successfully",
            });
        } else {
            toast({
                title: "Uh uh! something went wrong.",
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
        <div className={""}>
            <Toaster/>
            {isViewAnalytics && <SidebarSheet selectedViewAnalyticsRecord={selectedViewAnalyticsRecord} isOpen={isSheetOpen} onOpen={openSheet} onClose={closeSheet}/>}
            {isEditAnalysis && <CreateAnnouncementsLogSheet editTitle={editTitle} isOpen={isCreateSheetOpen} onOpen={onEdit} onClose={closeCreateSheet}/>}
                <div>
                    <CardContent className={"p-0 rounded-md"}>
                        {isLoading ? <Table>
                                        <TableHeader className={"py-8 px-5"}>
                                            <TableRow className={""}>
                                                <TableHead
                                                    className={`text-base font-semibold py-5 rounded-tl-sm ${theme === "dark" ? "text-[]" : "bg-muted"}`}>Title</TableHead>
                                                <TableHead
                                                    className={`text-base font-semibold py-5 ${theme === "dark" ? "text-[]" : "bg-muted"}`}>Last
                                                    Updated</TableHead>
                                                <TableHead
                                                    className={`text-base font-semibold py-5 ${theme === "dark" ? "text-[]" : "bg-muted"}`}>Published
                                                    At</TableHead>
                                                <TableHead
                                                    className={`text-base font-semibold py-5 ${theme === "dark" ? "text-[]" : "bg-muted"}`}>Status</TableHead>
                                                <TableHead
                                                    className={`text-base font-semibold py-5 ${theme === "dark" ? "" : "bg-muted"}`}></TableHead>
                                                <TableHead
                                                    className={`text-base font-semibold py-5 ${theme === "dark" ? "" : "bg-muted"}`}></TableHead>
                                                <TableHead
                                                    className={`text-base font-semibold py-5 rounded-tr-sm ${theme === "dark" ? "" : "bg-muted"}`}></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {
                                                [...Array(4)].map((_,index)=>{
                                                    return(
                                                        <TableRow key={index}>
                                                            <TableCell className={"max-w-[373px]"}>
                                                                <Skeleton className={"rounded-md  w-full h-[40px]"}/>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Skeleton className={"rounded-md  w-full h-[40px]"}/>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Skeleton className={"rounded-md  w-full h-[40px]"}/>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Skeleton className={"rounded-md  w-full h-[40px]"}/>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Skeleton className={"rounded-md  w-full h-[40px]"}/>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Skeleton className={"rounded-md  w-full h-[40px]"}/>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Skeleton className={"rounded-md  w-full h-[40px]"}/>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            }
                                        </TableBody>
                                     </Table>
                                    : <Table className={""}>
                                    <TableHeader className={"py-8 px-5"}>
                                        <TableRow className={""}>
                                            <TableHead
                                                className={`text-base font-semibold py-5 rounded-tl-sm ${theme === "dark" ? "text-[]" : "bg-muted"}`}>Title</TableHead>
                                            <TableHead
                                                className={`text-base font-semibold py-5 ${theme === "dark" ? "text-[]" : "bg-muted"}`}>Last
                                                Updated</TableHead>
                                            <TableHead
                                                className={`text-base font-semibold py-5 ${theme === "dark" ? "text-[]" : "bg-muted"}`}>Published
                                                At</TableHead>
                                            <TableHead
                                                className={`text-base font-semibold py-5 ${theme === "dark" ? "text-[]" : "bg-muted"}`}>Status</TableHead>
                                            <TableHead
                                                className={`text-base font-semibold py-5 ${theme === "dark" ? "" : "bg-muted"}`}></TableHead>
                                            <TableHead
                                                className={`text-base font-semibold py-5 ${theme === "dark" ? "" : "bg-muted"}`}></TableHead>
                                            <TableHead
                                                className={`text-base font-semibold py-5 rounded-tr-sm ${theme === "dark" ? "" : "bg-muted"}`}></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            (announcementData || []).map((x, index) => {
                                                return (
                                                    <TableRow key={x?.id} className={"font-medium"}>
                                                        <TableCell
                                                            className={`py-6 inline-flex items-center justify-center ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                            <span className={"mr-4"}>{x?.post_title}</span>
                                                            <div className={"flex flex-wrap gap-1"}>
                                                                {
                                                                    (x.labels || []).map((y) => {
                                                                        return (
                                                                            <Badge variant={"outline"} style={{
                                                                                color: y.label_color_code,
                                                                                borderColor: y.label_color_code,
                                                                                textTransform: "capitalize"
                                                                            }}
                                                                                   className={`h-[20px] py-0 px-2 text-xs rounded-[5px] shadow-[0px_1px_4px_0px_${y.label_color_code}] font-medium text-[${y.label_color_code}] border-[${y.label_color_code}] capitalize`}>{y.label_name}</Badge>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </TableCell>
                                                        <TableCell
                                                            className={`${theme === "dark" ? "" : "text-muted-foreground"}`}>{x?.post_modified_date ? moment.utc(x.post_modified_date).local().startOf('seconds').fromNow() : "-"}</TableCell>
                                                        <TableCell
                                                            className={`${theme === "dark" ? "" : "text-muted-foreground"}`}>{x?.post_published_at ? moment.utc(x.post_published_at).local().startOf('seconds').fromNow() : "-"}</TableCell>
                                                        <TableCell>
                                                            <Select value={x.post_save_as_draft}
                                                                    onValueChange={(value) => handleStatusChange(x, value)}>
                                                                <SelectTrigger className="w-[114px] h-7">
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
                                                                                                <Circle fill={x.fillColor}
                                                                                                        stroke={x.strokeColor}
                                                                                                        className={`${theme === "dark" ? "" : "text-muted-foreground"} w-2 h-2`}/>
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
                                                            <Button variant={"ghost"}
                                                                    onClick={() => shareFeedback(x.post_slug_url)}><Eye
                                                                size={18}
                                                                className={`${theme === "dark" ? "" : "text-muted-foreground"}`}/></Button>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button onClick={() => openSheet(x)} variant={"ghost"}><BarChart
                                                                size={18}
                                                                className={`${theme === "dark" ? "" : "text-muted-foreground"}`}/></Button>
                                                        </TableCell>
                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger><Button variant={"ghost"}><Ellipsis
                                                                    className={`${theme === "dark" ? "" : "text-muted-foreground"}`}
                                                                    size={18}/></Button></DropdownMenuTrigger>
                                                                <DropdownMenuContent>
                                                                    <DropdownMenuItem
                                                                        onClick={() => onEdit(x.post_slug_url)}>Edit</DropdownMenuItem>
                                                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody>
                                </Table>}
                    </CardContent>
                    {announcementData.length > 0 &&  <Separator/>}
                    {isLoading ? null : (announcementData?.length > 0 ? "" :
                            <div className={"flex flex-row justify-center py-[45px]"}>
                                <div className={"flex flex-col items-center gap-2"}>
                                    <img src={NoDataThumbnail} className={"flex items-center"}/>
                                    <h5 className={`text-center text-2xl font-medium leading-8 ${theme === "dark" ? "" : "text-[#A4BBDB]"}`}>No Data</h5>
                                </div>
                            </div>
                    )}
                </div>
        </div>
    );
};

export default AnnouncementsTable;