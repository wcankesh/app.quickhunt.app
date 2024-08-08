import React, {useState,useEffect,} from 'react';
import {Card, CardContent, CardHeader} from "../../ui/card";
import {Separator} from "../../ui/separator";
import {Label} from "../../ui/label";
import {Input} from "../../ui/input";
import {Button} from "../../ui/button";
import {ApiService} from "../../../utils/ApiService";
import {useSelector} from "react-redux"
import {toast} from "../../ui/use-toast";
import {Loader2} from "lucide-react";

const initialState = {
    facebook:"",
    twitter:"",
    linkedin:"",
    youtube:"",
    instagram:"",
    github:""
}

const Social = () => {
    const [socialLink, setSocialLink] = useState(initialState);
    const [isSave,setIsSave]=useState(false);
    let apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);
    const onChange =(e)=>{
        setSocialLink({...socialLink,[e.target.name]:e.target.value});
    };

    useEffect(() => {
        getSocialSetting()
    },[projectDetailsReducer.id])

    const getSocialSetting = async () => {
        const data = await apiService.getSocialSetting(projectDetailsReducer.id)
        if(data.status === 200){
            setSocialLink({...data.data})
        } else {

        }
    }

    const onUpdateSocialSetting = async () => {
        setIsSave(true)
        const payload = {
            project_id: projectDetailsReducer.id,
            facebook: socialLink.facebook,
            twitter: socialLink.twitter,
            linkedin: socialLink.linkedin,
            youtube: socialLink.youtube,
            instagram: socialLink.instagram,
            github: socialLink.github,
        };
        const data = await apiService.updateSocialSetting(payload);
        if(data.status === 200){
            setIsSave(false)
            toast({
                description:"Social links updated successfully",
            })
        } else {
            setIsSave(false);
            toast({
                description:data.message,
                variant: "destructive"
            })
        }
    }

    return (
        <Card>
            <CardHeader className={"p-4 sm:p-6"}>
                <h2 className={`text-lg sm:text-2xl font-medium leading-8`}>Social links</h2>
            </CardHeader>
            <Separator/>
            <CardContent className={"p-0"}>
                <div className={"p-4 sm:p-6"}>
                    <div className="grid w-full">
                        <Label htmlFor="facebook" className={"mb-[6px]"}>Facebook</Label>
                        <Input value={socialLink.facebook} onChange={onChange} name="facebook" placeholder={"https://facebook.com/"} type="text" id="facebook" className={"h-9"}/>
                    </div>

                    <div className="w-full mt-4">
                        <Label htmlFor="twitter" className={"mb-[6px]"}>Twitter ( X )</Label>
                        <Input value={socialLink.twitter} onChange={onChange} name="twitter" placeholder={"https://x.com/"} type="text" id="twitter" className={"h-9"}/>
                    </div>

                    <div className="grid w-full mt-4">
                        <Label htmlFor="linkedin" className={"mb-[6px]"}>Linkedin</Label>
                        <Input value={socialLink.linkedin} onChange={onChange} name="linkedin" placeholder={"https://linkedin.com/"} type="text" id="linkedin" className={"h-9"}/>
                    </div>

                    <div className="grid w-full mt-4">
                        <Label htmlFor="youtube" className={"mb-[6px]"}>YouTube</Label>
                        <Input value={socialLink.youtube} onChange={onChange} name="youtube" placeholder={"https://youtube.com/"} type="text" id="youtube" className={"h-9"}/>
                    </div>

                    <div className="grid w-full mt-4">
                        <Label htmlFor="instagram" className={"mb-[6px]"}>Instagram</Label>
                        <Input value={socialLink.instagram} onChange={onChange} name="instagram" placeholder={"https://instagram.com/"} type="text" id="instagram" className={"h-9"}/>
                    </div>

                    <div className="grid w-full mt-4">
                        <Label htmlFor="github" className={"mb-[6px]"}>GitHub</Label>
                        <Input value={socialLink.github} onChange={onChange} name="github" placeholder={"https://github.com/"} type="text" id="github" className={"h-9"}/>
                    </div>
                </div>

                <Separator className={""}/>

                <div className={"px-6 pt-4 pb-6 flex flex-row justify-end"}>
                    <Button
                        className={`${isSave === true ? "py-2 px-6" : "py-2 px-6 w-[142px]"} text-sm font-semibold`}
                        onClick={onUpdateSocialSetting}>
                        {isSave ? <Loader2 className="mr-1 h-4 w-4 animate-spin justify-center"/> : "Update Social"}</Button>
                </div>



            </CardContent>
        </Card>
    );
};

export default Social;