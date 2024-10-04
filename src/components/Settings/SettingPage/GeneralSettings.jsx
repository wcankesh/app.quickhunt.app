import React, {useState, useEffect, Fragment} from 'react';
import {Card, CardContent, CardFooter, CardHeader} from "../../ui/card";
import {Label} from "../../ui/label";
import {Input} from "../../ui/input";
import {Switch} from "../../ui/switch";
import {ApiService} from "../../../utils/ApiService";
import {useToast} from "../../ui/use-toast";
import {useSelector} from "react-redux";
import {Button} from "../../ui/button";
import {Loader2} from "lucide-react";
import ColorInput from "../../Comman/ColorPicker";
import {Checkbox} from "../../ui/checkbox";

const initialState = {
    announcement_title: "",
    btn_background_color: "#7c3aed",
    btn_text_color: "#ffffff",
    header_bg_color: "#FFFFFF",
    header_text_color: "#030712",
    header_btn_background_color: "#7c3aed",
    header_btn_text_color: "#FFFFFF",
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
    let apiSerVice = new ApiService();
    const {toast} = useToast();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);

    let [generalSettingData, setGeneralSettingData] = useState(initialState);
    const [isSave, setIsSave] = useState(false);

    useEffect(() => {
        const getPortalSetting = async () => {
            const data = await apiSerVice.getPortalSetting(projectDetailsReducer.id)
            console.log(data.status)
            if (data.status === 200) {
                setGeneralSettingData(data.data);
                console.log("generalSettingData.header_btn_background_color", data.data.header_btn_background_color)
            } else {

            }
        }
        if (projectDetailsReducer.id) {
            getPortalSetting()
        }
    }, [projectDetailsReducer.id])

    const onChangeSwitch = (name, value) => {
        setGeneralSettingData({...generalSettingData, [name]: value})
    }

    const onChange = (name, value) => {
        setGeneralSettingData({
            ...generalSettingData,
            [name]: value
        });
    };

    const onUpdatePortal = async () => {
        setIsSave(true)
        const payload = {
            ...generalSettingData,
            project_id: projectDetailsReducer.id,
        }
        const data = await apiSerVice.updatePortalSetting(generalSettingData.id, payload)
        if (data.status === 200) {
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

    return (
        <Card className={"divide-y"}>
            <CardHeader className={"gap-1 p-4 md:p-6"}>
                <h3 className={"font-normal text-lg sm:text-2xl"}>General Settings</h3>
            </CardHeader>
            <CardContent className={"p-0 divide-y"}>
                <div className={"space-y-3 p-4 md:p-6"}>
                    <div className={"flex justify-between items-center gap-2"}>
                        <h3 className={"font-normal"}>Announcement</h3>
                        <div className="announce-create-switch flex gap-4">
                            <Switch
                                className="w-[38px] h-[20px]"
                                checked={generalSettingData.is_announcement === 1}
                                onCheckedChange={(checked) => onChangeSwitch("is_announcement", checked ? 1 : 0)}
                            />
                        </div>
                    </div>
                    {
                        generalSettingData.is_announcement === 1 &&
                        <Fragment>
                            <div className={"space-y-3"}>
                                <div className="space-y-1 w-full md:w-1/2">
                                    <Label className="text-sm font-normal">Title</Label>
                                    <Input value={generalSettingData.announcement_title}
                                           onChange={(e) => onChange('announcement_title', e.target.value)}/>
                                </div>
                                <div className={"flex flex-col flex-wrap w-full md:basis-1/2 gap-2"}>
                                    <div className="flex items-center gap-4">
                                        <Checkbox
                                            id="is_reaction"
                                            checked={generalSettingData.is_reaction === 1}
                                            onCheckedChange={(checked) => onChangeSwitch("is_reaction", checked ? 1 : 0)}
                                        />
                                        <label
                                            htmlFor="is_reaction"
                                            className="text-sm text-muted-foreground font-normal"
                                        >
                                            Reactions
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Checkbox
                                            id="is_comment"
                                            checked={generalSettingData.is_comment === 1}
                                            onCheckedChange={(checked) => onChangeSwitch("is_comment", checked ? 1 : 0)}
                                        />
                                        <label
                                            htmlFor="is_comment"
                                            className="text-sm text-muted-foreground font-normal"
                                        >
                                            Show Comment
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    }
                </div>
                <div className={"space-y-3 p-4 md:p-6"}>
                    <div className={"flex justify-between items-center gap-2"}>
                        <h3 className={"font-normal"}>Roadmap</h3>
                        <div className="announce-create-switch flex gap-4">
                            <Switch
                                className="w-[38px] h-[20px]"
                                checked={generalSettingData.is_roadmap === 1}
                                onCheckedChange={(checked) => onChangeSwitch("is_roadmap", checked ? 1 : 0)}

                            />
                        </div>
                    </div>
                    {
                        generalSettingData.is_roadmap === 1 &&
                        <Fragment>
                            <div className={"flex items-center gap-3 flex-wrap md:flex-nowrap"}>
                                <div className="space-y-1 w-full md:basis-1/2">
                                    <Label className="text-sm font-normal">Title</Label>
                                    <Input value={generalSettingData.roadmap_title}
                                           onChange={(e) => onChange('roadmap_title', e.target.value)}/>
                                </div>
                            </div>
                        </Fragment>
                    }

                </div>
                <div className={"space-y-3 p-4 md:p-6"}>
                    <div className={"flex justify-between items-center gap-2"}>
                        <h3 className={"font-normal"}>Ideas</h3>
                        <div className="announce-create-switch flex gap-4">
                            <Switch
                                className="w-[38px] h-[20px]"
                                checked={generalSettingData.is_idea === 1}
                                onCheckedChange={(checked) => onChangeSwitch("is_idea", checked ? 1 : 0)}

                            />
                        </div>
                    </div>
                    {
                        generalSettingData.is_idea === 1 &&
                        <Fragment>
                            <div className={"flex items-center gap-3 flex-wrap md:flex-nowrap"}>
                                <div className="space-y-1 w-full md:basis-1/2">
                                    <Label className="text-sm font-normal">Title</Label>
                                    <Input value={generalSettingData.idea_title}
                                           onChange={(e) => onChange('idea_title', e.target.value)}/>
                                </div>
                            </div>
                        </Fragment>
                    }
                </div>
                <div className={"space-y-3 p-4 md:p-6"}>
                    <h3 className={"font-normal"}>Header Color</h3>
                    <div className={"flex items-center gap-3 flex-wrap md:flex-nowrap"}>
                        <div className={"widget-color-picker space-y-1 w-full md:basis-1/2"}>
                            <Label className={"text-sm font-normal"}>Background Color</Label>
                            <ColorInput name="header_bg_color"
                                        value={generalSettingData.header_bg_color}
                                        onChange={onChange}
                            />
                        </div>
                        <div className={"widget-color-picker space-y-1 w-full md:basis-1/2"}>
                            <Label className={"text-sm font-normal"}>Text Color</Label>
                            <ColorInput name="header_text_color"
                                        value={generalSettingData.header_text_color}
                                        onChange={onChange}
                            />
                        </div>
                    </div>
                    <div className={"flex items-center gap-3 flex-wrap md:flex-nowrap"}>
                        <div className={"widget-color-picker space-y-1 w-full md:basis-1/2"}>
                            <Label className={"text-sm font-normal"}>Button Background Color</Label>
                            <ColorInput
                                name="header_btn_background_color"
                                value={generalSettingData.header_btn_background_color}
                                onChange={onChange}
                            />
                        </div>
                        <div className={"widget-color-picker space-y-1 w-full md:basis-1/2"}>
                            <Label className={"text-sm font-normal"}>Button Text Color</Label>
                            <ColorInput
                                name="header_btn_text_color"
                                value={generalSettingData.header_btn_text_color}
                                onChange={onChange}
                            />
                        </div>
                    </div>
                </div>
                <div className={"space-y-3 p-4 md:p-6"}>
                    <h3 className={"font-normal"}>Global Color</h3>
                    <div className={"flex items-center gap-3 flex-wrap md:flex-nowrap"}>
                        <div className={"widget-color-picker space-y-1 w-full md:basis-1/2"}>
                            <Label className={"text-sm font-normal"}>Button Background Color</Label>
                            <ColorInput
                                name="btn_background_color"
                                value={generalSettingData.btn_background_color}
                                onChange={onChange}
                            />
                        </div>
                        <div className={"widget-color-picker space-y-1 w-full md:basis-1/2"}>
                            <Label className={"text-sm font-normal"}>Button Text Color</Label>
                            <ColorInput
                                name="btn_text_color"
                                value={generalSettingData.btn_text_color}
                                onChange={onChange}
                            />
                        </div>
                    </div>
                </div>
                <div className={"space-y-3 p-4 md:p-6"}>
                    <h3 className={"font-normal"}>Branding</h3>
                    <div className="announce-create-switch flex gap-4">
                        <Switch
                            className="w-[38px] h-[20px]"
                            checked={generalSettingData.is_branding === 1}
                            disabled={userDetailsReducer.plan === 0}
                            onCheckedChange={(checked) => onChangeSwitch("is_branding", checked ? 1 : 0)}

                        />
                        <p className="text-sm text-muted-foreground font-normal">Show Branding</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className={"p-4 md:p-6 justify-end"}>
                <Button
                    className={`py-2 px-6 w-[213px] text-sm font-semibold hover:bg-primary`}
                    onClick={onUpdatePortal}
                >
                    {isSave ? <Loader2 className="h-4 w-4 animate-spin"/> : "Update General Settings"}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default GeneralSettings;