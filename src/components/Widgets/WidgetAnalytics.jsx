import React, {Fragment, useState} from 'react';
import { Sheet, SheetContent, SheetHeader, SheetOverlay } from "../ui/sheet";
import { X } from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "../ui/card";
import {CommSkel} from "../Comman/CommSkel";

const WidgetAnalytics = ({ isOpen, onOpen, onClose, widgetsSetting, selectedRecordAnalytics }) => {

    const [isLoading, setIsLoading] = useState(true);
    const widgetData = widgetsSetting.find(widget => widget.id == selectedRecordAnalytics) || {};

    const widAnalytics = [
        {
            id: 1,
            title: 'Widget views',
            count: widgetData?.widget_view,
        },
        {
            id: 2,
            title: 'Announcement views',
            count: widgetData?.announcement_view,
        },
        {
            id: 3,
            title: 'Roadmap views',
            count: widgetData?.roadmap_view,
        },
        {
            id: 4,
            title: 'Ideas page views',
            count: widgetData?.idea_view,
        },
    ]

    return (
        <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
            <SheetOverlay className={"inset-0"} />
            <SheetContent className={"lg:max-w-[800px] md:max-w-[620px] sm:max-w-[420px] p-0 outline-none"}>
                <SheetHeader className={"px-4 py-3 md:py-5 lg:px-8 lg:py-[20px] border-b"}>
                    <div className={"flex justify-between items-center w-full"}>
                        <h2 className={"text-xl font-normal"}>Analytics</h2>
                        <X size={18} onClick={onClose} className={"cursor-pointer"} />
                    </div>
                </SheetHeader>
                <div className={"flex flex-col gap-8"}>
                    <div className={"grid lg:grid-cols-2 md:gap-4 gap-3 px-4 py-3 md:py-5 lg:px-8"}>
                        {
                            (widAnalytics || []).map((x, i) => {
                                return (
                                    <Card className={"rounded-lg border bg-card text-card-foreground shadow-sm"} key={i}>
                                        <CardHeader className={"p-3 md:p-4 gap-0.5"}>
                                            <CardTitle className={"text-base text-muted-foreground font-normal"}>
                                                {x.title}
                                            </CardTitle>
                                            <CardContent className={"p-0 flex flex-col gap-2 m-0"}>
                                                <p className={"text-2xl font-medium"}>
                                                    {x.count}
                                                </p>
                                            </CardContent>
                                        </CardHeader>
                                    </Card>
                                )
                            })
                        }
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default WidgetAnalytics;
