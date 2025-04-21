import React, {useState} from 'react';
import {Button} from "../ui/button"
import {useNavigate} from "react-router-dom"
import {ApiService} from "../../utils/ApiService";
import {baseUrl, onKeyFire, validateForm, validateField,} from "../../utils/constent";
import {Loader2} from "lucide-react";
import {useToast} from "../ui/use-toast";
import WithGoogle from "./WithGoogle";
import {userDetailsAction} from "../../redux/action/UserDetailAction";
import {useDispatch} from "react-redux";
import AuthLayout from "./CommonAuth/AuthLayout";
import FormInput from "./CommonAuth/FormInput";

const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    user_confirm_password: '',
    user_status: '1'
}

const Register = () => {
    let apiSerVice = new ApiService()
    let navigate = useNavigate();
    const {toast} = useToast();
    const dispatch = useDispatch();

    const [companyDetails, setCompanyDetails] = useState(initialState);
    const [formError, setFormError] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (event) => {
        setCompanyDetails({...companyDetails, [event.target.name]: event.target.value});
    };

    const onBlur = (event) => {
        const {name, value} = event.target;
        setFormError({
            ...formError,
            [name]: validateField(name, value)
        });
    };

    const onRedirect = (link) => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            navigate(`${baseUrl}/${link}?token=${token}`);
        } else {
            navigate(`${baseUrl}/${link}`);
        }
        return;
    };

    const onRegister = async () => {
        let validationErrors = {};
        Object.keys(companyDetails).forEach(name => {
            const error = validateForm(name, companyDetails[name]);
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
            firstName: companyDetails.firstName,
            lastName: companyDetails.lastName,
            email: companyDetails.email,
            password: companyDetails.password
        }
        const data = await apiSerVice.adminSignup(payload)
        if (data.success) {
            let userDetails = {...data.data};
            delete userDetails?.token;
            localStorage.setItem("user-details", JSON.stringify(userDetails));
            localStorage.setItem("token-verify-onboard", data.data?.token);
            dispatch(userDetailsAction({...data.data}))
            navigate(`${baseUrl}/on-boarding`);
            toast({description: data.message})
            setIsLoading(false)
        } else {
            setIsLoading(false)
            toast({variant: "destructive" ,description: data.message,})
        }
    }

    return (
        <AuthLayout>
            <div className="mx-auto flex items-center w-[320px] md:w-[392px] px-3 h-full">
                <div className="w-full flex flex-col gap-8">
                    <h1 className="text-2xl md:text-3xl font-normal">Create Your Account</h1>
                    <div className="grid gap-6">
                        <div className="flex flex-wrap md:flex-nowrap gap-4">
                            <FormInput
                                label="First Name"
                                name="firstName"
                                placeholder="John"
                                value={companyDetails.firstName}
                                onChange={onChange}
                                // onBlur={onBlur}
                                error={formError.firstName}
                                className={"w-full"}
                            />
                            <FormInput
                                label="Last Name"
                                name="lastName"
                                placeholder="Doe"
                                value={companyDetails.lastName}
                                onChange={onChange}
                                // onBlur={onBlur}
                                error={formError.lastName}
                            />
                        </div>
                        <FormInput
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="JohnDoe@gmail.com"
                            value={companyDetails.email}
                            onChange={onChange}
                            // onBlur={onBlur}
                            error={formError.email}
                        />
                        <FormInput
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={companyDetails.password}
                            onChange={onChange}
                            // onBlur={onBlur}
                            error={formError.password}
                            showToggle
                        />
                        <FormInput
                            label="Confirm Password"
                            name="user_confirm_password"
                            type="password"
                            placeholder="Confirm Password"
                            value={companyDetails.user_confirm_password}
                            onChange={onChange}
                            // onBlur={onBlur}
                            error={formError.user_confirm_password}
                            showToggle
                            onKeyDown={(e) => onKeyFire(e, onRegister)}
                        />
                        <Button
                            type="submit"
                            className={"w-full bg-primary hover:bg-primary font-medium"}
                            onClick={onRegister}
                        >
                            {isLoading ? <Loader2 className={"mr-2 h-4 w-4 animate-spin"}/> : ""}
                            Continue Registration
                        </Button>
                        <div className="or-divider flex items-center">
                            <div className="border-t basis-4/12 border-muted-foreground" />
                            <p className="text-xs text-muted-foreground basis-4/12 text-center">Or continue with</p>
                            <div className="border-t basis-4/12 border-muted-foreground" />
                        </div>
                        <WithGoogle title="Signup With Google" />
                        <div className="text-center text-xs md:text-sm">
                            <p className={"text-sm text-muted-foreground"}>Already have an account?{" "}
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

export default Register;