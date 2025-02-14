import React, {useState, useEffect, Fragment} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../ui/card";
import {Label} from "../../ui/label";
import {Input} from "../../ui/input";
import {Switch} from "../../ui/switch";
import {ApiService} from "../../../utils/ApiService";
import {useToast} from "../../ui/use-toast";
import {useSelector} from "react-redux";
import {Button} from "../../ui/button";
import {Eye, EyeOff, Loader2} from "lucide-react";
import ColorInput from "../../Comman/ColorPicker";
import {Checkbox} from "../../ui/checkbox";
import {Select, SelectValue} from "@radix-ui/react-select";
import {SelectContent, SelectItem, SelectTrigger} from "../../ui/select";
import {timeZoneJson} from "../../../utils/constent";
import {useTheme} from "../../theme-provider";

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
    private_mode: 0,
    password: '',
    roadmap_title: "",
    timezone: "Asia/Kolkata",
}

const GeneralSettings = () => {
    const {theme} = useTheme();
    let apiSerVice = new ApiService();
    const {toast} = useToast();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);

    let [generalSettingData, setGeneralSettingData] = useState(initialState);
    const [isSave, setIsSave] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState(initialState);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    useEffect(() => {
        const getPortalSetting = async () => {
            const data = await apiSerVice.getPortalSetting(projectDetailsReducer.id)
            if (data.status === 200) {
                setGeneralSettingData(data.data);
            } else {

            }
        }
        if (projectDetailsReducer.id) {
            getPortalSetting()
        }
    }, [projectDetailsReducer.id])

    const formValidate = (name, value) => {
        switch (name) {
            case "password":
                if (value?.trim() === "") return "Password is required";
                if (
                    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
                )
                    return "Password must be at least 8 characters with one uppercase letter, one lowercase letter, one number, and one special character";
                return "";
            default:
                return "";
        }
    };

    const onChange = (name, value) => {
        setGeneralSettingData({
            ...generalSettingData,
            [name]: value
        });
        // setFormError({
        //     ...formError,
        //     [name]: formValidate(name, value)
        // });
    };

    const onUpdatePortal = async () => {
        // let validationErrors = {};
        // Object.keys(generalSettingData).forEach(name => {
        //     const error = formValidate(name, generalSettingData[name]);
        //     if (error && error.length > 0) {
        //         validationErrors[name] = error;
        //     }
        // });
        // if (Object.keys(validationErrors).length > 0) {
        //     setFormError(validationErrors);
        //     return;
        // }
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

    const initialStateFields = [
        {
            title: "Announcement",
            nameSwitch: "is_announcement",
            input: [
                {
                    field: "text",
                    label: "Title",
                    name: "announcement_title",
                },
                {
                    field: "checkbox",
                    label: "Reactions",
                    name: "is_reaction",
                },
                {
                    field: "checkbox",
                    label: "Show Comment",
                    name: "is_comment",
                },
            ],
        },
        {
            title: "Roadmap",
            nameSwitch: "is_roadmap",
            input: [
                {
                    field: "text",
                    label: "Title",
                    name: "roadmap_title",
                },
            ],
        },
        {
            title: "Ideas",
            nameSwitch: "is_idea",
            input: [
                {
                    field: "text",
                    label: "Title",
                    name: "idea_title",
                },
            ],
        },
        {
            title: "Header Color",
            input: [
                {
                    field: "color",
                    label: "Background Color",
                    name: "header_bg_color",
                    value: "header_bg_color",
                },
                {
                    field: "color",
                    label: "Text Color",
                    name: "header_text_color",
                },
                {
                    field: "color",
                    label: "Button Background Color",
                    name: "header_btn_background_color",
                },
                {
                    field: "color",
                    label: "Button Text Color",
                    name: "header_btn_text_color",
                },
            ],
        },
        {
            title: "Global Color",
            input: [
                {
                    field: "color",
                    label: "Button Background Color",
                    name: "btn_background_color",
                },
                {
                    field: "color",
                    label: "Button Text Color",
                    name: "btn_text_color",
                },
            ],
        },
        {
            title: "Time Zone",
            input: [
                {
                    field: "select",
                    label: "Select Time",
                    name: "timezone",
                },
            ],
        },
        {
            title: "Branding",
            input: [
                {
                    field: "switch",
                    label: "Show Branding",
                    name: "is_branding",
                },
            ],
        },
        {
            title: "Organization",
            input: [
                {
                    field: "switch",
                    label: "Enable the option and set a password to make your organization private.",
                    name: "private_mode",
                },
                {
                    field: "password",
                    label: "Password",
                    name: "password",
                },
            ]
        }
    ];

    return (
        <Card className={"divide-y"}>
            <CardHeader className={"gap-1 p-4 sm:px-5 sm:py-4"}>
                <CardTitle className={"text-xl lg:text-2xl font-normal capitalize"}>General Setting</CardTitle>
                <CardDescription className={"text-sm text-muted-foreground p-0"}>Give title to your Announcement, Roadmap, Ideas. Set header and global color.</CardDescription>
            </CardHeader>
            <CardContent className={"p-0 divide-y"}>
                {
                    initialStateFields.map((x, i) => {
                        return (
                            <div className={"space-y-3 p-4 sm:px-5 sm:py-4"}>
                                <div className={"flex justify-between items-center gap-2"}>
                                    <h3 className={"font-normal"}>{x.title}</h3>
                                    {
                                        x.nameSwitch ? <div className="announce-create-switch flex gap-4">
                                            <Switch
                                                className="w-[38px] h-[20px]"
                                                checked={generalSettingData?.[x.nameSwitch] === 1}
                                                onCheckedChange={(checked) => onChange(x.nameSwitch, checked ? 1 : 0)}
                                            />
                                        </div> : ""
                                    }
                                </div>
                                    {
                                        (generalSettingData?.[x.nameSwitch] === undefined || generalSettingData?.[x.nameSwitch] === 1) ?
                                            <Fragment>
                                                <div className={"space-y-3"}>
                                                    <div className={`${
                                                        x.title === "Header Color" || x.title === "Global Color"
                                                            ? "grid grid-cols-2 gap-4"
                                                            : x.title === "Organization"
                                                            ? "flex gap-4 w-full"
                                                            : "space-y-3 w-full md:w-1/2"
                                                    }`}>
                                                        {
                                                            x.input.map((y, inputIndex) => {
                                                                return (
                                                                    <Fragment>
                                                                        {
                                                                            y.field === "text" ?
                                                                                <div className={"space-y-1"}>
                                                                                    <Label className="text-sm font-normal">{y.label}</Label>
                                                                                    <Input value={generalSettingData?.[y.name]}
                                                                                           onChange={(e) => onChange(y.name, e.target.value)}/>
                                                                                    </div>
                                                                                : y.field === "checkbox" ?
                                                                                    <div className="flex items-center gap-4">
                                                                                        <Checkbox
                                                                                            id={y.name}
                                                                                            checked={generalSettingData?.[y.name] === 1}
                                                                                            onCheckedChange={(checked) => onChange(y.name, checked ? 1 : 0)}
                                                                                        />
                                                                                        <label
                                                                                            htmlFor={y.name}
                                                                                            className="text-sm text-muted-foreground font-normal"
                                                                                        >
                                                                                            {y.label}
                                                                                        </label>
                                                                                    </div>
                                                                                : y.field === "color" ?
                                                                                    <div className={"flex items-center gap-3 flex-wrap md:flex-nowrap"}>
                                                                                        <div className={"widget-color-picker space-y-1 w-full"}>
                                                                                            <Label className={"text-sm font-normal"}>{y.label}</Label>
                                                                                            <ColorInput name={y.name}
                                                                                                        value={generalSettingData?.[y.name]}
                                                                                                        onChange={(value) => onChange(y.name, value?.clr)}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    : y.field === "select" ?
                                                                                        <div className="announce-create-switch flex gap-4">
                                                                                            <Select onValueChange={(value) => onChange('timezone', value)} value={generalSettingData.timezone}>
                                                                                                <SelectTrigger>
                                                                                                    <SelectValue placeholder={generalSettingData.timezone} />
                                                                                                </SelectTrigger>
                                                                                                <SelectContent>
                                                                                                    {
                                                                                                        (timeZoneJson || []).map((x, i) => {
                                                                                                            return (
                                                                                                                <SelectItem key={i} value={x.tzCode}>{x.label}</SelectItem>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </SelectContent>
                                                                                            </Select>
                                                                                        </div>
                                                                                        : y.field === "switch" ?
                                                                                            <Fragment>
                                                                                                <div className="space-y-3">
                                                                                                <div className="announce-create-switch flex gap-4">
                                                                                                    <Switch
                                                                                                        className="w-[38px] h-[20px]"
                                                                                                        checked={generalSettingData?.[y.name] === 1}
                                                                                                        disabled={y.name === "private_mode" ? "" : userDetailsReducer.plan === 0}
                                                                                                        onCheckedChange={(checked) => onChange(y.name, checked ? 1 : 0)}
                                                                                                    />
                                                                                                    <p className="text-sm text-muted-foreground font-normal">{y.label}</p>
                                                                                                </div>
                                                                                                    {y.name === "private_mode" && generalSettingData?.private_mode === 1 && (
                                                                                                        <div className={"w-3/4"}>
                                                                                                            <Label className="text-sm font-normal">Password</Label>
                                                                                                            <div className={"relative"}>
                                                                                                            <Input
                                                                                                                type={showPassword ? "text" : "password"}
                                                                                                                value={generalSettingData?.password || ""}
                                                                                                                placeholder="Enter your password"
                                                                                                                onChange={(e) => onChange("password", e.target.value)}
                                                                                                            />
                                                                                                            <Button
                                                                                                                className={"absolute top-0 right-0"}
                                                                                                                variant={"ghost hover:none"}
                                                                                                                onClick={togglePasswordVisibility}
                                                                                                            >
                                                                                                                {generalSettingData?.password ? <Eye size={16} stroke={`${theme === "dark" ? "white" : "black"}`}/> : <EyeOff size={16} stroke={`${theme === "dark" ? "white" : "black"}`}/>}
                                                                                                            </Button>
                                                                                                                {/*{*/}
                                                                                                                {/*    formError.password &&*/}
                                                                                                                {/*    <span className="text-destructive text-sm">{formError.password}</span>*/}
                                                                                                                {/*}*/}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )}
                                                                                                </div>
                                                                                            </Fragment>
                                                                                        : ""
                                                                        }
                                                                    </Fragment>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </Fragment>
                                            : ""
                                    }
                            </div>
                        )
                    })
                }
            </CardContent>
            <CardFooter className={"p-4 sm:px-5 sm:py-4 justify-end"}>
                <Button
                    className={`w-[179px] text-sm font-semibold hover:bg-primary capitalize`}
                    onClick={onUpdatePortal}
                >
                    {isSave ? <Loader2 className="h-4 w-4 animate-spin"/> : "Update General Settings"}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default GeneralSettings;