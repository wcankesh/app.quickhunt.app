import React, {Fragment, useEffect} from 'react';
import {Navigate, Outlet} from "react-router-dom";
import {baseUrl, isLogin, isTokenAboutToExpire, logout, removeProjectDetails} from "../../utils/constent";
import {Toaster} from "../ui/toaster";


const ProtectedRoutes = () => {
    const Token = isTokenAboutToExpire()
    console.log("Token", Token)
   useEffect(() => {
       if(Token){
           removeProjectDetails()
           logout()
       }
   }, [Token])
    return isLogin() && !Token ? <Fragment><Toaster /><Outlet/></Fragment> : <Navigate to={`${baseUrl}/login`}/>
};

export default ProtectedRoutes;