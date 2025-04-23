import React, {useState, Fragment} from 'react';
import {Label} from "../ui/label";
import {Select, SelectGroup, SelectValue} from "@radix-ui/react-select";
import {SelectContent, SelectItem, SelectTrigger} from "../ui/select";
import ColorInput from "../Comman/ColorPicker";
import {Input} from "../ui/input";
import {Button} from "../ui/button";
import {CalendarIcon, Loader2, Plus, Trash2} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import moment from "moment";
import {Calendar} from "../ui/calendar";
import {useSelector} from "react-redux";
import {apiService, baseUrl} from "../../utils/constent";
import {addDays} from "date-fns";
import {useToast} from "../ui/use-toast";
import {useNavigate} from "react-router-dom";
import {Checkbox} from "../ui/checkbox";

const initialStateError = {
    startAt: undefined,
    endAt: undefined,
    from: "",
}

const SidebarInAppMessage = ({
                                 type,
                                 inAppMsgSetting,
                                 setInAppMsgSetting,
                                 id,
                                 selectedStepIndex,
                                 setSelectedStepIndex,
                                 selectedStep,
                                 setSelectedStep
                             }) => {
    const {toast} = useToast();
    const navigate = useNavigate();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);

    const [isLoading, setIsLoading] = useState(false);
    const [date, setDate] = useState([new Date(), addDays(new Date(), 4)]);
    const [formError, setFormError] = useState(initialStateError);

    const onChange = (name, value) => {
        const update = {...inAppMsgSetting, [name]: value}
        if (name === "showSender" && value === true) {
            update.from = "";
        }
        setInAppMsgSetting(update);
        setFormError(formError => ({
            ...formError,
            [name]: formValidate(name, value)
        }));
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
        clone.push({id: "", title: "", isActive: true})
        const obj = {...selectedStep, options: clone,}
        setSelectedStep(obj);
        updateStepRecord(obj)
    };

    const removeOption = (record, index) => {
        const clone = [...selectedStep.options];
        if (record.id) {
            clone[index] = {...record, isActive: false}
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
        setFormError(formError => ({
            ...formError,
            [type]: formValidate(type, newDateTime)
        }));
    };

    const handleDateChange = (date, type) => {
        const newDate = moment(date).toISOString();
        const isFutureDate = date > new Date();
        let updatedSetting = {
            ...inAppMsgSetting,
            [type]: newDate,
        };

        if (type === "startAt") {
            updatedSetting = {
                ...updatedSetting,
                status: isFutureDate ? 2 : 1
            };
        }

        setInAppMsgSetting(updatedSetting);
        setFormError(formError => ({
            ...formError,
            [type]: formValidate(type, newDate)
        }));
    };

    const formValidate = (name, value) => {
        const trimmedValue = typeof value === "string" ? value.trim() : String(value || "").trim();
        switch (name) {
            case "from":
                if (inAppMsgSetting.showSender&& !value) {
                    return "Sender is required.";
                }
                return "";
            case "startAt":
                if (!trimmedValue) {
                    return "Start Date is required.";
                }
                return "";
            // case "startTime":
            //     if (!trimmedValue) {
            //         return "Start Time is required.";
            //     }
            //     const startTimeFormat = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/;
            //     if (!startTimeFormat.test(trimmedValue)) {
            //         return "Start Time must be in HH:mm format.";
            //     }
            //     return "";
            // case "endTime":
            //     if (!trimmedValue) {
            //         return "End Time is required.";
            //     }
            //     const endTimeFormat = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/;
            //     if (!endTimeFormat.test(trimmedValue)) {
            //         return "End Time must be in HH:mm format.";
            //     }
            //     return "";
            default:
                return "";
        }
    };

    const createMessage = async () => {

        let validationErrors = {};
        Object.keys(inAppMsgSetting).forEach(name => {
            const error = formValidate(name, inAppMsgSetting[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });

        // if (inAppMsgSetting.showSender && !inAppMsgSetting.from) {
        //     validationErrors["from"] = "Please select a member.";
        // }

        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }

        setIsLoading(true)
        const startAt = inAppMsgSetting?.startAt
            ? moment(inAppMsgSetting.startAt).format('YYYY-MM-DD HH:mm:ss')
            : null;

        const endAt = inAppMsgSetting?.endAt && moment(inAppMsgSetting.endAt).isValid()
            ? moment(inAppMsgSetting.endAt).format('YYYY-MM-DD HH:mm:ss')
            : null;
        const payload = {
            ...inAppMsgSetting,
            startAt: startAt,
            endAt: endAt,
            projectId: projectDetailsReducer.id,
            type: type
        }
        const data = await apiService.createInAppMessage(payload);
        setIsLoading(false);
        if (data.success) {
            toast({description: data.message})
            if (id === "new") {
                navigate(`${baseUrl}/app-message`)
            }
        } else {
            toast({variant: "destructive", description: data.error.message})
        }
    }

    const onUpdateMessage = async () => {

        let validationErrors = {};
        Object.keys(inAppMsgSetting).forEach(name => {
            const error = formValidate(name, inAppMsgSetting[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });

        // f (inAppMsgSetting.showSender && !inAppMsgSetting.from) {
        //     validationErrors["from"] = "Please select a member.";
        // }i

        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }

        if (inAppMsgSetting.type == "3") {
            if (inAppMsgSetting.steps.filter((x) => x.isActive && x.questionType !== 8).length <= 0) {
                toast({variant: "destructive", description: "Add minimum 1 step"})
                return
            }
        }
        const startAt = inAppMsgSetting?.startAt
            ? moment(inAppMsgSetting.startAt).format('YYYY-MM-DD HH:mm:ss')
            : null;

        const endAt = inAppMsgSetting?.endAt && moment(inAppMsgSetting.endAt).isValid()
            ? moment(inAppMsgSetting.endAt).format('YYYY-MM-DD HH:mm:ss')
            : null;
        setIsLoading(true)
        const payload = {
            ...inAppMsgSetting,
            startAt: startAt,
            endAt: endAt,
            type: type,
        }
        const data = await apiService.updateInAppMessage(payload, inAppMsgSetting.id)
        setIsLoading(false)
        if (data.success) {
            toast({description: data.message})
        } else {
            toast({variant: "destructive", description: data.error.message})
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
        setInAppMsgSetting((prev) => {
            const updatedSteps = [...prev.steps];
            updatedSteps[selectedStepIndex] = {
                ...updatedSteps[selectedStepIndex],
                [name]: value,
            };
            return {
                ...prev,
                steps: updatedSteps,
            };
        });
    };

    const onChangeChecklist = (name, value) => {
        const obj = {...selectedStep, [name]: value,}
        setSelectedStep(obj);
        let clone = [...inAppMsgSetting.checklists];
        clone[selectedStepIndex] = obj;
        setInAppMsgSetting(prevState => ({
            ...prevState,
            checklists: clone
        }));
    }

    const handleCancel = () => {
        setInAppMsgSetting(inAppMsgSetting);
        if (id === "new") {
            navigate(`${baseUrl}/app-message/type`)
        } else {
            navigate(`${baseUrl}/app-message`)
        }
    }

    const publishDate = inAppMsgSetting?.startAt ? new Date(inAppMsgSetting?.startAt) : null;
    const isDateDisabled = (date) => {
        return publishDate && date < publishDate;
    };

    return (
        <Fragment>
            <div className={"border-b"}>
                <h5 className={"text-base font-normal border-b px-4 py-3"}>Content</h5>
                <div className={"px-4 py-3 space-y-4"}>

                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="title" className={"font-normal"}>Title</Label>
                        <Input className={"h-9"} id="title" placeholder="Title" value={inAppMsgSetting.title}
                               onChange={(e) => onChange("title", e.target.value)}/>
                    </div>

                    <div className="grid w-full items-center gap-1.5">
                        <div className="flex items-center gap-2">
                            <Checkbox id="showSender"
                                      checked={inAppMsgSetting.showSender}
                                      onCheckedChange={(checked) => onChange("showSender", checked)}
                            />
                            <Label htmlFor="showSender" className={"font-normal cursor-pointer"}>Show sender</Label>
                        </div>
                    </div>

                    {
                        inAppMsgSetting.showSender &&
                        <div className="grid w-full items-center gap-1.5">
                            <Label className={"font-normal"}>From</Label>
                            <Select
                                value={Number(inAppMsgSetting.from)}
                                name={"from"}
                                onValueChange={(value) => onChange("from", value)}
                            >
                                <SelectTrigger className="w-full h-9">
                                    {inAppMsgSetting.from ? (
                                        <SelectValue>
                                            {
                                                allStatusAndTypes.members.find(
                                                    (x) => Number(x.userId) === Number(inAppMsgSetting.from)
                                                )?.firstName
                                            }{" "}
                                            {
                                                allStatusAndTypes.members.find(
                                                    (x) => Number(x.userId) === Number(inAppMsgSetting.from)
                                                )?.lastName
                                            }
                                        </SelectValue>
                                    ) : (
                                        <span className="text-muted-foreground">Select a sender</span>
                                    )}
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {allStatusAndTypes.members.map((x) => (
                                            <SelectItem key={Number(x.userId)} value={Number(x.userId)}>
                                                {x.firstName} {x.lastName}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            {(inAppMsgSetting.showSender && formError?.from) && (
                                <p className="text-red-500 text-sm mt-1">{formError.from}</p>
                            )}
                        </div>
                    }
                    {
                        type === "1" &&
                        <Fragment>
                            <div className="grid w-full items-center gap-1.5">
                                <Label className={"font-normal"}>Reply type</Label>
                                <Select
                                    onValueChange={(value) => onChange("replyType", value)}
                                    value={inAppMsgSetting.replyType}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={"Select reply type"}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={1}>Text</SelectItem>
                                        <SelectItem value={2}>Reaction</SelectItem>
                                        <SelectItem value={null}>None</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </Fragment>
                    }
                    {
                        type === "2" &&
                        <div className="grid w-full items-center gap-1.5">
                            <Label className={"font-normal"}>Action</Label>
                            <Select value={Number(inAppMsgSetting?.actionType)}
                                    onValueChange={(value) => onChange("actionType", value)}>
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
                            <div className="grid w-full items-center gap-1.5">
                                <Label className={"font-normal"}>Action</Label>
                                <Select value={Number(selectedStep?.actionType)}
                                        onValueChange={(value) => onChangeChecklist("actionType", value)}>
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
                                selectedStep?.actionType === 1 &&
                                <Fragment>
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="actionText" className={"font-normal"}>Action Text</Label>
                                        <Input className={"h-9"} id="actionText" placeholder="Enter action text"
                                               value={selectedStep?.actionText}
                                               onChange={(e) => onChangeChecklist("actionText", e.target.value)}/>
                                    </div>

                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="actionUrl" className={"font-normal"}>Action URL</Label>
                                        <Input className={"h-9"} id="actionUrl" placeholder="Enter URL address"
                                               value={selectedStep?.actionUrl}
                                               onChange={(e) => onChangeChecklist("actionUrl", e.target.value)}/>
                                    </div>

                                    <div className="grid w-full items-center gap-1.5">
                                        <div className="flex items-center gap-2">
                                            <Checkbox id="isRedirect"
                                                      checked={selectedStep.isRedirect === 1}
                                                      onCheckedChange={(checked) => onChangeChecklist("isRedirect", checked ? 1 : 0)}
                                            />
                                            <Label htmlFor="isRedirect" className={"font-normal cursor-pointer"}>Open
                                                URL in a new tab</Label>
                                        </div>
                                    </div>
                                </Fragment>
                            }
                        </Fragment>
                    }
                    {
                        (type === "2" && inAppMsgSetting.actionType == 1) && <Fragment>
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="actionText" className={"font-normal"}>Action Text</Label>
                                <Input className={"h-9"} id="actionText" placeholder="Enter action text"
                                       value={inAppMsgSetting.actionText}
                                       onChange={(e) => onChange("actionText", e.target.value)}/>
                            </div>

                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="actionUrl" className={"font-normal"}>Action URL</Label>
                                <Input className={"h-9"} id="actionUrl" placeholder="Enter URL address"
                                       value={inAppMsgSetting.actionUrl}
                                       onChange={(e) => onChange("actionUrl", e.target.value)}/>
                            </div>

                            <div className="grid w-full items-center gap-1.5">
                                <div className="flex items-center gap-2">
                                    <Checkbox id="isRedirect"
                                              checked={inAppMsgSetting.isRedirect === 1}
                                              onCheckedChange={(checked) => onChange("isRedirect", checked ? 1 : 0)}
                                    />
                                    <Label htmlFor="isRedirect" className={"font-normal cursor-pointer"}>Open URL in a
                                        new tab</Label>
                                </div>
                            </div>
                        </Fragment>
                    }
                    {
                        type === "2" && inAppMsgSetting.actionType != 0 &&
                        <div className="grid w-full items-center gap-1.5">
                            <div className="flex items-center gap-2">
                                <Checkbox id="isBannerCloseButton"
                                          checked={inAppMsgSetting.isBannerCloseButton === 1}
                                          onCheckedChange={(checked) => onChange("isBannerCloseButton", checked ? 1 : 0)}
                                />
                                <Label htmlFor="isBannerCloseButton" className={"font-normal cursor-pointer"}>Dismiss
                                    the banner on click</Label>
                            </div>
                        </div>
                    }
                </div>
            </div>

            {
                (selectedStep?.questionType !== 3 && selectedStep?.questionType !== 4 && selectedStep?.questionType !== 8) &&
                <Fragment>
                    {
                        type === "3" &&
                        <div className={"border-b px-4 py-6 space-y-4"}>
                            <h5 className={"text-base font-normal"}>Question Setting</h5>
                            {
                                selectedStep?.questionType === 5 &&
                                <div className="grid w-full items-center gap-1.5">
                                    <Label className={"font-normal text-sm"}>Answer Options</Label>
                                    <div>
                                        <div className={"space-y-[6px]"}>
                                            {(selectedStep?.options || []).map((option, index) => (
                                                <div key={index} className="relative mt-2">
                                                    <Input
                                                        className="h-9 pr-10"
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
                            {(selectedStep?.questionType === 5 || selectedStep?.questionType === 6 || selectedStep?.questionType === 7) && (
                                <div className="grid w-full items-center gap-1.5 mt-2">
                                    <Label className="font-normal text-sm" htmlFor="placeholderText">Placeholder
                                        text</Label>
                                    <Input
                                        value={inAppMsgSetting?.steps[selectedStepIndex]?.placeholderText || ''}
                                        onChange={(e) => onChangeQuestion("placeholderText", e.target.value, selectedStep?.questionType)}
                                        type="text"
                                        className="h-9"
                                        id="placeholderText"
                                        placeholder="Select One..."
                                    />
                                </div>
                            )}
                            {
                                (selectedStep?.questionType === 1 || selectedStep?.questionType === 2) &&
                                <div className={"space-y-3"}>
                                    {
                                        selectedStep?.questionType === 2 &&
                                        <div className={"flex gap-4"}>
                                            <div className="grid w-full items-center gap-1.5">
                                                <Label className={"font-normal text-sm"} htmlFor="startNumber">Start
                                                    Number</Label>
                                                <Input
                                                    value={inAppMsgSetting?.steps?.[selectedStepIndex]?.startNumber || ''}
                                                    name={"startNumber"}
                                                    type="number" id="startNumber" min={0}
                                                    onChange={(e) => onChangeQuestion("startNumber", e.target.value)}
                                                    placeholder="1" className={"h-8"}/>
                                            </div>

                                            <div className="grid w-full items-center gap-1.5">
                                                <Label className={"font-normal text-sm"} htmlFor="endNumber">End
                                                    Number</Label>
                                                <Input
                                                    value={inAppMsgSetting?.steps?.[selectedStepIndex]?.endNumber || ''}
                                                    name={"endNumber"}
                                                    onChange={(e) => onChangeQuestion("endNumber", e.target.value)}
                                                    type="number" id="endNumber" min={0}
                                                    placeholder="10" className={"h-8"}/>
                                            </div>
                                        </div>
                                    }

                                    <div className="grid w-full items-center gap-1.5">
                                        <Label className={"font-normal text-sm"} htmlFor="startLabel">Start
                                            label</Label>
                                        <Input value={inAppMsgSetting?.steps?.[selectedStepIndex]?.startLabel || ''}
                                               onChange={(e) => onChangeQuestion("startLabel", e.target.value)}
                                               type="text"
                                               id="startLabel" placeholder="Very Bad" className={"h-8"}/>
                                    </div>

                                    <div className="grid w-full items-center gap-1.5">
                                        <Label className={"font-normal text-sm"} htmlFor="endLabel">End label</Label>
                                        <Input value={inAppMsgSetting?.steps?.[selectedStepIndex]?.endLabel || ''}
                                               onChange={(e) => onChangeQuestion("endLabel", e.target.value)}
                                               type="text"
                                               id="endLabel" placeholder="Very Good" className={"h-8"}/>
                                    </div>
                                </div>
                            }
                        </div>
                    }
                </Fragment>
            }
            <div className={"border-b px-4 py-6 space-y-4"}>
                <h5 className={"text-base font-normal"}>Style</h5>
                {
                    type === "2" && <Fragment>
                        <div className="grid w-full items-center gap-1.5">
                            <Label className={"font-normal"}>Banner position</Label>
                            <Select
                                value={inAppMsgSetting.position}
                                onValueChange={(value) => onChange("position", value,)}
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

                        <div className="grid w-full items-center gap-1.5">
                            <Label className={"font-normal"}>Alignment</Label>
                            <Select
                                value={inAppMsgSetting.alignment}
                                onValueChange={(value) => onChange("alignment", value,)}
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

                {(inAppMsgSetting.replyType === 1 || inAppMsgSetting.replyType === 2) && (
                    <div className="grid w-full items-center gap-1.5">
                        <Label className={"font-normal"}>Background Color</Label>
                        <div className={"w-full text-sm"}>
                            <ColorInput
                                style={{width: '100%', height: "36px"}}
                                value={inAppMsgSetting.bgColor}
                                onChange={(value) => onChange("bgColor", value.clr)}
                            />
                        </div>
                    </div>
                )}

                {
                    (type === "4" || type === "3" || type === "2") &&
                    <div className="grid w-full items-center gap-1.5">
                        <Label className={"font-normal"}>Text Color</Label>
                        <div className={"w-full text-sm widget-color-picker space-y-2"}>
                            <ColorInput
                                value={inAppMsgSetting.textColor}
                                onChange={(value) => onChange("textColor", value.clr)}
                            />
                        </div>
                    </div>
                }

                {
                    ((type === "1" && inAppMsgSetting?.replyType == 1) || (type === "4" && inAppMsgSetting?.checklists[selectedStepIndex]?.actionType == 1)) &&
                    <div className="grid w-full items-center gap-1.5">
                        <Label className={"font-normal"}>{type === "4" ? "Button Text Color" : "Text Color"}</Label>
                        <div className={"w-full text-sm widget-color-picker space-y-2"}>
                            <ColorInput
                                value={type === "4" ? inAppMsgSetting.btnTextColor : inAppMsgSetting.textColor}
                                onChange={(value) => onChange(type === "4" ? "btnTextColor" : "textColor", value.clr)}
                            />
                        </div>
                    </div>
                }

                {(type === "1" && inAppMsgSetting.replyType === 1) &&
                <div className="grid w-full items-center gap-1.5">
                    <Label className={"font-normal "}>Icon Color </Label>
                    <div className={"w-full text-sm widget-color-picker space-y-2"}>
                        <ColorInput
                            value={inAppMsgSetting.iconColor}
                            onChange={(value) => onChange("iconColor", value.clr)}
                        />
                    </div>
                </div>}

                {
                    ((type === "1") || (type === "4" && inAppMsgSetting?.checklists[selectedStepIndex]?.actionType == 1)) &&
                    <div className="grid w-full items-center gap-1.5">
                        <Label
                            className={"font-normal"}>{type === "4" ? "Button Background Color" : "Close Button Color"} </Label>
                        <div className={"w-full text-sm widget-color-picker space-y-2"}>
                            <ColorInput
                                value={inAppMsgSetting.btnColor}
                                onChange={(value) => onChange("btnColor", value.clr)}
                            />
                        </div>
                    </div>
                }

                {
                    (type === "2" || type === "3") &&
                    <div className="grid w-full items-center gap-1.5">
                        <div className="flex items-center gap-2">
                            <Checkbox id="isCloseButton" checked={inAppMsgSetting.isCloseButton}
                                      onCheckedChange={(checked) => onChange("isCloseButton", checked)}/>
                            <Label htmlFor="isCloseButton" className={"font-normal cursor-pointer"}>Show dismiss
                                button</Label>
                        </div>
                    </div>
                }
            </div>

            <div className={"border-b px-4 py-6 space-y-4"}>
                <h5 className={"text-base font-normal"}>Trigger Setting</h5>
                <div className="grid w-full items-center gap-1.5">
                    <Label className={"font-normal"}>Add delay</Label>
                    <Select value={inAppMsgSetting.delay} onValueChange={(value) => onChange("delay", value,)}>
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

                <div className="grid w-full items-center gap-1.5">
                    <Label className={"font-normal"}>Start sending</Label>
                    <div className={"flex gap-4"}>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="startAt"
                                    variant={"outline"}
                                    className={`w-1/2 h-9 hover:bg-card bg-card justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                    <Fragment>
                                        {(id === 'new' && inAppMsgSetting?.startAt === '') ? 'Select date' : `${inAppMsgSetting?.startAt ? moment(inAppMsgSetting?.startAt).format('D MMM, YYYY') : "Select a date"}`}
                                    </Fragment>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    captionLayout="dropdown"
                                    selected={inAppMsgSetting?.startAt ? new Date(inAppMsgSetting?.startAt) : new Date()}
                                    onSelect={(date) => handleDateChange(date, "startAt")}
                                    startMonth={new Date(2024, 0)}
                                    endMonth={new Date(2050, 12)}
                                    defaultMonth={
                                        inAppMsgSetting?.startAt
                                            ? new Date(inAppMsgSetting?.startAt)
                                            : publishDate || new Date()
                                    }
                                />
                            </PopoverContent>
                        </Popover>
                        <div className="custom-time-picker w-1/2">
                            <Input
                                className={"h-9"}
                                type={"time"}
                                value={moment(inAppMsgSetting.startAt).format("HH:mm")}
                                onChange={(e) => handleTimeChange(e.target.value, 'startAt')}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid w-full items-center gap-1.5">
                    <Label className={"font-normal"} htmlFor="email">Stop sending</Label>
                    <div className={"flex flex-col gap-1"}>
                        <div className={"flex gap-4"}>
                            <div className={"flex flex-col w-full"}>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="endAt"
                                            variant={"outline"}
                                            className={`h-9 justify-start hover:bg-card bg-card text-left font-normal ${!date && "text-muted-foreground"}`}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4"/>
                                            <Fragment>
                                                {(id === 'new' && inAppMsgSetting?.endAt === '') ? 'Select date' : `${inAppMsgSetting?.endAt ? moment(inAppMsgSetting?.endAt).format('D MMM, YYYY') : "Select a date"}`}
                                            </Fragment>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            captionLayout="dropdown"
                                            selected={inAppMsgSetting?.endAt ? new Date(inAppMsgSetting?.endAt) : null}
                                            onSelect={(date) => handleDateChange(date, "endAt")}
                                            endMonth={new Date(2050, 12)}
                                            startMonth={publishDate || new Date()}
                                            disabled={isDateDisabled}
                                            defaultMonth={
                                                inAppMsgSetting?.endAt
                                                    ? new Date(inAppMsgSetting?.endAt)
                                                    : publishDate || new Date()
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className={"flex flex-col w-full"}>
                                <div className="custom-time-picker ">
                                    <Input
                                        className={"h-9"}
                                        type={"time"}
                                        value={moment(inAppMsgSetting.endAt).format("HH:mm")}
                                        onChange={(e) => handleTimeChange(e.target.value, 'endAt')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"px-4 py-6 flex justify-between gap-2"}>
                <Button className={`w-[111px] font-medium hover:bg-primary`}
                        onClick={id === "new" ? createMessage : onUpdateMessage}>
                    {isLoading ? <Loader2 className={"h-4 w-4 animate-spin"}/> : "Save Changes"}
                </Button>
                <Button variant={"ghost hover-none"} className={"font-medium border border-primary text-primary"}
                        onClick={handleCancel}>Cancel</Button>
            </div>
        </Fragment>
    );
};

export default SidebarInAppMessage;