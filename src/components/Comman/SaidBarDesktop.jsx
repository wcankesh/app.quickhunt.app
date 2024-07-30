import React, {useState, Fragment} from 'react';
import {Button} from "../ui/button";
import {Icon} from "../../utils/Icon";
import {baseUrl} from "../../utils/constent";
import {useNavigate, useLocation, useParams} from "react-router-dom";
import {Sheet, SheetContent, SheetTrigger} from "../ui/sheet";
import {Menu, X} from "lucide-react";
import {useTheme} from "../theme-provider";

const SaidBarDesktop = () => {
    const {setTheme, theme} = useTheme()
    let navigate = useNavigate();
    let location = useLocation();
    const {type} = useParams();
    const [isSheetOpenMenu, setSheetOpenMenu] = useState(false);


    const openSheetMenu = () => setSheetOpenMenu(true);
    const closeSheetMenu = () => setSheetOpenMenu(false);

    const onRedirect = (link) => {
        navigate(`${baseUrl}${link}`);
    };

    const menuComponent = [
        {
            dashBtn: [
                {
                    title: 'Dashboard',
                    link: '/dashboard',
                    icon: Icon.homeIcon,
                    selected: `${baseUrl}/dashboard`,
                }
            ]
        },
        {
            mainTitle: 'Modules',
            items: [
                {
                    title: 'Ideas',
                    link: '/ideas',
                    icon: Icon.ideasIcon,
                    selected: `${baseUrl}/ideas`,
                },
                {
                    title: 'Roadmap',
                    link: '/roadmap',
                    icon: Icon.roadmapIcon,
                    selected: `${baseUrl}/roadmap`,
                },
                {
                    title: 'Announcements',
                    link: '/announcements',
                    icon: Icon.announcement,
                    selected: `${baseUrl}/announcements`,
                },
                {
                    title: 'Customers',
                    link: '/customers',
                    icon: Icon.userIcon,
                    selected: `${baseUrl}/customers`,
                },
                {
                    title: 'Widget',
                    link: '/widget',
                    icon: Icon.widgetsIcon,
                    selected: `${baseUrl}/widget`,
                },
            ]
        },
    ];

    const footerMenuComponent = [
        {
            title: '14 days trial left',
            link: '/pricing-plan',
            icon: Icon.trialPlanIcon,
            selected: `/pricing-plan`,
        },
        {
            title: 'What’s New',
            link: '/notification',
            icon: Icon.notificationIcon,
            selected: `/notification`,
        },
        {
            title: 'Invite Team',
            link: '/settings/team',
            icon: Icon.inviteTeamIcon,
            selected: `team`,
        },
        {
            title: 'Help & Support',
            link: '/help-support',
            icon: Icon.helpSupportIcon,
            selected: `/help-support`,
        },
        {
            title: "Pricing & Plan",
            link: '/pricing-plan',
            icon: Icon.pricingIcon,
            selected: `/pricing-plan`,
        },
        {
            title: 'Settings',
            link: `/settings/${type??"profile"}`,
            icon: Icon.settingIcon,
            selected: `/settings/${type??"profile"}`,
        }
    ];

    const isActive = (link) => {
        return location.pathname === link;
    };

    return (
        // <div className="hidden md:block bodyScreenHeight overflow-auto">
        <div className={`main-sidebar pointer-events-none fixed start-0 top-0 z-[60] flex h-full xl:z-10 hidden md:block ${location.pathname.includes("widget/") ? "overflow-hidden" : "overflow-auto"}`}>
            {/*<div className="flex h-full max-h-screen flex-col gap-2">*/}
            <div className="pointer-events-auto relative z-30 flex h-full w-[282px] flex-col ltr:-translate-x-full rtl:translate-x-full ltr:xl:translate-x-0 rtl:xl:translate-x-0">
            {/*<div className="border-default-200 pointer-events-auto relative z-30 flex flex-col h-full w-[282px] border-r bg-card transition-all duration-300 rtl:translate-x-[calc(100%_+_72px)] translate-x-[calc(-100%_-_72px)]">*/}

                <div className={"flex gap-3 items-center px-4"}>
                    <div className="flex h-14 items-center lg:h-[60px] ">
                        <div className={"app-logo cursor-pointer"}  onClick={() => onRedirect("/dashboard")}>
                            {
                                theme === "dark" ? Icon.whiteLogo : Icon.blackLogo
                            }
                        </div>
                    </div>
                </div>
                <div className={"sidebar-dek-menu flex flex-col gap-3 overflow-y-auto"}>
                    <div className="flex-1 pt-[4px]">

                        <nav className="grid items-start px-4 gap-3">
                            {
                                (menuComponent || []).map((x, i) => {
                                    return (
                                        <div key={i} className={`flex flex-col ${x.dashBtn ? "" : "gap-1"}`}>
                                            {
                                                (x.dashBtn || []).map((z, i) => {
                                                    return (
                                                        <Button
                                                            key={i}
                                                            variant={"link hover:no-underline"}
                                                            className={`${isActive(z.selected) ? "flex justify-start gap-4 h-9 rounded-md bg-primary/15 transition-none" : 'flex items-center gap-4 h-9 justify-start transition-none'}`}
                                                            onClick={() => onRedirect(z.link)}
                                                        >
                                                            <div className={`${isActive(z.selected) ? "active-menu" : "menu-icon"}`}>{z.icon}</div>
                                                            <div className={`${isActive(z.selected) ? "text-primary text-sm font-medium" : "text-sm font-medium"}`}>{z.title}</div>
                                                        </Button>
                                                    )
                                                })
                                            }
                                            {
                                                x.dashBtn ? "" :
                                                    <Fragment>
                                                        <h3 className={"text-sm font-bold py-2 px-4"}>{x.mainTitle}</h3>
                                                        <div className={"flex flex-col gap-1"}>
                                                            {
                                                                (x.items || []).map((y, i) => {
                                                                    return (
                                                                        <Button
                                                                            key={i}
                                                                            variant={"link hover:no-underline"}
                                                                            className={`${isActive(y.selected) ? "flex justify-start gap-4 h-9 rounded-md bg-primary/15 transition-none" : 'flex items-center gap-4 h-9 justify-start transition-none'}`}
                                                                            onClick={() => onRedirect(y.link)}
                                                                        >
                                                                            <div className={`${isActive(y.selected) ? "active-menu" : "menu-icon"}`}>{y.icon}</div>
                                                                            <div className={`${isActive(y.selected) ? "text-primary text-sm font-medium" : "text-sm font-medium"}`}>{y.title}</div>
                                                                        </Button>
                                                                    )
                                                                })
                                                            }
                                                        </div></Fragment>
                                            }
                                        </div>
                                    )
                                })
                            }
                        </nav>
                    </div>
                    <div className="mt-auto px-4">
                        <nav className="grid gap-1">
                            {
                                (footerMenuComponent || []).map((x, i) => {
                                    return (
                                        <Button
                                            key={i}
                                            variant={"link hover:no-underline"}
                                            className={`${isActive(x.selected)  ? "flex justify-start gap-4 h-9 rounded-md bg-primary/15 transition-none" : 'flex items-center gap-4 h-9 justify-start transition-none'}`}
                                            onClick={() => onRedirect(x.link)}
                                            >
                                            <div className={`${isActive(x.selected) ? "active-menu" : "menu-icon"}`}>{x.icon}</div>
                                            <div className={`${isActive(x.selected) ? "text-primary text-sm font-medium" : "text-sm font-medium"}`}>{x.title}</div>
                                        </Button>
                                    )
                                })
                            }
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SaidBarDesktop;