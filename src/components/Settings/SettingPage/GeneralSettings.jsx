import React, {useState, useEffect, Fragment} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../ui/card";
import {Label} from "../../ui/label";
import {Input} from "../../ui/input";
import {Switch} from "../../ui/switch";
import {useToast} from "../../ui/use-toast";
import {useSelector} from "react-redux";
import {Button} from "../../ui/button";
import {Eye, EyeOff, Loader2} from "lucide-react";
import ColorInput from "../../Comman/ColorPicker";
import {Checkbox} from "../../ui/checkbox";
import {Select, SelectValue} from "@radix-ui/react-select";
import {SelectContent, SelectItem, SelectTrigger} from "../../ui/select";
import {apiService, timeZoneJson} from "../../../utils/constent";
import {useTheme} from "../../theme-provider";

const initialState = {
    announcementTitle: "",
    btnBackgroundColor: "#7c3aed",
    btnTextColor: "#ffffff",
    headerBgColor: "#FFFFFF",
    headerTextColor: "#030712",
    headerBtnBackgroundColor: "#7c3aed",
    headerBtnTextColor: "#FFFFFF",
    ideaTitle: "",
    isAnnouncement: 1,
    isBranding: 1,
    isComment: 1,
    isIdea: 1,
    isReaction: 1,
    isRoadmap: 1,
    privateMode: 0,
    password: '',
    roadmapTitle: "",
    timezone: "Asia/Kolkata",
}

const GeneralSettings = () => {
    const {theme} = useTheme();
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
            const data = await apiService.getPortalSetting(projectDetailsReducer.id)
            if (data.success) {
                setGeneralSettingData(data.data.data);
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
            projectId: projectDetailsReducer.id,
        }
        const data = await apiService.updatePortalSetting(generalSettingData.id, payload)
        if (data.success) {
            setIsSave(false)
            toast({description: data.message})
        } else {
            setIsSave(false);
            toast({description: data?.error?.message, variant: "destructive"})
        }
    }

    const initialStateFields = [
        {
            title: "Announcement",
            nameSwitch: "isAnnouncement",
            input: [
                {
                    field: "text",
                    label: "Title",
                    name: "announcementTitle",
                },
                {
                    field: "checkbox",
                    label: "Reactions",
                    name: "isReaction",
                },
                {
                    field: "checkbox",
                    label: "Show Comment",
                    name: "isComment",
                },
            ],
        },
        {
            title: "Roadmap",
            nameSwitch: "isRoadmap",
            input: [
                {
                    field: "text",
                    label: "Title",
                    name: "roadmapTitle",
                },
            ],
        },
        {
            title: "Ideas",
            nameSwitch: "isIdea",
            input: [
                {
                    field: "text",
                    label: "Title",
                    name: "ideaTitle",
                },
            ],
        },
        {
            title: "Header Color",
            input: [
                {
                    field: "color",
                    label: "Background Color",
                    name: "headerBgColor",
                    value: "headerBgColor",
                },
                {
                    field: "color",
                    label: "Text Color",
                    name: "headerTextColor",
                },
                {
                    field: "color",
                    label: "Button Background Color",
                    name: "headerBtnBackgroundColor",
                },
                {
                    field: "color",
                    label: "Button Text Color",
                    name: "headerBtnTextColor",
                },
            ],
        },
        {
            title: "Global Color",
            input: [
                {
                    field: "color",
                    label: "Button Background Color",
                    name: "btnBackgroundColor",
                },
                {
                    field: "color",
                    label: "Button Text Color",
                    name: "btnTextColor",
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
                    name: "isBranding",
                },
            ],
        },
        {
            title: "Organization",
            input: [
                {
                    field: "switch",
                    label: "Enable the option and set a password to make your organization private.",
                    name: "privateMode",
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
                                                                                                {console.log("generalSettingData.timezone", generalSettingData.timezone)}
                                                                                                <div className="space-y-3">
                                                                                                <div className="announce-create-switch flex gap-4">
                                                                                                    <Switch
                                                                                                        className="w-[38px] h-[20px]"
                                                                                                        checked={generalSettingData?.[y.name] === 1}
                                                                                                        disabled={y.name === "privateMode" ? "" : userDetailsReducer.plan === 0}
                                                                                                        onCheckedChange={(checked) => onChange(y.name, checked ? 1 : 0)}
                                                                                                    />
                                                                                                    <p className="text-sm text-muted-foreground font-normal">{y.label}</p>
                                                                                                </div>
                                                                                                    {y.name === "privateMode" && generalSettingData?.privateMode === 1 && (
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