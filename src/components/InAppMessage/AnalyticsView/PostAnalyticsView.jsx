import React, {Fragment, useEffect, useState} from 'react';
import {Card, CardContent, CardHeader} from "../../ui/card";
import {useSelector} from "react-redux";
import moment from "moment";
import {useParams} from "react-router-dom";
import {useTheme} from "../../theme-provider";
import {AnalyticsLayout, AnalyticsLineChart, AnalyticsSummary, CommonTable, ImageCarouselCell, UserCell} from "./CommonAnalyticsView/CommonUse";
import {apiService} from "../../../utils/constent";

const PostAnalyticsView = () => {
    const {theme} = useTheme();
    const {id} = useParams();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const [inAppMsgSetting, setInAppMsgSetting] = useState({});
    const [analytics, setAnalytics] = useState({})
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id !== "new" && projectDetailsReducer.id) {
            getSingleInAppMessage();
        }
    }, [projectDetailsReducer.id]);

    const getSingleInAppMessage = async () => {
        setIsLoading(true)
        const data = await apiService.getSingleInAppMessage(id)
        setIsLoading(false);
        if (data.success) {
            const payload = {
                ...data.data.data,
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
            setInAppMsgSetting(payload)
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
            count: `${((analytics?.responsePercentage|| 0) / 100).toFixed(2)}%`,
            show: inAppMsgSetting?.replyType === 1,
        },
    ]

    const links = [
        { label: 'In App Message', path: `/app-message` }
    ];

    const repliedColumns = [
        { label: "Name", render: (row) => <UserCell name={row.name} email={row.email} /> },
        { label: "Reply", dataKey: "response", className: "max-w-[270px] truncate text-ellipsis overflow-hidden whitespace-nowrap" },
        { label: "Reaction", align: "center", render: (row) => row.emojiUrl ? <img className="h-6 w-6 cursor-pointer" src={row.emojiUrl} /> : "-" },
        { label: "Image View", align: "center", render: (row) => <ImageCarouselCell files={row.files} /> },
        { label: "When they replied", align: "center", render: (row) => moment(row.createdAt).format("ll") },
    ];

    const openedColumns = [
        { label: "Name", render: (row) => <UserCell name={row.name} email={row.email} /> },
        { label: "When it was opened", render: (row) => moment(row.createdAt).format("ll") },
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