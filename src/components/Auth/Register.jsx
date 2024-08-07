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

const initialState = {
    user_first_name: '',
    user_last_name: '',
    user_email_id: '',
    user_password: '',
    user_confirm_password: '',
    user_status: '1'
}

const Register = () => {
    const {theme} = useTheme();
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
            toast({description: data.message})
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
            toast({variant: "destructive" ,description: data.message,})
        }
    }

    const plugin = React.useRef(Autoplay({delay: 2000, stopOnInteraction: true}))

    const togglePasswordVisibility = (fieldName) => {
        setPasswordVisibility({
            ...passwordVisibility,
            [fieldName]: !passwordVisibility[fieldName]
        });
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onRegister();
        }
    };

    return (
        <div className="h-full">
            <div className="ltr">
                <div>
                    <div className={"min-h-screen bg-background  flex items-center  overflow-hidden w-full"}>
                        <div className={"min-h-screen basis-full flex w-full  justify-center overflow-y-auto"}>
                            <div className="min-h-screen basis-1/2 bg-purple-400 w-full relative hidden xl:flex justify-center p-16 ">
                                <div>
                                    <div className={"app-logo"}>{theme === "dark" ? Icon.whiteLogo : Icon.blackLogo}</div>
                                    <Carousel
                                        plugins={[plugin.current]}
                                        className="w-full mt-[25px] mb-[25px]"
                                        onMouseEnter={plugin.current.stop}
                                        onMouseLeave={plugin.current.reset}
                                    >
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
                                                Already have an account?{" "}
                                                <Button
                                                    variant={"link"}
                                                    className="p-0 h-auto hover:no-underline"
                                                    onClick={() => onRedirect('login')}
                                                >
                                                    <span className={"font-bold text-primary"}>Login</span>
                                                </Button>
                                            </p>
                                        </div>
                                        <div className="mx-auto grid w-[320px] md:w-[392px] gap-8 lg:pt-[47px] pt-[50px] px-3">
                                        <div className="gap-2 flex flex-col items-center">
                                            {theme === "dark" ? Icon.whiteLogo : Icon.blackLogo}
                                            <h1 className="text-2xl md:text-3xl font-medium">Let's Set Up Your Account</h1>
                                            <h6 className="font-normal text-sm text-muted-foreground">
                                                Enhance customer experience now.
                                            </h6>
                                        </div>
                                        <div className="grid gap-6">
                                            <div className="grid md:grid-flow-col gap-4">
                                                <div className="grid gap-2 content-start">
                                                    <Label htmlFor="email" className={"font-medium"}>First Name</Label>
                                                    <Input
                                                        id="user_first_name"
                                                        placeholder="First Name"
                                                        value={companyDetails.user_first_name}
                                                        name={'user_first_name'}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                    />
                                                    <div className="grid gap-2">
                                                        {
                                                            formError.user_first_name &&
                                                            <span className="text-destructive text-sm">{formError.user_first_name}</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="grid gap-2 content-start">
                                                    <Label htmlFor="email" className={"font-medium"}>Last
                                                        Name</Label>
                                                    <Input
                                                        id="user_last_name"
                                                        placeholder="Last Name"
                                                        value={companyDetails.user_last_name}
                                                        name={'user_last_name'}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                    />
                                                    <div className="grid gap-2">
                                                        {
                                                            formError.user_last_name &&
                                                            <span className="text-destructive text-sm">{formError.user_last_name}</span>
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
                                                    />
                                                    {
                                                        formError.user_email_id &&
                                                        <span className="text-destructive text-sm">{formError.user_email_id}</span>
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
                                                        />
                                                        <Button
                                                            variant={"ghost hover:none"}
                                                            onClick={() => togglePasswordVisibility('user_password')}
                                                            className={"absolute top-0 right-0"}
                                                        >
                                                            {passwordVisibility.user_password ? <Eye size={16} stroke={`${theme === "dark" ? "white" : "black"}`}/> : <EyeOff size={16} stroke={`${theme === "dark" ? "white" : "black"}`}/>}
                                                        </Button>
                                                    </div>
                                                    {
                                                        formError.user_password &&
                                                        <span className="text-destructive text-sm">{formError.user_password}</span>
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
                                                            onKeyDown={handleKeyDown}
                                                        />
                                                        <Button
                                                            variant={"ghost hover:none"}
                                                            onClick={() => togglePasswordVisibility('user_confirm_password')}
                                                            className={"absolute top-0 right-0"}
                                                        >
                                                            {passwordVisibility.user_confirm_password ? <Eye size={16} stroke={`${theme === "dark" ? "white" : "black"}`} /> : <EyeOff size={16} stroke={`${theme === "dark" ? "white" : "black"}`}/>}
                                                        </Button>
                                                    </div>
                                                    {
                                                        formError.user_confirm_password &&
                                                        <span className="text-destructive text-sm">{formError.user_confirm_password}</span>
                                                    }
                                                </div>
                                                <Button
                                                    type="submit"
                                                    className={"w-full bg-primary hover:bg-primary"}
                                                    onClick={onRegister}
                                                >
                                                    {isLoading ? <Loader2 className={"mr-2 h-4 w-4 animate-spin"}/> : ""}
                                                    <span className={"font-normal font-semibold"}>Continue Registration</span>
                                                </Button>
                                                <div className={"or-divider flex items-center"}>
                                                    <div className={"border-t basis-4/12 border-muted-foreground"}/>
                                                    <p className={"text-xs font-medium text-muted-foreground basis-4/12 text-center"}>
                                                        Or continue with
                                                    </p>
                                                    <div className={"border-t basis-4/12 border-muted-foreground"}/>
                                                </div>
                                                <Button variant="outline" className="w-full border border-primary">
                                                    <span className={"font-normal flex gap-x-1 text-primary font-semibold"}>
                                                        {Icon.googleIcon}
                                                        Login With Google
                                                    </span>
                                                </Button>
                                                <p className='text-xs text-center'>
                                                    By registering you agree to our{" "}
                                                    <Button
                                                        variant={"link"}
                                                        className="p-0 h-auto hover:no-underline"
                                                    >
                                                        <span className={"font-medium text-primary"}>Terms of Service</span>
                                                    </Button> and {""}
                                                    <Button
                                                        variant={"link"}
                                                        className="p-0 h-auto hover:no-underline"
                                                    >
                                                        <span className={"font-medium text-primary"}>Privacy Policy</span>
                                                    </Button>.
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
        </div>
    );
};

export default Register;