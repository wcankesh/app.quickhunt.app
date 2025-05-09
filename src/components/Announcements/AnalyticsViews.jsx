import React, {useState, useEffect, Fragment} from 'react';
import {Separator} from "../ui/separator";
import {Icon} from "../../utils/Icon";
import {Button} from "../ui/button";
import {ChevronLeft, ChevronRight, X} from "lucide-react";
import {Skeleton} from "../ui/skeleton";
import {useDispatch, useSelector} from "react-redux";
import ReadMoreText from "../Comman/ReadMoreText";
import {useLocation} from "react-router";
import {Card, CardContent} from "../ui/card";
import CommonBreadCrumb from "../Comman/CommonBreadCrumb";
import {inboxMarkReadAction} from "../../redux/action/InboxMarkReadAction";
import {apiService} from "../../utils/constent";

const perPageLimit = 10;

const AnalyticsViews = () => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const postId = urlParams.get("id");
    const getPageNo = urlParams.get("pageNo") || 1;
    const dispatch = useDispatch();
    const allEmoji = useSelector(state => state.allStatusAndTypes.emoji);
    const inboxMarkReadReducer = useSelector(state => state.inboxMarkRead);
    const [analyticsObj, setAnalyticsObj] = useState({})
    const [feedbackList, setFeedbackList] = useState([])
    const [reactionList, setReactionList] = useState([])
    const [views, setViews] = useState([])
    const [totalFeedback, setTotalFeedback] = useState(0)
    const [pageNo, setPageNo] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [isLoadingReaction, setIsLoadingReaction] = useState(false)
    const [isLoadingFeedBack, setIsLoadingFeedBack] = useState(false)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (postId) {
            getReaction();
            getFeedback();
        }
    }, [postId, pageNo]);

    useEffect(() => {
        if(!analyticsObj?.title){
            const getSinglePosts = async () => {
                const data = await apiService.getSinglePosts(postId);
                if (data.success) {
                    setAnalyticsObj(data.data.data)
                    const updateInbox = inboxMarkReadReducer.map(item => {
                        if ((item.source === 'post_feedbacks' || item.source === 'post_reactions') && item.id === data.data.data.id) {
                            return {...item, isRead: 1};
                        }
                        return item;
                    });
                    dispatch(inboxMarkReadAction(updateInbox));
                }
            }
            getSinglePosts()
        }

    }, [getPageNo])

    const getFeedback = async () => {
        setIsLoadingFeedBack(true);
        setIsLoading(true);
        const data = await apiService.getFeedback(postId);
        if (data.success) {
            setFeedbackList(data.data.data);
            setTotalFeedback(data.data.total);
            setTotalRecord(data.data.total);
        }
        setIsLoadingFeedBack(false);
        setIsLoading(false);
    };

    const getReaction = async () => {
        setIsLoadingReaction(true)
        const data = await apiService.getReaction(postId)
        setIsLoadingReaction(false)
        if (data.success) {
            setReactionList(data.data.reactions)
            setViews(data.data.views)
        }
    }

    const totalPages = Math.ceil(totalRecord / perPageLimit);

    const handlePaginationClick = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPageNo(newPage);
        }
    };

    const analyticsViews = [
        {
            id: 1,
            title: "Total Views",
            count: views && views[0] && views[0].totalView ? views[0].totalView : 0,
        },
        {
            id: 2,
            title: "Unique Views",
            count: views && views[0] && views[0].uniqueView ? views[0].uniqueView : 0,
        },
        {
            id: 3,
            title: "Feedback",
            count: totalFeedback,
        },
    ]

    const links = [
        { label: 'Announcement', path: `/announcements?pageNo=${getPageNo}` }
    ];

    return (
        <Fragment>
            <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>
                <div className={"pb-6"}>
                    <CommonBreadCrumb
                        links={links}
                        currentPage={analyticsObj?.title}
                        truncateLimit={30}
                    />
                </div>
                <div className={"flex flex-col gap-4"}>
                    <Card>
                        <CardContent className={"p-0"}>
                            <div className={"grid md:grid-cols-3 sm:grid-cols-1"}>
                                {
                                    (analyticsViews || []).map((x, i) => {
                                        return (
                                            <Fragment key={i}>
                                                {
                                                    isLoadingReaction ?
                                                        <div className={"space-y-[14px] w-full p-4 border-b md:border-r md:border-0 last:border-b-0 last:border-r-0"}>
                                                            <Skeleton className="h-4"/>
                                                            <Skeleton className="h-4"/></div> :
                                                        <div className={`p-4 border-b md:border-r md:border-0 last:border-b-0 last:border-r-0`}>
                                                            <h3 className={"text-base font-medium"}>{x.title}</h3>
                                                            <div className={"flex gap-1"}>
                                                                <h3 className={`text-2xl font-medium`}>{x.count}</h3>
                                                            </div>
                                                        </div>
                                                }
                                            </Fragment>
                                        )
                                    })
                                }
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className={"p-4"}>
                            <div className={"flex flex-col gap-3"}>
                                <h5 className={"text-base font-medium leading-5"}>Reaction</h5>
                                {isLoadingReaction ? <div className="flex gap-4 items-center">
                                        {[...Array(4)].map((_, i) => {
                                            return (<Skeleton key={i} className="h-12 w-12 rounded-full"/>)
                                        })}
                                    </div>
                                    : <div className={"flex flex-row flex-wrap gap-4"}>
                                        {
                                            reactionList.length == 0 ?
                                                <p className={"text-muted-foreground text-xs font-normal"}>No reaction received
                                                    for this announcement yet</p> : <Fragment>
                                                    {
                                                        (reactionList || []).map((x, index) => {
                                                            const matchedEmojiObject = (allEmoji || []).find((y) => y.id === x.reactionId);
                                                            return (
                                                                <div className={""} key={index}>
                                                                    <div className={"flex flex-row gap-2 items-center"}>
                                                                        {matchedEmojiObject ? <img className={"h-10 w-10"}
                                                                                                   src={matchedEmojiObject?.emojiUrl}/> : Icon?.smileEmoji2}
                                                                        <h5 className={"text-2xl font-medium"}>{x.total}</h5>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </Fragment>
                                        }
                                    </div>}

                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className={"p-4"}>
                            {/*<div className={"flex flex-col gap-4"}>*/}
                            <div className={"space-y-4"}>
                                <h5 className={"text-base font-medium leading-5"}>Feedback</h5>
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
                                                    <p className={"text-muted-foreground text-xs font-normal"}>No feedback
                                                        received for this announcement yet</p> :
                                                    <div>
                                                        {
                                                            (feedbackList || []).map((x, i) => {
                                                                return (
                                                                    <div key={i} className={"py-4 first:pt-0 border-b"}>
                                                                        {/*<div className={"flex flex-row gap-4"}>*/}
                                                                            <div className={"flex flex-col gap-1"}>
                                                                                <div className={"flex gap-4 items-center"}>
                                                                                    <h5 className={"text-sm font-medium"}>{x?.user.name ? x?.user.name : x?.user.firstName + "" + x?.user.lastName}</h5>
                                                                                    <p className={"text-muted-foreground text-[10px] font-normal"}>{x?.user.email}</p>
                                                                                </div>
                                                                                <div className={"text-muted-foreground text-xs font-normal"}>
                                                                                    <ReadMoreText className={"text-xs"} html={x.feedback}/>
                                                                                </div>
                                                                            </div>
                                                                        {/*</div>*/}
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                        <div className={"flex flex-row justify-end items-center gap-3 pt-4"}>
                                                            <Button
                                                                disabled={pageNo === 1 || isLoading}
                                                                variant={"outline"}
                                                                className={"h-[30px] w-[30px] p-1.5"}
                                                                onClick={() => handlePaginationClick(pageNo - 1)}
                                                            >
                                                                <ChevronLeft
                                                                    className={pageNo === 1 || isLoading ? "stroke-muted-foreground" : "stroke-primary"}/>
                                                            </Button>
                                                            <h5 className={"text-[14px] font-medium"}>{pageNo}</h5>
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Fragment>
    );
};

export default AnalyticsViews;