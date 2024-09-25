import React, {Fragment, useEffect, useState} from "react"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "../ui/card"
import moment from "moment";
import {ApiService} from "../../utils/ApiService";
import {useSelector} from "react-redux";
import EmptyData from "../Comman/EmptyData";
import {CommSkel} from "../Comman/CommSkel";
import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts"
import {ChartContainer, ChartTooltip, ChartTooltipContent,} from "../ui/chart"
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import ReadMoreText from "../Comman/ReadMoreText";
import {DateRangePicker} from "../ui/date-range-picker";
import {Button} from "../ui/button";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../utils/constent";
import {Badge} from "../ui/badge";


const chartConfig = {
    totalView: {
        label: "Total View",
        color: "#7c3bed80",
    },
    uniqueView: {
        label: "Unique View",
        color: "#7c3aed",
    },
}

export function Dashboard() {
    let apiSerVice = new ApiService();
    const navigate = useNavigate();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const [isLoading, setIsLoading] = useState(false);
    const [dataAvailable, setDataAvailable] = useState(true);
    const [showAllFeedbacks, setShowAllFeedbacks] = useState(false);
    const [showAllReactions, setShowAllReactions] = useState(false);
    const [state, setState] = useState({
        from: new Date(new Date().setDate(new Date().getDate() - 29)),
        to: new Date(),
    });

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
        if (projectDetailsReducer.id) {
            dashboardData()
        }

    }, [projectDetailsReducer.id, state])

    const dashboardData = async () => {
        setIsLoading(true)
        const payload = {
            project_id: projectDetailsReducer.id,
            start_date: moment(state.from).format("DD-MM-YYYY"),
            end_date: moment(state.to).format("DD-MM-YYYY"),
        }
        const data = await apiSerVice.dashboardData(payload)
        if (data.status === 200) {
            const feedbackAnalytics = data.data.feedbackAnalytics.map((j) => ({
                x: new Date(j.x),
                y: parseInt(j.y),
            }));

            setChartList({
                ...data.data,
                totalViewViewList: data.data.viewsAnalytic,
                feedbackAnalytics: feedbackAnalytics
            })
            setIsLoading(false)
            setDataAvailable(data.data.viewsAnalytic.length > 0);
        } else {

        }
    }

    const onChangeDate = (selected) => {
        if (selected && selected.from && selected.to) {
            setState({
                from: selected.from,
                to: selected.to,
            });
        }
    }

    const programAnalytics = [
        {
            id: 1,
            title: "Total Views",
            compareText: (<span>
                <span className={chartList.totalViewCountDiff < 0 ? 'text-destructive' : 'text-primary'}>
                    {parseFloat(chartList.totalViewCountDiff).toFixed(2)}%
            </span> {" from last month"} </span>
            ),
            count: chartList.totalViewCount || 0,
        },
        {
            id: 2,
            title: "Unique Views",
            compareText: (<span>
                <span className={chartList.uniqueViewDiff < 0 ? 'text-destructive' : 'text-primary'}>
                    {parseFloat(chartList.uniqueViewDiff).toFixed(2)}%
            </span> {" from last month"} </span>
            ),
            count: chartList.uniqueViewCount || 0,
        },
        {
            id: 3,
            title: "Feedback",
            compareText: (<span>
                <span className={chartList.feedbackCountDiff < 0 ? 'text-destructive' : 'text-primary'}>
                    {parseFloat(chartList.feedbackCountDiff).toFixed(2)}%
            </span> {" from last month"} </span>
            ),
            count: chartList.feedbackCount || 0,
        },
        {
            id: 4,
            title: "Total Reaction",
            compareText: (<span>
                <span className={chartList.reactionCountDiff < 0 ? 'text-destructive' : 'text-primary'}>
                    {parseFloat(chartList.reactionCountDiff).toFixed(2)}%
            </span> {" from last month"} </span>
            ),
            count: chartList.reactionCount || 0,
        },
    ]

    const openReactions = (postId) => {
        navigate(`${baseUrl}/announcements?postId=${postId}`)
    }

    return (
        <Fragment>

            <div className={"md:py-8 py-4 border-b"}>
                <div
                    className='container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] px-3 md:px-4'>
                    <h1 className="md:text-[32px] text-[26px] font-medium">Welcome to Quickhunt</h1>
                </div>
            </div>
            <div
                className="container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pb-5 px-3 md:px-4">
                <div className={"flex items-center flex-wrap pb-6 pt-9 gap-2 md:justify-between md:flex-nowrap"}>
                    <h3 className="text-base font-bold">Here's what has happened to your program</h3>
                    <DateRangePicker
                        onUpdate={(values) => onChangeDate(values)}
                        initialDateFrom={state.from}
                        initialDateTo={state.to}
                        align="start"
                        locale="en-GB"
                        showCompare={false}
                    />
                </div>
                <div className={"flex flex-col gap-8"}>
                    <div className={"grid lg:grid-cols-4 lg:gap-8 md:grid-cols-2 md:gap-4 gap-3"}>
                        {
                            (programAnalytics || []).map((x, i) => {
                                return (
                                    <Fragment key={i}>
                                        {
                                            isLoading ? <Card><CardContent
                                                    className={"p-0"}> {CommSkel.commonParagraphThree} </CardContent></Card> :
                                                <Card
                                                    className={"rounded-lg border bg-card text-card-foreground shadow-sm"}
                                                    x-chunk={"dashboard-05-chunk-0"} key={i}>
                                                    <CardHeader className={"p-6 gap-0.5"}>
                                                        <CardTitle className={"text-sm font-medium"}>
                                                            {x.title}
                                                        </CardTitle>
                                                        <CardContent className={"p-0 flex flex-col gap-2 m-0"}>
                                                            <h3 className={"text-primary text-2xl font-bold"}>
                                                                {x.count}
                                                            </h3>
                                                            <p className={"text-xs font-medium"}>
                                                                {x.compareText}
                                                            </p>
                                                        </CardContent>
                                                    </CardHeader>
                                                </Card>
                                        }
                                    </Fragment>
                                )
                            })
                        }
                    </div>
                    <div className={"flex flex-wrap gap-4 lg:gap-8 md:flex-nowrap"}>
                        <Card className={"lg:basis-2/3 basis-full min-w-[270px] shadow border"}>
                            <CardHeader className={"p-6 py-3 border-b"}>
                                <CardTitle className={"text-base font-bold"}>Comments
                                    ({isLoading ? 0 : chartList.feedbacks.length})</CardTitle>
                            </CardHeader>
                            <div className={"max-h-[300px] overflow-y-auto"}>
                                {
                                    isLoading ? (
                                        <CardContent className={"p-0"}>{CommSkel.dashboardComments}</CardContent>
                                    ) : (
                                        (chartList.feedbacks && chartList.feedbacks.length > 0) ? (
                                            (chartList.feedbacks || []).map((x, i) => (
                                                <Fragment key={i}>
                                                    <CardContent className={"py-2.5 px-6 flex flex-col gap-4 border-b"}>
                                                        <div className="flex gap-2 items-center justify-between cursor-pointer">
                                                            <div
                                                                className="flex gap-2 items-center"
                                                                onClick={() => {
                                                                    if (x.type === 1) {
                                                                        navigate(`${baseUrl}/announcements/${x.post_id}`);
                                                                    } else if (x.type === 2) {
                                                                        navigate(`${baseUrl}/ideas/${x.post_id}`);
                                                                    }
                                                                }}
                                                            >
                                                                <div className={"update-idea text-sm rounded-full border text-center"}>
                                                                    <Avatar className={"w-[20px] h-[20px]"}>
                                                                        {x.user_photo ? (
                                                                            <AvatarImage src={x.user_photo} alt=""/>
                                                                        ) : (
                                                                            <AvatarFallback>{x.customer_name && x.customer_name.substring(0, 1).toUpperCase()}</AvatarFallback>
                                                                        )}
                                                                    </Avatar>
                                                                </div>
                                                                <h4 className="text-sm font-semibold">{x.customer_name}</h4>
                                                                <p className="text-xs font-medium text-muted-foreground">{x.customer_email}</p>
                                                            </div>
                                                            <Badge
                                                                variant={"outline"}
                                                                className={`text-xs font-medium text-muted-foreground ${x.type === 1 ? "text-[#3b82f6] border-[#3b82f6]" : "text-[#63c8d9] border-[#63c8d9]"}`}
                                                            >
                                                                {x.type === 1 ? "Announcement" : "Idea"}
                                                            </Badge>
                                                        </div>
                                                        <p className={"text-xs font-medium text-foreground"}>
                                                            <ReadMoreText html={x.comment} maxLine={"1"}/>
                                                        </p>
                                                    </CardContent>
                                                </Fragment>
                                            ))
                                        ) : (
                                            <EmptyData/>
                                        )
                                    )
                                }
                            </div>
                            <div className={"p-6 py-3 text-end"}>
                                <Button variant={"ghost hover:none"} className={"p-0 h-auto text-primary font-semibold"}
                                        onClick={() => navigate(`${baseUrl}/dashboard/comments`)}>
                                    {showAllFeedbacks ? "Show Less" : "See All"}
                                </Button>
                            </div>
                        </Card>
                        <Card className={"lg:basis-1/3 basis-full min-w-[270px] shadow border"}>
                            <CardHeader className={"p-6 py-3 border-b"}>
                                <CardTitle className={"text-base font-bold"}>Reaction
                                    ({isLoading ? 0 : chartList.reactions.length})</CardTitle>
                            </CardHeader>
                            <div className={"max-h-[300px] overflow-y-auto"}>
                                {
                                    isLoading ? (
                                        <CardContent className={"p-0"}>{CommSkel.commonParagraphTwoAvatar}</CardContent>
                                    ) : (
                                        (chartList.reactions && chartList.reactions.length > 0) ? (
                                            (chartList.reactions || []).map((x, i) => {
                                                const emoji = allStatusAndTypes.emoji.find((e) => e.id === x.reaction_id) || {emoji_url: ""};
                                                return (
                                                    <Fragment key={i}>
                                                        <CardContent className={"py-2.5 px-6 border-b"}>
                                                            <div className={"flex gap-4"}>
                                                                <Avatar className={"w-[35px] h-[35px]"}>
                                                                    <AvatarImage src={emoji.emoji_url}/>
                                                                </Avatar>
                                                                <div className={"flex flex-col gap-1"}>
                                                                    <div className="flex gap-1 items-center">
                                                                        <h4
                                                                            className="text-sm font-semibold cursor-pointer"
                                                                            onClick={() => openReactions(x.post_id)}
                                                                        >{x.customer_name}</h4>
                                                                        <p className="text-xs font-medium text-muted-foreground">Reacted
                                                                            To</p>
                                                                    </div>
                                                                    <p className="text-xs font-semibold text-foreground">"{x.post_title}"</p>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Fragment>
                                                );
                                            })
                                        ) : <EmptyData/>
                                    )
                                }
                            </div>
                            <div className={"p-6 py-3 text-end"}>
                                <Button variant={"ghost hover:none"} className={"p-0 h-auto text-primary font-semibold"}
                                        onClick={() => navigate(`${baseUrl}/dashboard/reactions`)}>
                                    {showAllReactions ? "Show Less" : "See All"}
                                </Button>
                            </div>
                        </Card>
                    </div>
                    <div>
                        <Card className={"shadow border"}>
                            <CardHeader className={"p-4 pb-0 md:p-6 md:pb-0"}>
                                <CardTitle className={"text-base font-bold"}>Overview</CardTitle>
                            </CardHeader>
                            {dataAvailable ? (
                                <CardContent className={"pb-10 px-4 pt-8 m-0 md:px-7"}>
                                    <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                                        <BarChart accessibilityLayer data={chartList.totalViewViewList}>
                                            <CartesianGrid vertical={false}/>
                                            <XAxis
                                                dataKey="x"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}

                                                tickFormatter={(value) => {
                                                    const date = new Date(value)
                                                    return date.toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                    })
                                                }}
                                            />
                                            <YAxis tickLine={false} axisLine={false}/>

                                            <ChartTooltip
                                                cursor={false}
                                                labelFormatter={(value) => {
                                                    return new Date(value).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })
                                                }}
                                                content={<ChartTooltipContent indicator="line"/>}
                                            />
                                            <Bar dataKey="uniqueView" fill="var(--color-uniqueView)"
                                                 className={"cursor-pointer"} radius={4}/>
                                            <Bar dataKey="totalView" fill="var(--color-totalView)"
                                                 className={"cursor-pointer"} radius={4}/>
                                        </BarChart>
                                    </ChartContainer>
                                </CardContent>
                            ) : <EmptyData/>
                            }
                        </Card>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
