import React, {useState} from 'react';
import {Card, CardContent} from "../ui/card";
import {Button} from "../ui/button";
import {Loader2} from "lucide-react";
import {Icon} from "../../utils/Icon";
import {useTheme} from "../theme-provider";
import {useNavigate} from "react-router-dom";
import {apiService, baseUrl} from "../../utils/constent";
import {useToast} from "../ui/use-toast";
import FormInput from "./CommonAuth/FormInput";

const RestPassword = () => {
    const {theme} = useTheme();
    let navigate = useNavigate();
    const {toast} = useToast();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    const [formError, setFormError] = useState({password:"", confirmPassword: ''});
    const [forgotPasswordDetails, setForgotPasswordDetails] = useState({password:"", confirmPassword: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState({
        password: false,
        confirmPassword: false
    });

    const onChange = (event) => {
        setForgotPasswordDetails({...forgotPasswordDetails,[event.target.name]: event.target.value})
        // setFormError(formError => ({
        //     ...formError,
        //     [event.target.name]: formValidate(event.target.name, event.target.value)
        // }));
    };

    const onBlur = (event) => {
        const { name, value } = event.target;
        setFormError({
            ...formError,
            [name]: formValidate(name, value)
        });
    };

    const formValidate = (name, value) => {
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        switch (name) {
            case "password":
                if (value.trim() === "") return "Password is required";
                if (value.length < 8) return "Password must be at least 8 characters.";
                // if (!passwordRegex.test(value)) return "Password must be at least 8 characters with one uppercase letter, one lowercase letter, one number, and one special character";
                return "";
            case "confirmPassword":
                if (value.trim() === "") return "Confirm Password is required";
                if (value !== forgotPasswordDetails.password) return "Passwords must match";
                return "";
            default:
                return "";
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
            confirmPassword: forgotPasswordDetails.confirmPassword,
        }
        const data  = await apiService.resetPassword(payload)
        setIsLoading(false)
        if(data.success){
            navigate(`${baseUrl}/login`);
            toast({description: data.message})
        } else {
            toast({variant: "destructive", description: data?.error?.message})
        }
    }

    return (
        <div className={"w-full flex flex-col items-center justify-center p-4 md:px-4 md:py-0"}>
            {/*<div className={"max-w-2xl m-auto"}>*/}
            <div className={"max-w-[400px] m-auto"}>
                <div className={"flex items-center justify-center mt-20"}>{theme === "dark" ? Icon.whiteLogo : Icon.blackLogo}</div>
                <h1 className="scroll-m-20 text-2xl md:text-3xl font-medium text-center lg:text-3xl mb-3.5 mt-6">Reset Password</h1>
                <div className={"mb-2.5"}>
                    <p className="text-sm text-center text-muted-foreground">Almost done. Enter your new password, and you're good to go.</p>
                </div>
                <div className={"mt-2.5"}>
                    <Card>
                        <CardContent className={"p-3 md:p-6 space-y-2"}>
                            <div className={"space-y-1"}>
                                <FormInput
                                    label="New Password"
                                    error={formError.password}
                                    className={"w-full"}
                                    id="password"
                                    type={passwordVisibility.password ? "text" : "password"}
                                    placeholder={"Password"}
                                    value={forgotPasswordDetails.password}
                                    name={'password'}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    showToggle
                                />
                            </div>
                            <div className={"space-y-1"}>
                                <FormInput
                                    label="Confirm Password"
                                    error={formError.confirmPassword}
                                    className={"w-full"}
                                    showToggle
                                    id="confirmPassword"
                                    type={passwordVisibility.confirmPassword ? "text" : "password"}
                                    placeholder={"Confirm Password"}
                                    value={forgotPasswordDetails.confirmPassword}
                                    name={'confirmPassword'}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                />
                            </div>

                            <Button
                                className={"w-full mt-2.5 bg-primary hover:bg-primary font-normal"}
                                disabled={(forgotPasswordDetails.password === "" || forgotPasswordDetails.password.trim() === "") || (forgotPasswordDetails.confirmPassword === "" || forgotPasswordDetails.confirmPassword.trim() === "")}
                                onClick={onSubmit}
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : ""}
                                Reset Password
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default RestPassword;