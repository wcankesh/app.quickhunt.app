import React, {useEffect, useState} from 'react';
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoveLeft} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../utils/constent";
import {Card, CardContent, CardFooter} from "../ui/card";
import {CommSkel} from "../Comman/CommSkel";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {Badge} from "../ui/badge";
import ReadMoreText from "../Comman/ReadMoreText";
import EmptyData from "../Comman/EmptyData";
import {ApiService} from "../../utils/ApiService";
import {useSelector} from "react-redux";
import {Button} from "../ui/button";
import {useTheme} from "../theme-provider";
import Pagination from "../Comman/Pagination";

const perPageLimit = 10

const Comments = () => {
    const {theme} = useTheme()
    let apiSerVice = new ApiService();
    const navigate = useNavigate();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const [isLoading, setIsLoading] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [chartList, setChartList] = useState({
        reactionAnalytic: [],
        guest: [],
        idea: [],
        totalViewCount: 0,
        totalViewCountDiff: 0,
        uniqueViewCount: 0,
        uniqueViewDiff: 0,
        feedbackCount: 0,
        feedbackCountDiff: 0,
        reactionCount: 0,
        reactionCountDiff: 0,
        most_view_post: [],
        feedbackAnalytics: [],
        uniqueViewList: [],
        totalViewViewList: [],
        feedbacks: [
            {
                id: "",
                feedback: "",
                customer_email_id: "",
                customer_name: "",
                created_at: "",
            }
        ],
        reactions: [
            {
                created_at: "",
                customer_name: "",
                post_title: "",
                reaction_id: "",
            }
        ]
    });

    useEffect(() => {
        if(projectDetailsReducer.id){
            getComments();
        }

    },[projectDetailsReducer.id, pageNo])

    const getComments = async () => {
        setIsLoading(true);
        const data = await apiSerVice.dashboardDataFeed({
            project_id: projectDetailsReducer.id,
            page: pageNo,
            limit: perPageLimit
        });
        setIsLoading(false);
        if (data.status === 200) {
            setChartList(data.data)
            setTotalRecord(data.total)
        }
    }

    const totalPages = Math.ceil(totalRecord / perPageLimit);

    const handlePaginationClick = async (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setIsLoading(true);
            setPageNo(newPage);
        } else {
            setIsLoading(false);
        }
    };

    return (
        <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>
            <div className={"flex gap-4 items-center mb-6"}>
                <MoveLeft size={20} onClick={() => navigate(`${baseUrl}/dashboard`)} className={"cursor-pointer"}/>
                <h1 className="text-2xl font-normal flex-initial w-auto">Comments (<span>{totalRecord}</span>)</h1>
            </div>
            <Card>
                {
                    (isLoading) ? CommSkel.commonParagraphFourComments : chartList?.length > 0 ?
                        <CardContent className={"p-0"}>
                            {
                                (chartList || []).map((x, i) => (
                                    <CardContent className={"flex flex-col gap-4 border-b p-2 sm:p-3 lg:p-6"}>
                                        <div className="flex gap-2 items-center justify-between">
                                            <div
                                                className="flex gap-2 items-center cursor-pointer"
                                                onClick={() => {
                                                    if (x.type === 1) {
                                                        navigate(`${baseUrl}/announcements/${x.post_id}`);
                                                    } else if (x.type === 2) {
                                                        navigate(`${baseUrl}/ideas/${x.post_id}`);
                                                    }
                                                }}
                                            >
                                                <div className={"update-idea text-sm rounded-full border text-center"}>
                                                    <Avatar
                                                        className={"w-[20px] h-[20px]"}>
                                                        {
                                                            x.user_photo ?
                                                                <AvatarImage
                                                                    src={x.user_photo}
                                                                    alt=""/>
                                                                :
                                                                <AvatarFallback>{x && x.customer_name && x.customer_name.substring(0, 1).toUpperCase()}</AvatarFallback>
                                                        }
                                                    </Avatar>
                                                </div>
                                                <div className={"flex items-center flex-wrap gap-1 md:gap-2"}>
                                                    <h4 className="text-sm font-semibold">{x.customer_name}</h4>
                                                    <p className="text-xs font-medium text-muted-foreground">{x.customer_email}</p>
                                                </div>
                                            </div>
                                            <Badge
                                                variant={"outline"}
                                                className={`text-xs font-medium text-muted-foreground ${x.type === 1 ? "text-[#3b82f6] border-[#3b82f6]" : "text-[#63c8d9] border-[#63c8d9]"}`}
                                            >
                                                {x.type == 1 ? "Announcement" : "Idea"}
                                            </Badge>
                                        </div>
                                        <p className={"text-xs font-medium text-foreground"}>
                                            <ReadMoreText html={x.comment} />
                                        </p>
                                    </CardContent>
                                ))
                            }
                        </CardContent> : <EmptyData/>
                }

                {
                    chartList?.length > 0 ?
                        <Pagination
                            pageNo={pageNo}
                            totalPages={totalPages}
                            isLoading={isLoading}
                            handlePaginationClick={handlePaginationClick}
                            stateLength={chartList.length}
                        />
                        : ""
                }
            </Card>
        </div>
    );
};

export default Comments;