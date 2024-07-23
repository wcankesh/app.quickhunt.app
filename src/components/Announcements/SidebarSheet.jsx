import React,{useState,useEffect,Fragment} from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader, SheetOverlay,
} from "../ui/sheet";
import {Separator} from "../ui/separator";
import {Icon} from "../../utils/Icon";
import {Button} from "../ui/button";
import {ChevronLeft, ChevronRight, X} from "lucide-react";
import {ApiService} from "../../utils/ApiService";
import {Skeleton} from "../ui/skeleton";
import {useSelector} from "react-redux";
import {useTheme} from "../theme-provider";

const perPageLimit = 15;

const   SidebarSheet = ({ isOpen, onOpen, onClose ,selectedViewAnalyticsRecord}) => {
    const apiService = new ApiService();
    const [feedbackList, setFeedbackList] = useState([])
    const [reactionList, setReactionList] = useState([])
    const [views, setViews] = useState([])
    const [isLoadingReaction, setIsLoadingReaction] = useState(false)
    const [isLoadingFeedBack, setIsLoadingFeedBack] = useState(false)
    const [totalFeedback, setTotalFeedback] = useState(0)
    const [pageNo, setPageNo] = useState(1);
    const allEmoji = useSelector(state => state.allStatusAndTypes.emoji);
    const {theme} = useTheme();

    useEffect(() => {
        getReaction();
    },[])
    useEffect(() => {
        getFeedback()
    },[pageNo])

    const getFeedback = async () => {
        setIsLoadingFeedBack(true)
        const data = await apiService.getFeedback({post_id: selectedViewAnalyticsRecord.id,page: pageNo,limit: perPageLimit})
        if(data.status === 200){
            setFeedbackList(data.data)
            setTotalFeedback(data.total)
            setIsLoadingFeedBack(false)
        } else {
            setIsLoadingFeedBack(false)
        }
    }
    const getReaction = async () => {
        setIsLoadingReaction(true)
        const data = await apiService.getReaction({post_id: selectedViewAnalyticsRecord.id})
        if(data.status === 200){
           setReactionList(data.data.reactions)
            setViews(data.data.views)
            setIsLoadingReaction(false)
        } else {
            setIsLoadingReaction(false)
        }
    }

    return (
            <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
                <SheetOverlay className={"inset-0"} />
                <div>
                    <SheetContent className={"pt-[24px] p-0 max-h-screen overflow-y-auto lg:max-w-[504px]"} >
                        <SheetHeader className={`px-8 py-6 flex flex-row justify-between items-center sticky top-0 z-10 ${theme == "dark" ? "bg-[#020817]" : "bg-[#f8fafc]"}` }>
                            <h5 className={"text-xl font-medium leading-5"}>{selectedViewAnalyticsRecord?.post_title}</h5>
                            <Button className={"h-5 w-5 p-0"} variant={"ghost"}  onClick={onClose}><X className={"h-4 w-4"} size={18} /></Button>
                        </SheetHeader>
                        <Separator className={""} />
                        <div className={"pt-6 px-8 pb-4 pr-16 flex flex-row justify-between"}>
                            <div className={"flex flex-col gap-2"}>
                                <h5 className={" text-base font-semibold leading-5"}>Total Views</h5>
                                { isLoadingReaction ? <Skeleton className={"w-full h-[32px] rounded-md"} /> :<h5 className={"text-2xl font-bold"}>{views && views[0] && views[0].totalView ? views[0].totalView : 0}</h5>}
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <h5 className={"text-base font-semibold leading-5"}>Unique Views</h5>
                                {isLoadingReaction ? <Skeleton className={"w-full h-[32px] rounded-md"} /> : <h5
                                    className={"text-2xl font-bold"}>{views && views[0] && views[0].uniqueView ? views[0].uniqueView : 0}</h5>}
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <h5 className={"text-base font-semibold leading-5"}>Feedback</h5>
                                {isLoadingReaction ? <Skeleton className={"w-full h-[32px] rounded-md"} /> :<h5 className={"text-2xl font-bold"}>{totalFeedback}</h5>}
                            </div>
                        </div>
                        <Separator />
                        <div className={"py-6 px-8 flex flex-col gap-3"}>
                            <h5 className={"text-base font-semibold leading-5"}>Reaction</h5>
                            {feedbackList.length == 0 != <Separator className={"mb-2"}/>}
                            {isLoadingReaction ?  <div className="flex items-center space-x-6">
                                                        <Skeleton className="h-12 w-12 rounded-full" />
                                                        <Skeleton className="h-12 w-12 rounded-full" />
                                                        <Skeleton className="h-12 w-12 rounded-full" />
                                                        <Skeleton className="h-12 w-12 rounded-full" />
                                                    </div>
                             : <div className={"flex flex-row flex-wrap justify-between"}>
                                {
                                    reactionList.length == 0 ?
                                        <p className={"text-muted-foreground text-xs font-medium"}>No reaction received
                                            for this announcement yet</p> : <Fragment>
                                            {
                                                (reactionList || []).map((x, index) => {
                                                    const matchedEmojiObject = (allEmoji || []).find((y) => y.id === x.reaction_id);
                                                    return (
                                                        <div className={"flex w-1/4 mt-1"} key={index}>
                                                            <div className={"flex flex-row gap-2 items-center"}>
                                                                <div>{matchedEmojiObject ? <img className={"h-10 w-10"} src={matchedEmojiObject?.emoji_url}/> : Icon?.smileEmoji2}</div>
                                                                <h5 className={"text-2xl font-bold leading-5"}>{x.total}</h5>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Fragment>
                                }
                            </div>}
                            {feedbackList.length == 0 != <div className={"flex flex-row justify-end items-center gap-3"}>
                                <Button variant={"outline"} className={" h-[30px] w-[30px] p-1.5"}>
                                    <ChevronLeft/>
                                </Button>
                                <h5 className={"text-[14px] font-bold"}>01</h5>
                                <Button variant={"outline"} className={" h-[30px] w-[30px] p-1.5"}>
                                    <ChevronRight className={"stroke-primary"}/>
                                </Button>
                            </div>}
                        </div>
                        <Separator className={"p-0 m-0"}/>
                        <div className={"py-6 px-8 flex flex-col gap-2"}>
                            <h5 className={"text-base font-semibold leading-5"}>Feedback</h5>
                            {
                                isLoadingFeedBack ?
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                 :
                            <div>
                                {
                                    feedbackList.length == 0  ? <p className={"text-muted-foreground text-xs font-medium"}>No feedback received for this announcement yet</p> : <Fragment>
                                        <div className={""}>
                                            {
                                                (feedbackList || []).map((x)=>{
                                                    return(
                                                        <div key={x.id} className={"flex flex-col"}>
                                                            <div className={"flex flex-row gap-4 ml-4 mr-[10px]"}>
                                                                <div className={"flex flex-col gap-1"}>
                                                                    <div className={"flex flex-row gap-4 items-center"}>
                                                                        <h5 className={"text-sm font-semibold leading-5 capitalize"}>{x?.customer_name}</h5>
                                                                        <p className={"text-muted-foreground text-[10px] leading-5 font-medium"}>{x?.customer_email_id}</p>
                                                                    </div>
                                                                    <p className={"text-muted-foreground text-xs font-medium"}>{x.feedback}</p>
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
                                            <Button disabled={true} variant={"outline"}  className={" h-[30px] w-[30px] p-1.5"}>
                                                <ChevronLeft />
                                            </Button>
                                            <h5 className={"text-[14px] font-bold"}>{pageNo}</h5>
                                            <Button variant={"outline"}  className={" h-[30px] w-[30px] p-1.5"}>
                                                <ChevronRight className={"stroke-primary"} />
                                            </Button>
                                        </div>
                                    </Fragment>
                                }
                            </div>
                            }
                        </div>
                </SheetContent>
                </div>
            </Sheet>
    );
};

export default SidebarSheet;