import React, {Fragment, useEffect, useState} from 'react';
import {Button} from "../ui/button";
import {
    ArrowUp, ChevronUp,
    Clock,
    GalleryVerticalEnd,
    Info,
    Lightbulb,
    Loader2,
    Mail,
    MapPin, MessageSquare,
    MessagesSquare,
    Plus,
    Settings,
    Trash2,
    X,
    Zap
} from "lucide-react";
import {Card, CardContent} from "../ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {useTheme} from "../theme-provider";
import {ApiService} from "../../utils/ApiService";
import {useSelector} from "react-redux";
import {useToast} from "../ui/use-toast";
import {Skeleton} from "../ui/skeleton";
import EmptyData from "../Comman/EmptyData";
import {Sheet, SheetContent, SheetHeader} from "../ui/sheet";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Switch} from "../ui/switch";
import Pagination from "../Comman/Pagination";
import DeleteDialog from "../Comman/DeleteDialog";
import {baseUrl} from "../../utils/constent";
import {useNavigate} from "react-router";
import {EmptyDataContent} from "../Comman/EmptyDataContent";
import moment from "moment";
import {TabsContent, TabsList, TabsTrigger} from "../ui/tabs";
import {Tabs} from "@radix-ui/react-tabs";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {Badge} from "../ui/badge";

const perPageLimit = 10;

const initialState = {
    project_id: '',
    customer_name: '',
    customer_email_id: '',
    customer_email_notification: false,
    customer_first_seen: '',
    customer_last_seen: '',
    user_browser: '',
    user_ip_address : '',
}
const initialStateError = {
    customer_name: "",
    customer_email_id: "",
}

const UserActionsList = ({ userActions, sourceTitle, isLoading }) => {
    if (isLoading || !userActions.length) {
        return (
            <div className="divide-y h-[calc(100vh_-_204px)]">
                {isLoading ? (
                    Array.from({ length: 13 }).map((_, index) => (
                        <div key={index} className="px-2 py-[10px] md:px-3 flex justify-between gap-2">
                            <Skeleton className="rounded-md w-full h-7 bg-muted-foreground/[0.1]" />
                        </div>
                    ))
                ) : (
                    <EmptyData />
                )}
            </div>
        );
    }

    return (
        <div className={"divide-y h-[calc(100vh_-_204px)]"}>
            {(userActions || []).map((action, index) => {
                return (
                    <Fragment key={index}>
                        {sourceTitle.map((source, i) => {
                            if (action.source === source.value) {
                                return (
                                    <div className={"px-2 py-[10px] md:px-3 flex justify-between gap-2"} key={i}>
                                        <div className={"space-y-3"}>
                                            <h2 className={"font-medium"}>{source.title}</h2>
                                            {source.value === "post_reactions" ? (
                                                <div className={"flex items-center gap-2"}>
                                                    <Avatar className={"rounded-none w-[20px] h-[20px]"}>
                                                        <AvatarImage src={action.emoji_url} />
                                                    </Avatar>
                                                    <span className={"text-sm text-muted-foreground"}>{action.title}</span>
                                                </div>
                                            ) : (
                                                <span className={"text-sm text-muted-foreground"}>{action.title}</span>
                                            )}
                                        </div>
                                        <span className={"text-sm text-muted-foreground"}>
                                            {action?.created_at ? moment(action?.created_at).format('D MMM, YYYY') : "-"}
                                        </span>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </Fragment>
                );
            })}
        </div>
    );
};

const Users = () => {
    const {theme} =useTheme();
    const navigate = useNavigate();
    const apiService = new ApiService();
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo") || 1;
    const {toast} = useToast()
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const [formError, setFormError] = useState(initialStateError);
    const [customerDetails, setCustomerDetails] = useState(initialState);
    const [customerList, setCustomerList] = useState([]);
    const [userActions, setUserActions] = useState([]);
    const [pageNo, setPageNo] = useState(Number(getPageNo));
    const [totalRecord, setTotalRecord] = useState(0);
    const [deleteId,setDeleteId]=useState(null);
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingDelete,setIsLoadingDelete] = useState(false);
    const [openDelete,setOpenDelete]=useState(false);
    const [isSave,setIsSave]=useState(false);
    const [emptyContentBlock, setEmptyContentBlock] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isDetailsSheetOpen, setDetailsSheetOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState('details');

    const emptyContent = (status) => {setEmptyContentBlock(status);};

    useEffect(() => {
        if(projectDetailsReducer.id){
            getAllCustomers();
        }
        navigate(`${baseUrl}/user?pageNo=${pageNo}`)
    }, [projectDetailsReducer.id, pageNo])

    const openUserDetails = (user) => {
        navigate(`${baseUrl}/user?${user?.id}&pageNo=${pageNo}`)
        setSelectedCustomer(user);
        setDetailsSheetOpen(true);
    }

    const onChangeText = (event) => {
        setCustomerDetails({...customerDetails, [event.target.name]: event.target.value});
        setFormError(formError => ({...formError, [event.target.name]: ""}));
    }

    const onBlur = (event) => {
        const { name, value } = event.target;
        setFormError({
            ...formError,
            [name]: formValidate(name, value)
        });
    }

    const formValidate = (name, value) => {
        switch (name) {
            case "customer_name":
                if (!value || value.trim() === "") {
                    return "User name is required.";
                } else {
                    return "";
                }
            case "customer_email_id":
                if (!value || value.trim() === "") {
                    return "User e-mail is required.";
                } else if (!value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
                    return "Enter a valid email address.";
                }
                else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const openSheet = () => setSheetOpen(true);

    const closeSheet = () => {
        setSheetOpen(false);
        setCustomerDetails(initialState);
        setFormError(initialStateError);
    };

    const getAllCustomers = async () => {
        setIsLoading(true);
        const payload = {
            project_id: projectDetailsReducer.id,
            page: pageNo,
            limit: perPageLimit
        }
        const data = await apiService.getAllCustomers(payload);
        if (data.status === 200) {
            setCustomerList(data.data);
            setTotalRecord(data?.total);
            if (!data.data || data.data.length === 0) {
                emptyContent(true);
            } else {
                emptyContent(false);
            }
        } else {
            emptyContent(true);
        }
        setIsLoading(false)
    };

    const deleteCustomer =  (id) => {
        setDeleteId(id);
        setOpenDelete(true);
    };

    const handleDelete = async () =>{
        setIsLoadingDelete(true);
        const data = await apiService.deleteCustomers(deleteId);
        const clone = [...customerList];
        const indexToDelete = clone.findIndex((x)=> x.id == deleteId);
        if(data.status === 200) {
            clone.splice(indexToDelete,1);
            setCustomerList(clone);
            getAllCustomers();
            toast({
                description: data.message
            });
            setIsLoadingDelete(false);
        }
        else{
            toast({
                description:data.message,
                variant: "destructive",
            });
            setIsLoadingDelete(false);
        }
        setOpenDelete(false);
        setDeleteId(null);
    };

    const addCustomer = async () => {
        let validationErrors = {};
        Object.keys(customerDetails).forEach(name => {
            const error = formValidate(name, customerDetails[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setIsSave(true);
        const payload = {
            ...customerDetails,
            project_id: projectDetailsReducer.id,
            customer_first_seen: new Date(),
            customer_last_seen: new Date(),
        }
        const data = await apiService.createCustomers(payload)
        if(data.status === 200) {
            setIsSave(false);
            setCustomerDetails(initialState);
            toast({description: data.message,});
            const clone = [...customerList];
            clone.unshift(data.data);
            setCustomerList(clone);
        } else {
            setIsSave(false);
            toast({description:data.message, variant: "destructive",})
        }
        closeSheet();
    };

    const getUserActions = async () => {
        setIsLoading(true);
        const payload = {
            user_id: selectedCustomer?.id,
            type: selectedTab,
            page: pageNo,
            limit: perPageLimit
        }
        const data = await apiService.customersAction(payload);
        if(data.status === 200) {
            setUserActions(Array.isArray(data.data) ? data.data : []);
            toast({description: data.message,});
            setIsLoading(false)
        } else {
            toast({description:data.message, variant: "destructive",})
        }
    }

    useEffect(() => {
        if (selectedTab !== "details" && selectedCustomer?.id) {
            getUserActions();
        }
    }, [selectedTab, selectedCustomer?.id]);

    const totalPages = Math.ceil(totalRecord / perPageLimit);

    const handlePaginationClick = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setIsLoading(true);
            setPageNo(newPage);
            setIsLoading(false);
        }
    };

    const EmptyUserContent = [
        {
            title: "Start Adding Users",
            description: `Manually add user details to build your base, track interactions, and personalize engagement to foster loyalty.`,
            btnText: [
                {title: "Add User", redirect: "", icon: <Plus size={18} className={"mr-1"} strokeWidth={3}/>},
            ],
        },
        {
            title: "Create Ideas",
            description: `Encourage user engagement by capturing and sharing ideas that resonate with your audience, turning visitors into active users.`,
            btnText: [
                {title: "Create Ideas", redirect: "", icon: <Plus size={18} className={"mr-1"} strokeWidth={3}/>},
            ],
        },
        {
            title: "Create Roadmap",
            description: `Showcase your product’s journey with a roadmap, keeping users informed about upcoming features and updates to build trust and attract users.`,
            btnText: [
                {title: "Create Roadmap", redirect: "", icon: <Plus size={18} className={"mr-1"} strokeWidth={3}/>},
            ],
        },
        {
            title: "Create Announcement",
            description: `Share key updates, new features, and milestones through announcements to keep users engaged and excited about your product.`,
            btnText: [
                {title: "Create Announcement", redirect: "", icon: <Plus size={18} className={"mr-1"} strokeWidth={3}/>},
            ],
        },
        {
            title: "Create Widget",
            description: `Add a widget to your website to display ideas, roadmaps, or updates, making it easy for users to interact and connect with your product.`,
            btnText: [
                {title: "Create Widget", redirect: "", icon: <Plus size={18} className={"mr-1"} strokeWidth={3}/>},
            ],
        },
        {
            title: "Create Knowledge Base",
            description: `Offer valuable resources and answers to build confidence in your product and convert visitors into loyal users.`,
            btnText: [
                {title: "Create Knowledge Base", redirect: "", icon: <Plus size={18} className={"mr-1"} strokeWidth={3}/>},
            ],
        },
    ];

    const sourceTitle = [
        {title: "Created a Idea", value: "feature_ideas"},
        {title: "Commented on idea", value: "feature_idea_comments"},
        {title: "Upvoted on idea", value: "feature_idea_votes"},
        {title: "Feedback on post", value: "post_feedbacks"},
        {title: "Reaction on post", value: "post_reactions"},
    ]

    const tabs = [
        {
            label: "Details",
            value: 'details',
            icon: <Info size={18} className={"mr-2"} />,
            component: <Fragment>
                <div className={'divide-y'}>
                <div className={"flex justify-between items-center gap-2 px-2 py-[10px] md:px-3"}>
                    <div className={"text-sm flex gap-2 items-center"}><Mail size={16} className={"stroke-muted-foreground"} /> Email</div>
                    <h3 className={"text-sm"}>{selectedCustomer?.customer_name || "-"}</h3>
                </div>
                <div className={"flex justify-between items-center gap-2 px-2 py-[10px] md:px-3"}>
                    <div className={"text-sm flex gap-2 items-center"}><Clock size={16} className={"stroke-muted-foreground"} /> Last action</div>
                    <span className={"text-sm"}>
                        {selectedCustomer?.last_activity ? moment.utc(selectedCustomer?.last_activity).local().format("MMMM D, YYYY") : "-"}
                    </span>
                </div>
                    <div className={"flex justify-between items-center gap-2 px-2 py-[10px] md:px-3"}>
                        <div className={"text-sm flex gap-2 items-center"}><MapPin size={16} className={"stroke-muted-foreground"} /> Location</div>
                        <span className={"text-sm"}>{selectedCustomer?.customer_country || "-"}</span>
                    </div>
                </div>
            </Fragment>
        },
        {
            label: "Action", value: 1, icon: <Zap size={18} className={"mr-2"}/>,
            component: <UserActionsList userActions={userActions} sourceTitle={sourceTitle} isLoading={isLoading} />
        },
        { label: "Announcement feedback", value: 2, icon: <MessagesSquare size={18} className={"mr-2"} />,
            component: <UserActionsList userActions={userActions} sourceTitle={sourceTitle} isLoading={isLoading} />
        },
        { label: "Announcement reaction", value: 3, icon: <GalleryVerticalEnd size={18} className={"mr-2"} />,
            component: <UserActionsList userActions={userActions} sourceTitle={sourceTitle} isLoading={isLoading} />
        },
        { label: "Create idea", value: 4, icon: <Lightbulb size={18} className={"mr-2"} />,
            component: <UserActionsList userActions={userActions} sourceTitle={sourceTitle} isLoading={isLoading} />
        },
        { label: "Idea comment", value: 5, icon: <MessageSquare size={18} className={"mr-2"} />,
            component: <UserActionsList userActions={userActions} sourceTitle={sourceTitle} isLoading={isLoading} />
        },
        { label: "Idea upvote", value: 6, icon: <ChevronUp size={18} className={"mr-2"} />,
            component: <UserActionsList userActions={userActions} sourceTitle={sourceTitle} isLoading={isLoading} />
        },
    ];

    return (
        <Fragment>

            {isSheetOpen && <Sheet open={isSheetOpen} onOpenChange={isSheetOpen ? closeSheet : openSheet}>
                {/*<SheetOverlay className={"inset-0"}/>*/}
                <SheetContent className={"sm:max-w-[662px] p-0"}>
                    <SheetHeader className={"px-3 py-4 lg:px-8 lg:py-[20px] flex flex-row justify-between items-center border-b"}>
                        <h2 className={"text-sm md:text-xl font-normal"}>Add New User</h2>
                        <X onClick={closeSheet} size={18} className={"cursor-pointer m-0"}/>
                    </SheetHeader>
                    <div className={"sm:px-8 sm:py-6 px-3 py-4 border-b"}>
                        <div className="grid w-full gap-2">
                            <Label htmlFor="name" className={"font-normal"}>Name</Label>
                            <Input value={customerDetails.customer_name} name="customer_name" onChange={onChangeText} type="text" id="name" className={"h-9"} placeholder={"Enter the full name of user..."}/>
                            {formError.customer_name && <span className="text-sm text-red-500">{formError.customer_name}</span>}
                        </div>

                        <div className="grid w-full gap-2 mt-6">
                            <Label htmlFor="email" className={"font-normal"}>E-mail</Label>
                            <Input value={customerDetails.customer_email_id} name="customer_email_id" onChange={onChangeText} onBlur={onBlur} type="email" id="email" className={"h-9"} placeholder={"Enter the email of user"}/>
                            {formError.customer_email_id && <span className="text-sm text-red-500">{formError.customer_email_id}</span>}
                        </div>

                        <div className={"announce-create-switch mt-6 flex items-center"}>
                            <Switch className={"w-[38px] h-[20px]"} id={"switch"} checked={customerDetails.customer_email_notification == 1} onCheckedChange={(checked) => onChangeText({target: {name: "customer_email_notification", value:checked}})} htmlFor={"switch"} />
                            <Label htmlFor={"switch"} className={"ml-2.5 text-sm font-normal"}>Receive Notifications</Label>
                        </div>
                    </div>
                    <div className={"px-3 py-4 sm:p-8"}>
                        <Button onClick={addCustomer} className={`border w-[117px] font-medium hover:bg-primary`}>{isSave ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add User"}</Button>
                    </div>
                </SheetContent>
            </Sheet>}

            {isDetailsSheetOpen && (
                <Sheet open={isDetailsSheetOpen} onOpenChange={setDetailsSheetOpen}>
                    <SheetContent className={"sm:max-w-[1018px] p-0"}>
                        <SheetHeader className={"px-3 py-4 lg:px-8 lg:py-[20px] flex flex-row justify-between items-center border-b"}>
                            <h2 className={"text-sm md:text-xl font-normal"}>User Details</h2>
                            <X onClick={() => setDetailsSheetOpen(false)} size={18} className={"cursor-pointer m-0"} />
                        </SheetHeader>
                        <div className={"divide-y"}>
                            <div className={"px-2 py-[10px] md:px-3 flex justify-between gap-4"}>
                                <div className={"flex items-center gap-4"}>
                                    <Avatar className={"w-[50px] h-[50px]"}>
                                        <AvatarFallback className={"text-xl"}>{selectedCustomer?.customer_first_name && selectedCustomer?.customer_first_name.substring(0, 1).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className={"space-y-1"}>
                                        <div className={"flex items-center gap-4"}>
                                            <h1 className={"text-sm md:text-base"}>{selectedCustomer?.customer_first_name} {selectedCustomer?.customer_last_name}</h1>
                                            <Badge>Admin/Member</Badge>
                                        </div>
                                        {
                                            (selectedCustomer?.customer_country) ?
                                                <span className={"flex items-center gap-2 text-sm"}><MapPin size={16} className={"stroke-muted-foreground"} />{selectedCustomer?.customer_country}</span>
                                                : ""
                                        }
                                    </div>
                                </div>
                                <Button variant={"outline"} className={"gap-2"}><Settings size={18} />Manage Team Members</Button>
                            </div>
                            <Tabs defaultValue="details" onValueChange={(value) => setSelectedTab(value)}>
                                <div className={"border-b p-3"}>
                                    <TabsList className="justify-start w-full bg-background">
                                {(tabs || []).map((tab, i) => (
                                    <TabsTrigger
                                        key={i}
                                        value={tab.value}
                                        className={`text-sm font-medium team-tab-active team-tab-text-active dark:text-card-foreground`}
                                    >
                                        {tab.icon}{tab.label}
                                    </TabsTrigger>
                                ))}
                                    </TabsList>
                                </div>
                                {
                                    (tabs || []).map((y, i) => (
                                        <TabsContent key={i} value={y.value} className={"mt-0"}>
                                            <div className={"grid grid-cols-1 overflow-auto whitespace-nowrap"}>
                                                {y.component}
                                            </div>
                                        </TabsContent>
                                    ))
                                }
                            </Tabs>
                        </div>
                    </SheetContent>
                </Sheet>
            )}


            <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>
                {/*<NewCustomerSheet isOpen={isSheetOpen} onOpen={openSheet} callback={getAllCustomers} onClose={closeSheet}/>*/}

                {
                    openDelete &&
                    <DeleteDialog
                        title={"You really want to delete this Customer?"}
                        isOpen={openDelete}
                        onOpenChange={() => setOpenDelete(false)}
                        onDelete={handleDelete}
                        isDeleteLoading={isLoadingDelete}
                        deleteRecord={deleteId}
                    />
                }

                <div>
                    <div className={"flex flex-row gap-x-4 flex-wrap justify-between gap-y-2 items-center"}>
                        <div className={"flex flex-col gap-y-0.5"}>
                            <h1 className="text-2xl font-normal flex-initial w-auto">Users ({totalRecord})</h1>
                            <h5 className={"text-sm text-muted-foreground"}>View all users who have registered through your program link, as well as those you’ve added manually.</h5>
                        </div>
                        <Button onClick={openSheet} className={"gap-2 font-medium hover:bg-primary"}><Plus size={20} strokeWidth={3} /><span className={"text-xs md:text-sm font-medium"}>New User</span></Button>
                    </div>
                    <div className={"my-6"}>
                        <Card>
                            <CardContent className={"p-0"}>
                                <div className={"rounded-md grid grid-cols-1 overflow-auto whitespace-nowrap"}>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                {
                                                    ["Name", "Email", "Last Activity", "Comments", "Post", "Action"].map((x,i)=>{
                                                        return(
                                                            <TableHead className={`font-medium text-card-foreground px-2 py-[10px] md:px-3 ${i >= 2 ? "text-center" : ""} ${theme === "dark"? "" : "bg-muted"} `} key={x}>{x}</TableHead>
                                                        )
                                                    })
                                                }
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                        {
                                            isLoading ? (
                                                [...Array(10)].map((_, index) => {
                                                    return (
                                                        <TableRow key={index}>
                                                            {
                                                                [...Array(6)].map((_, i) => {
                                                                    return (
                                                                        <TableCell key={i} className={`px-2 py-[10px] md:px-3 ${i === 0 ? "w-[234px]" : ""} ${i === 1 ? "w-[361px]" : ""} ${i === 2 ? "w-[191px]" : ""} ${i === 3 ? "w-[168px]" : ""} ${i === 4 ? "w-[93px]" : ""} ${i === 5 ? "w-[119px]" : ""}`}>
                                                                            <Skeleton className={"rounded-md w-full h-8"}/>
                                                                        </TableCell>
                                                                    )
                                                                })
                                                            }
                                                        </TableRow>
                                                    )
                                                })
                                                )
                                                 : customerList.length > 0 ? <>
                                                    {
                                                        (customerList || []).map((x,index)=>{
                                                            return(
                                                                <TableRow key={index} className={"font-normal"}>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 cursor-pointer`} onClick={() => openUserDetails(x)}>{x.customer_name ? x.customer_name : "-"}</TableCell>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3`}>{x?.customer_email_id}</TableCell>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 text-center`}>{x?.last_activity ? moment(x?.last_activity).format('D MMM, YYYY') : "-"}</TableCell>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 text-center`}>{x?.comments ? x?.comments : "-"}</TableCell>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 text-center`}>{x?.posts ? x?.posts : "-"}</TableCell>
                                                                    <TableCell className={`px-2 py-[10px] md:px-3 text-center`}>
                                                                        <Button onClick={() => deleteCustomer(x.id,index)} variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px]`}>
                                                                            <Trash2 size={16}/>
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })
                                                    }
                                                    </> : <TableRow>
                                                    <TableCell colSpan={6}>
                                                        <EmptyData/>
                                                    </TableCell>
                                                </TableRow>
                                        }
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                            {
                                customerList.length > 0 ?
                                    <Pagination
                                        pageNo={pageNo}
                                        totalPages={totalPages}
                                        isLoading={isLoading}
                                        handlePaginationClick={handlePaginationClick}
                                        stateLength={customerList.length}
                                    /> : ""
                            }
                        </Card>
                    </div>
                    {
                        (isLoading || !emptyContentBlock) ? "" :
                            <EmptyDataContent data={EmptyUserContent} onClose={() => emptyContent(false)}/>
                    }
                </div>
            </div>
        </Fragment>
    );
}

export default Users;