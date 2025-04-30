import React, {useState,useEffect,} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../ui/card";
import {Label} from "../../ui/label";
import {Input} from "../../ui/input";
import {Button} from "../../ui/button";
import {useDispatch, useSelector} from "react-redux"
import {toast} from "../../ui/use-toast";
import {Loader2} from "lucide-react";
import {allStatusAndTypesAction} from "../../../redux/action/AllStatusAndTypesAction";
import {apiService} from "../../../utils/constent";

const initialState = {
    facebook:"",
    twitter:"",
    linkedin:"",
    youtube:"",
    instagram:"",
    github:""
}

const Social = () => {
    const dispatch = useDispatch();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);

    const [socialLink, setSocialLink] = useState(initialState);
    const [formError,setFormError] = useState(initialState);
    const [isSave,setIsSave]=useState(false);

    useEffect(() => {
        if (allStatusAndTypes.social) {
            setSocialLink(allStatusAndTypes.social);
        }
    },[allStatusAndTypes]);

    const onChange = (e) => {
        const { name, value } = e.target;
        const trimmedValue = value.trim();
        setSocialLink((prevState) => ({
            ...prevState,
            [name]: trimmedValue === "" ? "" : value,
        }));
        const error = formValidate(name, trimmedValue === "" ? "" : value);
        setFormError((prevError) => ({
            ...prevError,
            [name]: error,
        }));
    };

    const urlRegex =/^https:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/
    const formValidate = (name, value) => {
        if (value === "") return "";
        const platformNames = {
            facebook: "facebook",
            twitter: "twitter",
            linkedin: "linkedin",
            youtube: "youtube",
            instagram: "instagram",
            github: "github"
        };
        if (platformNames[name] && !urlRegex.test(value)) {
            return `Enter a valid ${platformNames[name]} account link`;
        }
        return "";
    };

    const onUpdateSocialSetting = async () => {
        if (!socialLink) return;
        let validationErrors = {};
        Object.keys(socialLink).forEach(name => {
            const error = formValidate(name, socialLink[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setIsSave(true)
        const payload = {
            projectId: projectDetailsReducer.id,
            facebook: socialLink.facebook,
            twitter: socialLink.twitter,
            linkedin: socialLink.linkedin,
            youtube: socialLink.youtube,
            instagram: socialLink.instagram,
            github: socialLink.github,
        };
        const data = await apiService.updateSocialSetting(payload);
        if(data.success){
            setIsSave(false)
            toast({description: data.message,});
            delete payload.projectId;
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, social: payload}));
        } else {
            setIsSave(false);
            toast({description:data?.error.message, variant: "destructive"})
        }
    }

    const socialLinksConfig = [
        { id: "facebook", label: "Facebook", placeholder: "https://facebook.com/" },
        { id: "twitter", label: "Twitter ( X )", placeholder: "https://x.com/" },
        { id: "linkedin", label: "Linkedin", placeholder: "https://linkedin.com/" },
        { id: "youtube", label: "YouTube", placeholder: "https://youtube.com/" },
        { id: "instagram", label: "Instagram", placeholder: "https://instagram.com/" },
        { id: "github", label: "GitHub", placeholder: "https://github.com/" },
    ]

    return (
        <Card className={"divide-y"}>
            <CardHeader className={"p-4 sm:px-5 sm:py-4"}>
                <CardTitle className={"text-xl lg:text-2xl font-normal capitalize"}>Social links</CardTitle>
                <CardDescription className={"text-sm text-muted-foreground p-0"}>Add your social media profiles below.</CardDescription>
            </CardHeader>
            <CardContent className={"p-0"}>
                <div className={"p-4 sm:px-5 sm:py-4"}>
                    {
                        socialLinksConfig.map(({ id, label, placeholder }, index) => (
                            <div key={id} className={`grid w-full ${index !== 0 ? "mt-4" : ""} gap-1.5`}>
                                <Label htmlFor={id} className="font-normal">{label}</Label>
                                <Input
                                    value={socialLink?.[id]}
                                    onChange={onChange}
                                    name={id}
                                    placeholder={placeholder}
                                    type="text"
                                    id={id}
                                    className="h-9"
                                />
                                {formError?.[id] && (
                                    <span className="text-destructive text-sm mt-1">{formError[id]}</span>
                                )}
                            </div>
                        ))
                    }
                </div>
            </CardContent>
            <CardFooter className={"p-4 sm:px-5 sm:py-4 justify-end"}>
                <Button
                    className={`w-[111px] text-sm font-medium hover:bg-primary`}
                    onClick={onUpdateSocialSetting}>
                    {isSave ? <Loader2 className="h-4 w-4 animate-spin"/> : "Update Social"}</Button>
            </CardFooter>
        </Card>
    );
};

export default Social;