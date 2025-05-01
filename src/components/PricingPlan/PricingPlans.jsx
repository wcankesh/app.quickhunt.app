import React, { useState } from 'react';
import { useTheme } from "../theme-provider";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { userDetailsAction } from "../../redux/action/UserDetailAction";
import { useToast } from "../ui/use-toast";
import {apiService} from "../../utils/constent";

const PricingPlans = () => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);
    const { toast } = useToast();

    const [tab, setTab] = useState(userDetailsReducer.subscr_type || 1);
    const [isLoading, setLoading] = useState('');

    const plans = [
        {
            name: "Free",
            priceMonthly: 0,
            priceYearly: 0,
            description: "Essential features you need to get started",
            features: ["Unlimited Post", "1 Widget", "1 Project", "1 Ideas Board", "1 Team Member", "1 Public Roadmap", "In-App Message", "User Analytics", "Branding"],
            planType: 0,
            priceIdMonthly: "",
            priceIdYearly: "",
            disabled: userDetailsReducer.plan === 0,
            btnText:  0 < userDetailsReducer.plan ? "Downgrade" : "Activated"
        },
        {
            name: "Startup",
            priceMonthly: 19,
            priceYearly: 182.4,
            description: "Perfect for owners of small & medium businesses",
            features: ["All In Free+", "Unlimited Widget", "Unlimited Project", "Unlimited Ideas board", "Unlimited Team Member", "Unlimited Public Roadmap", "Custom Domain", "Integration (Coming soon)", "Remove Branding"],
            planType: 1,
            priceIdMonthly: "price_1PzW6fKS40mIQp5TIJDvqEVr",
            priceIdYearly: "price_1PzWDWKS40mIQp5T2OUEiOYK",
            disabled: tab === userDetailsReducer.subscr_type && userDetailsReducer.plan === 1 && userDetailsReducer.final_expiration_time !== "" ? false : userDetailsReducer.plan === 1,
            btnText:  tab === userDetailsReducer.subscr_type && userDetailsReducer.plan === 1 && userDetailsReducer.final_expiration_time !== "" ? "Resubscribe" : userDetailsReducer.plan === 1 ? "Activated" : userDetailsReducer.plan > 1 ? "Downgrade" :"Upgrade"
        },
    ];

    const redirectToCheckout = async (price, id) => {
        setLoading(price);
        if(price === ""){
            const data = await apiService.cancelPlan()
            if (data.success) {
                dispatch(userDetailsAction({ ...data.data.user_detail }));
                toast({ description: data.message });
            } else {
                toast({ variant: "destructive", description: data.message });
                setLoading("");
            }
        } else {
            if (userDetailsReducer.plan === id && userDetailsReducer.final_expiration_time !== "") {
                const data = await apiService.resubscribe({ plan: id, subscr_type: tab });
                if (data.success) {
                    setLoading("");
                    dispatch(userDetailsAction({ ...data.data.user_detail }));
                    toast({ description: data.message });
                } else {
                    toast({ variant: "destructive", description: data.message });
                    setLoading("");
                }
            } else {
                if (userDetailsReducer.plan === 0) {
                    const data = await apiService.checkout({ plan: id, subscr_type: tab });
                    if (data.success) {
                        window.open(data.url, "_self");
                        setLoading("");
                    } else {
                        setLoading("");
                    }
                } else {
                    const data = await apiService.upcomingInvoice({ plan: id, subscr_type: tab });
                    if (data.success) {
                        setLoading("");
                    } else {
                        const res = await apiService.changePlan({ plan: id, subscr_type: tab });
                        if (res.success) {
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
        if (data.success) {
            window.open(data.url, "top");
            toast({ description: data.message });
        } else {
            toast({ variant: "destructive", description: data.message });
        }
    }

    const onChangeTab = (type) => {setTab(type)}

    return (
        <div className={"container xl:max-w-[1130px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4 space-y-8"}>
            <div>
                <div className={"flex flex-col justify-center items-center"}>
                        <h3 className={"text-center text-2xl font-normal"}>Pricing & Plan</h3>
                        <p className={`pt-2 text-center flex items-center max-w-[256px] w-full capitalize text-sm ${theme === "dark" ? "" : "text-muted-foreground"}`}>Perfect for owners of small & medium businesses</p>
                </div>
                <div className={"flex justify-center pt-6"}>
                    <div className={"flex px-[5px] py-1 border rounded-md gap-1"}>
                        <Button onClick={() => onChangeTab(1)} variant={"ghost hover:none"} className={`font-normal w-[78px] h-8 ${tab === 1 ? "bg-[#EEE4FF] text-[#7C3AED]" : ""}`}>Monthly</Button>
                        <Button onClick={() => onChangeTab(2)} variant={"ghost hover:none"} className={`font-normal w-[78px] h-8 ${tab === 2 ? "bg-[#EEE4FF] text-[#7C3AED]" : ""}`}>Yearly</Button>
                    </div>
                </div>
            </div>
            <div className={"flex flex-row justify-center gap-[18px] max-[639px]:flex-wrap xl:flex-nowrap lg:flex-wrap sm:flex-wrap"}>
                {plans.map((x) => {
                    const isActivated = userDetailsReducer.plan === x.planType && userDetailsReducer.subscr_type === tab;
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
                            <h3 className={"text-2xl font-normal mb-4"}>{x.name}</h3>
                            <h3 className={"text-[32px] font-medium pb-6"}>
                                ${tab === 1 ? x.priceMonthly: x.priceYearly}
                                <span className={`text-xl ${theme === "dark" ? "" : "text-muted-foreground"}`}>{tab === 1 ? "/month" : "/year"}</span>
                            </h3>
                            <p className={`capitalize text-sm font-normal h-[32px] ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                {x.description}
                            </p>
                            <div className={`flex flex-col gap-4 pb-[34px] mt-[34px]`}>
                                {(x.features || []).map((y) => (
                                    <div key={y} className={`text-sm font-normal ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                        <div className={"flex gap-4"}>
                                            <Check size={18} />
                                            <span>{y}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button
                                className={`w-full font-medium`}
                                // disabled={isActivated && x.disabled}
                                disabled={
                                    isActivated ||
                                    (userDetailsReducer.plan === x.planType && userDetailsReducer.subscr_type !== tab)
                                }
                                variant={isActivated ? "outline" : ""}
                                onClick={() => redirectToCheckout(tab === 2 ? x.priceIdYearly : tab === 1 ? x.priceMonthly : "", x.planType)}
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
