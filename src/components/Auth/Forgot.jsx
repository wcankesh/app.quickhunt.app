import React, {useState, useEffect} from 'react';
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Card, CardContent} from "../ui/card";
import {Button} from "../ui/button";
import {Loader2} from "lucide-react";
import {useToast} from "../ui/use-toast";
import {ApiService} from "../../utils/ApiService";
import {Icon} from "../../utils/Icon";
import {useTheme} from "../theme-provider";
import {Carousel, CarouselContent, CarouselItem} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {baseUrl} from "../../utils/constent";
import {useNavigate} from "react-router-dom";
import carousel_1 from "../../img/carousel1.png";
import carousel_2 from "../../img/carousel2.png";
import carousel_3 from "../../img/carousel3.png";

const Forgot = () => {
    const {theme} = useTheme();
    let apiSerVice = new ApiService();
    let navigate = useNavigate();
    const {toast} = useToast()

    const [formError, setFormError] = useState({email: ""});
    const [forgotPasswordDetails, setForgotPasswordDetails] = useState({email: ""});
    const [isLoading, setIsLoading] = useState(false);

    const getForgetDetail = async () => {
        const getDetail = await apiSerVice.forgotPassword();
        if (getDetail.status === 200) {
            console.log('getDetail', getDetail)
        }
    }

    useEffect(() => {
        getForgetDetail()
    }, []);

    const onChange = (event) => {
        setForgotPasswordDetails({...forgotPasswordDetails, [event.target.name]: event.target.value})
        setFormError(formError => ({
            ...formError,
            [event.target.name]: formValidate(event.target.name, event.target.value)
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

    const onSubmit = async () => {
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
        const data = await apiSerVice.forgotPassword({email: forgotPasswordDetails.email})
        if (data.status === 200) {
            setForgotPasswordDetails({email: ""})
            toast({description: data.message,})
            setIsLoading(false)
        } else {
            toast({variant: "destructive", description: data.message})
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
        return;
    };

    const plugin = React.useRef(Autoplay({delay: 2000, stopOnInteraction: true}))

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
                        <div
                            className="min-h-screen basis-1/2 bg-purple-400 w-full relative hidden xl:flex justify-center p-16 ">
                            <div className={"custom-width"}>
                                <div className={"h-full flex flex-col justify-center"}>
                                    <div
                                        className={"app-logo"}>{theme === "dark" ? Icon.whiteLogo : Icon.blackLogo}</div>
                                    <Carousel plugins={[plugin.current]} className={"w-full mt-[25px] mb-[25px]"}
                                              onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset}>
                                        <CarouselContent>
                                            {/*{Array.from({length: 3}).map((_, index) => (*/}
                                            {/*    <CarouselItem key={index}*/}
                                            {/*                  className={"max-w-[706px] w-full shrink-0 grow pl-4"}>*/}
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
                                    <div className="mx-auto flex items-center w-[320px] md:w-[640px] px-3 h-full">
                                        <div className={"w-full flex flex-col gap-8"}>
                                            <h1 className="scroll-m-20 text-2xl md:text-3xl font-medium text-center lg:text-3xl">
                                                Forgot Password
                                            </h1>
                                            <div className={"mb-2.5"}>
                                                <p className="text-sm text-center text-muted-foreground">
                                                    Provide the email associated with your Quickhunt account, and we'll send a password reset link.
                                                </p>
                                            </div>
                                            <div className={"mt-2.5"}>
                                                <Card>
                                                    <CardContent className={"p-3 md:p-6 space-y-1.5"}>
                                                        <Label htmlFor="email" className={"font-normal"}>Your
                                                            Email</Label>
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
                                                            formError.email && <span
                                                                className="text-destructive text-sm">{formError.email}</span>
                                                        }
                                                        <Button
                                                            className={"w-full mt-2.5 bg-primary hover:bg-primary"}
                                                            disabled={forgotPasswordDetails.email === "" || forgotPasswordDetails.email.trim() === ""}
                                                            onClick={onSubmit}
                                                        >
                                                            {
                                                                isLoading ? <Loader2
                                                                    className="mr-2 h-4 w-4 animate-spin"/> : ""
                                                            }
                                                            Reset Password
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                                <div className="text-center text-xs md:text-sm">
                                                    <p className={"text-sm text-muted-foreground"}>
                                                        Go back to {" "}
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forgot;