import React, {Fragment, useEffect, useState} from 'react';
import {isLogin, baseUrl, getTokenVerify, token, apiService, isTokenAboutToExpire} from "../../utils/constent";
import {Navigate, Outlet} from "react-router-dom";
import {Toaster} from "../ui/toaster";
import {userDetailsAction} from "../../redux/action/UserDetailAction";
import {useDispatch} from "react-redux";

const PublicRoutes = () => {
    const [isLoading,setIsLoading] = useState(true)
    const dispatch = useDispatch();
    useEffect(() => {
        const token = localStorage.getItem('token-verify-onboard') || null
        const loginUserDetails = async () =>{
            const data = await apiService.getLoginUserDetails({Authorization: `Bearer ${token}`})
            if(data.status === 200){
                dispatch(userDetailsAction({...data.data}))
                setIsLoading(false)
            } else {
                setIsLoading(false)
            }
        }

        if(token){
            loginUserDetails()
        }

    }, [])


    return isLogin() ? <Navigate to={`${baseUrl}/dashboard`}/>:<Fragment><Toaster/> <Outlet/></Fragment> ;
};

export default PublicRoutes;