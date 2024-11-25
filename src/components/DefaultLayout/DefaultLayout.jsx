import React, {Fragment} from 'react';
import SaidBarDesktop from "../Comman/SaidBarDesktop";
import HeaderBar from "../Comman/HeaderBar";
import {Outlet, useLocation, useParams} from "react-router-dom";

const DefaultLayout = () => {
    const location = useLocation();
    const {id} = useParams();

    return (
        <div className={"h-full"}>
            <div dir={"ltr"}>
                <HeaderBar />
                <SaidBarDesktop />
                <Fragment>
                    <div className={`ltr:xl:ml-[250px] rtl:xl:mr-[250px]`}>
                        <main className={`${location.pathname.includes(`/ideas/${id}`) ? "pb-3 md:pb-0" : ""}`}>
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
