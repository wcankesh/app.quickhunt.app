import React, {useState} from 'react';
import {Button} from "../ui/button"
import {Input} from "../ui/input"
import {Label} from "../ui/label"
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

const initialState = {
    user_first_name: '',
    user_last_name: '',
    user_email_id: '',
    user_password: '',
    user_confirm_password: '',
    user_status: '1'
}
const initialStateError = {
    user_first_name: '',
    user_last_name: '',
    user_email_id: '',
    user_password: '',
    user_confirm_password: '',
}

const Register = () => {
    let apiSerVice = new ApiService()
    let navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [companyDetails, setCompanyDetails] = useState(initialState);
    const [formError, setFormError] = useState(initialState);
    const [passwordVisibility, setPasswordVisibility] = useState({
        user_password: false,
        user_confirm_password: false
    });
    const {toast} = useToast()

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

    const onRegister = async () => {
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
        const payload = {
            ...companyDetails
        }
        const data = await apiSerVice.adminSignup(payload)
        if (data.status === 200) {
            toast({
                description: "Register successfully!",
            })
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            if (token) {
                navigate(`${baseUrl}/login?token=${token}`);
            } else {
                navigate(`${baseUrl}/login`);
            }
            setIsLoading(false)
        } else {
            setIsLoading(false)
            toast({
                description: "Something want wrong!",
            })
        }
    }

    const plugin = React.useRef(
        Autoplay({delay: 2000, stopOnInteraction: true})
    )

    const togglePasswordVisibility = (fieldName) => {
        setPasswordVisibility({
            ...passwordVisibility,
            [fieldName]: !passwordVisibility[fieldName]
        });
    };

    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[100vh]">
        {/*<div className="w-full flex justify-center h-[100vh]">*/}
        {/*    <div className="hidden lg:block p-16 lg:flex justify-between flex-col basis-1/2 bg-purple-400">*/}
            <div className="hidden lg:block p-16 lg:flex bg-purple-400 justify-center pb-[90px]">
                <div className={"grid gap-6"}>
                <div className={"app-logo"}>
                    <img src={AppLogoWhite} alt={"app-logo"}/>
                </div>
                <Carousel
                    plugins={[plugin.current]}
                    className="w-full"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                >
                    <CarouselContent>
                        {Array.from({length: 3}).map((_, index) => (
                            <CarouselItem key={index}>
                                <img className={"w-[806px]"} src={widget_01} alt= '' />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {/*<CarouselPrevious/>*/}
                    {/*<CarouselNext/>*/}
                </Carousel>
                <div className={"description"}>
                    <p className={"text-white text-center text-2xl"}>“This library has saved me countless hours of work and
                        helped me deliver stunning designs to my clients faster than ever before.”</p>
                </div>
                </div>
            </div>
            {/*<div className="flex flex-col p-16 basis-1/2 justify-between">*/}
            <div className="flex p-16">
                <div className={"w-full"}>
                <div className="text-right text-sm">
                    <p className={"font-medium"}>
                        Already have an account?{" "}
                        <Button
                            variant={"link"}
                            className="p-0 h-auto hover:no-underline"
                            onClick={() => navigate(`${baseUrl}/login`)}
                        >
                            <span className={"font-bold text-violet-600"}>Login</span>
                        </Button>
                    </p>
                </div>
                {/*<div className="mx-auto grid w-[384px] gap-8">*/}
                <div className="mx-auto grid w-[392px] gap-8 lg:pt-[76px] sm:pt-[100px] xs:pt-[50px]">
                <div className="gap-2 flex flex-col items-center">
                            <img src={AppLogoPurple} alt={""}/>
                        <h1 className="text-3xl font-medium text-slate-900">Let's Set Up Your Account</h1>
                        <h6 className="font-normal text-sm text-zinc-500">Enhance customer experience now.</h6>
                    </div>
                    <div className="grid gap-6">
                        <div className="grid grid-flow-col gap-4">
                            <div className="grid gap-2 content-start">
                                    <Label htmlFor="email" className={"font-medium"}>First Name</Label>
                                    <Input
                                        id="user_first_name"
                                        placeholder="First Name"
                                        value={companyDetails.user_first_name}
                                        name={'user_first_name'}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className={"border-slate-300 placeholder:text-slate-400"}
                                    />
                                <div className="grid gap-2">
                                    {
                                        formError.user_first_name &&
                                        <span className="text-red-500 text-sm">{formError.user_first_name}</span>
                                    }
                                </div>
                            </div>
                            <div className="grid gap-2 content-start">
                                    <Label htmlFor="email" className={"font-medium"}>Last Name</Label>
                                    <Input
                                        id="user_last_name"
                                        placeholder="Last Name"
                                        value={companyDetails.user_last_name}
                                        name={'user_last_name'}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className={"border-slate-300 placeholder:text-slate-400"}
                                    />
                                <div className="grid gap-2">
                                    {
                                        formError.user_last_name &&
                                        <span className="text-red-500 text-sm">{formError.user_last_name}</span>
                                    }
                                </div>
                            </div>
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
                                    formError.user_email_id &&
                                    <span className="text-red-500 text-sm">{formError.user_email_id}</span>
                                }
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password" className={"font-medium"}>Password</Label>
                                </div>
                                <div className={"relative"}>
                                    <Input
                                        id="password"
                                        type={passwordVisibility.user_password ? "text" : "password"}
                                        placeholder={"Password"}
                                        value={companyDetails.user_password}
                                        name={'user_password'}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className={"border-slate-300 placeholder:text-slate-400"}
                                    />
                                    <Button variant={"ghost hover:none"} onClick={() => togglePasswordVisibility('user_password')}
                                            className={"absolute top-0 right-0"}>
                                        {passwordVisibility.user_password ? <Eye/> : <EyeOff/>}
                                    </Button>
                                </div>
                                {
                                    formError.user_password &&
                                    <span className="text-red-500 text-sm">{formError.user_password}</span>
                                }
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword" className={"font-medium"}>Confirm Password</Label>
                                <div className={"relative"}>
                                    <Input
                                        id="confirmPassword"
                                        type={passwordVisibility.user_confirm_password ? "text" : "password"}
                                        placeholder={"Confirm Password"}
                                        value={companyDetails.user_confirm_password}
                                        name={'user_confirm_password'}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className={"border-slate-300 placeholder:text-slate-400"}
                                    />
                                    <Button variant={"ghost hover:none"}
                                            onClick={() => togglePasswordVisibility('user_confirm_password')}
                                            className={"absolute top-0 right-0"}>
                                        {passwordVisibility.user_confirm_password ? <Eye/> : <EyeOff/>}
                                    </Button>
                                </div>
                                {
                                    formError.user_confirm_password &&
                                    <span className="text-red-500 text-sm">{formError.user_confirm_password}</span>
                                }
                            </div>
                            <Button type="submit" className={"w-full bg-violet-600 hover:bg-violet-600"}
                                    onClick={onRegister}>
                                {
                                    isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : ""
                                }
                                <span className={"font-normal font-semibold"}>Continue Registration</span>
                            </Button>
                            <div className={"or-divider flex items-center"}>
                                <div className={"border-t basis-4/12 border-slate-500"}/>
                                <p className={"text-xs font-medium text-slate-500 basis-4/12 text-center"}>Or continue
                                    with</p>
                                <div className={"border-t basis-4/12 border-slate-500"}/>
                            </div>
                            <Button variant="outline" className="w-full border border-violet-600">
                            <span className={"font-normal flex gap-x-1 text-violet-600 font-semibold"}>
                                {Icon.googleIcon}
                                Login With Google
                            </span>
                            </Button>
                            <p className='text-xs text-center'>
                                By registering you agree to our{" "}
                                <Button variant={"link"}
                                        className="p-0 h-auto hover:no-underline"> <span
                                    className={"font-medium text-violet-600"}>Terms of Service</span></Button> and {""}
                                <Button variant={"link"}
                                        className="p-0 h-auto hover:no-underline"> <span
                                    className={"font-medium text-violet-600"}>Privacy Policy</span></Button>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default Register;