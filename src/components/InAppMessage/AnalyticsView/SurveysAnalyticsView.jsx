import React, {Fragment, useEffect, useState} from 'react';
import {Card, CardContent, CardHeader} from "../../ui/card";
import {Skeleton} from "../../ui/skeleton";
import {ApiService} from "../../../utils/ApiService";
import {useSelector} from "react-redux";
import moment from "moment";
import {useParams} from "react-router-dom";
import {Bar, BarChart, CartesianGrid, XAxis, YAxis,} from 'recharts';
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "../../ui/chart";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import {useTheme} from "../../theme-provider";
import {Avatar, AvatarFallback} from "../../ui/avatar";
import EmptyData from "../../Comman/EmptyData";
import {chartLoading} from "../../Comman/CommSkel";
import {cleanQuillHtml} from "../../../utils/constent";
import ReadMoreText from "../../Comman/ReadMoreText";
import {AnalyticsLayout, AnalyticsLineChart, CommonTable, UserCell} from "./CommonAnalyticsView/CommonUse";
import {AnalyticsSummary} from "./CommonAnalyticsView/CommonUse";

const chartConfigNPS = {
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
        setIsLoading(false);
        if (data.success) {
            const payload = {
                ...data.data.data,
            }
            setAnalytics(data.data.analytics)
            setInAppMsgSetting(payload);
        }
    }

    const getResponseInAppMessage = async () => {
        setIsLoading(true)
        const data = await apiService.getResponseInAppMessage({inAppMessageId: id})
        setIsLoading(false);
        if (data.success) {
            setAnalyticsResponse(data.data)
        }
    }

    const analyticsViews = [
        {
            title: "Total View",
            show: true,
            count: analytics?.openCount || 0,
        },
        {
            title: "Total Response",
            show: inAppMsgSetting?.replyType === 1,
            count: analytics?.responseCount || 0,
        },
        {
            title: "Completion Rate",
            count: `${((analytics?.responsePercentage || 0) / 100).toFixed(2)}%`,
            show: inAppMsgSetting?.replyType === 1,
        },
    ]

    const links = [{label: 'In App Message', path: `/app-message`}];

    const openedColumns = [
        {
            label: "Name",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Avatar className="w-[20px] h-[20px]">
                        <AvatarFallback>{row?.name ? row?.name.substring(0, 1) : row?.email.substring(0, 1)}</AvatarFallback>
                    </Avatar>
                    <p className="font-normal">{row.name || row.email}</p>
                </div>
            ),
        },
        {label: "When it was opened", render: (row) => moment(row.createdAt).format("ll")},
    ];

    const getRepliedColumns = (steps) => {
        const baseColumns = [
            {label: "Name", render: (row) => <UserCell name={row.name} email={row.email}/>},
        ];

        const stepColumns = (steps || [])
            .filter((_, index) => index !== 7)
            .map((step) => ({
                label: step.text,
                className: "max-w-[140px] truncate text-ellipsis overflow-hidden whitespace-nowrap",
                render: (row) => {
                    const matchedResponse = row.response?.find((r) => r.stepId === step.stepId) || {response: "-"};
                    return cleanQuillHtml(matchedResponse.response) ? (
                        <ReadMoreText html={matchedResponse.response} maxLength={30}/>
                    ) : "-";
                },
            }));

        return [
            ...baseColumns,
            ...stepColumns,
            {label: "Date Responded", render: (row) => moment(row.createdAt).format("ll")},
        ];
    };

    return (
        <Fragment>
            <AnalyticsLayout links={links} currentPage={inAppMsgSetting?.title}>
                <AnalyticsSummary analyticsViews={analyticsViews} isLoading={isLoading}/>
                <AnalyticsLineChart
                    title="How did that change over time?"
                    data={analytics?.chart}
                    isLoading={isLoading}
                    chartConfig={{y: {label: "View", color: "#7c3aed"}}}
                    dataKeys={["y"]}
                />
                <Card>
                    <CardHeader className={"p-4 border-b text-base font-medium"}>Customers who opened</CardHeader>
                    <CardContent className={"p-0 overflow-auto"}>
                        <CommonTable columns={openedColumns} data={analytics.analytics || []} isLoading={isLoading}
                                     theme={theme} skeletonColumns={2}/>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className={"p-4 border-b text-base font-medium"}>Customers who responded</CardHeader>
                    <CardContent className={"p-0 overflow-auto"}>
                        <Table>
                            <TableHeader className={`${theme === "dark" ? "" : "bg-muted"}`}>
                                <TableRow>
                                    <TableHead className={`px-2 py-[10px] md:px-3 font-medium text-card-foreground`}>
                                        Name
                                    </TableHead>
                                    {
                                        (inAppMsgSetting?.steps || []).filter((step, index) => index !== 7).map((x, i) => {
                                            return (
                                                <TableHead
                                                    className={`max-w-[140px] truncate text-ellipsis overflow-hidden whitespace-nowrap px-2 py-[10px] md:px-3 font-medium text-card-foreground`}
                                                    key={i}>
                                                    {x.text}
                                                </TableHead>
                                            );
                                        })
                                    }
                                    <TableHead className={`px-2 py-[10px] md:px-3 font-medium text-card-foreground`}>
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
                                                                    <TableCell key={i}
                                                                               className={"max-w-[373px] px-2 py-[10px] md:px-3"}>
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
                                        (analytics?.responses || []).length > 0 ?
                                            <Fragment>
                                                {
                                                    (analytics?.responses || []).map((response, i) => {
                                                        const userName = response?.name || response?.email;
                                                        const createdAt = moment(response?.createdAt).format("ll");
                                                        return (
                                                            <TableRow key={response.userId || i}>
                                                                {/* User Information */}
                                                                <TableCell
                                                                    className="flex items-center px-2 py-[10px] md:px-3 gap-2">
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
                                                                        (r) => r.stepId === step.stepId
                                                                    ) || {response: "-"};

                                                                    return (
                                                                        <TableCell
                                                                            key={`response-${response.userId}-${stepIndex}`}
                                                                            className="px-2 py-[10px] md:px-3 font-normal"
                                                                        >
                                                                            {
                                                                                cleanQuillHtml(matchedResponse.response) ?
                                                                                    <ReadMoreText
                                                                                        html={matchedResponse.response}
                                                                                        maxLength={30}/> : "-"
                                                                            }
                                                                        </TableCell>
                                                                    );
                                                                })}

                                                                {/* Creation Date */}
                                                                <TableCell
                                                                    className="px-2 py-[10px] md:px-3 font-normal">
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
                        {/*<CommonTable*/}
                        {/*    columns={getRepliedColumns(inAppMsgSetting?.steps)}*/}
                        {/*    data={analytics.responses || []}*/}
                        {/*    isLoading={isLoading}*/}
                        {/*    theme={theme}*/}
                        {/*    skeletonColumns={(inAppMsgSetting?.steps?.length || 1) + 2}*/}
                        {/*/>*/}
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
                                    if (x.questionType === 2 || x.questionType === 3) {
                                        for (let i = x.startNumber; i <= x.endNumber; i++) {
                                            const foundReport = x.report.find(item => item.response === i.toString());
                                            if (foundReport) {
                                                questionType2.push({
                                                    total: foundReport.total,
                                                    response: x.questionType === 3 ? `(${foundReport.response} stars)` : `(${foundReport.response})`
                                                });
                                            } else {
                                                questionType2.push({
                                                    total: 0,
                                                    response: x.questionType === 3 ? `(${i} stars)` : `(${i})`
                                                });
                                            }
                                        }
                                    }
                                    if (x.questionType === 4) {
                                        x.reactions.map((r) => {
                                            const foundReport = x.report.find(item => item.reactionId === r.id);
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

                                    if (x.questionType === 5) {
                                        x.options.map((r) => {
                                            const foundReport = x.report.find(item => item.stepOptionId === r.id);
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
                                    return (
                                        x.questionType === 6 || x.questionType === 7 || x.questionType === 8 ? "" :
                                            <Card key={x.id}>
                                                <CardHeader
                                                    className={"p-4 border-b text-base font-medium"}>{x.text}</CardHeader>
                                                {
                                                    isLoading ? chartLoading(7, "p-2") :
                                                        <CardContent className={"p-4 pl-0"}>
                                                            {
                                                                x.questionType === 1 ? <div>
                                                                    <ChartContainer config={chartConfigNPS}>
                                                                        <BarChart accessibilityLayer data={x?.report1}>
                                                                            <CartesianGrid vertical={false}/>
                                                                            <XAxis
                                                                                dataKey="createdAt"
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
                                                                            <YAxis tickLine={false} axisLine={false}
                                                                                   tickFormatter={(value) => `${value}%`}/>
                                                                            <ChartTooltip
                                                                                cursor={true}
                                                                                content={<ChartTooltipContent
                                                                                    formatter={(value, name) => {
                                                                                        return (
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
                                                                                                <div
                                                                                                    className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                                                                                    {value}
                                                                                                    <span
                                                                                                        className="font-normal text-muted-foreground">%</span>
                                                                                                </div>
                                                                                            </Fragment>
                                                                                        )
                                                                                    }}
                                                                                />}
                                                                            />

                                                                            <Bar
                                                                                dataKey="detractorPercentage"
                                                                                stackId="a"
                                                                                fill="var(--color-detractor)"
                                                                                radius={[0, 0, 4, 4]}
                                                                                name={"Detractor"}
                                                                            />
                                                                            <Bar
                                                                                dataKey="passivesPercentage"
                                                                                stackId="a"
                                                                                fill="var(--color-passives)"
                                                                                radius={[0, 0, 0, 0]}
                                                                                name={"Passives"}
                                                                            />
                                                                            <Bar
                                                                                dataKey="promoterPercentage"
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
                                                                    }}>
                                                                        <BarChart accessibilityLayer
                                                                                  data={x.questionType === 2 || x.questionType === 3 ? questionType2 : x.questionType === 4 ? questionType4 : x.questionType === 5 ? questionType5 : []}>
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
                                                                                content={<ChartTooltipContent
                                                                                    indicator="line"/>}
                                                                            />
                                                                            <Bar dataKey="total"
                                                                                 fill="var(--color-total)"
                                                                                 className={"cursor-pointer"}
                                                                                 radius={4}/>

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
                            analyticsResponse.map((x, i) => {
                                return (
                                    x.questionType === 6 || x.questionType === 7 ?
                                        <Card key={i}>
                                            {x.text && <CardHeader
                                                className={"p-4 border-b text-base font-medium"}>{x.text}</CardHeader>}
                                            <CardContent className={"p-0 overflow-auto"}>
                                                <Table>
                                                    <TableHeader className={`${theme === "dark" ? "" : "bg-muted"}`}>
                                                        <TableRow>
                                                            {
                                                                ["Name", "Response", "Date Responded"].map((x, i) => {
                                                                    return (
                                                                        <TableHead key={i}
                                                                                   className={`px-2 py-[10px] md:px-3 font-medium text-card-foreground`}>
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
                                                                                        <TableCell key={i}
                                                                                                   className={"px-2 py-[10px] md:px-3"}>
                                                                                            <Skeleton
                                                                                                className={"rounded-md w-full h-7"}/>
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
                                                                        (x?.report || []).map((x, i) => {
                                                                            return (
                                                                                <TableRow key={i}>
                                                                                    <TableCell
                                                                                        className={`flex items-center px-2 py-[10px] md:px-3 gap-2`}>
                                                                                        <>
                                                                                            <Avatar
                                                                                                className={"w-[20px] h-[20px]"}>
                                                                                                <AvatarFallback>{x?.name ? x?.name?.substring(0, 1) : x?.email?.substring(0, 1)}</AvatarFallback>
                                                                                            </Avatar>
                                                                                            <p className={"font-normal"}>{x?.name ? x?.name : x.email}</p>
                                                                                        </>
                                                                                    </TableCell>
                                                                                    <TableCell
                                                                                        className={`px-2 py-[10px] md:px-3 font-normal max-w-[270px]`}>
                                                                                        {
                                                                                            cleanQuillHtml(x?.response) ?
                                                                                                <ReadMoreText
                                                                                                    html={x.response}
                                                                                                    maxLength={300}/> : null
                                                                                        }
                                                                                    </TableCell>
                                                                                    <TableCell
                                                                                        className={`px-2 py-[10px] md:px-3 font-normal`}>{moment(x.createdAt).format("ll")}</TableCell>
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
                                        </Card> : ""
                                )
                            })
                        }
                    </div>
                </div>
            </AnalyticsLayout>
        </Fragment>
    );
};

export default SurveysAnalyticsView;