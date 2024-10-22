import React, {Fragment, useEffect, useState} from 'react';
import {Card, CardContent, CardHeader} from "../../ui/card";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "../../ui/breadcrumb";
import {baseUrl} from "../../../utils/constent";
import {CommSkel} from "../../Comman/CommSkel";
import {Skeleton} from "../../ui/skeleton";
import {useLocation, useNavigate} from "react-router";
import {ApiService} from "../../../utils/ApiService";
import {useSelector} from "react-redux";
import moment from "moment";
import {useParams} from "react-router-dom";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';
import {ChartContainer, ChartTooltipContent} from "../../ui/chart";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import {useTheme} from "../../theme-provider";
import {Avatar, AvatarFallback, AvatarImage} from "../../ui/avatar";



const chartConfig = {
    view: {
        label: "View",
        color: "#7c3bed80",
    },
    response: {
        label: "Response",
        color: "#7c3aed",
    },
}

const PostAnalyticsView = () => {
    const {theme} = useTheme();
    const {id} = useParams();

    const navigate = useNavigate();
    const apiService = new ApiService();

    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const [inAppMsgSetting, setInAppMsgSetting] = useState({});
    const [analytics, setAnalytics] = useState({})
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id !== "new" && projectDetailsReducer.id) {
            getSingleInAppMessages();
        }
    }, [projectDetailsReducer.id]);

    const getSingleInAppMessages = async () => {
        setIsLoading(true)
        const data = await apiService.getSingleInAppMessage(id)
        if (data.status === 200) {
            const payload = {
                ...data.data,
            }
            const combinedData = {};
            data.analytics.charts.forEach(({ x, y }) => {
                if (!combinedData[x]) {
                    combinedData[x] = { view: 0, response: 0, x }; // Initialize object
                }
                combinedData[x].view = parseFloat(y); // Add 'view' from charts
            });
            data.analytics.response_charts.forEach(({ x, y }) => {
                if (!combinedData[x]) {
                    combinedData[x] = { view: 0, response: 0, x }; // Initialize object
                }
                combinedData[x].response = parseFloat(y); // Add 'response' from response_charts
            });
            const result = Object.values(combinedData).sort((a, b) => new Date(a.x) - new Date(b.x))
            setAnalytics({chart:result, analytics: data.analytics.analytics, open_count: data.analytics.open_count, response_count: data.analytics.response_count, responses: data.analytics.responses, response_percentage: data.analytics.response_percentage})
            setInAppMsgSetting(payload)
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
            count: `${analytics?.response_percentage?.toFixed(2) || 0}%`,
            show: inAppMsgSetting?.reply_type === 1,
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
                                {analyticsViews.map((x, i) => (
                                        <Fragment key={i}>
                                            {isLoading ? (
                                                <Card>
                                                    <CardContent className={"p-0"}>{CommSkel.commonParagraphThree}</CardContent>
                                                </Card>
                                            ) : (
                                                <Card>
                                                    <CardContent className={"text-2xl font-medium p-3 md:p-6"}>
                                                        <div className={"text-base font-medium"}>{x.title}</div>
                                                        <div className={"text-base font-medium"}>{x.count}</div>
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
                                        data={analytics.chart}

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
                                            dataKey="view"
                                            type="monotone"
                                            stroke="var(--color-view)"
                                            strokeWidth={2}
                                        />
                                        <Line
                                            dataKey="response"
                                            type="monotone"
                                            stroke="var(--color-response)"
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
                            Customers who replied
                        </div>
                        <div className={"border"}>
                            <Table>
                                <TableHeader className={`${theme === "dark" ? "" : "bg-muted"}`}>
                                    <TableRow>
                                        {
                                            ["Name", "Replay", "Reaction", "When they replied"].map((x, i) => {
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
                                                                [...Array(4)].map((_, i) => {
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
                                            (analytics?.responses || []).length >  0 ?
                                                <Fragment>
                                                    {
                                                        (analytics?.responses || []).map((x,i)=> {
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
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 font-normal`}>{x?.response ||  "-" }</TableCell>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 font-normal`}>{x.emoji_url ? <img key={i} className={"h-6 w-6 cursor-pointer"} src={x.emoji_url}/> : "-" }</TableCell>
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
                    </CardContent>
                </Card>
            </div>
        </Fragment>
    );
};

export default PostAnalyticsView;