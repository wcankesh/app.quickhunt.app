import React, { Fragment } from 'react';
import SaidBarDesktop from "../Comman/SaidBarDesktop";
import HeaderBar from "../Comman/HeaderBar";
import {Outlet, useLocation, useParams} from "react-router-dom";
import { Card } from "../ui/card";

const DefaultLayout = () => {
    const location = useLocation();
    const {id} = useParams();

    return (
        <div className={"h-full"}>
            <div dir={"ltr"}>
                <HeaderBar />
                <SaidBarDesktop />
                <Fragment>
                    {/*<div className={`ltr:xl:ml-[282px] rtl:xl:mr-[282px]`}>*/}
                    <div className={`ltr:xl:ml-[250px] rtl:xl:mr-[250px]`}>
                        {/*<main className={`flex flex-1 flex-col gap-4 lg:gap-6 pr-3 lg:pr-4 xl:pl-0 pl-3 ${location.pathname.includes(`/ideas/${id}`) ? "pb-3 md:pb-0" : ""}`}>*/}
                        <main className={`${location.pathname.includes(`/ideas/${id}`) ? "pb-3 md:pb-0" : ""}`}>
                            {/*<Card className={`shadow bodyScreenHeight ${location.pathname.includes("/roadmap") ? "overflow-hidden" : "overflow-auto"}`}>*/}
                            {/*    <Outlet />*/}
                            {/*</Card>*/}
                            <div className={`bodyScreenHeight ${location.pathname.includes("/roadmap") ? "overflow-hidden" : "overflow-auto"}`}>
                                <Outlet />
                            </div>
                        </main>
                    </div>
                </Fragment>
            </div>
        </div>
    );
};

export default DefaultLayout;
