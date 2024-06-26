import React, {useState} from 'react';
import {Button} from "../ui/button";
import {Icon} from "../../utils/Icon";
import {baseUrl} from "../../utils/constent";
import {ApiService} from "../../utils/ApiService";
import {useNavigate, useLocation} from "react-router-dom";

const SaidBarDesktop = () => {
    let apiSerVice = new ApiService()
    let navigate = useNavigate();
    let location = useLocation();

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
                    link: '/widgets',
                    icon: Icon.widgetsIcon,
                    selected: `${baseUrl}/widgets`,
                },
            ]
        },
    ];

    const footerMenuComponent = [
        {
            title: '14 days trial left',
            link: '/pricing-plan',
            icon: Icon.trialPlanIcon,
            selected: `${baseUrl}/pricing-plan`,
        },
        {
            title: 'What’s New',
            link: '/notification',
            icon: Icon.notificationIcon,
            selected: `${baseUrl}/notification`,
        },
        {
            title: 'Invite Team',
            link: '/invite-team',
            icon: Icon.inviteTeamIcon,
            selected: `${baseUrl}/invite-team`,
        },
        {
            title: 'Help & Support',
            link: '/help-support',
            icon: Icon.helpSupportIcon,
            selected: `${baseUrl}/help-support`,
        },
        {
            title: "Pricing & Plan",
            link: '/pricing-plan',
            icon: Icon.pricingIcon,
            selected: `${baseUrl}/pricing-plan`,
        },
        {
            title: 'Settings',
            link: '/settings/profile',
            icon: Icon.settingIcon,
            selected: `${baseUrl}/profile`,
        }
    ];

    const isActive = (link) => {
        return location.pathname === link;
    };

    return (
        <div className="hidden md:block bodyScreenHeight overflow-auto">
            <div className="flex h-full max-h-screen flex-col gap-2">

                <div className="flex-1 pt-5">
                    <nav className="grid items-start px-2 lg:px-4 gap-5">
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
                                                        className={`${isActive(z.selected) ? "flex justify-start gap-4 h-9 rounded-md bg-primary/25 transition-none" : 'flex items-center gap-4 h-9 justify-start transition-none'}`}
                                                        onClick={() => onRedirect(z.link)}
                                                    >
                                                        <div className={`${isActive(z.selected) ? "active-menu" : "menu-icon"}`}>{z.icon}</div>
                                                        <div className={`${isActive(z.selected) ? "text-primary text-sm font-medium" : "text-sm font-medium"}`}>{z.title}</div>
                                                    </Button>
                                                )
                                            })
                                        }
                                        <h3 className={"text-sm font-bold py-2 px-4"}>{x.mainTitle}</h3>
                                        <div className={"flex flex-col gap-1"}>
                                            {
                                                (x.items || []).map((y, i) => {
                                                    return (
                                                        <Button
                                                            key={i}
                                                            variant={"link hover:no-underline"}

                                                            className={`${isActive(y.selected) ? "flex justify-start gap-4 h-9 rounded-md bg-primary/25 transition-none" : 'flex items-center gap-4 h-9 justify-start transition-none'}`}
                                                            onClick={() => onRedirect(y.link)}
                                                        >
                                                            <div className={`${isActive(y.selected) ? "active-menu" : "menu-icon"}`}>{y.icon}</div>
                                                            <div className={`${isActive(y.selected) ? "text-primary text-sm font-medium" : "text-sm font-medium"}`}>{y.title}</div>
                                                        </Button>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </nav>
                </div>
                <div className="mt-auto p-4">
                    <nav className="grid gap-1">
                        {
                            (footerMenuComponent || []).map((x, i) => {
                                return (
                                    <Button
                                        key={i}
                                        variant={"link hover:no-underline"}
                                        href="#"
                                        className={`${isActive(x.selected) ? "flex justify-start gap-4 h-9 rounded-md bg-primary/25 transition-none" : 'flex items-center gap-4 h-9 justify-start transition-none'}`}
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
    );
};

export default SaidBarDesktop;