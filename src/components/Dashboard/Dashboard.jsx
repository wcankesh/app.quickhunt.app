import React, {Fragment, useEffect, useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "../ui/card"
import moment from "moment";
import {ApiService} from "../../utils/ApiService";
import {useSelector} from "react-redux";
import EmptyData from "../Comman/EmptyData";
import {CommSkel} from "../Comman/CommSkel";
import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts"
import {ChartContainer, ChartTooltip, ChartTooltipContent,} from "../ui/chart"
import {Avatar, AvatarImage} from "../ui/avatar";
import {useTheme} from "../theme-provider";
import ReadMoreText from "../Comman/ReadMoreText";
import {DateRangePicker} from "../ui/date-range-picker";

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
    const {theme} = useTheme()
    let apiSerVice = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const [isLoading, setIsLoading] = useState(false);
    const [dataAvailable, setDataAvailable] = useState(true);
    const [state, setState] = useState({from: new Date(new Date().setDate(new Date().getDate() - 29)), to: new Date(),});
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
            dashboardData()
        }

    },[projectDetailsReducer.id, state])

    const dashboardData = async () => {
        setIsLoading(true)
        const payload = {
            project_id:projectDetailsReducer.id,
            start_date: moment(state.from).format("DD-MM-YYYY"),
            end_date:moment(state.to).format("DD-MM-YYYY"),
        }
        const data = await apiSerVice.dashboardData(payload)
        if(data.status === 200){
            const feedbackAnalytics = data.data.feedbackAnalytics.map((j) => ({
                x: new Date(j.x),
                y: parseInt(j.y),
            }));

            setChartList({...data.data,totalViewViewList: data.data.viewsAnalytic, feedbackAnalytics:feedbackAnalytics})
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
            compareText: `${chartList.totalViewCountDiff} from last month`,
            count : chartList.totalViewCount || 0,
        },
        {
            id: 2,
            title: "Unique Views",
            compareText: `${chartList.uniqueViewDiff} from last month`,
            count : chartList.uniqueViewCount || 0,
        },
        {
            id: 3,
            title: "Feedback",
            compareText: `${chartList.feedbackCountDiff} from last month`,
            count : chartList.feedbackCount || 0,
        },
        {
            id: 4,
            title: "Total Reaction",
            compareText: `${chartList.reactionCountDiff} from last month`,
            count : chartList.reactionCount || 0,
        },
    ]

    return (
        <Fragment>
                <div className={"md:py-8 py-4 border-b"}>
                    <div className='container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] px-3 md:px-4'>
                        <h1 className="md:text-[32px] text-[26px] font-medium">Welcome to Quickhunt</h1>
                    </div>
                </div>
                <div className="container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pb-5 px-3 md:px-4">
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
                                                    isLoading ? <Card><CardContent className={"p-0"}> {CommSkel.commonParagraphThree} </CardContent></Card> :
                                                        <Card className={"rounded-lg border bg-card text-card-foreground shadow-sm"} x-chunk={"dashboard-05-chunk-0"} key={i}>
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
                                <Card className={"lg:basis-2/3 basis-full min-w-[270px] p-4 md:pr-8 divide-y shadow border"}>
                                    <CardHeader className={"p-0 pb-4"}>
                                        <CardTitle className={"text-base font-bold"}>New Feedbacks</CardTitle>
                                    </CardHeader>
                                    <div className={"max-h-[300px] overflow-hidden hover:overflow-auto transition-all duration-300"}>
                                    {
                                        (chartList.feedbacks && chartList.feedbacks.length > 0) ? (
                                            (chartList.feedbacks || []).map((x, i) => (
                                                <Fragment>
                                                    {
                                                        isLoading ? <CardContent className={"p-0"} key={i}>{CommSkel.commonParagraphTwo}</CardContent> :
                                                            <CardContent className={"p-2 pl-6 pr-4 flex flex-col gap-2 border-b"} key={i}>
                                                                <div className="flex gap-2 items-center">
                                                                    <h4 className="text-sm font-semibold">{x.customer_name}</h4>
                                                                    <p className="text-xs font-medium text-muted-foreground">{x.customer_email_id}</p>
                                                                </div>
                                                                {/*<p className="text-xs font-medium text-foreground">“{x.feedback}”</p>*/}
                                                                <p className={"text-xs font-medium text-foreground"}>
                                                                    <ReadMoreText
                                                                        className={"text-xs"}
                                                                        html={`${x.feedback}`}/>
                                                                </p>
                                                            </CardContent>
                                                    }
                                                </Fragment>
                                            ))
                                        ) : (
                                            <EmptyData />
                                        )
                                    }
                                    </div>
                                </Card>
                                <Card className={"lg:basis-1/3 basis-full min-w-[270px] p-4 md:pr-8 divide-y shadow border"}>
                                    <CardHeader className={"p-0 pb-4"}>
                                        <CardTitle className={"text-base font-bold"}>Reaction</CardTitle>
                                    </CardHeader>
                                    <div className={"max-h-[300px] overflow-hidden hover:overflow-auto transition-all duration-300"}>
                                    {
                                        (chartList.reactions && chartList.reactions.length > 0) ? (
                                            (chartList.reactions || []).map((x, i) => {
                                                const emoji = allStatusAndTypes.emoji.find((e) => e.id === x.reaction_id) || { emoji_url: "" };
                                                return (
                                                    <Fragment key={i}>
                                                        {isLoading ? <CardContent className={"p-0"} key={i}>{CommSkel.commonParagraphTwoAvatar}</CardContent> :
                                                            <CardContent className={"py-2.5 px-0 border-b"}>
                                                                <div className={"flex gap-4"}>
                                                                    <Avatar className={"w-[35px] h-[35px]"}>
                                                                        <AvatarImage src={emoji.emoji_url} />
                                                                    </Avatar>
                                                                    <div className={"flex flex-col gap-1"}>
                                                                        <div className="flex gap-1 items-center">
                                                                            <h4 className="text-sm font-semibold">{x.customer_name}</h4>
                                                                            <p className="text-xs font-medium text-muted-foreground">Reacted To</p>
                                                                        </div>
                                                                        <p className="text-xs font-medium text-foreground">"{x.post_title}"</p>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        }
                                                    </Fragment>
                                                );
                                            })
                                        ) : <EmptyData />
                                    }
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
                                                    <CartesianGrid vertical={false} />
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
                                                    <YAxis tickLine={false}   axisLine={false} />

                                                    <ChartTooltip
                                                        cursor={false}
                                                        labelFormatter={(value) => {
                                                            return new Date(value).toLocaleDateString("en-US", {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            })
                                                        }}
                                                        content={<ChartTooltipContent  indicator="line" />}
                                                    />
                                                    <Bar dataKey="uniqueView"  fill="var(--color-uniqueView)" className={"cursor-pointer"} radius={4} />
                                                    <Bar dataKey="totalView" fill="var(--color-totalView)" className={"cursor-pointer"} radius={4} />
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
