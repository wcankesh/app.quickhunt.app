import React, {useState} from 'react';
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Card, CardContent} from "../ui/card";
import {Button} from "../ui/button";
import {Eye, EyeOff, Loader2} from "lucide-react";
import {ApiService} from "../../utils/ApiService";
import {Icon} from "../../utils/Icon";
import {useTheme} from "../theme-provider";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../utils/constent";

const RestPassword = () => {
    const {theme} = useTheme();
    let apiSerVice = new ApiService();
    const [formError, setFormError] = useState({password:"", confirm_password: ''});
    const [forgotPasswordDetails, setForgotPasswordDetails] = useState({password:"", confirm_password: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    let navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    const onChange = (event) => {
        setForgotPasswordDetails({...forgotPasswordDetails,[event.target.name]: event.target.value})
        setFormError(formError => ({
            ...formError,
            [event.target.name]: formValidate(event.target.name, event.target.value)
        }));
    };

    const onBlur = (event) => {
        const { name, value } = event.target;
        setFormError({
            ...formError,
            [name]: formValidate(name, value)
        });
    };

    const formValidate = (name, value) => {
        switch (name) {
            case "password":
                if (!value) {
                    return "Password is Required";
                } else {
                    return "";
                }
            case "confirm_password":
                if (!value) {
                    return "Confirm Password Required";
                } else if (value !== forgotPasswordDetails.password) {
                    return "New Password and Confirm Password Must be Same";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const onSubmit = async () =>{
        let validationErrors = {};
        Object.keys(forgotPasswordDetails).forEach(name => {
            const error = formValidate(name, forgotPasswordDetails[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setIsLoading(true)
        const payload = {
            token: token,
            password: forgotPasswordDetails.password,
            confirm_password: forgotPasswordDetails.confirm_password,
        }
        const data  = await apiSerVice.resetPassword(payload)
        if(data.status === 200){
            setIsLoading(false)
            navigate(`${baseUrl}/login`);
        } else {
            setIsLoading(false)
        }
    }

    const togglePasswordVisibility = () => {setShowPassword(!showPassword);};

    return (
        <div className={"w-full flex flex-col items-center justify-center p-4 md:px-4 md:py-0"}>
            <div className={"max-w-2xl m-auto"}>
                <div className={"flex items-center justify-center mt-20"}>
                    {
                        theme === "dark" ? Icon.whiteLogo : Icon.blackLogo
                    }
                </div>
                <h1 className="scroll-m-20 text-2xl md:text-3xl font-semibold text-center lg:text-3xl mb-3.5 mt-6">
                    Reset Password
                </h1>
                <div className={"mb-2.5"}>
                    <p className="text-sm text-center text-muted-foreground">
                        Almost done. Enter your new password, and you're good to go.
                    </p>
                </div>
                <div className={"mt-2.5"}>
                    <Card>
                        <CardContent className={"p-3 md:p-6"}>
                            <Label htmlFor="password" className={"font-normal"}>New Password</Label>
                            <div className={"relative"}>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={"Password"}
                                    value={forgotPasswordDetails.password}
                                    name={'password'}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                />
                                <Button variant={"ghost hover:none"}
                                        onClick={togglePasswordVisibility}
                                        className={"absolute top-0 right-0"}>
                                    {showPassword ? <Eye size={16} stroke={`${theme === "dark" ? "white" : "black"}`}/> : <EyeOff size={16} stroke={`${theme === "dark" ? "white" : "black"}`}/>}
                                </Button>
                            </div>
                            {
                                formError.password && <span className="text-red-500 text-sm">{formError.password}</span>
                            }
                            <div className={"mt-2 "}>
                                <Label htmlFor="confirm_password" className={"font-normal"}>Confirm Password</Label>
                                <div className={"relative"}>

                                    <Input
                                        id="confirm_password"
                                        type={showPassword ? "text" : "password"}
                                        value={forgotPasswordDetails.confirm_password}
                                        name={'confirm_password'}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                    />
                                    <Button variant={"ghost hover:none"}
                                            onClick={togglePasswordVisibility}
                                            className={"absolute top-0 right-0"}>
                                        {showPassword ? <Eye size={16} stroke={`${theme === "dark" ? "white" : "black"}`}/> : <EyeOff size={16} stroke={`${theme === "dark" ? "white" : "black"}`}/>}
                                    </Button>
                                </div>
                                {
                                    formError.confirm_password && <span className="text-red-500 text-sm">{formError.confirm_password}</span>
                                }
                            </div>

                            <Button
                                className={"w-full mt-2.5 bg-primary"}
                                disabled={(forgotPasswordDetails.password === "" || forgotPasswordDetails.password.trim() === "") || (forgotPasswordDetails.confirm_password === "" || forgotPasswordDetails.confirm_password.trim() === "")}
                                onClick={onSubmit}
                            >
                                {
                                    isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : ""
                                }
                                <span className={"font-normal"}>Reset Password</span>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default RestPassword;