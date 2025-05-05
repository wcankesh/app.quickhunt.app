import React, {Fragment, useEffect, useState} from 'react';
import {Card, CardContent, CardHeader} from "../../ui/card";
import {ApiService} from "../../../utils/ApiService";
import {useSelector} from "react-redux";
import moment from "moment";
import {useParams} from "react-router-dom";
import {useTheme} from "../../theme-provider";
import {Avatar, AvatarFallback} from "../../ui/avatar";
import {AnalyticsLayout, AnalyticsLineChart, CommonTable, UserCell} from "./CommonAnalyticsView/CommonUse";
import {AnalyticsSummary} from "./CommonAnalyticsView/CommonUse";

const CheckListAnalyticsView = () => {
    const {theme} = useTheme();
    const {id, type} = useParams();
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
        setIsLoading(false);
        if (data.success) {
            const payload = {
                ...data.data.data,
                bodyText: data.data.data.bodyText,
            }
            const combinedData = {};
            data.data.analytics.charts.forEach(({x, y}) => {
                if (!combinedData[x]) {
                    combinedData[x] = {view: 0, response: 0, x};
                }
                combinedData[x].view = parseFloat(y);
            });
            data.data.analytics.responseCharts.forEach(({x, y}) => {
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

    const repliedColumns = [
        {label: "Name", render: (row) => <UserCell name={row.name} email={row.email}/>},
        {label: "When they replied", render: (row) => moment(row.createdAt).format("ll")},
    ];

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
                        <CommonTable columns={openedColumns} data={analytics.analytics || []} isLoading={isLoading}
                                     theme={theme} skeletonColumns={2}/>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className={"p-4 border-b text-base font-medium"}>Customers who replied</CardHeader>
                    <CardContent className={"p-0 overflow-auto"}>
                        <CommonTable columns={repliedColumns} data={analytics.responses || []} isLoading={isLoading}
                                     theme={theme} skeletonColumns={2}/>
                    </CardContent>
                </Card>
            </AnalyticsLayout>
        </Fragment>
    );
};

export default CheckListAnalyticsView;