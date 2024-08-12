import React, { useState } from 'react';
import { useTheme } from "../theme-provider";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { userDetailsAction } from "../../redux/action/UserDetailAction";
import { ApiService } from "../../utils/ApiService";
import { useToast } from "../ui/use-toast";

const PricingPlans = () => {
    const { theme } = useTheme();
    const apiService = new ApiService();
    const { toast } = useToast();

    const [tab, setTab] = useState(0);
    const [isLoading, setLoading] = useState('');

    const dispatch = useDispatch();
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);

    const plans = [
        {
            name: "Free",
            price: 0,
            description: "Essential features you need to get started",
            features: ["Unlimited posts", "1 Ideas board", "Public Roadmap", "1 Project", "1 Manager", "All core features"],
            planType: 0,
            productId: "",
            disabled: userDetailsReducer.plan === 0,
            btnText: userDetailsReducer.plan <= 0 ? "Downgrade" : "Activated"
        },
        {
            name: "Startup",
            price: 19,
            description: "Perfect for owners of small & medium businesses",
            features: ["Unlimited Ideas board", "Unlimited Project", "Public Roadmap", "Unlimited Manager", "All core features", "Custom Domain"],
            planType: 1,
            productId: "price_1Pi8vSKS40mIQp5T8LrFd5QC",
            disabled: userDetailsReducer.plan === 1 && userDetailsReducer.final_expiration_time !== "" ? false : userDetailsReducer.plan === 1,
            btnText: userDetailsReducer.plan === 1 && userDetailsReducer.final_expiration_time !== "" ? "Upgrade" : userDetailsReducer.plan === 1 ? "Activated" : userDetailsReducer.plan > 1 ? "Downgrade" : "Upgrade"
        },
    ];

    const redirectToCheckout = async (price, id) => {
        setLoading(price);
        if(price === ""){
            console.log("das")
            const data = await apiService.cancelPlan()
            if (data.status === 200) {
                dispatch(userDetailsAction({ ...data.data.user_detail }));
                toast({ description: data.message });
            } else {
                toast({ variant: "destructive", description: data.message });
                setLoading("");
            }
        } else {
            if (userDetailsReducer.plan === id && userDetailsReducer.final_expiration_time !== "") {
                const data = await apiService.resubscribe({ plan: id });
                if (data.status === 200) {
                    setLoading("");
                    dispatch(userDetailsAction({ ...data.data.user_detail }));
                    toast({ description: data.message });
                } else {
                    toast({ variant: "destructive", description: data.message });
                    setLoading("");
                }
            } else {
                if (userDetailsReducer.plan === 0) {
                    const data = await apiService.checkout({ plan: id });
                    if (data.status === 200) {
                        window.open(data.url, "_self");
                        setLoading("");
                    } else {
                        setLoading("");
                    }
                } else {
                    const data = await apiService.upcomingInvoice({ plan: id });
                    if (data.status === 201) {
                        setLoading("");
                    } else {
                        const res = await apiService.changePlan({ plan: id });
                        if (res.status === 436) {
                            toast({ description: data.message });
                            setLoading("");
                        } else {
                            setLoading("");
                        }
                    }
                }
            }
        }

    };

    const manageSub = async () => {
        const data = await apiService.manageSubscription();
        if (data.status === 200) {
            window.open(data.url, "top");
        }
    }

    return (
        <div className={"xl:container xl:max-w-[1130px] lg:container lg:max-w-[992px] md:container md:max-w-[768px] sm:container sm:max-w-[639px] xs:container xs:max-w-[475px] max-[639px]:container max-[639px]:max-w-[639px]"}>
            <div className={"py-8"}>
                <div className={"flex justify-center items-center"}>
                    <div>
                        <h3 className={"text-center text-2xl font-medium leading-8"}>Pricing & Plan</h3>
                        <p className={`pt-2 text-center flex items-center w-[256px] capitalize text-sm ${theme === "dark" ? "" : "text-muted-foreground"}`}>Perfect for owners of small & medium businesses</p>
                    </div>
                </div>
                <div className={"flex justify-center pt-6"}>
                    <div className={"flex px-[5px] py-1 border rounded-md gap-1"}>
                        <Button onClick={() => setTab(0)} variant={"ghost hover:none"} className={`font-medium w-[78px] h-8 ${tab === 0 ? "bg-[#EEE4FF] text-[#7C3AED]" : ""}`}>Monthly</Button>
                        <Button onClick={() => setTab(1)} variant={"ghost hover:none"} className={`font-medium w-[78px] h-8 ${tab === 1 ? "bg-[#EEE4FF] text-[#7C3AED]" : ""}`}>Yearly</Button>
                    </div>
                </div>
            </div>
            <div className={"flex flex-row justify-center gap-[18px] max-[639px]:flex-wrap xl:flex-nowrap lg:flex-wrap sm:flex-wrap"}>
                {plans.map((x) => {
                    const isActivated = userDetailsReducer.plan === x.planType;
                    return (
                        <div
                            key={x.planType}
                            className={`w-[354px] max-[639px]:w-max-[639px] border-[1px] px-6 pt-6 pb-8 rounded-[10px] ${isActivated ? "border-violet-600 relative" : ""}`}
                        >
                            {isActivated && (
                                <div className={"top-[-14px] bg-violet-600 rounded-[10px] text-[#F9FAFB] text-sm h-7 w-[131px] py-1 flex justify-center text-center absolute left-[30%] right-[30%]"}>
                                    <p>Activated</p>
                                </div>
                            )}
                            <h3 className={"text-2xl font-medium leading-8 mb-4"}>{x.name}</h3>
                            <h3 className={"text-[32px] font-bold pb-6 leading-8"}>
                                ${x.price}
                                <span className={`text-xl ${theme === "dark" ? "" : "text-muted-foreground"}`}>/month</span>
                            </h3>
                            <p className={`capitalize text-sm font-medium h-[32px] leading-4 ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                {x.description}
                            </p>
                            <div className={`flex flex-col gap-4 pb-[34px] mt-[34px]`}>
                                {(x.features || []).map((y) => (
                                    <div key={y} className={`text-sm font-medium leading-4 ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                        <div className={"flex gap-4"}>
                                            <Check size={18} />
                                            <span>{y}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button
                                className={`w-full font-semibold`}
                                disabled={isActivated && x.disabled}
                                variant={isActivated ? "outline" : ""}
                                onClick={() =>redirectToCheckout(x.productId, x.planType)}
                            >
                                {x.btnText}
                            </Button>
                            {isActivated && userDetailsReducer.plan !== 0 && (
                                <div className={"text-center text-sm mt-5"}>
                                    <Button variant={"link"} className={"h-auto p-0"} onClick={manageSub}>Manage your Subscription</Button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PricingPlans;
