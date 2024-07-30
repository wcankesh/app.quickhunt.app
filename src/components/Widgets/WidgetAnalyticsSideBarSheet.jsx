import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetOverlay } from "../ui/sheet";
import { X } from "lucide-react";

const WidgetAnalyticsSideBarSheet = ({ isOpen, onOpen, onClose, widgetsSetting, selectedRecordAnalytics }) => {

    const widgetData = widgetsSetting.find(widget => widget.id == selectedRecordAnalytics) || {};

    return (
        <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
            <SheetOverlay className={"inset-0"} />
            <SheetContent className={"lg:max-w-[800px] md:max-w-[620px] sm:max-w-[420px] p-0 outline-none"}>
                <SheetHeader className={"px-4 py-3 md:py-5 lg:px-8 lg:py-[20px] border-b"}>
                    <div className={"flex justify-between items-center w-full"}>
                        <h2 className={"text-xl font-medium"}>Analytics</h2>
                        <X size={18} onClick={onClose} className={"cursor-pointer"} />
                    </div>
                </SheetHeader>
                <div className={"px-4 py-3 md:py-5 lg:px-8 flex flex-col gap-2 md:flex-row justify-between"}>
                    <div className={"flex flex-col gap-1"}>
                        <h5 className={"text-base text-muted-foreground font-normal"}>Widget views</h5>
                        <p className={"text-2xl font-semibold"}>{widgetData?.widget_view}</p>
                    </div>
                    <div className={"flex flex-col gap-1"}>
                        <h5 className={"text-base text-muted-foreground font-normal"}>Announcement views</h5>
                        <p className={"text-2xl font-semibold"}>{widgetData?.announcement_view}</p>
                    </div>
                    <div className={"flex flex-col gap-1"}>
                        <h5 className={"text-base text-muted-foreground font-normal"}>Roadmap views</h5>
                        <p className={"text-2xl font-semibold"}>{widgetData?.roadmap_view}</p>
                    </div>
                    <div className={"flex flex-col gap-1"}>
                        <h5 className={"text-base text-muted-foreground font-normal"}>Ideas page views</h5>
                        <p className={"text-2xl font-semibold"}>{widgetData?.idea_view}</p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default WidgetAnalyticsSideBarSheet;




























// import React, {useEffect, useState} from 'react';
// import { Sheet, SheetContent, SheetHeader, SheetOverlay } from "../ui/sheet";
// import { X } from "lucide-react";
// import { useParams } from "react-router";
// import {ApiService} from "../../utils/ApiService";
//
// const WidgetAnalyticsSideBarSheet = ({ isOpen, onOpen, onClose, selectedWidget, widgetsSetting }) => {
//     let apiSerVice = new ApiService();
//     const [isLoading, setIsLoading] = useState(false);
//     const [analy, setAnaly] = useState([]);
//
//     console.log("widgetsSetting", widgetsSetting[0]?.announcement_view)
//
//     useEffect(() => {
//             getWidgetsSetting()
//     }, [])
//
//     const getWidgetsSetting = async () => {
//         setIsLoading(true)
//         const data = await apiSerVice.getWidgets()
//         if (data.status === 200) {
//             setAnaly({...data.data});
//             setIsLoading(false);
//         } else {
//             setIsLoading(false);
//         }
//     }
//
//
//     return (
//         <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
//             <SheetOverlay className={"inset-0"} />
//             <SheetContent className={"lg:max-w-[800px] md:max-w-[620px] sm:max-w-[420px] p-0 outline-none"}>
//                 <SheetHeader className={"px-[32px] py-[22px] border-b"}>
//                     <div className={"flex justify-between items-center w-full"}>
//                         <h2 className={"text-xl font-medium"}>Analytics</h2>
//                         <X size={18} onClick={onClose} className={"cursor-pointer"} />
//                     </div>
//                 </SheetHeader>
//                 <div className={"pt-6 px-8 pb-4 pr-16 flex flex-row justify-between"}>
//                     <div className={"flex flex-col gap-1"}>
//                         <h5 className={"text-base text-muted-foreground font-normal"}>Widget views</h5>
//                         <p className={"text-2xl font-semibold"}>{widgetsSetting[0]?.widget_view}</p>
//                     </div>
//                     <div className={"flex flex-col gap-1"}>
//                         <h5 className={"text-base text-muted-foreground font-normal"}>Announcement views</h5>
//                         <p className={"text-2xl font-semibold"}>{widgetsSetting[0]?.announcement_view}</p>
//                     </div>
//                     <div className={"flex flex-col gap-1"}>
//                         <h5 className={"text-base text-muted-foreground font-normal"}>Roadmap views</h5>
//                         <p className={"text-2xl font-semibold"}>{widgetsSetting[0]?.roadmap_view}</p>
//                     </div>
//                     <div className={"flex flex-col gap-1"}>
//                         <h5 className={"text-base text-muted-foreground font-normal"}>Ideas page views</h5>
//                         <p className={"text-2xl font-semibold"}>{widgetsSetting[0]?.idea_view}</p>
//                     </div>
//                 </div>
//             </SheetContent>
//         </Sheet>
//     );
// };
//
// export default WidgetAnalyticsSideBarSheet;
