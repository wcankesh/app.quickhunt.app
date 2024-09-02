import React, {useState} from 'react';
import {Label} from "../ui/label";
import {Select, SelectGroup, SelectValue} from "@radix-ui/react-select";
import {SelectContent, SelectItem, SelectTrigger} from "../ui/select";
import moment from "moment";
import {useNavigate, useParams} from "react-router-dom";
import {ApiService} from "../../utils/ApiService";
import {useToast} from "../ui/use-toast";
import {useTheme} from "../theme-provider";
import {useSelector} from "react-redux";
import {addDays} from "date-fns";
import ColorInput from "../Comman/ColorPicker";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {Button} from "../ui/button";
import {cn} from "../../lib/utils";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "../ui/calendar";
import {Input} from "../ui/input";

const initialState = {
    project_id: "2",
    title: "Shipped",
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

const Post = () => {
    const navigate = useNavigate();
    let apiSerVice = new ApiService();
    const {toast} = useToast()
    const {id, type} = useParams()
    const {theme} = useTheme();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);

    const [messageType, setMessageType] = useState(Number(type) || 1);
    const [date, setDate] = useState([new Date(),addDays(new Date(), 4)]);
    // const [addOption, setAddOption] = useState([])
    const [inAppMsgSetting, setInAppMsgSetting] = useState(initialState);
    const [editMessageName, setEditMessageName] = useState(false);
    const [openItem,setOpenItem]=useState("");
    const [starRating, setStarRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusChange = (value, name) => {
        if (name === "is_close_button") {
            setInAppMsgSetting({
                ...inAppMsgSetting,
                [name]: value === true ? 1 : 0
            });
        } else {
            setInAppMsgSetting({
                ...inAppMsgSetting,
                [name]: value
            });
        }
    };

    const onDateChange = (name, date) => {
        if (date) {
            let obj = {...inAppMsgSetting, [name]: date};
            setInAppMsgSetting(obj);
        }
    };

    const handleTimeChange = (time, type) => {
        const currentDateTime = moment(inAppMsgSetting[type]);

        const newDateTime = moment(currentDateTime).set({
            hour: parseInt(time.split(':')[0], 10),
            minute: parseInt(time.split(':')[1], 10),
            second: 0,
            millisecond: 0
        }).toISOString();

        setInAppMsgSetting({
            ...inAppMsgSetting,
            [type]: newDateTime
        });
    };

    return (
        <div>
            <div className={"p-6"}>
                <h4>Content</h4>
                <div className={"space-y-6 px-4 py-3 border-b"}>
                    <div className={"space-y-1"}>
                        <Label className={"font-normal"}>From</Label>
                        <Select
                            value={Number(inAppMsgSetting.from)}
                            name={"from"}
                            onValueChange={(value) => handleStatusChange(value, "from")}
                        >
                            <SelectTrigger className="w-full h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {allStatusAndTypes.members.map((x) => (
                                        <SelectItem key={Number(x.id)} value={Number(x.id)}>
                                            {x.user_first_name} {x.user_last_name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className={"space-y-1"}>
                        <Label className={"font-normal"}>Reply type</Label>
                        <Select
                            onValueChange={(value) => onChange("reply_type", value)}
                            value={inAppMsgSetting.reply_type}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={"Select reply type"}/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={1}>Text</SelectItem>
                                <SelectItem value={2}>Reaction</SelectItem>
                                <SelectItem value={3}>None</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className={"space-y-6 px-4 py-3 border-b"}>
                    <h5 className={"text-base font-medium mb-2 px-4 m-0"}>Style</h5>
                    <div className="grid w-full max-w-sm items-center gap-2">
                        <Label className={"font-normal"}>Background Color</Label>
                        <div className={"w-full text-sm"}>
                            <ColorInput style={{width:'100%',height:"36px"}} value={inAppMsgSetting.bg_color}
                                        onChange={(color) => setInAppMsgSetting((prevState) => ({
                                            ...prevState,
                                            bg_color: color.bg_color
                                        }))} name={"bg_color"}  />
                        </div>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-2">
                        <Label className={"font-normal"}>Button Color</Label>
                        <div className={"w-full text-sm"}>
                            <ColorInput style={{width:'100%',height:"36px"}} value={inAppMsgSetting.btn_color_picker}
                                        onChange={(color) => setInAppMsgSetting((prevState) => ({
                                            ...prevState,
                                            btn_color_picker: color.btn_color_picker
                                        }))} name={"btn_color_picker"}  />
                        </div>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-2">
                        <Label className={"font-normal"}>Text Color</Label>
                        <div className={"w-full text-sm widget-color-picker space-y-2"}>
                            <ColorInput
                                value={inAppMsgSetting.text_color}
                                onChange={(color) => onChange("text_color", color?.text_color)}
                                name={"text_color"}
                            />
                        </div>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-2">
                        <Label className={"font-normal "} >Icon Color </Label>
                        <div className={"w-full text-sm widget-color-picker space-y-2"}>
                            <ColorInput
                                value={inAppMsgSetting.icon_color}
                                // onChange={(color) => setInAppMsgSetting((prevState) => ({
                                //     ...prevState,
                                //     icon_color: color.icon_color
                                // }))}
                                onChange={(color) => onChange("icon_color", color?.icon_color)}
                                name={"icon_color"}/>
                        </div>
                    </div>
                </div>
                <div className={"space-y-6 px-4 py-3 border-b"}>
                    <h5 className={"text-base font-medium px-4 pt-3"}>Triggers</h5>
                    <div className={"flex flex-col"}>

                        <div className={"px-4 py-3 space-y-1 w-full border-b"}>
                            <Label className={"font-normal"}>Add delay</Label>
                            <Select value={inAppMsgSetting.delay} onValueChange={(value)=>handleStatusChange(value ,"delay")}>
                                <SelectTrigger className="w-full h-9">
                                    <SelectValue defaultValue={1}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={1}>1 sec</SelectItem>
                                    <SelectItem value={2}>2 sec</SelectItem>
                                    <SelectItem value={3}>3 sec</SelectItem>
                                    <SelectItem value={4}>4 sec</SelectItem>
                                    <SelectItem value={5}>5 sec</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className={"grid w-full max-w-sm items-center gap-2 px-4 py-3 border-b"}>
                            <Label className={"font-normal"}>Start sending</Label>
                            <div className={"flex flex-col gap-4"}>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="start_at_time"
                                            variant={"outline"}
                                            className={cn("w-full h-9 justify-start text-left font-normal", !date && "text-muted-foreground")}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            <>
                                                {inAppMsgSetting.start_at ? moment(inAppMsgSetting.start_at).format('D MMM, YYYY') : "Select a date"}
                                            </>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            captionLayout="dropdown"
                                            selected={inAppMsgSetting?.start_at ? new Date(inAppMsgSetting?.start_at) : new Date()}
                                            onSelect={(date) => onDateChange("start_at", date)}
                                            startMonth={new Date(2024, 0)}
                                            endMonth={new Date(2050, 12)}

                                        />
                                    </PopoverContent>
                                </Popover>
                                <div className="custom-time-picker">
                                    <Input
                                        type={"time"}
                                        value={moment(inAppMsgSetting.start_at).format("HH:mm")}
                                        onChange={(e) => handleTimeChange(e.target.value, 'start_at')}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={"grid w-full max-w-sm items-center gap-2 px-4 py-3"}>
                            <Label className={"font-normal"} htmlFor="email">Stop sending</Label>
                            <div className={"flex flex-col gap-4"}>
                                <div className={"flex flex-col gap-4"}>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="end_at_time"
                                                variant={"outline"}
                                                className={cn("w-full h-9 justify-start text-left font-normal", !date && "text-muted-foreground")}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                <>
                                                    {inAppMsgSetting?.end_at ? moment(inAppMsgSetting?.end_at).format('D MMM, YYYY') : "Select a date"}
                                                </>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                captionLayout="dropdown"
                                                selected={inAppMsgSetting?.end_at ? new Date(inAppMsgSetting?.end_at) : new Date()}
                                                onSelect={(date) => onDateChange("end_at", date)}
                                                startMonth={new Date(2024, 0)}
                                                endMonth={new Date(2050, 12)}

                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <Input
                                        type={"time"}
                                        value={moment(inAppMsgSetting.end_at).format("HH:mm")}
                                        onChange={(e) => handleTimeChange(e.target.value, 'end_at')}
                                    />
                                </div>

                            </div>
                        </div>

                        {/*<div className={"mt-6"}>*/}
                        {/*    <h5 className={"text-base font-medium"}>Send more than once</h5>*/}
                        {/*    <RadioGroup value={inAppMsgSetting.send_more} onValueChange={(value)=>handleStatusChange(value,"send_more")}>*/}
                        {/*        <div className="flex items-center space-x-2">*/}
                        {/*            <RadioGroupItem value={1} className={"w-[24px] h-[18px]"} id="r1" />*/}
                        {/*            <Label htmlFor="r1" className={"text-sm font-normal"}>Send once, first time the person matches the rules</Label>*/}
                        {/*        </div>*/}
                        {/*        {inAppMsgSetting.send_more == 1 && <Select>*/}
                        {/*            <SelectTrigger className={"w-full h-9"}>*/}
                        {/*                <SelectValue placeholder="Send on any day, any time"/>*/}
                        {/*            </SelectTrigger>*/}
                        {/*            <SelectContent className={""}>*/}
                        {/*                <SelectGroup>*/}
                        {/*                    <SelectItem value="apple">Send on any day, any time</SelectItem>*/}
                        {/*                    <SelectItem value="banana">Send on any day, any time 2</SelectItem>*/}
                        {/*                </SelectGroup>*/}
                        {/*            </SelectContent>*/}
                        {/*        </Select>}*/}
                        {/*        <div className="flex items-center space-x-2">*/}
                        {/*            <RadioGroupItem value={2} className={"w-[30px] h-[18px]"} id="r2" />*/}
                        {/*            <Label htmlFor="r2" className={"text-sm font-normal"}>Send based on a time interval if the person matches the rules</Label>*/}
                        {/*        </div>*/}
                        {/*    </RadioGroup>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;