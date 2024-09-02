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
import {Switch} from "../ui/switch";

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

const Banners = () => {
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
                <div className={"space-y-4 px-4 py-3 border-b"}>
                    <div className={"space-y-1"}>
                        <Label className={"font-normal"}>Banner position</Label>
                        <Select
                            value={inAppMsgSetting.position}
                            onValueChange={(value) => handleStatusChange(value, "position")}
                        >
                            <SelectTrigger className="w-full h-9">
                                {/*<SelectValue>{inAppMsgSetting.position === "top" ? 'Top' : 'Bottom'}</SelectValue>*/}
                                <SelectValue placeholder={"Select position"}/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={"top"}>Top</SelectItem>
                                <SelectItem value={"bottom"}>Bottom</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className={"space-y-1"}>
                        <Label className={"font-normal"}>Alignment</Label>
                        <Select
                            value={inAppMsgSetting.alignment}
                            onValueChange={(value)=>handleStatusChange(value,"alignment")}
                        >
                            <SelectTrigger className="w-full h-9">
                                <SelectValue placeholder={"Select alignment"}/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={"left"}>Left</SelectItem>
                                <SelectItem value={"right"}>Right</SelectItem>
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
                </div>
                <div className={"space-y-1"}>
                    <Label className={"font-normal"}>Action</Label>
                    <Select value={inAppMsgSetting?.action_type}
                            onValueChange={(value) => handleStatusChange(value, "action_type")}>
                        <SelectTrigger className="w-full h-9">
                            <SelectValue placeholder=""/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={1}>Open URL</SelectItem>
                            <SelectItem value={2}>Ask for Reaction</SelectItem>
                            <SelectItem value={3}>Collect visitor email</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="announce-create-switch flex items-center space-x-2">
                    <Switch className={"w-[38px] h-[20px]"} id="dismiss_btn" checked={inAppMsgSetting?.is_close_button} name={"is_close_button"} onCheckedChange={(checked)=>handleStatusChange(checked,"is_close_button")} />
                    <Label className={"cursor-pointer"} htmlFor="dismiss_btn">Show a dismiss button</Label>
                </div>
            </div>
        </div>
    );
};

export default Banners;