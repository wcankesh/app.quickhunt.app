import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {loadAuth2, loadGapiInsideDOM} from "gapi-script";
import {baseUrl, googleClientId, token} from "../../utils/constent";
import {Icon} from "../../utils/Icon";
import {Button} from "../ui/button";
import {ApiService} from "../../utils/ApiService";
import {useToast} from "../ui/use-toast";

const WithGoogle = ({title}) => {
    const navigate = useNavigate();
    let apiSerVice = new ApiService();
    const {toast} = useToast();

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
            const auth2 = await loadAuth2(gapi, googleClientId, "profile");
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
            user_first_name: firstName,
            user_last_name: lastName,
            user_email_id: getEmail,
            user_password: userId,
            user_photo: profileImg,
            login_type: "2",
        }
        setIsLoading(true);
        const data = await apiSerVice.login(payload)
        if (data.access_token) {
            toast({description: data.message})
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            if (token) {
                navigate(`${baseUrl}/setup?token=${token}`);
            } else {
                urlParams.delete('token')
                if(data?.onboarding == 0){
                    navigate(`${baseUrl}/on-boarding`);
                    localStorage.setItem("token-verify-onboard", data.access_token);
                } else {
                    localStorage.setItem("token", data.access_token);
                    navigate(`${baseUrl}/dashboard`);
                }
            }
            setIsLoading(false)
        } else {
            setIsLoading(false)
            toast({variant: "destructive", description: data.message})
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
                {Icon.googleIcon}
                {title}
            </span>
        </Button>
    );
};

export default WithGoogle;