import React, {Fragment, useEffect, useState} from 'react';
import {Navigate, Outlet} from "react-router-dom";
import {
    apiService,
    baseUrl,

    isTokenAboutToExpire,
    logout,
    removeProjectDetails,
    getTokenVerify,
    token
} from "../../utils/constent";
import {Toaster} from "../ui/toaster";
import {useDispatch, useSelector} from "react-redux";
import {userDetailsAction} from "../../redux/action/UserDetailAction";

const ProtectedRoutes = () => {
    const [isLoading,setIsLoading] = useState(true)
    const Token = isTokenAboutToExpire()
    const dispatch = useDispatch();
    const loginUserDetails = async () =>{
        const data = await apiService.getLoginUserDetails()
        if(data.status === 200){
            window.quickhuntSettings = {
                name: `${data.data.user_first_name} ${data.data.user_last_name}`,
                email: data.data.user_email_id,
            };
            dispatch(userDetailsAction({...data.data}))
            window.Quickhunt_In_App_Message_Config = window.Quickhunt_In_App_Message_Config || [];
            window.Quickhunt_In_App_Message_Config = [{
                Quickhunt_In_App_Message_Key: "ZXhOK3JqVXFmZTJCS3gzRnI5MXJtZz09OjoxMjM0NTY3ODkxMDExMTIx"
            },{ Quickhunt_In_App_Message_Key:  "ckgvb1QrcTljaVdhNkhCOGFaUU1idz09OjoxMjM0NTY3ODkxMDExMTIx"},

]
            window.QuickhuntScriptLoad()
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    }
   useEffect(() => {
       if(Token){
           document.querySelectorAll(".quickhunt").forEach((x) => {
               x.innerHTML = ""
           })
           removeProjectDetails()
           logout()
       }

   }, [Token])
useEffect(() => {
    loginUserDetails()
}, [])

    return (token() && !Token) || getTokenVerify() ? <Fragment> <Toaster/><Outlet/></Fragment> : <Navigate to={`${baseUrl}/login`}/>
    // return (token() && !Token) ? <Fragment> <Toaster/><Outlet/></Fragment> : getTokenVerify() ?<Navigate to={`${baseUrl}/on-boarding`}/>:  <Navigate to={`${baseUrl}/login`}/>
};

export default ProtectedRoutes;