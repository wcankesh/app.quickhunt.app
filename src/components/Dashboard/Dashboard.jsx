import React, {Fragment, useEffect, useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "../ui/card"
import moment from "moment";
import {ApiService} from "../../utils/ApiService";
import {useSelector} from "react-redux";
import EmptyData from "../Comman/EmptyData";
import {chartLoading, CommSkel} from "../Comman/CommSkel";
import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts"
import {ChartContainer, ChartTooltip, ChartTooltipContent,} from "../ui/chart"
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import ReadMoreText from "../Comman/ReadMoreText";
import {DateRangePicker, formatDate, getPresetRange, PRESETS} from "../ui/date-range-picker";
import {Button} from "../ui/button";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../utils/constent";
import {Badge} from "../ui/badge";
import {UserAvatar} from "../Comman/CommentEditor";

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

    const [isLoading, setIsLoading] = useState(true);
    const [dataAvailable, setDataAvailable] = useState(true);
    const [state, setState] = useState({
        from: new Date(new Date().setDate(new Date().getDate() - 29)),
        to: new Date(),
    });

    const [dateDisplay, setDateDisplay] = useState('');

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
        const payload = {
            project_id: projectDetailsReducer.id,
            start_date: moment(state.from).format("DD-MM-YYYY"),
            end_date: moment(state.to).format("DD-MM-YYYY"),
        }
        setIsLoading(true)
        const data = await apiSerVice.dashboardData(payload)
        if (data.status === 200) {
            setIsLoading(false)
            const feedbackAnalytics = data.data.feedbackAnalytics.map((j) => ({
                x: new Date(j.x),
                y: parseInt(j.y),
            }));
            setChartList({
                ...data.data,
                totalViewViewList: data.data.viewsAnalytic,
                feedbackAnalytics: feedbackAnalytics
            })
            setDataAvailable(data.data.viewsAnalytic.length > 0);
        } else {
            setIsLoading(false)
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

    const checkPreset = () => {
        for (const preset of PRESETS) {
            const presetRange = getPresetRange(preset.name)
            const normalizedRangeFrom = new Date(state.from);
            normalizedRangeFrom.setHours(0, 0, 0, 0);
            const normalizedPresetFrom = new Date(
                presetRange.from.setHours(0, 0, 0, 0)
            )
            const normalizedRangeTo = new Date(state.to ?? 0);
            normalizedRangeTo.setHours(0, 0, 0, 0);
            const normalizedPresetTo = new Date(
                presetRange.to?.setHours(0, 0, 0, 0) ?? 0
            )
            if (
                normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
                normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
            ) {
                setDateDisplay(preset.displayDays)
                return
            }
        }
        setDateDisplay(`${formatDate(state.from)} - ${formatDate(state.to)}`)
    }

    useEffect(() => {
        checkPreset()
    }, [state])

    const programAnalytics = [
        {
            id: 1,
            title: "Total Views",
            compareText: (
                <span className={chartList.totalViewCountDiff < 0 ? 'text-destructive' : 'text-primary'}>
                    {parseFloat(chartList.totalViewCountDiff).toFixed(2)}%
            </span>
            ),
            count: chartList.totalViewCount || 0,
        },
        {
            id: 2,
            title: "Unique Views",
            compareText: (
                <span className={chartList.uniqueViewDiff < 0 ? 'text-destructive' : 'text-primary'}>
                    {parseFloat(chartList.uniqueViewDiff).toFixed(2)}%
            </span>
            ),
            count: chartList.uniqueViewCount || 0,
        },
        {
            id: 3,
            title: "Feedback",
            compareText: (
                <span className={chartList.feedbackCountDiff < 0 ? 'text-destructive' : 'text-primary'}>
                    {parseFloat(chartList.feedbackCountDiff).toFixed(2)}%
            </span>
            ),
            count: chartList.feedbackCount || 0,
        },
        {
            id: 4,
            title: "Total Reaction",
            compareText: (
                <span className={chartList.reactionCountDiff < 0 ? 'text-destructive' : 'text-primary'}>
                    {parseFloat(chartList.reactionCountDiff).toFixed(2)}%
            </span>
            ),
            count: chartList.reactionCount || 0,
        },
    ]

    return (
        <Fragment>

            <div className={"md:py-8 py-4 border-b"}>
                <div className='container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] px-3 md:px-4 space-y-1'>
                    <h1 className="md:text-[32px] text-[26px] capitalize">Welcome to Quickhunt</h1>
                    <p className={"text-sm text-muted-foreground"}>Effortlessly collect and manage feedback to improve your product development.</p>
                </div>
            </div>
            <div
                className="container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pb-5 px-3 md:px-4 m-auto">
                <div className={"flex items-center flex-wrap pb-6 pt-9 gap-2 justify-between md:flex-nowrap"}>
                    <div className={"space-y-1"}>
                        <h3 className="text-base font-medium capitalize">View Your Program Performance</h3>
                        <p className={"text-sm text-muted-foreground"}>Here's a summary of what’s happening with your program.</p>
                    </div>
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
                    <div className={"grid lg:grid-cols-4 lg:gap-6 md:grid-cols-2 md:gap-4 gap-3"}>
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
                                                        <CardTitle className={"text-sm font-normal"}>
                                                            {x.title}
                                                        </CardTitle>
                                                        <CardContent className={"p-0 flex flex-col gap-2 m-0"}>
                                                            <h3 className={"text-primary text-2xl font-medium"}>
                                                                {x.count}
                                                            </h3>
                                                            <p className={"text-xs"}>
                                                                {x.compareText} {dateDisplay}
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
                        <Card className={"lg:basis-2/3 basis-full min-w-[270px] shadow border flex flex-col"}>
                            <CardHeader className={"p-6 py-3 border-b"}>
                                <CardTitle className={"text-base font-medium"}>Comments
                                    ({isLoading ? 0 : chartList.feedbacks.length})</CardTitle>
                            </CardHeader>
                            <div className={"max-h-[300px] overflow-y-auto flex-1"}>
                                {
                                    isLoading ? (
                                        <CardContent className={"p-0"}>{CommSkel.dashboardComments}</CardContent>
                                    ) : (
                                        (chartList.feedbacks && chartList.feedbacks.length > 0) ? (
                                            (chartList.feedbacks || []).map((x, i) => (
                                                <Fragment key={i}>
                                                    <CardContent className={"py-2.5 px-6 flex flex-col gap-4 border-b last:border-b-0"}>
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
                                                                <div className={"update-idea text-sm rounded-full text-center"}>
                                                                    <UserAvatar userPhoto={x.user_photo} userName={x.customer_name && x.customer_name.substring(0, 1).toUpperCase()} />
                                                                </div>
                                                                <div className={"flex items-center flex-wrap gap-1 md:gap-2"}>
                                                                <h4 className="text-sm font-medium">{x.customer_name}</h4>
                                                                <p className="text-xs text-muted-foreground">{x.customer_email}</p>
                                                                </div>
                                                            </div>
                                                            <Badge
                                                                variant={"outline"}
                                                                className={`text-xs font-normal text-muted-foreground ${x.type === 1 ? "text-[#3b82f6] border-[#3b82f6]" : "text-[#63c8d9] border-[#63c8d9]"}`}
                                                            >
                                                                {x.type === 1 ? "Announcement" : "Idea"}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs font-normal text-foreground cursor-pointer">
                                                            <ReadMoreText
                                                                html={x.comment}
                                                                maxLength={100}
                                                                onTextClick={() => {
                                                                    if (x.type === 1) {
                                                                        navigate(`${baseUrl}/announcements/${x.post_id}`);
                                                                    } else if (x.type === 2) {
                                                                        navigate(`${baseUrl}/ideas/${x.post_id}`);
                                                                    }
                                                                }}
                                                            />
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
                            <div className={"p-6 py-3 text-end border-t"}>
                                <Button variant={"ghost hover:none"} className={"p-0 h-auto text-primary font-medium"}
                                        // onClick={() => navigate(`${baseUrl}/dashboard/comments?pageNo=2`)}>
                                        onClick={() => navigate(`${baseUrl}/dashboard/comments`)}>
                                    See All
                                </Button>
                            </div>
                        </Card>
                        <Card className={"lg:basis-1/3 basis-full min-w-[270px] shadow border flex flex-col"}>
                            <CardHeader className={"p-6 py-3 border-b"}>
                                <CardTitle className={"text-base font-medium"}>Reaction
                                    ({isLoading ? 0 : chartList.reactions.length})</CardTitle>
                            </CardHeader>
                            <div className={"max-h-[300px] overflow-y-auto flex-1"}>
                                {
                                    isLoading ? (
                                        <CardContent className={"p-0"}>{CommSkel.commonParagraphTwoAvatar}</CardContent>
                                    ) : (
                                        (chartList.reactions && chartList.reactions.length > 0) ? (
                                            (chartList.reactions || []).map((x, i) => {
                                                const emoji = allStatusAndTypes.emoji.find((e) => e.id === x.reaction_id) || {emoji_url: ""};
                                                return (
                                                    <Fragment key={i}>
                                                        <CardContent className={"py-2.5 px-6 border-b last:border-b-0"}>
                                                            <div className={"flex gap-4"}>
                                                                <UserAvatar className={`rounded-none w-[35px] h-[35px]`} userPhoto={emoji.emoji_url} />
                                                                <div className={"flex flex-col gap-1"}>
                                                                    <div className="flex gap-1 items-center">
                                                                        <h4
                                                                            className="text-sm font-medium cursor-pointer"
                                                                            onClick={() => navigate(`${baseUrl}/announcements/analytic-view?postId=${x.post_id}`)}
                                                                        >{x.customer_name}</h4>
                                                                        <p className="text-xs text-muted-foreground">Reacted
                                                                            To</p>
                                                                    </div>
                                                                    <p
                                                                        className="text-xs font-medium text-foreground cursor-pointer"
                                                                        onClick={() => navigate(`${baseUrl}/announcements/analytic-view?postId=${x.post_id}`)}
                                                                    >"{x.post_title}"</p>
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
                            <div className={"p-6 py-3 text-end border-t"}>
                                <Button variant={"ghost hover:none"} className={"p-0 h-auto text-primary font-medium"}
                                        onClick={() => navigate(`${baseUrl}/dashboard/reactions`)}>
                                    See All
                                </Button>
                            </div>
                        </Card>
                    </div>
                    <div>
                        <Card className={"shadow border"}>
                            <CardHeader className={"p-4 pb-0 md:p-6 md:pb-0"}>
                                <CardTitle className={"text-base font-medium"}>Overview</CardTitle>
                            </CardHeader>
                            {dataAvailable ? (
                                <CardContent className={"pb-10 px-4 pt-8 m-0 md:px-7"}>
                                    {
                                        isLoading ? chartLoading(14) : (
                                            <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                                                <BarChart accessibilityLayer data={chartList.totalViewViewList}>
                                                    <CartesianGrid vertical={false}/>
                                                    <XAxis
                                                        dataKey="x"
                                                        tickLine={false}
                                                        tickMargin={10}
                                                        axisLine={false}

                                                        tickFormatter={(value) => {
                                                            const date = new Date(value);
                                                            return moment(value).format("MMM D")
                                                        }}
                                                    />
                                                    <YAxis tickLine={false} axisLine={false}/>

                                                    <ChartTooltip
                                                        cursor={false}
                                                        labelFormatter={(value) => {
                                                            return moment(value).format("MMMM DD, YYYY")
                                                        }}
                                                        content={<ChartTooltipContent indicator="line"/>}
                                                    />
                                                    <Bar dataKey="uniqueView" fill="var(--color-uniqueView)"
                                                         className={"cursor-pointer"} radius={4}/>
                                                    <Bar dataKey="totalView" fill="var(--color-totalView)"
                                                         className={"cursor-pointer"} radius={4}/>
                                                </BarChart>
                                            </ChartContainer>
                                        )
                                    }
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
