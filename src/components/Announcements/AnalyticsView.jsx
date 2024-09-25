import React, {useState, useEffect, Fragment} from 'react';
import {Sheet, SheetContent, SheetHeader, SheetOverlay,} from "../ui/sheet";
import {Separator} from "../ui/separator";
import {Icon} from "../../utils/Icon";
import {Button} from "../ui/button";
import {ChevronLeft, ChevronRight, X} from "lucide-react";
import {ApiService} from "../../utils/ApiService";
import {Skeleton} from "../ui/skeleton";
import {useSelector} from "react-redux";
import ReadMoreText from "../Comman/ReadMoreText";
import {useNavigate, useLocation} from "react-router";

const perPageLimit = 10;

const AnalyticsView = ({isOpen, onOpen, onClose, selectedViewAnalyticsRecord}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const apiService = new ApiService();
    const [feedbackList, setFeedbackList] = useState([])
    const [reactionList, setReactionList] = useState([])
    const [views, setViews] = useState([])
    const [isLoadingReaction, setIsLoadingReaction] = useState(false)
    const [isLoadingFeedBack, setIsLoadingFeedBack] = useState(false)
    const [totalFeedback, setTotalFeedback] = useState(0)
    const [pageNo, setPageNo] = useState(1);
    const allEmoji = useSelector(state => state.allStatusAndTypes.emoji);
    const [totalRecord, setTotalRecord] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (selectedViewAnalyticsRecord?.id) {
            getReaction();
            getFeedback();
        }
    }, [selectedViewAnalyticsRecord?.id, pageNo]);

    const getFeedback = async () => {
        setIsLoadingFeedBack(true);
        setIsLoading(true);
        const data = await apiService.getFeedback({
            post_id: selectedViewAnalyticsRecord.id,
            page: pageNo,
            limit: perPageLimit
        });
        if (data.status === 200) {
            setFeedbackList(data.data);
            setTotalFeedback(data.total);
            setTotalRecord(data.total);
        }
        setIsLoadingFeedBack(false);
        setIsLoading(false);
    };

    const getReaction = async () => {
        setIsLoadingReaction(true)
        const data = await apiService.getReaction({post_id: selectedViewAnalyticsRecord.id})
        if (data.status === 200) {
            setReactionList(data.data.reactions)
            setViews(data.data.views)
            setIsLoadingReaction(false)
        } else {
            setIsLoadingReaction(false)
        }
    }

    const totalPages = Math.ceil(totalRecord / perPageLimit);

    const handlePaginationClick = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPageNo(newPage);
        }
    };

    const handleClose = () => {
        onClose();
        navigate(location.pathname);
    };

    return (
        <Sheet open={isOpen} onOpenChange={isOpen ? handleClose : onOpen}>
            <SheetOverlay className={"inset-0"}/>
            <SheetContent className={"pt-6 p-0 lg:max-w-[504px]"}>
                {/*<SheetHeader className={`px-4 py-5 lg:px-8 lg:py-[20px] border-b text-left flex flex-row justify-between items-center gap-3 border-b`}>*/}
                <SheetHeader className={`px-4 py-5 lg:p-6 border-b text-left flex flex-row justify-between items-center gap-3 border-b`}>
                    <h5 className={"text-sm md:text-xl font-medium"}>{selectedViewAnalyticsRecord?.post_title}</h5>
                    <X size={30} className={"cursor-pointer m-0"} onClick={handleClose}/>
                </SheetHeader>
                <div className={"overflow-auto h-[calc(100vh_-_79px)] pb-2"}>
                    {/*<div className={"pt-4 px-4 pb-3 pr-8 md:pt-8 md:px-8 md:pb-6 md:pr-16 flex flex-row justify-between gap-2 border-b "}>*/}
                    <div className={"p-6 flex flex-row justify-between gap-2 border-b "}>
                        <div className={"flex flex-col gap-2"}>
                            <h5 className={"text-sm md:text-base font-semibold"}>Total Views</h5>
                            {isLoadingReaction ? <Skeleton className={"w-full h-8 rounded-md"}/> :
                                <h5 className={"text-xl md:text-2xl font-bold"}>{views && views[0] && views[0].totalView ? views[0].totalView : 0}</h5>}
                        </div>
                        <div className={"flex flex-col gap-2"}>
                            <h5 className={"text-sm md:text-base font-semibold"}>Unique Views</h5>
                            {isLoadingReaction ? <Skeleton className={"w-full h-8 rounded-md"}/> : <h5
                                className={"text-xl md:text-2xl font-bold"}>{views && views[0] && views[0].uniqueView ? views[0].uniqueView : 0}</h5>}
                        </div>
                        <div className={"flex flex-col gap-2"}>
                            <h5 className={"text-sm md:text-base font-semibold"}>Feedback</h5>
                            {isLoadingReaction ? <Skeleton className={"w-full h-8 rounded-md"}/> :
                                <h5 className={"text-xl md:text-2xl font-bold"}>{totalFeedback}</h5>}
                        </div>
                    </div>
                    <div className={"p-6 flex flex-col gap-3 border-b"}>
                        <h5 className={"text-base font-semibold leading-5"}>Reaction</h5>
                        {isLoadingReaction ? <div className="flex items-center space-x-6">
                                {[...Array(4)].map((_, i) => {
                                    return (<Skeleton key={i} className="h-12 w-12 rounded-full"/>)
                                })}
                            </div>
                            : <div className={"flex flex-row flex-wrap gap-4"}>
                                {
                                    reactionList.length == 0 ?
                                        <p className={"text-muted-foreground text-xs font-medium"}>No reaction received
                                            for this announcement yet</p> : <Fragment>
                                            {
                                                (reactionList || []).map((x, index) => {
                                                    const matchedEmojiObject = (allEmoji || []).find((y) => y.id === x.reaction_id);
                                                    return (
                                                        <div className={"flex w-1/4"} key={index}>
                                                            <div className={"flex flex-row gap-2 items-center"}>
                                                                {matchedEmojiObject ? <img className={"h-10 w-10"}
                                                                                           src={matchedEmojiObject?.emoji_url}/> : Icon?.smileEmoji2}
                                                                <h5 className={"text-2xl font-bold leading-5"}>{x.total}</h5>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Fragment>
                                }
                            </div>}

                    </div>
                    <div className={"p-6 flex flex-col gap-4"}>
                        <h5 className={"text-base font-semibold leading-5"}>Feedback</h5>
                        {
                            isLoadingFeedBack ?
                                <div>
                                    {
                                        [...Array(3)].map((_, i) => {
                                            return (
                                                <div key={i} className="space-y-2 mt-3">
                                                    <Skeleton className="h-4 w-full"/>
                                                    <Skeleton className="h-4 w-full"/>
                                                    <Separator/>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                :
                                <Fragment>
                                    {
                                        feedbackList.length == 0 ?
                                            <p className={"text-muted-foreground text-xs font-medium"}>No feedback
                                                received for this announcement yet</p> :
                                            <div>
                                                {
                                                    (feedbackList || []).map((x) => {
                                                        return (
                                                            <div key={x.id}
                                                                 className={"flex flex-col py-4 first:pt-0 border-b"}>
                                                                <div className={"flex flex-row gap-4 ml-4 mr-[10px]"}>
                                                                    <div className={"flex flex-col gap-1"}>
                                                                        <div
                                                                            className={"flex flex-row gap-4 items-center"}>
                                                                            <h5 className={"text-sm font-semibold leading-5 capitalize"}>{x?.customer_name}</h5>
                                                                            <p className={"text-muted-foreground text-[10px] leading-5 font-medium"}>{x?.customer_email_id}</p>
                                                                        </div>
                                                                        <p className={"text-muted-foreground text-xs font-medium"}>
                                                                            <ReadMoreText className={"text-xs"}
                                                                                          html={x.feedback}/>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                <div className={"flex flex-row justify-end items-center gap-3 py-4"}>
                                                    <Button
                                                        disabled={pageNo === 1 || isLoading}
                                                        variant={"outline"}
                                                        className={"h-[30px] w-[30px] p-1.5"}
                                                        onClick={() => handlePaginationClick(pageNo - 1)}
                                                    >
                                                        <ChevronLeft
                                                            className={pageNo === 1 || isLoading ? "stroke-muted-foreground" : "stroke-primary"}/>
                                                    </Button>
                                                    <h5 className={"text-[14px] font-bold"}>{pageNo}</h5>
                                                    <Button
                                                        disabled={pageNo === totalPages || isLoading}
                                                        variant={"outline"}
                                                        className={"h-[30px] w-[30px] p-1.5"}
                                                        onClick={() => handlePaginationClick(pageNo + 1)}
                                                    >
                                                        <ChevronRight
                                                            className={pageNo === totalPages || isLoading ? "stroke-muted-foreground" : "stroke-primary"}/>
                                                    </Button>
                                                </div>
                                            </div>
                                    }
                                </Fragment>
                        }


                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default AnalyticsView;