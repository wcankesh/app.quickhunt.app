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
import Tags from "./SettingPage/Tags";
import Statuses from "./SettingPage/Statuses";
import Social from "./SettingPage/Social";
import Emoji from "./SettingPage/Emoji";
import {
    FileText,
    Globe,
    Kanban,
    Menu,
    SmilePlus,
    UserRound,
    UsersRound,
    Settings2,
    Tag,
    Layers3, NotepadText, CircleDashed, CircleFadingPlus, FolderKey
} from "lucide-react";
import {  Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import Board from "./SettingPage/Board";
import GeneralSettings from "./SettingPage/GeneralSettings";
import ImportExport from "../ImportExport/ImportExport";

const Settings = () => {
    let navigate = useNavigate();
    const {type, subType} = useParams();
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

    const isActive = (link) => {
        return type === link || `${type}/${subType}` === link;;
    };

    const onRedirect = (link) => {
        navigate(`${baseUrl}/settings/${link}`);
        setOpen(false)
    };

    const settingsLinksList = [
        {
            title: 'Profile',
            link: 'profile',
            icon: <UserRound size={16} />,
            selected: `${baseUrl}/profile`,
        },
        {
            title: 'Team',
            link: 'team',
            icon: <UsersRound size={16}/>,
            selected: `${baseUrl}/team`,
        },
        {
            title: 'Project',
            link: 'project',
            icon: <FileText size={16} />,
            selected: `${baseUrl}/project`,
        },
        {
            title: 'Domain',
            link: 'domain',
            icon: <Globe size={16} />,
            selected: `${baseUrl}/domain`,
        },
        {
            title: 'General Settings',
            link: 'general-settings',
            icon: <Settings2 size={16} />,
            selected: `${baseUrl}/general-settings`,
        },
        {
            title: 'Labels',
            link: 'labels',
            icon: <Tag size={16} className={"rotate-90"} />,
            selected: `${baseUrl}/labels`,
            useFor: "(Announcements)",
        },
        {
            title: 'Categories',
            link: 'categories',
            icon: <Layers3 size={16} />,
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
            title: 'Tags',
            link: 'tags',
            icon: <NotepadText size={16} />,
            selected: `${baseUrl}/tags`,
            useFor: "(Ideas)",
        },
        {
            title: 'Board',
            link: 'board',
            icon:  <Kanban size={17} />,
            selected: `${baseUrl}/board`,
            useFor: "(Ideas)",
        },
        {
            title: 'Statuses',
            link: 'statuses',
            icon: <CircleDashed size={16} />,
            selected: `${baseUrl}/statuses`,
            useFor: "(Roadmap)",
        },
        {
            title: 'Social',
            link: 'social',
            icon: <CircleFadingPlus size={16} />,
            selected: `${baseUrl}/social`,
        },
        // {
        //     title: 'Import / Export',
        //     link: 'import-export',
        //     icon: Icon.importExport,
        //     selected: `${baseUrl}/import-export`,
        //     subLinks: [
        //         {
        //             title: 'Import',
        //             link: 'import',
        //             selected: `${baseUrl}/import-export/import`,
        //         },
        //     ],
        // },

        {
            title: 'Import / Export',
            link: 'import-export',
            icon: <FolderKey size={16} />,
            subLinks: [
                {
                    title: 'Import',
                    link: 'import-export/import',
                },
            ],
        },
    ];

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
            case 'general-settings':
                return <GeneralSettings />;
            case 'labels':
                return <Labels />;
            case 'categories':
                return <Categories />;
            case 'tags':
                return <Tags />;
            case 'statuses':
                return <Statuses />;
            case 'emoji':
                return <Emoji />;
            case 'social':
                return <Social />;
            case 'board':
                return <Board />;
            case 'import-export':
                return subType === 'import' ? <ImportExport /> : <ImportExport />;
            default:
                return null;
        }
    };

    return (
        <div className='container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4'>
            <div className={"flex flex-row justify-between items-center px-1 relative"}>
                <h1 className="text-lg sm:text-2xl font-normal">Settings</h1>
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
                                    className={`flex justify-start gap-4 h-9 ${isActive(x.link) ? "rounded-md bg-primary/15 transition-none" : 'items-center hover:bg-primary/10 transition-none'}`}
                                    onClick={() => onRedirect(x.link)}
                                >
                                    <div className={`${isActive(x.link) ? "active-menu" : ""}`}>{x.icon}</div>
                                    <div
                                        className={`flex justify-between w-full ${isActive(x.link) ? "text-primary" : ""}`}>
                                        {x.title}
                                        <span>{x.useFor}</span>
                                    </div>
                                </Button>
                            )
                        })
                    }</PopoverContent>
                </Popover>}
            </div>
            {/*<div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">*/}
            <div className="w-full flex lg:flex-nowrap flex-wrap items-start lg:gap-4 gap-6 pt-6">
                {windowSize.width > 768 ? <div className="w-full lg:max-w-[350px]">
                    <Card>
                        <CardHeader className={"p-4 pb-0"}>
                            <CardTitle className={"text-base font-normal"}>General Settings</CardTitle>
                        </CardHeader>
                        <CardContent className={"flex flex-col gap-1.5 p-4"}>
                            {
                                (settingsLinksList || []).map((x, i) => {
                                    return (
                                        <Button
                                            key={i}
                                            variant={"link hover:no-underline"}
                                            className={`flex justify-start gap-2 py-0 px-2 pr-1 h-[28px] ${isActive(x.link) ? "rounded-md bg-primary/15 transition-none" : 'items-center hover:bg-primary/10 hover:text-primary transition-none'}`}
                                            onClick={() => onRedirect(x.link)}
                                        >
                                            <div className={`${isActive(x.link) ? "active-menu" : ""}`}>{x.icon}</div>
                                            <div
                                                className={`flex justify-between w-full ${isActive(x.link) ? "text-primary" : ""}`}>
                                                {x.title}
                                                <span>{x.useFor}</span>
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
