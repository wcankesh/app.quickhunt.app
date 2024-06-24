import React, {useState} from 'react';
import {Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, SheetClose} from "../ui/sheet";
import {Button} from "../ui/button";
import {Menu, X} from "lucide-react";
import {Input} from "../ui/input";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "../ui/dropdown-menu";
import {useTheme} from "../theme-provider";
import {baseUrl, logout, removeProjectDetails} from "../../utils/constent";
import {useNavigate} from "react-router-dom";
import {Icon} from "../../utils/Icon";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import { Moon, Sun } from "lucide-react";
import AppLogoPurple from "../../img/quickhunt.purple.png";
import {ApiService} from "../../utils/ApiService";
import {Popover, PopoverTrigger, PopoverContent} from "../ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../ui/command";
import { ChevronsUpDown } from "lucide-react";
import {Label} from "../ui/label";

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

const HeaderBar = ({ showDashboardButton }) => {
    const { setTheme, theme } = useTheme()
    let navigate = useNavigate();
    let apiSerVice = new ApiService()
    const [selectedUrl, setSelectedUrl] = useState("/dashboard");
    const [value, setValue] = useState("")
    const [open, setOpen] = useState(false)
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [isSheetOpenMenu, setSheetOpenMenu] = useState(false);
    const [sheetType, setSheetType] = useState(null);

    const openSheet = () => setSheetOpen(true);
    const closeSheet = () => setSheetOpen(false);
    const openSheetMenu = () => setSheetOpenMenu(true);
    const closeSheetMenu = () => setSheetOpenMenu(false);

    const openSheetCom = (type) => {
        setSheetType(type);
    };

    const closeSheetCom = () => {
        setSheetType(null);
    };

    const onRedirect = (link) => {
        setSelectedUrl(link)
        navigate(`${baseUrl}${link}`);
    };

    const onLogout = async () => {
        logout();
        removeProjectDetails();
        navigate(`${baseUrl}/login`);
    }

    const toggleTheme = () => {
        setTheme( theme === 'light' ? 'dark' : 'light');
    };

    const isActive = (link) => {
        return selectedUrl === link;
    };

    const frameworks = [
        {
            value: "testingapp",
            label: "Testingapp",
        },
        {
            value: "createproject",
            label: "Create Project",
            icon: Icon.plusIcon,
        },
    ]

    return (
        <header className="flex h-14 lg:justify-between md:justify-between items-center sm:justify-between gap-4 px-4 lg:h-[60px] lg:px-6 ">

            {/*Mobile said bar start */}
            <Sheet open={isSheetOpenMenu} onOpenChange={isSheetOpenMenu ? closeSheetMenu : openSheetMenu}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                        <Menu className="h-5 w-5"/>
                    </Button>
                </SheetTrigger>

                <SheetContent side="left" className="flex flex-col overflow-auto">
                    <Button className={"self-end p-0 bg-transparent hover:bg-transparent w-[20px] h-[20px]"}>
                        <X className={"fill-card-foreground stroke-card-foreground"} onClick={closeSheetMenu} />
                    </Button>
                    <nav className="grid gap-2">
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
                                                        href="#"
                                                        className={`${isActive(z.selected) ? "flex justify-start gap-4 h-9 rounded-md bg-primary/25 transition-none" : 'flex items-center gap-4 justify-start transition-none'}`}
                                                        onClick={() => onRedirect(z.link)}
                                                    >
                                                        <div className={`${isActive(z.selected) ? "fill-primary" : ""}`}>{z.icon}</div>
                                                        <div className={`${isActive(z.selected) ? "text-primary text-sm font-medium" : "text-sm font-medium"}`}>{z.title}</div>
                                                    </Button>
                                                )
                                            })
                                        }
                                        <div className={"text-sm font-bold py-2 px-4"}>{x.mainTitle}</div>
                                        <div className={"flex flex-col gap-1"}>
                                            {
                                                (x.items || []).map((y, i) => {
                                                    return (
                                                        <Button
                                                            key={i}
                                                            // variant={"link hover:no-underline active:bg-blue-600"}
                                                            variant={"link hover:no-underline"}
                                                            href="#"
                                                            className={`${isActive(y.selected) ? "flex justify-start gap-4 h-9 rounded-md bg-primary/25 transition-none" : 'flex items-center gap-4 justify-start transition-none'}`}
                                                            onClick={() => onRedirect(y.link)}
                                                        >
                                                            {y.icon}
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
                    <div className="mt-auto">
                        <nav className="grid gap-1">
                            {
                                (footerMenuComponent || []).map((x, i) => {
                                    return (
                                        <Button
                                            key={i}
                                            variant={"link hover:no-underline"}
                                            href="#"
                                            className={`${isActive(x.selected) ? "flex justify-start gap-4 h-9 rounded-md bg-primary/25 transition-none" : 'flex items-center gap-4 justify-start transition-none'}`}
                                            onClick={() => onRedirect(x.link)}
                                        >
                                            {x.icon}
                                            <div className={`${isActive(x.selected) ? "text-primary text-sm font-medium" : "text-sm font-medium"}`}>{x.title}</div>
                                        </Button>
                                    )
                                })
                            }
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>
            {/*Mobile said bar End */}

            <div className="flex h-14 items-center lg:h-[60px] ">
                <div className={"app-logo"}>
                    <img className={"lg:w-full md:w-[195px]"} src={AppLogoPurple} alt={"app-logo"} />
                </div>
            </div>
            <div className={"flex gap-8"}>

                <div className={"flex gap-6 items-center"}>
                    <div className={"drop-option"}>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-[200px] justify-between"
                                >
                                    {value
                                        ? frameworks.find((framework) => framework.value === value)?.label
                                        : "Select framework..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search framework..." />
                                    <CommandList>
                                        <CommandEmpty>No framework found.</CommandEmpty>
                                        <CommandGroup>
                                            {frameworks.map((framework) => (
                                                <CommandItem
                                                    key={framework.value}
                                                    value={framework.value}
                                                    onSelect={framework.value === 'createproject' ? openSheet : (currentValue) =>  {
                                                        setValue(currentValue === value ? "" : currentValue)
                                                        setOpen(false)
                                                    }}
                                                >
                                                    {framework.icon}{framework.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="relative ml-auto flex-1 md:grow-0 rounded-md">
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="w-full pl-4 pr-14 md:w-[200px] lg:w-[352px] text-sm font-normal"
                        />
                    </div>
                </div>
                <div className={"flex gap-4 items-center"}>
                    <Button variant="ghost hover:none" size="icon" className="h-8 w-8" onClick={toggleTheme}>
                        {theme === 'light' ? <Moon className="h-5 w-5 fill-black stroke-black"/> :
                            <Sun className="h-5 w-5 fill-black "/>}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback >CN</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className={"w-56 rounded-md shadow border border-slate-100"}>
                            <DropdownMenuLabel className={"text-slate-700 text-sm font-semibold"}>My
                                Account</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem
                                className={"text-slate-700 text-sm font-medium flex gap-2"}>{Icon.accountUserIcon}Profile</DropdownMenuItem>
                            <DropdownMenuItem
                                className={"text-slate-700 text-sm font-medium flex gap-2"}>{Icon.bilingIcon}Biling</DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem
                                className={"text-slate-700 text-sm font-medium flex gap-2"}>{Icon.projectsIcon}Projects</DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem onClick={onLogout}
                                              className={"text-slate-700 text-sm font-medium flex gap-2"}>{Icon.logoutIcon}Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {isSheetOpen && (
                <Sheet open={isSheetOpen} onOpenChange={isSheetOpen ? closeSheet : openSheet}>
                    <SheetContent className={"sm:max-w-[662px] p-0"}>
                        <SheetHeader className={"px-[32px] py-[22px] border-b flex"}>
                            <SheetTitle className={"text-xl font-medium flex justify-between items-center"}>Create new Project
                                <Button className={"bg-transparent hover:bg-transparent p-0 h-[24px]"}>
                                    <X className={"stroke-card-foreground"} onClick={closeSheet} />
                                </Button>
                            </SheetTitle>
                        </SheetHeader>
                        <div className="grid gap-[24px] px-[32px] pt-[24px] pb-[36px]">
                            <div className="gap-2">
                                <Label htmlFor="name" className="text-right">Project Name</Label>
                                <Input id="name" placeholder="Project Name" className={"placeholder:text-muted-foreground/75"} />
                            </div>
                            <div className="gap-2">
                                <Label htmlFor="website" className="text-right">Project website</Label>
                                <Input id="website" placeholder="https://yourcompany.com" className={"placeholder:text-muted-foreground/75"} />
                            </div>
                            <div className="gap-2 relative">
                                <Label htmlFor="domain" className="text-right">Project domain</Label>
                                <Input id="domain" placeholder="https://projectname.quickhunt.io" className={"placeholder:text-muted-foreground/75 pr-[115px]"} />
                                <span className={"absolute top-[33px] right-[13px] text-sm font-medium"}>Project domain</span>
                            </div>
                        </div>
                        <SheetFooter className={"px-[32px] gap-[16px] sm:justify-start"}>
                            <SheetClose asChild>
                                <Button className={"text-card sm:space-x-0 text-sm font-semibold hover:bg-primary bg-primary"} type="submit">Create Project</Button>
                            </SheetClose>
                            <SheetClose asChild onClick={closeSheet}>
                                <Button className={"text-primary text-sm font-semibold hover:bg-card border border-primary bg-card"} type="submit">Cancel</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            )}
        </header>
    );
};

export default HeaderBar;