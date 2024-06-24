import React,{Fragment,useState,useEffect} from 'react';
import ComboBox from "../Comman/ComboBox";
import {Popover, PopoverTrigger} from "@radix-ui/react-popover";
import {Icon} from "../../utils/Icon";
import {PopoverContent} from "../ui/popover";
import {Button} from "../ui/button";
import {Badge} from "../ui/badge";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from "lucide-react";

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

const ChangeLogView = () => {
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };
    return (
        <div className={"mt-9"}>
                <div className="rounded-md border border-[#CBD5E1] pt-[38px]  ">
                    <div className={"flex flex-col gap-[22px] px-16 pb-[32px] "}>
                    {
                        (dummyDetails.data || []).map((x,index)=>{
                            return(
                                <Fragment>
                                        <div className={"flex flex-row gap-4 items-center justify-between"}>
                                            <div className={"basis-4/5 flex flex-row gap-4 items-center"}>
                                                <h4 className={"text-gray-600 text-base font-medium leading-4 capitalize"}>{x.title}</h4>
                                                <div className={"flex flex-row items-center gap-2"}>
                                                    <h5 className={"text-[14px] font-medium leading-5"}>{x.author}</h5>
                                                    <div className={"w-1 h-1 rounded-full bg-[#5F5F5F]"}/>
                                                    <h5 className={"text-gray-600 font-geist text-sm font-normal leading-5"}>{x.date}</h5>
                                                </div>
                                            </div>
                                            <div className={"basis-1/5 flex justify-end"}>
                                                <ComboBox classNames={"custom-shadow w-[106px] h-7"} items={status} placeholder={x.status === 0 ? "Publish" : "Draft"} isSearchBox={false} isCommandItemBullet={true} />
                                            </div>
                                        </div>
                                        <div className={"flex flex-row gap-4 justify-between"}>
                                            <div className={"basis-4/5 flex flex-row gap-4"}>
                                                <p className={"text-[#5F5F5F] font-normal"}>
                                                    {isReadMore ? x.description.slice(0, 300) : x.description}
                                                    <span
                                                    onClick={toggleReadMore}
                                                    className="text-[#7C3AED] font-semibold text-sm"
                                                    >
                                                        {isReadMore ? "...Read more" : "Show less"}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className={""}>
                                                <Popover>
                                                    <PopoverTrigger><Button className={"p-2 h-9 w-9 bg-white hover:bg-white custom-shadow border border-slate-300"}>{Icon.threeDots}</Button></PopoverTrigger>
                                                    <PopoverContent className={"w-22 p-1"}>
                                                        <div className={"flex flex-col gap-1"}>
                                                            <Button className={"bg-white text-sm font-medium text-slate-700 text-start hover:bg-[#7C3AED] hover:text-white"}>Analytics</Button>
                                                            <Button className={"bg-white text-sm font-medium text-slate-700 text-start hover:bg-[#7C3AED] hover:text-white"}>Edit</Button>
                                                            <Button className={"bg-white text-sm font-medium text-slate-700 text-start hover:bg-[#7C3AED] hover:text-white"}>Delete</Button>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
                                        <div className={"flex flex-row gap-4 justify-between"}>
                                            <div className={"flex flex-row gap-10 items-center "}>
                                                <div className={"flex flex-row gap-2 items-center "}>
                                                    <Button className={"p-2 h-9 w-9 bg-white hover:bg-white custom-shadow border border-slate-300"}>{Icon.upfill}</Button>
                                                    <p className={"text-[#0F172A] font-medium leading-4"}>{x.msg}</p>
                                                    <Button className={"p-2 h-9 w-9 bg-white hover:bg-white custom-shadow border border-slate-300"}>{Icon.downUnFill}</Button>
                                                </div>
                                                <div className={""}>
                                                    <div className={"flex flex-row gap-2 items-center"}>
                                                        <Button className={"p-2 h-9 w-9 bg-white hover:bg-white"}>{Icon.msg}</Button>
                                                        <p className={"text-[#0F172A] font-medium leading-4"}>{x.msg}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={"flex flex-row gap-2"}>
                                                <Badge variant={"outline"} className={"h-5  bg-white border-[#63C8D9] text-xs text-[#63C8D9] rounded-[5px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.09)] font-medium"}>Important</Badge>
                                                <Badge variant={"outline"} className={"h-5  bg-white border-blue text-xs text-blue rounded-[5px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.09)] font-medium"}>New</Badge>
                                            </div>
                                        </div>
                                    {index != dummyDetails.data.length - 1  && <hr/>}
                                </Fragment>

                            )
                        })
                    }
                    </div>
                    <div className={"w-full bg-[#F8F9FC] rounded-b-lg rounded-t-none flex justify-end pe-16 py-15px"}>
                        <div className={"flex flex-row gap-9 items-center"}>
                            <div>
                                <h5 className={"text-[#5F5F5F] text-sm font-semibold leading-[20px]"}>Page {dummyDetails.page} of 10</h5>
                            </div>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <Button className={"bg-[#fff] h-30px w-30px p-1.5 hover:bg-gray-200"}>
                                    <ChevronsLeft  className={""} size={20} color={dummyDetails.preview === 0 ? "#D6D6D6" : "7c3aed" } strokeWidth={1.75} />
                                </Button>
                                <Button className={"bg-[#fff] h-30px w-30px p-1.5 hover:bg-gray-200"}>
                                    <ChevronLeft  className={""} size={20} color={dummyDetails.preview === 0 ? "#D6D6D6" : "7c3aed" } strokeWidth={1.75} />
                                </Button>
                                <Button className={"bg-[#fff] h-30px w-30px p-1.5 hover:bg-gray-200"}>
                                    <ChevronRight  className={""} size={20} color="#7c3aed" strokeWidth={1.75} />
                                </Button>
                                <Button className={"bg-[#fff] h-30px w-30px p-1.5 hover:bg-gray-200"}>
                                    <ChevronsRight className={""} size={20} color="#7c3aed" strokeWidth={1.75} />
                                </Button>
                            </div>
                        </div>
                    </div>
            </div>

        </div>
    );
};

export default ChangeLogView;