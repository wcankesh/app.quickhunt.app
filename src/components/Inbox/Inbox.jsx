import React, {Fragment, useEffect, useState} from 'react';
import {Check, Eye, EyeOff, GalleryVerticalEnd, Lightbulb, MessageCircleMore, MessageSquare, MessagesSquare, Vote, Zap} from "lucide-react";
import {Button} from "../ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs";
import EmptyData from "../Comman/EmptyData";
import {useToast} from "../ui/use-toast";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {Skeleton} from "../ui/skeleton";
import {Avatar, AvatarImage} from "../ui/avatar";
import {Card, CardContent} from "../ui/card";
import {Tooltip, TooltipTrigger, TooltipProvider, TooltipContent} from "../ui/tooltip";
import Pagination from "../Comman/Pagination";
import {useNavigate} from "react-router";
import {inboxMarkReadAction} from "../../redux/action/InboxMarkReadAction";
import {UserAvatar} from "../Comman/CommentEditor";
import {apiService} from "../../utils/constent";

const perPageLimit = 10;

const TabTitle = {
    1: "all",
    2: "post_feedbacks",
    3: "post_reactions",
    4: "feature_ideas",
    5: "feature_idea_comments",
    6: "feature_idea_votes",
}

const UserActionsList = ({
                             userActions,
                             sourceTitle,
                             isLoading,
                             isEyeTabActive,
                         }) => {
    const navigate = useNavigate();

    const filteredActions = isEyeTabActive
        ? userActions.filter(action => action?.isRead === 0)
        : userActions;

    if (isLoading || !filteredActions.length) {
        return (
            <div className="divide-y">
                {isLoading ? (
                    Array.from({length: 10}).map((_, index) => (
                        <div key={index} className="px-2 py-[10px] md:px-3 flex justify-between gap-2">
                            <Skeleton className="rounded-md w-full h-7 bg-muted-foreground/[0.1]"/>
                        </div>
                    ))
                ) : (
                    <EmptyData/>
                )}
            </div>
        );
    }

    const navigateAction = async (id, source) => {
        if (source === "feature_ideas" || source === "feature_idea_comments" || source === "feature_idea_votes") {
            navigate(`/ideas/${id}`);
        } else if (source === "post_feedbacks" || source === "post_reactions") {
            navigate(`/announcements/analytic-view?id=${id}`);
        }
    }

    return (
        <div className={"divide-y"}>
            {(filteredActions || []).map((action, index) => {
                return (
                    <Fragment key={index}>
                        {sourceTitle.map((source, i) => {
                            if (action.source === source.value) {
                                return (
                                    <div onClick={() => navigateAction(action?.id, action.source)}
                                         className={`px-2 py-[10px] md:px-3 flex gap-4 cursor-pointer last:rounded-b-lg ${action?.isRead === 0 ? "bg-muted/[0.6] hover:bg-card" : "bg-card"}`}
                                         key={i}>
                                        <div>
                                            <UserAvatar
                                                userPhoto={action?.userPhoto}
                                                userName={action?.customerFirstName && action?.customerFirstName.substring(0, 1).toUpperCase()}
                                                className={"w-[30px] h-[30px]"}
                                            />
                                        </div>
                                        <div className={"w-full flex flex-wrap justify-between gap-2"}>
                                            <div className={"flex gap-3"}>
                                                <div className={"space-y-3"}>
                                                    <div
                                                        className={`${action?.isRead === 0 ? "font-medium" : "font-normal"} flex flex-wrap gap-2 md:gap-4`}>
                                                        <h2>{action?.customerFirstName} {action?.customerLastName}</h2>
                                                        <p className={`flex gap-2 items-center`}><MessageCircleMore
                                                            size={15}/><span
                                                            className={`text-muted-foreground`}>{source.title}</span>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        {source.value === "post_reactions" ? (
                                                            <div className={"flex items-center gap-2"}>
                                                                <Avatar className={"rounded-none w-[20px] h-[20px]"}>
                                                                    <AvatarImage src={action.emojiUrl}/>
                                                                </Avatar>
                                                                <span
                                                                    className={"text-sm text-muted-foreground text-wrap"}>{action.title}</span>
                                                            </div>
                                                        ) : (
                                                            <span
                                                                className={"text-sm text-muted-foreground text-wrap"}>{action.title}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={"text-sm text-muted-foreground"}>
                                            {action?.createdAt ? moment(action?.createdAt).format('D MMM, YYYY h:mm A') : "-"}
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
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo") || 1;
    const {toast} = useToast();
    const dispatch = useDispatch();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const [userActions, setUserActions] = useState([]);
    const [pageNo, setPageNo] = useState(Number(getPageNo));
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(1);
    const [isEyeTabActive, setIsEyeTabActive] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [showMarkAllRead, setShowMarkAllRead] = useState(false);

    useEffect(() => {
        if (projectDetailsReducer.id) {
            getInboxNotification();
        }
    }, [projectDetailsReducer.id, pageNo, selectedTab, isEyeTabActive])

    useEffect(() => {
        const filteredActions = isEyeTabActive
            ? userActions.filter(action => action?.isRead === 0)
            : userActions;
        const hasUnread = filteredActions.some(action => action?.isRead === 0);
        setShowMarkAllRead(hasUnread);
    }, [userActions, isEyeTabActive]);

    const getInboxNotification = async () => {
        setIsLoading(true);
        const payload = {
            projectId: projectDetailsReducer.id,
            type: selectedTab,
            page: pageNo,
            limit: perPageLimit,
            isRead: isEyeTabActive ? 1 : 0
        }
        const data = await apiService.inboxNotification(payload);
        if (data.success) {
            setUserActions(Array.isArray(data.data.data) ? data.data.data : []);
            const totalPage = Math.ceil(data.data.total / perPageLimit);
            setTotalPages(totalPage)
            setIsLoading(false)
        } else {
            setIsLoading(false);
        }
    }

    const markAsAllRead = async () => {
        setIsLoading(true);
        const data = await apiService.inboxMarkAllRead({projectId: projectDetailsReducer.id, type: selectedTab});
        if (data.success) {
            const updatedActions = userActions.map((action) =>
                action.source === TabTitle[selectedTab] ? {...action, isRead: 1} : selectedTab === 1 ? {
                    ...action,
                    isRead: 1
                } : action
            );
            setUserActions(updatedActions);
            dispatch(inboxMarkReadAction(updatedActions));
            toast({description: data.message,});
        } else {
            toast({description: data?.error?.message, variant: "destructive",})
        }
        setIsLoading(false);
    }

    const onTabChange = (value) => {
        setSelectedTab(value);
        setPageNo(1);
        setTotalPages(1);
    }

    const handlePaginationClick = async (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPageNo(newPage);
        }
    };

    const sourceTitle = [
        {title: "Created an Idea", value: "feature_ideas"},
        {title: "Commented on Idea", value: "feature_idea_comments"},
        {title: "Upvoted on Idea", value: "feature_idea_votes"},
        {title: "Feedback on Post", value: "post_feedbacks"},
        {title: "Reacted on Post", value: "post_reactions"},
    ]

    const tabs = [
        {label: "All", value: 1, icon: <Zap size={18} className={"mr-2"}/>,},
        {label: "Announcement feedback", value: 2, icon: <MessagesSquare size={18} className={"mr-2"}/>,},
        {label: "Announcement reaction", value: 3, icon: <GalleryVerticalEnd size={18} className={"mr-2"}/>,},
        {label: "Create idea", value: 4, icon: <Lightbulb size={18} className={"mr-2"}/>,},
        {label: "Idea comment", value: 5, icon: <MessageSquare size={18} className={"mr-2"}/>,},
        {label: "Idea upvote", value: 6, icon: <Vote size={18} className={"mr-2"}/>,},
    ];

    return (
        <Fragment>
            <div
                className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>
                <div className="flex flex-wrap items-center gap-2 justify-between">
                    <div className={"flex flex-col gap-y-0.5"}>
                        <h1 className="text-2xl font-normal flex-initial w-auto">Inbox</h1>
                        <h5 className={"text-sm text-muted-foreground"}>Track announcement feedback and reactions, and
                            stay updated on ideas, their comments, and upvotes.</h5>
                    </div>
                    <div className={"flex gap-3"}>
                        {showMarkAllRead && (
                            <Button variant={"outline"} className={"flex gap-2 items-center"}
                                    onClick={markAsAllRead}><Check size={18}/>Mark all as read</Button>
                        )}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon"
                                            onClick={() => setIsEyeTabActive(!isEyeTabActive)} className={"h-9"}>
                                        {isEyeTabActive ? <EyeOff size={18}/> : <Eye size={18}/>}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side={"bottom"}>
                                    {isEyeTabActive ? (<p>View all notifications</p>) : (
                                        <p>View unread notifications</p>)}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <Card className="my-6">
                    <CardContent className={"p-0"}>
                        <Tabs defaultValue={1} onValueChange={onTabChange}>
                            <div className={"border-b flex bg-background"}>
                                <TabsList
                                    className="w-full h-auto overflow-x-auto whitespace-nowrap justify-start last:rounded-t-lg">
                                    {(tabs || []).map((tab, i) => (
                                        <TabsTrigger
                                            key={i}
                                            value={tab.value}
                                            className={`text-sm font-medium w-full team-tab-active team-tab-text-active text-slate-900 dark:text-white`}
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
                                            <UserActionsList
                                                userActions={userActions}
                                                sourceTitle={sourceTitle} isLoading={isLoading}
                                                isEyeTabActive={isEyeTabActive}/>
                                        </div>
                                    </TabsContent>
                                ))
                            }
                        </Tabs>
                    </CardContent>
                    {
                        (!isLoading && selectedTab !== 1 && userActions?.length > 0) ?
                            <Pagination
                                pageNo={pageNo}
                                totalPages={totalPages}
                                isLoading={isLoading}
                                handlePaginationClick={handlePaginationClick}
                                stateLength={userActions?.length}
                            /> : ""
                    }
                </Card>
            </div>
        </Fragment>
    );
};

export default Inbox;