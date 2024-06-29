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
    const [showComparePlan,setShowComparePlan]=useState(false);

    return (
        <div className={"xl:container-2 xl:max-w-[1130px] lg:container-2 lg:max-w-[992px] md:container md:max-w-[768px] sm:container sm:max-w-[639px] xs:container xs:max-w-[475px] "}>
            <div className={"py-8"}>
                <div className={"flex justify-center items-center"}>
                    <div className={""}>
                        <h3 className={"text-center text-2xl font-medium leading-8"}>Pricing & Plan</h3>
                        <p className={`pt-2 text-center flex items-center w-[256px] capitalize text-sm ${theme === "dark" ? "" : "text-muted-foreground"}`}>Perfect for owners of small & medium businessess</p>
                    </div>
                </div>
                <div className={"flex justify-center pt-6"}>
                    <div className={"flex px-[5px] py-1 border rounded-md gap-1"}>
                        <Button  onClick={()=>setTab(0)} variant={"ghost hover:none"} className={`font-medium w-[78px] h-8 ${tab === 0 ? "bg-[#EEE4FF] text-[#7C3AED]" : ""}`}>Monthly</Button>
                        <Button onClick={()=>setTab(1)} variant={"ghost hover:none"} className={"w-[66px] h-8"} className={`font-medium w-[78px] h-8 ${tab === 1 ? "bg-[#EEE4FF] text-[#7C3AED]" : ""}`}>Yearly</Button>
                    </div>
                </div>
            </div>
            <div className={"flex flex-row gap-[18px]"}>
                {
                    (dummyPlan.plans || []).map((x,index)=>{
                        return(
                            <div key={index} className={`basis-1/3 border-[1px] px-6 pt-6 pb-8 rounded-[10px] ${index === 1 ? "border-violet-600 relative" : ""}`}>
                                {index === 1 && <div className={"top-[-14px] bg-violet-600 rounded-[10px] text-[#F9FAFB] text-sm h-7 w-[131px] py-1 flex justify-center text-center absolute left-[30%] right-[30%] sm:left-[17%] lg:left-[23%] xl:left-[30%]"}><p>Most popular</p></div>}
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
            <div className={"pt-12 pb-16 flex justify-center"}>
                <div onClick={() => setShowComparePlan(true)} className={"cursor-pointer flex gap-4 items-center leading-4"}>
                    <h5 className={`text-sm font-semibold leading-4 ${theme === "dark" ? "" : "text-violet-600"}`}>Compare Plans </h5>
                    <ArrowDown className={`${theme === "dark" ? "" : "text-violet-600"}`} size={16} />
                </div>
            </div>
            {showComparePlan && <Card className={"pt-6 mb-16"}>
                <div className={""}>
                    <div className={"divide-x flex  w-full hover:none"}>
                        <div className={"pl-[32px] pr-[32px] w-1/4 align-top xl:w-1/4 lg:1/4"}>
                            <div className={"flex flex-col gap-2 py-2"}>
                                <h5 className={`font-medium text-base tracking-[-0.16px] leading-5 ${theme === "dark" ? "" : "text-muted-foreground"}`}>Current
                                    Plan: {dummyPlan.activatedPlan}</h5>
                                <h5 className={`font-medium text-base tracking-[-0.16px] leading-5 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{dummyPlan.duration}</h5>
                                <h5 className={`font-medium text-base tracking-[-0.16px] leading-5 ${theme === "dark" ? "" : "text-muted-foreground"}`}>Review
                                    requests sent</h5>
                                <div
                                    className={`mt-4 max-w-[199px] h-[2px] ${theme === "dark" ? "bg-[#F8FAFC]" : "bg-muted-foreground"}`}/>
                            </div>
                        </div>
                        {
                            (dummyPlan.plans || []).map((x, index) => {
                                return (
                                    <div key={index} className={"w-1/4 p-2 px-[22px]  xl:w-1/4"}>
                                        <div>
                                            <h3 className={"text-2xl font-medium leading-8 mb-4"}>{x.name}</h3>
                                            <h3 className={"text-[32px] font-bold leading-8  mb-8"}>${x.price}<span
                                                className={`text-wrap text-xl ${theme === "dark" ? "" : "text-muted-foreground"}`}>/month</span>
                                            </h3>
                                            {
                                                x.name === dummyPlan.activatedPlan ?
                                                    <Button variant={"outline"} style={{marginBottom: "16px"}}
                                                            className={`mb-4 w-full font-semibold ${theme === "dark" ? "" : "text-muted-foreground"} ${index == 1 ? "bg-violet-600" : ""}`}>Downgrade</Button>
                                                    : <Button variant={"outline hover:none"}
                                                              className={`mb-4 w-full rounded-md h-10 border border-violet-600 text-violet-600 text-[14px] font-semibold font-semibold ${index == 1 ? "bg-violet-600 text-[#F9FAFB] hover:bg-violet-600" : ""}`}>Downgrade</Button>
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <Table className={"border-collapse table-fixed"}>
                        <TableHeader className={""}>
                            <TableRow className={""}>
                                <TableHead
                                    className={`border text-xl py-4 pl-8  ${theme === "dark" ? "text-[#f8fafc]" : "text-[#020817] bg-muted border-[#e2e8f0]"}`}>
                                    Core Features
                                </TableHead>
                                <TableHead
                                    className={`border ${theme === "dark" ? "" : "bg-muted border-[#e2e8f0]"}`}></TableHead>
                                <TableHead
                                    className={`border ${theme === "dark" ? "" : "bg-muted border-[#e2e8f0]"}`}></TableHead>
                                <TableHead
                                    className={`border ${theme === "dark" ? "" : "bg-muted border-[#e2e8f0]"}`}></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                (features || []).map((x, index) => {
                                    return (
                                        <TableRow key={index} className={""}>
                                            <TableCell
                                                className={`border pl-8 w-1/4 ${theme === "dark" ? "" : "text-muted-foreground border-[#e2e8f0]"}`}>{x.name}</TableCell>
                                            <TableCell
                                                className={`border text-center w-1/4 ${theme === "dark" ? "" : "text-muted-foreground border-[#e2e8f0]"}`}>{x.isIcon === 1 ? (x.free == "1" ?
                                                <div className={"flex justify-center"}><Check size={20}/></div> :
                                                <div className={"flex justify-center"}><X size={20}/>
                                                </div>) : x.free}</TableCell>
                                            <TableCell
                                                className={`border text-center w-1/4 ${theme === "dark" ? "" : "text-muted-foreground border-[#e2e8f0]"}`}>{x.isIcon === 1 ? (x.startup == "1" ?
                                                <div className={"flex justify-center"}><Check size={20}/></div> :
                                                <div className={"flex justify-center"}><X size={20}/>
                                                </div>) : x.startup}</TableCell>
                                            <TableCell
                                                className={`border text-center w-1/4 ${theme === "dark" ? "" : "text-muted-foreground border-[#e2e8f0]"}`}>{x.isIcon === 1 ? (x.growth == "1" ?
                                                <div className={"flex justify-center"}><Check size={20}/></div> :
                                                <div className={"flex justify-center"}><X size={20}/>
                                                </div>) : x.growth}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </div>
            </Card>}
        </div>
    );
};

export default PricingPlans;