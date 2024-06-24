import React, {useState, useEffect} from 'react';
import {Icon} from "../../utils/Icon";
import {apiService} from "../../utils/constent";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Card, CardContent} from "../ui/card";
import {Button} from "../ui/button";
import {Loader2} from "lucide-react";
import {useToast} from "../ui/use-toast";

const Forgot = () => {
    const [formError, setFormError] = useState({email:""});
    const [forgotPasswordDetails, setForgotPasswordDetails] = useState({email:""});
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()

    const getForgetDetail = async () => {
        const getDetail = await apiService.forgotPassword();
        if(getDetail.status === 200) {
            console.log('getDetail', getDetail)
        }
    }

    useEffect(() => {
        getForgetDetail()
    }, []);

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
            case "email":
                if (!value || value.trim() === "") {
                    return "Email is required";
                } else if (!value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
                    return "Enter a valid email address";
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
        const data  = await apiService.forgotPassword({email: forgotPasswordDetails.email})
        if(data.status === 200){
            setForgotPasswordDetails({email: ""})
            toast({
                description: "Your password reset request has been received successfully, please check your email for the reset link",
            })
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    }

    return (
        <div className={"w-full flex flex-col items-center justify-center"}>
            <div className={"max-w-2xl m-auto"}>
                <div className={"flex items-center justify-center mt-24"}>{Icon.logo}</div>
                <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight lg:text-3xl mb-3.5 mt-6">
                    Forgot Password
                </h1>
                <div className={"mb-2.5"}>
                    <p className="leading-6 text-center text-muted-foreground">
                        Enter the email associated to your quickhunt account and we'll send an email with instrcutions to reset your password.
                    </p>
                </div>
                <div className={"mt-2.5"}>
                    <Card>
                        <CardContent className={"p-6"}>
                            <Label htmlFor="email" className={"font-normal"}>Your email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={forgotPasswordDetails.email}
                                name={'email'}
                                onChange={onChange}
                                onBlur={onBlur}
                            />
                            {
                                formError.email && <span className="text-red-500 text-sm">{formError.email}</span>
                            }
                            <Button
                                className={"w-full mt-2.5 bg-blue-900 hover:bg-blue-900"}
                                disabled={forgotPasswordDetails.email === "" || forgotPasswordDetails.email.trim() === ""}
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

export default Forgot;