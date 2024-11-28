import React, {Fragment} from 'react';
import {Button} from "../../ui/button";
import {Icon} from "../../../utils/Icon";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../../utils/constent";

const socialLinks = [
    {
        name: "Facebook",
        url: "https://www.facebook.com/quickhuntapp",
        icon: Icon.facebookIcon,
    },
    {
        name: "TwitterX",
        url: "https://x.com/quickhuntapp",
        icon: Icon.twitterX,
    },
    {
        name: "LinkedIn",
        url: "https://www.linkedin.com/company/quickhunt-app",
        icon: Icon.linkedIn,
    },
    {
        name: "Instagram",
        url: "https://www.instagram.com/quickhunt.app",
        icon: Icon.onBoardInsta,
    },
];

const ThankYou = () => {
    let navigate = useNavigate();
    return (
        <Fragment>
            <h1 className={"text-3xl md:text-[32px] font-bold text-primary"}>Thank You for Signing Up!</h1>
            <div className={"flex flex-col gap-4"}>
                <h3 className={"text-xl md:text-2xl font-semibold"}>We’re excited to have you on board.</h3>
                <p className={"text-sm"}>Your journey with Quickhunt starts now! Here’s what you can do next:</p>
                <Button variant={"ghost hover:none"} className={"font-semibold border border-primary text-primary border-2"} onClick={() => navigate(`${baseUrl}/dashboard`)}>Go to dashboard</Button>
                <p className={"text-sm"}>Need help? Check out our help center or contact our <Button variant={"ghost hover:none"} className={"p-0 text-primary h-auto font-bold"}>24/7 support team.</Button></p>
            </div>
            <div className={"space-y-8"}>
                <p className={"text-sm"}>Follow us on social media for the latest updates and tips!</p>
                <div className={"flex justify-center gap-[56px]"}>
                    {socialLinks.map((link, index) => (
                        <Button
                            key={index}
                            variant={"ghost hover:none"}
                            className={"h-auto p-0"}
                            onClick={() => window.open(link.url, "_blank")}
                            aria-label={`Open ${link.name}`}
                        >
                            {link.icon}
                        </Button>
                    ))}
                </div>
            </div>
        </Fragment>
    );
};

export default ThankYou;