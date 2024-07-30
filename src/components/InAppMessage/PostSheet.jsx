import React,{Fragment,useState} from 'react';
import {Sheet, SheetContent, SheetHeader} from "../ui/sheet";
import {Button} from "../ui/button";
import {
    ArrowLeft,
    ArrowRight,
    CalendarIcon,
    Circle,
    Clock,
    MessageCircleMore, Paperclip,
    Pencil,
    RotateCcw, Smile,
    X
} from "lucide-react";
import {Card, CardContent, CardHeader} from "../ui/card";
import {useTheme} from "../theme-provider";
import {Select, SelectGroup, SelectValue} from "@radix-ui/react-select";
import {SelectContent, SelectItem, SelectLabel, SelectTrigger} from "../ui/select";
import {Separator} from "../ui/separator";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import ColorInput from "../Comman/ColorPicker";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {cn} from "../../lib/utils";
import {format,addDays} from "date-fns";
import {Calendar} from "../ui/calendar";
import {RadioGroup, RadioGroupItem} from "../ui/radio-group";


const status = [
    {name: "Any", value: 0, fillColor: "", strokeColor: "",},
    {name: "Draft", value: 1, fillColor: "#CF1322", strokeColor: "#CF1322",},
    {name: "Live", value: 2, fillColor: "#CEF291", strokeColor: "#CEF291",},
    {name: "Paused", value: 3, fillColor: "#6392D9", strokeColor: "#6392D9",},
    {name: "Scheduled", value: 4, fillColor: "#63C8D9", strokeColor: "#63C8D9",},
];

const initialState = {
    bg_color:"#ffffff",
    text_color:"#000000",
    icon_color:"#B58FF6"
}


const PostSheet = ({isOpen,onClose,onOpen}) => {
    const {theme}= useTheme();
    const [contentDetail,setContentDetail]=useState(initialState);
    const [date, setDate] = useState([new Date(),addDays(new Date(), 4)]);



    const handleStatusChange = () => {

    }

    return (
        <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
            <SheetContent className={"sm:max-w-[1400px] p-0"}>
                <SheetHeader className={"pl-8 pt-[17px] pb-[17px] pr-[33px]"}>
                    <div className={"flex justify-between items-center"}>
                        <div className={"flex items-center gap-2"}>
                            <ArrowLeft className={`${theme === "dark" ? "" : "text-muted-foreground"}`} size={16} />
                            <div className={"flex items-center gap-4 "}>
                                <h4 className={`${theme === "dark" ? "" : "text-muted-foreground"} text-xl capitalize font-bold`}>Untitled</h4>
                                <Pencil fill={`${theme === "dark" ? "" : "text-muted-foreground"}`} className={`${theme === "dark" ? "" : "text-muted-foreground"}`} size={16} />
                            </div>
                        </div>
                        <div className={"flex flex-row gap-4 items-center"}>
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
                <Separator/>
                <div className={"flex flex-row"}>
                    <div className={"basis-[950px]"}>
                        <Card className={"my-6 mx-4 rounded-md px-4 pt-6 pb-16"}>
                            <Card className={"rounded-md border-b"}>
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
                                <div className={"p-16 bg-[#222222]"}>
                                    <Card className={"rounded-[10px] p-0"}>
                                        <CardHeader className={"flex px-4 pt-4 pb-0 flex-row justify-end"}>
                                            <Button className={`h-4 w-4 p-0 ${theme === "dark" ? "" : "text-muted-foreground"}`} variant={"ghost hover:none"}><X size={16} className={"h-5 w-5"}/></Button>
                                        </CardHeader>
                                        <CardHeader className={"pt-0 flex flex-row items-center"}>
                                            <img className={"h-8 w-8 rounded-full mr-2"} src={"https://avatars.githubusercontent.com/u/124599?v=4&size=40"} alt={"not_found"}/>
                                            <div className={""}>
                                                <div className={"flex flex-row gap-1"}>
                                                    <h5 className={"text-xs leading-5 font-medium"}>Testingapp</h5>
                                                    <h5 className={`text-xs leading-5 font-medium ${theme === "dark" ? "" : "text-muted-foreground"}`}>from webcontrive</h5>
                                                </div>
                                                <h5 className={`text-xs leading-5 font-medium ${theme === "dark" ? "" : "text-muted-foreground"}`}>Active</h5>
                                            </div>
                                        </CardHeader>
                                        <CardContent className={"py-5 pl-8 pr-5 bg-[#EEE4FF] rounded-b-lg flex flex-row justify-between"}>
                                            <div className={""}>
                                                <div className={"flex flex-row gap-3 items-center text-xs"}>
                                                    <MessageCircleMore size={20} className={"text-[#7C3AED]"} />
                                                    <h5 className={"text-[#7C3AED] font-medium"}>Write a reply...</h5>
                                                </div>
                                            </div>
                                            <div className={"flex gap-3 items-center"}>
                                                <Smile  size={20} className={"text-[#7C3AED]"} />
                                                <Paperclip size={20} className={"text-[#7C3AED]"} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </Card>
                        </Card>
                    </div>
                    <div className={"basis-[450px] h-[91.8vh] border-l border-l-[#E4E4E7] overflow-y-auto"}>
                        <div className={"px-8 py-4"}>
                            <h5 className={"text-base font-medium leading-5"}>Content</h5>
                        </div>
                        <Separator/>
                        <div className={"pt-4 px-8 py-8 space-y-6"}>
                            <div className={"space-y-1"}>
                                <Label className={"font-medium"}>From</Label>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Testingapp" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="apple">Testingapp</SelectItem>
                                            <SelectItem value="banana">Testingapp 1</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className={"space-y-1"}>
                                <Label className={"font-medium"}>Reply type</Label>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Text" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="apple">Text</SelectItem>
                                            <SelectItem value="banana">Number</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <h5 className={"text-base font-medium mb-2"}>Style</h5>
                                <div className={"space-y-4"}>
                                    <div className="grid w-full max-w-sm items-center gap-2">
                                        <Label className={"font-normal"} htmlFor="email">Background Color</Label>
                                        <div className={"w-full"}>
                                            <ColorInput style={{width:'100%',height:"36px"}} value={contentDetail.bg_color}
                                                        onChange={(color) => setContentDetail((prevState) => ({
                                                            ...prevState,
                                                            bg_color: color.bg_color
                                                        }))} name={"bg_color"}  />
                                        </div>
                                    </div>


                                    <div className="grid w-full max-w-sm items-center gap-2">
                                        <Label className={"font-normal"} htmlFor="email">Text Color</Label>
                                        <div className={"w-full"}>
                                            <ColorInput style={{width:'100%',height:"36px"}} value={contentDetail.text_color}
                                                        onChange={(color) => setContentDetail((prevState) => ({
                                                            ...prevState,
                                                            text_color: color.text_color
                                                        }))} name={"text_color"}  />
                                        </div>
                                    </div>

                                    <div className="grid w-full max-w-sm items-center gap-2">
                                        <Label className={"font-normal"} htmlFor="email">Icon Color </Label>
                                        <div className={"w-full"}>
                                            <ColorInput style={{width:'100%',height:"36px"}} value={contentDetail.icon_color}
                                                        onChange={(color) => setContentDetail((prevState) => ({
                                                            ...prevState,
                                                            icon_color: color.icon_color
                                                        }))} name={"icon_color"}  />
                                        </div>
                                    </div>

                                    <div className="grid w-full max-w-sm items-center gap-2">
                                        <Label className={"font-normal"} htmlFor="btn_color">Button Color</Label>
                                        <Input type="text" id="btn_color" className={"h-9"} placeholder="Button Color" />
                                    </div>


                                </div>
                            </div>
                        </div>
                        <Separator/>
                        <div className={"px-8 py-4"}>
                            <h5 className={"text-base font-medium leading-5"}>Advanced Settings </h5>
                        </div>
                        <Separator/>
                        <div className={"px-8 py-4"}>
                            <h5 className={"text-base font-medium mb-2"}>Triggers</h5>
                            <div className={"space-y-1"}>
                                <Label className={"font-medium"}>Where to send</Label>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Set Where to send" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="apple">Where to send</SelectItem>
                                            <SelectItem value="banana">Where to send 1</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className={"mt-4"}>
                                <h5 className={"text-sm font-medium"}>Start sending</h5>
                                <div className={"flex flex-row gap-4"}>
                                    <div className={"basis-1/2"}>
                                        <Popover >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="date"
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
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
                                    <div className={"basis-1/2"}>
                                        <Popover >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="date"
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
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
                                <div className={"space-y-1 mt-2 w-2/5"}>
                                    <Label className={"font-medium"}>Add delay</Label>
                                    <Select>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="2 sec" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="apple">2 sec</SelectItem>
                                                <SelectItem value="banana">3 sec</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <h5 className={"text-sm font-medium mt-2"}>Stop sending</h5>
                                <div className={"flex flex-row gap-4"}>
                                    <div className={"basis-1/2"}>
                                        <Popover >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="date"
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
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
                                    <div className={"basis-1/2"}>
                                        <Popover >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="date"
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
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
                                <div className={"mt-6"}>
                                    <h5 className={"text-base font-medium"}>Send more than once</h5>
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

export default PostSheet;