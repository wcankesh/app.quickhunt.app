import React, {Fragment} from "react";
import {Skeleton} from "../ui/skeleton";

// export const CommSkel = ({count}) => {
//     return <div className={"flex flex-col"}>
//         {
//             Array.from(Array(count)).map((_, r) => {
//                 return (
//                     <div key={r} className={"py-6 px-16 border-b flex gap-8"}>
//                         <Skeleton className="h-12 w-12 rounded-full"/>
//                         <div className="space-y-4 w-full">
//                             <Skeleton className="h-4"/>
//                             <Skeleton className="h-4"/>
//                             <Skeleton className="h-4"/>
//                             <Skeleton className="h-4"/>
//                         </div>
//                     </div>
//                 )
//             })
//         }
//     </div>
// }

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
    commonParagraphFourIdea: <div className={"flex flex-col gap-8"}>
        {
            Array.from(Array(4)).map((_, r) => {
                return (
                    // <div className={"flex gap-8 py-6 px-16 border-b "} key={r}>
                    <div className={"flex gap-[5px] md:gap-8 md:py-6 md:px-16 p-3 border-b "} key={r}>
                            <Skeleton className="h-[30px] w-[30px] rounded-full"/>
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
    commonParagraphThree: <div className={"flex flex-col gap-2 p-6"}>
        {
            Array.from(Array(1)).map((_, r) => {
                return (
                    <Fragment key={r}>
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
    commonParagraphTwo: <div className={"flex flex-col gap-2 p-6"}>
        {
            Array.from(Array(1)).map((_, r) => {
                return (
                    <Fragment key={r}>
                        <div className="space-y-2 w-full">
                            <Skeleton className="h-4"/>
                            <Skeleton className="h-4"/>
                        </div>
                    </Fragment>
                )
            })
        }
    </div>,
    commonParagraphTwoAvatar: <div className={"flex gap-2 py-6"}>
        {
            Array.from(Array(1)).map((_, r) => {
                return (
                    <Fragment key={r}>
                        <Skeleton className="h-8 w-8 rounded-full"/>
                        <div className="space-y-2 w-full">
                            <Skeleton className="h-4"/>
                            <Skeleton className="h-4"/>
                        </div>
                    </Fragment>
                )
            })
        }
    </div>,
}