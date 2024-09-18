import React, {Fragment} from 'react';
import {Button} from "../../ui/button";
import {Icon} from "../../../utils/Icon";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../../utils/constent";

const ThankYou = () => {
    let navigate = useNavigate();
    return (
        <Fragment>
            <div className={"space-y-8"}>
                <div>
                    <h1 className={"text-[32px] font-bold text-primary"}>Thank You for Signing Up!</h1>
                </div>
                <div className={"flex flex-col gap-4"}>
                    <h3 className={"text-2xl font-semibold"}>We’re excited to have you on board.</h3>
                    <p className={"text-sm"}>Your journey with Quickhunt starts now! Here’s what you can do next:</p>
                    <p className={"text-sm"}>Need help? Check out our help center or contact our <Button variant={"ghost hover:none"} className={"p-0 text-primary h-auto font-bold"}>24/7 support team.</Button></p>
                </div>
                <div className={"space-y-8"}>
                    <p className={"text-sm"}>Follow us on social media for the latest updates and tips!</p>
                    <div className={"flex justify-center gap-[56px]"}>
                        <Button variant={"ghost hover:none"} className={"h-auto p-0"}>{Icon.twitterX}</Button>
                        <Button variant={"ghost hover:none"} className={"h-auto p-0"}>{Icon.linkedIn}</Button>
                        <Button variant={"ghost hover:none"} className={"h-auto p-0"}>{Icon.onBoardInsta}</Button>
                    </div>
                </div>
                <div className={"flex justify-between gap-2"}>
                    <Button className={"font-semibold px-[29px] hover:bg-primary"}>Create in app message</Button>
                    <Button variant={"ghost hover:none"} className={"font-semibold px-[29px] border border-primary text-primary border-2"} onClick={() => navigate(`${baseUrl}/dashboard`)}>Go to dashboard</Button>
                </div>
            </div>
        </Fragment>
    );
};

export default ThankYou;