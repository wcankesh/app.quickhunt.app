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

                        <Card className={"my-6 mx-4 rounded-md px-4 pt-6 pb-16"}>
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
                                    {renderContent(messageType)}
                                </Card>
                            </Card>
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