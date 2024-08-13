import React, {useState} from 'react';
import {Button} from "../ui/button"
import {Input} from "../ui/input"
import {Label} from "../ui/label"
import {useNavigate} from "react-router-dom"
import {Carousel, CarouselContent, CarouselItem} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import widget_01 from "../../img/widget.png";
import {Icon} from "../../utils/Icon";
import {ApiService} from "../../utils/ApiService";
import {baseUrl} from "../../utils/constent";
import {Eye, EyeOff, Loader2} from "lucide-react";
import {useToast} from "../ui/use-toast";
import {useTheme} from "../theme-provider";
import WithGoogle from "./WithGoogle";

const initialState = {
    user_email_id: '',
    user_password: ''
}

const Login = () => {
    const {theme} = useTheme();
    let apiSerVice = new ApiService();
    let navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [companyDetails, setCompanyDetails] = useState(initialState);
    const [formError, setFormError] = useState(initialState);
    const [showPassword, setShowPassword] = useState(false);
    const {toast} = useToast()

    const onChange = (event) => {
        setCompanyDetails({...companyDetails, [event.target.name]: event.target.value});
        setFormError(formError => ({
            ...formError,
            [event.target.name]: ""
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

    const onLogin = async () => {
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
            ...companyDetails,
            login_type: "1"
        }
        const data = await apiSerVice.login(payload)
        if (data.access_token) {
            toast({description: data.message})
            localStorage.setItem("token", data.access_token);
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            if (token) {
                navigate(`${baseUrl}/setup?token=${token}`);
            } else {
                urlParams.delete('token')
                navigate(`${baseUrl}/dashboard`);
            }
            setIsLoading(false)
        } else {
            setIsLoading(false)
            toast({variant: "destructive", description: data.message})
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onLogin();
        }
    };

    const plugin = React.useRef(Autoplay({delay: 2000, stopOnInteraction: true}))

    const togglePasswordVisibility = () => {setShowPassword(!showPassword);};

    return (
        <div className="h-full">
            <div className="ltr">
                <div className={"min-h-screen bg-background flex items-center overflow-hidden w-full"}>
                    <div className={"min-h-screen basis-full flex w-full justify-center overflow-y-auto"}>
                        <div className="min-h-screen basis-1/2 bg-purple-400 w-full relative hidden xl:flex justify-center p-16 ">
                            <div>
                                <div className={"app-logo"}>{theme === "dark" ? Icon.whiteLogo : Icon.blackLogo}</div>
                                <Carousel plugins={[plugin.current]} className={"w-full mt-[25px] mb-[25px]"} onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset}>
                                    <CarouselContent>
                                        {Array.from({length: 3}).map((_, index) => (
                                            <CarouselItem key={index}>
                                                <img className={"w-[806px]"} src={widget_01} alt=''/>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    {/*<CarouselPrevious/>*/}
                                    {/*<CarouselNext/>*/}
                                </Carousel>
                                <div className={"description"}>
                                    <p className={"text-white text-center text-[26px]"}>“This library has saved me
                                        countless hours of work and
                                        helped me deliver stunning designs to my clients faster than ever
                                        before.”</p>
                                </div>
                            </div>
                        </div>
                        <div className=" min-h-screen md:basis-1/2 md:p-16 flex justify-center items-center">
                            <div className={"lg:w-[641px] h-full"}>
                                <div className={"w-full pt-5"}>
                                    <div className="text-center md:text-right text-xs md:text-sm">
                                        <p className={"font-medium"}>
                                            Don't have an account?{" "}
                                            <Button
                                                variant={"link"}
                                                className="p-0 h-auto hover:no-underline"
                                                onClick={() => onRedirect('register')}
                                            >
                                                <span
                                                    className={"font-bold text-primary"}>Create an account</span>
                                            </Button>
                                        </p>
                                    </div>
                                    <div className="mx-auto grid w-[320px] md:w-[384px] gap-8 lg:pt-[47px] pt-[50px] px-3">
                                        <div className="gap-2 flex flex-col items-center">
                                            {theme === "dark" ? Icon.whiteLogo : Icon.blackLogo}
                                            <h1 className="text-2xl md:text-3xl font-medium ">Login to Your Account</h1>
                                            <h6 className="text-center font-normal text-sm text-muted-foreground">
                                                Enter your email below to create your account
                                            </h6>
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
                                                />
                                                {
                                                    formError.user_email_id ? (
                                                        <span className="text-destructive text-sm">{formError.user_email_id}</span>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">Enter your email address</span>
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
                                                    />
                                                    <Button variant={"ghost hover:none"}
                                                            onClick={togglePasswordVisibility}
                                                            className={"absolute top-0 right-0"}>
                                                        {showPassword ? <Eye size={16} stroke={`${theme === "dark" ? "white" : "black"}`}/> : <EyeOff size={16} stroke={`${theme === "dark" ? "white" : "black"}`}/>}
                                                    </Button>
                                                </div>
                                                <div className={"flex justify-between"}>
                                                    {formError.user_password && <span className="text-destructive text-sm">{formError.user_password}</span>}
                                                    <Button variant={"link"}
                                                            className="ml-auto inline-block text-sm p-0 h-auto hover:no-underline"
                                                            onClick={() => navigate(`${baseUrl}/forgot-password`)}
                                                    >
                                                        <span className={"font-normal text-muted-foreground"}>Forgot your password?</span>
                                                    </Button>
                                                </div>
                                            </div>
                                            <Button
                                                type="submit"
                                                className="w-full bg-primary hover:bg-primary"
                                                onClick={onLogin}
                                            >
                                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : ""}
                                                <span className={"font-semibold"}>Login</span>
                                            </Button>
                                            <div className={"or-divider flex items-center"}>
                                                <div className={"border-t basis-4/12 border-muted-foreground"}/>
                                                <p className={"text-xs font-medium text-muted-foreground basis-4/12 text-center"}>
                                                    Or continue with
                                                </p>
                                                <div className={"border-t basis-4/12 border-muted-foreground"}/>
                                            </div>
                                            <WithGoogle title={"Login With Google"}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;