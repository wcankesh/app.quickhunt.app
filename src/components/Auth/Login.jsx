import React, {useState} from 'react';
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {useNavigate} from "react-router-dom"
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {Card, CardContent} from "../ui/card";
import widget_01 from "../../img/widget.png";
import {Icon} from "../../utils/Icon";
import {ApiService} from "../../utils/ApiService";
import {baseUrl} from "../../utils/constent";
import {Eye, EyeOff, Loader2} from "lucide-react";
import {useToast} from "../ui/use-toast";
import AppLogoWhite from "../../img/quickhunt.white.png";
import AppLogoPurple from "../../img/quickhunt.purple.png";

const initialState ={
    user_email_id:'',
    user_password:''
}

const Login = () => {
    let apiSerVice = new ApiService()
    let navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [companyDetails, setCompanyDetails] = useState(initialState);
    const [formError, setFormError] = useState(initialState);
    const [showPassword, setShowPassword] = useState(false);
    const { toast } = useToast()


    const onChange = (event) => {
        setCompanyDetails({...companyDetails,[event.target.name]: event.target.value});
        setFormError(formError => ({
            ...formError,
            [event.target.name]: ""
            // [event.target.name]: formValidate(event.target.name, event.target.value)
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
            case "user_email_id":
                if (!value || value.trim() === "") {
                    return "Email is required";
                } else if (!value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
                    return "Enter a valid email address";
                } else {
                    return "";
                }
            case "user_password":
                if (!value || value.trim() === "") {
                    return "Password is required";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const onLogin =async () =>{
        let validationErrors = {};
        Object.keys(companyDetails).forEach(name => {
            const error = formValidate(name, companyDetails[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setIsLoading(true)
        const payload ={
            ...companyDetails,
            login_type: "1"
        }
        const data = await apiSerVice.login(payload)
        if(data.access_token){
            toast({description: "Login successfully!"})
            localStorage.setItem("token", data.access_token);
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            if(token){
                navigate(`${baseUrl}/setup?token=${token}`);
            } else {
                urlParams.delete('token')
                navigate(`${baseUrl}/dashboard`);
            }
            setIsLoading(false)
        } else {
            setIsLoading(false)
            toast({description: "Your message has been sent."})
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onLogin();
        }
    };

    const onFailure = (response) => {
        console.log(response)
    }

    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    )

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="w-full lg:grid lg:grid-cols-2 h-[100vh]">
        {/*// <div className="w-full flex justify-center h-[100vh]">*/}
        {/*    <div className="hidden lg:block p-16 lg:flex justify-between flex-col basis-1/2 bg-purple-400">*/}
            <div className="hidden lg:block p-16 lg:flex bg-purple-400 justify-center pb-[90px]">
                <div className={"grid gap-6"}>
                <div className={"app-logo"}>
                    <img src={AppLogoWhite} alt={"app-logo"} />
                </div>
                <Carousel
                    plugins={[plugin.current]}
                    className="w-full"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                >
                    <CarouselContent>
                        {Array.from({ length: 3 }).map((_, index) => (
                            <CarouselItem key={index}>
                                <img className={"w-[806px]"} src={widget_01} alt= '' />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {/*<CarouselPrevious />*/}
                    {/*<CarouselNext />*/}
                </Carousel>
                <div className={"description"}>
                    <p className={"text-white text-center text-2xl"}>“This  library has saved me countless hours of work and helped me deliver  stunning designs to my clients faster than ever before.”</p>
                </div>
                </div>
            </div>
            <div className="flex p-16">
                <div className={"w-full gap-6"}>
                <div className="text-right text-sm">
                    <p className={"font-medium"}>
                        Don't have an account?{" "}
                        <Button
                            variant={"link"}
                            className="p-0 h-auto hover:no-underline"
                            onClick={() => navigate(`${baseUrl}/register`)}
                        >
                            <span className={"font-bold text-violet-600"}>Create an account</span>
                        </Button>
                    </p>
                </div>
                <div className="mx-auto grid w-[384px] gap-8 lg:pt-[142px] sm:pt-[100px] xs:pt-[50px]">
                    <div className="gap-2 flex flex-col items-center">
                    {/*<div className="grid gap-2 text-center">*/}
                            <img src={AppLogoPurple} alt={""}/>
                        <h1 className="text-3xl font-medium text-slate-900">Login to Your Account</h1>
                        <h6 className="font-normal text-sm text-zinc-500">Enter your email below to create your account</h6>
                    </div>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className={"font-medium"}>Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={companyDetails.user_email_id}
                                name={'user_email_id'}
                                onChange={onChange}
                                onBlur={onBlur}
                                className={"border-slate-300 placeholder:text-slate-400"}
                            />
                            {
                                formError.user_email_id ? (
                                    <span className="text-red-500 text-sm">{formError.user_email_id}</span>
                                ) : (
                                    <span className="text-gray-500 text-sm">Enter your email address</span>
                                )
                            }
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className={"font-medium"}>Password</Label>
                            <div className={"relative"}>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={"Password"}
                                    value={companyDetails.user_password}
                                    name={'user_password'}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    onKeyDown={handleKeyDown}
                                    className={"border-slate-300 placeholder:text-slate-400"}
                                />
                                <Button variant={"ghost hover:none"} onClick={togglePasswordVisibility} className={"absolute top-0 right-0"}>
                                    {showPassword ? <Eye/> : <EyeOff /> }
                                </Button>
                            </div>
                            <div className={"flex justify-between"}>
                                {
                                    formError.user_password && <span className="text-red-500 text-sm">{formError.user_password}</span>
                                }
                                <Button variant={"link"}
                                        className="ml-auto inline-block text-sm p-0 h-auto hover:no-underline"
                                        onClick={() => navigate(`${baseUrl}/forgot-password`)}
                                >
                                    <span className={"font-normal text-slate-500"}>Forgot your password?</span>
                                </Button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-600" onClick={onLogin}>
                            {
                                isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : ""
                            }
                            <span className={"font-normal"}>Login</span>
                        </Button>
                        <div className={"or-divider flex items-center"}>
                            <div className={"border-t basis-4/12 border-slate-500"}/>
                            <p className={"text-xs font-medium text-slate-500 basis-4/12 text-center"}>Or continue with</p>
                            <div className={"border-t basis-4/12 border-slate-500"}/>
                        </div>
                        <Button variant="outline" className="w-full border border-violet-600">
                            <span className={"font-normal flex gap-x-1 text-violet-600 font-semibold"}>
                                {Icon.googleIcon}
                                Login With Google
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default Login;