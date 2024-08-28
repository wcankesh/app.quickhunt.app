import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {SheetContent, SheetHeader, Sheet, SheetTitle} from "../ui/sheet";
import {Button} from "../ui/button";
import {
    ArrowLeft,
    ArrowRight,
    BookCheck,
    CalendarIcon,
    ClipboardList,
    Clock, GripVertical, Loader2, MessageCircleMore, Paperclip, Plus, RotateCcw,
    ScrollText, Smile,
    SquareMousePointer, Trash2,
    X
} from "lucide-react";
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
import {RadioGroup, RadioGroupItem} from "../ui/radio-group";
import {Switch} from "../ui/switch";
import {Progress} from "../ui/progress";
import {Checkbox} from "../ui/checkbox";
import RatingStar from "../Comman/Star";
import moment from "moment";
import {ApiService} from "../../utils/ApiService";


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

const delay = [
    {
        label:"sec 1",
        value:1
    },
    {
        label:"sec 2",
        value:2
    },
    {
        label:"sec 3",
        value:3
    },
    {
        label:"sec 4",
        value:4
    },
    {
        label:"sec 5",
        value:5
    },
]

const bannerPosition = [
    {
        label:"Top",
        value:1
    },
    {
        label:"Bottom",
        value:2
    }
]

const bannerAlignment = [
    {
        label:"Left",
        value:1
    },
    {
        label:"Right",
        value:2
    }
]

const initialState = {
    title:"",
    type:"",
    from:"",
    reply_to:"",
    bg_color:"#ffffff",
    text_color:"#000000",
    icon_color:"#B58FF6",
    btn_color:"",
    delay:"",
    start_at:moment(new Date()),
    end_at:undefined,
    position:"",
    alignment:"",
    is_close_button:"",
    question_type:"",
    start_number:"",
    end_number: "",
    start_label:"",
    end_label:"",
    placeholder_text: "",
    options:[],

    // send_more:2,
    // banner_alignment:1,
    // action:"",
    // dismiss_btn:0,
    // btn_color_picker:"#7C3AED",
    // link_step_action:"None (read only)",
    // link_step_url:"",
    // starRating:0,
    // post_description:"",
    // start_sending_at: moment(new Date()),
    // stop_sending_at:"",
}

const questionType = [
    {
        label:"Net Promoter Score",
        value:0
    },
    {
        label:"Numeric Scale",
        value:1
    },
    {
        label:"Star rating scale",
        value:2
    },
    {
        label:"Emoji rating scale",
        value:3
    },
    {
        label:"Drop Down / List",
        value:4
    },
    {
        label:"Questions",
        value:5
    },
];

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
    const [messageType,setMessageType]=useState(1);
    const [date, setDate] = useState([new Date(),addDays(new Date(), 4)]);
    const navigate = useNavigate();
    const {theme} = useTheme();
    const [from,setFrom] =useState([]);
    const [inAppMsgSetting, setInAppMsgSetting] = useState(initialState);
    const [openItem,setOpenItem]=useState("");
    const [starRating, setStarRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSave,setIsSave] = useState(false);
    const projectDetail = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const apiService = new ApiService();

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

    useEffect(()=>{
        setFrom(allStatusAndTypes.members);
    },[]);

    const handleStatusChange = (value,name) => {
        if(name == "from" || name == "where_to_send" || name == "delay" || name == "position") {
            setInAppMsgSetting({...inAppMsgSetting,[name]:value});
        }else if (name == "dismiss_btn"){
            setInAppMsgSetting({...inAppMsgSetting,[name]:value == true ? 1 : 0});
        }
        else{
            setInAppMsgSetting({...inAppMsgSetting,[name]:value});
        }
    }

    const onChange = (e) => {
        setInAppMsgSetting({...inAppMsgSetting,[e.target.name] : e.target.value});
    }

    const onDateChange = (name, date) => {
        setInAppMsgSetting({...inAppMsgSetting,[name]:date});
    };

    const saveChanges = async () => {
        setIsSave(true);
        const payload ={
            ...inAppMsgSetting,
            type:messageType,
            project_id:projectDetail?.id,
            start_at: inAppMsgSetting.start_at ? moment(inAppMsgSetting.start_at).format('YYYY-MM-DD') : moment(new Date()),
            end_at: inAppMsgSetting.end_at ? moment(inAppMsgSetting.end_at).format('YYYY-MM-DD') : undefined,
        }
        console.log(payload);
        const data = await apiService.createInAppMessage(payload);
        if (data.status === 200) {
            setIsSave(false);
        }else {

        }

    }


    const renderSideBarItem = () => {
        return(
            <div>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className={"widget-accordion"}>
                        <AccordionTrigger className={`hover:no-underline font-medium border-b px-4 py-3`}>Content</AccordionTrigger>
                        <AccordionContent className={"px-4 py-3 space-y-4 overflow-visible"}>
                            <div className={"flex flex-col gap-y-6"}>
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="title">Title</Label>
                                    <Input className={"h-9"} type="email" id="title" placeholder="Title" value={inAppMsgSetting.title} name={"title"} onChange={onChange} />
                                </div>

                                {
                                    messageType == 2 && <div className={"space-y-4"}>
                                                            <div className={"space-y-1"}>
                                                                <Label className={"font-normal"}>Banner position</Label>
                                                                <Select value={inAppMsgSetting.position} name={"position"} onValueChange={(value)=>handleStatusChange(value,"position")}>
                                                                    <SelectTrigger className="w-full h-9">
                                                                        <SelectValue placeholder="Banner Position" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectGroup>
                                                                            {
                                                                                (bannerPosition || []).map((x)=>{
                                                                                    return(
                                                                                        <SelectItem key={x.value} value={x.value}>{x.label}</SelectItem>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className={"space-y-1"}>
                                                                <Label className={"font-normal"}>Alignment</Label>
                                                                <Select value={inAppMsgSetting.banner_alignment} name={"banner_alignment"} onValueChange={(value)=>handleStatusChange(value,"banner_alignment")}>
                                                                    <SelectTrigger className="w-full h-9">
                                                                        <SelectValue placeholder="Banner Position" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectGroup>
                                                                            {
                                                                                (bannerAlignment || []).map((x)=>{
                                                                                    return(
                                                                                        <SelectItem key={x.value} value={x.value}>{x.label}</SelectItem>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                }

                                {messageType == 1 && <div className={"space-y-1"}>
                                    <Label className={"font-normal"}>From</Label>
                                    <Select value={inAppMsgSetting.from} name={"from"}
                                            onValueChange={(value) => handleStatusChange(value, "from")}>
                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue placeholder="Testingapp"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {
                                                    (from || []).map((x) => {
                                                        return (
                                                            <SelectItem key={x.id}
                                                                        value={x.id}>{x.user_first_name} {x.user_last_name}</SelectItem>
                                                        )
                                                    })
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>}
                                {messageType == 1 && <div className={"space-y-1"}>
                                    <Label className={"font-normal"}>Reply type</Label>
                                    <Select value={inAppMsgSetting.from} name={"from"}
                                            onValueChange={(value) => handleStatusChange(value, "from")}>
                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue placeholder="Testingapp"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {
                                                    (from || []).map((x) => {
                                                        return (
                                                            <SelectItem key={x.id}
                                                                        value={x.id}>{x.user_first_name} {x.user_last_name}</SelectItem>
                                                        )
                                                    })
                                                }

                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>}
                                <div>
                                    {(messageType == 2 || messageType == 1) && <h5 className={"text-base font-medium mb-2"}>Style</h5>}
                                    {(messageType == 3 || messageType == 4) && <h5 className={"text-base font-medium mb-2"}>Customization</h5>}

                                    <div className={"flex flex-col gap-4"}>
                                        <div className="grid w-full max-w-sm items-center gap-2">
                                            <Label className={"font-normal"} htmlFor="email">Background Color</Label>
                                            <div className={"w-full text-sm"}>
                                                <ColorInput style={{width:'100%',height:"36px"}} value={inAppMsgSetting.bg_color}
                                                            onChange={(color) => setInAppMsgSetting((prevState) => ({
                                                                ...prevState,
                                                                bg_color: color.bg_color
                                                            }))} name={"bg_color"}  />
                                            </div>
                                        </div>

                                        {
                                            (messageType == 3 || messageType == 4) &&  <div className="grid w-full max-w-sm items-center gap-2">
                                                                    <Label className={"font-normal"}>Button Color</Label>
                                                                    <div className={"w-full text-sm"}>
                                                                        <ColorInput style={{width:'100%',height:"36px"}} value={inAppMsgSetting.btn_color_picker}
                                                                                    onChange={(color) => setInAppMsgSetting((prevState) => ({
                                                                                        ...prevState,
                                                                                        btn_color_picker: color.btn_color_picker
                                                                                    }))} name={"btn_color_picker"}  />
                                                                    </div>
                                                                </div>
                                        }

                                        { (messageType == 1 || messageType == 2) &&<div className="grid w-full max-w-sm items-center gap-2">
                                            <Label className={"font-normal"} htmlFor="email">Text Color</Label>
                                            <div className={"w-full text-sm"}>
                                                <ColorInput style={{width: '100%', height: "36px"}}
                                                            value={inAppMsgSetting.text_color}
                                                            onChange={(color) => setInAppMsgSetting((prevState) => ({
                                                                ...prevState,
                                                                text_color: color.text_color
                                                            }))} name={"text_color"}/>
                                            </div>
                                        </div>}

                                        { messageType == 1 && <div className="grid w-full max-w-sm items-center gap-2">
                                            <Label className={"font-normal "} htmlFor="email">Icon Color </Label>
                                            <div className={"w-full text-sm widget-color-picker space-y-2"}>
                                                <ColorInput style={{width: '100%', height: "36px"}}
                                                            value={inAppMsgSetting.icon_color}
                                                            onChange={(color) => setInAppMsgSetting((prevState) => ({
                                                                ...prevState,
                                                                icon_color: color.icon_color
                                                            }))} name={"icon_color"}/>
                                            </div>
                                        </div>}

                                        {(messageType == 1 || messageType == 2) && <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label className={"font-normal"} htmlFor="btn_color">Button Color</Label>
                                            <div className={"w-full text-sm widget-color-picker space-y-2"}>
                                                <ColorInput style={{width:'100%',height:"36px"}} value={inAppMsgSetting.btn_color}
                                                            onChange={(color) => setInAppMsgSetting((prevState) => ({
                                                                ...prevState,
                                                                btn_color: color.btn_color
                                                            }))} name={"btn_color"}  />
                                            </div>
                                        </div>}

                                        {
                                            messageType == 2 &&
                                                <div className={"space-y-1"}>
                                                    <Label className={"font-normal"}>Action</Label>
                                                    <Select value={inAppMsgSetting.action} name={"action"}
                                                            onValueChange={(value) => handleStatusChange(value, "action")}>
                                                        <SelectTrigger className="w-full h-9">
                                                            <SelectValue placeholder="Testingapp"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {
                                                                    (["none"] || []).map((x) => {
                                                                        return (
                                                                            <SelectItem key={x}
                                                                                        value={x}>{x}</SelectItem>
                                                                        )
                                                                    })
                                                                }

                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                        }

                                        {
                                            (messageType == 2 || messageType == 3 || messageType == 4) &&  <div className="announce-create-switch flex items-center space-x-2">
                                                                    <Switch className={"w-[38px] h-[20px]"} id="dismiss_btn" checked={inAppMsgSetting.dismiss_btn} name={"dismiss_btn"} onCheckedChange={(checked)=>handleStatusChange(checked,"dismiss_btn")} />
                                                                    <Label className={"cursor-pointer"} htmlFor="dismiss_btn">Show a dismiss button</Label>
                                                                 </div>
                                        }

                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {messageType == 3 && <AccordionItem value="item-4" className={"widget-accordion"}>
                        <AccordionTrigger className={`hover:no-underline font-medium border-b px-4 py-3`}>Question Setting </AccordionTrigger>
                        <AccordionContent className={"px-4 py-3 space-y-4 overflow-auto"}>
                            <div className={"space-y-1"}>
                                <Label className={"font-normal text-sm"}>Question</Label>
                                <Select value={inAppMsgSetting.question_type}
                                        onValueChange={(value) => handleStatusChange(value, "question_type")}>
                                    <SelectTrigger className="w-full h-9">
                                        <SelectValue placeholder="Select question type"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {
                                                (questionType || []).map((x, index) => {
                                                    return (
                                                        <SelectItem key={x.label} value={x.value}>{x.label}</SelectItem>
                                                    )
                                                })
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            {
                                inAppMsgSetting.question_type == 4 && <div>
                                    <Label className={"font-normal text-sm"}>Answer Options</Label>
                                    <div className={"space-y-[6px]"}>
                                        <div className={"relative mt-2"}>
                                            <Input className={"h-9"} placeholder={"Option 1"}/>
                                            <Button variant={"ghost hover:none"}  className={"absolute top-0 right-0"}><Trash2 size={16} className={`${theme == "dark" ? "" : "text-muted-foreground"}`}/></Button>
                                        </div>
                                        <div className={"relative mt-2"}>
                                            <Input className={"h-9"} placeholder={"Option 2"}/>
                                            <Button variant={"ghost hover:none"}  className={"absolute top-0 right-0"}><Trash2 size={16} className={`${theme == "dark" ? "" : "text-muted-foreground"}`}/></Button>
                                        </div>
                                    </div>
                                    <div className={"flex justify-end mt-[6px]"}>
                                        <Button variant={"outline"} className={"h-9"}><Plus size={16} className={"mr-2"} /> Add Option</Button>
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
                                        <Label className={"font-normal text-sm"} htmlFor="placeholder_text">Placeholder text</Label>
                                        <Input value={inAppMsgSetting.placeholder_text} onChange={onChange} name={"placeholder_text"} type="text" className={"h-9"} id="placeholder_text" placeholder="Select One..." />
                                    </div>
                                </div>
                            }

                            {
                                (inAppMsgSetting.question_type == 0 || inAppMsgSetting.question_type == 1 ||inAppMsgSetting.question_type == 2 ||inAppMsgSetting.question_type == 3) &&
                                <div className={"space-y-3"}>

                                    {
                                        inAppMsgSetting.question_type == 1 &&
                                        <div className={"flex gap-4"}>
                                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                                <Label className={"font-normal text-sm"} htmlFor="start_no">Start Number</Label>
                                                <Input value={inAppMsgSetting.start_number} name={"start_number"} onChange={onChange} type="number" id="start_no" placeholder="1" className={"h-8"} />
                                            </div>
                                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                                <Label className={"font-normal text-sm"} htmlFor="end_no">End Number</Label>
                                                <Input value={inAppMsgSetting.end_number} name={"end_number"} onChange={onChange} type="text" id="end_no" placeholder="10" className={"h-8"} />
                                            </div>
                                        </div>
                                    }

                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label className={"font-normal text-sm"} htmlFor="start_label">Start label</Label>
                                        <Input value={inAppMsgSetting.start_label} name={"start_label"} onChange={onChange} type="text" id="start_label" placeholder="Very Bad" className={"h-8"} />
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label className={"font-normal text-sm"} htmlFor="end_label">End label</Label>
                                        <Input value={inAppMsgSetting.end_label} name={"end_label"} onChange={onChange} type="text" id="end_label" placeholder="Very Good" className={"h-8"} />
                                    </div>

                                </div>
                            }
                        </AccordionContent>
                    </AccordionItem>}

                    {messageType == 4 && <AccordionItem value="item-2" className={"widget-accordion"}>
                        <AccordionTrigger className={`hover:no-underline font-medium border-b px-4 py-3`}>General Settings</AccordionTrigger>
                        <AccordionContent className={"px-4 pt-4 pb-8 space-y-4 overflow-auto"}>
                            <h5 className={"font-medium text-base leading-5 mb-2"}>Actions</h5>
                            <div className={"mt-0 space-y-1"} style={{marginTop:"0px"}}>
                                <Label className={"font-normal"}>Link step to Action?</Label>
                                <Select value={inAppMsgSetting.link_step_action} name={"link_step_action"}
                                        onValueChange={(value) => handleStatusChange(value, "link_step_action")}>
                                    <SelectTrigger className="w-full h-9">
                                        <SelectValue placeholder=""/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {
                                                (["None (read only)","Add url button"] || []).map((x) => {
                                                    return (
                                                        <SelectItem key={x} value={x}>{x}</SelectItem>
                                                    )
                                                })
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            {inAppMsgSetting.link_step_action === "Add url button" && <div className={"space-y-3"}>

                                <Input className={"h-9"} value={inAppMsgSetting.link_step_url} name={"link_step_url"} onChange={onChange} placeholder={"Enter URL Address"}/>
                                <div className="announce-create-switch flex items-center space-x-2">
                                    <Switch className={"w-[38px] h-[20px]"} id="open_url"/>
                                    <Label htmlFor="open_url" className={`cursor-pointer ${theme == "dark" ? "" : "text-muted-foreground"}`}>Open URL in New page</Label>
                                </div>
                            </div>}
                            <div className="announce-create-switch flex items-center space-x-2">
                                <Switch className={"w-[38px] h-[20px]"} id="allow_user" />
                                <Label htmlFor="allow_user" className={`cursor-pointer ${theme == "dark" ? "" : "text-muted-foreground"}`}>Allow users to manually Complete Step</Label>
                            </div>
                        </AccordionContent>
                    </AccordionItem>}
                    <AccordionItem value="item-3" className={"widget-accordion"}>
                        <AccordionTrigger className={`hover:no-underline font-medium border-b px-4 py-3`}>Advanced Settings </AccordionTrigger>
                        <AccordionContent className={"px-4 py-3 space-y-4 overflow-visible"}>
                            <h5 className={"text-base font-medium mb-2"}>Triggers</h5>
                            <div className={"flex flex-col gap-4"}>
                                <div className="grid w-full max-w-sm items-center gap-2">
                                    <Label className={"font-normal"}>Start sending</Label>
                                    <div className={"flex flex-col gap-4"}>

                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="date"
                                                    variant={"outline"}
                                                    className={cn("w-full h-9 justify-start text-left font-normal", !date && "text-muted-foreground")}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    <>
                                                        {moment(inAppMsgSetting.start_at).format("LL")}
                                                    </>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        captionLayout="dropdown"
                                                        selected={inAppMsgSetting.start_at}
                                                        onSelect={(date) => onDateChange("start_at", date)}
                                                        startMonth={new Date(2024, 0)}
                                                        endMonth={new Date(2050, 12)}

                                                    />
                                            </PopoverContent>
                                        </Popover>

                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="date"
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full h-9 justify-start text-left font-normal",
                                                        !date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <Clock  className="mr-2 h-4 w-4" />
                                                    <>
                                                        {moment(inAppMsgSetting.start_at).format("LL")}
                                                    </>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    captionLayout="dropdown"
                                                    selected={inAppMsgSetting.start_at}
                                                    onSelect={(date) => onDateChange("start_at", date)}
                                                    startMonth={new Date(2024, 0)}
                                                    endMonth={new Date(2050, 12)}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                <div className={"space-y-1 mt-2 w-full"}>
                                    <Label className={"font-normal"}>Add delay</Label>
                                    <Select value={inAppMsgSetting.delay} defaultValue={1} onValueChange={(value)=>handleStatusChange(value ,"delay")}>
                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue defaultValue={1} placeholder="Add Delay" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {
                                                    (delay || []).map((x)=>{
                                                        return(
                                                            <SelectItem key={x.value} value={x.value}>{x.label}</SelectItem>
                                                        )
                                                    })
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid w-full max-w-sm items-center gap-2">
                                    <Label className={"font-normal"} htmlFor="email">Stop sending</Label>
                                    <div className={"flex flex-col gap-4"}>
                                        <div className={"basis-1/2"}>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        id="date"
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full h-9 justify-start text-left font-normal",
                                                            !date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        <>
                                                            {inAppMsgSetting.end_at ? moment(inAppMsgSetting.end_at).format("LL") : "Select a date"}
                                                        </>
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        captionLayout="dropdown"
                                                        selected={inAppMsgSetting.end_at}
                                                        onSelect={(date) => onDateChange("end_at", date)}
                                                        startMonth={new Date(2024, 0)}
                                                        endMonth={new Date(2050, 12)}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className={"basis-1/2"}>
                                            <Popover >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        id="date"
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full h-9 justify-start text-left font-normal",
                                                            !date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <Clock  className="mr-2 h-4 w-4" />
                                                        <>
                                                            {format(date[0], "LLL dd, y")}
                                                        </>
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        initialfocus={"true"}
                                                        mode="single"
                                                        defaultmonth={date?.from}
                                                        selected={date}
                                                        onSelect={(dates) => setDate(dates)}
                                                        numberofmonths={2}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                    </div>
                                </div>

                                <div className={"mt-6"}>
                                    <h5 className={"text-base font-medium"}>Send more than once</h5>
                                    <RadioGroup value={inAppMsgSetting.send_more} onValueChange={(value)=>handleStatusChange(value,"send_more")}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value={1} className={"w-[24px] h-[18px]"} id="r1" />
                                            <Label htmlFor="r1" className={"text-sm font-normal"}>Send once, first time the person matches the rules</Label>
                                        </div>
                                        {inAppMsgSetting.send_more == 1 && <Select>
                                            <SelectTrigger className={"w-full h-9"}>
                                                <SelectValue placeholder="Send on any day, any time"/>
                                            </SelectTrigger>
                                            <SelectContent className={""}>
                                                <SelectGroup>
                                                    <SelectItem value="apple">Send on any day, any time</SelectItem>
                                                    <SelectItem value="banana">Send on any day, any time 2</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>}
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value={2} className={"w-[30px] h-[18px]"} id="r2" />
                                            <Label htmlFor="r2" className={"text-sm font-normal"}>Send based on a time interval if the person matches the rules</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <div className={`px-4 py-3`}>
                        <Button className={`w-[125px]`} onClick={saveChanges}>
                            {isSave ? <Loader2 className={"mr-2  h-4 w-4 animate-spin"}/> : "Save Changes"}
                        </Button>
                    </div>
                </Accordion>
            </div>
        )
    }

    return (
        <div className={"xl:container-2 xl:w-[1100px] container overflow-y-auto"}>
            <Sheet open={true} onOpenChange={isOpen ? onClose : onOpen}>
                <SheetContent className={"md:w-[282px] w-full p-0 overflow-y-auto bg-card"} side={"left"}>
                    <SheetHeader className={"px-4 py-3 md:p-4 text-left md:text-center flex-row items-center justify-between border-b"}>
                        <SheetTitle className={`text-sm md:text-xl font-medium flex justify-between items-center capitalize`}>Start from scratch</SheetTitle>
                        <Button onClick={()=>navigate(`${baseUrl}/in-app-message`)} className={`h-5 w-5 p-0`} variant={"ghost"}><X size={18} className={"h-5 w-5"}/></Button>
                    </SheetHeader>
                    <div className={"h-[90vh] pb-[100px] overflow-y-auto"}>
                        <div className={"px-4 py-3 border-b"}>
                            <div className={"flex flex-col gap-2"}>
                                {
                                    (contentType || []).map((x, index) => (
                                        <Card onClick={()=>setMessageType(x.value)} key={index} className={`w - full cursor-pointer p-4 pr-8 flex justify-between items-center ${messageType == x.value ? "border-[#7c3aed]" : ""}`} rounded-mds style={{ boxShadow: '0px 4px 6px 0px rgba(0, 0, 0, 0.09)' }}>
                                            <div className={"flex items-center gap-3"}>
                                                <span className={"text-[#7C3AED]"}>{x.icon}</span>
                                                <span className={`text-base font-medium ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.label}</span>
                                            </div>
                                            <ArrowRight className={"text-[#7C3AED]"} size={20} />
                                        </Card>
                                    ))
                                }
                            </div>
                        </div>
                        <div className={""}>
                            {renderSideBarItem()}
                        </div>
                    </div>

                </SheetContent>
            </Sheet>
            <div className={""}>
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
                                                                    <div className={"p-6"}>
                                                                        <Button variant={"outline"} className={"h-8 mb-6"}>Add question</Button>
                                                                        <br/>
                                                                        <Button className={"h-8 mt-6"}>Submit</Button>
                                                                    </div>
                                                                    : inAppMsgSetting.question_type == 0 ?
                                                                        <div className={"px-4 pb-4 pt-6 "}>
                                                                            <Card className={"py-2 px-4 relative"}>
                                                                                <Button variant={"outline"} className={`absolute right-[-12px] top-[40%] p-0 h-6 w-6 ${theme == "dark" ? "" : "text-muted-foregrounds"}`}>
                                                                                    <Trash2 size={12} className={""}/>
                                                                                </Button>
                                                                                <h5 className={"text-sm font-normal"}>How satisfied are you with our product?</h5>
                                                                                <div className={"flex justify-between px-[30px] pt-[18px]"}>
                                                                                    {
                                                                                        [0,1,2,3,4,5,6,7,8,9,10].map((x)=>{
                                                                                            return(
                                                                                                <Button variant={"outline"} className={"w-5 h-5 text-xs p-0"} key={x} >{x}</Button>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </div>
                                                                                <div className={"flex justify-between mt-[18px]"}>
                                                                                    <h5 className={"text-xs font-normal"}>0 - very bad</h5>
                                                                                    <h5 className={"text-xs font-normal"}>10 - very good</h5>
                                                                                </div>
                                                                            </Card>
                                                                            <div className={"pl-4 py-4"}>
                                                                                <Button variant={"outline"} className={"h-8"}>Add question</Button>
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
                                                                                <div className={"flex justify-center gap-3 px-[30px] pt-[18px]"}>
                                                                                    {
                                                                                        [1,2,3,4,5,6,7].map((x)=>{
                                                                                            return(
                                                                                                <Button variant={"outline"} className={"w-5 h-5 text-xs p-0"} key={x} >{x}</Button>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </div>
                                                                                <div className={"flex justify-between mt-[18px]"}>
                                                                                    <h5 className={"text-xs font-normal"}>0 - very bad</h5>
                                                                                    <h5 className={"text-xs font-normal"}>7 - very good</h5>
                                                                                </div>
                                                                            </Card>
                                                                                <div className={"pl-4 py-4"}>
                                                                                    <Button variant={"outline"} className={"h-8"}>Add question</Button>
                                                                                    <br/>
                                                                                    <Button className={"h-8 mt-6"}>Submit</Button>
                                                                                </div>
                                                                            </div>
                                                                    : inAppMsgSetting.question_type == 2 ?
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
                                                                                                <h5 className={"text-xs font-normal"}>1 - very bad</h5>
                                                                                                <h5 className={"text-xs font-normal"}>5 - very good</h5>
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
                                                                                            <div className={"flex justify-center gap-6 mt-6 mb-6"}>
                                                                                                {
                                                                                                    (emoji || []).map((x,i)=>{
                                                                                                        return(
                                                                                                            <img key={i} className={"h-8 w-8"} src={x.url}/>
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
                                                                    : inAppMsgSetting.question_type == 4 ?
                                                                                    <div className={"px-4 pb-4 pt-6"}>
                                                                                        <Card className={"py-2 px-4 pb-6 relative"}>
                                                                                            <Button variant={"outline"} className={`absolute right-[-12px] top-[40%] p-0 h-6 w-6 ${theme == "dark" ? "" : "text-muted-foregrounds"}`}>
                                                                                                <Trash2 size={12} className={""}/>
                                                                                            </Button>
                                                                                            <h5 className={"text-sm font-normal"}>Ask question here?</h5>

                                                                                            <div className={"space-y-1 mt-3"}>
                                                                                                <Select value={inAppMsgSetting.position} name={"position"} onValueChange={(value)=>handleStatusChange(value,"position")}>
                                                                                                    <SelectTrigger className="w-[95%] h-9">
                                                                                                        <SelectValue placeholder="Select One..." />
                                                                                                    </SelectTrigger>
                                                                                                    <SelectContent>
                                                                                                        <SelectGroup>
                                                                                                            {
                                                                                                                (bannerPosition || []).map((x)=>{
                                                                                                                    return(
                                                                                                                        <SelectItem key={x.value} value={x.value}>{x.label}</SelectItem>
                                                                                                                    )
                                                                                                                })
                                                                                                            }
                                                                                                        </SelectGroup>
                                                                                                    </SelectContent>
                                                                                                </Select>
                                                                                            </div>
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
                                <Card className={"rounded-[10px] p-0"}>
                                    <CardHeader className={"flex px-4 pt-4 pb-0 flex-row justify-end"}>
                                        <Button className={`h-4 w-4 p-0 ${theme === "dark" ? "" : "text-muted-foreground"}`}
                                                variant={"ghost hover:none"}><X size={16} className={"h-5 w-5"}/></Button>
                                    </CardHeader>
                                    <CardHeader className={"pt-0"}>
                                        <div className={"pt-0 flex flex-row items-center"}>
                                            <img className={"h-8 w-8 rounded-full mr-2"}
                                                 src={"https://avatars.githubusercontent.com/u/124599?v=4&size=40"}
                                                 alt={"not_found"}/>
                                            <div className={""}>
                                                <div className={"flex flex-row gap-1"}>
                                                    <h5 className={"text-xs leading-5 font-medium"}>Ankesh Ramani</h5>
                                                    <h5 className={`text-xs leading-5 font-medium ${theme === "dark" ? "" : "text-muted-foreground"}`}>from webcontrive</h5>
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
                                    {/*<ReactQuillEditor value={inAppMsgSetting.post_description} onChange={onChange} name={"post_description"}/>*/}

                                    <CardContent
                                        className={`py-5 pl-8 pr-5 ${theme == "dark" ? "bg-primary/15" : "bg-[#EEE4FF]"}  rounded-b-lg flex flex-row justify-between`}>
                                        <div className={""}>
                                            <div className={"flex flex-row gap-3 items-center text-xs"}>
                                                <MessageCircleMore size={20} className={"text-[#7C3AED]"}/>
                                                <h5 className={"text-[#7C3AED] font-medium"}>Write a reply...</h5>
                                            </div>
                                        </div>
                                        <div className={"flex gap-3 items-center"}>
                                            <Smile size={20} className={"text-[#7C3AED]"}/>
                                            <Paperclip size={20} className={"text-[#7C3AED]"}/>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>}
                            {
                                messageType == 2 && <div>
                                    <div
                                        className={`flex flex-row items-center justify-between px-6 py-[26px] ${theme == "dark" ? "bg-primary/15" : "bg-[#EEE4FF]"}`}>
                                        <p className={"text-xs font-muted-foreground"}>Start your message from here.....</p>
                                        <X size={12}/>
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
            </div>

        </div>
    );
};

export default UpdateInAppMessage;