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
    commonParagraphFourIdea: <div className={"flex flex-col gap-8"}>
        {
            Array.from(Array(4)).map((_, r) => {
                return (
                    <div className={"flex gap-8 py-6 px-16 border-b"} key={r}>
                        <div className={"space-y-2"}>
                            <Skeleton className="h-[30px] w-[30px] rounded-full"/>
                            <Skeleton className="h-[30px] w-[30px] rounded-full"/>
                        </div>
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