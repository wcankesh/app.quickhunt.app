import React, {useState, useEffect, Fragment} from 'react';
import {Card, CardContent} from "../ui/card";
import {Button} from "../ui/button";
import {useToast} from "../ui/use-toast";
import {Icon} from "../../utils/Icon";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {Skeleton} from "../ui/skeleton";
import {apiService, baseUrl} from "../../utils/constent";
import {useNavigate} from "react-router-dom";
import {Loader2, User} from "lucide-react";

const initialState= {
    name: '',
    email: '',
    firstName: '',
    lastName: '',
    status: '',
}

const Invitation = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const navigate = useNavigate();
    const {toast} = useToast();

    const [invitationDetail, setInvitationDetail] = useState(initialState)
    const [isLoading, setIsLoading] = useState(true)
    const [forLoading, setForLoading] = useState(null);

    useEffect(() => {
        getInvitationDetail()
    }, [])

    const getInvitationDetail = async () => {
        const data = await apiService.getInvitationDetail(token);
        setIsLoading(false);
        if (data.success) {
            setInvitationDetail({
                domain: '',
                profileImage: data?.data?.inviteBy?.profileImage,
                name: data?.data?.project?.name,
                email: data?.data?.inviteBy?.email,
                firstName: data?.data?.inviteBy?.firstName,
                lastName: data?.data?.inviteBy?.lastName,
                status: data?.data?.status,
            })
        }
    };

    const joinInvite = async (type) =>{
        const payload = {
            status: type,
            token: token,
        }
        setForLoading(type)
        const data = await apiService.acceptReject(payload)
        setForLoading(null)
        if(data.success){
            navigate(`${baseUrl}/dashboard`);
            toast({description: data.message})
        } else {
            toast({variant: "destructive" ,description: data?.error?.message})
        }
    }

    return (
        <div className={"w-full flex flex-col items-center justify-center p-4 md:px-4 md:py-0 h-[100vh]"}>
            <div className={"max-w-[575px] w-full m-auto"}>
                <div className={"flex items-center justify-center"}>{Icon.blackLogo}</div>
                <h1 className="scroll-m-20 text-2xl md:text-3xl font-medium text-center lg:text-3xl mb-3.5 mt-6">
                    You have invite
                </h1>

                <div className={"mt-2.5"}>
                    {isLoading ? (
                        <Card>
                            <CardContent className={"p-3 md:p-6 flex justify-between items-center flex-wrap gap-2"}>
                                <div className={"flex gap-3 items-center"}>
                                    <div>
                                        <Skeleton className="w-[50px] h-[50px] rounded-full" />
                                    </div>
                                    <div>
                                        <Skeleton className="w-56 h-[10px] rounded-full mb-2" />
                                        <Skeleton className="w-56 h-[10px] rounded-full" />
                                    </div>
                                </div>
                                <div className={"flex gap-2"}>
                                    <Skeleton className="w-[70px] h-[30px]" />
                                    <Skeleton className="w-[70px] h-[30px]" />
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className={"p-3 md:p-6 flex justify-between items-center flex-wrap gap-2"}>
                                <div className={"flex gap-3 items-center"}>
                                    <div>
                                        <Avatar className={"w-[50px] h-[50px]"}>
                                            <AvatarImage src={invitationDetail?.profileImage} alt={invitationDetail?.name} />
                                            <AvatarFallback className={"bg-primary/10 border-primary border text-sm text-primary font-medium"}>
                                                {(invitationDetail.firstName && invitationDetail.lastName) ? invitationDetail?.name?.substring(0, 1).toUpperCase() : <User size={18}/>}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    {
                                        (invitationDetail.firstName && invitationDetail.lastName) ?
                                        <div>
                                            <h3 className={"text-sm font-normal"}>{invitationDetail.name}</h3>
                                            <p className={"text-xs pb-1"}>{invitationDetail.domain}</p>
                                            <p className={"text-xs text-muted-foreground"}>
                                                Invited by {invitationDetail.firstName}{" "}
                                                {invitationDetail.lastName || ""}.{" "}
                                                {invitationDetail?.status == 0 ? "Expired in 7 days" : ""}
                                            </p>
                                        </div> : <p>This invitation has been revoked by admin.</p>
                                    }
                                </div>
                                {
                                    (invitationDetail.firstName && invitationDetail.lastName) ?
                                    <div className="flex gap-2">
                                        {
                                            invitationDetail?.status == 0 ?
                                                <Fragment>
                                                    <Button onClick={forLoading === 2 ? null : () => joinInvite(1)} disabled={forLoading === 1}>
                                                        {forLoading === 1 && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Accept
                                                    </Button>

                                                    <Button variant={"destructive"} onClick={forLoading === 1 ? null : () => joinInvite(2)} disabled={forLoading === 2}>
                                                        {forLoading === 2 && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Reject
                                                    </Button>
                                                </Fragment> : invitationDetail.status == 1 ?
                                                    <Button disabled={invitationDetail.status == 1}>Accepted</Button>
                                                    : invitationDetail.status == 2 ? <Button variant={"destructive"} disabled={invitationDetail.status == 2}>Rejected</Button> : ""
                                        }
                                    </div> : ""
                                }
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Invitation;