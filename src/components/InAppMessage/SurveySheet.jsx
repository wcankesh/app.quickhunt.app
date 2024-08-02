import React,{Fragment,useState} from 'react';
import {SheetHeader, Sheet, SheetContent} from "../ui/sheet";
import {
    ArrowLeft,
    ArrowRight,
    CalendarIcon,
    Circle,
    Clock,
    GripVertical,
    Plus,
    RotateCcw,
    Trash2,
    X
} from "lucide-react";
import {useTheme} from "../theme-provider";
import {Select, SelectGroup, SelectValue} from "@radix-ui/react-select";
import {SelectContent, SelectItem, SelectTrigger} from "../ui/select";
import {Button} from "../ui/button";
import {Label} from "../ui/label";
import ColorInput from "../Comman/ColorPicker";
import {Switch} from "../ui/switch";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {cn} from "../../lib/utils";
import {addDays, format} from "date-fns";
import {Calendar} from "../ui/calendar";
import {RadioGroup, RadioGroupItem} from "../ui/radio-group";
import {Card, CardContent} from "../ui/card";
import {Input} from "../ui/input";
import CommanQuestion from "./CommanQuestion";

const status = [
    {name: "Any", value: 0, fillColor: "", strokeColor: "",},
    {name: "Draft", value: 1, fillColor: "#CF1322", strokeColor: "#CF1322",},
    {name: "Live", value: 2, fillColor: "#CEF291", strokeColor: "#CEF291",},
    {name: "Paused", value: 3, fillColor: "#6392D9", strokeColor: "#6392D9",},
    {name: "Scheduled", value: 4, fillColor: "#63C8D9", strokeColor: "#63C8D9",},
];

const initialState = {
    bg_color:"#EEE4FF",
    btn_color:"#7C3AED",
    question_type:0,
    isDismiss:0,
    start_number:null,
    end_number:null,
    start_label:"Very bad",
    end_label:"Very good",
    answer_option:[{
        label:"option 1",
        id:1
    },
    {
     label: "option 2",
     id:2
    }],
    dropdown_placeholder:"",
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
        label:"Drop Down List",
        value:4
    },
    {
        label:"Questions",
        value:5
    },
];



const SurveySheet = ({isOpen,onClose,onOpen}) => {
    const {theme} = useTheme();
    const [formData,setFormData] = useState(initialState);
    const [date, setDate] = useState([new Date(),addDays(new Date(), 4)]);

    const handleStatusChange = () => {}

    const onChange = (event) => {
        setFormData({...formData,[event.name]:event.value});
    };

    const onChangeText = (event) => {
        if(event.target.name == "start_number" || event.target.name == "end_number"){
            setFormData({...formData,[event.target.name]:Number(event.target.value)});
        }
        else{
            setFormData({...formData,[event.target.name]:(event.target.value)});
        }
    }

    console.log(formData);
    
    return (
        <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
            <SheetContent className={"sm:max-w-[1400px] p-0"}>
                <SheetHeader className={" pl-8 pt-[17px] pb-[17px] pr-[33px] border-b"}>
                    <div className={"flex justify-between items-center"}>
                        <div className={"flex items-center gap-2"}>
                            <ArrowLeft className={`${theme === "dark" ? "" : "text-muted-foreground"}`} size={16} />
                            <div className={"flex items-center gap-4 "}>
                                <h4 className={`${theme === "dark" ? "" : "text-muted-foreground"} text-xl capitalize font-bold underline decoration-dashed underline-offset-4`}>Untitled</h4>
                            </div>
                        </div>
                        <div className={"flex flex-row gap-4 items-center  "}>
                            <Select value={1} onValueChange={(value) => handleStatusChange()}>
                                <SelectTrigger className="w-[135px] h-7">
                                    <SelectValue placeholder="Publish"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {
                                            (   status || []).map((x, i) => {
                                                return (
                                                    <Fragment key={i}>
                                                        <SelectItem value={x.value}>
                                                            <div
                                                                className={"flex items-center gap-2"}>
                                                                {x.fillColor && <Circle fill={x.fillColor}
                                                                                        stroke={x.strokeColor}
                                                                                        className={`${theme === "dark" ? "" : "text-muted-foreground"} w-2 h-2`}/>}
                                                                {x.name}
                                                            </div>
                                                        </SelectItem>
                                                    </Fragment>
                                                )
                                            })
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Button>Save Changes</Button>
                            <Button onClick={onClose} className={`h-5 w-5 p-0 ${theme === "dark" ? "" : "text-muted-foreground"}`} variant={"ghost"}><X size={18} className={"h-5 w-5"}/></Button>
                        </div>
                    </div>
                </SheetHeader>
                <div className={"grid lg:grid-cols-12 md:grid-cols-1 overflow-auto h-[100vh]"}>
                    <div className={`col-span-8 lg:block border-r lg:overflow-auto pb-[100px]`}>
                        <CommanQuestion data={formData} />

                        <Card className={"my-6 mx-4 rounded-md "}>
                            <div className={"border-b"}>
                                <div className={"flex justify-between px-6 py-3"}>
                                    <div className={"flex gap-4 items-center"}>
                                        <GripVertical size={20} className={`${theme === "dark" ? "" : "text-muted-foreground"}`} />
                                        <h5 className={"text-base font-medium leading-5"}>Thanks</h5>
                                    </div>
                                    <Trash2 size={16} />
                                </div>
                            </div>

                            <div className={"py-8 px-4"}>
                                <Card>
                                    <div className={"p-4 flex gap-2 border-b"}>
                                        <div className={"w-3 h-3 rounded-full border border-inherit"}/>
                                        <div className={"w-3 h-3 rounded-full border border-inherit"}/>
                                        <div className={"w-3 h-3 rounded-full border border-inherit"}/>
                                    </div>
                                    <div className={"p-2"}>
                                        <div className="flex items-center space-x-3">
                                            <ArrowLeft className={`${theme === "dark" ? "" : "text-muted-foreground"}`}/>
                                            <ArrowRight className={`${theme === "dark" ? "" : "text-muted-foreground"}`} />
                                            <RotateCcw className={`${theme === "dark" ? "" : "text-muted-foreground"}`} />

                                            <div className="flex-grow border border-inherit h-8 rounded-2xl"/>
                                            <div className={"h-7 w-7 rounded-full border border-inherit"}/>
                                        </div>
                                    </div>
                                    <CardContent className={"w-full py-16 bg-[#4e4e4e] rounded-b-lg flex justify-center"}>
                                        <div className={"w-[408px] border-[#EEE4FF] rounded-lg border-[16px]"}>
                                            <div className={`p-8  ${theme === "dark" ? "" : "bg-[#fff]"}`}>
                                                <h5 className={"font-bold text-base mb-3"}>Survey is submitted successfully </h5>
                                                <p className={`text-sm ${theme === "dark" ? "" : "text-muted-foreground"}`}>Thanks for sharing your feedback with us.</p>
                                                <Button className={"h-8 mt-10"}>Done</Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                        </Card>
                        <div className={"flex justify-center"}>
                            <Button className={"h-9"}> <Plus className={"mr-1"} />Add step</Button>
                        </div>

                    </div>
                    <div className={"col-span-4 lg:overflow-auto pb-[100px]"}>
                        <div className={"px-8 py-4 border-b"}>
                            <h5 className={"text-base font-medium leading-5"}>Content</h5>
                        </div>
                        <div className={"px-8 pt-4 pb-8 border-b"}>
                            <h5 className={"text-base font-medium leading-5"}>Customization</h5>

                            <div className={"mt-4 space-y-4"}>
                                <div className="grid w-full max-w-sm items-center gap-2">
                                    <Label className={"font-normal"} htmlFor="email">Background Color</Label>
                                    <div className={"w-full"}>
                                        <ColorInput style={{width:'100%',height:"36px"}} value={formData.bg_color} onChange={(color) => setFormData((prevState) => ({...prevState, bg_color: color.bg_color}))} name={"bg_color"}  />
                                    </div>
                                </div>
                                <div className="grid w-full max-w-sm items-center gap-2">
                                    <Label className={"font-normal"} htmlFor="email">Button Color</Label>
                                    <div className={"w-full"}>
                                        <ColorInput style={{width:'100%',height:"36px"}} value={formData.btn_color} onChange={(color) => setFormData((prevState) => ({...prevState, btn_color: color.btn_color}))} name={"btn_color"}  />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch id="dismiss-btn" checked={formData.isDismiss ===  1} onCheckedChange={(checked)=>onChangeText({target:{name: "isDismiss", value: checked === true ? 1 : 0}})} />
                                    <Label htmlFor="dismiss-btn">Show a dismiss button</Label>
                                </div>
                            </div>
                        </div>

                        <h5 className={"border-b px-8 py-4 text-base font-medium leading-5"}>Question Setting</h5>

                        <div className={"px-8 pt-4 pb-8 border-b"}>
                            <h5 className={"text-base font-medium leading-5"}>Step-1</h5>
                            <div className={"space-y-1"}>
                                <Label className={"font-normal text-sm"}>Question</Label>
                                <Select value={formData.question_type} onValueChange={(select) => onChange({name: "question_type", value: select})}>
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
                                (formData.question_type === 1) && <div className={"flex gap-8 mt-4"}>
                                                                    <div className="grid basis-1/2 items-center gap-1.5">
                                                                        <Label className={"font-normal"} htmlFor="start_number">Start Number</Label>
                                                                        <Input className={"w-full h-9"} value={formData.start_number} name={"start_number"} onChange={(value)=>onChangeText(value)} type="text" id="start_number" placeholder="Start Number" />
                                                                    </div>

                                                                    <div className="grid basis-1/2 items-center gap-1.5">
                                                                        <Label className={"font-normal"} htmlFor="end_number">End Number</Label>
                                                                        <Input className={"w-full h-9"} value={formData.end_number} name={"end_number"} onChange={(value)=>onChangeText(value)} type="text" id="end_number" placeholder="End Number" />
                                                                    </div>
                                                                </div>
                            }
                            {
                                (formData.question_type === 0 || formData.question_type === 1 || formData.question_type === 2 || formData.question_type === 3) ?
                                    <div className={"mt-4 space-y-4"}>
                                        <div className="grid w-full items-center gap-1.5">
                                            <Label className={"font-normal"} htmlFor="start_label">Start label</Label>
                                            <Input className={"w-full h-9"} value={formData.start_label} name={"start_label"} onChange={(value)=>onChangeText(value)} type="text" id="email" placeholder="Very bad" />
                                        </div>

                                        <div className="grid w-full items-center gap-1.5">
                                            <Label className={"font-normal"} htmlFor="end_label">End label</Label>
                                            <Input className={"w-full h-9"} type="text" id="end_label" placeholder="Very good" value={formData.end_label} name={"end_label"} onChange={(value)=>onChangeText(value)} />
                                        </div>
                                    </div> : formData.question_type === 4 ? <div>
                                                                                <div className={"mt-2"}>
                                                                                    <Label className={"font-normal "}>Answer Options</Label>
                                                                                    <div>
                                                                                        {
                                                                                            formData.answer_option.map((x)=>{
                                                                                                return(
                                                                                                    <Card className={"flex px-2 h-9 py-4 items-center mt-2 justify-between"}>
                                                                                                        <h5 className={"text-sm"}>{x.label}</h5>
                                                                                                        <Trash2 size={16}/>
                                                                                                    </Card>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </div>
                                                                                    <div className={"flex flex-row mt-1 justify-end"}>
                                                                                        <Button variant={"outline"} className={"h-9"}>Add Option</Button>
                                                                                    </div>

                                                                                </div>
                                                                                <div className="grid w-full items-center gap-1.5 mt-2">
                                                                                    <Label className={"font-normal"} htmlFor="end_label">Placeholder text</Label>
                                                                                    <Input className={"w-full h-9"} type="text" id="end_label" placeholder="Select One..." />
                                                                                </div>
                                                                            </div>: ""
                            }
                        </div>

                        <h5 className={"border-b px-8 py-4 text-base font-medium leading-5"}>Advanced Settings</h5>

                        <div className={"px-8 pt-4"}>
                            <h5 className={"text-base font-medium leading-5 mb-3"}>Triggers</h5>
                            <div className={"space-y-4"}>
                                <div className={"space-y-1"}>
                                    <Label className={"font-medium text-sm"}>Where to send</Label>
                                    <Select>
                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue placeholder="Set where to send" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="apple">Set where to send</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className={"space-y-1"}>
                                    <h5 className={"text-sm font-medium"}>Start sending</h5>
                                    <div className={"space-y-1 flex flew-row items-centers gap-4"}>

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
                                        <div className={"basis-1/2 m-0"}>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        id="date"
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-8/10 h-9 justify-start text-left font-normal",
                                                            !date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <Clock className="mr-2 h-4 w-4" />
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

                                <div className={"space-y-1"}>
                                    <Label className={"font-medium text-sm"}>Add delay</Label>
                                    <Select>
                                        <SelectTrigger className="w-1/3 h-9">
                                            <SelectValue placeholder="2 sec" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="apple">2 sec</SelectItem>
                                                <SelectItem value="3sec">3 sec</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className={"space-y-1"}>
                                    <h5 className={"text-sm font-medium"}>Stop sending</h5>
                                    <div className={"space-y-1 flex flew-row items-centers gap-4"}>
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
                                        <div className={"basis-1/2 m-0"}>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        id="date"
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-8/10 h-9 justify-start text-left font-normal",
                                                            !date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <Clock className="mr-2 h-4 w-4" />
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

                                <div className={"pt-2"}>
                                    <h5 className={"text-base font-medium leading-5 mb-3"}>Send more than once</h5>
                                    <RadioGroup defaultValue="default">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="default" id="r1" />
                                            <Label htmlFor="r1" className={"text-sm font-normal"}>Send once, first time the person matches the rules</Label>
                                        </div>
                                        <Select>
                                            <SelectTrigger className="w-full h-9">
                                                <SelectValue placeholder="Send on any day, any time" />
                                            </SelectTrigger>
                                            <SelectContent className={""}>
                                                <SelectGroup>
                                                    <SelectItem value="apple">Send on any day, any time</SelectItem>
                                                    <SelectItem value="banana">Send on any day, any time 2</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="comfortable" id="r2" />
                                            <Label htmlFor="r2" className={"text-sm font-normal"}>Send based on a time interval if the person matches the rules</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default SurveySheet;