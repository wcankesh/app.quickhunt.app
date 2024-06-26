import React,{Fragment,useState} from 'react';
import ComboBox from "../Comman/ComboBox";
import {Icon} from "../../utils/Icon";
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
import {Card, CardFooter} from "../ui/card";
import { DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
  } from "../ui/dropdown-menu"
import {Separator} from "../ui/separator";
import CreateAnnouncementsLogSheet from "./CreateAnnouncementsLogSheet";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../ui/select";

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

const status = [
    {name: "Public", value: "public", fillColor: "#389E0D", strokeColor: "#389E0D",},
    {name: "Draft", value: "draft", fillColor: "#CF1322", strokeColor: "#CF1322",},
]

const AnnouncementsView = () => {
    const [isReadMore, setIsReadMore] = useState(true);
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);


    const openSheet = (object) => {
        setSheetOpen(true);
        setSelectedData(object);
    };
    const closeSheet = () => setSheetOpen(false);

    return (
        <div className={"mt-9"}>
            <CreateAnnouncementsLogSheet isOpen={isSheetOpen} onOpen={openSheet} onClose={closeSheet} data={selectedData}/>
                <Card className="pt-[38px]">
                    <div className={"flex flex-col px-[33px] pb-[32px] "}>
                    {
                        (dummyDetails.data || []).map((x,index)=>{
                            return(
                                <Fragment>
                                        <div className={"flex flex-row gap-4 items-center justify-between px-[31px] mb-[22px]"}>
                                            <div className={"basis-4/5 flex flex-row gap-4 items-center"}>
                                                <h4 className={"text-base font-medium capitalize"}>{x.title}</h4>
                                                <div className={"flex flex-row items-center gap-2"}>
                                                    <h5 className={"text-base font-medium text-sm"}>{x.author}</h5>
                                                    <div className={"w-1 h-1 rounded-full bg-[#5F5F5F]"}/>
                                                    <h5 className={"text-sm font-normal flex items-center text-muted-foreground leading-5"}>{x.date}</h5>
                                                </div>
                                            </div>
                                            <div className={"basis-1/5 flex justify-end"}>
                                                <Select>
                                                    <SelectTrigger className="w-[106px] h-7">
                                                        <SelectValue placeholder="Publish" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {
                                                                (status || []).map((x, i) => {
                                                                    return (
                                                                        <Fragment key={i}>
                                                                            <SelectItem value={x.value}>
                                                                                <div className={"flex items-center gap-2"}>
                                                                                    <Circle fill={x.fillColor} stroke={x.strokeColor} className={` w-[10px] h-[10px]`}/>
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
                                                <p className={"text-muted-foreground text-sm"}>
                                                    {isReadMore ? x.description.slice(0, 300) : x.description}
                                                    <span
                                                    className="text-violet-600 font-semibold text-sm cursor-pointer"
                                                    onClick={()=>openSheet(x)}
                                                    >
                                                        {isReadMore ? "...Read more" : ""}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className={""}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger><Button variant={"outline"} className={"p-2 h-9 w-9"}><Ellipsis size={18} /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem>Analytics</DropdownMenuItem>
                                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                {/*<Popover>*/}
                                                {/*    <PopoverTrigger><Button variant={"outline"} className={"p-2 h-9 w-9 "}>{Icon.threeDots}</Button></PopoverTrigger>*/}
                                                {/*    <PopoverContent className={"w-22 p-1"}>*/}
                                                {/*        <div className={"flex flex-col gap-1"}>*/}
                                                {/*            <Button variant={"outline"} className={"text-sm font-medium text-slate-700 text-start"}>Analytics</Button>*/}
                                                {/*            <Button variant={"outline"} className={"text-sm font-medium text-slate-700 text-start"}>Edit</Button>*/}
                                                {/*            <Button variant={"outline"} className={"text-sm font-medium text-slate-700 text-start"}>Delete</Button>*/}
                                                {/*        </div>*/}
                                                {/*    </PopoverContent>*/}
                                                {/*</Popover>*/}
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
                                            <div className={"flex flex-row gap-2"}>
                                                <Badge variant={"outline"} className={"h-5 py-0 px-2  text-xs rounded-[5px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.09)] font-medium text-[#63C8D9] border-[#63C8D9]"}>Important</Badge>
                                                <Badge variant={"outline"} className={"h-[20px] py-0 px-2 text-xs rounded-[5px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.09)] text-blue-500 border-blue-500 font-medium"}>New</Badge>
                                            </div>
                                        </div>
                                    {index != dummyDetails.data.length - 1  && <hr className={"bg-[#E4E4E7] h-[1px] my-6"}/>}
                                </Fragment>
                            )
                        })
                    }
                    </div>
                    <Separator/>
                    <CardFooter className={"p-0"}>
                        <div className={"w-full p-5 bg-muted rounded-b-lg rounded-t-none flex justify-end pe-16 py-15px"}>
                            <div className={"flex flex-row gap-8 items-center"}>
                                <div>
                                    <h5 className={"text-sm font-semibold"}>Page {dummyDetails.page} of 10</h5>
                                </div>
                                <div className={"flex flex-row gap-2 items-center"}>
                                    <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5 hover:none"}>
                                        <ChevronsLeft  className={`${dummyDetails.preview === 0 ? "stroke-slate-300" : "stroke-primary"}`} />
                                    </Button>
                                    <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5 hover:none"}>
                                        <ChevronLeft  className={`${dummyDetails.preview === 0 ? "stroke-slate-300" : "stroke-primary"}`} />
                                    </Button>
                                    <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5 hover:none"}>
                                        <ChevronRight  className={"stroke-primary"} />
                                    </Button>
                                    <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5 hover:none"}>
                                        <ChevronsRight className={"stroke-primary"} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardFooter>
            </Card>

        </div>
    );
};

export default AnnouncementsView;