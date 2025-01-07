import React, {Fragment, useEffect, useState} from 'react';
import {Card, CardContent, CardHeader} from "../../ui/card";
import {Skeleton} from "../../ui/skeleton";
import {ApiService} from "../../../utils/ApiService";
import {useSelector} from "react-redux";
import moment from "moment";
import {useParams} from "react-router-dom";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';
import {ChartContainer, ChartTooltipContent} from "../../ui/chart";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import {useTheme} from "../../theme-provider";
import {Avatar, AvatarFallback} from "../../ui/avatar";
import EmptyData from "../../Comman/EmptyData";
import CommonBreadCrumb from "../../Comman/CommonBreadCrumb";
import {chartLoading} from "../../Comman/CommSkel";
import {UserAvatar} from "../../Comman/CommentEditor";

const chartConfig = {
    view: {label: "View", color: "#7c3bed80",},
    response: {label: "Response", color: "#7c3aed",},
}

const CommonTable = ({ columns, data, isLoading, skeletonRows = 10, skeletonColumns = 4 }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((col, index) => (
                        <TableHead
                            key={index}
                            className={`px-2 py-[10px] md:px-3 font-medium text-card-foreground ${col.align ? `text-${col.align}` : ""}`}
                        >
                            {col.label}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading
                    ? Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {Array.from({ length: skeletonColumns }).map((_, colIndex) => (
                                <TableCell key={colIndex} className="px-2 py-[10px] md:px-3">
                                    <Skeleton className="rounded-md w-full h-7" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                    : data.length > 0
                        ? data.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <TableCell
                                        key={colIndex}
                                        className={`px-2 py-[10px] md:px-3 ${
                                            col.align ? `text-${col.align}` : ""
                                        }`}
                                    >
                                        {col.render ? col.render(row) : row[col.dataKey] || "-"}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                        : (
                            <TableRow>
                                <TableCell colSpan={columns.length}>
                                    <EmptyData />
                                </TableCell>
                            </TableRow>
                        )}
            </TableBody>
        </Table>
    );
};

const BannerAnalyticsView = () => {
    const {theme} = useTheme();
    const {id, type} = useParams();
    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const [inAppMsgSetting, setInAppMsgSetting] = useState({});
    const [analytics, setAnalytics] = useState({})
    const [isLoading, setIsLoading] = useState(false);

    const openedColumns = [
        { label: "Name", dataKey: "name", render: (row) => (
                <div className="flex items-center gap-2">
                    <UserAvatar className="w-[20px] h-[20px]" userName={row?.name ? row?.name?.substring(0, 1) : row?.email?.substring(0, 1)} />
                    <p className="font-normal">{row.name || row.email}</p>
                </div>
            ) },
        { label: "When it was opened", dataKey: "created_at", render: (row) => moment(row.created_at).format("ll") },
    ];

    const repliedColumns = [
        { label: "Name", dataKey: "name", render: (row) => (
                <div className="flex items-center gap-2">
                    <UserAvatar className="w-[20px] h-[20px]" userName={row?.name ? row?.name?.substring(0, 1) : row?.email?.substring(0, 1)} />
                    <p className="font-normal">{row.name || row.email}</p>
                </div>
            ) },
        { label: "Reaction", dataKey: "emoji_url", align: "center", render: (row) =>
                row.emoji_url ? <img className="h-6 w-6 cursor-pointer" src={row.emoji_url} alt="reaction" /> : "-" },
        { label: "Collected Email", dataKey: "submit_mail", align: "center" },
        { label: "When they replied", dataKey: "created_at", align: "center", render: (row) => moment(row.created_at).format("ll") },
    ];

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
                body_text: type === "1" ? JSON.parse(data.data.body_text) : data.data.body_text,
            }
            const combinedData = {};
            data.analytics.charts.forEach(({ x, y }) => {
                if (!combinedData[x]) {
                    combinedData[x] = { view: 0, response: 0, x };
                }
                combinedData[x].view = parseFloat(y);
            });
            data.analytics.response_charts.forEach(({ x, y }) => {
                if (!combinedData[x]) {
                    combinedData[x] = { view: 0, response: 0, x };
                }
                combinedData[x].response = parseFloat(y);
            });
            const result = Object.values(combinedData).sort((a, b) => new Date(a.x) - new Date(b.x))
            setAnalytics({chart:result, analytics: data.analytics.analytics, open_count: data.analytics.open_count, response_count: data.analytics.response_count, responses: data.analytics.responses, response_percentage: data.analytics.response_percentage})
            setInAppMsgSetting(payload);
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
            // count: `${analytics?.response_percentage?.toFixed(2) || 0}%`,
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
                                {analyticsViews.map((x, i) => (
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
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className={"p-4 border-b text-base font-medium"}>How did that change over time?</CardHeader>
                        {
                            isLoading ? chartLoading(15, "p-2") :
                            <CardContent className={"p-4 pl-0"}>
                                {
                                    analytics?.chart?.length > 0 ? <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
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
                                        : <EmptyData />
                                }
                            </CardContent>
                        }
                    </Card>
                    <Card>
                        <CardHeader className={"p-4 border-b text-base font-medium"}>Customers who opened</CardHeader>
                        <CardContent className={"p-0 overflow-auto"}>
                            <CommonTable
                                columns={openedColumns}
                                data={analytics.analytics || []}
                                isLoading={isLoading}
                                skeletonRows={10}
                                skeletonColumns={2}
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className={"p-4 border-b text-base font-medium"}>Customers who replied</CardHeader>
                        <CardContent className={"p-0 overflow-auto"}>
                            <CommonTable
                                columns={repliedColumns}
                                data={analytics.responses || []}
                                isLoading={isLoading}
                                skeletonRows={10}
                                skeletonColumns={4}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Fragment>
    );
};

export default BannerAnalyticsView;