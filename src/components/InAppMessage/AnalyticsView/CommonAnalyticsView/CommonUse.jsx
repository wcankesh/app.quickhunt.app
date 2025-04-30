import React, { Fragment } from 'react';
import CommonBreadCrumb from "../../../Comman/CommonBreadCrumb";
import { Card, CardContent, CardHeader } from "../../../ui/card";
import { Skeleton } from "../../../ui/skeleton";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "../../../ui/chart";
import { chartLoading } from "../../../Comman/CommSkel";
import EmptyData from "../../../Comman/EmptyData";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../../ui/table";
import {Avatar, AvatarFallback} from "../../../ui/avatar";
import { Button } from "../../../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "../../../ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {DO_SPACES_ENDPOINT, handleImageOpen} from "../../../../utils/constent";

export const AnalyticsLayout = ({ links, currentPage, children }) => {
    return (
        <Fragment>
            <div className="container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4">
                <div className="pb-6">
                    <CommonBreadCrumb links={links} currentPage={currentPage} truncateLimit={30} />
                </div>
                <div className="flex flex-col gap-4">
                    {children}
                </div>
            </div>
        </Fragment>
    );
};

export const AnalyticsSummary = ({ analyticsViews, isLoading }) => {
    return (
        <Card>
            <CardContent className="p-0">
                <div className="grid md:grid-cols-3 sm:grid-cols-1">
                    {analyticsViews.map((x, i) => (
                        <Fragment key={i}>
                            {isLoading ? (
                                <div className="space-y-[14px] w-full p-4 border-b md:border-r md:border-0 last:border-b-0 last:border-r-0">
                                    <Skeleton className="h-4" />
                                    <Skeleton className="h-4" />
                                </div>
                            ) : (
                                x.show && (
                                    <div className="p-4 border-b md:border-r md:border-0 last:border-b-0 last:border-r-0">
                                        <h3 className="text-base font-medium">{x.title}</h3>
                                        <div className="flex gap-1">
                                            <h3 className="text-2xl font-medium">{x.count}</h3>
                                        </div>
                                    </div>
                                )
                            )}
                        </Fragment>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export const AnalyticsLineChart = ({ title, data, isLoading, chartConfig, dataKeys = ["y"] }) => {
    return (
        <Card>
            <CardHeader className="p-4 border-b text-base font-medium">{title}</CardHeader>
            {isLoading ? (
                chartLoading(15, "p-2")
            ) : (
                <CardContent className="p-4 pl-0">
                    {data?.length > 0 ? (
                        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart accessibilityLayer data={data}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="x"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => {
                                            const date = new Date(value);
                                            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                                        }}
                                    />
                                    <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <YAxis tickLine={false} axisLine={false} />
                                    {dataKeys.map((key, index) => (
                                        <Line
                                            key={index}
                                            dataKey={key}
                                            type="monotone"
                                            stroke={`var(--color-${key})`}
                                            strokeWidth={2}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    ) : (
                        <EmptyData />
                    )}
                </CardContent>
            )}
        </Card>
    );
};

export const UserCell = ({ name, email }) => (
    <div className="flex items-center gap-2">
        <Avatar className="w-[20px] h-[20px]">
            <AvatarFallback>{name ? name.substring(0, 1) : email.substring(0, 1)}</AvatarFallback>
        </Avatar>
        <p className="font-normal">{name || email}</p>
    </div>
);

export const CommonTable = ({ columns, data, isLoading, skeletonRows = 10, skeletonColumns = 4, theme }) => {
    return (
        <Table>
            <TableHeader className={`${theme === "dark" ? "" : "bg-muted"}`}>
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
                {isLoading ? (
                    Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {Array.from({ length: skeletonColumns }).map((_, colIndex) => (
                                <TableCell key={colIndex} className="px-2 py-[10px] md:px-3">
                                    <Skeleton className="rounded-md w-full h-7" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : data.length > 0 ? (
                    data.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {columns.map((col, colIndex) => (
                                <TableCell
                                    key={colIndex}
                                    className={`px-2 py-[10px] md:px-3 font-normal ${col.align ? `text-${col.align}` : ""}`}
                                >
                                    <div className={`${colIndex === 3 ? "flex justify-center gap-1" : ""}`}>{col.render ? col.render(row) : row[col.dataKey] || "-"}</div>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
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

export const ImageCarouselCell = ({ files }) => {
    const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
    if (!Array.isArray(files) || files.length === 0) return "-";
    return files.length > 1 ? (
        <Fragment>
            <div onClick={() => handleImageOpen(files[0], '_blank')} className="inline-block">
                <img className="h-6 w-6 cursor-pointer" src={`${DO_SPACES_ENDPOINT}/${files[0]}`} alt="file-0" />
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline hover:none" className="rounded-md border h-6 w-6 p-1">
                        +{files.length - 1}
                    </Button>
                </DialogTrigger>
                <DialogContent className="border-b p-0 max-h-[80vh] max-w-[706px] flex flex-col gap-0">
                    <DialogHeader className="p-3 sticky top-0 left-0 bg-white z-10 rounded-tl-md rounded-tr-md border-b">
                        <DialogTitle>Additional Images</DialogTitle>
                        <DialogDescription>Click on an image to view it.</DialogDescription>
                    </DialogHeader>
                    <div className="flex-grow justify-center flex overflow-y-auto p-3">
                        <Carousel plugins={[plugin.current]} className="w-4/5" onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset}>
                            <CarouselContent>
                                {files.map((src, index) => (
                                    <CarouselItem key={index} className="max-w-[706px] w-full shrink-0 grow pl-4">
                                        <div className="h-[500px] flex items-center justify-center overflow-hidden">
                                            <img onClick={() => handleImageOpen(src, '_blank')} className="w-full h-full object-contain cursor-pointer" src={`${DO_SPACES_ENDPOINT}/${src}`} alt={`Carousel image ${index + 1}`} />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-[-37px] md:-left-12" />
                            <CarouselNext className="right-[-37px] md:-right-12" />
                        </Carousel>
                    </div>
                    <DialogFooter className="border-t p-3 fixed bottom-0 left-0 right-0 bg-white z-10 rounded-bl-md rounded-br-md">
                        <DialogClose asChild>
                            <Button className="text-xs md:text-sm font-medium">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Fragment>
    ) : (
        files.map((fileUrl, index) => (
            <div key={index} onClick={() => handleImageOpen(fileUrl, '_blank')} className="inline-block">
                <img className="h-6 w-6 cursor-pointer" src={`${DO_SPACES_ENDPOINT}/${fileUrl}`} alt={`file-${index}`} />
            </div>
        ))
    );
};
