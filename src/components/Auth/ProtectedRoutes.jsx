import React, {Fragment, useEffect} from 'react';
import {Navigate, Outlet} from "react-router-dom";
import {baseUrl, isLogin, isTokenAboutToExpire, logout, removeProjectDetails} from "../../utils/constent";
import {Toaster} from "../ui/toaster";
import {useSelector} from "react-redux";

const ProtectedRoutes = () => {
    const Token = isTokenAboutToExpire()
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);
   useEffect(() => {
       if(Token){
           removeProjectDetails()
           logout()
       }
   }, [Token])
    useEffect(() => {
        window.quickhuntSettings = {
            name: `${userDetailsReducer.user_first_name} ${userDetailsReducer.user_last_name}`,
            email: userDetailsReducer.user_email_id,
        };

    }, [userDetailsReducer]);
    useEffect(() => {

        window.Quickhunt_In_App_Message_Config = window.Quickhunt_In_App_Message_Config || [];
        window.Quickhunt_In_App_Message_Config.push({
            Quickhunt_In_App_Message_Key: "ZXhOK3JqVXFmZTJCS3gzRnI5MXJtZz09OjoxMjM0NTY3ODkxMDExMTIx"
        })
        window.Quickhunt_In_App_Message_Config.push({ Quickhunt_In_App_Message_Key:  "ckgvb1QrcTljaVdhNkhCOGFaUU1idz09OjoxMjM0NTY3ODkxMDExMTIx"});
        window.QuickhuntScriptLoad()
    }, []);

    return isLogin() && !Token ? <Fragment> <Toaster /><Outlet/></Fragment> : <Navigate to={`${baseUrl}/login`}/>
};

export default ProtectedRoutes;