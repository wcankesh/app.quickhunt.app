import React from 'react';
import {Sheet,
        SheetContent,
        SheetHeader,
        } from "../ui/sheet";
import {Separator} from "../ui/separator";
import {Icon} from "../../utils/Icon";
import {Button} from "../ui/button";
import {ChevronLeft, ChevronRight, ChevronsRight, Pin, X} from "lucide-react";

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
    preview:0,
    next:true,
}

const SidebarSheet = ({ isOpen, onOpen, onClose }) => {
    return (
            <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
                <div style={{maxWidth:"none"}}>
                    <SheetContent className={"pt-[24px] p-0 max-h-screen overflow-y-auto lg:max-w-[504px]"} >
                        <SheetHeader className={"px-8 py-6 flex flex-row justify-between items-center"}>
                            <h5 className={"text-xl font-medium leading-5"}>Welcome To Our Release Notes</h5>
                            <Button className={"h-5 w-5 p-0"} variant={"ghost"} onClick={onClose} onClick={onClose}><X className={"h-4 w-4"} size={18} /></Button>
                        </SheetHeader>
                        <Separator className={"mb-6"} />
                        <div className={"pt-6 px-8 pb-4 pr-16 flex flex-row justify-between"}>
                            <div className={"flex flex-col gap-2"}>
                                <h5 className={" text-base font-semibold leading-5"}>Total Views</h5>
                                <h5 className={" text-2xl font-bold"}>3</h5>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <h5 className={"text-base font-semibold leading-5"}>Unique Views</h5>
                                <h5 className={"text-2xl font-bold"}>2</h5>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <h5 className={"text-base font-semibold leading-5"}>Feedback</h5>
                                <h5 className={"text-2xl font-bold"}>1</h5>
                            </div>
                        </div>
                        <Separator />
                        <div className={"py-6 px-8 flex flex-col gap-2"}>
                            <h5 className={"text-base font-semibold leading-5"}>Reaction</h5>
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
                                                            <h5 className={"text-sm font-semibold leading-5"}>{x.author}</h5>
                                                            <p className={"text-muted-foreground text-[10px] leading-5 font-medium"}>Reacted to </p>
                                                        </div>
                                                       <p className={"text-muted-foreground text-xs font-medium"}>{x.description}</p>
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
                                <Button variant={"outline"}  className={" h-[30px] w-[30px] p-1.5"}>
                                    <ChevronLeft  className={`${reaction.preview == 0 ? "stroke-slate-300" : "stroke-primary"}`} />
                                </Button>
                                <h5 className={"text-[14px] font-bold"}>01</h5>
                                <Button variant={"outline"} className={" h-[30px] w-[30px] p-1.5"}>
                                    <ChevronRight className={"stroke-primary"} />
                                </Button>
                            </div>
                        </div>
                        <Separator className={"p-0 m-0"}/>
                        <div className={"py-6 px-8 flex flex-col gap-2"}>
                            <h5 className={"text-base font-semibold leading-5"}>Feedback</h5>
                            <div className={""}>
                                {
                                    (reaction.data || []).map((x,index)=>{
                                        return(
                                            <div className={"flex flex-col"}>
                                                <div className={"flex flex-row gap-4 ml-4 mr-[10px]"}>
                                                    <div className={"flex flex-col gap-1"}>
                                                        <div className={"flex flex-row gap-4 items-center"}>
                                                            <h5 className={"text-sm font-semibold leading-5"}>{x.author}</h5>
                                                            <p className={"text-muted-foreground text-[10px] leading-5 font-medium"}>{x.email}</p>
                                                        </div>
                                                        <p className={"text-muted-foreground text-xs font-medium"}>{x.description}</p>
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
                                <Button variant={"outline"}  className={" h-[30px] w-[30px] p-1.5"}>
                                    <ChevronLeft  className={`${reaction.preview == 0 ? "stroke-slate-300" : "stroke-primary"}`} />
                                </Button>
                                <h5 className={"text-[14px] font-bold"}>01</h5>
                                <Button variant={"outline"}  className={" h-[30px] w-[30px] p-1.5"}>
                                    <ChevronRight className={"stroke-primary"} />
                                </Button>
                            </div>
                        </div>







                </SheetContent>
                </div>
            </Sheet>
    );
};

export default SidebarSheet;