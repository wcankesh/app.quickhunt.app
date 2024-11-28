import React, {Fragment, useEffect, useState} from 'react';
import {Sheet, SheetContent, SheetHeader, SheetOverlay, SheetTitle, SheetTrigger} from "../ui/sheet";
import {Button} from "../ui/button";
import {Activity, Bell, ChevronsUpDown, CircleHelp, CreditCard, DatabaseBackup, Eye, FileSliders, FileText, House, LayoutTemplate, Lightbulb, Loader2, LogOut, Megaphone, Menu, Moon, NotebookPen, Plus, Settings, Sun, Tag, Trash2, User, Users, UsersRound, X} from "lucide-react";
import {Input} from "../ui/input";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "../ui/dropdown-menu";
import {useTheme} from "../theme-provider";
import {baseUrl, getProjectDetails, logout, removeProjectDetails, setProjectDetails} from "../../utils/constent";
import {useNavigate, useParams} from "react-router-dom";
import {Icon} from "../../utils/Icon";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {ApiService} from "../../utils/ApiService";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../ui/command";
import {Label} from "../ui/label";
import {useDispatch, useSelector} from "react-redux";
import {useToast} from "../ui/use-toast";
import {projectDetailsAction} from "../../redux/action/ProjectDetailsAction";
import {allProjectAction} from "../../redux/action/AllProjectAction";
import {userDetailsAction} from "../../redux/action/UserDetailAction";
import {allStatusAndTypesAction} from "../../redux/action/AllStatusAndTypesAction";
import {useLocation} from "react-router";
import DeleteDialog from "./DeleteDialog";

const initialState = {
    id: "",
    user_browser: null,
    user_created_date: "",
    user_email_id: "",
    user_first_name: "",
    user_ip_address: null,
    user_job_title: "",
    user_last_name: "",
    user_photo: "",
    user_status: "",
    user_updated_date: "",
}

const initialStateProject = {
    project_name: '',
    project_website: "",
    project_language_id: '3',
    project_timezone_id: '90',
    project_logo: '',
    project_favicon: '',
    project_api_key: '',
    project_status: '',
    project_browser: '',
    project_ip_address: '',
    domain: ''
}

const initialStateErrorProject = {
    project_name: '',
}

const HeaderBar = ({setIsMobile}) => {
    const {setTheme, theme, onProModal} = useTheme()
    let navigate = useNavigate();
    let location = useLocation();
    const {type, id} = useParams();
    const dispatch = useDispatch();
    const {toast} = useToast();
    let apiSerVice = new ApiService();
    let url = location.pathname;
    const newUrl = url.replace(/[0-9]/g, '');
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allProjectReducer = useSelector(state => state.allProjectReducer);

    const [userDetails, setUserDetails] = useState(initialState)
    const [createProjectDetails, setCreateProjectDetails] = useState(initialStateProject);
    const [formError, setFormError] = useState(initialStateErrorProject);
    const [projectList, setProjectList] = useState([]);
    const [selectedUrl, setSelectedUrl] = useState(newUrl === "/" ? "/dashboard": newUrl);
    const [open, setOpen] = useState(false)
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [isSheetOpenMobileMenu, setSheetOpenMobileMenu] = useState(false);
    const [scrollingDown, setScrollingDown] = useState(false);
    const [isOpenDeleteAlert,setIsOpenDeleteAlert]=useState(false);
    const [isDeleteLoading, setDeleteIsLoading] = useState(false);
    const [isCreateLoading, setIsCreateLoading] = useState(false);

    const viewLink = () => {window.open(`https://${projectDetailsReducer.domain}/ideas`, "_blank")}

    const openSheet = () => {
        let length = projectList?.length;
        if(userDetailsReducer.plan === 0){
            if(length < 1){
                setSheetOpen(true);
                onProModal(false)
            }  else{
                onProModal(true)
            }
        } else if(userDetailsReducer.plan === 1){
            setSheetOpen(true);
            onProModal(false)
        }
    }
    const closeSheet = () => {
        setSheetOpen(false)
        setCreateProjectDetails(initialStateProject)
        setFormError(initialStateErrorProject)
    };

    const openMobileSheet = () => setSheetOpenMobileMenu(true);
    const closeMobileSheet = () => setSheetOpenMobileMenu(false);

    useEffect(() => {
        setUserDetails(userDetailsReducer)
    }, [userDetailsReducer])

    useEffect(() => {
        getAllProjects()
       // loginUserDetails()
    }, []);

    useEffect(() => {
        if(projectDetailsReducer.id){
            getAllStatusAndTypes()
        }
    },[projectDetailsReducer.id])

    const getAllStatusAndTypes = async () => {
        if(projectDetailsReducer.id){
            const data = await apiSerVice.getAllStatusAndTypes(projectDetailsReducer.id)
            if(data.status === 200){
                dispatch(allStatusAndTypesAction({...data.data}));
            }
        }
    }

    const loginUserDetails = async () =>{
        const data = await apiSerVice.getLoginUserDetails()
        if(data.status === 200){
            dispatch(userDetailsAction({...data.data}))
        }
    }

    const getAllProjects = async () => {
        const data = await apiSerVice.getAllProjects()
        if (data.status === 200) {
            if(data && data.data && data.data.length > 0){
                const array = [];
                let responseObj = data.data[0];
                if (!getProjectDetails('id')) {
                    setProjectDetails(responseObj);
                    dispatch(projectDetailsAction(responseObj))
                } else{
                    dispatch(projectDetailsAction(getProjectDetails('')))
                }
                dispatch(allProjectAction({projectList: data.data}));
                (data.data || []).map((x) => {
                    let obj = {
                        ...x,
                        Title: x.project_name,
                        Link: 'onProject',
                        icon: '',
                        selected: false
                    };
                    array.push(obj);
                })
                setProjectList(array)

            } else {
                 setSheetOpen(true)
            }
        }
    }

    const onRedirect = (link) => {
        setSelectedUrl(link)
        closeMobileSheet()
        navigate(`${baseUrl}${link}`);
    };

    const onLogout = async () => {
        document.querySelectorAll(".quickhunt").forEach((x) => {
            x.innerHTML = ""
        })
        logout();
        removeProjectDetails();
        setTheme("light")
        navigate(`${baseUrl}/login`);
    }

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const onChangeText = (event) => {
        const { name, value } = event.target;
        if(name === "project_name" || name === 'domain'){
            const cleanDomain = (name) => name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const sanitizedProjectName = cleanDomain(value);
            setCreateProjectDetails({
                ...createProjectDetails,
                [name]: value,
                domain: sanitizedProjectName
            });
        } else {
            setCreateProjectDetails({
                ...createProjectDetails,
                [name]: value,
            });
        }
        setFormError(formError => ({
            ...formError,
            [name]: ""
        }));
    };

    const formValidate = (name, value) => {
        switch (name) {
            case "project_name":
                if (!value || value.trim() === "") {
                    return "Project name is required";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const onCreateProject = async () => {
        setIsCreateLoading(true);
        let validationErrors = {};
        Object.keys(createProjectDetails).forEach(name => {
            const error = formValidate(name, createProjectDetails[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            setIsCreateLoading(false);
            return;
        }

        const cleanDomain = (name) => name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const sanitizedProjectName = cleanDomain(createProjectDetails.project_name);
        const domain = `${cleanDomain(createProjectDetails.domain || sanitizedProjectName)}.quickhunt.app`;

        const payload = {
            ...createProjectDetails,
            domain
        };

        const data = await apiSerVice.createProjects(payload)
        if (data.status === 200) {
            const clone = [...projectList];
            let obj = {
                ...data.data,
                Title: data.data.project_name,
                Link: 'onProject',
                icon: '',
                selected: false
            };
            clone.push(obj);
            setProjectList(clone)
            setProjectDetails(obj);
            dispatch(projectDetailsAction(obj))
            toast({description: data.message})
            setCreateProjectDetails(initialStateProject)
            setIsCreateLoading(false);
            navigate(`${baseUrl}/dashboard`);
            closeSheet();
            // setSheetOpen(false)
        } else {
            setIsCreateLoading(false);
            toast({variant: "destructive" ,description: data.message})
        }
        // closeSheet()
    }

    const onChangeProject = (value) => {
        let responseObj = projectList.find((x) =>x.id === value)
        setProjectDetails(responseObj);
        dispatch(projectDetailsAction(responseObj))
        navigate(`${baseUrl}/dashboard`);
    }

    const onCancel = () => {
        setCreateProjectDetails(initialStateProject);
        setFormError(initialStateErrorProject);
        closeSheet();
    }

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setScrollingDown(scrollTop > 5);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const deleteAlert =()=>{
        setIsOpenDeleteAlert(true);
    }

    //old code
    // const onDelete = async () => {
    //     setDeleteIsLoading(true)
    //     const data = await apiSerVice.deleteProjects(projectDetailsReducer.id)
    //     if(data.status === 200){
    //         const cloneProject = [...allProjectReducer.projectList]
    //         const index = cloneProject.findIndex((x) => x.id === projectDetailsReducer.id)
    //         if (index !== -1) {
    //             cloneProject.splice(index, 1);
    //             const nextProject = cloneProject[0] || null;
    //
    //             if (nextProject) {
    //                 setProjectDetails(nextProject);
    //                 dispatch(projectDetailsAction(nextProject));
    //             } else {
    //                 setProjectDetails(null);
    //                 dispatch(projectDetailsAction(null));
    //             }
    //
    //             dispatch(allProjectAction({ projectList: cloneProject })); // Update the project list in Redux
    //         }
    //         setDeleteIsLoading(false)
    //         setIsOpenDeleteAlert(false)
    //         toast({description: data.message})
    //         setTimeout(() => {
    //             history.push('/')
    //         },2000)
    //     } else {
    //
    //     }
    // }

    const onDelete = async () => {
        setDeleteIsLoading(true);
        const data = await apiSerVice.deleteProjects(projectDetailsReducer.id);

        if (data.status === 200) {
            const updatedProjects = allProjectReducer.projectList.filter(
                (project) => project.id !== projectDetailsReducer.id
            );
            const nextProject = updatedProjects[0] || null;
            if (nextProject) {
                setProjectDetails(nextProject);
                dispatch(projectDetailsAction(nextProject));
            } else {
                setProjectDetails(null);
                dispatch(projectDetailsAction(null));
            }
            dispatch(allProjectAction({ projectList: updatedProjects }));
            setProjectList(updatedProjects);
            setDeleteIsLoading(false);
            setIsOpenDeleteAlert(false);
            toast({ description: data.message });
            setTimeout(() => {
                history.push('/');
            }, 2000);
        } else {
            setDeleteIsLoading(false);
            toast({ variant: 'destructive', description: 'Failed to delete the project.' });
        }
    };



    const isActive = (link, subLink ="", subLink2 = "") => {
        return  window.location.pathname === subLink2 || window.location.pathname === subLink || window.location.pathname === link ;
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
                    title: 'Customers',
                    link: '/customers',
                    icon: <Users size={15} />,
                    selected: isActive(`${baseUrl}/customers`),
                },
                {
                    title: 'In App Message',
                    link: '/app-message',
                    icon: <NotebookPen size={15} />,
                    selected: isActive(`${baseUrl}/app-message`, `${baseUrl}/app-message/type`, `${baseUrl}/app-message/${type}/${id}`),
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

    return (
        <header className={`z-50 ltr:xl:ml-[250px] rtl:xl:mr-[250px] sticky top-0 bg-primary ${scrollingDown ? 'bg-background' : ''}`}>

            {
                isOpenDeleteAlert &&
                <DeleteDialog
                    title={"You really want to delete this Project ?"}
                    isOpen={isOpenDeleteAlert}
                    onOpenChange={() => setIsOpenDeleteAlert(false)}
                    onDelete={onDelete}
                    isDeleteLoading={isDeleteLoading}
                />
            }

            {/*<div className={"w-full p-3 pr-0 lg:py-3"}>*/}
            <div className={"w-full flex justify-between xl:justify-end items-center h-[56px] px-3"}>
                <div className={"flex justify-between items-center w-full h-full gap-2"}>
                    <div className={"flex gap-3 items-center"}>

                        {/*Mobile said bar start */}
                        {/*<span>*/}
                        {/*    <Button variant="outline" size="icon" className="shrink-0 xl:hidden">*/}
                        {/*                <Menu size={20}/>*/}
                        {/*            </Button>*/}
                        {/*</span>*/}
                        {/*Mobile said bar End */}

                        {/*Mobile said bar start */}
                            <Sheet open={isSheetOpenMobileMenu} onOpenChange={isSheetOpenMobileMenu ? closeMobileSheet : openMobileSheet}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon" className="shrink-0 xl:hidden">
                                        <Menu size={20}/>
                                    </Button>
                                </SheetTrigger>
                                <SheetOverlay className={"inset-0"} />
                                <SheetContent side="left" className="flex gap-0 flex-col w-[280px] md:w-[340px] p-0">
                                    <SheetHeader className={"flex gap-2 flex-row justify-between items-center p-3 py-2.5 dark:border-b"}>
                                        <div className={"flex w-full items-center h-[56px] cursor-pointer"}  onClick={() => onRedirect("/dashboard")}>
                                            {theme === "dark" ? Icon.whiteLogo : Icon.blackLogo}
                                        </div>
                                        <X size={18} className={"fill-card-foreground stroke-card-foreground m-0"} onClick={closeMobileSheet}/>
                                    </SheetHeader>
                                    <div className={" px-3 flex flex-col overflow-y-auto h-full bg-primary/5"}>
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
                                                                        <h3 className={"text-sm font-bold px-2 pr-1"}>{x.mainTitle}</h3>
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
                                                                    className={`flex justify-start gap-2 py-0 px-2 pr-1 h-[28px] ${x.selected  ? "rounded-md bg-primary/15 transition-none" : 'items-center hover:bg-primary/10 hover:text-primary transition-none'}`}
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
                                    </div>
                                </SheetContent>
                            </Sheet>
                        {/*Mobile said bar End */}

                        <div className="flex h-11 items-center xl:hidden md:block hidden">
                            <div className={"app-logo cursor-pointer h-[45px]"}  onClick={() => onRedirect("/dashboard")}>
                                {Icon.whiteLogo}
                            </div>
                        </div>
                    </div>

                    <div className={"flex gap-1 md:gap-8"}>
                        <div className={"flex gap-6 items-center"}>
                            <div className={"drop-option"}>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                            className="min-w-[150px] md:w-[222px] h-[36px] justify-between bg-card"
                                        >
                                            {projectDetailsReducer.id ? projectDetailsReducer.project_name : "Select project"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search project"/>
                                            <CommandList>
                                                <CommandEmpty>No project found.</CommandEmpty>
                                                <CommandGroup>
                                                    {(projectList || []).map((x, i) => (
                                                        <Fragment key={i}>
                                                            <CommandItem
                                                                className={`${projectDetailsReducer.id === x.id ? `${theme === "dark" ? "text-card-foreground  hov-primary-dark" : "text-card hov-primary"} bg-primary` : 'bg-card'}`}
                                                                value={x.id}
                                                                onSelect={() => {
                                                                    onChangeProject(x.id);
                                                                    setOpen(false)
                                                                }}
                                                            >
                                                                <span className={"flex justify-between items-center w-full text-sm font-medium cursor-pointer"}>
                                                                    {x.project_name}
                                                                    <Trash2 className={"cursor-pointer"} size={16} onClick={deleteAlert}/>
                                                                </span>
                                                            </CommandItem>
                                                        </Fragment>
                                                    ))}
                                                        <div className={"flex gap-2 items-center cursor-pointer py-[6px] px-3"} onClick={openSheet}>
                                                            <Plus size={16}/>
                                                            <h4 className={"text-sm font-medium"}>Create Project</h4>
                                                        </div>
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className={"flex gap-2 md:gap-4 items-center"}>
                            <Button variant="ghost hover:none" size="icon" className={"h-8 w-8"} onClick={viewLink}>
                                <Eye size={20} className={'stroke-white'} />
                            </Button>
                            <Button variant="ghost hover:none" size="icon" className={"h-8 w-8"}>
                                <Bell size={20} className={'stroke-white'} />
                            </Button>
                            <Button variant="ghost hover:none" size="icon" className={"h-8 w-8"} onClick={toggleTheme}>
                                {/*{theme === 'light' ? <Moon size={20} className="stroke-white"/> : <Sun size={20} />}*/}
                                <Moon size={20} className="block dark:hidden stroke-white"/>
                                <Sun size={20} className="hidden dark:block stroke-white"/>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="secondary" size="icon" className="rounded-full w-[30px] h-[30px]">
                                        <Avatar className={"w-[30px] h-[30px]"}>
                                            {/*{*/}
                                            {/*    userDetails && userDetails.user_photo  ?*/}
                                            {/*        <AvatarImage src={userDetails.user_photo}*/}
                                            {/*                     alt={userDetails && userDetails?.user_first_name?.substring(0, 1)?.toUpperCase() && userDetails?.user_last_name?.substring(0, 1)?.toUpperCase()}*/}
                                            {/*        />*/}
                                            {/*        :*/}
                                            {/*        <AvatarFallback>{userDetails?.user_first_name?.substring(0, 1)?.toUpperCase()}{userDetails?.user_last_name?.substring(0, 1)?.toUpperCase()}</AvatarFallback>*/}
                                            {/*}*/}
                                            <AvatarImage src={userDetails.user_photo}
                                                         alt={userDetails && userDetails?.user_first_name?.substring(0, 1)?.toUpperCase() && userDetails?.user_last_name?.substring(0, 1)?.toUpperCase()}
                                            />
                                            <AvatarFallback>{userDetails?.user_first_name?.substring(0, 1)?.toUpperCase()}{userDetails?.user_last_name?.substring(0, 1)?.toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className={"w-56 rounded-md shadow"}>
                                    <DropdownMenuLabel className={"text-sm font-medium"}>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem
                                        className={"text-sm font-normal flex gap-2 cursor-pointer"}
                                        onClick={() => navigate(`${baseUrl}/settings/profile`)}
                                    >
                                        <span className={`${theme === "dark" ? "profile-menu-icon" : ""}`}><User size={16} /></span>
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className={"text-sm font-normal flex gap-2 cursor-pointer"}
                                        onClick={() => navigate(`${baseUrl}/pricing-plan`)}
                                    >
                                        <span className={`${theme === "dark" ? "profile-menu-icon" : ""}`}><CreditCard size={16} /></span>
                                        Billing
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem className={"text-sm font-normal flex gap-2 cursor-pointer"} onClick={openSheet}>
                                        <span className={`${theme === "dark" ? "profile-menu-icon" : ""}`}><FileText size={16} /></span>
                                        Projects
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem onClick={onLogout} className={"text-sm font-normal flex gap-2 cursor-pointer"}>
                                        <span className={`${theme === "dark" ? "profile-menu-icon" : ""}`}><LogOut size={16} /></span>
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {isSheetOpen && (
                        <Sheet open={isSheetOpen} onOpenChange={isSheetOpen ? closeSheet : openSheet}>
                            <SheetOverlay className={"inset-0"} />
                            <SheetContent className={"sm:max-w-[662px] p-0"}>
                                <SheetHeader className={"px-4 py-3 md:py-5 lg:px-8 lg:py-[20px] border-b flex flex-row justify-between items-center"}>
                                    <SheetTitle className={"text-xl font-normal flex justify-between items-center"}>
                                        Create New Project
                                    </SheetTitle>
                                    <X className={"cursor-pointer m-0"} onClick={closeSheet}/>
                                </SheetHeader>
                                <div className="overflow-auto h-[calc(100vh_-_69px)]">
                                <div className="space-y-6 px-4 py-3 md:py-5 lg:px-8 lg:py-[20px]">
                                    <div className="space-y-1">
                                        <Label htmlFor="name" className="text-right font-normal">Project Name</Label>
                                        <Input
                                            id="project_name"
                                            placeholder="Project Name"
                                            className={`${theme === "dark" ? "" : "placeholder:text-muted-foreground/75"}`}
                                            value={createProjectDetails.project_name}
                                            name="project_name"
                                            onChange={onChangeText}
                                        />
                                        {
                                            formError.project_name &&
                                            <span className="text-destructive text-sm">{formError.project_name}</span>
                                        }
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="website" className="text-right font-normal">Project Website</Label>
                                        <Input
                                            id="project_website"
                                            placeholder="https://yourcompany.com"
                                            className={`${theme === "dark" ? "placeholder:text-card-foreground/80" : "placeholder:text-muted-foreground/75"}`}
                                            value={createProjectDetails.project_website}
                                            name="project_website"
                                            onChange={onChangeText}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="domain" className="text-right font-normal">Project Domain</Label>
                                        <div className={"relative"}>
                                            <Input
                                                id="domain"
                                                placeholder="Project Domain"
                                                className={`${theme === "dark" ? "placeholder:text-muted-foreground/75 pr-[115px]" : "placeholder:text-muted-foreground/75 pr-[115px]"}`}
                                                value={createProjectDetails.domain}
                                                name="domain"
                                                onChange={onChangeText}
                                            />
                                            <span className={"absolute top-2 right-2 font-normal"}>quickhunt.app</span>
                                        </div>
                                    </div>
                                <div className={"gap-4 flex sm:justify-start"}>
                                        <Button
                                            className={`bg-primary ${theme === "dark" ? "text-card-foreground" : "text-card"} hover:bg-primary w-[129px] font-medium`}
                                            onClick={onCreateProject} type="submit"
                                        >
                                            {isCreateLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Create Project"}
                                        </Button>
                                        <Button
                                            className={`${theme === "dark" ? "" : "text-primary"} text-sm font-medium hover:bg-card border border-primary bg-card`}
                                            type="submit" onClick={onCancel}
                                        >
                                            Cancel
                                        </Button>
                                </div>
                                </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    )}
                </div>
            </div>
        </header>
    );
};

export default HeaderBar;