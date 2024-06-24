import React,{Fragment,useState,useEffect} from 'react';
import ComboBox from "../Comman/ComboBox";
import {Popover, PopoverTrigger} from "@radix-ui/react-popover";
import {Icon} from "../../utils/Icon";
import {PopoverContent} from "../ui/popover";
import {Button} from "../ui/button";
import {Badge} from "../ui/badge";
import {
    ArrowBigDown,
    ArrowBigUp,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    MessageCircleMore
} from "lucide-react";
import {Card} from "../ui/card";
import { DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,} from "../ui/dropdown-menu"
import {Separator} from "../ui/separator";

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

const status =[
    {
        value: "publish",
        label: "Publish",
    },
    {
        value: "draft",
        label: "Draft",
    },
]

const AnnouncementsView = () => {
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };
    return (
        <div className={"mt-9"}>
                <Card className="pt-[38px]">
                    <div className={"flex flex-col px-[33px] pb-[32px] "}>
                    {
                        (dummyDetails.data || []).map((x,index)=>{
                            return(
                                <Fragment>
                                        <div className={"flex flex-row gap-4 items-center justify-between px-[31px] mb-[22px]"}>
                                            <div className={"basis-4/5 flex flex-row gap-4 items-center "}>
                                                <h4 className={"text-base text-[#5F5F5F] font-medium leading-4 capitalize"}>{x.title}</h4>
                                                <div className={"flex flex-row items-center gap-2"}>
                                                    <h5 className={"text-[14px]  font-medium leading-5"}>{x.author}</h5>
                                                    <div className={"w-1 h-1 rounded-full bg-[#5F5F5F]"}/>
                                                    <h5 className={"text-sm text-[#5F5F5F] font-normal leading-5"}>{x.date}</h5>
                                                </div>
                                            </div>
                                            <div className={"basis-1/5 flex justify-end"}>
                                                <ComboBox classNames={"custom-shadow w-[106px] h-7"} items={status} placeholder={x.status === 0 ? "Publish" : "Draft"} isSearchBox={false} isCommandItemBullet={true} />
                                            </div>
                                        </div>
                                        <div className={"flex flex-row gap-4 justify-between px-[31px] mb-4"}>
                                            <div className={"basis-4/5 flex flex-row gap-4"}>
                                                <p className={"text-muted-foreground font-normal"}>
                                                    {isReadMore ? x.description.slice(0, 300) : x.description}
                                                    <span
                                                    onClick={toggleReadMore}
                                                    className="text-violet-600 font-semibold text-sm"
                                                    >
                                                        {isReadMore ? "...Read more" : "Show less"}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className={""}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger><Button variant={"outline"} className={"p-2 h-9 w-9"}>{Icon.threeDots}</Button></DropdownMenuTrigger>
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
                    <div className={"pt-4 pb-4 w-full rounded-b-lg rounded-t-none flex justify-end pe-16 py-15px bg-[#F8F9FC]"}>
                        <div className={"flex flex-row gap-9 items-center"}>
                            <div>
                                <h5 className={"text-[#5F5F5F] text-sm font-semibold leading-[20px]"}>Page {dummyDetails.page} of 10</h5>
                            </div>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}>
                                    <ChevronsLeft  className={""} size={18} color={dummyDetails.preview === 0 ? "#D6D6D6" : "7c3aed" } />
                                </Button>
                                <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}>
                                    <ChevronLeft  className={""} size={18} color={dummyDetails.preview === 0 ? "#D6D6D6" : "7c3aed" }  />
                                </Button>
                                <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}>
                                    <ChevronRight  className={""} size={18} color="#7c3aed"  />
                                </Button>
                                <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}>
                                    <ChevronsRight className={""} size={18} color="#7c3aed" />
                                </Button>
                            </div>
                        </div>
                    </div>
            </Card>

        </div>
    );
};

export default AnnouncementsView;