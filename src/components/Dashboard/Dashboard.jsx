import React,{Fragment, useState} from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "../ui/card"
import {useTheme} from "../theme-provider";
import {Button} from "../ui/button";
import {Icon} from "../../utils/Icon";
import {Calendar} from "../ui/calendar";
import {PopoverTrigger, Popover, PopoverContent} from "../ui/popover";
import { CalendarIcon} from "lucide-react";
//import { DateRange } from "react-day-picker";

import { addDays, format } from "date-fns"

import { cn } from "../../lib/utils";

const programAnalytics = [
    {
        title: "Total Views",
        total: 245,
        compare: "+20.1% from last month",
    },
    {
        title: "Unique Views",
        total: 54,
        compare: "+180.1% from last month",
    },
    {
        title: "Feedback",
        total: 83,
        compare: "+19% from last month",
    },
    {
        title: "Total Reaction",
        total: 245,
        compare: "+201 since last hour",
    },
]

const newFeedbacks = [
    {
        name: "Ankesh",
        email: "wc.ankesh112@gmail.com",
        feed: "This  library has saved me countless hours of work and helped me deliver  stunning designs to my clients faster than ever before.",
    },
    {
        name: "Ankesh",
        email: "wc.ankesh112@gmail.com",
        feed: "This  library has saved me countless hours of work and helped me deliver  stunning designs to my clients faster than ever before.",
    },
    {
        name: "Ankesh",
        email: "wc.ankesh112@gmail.com",
        feed: "This  library has saved me countless hours of work and helped me deliver  stunning designs to my clients faster than ever before.",
    },
    {
        name: "Ankesh",
        email: "wc.ankesh112@gmail.com",
        feed: "This  library has saved me countless hours of work and helped me deliver  stunning designs to my clients faster than ever before.",
    },
    {
        name: "Ankesh",
        email: "wc.ankesh112@gmail.com",
        feed: "This  library has saved me countless hours of work and helped me deliver  stunning designs to my clients faster than ever before.",
    },
]

const reactionFeed = [
    {
        icon: Icon.emojiLaugh,
        name: "Ankesh",
        reactedTo: "Reacted to ",
        feed: "This  library has saved me countless hours of work and helped me deliver  stunning designs",
    },
    {
        icon: Icon.emojiSad,
        name: "Ankesh",
        reactedTo: "Reacted to ",
        feed: "This  library has saved me countless hours of work and helped me deliver  stunning designs",
    },
    {
        icon: Icon.emojiSmile,
        name: "Ankesh",
        reactedTo: "Reacted to ",
        feed: "This  library has saved me countless hours of work and helped me deliver  stunning designs",
    },
    {
        icon: Icon.emojiLaugh,
        name: "Ankesh",
        reactedTo: "Reacted to ",
        feed: "This  library has saved me countless hours of work and helped me deliver  stunning designs",
    },
    {
        icon: Icon.emojiSmile,
        name: "Ankesh",
        reactedTo: "Reacted to ",
        feed: "This  library has saved me countless hours of work and helped me deliver  stunning designs",
    },
]

export function Dashboard() {
    const { setTheme } = useTheme()
  //  const dates = DateRange()
    const initialRange = {
        from: new Date(),
        to: addDays(new Date(), 4)
    };

    const [date, setDate] = useState([new Date(),addDays(new Date(), 4)]);

    return (
        <Fragment>
                <div className={"py-8"}>
                    <div className='xl:container xl:max-w-[1200px] lg:container lg:max-w-[992px] md:container md:max-w-[768px] sm:container sm:max-w-[639px] xs:container xs:max-w-[475px]'>
                        <h1 className="text-[32px] font-medium">Welcome to Quickhunt</h1>
                    </div>

                </div>
                <div className={"border-b"} />
                <div className="xl:container xl:max-w-[1200px] lg:container lg:max-w-[992px] md:container md:max-w-[768px] sm:container sm:max-w-[639px] xs:container xs:max-w-[475px]">
                    <div className="program-data">
                        <div className={"analytics-date flex justify-between items-center pb-6 pt-9 md:flex-wrap md:gap-4 sm:flex-wrap sm:gap-2"}>
                            <h3 className="text-base font-bold text-card-foreground-subtext">Here's what has happened to your program</h3>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"outline"}
                                        className={cn(
                                            "w-[300px] justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        <>
                                            {format(date[0], "LLL dd, y")} -{" "}
                                            {format(date[1], "LLL dd, y")}
                                        </>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        initialfocus={"true"}
                                        mode="range"
                                        defaultmonth={date?.from}
                                        selected={date}
                                        onSelect={(dates) => setDate(dates)}
                                        numberofmonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className={"flex flex-col gap-8"}>
                            {/*<div className={"flex lg:flex-nowrap md:flex-wrap sm:flex-wrap gap-5"}>*/}
                            <div className={"grid lg:grid-cols-4 lg:gap-8 md:grid-cols-2 md:gap-4 sm:gap-2 xs:gap-2"}>
                                {
                                    (programAnalytics || []).map((x, i) => {
                                        return (
                                            // <Card className={"basis-1/4 border-zinc-200 shadow"} key={i}>
                                            <Card className={"rounded-lg border bg-card text-card-foreground shadow-sm"} x-chunk={"dashboard-05-chunk-0"} key={i}>
                                                <CardHeader className={"p-6 gap-0.5"}>
                                                    <CardTitle className={"text-sm font-medium"}>{x.title}</CardTitle>
                                                    <CardContent className={"p-0 flex flex-col gap-2"}>
                                                        <h3 className={"text-primary text-2xl font-bold"}>{x.total}</h3>
                                                        <p className={"text-xs font-medium"}>{x.compare}</p>
                                                    </CardContent>
                                                </CardHeader>
                                            </Card>
                                        )
                                    })
                                }
                            </div>
                            <div className={"flex lg:flex-nowrap md:flex-wrap sm:flex-wrap gap-8"}>
                                <Card className={"lg:basis-2/3 md:basis-full sm:basis-full p-4 pr-8 divide-y shadow border"}>
                                    <CardHeader className={"p-0 pb-4"}>
                                        <CardTitle className={"text-base font-bold"}>New Feedbacks</CardTitle>
                                    </CardHeader>
                                    {
                                        (newFeedbacks || []).map((x, i) => {
                                            return (
                                                <CardContent className={"p-2 pl-6 pr-4 flex flex-col gap-2"} key={i}>
                                                    <div className="flex gap-2 items-center">
                                                        <h4 className="text-sm font-semibold">{x.name}</h4>
                                                        <p className="text-xs font-medium text-muted-foreground">{x.email}</p>
                                                    </div>
                                                    <p className="text-xs font-medium text-foreground">“{x.feed}”</p>
                                                </CardContent>
                                            )
                                        })
                                    }
                                    <CardFooter className={"pt-4 px-0 pb-0 justify-end"}>
                                        <Button className={"text-primary p-0 h-[20px] text-sm font-semibold"} variant={"ghost hover:none"}>View More Feedbacks</Button>
                                    </CardFooter>
                                </Card>
                                <Card className={"lg:basis-1/3 md:basis-full sm:basis-full p-4 pr-8 divide-y shadow border"}>
                                    <CardHeader className={"p-0 pb-4"}>
                                        <CardTitle className={"text-base font-bold"}>Reaction</CardTitle>
                                    </CardHeader>
                                    {
                                        (reactionFeed || []).map((x, i) => {
                                            return (
                                                <CardContent className={"py-2.5 px-0"} key={i}>
                                                    <div className={"flex gap-4"}>
                                                        <div>{x.icon}</div>
                                                        <div className={"flex flex-col gap-1"}>
                                                            <div className="flex gap-1 items-center">
                                                                <h4 className="text-sm font-semibold">{x.name}</h4>
                                                                <p className="text-xs font-medium text-muted-foreground">{x.reactedTo}</p>
                                                            </div>
                                                            <p className="text-xs font-medium text-foreground">"{x.feed}"</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            )
                                        })
                                    }
                                    <CardFooter className={"pt-4 px-0 pb-0 justify-end"}>
                                        <Button className={"text-primary text-sm p-0 h-[20px] font-semibold"} variant={"ghost hover:none"}>View More Reactions</Button>
                                    </CardFooter>
                                </Card>
                            </div>
                            <div>
                                <Card className={"p-4 shadow border"}>
                                    <CardHeader className={"p-0 pb-4"}>
                                        <CardTitle className={"text-base font-bold"}>Overview</CardTitle>
                                    </CardHeader>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
        </Fragment>
    )
}
