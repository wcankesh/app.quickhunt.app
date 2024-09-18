import React, {useState, Fragment} from 'react';
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
import {ApiService} from "../../utils/ApiService";
import {useToast} from "../ui/use-toast";
import {useNavigate} from "react-router-dom";
import {Checkbox} from "../ui/checkbox";

const SidebarInAppMessage = ({type, inAppMsgSetting, setInAppMsgSetting, id, selectedStepIndex, setSelectedStepIndex, selectedStep, setSelectedStep}) => {
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);
    const [isLoading, setIsLoading] = useState(false);
    const [date, setDate] = useState([new Date(), addDays(new Date(), 4)]);
    let apiSerVice = new ApiService();
    const {theme} = useTheme();
    const {toast} = useToast()
    const navigate = useNavigate();

    const onChange = (name, value) => {
        setInAppMsgSetting({...inAppMsgSetting, [name]: value});
    };

    const onChangeAddOption = (index, value) => {
        const clone = [...selectedStep.options];
        clone[index] = {...clone[index], title: value}
        const obj = {...selectedStep, options: clone,}
        setSelectedStep(obj);
        updateStepRecord(obj)

    };

    const addOption = () => {
        const clone = [...selectedStep.options];
        clone.push({id: "", title: "", is_active: 1})
        const obj = {...selectedStep, options: clone,}
        setSelectedStep(obj);
        updateStepRecord(obj)

    };

    const removeOption = (record, index) => {
        const clone = [...selectedStep.options];
        if (record.id) {
            clone[index] = {...record, is_active: 0}
        } else {
            clone.splice(index, 1)
        }
        const obj = {...selectedStep, options: clone,}
        setSelectedStep(obj);
        updateStepRecord(obj)
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

    const onDateChange = (name, date) => {
        if (date) {
            let obj = {...inAppMsgSetting, [name]: date};
            setInAppMsgSetting(obj);
        }
    };

    const createMessage = async () => {
        setIsLoading(true)
        const payload = {
            ...inAppMsgSetting,
            start_at: moment(inAppMsgSetting?.start_at).format('YYYY-MM-DD HH:mm:ss'),
            end_at: moment(inAppMsgSetting?.end_at).format('YYYY-MM-DD HH:mm:ss'),
            project_id: projectDetailsReducer.id,
            type: type
        }
        console.log(payload)
        const data = await apiSerVice.createInAppMessage(payload);
        if (data.status === 200) {
            setIsLoading(false);
            toast({description: data.message})
            if (id === "new") {
                navigate(`${baseUrl}/in-app-message`)
            }
        } else {
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
            type: type
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

    const updateStepRecord = (record) => {
        let clone = [...inAppMsgSetting.steps];
        clone[selectedStepIndex] = record;
        setInAppMsgSetting(prevState => ({
            ...prevState,
            steps: clone
        }));

    }

    const onChangeQuestion = (name, value) => {
        const obj = {...selectedStep, [name]: value, }
        setSelectedStep(obj);
        updateStepRecord(obj)
    }



    return (
        <Fragment>
            <div className={"border-b"}>
                <h5 className={"text-base font-medium border-b px-4 py-3"}>Content</h5>
                <div className={"px-4 py-3 space-y-4"}>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="title">Title</Label>
                        <Input className={"h-9"} id="title" placeholder="Title" value={inAppMsgSetting.title}
                               onChange={(e) => onChange("title", e.target.value)}/>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <div className="flex items-center gap-2">
                            <Checkbox id="show_sender"
                                      checked={inAppMsgSetting.show_sender === 1}
                                      onCheckedChange={(checked) => onChange("show_sender", checked ? 1 : 0)}
                            />
                            <Label htmlFor="show_sender" className={"font-normal cursor-pointer"}>Show sender</Label>
                        </div>
                    </div>

                    {
                        inAppMsgSetting.show_sender === 1 && <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label className={"font-normal"}>From</Label>
                            <Select
                                value={Number(inAppMsgSetting.from)}
                                name={"from"}
                                onValueChange={(value) => onChange("from", value, )}
                            >
                                <SelectTrigger className="w-full h-9">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {allStatusAndTypes.members.map((x) => (
                                            <SelectItem key={Number(x.user_id)} value={Number(x.user_id)}>
                                                {x.user_first_name} {x.user_last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    }
                    {
                        type === "1" &&
                        <Fragment>
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
                        </Fragment>
                    }
                    {
                        type === "2" &&
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label className={"font-normal"}>Action</Label>
                            <Select value={inAppMsgSetting?.action_type}
                                    onValueChange={(value) => onChange("action_type",value)}>
                                <SelectTrigger className="w-full h-9">
                                    <SelectValue placeholder=""/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={0}>None</SelectItem>
                                    <SelectItem value={1}>Open URL</SelectItem>
                                    <SelectItem value={2}>Ask for Reaction</SelectItem>
                                    <SelectItem value={3}>Collect visitor email</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    }
                    {
                        type === "4" &&
                            <Fragment>
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label className={"font-normal"}>Action</Label>
                                    <Select value={selectedStep?.action_type}
                                            onValueChange={(value) => onChangeQuestion("action_type",value)}>
                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue placeholder=""/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={0}>None</SelectItem>
                                            <SelectItem value={1}>Open URL</SelectItem>
                                        </SelectContent>
                                    </Select>

                                </div>
                                {
                                    selectedStep?.action_type === 1 &&
                                    <Fragment>
                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="title">Action Text</Label>
                                            <Input className={"h-9"} id="action_text" placeholder="Enter action text" value={selectedStep?.action_text}
                                                   onChange={(e) => onChangeQuestion("action_text", e.target.value)}/>
                                        </div>
                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="title">Action URL</Label>
                                            <Input className={"h-9"} id="action_url" placeholder="Enter URL address" value={selectedStep?.action_url}
                                                   onChange={(e) => onChangeQuestion("action_url", e.target.value)}/>
                                        </div>
                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <Checkbox id="is_redirect"
                                                          checked={selectedStep.is_redirect === 1}
                                                          onCheckedChange={(checked) => onChangeQuestion("is_redirect", checked ? 1 : 0)}
                                                />
                                                <Label htmlFor="is_redirect" className={"font-normal cursor-pointer"}>Open URL in a new tab</Label>
                                            </div>
                                        </div>
                                    </Fragment>
                                }

                            </Fragment>

                    }
                    {
                        (type === "2" && inAppMsgSetting.action_type == 1) && <Fragment>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="title">Action Text</Label>
                                <Input className={"h-9"} id="action_text" placeholder="Enter action text" value={inAppMsgSetting.action_text}
                                       onChange={(e) => onChange("action_text", e.target.value)}/>
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="title">Action URL</Label>
                                <Input className={"h-9"} id="action_url" placeholder="Enter URL address" value={inAppMsgSetting.action_url}
                                       onChange={(e) => onChange("action_url", e.target.value)}/>
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <div className="flex items-center gap-2">
                                    <Checkbox id="is_redirect"
                                              checked={inAppMsgSetting.is_redirect === 1}
                                              onCheckedChange={(checked) => onChange("is_redirect", checked ? 1 : 0)}
                                    />
                                    <Label htmlFor="is_redirect" className={"font-normal cursor-pointer"}>Open URL in a new tab</Label>
                                </div>
                            </div>
                        </Fragment>
                    }
                    {
                        type === "2" && inAppMsgSetting.action_type != 0 && <div className="grid w-full max-w-sm items-center gap-1.5">
                            <div className="flex items-center gap-2">
                                <Checkbox id="is_banner_close_button"
                                          checked={inAppMsgSetting.is_banner_close_button === 1}
                                          onCheckedChange={(checked) => onChange("is_banner_close_button", checked ? 1 : 0)}
                                />
                                <Label htmlFor="is_banner_close_button" className={"font-normal cursor-pointer"}>Dismiss the banner on click</Label>
                            </div>
                        </div>
                    }
                </div>
            </div>
            {
                type === "3" && <div className={"border-b px-4 py-6 space-y-4"}>
                    <h5 className={"text-base font-medium"}>Question Setting</h5>
                    {
                        selectedStep?.question_type === 5 &&
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label className={"font-normal text-sm"}>Answer Options</Label>
                            <div>
                                <div className={"space-y-[6px]"}>

                                    {(selectedStep?.options || []).map((option, index) => (
                                        <div key={index} className="relative mt-2">
                                            <Input
                                                className="h-9"
                                                placeholder={`Option ${index + 1}`}
                                                value={option.title}
                                                onChange={(e) => onChangeAddOption(index, e.target.value)}
                                            />
                                            <Button
                                                variant="ghost hover:none"
                                                className="absolute top-0 right-0"
                                                onClick={() => removeOption(option, index)}
                                            >
                                                <Trash2 size={16}/>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <div className={"flex justify-end mt-[6px]"}>
                                    <Button variant="outline" className="h-9" onClick={addOption}>
                                        <Plus size={16} className="mr-2"/> Add Option
                                    </Button>
                                </div>
                            </div>

                        </div>
                    }
                    {
                        (selectedStep?.question_type === 5 || selectedStep?.question_type === 6 || selectedStep?.question_type === 7) && <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
                            <Label className={"font-normal text-sm"} htmlFor="placeholder_text">Placeholder
                                text</Label>
                            <Input value={inAppMsgSetting.placeholder_text}
                                   onChange={(e) => onChangeQuestion("placeholder_text", e.target.value)} type="text"
                                   className={"h-9"} id="placeholder_text" placeholder="Select One..."/>
                        </div>
                    }
                    {
                        (selectedStep?.question_type === 1 || selectedStep?.question_type === 2 || selectedStep?.question_type === 3 || selectedStep?.question_type === 4) &&
                        <div className={"space-y-3"}>
                            {
                                selectedStep?.question_type === 2 &&
                                <div className={"flex gap-4"}>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label className={"font-normal text-sm"} htmlFor="start_number">Start Number</Label>
                                        <Input value={selectedStep?.start_number} name={"start_number"}
                                               type="number" id="start_number"
                                               onChange={(e) => onChangeQuestion("start_number", e.target.value)}
                                               placeholder="1" className={"h-8"}/>
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label className={"font-normal text-sm"} htmlFor="end_number">End Number</Label>
                                        <Input value={selectedStep?.end_number} name={"end_number"}
                                               onChange={(e) => onChangeQuestion("end_number", e.target.value)}
                                                type="number" id="end_number"
                                               placeholder="10" className={"h-8"}/>
                                    </div>
                                </div>
                            }

                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label className={"font-normal text-sm"} htmlFor="start_label">Start label</Label>
                                <Input value={selectedStep?.start_label}
                                       onChange={(e) => onChangeQuestion("start_label", e.target.value)} type="text"
                                       id="start_label" placeholder="Very Bad" className={"h-8"}/>
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label className={"font-normal text-sm"} htmlFor="end_label">End label</Label>
                                <Input value={selectedStep?.end_label}
                                       onChange={(e) => onChangeQuestion("end_label", e.target.value)} type="text"
                                       id="end_label" placeholder="Very Good" className={"h-8"}/>
                            </div>

                        </div>
                    }
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <div className={"flex gap-2 items-center"}>
                            <Checkbox
                                id={"is_answer_required"}
                                checked={selectedStep?.is_answer_required === 1}
                                onCheckedChange={(checked) => onChangeQuestion("is_answer_required", checked ? 1 : 0)}
                            />
                            <label htmlFor="is_answer_required" className="text-sm">Make answer required</label>
                        </div>
                    </div>

                </div>
            }
            <div className={"border-b px-4 py-6 space-y-4"}>
                <h5 className={"text-base font-medium"}>Style</h5>
                {
                    type === "2" && <Fragment>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label className={"font-normal"}>Banner position</Label>
                            <Select
                                value={inAppMsgSetting.position}
                                onValueChange={(value) => onChange("position",value, )}
                            >
                                <SelectTrigger className="w-full h-9">
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
                                onValueChange={(value) => onChange("alignment",value, )}
                            >
                                <SelectTrigger className="w-full h-9">
                                    <SelectValue placeholder={"Select alignment"}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={"left"}>Left</SelectItem>
                                    <SelectItem value={"right"}>Right</SelectItem>
                                    <SelectItem value={"center"}>Center</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </Fragment>
                }
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label className={"font-normal"}>Background Color</Label>
                    <div className={"w-full text-sm"}>
                        <ColorInput style={{width: '100%', height: "36px"}} value={inAppMsgSetting.bg_color}
                                    onChange={onChange} name={"bg_color"}/>
                    </div>
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label className={"font-normal"}>{type === "4" ? "Button Text Color": "Text Color"}</Label>
                    <div className={"w-full text-sm widget-color-picker space-y-2"}>
                        <ColorInput
                            value={inAppMsgSetting.text_color}
                            onChange={onChange}
                            name={"text_color"}
                        />
                    </div>
                </div>

                {type === "1" && <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label className={"font-normal "}>Icon Color </Label>
                    <div className={"w-full text-sm widget-color-picker space-y-2"}>
                        <ColorInput
                            value={inAppMsgSetting.icon_color}
                            onChange={onChange}
                            name={"icon_color"}/>
                    </div>
                </div>}

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label className={"font-normal"}>{type === "4" ? "Button Background Color": "Button Color"} </Label>
                    <div className={"w-full text-sm widget-color-picker space-y-2"}>
                        <ColorInput
                            name={"btn_color"}
                            value={inAppMsgSetting.btn_color}
                            onChange={onChange}
                        />
                    </div>
                </div>

                {
                    (type === "2" || type === "3" || type === "4") &&
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <div className="flex items-center gap-2">
                            <Checkbox id="is_close_button" checked={inAppMsgSetting.is_close_button === 1} onCheckedChange={(checked) => onChange("is_close_button", checked ? 1 : 0)}/>
                            <Label htmlFor="is_close_button" className={"font-normal cursor-pointer"}>Show dismiss button</Label>
                        </div>
                    </div>
                }
            </div>

            <div className={"border-b px-4 py-6 space-y-4"}>
                <h5 className={"text-base font-medium"}>Trigger Setting</h5>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label className={"font-normal"}>Add delay</Label>
                    <Select value={inAppMsgSetting.delay} onValueChange={(value) => onChange("delay",value, )}>
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
                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                    <Fragment>
                                        {inAppMsgSetting.start_at ? moment(inAppMsgSetting.start_at).format('D MMM, YYYY') : "Select a date"}
                                    </Fragment>
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
                                        <CalendarIcon className="mr-2 h-4 w-4"/>
                                        <Fragment>
                                            {inAppMsgSetting?.end_at ? moment(inAppMsgSetting?.end_at).format('D MMM, YYYY') : "Select a date"}
                                        </Fragment>
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