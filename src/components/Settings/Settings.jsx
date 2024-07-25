import React, {useEffect, useState} from 'react';
import { Button } from "../ui/button";
import {Card, CardContent, CardHeader, CardTitle,} from "../ui/card";
import {Icon} from "../../utils/Icon";
import {baseUrl, } from "../../utils/constent";
import {useNavigate, useParams} from "react-router-dom";
import Profile from "./SettingPage/Profile";
import Team from "./SettingPage/Team";
import Project from "./SettingPage/Project";
import Domain from "./SettingPage/Domain";
import Labels from "./SettingPage/Labels";
import Categories from "./SettingPage/Categories";
import Topics from "./SettingPage/Topics";
import Statuses from "./SettingPage/Statuses";
import Social from "./SettingPage/Social";
import Emoji from "./SettingPage/Emoji";
import {Menu, SmilePlus} from "lucide-react";
import {  Popover, PopoverContent, PopoverTrigger} from "../ui/popover";

const Settings = () => {
    let navigate = useNavigate();
    const {type} = useParams();
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
    });
    const [open, setOpen] = useState(false)


    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
            });
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const onRedirect = (link) => {
        navigate(`${baseUrl}/settings/${link}`);
        setOpen(false)
    };

    const settingsLinksList = [
        {
            title: 'Profile',
            link: 'profile',
            icon: Icon.setProfileIcon,
            selected: `${baseUrl}/profile`,
        },
        {
            title: 'Team',
            link: 'team',
            icon: Icon.setTeamIcon,
            selected: `${baseUrl}/team`,
        },
        {
            title: 'Project',
            link: 'project',
            icon: Icon.setProjectIcon,
            selected: `${baseUrl}/project`,
        },
        {
            title: 'Domain',
            link: 'domain',
            icon: Icon.setDomainIcon,
            selected: `${baseUrl}/domain`,
        },
        {
            title: 'Labels',
            link: 'labels',
            icon: Icon.setLabelIcon,
            selected: `${baseUrl}/labels`,
            useFor: "(Announcements)",
        },
        {
            title: 'Categories',
            link: 'categories',
            icon: Icon.setCategoriesIcon,
            selected: `${baseUrl}/categories`,
            useFor: "(Announcements)",
        },
        {
            title: 'Emoji',
            link: 'emoji',
            icon: <SmilePlus size={17} />,
            selected: `${baseUrl}/emoji`,
            useFor: "(Announcements)",
        },
        {
            title: 'Topics',
            link: 'topics',
            icon: Icon.setTopicsIcon,
            selected: `${baseUrl}/topics`,
            useFor: "(Ideas)",
        },
        {
            title: 'Statuses',
            link: 'statuses',
            icon: Icon.setStatusesIcon,
            selected: `${baseUrl}/statuses`,
            useFor: "(Roadmap)",
        },
        {
            title: 'Social',
            link: 'social',
            icon: Icon.setSocialIcon,
            selected: `${baseUrl}/social`,
        },
    ];

    const isActive = (link) => {
        return type === link;
    };

    const renderMenu = (type) => {
        switch (type) {
            case 'profile':
                return <Profile />;
            case 'team':
                return <Team />;
            case 'project':
                return <Project />;
            case 'domain':
                return <Domain />;
            case 'labels':
                return <Labels />;
            case 'categories':
                return <Categories />;
            case 'topics':
                return <Topics />;
            case 'statuses':
                return <Statuses />;
            case 'emoji':
                return <Emoji />;
            case 'social':
                return <Social />;
            default:
                return null;
        }
    };

    return (
        <div className='xl:container xl:max-w-[1200px] lg:container lg:max-w-[992px] md:container md:max-w-[768px] sm:container sm:max-w-[639px] xs:container xs:max-w-[475px] px-4'>
            <div className={"pt-8 flex flex-row justify-between items-center px-1 relative"}>
                <h1 className="text-2xl font-medium">Settings</h1>
                {windowSize.width <= 768 && <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger>
                        <Button variant="outline" className={"w-[30px] h-[30px]"} size="icon">
                            <Menu size={16}/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className={"flex flex-col gap-1 pt-[14px] px-4 pb-8 p-2 absolute right-[-20px]"}> {
                        (settingsLinksList || []).map((x, i) => {
                            return (
                                <Button
                                    key={i}
                                    variant={"link hover:no-underline"}
                                    className={`${isActive(x.link) ? "flex justify-start gap-4 h-9 rounded-md bg-primary/15 transition-none" : 'flex items-center gap-4 h-9 justify-start transition-none'}`}
                                    onClick={() => onRedirect(x.link)}
                                >
                                    <div
                                        className={`${isActive(x.link) ? "setting-active-menu" : "profile-menu-icon"}`}>{x.icon}</div>
                                    <div
                                        className={`flex justify-between w-full ${isActive(x.link) ? "text-primary text-sm font-medium" : "text-sm font-medium"}`}>
                                        {x.title}
                                        <div>{x.useFor}</div>
                                    </div>
                                </Button>
                            )
                        })
                    }</PopoverContent>
                </Popover>}
            </div>
            {/*<div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">*/}
            <div className="w-full flex lg:flex-nowrap md:flex-wrap sm:flex-wrap items-start gap-4 pt-6 pb-[58px]">
                {windowSize.width > 768 ? <div className="lg:w-[320px] md:w-full sm:w-full">
                    <Card>
                        <CardHeader className={"p-4 pb-0"}>
                            <CardTitle className={"text-base font-medium"}>General Settings</CardTitle>
                        </CardHeader>
                        <CardContent className={"flex flex-col gap-1 pt-[14px] px-4 pb-8"}>
                            {
                                (settingsLinksList || []).map((x, i) => {
                                    return (
                                        <Button
                                            key={i}
                                            variant={"link hover:no-underline"}
                                            className={`${isActive(x.link) ? "flex justify-start gap-4 h-9 rounded-md bg-primary/15 transition-none" : 'flex items-center gap-4 h-9 justify-start transition-none'}`}
                                            onClick={() => onRedirect(x.link)}
                                        >
                                            <div
                                                className={`${isActive(x.link) ? "setting-active-menu" : "profile-menu-icon"}`}>{x.icon}</div>
                                            <div
                                                className={`flex justify-between w-full ${isActive(x.link) ? "text-primary text-sm font-medium" : "text-sm font-medium"}`}>
                                                {x.title}
                                                <div>{x.useFor}</div>
                                            </div>
                                        </Button>
                                    )
                                })
                            }
                        </CardContent>
                    </Card>
                </div> : null}
                <div className="w-full">
                    {renderMenu(type ?? "profile")}
                </div>
            </div>
        </div>
    )
}
export default Settings;
