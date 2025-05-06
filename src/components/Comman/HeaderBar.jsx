import React, {Fragment, useEffect, useState} from 'react';
import {Sheet, SheetContent, SheetHeader, SheetTitle} from "../ui/sheet";
import {Button} from "../ui/button";
import {
    Bell,
    ChevronsUpDown,
    CreditCard,
    Eye,
    FileText,
    Loader2,
    LogOut,
    Menu,
    Moon,
    Plus,
    Sun,
    Trash2,
    User,
    X
} from "lucide-react";
import {Input} from "../ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";
import {useTheme} from "../theme-provider";
import {
    apiService,
    baseUrl, getProfile,
    getProjectDetails,
    logout,
    removeProjectDetails,
    setProjectDetails
} from "../../utils/constent";
import {useNavigate} from "react-router-dom";
import {Icon} from "../../utils/Icon";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../ui/command";
import {Label} from "../ui/label";
import {useDispatch, useSelector} from "react-redux";
import {useToast} from "../ui/use-toast";
import {projectDetailsAction} from "../../redux/action/ProjectDetailsAction";
import {allProjectAction} from "../../redux/action/AllProjectAction";
import {allStatusAndTypesAction} from "../../redux/action/AllStatusAndTypesAction";
import DeleteDialog from "./DeleteDialog";

const initialState = {
    id: "",
    browser: null,
    createdAt: "",
    email: "",
    firstName: "",
    ipAddress: null,
    jobTitle: "",
    lastName: "",
    profileImage: "",
    status: "1",
    updatedAt: "",
}

const initialStateProject = {
    name: '',
    website: "",
    languageId: '3',
    timezoneId: '90',
    logo: '',
    favicon: '',
    apiKey: '',
    status: '1',
    browser: '',
    ipAddress: '',
    domain: ''
}

const initialStateErrorProject = {
    name: '',
}

const HeaderBar = ({setIsMobile}) => {
    const {setTheme, theme, onProModal} = useTheme()
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const {toast} = useToast();
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allProjectReducer = useSelector(state => state.allProjectReducer);

    const [userDetails, setUserDetails] = useState(initialState)
    const [createProjectDetails, setCreateProjectDetails] = useState(initialStateProject);
    const [formError, setFormError] = useState(initialStateErrorProject);
    const [projectList, setProjectList] = useState([]);
    const [open, setOpen] = useState(false)
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [scrollingDown, setScrollingDown] = useState(false);
    const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);
    const [isDeleteLoading, setDeleteIsLoading] = useState(false);
    const [deleteProjectId, setDeleteProjectId] = useState(null);
    const [isCreateLoading, setIsCreateLoading] = useState(false);

    const userProjectCount = projectList?.filter(p => p.userId == userDetailsReducer?.id).length || 0;

    const viewLink = () => {
        window.open(`https://${projectDetailsReducer.domain}/ideas`, "_blank")
    }

    const openSheet = () => {
        let length = projectList?.length;
        if (userDetailsReducer.plan === 0) {
            if (length < 1) {
                setSheetOpen(true);
                onProModal(false)
            } else {
                onProModal(true)
            }
        } else if (userDetailsReducer.plan === 1) {
            setSheetOpen(true);
            onProModal(false)
        }
    }

    const closeSheet = () => {
        setSheetOpen(false)
        setCreateProjectDetails(initialStateProject)
        setFormError(initialStateErrorProject)
    };

    useEffect(() => {
        setUserDetails(userDetailsReducer)
    }, [userDetailsReducer])

    useEffect(() => {
        getAllProjects()
    }, []);

    useEffect(() => {
        if (projectDetailsReducer.id) {
            getAllStatusAndTypes()
        }
    }, [projectDetailsReducer.id])

    const getAllStatusAndTypes = async () => {
        if (projectDetailsReducer.id) {
            const data = await apiService.getAllStatusAndTypes(projectDetailsReducer.id)
            if (data.success) {
                dispatch(allStatusAndTypesAction({...data.data}));
            }
        }
    }

    const getAllProjects = async () => {
        const data = await apiService.getAllProjects()
        if (data.success) {
            if (data && data.data && data.data.length > 0) {
                const array = [];
                let responseObj = data.data[0];
                if (!getProjectDetails('id')) {
                    setProjectDetails(responseObj);
                    dispatch(projectDetailsAction(responseObj))
                } else {
                    dispatch(projectDetailsAction(getProjectDetails('')))
                }
                dispatch(allProjectAction({projectList: data.data}));
                (data.data || []).map((x) => {
                    let obj = {
                        ...x,
                        Title: x.name,
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
        const {name, value} = event.target;
        if (name === "name" || name === 'domain') {
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
            case "name":
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
        const sanitizedProjectName = cleanDomain(createProjectDetails.name);
        const domain = `${cleanDomain(createProjectDetails.domain || sanitizedProjectName)}.quickhunt.app`;

        const payload = {
            ...createProjectDetails,
            domain
        };

        const data = await apiService.createProjects(payload)
        setIsCreateLoading(false);
        if (data.success) {
            const clone = [...projectList];
            let obj = {
                ...data.data,
                Title: data.data.name,
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
            navigate(`${baseUrl}/dashboard`);
            closeSheet();
        } else {
            toast({variant: "destructive", description: data?.error?.message})
        }
    }

    const onChangeProject = (value) => {
        let responseObj = projectList.find((x) => x.id === value)
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

    const deleteAlert = (proId) => {
        setIsOpenDeleteAlert(true);
        setDeleteProjectId(proId)
    }

    const onDelete = async () => {
        if (!deleteProjectId) return;
        setDeleteIsLoading(true);
        const data = await apiService.deleteProjects(deleteProjectId);
        setDeleteIsLoading(false);
        if (data.success) {
            const updatedProjects = allProjectReducer.projectList.filter((project) => project.id != deleteProjectId);
            const nextProject = updatedProjects[0] || null;
            if (nextProject) {
                setProjectDetails(nextProject);
                dispatch(projectDetailsAction(nextProject));
            } else {
                setProjectDetails(null);
                dispatch(projectDetailsAction(null));
            }
            dispatch(allProjectAction({projectList: updatedProjects}));
            setProjectList(updatedProjects);
            setIsOpenDeleteAlert(false);
            setDeleteProjectId(null)
            toast({description: data.message});
        } else {
            toast({variant: 'destructive', description: data.error?.message});
        }
    };

    const dropDownItem = [
        {
            title: "Profile",
            onClick: (() => navigate(`${baseUrl}/settings/profile`)),
            icon: <User size={16}/>,
        },
        {
            title: "Billing",
            onClick: (() => navigate(`${baseUrl}/pricing-plan`)),
            icon: <CreditCard size={16}/>,
        },
        {
            title: "Projects",
            onClick: openSheet,
            icon: <FileText size={16}/>,
        },
        {
            title: "Logout",
            onClick: onLogout,
            icon: <LogOut size={16}/>,
        },
    ]

    const sheetCommInput = [
        {
            title: "Project Name",
            placeholder: "Project Name",
            className: `${theme === "dark" ? "" : "placeholder:text-muted-foreground/75"}`,
            name: "name",
        },
        {
            title: "Project Website",
            placeholder: "https://yourcompany.com",
            className: `${theme === "dark" ? "placeholder:text-card-foreground/80" : "placeholder:text-muted-foreground/75"}`,
            name: "website",
        },
        {
            title: "Project Domain",
            placeholder: "Project Domain",
            className: `${theme === "dark" ? "placeholder:text-muted-foreground/75 pr-[115px]" : "placeholder:text-muted-foreground/75 pr-[115px]"}`,
            name: "domain",
            span: "quickhunt.app",
        },
    ]

    return (
        <header className={`z-50 sticky top-0 bg-primary ${scrollingDown ? 'bg-background' : ''}`}>

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

            <div className={"w-full flex justify-between xl:justify-end items-center h-[56px] px-3"}>
                <div className={"flex justify-between items-center w-full h-full gap-2"}>
                    <div className={"flex gap-3 items-center"}>
                        <Button variant="outline" size="icon" className="shrink-0 xl:hidden"
                                onClick={() => setIsMobile(true)}>
                            <Menu size={20}/>
                        </Button>
                        <div className="flex h-11 items-center hidden xl:block">
                            <div className={"app-logo cursor-pointer h-[45px]"}
                                 onClick={() => onRedirect("/dashboard")}>
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
                                            <span
                                                className={"max-w-[130px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}>{projectDetailsReducer.id ? projectDetailsReducer.name : "Select project"}</span>
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search project"/>
                                            <CommandList>
                                                <CommandEmpty>No project found.</CommandEmpty>
                                                <CommandGroup>
                                                    {(projectList || []).map((x, i) => {
                                                        return (
                                                            <Fragment key={i}>
                                                                <CommandItem
                                                                    className={`${projectDetailsReducer.id === x.id ? `${theme === "dark" ? "text-card-foreground  hov-primary-dark" : "text-card hov-primary"} bg-primary` : 'bg-card'} gap-0.5`}
                                                                    value={x.id}
                                                                >
                                                                <span
                                                                    className={"w-full text-sm font-medium cursor-pointer max-w-[159px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}
                                                                    onClick={() => {
                                                                        onChangeProject(x.id);
                                                                        setOpen(false)
                                                                    }}
                                                                >
                                                                    {x.name}
                                                                </span>
                                                                    {(userDetailsReducer?.id == x?.userId && userProjectCount > 1) && (
                                                                        <Trash2 className={"cursor-pointer"} size={16}
                                                                                onClick={() => deleteAlert(x.id)}/>
                                                                    )}
                                                                </CommandItem>
                                                            </Fragment>
                                                        )
                                                    })}
                                                    <div
                                                        className={"flex gap-2 items-center cursor-pointer py-[6px] px-3"}
                                                        onClick={openSheet}>
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
                                <Eye size={20} className={'stroke-white'}/>
                            </Button>
                            <Button variant="ghost hover:none" size="icon" className={"h-8 w-8"}>
                                <Bell size={20} className={'stroke-white'}/>
                            </Button>
                            {/*<Button variant="ghost hover:none" size="icon" className={"h-8 w-8"} onClick={toggleTheme}>*/}
                            {/*    <Moon size={20} className="block dark:hidden stroke-white"/>*/}
                            {/*    <Sun size={20} className="hidden dark:block stroke-white"/>*/}
                            {/*</Button>*/}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="secondary" size="icon" className="rounded-full w-[30px] h-[30px]">
                                        <Avatar className={"w-[30px] h-[30px]"}>
                                            <AvatarImage
                                                src={getProfile(userDetails?.profileImage)}
                                                alt={`${userDetails && userDetails?.firstName?.substring(0, 1)?.toUpperCase()}${userDetails?.lastName?.substring(0, 1)?.toUpperCase()}`}/>
                                            <AvatarFallback>{userDetails?.firstName?.substring(0, 1)?.toUpperCase()}{userDetails?.lastName?.substring(0, 1)?.toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className={"w-56 rounded-md shadow z-[99999]"}>
                                    <DropdownMenuLabel className={"text-sm font-medium"}>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator/>
                                    {
                                        dropDownItem.map((x, i) => (
                                            <DropdownMenuItem key={i}
                                                              className={"text-sm font-normal flex gap-2 cursor-pointer"}
                                                              onClick={x.onClick}
                                            >
                                                <span
                                                    className={`${theme === "dark" ? "profile-menu-icon" : ""}`}>{x.icon}</span>
                                                {x.title}
                                            </DropdownMenuItem>
                                        ))
                                    }
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {isSheetOpen && (
                        <Sheet open={isSheetOpen} onOpenChange={isSheetOpen ? closeSheet : openSheet}>
                            <SheetContent className={"sm:max-w-[662px] p-0"}>
                                <SheetHeader
                                    className={"px-4 py-3 md:py-5 lg:px-8 lg:py-[20px] border-b flex flex-row justify-between items-center space-y-0"}>
                                    <SheetTitle className={"text-xl font-normal flex justify-between items-center"}>
                                        Create New Project
                                    </SheetTitle>
                                    <span className={"max-w-[24px]"}><X className={"cursor-pointer m-0"}
                                                                        onClick={closeSheet}/></span>
                                </SheetHeader>
                                <div className="overflow-auto h-[calc(100vh_-_69px)]">
                                    <div className="space-y-6 px-4 py-3 md:py-5 lg:px-8 lg:py-[20px]">
                                        {
                                            sheetCommInput.map((x, i) => (
                                                <div className="space-y-1" key={i}>
                                                    <Label htmlFor="name"
                                                           className="text-right font-normal">{x.title}</Label>
                                                    <Input
                                                        id={x.name}
                                                        placeholder={x.placeholder}
                                                        className={x.className}
                                                        value={createProjectDetails[x.name]}
                                                        name={x.name}
                                                        onChange={onChangeText}
                                                    />
                                                    {
                                                        formError[x.name] &&
                                                        <span
                                                            className="text-destructive text-sm">{formError[x.name]}</span>
                                                    }
                                                </div>
                                            ))
                                        }
                                        <div className={"gap-4 flex sm:justify-start"}>
                                            <Button
                                                className={`bg-primary ${theme === "dark" ? "text-card-foreground" : "text-card"} hover:bg-primary w-[129px] font-medium`}
                                                onClick={onCreateProject} type="submit"
                                            >
                                                {isCreateLoading ?
                                                    <Loader2 className="h-4 w-4 animate-spin"/> : "Create Project"}
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