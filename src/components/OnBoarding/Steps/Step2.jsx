import React, { Fragment, useState } from 'react';
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { baseUrl } from "../../../utils/constent";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

const create = [
    { name: "Ideas", value: "ideas" },
    { name: "Announcement(changelog)", value: "announcement" },
    { name: "In App Messages", value: "inAppMessages" },
    { name: "Helpdesk", value: "helpdesk" },
    { name: "Other", value: "other" },
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
    { name: "Other", value: "other" },
];

const Step2 = ({setStep}) => {
    let navigate = useNavigate();
    const [selectedCreate, setSelectedCreate] = useState('');
    const [showAdditionalSelect, setShowAdditionalSelect] = useState(false);
    const [selectedKnowAbout, setSelectedKnowAbout] = useState('');
    const [showAdditionalKnowAboutSelect, setShowAdditionalKnowAboutSelect] = useState(false);

    const handleCreateChange = (value) => {
        setSelectedCreate(value);
        setShowAdditionalSelect(value === 'other');
    };

    const handleKnowAboutChange = (value) => {
        setSelectedKnowAbout(value);
        setShowAdditionalKnowAboutSelect(value === 'other');
    };

    const onStep = (stepCount) => {
        setStep(stepCount)
        // navigate(`${baseUrl}/on-boarding`)
    }

    return (
        <Fragment>
            <div className={"flex flex-col justify-center gap-6"}>
                <div>
                    <h2 className={"font-semibold text-2xl text-primary"}>Get to Know You</h2>
                    <p className={"text-sm"}>Tell us a bit about yourself! We’d love to get to know you better.</p>
                </div>
                <div className={`space-y-3`}>
                    <div className={"space-y-2"}>
                        <Label className={"text-sm font-medium mb-2"}>Hey Darshan jiyani, What can we help you create today?</Label>
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
                    {showAdditionalSelect && (
                        <div>
                            <Select>
                                <SelectTrigger className="h-auto">
                                    <SelectValue placeholder="How We can help you?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="help">How We can help you?</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
                <div className={"space-y-3"}>
                    <div className={"space-y-2"}>
                        <Label className={"text-sm font-medium mb-2"}>How did you get to know about Quickhunt?</Label>
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
                    {showAdditionalKnowAboutSelect && (
                        <div>
                            <Select>
                                <SelectTrigger className="h-auto">
                                    <SelectValue placeholder="How We can help you?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="help">How We can help you?</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </div>
            <div className={"flex justify-end"}>
                <Button className={"font-semibold px-[29px] hover:bg-primary"} onClick={() => onStep(3)}>Continue</Button>
            </div>
        </Fragment>
    );
};

export default Step2;
