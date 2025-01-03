import React, {Fragment, useEffect, useState} from 'react';
import {Sheet, SheetContent, SheetHeader, SheetTitle} from "../ui/sheet";
import {Button} from "../ui/button";
import {Bell, ChevronsUpDown, CreditCard, Eye, FileText, Loader2, LogOut, Menu, Moon, Plus, Sun, Trash2, User, X} from "lucide-react";
import {Input} from "../ui/input";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "../ui/dropdown-menu";
import {useTheme} from "../theme-provider";
import {baseUrl, getProjectDetails, logout, removeProjectDetails, setProjectDetails} from "../../utils/constent";
import {useNavigate} from "react-router-dom";
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
    const dispatch = useDispatch();
    const {toast} = useToast();
    let apiSerVice = new ApiService();
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

    const dropDownItem = [
        {
            title: "Profile",
            onClick: (() => navigate(`${baseUrl}/settings/profile`)),
            icon: <User size={16} />,
        },
        {
            title: "Billing",
            onClick: (() => navigate(`${baseUrl}/pricing-plan`)),
            icon: <CreditCard size={16} />,
        },
        {
            title: "Projects",
            onClick: openSheet,
            icon: <FileText size={16} />,
        },
        {
            title: "Logout",
            onClick: onLogout,
            icon: <LogOut size={16} />,
        },
    ]

    const sheetCommInput = [
        {
            title: "Project Name",
            placeholder: "Project Name",
            className: `${theme === "dark" ? "" : "placeholder:text-muted-foreground/75"}`,
            name: "project_name",
        },
        {
            title: "Project Website",
            placeholder: "https://yourcompany.com",
            className: `${theme === "dark" ? "placeholder:text-card-foreground/80" : "placeholder:text-muted-foreground/75"}`,
            name: "project_website",
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

            {/*<div className={"w-full p-3 pr-0 lg:py-3"}>*/}
            <div className={"w-full flex justify-between xl:justify-end items-center h-[56px] px-3"}>
                <div className={"flex justify-between items-center w-full h-full gap-2"}>
                    <div className={"flex gap-3 items-center"}>

                        {/*Mobile said bar start */}
                            <Button variant="outline" size="icon" className="shrink-0 xl:hidden" onClick={() => setIsMobile(true)}>
                                        <Menu size={20}/>
                                    </Button>
                        {/*Mobile said bar End */}

                        <div className="flex h-11 items-center hidden xl:block">
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
                                            <span className={"max-w-[130px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}>{projectDetailsReducer.id ? projectDetailsReducer.project_name : "Select project"}</span>
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
                                                                className={`${projectDetailsReducer.id === x.id ? `${theme === "dark" ? "text-card-foreground  hov-primary-dark" : "text-card hov-primary"} bg-primary` : 'bg-card'} gap-0.5`}
                                                                value={x.id}
                                                                // onSelect={() => {
                                                                //     onChangeProject(x.id);
                                                                //     setOpen(false)
                                                                // }}
                                                            >
                                                                <span
                                                                    className={"w-full text-sm font-medium cursor-pointer max-w-[159px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}
                                                                    onClick={() => {
                                                                        onChangeProject(x.id);
                                                                        setOpen(false)
                                                                    }}
                                                                >
                                                                    {x.project_name}
                                                                </span>
                                                                    {
                                                                        (userDetailsReducer?.id == x?.user_id) &&
                                                                    <Trash2 className={"cursor-pointer"} size={16} onClick={deleteAlert}/>
                                                                    }
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
                            {/*<Button variant="ghost hover:none" size="icon" className={"h-8 w-8"} onClick={toggleTheme}>*/}
                            {/*    <Moon size={20} className="block dark:hidden stroke-white"/>*/}
                            {/*    <Sun size={20} className="hidden dark:block stroke-white"/>*/}
                            {/*</Button>*/}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="secondary" size="icon" className="rounded-full w-[30px] h-[30px]">
                                        <Avatar className={"w-[30px] h-[30px]"}>
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
                                    {
                                        dropDownItem.map((x) => (
                                            <DropdownMenuItem
                                                className={"text-sm font-normal flex gap-2 cursor-pointer"}
                                                onClick={x.onClick}
                                            >
                                                <span className={`${theme === "dark" ? "profile-menu-icon" : ""}`}>{x.icon}</span>
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
                            {/*<SheetOverlay className={"inset-0"} />*/}
                            <SheetContent className={"sm:max-w-[662px] p-0"}>
                                <SheetHeader className={"px-4 py-3 md:py-5 lg:px-8 lg:py-[20px] border-b flex flex-row justify-between items-center space-y-0"}>
                                    <SheetTitle className={"text-xl font-normal flex justify-between items-center"}>
                                        Create New Project
                                    </SheetTitle>
                                    <span className={"max-w-[24px]"}><X className={"cursor-pointer m-0"} onClick={closeSheet}/></span>
                                </SheetHeader>
                                <div className="overflow-auto h-[calc(100vh_-_69px)]">
                                <div className="space-y-6 px-4 py-3 md:py-5 lg:px-8 lg:py-[20px]">
                                    {
                                        sheetCommInput.map((x) => (
                                            <div className="space-y-1">
                                                <Label htmlFor="name" className="text-right font-normal">{x.title}</Label>
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
                                                    <span className="text-destructive text-sm">{formError[x.name]}</span>
                                                }
                                            </div>
                                        ))
                                    }
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