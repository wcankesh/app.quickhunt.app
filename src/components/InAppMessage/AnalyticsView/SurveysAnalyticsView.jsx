import React, {Fragment, useEffect, useState} from 'react';
import {Card, CardContent, CardHeader} from "../../ui/card";
import {Skeleton} from "../../ui/skeleton";
import {ApiService} from "../../../utils/ApiService";
import {useSelector} from "react-redux";
import moment from "moment";
import {useParams} from "react-router-dom";
import {Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts';
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "../../ui/chart";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import {useTheme} from "../../theme-provider";
import {Avatar, AvatarFallback} from "../../ui/avatar";
import EmptyData from "../../Comman/EmptyData";
import CommonBreadCrumb from "../../Comman/CommonBreadCrumb";
import {chartLoading} from "../../Comman/CommSkel";
import {cleanQuillHtml} from "../../../utils/constent";
import ReadMoreText from "../../Comman/ReadMoreText";

const chartConfig = {y: {label: "View", color: "#7c3aed"}}

const chartConfigNPS ={
    detractor: {label: "Detractor", color: "#e87e6d",},
    passives: {label: "Passives", color: "#f0ca00",},
    promoter: {label: "Promoter", color: "#55c99b",},
}

const SurveysAnalyticsView = () => {
    const {theme} = useTheme();
    const {id} = useParams();
    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const [inAppMsgSetting, setInAppMsgSetting] = useState({});
    const [analytics, setAnalytics] = useState({})
    const [analyticsResponse, setAnalyticsResponse] = useState([])
    const [isLoading, setIsLoading] = useState(false);

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
            title: "Total View",
            show: true,
            count: analytics?.open_count || 0,
        },
        {
            title: "Total Response",
            show: inAppMsgSetting?.reply_type === 1,
            count: analytics?.response_count || 0,
        },
        {
            title: "Completion Rate",
            count: `${((analytics?.response_percentage|| 0) / 100).toFixed(2)}%`,
            show: inAppMsgSetting?.reply_type === 1,
        },
    ]

    const links = [{ label: 'In App Message', path: `/app-message` }];

    return (
        <Fragment>
            <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>
                <div className={"pb-6"}>
                    <CommonBreadCrumb
                        links={links}
                        currentPage={inAppMsgSetting?.title}
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
                                                {isLoading ? <div className={"space-y-[14px] w-full p-4 border-b md:border-r md:border-0 last:border-b-0 last:border-r-0"}>
                                                    <Skeleton className="h-4"/>
                                                    <Skeleton className="h-4"/></div> : (
                                                    <div className={`p-4 border-b md:border-r md:border-0 last:border-b-0 last:border-r-0`}>
                                                        <h3 className={"text-base font-medium"}>{x.title}</h3>
                                                        <div className={"flex gap-1"}>
                                                            <h3 className={`text-2xl font-medium`}>{x.count}</h3>
                                                        </div>
                                                    </div>
                                                )}
                                            </Fragment>
                                        )
                                    })
                                }
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className={"p-4 border-b text-base font-medium"}>How did that change over time?</CardHeader>
                        {
                            isLoading ? chartLoading(15, "p-2") : <CardContent className={"p-4 pl-0"}>
                                {
                                    analytics?.charts?.length > 0 ? <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
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
                                        : <EmptyData />
                                }
                            </CardContent>
                        }
                    </Card>
                    <Card>
                        <CardHeader className={"p-4 border-b text-base font-medium"}>Customers who opened</CardHeader>
                        <CardContent className={"p-0 overflow-auto"}>
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
                                                </Fragment> : <TableRow>
                                                    <TableCell colSpan={2}>
                                                        <EmptyData/>
                                                    </TableCell>
                                                </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className={"p-4 border-b text-base font-medium"}>Customers who responded</CardHeader>
                        <CardContent className={"p-0 overflow-auto"}>
                            <Table>
                                <TableHeader className={`${theme === "dark" ? "" : "bg-muted"}`}>
                                    <TableRow>
                                        <TableHead className={`px-2 py-[10px] md:px-3 font-medium text-card-foreground`} >
                                            Name
                                        </TableHead>
                                        {
                                            (inAppMsgSetting?.steps || []).filter((step, index) => index !== 7).map((x, i) => {
                                                return (
                                                    <TableHead className={`max-w-[140px] truncate text-ellipsis overflow-hidden whitespace-nowrap px-2 py-[10px] md:px-3 font-medium text-card-foreground`} key={i}>
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
                                                                [...Array(inAppMsgSetting?.steps?.length + 1 || 3)].map((_, i) => {
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
                                            (analytics?.responses || []).length >  0 ?
                                                <Fragment>
                                                    {
                                                        (analytics?.responses || []).map((response,i)=> {
                                                            const userName = response?.name || response?.email;
                                                            const createdAt = moment(response?.created_at).format("ll");
                                                            return (
                                                                <TableRow key={response.user_id || i}>
                                                                    {/* User Information */}
                                                                    <TableCell className="flex items-center px-2 py-[10px] md:px-3 gap-2">
                                                                        <Avatar className="w-[20px] h-[20px]">
                                                                            <AvatarFallback>
                                                                                {userName?.substring(0, 1)}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <p className="font-normal">{userName}</p>
                                                                    </TableCell>
                                                                    {/* Responses for Steps */}
                                                                    {(inAppMsgSetting?.steps || []).filter((_, index) => index !== 7).map((step, stepIndex) => {
                                                                        const matchedResponse = response?.response?.find(
                                                                            (r) => r.step_id === step.step_id
                                                                        ) || { response: "-" };

                                                                        return (
                                                                            <TableCell
                                                                                key={`response-${response.user_id}-${stepIndex}`}
                                                                                className="px-2 py-[10px] md:px-3 font-normal"
                                                                            >
                                                                                {
                                                                                    cleanQuillHtml(matchedResponse.response) ? <ReadMoreText html={matchedResponse.response} maxLength={30}/> : "-"
                                                                                }
                                                                            </TableCell>
                                                                        );
                                                                    })}

                                                                    {/* Creation Date */}
                                                                    <TableCell className="px-2 py-[10px] md:px-3 font-normal">
                                                                        {createdAt}
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })
                                                    }
                                                </Fragment> : <TableRow>
                                                    <TableCell colSpan={10}>
                                                        <EmptyData/>
                                                    </TableCell>
                                                </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <div className={"flex flex-col gap-4"}>
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
                                                    <CardHeader className={"p-4 border-b text-base font-medium"}>{x.text}</CardHeader>
                                                    {
                                                        isLoading ? chartLoading(7, "p-2") :
                                                            <CardContent className={"p-4 pl-0"}>
                                                                {
                                                                    x.question_type === 1 ? <div>
                                                                        <ChartContainer config={chartConfigNPS}>
                                                                            <BarChart accessibilityLayer data={x?.report1}>
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
                                                    }
                                                </Card>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className={"flex flex-col gap-4"}>
                            {
                                analyticsResponse.map((x) => {
                                    return(
                                        x.question_type === 6 || x.question_type === 7 ?
                                            <Card>
                                                {x.text && <CardHeader className={"p-4 border-b text-base font-medium"}>{x.text}</CardHeader>}
                                            <CardContent className={"p-0 overflow-auto"}>
                                                    <Table>
                                                        <TableHeader className={`${theme === "dark" ? "" : "bg-muted"}`}>
                                                            <TableRow>
                                                                {
                                                                    ["Name", "Response", "Date Responded"].map((x, i) => {
                                                                        return (
                                                                            <TableHead key={i} className={`px-2 py-[10px] md:px-3 font-medium text-card-foreground`} >
                                                                                {x}
                                                                            </TableHead>
                                                                        )
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
                                                                                    [...Array(3)].map((_, i) => {
                                                                                        return (
                                                                                            <TableCell key={i} className={"px-2 py-[10px] md:px-3"}>
                                                                                                <Skeleton className={"rounded-md w-full h-7"}/>
                                                                                            </TableCell>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </TableRow>
                                                                        )
                                                                    })
                                                                ) : (x?.report || []).length > 0 ?
                                                                    <Fragment>
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
                                                                                        <TableCell className={`px-2 py-[10px] md:px-3 font-normal max-w-[270px]`}>
                                                                                            {
                                                                                                cleanQuillHtml(x?.response) ? <ReadMoreText html={x.response} maxLength={300}/> : null
                                                                                            }
                                                                                        </TableCell>
                                                                                        <TableCell className={`px-2 py-[10px] md:px-3 font-normal`}>{moment(x.created_at).format("ll")}</TableCell>
                                                                                    </TableRow>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Fragment> : <TableRow>
                                                                        <TableCell colSpan={3}>
                                                                            <EmptyData/>
                                                                        </TableCell>
                                                                    </TableRow>
                                                            }
                                                        </TableBody>
                                                    </Table>
                                            </CardContent>
                                        </Card>: ""
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default SurveysAnalyticsView;