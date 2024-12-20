import React, {useState, Fragment, useEffect} from 'react';
import {Loader2} from "lucide-react";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Checkbox} from "../ui/checkbox";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "../ui/breadcrumb";
import {SelectTrigger, SelectContent, SelectItem, Select, SelectValue} from "../ui/select";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {baseUrl} from "../../utils/constent";
import ColorInput from "../Comman/ColorPicker";
import {Button} from "../ui/button";
import {ApiService} from "../../utils/ApiService";
import {useToast} from "../ui/use-toast";
import {useSelector} from "react-redux";
import {ToggleGroup, ToggleGroupItem} from "../ui/toggle-group";
import WidgetPreview from "./WidgetPreview/WidgetPreview";

const initialState = {
    project_id: "",
    type: "embed",
    popover_width: "380",
    popover_height: "620",
    launcher_icon: "bolt",
    launcher_position: 2,
    launcher_icon_bg_color: "#7c3aed",
    launcher_icon_color: "#ffffff",
    launcher_right_spacing: "20",
    launcher_left_spacing: "20",
    launcher_bottom_spacing: "90",
    is_idea: 1,
    is_roadmap: 1,
    is_announcement: 1,
    is_navigate: 1,
    is_launcher_icon: 1,
    header_bg_color: "#ffffff",
    header_text_color: "#000000",
    header_btn_background_color: "#7c3aed",
    header_btn_text_color: "#FFFFFF",
    btn_background_color: "#7c3aed",
    btn_text_color: "#FFFFFF",
    popover_offset: "20",
    modal_width: "640",
    modal_height: "500",
    name: "My new widget",
    sidebar_position: 2,
    sidebar_width: "450",
    idea_title: "Ideas",
    idea_display: 1,
    idea_button_label: "Add an Idea",
    roadmap_title: "Roadmap",
    roadmap_display: 1,
    changelog_title: "Announcement",
    changelog_display: 1,
    changelog_reaction: 0,
    hide_header: 0,
    announcement_description: 0,
    announcement_image: 0,
    idea_description: 0,
    roadmap_image: 0,
    is_comment: 0,
}

const UpdateWidget = () => {
    const location = useLocation();
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo") || 1;
    const navigate = useNavigate();
    let apiSerVice = new ApiService();
    const {toast} = useToast()
    const {id, type} = useParams()
    const [widgetsSetting, setWidgetsSetting] = useState(initialState);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const [loading, setLoading] = useState('');
    const [selectedToggle, setSelectedToggle] = useState('ideas');
    const [index, setIndex] = useState(0);
    const [toggle, setToggle] = useState(true);

    const handleToggle = (value) => {setSelectedToggle(value);};

    useEffect(() => {
        setTimeout(() => {
            document.body.style.pointerEvents = 'auto';
        }, 500)
    }, []);

    useEffect(() => {
        if (id !== "new") {
            getWidgetsSetting()
        }
    }, [getPageNo])

    const getWidgetsSetting = async () => {
        const data = await apiSerVice.getWidgets(id)
        if (data.status === 200) {
            setWidgetsSetting({...data.data});
        } else {

        }
    }

    const onChange = (name, value) => {
        setWidgetsSetting({...widgetsSetting, [name]: value});
        if (
            ["type", "launcher_icon_bg_color", "launcher_icon", "launcher_icon_color",
                "modal_height", "launcher_position", "modal_width", "sidebar_width", "launcher_right_spacing", "launcher_left_spacing",
                "launcher_bottom_spacing", "sidebar_position", "popover_width", "popover_offset", "popover_height"]
                .includes(name)
        ) {

        } else {
            let newIndex = index + 1;
            setIndex(newIndex);
        }
    };

    const onChangeCheckBox = (name, value) => {
        setWidgetsSetting({...widgetsSetting, [name]: value})
        // e.stopPropagation();
    }

    const createWidget = async (loader) => {
        setLoading(loader)
        const payload = {
            ...widgetsSetting,
            project_id: projectDetailsReducer.id,
            name: widgetsSetting?.name,
            type
        }
        const data = await apiSerVice.createWidgets(payload)
        if (data.status === 200) {
            setLoading('')
            toast({description: data.message})
            if (id === "new") {
                navigate(`${baseUrl}/widget`)
            }

        } else {
            setLoading('')
        }
    }

    const handleEsc = (event) => {
        if (event.keyCode === 27) {
            setToggle(false);
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleEsc);
        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, []);

    const onUpdateWidgets = async (loader) => {
        setLoading(loader)
        const payload = {
            ...widgetsSetting,
            type
        }
        const data = await apiSerVice.updateWidgets(payload, widgetsSetting.id)

        if (data.status === 200) {
            setLoading('')
            toast({description: data.message})
        } else {
            setLoading('')
        }
    }

    const renderSidebarItems = () => {
        return (
            <div>
                <div className={"border-b px-4 py-6 space-y-6"}>
                    <div className={"space-y-4"}>
                        <div className={"space-y-2"}>
                            <Label className={"text-sm font-normal"}>Title</Label>
                            <Input
                                value={widgetsSetting?.name}
                                onChange={(e) => onChange("name", e.target.value)}
                                className={"text-sm font-normal w-full h-auto"}
                                autoFocus
                            />
                        </div>
                        {
                            (type !== "embed") &&
                            <div className={"flex gap-2"}>
                                {
                                    (type !== "embed") &&
                                    <div className={"space-y-4 w-1/2"}>
                                        <div className={"space-y-2"}>
                                            <Label className={"font-normal"}>Width</Label>
                                            {
                                                type === "popover" &&
                                                <Input type={"number"} value={widgetsSetting.popover_width} min={0}
                                                       onChange={(e) => onChange("popover_width", e.target.value)}
                                                       className={"w-full"}/>
                                            }
                                            {
                                                type === "modal" &&
                                                <Input type={"number"} value={widgetsSetting.modal_width} min={0}
                                                       onChange={(e) => onChange("modal_width", e.target.value)}
                                                       className={"w-full"}/>
                                            }
                                            {
                                                type === "sidebar" &&
                                                <Input type={"number"} value={widgetsSetting.sidebar_width} min={0}
                                                       onChange={(e) => onChange("sidebar_width", e.target.value)}
                                                       className={"w-full"}/>
                                            }
                                        </div>
                                    </div>
                                }
                                {
                                    (type === "popover" || type === "modal") &&
                                    <div className={"space-y-2 w-1/2"}>
                                        <Label className={"font-normal"}>Height</Label>
                                        {
                                            type === "modal" &&
                                            <Input type={"number"} value={widgetsSetting.modal_height} min={0}
                                                   onChange={(e) => onChange("modal_height", e.target.value)}
                                                   className={"w-full"}/>
                                        }
                                        {
                                            type === "popover" && <Input type={"number"} value={widgetsSetting.popover_height} min={0}
                                                                         onChange={(e) => onChange('popover_height', e.target.value)}
                                                                         className={"w-full"}/>
                                        }
                                    </div>
                                }
                                {
                                    (type === "sidebar") &&
                                    <div className={"space-y-2 w-1/2"}>
                                        <Label className={"font-normal"}>Position</Label>
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
                            </div>
                        }
                    </div>
                </div>
                {
                    type !== "embed" &&
                    <Fragment>
                        <div className={"font-normal border-b px-4 py-3"}>Launcher Type</div>
                        <div className={"px-4 py-3 border-b"}>
                            <div className={"flex flex-col gap-4"}>
                                <div className={"flex gap-2 items-center"}>
                                    <Checkbox
                                        id={"is_launcher_icon"}
                                        checked={widgetsSetting.is_launcher_icon === 1}
                                        onCheckedChange={(checked) => onChangeCheckBox("is_launcher_icon", checked ? 1 : 0)}
                                    />
                                    <label htmlFor="is_launcher_icon" className="text-sm">Show Launcher Icon</label>
                                </div>
                                <div className={"flex gap-2"}>
                                    <div className={"space-y-2 w-1/2"}>
                                        <Label className={"font-normal"}>Icon</Label>
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
                                    <div className={"space-y-2 w-1/2"}>
                                        <Label className={"font-normal"}>Position</Label>
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
                                </div>
                                {
                                    widgetsSetting.launcher_position === 1 &&
                                        <div className={"space-y-2"}>
                                            <Label className={"font-normal"}>Left Spacing</Label>
                                            <Input value={widgetsSetting.launcher_left_spacing}
                                                   type="number" min={0}
                                                   onChange={(e) => onChange("launcher_left_spacing", e.target.value)}
                                                   placeholder="1 px"/>
                                        </div>
                                }
                                {
                                    widgetsSetting.launcher_position === 2 &&
                                        <div className={"space-y-2"}>
                                            <Label className={"font-normal"}>Right Spacing</Label>
                                            <Input value={widgetsSetting.launcher_right_spacing}
                                                   type="number" min={0}
                                                   onChange={(e) => onChange("launcher_right_spacing", e.target.value)}
                                                   placeholder="1 px"/>
                                        </div>
                                }
                                <div className={"space-y-2"}>
                                    <Label className={"font-normal"}>Bottom Spacing</Label>
                                    <Input value={widgetsSetting.launcher_bottom_spacing}
                                           type="number" min={0}
                                           onChange={(e) => onChange("launcher_bottom_spacing", e.target.value)}
                                           placeholder="1 px"/>
                                </div>
                                <div className={"widget-color-picker space-y-2"}>
                                    <Label className={"font-normal"}>Background Color</Label>
                                    <ColorInput
                                        value={widgetsSetting.launcher_icon_bg_color}
                                        onChange={(value) => onChange("launcher_icon_bg_color", value.clr)}
                                    />
                                </div>
                                <div className={"widget-color-picker space-y-2"}>
                                    <Label className={"font-normal"}>Icon Color</Label>
                                    <ColorInput
                                        value={widgetsSetting.launcher_icon_color}
                                        onChange={(value) => onChange("launcher_icon_color", value.clr)}
                                    />
                                </div>
                            </div>
                        </div>
                    </Fragment>
                }
                <div className={"font-normal border-b px-4 py-3"}>Sections</div>
                <div className={"px-4 py-3 space-y-4 border-b"}>
                    <div className={"space-y-2"}>
                        <div className={"flex gap-2 items-center"}>
                            <Checkbox
                                id={"show_hide_header"}
                                checked={widgetsSetting.hide_header === 1}
                                onCheckedChange={(checked) => onChangeCheckBox("hide_header", checked ? 1 : 0)}
                            />
                            <label htmlFor="show_hide_header" className="text-sm">Show header</label>
                        </div>
                    </div>

                    <ToggleGroup type="single" className={"justify-between gap-2"}
                                 onValueChange={handleToggle}>
                        <ToggleGroupItem value="ideas" className={`w-full px-[9px] h-8 text-[12px] ${selectedToggle === 'ideas' ? 'bg-muted' : ''}`}>Ideas</ToggleGroupItem>
                        <ToggleGroupItem value="roadmap"
                                         className={`w-full px-[9px] h-8 text-[12px] ${selectedToggle === 'roadmap' ? 'bg-muted' : ''}`}>Roadmap</ToggleGroupItem>
                        <ToggleGroupItem value="announcement"
                            className={`w-full px-[9px] h-8 text-[12px] ${selectedToggle === 'announcement' ? 'bg-muted' : ''}`}>Announcement</ToggleGroupItem>

                    </ToggleGroup>

                    {/* Content for Announcement */}
                    {selectedToggle === 'announcement' && (
                        <div className="space-y-4">
                            <div className={"flex gap-2 items-center"}>
                                <Checkbox
                                    id={"show_hide_announcement"}
                                    checked={widgetsSetting.is_announcement === 1}
                                    onCheckedChange={(checked) => onChangeCheckBox("is_announcement", checked ? 1 : 0)}
                                />
                                <label htmlFor="show_hide_announcement" className="text-sm">Show
                                    Announcement</label>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <Checkbox
                                    disabled={widgetsSetting.is_announcement !== 1}
                                    id={"show_hide_announcement_description"}
                                    checked={widgetsSetting.announcement_description === 1}
                                    onCheckedChange={(checked) => onChangeCheckBox("announcement_description", checked ? 1 : 0)}
                                />
                                <label htmlFor="show_hide_announcement_description" className="text-sm">Show
                                    Description</label>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <Checkbox
                                    disabled={widgetsSetting.is_announcement !== 1}
                                    id={"show_hide_announcement_image"}
                                    checked={widgetsSetting.announcement_image === 1}
                                    onCheckedChange={(checked) => onChangeCheckBox("announcement_image", checked ? 1 : 0)}
                                />
                                <label htmlFor="show_hide_announcement_image" className="text-sm">Show
                                    Image</label>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <Checkbox
                                    disabled={widgetsSetting.is_announcement !== 1}
                                    id={"show_hide_changelog_reaction"}
                                    checked={widgetsSetting.changelog_reaction === 1}
                                    onCheckedChange={(checked) => onChangeCheckBox("changelog_reaction", checked ? 1 : 0)}
                                />
                                <label htmlFor="show_hide_changelog_reaction" className="text-sm">Show
                                    Reaction</label>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <Checkbox
                                    id={"is_comment"}
                                    disabled={widgetsSetting.is_announcement !== 1}
                                    checked={widgetsSetting.is_comment === 1}
                                    onCheckedChange={(checked) => onChangeCheckBox("is_comment", checked ? 1 : 0)}
                                />
                                <label htmlFor="is_comment" className="text-sm">Show Comment</label>
                            </div>
                            <div className="space-y-2">
                                <Label className={"font-normal"}>Title</Label>
                                <Input value={widgetsSetting.changelog_title}
                                       disabled={widgetsSetting.is_announcement !== 1}
                                       onChange={(e) => onChange("changelog_title", e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className={"font-normal"}>Display</Label>
                                <Select value={widgetsSetting.changelog_display}
                                        disabled={widgetsSetting.is_announcement !== 1}
                                        onValueChange={(value) => onChange("changelog_display", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={1}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={1}>In Widget</SelectItem>
                                        <SelectItem value={2}>Link to Platform</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs font-normal text-muted-foreground">How should
                                    Announcement be displayed?</p>
                            </div>
                        </div>
                    )}

                    {/* Content for Roadmap */}
                    {selectedToggle === 'roadmap' && (
                        <div className="space-y-4">
                            <div className={"flex gap-2 items-center"}>
                                <Checkbox
                                    id={"show_hide_roadmap"}
                                    checked={widgetsSetting.is_roadmap === 1}
                                    onCheckedChange={(checked) => onChangeCheckBox("is_roadmap", checked ? 1 : 0)}
                                />
                                <label htmlFor="show_hide_roadmap" className="text-sm">Show Roadmap</label>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <Checkbox
                                    disabled={widgetsSetting.is_roadmap !== 1}
                                    id={"show_hide_roadmap_description"}
                                    checked={widgetsSetting.roadmap_image === 1}
                                    onCheckedChange={(checked) => onChangeCheckBox("roadmap_image", checked ? 1 : 0)}
                                />
                                <label htmlFor="show_hide_roadmap_description" className="text-sm">Show
                                    Image</label>
                            </div>
                            <div className="space-y-2">
                                <Label className={"font-normal"}>Title</Label>
                                <Input value={widgetsSetting.roadmap_title}
                                       disabled={widgetsSetting.is_roadmap !== 1}
                                       onChange={(e) => onChange("roadmap_title", e.target.value)}/>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label className={"font-normal"}>Display</Label>
                                <Select value={widgetsSetting.roadmap_display}
                                        disabled={widgetsSetting.is_roadmap !== 1}
                                        onValueChange={(value) => onChange("roadmap_display", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={1}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={1}>In Widget</SelectItem>
                                        <SelectItem value={2}>Link to Platform</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs font-normal text-muted-foreground">How should the
                                    Roadmap be displayed?</p>
                            </div>
                        </div>
                    )}

                    {/* Content for Ideas */}
                    {selectedToggle === 'ideas' && (
                        <div className="space-y-4">
                            <div className={"flex gap-2 items-center"}>
                                <Checkbox
                                    id={"show_hide_idea"}
                                    checked={widgetsSetting.is_idea === 1}
                                    onCheckedChange={(checked) => onChangeCheckBox("is_idea", checked ? 1 : 0)}
                                />
                                <label htmlFor="show_hide_idea" className="text-sm">Show Ideas</label>
                            </div>
                            <div className={"flex gap-2 items-center"}>
                                <Checkbox
                                    disabled={widgetsSetting.is_idea !== 1}
                                    id={"show_hide_idea_description"}
                                    checked={widgetsSetting.idea_description === 1}
                                    onCheckedChange={(checked) => onChangeCheckBox("idea_description", checked ? 1 : 0)}
                                />
                                <label htmlFor="show_hide_idea_description" className="text-sm">Show
                                    Description</label>
                            </div>
                            <div className="space-y-2">
                                <Label className={"font-normal"}>Title</Label>
                                <Input value={widgetsSetting.idea_title} disabled={widgetsSetting.is_idea !== 1}
                                       onChange={(e) => onChange("idea_title", e.target.value)}/>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label className={"font-normal"}>Display</Label>
                                <Select value={widgetsSetting.idea_display}
                                        disabled={widgetsSetting.is_idea !== 1}
                                        onValueChange={(value) => onChange("idea_display", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={1}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={1}>In Widget</SelectItem>
                                        <SelectItem value={2}>Link to Platform</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs font-normal text-muted-foreground">How should
                                    Ideas be displayed?</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label className={"font-normal"}>Button Label</Label>
                                <Input value={widgetsSetting.idea_button_label} name="idea_button_label"
                                       disabled={widgetsSetting.is_idea !== 1}
                                       onChange={(e) => onChange("idea_button_label", e.target.value)}/>
                            </div>
                        </div>
                    )}
                </div>
                <div className={"hover:no-underline font-normal border-b px-4 py-3"}>Advanced</div>
                <div className={"p-0"}>

                    <div className={"px-4 py-3 space-y-4 border-b"}>
                            <div className={"widget-color-picker space-y-2"}>
                                <Label className={"font-normal"}>Header Background Color</Label>
                                <ColorInput
                                    onChange={(value) => onChange("header_bg_color", value.clr)}
                                    value={widgetsSetting.header_bg_color}
                                />
                            </div>
                            <div className={"widget-color-picker space-y-2"}>
                                <Label className={"font-normal"}>Header Text Color</Label>
                                <ColorInput
                                    onChange={(value) => onChange("header_text_color", value.clr)}
                                    value={widgetsSetting.header_text_color}
                                />
                            </div>
                            <div className={"widget-color-picker space-y-2"}>
                                <Label className={"font-normal"}>Header Button Background Color</Label>
                                <ColorInput
                                    onChange={(value) => onChange("header_btn_background_color", value.clr)}
                                    value={widgetsSetting.header_btn_background_color}
                                />
                            </div>
                            <div className={"widget-color-picker space-y-2"}>
                                <Label className={"font-normal"}>Header Button Text Color</Label>
                                <ColorInput
                                    onChange={(value) => onChange("header_btn_text_color", value.clr)}
                                    value={widgetsSetting.header_btn_text_color}
                                />
                            </div>
                        </div>
                    <div className={"px-4 py-3 space-y-4"}>
                        <div className={"widget-color-picker space-y-2"}>
                            <Label className={"font-normal"}>Button Background Color</Label>
                            <ColorInput
                                onChange={(value) => onChange("btn_background_color", value.clr)}
                                value={widgetsSetting.btn_background_color}
                            />
                        </div>
                        <div className={"widget-color-picker space-y-2"}>
                            <Label className={"font-normal"}>Button Text Color</Label>
                            <ColorInput
                                onChange={(value) => onChange("btn_text_color", value.clr)}
                                value={widgetsSetting.btn_text_color}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const onToggle = () => {setToggle(!toggle)}

    const handleCancel = () => {
        setWidgetsSetting(initialState);
        navigate(`${baseUrl}/widget`)
    }

    const launcherIcon = {
        "bolt": <svg fill="#fff" width="20" height="20" viewBox="0 0 32 32">
            <path
                d="m6.98592 18.5024h7.60558l-4.014 10.8001c-.5212 1.4026.9155 2.132 1.845.9959l12.2254-15.1623c.2394-.2946.3521-.5611.3521-.8696 0-.519-.3944-.9117-.9718-.9117h-7.6057l4.0141-10.80017c.5211-1.40262-.9296-2.131982-1.8451-.99586l-12.2253 15.16233c-.23944.2945-.3662.561-.3662.8696 0 .5189.40845.9117.98592.9117z"
                fill={widgetsSetting?.launcher_icon_color}/>
        </svg>,
        "roadmap": <svg width="20" height="20" viewBox="0 0 14 16" fill="none">
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M0.743328 1.66619C0.855828 1.24514 1.11112 0.876257 1.46554 0.62263C1.81996 0.369002 2.25148 0.246389 2.68631 0.275761C3.12114 0.305133 3.53226 0.484665 3.84935 0.783651C4.16644 1.08264 4.36981 1.4825 4.42466 1.91486L11.018 3.68152C11.396 3.77801 11.751 3.94854 12.0626 4.18325C12.3742 4.41796 12.6361 4.71217 12.8331 5.04883C13.0301 5.38549 13.1584 5.75791 13.2105 6.14451C13.2625 6.53111 13.2373 6.92419 13.1364 7.30098C13.0354 7.67777 12.8607 8.03078 12.6223 8.33955C12.3839 8.64831 12.0866 8.90669 11.7476 9.09972C11.4086 9.29274 11.0347 9.41657 10.6475 9.46403C10.2603 9.51149 9.86756 9.48163 9.49199 9.37619L3.97866 7.89886C3.60524 7.79878 3.20735 7.85115 2.87254 8.04444C2.53772 8.23773 2.2934 8.5561 2.19333 8.92953C2.09325 9.30295 2.14562 9.70084 2.33891 10.0357C2.53219 10.3705 2.85057 10.6148 3.22399 10.7149L9.55866 12.4115C9.82827 12.0641 10.2111 11.8222 10.6407 11.7278C11.0702 11.6335 11.5192 11.6927 11.9096 11.8952C12.3 12.0977 12.607 12.4307 12.7773 12.8361C12.9476 13.2416 12.9703 13.6939 12.8416 14.1144C12.7128 14.5349 12.4407 14.897 12.0726 15.1376C11.7046 15.3783 11.2637 15.4823 10.8269 15.4315C10.3901 15.3807 9.98487 15.1784 9.68178 14.8598C9.37868 14.5412 9.19687 14.1263 9.16799 13.6875L2.87999 12.0022C2.16506 11.8106 1.55551 11.3429 1.18544 10.7019C0.815365 10.0609 0.715086 9.29913 0.906661 8.58419C1.09824 7.86926 1.56597 7.25971 2.20697 6.88963C2.84797 6.51956 3.60973 6.41928 4.32466 6.61086L9.83799 8.08819C10.0444 8.14821 10.2607 8.16642 10.4742 8.14175C10.6877 8.11709 10.8941 8.05004 11.0814 7.94454C11.2687 7.83905 11.433 7.69722 11.5647 7.52739C11.6965 7.35756 11.793 7.16313 11.8486 6.95552C11.9042 6.7479 11.9178 6.53127 11.8886 6.31833C11.8594 6.10539 11.7879 5.90042 11.6785 5.71545C11.569 5.53047 11.4237 5.36922 11.2511 5.24113C11.0785 5.11304 10.8821 5.0207 10.6733 4.96953L4.11333 3.21219C3.86279 3.57844 3.49082 3.84431 3.06318 3.96278C2.63554 4.08125 2.17978 4.04469 1.7765 3.85956C1.37321 3.67444 1.04838 3.35267 0.859431 2.95117C0.670483 2.54966 0.629594 2.09427 0.743994 1.66553L0.743328 1.66619Z"
                  fill={widgetsSetting?.launcher_icon_color}/>
        </svg>,
        "idea": <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path
                d="M11.19 1.64922L12.0133 0.309221C12.059 0.234503 12.119 0.169547 12.1898 0.118085C12.2607 0.0666235 12.341 0.0296712 12.4262 0.0093514C12.5114 -0.0109684 12.5998 -0.0142549 12.6862 -0.000319406C12.7727 0.0136161 12.8555 0.044499 12.93 0.0905545C13.0047 0.13629 13.0695 0.196308 13.121 0.26717C13.1724 0.338032 13.2093 0.418343 13.2296 0.503501C13.2499 0.588659 13.2532 0.676988 13.2393 0.763427C13.2254 0.849865 13.1946 0.932713 13.1487 1.00722L12.3253 2.34722C12.2797 2.42199 12.2198 2.48701 12.1489 2.53854C12.0781 2.59007 11.9978 2.62709 11.9126 2.64747C11.8274 2.66785 11.739 2.6712 11.6526 2.65731C11.5661 2.64342 11.4832 2.61258 11.4087 2.56656C11.334 2.52082 11.2691 2.4608 11.2177 2.38994C11.1663 2.31908 11.1294 2.23877 11.1091 2.15361C11.0888 2.06845 11.0854 1.98012 11.0993 1.89368C11.1132 1.80724 11.144 1.72373 11.19 1.64922ZM3.618 2.34656C3.66241 2.42379 3.72186 2.49134 3.79282 2.54521C3.86378 2.59909 3.94482 2.63819 4.03115 2.66021C4.11748 2.68223 4.20735 2.68672 4.29545 2.67342C4.38354 2.66012 4.46808 2.6293 4.54406 2.58278C4.62004 2.53625 4.68593 2.47497 4.73782 2.40255C4.78972 2.33013 4.82657 2.24804 4.84621 2.16114C4.86584 2.07423 4.86786 1.98427 4.85213 1.89658C4.83641 1.80888 4.80327 1.72523 4.75467 1.65056L3.93267 0.309888C3.83891 0.162083 3.69079 0.0570779 3.52028 0.017543C3.34978 -0.021992 3.17056 0.00711512 3.02133 0.09858C2.87209 0.190045 2.76482 0.33653 2.72266 0.506408C2.6805 0.676287 2.70684 0.855931 2.796 1.00655L3.618 2.34656ZM2.16067 3.81856L0.961999 3.24456C0.883129 3.20647 0.797503 3.18436 0.710052 3.17951C0.622602 3.17465 0.535055 3.18715 0.452454 3.21627C0.369853 3.24539 0.29383 3.29057 0.228763 3.3492C0.163696 3.40783 0.110872 3.47876 0.0733322 3.55789C0.0355152 3.63681 0.0136218 3.7224 0.00890339 3.80979C0.00418499 3.89717 0.0167341 3.98463 0.0458335 4.06716C0.0749328 4.14969 0.120012 4.22567 0.178494 4.29077C0.236976 4.35587 0.307714 4.40881 0.386666 4.44656L1.58533 5.02056C1.66419 5.05849 1.74976 5.08049 1.83714 5.0853C1.92452 5.09011 2.01198 5.07763 2.09453 5.04859C2.17708 5.01954 2.25309 4.9745 2.3182 4.91604C2.38332 4.85758 2.43626 4.78684 2.474 4.70789C2.51182 4.62897 2.53371 4.54338 2.53843 4.45599C2.54315 4.36861 2.5306 4.28115 2.5015 4.19862C2.4724 4.11609 2.42732 4.0401 2.36884 3.975C2.31036 3.9099 2.23962 3.8563 2.16067 3.81856ZM7.90933 2.66722C4.23333 2.72789 1.32 6.71189 3.316 10.5492C3.61933 11.1319 4.06933 11.6199 4.55267 12.0646C4.736 12.2332 4.878 12.4419 4.99933 12.6659H7.33333V9.20989C6.94451 9.07284 6.60763 8.81882 6.36891 8.4827C6.13018 8.14658 6.00132 7.74482 6 7.33256C6 7.15575 6.07024 6.98618 6.19526 6.86115C6.32029 6.73613 6.48985 6.66589 6.66667 6.66589C6.84348 6.66589 7.01305 6.73613 7.13807 6.86115C7.26309 6.98618 7.33333 7.15575 7.33333 7.33256C7.33333 7.50937 7.40357 7.67894 7.52859 7.80396C7.65362 7.92899 7.82319 7.99922 8 7.99922C8.17681 7.99922 8.34638 7.92899 8.4714 7.80396C8.59643 7.67894 8.66667 7.50937 8.66667 7.33256C8.66667 7.15575 8.7369 6.98618 8.86193 6.86115C8.98695 6.73613 9.15652 6.66589 9.33333 6.66589C9.51014 6.66589 9.67971 6.73613 9.80474 6.86115C9.92976 6.98618 10 7.15575 10 7.33256C9.99868 7.74482 9.86981 8.14658 9.63109 8.4827C9.39237 8.81882 9.05549 9.07284 8.66667 9.20989V12.6659H10.9787C11.1307 12.4052 11.3267 12.1592 11.5833 11.9452C12.0227 11.5786 12.436 11.1699 12.69 10.6572C13.848 8.31522 13.3887 5.81789 11.7393 4.19656C11.2354 3.6987 10.6369 3.30682 9.97913 3.04404C9.32133 2.78127 8.61755 2.65358 7.90933 2.66722ZM5.328 14.1852C5.27467 15.1626 6.00667 15.9999 6.98533 15.9999H8.99933C9.2182 15.9999 9.43493 15.9568 9.63714 15.873C9.83935 15.7893 10.0231 15.6665 10.1778 15.5117C10.3326 15.357 10.4554 15.1732 10.5391 14.971C10.6229 14.7688 10.666 14.5521 10.666 14.3332V13.9999H5.32067C5.32067 14.0626 5.332 14.1212 5.328 14.1852ZM15.942 3.53322C15.9062 3.45332 15.8549 3.38129 15.7912 3.32125C15.7275 3.26122 15.6525 3.21437 15.5706 3.1834C15.4887 3.15242 15.4015 3.13794 15.314 3.14077C15.2265 3.1436 15.1404 3.16369 15.0607 3.19989L13.7727 3.78122C13.6899 3.81521 13.6149 3.86551 13.552 3.92912C13.4891 3.99273 13.4396 4.06835 13.4065 4.15147C13.3735 4.23459 13.3575 4.32352 13.3595 4.41295C13.3615 4.50239 13.3815 4.5905 13.4183 4.67204C13.4551 4.75359 13.5079 4.82689 13.5736 4.88759C13.6393 4.94829 13.7166 4.99515 13.8008 5.02537C13.885 5.05558 13.9744 5.06855 14.0637 5.06348C14.153 5.05842 14.2404 5.03543 14.3207 4.99589L15.6087 4.41456C15.6885 4.37867 15.7605 4.32739 15.8205 4.26364C15.8804 4.19989 15.9273 4.12494 15.9582 4.04306C15.9892 3.96119 16.0037 3.87401 16.0009 3.78653C15.9981 3.69904 15.9781 3.61296 15.942 3.53322Z"
                fill={widgetsSetting?.launcher_icon_color}/>
        </svg>,
        "announcement": <svg width="20" height="20" viewBox="0 0 16 12" fill="none">
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M4.15825 8.58002L5.47465 10.8601C5.66003 11.1812 5.549 11.5956 5.2279 11.781C4.90681 11.9663 4.49244 11.8553 4.30703 11.5342L2.81931 8.95739C3.26575 8.83255 3.71069 8.70092 4.15822 8.57999L4.15825 8.58002ZM13.4787 6.20083C13.461 6.19065 13.4454 6.17708 13.433 6.1609C13.4205 6.14471 13.4113 6.12623 13.406 6.10651C13.4007 6.08679 13.3993 6.06621 13.4019 6.04595C13.4045 6.02568 13.4111 6.00614 13.4213 5.98842C13.4315 5.97071 13.4451 5.95517 13.4612 5.9427C13.4774 5.93023 13.4959 5.92107 13.5156 5.91575C13.5354 5.91042 13.5559 5.90903 13.5762 5.91165C13.5965 5.91428 13.616 5.92087 13.6337 5.93105L15.0671 6.75861C15.0848 6.76879 15.1003 6.78236 15.1128 6.79854C15.1253 6.81473 15.1344 6.83321 15.1398 6.85293C15.1451 6.87266 15.1465 6.89324 15.1439 6.9135C15.1412 6.93376 15.1346 6.9533 15.1245 6.97102C15.1143 6.98873 15.1007 7.00427 15.0845 7.01674C15.0684 7.02921 15.0499 7.03837 15.0301 7.0437C15.0104 7.04902 14.9898 7.05041 14.9696 7.04779C14.9493 7.04516 14.9298 7.03857 14.9121 7.02839L13.4787 6.20083ZM12.7127 2.49189C12.7025 2.50961 12.6889 2.52514 12.6727 2.53761C12.6565 2.55008 12.6381 2.55924 12.6183 2.56457C12.5986 2.5699 12.578 2.57129 12.5578 2.56866C12.5375 2.56604 12.518 2.55945 12.5002 2.54927C12.4825 2.53909 12.467 2.52552 12.4545 2.50934C12.4421 2.49315 12.4329 2.47467 12.4276 2.45495C12.4222 2.43522 12.4209 2.41464 12.4235 2.39438C12.4261 2.37412 12.4327 2.35458 12.4429 2.33686L13.2704 0.903486C13.291 0.867711 13.3249 0.841568 13.3648 0.830808C13.4046 0.820048 13.4471 0.825553 13.4828 0.846111C13.5186 0.86667 13.5448 0.900598 13.5555 0.940432C13.5663 0.980266 13.5608 1.02274 13.5402 1.05852L12.7127 2.49189ZM13.8635 4.18827C13.8437 4.19356 13.8231 4.1949 13.8028 4.19221C13.7825 4.18952 13.7629 4.18286 13.7451 4.1726C13.7274 4.16234 13.7119 4.14869 13.6994 4.13242C13.6869 4.11616 13.6778 4.0976 13.6725 4.0778C13.6672 4.058 13.6659 4.03736 13.6686 4.01704C13.6712 3.99673 13.6779 3.97714 13.6882 3.9594C13.6984 3.94167 13.7121 3.92612 13.7283 3.91366C13.7446 3.90119 13.7632 3.89206 13.783 3.88677L15.3817 3.45839C15.4015 3.4531 15.4221 3.45176 15.4424 3.45445C15.4628 3.45714 15.4823 3.4638 15.5001 3.47406C15.5178 3.48432 15.5334 3.49797 15.5458 3.51424C15.5583 3.5305 15.5674 3.54906 15.5727 3.56886C15.578 3.58866 15.5793 3.6093 15.5767 3.62962C15.574 3.64993 15.5673 3.66952 15.557 3.68726C15.5468 3.70499 15.5331 3.72054 15.5169 3.733C15.5006 3.74547 15.482 3.7546 15.4622 3.75989L13.8635 4.18827ZM9.39394 0.149768C9.07569 0.235049 8.88506 0.565174 8.97034 0.883424L11.1975 9.19546C11.2828 9.51371 11.6129 9.7043 11.9312 9.61905C12.2494 9.53377 12.44 9.20361 12.3548 8.88539L10.1276 0.57333C10.0423 0.255111 9.71219 0.0645177 9.39394 0.149768ZM4.8765 8.07789L4.05494 5.01183C3.23087 5.26717 2.38594 5.45196 1.55244 5.67527C0.735904 5.89405 0.246842 6.74111 0.480404 7.61271C0.713967 8.4843 1.561 8.97333 2.37753 8.75455C3.21106 8.53121 4.03512 8.26877 4.8765 8.07789ZM4.35234 4.91583C6.63315 4.14852 8.12178 2.86549 8.86487 1.69714L10.6993 8.54349C9.47162 7.90324 7.5409 7.53642 5.18203 8.0123L4.35234 4.9158V4.91583ZM11.2901 3.70424L12.0903 3.71133C12.1615 3.71195 12.2214 3.75833 12.2398 3.82714L12.5572 5.01146C12.5756 5.08024 12.5469 5.15033 12.4856 5.18652L11.7961 5.59274L11.2901 3.70424Z"
                  fill={widgetsSetting?.launcher_icon_color}/>
        </svg>
    }

    return (
        <Fragment>
            <div className={"p-4 md:py-6 md:px-4 border-b flex items-center justify-between flex-wrap gap-2"}>
                <Breadcrumb>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className={"cursor-pointer"}>
                                <BreadcrumbLink>
                                        <span
                                            onClick={id === 'new' ? () => navigate(`${baseUrl}/widget/type`) : () => navigate(`${baseUrl}/widget?pageNo=${getPageNo}`)}>
                                        {type === 'embed' && 'Embed Widget'}
                                            {type === 'popover' && 'Popover Widget'}
                                            {type === 'modal' && 'Modal Widget'}
                                            {type === 'sidebar' && 'Sidebar Widget'}
                                        </span>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem className={"cursor-pointer"}>
                                <BreadcrumbPage>{widgetsSetting.name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </Breadcrumb>
                <div className={"hidden md:flex justify-between gap-2 items-center"}>
                <Button className={"font-medium w-[115px] hover:bg-primary"}
                        onClick={() => id === "new" ? createWidget('head') : onUpdateWidgets('head')}>
                    {
                        loading === 'head' ?
                            <Loader2
                                className="h-4 w-4 animate-spin"/> : (id === "new" ? "Create Widget" : "Save Changes")
                    }
                </Button>
                    <Button variant={"ghost hover-none"} className={"font-medium border border-primary text-primary"} onClick={handleCancel}>Cancel</Button>
                </div>
            </div>
            <div className={"flex h-[calc(100%_-_85px)] overflow-y-auto"}>
                <div className={"max-w-[407px] w-full border-r h-full overflow-y-auto"}>
                    {renderSidebarItems()}
                    <div className={"px-4 py-6 border-t flex justify-between gap-2"}>
                        <Button className={"font-medium w-[115px] hover:bg-primary"}
                                onClick={() => id === "new" ? createWidget('side') : onUpdateWidgets('side')}>
                            {
                                loading === 'side' ?
                                    <Loader2
                                        className="h-4 w-4 animate-spin"/> : (id === "new" ? "Create Widget" : "Save Changes")
                            }
                        </Button>
                        <Button variant={"ghost hover-none"} className={"font-medium border border-primary text-primary"} onClick={handleCancel}>Cancel</Button>
                    </div>
                </div>
                <div className={"bg-muted w-full h-full hidden md:block overflow-y-auto relative"}>
                    {
                        (type !== "embed" && widgetsSetting?.is_launcher_icon == 1) &&
                        <div className='QH-floating-trigger' onClick={onToggle} style={{
                            backgroundColor: widgetsSetting.launcher_icon_bg_color,
                            left: (widgetsSetting.launcher_position === 1)
                                ? (type === "popover" ? `${widgetsSetting.launcher_left_spacing || 20}px` : `${widgetsSetting.launcher_left_spacing || 690}px`)
                                : "inherit",
                            right: (widgetsSetting.launcher_position === 2)
                                ? `${widgetsSetting.launcher_right_spacing || 20}px`
                                : "inherit",
                            // bottom: (widgetsSetting.launcher_bottom_spacing) ? `${widgetsSetting.launcher_bottom_spacing || "20"}px` : "inherit",
                            bottom: (widgetsSetting.launcher_bottom_spacing) ? `${widgetsSetting.launcher_bottom_spacing}` : "20px",
                            position: (type === "popover" || type === "sidebar" || type === "modal") ? "absolute" : "fixed",
                        }}>
                            {
                                launcherIcon[widgetsSetting.launcher_icon]
                            }
                        </div>
                    }
                    <WidgetPreview widgetsSetting={widgetsSetting} type={type} toggle={toggle} onToggle={onToggle}/>
                </div>
            </div>
        </Fragment>
    );
};

export default UpdateWidget;
