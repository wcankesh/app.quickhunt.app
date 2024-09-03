import React, {useState,Fragment} from 'react';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../ui/accordion";
import {Label} from "../ui/label";
import {Select, SelectGroup, SelectValue} from "@radix-ui/react-select";
import {SelectContent, SelectItem, SelectTrigger} from "../ui/select";
import ColorInput from "../Comman/ColorPicker";
import {Switch} from "../ui/switch";
import {Input} from "../ui/input";
import {Button} from "../ui/button";
import {CalendarIcon, Loader2, Plus, Trash2} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {cn} from "../../lib/utils";
import moment from "moment";
import {Calendar} from "../ui/calendar";
import {useSelector} from "react-redux";
import {baseUrl} from "../../utils/constent";
import {addDays} from "date-fns";
import {useTheme} from "../theme-provider";

const SidebarInAppMessage = ({messageType, inAppMsgSetting, setInAppMsgSetting, id}) => {
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);
    const [isLoading, setIsLoading] = useState(false);
    const [date, setDate] = useState([new Date(),addDays(new Date(), 4)]);
    const {theme} = useTheme();


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

    const onChange = (name, value) => {
        setInAppMsgSetting({...inAppMsgSetting, [name]: value});
    };

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


    const onDateChange = (name, date) => {
        if (date) {
            let obj = {...inAppMsgSetting, [name]: date};
            setInAppMsgSetting(obj);
        }
    };

    const createMessage = async () => {
        setIsLoading(true)
        debugger
        const payload = {
            ...inAppMsgSetting,
            start_at: moment(inAppMsgSetting?.start_at).format('YYYY-MM-DD HH:mm:ss'),
            end_at: moment(inAppMsgSetting?.end_at).format('YYYY-MM-DD HH:mm:ss'),
            project_id: projectDetailsReducer.id,
        }
        const data = await apiSerVice.createInAppMessage(payload);
        if (data.status === 200) {
            setIsLoading(false);
            toast({description: data.message})
            if (id === "new") {
                navigate(`${baseUrl}/in-app-message`)
            }
        }else {
            toast({variant: "destructive", description: data.message})
            setIsLoading(false);
        }
    }

    const onUpdateMessage = async () => {
        setIsLoading(true)
        const payload = {
            ...inAppMsgSetting,
            start_at: moment(inAppMsgSetting?.start_at).format('YYYY-MM-DD HH:mm:ss'),
            end_at: moment(inAppMsgSetting?.end_at).format('YYYY-MM-DD HH:mm:ss'),
        }
        const data = await apiSerVice.updateInAppMessage(payload, inAppMsgSetting.id)

        if (data.status === 200) {
            setIsLoading(false)
            toast({description: data.message})
        } else {
            toast({variant: "destructive", description: data.message})
            setIsLoading(false)
        }
    }

    return (
        <Fragment>
            <div className={"border-b"}>
                <h5 className={"text-base font-medium border-b px-4 py-3"}>Content</h5>
                <div className={"px-4 py-3 border-b space-y-1"}>
                    <Label htmlFor="title">Title</Label>
                    <Input className={"h-9"} id="title" placeholder="Title" value={inAppMsgSetting.title} onChange={(e) => onChange("title", e.target.value)} />
                </div>
                {
                    messageType == 2 && <Fragment>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
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
                        <div className="grid w-full max-w-sm items-center gap-1.5">
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
                    </Fragment>
                }
                {messageType == 1 &&
                <Fragment>
                    <div className={"px-4 py-3 space-y-4"}>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label className={"font-normal"}>From</Label>
                            <Select
                                value={Number(inAppMsgSetting.from)}
                                name={"from"}
                                onValueChange={(value) => handleStatusChange(value, "from")}
                            >
                                <SelectTrigger className="w-full h-9">
                                    <SelectValue/>
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
                        <div className="grid w-full max-w-sm items-center gap-1.5">
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
                </Fragment>
                }
            </div>
            <div className={"border-b px-4 py-6 space-y-4"}>
                {(messageType == 2 || messageType == 1) && <h5 className={"text-base font-medium"}>Style</h5>}
                {(messageType == 3 || messageType == 4) && <h5 className={"text-base font-medium"}>Customization</h5>}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label className={"font-normal"}>Background Color</Label>
                    <div className={"w-full text-sm"}>
                        <ColorInput style={{width:'100%',height:"36px"}} value={inAppMsgSetting.bg_color}
                                    onChange={(color) => setInAppMsgSetting((prevState) => ({
                                        ...prevState,
                                        bg_color: color.bg_color
                                    }))} name={"bg_color"}  />
                    </div>
                </div>
                {
                    (messageType == 3 || messageType == 4) &&
                    <div className="grid w-full max-w-sm items-center gap-1.5">
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

                { (messageType == 1 || messageType == 2) &&
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label className={"font-normal"}>Text Color</Label>
                    <div className={"w-full text-sm widget-color-picker space-y-2"}>
                        <ColorInput
                            value={inAppMsgSetting.text_color}
                            onChange={(color) => onChange("text_color", color?.text_color)}
                            name={"text_color"}
                        />
                    </div>
                </div>}

                { messageType == 1 && <div className="grid w-full max-w-sm items-center gap-1.5">
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
                </div>}

                {(messageType == 1 || messageType == 2) && <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label className={"font-normal"} >Button Color</Label>
                    <div className={"w-full text-sm widget-color-picker space-y-2"}>
                        <ColorInput
                            name={"btn_color"}
                            value={inAppMsgSetting.btn_color}
                            onChange={(color) => onChange("btn_color", color?.btn_color)}
                        />
                    </div>
                </div>}

                {
                    messageType == 2 &&
                    <div className="grid w-full max-w-sm items-center gap-1.5">
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
                }

                {
                    (messageType == 2 || messageType == 3 || messageType == 4) && <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Switch className={"w-[38px] h-[20px]"} id="dismiss_btn" checked={inAppMsgSetting?.is_close_button} name={"is_close_button"} onCheckedChange={(checked)=>handleStatusChange(checked,"is_close_button")} />
                        <Label className={"cursor-pointer"} htmlFor="dismiss_btn">Show a dismiss button</Label>
                    </div>
                }
            </div>
            {
                messageType == 3 &&   <div className={"border-b px-4 py-6 space-y-4"}>
                    <h5 className={"text-base font-medium"}>Question Setting</h5>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
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
                            </SelectContent>
                        </Select>
                    </div>
                    {
                        inAppMsgSetting.question_type == 5 && <div  className="grid w-full max-w-sm items-center gap-1.5">
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
                            <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
                                <Label className={"font-normal text-sm"} htmlFor="placeholder_text">Placeholder text</Label>
                                <Input value={inAppMsgSetting.placeholder_text} onChange={(e) => onChange("placeholder_text", e.target.value)} type="text" className={"h-9"} id="placeholder_text" placeholder="Select One..." />
                            </div>
                        </div>
                    }
                    {
                        (inAppMsgSetting.question_type == 1 || inAppMsgSetting.question_type == 2 ||inAppMsgSetting.question_type == 3 ||inAppMsgSetting.question_type == 4) &&
                        <div className={"space-y-3"}>

                            {
                                inAppMsgSetting.question_type == 1 &&
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
                </div>
            }
            {
                messageType == 4 &&  <div className={"border-b px-4 py-6 space-y-4"}>
                    <h5 className={"text-base font-medium"}>General Setting</h5>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label className={"font-normal"}>Link step to Action?</Label>
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
                    {inAppMsgSetting.link_step_action === "Add url button" && <div className={"space-y-3"}>

                        <div className="announce-create-switch flex items-center space-x-2">
                            <Switch className={"w-[38px] h-[20px]"} id="open_url"/>
                            <Label htmlFor="open_url" className={`cursor-pointer ${theme == "dark" ? "" : "text-muted-foreground"}`}>Open URL in New page</Label>
                        </div>
                    </div>}
                    <div className="announce-create-switch flex items-center space-x-2">
                        <Switch className={"w-[38px] h-[20px]"} id="allow_user" />
                        <Label htmlFor="allow_user" className={`cursor-pointer ${theme == "dark" ? "" : "text-muted-foreground"}`}>Allow users to manually Complete Step</Label>
                    </div>
                </div>
            }

            <div className={"border-b px-4 py-6 space-y-4"}>
                <h5 className={"text-base font-medium"}>Trigger Setting</h5>
                <div className="grid w-full max-w-sm items-center gap-1.5">
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
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label className={"font-normal"}>Start sending</Label>
                    <div className={"flex gap-4"}>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="start_at_time"
                                    variant={"outline"}
                                    className={cn("w-1/2 justify-start text-left font-normal", !date && "text-muted-foreground")}
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
                        <div className="custom-time-picker w-1/2">
                            <Input
                                type={"time"}
                                value={moment(inAppMsgSetting.start_at).format("HH:mm")}
                                onChange={(e) => handleTimeChange(e.target.value, 'start_at')}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label className={"font-normal"} htmlFor="email">Stop sending</Label>
                    <div className={"flex flex-col gap-4"}>
                        <div className={"flex gap-4"}>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="end_at_time"
                                        variant={"outline"}
                                        className={cn("w-1/2 h-9 justify-start text-left font-normal", !date && "text-muted-foreground")}
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
                            <div className="custom-time-picker w-1/2">
                            <Input
                                type={"time"}
                                value={moment(inAppMsgSetting.end_at).format("HH:mm")}
                                onChange={(e) => handleTimeChange(e.target.value, 'end_at')}
                            />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="px-4 py-6">
                <Button className={`w-[125px] font-semibold`} onClick={id === "new" ? createMessage : onUpdateMessage}>
                    {isLoading ? <Loader2 className={"mr-2  h-4 w-4 animate-spin"}/> : "Save Changes"}
                </Button>
            </div>
        </Fragment>
    );
};

export default SidebarInAppMessage;