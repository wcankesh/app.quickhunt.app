import React, {Fragment} from 'react';
import {Button} from "../ui/button";
import {Icon} from "../../utils/Icon";
import {baseUrl} from "../../utils/constent";
import {useNavigate, useLocation, useParams} from "react-router-dom";
import {useTheme} from "../theme-provider";
import {useSelector} from "react-redux";

const SaidBarDesktop = () => {
    const {theme} = useTheme()
    let navigate = useNavigate();
    let location = useLocation();
    const {type, id} = useParams();
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);
    const onRedirect = (link) => {
        navigate(`${baseUrl}${link}`);
    };
    const isActive = (link, subLink ="", subLink2 = "") => {
        return  window.location.pathname === subLink2 || window.location.pathname === subLink || window.location.pathname === link ;
    };

    const menuComponent = [
        {
            dashBtn: [
                {
                    title: 'Dashboard',
                    link: '/dashboard',
                    icon: Icon.homeIcon,
                    selected: isActive(`${baseUrl}/dashboard`),
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
                    selected: isActive(`${baseUrl}/ideas`),
                },
                {
                    title: 'Roadmap',
                    link: '/roadmap',
                    icon: Icon.roadmapIcon,
                    selected: isActive(`${baseUrl}/roadmap`),
                },
                {
                    title: 'Announcements',
                    link: '/announcements',
                    icon: Icon.announcement,
                    selected: isActive(`${baseUrl}/announcements`),
                },
                {
                    title: 'Customers',
                    link: '/customers',
                    icon: Icon.userIcon,
                    selected: isActive(`${baseUrl}/customers`),
                },
                {
                    title: 'In App Message',
                    link: '/in-app-message',
                    icon: Icon.inAppMessage,
                    selected: isActive(`${baseUrl}/in-app-message`),
                },
                {
                    title: 'Widget',
                    link: '/widget',
                    icon: Icon.widgetsIcon,
                    selected: isActive(`${baseUrl}/widget`, `${baseUrl}/widget/type`, `${baseUrl}/widget/${type}/${id}`),
                },
            ]
        },
    ];

    const footerMenuComponent = [
        {
            title: 'Import / Export',
            link: '/import-export',
            icon: Icon.importExport,
            selected: isActive(`${baseUrl}/import-export` , `${baseUrl}/import`),
            isDisplay: true,
        },
        {
            title: `${userDetailsReducer.trial_days} days trial left`,
            link: '/pricing-plan',
            icon: Icon.trialPlanIcon,
            selected: false,
            isDisplay: userDetailsReducer?.trial_days > 0 && userDetailsReducer.plan === 1,
        },
        {
            title: 'What’s New',
            link: '/notification',
            icon: Icon.notificationIcon,
            selected: isActive(`${baseUrl}/notification`),
            isDisplay: true,
        },
        {
            title: 'Invite Team',
            link: '/settings/team',
            icon: Icon.userIcon,
            selected: isActive(`${baseUrl}/settings/team`),
            isDisplay: true,
        },
        {
            title: 'Help & Support',
            link: '/help-support',
            icon: Icon.helpSupportIcon,
            selected: isActive(`${baseUrl}/help-support`),
            isDisplay: true,
        },
        {
            title: "Pricing & Plan",
            link: '/pricing-plan',
            icon: Icon.pricingIcon,
            selected: isActive(`${baseUrl}/pricing-plan`),
            isDisplay: true,
        },
        {
            title: 'Settings',
            link: '/settings/profile',
            icon: Icon.settingIcon,
            selected: window.location.pathname === `${baseUrl}/settings/team` ? false :isActive(`${baseUrl}/settings/profile`, `${baseUrl}/settings/${type}`),
            isDisplay: true,
        }
    ];

    return (
        <div className={`main-sidebar pointer-events-none fixed start-0 top-0 z-[60] flex h-full xl:z-10 hidden md:block ${location.pathname.includes("widget/") ? "overflow-hidden" : "overflow-auto"}`}>
            <div className="pointer-events-auto relative z-30 flex h-full w-[282px] flex-col ltr:-translate-x-full rtl:translate-x-full ltr:xl:translate-x-0 rtl:xl:translate-x-0">
                <div className={"flex gap-3 items-center px-4"}>
                    <div className="flex h-14 items-center lg:h-[60px]">
                        <div className={"app-logo cursor-pointer"}  onClick={() => onRedirect("/dashboard")}>
                            {theme === "dark" ? Icon.whiteLogo : Icon.blackLogo}
                        </div>
                    </div>
                </div>
                <div className={"sidebar-dek-menu flex flex-col gap-3 overflow-y-auto"}>
                    <nav className="grid items-start px-4 gap-3 pt-[10px]">
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
                                                        className={`${z.selected ? "flex justify-start gap-4 h-9 rounded-md bg-primary/15 transition-none" : 'flex items-center gap-4 h-9 justify-start transition-none'}`}
                                                        onClick={() => onRedirect(z.link)}
                                                    >
                                                        <div className={`${z.selected ? "active-menu" : "menu-icon"}`}>{z.icon}</div>
                                                        <div className={`${z.selected ? "text-primary text-sm font-medium" : "text-sm font-medium"}`}>{z.title}</div>
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
                                                                        className={`${y.selected ? "flex justify-start gap-4 h-9 rounded-md bg-primary/15 transition-none" : 'flex items-center gap-4 h-9 justify-start transition-none'}`}
                                                                        onClick={() => onRedirect(y.link)}
                                                                    >
                                                                        <div className={`${y.selected ? "active-menu" : "menu-icon"}`}>{y.icon}</div>
                                                                        <div className={`${y.selected ? "text-primary text-sm font-medium" : "text-sm font-medium"}`}>{y.title}</div>
                                                                    </Button>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </Fragment>
                                        }
                                    </div>
                                )
                            })
                        }
                    </nav>
                    <div className="mt-auto px-4 pb-4">
                        <nav className="grid gap-1">
                            {
                                (footerMenuComponent || []).map((x, i) => {
                                    return (
                                        x.isDisplay ?
                                        <Button
                                            key={i}
                                            variant={"link hover:no-underline"}
                                            className={`${x.selected  ? "flex justify-start gap-4 h-9 rounded-md bg-primary/15 transition-none" : 'flex items-center gap-4 h-9 justify-start transition-none'}`}
                                            onClick={() => onRedirect(x.link)}
                                            >
                                            <div className={`${x.selected ? "active-menu" : "menu-icon"}`}>{x.icon}</div>
                                            <div className={`${x.selected ? "text-primary text-sm font-medium" : "text-sm font-medium"}`}>{x.title}</div>
                                        </Button> : ''
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