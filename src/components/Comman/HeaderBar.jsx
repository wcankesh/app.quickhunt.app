import React, {useState} from 'react';
import {Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, SheetClose} from "../ui/sheet";
import {Button} from "../ui/button";
import {Bell, CircleUser, Home, LineChart, Menu, Package, Package2, Search, ShoppingCart, Users} from "lucide-react";
import {Badge} from "../ui/badge";
import {Input} from "../ui/input";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "../ui/dropdown-menu";
import {useTheme} from "../theme-provider";
import {baseUrl, logout, removeProjectDetails} from "../../utils/constent";
import {useNavigate} from "react-router-dom";
import {Icon} from "../../utils/Icon";
import {DropdownMenuGroup} from "@radix-ui/react-dropdown-menu";
import {Select, SelectContent, SelectTrigger, SelectValue, SelectGroup, SelectItem, SelectLabel} from "../ui/select";
import {Avatar, AvatarImage} from "../ui/avatar";
import { Moon, Sun } from "lucide-react";
import AppLogoPurple from "../../img/quickhunt.purple.png";
import {ApiService} from "../../utils/ApiService";
import {Popover, PopoverTrigger, PopoverContent} from "../ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
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
                title: 'Changelogs',
                link: '/changelogs',
                icon: Icon.analyticsIcon,
                selected: `${baseUrl}/changelogs`,
            },
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

const HeaderBar = () => {
    const { setTheme, theme } = useTheme()
    let navigate = useNavigate();
    let apiSerVice = new ApiService()
    const [selectedUrl, setSelectedUrl] = useState("/dashboard");
    const [value, setValue] = useState("")
    const [open, setOpen] = useState(false)
    const [createProjectSheetOpen, setCreateProjectSheetOpen] = useState(false);

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

    const toggleCreateProjectSheet = () => {
        setCreateProjectSheetOpen(!createProjectSheetOpen);
    };

    const toggleCreateProjectSheetClose = () => {
        setCreateProjectSheetOpen(false);
    };

    return (
        <header className="flex h-14 lg:justify-between md:justify-between items-center sm:justify-between gap-4 px-4 lg:h-[60px] lg:px-6 ">
            {/*Mobile said bar start */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                        <Menu className="h-5 w-5"/>
                    </Button>
                </SheetTrigger>

                <SheetContent side="left" className="flex flex-col">
                    <nav className="grid gap-2 text-lg font-medium">
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
                                                        className={`${isActive(z.selected) ? "flex justify-start gap-4 h-9 rounded-md shadow border border-zinc-200" : 'flex items-center gap-4 justify-start'}`}
                                                        onClick={() => onRedirect(z.link)}
                                                    >
                                                        <div className={`${isActive(z.selected) ? "fill-violet-600" : ""}`}>{z.icon}</div>
                                                        <div className={`${isActive(z.selected) ? "text-violet-600 text-xs font-medium" : "text-zinc-600 text-xs font-medium"}`}>{z.title}</div>
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
                                                            className={`${isActive(y.selected) ? "flex justify-start gap-4 h-9 rounded-md shadow border border-zinc-200" : 'flex items-center gap-4 justify-start'}`}
                                                            onClick={() => onRedirect(y.link)}
                                                        >
                                                            {y.icon}
                                                            <div className={`${isActive(y.selected) ? "text-violet-600 text-xs font-medium" : "text-zinc-600 text-xs font-medium"}`}>{y.title}</div>
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
                        <nav className="grid gap-2 text-lg font-medium">
                            {
                                (footerMenuComponent || []).map((x, i) => {
                                    return (
                                        <Button
                                            key={i}
                                            variant={"link hover:no-underline"}
                                            href="#"
                                            className={`${isActive(x.selected) ? "flex justify-start gap-4 h-9 rounded-md shadow border border-zinc-200" : 'flex items-center gap-4 justify-start'}`}
                                            onClick={() => onRedirect(x.link)}
                                        >
                                            {x.icon}
                                            <div className={`${isActive(x.selected) ? "text-violet-600 text-xs font-medium" : "text-zinc-600 text-xs font-medium"}`}>{x.title}</div>
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
                                                    onSelect={framework.value === 'createproject' ? toggleCreateProjectSheet : (currentValue) =>  {
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
                    <div className="search-input">
                        <form>
                            <div
                                className="relative ml-auto flex-1 md:grow-0 bg-white rounded-md shadow border-slate-300">
                                <Input
                                    type="search"
                                    placeholder="Search..."
                                    className="w-full pl-4 pr-14 md:w-[200px] lg:w-[352px] text-slate-400 text-sm font-normal"
                                />
                            </div>
                        </form>
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
                                <CircleUser className="h-5 w-5"/>
                                <span className="sr-only">Toggle user menu</span>
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
            {createProjectSheetOpen && (
                <Sheet open={createProjectSheetOpen}>
                    {/*<SheetTrigger asChild>*/}
                    {/*    <Button variant="outline">Open</Button>*/}
                    {/*</SheetTrigger>*/}
                    <SheetContent className={"sm:max-w-[662px] p-0"}>
                        <SheetHeader className={"px-[32px] py-[24px] border-b border-zinc-200"}>
                            <SheetTitle className={"text-zinc-600 text-xl font-medium"}>Create new Project</SheetTitle>
                        </SheetHeader>
                        <div className="grid gap-[24px] px-[32px] pt-[24px] pb-[36px]">
                            <div className="gap-2">
                                <Label htmlFor="name" className="text-right">Project Name</Label>
                                <Input id="name" placeholder="Project Name" className={"border-slate-300 placeholder:text-slate-400"} />
                            </div>
                            <div className="gap-2">
                                <Label htmlFor="website" className="text-right">Project website</Label>
                                <Input id="website" placeholder="https://yourcompany.com" className={"border-slate-300 placeholder:text-slate-400"} />
                            </div>
                            <div className="gap-2 relative">
                                <Label htmlFor="domain" className="text-right">Project domain</Label>
                                <Input id="domain" placeholder="https://projectname.quickhunt.io" className={"border-slate-300 placeholder:text-slate-400"} />
                                <span className={"absolute top-[33px] right-[13px] text-slate-900 text-sm font-medium"}>Project domain</span>
                            </div>
                        </div>
                        <SheetFooter className={"px-[32px] gap-[16px] sm:justify-start"}>
                            <SheetClose asChild>
                                <Button className={"text-white sm:space-x-0 text-sm font-semibold hover:bg-violet-600 bg-violet-600"} type="submit">Create Project</Button>
                            </SheetClose>
                            <SheetClose asChild onClick={toggleCreateProjectSheetClose}>
                                <Button className={"text-violet-600 text-sm font-semibold hover:bg-white border border-violet-600 bg-white"} type="submit">Cancel</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            )}
        </header>
    );
};

export default HeaderBar;