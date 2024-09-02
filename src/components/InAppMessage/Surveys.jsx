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
import {CalendarIcon, Plus, Trash2} from "lucide-react";
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

const Surveys = () => {
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

    // const onChangeNumber = (event) => {
    //     const { name, value } = event.target;
    //     setInAppMsgSetting(prevState => ({
    //         ...prevState,
    //         [name]: value
    //     }));
    // };

    const onChangeNumber = (e) => {
        const { name, value } = e.target;
        setInAppMsgSetting(prevState => ({
            ...prevState,
            [name]: Math.max(1, Math.min(10, Number(value)))
        }));
    };

    const numbers = [];
    for (let i = inAppMsgSetting.start_number; i <= inAppMsgSetting.end_number; i++) {
        numbers.push(i);
    }

    // const onChangeAddOption = (index, value) => {
    //     const updatedOptions = [...inAppMsgSetting.options];
    //     updatedOptions[index] = value;
    //     setInAppMsgSetting({
    //         ...inAppMsgSetting,
    //         options: updatedOptions
    //     });
    // };

    const onChangeAddOption = (index, value) => {
        setInAppMsgSetting(prevState => ({
            ...prevState,
            options: prevState.options.map((option, i) => (i === index ? value : option))
        }));
    };

    const addOption = () => {
        setInAppMsgSetting({
            ...inAppMsgSetting,
            options: [...inAppMsgSetting.options || [], ""]
        });
    };

    const removeOption = (index) => {
        if (inAppMsgSetting.options.length > 1) {
            const updatedOptions = inAppMsgSetting.options.filter((_, i) => i !== index);
            setInAppMsgSetting({
                ...inAppMsgSetting,
                options: updatedOptions
            });
        }
    };

    return (
        <div>
            <div className={"p-6"}>
                <h4>Customization</h4>
                <div className={"space-y-6 px-4 py-3 border-b"}>
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
                <div className="announce-create-switch flex items-center space-x-2">
                    <Switch className={"w-[38px] h-[20px]"} id="dismiss_btn" checked={inAppMsgSetting?.is_close_button} name={"is_close_button"} onCheckedChange={(checked)=>handleStatusChange(checked,"is_close_button")} />
                    <Label className={"cursor-pointer"} htmlFor="dismiss_btn">Show a dismiss button</Label>
                </div>
                </div>
            </div>
            <div className={"p-6"}>
                {/*{*/}
                {/*    (inAppMsgSetting.question_type == 1 || inAppMsgSetting.question_type == 2 || inAppMsgSetting.question_type == 3 || inAppMsgSetting.question_type == 4 || inAppMsgSetting.question_type == 5) && */}
                {/*}*/}
                <h4>Question Setting </h4>
                <div>
                    <Label className={"font-normal text-sm"}>Question</Label>
                    <Select value={inAppMsgSetting.question_type}
                            onValueChange={(value) => handleStatusChange(value, "question_type")}>
                        <SelectTrigger className="w-full h-9">
                            <SelectValue placeholder={0} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={1}>Net Promoter Score</SelectItem>
                            <SelectItem value={2}>Numeric Scale</SelectItem>
                            <SelectItem value={3}>Star rating scale</SelectItem>
                            <SelectItem value={4}>Emoji rating scale</SelectItem>
                            <SelectItem value={5}>Drop Down</SelectItem>
                            <SelectItem value={6}>Questions</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {
                    inAppMsgSetting.question_type == 2 &&
                    <div className={"flex gap-4"}>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label className={"font-normal text-sm"} htmlFor="start_no">Start Number</Label>
                            <Input value={inAppMsgSetting.start_number} name={"start_number"} onChange={onChangeNumber} type="number" min={1} max={10} id="start_no" placeholder="1" className={"h-8"} />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label className={"font-normal text-sm"} htmlFor="end_no">End Number</Label>
                            <Input value={inAppMsgSetting.end_number} name={"end_number"} onChange={onChangeNumber} type="number" id="end_no" min={1} max={10} placeholder="10" className={"h-8"} />
                        </div>
                    </div>
                }
                {
                    inAppMsgSetting.question_type == 5 && <div>
                        <Label className={"font-normal text-sm"}>Answer Options</Label>
                        <div>
                            <div className={"space-y-[6px]"}>
                                {(inAppMsgSetting?.options || []).map((option, index) => (
                                    <div key={index} className="relative mt-2">
                                        <Input
                                            className="h-9"
                                            placeholder={`Option ${index + 1}`}
                                            value={option}
                                            onChange={(e) => onChangeAddOption(index, e.target.value)}
                                        />
                                        <Button
                                            variant="ghost hover:none"
                                            className="absolute top-0 right-0"
                                            onClick={() => removeOption(index)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className={"flex justify-end mt-[6px]"}>
                                <Button variant="outline" className="h-9" onClick={addOption}>
                                    <Plus size={16} className="mr-2" /> Add Option
                                </Button>
                            </div>
                        </div>
                    </div>
                }
                { (inAppMsgSetting.question_type == 1 || inAppMsgSetting.question_type == 2 || inAppMsgSetting.question_type == 3 || inAppMsgSetting.question_type == 4) &&
                <div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label className={"font-normal text-sm"} htmlFor="start_label">Start label</Label>
                        <Input value={inAppMsgSetting.start_label} onChange={(e) => onChange("start_label", e.target.value)} type="text" id="start_label" placeholder="Very Bad" className={"h-8"} />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label className={"font-normal text-sm"} htmlFor="end_label">End label</Label>
                        <Input value={inAppMsgSetting.end_label} onChange={(e) => onChange("end_label", e.target.value)} type="text" id="end_label" placeholder="Very Good" className={"h-8"} />
                    </div>
                </div>
                }
                {
                    (inAppMsgSetting.question_type == 5 || inAppMsgSetting.question_type == 6) &&
                    <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
                        <Label className={"font-normal text-sm"} htmlFor="placeholder_text">Placeholder text</Label>
                        <Input value={inAppMsgSetting.placeholder_text} onChange={(e) => onChange("placeholder_text", e.target.value)} type="text" className={"h-9"} id="placeholder_text" placeholder="Select One..." />
                    </div>
                }
            </div>
        </div>
    );
};

export default Surveys;