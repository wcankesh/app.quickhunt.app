import React from 'react';
import {Sheet,
    SheetPortal,
    SheetOverlay,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,} from "../ui/sheet";
import {Separator} from "../ui/separator";
import {Icon} from "../../utils/Icon";
import {Button} from "../ui/button";
import {ChevronLeft, ChevronRight} from "lucide-react";

const reaction ={
    data:[
        {
            author:"Ankesh",
            description:"“This  library has saved me countless hours of work and helped me deliver  stunning designs....”",
            email:"wc.ankesh112@gmail.com"
        },
        {
            author:"Ankesh",
            description:"“This  library has saved me countless hours of work and helped me deliver  stunning designs....”",
            email:"wc.ankesh112@gmail.com"
        },
        {
            author:"Ankesh",
            description:"“This  library has saved me countless hours of work and helped me deliver  stunning designs....”",
            email:"wc.ankesh112@gmail.com"
        }
    ],
    previous:0,
    next:true,
}

const SidebarSheet = ({ isOpen, onOpen, onClose }) => {
    return (
            <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
                <SheetContent className={"pt-[24px] p-0 max-h-screen overflow-y-auto"}>
                    <SheetHeader >
                        <div className={"py-6 px-8"} >
                            <h5 className={"text-xl font-medium leading-5 text-[#5F5F5F]"}>Welcome To Our Release Notes</h5>
                        </div>
                    </SheetHeader>
                        <Separator />
                        <div className={"pt-6 px-8 pb-4 pr-16 flex flex-row justify-between"}>
                            <div className={"flex flex-col gap-2"}>
                                <h5 className={"text-[#0F172A] text-base font-semibold leading-5"}>Total Views</h5>
                                <h5 className={"text-[#7C3AED] text-2xl font-bold"}>3</h5>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <h5 className={"text-[#0F172A] text-base font-semibold leading-5"}>Unique Views</h5>
                                <h5 className={"text-[#7C3AED] text-2xl font-bold"}>2</h5>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <h5 className={"text-[#0F172A] text-base font-semibold leading-5"}>Feedback</h5>
                                <h5 className={"text-[#7C3AED] text-2xl font-bold"}>1</h5>
                            </div>
                        </div>
                        <Separator />
                        <div className={"py-6 px-8 flex flex-col gap-2"}>
                            <h5 className={"text-[#0F172A] text-base font-semibold leading-5"}>Reaction</h5>
                            <Separator className={"mb-2"}/>
                            <div className={""}>
                                {
                                    (reaction.data || []).map((x,index)=>{
                                        return(
                                            <div className={"flex flex-col"}>
                                                <div className={"flex flex-row gap-4"}>
                                                    <div>{Icon.smileEmoji2}</div>
                                                    <div className={"flex flex-col gap-1"}>
                                                        <div className={"flex flex-row gap-1 items-center"}>
                                                            <h5 className={"text-[#0F172A] text-sm font-semibold leading-5"}>{x.author}</h5>
                                                            <p className={"text-[#5F5F5F] text-[10px] leading-5 font-medium"}>Reacted to </p>
                                                        </div>
                                                       <p className={"text-[#6B6B6B] text-xs font-medium"}>{x.description}</p>
                                                    </div>
                                                </div>
                                                <div className={"py-4"}>
                                                    <Separator/>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className={"flex flex-row justify-end items-center gap-3"}>
                                <Button className={"custom-shadow h-9 w-9 border-[#000017]  p-2 bg-white hover:bg-white p-2"}>
                                    <ChevronLeft size={20} color={reaction.previous === 0 ? "#D6D6D6" : "#7c3aed"} strokeWidth={1.75} />
                                </Button>
                                <h5 className={"text-[14px] text-[#0F172A] font-bold"}>01</h5>
                                <Button className={"custom-shadow h-9 w-9 border-[#000017]  p-2 bg-white hover:bg-white p-2"}>
                                    <ChevronRight size={20} color="#7c3aed" strokeWidth={1.75} />
                                </Button>
                            </div>
                        </div>
                        <Separator className={"p-0 m-0"}/>
                        <div className={"py-6 px-8 flex flex-col gap-2"}>
                            <h5 className={"text-[#0F172A] text-base font-semibold leading-5"}>Feedback</h5>
                            <Separator className={"mb-2"}/>
                            <div className={""}>
                                {
                                    (reaction.data || []).map((x,index)=>{
                                        return(
                                            <div className={"flex flex-col"}>
                                                <div className={"flex flex-row gap-4"}>
                                                    <div className={"flex flex-col gap-1"}>
                                                        <div className={"flex flex-row gap-4 items-center"}>
                                                            <h5 className={"text-[#0F172A] text-sm font-semibold leading-5"}>{x.author}</h5>
                                                            <p className={"text-[#5F5F5F] text-[10px] leading-5 font-medium"}>{x.email}</p>
                                                        </div>
                                                        <p className={"text-[#6B6B6B] text-xs font-medium"}>{x.description}</p>
                                                    </div>
                                                </div>
                                                <div className={"py-4"}>
                                                    <Separator/>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className={"flex flex-row justify-end items-center gap-3"}>
                                <Button className={"custom-shadow h-9 w-9 border-[#000017]  p-2 bg-white hover:bg-white p-2"}>
                                    <ChevronLeft size={20} color={reaction.previous === 0 ? "#D6D6D6" : "#7c3aed"} strokeWidth={1.75} />
                                </Button>
                                <h5 className={"text-[14px] text-[#0F172A] font-bold"}>01</h5>
                                <Button className={"custom-shadow h-9 w-9 border-[#000017]  p-2 bg-white hover:bg-white p-2"}>
                                    <ChevronRight size={20} color="#7c3aed" strokeWidth={1.75} />
                                </Button>
                            </div>
                        </div>







                </SheetContent>
            </Sheet>
    );
};

export default SidebarSheet;