import React, {Fragment, useEffect, useState} from 'react';
import {Button} from "../ui/button";
import {Badge} from "../ui/badge";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Circle, Dot, Ellipsis, Loader2, X} from "lucide-react";
import {Card, CardContent, CardFooter} from "../ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,} from "../ui/dropdown-menu";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {useTheme} from "../theme-provider";
import {apiService, getProjectDetails} from "../../utils/constent";
import moment from "moment";
import {toast} from "../ui/use-toast";
import ReadMoreText from "../Comman/ReadMoreText";
import {Toaster} from "../ui/toaster";
import {CommSkel} from "../Comman/CommSkel";
import {Dialog,DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../ui/dialog";

const status = [
    {name: "Publish", value: 1, fillColor: "#389E0D", strokeColor: "#389E0D",},
    {name: "Draft", value: 4, fillColor: "#CF1322", strokeColor: "#CF1322",},
]

const AnnouncementsView = ({data,isLoading,setSelectedRecord,handleDelete,setAnalyticsObj}) => {
    const [announcementList,setAnnouncementList]=useState([]);
    const [idToDelete,setIdToDelete]=useState(null);
    const [openDelete,setOpenDelete]=useState(false);
    const {theme} =useTheme();

    useEffect(()=>{
        setAnnouncementList(data);
    },[data]);

    const handleStatusChange = async (object, value) => {
        setAnnouncementList(announcementList.map(x => x.id === object.id ? { ...x, post_save_as_draft: value } : x));
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

    const openSheetSidebar = (x) => {
        setAnalyticsObj(x)
    }

    const onEdit =(record)=>{
        setSelectedRecord(record);
    };

    const deleteRow =(id)=>{
        setIdToDelete(id);
        setOpenDelete(true);
    }

    const deleteParticularRow = ()=>{
        handleDelete(idToDelete);
        setOpenDelete(false);
    }

    return (
        <div className={""}>
            <Toaster/>
            {
                openDelete &&
                <Fragment>
                    <Dialog open onOpenChange={()=> setOpenDelete(false)}>
                        <DialogContent className="max-w-[350px] w-full sm:max-w-[525px] p-3 md:p-6 rounded-lg">
                            <DialogHeader className={"flex flex-row justify-between gap-2"}>
                                <div className={"flex flex-col gap-2"}>
                                    <DialogTitle>You really want delete this announcement?</DialogTitle>
                                    <DialogDescription>This action can't be undone.</DialogDescription>
                                </div>
                                <X size={16} className={"m-0 cursor-pointer"} onClick={() => setOpenDelete(false)}/>
                            </DialogHeader>
                            <DialogFooter className={"flex-row justify-end space-x-2"}>
                                <Button variant={"outline hover:none"}
                                        className={"text-sm font-semibold border"}
                                        onClick={() => setOpenDelete(false)}>Cancel</Button>
                                <Button
                                    variant={"hover:bg-destructive"}
                                    className={`${theme === "dark" ? "text-card-foreground" : "text-card"} w-[65px] text-sm font-semibold bg-destructive`}
                                    onClick={deleteParticularRow}
                                >
                                    {isLoading ? <Loader2 size={16} className={"animate-spin"}/> : "Delete"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Fragment>
            }
            {
                isLoading ? <Card><CardContent className={"p-0"}>{CommSkel.commonParagraphFourIdea}</CardContent></Card> :
                    <div className={"flex flex-col px-3 lg:px-[33px] pt-[9px] pb-0"}>
                        {
                            (announcementList || []).map((x,index)=>{
                                const isLastItem = index === announcementList.length - 1;
                                return(
                                    <Fragment key={index}>
                                        <div className={`flex flex-col gap-[20px] ${isLastItem ? '' : 'border-b'} pt-2 pb-3 lg:pt-[30px] lg:pb-[24px]`}>
                                            <div className={"flex justify-between flex-wrap md:flex-nowrap gap-2 lg:px-[31px]"}>
                                            <div className={"flex gap-1 items-center w-full md:w-auto md:gap-4"}>
                                                <div className={"flex justify-between gap-1 items-center"}>
                                                    <h4 className={"text-base font-medium text-muted-foreground capitalize"}>{x.post_title}</h4>
                                                </div>
                                                <div className={"flex items-center gap-2"}>
                                                    {/*<h4 className={"text-base font-medium text-sm"}>{getProjectDetails('project_name')}</h4>*/}
                                                    <p className={"text-xs font-normal flex items-center text-muted-foreground"}>
                                                        <Dot
                                                            className={"fill-text-card-foreground stroke-text-card-foreground"}/>
                                                    {moment.utc(x.post_modified_date).local().startOf('seconds').fromNow()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={"flex gap-2 items-center"}>
                                                <Select value={x.post_save_as_draft} onValueChange={(value) => handleStatusChange(x,value)}>
                                                    <SelectTrigger className="w-[114px] h-7">
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
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger><Ellipsis size={18}/></DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem onClick={() => openSheetSidebar(x)}>Analytics</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => onEdit(x)}>Edit</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={()=>deleteRow(x.id)}>Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                            </div>
                                        </div>
                                            <div className={"lg:px-[31px] flex flex-col gap-4"}>
                                                <div className={"flex gap-4 justify-between"}>
                                                    <div
                                                        className={"description-container text-sm text-muted-foreground"}>
                                                        <ReadMoreText html={x.post_description}/>
                                                    </div>
                                                </div>
                                                {
                                                    (x.labels && x.labels.length > 0) ? (
                                                        <div className={"flex gap-4 justify-end items-center flex-wrap"}>

                                                            <div className={"flex flex-wrap gap-1"}>
                                                                {
                                                                    x.labels.map((y, index) => (
                                                                        <Badge
                                                                            key={index}
                                                                            variant={"outline"}
                                                                            style={{color: y.label_color_code, borderColor: y.label_color_code, textTransform: "capitalize"}}
                                                                            className={`h-[20px] py-0 px-2 text-xs rounded-[5px] shadow-[0px_1px_4px_0px_${y.label_color_code}] font-medium text-[${y.label_color_code}] border-[${y.label_color_code}] capitalize`}
                                                                        >
                                                                            {y.label_name}
                                                                        </Badge>
                                                                    ))
                                                                }
                                                            </div>

                                                        </div>
                                                    ) : null
                                                }

                                            </div>
                                        {/*{index != announcementList.length - 1  && <hr className={"bg-[#E4E4E7] h-[1px] my-6"}/>}*/}
                                        </div>
                                    </Fragment>
                                )
                            })
                        }
                    {
                      isLoading == true &&   <CardFooter className={"p-0"}>
                            <div className={`w-full p-5 ${theme === "dark" ? "" : "bg-muted"} rounded-b-lg rounded-t-none flex justify-end pe-16 py-15px`}>
                                <div className={"flex flex-row gap-8 items-center"}>
                                    <div>
                                        <h5 className={"text-sm font-semibold"}>Page 1 of 10</h5>
                                    </div>
                                    <div className={"flex flex-row gap-2 items-center"}>
                                        <Button variant={"outline"}  disabled={true} className={"h-[30px] w-[30px] p-1.5 hover:none"}>
                                            <ChevronsLeft  />
                                        </Button>
                                        <Button variant={"outline"}  disabled={true} className={"h-[30px] w-[30px] p-1.5 hover:none"}>
                                            <ChevronLeft  />
                                        </Button>
                                        <Button variant={"outline"} disabled={true} className={"h-[30px] w-[30px] p-1.5 hover:none"}>
                                            <ChevronRight className={"stroke-primary"} />
                                        </Button>
                                        <Button variant={"outline"}  disabled={true} className={"h-[30px] w-[30px] p-1.5 hover:none"}>
                                            <ChevronsRight className={"stroke-primary"} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardFooter>
                    }

                </div>
            }

        </div>
    );
}

export default AnnouncementsView;