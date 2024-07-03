import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../ui/card";
import SettingProfile from "../../../img/settingprofile.png";
import {Label} from "../../ui/label";
import {Input} from "../../ui/input";
import {Button} from "../../ui/button";
import {Eye, EyeOff} from "lucide-react";

const initialState = {
    user_first_name: '',
    user_last_name: '',
    user_email_id: '',
    user_current_password: '',
    user_password: '',
    user_confirm_password: '',
}

const initialStateError = {
    user_first_name: '',
    user_last_name: '',
    user_email_id: '',
    user_current_password: '',
    user_password: '',
    user_confirm_password: '',
}

const Profile = () => {
    const [companyDetails, setCompanyDetails] = useState(initialState);
    const [formError, setFormError] = useState(initialState);
    const [passwordVisibility, setPasswordVisibility] = useState({
        user_current_password: false,
        user_password: false,
        user_confirm_password: false
    });

    const onChange = (event) => {
        setCompanyDetails({...companyDetails, [event.target.name]: event.target.value});
        setFormError(formError => ({
            ...formError,
            [event.target.name]: ""
            // [event.target.name]: formValidate(event.target.name, event.target.value)
        }));
    };

    const onBlur = (event) => {
        const {name, value} = event.target;
        setFormError({
            ...formError,
            [name]: formValidate(name, value)
        });
    };

    const formValidate = (name, value) => {
        switch (name) {
            case "user_first_name":
                if (!value || value.trim() === "") {
                    return "First name is required";
                } else {
                    return "";
                }
            case "user_last_name":
                if (!value || value.trim() === "") {
                    return "Last name is required";
                } else {
                    return "";
                }
            case "user_email_id":
                if (!value || value.trim() === "") {
                    return "Email is required";
                } else if (!value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
                    return "Enter a valid email address";
                } else {
                    return "";
                }
            case "user_current_password":
                if (!value || value.trim() === "") {
                    return "Current password is required";
                } else {
                    return "";
                }
            case "user_password":
                if (!value || value.trim() === "") {
                    return "Password is required";
                } else {
                    return "";
                }
            case "user_confirm_password":
                if (!value || value.trim() === "") {
                    return "Confirm password is required";
                } else if (value !== companyDetails.user_password) {
                    return "Passwords do not match";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const togglePasswordVisibility = (fieldName) => {
        setPasswordVisibility({
            ...passwordVisibility,
            [fieldName]: !passwordVisibility[fieldName]
        });
    };

    return (
        <div className={"flex flex-col gap-6"}>
            <Card>
                <CardHeader className={"gap-1 border-b"}>
                    <CardTitle className={"text-2xl font-medium"}>Edit Profile</CardTitle>
                    <CardDescription className={"text-sm text-muted-foreground p-0"}>Manage your personal account settings.</CardDescription>
                </CardHeader>
                <CardContent className={"py-6 px-4 border-b"}>
                    <div className={"flex gap-4 lg:flex-nowrap md:flex-wrap sm:flex-wrap"}>
                        <span><img className={"h-auto"} src={SettingProfile} alt={"setting-profile"} /></span>
                        <div className={"flex flex-col gap-4 md:w-full sm:w-full"}>
                            <div className={"flex gap-4 lg:flex-nowrap md:flex-wrap sm:flex-wrap"}>
                                <div className={"basis-1/2 md:basis-full sm:basis-full"}>
                                    <Label htmlFor="email" className={"font-medium"}>First Name</Label>
                                    <Input
                                        id="user_first_name"
                                        placeholder="Ankesh"
                                        value={companyDetails.user_first_name}
                                        name={'user_first_name'}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className={"bg-card"}
                                    />
                                    <div className="grid gap-2">
                                        {
                                            formError.user_first_name &&
                                            <span className="text-red-500 text-sm">{formError.user_first_name}</span>
                                        }
                                    </div>
                                </div>
                                <div className={"basis-1/2 md:basis-full sm:basis-full"}>
                                    <Label htmlFor="email" className={"font-medium"}>Last Name</Label>
                                    <Input
                                        id="user_last_name"
                                        placeholder="Ramani"
                                        value={companyDetails.user_last_name}
                                        name={'user_last_name'}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className={"bg-card"}
                                    />
                                    <div className="grid gap-2">
                                        {
                                            formError.user_last_name &&
                                            <span className="text-red-500 text-sm">{formError.user_last_name}</span>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className={"flex gap-4 lg:flex-nowrap md:flex-wrap"}>
                                <div className={"lg:w-[289px] md:w-full sm:w-full"}>
                                    <Label htmlFor="email" className={"font-medium"}>Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="wc.ankesh@gmail.com"
                                        value={companyDetails.user_email_id}
                                        name={'user_email_id'}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className={"bg-card"}
                                    />
                                    {
                                        formError.user_email_id &&
                                        <span className="text-red-500 text-sm">{formError.user_email_id}</span>
                                    }
                                </div>
                                <div className={"w-[279px] hidden"}>
                                    <Label htmlFor="email" className={"font-medium"}>Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="wc.ankesh@gmail.com"
                                        value={companyDetails.user_email_id}
                                        name={'user_email_id'}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className={"bg-card"}
                                    />
                                    {
                                        formError.user_email_id &&
                                        <span className="text-destructive text-sm">{formError.user_email_id}</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className={"p-6 justify-end"}>
                    <Button className={"text-sm font-semibold"}>Save Changes</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader className={"border-b"}>
                    <CardTitle className={"text-sm font-medium"}>Change a password for your account</CardTitle>
                </CardHeader>
                <CardContent className={"pt-4 "}>
                    <div className={"flex flex-col gap-4"}>
                        <div>
                        <Label htmlFor="email">Current password</Label>
                        <div className={"relative"}>
                            <Input
                                id="password"
                                type={passwordVisibility.user_current_password ? "text" : "password"}
                                placeholder={"Current Password"}
                                value={companyDetails.user_current_password}
                                name={'user_current_password'}
                                onChange={onChange}
                                onBlur={onBlur}
                                className={"bg-card"}
                            />
                            <Button variant={"ghost hover:none"} onClick={() => togglePasswordVisibility('user_current_password')}
                                    className={"absolute top-0 right-0"}>
                                {passwordVisibility.user_current_password ? <Eye className={"w-[16px] h-[16px]"}/> : <EyeOff className={"w-[16px] h-[16px]"}/>}
                            </Button>
                        </div>
                        </div>
                        {
                            formError.user_current_password &&
                            <span className="text-destructive text-sm">{formError.user_current_password}</span>
                        }
                        <div>
                        <Label htmlFor="email">Password</Label>
                        <div className={"relative"}>
                            <Input
                                id="password"
                                type={passwordVisibility.user_password ? "text" : "password"}
                                placeholder={"Password"}
                                value={companyDetails.user_password}
                                name={'user_password'}
                                onChange={onChange}
                                onBlur={onBlur}
                                className={"bg-card"}
                            />
                            <Button variant={"ghost hover:none"} onClick={() => togglePasswordVisibility('user_password')}
                                    className={"absolute top-0 right-0"}>
                                {passwordVisibility.user_password ? <Eye className={"w-[16px] h-[16px]"}/> : <EyeOff className={"w-[16px] h-[16px]"}/>}
                            </Button>
                        </div>
                        </div>
                        {
                            formError.user_password &&
                            <span className="text-destructive text-sm">{formError.user_password}</span>
                        }
                        <div>
                        <Label htmlFor="email">Password confirmation</Label>
                        <div className={"relative"}>
                            <Input
                                id="password"
                                type={passwordVisibility.user_confirm_password ? "text" : "password"}
                                placeholder={"Confirm Password"}
                                value={companyDetails.user_confirm_password}
                                name={'user_confirm_password'}
                                onChange={onChange}
                                onBlur={onBlur}
                                className={"bg-card"}
                            />
                            <Button variant={"ghost hover:none"} onClick={() => togglePasswordVisibility('user_confirm_password')}
                                    className={"absolute top-0 right-0"}>
                                {passwordVisibility.user_confirm_password ? <Eye className={"w-[16px] h-[16px]"}/> : <EyeOff className={"w-[16px] h-[16px]"}/>}
                            </Button>
                        </div>
                        </div>
                        {
                            formError.user_confirm_password &&
                            <span className="text-destructive text-sm">{formError.user_confirm_password}</span>
                        }
                    </div>
                </CardContent>
                <CardFooter className={"p-6 pt-0 justify-end"}>
                    <Button className={"text-sm font-semibold"}>Update Password</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Profile;