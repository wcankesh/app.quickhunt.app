import React, {useState} from 'react';
import {Button} from "../ui/button"
import {useNavigate} from "react-router-dom"
import {apiService, baseUrl, validateForm, validateField, onKeyFire, TOKEN_KEY} from "../../utils/constent";
import {Loader2} from "lucide-react";
import {useToast} from "../ui/use-toast";
import WithGoogle from "./WithGoogle";
import {userDetailsAction} from "../../redux/action/UserDetailAction";
import {useDispatch} from "react-redux";
import AuthLayout from "./CommonAuth/AuthLayout";
import FormInput from "./CommonAuth/FormInput";

const initialState = {
    email: '',
    password: ''
}

const Login = () => {
    let navigate = useNavigate();
    const {toast} = useToast();

    const [companyDetails, setCompanyDetails] = useState(initialState);
    const [formError, setFormError] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const onChange = (event) => {
        const { name, value } = event.target;
        setCompanyDetails(prev => ({
            ...prev,
            [name]: value
        }));
        setFormError(prevErrors => ({
            ...prevErrors,
            [name]: validateField(name, value, {
                ...companyDetails,
                [name]: value,
            }),
        }));
    };

    const onBlur = (event) => {
        const {name, value} = event.target;
        setFormError({
            ...formError,
            [name]: validateField(name, value, {
                ...companyDetails,
                [name]: value,
            }),
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
    };

    const onLogin = async () => {
        const validationErrors = validateForm(companyDetails);
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setIsLoading(true)
        const payload = {
            email: companyDetails.email,
            password: companyDetails.password,
            loginType: "1"
        }
        const data = await apiService.login(payload)
        if (data.success) {
            toast({description: data.message})
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            if (token) {
                navigate(`${baseUrl}/invitation?token=${token}`);
            } else {
                urlParams.delete('token')
                if(data?.data?.onboarding == 0){
                    const datas = await apiService.getLoginUserDetails({Authorization: `Bearer ${data.data.token}`})
                    if(datas.success){
                        dispatch(userDetailsAction({...datas.data}))
                        setIsLoading(false)
                    } else {
                        setIsLoading(false)
                    }
                    navigate(`${baseUrl}/on-boarding`);
                    localStorage.setItem("token-verify-onboard", data.data.token);
                } else {
                    localStorage.setItem(TOKEN_KEY, data?.data?.token);
                    navigate(`${baseUrl}/dashboard`);
                }
            }
            setIsLoading(false)
        } else {
            setIsLoading(false)
            toast({variant: "destructive", description: data?.error?.message})
        }
    }

    return (
        <AuthLayout>
            <div className="mx-auto flex items-center w-[320px] md:w-[384px] px-3 h-full">
                <div className="w-full flex flex-col gap-8">
                    <h1 className="text-2xl md:text-3xl font-normal">Login</h1>
                    <div className="grid gap-6">
                        <FormInput
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={companyDetails.email}
                            onChange={onChange}
                            onBlur={onBlur}
                            error={formError.email}
                        />
                        <FormInput
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={companyDetails.password}
                            onChange={onChange}
                            onBlur={onBlur}
                            error={formError.password}
                            showToggle
                            isLogin={true}
                            onClick={() => onRedirect('forgot-password')}
                            formError={formError.password}
                            onKeyDown={(e) => onKeyFire(e, onLogin)}
                        />
                        <div className="flex justify-between">
                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary"
                                onClick={onLogin}
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : ""}
                                <span className={"font-medium"}>Login</span>
                            </Button>
                        </div>
                        <div className={"or-divider flex items-center"}>
                            <div className={"border-t basis-4/12 border-muted-foreground"}/>
                            <p className={"text-xs text-muted-foreground basis-4/12 text-center"}>Or continue with</p>
                            <div className={"border-t basis-4/12 border-muted-foreground"}/>
                        </div>
                        <WithGoogle title="Login With Google" />
                    </div>
                    <div className="text-center text-xs md:text-sm">
                        <p className={"text-sm text-muted-foreground"}>
                            Don't have an account?{" "}
                            <Button
                                variant={"link"}
                                className="p-0 h-auto hover:no-underline font-medium"
                                onClick={() => onRedirect('register')}
                            >
                                Create an account
                            </Button>
                        </p>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
};

export default Login;