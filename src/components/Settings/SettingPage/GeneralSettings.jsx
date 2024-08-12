import React, {useState, useEffect, Fragment} from 'react';
import {Card, CardContent, CardFooter, CardHeader} from "../../ui/card";
import {Label} from "../../ui/label";
import {Input} from "../../ui/input";
import {Switch} from "../../ui/switch";
import {useTheme} from "../../theme-provider";
import {ApiService} from "../../../utils/ApiService";
import {useToast} from "../../ui/use-toast";
import {useSelector} from "react-redux";
import {Button} from "../../ui/button";
import {Loader2} from "lucide-react";
import ColorInput from "../../Comman/ColorPicker";

const initialState = {
    announcement_title: "",
    btn_background_color: "",
    btn_text_color: "",
    header_bg_color: "#FFFFFF",
    header_text_color: "#030712",
    idea_title: "",
    is_announcement: 1,
    is_branding: 1,
    is_comment: 1,
    is_idea: 1,
    is_reaction: 1,
    is_roadmap: 1,
    roadmap_title: "",
}

const GeneralSettings = () => {
    const {onProModal} = useTheme()
    let apiSerVice = new ApiService();
    const {toast} = useToast();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);
    const [generalSettingData, setGeneralSettingData] = useState(initialState);
    const [isSave, setIsSave] = useState(false);

    useEffect(() => {
        getPortalSetting()
    }, [projectDetailsReducer.id])

    const getPortalSetting = async () => {
        const data = await apiSerVice.getPortalSetting(projectDetailsReducer.id)
        if(data.status === 200){
            setGeneralSettingData({...data.data})
        } else {

        }
    }

    const onChangeSwitch = (event, e) => {
        if (userDetailsReducer.plan !== 0){
            setGeneralSettingData({...generalSettingData, [event.event1.name]: event.event1.value})
        }
        setGeneralSettingData({...generalSettingData, [event.event1.name]: event.event1.value})
        e.stopPropagation();
    }

    const onChange = (name, value) => {
        setGeneralSettingData({
            ...generalSettingData,
            [name]: value
        });
    };

    const onUpdatePortal = async () => {
        if(userDetailsReducer.plan === 0){
            onProModal(true)
        } else {
            setIsSave(true)
            const payload = {
                project_id: projectDetailsReducer.id,
                announcement_title: generalSettingData.announcement_title,
                btn_background_color: generalSettingData.btn_background_color,
                btn_text_color: generalSettingData.btn_text_color,
                header_bg_color: generalSettingData.header_bg_color,
                header_text_color: generalSettingData.header_text_color,
                idea_title: generalSettingData.idea_title,
                is_announcement: generalSettingData.is_announcement,
                is_branding: generalSettingData.is_branding,
                is_comment: generalSettingData.is_comment,
                is_idea: generalSettingData.is_idea,
                is_reaction: generalSettingData.is_reaction,
                is_roadmap: generalSettingData.is_roadmap,
                roadmap_title: generalSettingData.roadmap_title,
            }
            const data = await apiSerVice.updatePortalSetting(generalSettingData.id, payload)
            if(data.status === 200){
                setIsSave(false)
                toast({
                    description: data.message
                })
            } else {
                setIsSave(false);
                toast({
                    description: data.message,
                    variant: "destructive"
                })
            }
        }

    }

    return (
        <div>
            <Card>
                <CardHeader className={"gap-1 border-b p-4 sm:p-6"}>
                    <h3 className={"font-medium text-lg sm:text-2xl"}>General Settings</h3>
                </CardHeader>
                <CardContent className={"p-0"}>
                    <div className={"space-y-3 p-4 px-6 border-b"}>
                        <div className={"flex justify-between"}>
                        <h3 className={"font-medium"}>Announcement</h3>
                        <div className="announce-create-switch flex gap-4">
                            <Switch
                                className="w-[38px] h-[20px]"
                                checked={generalSettingData.is_announcement === 1}
                                onCheckedChange={(checked, event) => onChangeSwitch({
                                    event1: {
                                        name: "is_announcement",
                                        value: checked ? 1 : 0
                                    }
                                }, event)}
                            />
                        </div>
                        </div>
                        {
                            generalSettingData.is_announcement === 1 &&
                                <Fragment>
                                    <div className={"space-y-3"}>
                                        <div className="space-y-1 w-full md:basis-1/2">
                                            <Label className="text-sm font-normal">Title</Label>
                                            <Input value={generalSettingData.announcement_title}  onChange={(e) => onChange('announcement_title', e.target.value )} />
                                        </div>
                                        <div className={"flex flex-col flex-wrap w-full md:basis-1/2 gap-2"}>
                                            <div className="announce-create-switch flex gap-4">
                                                <Switch
                                                    className="w-[38px] h-[20px]"
                                                    checked={generalSettingData.is_reaction === 1}
                                                    onCheckedChange={(checked, event) => onChangeSwitch({
                                                        event1: {
                                                            name: "is_reaction",
                                                            value: checked ? 1 : 0
                                                        }
                                                    }, event)}
                                                />
                                                <p className="text-sm text-muted-foreground font-medium">Reactions</p>
                                            </div>
                                            <div className="announce-create-switch flex gap-4">
                                                <Switch
                                                    className="w-[38px] h-[20px]"
                                                    checked={generalSettingData.is_comment === 1}
                                                    onCheckedChange={(checked, event) => onChangeSwitch({
                                                        event1: {
                                                            name: "is_comment",
                                                            value: checked ? 1 : 0
                                                        }
                                                    }, event)}
                                                />
                                                <p className="text-sm text-muted-foreground font-medium">Show Your Comment</p>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                        }
                    </div>
                    <div className={"space-y-3 p-4 px-6 border-b"}>
                        <div className={"flex justify-between"}>
                            <h3 className={"font-medium"}>Roadmap</h3>
                            <div className="announce-create-switch flex gap-4">
                                <Switch
                                    className="w-[38px] h-[20px]"
                                    checked={generalSettingData.is_roadmap === 1}
                                    onCheckedChange={(checked, event) => onChangeSwitch({
                                        event1: {
                                            name: "is_roadmap",
                                            value: checked ? 1 : 0
                                        }
                                    }, event)}
                                />
                            </div>
                        </div>
                        {
                            generalSettingData.is_roadmap === 1 &&
                                <Fragment>
                                    <div className={"flex items-center gap-3 flex-wrap md:flex-nowrap"}>
                                        <div className="space-y-1 w-full md:basis-1/2">
                                            <Label className="text-sm font-normal">Title</Label>
                                            <Input value={generalSettingData.roadmap_title} onChange={(e) => onChange('roadmap_title', e.target.value )} />
                                        </div>
                                    </div>
                                </Fragment>
                        }

                    </div>
                    <div className={"space-y-3 p-4 px-6 border-b"}>
                        <div className={"flex justify-between"}>
                            <h3 className={"font-medium"}>Ideas</h3>
                            <div className="announce-create-switch flex gap-4">
                                <Switch
                                    className="w-[38px] h-[20px]"
                                    checked={generalSettingData.is_idea === 1}
                                    onCheckedChange={(checked, event) => onChangeSwitch({
                                        event1: {
                                            name: "is_idea",
                                            value: checked ? 1 : 0
                                        }
                                    }, event)}
                                />
                            </div>
                        </div>
                        {
                            generalSettingData.is_idea === 1 &&
                                <Fragment>
                                    <div className={"flex items-center gap-3 flex-wrap md:flex-nowrap"}>
                                        <div className="space-y-1 w-full md:basis-1/2">
                                            <Label className="text-sm font-normal">Title</Label>
                                            <Input value={generalSettingData.idea_title} onChange={(e) => onChange('idea_title', e.target.value )} />
                                        </div>
                                    </div>
                                </Fragment>
                        }
                    </div>
                    <div className={"space-y-3 p-4 px-6 border-b"}>
                        <h3 className={"font-medium"}>Setting Color</h3>
                            <div className={"flex items-center gap-3 flex-wrap md:flex-nowrap"}>
                        <div className={"widget-color-picker space-y-2 w-full md:basis-1/2"}>
                            <Label className={"text-sm font-normal"}>Header Background Color</Label>
                            <ColorInput name="header_bg_color"
                                        value={generalSettingData.header_bg_color}
                                        onChange={(color) => onChange("header_bg_color", color?.header_bg_color)}
                            />
                        </div>
                        <div className={"widget-color-picker space-y-2 w-full md:basis-1/2"}>
                            <Label className={"text-sm font-normal"}>Header Text Color</Label>
                            <ColorInput name="header_text_color"
                                        value={generalSettingData.header_text_color}
                                        onChange={(color) => onChange("header_text_color", color?.header_text_color)}
                            />
                        </div>
                        </div>
                        <div className={"flex items-center gap-3 flex-wrap md:flex-nowrap"}>
                        <div className={"widget-color-picker space-y-2 w-full md:basis-1/2"}>
                            <Label className={"text-sm font-normal"}>Button Background Color</Label>
                            <ColorInput
                                name="btn_background_color"
                                value={generalSettingData.btn_background_color}
                                onChange={(color) => onChange("btn_background_color", color?.btn_background_color)}
                            />
                        </div>
                        <div className={"widget-color-picker space-y-2 w-full md:basis-1/2"}>
                            <Label className={"text-sm font-normal"}>Button Text Color</Label>
                            <ColorInput
                                name="btn_text_color"
                                value={generalSettingData.btn_text_color}
                                onChange={(color) => onChange("btn_text_color", color?.btn_text_color)}
                            />
                        </div>
                        </div>
                    </div>
                    <div className={"space-y-3 p-4 px-6 border-b"}>
                        <h3 className={"font-medium"}>Branding</h3>
                        <div className="announce-create-switch flex gap-4">
                            <Switch
                                className="w-[38px] h-[20px]"
                                checked={generalSettingData.is_branding === 1}
                                disabled={userDetailsReducer.plan === 0}
                                onCheckedChange={(checked, event) => onChangeSwitch({
                                    event1: {
                                        name: "is_branding",
                                        value: checked ? 1 : 0
                                    }
                                }, event)}
                            />
                            <p className="text-sm text-muted-foreground font-medium">Show Branding</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className={"p-4 sm:p-6 justify-end"}>
                    <Button
                        className={`${isSave === true ? "py-2 px-6" : "py-2 px-6 "} w-[213px] text-sm font-semibold`}
                        onClick={onUpdatePortal}>{isSave ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update General Settings"} </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default GeneralSettings;