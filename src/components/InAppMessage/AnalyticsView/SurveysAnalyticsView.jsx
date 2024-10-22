import React, {Fragment, useEffect, useState} from 'react';
import {Card, CardContent, CardHeader} from "../../ui/card";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "../../ui/breadcrumb";
import {baseUrl} from "../../../utils/constent";
import {CommSkel} from "../../Comman/CommSkel";
import {Skeleton} from "../../ui/skeleton";
import {useNavigate} from "react-router";
import {ApiService} from "../../../utils/ApiService";
import {useSelector} from "react-redux";
import moment from "moment";
import {useParams} from "react-router-dom";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, } from 'recharts';
import {ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent} from "../../ui/chart";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import {useTheme} from "../../theme-provider";
import {Avatar, AvatarFallback} from "../../ui/avatar";


const chartConfig = {
    y: {
        label: "View",
        color: "#7c3aed",
    },
}

const chartConfigNPS ={
    detractor: {
        label: "Detractor",
        color: "#e87e6d",
    },
    passives: {
        label: "Passives",
        color: "#f0ca00",
    },
    promoter: {
        label: "Promoter",
        color: "#55c99b",
    },
}


const SurveysAnalyticsView = () => {
    const {theme} = useTheme();
    const {id} = useParams();
    const navigate = useNavigate();
    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const [inAppMsgSetting, setInAppMsgSetting] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [analytics, setAnalytics] = useState({})
    const [analyticsResponse, setAnalyticsResponse] = useState([])

    useEffect(() => {
        if (projectDetailsReducer.id) {
            getSingleInAppMessages();
            getResponseInAppMessage();
        }
    }, [projectDetailsReducer.id]);

    const getSingleInAppMessages = async () => {
        setIsLoading(true)
        const data = await apiService.getSingleInAppMessage(id)
        if (data.status === 200) {
            const payload = {
                ...data.data,
            }
            setAnalytics(data.analytics)
            setInAppMsgSetting(payload);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    const getResponseInAppMessage = async () => {
        setIsLoading(true)
        const data = await apiService.getResponseInAppMessage({in_app_message_id :id})
        if (data.status === 200) {
            setAnalyticsResponse(data.data)
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    const analyticsViews = [
        {
            title: "Sent",
            // count: views && views[0] && views[0].totalView ? views[0].totalView : 0,
        },
        {
            title: "Responded",
            // count: views && views[0] && views[0].uniqueView ? views[0].uniqueView : 0,
        },
        {
            title: "Report",
            // count: views && views[0] && views[0].uniqueView ? views[0].uniqueView : 0,
        },
    ]

    const reportAnalysis = [
        {
            title: "Sent",
            // count: views && views[0] && views[0].totalView ? views[0].totalView : 0,
        },
        {
            title: "Number of responses",
            // count: views && views[0] && views[0].uniqueView ? views[0].uniqueView : 0,
        },
        {
            title: "NPS Score",
            // count: views && views[0] && views[0].uniqueView ? views[0].uniqueView : 0,
        },
    ]

    return (
        <Fragment>
            <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>
                <Card>
                    <CardHeader className={"p-3 lg:p-6 border-b"}>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className={"cursor-pointer"}>
                                    <BreadcrumbLink onClick={() => navigate(`${baseUrl}/in-app-message`)}>
                                        In App Message
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem className={"cursor-pointer"}>
                                    <BreadcrumbPage>{inAppMsgSetting?.title}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </CardHeader>
                    <CardContent className={"p-3 md:p-6 flex flex-col gap-6"}>
                        <div className={"flex flex-col gap-8"}>
                            <div className={"grid lg:grid-cols-3 md:grid-cols-2 md:gap-4 gap-3"}>
                                {analyticsViews
                                    .map((x, i) => (
                                        <Fragment key={i}>
                                            {isLoading ? (
                                                <Card>
                                                    <CardContent className={"p-0"}>{CommSkel.commonParagraphThree}</CardContent>
                                                </Card>
                                            ) : (
                                                <Card>
                                                    <CardContent className={"text-2xl font-medium p-3 md:p-6"}>
                                                        <div className={"text-base font-medium"}>{x.title}</div>
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </Fragment>
                                    ))}
                            </div>
                        </div>
                        <div>
                            How did that change over time?
                        </div>
                        <div>
                            <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        accessibilityLayer
                                        data={analytics?.charts || []}

                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="x"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => {
                                                const date = new Date(value)
                                                return date.toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                })
                                            }}
                                        />
                                        <Tooltip
                                            cursor={false}
                                            content={<ChartTooltipContent hideLabel />}
                                        />
                                        <YAxis tickLine={false} axisLine={false}/>
                                        <Line
                                            dataKey="y"
                                            type="monotone"
                                            stroke="var(--color-y)"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                        <div>
                            Customers who opened
                        </div>
                        <div className={"border"}>
                            <Table>
                                <TableHeader className={`${theme === "dark" ? "" : "bg-muted"}`}>
                                    <TableRow>
                                        {
                                            ["Name", "When it was opened"].map((x, i) => {
                                                return (
                                                    <TableHead className={`px-2 py-[10px] md:px-3 font-medium text-card-foreground`} key={i}>
                                                        {x}
                                                    </TableHead>
                                                );
                                            })
                                        }
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        isLoading ? (
                                                [...Array(10)].map((x, index) => {
                                                    return (
                                                        <TableRow key={index}>
                                                            {
                                                                [...Array(2)].map((_, i) => {
                                                                    return (
                                                                        <TableCell key={i} className={"max-w-[373px] px-2 py-[10px] md:px-3"}>
                                                                            <Skeleton className={"rounded-md w-full h-7"}/>
                                                                        </TableCell>
                                                                    )
                                                                })
                                                            }
                                                        </TableRow>
                                                    )
                                                })
                                            )
                                            :
                                            (analytics?.analytics || []).length >  0 ?
                                                <Fragment>
                                                    {
                                                        (analytics?.analytics || []).map((x,i)=> {
                                                            return (
                                                                <TableRow key={x.id}>
                                                                    <TableCell className={`flex items-center px-2 py-[10px] md:px-3 gap-2`}>
                                                                        <>
                                                                            <Avatar className={"w-[20px] h-[20px]"}>
                                                                                <AvatarFallback>{x?.name? x?.name?.substring(0, 1) : x?.email?.substring(0, 1)}</AvatarFallback>
                                                                            </Avatar>
                                                                            <p className={"font-normal"}>{x?.name? x?.name : x.email}</p>
                                                                        </>
                                                                    </TableCell>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 font-normal`}>{moment(x.created_at).format("ll")}</TableCell>
                                                                </TableRow>
                                                            )
                                                        })
                                                    }
                                                </Fragment> : ""
                                    }
                                </TableBody>
                            </Table>
                        </div>
                        <div>
                            Customers who responded
                        </div>
                        <div className={"border"}>
                            <Table>
                                <TableHeader className={`${theme === "dark" ? "" : "bg-muted"}`}>
                                    <TableRow>
                                        <TableHead className={`px-2 py-[10px] md:px-3 font-medium text-card-foreground`} >
                                            Name
                                        </TableHead>
                                        {
                                            (inAppMsgSetting?.steps || []).map((x, i) => {
                                                return (
                                                    <TableHead className={`px-2 py-[10px] md:px-3 font-medium text-card-foreground`} key={i}>
                                                        {x.text}
                                                    </TableHead>
                                                );
                                            })
                                        }
                                        <TableHead className={`px-2 py-[10px] md:px-3 font-medium text-card-foreground`} >
                                            Date Responded
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        isLoading ? (
                                                [...Array(10)].map((x, index) => {
                                                    return (
                                                        <TableRow key={index}>
                                                            {
                                                                [...Array(2)].map((_, i) => {
                                                                    return (
                                                                        <TableCell key={i} className={"max-w-[373px] px-2 py-[10px] md:px-3"}>
                                                                            <Skeleton className={"rounded-md w-full h-7"}/>
                                                                        </TableCell>
                                                                    )
                                                                })
                                                            }
                                                        </TableRow>
                                                    )
                                                })
                                            )
                                            :
                                            (analytics?.analytics || []).length >  0 ?
                                                <Fragment>
                                                    {
                                                        (analytics?.analytics || []).map((x,i)=> {
                                                            return (
                                                                <TableRow key={x.id}>
                                                                    <TableCell className={`flex items-center px-2 py-[10px] md:px-3 gap-2`}>
                                                                        <>
                                                                            <Avatar className={"w-[20px] h-[20px]"}>
                                                                                <AvatarFallback>{x?.name? x?.name?.substring(0, 1) : x?.email?.substring(0, 1)}</AvatarFallback>
                                                                            </Avatar>
                                                                            <p className={"font-normal"}>{x?.name? x?.name : x.email}</p>
                                                                        </>
                                                                    </TableCell>
                                                                    {
                                                                        (inAppMsgSetting?.steps || []).map((s, i) => {
                                                                            const findResponse = x.response.find((f) => s.step_id === f.step_id) || {response: "-"}
                                                                            return (
                                                                                <TableCell className={`px-2 py-[10px] md:px-3 font-normal`}>
                                                                                    {findResponse?.response}
                                                                                </TableCell>
                                                                            );
                                                                        })
                                                                    }
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 font-normal`}>{moment(x.created_at).format("ll")}</TableCell>
                                                                </TableRow>
                                                            )
                                                        })
                                                    }
                                                </Fragment> : ""
                                    }
                                </TableBody>
                            </Table>
                        </div>
                        <div className={"flex flex-col gap-8"}>
                            <div className={"grid lg:grid-cols-2 md:grid-cols-2 md:gap-4 gap-3"}>
                                {
                                    analyticsResponse.map((x) => {
                                        let questionType2 = [];
                                        let questionType4 = [];
                                        let questionType5 = [];
                                        if(x.question_type === 2 || x.question_type === 3){
                                            for (let i = x.start_number; i <= x.end_number; i++) {
                                                const foundReport = x.report.find(item => item.response === i.toString());
                                                if (foundReport) {
                                                    questionType2.push({
                                                        total: foundReport.total,
                                                        response: x.question_type === 3 ? `(${foundReport.response} stars)` :`(${foundReport.response})`
                                                    });
                                                } else {
                                                    questionType2.push({
                                                        total: 0,
                                                        response: x.question_type === 3 ? `(${i} stars)` :`(${i})`
                                                    });
                                                }
                                            }
                                        }
                                        if(x.question_type === 4){
                                          x.reactions.map((r) => {
                                              const foundReport = x.report.find(item => item.reaction_id === r.id);
                                              if (foundReport) {
                                                  questionType4.push({
                                                      total: foundReport.total,
                                                      response: foundReport.emoji
                                                  });
                                              } else {
                                                  questionType4.push({
                                                      total: 0,
                                                      response: r.emoji
                                                  });
                                              }
                                          })
                                        }

                                        if(x.question_type === 5){
                                            x.options.map((r) => {
                                                const foundReport = x.report.find(item => item.step_option_id === r.id);
                                                if (foundReport) {
                                                    questionType5.push({
                                                        total: foundReport.total,
                                                        response: r.title
                                                    });
                                                } else {
                                                    questionType5.push({
                                                        total: 0,
                                                        response: r.title
                                                    });
                                                }
                                            })
                                        }
                                        return(
                                            x.question_type === 6 || x.question_type === 7 || x.question_type === 8 ? "" :
                                            <Card>
                                                <CardContent className={"text-2xl font-medium p-2 md:p-4"}>
                                                    <div className={"text-base font-medium mb-2"}>{x.text}</div>
                                                    {
                                                        x.question_type === 1 ? <div>
                                                            <ChartContainer config={chartConfigNPS}>
                                                                <BarChart accessibilityLayer data={x.report}>
                                                                    <CartesianGrid vertical={false} />
                                                                    <XAxis
                                                                        dataKey="created_at"
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
                                                                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`}/>
                                                                    <ChartTooltip
                                                                        cursor={true}
                                                                        content={<ChartTooltipContent formatter={(value, name) => {
                                                                            return(
                                                                                <Fragment>
                                                                                    <div
                                                                                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                                                                                        style={
                                                                                            {
                                                                                                backgroundColor: `var(--color-${name.toLowerCase()})`,
                                                                                            }
                                                                                        }
                                                                                    />
                                                                                    {chartConfigNPS?.label || name}
                                                                                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                                                                        {value}
                                                                                        <span className="font-normal text-muted-foreground">%</span>
                                                                                    </div>
                                                                                </Fragment>
                                                                            )
                                                                        }}
                                                                        />}
                                                                    />

                                                                    <Bar
                                                                        dataKey="detractor_percentage"
                                                                        stackId="a"
                                                                        fill="var(--color-detractor)"
                                                                        radius={[0, 0, 4, 4]}
                                                                        name={"Detractor"}
                                                                    />
                                                                    <Bar
                                                                        dataKey="passives_percentage"
                                                                        stackId="a"
                                                                        fill="var(--color-passives)"
                                                                        radius={[0, 0, 0, 0]}
                                                                        name={"Passives"}
                                                                    />
                                                                    <Bar
                                                                        dataKey="promoter_percentage"
                                                                        stackId="a"
                                                                        fill="var(--color-promoter)"
                                                                        name={"Promoter"}
                                                                        radius={[4, 4, 0, 0]}
                                                                    />
                                                                </BarChart>
                                                            </ChartContainer>
                                                        </div> : <div>
                                                            <ChartContainer config={{
                                                                total: {
                                                                    label: 'Total',
                                                                    color: "#7c3aed26",
                                                                }
                                                            }} >
                                                                <BarChart accessibilityLayer data={x.question_type === 2 || x.question_type === 3 ? questionType2 : x.question_type === 4 ? questionType4 : x.question_type === 5 ? questionType5 : []}>
                                                                    <CartesianGrid vertical={false}/>
                                                                    <XAxis
                                                                        dataKey="response"
                                                                        tickLine={false}
                                                                        tickMargin={10}
                                                                        axisLine={false}
                                                                    />
                                                                    <YAxis tickLine={false} axisLine={false}/>

                                                                    <ChartTooltip
                                                                        cursor={false}
                                                                        content={<ChartTooltipContent indicator="line" />}
                                                                    />
                                                                    <Bar dataKey="total" fill="var(--color-total)"
                                                                         className={"cursor-pointer"} radius={4}/>

                                                                </BarChart>
                                                            </ChartContainer>
                                                        </div>
                                                    }

                                                </CardContent>
                                            </Card>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className={"flex flex-col gap-8"}>
                            <div className={"grid lg:grid-cols-1 md:grid-cols-1 md:gap-4 gap-3"}>
                                {
                                    analyticsResponse.map((x) => {
                                        return(
                                            x.question_type === 6 || x.question_type === 7 ?  <Card>
                                                <CardContent className={"text-2xl font-medium p-2 md:p-4"}>
                                                    <div className={"text-base font-medium mb-2"}>{x.text}</div>
                                                    <div className={"border"}>
                                                        <Table>
                                                            <TableHeader className={`${theme === "dark" ? "" : "bg-muted"}`}>
                                                                <TableRow>
                                                                    <TableHead className={`px-2 py-[10px] md:px-3 font-medium text-card-foreground`} >
                                                                        Name
                                                                    </TableHead>
                                                                    <TableHead className={`px-2 py-[10px] md:px-3 font-medium text-card-foreground`} >
                                                                        Response
                                                                    </TableHead>
                                                                    <TableHead className={`px-2 py-[10px] md:px-3 font-medium text-card-foreground`} >
                                                                        Date Responded
                                                                    </TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {
                                                                    (x?.report || []).map((x,i)=> {
                                                                        return (
                                                                            <TableRow key={x.id}>
                                                                                <TableCell className={`flex items-center px-2 py-[10px] md:px-3 gap-2`}>
                                                                                    <>
                                                                                        <Avatar className={"w-[20px] h-[20px]"}>
                                                                                            <AvatarFallback>{x?.name? x?.name?.substring(0, 1) : x?.email?.substring(0, 1)}</AvatarFallback>
                                                                                        </Avatar>
                                                                                        <p className={"font-normal"}>{x?.name? x?.name : x.email}</p>
                                                                                    </>
                                                                                </TableCell>
                                                                                <TableCell className={`px-2 py-[10px] md:px-3 font-normal`}>
                                                                                    {x?.response}
                                                                                </TableCell>
                                                                                <TableCell className={`px-2 py-[10px] md:px-3 font-normal`}>{moment(x.created_at).format("ll")}</TableCell>
                                                                            </TableRow>
                                                                        )
                                                                    })
                                                                }
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </CardContent>
                                            </Card>: ""
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Fragment>
    );
};

export default SurveysAnalyticsView;