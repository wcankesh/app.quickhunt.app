import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {loadAuth2, loadGapiInsideDOM} from "gapi-script";
import {apiService, baseUrl, GOOGLE_CLIENT_ID, token} from "../../utils/constent";
import {Icon} from "../../utils/Icon";
import {Button} from "../ui/button";
import {useToast} from "../ui/use-toast";
import {userDetailsAction} from "../../redux/action/UserDetailAction";
import {useDispatch} from "react-redux";
import {Loader2} from "lucide-react";

const WithGoogle = ({title}) => {
    const navigate = useNavigate();
    const {toast} = useToast();
    const dispatch = useDispatch();
    const [gapi, setGapi] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!token()) {
            const loadGapi = async () => {
                const newGapi = await loadGapiInsideDOM();
                setGapi(newGapi);
            }
            loadGapi();
        }
    }, [token()]);

    const handleGoogleLogin = async () => {
        try {
            const auth2 = await loadAuth2(gapi, GOOGLE_CLIENT_ID, "profile");
            const googleUser = await auth2.signIn();
            updateUser(googleUser);
        } catch (error) {
            console.error('Google sign-in error:', error);
        }
    };

    const updateUser = async (currentUser) => {
        const getEmail = currentUser.getBasicProfile().getEmail();
        let firstName = currentUser.getBasicProfile().getGivenName() ;
        let lastName = currentUser.getBasicProfile().getFamilyName() ;
        let userId = currentUser.getBasicProfile().getId() ;
        const profileImg = currentUser.getBasicProfile().getImageUrl();

        const payload = {
            firstName: firstName,
            lastName: lastName,
            email: getEmail,
            password: userId,
            profileImage: profileImg,
            loginType: "2",
        }
        setIsLoading(true);
        const data = await apiService.login(payload)
        if (data.success) {
            toast({description: data.message})
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            if (token) {
                navigate(`${baseUrl}/invitation?token=${token}`);
            } else {
                urlParams.delete('token')
                if(data?.onboarding == 0){
                    const datas = await apiService.getLoginUserDetails({Authorization: `Bearer ${data.data?.token}`})
                    if(datas.success){
                        dispatch(userDetailsAction({...datas.data}))
                        setIsLoading(false)
                    } else {
                        setIsLoading(false)
                    }
                    navigate(`${baseUrl}/on-boarding`);
                    localStorage.setItem("token-verify-onboard", data.data?.token);
                } else {
                    localStorage.setItem("token", data.data?.token);
                    navigate(`${baseUrl}/dashboard`);
                }
            }
            setIsLoading(false)
        } else {
            setIsLoading(false)
            toast({variant: "destructive", description: data?.error?.message})
            signOut()
        }
    };

    const signOut = () => {
        const auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(() => {
            console.log('User signed out.');
        });
    }

    return (
        <Button onClick={handleGoogleLogin} variant="outline hover:none" className="w-full border border-primary font-medium">
            <span className={"flex gap-x-1 text-primary"}>
                {isLoading ? <Loader2 className={"mr-2 h-4 w-4 animate-spin"}/> : Icon.googleIcon}
                {title}
            </span>
        </Button>
    );
};

export default WithGoogle;