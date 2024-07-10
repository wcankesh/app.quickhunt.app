import React, {useState} from 'react';
import {useTheme} from "../theme-provider";
import {Button} from "../ui/button";
import {ArrowDown, Check,X} from "lucide-react";
import {Card} from "../ui/card";
import {Separator} from "../ui/separator";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";


const dummyPlan =
    {
        plans: [{
                name: "Free",
                price: 0,
                description: "Essential features you need to get started",
                features: ["Example Feature Number 1", "Example Feature Number 1", "Example Feature Number 1"],
                id: 1,
            },
            {
                name: "Startup",
                price: 19,
                description: "Perfect for owners of small & medium businesses",
                features: ["Example Feature Number 1", "Example Feature Number 1", "Example Feature Number 1"],
                id: 2
            },
            {
                name: "Growth",
                price: 29,
                description: "Dedicated support and infrastructure to fit your needs",
                features: ["Example Feature Number 1", "Example Feature Number 1", "Example Feature Number 1"],
                id: 3
            }],
        activatedPlan:"Growth",
        duration:"May 28 - Jun 27"
    }

const features =[
    {
        name:"Post",
        free:"Unlimited",
        startup:"Unlimited",
        growth:"Unlimited",
        isIcon:0,
    },
    {
        name:"Users",
        free:"Unlimited",
        startup:"Unlimited",
        growth:"Unlimited",
        isIcon:0,
    },
    {
        name:"Project",
        free:"1",
        startup:"5",
        growth:"Unlimited",
        isIcon:0,
    },
    {
        name:"Team Memebers",
        free:"1",
        startup:"5",
        growth:"Unlimited",
        isIcon:0,
    },
    {
        name:"Custom Domain + SSL",
        free:"0",
        startup:"1",
        growth:"1",
        isIcon:0,
    },
    {
        name:"SSO",
        free:"0",
        startup:"1",
        growth:"1",
        isIcon:1,
    },
    {
        name:"Changelog",
        free:"1",
        startup:"1",
        growth:"1",
        isIcon:1,
    },
    {
        name:"Ideas",
        free:"0",
        startup:"1",
        growth:"1",
        isIcon:1,
    },
    {
        name:"Roadmap",
        free:"0",
        startup:"1",
        growth:"1",
        isIcon:1,
    },
    {
        name:"Analytics",
        free:"Basic",
        startup:"Advance",
        growth:"Advance",
        isIcon:0,
    },
    {
        name:"Customizations",
        free:"Basic",
        startup:"Advance",
        growth:"Advance",
        isIcon:0,
    },
    {
        name:"Stand Alone Page",
        free:"1",
        startup:"1",
        growth:"1",
        isIcon:1,
    },
    {
        name:"Stand Alone Page",
        free:"1",
        startup:"1",
        growth:"1",
        isIcon:1,
    },
    {
        name:"In App Widget",
        free:"1",
        startup:"1",
        growth:"1",
        isIcon:1,
    },
    {
        name:"Pop over",
        free:"0",
        startup:"1",
        growth:"1",
        isIcon:1,
    },
    {
        name:"Sidebar",
        free:"0",
        startup:"1",
        growth:"1",
        isIcon:1,
    },
    {
        name:"Modal",
        free:"0",
        startup:"1",
        growth:"1",
        isIcon:1,
    },
    {
        name:"Branding",
        free:"1",
        startup:"1",
        growth:"1",
        isIcon:1,
    },
    {
        name:"Post Scheduling",
        free:"0",
        startup:"1",
        growth:"1",
        isIcon:1,
    },
    {
        name:"Post Expiring",
        free:"0",
        startup:"1",
        growth:"1",
        isIcon:1,
    },
    {
        name:"Comment and Reactions",
        free:"0",
        startup:"1",
        growth:"1",
        isIcon:1,
    },
    {
        name:"Integration",
        free:"0",
        startup:"1",
        growth:"1",
        isIcon:1,
    },
]

const PricingPlans = () => {
    const { theme } =useTheme();
    const [tab,setTab]=useState(0);
    // const [showComparePlan,setShowComparePlan]=useState(false);

    return (
        <div className={"xl:container xl:max-w-[1130px] lg:container lg:max-w-[992px] md:container md:max-w-[768px] sm:container sm:max-w-[639px] xs:container xs:max-w-[475px] max-[639px]:container max-[639px]:max-w-[639px]"}>
            <div className={"py-8"}>
                <div className={"flex justify-center items-center"}>
                    <div className={""}>
                        <h3 className={"text-center text-2xl font-medium leading-8"}>Pricing & Plan</h3>
                        <p className={`pt-2 text-center flex items-center w-[256px] capitalize text-sm ${theme === "dark" ? "" : "text-muted-foreground"}`}>Perfect for owners of small & medium businessess</p>
                    </div>
                </div>
                <div className={"flex justify-center pt-6"}>
                    <div className={"flex px-[5px] py-1 border rounded-md gap-1"}>
                        <Button onClick={()=>setTab(0)} variant={"ghost hover:none"} className={`font-medium w-[78px] h-8 ${tab === 0 ? "bg-[#EEE4FF] text-[#7C3AED]" : ""}`}>Monthly</Button>
                        <Button onClick={()=>setTab(1)} variant={"ghost hover:none"} className={`font-medium w-[78px] h-8 ${tab === 1 ? "bg-[#EEE4FF] text-[#7C3AED]" : ""}`}>Yearly</Button>
                    </div>
                </div>
            </div>
            <div className={"flex flex-row justify-center gap-[18px] max-[639px]:flex-wrap xl:flex-nowrap lg:flex-wrap sm:flex-wrap"}>
                {
                    (dummyPlan.plans || []).map((x,index)=>{
                        return(
                            <div key={index} className={`w-[354px] max-[639px]:w-max-[639px]  border-[1px] px-6 pt-6 pb-8 rounded-[10px] ${index === 1 ? "border-violet-600 relative" : ""}`}>
                                {index === 1 && <div className={"top-[-14px] bg-violet-600 rounded-[10px] text-[#F9FAFB] text-sm h-7 w-[131px] py-1 flex justify-center text-center absolute left-[30%] right-[30%]"}><p>Most popular</p></div>}
                                <h3 className={"text-2xl font-medium leading-8 mb-4"}>{x.name}</h3>
                                <h3 className={"text-[32px] font-bold pb-6 leading-8"}>${x.price}<span className={`text-xl ${theme === "dark" ? "" : "text-muted-foreground"}`}>/month</span></h3>
                                <p className={`capitalize text-sm font-medium h-[32px] leading-4 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.description}</p>
                                <div className={`flex flex-col gap-4 pb-[34px] mt-[34px]`}>
                                    {
                                        (x.features || []).map((y)=>{
                                            return(
                                                <div  key={x.id} className={`text-sm font-medium leading-4 ${theme === "dark" ? "" : "text-muted-foreground"}`}><div className={"flex gap-4"}> <Check size={18} /> <span>{y}</span></div></div>
                                            )
                                        })
                                    }
                                </div>
                                {x.name === dummyPlan.activatedPlan ? <Button variant={"outline"} className={`w-full font-semibold ${theme === "dark" ? "" : "text-muted-foreground"} ${index == 1 ? "bg-violet-600" : ""}`}>Activated</Button> : <Button variant={"outline hover:none"}
                                         className={`rounded-md h-10 border border-violet-600 text-violet-600 text-[14px] font-semibold w-full font-semibold ${index == 1 ? "bg-violet-600 text-[#F9FAFB] hover:bg-violet-600" : ""}`}>
                                    Downgrade
                                </Button>}
                            </div>
                        )
                    })
                }
            </div>

        </div>
    );
};

export default PricingPlans;