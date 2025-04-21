import React, {Fragment, useEffect, useState} from 'react';
import {Card, CardContent, CardHeader} from "../../ui/card";
import {ApiService} from "../../../utils/ApiService";
import {useSelector} from "react-redux";
import moment from "moment";
import {useParams} from "react-router-dom";
import {useTheme} from "../../theme-provider";
import {AnalyticsLayout, AnalyticsLineChart, AnalyticsSummary, CommonTable, ImageCarouselCell, UserCell} from "./CommonAnalyticsView/CommonUse";

const PostAnalyticsView = () => {
    const {theme} = useTheme();
    const {id} = useParams();
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
            data.analytics?.charts.forEach(({ x, y }) => {
                if (!combinedData[x]) {
                    combinedData[x] = { view: 0, response: 0, x };
                }
                combinedData[x].view = parseFloat(y);
            });
            data.analytics?.response_charts.forEach(({ x, y }) => {
                if (!combinedData[x]) {
                    combinedData[x] = { view: 0, response: 0, x };
                }
                combinedData[x].response = parseFloat(y);
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
            count: `${((analytics?.response_percentage|| 0) / 100).toFixed(2)}%`,
            show: inAppMsgSetting?.reply_type === 1,
        },
    ]

    const links = [
        { label: 'In App Message', path: `/app-message` }
    ];

    const repliedColumns = [
        { label: "Name", render: (row) => <UserCell name={row.name} email={row.email} /> },
        { label: "Reply", dataKey: "response", className: "max-w-[270px] truncate text-ellipsis overflow-hidden whitespace-nowrap" },
        { label: "Reaction", align: "center", render: (row) => row.emoji_url ? <img className="h-6 w-6 cursor-pointer" src={row.emoji_url} /> : "-" },
        { label: "Image View", align: "center", render: (row) => <ImageCarouselCell files={row.files} /> },
        { label: "When they replied", align: "center", render: (row) => moment(row.created_at).format("ll") },
    ];

    const openedColumns = [
        { label: "Name", render: (row) => <UserCell name={row.name} email={row.email} /> },
        { label: "When it was opened", render: (row) => moment(row.created_at).format("ll") },
    ];

    return (
        <Fragment>
            <AnalyticsLayout links={links} currentPage={inAppMsgSetting?.title}>
                <AnalyticsSummary analyticsViews={analyticsViews} isLoading={isLoading} />
                <AnalyticsLineChart
                    title="How did that change over time?"
                    data={analytics?.charts}
                    isLoading={isLoading}
                    chartConfig={{ y: { label: "View", color: "#7c3aed" } }}
                    dataKeys={["y"]}
                />
                    <Card>
                        <CardHeader className={"p-4 border-b text-base font-medium"}>Customers who opened</CardHeader>
                        <CardContent className={"p-0 overflow-auto"}>
                            <CommonTable columns={openedColumns} data={analytics.analytics || []} isLoading={isLoading} theme={theme} skeletonColumns={2} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className={"p-4 border-b text-base font-medium"}>Customers who replied</CardHeader>
                        <CardContent className={"p-0 overflow-auto"}>
                            <CommonTable columns={repliedColumns} data={analytics.responses || []} isLoading={isLoading} theme={theme} skeletonColumns={5} />
                        </CardContent>
                    </Card>
            </AnalyticsLayout>
        </Fragment>
    );
};

export default PostAnalyticsView;