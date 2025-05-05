import React, {Fragment, useEffect, useState} from 'react';
import {Card, CardContent, CardHeader} from "../../ui/card";
import {Skeleton} from "../../ui/skeleton";
import {ApiService} from "../../../utils/ApiService";
import {useSelector} from "react-redux";
import moment from "moment";
import {useParams} from "react-router-dom";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import EmptyData from "../../Comman/EmptyData";
import {UserAvatar} from "../../Comman/CommentEditor";
import {AnalyticsLayout, AnalyticsLineChart} from "./CommonAnalyticsView/CommonUse";
import {AnalyticsSummary} from "./CommonAnalyticsView/CommonUse";

const CommonBannerTable = ({columns, data, isLoading, skeletonRows = 10, skeletonColumns = 4}) => {
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
                    ? Array.from({length: skeletonRows}).map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {Array.from({length: skeletonColumns}).map((_, colIndex) => (
                                <TableCell key={colIndex} className="px-2 py-[10px] md:px-3">
                                    <Skeleton className="rounded-md w-full h-7"/>
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
                                    <EmptyData/>
                                </TableCell>
                            </TableRow>
                        )}
            </TableBody>
        </Table>
    );
};

const BannerAnalyticsView = () => {
    const {id, type} = useParams();
    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const [inAppMsgSetting, setInAppMsgSetting] = useState({});
    const [analytics, setAnalytics] = useState({})
    const [isLoading, setIsLoading] = useState(false);

    const openedColumns = [
        {
            label: "Name", dataKey: "name", render: (row) => (
                <div className="flex items-center gap-2">
                    <UserAvatar className="w-[20px] h-[20px]"
                                userName={row?.name ? row?.name?.substring(0, 1) : row?.email?.substring(0, 1)}/>
                    <p className="font-normal">{row.name || row.email}</p>
                </div>
            )
        },
        {label: "When it was opened", dataKey: "createdAt", render: (row) => moment(row.createdAt).format("ll")},
    ];

    const repliedColumns = [
        {
            label: "Name", dataKey: "name", render: (row) => (
                <div className="flex items-center gap-2">
                    <UserAvatar className="w-[20px] h-[20px]"
                                userName={row?.name ? row?.name?.substring(0, 1) : row?.email?.substring(0, 1)}/>
                    <p className="font-normal">{row.name || row.email}</p>
                </div>
            )
        },
        {
            label: "Reaction", dataKey: "emojiUrl", align: "center", render: (row) =>
                row.emojiUrl ? <img className="h-6 w-6 cursor-pointer" src={row.emojiUrl} alt="reaction"/> : "-"
        },
        {label: "Collected Email", dataKey: "submitMail", align: "center"},
        {
            label: "When they replied",
            dataKey: "createdAt",
            align: "center",
            render: (row) => moment(row.createdAt).format("ll")
        },
    ];

    useEffect(() => {
        if (id !== "new" && projectDetailsReducer.id) {
            getSingleInAppMessages();
        }
    }, [projectDetailsReducer.id]);

    const getSingleInAppMessages = async () => {
        setIsLoading(true)
        const data = await apiService.getSingleInAppMessage(id)
        setIsLoading(false);
        if (data.success) {
            const payload = {
                ...data.data.data,
                bodyText: data.data.data.bodyText,
            }
            const combinedData = {};
            data.data.analytics?.charts.forEach(({x, y}) => {
                if (!combinedData[x]) {
                    combinedData[x] = {view: 0, response: 0, x};
                }
                combinedData[x].view = parseFloat(y);
            });
            data.data.analytics?.responseCharts.forEach(({x, y}) => {
                if (!combinedData[x]) {
                    combinedData[x] = {view: 0, response: 0, x};
                }
                combinedData[x].response = parseFloat(y);
            });
            const result = Object.values(combinedData).sort((a, b) => new Date(a.x) - new Date(b.x))
            setAnalytics({
                chart: result,
                analytics: data.data.analytics.analytics,
                openCount: data.data.analytics.openCount,
                responseCount: data.data.analytics.responseCount,
                responses: data.data.analytics.responses,
                responsePercentage: data.data.analytics.responsePercentage
            })
            setInAppMsgSetting(payload);
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

    return (
        <Fragment>
            <AnalyticsLayout links={links} currentPage={inAppMsgSetting?.title}>
                <AnalyticsSummary analyticsViews={analyticsViews} isLoading={isLoading}/>
                <AnalyticsLineChart
                    title="How did that change over time?"
                    data={analytics?.chart}
                    isLoading={isLoading}
                    chartConfig={{
                        view: {label: "View", color: "#7c3bed80"},
                        response: {label: "Response", color: "#7c3aed"}
                    }}
                    dataKeys={["view", "response"]}
                />
                <Card>
                    <CardHeader className={"p-4 border-b text-base font-medium"}>Customers who opened</CardHeader>
                    <CardContent className={"p-0 overflow-auto"}>
                        <CommonBannerTable
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
                        <CommonBannerTable
                            columns={repliedColumns}
                            data={analytics.responses || []}
                            isLoading={isLoading}
                            skeletonRows={10}
                            skeletonColumns={4}
                        />
                    </CardContent>
                </Card>
            </AnalyticsLayout>
        </Fragment>
    );
};

export default BannerAnalyticsView;