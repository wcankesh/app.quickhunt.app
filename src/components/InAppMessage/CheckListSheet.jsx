import React, {Fragment, useState} from 'react';
import {Sheet, SheetContent, SheetHeader} from "../ui/sheet";
import {ArrowLeft, ArrowRight, CalendarIcon, Circle, Clock, RotateCcw, X} from "lucide-react";
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
import {Input} from "../ui/input";
import {Card, CardContent} from "../ui/card";
import {Progress} from "../ui/progress";
import {Accordion} from "@radix-ui/react-accordion";
import {AccordionContent, AccordionItem, AccordionTrigger} from "../ui/accordion";
import {Checkbox} from "../ui/checkbox";

const status = [
    {name: "Any", value: 0, fillColor: "", strokeColor: "",},
    {name: "Draft", value: 1, fillColor: "#CF1322", strokeColor: "#CF1322",},
    {name: "Live", value: 2, fillColor: "#CEF291", strokeColor: "#CEF291",},
    {name: "Paused", value: 3, fillColor: "#6392D9", strokeColor: "#6392D9",},
    {name: "Scheduled", value: 4, fillColor: "#63C8D9", strokeColor: "#63C8D9",},
];

const initialState ={
    bg_color:"#EEE4FF",
    btn_color:"#7C3AED",
    action:"",
}

const actionList = [
    {
        label: "None (Read only)",
        value: 0
    },
    {
        label: "Add url button",
        value: 1
    },
];

const CheckListSheet = ({isOpen,onClose,onOpen}) => {
    const {theme} =useTheme();
    const [formData,setFormData]=useState(initialState);
    const [date, setDate] = useState([new Date(),addDays(new Date(), 4)]);
    const [openItem,setOpenItem]=useState("item-1");

    const handleStatusChange = () => {

    }

    const onChange = (event) => {
        setFormData({...formData,[event.name]:event.value});
    }
    console.log(formData);

    return (
        <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
            <SheetContent className={"sm:max-w-[1400px] p-0"}>
                <SheetHeader className={"pl-8 pt-[17px] pb-[17px] pr-[33px] border-b"}>
                    <div className={"flex  justify-between items-center"}>
                        <div className={"flex items-center gap-2"}>
                            <ArrowLeft className={`${theme === "dark" ? "" : "text-muted-foreground"}`} size={16} />
                            <div className={"flex items-center gap-4 "}>
                                <h4 className={`${theme === "dark" ? "" : "text-muted-foreground"} text-xl capitalize font-bold underline decoration-dashed underline-offset-4`}>Untitled</h4>
                            </div>
                        </div>
                        <div className={"flex flex-row gap-4 items-center "}>
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
                    <div className={`col-span-8 lg:block hidden border-r lg:overflow-auto  pb-[100px]`}>
                        <Card className={"my-6 mx-4 rounded-md px-4 pt-6 pb-16 "}>
                            <Card className={"rounded-md border-b "}>
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
                                    <div className={"w-[408px] bg-[#EEE4FF] rounded-lg"}>
                                        <div className={"px-4 pt-[18px] flex justify-between items-center"}>
                                            <ArrowLeft className={`${theme === "dark" ? "" : "text-muted-foreground"}`}/>
                                            <h5 className={`text-xl underline underline-offset-4 decoration-dashed ${theme === "dark" ? "" : "text-muted-foreground"}`}>Untitled</h5>
                                            <h5/>
                                        </div>
                                        <h5 className={`text-center mt-3 text-sm ${theme === "dark" ? "" : "text-muted-foreground"}`}>Enter Description (Optional)</h5>
                                        <div className={"pt-8 px-6 pb-6"}>
                                            <div className={"flex flex-row justify-between items-center"}>
                                                <h5 className={"text-xs font-normal"}>20%</h5>
                                                <h5 className={"text-xs font-normal"}>1 of 5 step</h5>
                                            </div>

                                            <Progress value={20} className={"h-2 mb-2 mt-[6px]"} />

                                            <Card className={"rounded-[10px] px-4 pb-6 pt-4"}>
                                                <Accordion type="single" collapsible className="w-full p-1" value={openItem} onValueChange={(value) => setOpenItem(value)}>
                                                    {
                                                        [1,2,3,4,5].map((x)=>{
                                                            return(
                                                                <AccordionItem key={x} className={`my-1 px-4 border rounded-md ${x == openItem ? "border border-solid border-[#7C3AED]" :""}`}  value={x} >
                                                                    <AccordionTrigger className={" "}>
                                                                        <div className="flex items-center space-x-2">
                                                                            <Checkbox id="terms" className={"w-6 h-6"} />
                                                                            <label
                                                                                htmlFor="terms"
                                                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                            >
                                                                               Step ({x})
                                                                            </label>
                                                                        </div>
                                                                    </AccordionTrigger>
                                                                    <AccordionContent>
                                                                        <h5 style={{marginLeft:"32px"}}>Enter Description</h5>
                                                                        <h5 className={"mt-16"}>*Complete Step by clicking Checkbox </h5>
                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            )
                                                        })
                                                    }
                                                </Accordion>
                                            </Card>

                                        </div>
                                    </div>

                                </CardContent>

                            </Card>
                        </Card>
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
                            </div>

                            <div className="flex items-center mt-4 space-x-2">
                                <Switch id="dismiss-btn" />
                                <Label htmlFor="dismiss-btn">Show a dismiss button</Label>
                            </div>
                        </div>
                        <div className={"px-8 py-4 border-b"}>
                            <h5 className={"text-base font-medium leading-5"}>General Settings</h5>
                        </div>

                        <div className={"px-8 pt-4 pb-8 border-b"}>
                            <h5 className={"text-base font-medium leading-5 mb-2"}>Actions</h5>
                            <div className={""}>
                                <div className={"space-y-1"}>
                                    <Label className={"font-medium"}>Link step to Action?</Label>
                                    <Select value={formData.action} onValueChange={(select) => onChange({name: "action", value: select})}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Set Where to send" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {
                                                    (actionList || []).map((x, index) => {
                                                        return (
                                                            <SelectItem key={x.label} value={x.value}>{x.label}</SelectItem>
                                                        )
                                                    })
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>


                                {formData.action === 1 && <Input className={"mt-4 mb-4"} placeholder={"Enter URL Address"}/>}

                                {formData.action === 1 && <div className="flex items-center space-x-2">
                                                            <Switch id="airplane-mode" />
                                                            <Label htmlFor="airplane-mode">Open URL in New page</Label>
                                                        </div>}


                                <div className="flex items-center mt-4 space-x-2">
                                    <Switch id="dismiss-btn" />
                                    <Label htmlFor="dismiss-btn">Allow users to manually Complete Step</Label>
                                </div>


                            </div>

                        </div>

                        <div className={"px-8 py-4 border-b"}>
                            <h5 className={"text-base font-medium leading-5"}>Advanced Settings</h5>
                        </div>

                        <div className={"px-8 pt-4 "}>
                            <h5 className={"text-base font-medium leading-5 mb-3"}>Triggers</h5>
                            <div className={"space-y-4 "}>
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

                                <div className={"space-y-1 "}>
                                    <h5 className={"text-sm font-medium"}>Start sending</h5>
                                    <div className={"space-y-1 flex  flew-row items-centers gap-4"}>

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

                                <div className={"space-y-1 "}>
                                    <h5 className={"text-sm font-medium"}>Stop sending</h5>
                                    <div className={"space-y-1 flex flew-row items-centers gap-4 "}>
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

                            </div>
                        </div>

                        <div className={"px-8 pt-4"}>
                            <h5 className={"text-base font-medium leading-5"}>Send more than once</h5>
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

            </SheetContent>
        </Sheet>
    );
};

export default CheckListSheet;