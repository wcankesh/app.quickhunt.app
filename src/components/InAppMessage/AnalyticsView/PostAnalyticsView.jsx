import React, {Fragment, useEffect, useState} from 'react';
import {Card, CardContent, CardHeader} from "../../ui/card";
import {Skeleton} from "../../ui/skeleton";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogPortal, DialogTrigger, DialogClose, DialogOverlay} from "../../ui/dialog";
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
import {Button} from "../../ui/button";
import {Label} from "../../ui/label";
import {Input} from "../../ui/input";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "../../ui/carousel";
import Autoplay from "embla-carousel-autoplay";

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
    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const [inAppMsgSetting, setInAppMsgSetting] = useState({});
    const [analytics, setAnalytics] = useState({})
    const [isLoading, setIsLoading] = useState(false);

    const handleImageClick = (imageSrc) => {window.open(imageSrc, '_blank');};

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
            count: `${((analytics?.response_percentage|| 0) / 100).toFixed(2)}%`,
            show: inAppMsgSetting?.reply_type === 1,
        },
    ]

    const links = [
        { label: 'In App Message', path: `/app-message` }
    ];

    const plugin = React.useRef(Autoplay({delay: 2000, stopOnInteraction: true}))

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
                                                {
                                                    isLoading ?
                                                        <div className={"space-y-[14px] w-full p-4 border-b md:border-r md:border-0 last:border-b-0 last:border-r-0"}>
                                                            <Skeleton className="h-4"/>
                                                            <Skeleton className="h-4"/></div> :
                                                        <div className={`p-4 border-b md:border-r md:border-0 last:border-b-0 last:border-r-0`}>
                                                            <h3 className={"text-base font-medium"}>{x.title}</h3>
                                                            <div className={"flex gap-1"}>
                                                                <h3 className={`text-2xl font-medium`}>{x.count}</h3>
                                                            </div>
                                                        </div>
                                                }
                                            </Fragment>
                                        )
                                    })
                                }
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className={"p-4 text-base font-medium border-b"}>How did that change over time?</CardHeader>
                        {
                            isLoading ? chartLoading(15, "p-2") :
                                <CardContent className={"p-4 pl-0"}>
                                    {analytics.chart && analytics.chart.length > 0 ? <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
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
                                                            const date = new Date(value);
                                                            return date.toLocaleDateString("en-US", {
                                                                month: "short",
                                                                day: "numeric",
                                                            });
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
                                        </ChartContainer> :
                                        <EmptyData />
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
                        <CardHeader className={"p-4 border-b text-base font-medium"}>Customers who replied</CardHeader>
                        <CardContent className={"p-0 overflow-auto"}>
                            <Table>
                                <TableHeader className={`${theme === "dark" ? "" : "bg-muted"}`}>
                                    <TableRow>
                                        {
                                            ["Name", "Reply", "Reaction", "Image View", "When they replied"].map((x, i) => {
                                                return (
                                                    <TableHead className={`px-2 py-[10px] md:px-3 font-medium text-card-foreground ${i >= 2 ? "text-center" : ""}`} key={i}>
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
                                                                [...Array(5)].map((_, i) => {
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
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 font-normal max-w-[270px] truncate text-ellipsis overflow-hidden whitespace-nowrap`}>{x?.response ||  "-" }</TableCell>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 font-normal`}>
                                                                        <div className={"flex justify-center items-center"}>
                                                                            {x.emoji_url ? <img key={i} className={"h-6 w-6 cursor-pointer"} src={x.emoji_url}/> : "-" }
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 font-normal`}>
                                                                        <div className={"flex justify-center flex-wrap gap-1"}>
                                                                            {Array.isArray(x.files) && x.files.length > 0 ? (
                                                                                x.files.length > 1 ? (
                                                                                    <>
                                                                                        {/* Show the first image and a button to open the dialog */}
                                                                                        <div onClick={() => handleImageClick(x.files[0])} className="inline-block">
                                                                                            <img
                                                                                                className={"h-6 w-6 cursor-pointer"}
                                                                                                src={x.files[0]}
                                                                                                alt={`file-0`}
                                                                                            />
                                                                                        </div>
                                                                                        <Dialog>
                                                                                            <DialogTrigger asChild>
                                                                                                <Button variant="outline hover:none" className={"rounded-md border h-6 w-6 p-1"}>
                                                                                                    +{x.files.length - 1}
                                                                                                </Button>
                                                                                            </DialogTrigger>
                                                                                            <DialogContent className="border-b p-0 max-h-[80vh] max-w-[706px] flex flex-col gap-0">
                                                                                                <DialogHeader className={'p-3 sticky top-0 left-0 bg-white z-10 rounded-tl-md rounded-tr-md border-b'}>
                                                                                                    <DialogTitle>Additional Images</DialogTitle>
                                                                                                    <DialogDescription>
                                                                                                        Click on an image to view it.
                                                                                                    </DialogDescription>
                                                                                                </DialogHeader>
                                                                                                <div className="flex-grow justify-center flex overflow-y-auto p-3">
                                                                                                    <Carousel plugins={[plugin.current]} className={"w-4/5"} onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset}>
                                                                                                        <CarouselContent>
                                                                                                            {x.files.map((src, index) => (
                                                                                                                <CarouselItem key={index} className={"max-w-[706px] w-full shrink-0 grow pl-4"}>
                                                                                                                    <div className={"h-[500px] flex items-center justify-center overflow-hidden"}>
                                                                                                                    <img onClick={(img) => handleImageClick(img)} className={"w-full h-full object-contain cursor-pointer"} src={src} alt={`Carousel image ${index + 1}`} />
                                                                                                                    </div>
                                                                                                                </CarouselItem>
                                                                                                            ))}
                                                                                                        </CarouselContent>
                                                                                                        <CarouselPrevious className={"left-[-37px] md:-left-12"} />
                                                                                                        <CarouselNext className={"right-[-37px] md:-right-12"} />
                                                                                                    </Carousel>
                                                                                                </div>
                                                                                                <DialogFooter className={'border-t p-3 fixed bottom-0 left-0 right-0 bg-white z-10 rounded-bl-md rounded-br-md'}>
                                                                                                    <DialogClose asChild>
                                                                                                        <Button className={"text-xs md:text-sm font-medium"}>Close</Button>
                                                                                                    </DialogClose>
                                                                                                </DialogFooter>
                                                                                            </DialogContent>
                                                                                        </Dialog>
                                                                                    </>
                                                                                ) : (
                                                                                    // If there are 2 or fewer images, display them directly
                                                                                    x.files.map((fileUrl, index) => (
                                                                                        <div key={index} onClick={() => handleImageClick(fileUrl)} className="inline-block">
                                                                                            <img
                                                                                                className={"h-6 w-6 cursor-pointer"}
                                                                                                src={fileUrl}
                                                                                                alt={`file-${index}`}
                                                                                            />
                                                                                        </div>
                                                                                    ))
                                                                                )
                                                                            ) : (
                                                                                "-"
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 font-normal text-center`}>{moment(x.created_at).format("ll")}</TableCell>
                                                                </TableRow>
                                                            )
                                                        })
                                                    }
                                                </Fragment> : <TableRow>
                                                    <TableCell colSpan={5}>
                                                        <EmptyData/>
                                                    </TableCell>
                                                </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Fragment>
    );
};

export default PostAnalyticsView;