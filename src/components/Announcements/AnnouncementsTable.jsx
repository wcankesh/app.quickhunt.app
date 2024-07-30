import React, {useState, Fragment, useEffect} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {Badge} from "../ui/badge";
import {Button} from "../ui/button";
import {BarChart, Circle, Ellipsis, Eye,} from "lucide-react";
import {useTheme} from "../theme-provider"
import { Card, CardContent} from "../ui/card";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../ui/dropdown-menu";
import {Separator} from "../ui/separator";
import {Select, SelectItem, SelectGroup, SelectContent, SelectTrigger, SelectValue} from "../ui/select";
import moment from "moment";
import NoDataThumbnail from "../../img/Frame.png"
import {apiService} from "../../utils/constent";
import {Toaster} from "../ui/toaster";
import {toast} from "../ui/use-toast";
import {Skeleton} from "../ui/skeleton";
import {AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel,} from "../ui/alert-dialog";

const status = [
    {name: "Publish", value: 0, fillColor: "#389E0D", strokeColor: "#389E0D",},
    {name: "Draft", value: 1, fillColor: "#CF1322", strokeColor: "#CF1322",},
]

const AnnouncementsTable = ({data,isLoading ,setSelectedRecord,setEditIndex ,handleDelete,handleAnalyticRow,setAnalyticsObj,}) => {
    const [announcementData,setAnnouncementData]=useState(data);
    const [isOpenDeleteAlert,setIsOpenDeleteAlert]= useState(false);
    const [idToDelete,setIdToDelete]=useState(null);
    const { theme }= useTheme();

    useEffect(()=>{
        setAnnouncementData(data);
    },[data]);

    const openSheet = (x) => {
        setAnalyticsObj(x);
        handleAnalyticRow(x);
    };

    const handleStatusChange = async (object, value) => {
        setAnnouncementData(announcementData.map(x => x.id === object.id ? { ...x, post_save_as_draft: value } : x));
        const payload = {...object,post_save_as_draft:value}
        const data = await apiService.updatePosts(payload,object.id);
        if(data.status === 200){
            toast({
                description: "Status updated successfully",
            });
        } else {
            toast({
                description: "Something went wrong.",
                variant: "destructive",
            });
        }

    };

    const onEdit = (record,index)=> {
       setSelectedRecord(record);
       setEditIndex(index);
    };

    const shareFeedback = (domain,slug)=>{
        window.open(`https://${domain}/${slug}`, "_blank")
    }

    const deleteRow =(id)=>{
        setIsOpenDeleteAlert(true);
        setIdToDelete(id);
    }

    const deleteParticularRow = ()=>{
        handleDelete(idToDelete);
    }

    return (
        <Fragment>
            <Toaster/>
            <AlertDialog open={isOpenDeleteAlert} onOpenChange={setIsOpenDeleteAlert}>
                <AlertDialogContent className={"w-[310px] md:w-auto rounded-lg p-3"}>
                    <AlertDialogHeader className={"text-left gap-2"}>
                        <AlertDialogTitle className={"text-sm md:text-xl"}>You really want delete this announcement?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action can't be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className={"flex flex-row justify-end gap-2"}>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className={"bg-red-600 hover:bg-red-600 m-0"} onClick={deleteParticularRow}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/*<Card className={"rounded-none"}>*/}
            <CardContent className={"p-0 overflow-auto"}>
                <Table className={""}>
                        <TableHeader className={"p-0"}>
                            <TableRow className={""}>
                                {
                                    ["Title","Last Updated","Published At","Status","","",""].map((x,i)=>{
                                        return(
                                            <TableHead className={`text-sm lg:text-base font-semibold px-2 md:py-4 md:px-3 lg:py-5 lg:px-4 ${theme === "dark" ? "text-[]" : "bg-muted"}`}>
                                                {x}
                                            </TableHead>
                                        // <TableHead className={`text-base font-semibold py-5 rounded-tl-sm ${theme === "dark" ? "text-[]" : "bg-muted"} ${i === 0 ? "max-w-[375px] rounded-lg" :""} ${i === 6 ? "rounded-lg" :""}`}>{x}</TableHead>
                                        )
                                    })
                                }
                            </TableRow>
                        </TableHeader>
                    {isLoading ? <TableBody>
                        {
                            [...Array(4)].map((_, index) => {
                                return (
                                    <TableRow key={index}>
                                        {
                                            [...Array(7)].map((_, i) => {
                                                return (
                                                    <TableCell className={"max-w-[373px]"}>
                                                        <Skeleton className={"rounded-md  w-full h-[40px]"}/>
                                                    </TableCell>
                                                )
                                            })
                                        }
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody> :
                    <TableBody>
                           {(announcementData || []).map((x, index) => {
                                                return (
                                                    <TableRow key={x?.id} className={"font-medium"}>
                                                        <TableCell
                                                            className={`inline-flex gap-2 md:gap-3 flex-wrap items-center px-2 md:py-4 md:px-3 lg:py-5 lg:px-4 ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                            <span className={""}>{x?.post_title}</span>
                                                            <div className={"flex flex-wrap gap-1"}>
                                                                {
                                                                    (x.labels || []).map((y,index) => {
                                                                        return (
                                                                            <Badge variant={"outline"} key={index} style={{
                                                                                color: y.label_color_code,
                                                                                borderColor: y.label_color_code,
                                                                                textTransform: "capitalize"
                                                                            }}
                                                                                   className={`h-[20px] py-0 px-2 text-xs rounded-[5px]  font-medium text-[${y.label_color_code}] border-[${y.label_color_code}] capitalize`}>{y.label_name}</Badge>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </TableCell>
                                                        <TableCell
                                                            className={`${theme === "dark" ? "" : "text-muted-foreground"} px-2 md:py-4 md:px-3 lg:py-5 lg:px-4`}>{x?.post_modified_date ? moment.utc(x.post_modified_date).local().startOf('seconds').fromNow() : "-"}</TableCell>
                                                        <TableCell
                                                            className={`${theme === "dark" ? "" : "text-muted-foreground"} px-2 md:py-4 md:px-3 lg:py-5 lg:px-4`}>{x?.post_published_at ? moment.utc(x.post_published_at).local().startOf('seconds').fromNow() : "-"}</TableCell>
                                                        <TableCell className={"px-2 md:py-4 md:px-3 lg:py-5 lg:px-4"}>
                                                            <Select value={x.post_save_as_draft}
                                                                    onValueChange={(value) => handleStatusChange(x, value)}>
                                                                <SelectTrigger className="w-[114px] h-7">
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
                                                        <TableCell className={"px-2 md:py-4 md:px-3 lg:py-5 lg:px-4"}>
                                                            <Button
                                                                disabled={x.post_save_as_draft == 1 ? true : false}
                                                                variant={"ghost"}
                                                                onClick={() => shareFeedback(x.domain,x.post_slug_url)}
                                                                className={"p-0 h-auto"}
                                                            >
                                                                <Eye size={18} className={`${theme === "dark" ? "" : "text-muted-foreground"}`}/>
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell className={"px-2 md:py-4 md:px-3 lg:py-5 lg:px-4"}>
                                                            <Button
                                                                onClick={() => openSheet(x)}
                                                                variant={"ghost"}
                                                                className={"p-0 h-auto"}
                                                            >
                                                                <BarChart size={18} className={`${theme === "dark" ? "" : "text-muted-foreground"}`}/>
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell className={"px-2 md:py-4 md:px-3 lg:py-5 lg:px-4"}>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger>
                                                                    <Ellipsis className={`${theme === "dark" ? "" : "text-muted-foreground"}`} size={18}/>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent>
                                                                    <DropdownMenuItem
                                                                        onClick={() => onEdit(x,index)}>Edit</DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={()=>deleteRow(x.id)}>Delete</DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                    </TableBody> }
                             </Table>
            </CardContent>
            {/*</Card>*/}
            {/*{announcementData.length > 0 &&  <Separator/>}*/}
            {isLoading ? null : (isLoading === false && announcementData?.length > 0 ? "" :
                    <div className={"flex flex-row justify-center py-[45px]"}>
                        <div className={"flex flex-col items-center gap-2"}>
                            <img src={NoDataThumbnail} className={"flex items-center"}/>
                            <h5 className={`text-center text-2xl font-medium leading-8 ${theme === "dark" ? "" : "text-[#A4BBDB]"}`}>No Data</h5>
                        </div>
                    </div>
            )}
        </Fragment>
    );
};

export default AnnouncementsTable;