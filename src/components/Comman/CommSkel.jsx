import React, {Fragment} from "react";
import {Skeleton} from "../ui/skeleton";

export const CommSkel = {
    commonParagraphColumnFour: <div className={"grid grid-cols-4 gap-4"}>
        {
            Array.from(Array(4)).map((_, r) => {
                return (
                    <div className={"flex gap-2 py-2 px-4 border-b"} key={r}>
                        <Skeleton className="h-[15px] w-[15px] rounded-full"/>
                        <div className="space-y-2 w-full">
                            <Skeleton className="h-4"/>
                            <Skeleton className="h-4"/>
                            <Skeleton className="h-4"/>
                            <Skeleton className="h-4"/>
                        </div>
                    </div>
                )
            })
        }
    </div>,
    commonParagraphOne: <div className={"flex flex-col gap-8"}>
        {
            Array.from(Array(1)).map((_, r) => {
                return (
                    <div className={"flex gap-2 py-2 px-4 border-b"} key={r}>
                        <Skeleton className="h-[15px] w-[15px] rounded-full"/>
                        <div className="space-y-2 w-full">
                            <Skeleton className="h-4"/>
                        </div>
                    </div>
                )
            })
        }
    </div>,
    commonParagraphFourIdea: <div className={"flex flex-col divide-y"}>
        {
            Array.from(Array(4)).map((_, r) => {
                return (
                    <div className={"flex gap-[5px] md:gap-8 p-2 sm:p-3 lg:py-4 lg:px-5"} key={r}>
                        <Skeleton className="h-[30px] w-[30px] rounded-full"/>
                        <div className="flex flex-col w-full gap-6">
                            <div className="space-y-2 w-full">
                                <Skeleton className="h-4"/>
                                <Skeleton className="h-4"/>
                                <Skeleton className="h-4"/>
                            </div>
                            <Skeleton className="h-4"/>
                        </div>
                    </div>
                )
            })
        }
    </div>,
    commonParagraphFourComments: <div className={"flex flex-col"}>
        {
            Array.from(Array(4)).map((_, r) => {
                return (
                    <div className={"md:p-6 p-3 border-b space-y-4"} key={r}>
                        <div className="flex gap-2 items-center justify-between">
                            <div className={"flex gap-2 items-center w-full"}>
                                <Skeleton className="h-[30px] w-[30px] rounded-full"/>
                                <Skeleton className="h-4 w-full"/>
                            </div>
                            <Skeleton className="h-[20px] w-[100px] rounded-full "/>
                        </div>
                        <div className="flex flex-col w-full gap-6">
                            <div className="space-y-2 w-full">
                                <Skeleton className="h-4"/>
                                <Skeleton className="h-4"/>
                                <Skeleton className="h-4"/>
                            </div>
                        </div>
                    </div>
                )
            })
        }
    </div>,
    reactionsPageLoading: <div className={"flex flex-col"}>
        {
            Array.from(Array(7)).map((_, r) => {
                return (
                    <div className={"flex gap-[5px] md:gap-4 md:p-6 p-3 border-b "} key={r}>
                        <Skeleton className="h-[30px] w-[30px] rounded-full"/>
                        <div className="flex flex-col w-full gap-6">
                            <div className="space-y-2 w-full">
                                <Skeleton className="h-4"/>
                                <Skeleton className="h-4"/>
                            </div>
                        </div>
                    </div>
                )
            })
        }
    </div>,
    commonParagraphThree: <div className={"flex flex-col gap-2 p-6"}>
        {
            Array.from(Array(1)).map((_, r) => {
                return (
                    <Fragment key={r}>
                        <div className="space-y-[14px] w-full">
                            <Skeleton className="h-4"/>
                            <Skeleton className="h-4"/>
                            <Skeleton className="h-4"/>
                        </div>
                    </Fragment>
                )
            })
        }
    </div>,
    commonParagraphThreeIcon: <div className={"flex gap-2 p-6"}>
        {
            Array.from(Array(1)).map((_, r) => {
                return (
                    <Fragment key={r}>
                        <Skeleton className="h-[30px] w-[30px] rounded-full"/>
                        <div className="space-y-2 w-full">
                            <Skeleton className="h-4"/>
                            <Skeleton className="h-4"/>
                            <Skeleton className="h-4"/>
                        </div>
                    </Fragment>
                )
            })
        }
    </div>,
    commonParagraphTwo: <div className={"flex flex-col gap-2 p-2 pl-6 pr-4"}>
        {
            Array.from(Array(1)).map((_, r) => {
                return (
                    <Fragment key={r}>
                        <div className="space-y-2 w-full">
                            <Skeleton className="h-4"/>
                            <Skeleton className="h-4"/>
                            <Skeleton className="h-4"/>
                            <Skeleton className="h-4"/>
                        </div>
                    </Fragment>
                )
            })
        }
    </div>,
    dashboardComments: <div className={"flex flex-col"}>
        {
            Array.from(Array(4)).map((_, r) => {
                return (
                    <div className={"py-2.5 px-6 flex flex-col gap-4 border-b"} key={r}>
                        <div className="flex gap-2 items-center justify-between">
                            <div className={"flex gap-2 items-center w-full"}>
                                <Skeleton className="h-[30px] w-[30px] rounded-full"/>
                                <Skeleton className="h-4 w-full"/>
                            </div>
                            <Skeleton className="h-[20px] w-[100px] rounded-full "/>
                        </div>
                        <div className="flex flex-col w-full gap-6">
                            <div className="space-y-2 w-full">
                                <Skeleton className="h-4"/>
                            </div>
                        </div>
                    </div>
                )
            })
        }
    </div>,
    commonParagraphTwoAvatar: <div className={"flex flex-col"}>
        {
            Array.from(Array(5)).map((_, r) => {
                return (
                    <div key={r} className={"flex flex-row gap-4 py-[10px] px-6 border-b"}>
                        <Skeleton className="h-8 w-8 rounded-full"/>
                        <div className="space-y-2 w-full">
                            <Skeleton className="h-4"/>
                            <Skeleton className="h-4"/>
                            <Skeleton className="h-4"/>
                        </div>
                    </div>
                )
            })
        }
    </div>,
}

export const commonParagraph = (count) => {
    return <div className={"grid gap-2"}>
        {
            Array.from(Array(count)).map((_, r) => {
                return (
                    <Fragment key={r}>
                        <Skeleton className="h-9 max-w-[100%]" />
                    </Fragment>
                )
            })
        }
    </div>
}

export const chartLoading = (count, className) => {
    const getRandomHeight = () => `${Math.floor(Math.random() * (350 - 150 + 1) + 150)}px`;

    return (
        <div className={`flex gap-4 items-end ${className}`}>
            {
                Array.from(Array(count)).map((_, r) => {
                    return (
                        <Fragment key={r}>
                            <Skeleton className={`max-w-16 w-full`} style={{ height: getRandomHeight() }} />
                        </Fragment>
                    )
                })
            }
        </div>
    );
}