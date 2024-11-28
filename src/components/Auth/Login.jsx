import React, {useState} from 'react';
import {Button} from "../ui/button"
import {Input} from "../ui/input"
import {Label} from "../ui/label"
import {useNavigate} from "react-router-dom"
import {Carousel, CarouselContent, CarouselItem} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import carousel_1 from "../../img/carousel11.png";
import carousel_2 from "../../img/carousel22.png";
import carousel_3 from "../../img/carousel33.png";
import {Icon} from "../../utils/Icon";
import {ApiService} from "../../utils/ApiService";
import {apiService, baseUrl} from "../../utils/constent";
import {Eye, EyeOff, Loader2} from "lucide-react";
import {useToast} from "../ui/use-toast";
import {useTheme} from "../theme-provider";
import WithGoogle from "./WithGoogle";
import {userDetailsAction} from "../../redux/action/UserDetailAction";
import {useDispatch} from "react-redux";

const initialState = {
    user_email_id: '',
    user_password: ''
}

const Login = () => {
    const {theme} = useTheme();
    let apiSerVice = new ApiService();
    let navigate = useNavigate();
    const {toast} = useToast();

    const [companyDetails, setCompanyDetails] = useState(initialState);
    const [formError, setFormError] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
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
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            if (token) {
                navigate(`${baseUrl}/setup?token=${token}`);
            } else {
                urlParams.delete('token')
                if(data?.onboarding == 0){
                    const datas = await apiService.getLoginUserDetails({Authorization: `Bearer ${data.access_token}`})
                    if(datas.status === 200){
                        dispatch(userDetailsAction({...datas.data}))
                        setIsLoading(false)
                    } else {
                        setIsLoading(false)
                    }
                    navigate(`${baseUrl}/on-boarding`);
                    localStorage.setItem("token-verify-onboard", data.access_token);
                } else {
                    localStorage.setItem("token", data.access_token);
                    navigate(`${baseUrl}/dashboard`);
                }
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

    const imageSources = [
        {
            img: carousel_1,
            description: 'Empower your SaaS business with Quickhunt’s feedback and roadmap tools to engage users and drive product growth.',
        },
        {
            img: carousel_2,
            description: 'Streamline feedback, track progress with roadmaps, and keep users updated through announcements—all in one platform.',
        },
        {
            img: carousel_3,
            description: 'Get started for free and keep your users engaged with timely updates. Join Quickhunt today to shape your product’s future!',
        }
    ];

    return (
        <div className="h-full">
            <div className="ltr">
                <div className={"min-h-screen bg-background flex items-center overflow-hidden w-full"}>
                    <div className={"min-h-screen basis-full flex w-full justify-center overflow-y-auto"}>
                        <div className="min-h-screen basis-1/2 bg-purple-400 w-full relative hidden xl:flex justify-center p-16 ">
                            <div className={"custom-width"}>
                            <div className={"h-full flex flex-col justify-center"}>
                                <div className={"app-logo"}>{theme === "dark" ? Icon.whiteLogo : Icon.blackLogo}</div>
                                <Carousel plugins={[plugin.current]} className={"w-full mt-[25px] mb-[25px]"} onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset}>
                                    <CarouselContent>
                                        {/*{Array.from({length: 3}).map((_, index) => (*/}
                                        {/*    <CarouselItem key={index} className={"max-w-[706px] w-full shrink-0 grow pl-4"}>*/}
                                        {/*        /!*<img className={"w-[806px]"} src={widget_01} alt=''/>*!/*/}
                                        {/*        <img className={"w-[706px]"} src={widget_01} alt=''/>*/}
                                        {/*    </CarouselItem>*/}
                                        {/*))}*/}
                                        {imageSources.map((src, index) => (
                                            <CarouselItem key={index} className={"max-w-[706px] w-full shrink-0 grow pl-4"}>
                                                <img className={"w-[706px] mb-6"} src={src.img} alt={`Carousel image ${index + 1}`} />
                                                <p className={"text-white text-center mt-4 text-lg"}>{src.description}</p>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    {/*<CarouselPrevious/>*/}
                                    {/*<CarouselNext/>*/}
                                </Carousel>
                            </div>
                            </div>
                        </div>
                        <div className=" min-h-screen md:basis-1/2 md:p-16 flex justify-center items-center">
                            <div className={"lg:w-[641px] h-full"}>
                                <div className={"w-full h-full pt-5"}>
                                    <div className="mx-auto flex items-center w-[320px] md:w-[384px] px-3 h-full">
                                        <div className={"w-full flex flex-col gap-8"}>
                                        <div className="gap-2 flex flex-col items-start">
                                            {/*{theme === "dark" ? Icon.whiteLogo : Icon.blackLogo}*/}
                                            <h1 className="text-2xl md:text-3xl font-normal flex-initial w-auto">Login</h1>
                                        </div>
                                        <div className="grid gap-6">
                                            <div className="grid gap-2">
                                                <Label htmlFor="email" className={"font-normal"}>Email</Label>
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
                                                        ""
                                                        // <span className="text-muted-foreground text-sm">Enter your email address</span>
                                                    )
                                                }
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="password" className={"font-normal"}>Password</Label>
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
                                                            // className="ml-auto inline-block text-sm p-0 h-auto hover:no-underline"
                                                            className="inline-block text-sm p-0 h-auto hover:no-underline"
                                                            // onClick={() => navigate(`${baseUrl}/forgot-password`)}
                                                            onClick={() => onRedirect('forgot-password')}
                                                    >
                                                        <span className={"text-primary"}>Forgot your password?</span>
                                                    </Button>
                                                </div>
                                            </div>
                                            <Button
                                                type="submit"
                                                className="w-full bg-primary hover:bg-primary"
                                                onClick={onLogin}
                                            >
                                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : ""}
                                                <span className={"font-medium"}>Login</span>
                                            </Button>
                                            <div className={"or-divider flex items-center"}>
                                                <div className={"border-t basis-4/12 border-muted-foreground"}/>
                                                <p className={"text-xs text-muted-foreground basis-4/12 text-center"}>
                                                    Or continue with
                                                </p>
                                                <div className={"border-t basis-4/12 border-muted-foreground"}/>
                                            </div>
                                            <WithGoogle title={"Login With Google"}/>
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