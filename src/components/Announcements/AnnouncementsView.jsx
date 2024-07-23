import React, {Fragment, useEffect, useState} from 'react';
import {Button} from "../ui/button";
import {Badge} from "../ui/badge";
import {
    ArrowBigDown,
    ArrowBigUp,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight, Circle, Ellipsis,
    MessageCircleMore
} from "lucide-react";
import {Card, CardContent, CardFooter} from "../ui/card";
import { DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
  } from "../ui/dropdown-menu"
import {Separator} from "../ui/separator";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {useTheme} from "../theme-provider";
import {apiService, getProjectDetails} from "../../utils/constent";
import moment from "moment";
import {toast} from "../ui/use-toast";
import ReadMoreText from "../Comman/ReadMoreText";
import {Toaster} from "../ui/toaster";
import {CommSkel} from "../Comman/CommSkel";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "../ui/alert-dialog";

const status = [
    {name: "Publish", value: 0, fillColor: "#389E0D", strokeColor: "#389E0D",},
    {name: "Draft", value: 1, fillColor: "#CF1322", strokeColor: "#CF1322",},
]

const AnnouncementsView = ({data,isLoading,setSelectedRecord,handleDelete,setAnalyticsObj}) => {
    const [announcementList,setAnnouncementList]=useState([]);
    const [isOpenDeleteAlert,setIsOpenDeleteAlert]= useState(false);
    const [idToDelete,setIdToDelete]=useState(null);
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
        setIsOpenDeleteAlert(true);
        setIdToDelete(id);
    }

    const deleteParticularRow = ()=>{
        handleDelete(idToDelete);
    }

    return (
        <div className={""}>
            <Toaster/>
            <AlertDialog open={isOpenDeleteAlert} onOpenChange={setIsOpenDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>You really want delete this announcement?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action can't be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className={"bg-red-600 hover:bg-red-600"} onClick={deleteParticularRow}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {
                isLoading ? <Card><CardContent className={"p-0"}>{CommSkel.commonParagraphFourIdea}</CardContent></Card> : <div className="pt-[38px]">
                    <div className={"flex flex-col px-[33px] pb-[32px] "}>
                        {
                            (announcementList || []).map((x,index)=>{
                                return(
                                    <Fragment key={index}>
                                        <div className={"flex flex-row gap-4 items-center justify-between px-[31px] mb-[22px]"}>
                                            <div className={"basis-4/5 flex flex-row gap-4 items-center flex-wrap"}>
                                                <h4 className={"text-base font-medium capitalize"}>{x.post_title}</h4>
                                                <div className={"flex flex-row items-center gap-2"}>
                                                    <h5 className={"text-base font-medium text-sm"}>{getProjectDetails('project_name')}</h5>
                                                    <div className={"w-1 h-1 rounded-full bg-[#5F5F5F]"}/>
                                                    <h5 className={"text-sm font-normal flex items-center text-muted-foreground leading-5"}>{moment.utc(x.post_modified_date).local().startOf('seconds').fromNow()}</h5>
                                                </div>
                                            </div>
                                            <div className={"basis-1/5 flex justify-end"}>
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
                                            </div>
                                        </div>
                                        <div className={"flex flex-row gap-4 justify-between px-[31px] mb-4"}>
                                            <div className={"basis-4/5 flex flex-row gap-4"}>
                                                <ReadMoreText html={x.post_description}/>
                                            </div>
                                            <div className={""}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger><Button variant={"outline"} className={"p-2 h-9 w-9"}><Ellipsis size={18} /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onClick={() => openSheetSidebar(x)}>Analytics</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => onEdit(x)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={()=>deleteRow(x.id)}>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                        <div className={"flex flex-row gap-4 justify-between px-[31px]"}>
                                            <div className={"flex flex-row gap-10 items-center "}>
                                                <div className={"flex flex-row gap-2 items-center "}>
                                                    <Button variant={"outline"} className={"p-1 h-[30px] w-[30px] hover:none"}>
                                                        <ArrowBigUp size={18} className={"fill-black text-violet-600"}  />
                                                    </Button>
                                                    <p className={" font-medium leading-4"}>{x.msg}</p>
                                                    <Button variant={"outline"} className={"p-1 h-[30px] w-[30px]"}><ArrowBigDown size={18} className={"text-violet-600"} /></Button>
                                                </div>
                                                <div className={""}>
                                                    <div className={"flex flex-row gap-2 items-center"}>
                                                        <Button variant={"outline hover:none"} className={"p-2 h-9 w-9"}><MessageCircleMore size={18} className={"text-violet-600"} /></Button>
                                                        <p className={"font-medium leading-4"}>{x.msg}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={"flex flex-wrap gap-1"}>
                                                {
                                                    (x.labels || []).map((y,index) => {
                                                        return (
                                                            <Badge key={index} variant={"outline"} style={{
                                                                color: y.label_color_code,
                                                                borderColor: y.label_color_code,
                                                                textTransform: "capitalize"
                                                            }}
                                                                   className={`h-[20px] py-0 px-2 text-xs rounded-[5px] shadow-[0px_1px_4px_0px_${y.label_color_code}] font-medium text-[${y.label_color_code}] border-[${y.label_color_code}] capitalize`}>{y.label_name}</Badge>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                        {index != announcementList.length - 1  && <hr className={"bg-[#E4E4E7] h-[1px] my-6"}/>}
                                    </Fragment>
                                )
                            })
                        }
                    </div>
                    <Separator/>
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
};

export default AnnouncementsView;