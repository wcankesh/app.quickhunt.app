import React, {Fragment, useEffect, useState} from 'react';
import {Check, Eye, EyeOff, GalleryVerticalEnd, Lightbulb, MessageCircleMore, MessageSquare, MessagesSquare, Vote, Zap} from "lucide-react";
import {Button} from "../ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs";
import EmptyData from "../Comman/EmptyData";
import {ApiService} from "../../utils/ApiService";
import {useToast} from "../ui/use-toast";
import {useSelector} from "react-redux";
import moment from "moment";
import {Skeleton} from "../ui/skeleton";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {Card, CardContent} from "../ui/card";
import {Tooltip, TooltipTrigger, TooltipProvider, TooltipContent} from "../ui/tooltip";
import Pagination from "../Comman/Pagination";

const perPageLimit = 10;

const UserActionsList = ({ userActions, sourceTitle, isLoading, selectedTab, isEyeTabActive}) => {
    const filteredActions = isEyeTabActive
        ? userActions.filter(action => action?.is_read === 0)
        : userActions;

    if (isLoading || !filteredActions.length) {
        return (
            <div className="divide-y">
                {isLoading ? (
                    Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className="px-2 py-[10px] md:px-3 flex justify-between gap-2">
                            <Skeleton className="rounded-md w-full h-7 bg-muted-foreground/[0.1]" />
                        </div>
                    ))
                ) : (
                    <EmptyData />
                )}
            </div>
        );
    }

    return (
        <div className={"divide-y"}>
            {(filteredActions || []).map((action, index) => {
                return (
                    <Fragment key={index}>
                        {sourceTitle.map((source, i) => {
                            if (action.source === source.value) {
                                return (
                                    <div onClick={""} className={`px-2 py-[10px] md:px-3 flex gap-4 cursor-pointer ${action?.is_read === 0 ? "bg-muted/[0.6] hover:bg-card" : "bg-card"}`} key={i}>
                                        <div>
                                            <Avatar className={"w-[30px] h-[30px]"}>
                                                <AvatarFallback className={"text-base"}>{action?.customer_first_name && action?.customer_first_name.substring(0, 1).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className={"w-full flex flex-wrap justify-between gap-2"}>
                                        <div className={"flex gap-3"}>
                                            <div className={"space-y-3"}>
                                                <div className={"flex flex-wrap gap-4"}>
                                                    <h2 className={"font-medium"}>{action?.customer_first_name} {action?.customer_last_name}</h2>
                                                    <p className={"font-normal flex gap-2 items-center"}><MessageCircleMore size={15} /><span className={"text-muted-foreground"}>{source.title}</span></p>
                                                </div>
                                                <div>
                                                    {source.value === "post_reactions" ? (
                                                        <div className={"flex items-center gap-2"}>
                                                            <Avatar className={"rounded-none w-[20px] h-[20px]"}>
                                                                <AvatarImage src={action.emoji_url} />
                                                            </Avatar>
                                                            <span className={"text-sm text-muted-foreground text-wrap"}>{action.title}</span>
                                                        </div>
                                                    ) : (
                                                        <span className={"text-sm text-muted-foreground text-wrap"}>{action.title}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <span className={"text-sm text-muted-foreground"}>
                                            {action?.created_at ? moment(action?.created_at).format('D MMM, YYYY') : "-"}
                                        </span>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </Fragment>
                );
            })}
        </div>
    );
};

const Inbox = () => {
    const apiService = new ApiService();
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo") || 1;
    const {toast} = useToast()
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const [userActions, setUserActions] = useState([]);
    const [pageNo, setPageNo] = useState(Number(getPageNo));
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(1);
    const [allRead, setAllRead] = useState(false);
    const [isEyeTabActive, setIsEyeTabActive] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    useEffect(() => {
        if(projectDetailsReducer.id){
            getInboxNotification();
        }
        // navigate(`${baseUrl}/notifications?pageNo=${pageNo}`)
    }, [projectDetailsReducer.id, pageNo, selectedTab])

    const getInboxNotification = async () => {
        setIsLoading(true);
        const payload = {
            project_id: projectDetailsReducer.id,
            type: selectedTab,
            page: pageNo,
            limit: perPageLimit
        }
        const data = await apiService.inboxNotification(payload);
        if(data.status === 200) {
            setUserActions(Array.isArray(data.data) ? data.data : []);
            // toast({description: data.message,});
            const totalPage = Math.ceil(data.total / perPageLimit);
            setTotalPages(totalPage)
            setIsLoading(false)
        } else {
            setIsLoading(false);
            // toast({description:data.message, variant: "destructive",})
        }
    }

    const markAsAllRead = async () => {
        setIsLoading(true);
        const data = await apiService.inboxMarkAllRead({project_id: projectDetailsReducer.id});
        if(data.status === 200) {
            setUserActions([]);
            setAllRead(true);
            toast({description: data.message,});
        } else {
            toast({description:data.message, variant: "destructive",})
        }
        setIsLoading(false);
    }

    const onTabChange = (value) => {
        setSelectedTab(value);
        setAllRead(false);
        setPageNo(1);
        setTotalPages(1);
    }

    const handlePaginationClick = async (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPageNo(newPage);
        }
    };

    const sourceTitle = [
        {title: "Created a Idea", value: "feature_ideas"},
        {title: "Commented on idea", value: "feature_idea_comments"},
        {title: "Upvoted on idea", value: "feature_idea_votes"},
        {title: "Feedback on post", value: "post_feedbacks"},
        {title: "Reaction on post", value: "post_reactions"},
    ]

    const tabs = [
        { label: "All", value: 1, icon: <Zap size={18} className={"mr-2"} />,},
        { label: "Announcement feedback", value: 2, icon: <MessagesSquare size={18} className={"mr-2"} />,},
        { label: "Announcement reaction", value: 3, icon: <GalleryVerticalEnd size={18} className={"mr-2"} />,},
        { label: "Create idea", value: 4, icon: <Lightbulb size={18} className={"mr-2"} />,},
        { label: "Idea comment", value: 5, icon: <MessageSquare size={18} className={"mr-2"} />,},
        { label: "Idea upvote", value: 6, icon: <Vote size={18} className={"mr-2"} />,},
    ];

    const handleToolTipShow = () => {
        setIsEyeTabActive(!isEyeTabActive);
        setIsTooltipVisible(true);
        setTimeout(() => setIsTooltipVisible(false), 2000);
    };

    return (
        <Fragment>
            <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>
                <div className="flex flex-wrap items-center gap-2 justify-between">
                    <div className={"flex flex-col gap-y-0.5"}>
                        <h1 className="text-2xl font-normal flex-initial w-auto">Inbox</h1>
                        <h5 className={"text-sm text-muted-foreground"}>Track announcement feedback and reactions, and stay updated on ideas, their comments, and upvotes.</h5>
                    </div>
                    <div className={"flex gap-3"}>
                        {userActions.length > 0 && !allRead && !isEyeTabActive && (
                            <Button variant={"outline"} className={"flex gap-2 items-center"} onClick={markAsAllRead}><Check size={18}/>Mark all as read</Button>
                        )}
                        <TooltipProvider>
                            {/*<Tooltip open={isTooltipVisible}>*/}
                            <Tooltip>
                                <TooltipTrigger asChild
                                                // onMouseEnter={() => setIsTooltipVisible(true)}
                                                // onMouseLeave={() => setIsTooltipVisible(false)}
                                                // onClick={handleToolTipShow}
                                >
                                    {/*<Button variant="outline" size="icon" className={"h-9"}>*/}
                                        <Button variant="outline" size="icon" onClick={() => setIsEyeTabActive(!isEyeTabActive)} className={"h-9"}>
                                        { isEyeTabActive ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side={"bottom"}>
                                    {isEyeTabActive ? (<p>View all notifications</p>) : (<p>View unread notifications</p>)}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <Card className="my-6">
                    <CardContent className={"p-0"}>
                        <Tabs defaultValue={1} onValueChange={onTabChange}>
                            <div className={"border-b flex bg-background"}>
                                <TabsList className="w-full h-auto overflow-x-auto whitespace-nowrap justify-start">
                                    {(tabs || []).map((tab, i) => (
                                        <TabsTrigger
                                            key={i}
                                            value={tab.value}
                                            className={`text-sm font-medium w-full team-tab-active team-tab-text-active dark:text-card-foreground`}
                                        >
                                            {tab.icon}{tab.label}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>
                            {
                                (tabs || []).map((y, i) => (
                                    <TabsContent key={i} value={y.value} className={"mt-0"}>
                                        <div className={"grid grid-cols-1 overflow-auto whitespace-nowrap"}>
                                            <UserActionsList userActions={userActions} sourceTitle={sourceTitle} isLoading={isLoading} selectedTab={selectedTab} isEyeTabActive={isEyeTabActive}/>
                                        </div>
                                    </TabsContent>
                                ))
                            }
                        </Tabs>
                    </CardContent>
                    {
                        (selectedTab !== 1 && userActions?.length > 0) ?
                            <Pagination
                                pageNo={pageNo}
                                totalPages={totalPages}
                                isLoading={isLoading}
                                handlePaginationClick={handlePaginationClick}
                                stateLength={userActions?.length}
                            /> : ""
                    }
                    {allRead && <div className="text-center text-muted-foreground text-lg font-semibold my-4">You're all caught up!</div>}
                </Card>
            </div>
        </Fragment>
    );
};

export default Inbox;