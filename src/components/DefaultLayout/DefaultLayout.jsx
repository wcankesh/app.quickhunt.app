import React from 'react';
import SaidBarDesktop from "../Comman/SaidBarDesktop";
import HeaderBar from "../Comman/HeaderBar";
import {Outlet} from "react-router-dom";
import {Card} from "../ui/card"

const DefaultLayout = () => {
    return (
        <>
        <HeaderBar/>
        <div className="grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <SaidBarDesktop/>
            <main className="flex flex-1 flex-col gap-4 lg:gap-6 pr-4">
                <Card className={"shadow bodyScreenHeight overflow-auto"} >
                    <Outlet/>
                </Card>
            </main>
        </div>
        </>
    );
};

export default DefaultLayout;