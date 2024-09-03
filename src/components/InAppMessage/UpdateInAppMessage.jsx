import React, {useEffect, useState, Fragment} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {SheetContent, SheetHeader, Sheet, SheetTitle} from "../ui/sheet";
import {Button} from "../ui/button";
import {DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,} from "../ui/dropdown-menu";
import {ArrowLeft, ArrowRight, BookCheck, CalendarIcon, Check, ClipboardList, Clock, GripVertical, Loader2, MessageCircleMore, Paperclip, Pencil, Plus, RotateCcw, ScrollText, Smile, SquareMousePointer, Trash2, X} from "lucide-react";
import {useTheme} from "../theme-provider";
import {baseUrl} from "../../utils/constent";
import {Card, CardContent, CardHeader} from "../ui/card";
import {Accordion,AccordionContent, AccordionItem, AccordionTrigger} from "../ui/accordion";
import {Label} from "../ui/label";
import {Select, SelectGroup, SelectValue} from "@radix-ui/react-select";
import {SelectContent, SelectItem, SelectTrigger} from "../ui/select";
import {useSelector} from "react-redux";
import ColorInput from "../Comman/ColorPicker";
import {Input} from "../ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {cn} from "../../lib/utils";
import {addDays, format} from "date-fns";
import {Calendar} from "../ui/calendar";
import {Switch} from "../ui/switch";
import {Progress} from "../ui/progress";
import {Checkbox} from "../ui/checkbox";
import RatingStar from "../Comman/Star";
import moment from "moment";
import {ApiService} from "../../utils/ApiService";
import {useToast} from "../ui/use-toast";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import Post from "./Post";
import Banners from "./Banners";
import Surveys from "./Surveys";
import Checklist from "./Checklist";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "../ui/breadcrumb";
import SidebarInAppMessage from "./SidebarInAppMessage";


const contentType = [
    {
        label: "Post",
        value: 1,
        icon:<ScrollText size={16}/>,
    },
    {
        label: "Banners",
        value: 2,
        icon:<ClipboardList size={16}/>,

    },
    {
        label: "Surveys",
        value: 3,
        icon:<BookCheck size={16}/>,
    },
    {
        label: "Checklist",
        value: 4,
        icon:<SquareMousePointer size={16}/>,
    }
];

const initialState = {
    project_id: "2",
    title: "In app message",
    type: 1, //1=post,2=banner,3=survey,4=checklist
    body_text: "",
    from: "",
    reply_to: "",
    bg_color: "#ffffff",
    text_color: "#000000",
    icon_color: "#FD6B65",
    btn_color: "#7c3aed",
    delay: 1, //time in seconds
    start_at: moment().toISOString(),
    end_at: moment().add(1, 'hour').toISOString(),
    position: "top", //top/bottom
    alignment: "left", //left/right
    is_close_button: "", //true/false
    reply_type: "", //1=Text,2=Reaction
    question_type: 1, //1=Net Promoter Score,2=Numeric Scale,3=Star rating scale,4=Emoji rating scale,5=Drop Down / List,6=Questions
    start_number: 1,
    end_number: 10,
    start_label: "",
    end_label: "",
    placeholder_text: "",
    options: [''],
    show_sender: "", //boolean
    action_type: 1, //1=Open URL,2=Ask for Reaction,3=Collect visitor email
    action_text: "",
    action_url: "",
    is_redirect: "", //boolean
    is_banner_close_button: "", //boolean
    banner_style: "", //1=Inline,2=Floating,3=Top,4=Bottom
    reaction: "",
}

const emoji = [
    {
        url:"https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f620.png",
        id:1
    },
    {
        url:"https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/2639-fe0f.png",
        id:2
    },
    {
        url:"https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f611.png",
        id:3
    },
    {
        url:"https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f604.png",
        id:4
    },
    {
        url:"https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f929.png",
        id:5
    },
];


const UpdateInAppMessage = ({ isOpen, onOpen, onClose,}) => {
    const navigate = useNavigate();
    let apiSerVice = new ApiService();
    const {toast} = useToast()
    const {id, type} = useParams()
    const {theme} = useTheme();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);

    const [messageType, setMessageType] = useState(Number(type) || 1);

    const [inAppMsgSetting, setInAppMsgSetting] = useState(initialState);
    const [editMessageName, setEditMessageName] = useState(false);
    const [openItem,setOpenItem]=useState("");
    const [starRating, setStarRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const renderContent = (type) => {
        switch (type) {
            case 1:
                return <Post/>;
            case 2:
                return <Banners />;
            case 3:
                return <Surveys />;
            case 4:
                return <Checklist />;
            default:
                return null;
        }
    };

    const handleClick = (value) => {
        setStarRating(value);
    };

    const handleMouseEnter = (value) => {
        setHoverRating(value);
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    useEffect(() => {
        setTimeout(() => {
            document.body.style.pointerEvents = 'auto';
        }, 500)
    },[]);

    useEffect(() => {
        if (id === "new" && projectDetailsReducer.id) {
            if (allStatusAndTypes.members.length > 0) {
                setInAppMsgSetting(prevState => ({
                    ...prevState,
                    from: allStatusAndTypes.members[0].id
                }));
            }
        }
    }, [allStatusAndTypes.members])

    useEffect(() => {
        if (id !== "new" && projectDetailsReducer.id) {
            getSingleInAppMessages();
        }
    }, [projectDetailsReducer.id]);

    const getSingleInAppMessages = async () => {
        const data = await apiSerVice.getSingleInAppMessage(id)
        if (data.status === 200) {
            const payload = {
                ...data.data,
                options: data.data.options ?? ['']
            }
            setInAppMsgSetting(payload);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    return (
        // <div className={"xl:container-2 xl:w-[1100px] container overflow-y-auto"}>
        <Fragment>
            <div className={"py-6 px-4 border-b flex items-center justify-between"}>
                <Breadcrumb>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className={"cursor-pointer"}>
                                <BreadcrumbLink>
                                    <span onClick={id === 'new' ? () => navigate(`${baseUrl}/in-app-message/type`) : () => navigate(`${baseUrl}/in-app-message`)}>
                                    {type === '1' && 'Post'}
                                        {type === '2' && 'Banners'}
                                        {type === '3' && 'Surveys'}
                                        {type === '4' && 'Checklist'}
                                    </span>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem className={"cursor-pointer"}>
                                <BreadcrumbPage>{inAppMsgSetting.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </Breadcrumb>
            </div>
            <div className={"flex h-[calc(100%_-_69px)] overflow-y-auto"}>
                <div className={"max-w-[407px] w-full border-r h-full overflow-y-auto"}>
                    <SidebarInAppMessage id={id} messageType={messageType} inAppMsgSetting={inAppMsgSetting} setInAppMsgSetting={setInAppMsgSetting}/>
                </div>
                <div className={"bg-muted w-full h-full overflow-y-auto"}>

                        {messageType == 3 ? <div className={"my-6 flex flex-col gap-8"}>
                                <Card>
                                    <div className={"border-b"}>
                                        <div className={"flex justify-between px-6 py-3"}>
                                            <div className={"flex gap-4 items-center"}>
                                                <GripVertical size={20} className={`${theme === "dark" ? "" : "text-muted-foreground"}`} />
                                                <h5 className={"text-base font-medium leading-5"}>Step-1</h5>
                                            </div>
                                            <Trash2 size={16} />
                                        </div>
                                    </div>

                                    <div className={"pt-8 px-4 pb-10"}>
                                        <Card className={"rounded-md border-b "}>
                                            <div className={"p-4 flex gap-2 border-b"}>
                                                <div className={"w-3 h-3 rounded-full border border-inherit"}/>
                                                <div className={"w-3 h-3 rounded-full border border-inherit"}/>
                                                <div className={"w-3 h-3 rounded-full border border-inherit"}/>
                                            </div>
                                            <div className={"p-2"}>
                                                <div className="flex items-center space-x-3">
                                                    <ArrowLeft className={`${theme === "dark" ? "" : "text-[#CBD5E1]"}`}/>
                                                    <ArrowRight className={`${theme === "dark" ? "" : "text-[#CBD5E1]"}`}/>
                                                    <RotateCcw className={`${theme === "dark" ? "" : "text-[#CBD5E1]"}`}/>
                                                    <div className="flex-grow border border-inherit h-8 rounded-2xl"/>
                                                    <div className={"h-7 w-7 rounded-full border border-inherit"}/>
                                                </div>
                                            </div>
                                            <div className={`py-16 flex justify-center  ${theme === "dark" ? "" : "bg-[#222222]"}`}>
                                                <div className={`${theme == "dark" ? "bg-primary/15" : "bg-[#EEE4FF]"}  w-[498px] px-4 pb-4 rounded-[10px]`}>
                                                    <div className={"flex justify-end"}><X className={"my-2"} size={12}/></div>
                                                    <div className={` rounded-[10px] ${theme == "dark" ? "bg-[#020817]" : "bg-[#fff]"}`}>
                                                        {inAppMsgSetting.question_type == 5 ?
                                                            <div className={"px-4 pb-4 pt-6"}>
                                                                <Card className={"py-2 px-4 pb-6 relative"}>
                                                                    <Button variant={"outline"} className={`absolute right-[-12px] top-[40%] p-0 h-6 w-6 ${theme == "dark" ? "" : "text-muted-foregrounds"}`}>
                                                                        <Trash2 size={12} className={""}/>
                                                                    </Button>
                                                                    <h5 className={"text-sm font-normal"}>Ask question here?</h5>
                                                                    <div className="mt-3">
                                                                        <ul className={"space-y-3"}>
                                                                            {inAppMsgSetting.options.map((option, index) => (
                                                                                <li key={index}>
                                                                                    <Input value={option || "Select one"}/>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                </Card>
                                                                <div className={"pl-4 py-4"}>
                                                                    <Button variant={"outline"} className={"h-8"} onClick={addOption}>Add question</Button>
                                                                    <br/>
                                                                    <Button className={"h-8 mt-6"}>Submit</Button>
                                                                </div>
                                                            </div>
                                                            : inAppMsgSetting.question_type == 1 ?
                                                                <div className={"px-4 pb-4 pt-6 "}>
                                                                    <Card className={"py-2 px-4 relative"}>
                                                                        <Button variant={"outline"} className={`absolute right-[-12px] top-[40%] p-0 h-6 w-6 ${theme == "dark" ? "" : "text-muted-foregrounds"}`}>
                                                                            <Trash2 size={12} className={""}/>
                                                                        </Button>
                                                                        <h5 className={"text-sm font-normal"}>How satisfied are you with our product?</h5>
                                                                        {/*<div className={"flex gap-3 px-[30px] pt-[18px]"}>*/}
                                                                        {/*    {numbers.map(num => (*/}
                                                                        {/*        <Button key={num} variant={"outline"} className={"w-5 h-5 text-xs p-0"}>{num}</Button>*/}
                                                                        {/*    ))}*/}
                                                                        {/*</div>*/}
                                                                        <div className={"flex justify-between mt-[18px]"}>
                                                                            <h5 className={"text-xs font-normal"}>{inAppMsgSetting?.start_number} - very bad</h5>
                                                                            <h5 className={"text-xs font-normal"}>{inAppMsgSetting?.end_number} - very good</h5>
                                                                        </div>
                                                                    </Card>
                                                                    <div className={"pl-4 py-4"}>
                                                                        <Button variant={"outline"} className={"h-8"}>Add question</Button>
                                                                        <br/>
                                                                        <Button className={"h-8 mt-6"}>Submit</Button>
                                                                    </div>
                                                                </div>
                                                                : inAppMsgSetting.question_type == 2 ?
                                                                    <div className={"px-4 pb-4 pt-6 "}>
                                                                        <Card className={"py-2 px-4 relative"}>
                                                                            <Button variant={"outline"} className={`absolute right-[-12px] top-[40%] p-0 h-6 w-6 ${theme == "dark" ? "" : "text-muted-foregrounds"}`}>
                                                                                <Trash2 size={12} className={""}/>
                                                                            </Button>
                                                                            <h5 className={"text-sm font-normal"}>How satisfied are you with our product?</h5>
                                                                            <div className={"flex justify-center gap-3 px-[30px] pt-[18px]"}>
                                                                                {numbers.map(num => (
                                                                                    <Button key={num} variant={"outline"} className={"w-5 h-5 text-xs p-0"}>{num}</Button>
                                                                                ))}
                                                                            </div>
                                                                            <div className={"flex justify-between mt-[18px]"}>
                                                                                <h5 className={"text-xs font-normal"}>{inAppMsgSetting?.start_number} - very bad</h5>
                                                                                <h5 className={"text-xs font-normal"}>{inAppMsgSetting?.end_number} - very good</h5>
                                                                            </div>
                                                                        </Card>
                                                                        <div className={"pl-4 py-4"}>
                                                                            <Button variant={"outline"} className={"h-8"}>Add question</Button>
                                                                            <br/>
                                                                            <Button className={"h-8 mt-6"}>Submit</Button>
                                                                        </div>
                                                                    </div>
                                                                    : inAppMsgSetting.question_type == 3 ?
                                                                        <div className={"px-4 pb-4 pt-6"}>
                                                                            <Card className={"py-2 px-4 relative"}>
                                                                                <Button variant={"outline"} className={`absolute right-[-12px] top-[40%] p-0 h-6 w-6 ${theme == "dark" ? "" : "text-muted-foregrounds"}`}>
                                                                                    <Trash2 size={12} className={""}/>
                                                                                </Button>
                                                                                <h5 className={"text-sm font-normal"}>How satisfied are you with our product?</h5>
                                                                                <div className={"flex gap-4 mt-4 justify-center"}>
                                                                                    {Array.from({ length: 5 }, (_, index) => (
                                                                                        <RatingStar
                                                                                            key={index}
                                                                                            filled={index < (hoverRating || starRating)}
                                                                                            onClick={() => handleClick(index + 1)}
                                                                                            onMouseEnter={() => handleMouseEnter(index + 1)}
                                                                                            onMouseLeave={handleMouseLeave}
                                                                                        />
                                                                                    ))}
                                                                                </div>

                                                                                <div className={"flex justify-between mt-[18px]"}>
                                                                                    <h5 className={"text-xs font-normal"}>{inAppMsgSetting?.start_number} - very bad</h5>
                                                                                    <h5 className={"text-xs font-normal"}>{inAppMsgSetting?.end_number} - very good</h5>
                                                                                </div>
                                                                            </Card>
                                                                            <div className={"pl-4 py-4"}>
                                                                                <Button variant={"outline"} className={"h-8"}>Add question</Button>
                                                                                <br/>
                                                                                <Button className={"h-8 mt-6"}>Submit</Button>
                                                                            </div>
                                                                        </div>
                                                                        : inAppMsgSetting.question_type == 4 ?
                                                                            <div className={"px-4 pb-4 pt-6"}>
                                                                                <Card className={"py-2 px-4 relative"}>
                                                                                    <Button variant={"outline"} className={`absolute right-[-12px] top-[40%] p-0 h-6 w-6 ${theme == "dark" ? "" : "text-muted-foregrounds"}`}>
                                                                                        <Trash2 size={12} className={""}/>
                                                                                    </Button>
                                                                                    <h5 className={"text-sm font-normal"}>How satisfied are you with our product?</h5>
                                                                                    <div className={"flex justify-center gap-6 mt-6 mb-6"}>
                                                                                        {
                                                                                            (allStatusAndTypes?.emoji || []).map((x,i)=>{
                                                                                                return(
                                                                                                    <img key={i} className={"h-8 w-8"} src={x?.emoji_url}/>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </div>
                                                                                </Card>
                                                                                <div className={"pl-4 py-4"}>
                                                                                    <Button variant={"outline"} className={"h-8"}>Add question</Button>
                                                                                    <br/>
                                                                                    <Button className={"h-8 mt-6"}>Submit</Button>
                                                                                </div>
                                                                            </div>
                                                                            : inAppMsgSetting.question_type == 5 ?
                                                                                <div className={"px-4 pb-4 pt-6"}>
                                                                                    <Card className={"py-2 px-4 pb-6 relative"}>
                                                                                        <Button variant={"outline"} className={`absolute right-[-12px] top-[40%] p-0 h-6 w-6 ${theme == "dark" ? "" : "text-muted-foregrounds"}`}>
                                                                                            <Trash2 size={12} className={""}/>
                                                                                        </Button>
                                                                                        <h5 className={"text-sm font-normal"}>Ask question here?</h5>
                                                                                    </Card>
                                                                                    <div className={"pl-4 py-4"}>
                                                                                        <Button variant={"outline"} className={"h-8"}>Add question</Button>
                                                                                        <br/>
                                                                                        <Button className={"h-8 mt-6"}>Submit</Button>
                                                                                    </div>
                                                                                </div> : ""}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </Card>
                            </div>

                            : <Card className={"my-6 mx-4 rounded-md px-4 pt-6 pb-16"}>
                                <Card className={"rounded-md border-b"}>
                                    <div className={"p-4 flex gap-2 border-b"}>
                                        <div className={"w-3 h-3 rounded-full border border-inherit"}/>
                                        <div className={"w-3 h-3 rounded-full border border-inherit"}/>
                                        <div className={"w-3 h-3 rounded-full border border-inherit"}/>
                                    </div>
                                    <div className={"p-2"}>
                                        <div className="flex items-center space-x-3">
                                            <ArrowLeft className={`${theme === "dark" ? "" : "text-[#CBD5E1]"}`}/>
                                            <ArrowRight className={`${theme === "dark" ? "" : "text-[#CBD5E1]"}`}/>
                                            <RotateCcw className={`${theme === "dark" ? "" : "text-[#CBD5E1]"}`}/>

                                            <div className="flex-grow border border-inherit h-8 rounded-2xl"/>
                                            <div className={"h-7 w-7 rounded-full border border-inherit"}/>
                                        </div>
                                    </div>
                                    {messageType == 1 && <div className={`p-16 ${theme == "dark" ? "" : "bg-[#222222]"}`}>
                                        <Card className={`rounded-[10px] p-0`} style={{background: inAppMsgSetting.bg_color}}>
                                            <CardHeader className={"flex px-4 pt-4 pb-0 flex-row justify-end"}>
                                                <Button className={`h-4 w-4 p-0 ${theme === "dark" ? "" : "text-muted-foreground"}`}
                                                        variant={"ghost hover:none"}><X size={16} stroke={inAppMsgSetting?.btn_color} className={"h-5 w-5"}/></Button>
                                            </CardHeader>
                                            <CardHeader className={"pt-0"}>
                                                <div className={"pt-0 flex flex-row items-center gap-2"}>
                                                    <Avatar className={"w-[20px] h-[20px]"}>
                                                        {
                                                            userDetailsReducer?.user_photo ?
                                                                <AvatarImage src={userDetailsReducer?.user_photo}
                                                                             alt="@shadcn"/>
                                                                :
                                                                <AvatarFallback>{userDetailsReducer && userDetailsReducer?.name && userDetailsReducer?.name.substring(0, 1)}</AvatarFallback>
                                                        }
                                                    </Avatar>
                                                    <div className={""}>
                                                        <div className={"flex flex-row gap-1"}>
                                                            <h5 className={"text-xs leading-5 font-medium"} style={{color: inAppMsgSetting.text_color}}>{userDetailsReducer?.user_first_name} {userDetailsReducer?.user_last_name}</h5>
                                                            <h5 className={`text-xs leading-5 font-medium ${theme === "dark" ? "" : "text-muted-foreground"}`} style={{color: inAppMsgSetting.text_color}}>{userDetailsReducer?.user_email_id}</h5>
                                                        </div>
                                                        <h5 className={`text-xs leading-5 font-medium ${theme === "dark" ? "" : "text-muted-foreground"}`}>Active</h5>
                                                    </div>
                                                </div>
                                                <div className={"pl-16 pt-6 m-0"}>
                                                    <p className={"text-xs font-medium"}>
                                                        Hi First name , Start Writing from here....
                                                    </p>
                                                </div>
                                            </CardHeader>
                                            <CardContent className={`py-5 pl-8 pr-5 ${theme == "dark" ? "bg-primary/15" : "bg-[#EEE4FF]"}  rounded-b-lg flex flex-row justify-between`}>
                                                <div className={""}>
                                                    <div className={"flex flex-row gap-3 items-center text-xs"}>
                                                        <MessageCircleMore size={20} stroke={inAppMsgSetting?.icon_color} />
                                                        <h5 className={"text-[#7C3AED] font-medium"}>Write a reply...</h5>
                                                    </div>
                                                </div>
                                                <div className={"flex gap-3 items-center"}>
                                                    <Smile size={20} stroke={inAppMsgSetting?.icon_color}/>
                                                    <Paperclip size={20} stroke={inAppMsgSetting?.icon_color}/>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>}
                                    {
                                        messageType == 2 && <div>
                                            <div
                                                className={`flex flex-row items-center justify-between px-6 py-[26px] ${theme == "dark" ? "bg-primary/15" : "bg-[#EEE4FF]"}`}>
                                                <p className={"text-xs font-muted-foreground"}>Start your message from here.....</p>
                                                <X size={12} stroke={inAppMsgSetting?.btn_color}/>
                                            </div>
                                            <div className={`w-full h-[113px]  rounded-b-lg ${theme == "dark" ? "" : "bg-[#222222]"}`}/>
                                        </div>
                                    }
                                    {
                                        messageType == 4 && <div className={`py-16 ${theme == "dark" ? "" : "bg-[#222222]"}`}>
                                            <div className={"flex justify-center"}>
                                                <div className={`${theme == "dark" ? "bg-primary/15" : "bg-[#EEE4FF]"}  min-w-[408px] rounded-[10px] pt-4 pb-6`}>
                                                    <div className={"flex justify-between items-center px-4"}>
                                                        <ArrowLeft size={16}/>
                                                        <h5 className={`text-xl font-medium underline decoration-dashed underline-offset-4 ${theme == "dark" ? "" : "text-muted-foreground"}`}>Untitled</h5>
                                                        <div/>
                                                    </div>
                                                    <h5 className={`mt-3 text-sm text-center font-normal ${theme == "dark" ? "" : "text-muted-foreground"}`}>Enter
                                                        Description (Optional)</h5>
                                                    <div className={"px-6 pt-8"}>
                                                        <div className={"flex justify-between"}>
                                                            <h5 className={"text-xs font-normal"}>20%</h5>
                                                            <h5 className={"text-xs font-normal"}>1 of 5 step</h5>
                                                        </div>
                                                        <Progress value={20} className="w-full mt-[6px] mb-3 h-2"/>
                                                        <Card className={"rounded-[10px] gap-2 px-4 pb-6 pt-4"}>
                                                            <Accordion type="single" collapsible
                                                                       className="w-full p-1 flex flex-col gap-2" value={openItem}
                                                                       onValueChange={(value) => setOpenItem(value)}>
                                                                {
                                                                    [1, 2, 3, 4, 5].map((x) => {
                                                                        return (
                                                                            <AccordionItem key={x}
                                                                                           className={`my-1 px-4 border rounded-md ${x == openItem ? "border border-solid border-[#7C3AED]" : ""}`}
                                                                                           value={x}>
                                                                                <AccordionTrigger className={" "}>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <Checkbox id="terms"
                                                                                                  disabled={x == openItem ? false : true}
                                                                                                  className={"w-6 h-6"}/>
                                                                                        <label
                                                                                            htmlFor="terms"
                                                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                                        >
                                                                                            Step ({x})
                                                                                        </label>
                                                                                    </div>
                                                                                </AccordionTrigger>
                                                                                <AccordionContent>
                                                                                    <div className={"ml-8"}>
                                                                                        <h5 className={`${theme == "dark" ? "" : "text-muted-foreground"}`}>Enter
                                                                                            Description</h5>
                                                                                        <Button className={"my-8"}>Add Button
                                                                                            name</Button>
                                                                                    </div>
                                                                                    <h5 className={`text-[10px] ${theme == "dark" ? "" : "text-muted-foreground"}`}>*Complete
                                                                                        Step by clicking Checkbox </h5>
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        )
                                                                    })
                                                                }
                                                            </Accordion>
                                                        </Card>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </Card>
                            </Card>}
                        {messageType === 3 || messageType === 4 ? (
                            <div className={"flex justify-center"}>
                                <Button className={"flex gap-[6px] font-semibold"}>
                                    <Plus size={16} strokeWidth={3}/>
                                    Add Steps
                                </Button>
                            </div>
                        ) : null}


                </div>
            </div>
        </Fragment>
    );
};

export default UpdateInAppMessage;