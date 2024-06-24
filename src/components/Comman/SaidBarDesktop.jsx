import React, {useState} from 'react';
import {Button} from "../ui/button";
import {Bell, Home, LineChart, Package, Package2, ShoppingCart, Users} from "lucide-react";
import {Icon} from "../../utils/Icon";
import {Badge} from "../ui/badge";
import AppLogoPurple from "../../img/quickhunt.purple.png";
import {baseUrl} from "../../utils/constent";
import {ApiService} from "../../utils/ApiService";
import {useNavigate} from "react-router-dom";

const SaidBarDesktop = () => {
    let apiSerVice = new ApiService()
    let navigate = useNavigate();
    const [selectedUrl, setSelectedUrl] = useState("/dashboard");

    const onRedirect = (link) => {
        setSelectedUrl(link)
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
                    icon: Icon.hintIcon,
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
            icon: Icon.userIcon,
            selected: `${baseUrl}/invite-team`,
        },
        {
            title: 'Help & Support',
            link: '/help-support',
            icon: Icon.helpIcon,
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
        return selectedUrl === link;
    };

    return (
        <div className="hidden md:block  bodyScreenHeight overflow-auto">
            <div className="flex h-full max-h-screen flex-col gap-2">

                <div className="flex-1 pt-5">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-5">
                        {
                            (menuComponent || []).map((x, i) => {
                                return (
                                    <div key={i} className={"modules flex flex-col gap-3"}>
                                        {
                                            (x.dashBtn || []).map((z, i) => {
                                                return (
                                                    <Button
                                                        key={i}
                                                        variant={"link hover:no-underline"}
                                                        href="#"
                                                        className={`${isActive(z.selected) ? "flex justify-start gap-4 h-9 rounded-md shadow border" : 'flex items-center gap-4 justify-start'}`}
                                                        onClick={() => onRedirect(z.link)}
                                                    >
                                                        <div className={`${isActive(z.selected) ? "fill-violet-600" : ""}`}>{z.icon}</div>
                                                        <div className={`${isActive(z.selected) ? "text-violet-600 text-sm font-medium" : "text-sm font-medium"}`}>{z.title}</div>
                                                    </Button>
                                                )
                                            })
                                        }
                                        <div className="text-zinc-600 text-sm font-bold">{x.mainTitle}</div>
                                        <div className={"flex flex-col gap-2"}>
                                            {
                                                (x.items || []).map((y, i) => {
                                                    return (
                                                        <Button
                                                            key={i}
                                                            variant={"link hover:no-underline active:bg-blue-600"}
                                                            href="#"
                                                            className={`${isActive(y.selected) ? "flex justify-start gap-4 h-9 rounded-md shadow border" : 'flex items-center gap-4 justify-start'}`}
                                                            onClick={() => onRedirect(y.link)}
                                                        >
                                                            {y.icon}
                                                            <div className={`${isActive(y.selected) ? "text-violet-600 text-sm font-medium" : "text-sm font-medium"}`}>{y.title}</div>
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
                    <nav className="grid gap-2 text-lg font-medium">
                        {
                            (footerMenuComponent || []).map((x, i) => {
                                return (
                                    <Button
                                        key={i}
                                        variant={"link hover:no-underline"}
                                        href="#"
                                        className={`${isActive(x.selected) ? "flex justify-start gap-4 h-9 rounded-md shadow border" : 'flex items-center gap-4 justify-start'}`}
                                        onClick={() => onRedirect(x.link)}
                                        >
                                        {x.icon}
                                        <div className={`${isActive(x.selected) ? "text-violet-600 text-sm font-medium" : "text-sm font-medium"}`}>{x.title}</div>
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