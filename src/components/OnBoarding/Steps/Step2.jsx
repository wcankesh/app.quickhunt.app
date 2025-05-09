import React, {Fragment, useEffect, useState} from 'react';
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import {apiService, baseUrl, getLSUserDetails} from "../../../utils/constent";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import {Input} from "../../ui/input";
import {useSelector} from "react-redux";
import {Loader2} from "lucide-react";

const initialState = {
    wantTo: '',
    knowFrom: '',
}

const create = [
    { name: "Ideas", value: "ideas" },
    { name: "Announcement(changelog)", value: "announcement" },
    { name: "In App Messages", value: "inAppMessages" },
    { name: "Helpdesk", value: "helpdesk" },
    // { name: "Other", value: "wantOthers" },
];

const knowAbout = [
    { name: "Blog article", value: "blogArticle" },
    { name: "Search engine", value: "searchEngine" },
    { name: "Facebook post", value: "facebookPost" },
    { name: "Recommendation from a friend or colleague", value: "recommendation" },
    { name: "YouTube video", value: "youTubeVideo" },
    { name: "Reddit discussion", value: "redditDiscussion" },
    { name: "LinkedIn post", value: "linkedInPost" },
    { name: "Twitter mention", value: "TwitterMention" },
    { name: "Product Hunt feature", value: "productHuntFeature" },
    { name: "Email newsletter", value: "emailNewsletter" },
    // { name: "Other", value: "other" },
];

const Step2 = ({setStep}) => {

    const [userDetail, setUserDetail] = useState(initialState);
    const [selectedCreate, setSelectedCreate] = useState('');
    const [selectedKnowAbout, setSelectedKnowAbout] = useState('');
    const [showAdditionalSelect, setShowAdditionalSelect] = useState(false);
    const [showAdditionalKnowAboutSelect, setShowAdditionalKnowAboutSelect] = useState(false);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);
    const [isLoading, setIsLoading] = useState(false);

    const onNextStep = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token-verify-onboard') || null
        const payload = {
            wantTo: selectedCreate,
            knowFrom: selectedKnowAbout,
        }
        const data = await apiService.onBoardingFlow(payload, {Authorization: `Bearer ${token}`});
            setIsLoading(false);
        if(data.success) {
            setUserDetail(data.data)
            setStep(3);
        }
    }

    const handleChange = (event) => {
        setUserDetail({...userDetail, [event.target.name]: event.target.value});
        // setFormError(formError => ({
        //     ...formError,
        //     [event.target.name]: ""
        // }));
    }

    const handleCreateChange = (value) => {
        const selectedItem = create.find(item => item.value === value);
        setSelectedCreate(selectedItem.name);
        // setShowAdditionalSelect(value === 'wantOthers');
    };

    const handleKnowAboutChange = (value) => {
        const selectedItem = knowAbout.find(item => item.value === value);
        setSelectedKnowAbout(selectedItem.name);
        // setShowAdditionalKnowAboutSelect(value === 'other');
    };

    const onStep = (stepCount) => {
        setStep(stepCount)
    }
    useEffect(() => {
        setUserDetail(userDetailsReducer)
    },[userDetailsReducer])

    return (
        <Fragment>
            <div className={"flex flex-col justify-center gap-6"}>
                <div>
                    <h2 className={"font-semibold text-2xl text-primary"}>Get to Know You</h2>
                    <p className={"text-sm"}>Tell us a bit about yourself! We’d love to get to know you better.</p>
                </div>
                <div className={`space-y-3`}>
                    <div className={"space-y-2"}>
                        <Label className={"text-sm font-normal mb-2"}>Hey <span className={"font-semibold capitalize"}>{userDetail?.firstName} {userDetail?.lastName}</span>, What can we help you create today?</Label>
                        <Select onValueChange={handleCreateChange}>
                            <SelectTrigger className="h-auto placeholder:text-muted">
                                <SelectValue placeholder="Ex. Announcement(changelog)"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {create.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    {/*{showAdditionalSelect && (*/}
                    {/*    <div>*/}
                    {/*        <Input placeholder={"Write here..."} value={userDetail.wantOthers} onChange={handleChange} name={"wantOthers"} />*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>
                <div className={"space-y-3"}>
                    <div className={"space-y-2"}>
                        <Label className={"text-sm font-normal mb-2"}>How did you get to know about Quickhunt?</Label>
                        <Select onValueChange={handleKnowAboutChange}>
                            <SelectTrigger className="h-auto">
                                <SelectValue placeholder="Ex. Blog article" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {knowAbout.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    {/*{showAdditionalKnowAboutSelect && (*/}
                    {/*    <div>*/}
                    {/*        <Input placeholder={"Write here..."} value={userDetail.other} onChange={handleChange} name={"other"} />*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>
            </div>
            <div className={"flex gap-2 justify-end"}>
                <Button variant={"outline hover:bg-none"} className={"border border-primary text-primary font-semibold px-[29px]"} onClick={() => onStep(1)}>Back</Button>
                <Button className={"font-semibold px-[29px] hover:bg-primary w-[116px]"} onClick={() => onNextStep(3)}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Continue"}</Button>
            </div>
        </Fragment>
    );
};

export default Step2;
