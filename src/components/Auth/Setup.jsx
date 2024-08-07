import React, {useState, useEffect} from 'react';
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Card, CardContent} from "../ui/card";
import {Button} from "../ui/button";
import {Eye, EyeOff, Loader2} from "lucide-react";
import {useToast} from "../ui/use-toast";
import {ApiService} from "../../utils/ApiService";
import {Icon} from "../../utils/Icon";
import {Avatar, AvatarFallback} from "../ui/avatar";
import {baseUrl} from "../../utils/constent";
import {useNavigate} from "react-router-dom";


const initialState= {
    domain: '',
    id: '',
    project_name: '',
    user_email_id: '',
    user_first_name: '',
    user_last_name: '',
}

const Setup = () => {
    let apiSerVice = new ApiService();
    const [invitationDetail, setInvitationDetail] = useState(initialState)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    let navigate = useNavigate();
    const {toast} = useToast();


    useEffect(() => {
        getInvitationDetail()
    }, [])
    const getInvitationDetail = async () => {
        const data = await apiSerVice.getInvitationDetail(token)
        if(data.status === 200){
            setInvitationDetail({...data.data[0]})
        } else {

        }
    }

    const joinInvite = async (type) =>{
        const payload = {
            status: type,
            token: token,
        }
        const data = await apiSerVice.join(payload)
        if(data.status === 200){
            urlParams.delete('token')
            navigate(`${baseUrl}/dashboard`);
            toast({description: data.message})
        } else {
            toast({variant: "destructive" ,description: data.message})
        }
    }

    return (
        <div className={"w-full flex flex-col items-center justify-center p-4 md:px-4 md:py-0 h-[100vh]"}>
            <div className={"max-w-[575px] w-full m-auto"}>
                <div className={"flex items-center justify-center"}>
                    {Icon.blackLogo}
                </div>
                <h1 className="scroll-m-20 text-2xl md:text-3xl font-semibold text-center lg:text-3xl mb-3.5 mt-6">
                    You have 1 invite
                </h1>
                <div className={"mb-2.5"}>
                    <p className="text-sm text-center text-muted-foreground">
                        People have been waiting for you, you must be popular
                    </p>
                </div>
                <div className={"mt-2.5"}>
                    <Card>
                        <CardContent className={"p-3 md:p-6 flex justify-between items-center"}>
                            <div className={"flex gap-3 items-center"}>
                                <div>
                                    <Avatar className={"w-[50px] h-[50px]"}>
                                        <AvatarFallback className={"bg-primary/10 border-primary border text-sm text-primary font-semibold"}>{invitationDetail && invitationDetail.project_name && invitationDetail.project_name.substring(0,1).toUpperCase() }</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div>
                                    <h3 className={"text-sm font-medium mb-1"}>{invitationDetail.project_name}</h3>
                                    <p className={"text-xs font-normal pb-1"}>{invitationDetail.domain}</p>
                                    <p className={"text-xs font-normal text-muted-foreground"}>Invited by {invitationDetail.user_first_name} {invitationDetail.user_last_name ? invitationDetail.user_last_name : ''}. Expired in 7days </p>
                                </div>
                            </div>
                            <div className={"flex gap-2"}>
                                <Button size={"sm"} onClick={() =>joinInvite(2)}>Accept</Button>
                                <Button size={"sm"} variant={"outline"} onClick={() =>joinInvite(3)}>Reject</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default Setup;