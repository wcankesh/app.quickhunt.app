import React, {Fragment, useEffect, useState} from 'react';
import {Card, CardContent, CardHeader} from "../../ui/card";
import {TooltipContent, TooltipTrigger,  TooltipProvider} from "../../ui/tooltip";
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
import {Info} from "lucide-react";
import {Button} from "../../ui/button";
import EmptyData from "../../Comman/EmptyData";

const initialState = {
    project_id: "2",
    title: "In app message",
    type: 1,
    body_text: "",
    from: "",
    reply_to: "",
    bg_color: "#EEE4FF",
    text_color: "#000000",
    icon_color: "#FD6B65",
    btn_color: "#7c3aed",
    delay: 1,
    start_at: moment().toISOString(),
    end_at: moment().add(1, 'hour').toISOString(),
    position: "top",
    alignment: "center",
    is_close_button: true,
    reply_type: 1,
    show_sender: true,
    action_type: 0,
    action_text: "",
    action_url: "",
    is_redirect: "",
    is_banner_close_button: false,
    banner_style: "",
    reactions: [],
    status: 1,
    steps:[],
    checklist_title: "",
    checklist_description : "",
    checklists: []
}

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
}

const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
]

const CheckListAnalyticsView = () => {
    const {theme} = useTheme();
    const {id, type} = useParams();
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const postId = urlParams.get("postId");
    const getPageNo = urlParams.get("pageNo") || 1;

    const navigate = useNavigate();
    const apiService = new ApiService();

    const allEmoji = useSelector(state => state.allStatusAndTypes.emoji);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const [inAppMsgSetting, setInAppMsgSetting] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStep, setSelectedStep] = useState(null);
    const [isSave, setIsSave] = useState(false);

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
            setInAppMsgSetting(payload);
            if(type === "3"){
                setSelectedStep(payload.steps[0])
            } else if(type === "4"){
                setSelectedStep(payload.checklists[0])
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    const getEmoji = inAppMsgSetting.reactions.map((x) => x.emoji)

    const analyticsViews = [
        {
            title: "Sent",
            // count: views && views[0] && views[0].totalView ? views[0].totalView : 0,
        },
        {
            title: "Viewed",
            // count: views && views[0] && views[0].uniqueView ? views[0].uniqueView : 0,
        },
        {
            title: "Completed",
            // count: views && views[0] && views[0].uniqueView ? views[0].uniqueView : 0,
        },
        {
            title: "Analysis",
            // count: views && views[0] && views[0].uniqueView ? views[0].uniqueView : 0,
        },
    ]

    const columnTitles = [
        "Name",
        inAppMsgSetting.action_type === 1
            ? "Linked"
            : inAppMsgSetting.action_type === 2
            ? "Reaction"
            : inAppMsgSetting.action_type === 3
                ? "Collected Email"
                : "Action",
        inAppMsgSetting.action_type === 1
            ? "When it was clicked"
            : inAppMsgSetting.action_type === 2
            ? "When they reacted"
            : inAppMsgSetting.action_type === 3
                ? "When it was collected"
                : "Timestamp"
    ];

    const tableTitles = [
        { title: "Step" },
        { title: "Title" },
        { title: "Viewed", tooltip: "This column shows the number of views." },
        { title: "Action clicked", tooltip: "This column shows how many times actions were clicked." },
        { title: "Completed", tooltip: "This column shows the number of completed actions." },
        { title: "How it was completed", tooltip: "This column shows how the action was completed." },
    ];

    return (
        <Fragment>
            <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>
                <Card>
                    <CardHeader className={"p-3 lg:p-6 border-b"}>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className={"cursor-pointer"}>
                                    {/*<BreadcrumbLink onClick={() => navigate(`${baseUrl}/in-app-message?pageNo=${getPageNo}`)}>*/}
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
                            <div className={"grid lg:grid-cols-4 md:grid-cols-2 md:gap-4 gap-3"}>
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
                                                        {x.emoji}
                                                        <div className={"text-base font-medium"}>{x.title}</div>
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </Fragment>
                                    ))}
                            </div>
                        </div>
                        <div>
                            <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        accessibilityLayer
                                        data={chartData}
                                        margin={{
                                            left: 12,
                                            right: 12,
                                        }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="month"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => value.slice(0, 3)}
                                        />
                                        <Tooltip
                                            cursor={false}
                                            content={<ChartTooltipContent hideLabel />}
                                        />
                                        <Line
                                            dataKey="desktop"
                                            type="linear"
                                            stroke="var(--color-desktop)"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>

                        </div>
                        <div>
                            <Table>
                                <TableHeader className={`${theme === "dark" ? "" : "bg-muted"}`}>
                                    <TableRow>
                                        {
                                            columnTitles.map((x, i) => {
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
                                                                [...Array(3)].map((_, i) => {
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
                                            inAppMsgSetting.length >  0 ?
                                                <Fragment>
                                                    {
                                                        inAppMsgSetting.map((x,i)=> {
                                                            const sender = allStatusAndTypes?.members.find((y) => y.user_id == x.from);
                                                            return (
                                                                <TableRow key={x.id}>
                                                                    <TableCell className={`flex items-center mt-1 px-2 py-[10px] md:px-3 gap-2 ${sender ? sender : "justify-center"}`}>
                                                                        {sender ? (
                                                                            <>
                                                                                <Avatar className={"w-[20px] h-[20px]"}>
                                                                                    {sender.user_photo ? (
                                                                                        <AvatarImage src={sender.user_photo} alt="@shadcn" />
                                                                                    ) : (
                                                                                        <AvatarFallback>{sender.user_first_name.substring(0, 1)}</AvatarFallback>
                                                                                    )}
                                                                                </Avatar>
                                                                                <p className={"font-normal"}>{sender.user_first_name}</p>
                                                                            </>
                                                                        ) : (
                                                                            <p className={"font-normal"}>-</p>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 font-normal`}></TableCell>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 font-normal`}></TableCell>
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
                        </div>
                        <div>
                            <Table>
                                <TableHeader className={`${theme === "dark" ? "" : "bg-muted"}`}>
                                    <TableRow>
                                        {
                                            tableTitles.map((item, i) => (
                                                <TableHead className={`px-2 py-[10px] md:px-3 font-medium text-card-foreground ${i >= 4 ? 'text-center' : ''}`} key={i}>
                                                    {item.title}
                                                    {item.tooltip && (
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button variant="outline" className="ml-2"><Info size={14} /></Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top">
                                                                    <p>{item.tooltip}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )}
                                                </TableHead>
                                            ))
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
                                                                [...Array(6)].map((_, i) => {
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
                                            inAppMsgSetting.length >  0 ?
                                                <Fragment>
                                                    {
                                                        inAppMsgSetting.map((x,i)=> {
                                                            const sender = allStatusAndTypes?.members.find((y) => y.user_id == x.from);
                                                            return (
                                                                <TableRow key={x.id}>
                                                                    <TableCell className={`flex items-center mt-1 px-2 py-[10px] md:px-3 gap-2 ${sender ? sender : "justify-center"}`}>
                                                                        {sender ? (
                                                                            <>
                                                                                <Avatar className={"w-[20px] h-[20px]"}>
                                                                                    {sender.user_photo ? (
                                                                                        <AvatarImage src={sender.user_photo} alt="@shadcn" />
                                                                                    ) : (
                                                                                        <AvatarFallback>{sender.user_first_name.substring(0, 1)}</AvatarFallback>
                                                                                    )}
                                                                                </Avatar>
                                                                                <p className={"font-normal"}>{sender.user_first_name}</p>
                                                                            </>
                                                                        ) : (
                                                                            <p className={"font-normal"}>-</p>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 font-normal`}></TableCell>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 font-normal`}></TableCell>
                                                                </TableRow>
                                                            )
                                                        })
                                                    }
                                                </Fragment> : <TableRow>
                                                    <TableCell colSpan={6}>
                                                        <EmptyData/>
                                                    </TableCell>
                                                </TableRow>
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

export default CheckListAnalyticsView;