import React, {useState} from 'react';
import {Button} from "../ui/button";
import {Loader2} from "lucide-react";
import {useToast} from "../ui/use-toast";
import {baseUrl, validateForm, validateField, apiService,} from "../../utils/constent";
import {useNavigate} from "react-router-dom";
import AuthLayout from "./CommonAuth/AuthLayout";
import FormInput from "./CommonAuth/FormInput";

const Forgot = () => {
    let navigate = useNavigate();
    const {toast} = useToast()

    const [formError, setFormError] = useState({email: ""});
    const [forgotPasswordDetails, setForgotPasswordDetails] = useState({email: ""});
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (event) => {
        setForgotPasswordDetails({...forgotPasswordDetails, [event.target.name]: event.target.value})
        setFormError(formError => ({
            ...formError,
            [event.target.name]: validateField(event.target.name, event.target.value)
        }));
    };

    const onBlur = (event) => {
        const {name, value} = event.target;
        setFormError({
            ...formError,
            [name]: validateField(name, value)
        });
    };

    const onSubmit = async () => {
        let validationErrors = {};
        Object.keys(forgotPasswordDetails).forEach(name => {
            const error = validateForm(name, forgotPasswordDetails[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setIsLoading(true)
        const data = await apiService.forgotPassword({email: forgotPasswordDetails.email})
        if (data.success) {
            setForgotPasswordDetails({email: ""})
            toast({description: data.message,})
            setIsLoading(false)
        } else {
            toast({variant: "destructive", description: data?.error?.message})
            setIsLoading(false)
        }
    }

    const onRedirect = (link) => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            navigate(`${baseUrl}/${link}?token=${token}`);
        } else {
            navigate(`${baseUrl}/${link}`);
        }
    };

    return (

        <AuthLayout>
            <div className="mx-auto flex items-center w-[320px] md:w-[640px] px-3 h-full">
                <div className="w-full flex flex-col gap-8">
                    <h1 className="text-2xl md:text-3xl font-medium text-center">Forgot Password</h1>
                    <div className="mb-2.5">
                        <p className="text-sm text-center text-muted-foreground">
                            Provide the email associated with your Quickhunt account, and we'll send a password reset link.
                        </p>
                    </div>
                    <div className="grid gap-6">
                        <div className="grid gap-1">
                            <FormInput
                                label="Your Email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                value={forgotPasswordDetails.email}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={formError.email}
                            />
                        </div>
                        <Button
                            className={"w-full mt-2.5 bg-primary hover:bg-primary"}
                            disabled={forgotPasswordDetails.email === "" || forgotPasswordDetails.email.trim() === ""}
                            onClick={onSubmit}
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : ""}
                            Reset Password
                        </Button>
                        <div className="text-center text-xs md:text-sm">
                            <p className={"text-sm text-muted-foreground"}>Go back to {" "}
                                <Button
                                    variant={"link"}
                                    className="p-0 h-auto hover:no-underline font-medium"
                                    onClick={() => onRedirect('login')}
                                >
                                    Login
                                </Button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
};

export default Forgot;