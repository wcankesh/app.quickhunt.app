import React, {useState, Fragment, useEffect} from 'react';
import {Check, Loader2, Pencil, X} from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { SelectTrigger, SelectContent, SelectItem, Select, SelectValue } from "../ui/select";
import {SheetContent, SheetHeader, Sheet, SheetOverlay} from "../ui/sheet";
import { useNavigate, useParams} from "react-router-dom";
import { baseUrl } from "../../utils/constent";
import ColorInput from "../Comman/ColorPicker";
import {Button} from "../ui/button";
import {ApiService} from "../../utils/ApiService";
import {useToast} from "../ui/use-toast";
import {useSelector} from "react-redux";

const initialState = {
    project_id: "",
    type: "embed",
    popover_width: "340",
    popover_height: "520",
    launcher_icon: "bolt",
    launcher_position: 2,
    launcher_icon_bg_color: "#FD6B65",
    launcher_icon_color: "#ffffff",
    is_idea: true,
    is_roadmap: true,
    is_announcement: true,
    is_navigate: true,
    header_bg_color: "#FD6B65",
    header_text_color: "#ffffff",
    popover_offset: "20",
    modal_width: "640",
    modal_height: "500",
    name: "My new widget",
    sidebar_position: 1,
    sidebar_width: "450",
    idea_title: "Ideas",
    idea_display: 1,
    idea_open: 1,
    idea_button_label: "Add an Idea",
    roadmap_title: "Roadmap",
    roadmap_display: 1,
    roadmap_open: 1,
    changelog_title: "Latest changes",
    changelog_display: 1,
    changelog_open: 1,
    changelog_reaction: 1
}

const UpdateWidget = ({ isOpen, onOpen, onClose,  }) => {
    const navigate = useNavigate();
    let apiSerVice = new ApiService();
    const {toast} = useToast()
    const {id} = useParams()

    const [widgetsSetting, setWidgetsSetting] = useState(initialState);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const [isLoading, setIsLoading] = useState(false);
    const [index, setIndex] = useState(0);
    const [editWidgetName, setEditWidgetName] = useState(false);

    useEffect(() => {
        if (id !== "new") {
            getWidgetsSetting()
        }
    }, [])

    const getWidgetsSetting = async () => {
        setIsLoading(true)
        const data = await apiSerVice.getWidgets(id)
        if (data.status === 200) {
            setWidgetsSetting({...data.data});
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    const onChange = (name, value) => {
        setWidgetsSetting({...widgetsSetting, [name]: value});
        if (
            ["type", "launcher_icon_bg_color", "launcher_icon", "launcher_icon_color",
                "modal_height", "launcher_position", "modal_width", "sidebar_width",
                "sidebar_position", "popover_width", "popover_offset", "popover_height"]
                .includes(name)
        ) {

        } else {
            let newIndex = index + 1;
            setIndex(newIndex);
        }
    };

    const onChangeSwitch = (event, e) => {
        setWidgetsSetting({...widgetsSetting, [event.event1.name]: event.event1.value})
        e.stopPropagation();
    }

    const handleShowInput = (value) => {
        setWidgetsSetting({...widgetsSetting, type: value});
    };

    const createWidget = async () => {
        setIsLoading(true)
        const payload = {
            ...widgetsSetting,
            project_id: projectDetailsReducer.id,
            name: widgetsSetting?.name
        }
        const data = await apiSerVice.createWidgets(payload)
        if (data.status === 200) {
            setIsLoading(false)
            toast({description: data.message})
            if(id === "new"){
                navigate(`${baseUrl}/widget`)
            }

        } else {
            setIsLoading(false)
        }
    }

    const onUpdateWidgets = async () => {
        setIsLoading(true)

        const payload = {
            ...widgetsSetting
        }
        let obj = {
            project_id: projectDetailsReducer.id,
            type: "embed",
            popover_width: "",
            popover_height: "",
            launcher_icon: "",
            launcher_position: 2,
            launcher_icon_bg_color: widgetsSetting.launcher_icon_bg_color,
            launcher_icon_color: widgetsSetting.launcher_icon_color,
            is_idea: true,
            is_roadmap: true,
            is_announcement: true,
            is_navigate: true,
            header_bg_color: widgetsSetting.header_bg_color,
            header_text_color: widgetsSetting.header_text_color,
            popover_offset: "",
            modal_width: "",
            modal_height: "",
            name: widgetsSetting?.name,
            sidebar_position: 1,
            sidebar_width: "",
            idea_title: "",
            idea_display: 1,
            idea_open: 1,
            idea_button_label: "",
            roadmap_title: "",
            roadmap_display: 1,
            roadmap_open: 1,
            changelog_title: "",
            changelog_display: 1,
            changelog_open: 1,
            changelog_reaction: 1
        }
        const data = await apiSerVice.updateWidgets( payload, widgetsSetting.id)

        if (data.status === 200) {
            setIsLoading(false)
            toast({description: data.message})
            if(id === "new"){
                navigate(`${baseUrl}/widget`)
            }
        } else {
            setIsLoading(false)
        }
    }

    const renderSidebarItems = () => {
        return (
            <div>
                <Accordion type="single" defaultValue={"item-1"} collapsible className="w-full">
                    <AccordionItem value="item-1" className={"widget-accordion overflow-hidden"}>
                        <AccordionTrigger className={`hover:no-underline text-[15px] font-medium border-b px-4 py-3`}>Widget Type</AccordionTrigger>
                        <AccordionContent className={"px-4 py-3 space-y-4"}>
                            <div className={"flex flex-col gap-3"}>
                                <Label className={"text-sm font-medium"}>Widget type</Label>
                                <Select onValueChange={(val) => handleShowInput(val)} value={widgetsSetting?.type}>
                                    <SelectTrigger className="">
                                        <SelectValue placeholder="embed"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="embed">Embed</SelectItem>
                                        <SelectItem value="popover">Popover</SelectItem>
                                        <SelectItem value="modal">Modal</SelectItem>
                                        <SelectItem value="sidebar">Sidebar</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {
                                widgetsSetting?.type !== "embed" &&
                                <div className={"space-y-4"}>
                                    <div className={"space-y-2"}>
                                        <Label>Width</Label>
                                        {
                                            widgetsSetting?.type === "popover" &&
                                            <Input type={"number"} value={widgetsSetting.popover_width}
                                                   onChange={(e) => onChange("popover_width", e.target.value)}
                                                   className={"w-full"}/>
                                        }
                                        {
                                            widgetsSetting?.type === "modal" &&
                                            <Input type={"number"} value={widgetsSetting.modal_width}
                                                   onChange={(e) => onChange("modal_width", e.target.value)}
                                                   className={"w-full"}/>
                                        }
                                        {
                                            widgetsSetting?.type === "sidebar" &&
                                            <Input type={"number"} value={widgetsSetting.sidebar_width}
                                                   onChange={(e) => onChange("sidebar_width", e.target.value)}
                                                   className={"w-full"}/>
                                        }
                                    </div>
                                </div>
                            }
                            {
                                widgetsSetting?.type === "popover" &&
                                <div className={"space-y-2"}>
                                    <Label>Height</Label>
                                    <Input type={"number"} value={widgetsSetting.popover_height}
                                           onChange={(e) => onChange('popover_height', e.target.value)}
                                           className={"w-full"}/>
                                </div>
                            }
                            {
                                widgetsSetting?.type === "modal" &&
                                <div className={"space-y-2"}>
                                    <Label>Height</Label>
                                    <Input type={"number"} value={widgetsSetting.modal_height}
                                           onChange={(e) => onChange("modal_height", e.target.value)}
                                           className={"w-full"}/>
                                </div>
                            }
                            {
                                widgetsSetting?.type === "sidebar" &&
                                <div className={"space-y-2"}>
                                    <Label>Position</Label>
                                    <Select
                                        onValueChange={(value) => onChange("sidebar_position", value)}
                                        value={widgetsSetting.sidebar_position}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={1}/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={1}>Left</SelectItem>
                                            <SelectItem value={2}>Right</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            }
                        </AccordionContent>
                    </AccordionItem>
                    {
                        widgetsSetting.type !== "embed" &&
                        <Fragment>
                            <AccordionItem value="item-2" className={"widget-accordion"}>
                                <AccordionTrigger
                                    className={"hover:no-underline text-[15px] font-medium border-b px-4 py-3"}>Launcher Type</AccordionTrigger>
                                <AccordionContent className={"px-4 py-3"}>
                                    <div className={"flex flex-col gap-4"}>
                                        <div className={"space-y-2"}>
                                            <Label className={"text-sm font-medium"}>Icon</Label>
                                            <Select
                                                onValueChange={(value) => onChange("launcher_icon", value)}
                                                value={widgetsSetting.launcher_icon}
                                            >
                                                <SelectTrigger className="">
                                                    <SelectValue placeholder={widgetsSetting?.launcher_icon}/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="bolt">Bolt</SelectItem>
                                                    <SelectItem value="roadmap">Roadmap</SelectItem>
                                                    <SelectItem value="idea">Idea</SelectItem>
                                                    <SelectItem value="announcement">Announcement</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className={"space-y-2"}>
                                            <Label className={"text-sm font-medium"}>Position</Label>
                                            <Select
                                                value={widgetsSetting.launcher_position}
                                                onValueChange={(value) => onChange("launcher_position", value)}
                                            >
                                                <SelectTrigger className="">
                                                    <SelectValue placeholder={1}/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={1}>Bottom Left</SelectItem>
                                                    <SelectItem value={2}>Bottom Right</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className={"widget-color-picker space-y-2"}>
                                            <Label className={"text-sm font-medium"}>Background color</Label>
                                            <ColorInput name="launcher_icon_bg_color"
                                                        value={widgetsSetting.launcher_icon_bg_color}
                                                        onChange={(color) => onChange("launcher_icon_bg_color", color?.launcher_icon_bg_color)}
                                            />
                                        </div>
                                        <div className={"widget-color-picker space-y-2"}>
                                            <Label className={"text-sm font-medium"}>Icon Color</Label>
                                            <ColorInput name="launcher_icon_color"
                                                        value={widgetsSetting.launcher_icon_color}
                                                        onChange={(color) => onChange("launcher_icon_color", color?.launcher_icon_color)}
                                            />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3" className={"widget-accordion"}>
                                <AccordionTrigger
                                    className={"hover:no-underline text-[15px] font-medium border-b px-4 py-3"}>Sections</AccordionTrigger>
                                <AccordionContent className={"px-4 py-3"}>
                                    {/*<Tabs defaultValue="changelog" className="w-[282px]">*/}
                                    <Tabs defaultValue="announcement" className={"flex flex-col gap-4"}>
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value="announcement"
                                                         className={"px-0 text-[12px]"}>Announcement</TabsTrigger>
                                            <TabsTrigger value="roadmap"
                                                         className={"px-0 text-[12px]"}>Roadmap</TabsTrigger>
                                            <TabsTrigger value="ideas"
                                                         className={"px-0 text-[12px]"}>Ideas</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="announcement" className={"m-0 space-y-4"}>
                                            <div className={"space-y-2"}>
                                                <Label className={"text-sm font-medium"}>Title</Label>
                                                <Input value={widgetsSetting.changelog_title}
                                                       onChange={(e) => onChange("changelog_title", e.target.value)}/>
                                            </div>
                                            <div className={"flex flex-col gap-2"}>
                                                <Label className={"text-sm font-medium"}>Display</Label>
                                                <Select
                                                    value={widgetsSetting.changelog_display}
                                                    onValueChange={(value) => onChange("changelog_display", value)}
                                                >
                                                    <SelectTrigger className="">
                                                        <SelectValue placeholder={1}/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value={1}>In Widget</SelectItem>
                                                        <SelectItem value={2}>Link to Platform</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <p className={"text-xs font-medium text-muted-foreground"}>How should
                                                    Announcement be displayed?</p>
                                            </div>
                                            {
                                                widgetsSetting.changelog_display === 2 &&
                                                <div className={"flex flex-col gap-2"}>
                                                    <Label className={"text-sm font-medium"}>Ideas</Label>
                                                    <Select
                                                        value={widgetsSetting.changelog_open}
                                                        onValueChange={(value) => onChange("changelog_open", value)}
                                                    >
                                                        <SelectTrigger className="">
                                                            <SelectValue placeholder={1}/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={1}>Open in Widget</SelectItem>
                                                            <SelectItem value={2}>Link to platform</SelectItem>
                                                            <SelectItem value={3}>Do not open</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <p className={"text-xs font-medium text-muted-foreground"}>How
                                                        should Ideas open in the Announcement?</p>
                                                </div>
                                            }
                                            <div className={"flex flex-col gap-2"}>
                                                <Label className={"text-sm font-medium"}>Reactions</Label>
                                                <Select value={widgetsSetting.changelog_reaction}
                                                        onValueChange={(value) => onChange("changelog_reaction", value)}
                                                >
                                                    <SelectTrigger className="">
                                                        <SelectValue placeholder={1}/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value={1}>Enable Reactions</SelectItem>
                                                        <SelectItem value={2}>Disable Reactions</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <p className={"text-xs font-medium text-muted-foreground"}>Choose
                                                    whether or not reaction are shown</p>
                                            </div>
                                            <div>
                                                <div className={"announce-create-switch flex gap-4"}>
                                                    <Switch className={"w-[38px] h-[20px]"}
                                                            checked={widgetsSetting.is_announcement === 1}
                                                            onCheckedChange={(checked, event) => onChangeSwitch({
                                                                event1: {
                                                                    name: "is_announcement",
                                                                    value: checked ? 1 : 0
                                                                }
                                                            }, event)}
                                                    />
                                                    <p className={"text-sm text-muted-foreground font-medium"}>Show Your
                                                        Announcement</p>
                                                </div>
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="roadmap" className={"m-0 space-y-4"}>
                                            <div className={"space-y-2"}>
                                                <Label className={"text-sm font-medium"}>Title</Label>
                                                <Input value={widgetsSetting.roadmap_title}
                                                       onChange={(e) => onChange("roadmap_title", e.target.value)}
                                                />
                                            </div>
                                            <div className={"flex flex-col gap-3"}>
                                                <Label className={"text-sm font-medium"}>Display</Label>
                                                <Select value={widgetsSetting.roadmap_display}
                                                        onValueChange={(value) => onChange("roadmap_display", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={1}/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value={1}>In Widget</SelectItem>
                                                        <SelectItem value={2}>Link to Platform</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <p className={"text-xs font-medium text-muted-foreground"}>How should
                                                    the Roadmap be displayed?</p>
                                            </div>
                                            {
                                                widgetsSetting.roadmap_display === 2 &&
                                                <div className={"flex flex-col gap-2"}>
                                                    <Label className={"text-sm font-medium"}>Ideas</Label>
                                                    <Select value={widgetsSetting.roadmap_open}
                                                            onValueChange={(value) => onChange("roadmap_open", value)}
                                                    >
                                                        <SelectTrigger className="">
                                                            <SelectValue placeholder={1}/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={1}>Open in Widget</SelectItem>
                                                            <SelectItem value={2}>Link to platform</SelectItem>
                                                            <SelectItem value={3}>Do not open</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <p className={"text-xs font-medium text-muted-foreground"}>How
                                                        should the Ideas open in the Roadmap?</p>
                                                </div>
                                            }
                                            <div>
                                                <div className={"announce-create-switch flex gap-4"}>
                                                    <Switch className={"w-[38px] h-[20px]"}
                                                            checked={widgetsSetting.is_roadmap === 1}
                                                            onCheckedChange={(checked, event) => onChangeSwitch({
                                                                event1: {
                                                                    name: "is_roadmap",
                                                                    value: checked ? 1 : 0
                                                                }
                                                            }, event)}
                                                    />
                                                    <p className={"text-sm text-muted-foreground font-medium"}>Show Your
                                                        Roadmap</p>
                                                </div>
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="ideas" className={"m-0 space-y-4"}>
                                            <div className={"space-y-2"}>
                                                <Label className={"text-sm font-medium"}>Title</Label>
                                                <Input value={widgetsSetting.idea_title}
                                                       onChange={(e) => onChange("idea_title", e.target.value)}
                                                />
                                            </div>
                                            <div className={"flex flex-col gap-3"}>
                                                <Label className={"text-sm font-medium"}>Display</Label>
                                                <Select value={widgetsSetting.idea_display}
                                                        onValueChange={(value) => onChange("idea_display", value)}
                                                >
                                                    <SelectTrigger className="">
                                                        <SelectValue placeholder={1}/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value={1}>In Widget</SelectItem>
                                                        <SelectItem value={2}>Link to Platform</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <p className={"text-xs font-medium text-muted-foreground"}>How should
                                                    Ideas be displayed?</p>
                                            </div>
                                            {
                                                widgetsSetting.idea_display === 2 &&
                                                <div className={"flex flex-col gap-2"}>
                                                    <Label className={"text-sm font-medium"}>Ideas</Label>
                                                    <Select value={widgetsSetting.idea_open}
                                                            onValueChange={(value) => onChange("idea_open", value)}
                                                    >
                                                        <SelectTrigger className="">
                                                            <SelectValue placeholder="Popover"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={1}>Open in Widget</SelectItem>
                                                            <SelectItem value={2}>Link to platform</SelectItem>
                                                            <SelectItem value={3}>Do not open</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <p className={"text-xs font-medium text-muted-foreground"}>How
                                                        should the Ideas open?</p>
                                                </div>
                                            }
                                            <div className={"flex flex-col gap-3"}>
                                                <Label className={"text-sm font-medium"}>Button label</Label>
                                                <Input value={widgetsSetting.idea_button_label}
                                                       name="idea_button_label"
                                                       onChange={(e) => onChange("idea_button_label", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <div className={"announce-create-switch flex gap-4"}>
                                                    <Switch className={"w-[38px] h-[20px]"}
                                                            checked={widgetsSetting.is_idea === 1}
                                                            onCheckedChange={(checked, event) => onChangeSwitch({
                                                                event1: {
                                                                    name: "is_idea",
                                                                    value: checked ? 1 : 0
                                                                }
                                                            }, event)}
                                                    />
                                                    <p className={"text-sm text-muted-foreground font-medium"}>Show Your
                                                        Ideas</p>
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </AccordionContent>
                            </AccordionItem>
                        </Fragment>
                    }
                    <AccordionItem value="item-4" className={"widget-accordion"}>
                        <AccordionTrigger
                            className={"hover:no-underline text-[15px] font-medium border-b px-4 py-3"}>Advanced</AccordionTrigger>
                        <AccordionContent className={"px-4 py-3 space-y-4"}>
                            <div className={"widget-color-picker space-y-2"}>
                                <Label className={"text-sm font-medium"}>Header background color</Label>
                                <ColorInput name="header_bg_color"
                                            onChange={(color) => onChange("header_bg_color", color?.header_bg_color)}
                                            value={widgetsSetting.header_bg_color}
                                />
                            </div>
                            <div className={"widget-color-picker space-y-2"}>
                                <Label className={"text-sm font-medium"}>Header text color</Label>
                                <ColorInput type="color" name="header_text_color"
                                            onChange={(color) => onChange("header_text_color", color?.header_text_color)}
                                            value={widgetsSetting.header_text_color}
                                />
                            </div>
                            {
                                widgetsSetting.type !== "embed" &&
                                <div className="flex flex-col gap-2">
                                    <Label className={"text-sm font-medium"}>Navigation Menu</Label>
                                    <div className={"flex items-center gap-4 m-0"}>
                                        <Checkbox id="terms" checked={widgetsSetting.is_navigate === 1}
                                                  onCheckedChange={(value) => onChange("is_navigate", value ? 1 : 0)}/>
                                        <label
                                            htmlFor="terms"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Open links in new window
                                        </label>
                                    </div>
                                </div>
                            }
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        );
    };

    const handleEditWidgetName = () => {setEditWidgetName(!editWidgetName)};

    const handleBlur = () => {setEditWidgetName(false);};

    return (
        <Fragment>
            <Sheet open={true} onOpenChange={isOpen ? onClose : onOpen}>
                    <SheetContent
                        className={"w-[282px] md:w-[350px] p-0 overflow-y-auto bg-card"}
                        side={"left"}>
                        <SheetHeader className=" px-4 py-3 md:p-4 text-left md:text-center flex-row items-center justify-between border-b">
                            <div className={"flex gap-2 items-center"}>
                            {editWidgetName ? (
                                <Input
                                    value={widgetsSetting?.name}
                                    onChange={(e) => onChange("name", e.target.value)}
                                    className={"text-sm font-medium w-full max-w-[170px] py-[3px] h-auto"}
                                    onBlur={handleBlur}
                                    autoFocus
                                />
                            ) : (<h2 className="text-xl text-left font-medium w-full max-w-[170px]">{widgetsSetting?.name}</h2>)}
                                {editWidgetName ? <Check size={15} className={"cursor-pointer"} /> :<Pencil size={15} className={"cursor-pointer"} onClick={handleEditWidgetName}/>}
                            </div>
                            <X size={18} onClick={() => navigate(`${baseUrl}/widget`)} className="cursor-pointer m-0" />
                        </SheetHeader>
                        <div
                            className={"flex h-full max-h-screen flex-col gap-2 lg:gap-8 widget-update-sheet-height overflow-y-auto"}>
                            {renderSidebarItems()}
                            <div className={"px-4"}>
                                <Button className={"font-semibold w-[128px]"}
                                        onClick={id === "new" ? createWidget : onUpdateWidgets}>
                                    {
                                        isLoading ?
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Save Changes"
                                    }</Button>
                            </div>
                        </div>
                    </SheetContent>
            </Sheet>
            <div className={"max-w-[740px] m-auto"}>asdadas</div>
        </Fragment>
    );
};

export default UpdateWidget;
