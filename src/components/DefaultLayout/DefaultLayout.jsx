import React from 'react';
import SaidBarDesktop from "../Comman/SaidBarDesktop";
import HeaderBar from "../Comman/HeaderBar";
import {Outlet} from "react-router-dom";
import {Card} from "../ui/card"

const DefaultLayout = () => {
    return (
        <div className={"h-full"}>
            <div dir={"ltr"}>
        <HeaderBar/>
            <div>
            <SaidBarDesktop/>
            </div>
        {/*<div className="grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">*/}
        <div className="content-wrapper ltr:xl:ml-[282px] rtl:xl:mr-[282px]">
        {/*<div className="content-wrapper ml-[282px]">*/}
            {/*<main className="flex flex-1 flex-col gap-4 lg:gap-6 pr-4">*/}
            <main className="">
                <Card className={"shadow bodyScreenHeight overflow-auto"} >
                    <Outlet/>
                </Card>
            </main>
            {/*</main>*/}
                </div>
            </div>
        </div>
    // <div className={"h-full"}>
    //     <HeaderBar/>
    //     <div className="grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
    //         <SaidBarDesktop/>
    //         <main className="flex flex-1 flex-col gap-4 lg:gap-6 pr-4">
    //             <Card className={"shadow bodyScreenHeight overflow-auto"} >
    //                 <Outlet/>
    //             </Card>
    //         </main>
    //     </div>
    //     </div>
    );
};

export default DefaultLayout;