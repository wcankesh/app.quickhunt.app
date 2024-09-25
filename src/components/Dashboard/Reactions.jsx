import React, {Fragment, useEffect, useState} from 'react';
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoveLeft} from "lucide-react";
import {baseUrl} from "../../utils/constent";
import {useTheme} from "../theme-provider";
import {ApiService} from "../../utils/ApiService";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {CommSkel} from "../Comman/CommSkel";
import {Card, CardContent, CardFooter} from "../ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {Badge} from "../ui/badge";
import ReadMoreText from "../Comman/ReadMoreText";
import EmptyData from "../Comman/EmptyData";
import {Button} from "../ui/button";

const perPageLimit = 10

const Reactions = () => {
    const {theme} = useTheme()
    let apiSerVice = new ApiService();
    const navigate = useNavigate();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
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
            getReactions()
        }

    },[projectDetailsReducer.id, pageNo])

    const getReactions = async () => {
        setIsLoading(true);
        const data = await apiSerVice.dashboardDataReactions({
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

    const openReactions = (postId) => {
        navigate(`${baseUrl}/announcements?postId=${postId}`)
    }

    return (
        <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>
            <div className={"flex gap-4 items-center mb-6"}>
                <MoveLeft size={20} onClick={() => navigate(`${baseUrl}/dashboard`)} className={"cursor-pointer"}/>
                <h1 className="text-2xl font-medium flex-initial w-auto">Reactions (<span>{totalRecord}</span>)</h1>
            </div>
            <Card>
                {
                    (isLoading) ? CommSkel.reactionsPageLoading : chartList.length > 0 ?
                        <CardContent className={"p-0"}>
                            {
                                (chartList || []).map((x, i) => {
                                    const emoji = allStatusAndTypes.emoji.find((e) => e.id === x.reaction_id) || { emoji_url: "" };
                                    return (
                                        <Fragment key={i}>
                                            <CardContent className={"p-2 sm:p-3 lg:p-6 border-b"}>
                                                <div className={"flex gap-4"}>
                                                    <Avatar className={"w-[35px] h-[35px]"}>
                                                        <AvatarImage src={emoji.emoji_url} />
                                                    </Avatar>
                                                    <div className={"flex flex-col gap-1"}>
                                                        <div className="flex gap-1 items-center">
                                                            <h4 className="text-sm font-semibold cursor-pointer" onClick={() => openReactions(x.post_id)}>{x.customer_name}</h4>
                                                            <p className="text-xs font-medium text-muted-foreground">Reacted To</p>
                                                        </div>
                                                        <p className="text-xs font-semibold text-foreground">"{x.post_title}"</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Fragment>
                                    );
                                })
                            }
                        </CardContent> : <EmptyData/>
                }

                {
                    chartList.length > 0 ?
                        <CardFooter className={`p-0`}>
                            <div className={`w-full ${theme === "dark" ? "" : "bg-muted"} rounded-b-lg rounded-t-none flex justify-end p-2 md:px-3 md:py-[10px]`}>
                                <div className={"w-full flex gap-2 items-center justify-between sm:justify-end"}>
                                    <div>
                                        <h5 className={"text-sm font-semibold"}>Page {chartList?.length <= 0 ? 0 :pageNo} of {totalPages}</h5>
                                    </div>
                                    <div className={"flex flex-row gap-2 items-center"}>
                                        <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}
                                                onClick={() => handlePaginationClick(1)}
                                                disabled={pageNo === 1 || isLoading}>
                                            <ChevronsLeft
                                                className={pageNo === 1 || isLoading ? "stroke-muted-foreground" : "stroke-primary"} />
                                        </Button>
                                        <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}
                                                onClick={() => handlePaginationClick(pageNo - 1)}
                                                disabled={pageNo === 1 || isLoading}>
                                            <ChevronLeft
                                                className={pageNo === 1 || isLoading ? "stroke-muted-foreground" : "stroke-primary"} />
                                        </Button>
                                        <Button variant={"outline"} className={" h-[30px] w-[30px] p-1.5"}
                                                onClick={() => handlePaginationClick(pageNo + 1)}
                                                disabled={pageNo === totalPages || isLoading || chartList?.length <= 0}>
                                            <ChevronRight
                                                className={pageNo === totalPages || isLoading || chartList?.length <= 0 ? "stroke-muted-foreground" : "stroke-primary"} />
                                        </Button>
                                        <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}
                                                onClick={() => handlePaginationClick(totalPages)}
                                                disabled={pageNo === totalPages || isLoading || chartList?.length <= 0}>
                                            <ChevronsRight
                                                className={pageNo === totalPages || isLoading || chartList?.length <= 0 ? "stroke-muted-foreground" : "stroke-primary"} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardFooter>
                        : ""
                }
            </Card>
        </div>
    );
};

export default Reactions;