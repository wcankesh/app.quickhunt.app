import React from 'react';
import {Sheet, SheetContent, SheetHeader, SheetOverlay,} from "../ui/sheet";
import {X} from "lucide-react";

const WidgetSideBarSheet = ({ isOpen, onOpen, onClose }) => {
    return (
        <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
            <SheetOverlay className={"inset-0"} />
                <SheetContent className={"lg:max-w-[800px] md:max-w-[620px] sm:max-w-[420px] p-0"} >
                    <SheetHeader className={"px-[32px] py-[22px] border-b"}>
                        <div className={"flex justify-between items-center w-full"}>
                            <h2 className={"text-xl font-medium"}>Analytics</h2>
                            <X size={18} onClick={onClose} className={"cursor-pointer"}/>
                        </div>
                    </SheetHeader>
                    <div className={"pt-6 px-8 pb-4 pr-16 flex flex-row justify-between"}>
                        <div className={"flex flex-col gap-1"}>
                            <h5 className={"text-base text-muted-foreground font-normal"}>Widget views</h5>
                            <p className={"text-2xl font-semibold"}>0</p>
                        </div>
                        <div className={"flex flex-col gap-1"}>
                            <h5 className={"text-base text-muted-foreground font-normal"}>Announcement views</h5>
                            <p className={"text-2xl font-semibold"}>0</p>
                        </div>
                        <div className={"flex flex-col gap-1"}>
                            <h5 className={"text-base text-muted-foreground font-normal"}>Roadmap views</h5>
                            <p className={"text-2xl font-semibold"}>0</p>
                        </div>
                        <div className={"flex flex-col gap-1"}>
                            <h5 className={"text-base text-muted-foreground font-normal"}>Ideas page views</h5>
                            <p className={"text-2xl font-semibold"}>0</p>
                        </div>
                    </div>
                </SheetContent>
        </Sheet>
    );
};

export default WidgetSideBarSheet;