import React, {Fragment, useState} from 'react';
import {Button} from "../ui/button";
import {Icon} from "../../utils/Icon";
import {baseUrl} from "../../utils/constent";
import {useNavigate, useLocation, useParams} from "react-router-dom";
import {useTheme} from "../theme-provider";
import {useSelector} from "react-redux";
import Articles from "../HelpCenter/Articles/Articles";
import {
    Activity,
    Bell,
    CircleHelp,
    DatabaseBackup,
    FileSliders,
    House,
    LayoutTemplate,
    Lightbulb,
    Megaphone,
    Menu,
    NotebookPen,
    Settings,
    Tag,
    Users,
    UsersRound, X
} from "lucide-react";
import {Sheet, SheetContent, SheetHeader, SheetOverlay, SheetTrigger} from "../ui/sheet";

const SaidBarDesktop = ({isMobile, setIsMobile}) => {
    const {theme} = useTheme()
    let navigate = useNavigate();
    let location = useLocation();
    const {type, id} = useParams();
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);

    const onRedirect = (link) => {
        navigate(`${baseUrl}${link}`);
    };

    const isActive = (link, subLink = "", subLink2 = "", subLink3 = "") => {
        return window.location.pathname === subLink3 || window.location.pathname === subLink2 || window.location.pathname === subLink || window.location.pathname === link;
    };

    const isHelpCenterActive = isActive(`${baseUrl}/help/article`, `${baseUrl}/help/category`) ||
        isActive(`${baseUrl}/help/article/${id}`, `${baseUrl}/help/category/${id}`);

    const menuComponent = [
        {
            dashBtn: [
                {
                    title: 'Dashboard',
                    link: '/dashboard',
                    icon: <House size={15} />,
                    selected: isActive(`${baseUrl}/dashboard`, `${baseUrl}/dashboard/comments`, `${baseUrl}/dashboard/reactions`,),
                }
            ]
        },
        {
            mainTitle: 'Modules',
            items: [
                {
                    title: 'Ideas',
                    link: '/ideas',
                    icon: <Lightbulb size={15} />,
                    selected: isActive(`${baseUrl}/ideas`, `${baseUrl}/ideas/${id}`),
                },
                {
                    title: 'Roadmap',
                    link: '/roadmap',
                    icon: <Activity size={15} />,
                    selected: isActive(`${baseUrl}/roadmap`),
                },
                {
                    title: 'Announcements',
                    link: '/announcements',
                    icon: <Megaphone size={15} />,
                    selected: isActive(`${baseUrl}/announcements`, `${baseUrl}/announcements/${id}`, `${baseUrl}/announcements/analytic-view`),
                },
                {
                    title: 'Users',
                    link: '/user',
                    icon: <Users size={15} />,
                    selected: isActive(`${baseUrl}/user`),
                },
                {
                    title: 'In App Message',
                    link: '/app-message',
                    icon: <NotebookPen size={15} />,
                    selected: isActive(`${baseUrl}/app-message`, `${baseUrl}/app-message/type`, `${baseUrl}/app-message/${type}/${id}`, `${baseUrl}/app-message/${type}/analytic/${id}`),
                },
                {
                    title: 'Widget',
                    link: '/widget',
                    icon: <LayoutTemplate size={15} />,
                    selected: isActive(`${baseUrl}/widget`, `${baseUrl}/widget/type`, `${baseUrl}/widget/${type}/${id}`),
                },
                {
                    title: 'Help Center',
                    link: '/help/article',
                    icon: <FileSliders size={15} />,
                    // selected: isActive(`${baseUrl}/help-center/articles`,`${baseUrl}/help-center/category`) || isActive(`${baseUrl}/help-center/articles/${id}`,`${baseUrl}/help-center/category/${id}`),
                    selected: isHelpCenterActive,
                    subItems: [
                        {
                            title: 'Articles',
                            link: `/help/article`,
                            selected: isActive(`${baseUrl}/help/article`, `${baseUrl}/help/article/${id}`),
                        },
                        {
                            title: 'Category',
                            link: `/help/category`,
                            selected: isActive(`${baseUrl}/help/category`, `${baseUrl}/help/category/${id}`),
                        }
                    ]
                },
            ]
        },
    ];

    const footerMenuComponent = [
        // {
        //     title: 'Import / Export',
        //     link: '/import-export',
        //     icon: Icon.importExport,
        //     selected: isActive(`${baseUrl}/import-export`, `${baseUrl}/import`),
        //     isDisplay: true,
        // },
        {
            title: `${userDetailsReducer.trial_days} days trial left`,
            link: '/pricing-plan',
            icon: <DatabaseBackup size={15} />,
            selected: false,
            isDisplay: userDetailsReducer?.trial_days > 0 && userDetailsReducer.plan === 1,
        },
        {
            title: 'What’s New',
            link: '/notification',
            icon: <Bell size={15} />,
            selected: isActive(`${baseUrl}/notification`),
            isDisplay: true,
        },
        {
            title: 'Invite Team',
            link: '/settings/team',
            icon: <UsersRound size={15} />,
            selected: isActive(`${baseUrl}/settings/team`),
            isDisplay: true,
        },
        // {
        //     title: 'Help & Support',
        //     link: '/help-support',
        //     icon: <CircleHelp size={15} />,
        //     selected: isActive(`${baseUrl}/help-support`),
        //     isDisplay: true,
        // },
        {
            title: "Pricing & Plan",
            link: '/pricing-plan',
            icon: <Tag size={15} className={"rotate-90"} />,
            selected: isActive(`${baseUrl}/pricing-plan`),
            isDisplay: true,
        },
        {
            title: 'Settings',
            link: '/settings/profile',
            icon: <Settings size={15} />,
            selected: window.location.pathname === `${baseUrl}/settings/team` ? false : isActive(`${baseUrl}/settings/profile`, `${baseUrl}/settings/${type}`),
            isDisplay: true,
        }
    ];

    const renderSubItems = (subItems) => {
        return (
            <div className={"pl-4"}>
                {subItems.map((subItem, index) => (
                    <Button
                        key={index}
                        variant={"link hover:no-underline"}
                        className={`w-full flex gap-4 h-9 justify-start transition-none items-center rounded-md`}
                        onClick={() => onRedirect(subItem.link)}
                    >
                        <div className={`${subItem.selected ? "active-menu" : "menu-icon"}`}>{subItem.icon}</div>
                        <div
                            className={`text-sm font-normal ${subItem.selected ? "text-primary " : ""}`}>{subItem.title}</div>
                    </Button>
                ))}
            </div>
        );
    };

    const commonRender = () => {
        return <Fragment>
            <nav className="grid items-start">
                {
                    (menuComponent || []).map((x, i) => {
                        return (
                            <div key={i} className={`flex flex-col py-4 ${x.dashBtn ? "" : "gap-1"}`}>
                                {
                                    (x.dashBtn || []).map((z, i) => {
                                        return (
                                            <Button
                                                key={i}
                                                variant={"link hover:no-underline"}
                                                className={`flex justify-start gap-2 py-0 px-2 pr-1 h-[28px] ${z.selected ? "rounded-md bg-primary/15 transition-none" : 'items-center hover:bg-primary/10 hover:text-primary transition-none'}`}
                                                onClick={() => onRedirect(z.link)}
                                            >
                                                <div className={`${z.selected ? "active-menu" : ""}`}>{z.icon}</div>
                                                <div className={`font-normal text-left flex-1 text-sm ${z.selected ? "text-primary" : ""}`}>{z.title}</div>
                                            </Button>
                                        )
                                    })
                                }
                                {
                                    x.dashBtn ? "" :
                                        <Fragment>
                                            <h3 className={"text-sm font-medium px-2 pr-1"}>{x.mainTitle}</h3>
                                            <div className={"flex flex-col gap-1"}>
                                                {
                                                    (x.items || []).map((y, i) => {
                                                        return (
                                                            <Fragment key={i}>
                                                                <Button
                                                                    key={i}
                                                                    variant={"link hover:no-underline"}
                                                                    className={`flex justify-start gap-2 py-0 px-2 pr-1 h-[28px] ${y.selected ? "rounded-md bg-primary/15 transition-none" : 'items-center transition-none hover:bg-primary/10 hover:text-primary'} ${y.title === 'Announcements' ? 'gap-[10px]' : ''}`}
                                                                    onClick={() => onRedirect(y.link)}
                                                                >
                                                                    <div className={`${y.selected ? "active-menu" : ""}`}>{y.icon}</div>
                                                                    <div className={`font-normal text-left flex-1 text-sm ${y.selected ? "text-primary" : ""}`}>{y.title}</div>
                                                                </Button>
                                                                {y.title === 'Help Center' && isHelpCenterActive && y.subItems && renderSubItems(y.subItems)}
                                                            </Fragment>
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
            <div className="mt-auto pb-4">
                <nav className="grid gap-1">
                    {
                        (footerMenuComponent || []).map((x, i) => {
                            return (
                                x.isDisplay ?
                                    <Button
                                        key={i}
                                        variant={"link hover:no-underline"}
                                        className={`flex justify-start gap-2 py-0 px-2 pr-1 h-[28px] ${x.selected ? "rounded-md bg-primary/15 transition-none" : 'items-center hover:bg-primary/10 hover:text-primary transition-none'}`}
                                        onClick={() => onRedirect(x.link)}
                                    >
                                        <div className={`${x.selected ? "active-menu" : ""}`}>{x.icon}</div>
                                        <div className={`font-normal text-left flex-1 text-sm ${x.selected ? "text-primary" : ""}`}>{x.title}</div>
                                    </Button> : ''
                            )
                        })
                    }
                </nav>
            </div>
        </Fragment>
    }

    return (
        <div className={`main-sidebar fixed start-0 top-0 z-[60] h-full xl:z-10 hidden xl:block ${location.pathname.includes("widget/") ? "overflow-hidden" : "overflow-auto"}`}>
            <div className="pointer-events-auto relative z-30 flex h-full w-[250px] flex-col ltr:-translate-x-full rtl:translate-x-full ltr:xl:translate-x-0 rtl:xl:translate-x-0">

                <Sheet open={isMobile} onOpenChange={(open) => setIsMobile(open)}>
                    {/*<SheetOverlay className={"inset-0"} />*/}
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0 xl:hidden">
                            <Menu size={20}/>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex gap-0 flex-col w-[280px] md:w-[340px] p-0">
                        <SheetHeader className={"flex gap-2 flex-row justify-between items-center p-3 py-2.5 dark:border-b"}>
                            <div className={"flex w-full items-center h-[56px] cursor-pointer"}  onClick={() => onRedirect("/dashboard")}>
                                {theme === "dark" ? Icon.whiteLogo : Icon.blackLogo}
                            </div>
                            <X size={18} className={"fill-card-foreground stroke-card-foreground m-0"} onClick={() => setIsMobile(false)}/>
                        </SheetHeader>
                        <div className={" px-3 flex flex-col overflow-y-auto h-full bg-primary/5"}>
                            {commonRender()}
                        </div>
                    </SheetContent>
                </Sheet>
                <div className={`h-[calc(100vh_-_56px)] mt-[56px] px-3 flex flex-col overflow-y-auto h-full bg-primary/5 ${theme === "dark" ? "border border-r" : ""}`}>
                    {commonRender()}
                </div>
            </div>
        </div>
    );
};

export default SaidBarDesktop;