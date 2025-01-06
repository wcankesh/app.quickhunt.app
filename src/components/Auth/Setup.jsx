import React, {useState, useEffect} from 'react';
import {Card, CardContent} from "../ui/card";
import {Button} from "../ui/button";
import {useToast} from "../ui/use-toast";
import {ApiService} from "../../utils/ApiService";
import {Icon} from "../../utils/Icon";
import {Avatar, AvatarFallback} from "../ui/avatar";
import {Skeleton} from "../ui/skeleton";
import {baseUrl} from "../../utils/constent";
import {useNavigate} from "react-router-dom";

const initialState= {
    domain: '',
    id: '',
    project_name: '',
    user_email_id: '',
    user_first_name: '',
    user_last_name: '',
    status: '',
}

const Setup = () => {
    let apiSerVice = new ApiService();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    let navigate = useNavigate();
    const {toast} = useToast();

    const [invitationDetail, setInvitationDetail] = useState(initialState)
    const [isLoading, setIsLoading] = useState(true)
    const [isTokenDeleted, setIsTokenDeleted] = useState(false);

    useEffect(() => {
        debugger
        getInvitationDetail()
    }, [])

    const getInvitationDetail = async () => {
        debugger
        const data = await apiSerVice.getInvitationDetail(token);
        if (data.status === 200) {
            if (data.data && Object.keys(data.data).length > 0) {
                setInvitationDetail({...data.data[0]});
                setIsLoading(false);
            } else {
                setIsTokenDeleted(true);
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    };

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
                <div className={"flex items-center justify-center"}>{Icon.blackLogo}</div>
                <h1 className="scroll-m-20 text-2xl md:text-3xl font-medium text-center lg:text-3xl mb-3.5 mt-6">
                    {isTokenDeleted ? "Token is deleted" : "You have 1 invite"}
                </h1>
                {isTokenDeleted ? (
                    <p className="text-sm text-center text-muted-foreground">
                        The token is invalid or has been deleted.
                    </p>
                ) : (
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
                                                <AvatarFallback
                                                    className={"bg-primary/10 border-primary border text-sm text-primary font-medium"}>
                                                    {invitationDetail?.project_name?.substring(0, 1).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div>
                                            <h3 className={"text-sm font-normal mb-1"}>
                                                {invitationDetail.project_name}
                                            </h3>
                                            <p className={"text-xs pb-1"}>{invitationDetail.domain}</p>
                                            <p className={"text-xs text-muted-foreground"}>
                                                Invited by {invitationDetail.user_first_name}{" "}
                                                {invitationDetail.user_last_name || ""}.{" "}
                                                {invitationDetail?.status === 1 ? "Expired in 7 days" : ""}
                                            </p>
                                        </div>
                                    </div>
                                    {invitationDetail?.status === 1 ? (
                                        <div className={"flex gap-2"}>
                                            <Button onClick={() => joinInvite(2)}>Accept</Button>
                                            <Button variant={"outline"} onClick={() => joinInvite(3)}>Reject</Button>
                                        </div>
                                    ) : (
                                        <div className={"flex gap-2"}>
                                            <Button disabled>
                                                {invitationDetail?.status === 2 ? "Accepted" : "Rejected"}
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Setup;