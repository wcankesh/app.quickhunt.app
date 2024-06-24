import React, {Fragment, useState} from 'react';
import {Button} from "../ui/button";
import {
    ArrowBigUp,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight, Circle, CircleChevronDown,
    Dot,
    MessageCircleMore,
    Plus
} from "lucide-react";
import {Card, CardContent, CardFooter} from "../ui/card";
import {Select, SelectItem, SelectGroup, SelectContent, SelectTrigger, SelectValue} from "../ui/select";
import {Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, SheetClose} from "../ui/sheet";

const dummyDetails = {
    data:[
        {
            title:"Welcome To Our Release Notes",
            description:"All great things around you were not built in a day, some took weeks, quite a few of them took months and a rare few even decades. As builders, our quest is to reach for that perfect product that solves your problems and adds value to your lives, and we too realise it will be a journey of minor and major improvements made day after day...",
            isNew:0,
            isImp:0,
            author:"testingapp",
            date:"17 Jun",
            msg:25,
            up:25,
            status:0,
            value:0,
        },
        {
            title:"Welcome To Our Release Notes",
            description:"All great things around you were not built in a day, some took weeks, quite a few of them took months and a rare few even decades. As builders, our quest is to reach for that perfect product that solves your problems and adds value to your lives, and we too realise it will be a journey of minor and major improvements made day after day...",
            isNew:0,
            isImp:1,
            author:"testingapp",
            date:"17 Jun",
            msg:25,
            up:25,
            status:0,
            value:1,

        },
        {
            title:"Welcome To Our Release Notes",
            description:"All great things around you were not built in a day, some took weeks, quite a few of them took months and a rare few even decades. As builders, our quest is to reach for that perfect product that solves your problems and adds value to your lives, and we too realise it will be a journey of minor and major improvements made day after day...",
            isNew:0,
            isImp:0,
            author:"testingapp",
            date:"17 Jun",
            msg:25,
            up:25,
            status:1,
            value:1,
        },

    ],
    page:1,
    preview:0,
}

const filterByStatus= [
    {
        name: "Archived", value: "archived",
    },
    {
        name: "Bugs", value: "bugs",
    },
    {
        name: "No Status", value: "nostatus",
    },
]

const filterByTopic = [
    {
        name: "Welcome 👋  ", value: "welcome",
    },
    {
        name: "Improvement 👍 ", value: "improvement",
    },
    {
        name: "Integrations 🔗 ", value: "integrations",
    },
    {
        name: "Mics 🤷‍♀️", value: "mics",
    },
    {
        name: "Deal Breaker 💔 ", value: "dealbreaker",
    },
    {
        name: "Bug 🐛", value: "bug",
    },
]

const filterByRoadMapStatus = [
    {
        name: "Under consideration", value: "underconsideration", fillColor: "red-400", strokeColor: "red-400",
    },
    {
        name: "Planned", value: "planned", fillColor: "blue-400", strokeColor: "blue-400",
    },
    {
        name: "In Development", value: "indevelopment", fillColor: "red-400", strokeColor: "red-400",
    },
    {
        name: "Shipped", value: "shipped", fillColor: "teal-300", strokeColor: "teal-300",
    },
    {
        name: "AC", value: "ac", fillColor: "lime-200", strokeColor: "lime-200",
    },
]

const ideasSheetStatus = [
    {name: "Under consideration", value: "underconsideration", fillColor: "red-400", strokeColor: "red-400",},
    {name: "Planned", value: "planned", fillColor: "blue-400", strokeColor: "blue-400",},
    {name: "In Development", value: "indevelopment", fillColor: "red-400", strokeColor: "red-400",},
    {name: "Shipped", value: "shipped", fillColor: "teal-300", strokeColor: "teal-300",},
    {name: "No Status", value: "underconsideration", fillColor: "red-400", strokeColor: "red-400",},
]

const Ideas = () => {
    const [isSheetOpen, setSheetOpen] = useState(false);

    const openSheet = () => setSheetOpen(true);
    const closeSheet = () => setSheetOpen(false);

    return (
        <div className={"xl:container xl:max-w-[1200px] lg:container lg:max-w-[992px] md:container md:max-w-[768px] sm:container sm:max-w-[639px] xs:container xs:max-w-[475px] pt-8"}>
            <div className={"flex flex-row gap-6 items-center"}>
                <div>
                    <h3 className={"text-2xl font-medium"}>Ideas</h3>
                </div>
                <div className="ml-auto gap-6">
                    <div className={"flex flex-row gap-6 items-center"}>
                        <Select>
                            <SelectTrigger className="w-[173px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        (filterByStatus || []).map((x, i) => {
                                            return (
                                                <SelectItem key={i} value={x.value}>{x.name}</SelectItem>
                                            )
                                        })
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-[193px]">
                                <SelectValue placeholder="Filter by topic" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        (filterByTopic || []).map((x, i) => {
                                            return (
                                                <SelectItem key={i} value={x.value}>{x.name}</SelectItem>
                                            )
                                        })
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-[262px]">
                                <SelectValue placeholder="Filter by roadmap status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        (filterByRoadMapStatus || []).map((x, i) => {
                                            return (
                                                <SelectItem key={i} value={x.value}>{x.name}</SelectItem>
                                            )
                                        })
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex justify-end">
                        <Button className="gap-2 text-sm font-semibold">
                            <Plus />Create Idea
                        </Button>
                </div>
            </div>
            <div className={"mt-8"}>
                <Card>
                    <CardContent className={"p-0"}>
                            {
                                (dummyDetails.data || []).map((x, i) => {
                                    return (
                                        <Fragment key={i}>
                                            <div className={"flex gap-8 py-6 px-16"}>
                                                    <div className={"flex gap-2"}>
                                                        <Button className={"p-[7px] bg-white shadow border hover:bg-white w-[30px] h-[30px]"} variant={"outline"}><ArrowBigUp className={"fill-primary stroke-primary"} /></Button>
                                                        <div className={"text-xl font-medium"}>{x.up}</div>
                                                    </div>
                                                    <div className={"flex flex-col"}>
                                                        <div className={"flex items-center gap-3"}>
                                                            <div className={"text-base font-medium"}>{x.title}</div>
                                                            <div className={"text-sm font-medium"}>{x.author}</div>
                                                            <div className={"text-sm font-normal flex items-center text-muted-foreground"}><Dot className={"fill-text-card-foreground stroke-text-card-foreground"} />{x.date}</div>
                                                        </div>
                                                        <p className={"text-sm font-normal text-muted-foreground pt-[11px] pb-[24px]"}>{x.description}<Button onClick={openSheet} variant={"ghost hover:none"} className={"h-0 p-0 text-primary text-sm font-semibold"}>Read more</Button></p>
                                                        <div className={""}>
                                                            <div className={"flex justify-between items-center"}>
                                                                <div className={"text-sm font-medium"}># Welcome 👋</div>
                                                                <div className={"flex items-center gap-8"}>
                                                                    <Select>
                                                                        <SelectTrigger className="w-[291px]">
                                                                            <SelectValue placeholder="Under consideration" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectGroup>
                                                                                {
                                                                                    (filterByRoadMapStatus || []).map((x, i) => {
                                                                                        return (
                                                                                            <SelectItem key={i} value={x.value}>
                                                                                                <div className={"flex items-center gap-2"}>
                                                                                                <Circle className={`stroke-${x.strokeColor} fill-${x.fillColor} w-[10px] h-[10px]`}/>
                                                                                                {x.name}
                                                                                                </div>
                                                                                            </SelectItem>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </SelectGroup>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <div className={"flex items-center gap-2"}>
                                                                        <span >
                                                                        <MessageCircleMore className={"stroke-primary w-[16px] h-[16px]"} />
                                                                        </span>
                                                                        <div className={"text-base font-medium"}>{x.up}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                            </div>
                                            <div className={"border-b"} />
                                        </Fragment>
                                    )
                                })
                            }
                    </CardContent>
                    <CardFooter className={"p-0"}>
                        <div className={"w-full p-5 bg-muted rounded-b-lg rounded-t-none flex justify-end pe-16 py-15px"}>
                            <div className={"flex flex-row gap-8 items-center"}>
                                <div>
                                    <h5 className={"text-sm font-semibold"}>Page {dummyDetails.page} of 10</h5>
                                </div>
                                <div className={"flex flex-row gap-2 items-center"}>
                                    <Button className={"bg-white shadow h-[30px] w-[30px] p-1.5 hover:bg-gray-200"}>
                                        <ChevronsLeft  className={`${dummyDetails.preview === 0 ? "stroke-slate-300" : "stroke-primary"}`} />
                                    </Button>
                                    <Button className={"bg-white shadow h-[30px] w-[30px] p-1.5 hover:bg-gray-200"}>
                                        <ChevronLeft  className={`${dummyDetails.preview === 0 ? "stroke-slate-300" : "stroke-primary"}`} />
                                    </Button>
                                    <Button className={"bg-white shadow h-[30px] w-[30px] p-1.5 hover:bg-gray-200"}>
                                        <ChevronRight  className={"stroke-primary"} />
                                    </Button>
                                    <Button className={"bg-white shadow h-[30px] w-[30px] p-1.5 hover:bg-gray-200"}>
                                        <ChevronsRight className={"stroke-primary"} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>
            {
                isSheetOpen && (
                    <Sheet open={isSheetOpen} onOpenChange={isSheetOpen ? closeSheet : openSheet}>
                        <SheetContent className={"lg:max-w-[1101px] p-0"}>
                            <SheetHeader className={"px-[32px] py-[24px] border-b border-zinc-200"}>
                            </SheetHeader>
                            <div className={"flex"}>
                                <div>
                                    <div className={"py-4 px-8 flex flex-col g-3"}>
                                        <div className={"flex flex-col gap-1"}>
                                            <div className={"text-sm font-medium"}>Status</div>
                                            <p className={"text-muted-foreground text-xs font-normal"}>Apply a status to Manage this idea on roadmap.</p>
                                        </div>
                                    </div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <div></div>
                            </div>
                        </SheetContent>
                    </Sheet>
                )
            }
        </div>
    );
};

export default Ideas;