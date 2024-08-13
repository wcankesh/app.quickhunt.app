import React, {Fragment, useEffect, useState} from "react"
import {Card, CardContent, CardHeader, CardTitle, CardFooter} from "../ui/card"
import {Button} from "../ui/button";
import {Icon} from "../../utils/Icon";
import {Calendar} from "../ui/calendar";
import {PopoverTrigger, Popover, PopoverContent} from "../ui/popover";
import { CalendarIcon} from "lucide-react";
import moment from "moment";
//import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns"
import { cn } from "../../lib/utils";
import {ApiService} from "../../utils/ApiService";
import {useSelector} from "react-redux";
import EmptyData from "../Comman/EmptyData";
import {CommSkel} from "../Comman/CommSkel";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "../ui/chart"
const programAnalytics = [
    {
        id: 1,
        title: "Total Views",
        compareText: "from last month",
    },
    {
        id: 2,
        title: "Unique Views",
        compareText: "from last month",
    },
    {
        id: 3,
        title: "Feedback",
        compareText: "from last month",
    },
    {
        id: 4,
        title: "Total Reaction",
        compareText: "since last hour",
    },
]

const emoji = {
    29 : Icon.emojiLaugh,
    54 : Icon.emojiSad,
    55 : Icon.emojiSmile,
}
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
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const [isLoading, setIsLoading] = useState(false);
    const [state, setState] = useState({startDate: moment().subtract(29, 'days'), endDate: moment(),});
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

    const [dataAvailable, setDataAvailable] = useState(true);

    // useEffect(() => {
    //     if (
    //         chartList.uniqueViewList.length === 0 &&
    //         chartList.totalViewViewList.length === 0
    //     ) {
    //         setDataAvailable(false);
    //     } else {
    //         setDataAvailable(true);
    //     }
    // }, [chartList.uniqueViewList, chartList.totalViewViewList]);

    useEffect(() => {
        if(projectDetailsReducer.id){
            dashboardData()
        }
    },[projectDetailsReducer.id])

    const dashboardData = async () => {
        setIsLoading(true)
        const payload = {
            project_id:projectDetailsReducer.id,
            start_date: state.startDate,
            end_date: state.endDate,
        }
        const data = await apiSerVice.dashboardData(payload)
        if(data.status === 200){
            const feedbackAnalytics = [];
            data.data.feedbackAnalytics.map((j, i) => {
                let obj = {
                    x: new Date(j.x),
                    y: parseInt(j.y)
                }

                feedbackAnalytics.push(obj)
            })
            setChartList({...data.data,totalViewViewList: data.data.viewsAnalytic, feedbackAnalytics:feedbackAnalytics})
            setIsLoading(false)
            if (data.data.viewsAnalytic.length === 0) {
                setDataAvailable(false);
            } else {
                setDataAvailable(true);
            }
        } else {

        }
    }

  //  const dates = DateRange()
    const initialRange = {
        from: new Date(),
        to: addDays(new Date(), 4)
    };

    const [date, setDate] = useState([new Date(),addDays(new Date(), 4)]);

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
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"outline"}
                                        className={cn(
                                            "w-[300px] justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        <>
                                            {format(date[0], "LLL dd, y")} -{" "}
                                            {format(date[1], "LLL dd, y")}
                                        </>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        initialfocus={"true"}
                                        mode="range"
                                        defaultmonth={date?.from}
                                        selected={date}
                                        onSelect={(dates) => setDate(dates)}
                                        numberofmonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className={"flex flex-col gap-8"}>
                            <div className={"grid lg:grid-cols-4 lg:gap-8 md:grid-cols-2 md:gap-4 gap-3"}>
                                {
                                    (programAnalytics || []).map((x, i) => {
                                        return (
                                            <Fragment>
                                                {
                                                    isLoading ? <Card><CardContent className={"p-0"}> {CommSkel.commonParagraphThree} </CardContent></Card> :
                                                        <Card className={"rounded-lg border bg-card text-card-foreground shadow-sm"} x-chunk={"dashboard-05-chunk-0"} key={i}>
                                                            <CardHeader className={"p-6 gap-0.5"}>
                                                                <CardTitle className={"text-sm font-medium"}>
                                                                    {x.title}
                                                                </CardTitle>
                                                                <CardContent className={"p-0 flex flex-col gap-2"}>
                                                                    <h3 className={"text-primary text-2xl font-bold"}>
                                                                        {x.title === "Total Views" ? chartList.totalViewCount :
                                                                            x.title === "Unique Views" ? chartList.uniqueViewCount :
                                                                                x.title === "Feedback" ? chartList.feedbackCount :
                                                                                    x.title === "Total Reaction" ? chartList.reactionCount : ""}
                                                                    </h3>
                                                                    <p className={"text-xs font-medium"}>
                                                                        {x.title === "Total Views" ? <>{chartList.totalViewCountDiff} {x.compareText}</> :
                                                                            x.title === "Unique Views" ? <>{chartList.uniqueViewDiff} {x.compareText}</> :
                                                                                x.title === "Feedback" ? <>{chartList.feedbackCountDiff} {x.compareText}</> :
                                                                                    x.title === "Total Reaction" ? <>{chartList.reactionCountDiff} {x.compareText}</> : ""}
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
                                    {
                                        (chartList.feedbacks && chartList.feedbacks.length > 0) ? (
                                            (chartList.feedbacks || []).map((x, i) => (
                                                <Fragment>
                                                    {
                                                        isLoading ? CommSkel.commonParagraphTwo :
                                                            <CardContent className={"p-2 pl-6 pr-4 flex flex-col gap-2"} key={i}>
                                                                <div className="flex gap-2 items-center">
                                                                    <h4 className="text-sm font-semibold">{x.customer_name}</h4>
                                                                    <p className="text-xs font-medium text-muted-foreground">{x.customer_email_id}</p>
                                                                </div>
                                                                <p className="text-xs font-medium text-foreground">“{x.feedback}”</p>
                                                            </CardContent>
                                                    }
                                                </Fragment>
                                            ))
                                        ) : (
                                            <EmptyData />
                                        )
                                    }
                                    <CardFooter className={"p-0 pt-4 justify-end"}>
                                        <Button className={"text-primary p-0 h-[20px] text-sm font-semibold"} variant={"ghost hover:none"}>View More Feedbacks</Button>
                                    </CardFooter>
                                </Card>
                                <Card className={"lg:basis-1/3 basis-full min-w-[270px] p-4 md:pr-8 divide-y shadow border"}>
                                    <CardHeader className={"p-0 pb-4"}>
                                        <CardTitle className={"text-base font-bold"}>Reaction</CardTitle>
                                    </CardHeader>
                                    {
                                        (chartList.reactions && chartList.reactions.length > 0) ? (
                                                (chartList.reactions || []).map((x, i) => (
                                                    <Fragment>
                                                        {
                                                            isLoading ? CommSkel.commonParagraphTwoAvatar :
                                                                <CardContent className={"py-2.5 px-0"} key={i}>
                                                                    <div className={"flex gap-4"}>
                                                                        <div>
                                                                            {allStatusAndTypes.emoji.find(e => e.id === x.reaction_id) && (
                                                                                <img
                                                                                    src={allStatusAndTypes.emoji.find(e => e.id === x.reaction_id).emoji_url}
                                                                                    alt={x.reaction_id}
                                                                                    className={"w-8 h-8"}
                                                                                />
                                                                            )}
                                                                        </div>
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
                                                ))
                                            ) : <EmptyData />
                                    }
                                    <CardFooter className={"p-0 pt-4 justify-end"}>
                                        <Button className={"text-primary text-sm p-0 h-[20px] font-semibold"} variant={"ghost hover:none"}>View More Reactions</Button>
                                    </CardFooter>
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
                                            {/*<HighchartsReact highcharts={Highcharts} options={options}/>*/}
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
