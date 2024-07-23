import React, { useState, Fragment } from 'react';
import {ArrowLeft, ChevronRight, Info, MoveLeft, Plus, Trash2} from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import { Card, CardContent, CardFooter, CardDescription, CardTitle, CardHeader } from "../ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { SelectTrigger, SelectContent, SelectItem, Select, SelectValue } from "../ui/select";
import { SheetContent, SheetFooter, SheetHeader, Sheet, SheetOverlay, SheetTrigger, SheetClose, SheetDescription, SheetTitle, SheetPortal } from "../ui/sheet";
import {useNavigate, useParams} from "react-router-dom";
import { baseUrl } from "../../utils/constent";
import ColorInput from "../Comman/ColorPicker";
import {Textarea} from "../ui/textarea";

const initialSideBar = [
    { title: "Widget type",value: "Widget", },
    { title: "Launcher type",value: "Launcher", },
    { title: "Sections", value: "Sections",},
    { title: "Appearance", value: "Appearance",},
    { title: "Advanced", value: "Advanced",},
];

const cardMap = [
    {title: "Ideas", subText: "Show your Ideas board"},
    {title: "Roadmap", subText: "Show your Roadmap"},
    {title: "Announcements", subText: "Show recent Announcement"},
]

const WidgetSideBar = ({ isOpen, onOpen, onClose }) => {
    let navigate = useNavigate();
    let {id} = useParams();
    const [toggle, setToggle] = useState(false);
    const [showBackButton, setShowBackButton] = useState(false);
    const [selected, setSelected] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [hostnames, setHostnames] = useState([{ id: 1, value: '' }]);

    const handleShowInput = () => {
        setShowInput(true);
        setHostnames([...hostnames, { id: Date.now(), value: '' }]);
    };

    const handleInputChange = (id, value) => {
        const updatedHostnames = hostnames.map((hostname) =>
            hostname.id === id ? { ...hostname, value } : hostname
        );
        setHostnames(updatedHostnames);
    };

    const handleDeleteInput = (id) => {
        const updatedHostnames = hostnames.filter((hostname) => hostname.id !== id);
        setHostnames(updatedHostnames);
    };

    const handleToggle = (val) => {
        setSelected(val)
        setToggle(!toggle);
        setShowBackButton(!showBackButton);
    };

    const renderSidebarItems = () => {
        if (!showBackButton) {
            return (
                <div>
                    {initialSideBar.map((x, index) => (
                        <div key={index} className={"flex justify-between items-center py-8 border-b"}
                             onClick={() => handleToggle(x.value)}>
                            <div className={"flex flex-col gap-3"}>
                                <h4 className={"text-sm"}>{x.title}</h4>
                                <p className={"text-xs"}>Content related to {x.title}</p>
                            </div>
                            <ChevronRight size={16}/>
                        </div>
                    ))}
                </div>
            );
        } else {
            return (
                <div className="transform translate-x-0 transition-transform duration-300 ease-in space-y-7">
                    <div>
                        <Button className={"flex gap-2 px-[6px] py-1 h-auto text-xs font-semibold"} variant={"ghost"}
                                onClick={handleToggle}>
                            <ArrowLeft size={16} className={"text-muted-foreground"}/>Back
                        </Button>
                    </div>
                    {
                        selected === 'Widget' &&
                        <Fragment>
                            <div className={"space-y-7"}>
                                <div className={"flex flex-col gap-3 pb-6 border-b"}>
                                    <Label className={"text-base font-semibold"}>Widget type</Label>
                                    <Select>
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="Popover"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="popover">Popover</SelectItem>
                                            <SelectItem value="modal">Modal</SelectItem>
                                            <SelectItem value="sidebar">Sidebar</SelectItem>
                                            <SelectItem value="embed">Embed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className={"flex flex-col gap-2"}>
                                    <h4 className={"text-xs font-medium"}>Position</h4>
                                    <Label className={"text-xs text-muted-foreground"}>The position of the
                                        sidebar</Label>
                                    <Select>
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="Right"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="left">Left</SelectItem>
                                            <SelectItem value="right">Right</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className={"flex flex-col gap-2"}>
                                    <h4 className={"text-xs font-medium"}>Width</h4>
                                    <Label className={"text-xs text-muted-foreground"}>The width of the sidebar</Label>
                                    <Input placeholder={"450px"}/>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="prevent"/>
                                <label htmlFor="prevent" className="text-xs font-normal">
                                    Prevent window scroll
                                </label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info size={14}/>
                                        </TooltipTrigger>
                                        <TooltipContent className={"w-[224px] bg-card-foreground text-card"}>
                                            <p className={"text-xs text-center"}>Prevent page scrolling while the widget
                                                is open</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="hidebtn"/>
                                <label htmlFor="hidebtn" className="text-xs font-normal">
                                    Hide close button
                                </label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info size={14}/>
                                        </TooltipTrigger>
                                        <TooltipContent className={"w-[224px] bg-card-foreground text-card"}>
                                            <p className={"text-xs text-center"}>The close button will always show when
                                                the widget is full screen</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </Fragment>
                    }

                    {selected === 'Launcher' &&
                    <Fragment>
                        <div className={"space-y-7"}>
                            <div className={"flex flex-col gap-3 pb-6 border-b"}>
                                <Label className={"text-base font-semibold"}>Launcher type</Label>
                                <Select>
                                    <SelectTrigger className="">
                                        <SelectValue placeholder="Tab"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="floating">Floating</SelectItem>
                                        <SelectItem value="tab">Tab</SelectItem>
                                        <SelectItem value="selector">Selector</SelectItem>
                                        <SelectItem value="none">None</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <Label className={"text-xs font-medium"}>Text</Label>
                                <Input placeholder={"What's new"}/>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <Label className={"text-xs font-medium"}>Position</Label>
                                <Select>
                                    <SelectTrigger className="">
                                        <SelectValue placeholder="Right"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="left">Left</SelectItem>
                                        <SelectItem value="right">Right</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="">
                            <Label className={"text-xs font-medium"}>Background color</Label>
                            <ColorInput/>
                        </div>
                        <div className="">
                            <label className="text-xs font-medium">Text color</label>
                            <Select>
                                <SelectTrigger className="">
                                    <SelectValue placeholder="Light"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className={"flex flex-col gap-2"}>
                            <h4 className={"text-xs font-medium"}>Notification badge</h4>
                            <p className={"text-xs text-muted-foreground"}>The unread notification badge that appears
                                next to the launcher. Only available for Announcement widgets.</p>
                            <Select>
                                <SelectTrigger className="">
                                    <SelectValue placeholder="Count"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="count">Count</SelectItem>
                                    <SelectItem value="dot">Dot</SelectItem>
                                    <SelectItem value="none">None</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant={"ghost hover:none"}
                                    className={"text-xs p-0 h-auto text-primary font-semibold justify-end"}>Show</Button>
                        </div>
                    </Fragment>
                    }
                    {selected === 'Sections' &&
                    <Fragment>
                        <div className={"space-y-7"}>
                            <div className={"flex flex-col gap-2"}>
                                <h4 className={"text-base font-semibold"}>Sections</h4>
                                <p className={"text-xs text-muted-foreground"}>Add and remove Widget sections.</p>
                            </div>
                            <div className={"flex flex-col gap-[20px]"}>
                                {
                                    cardMap.map((x, i) => {
                                        return (
                                            <Fragment>
                                                <Card>
                                                    <CardContent className={"py-4 flex justify-between items-center"}>
                                                        <div className={"flex flex-col gap-1"}>
                                                            <h3 className={"text-sm font-medium"}>{x.title}</h3>
                                                            <p className={"text-xs text-muted-foreground"}>{x.subText}</p>
                                                        </div>
                                                        <div className={"flex items-center gap-4"}>
                                                            <Switch id="airplane-mode"
                                                                    className={"widget-switch w-[30px] h-[20px]"}/>
                                                            <ChevronRight size={16}/>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Fragment>
                                        )
                                    })
                                }
                                <p className={"text-xs text-muted-foreground"}><strong>Tip:</strong> Drag and drop
                                    sections to change the display order.</p>
                            </div>
                            <div className={"space-y-3"}>
                                <div className={"flex flex-col gap-2"}>
                                    <Label className={"text-xs font-medium"}>Start page</Label>
                                    <p className={"text-xs text-muted-foreground"}>Choose what section the widget opens
                                        on</p>
                                    <Select>
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="Use first section (default)"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="default">Use first section (default)</SelectItem>
                                            <SelectItem value="roadmap">Roadmap</SelectItem>
                                            <SelectItem value="announcement">Announcement</SelectItem>
                                            <SelectItem value="ideas">Ideas</SelectItem>
                                            <SelectItem value="createidea">Create Idea</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className={"flex items-center gap-2"}>
                                    <Checkbox id="showstart"/>
                                    <label htmlFor="showstart" className="text-xs font-normal">
                                        Show start page on reopen
                                    </label>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                    }
                    {selected === 'Appearance' &&
                    <Fragment>
                        <div className={"space-y-6"}>
                            <div className={"flex flex-col gap-2"}>
                                <h4 className={"text-base font-semibold"}>Appearance</h4>
                                <p className={"text-xs text-muted-foreground"}>Fine tune your Widgets look and feel</p>
                            </div>
                            <div className={"space-y-3"}>
                                <div className={"space-y-2"}>
                                    <Label className={"text-xs font-medium"}>Title</Label>
                                    <Input placeholder={"wcAvi"}/>
                                </div>
                                <div className={"flex items-center gap-2"}>
                                    <Checkbox id="showlogo"/>
                                    <label htmlFor="showlogo" className="text-xs font-normal">
                                        Show company logo
                                    </label>
                                </div>
                            </div>
                            <div className={"space-y-2"}>
                                <Label className={"text-xs font-medium"}>Description</Label>
                                <Textarea
                                    placeholder={"Suggest a feature, read through our Roadmap and check out our latest feature releases."}/>
                            </div>
                            <div className={"space-y-2"}>
                                <Label className={"text-xs font-medium"}>Theme</Label>
                                <Select>
                                    <SelectTrigger className="">
                                        <SelectValue placeholder="Inherit from company"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="inherit">Inherit from company</SelectItem>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="purple">Purple</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className={"space-y-2"}>
                                <Label className={"text-xs font-medium"}>Header background color</Label>
                                <ColorInput/>
                            </div>
                            <div className={"space-y-2"}>
                                <Label className={"text-xs font-medium"}>Header text color</Label>
                                <Select>
                                    <SelectTrigger className="">
                                        <SelectValue placeholder="Dark"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="light">Light</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </Fragment>
                    }
                    {selected === 'Advanced' &&
                    <Fragment>
                        <div className={"space-y-6"}>
                            <div className={"flex flex-col gap-2"}>
                                <h4 className={"text-base font-semibold"}>Advanced</h4>
                                <p className={"text-xs text-muted-foreground"}>Customize advanced settings</p>
                            </div>
                            <div className={"space-y-2"}>
                                <Label className={"text-xs font-medium"}>Navigation</Label>
                                <div className={"flex items-center gap-2"}>
                                    <Checkbox id="openlink"/>
                                    <label htmlFor="openlink" className="text-xs font-normal">
                                        Open links in new window
                                    </label>
                                </div>
                            </div>
                            <div className={"space-y-2"}>
                                <Label className={"text-xs font-medium"}>Powered by Frill</Label>
                                <div className={"flex items-center gap-2"}>
                                    <Checkbox id="hidebrand"/>
                                    <label htmlFor="hidebrand" className="text-xs font-normal">
                                        Hide 'Powered by Frill' branding
                                    </label>
                                </div>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <h4 className={"text-xs font-medium"}>Full screen media query</h4>
                                <Label className={"text-xs font-normal"}>The CSS
                                    <Button variant={"ghost hover:none"}
                                            className={"p-0 text-xs text-primary font-medium h-auto"}>media
                                        query</Button> used to switch to the full screen mode. Leave empty to
                                    disable.</Label>
                                <Input placeholder={"(min-width: 481px)"}/>
                                <p className={"text-xs text-muted-foreground"}><strong>Tip:</strong> Resize the window
                                    to test your Widget in full screen.</p>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <h4 className={"text-xs font-medium"}>Hostname allowlist</h4>
                                <Label className={"text-xs font-normal"}>Limit access to your widget by listing domains
                                    that can access it.</Label>
                                {hostnames.map((hostname) => (
                                    <div key={hostname.id} className="flex gap-2 items-center">
                                        <Input
                                            value={hostname.value}
                                            onChange={(e) => handleInputChange(hostname.id, e.target.value)}
                                            placeholder="Enter hostname"
                                        />
                                        <Button
                                            variant="ghost hover:none"
                                            onClick={() => handleDeleteInput(hostname.id)}
                                            className="p-0 h-auto"
                                        >
                                            <Trash2 size={16} strokeWidth={1}/>
                                        </Button>
                                    </div>
                                ))}
                                    <Button
                                        variant={'ghost hover:none'}
                                        className={
                                            'h-auto p-0 text-xs text-primary gap-1 justify-start'
                                        }
                                        onClick={handleShowInput}
                                    >
                                        <Plus size={12} /> Add hostname
                                    </Button>
                            </div>
                        </div>
                    </Fragment>
                    }
                </div>
            );
        }
    };

    return (
        <Fragment>
            <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
                <div>
                    <SheetContent
                        className={"lg:max-w-[400px] md:max-w-[400px] sm:max-w-[320px] p-0 overflow-y-auto pb-10 bg-card"}
                        side={"left"}>
                        {
                            !showBackButton ? <SheetHeader className={"px-10 py-8"}>
                                <div className={"flex justify-between items-center w-full"}>
                                    <h2 className={"text-2xl font-semibold"}>My new widget</h2>
                                </div>
                            </SheetHeader> : ""
                        }
                        {/*<div className="flex h-full max-h-screen flex-col gap-2 px-10 py-8 pt-0">*/}
                        <div
                            className={`flex h-full max-h-screen flex-col gap-2 ${showBackButton ? "px-10 py-8" : "px-10 py-8 pt-0"} translate-x-0 transition-transform`}>
                            {renderSidebarItems()}
                        </div>
                        <SheetFooter>
                            <div className={"px-4"}>
                                <div className={"space-x-2"}>
                                    <Button className={""} variant={"outline"}
                                            onClick={() => navigate(`${baseUrl}/widgets`)}>
                                        Cancel
                                    </Button>
                                    <Button className={""}>Save</Button>
                                </div>
                            </div>
                        </SheetFooter>
                    </SheetContent>
                </div>
            </Sheet>
        </Fragment>
    );
};

export default WidgetSideBar;
